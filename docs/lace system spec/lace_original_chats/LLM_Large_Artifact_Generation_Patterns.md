# Patterns for LLM-Generated Artifacts That Exceed Output Token Limits

## Applied to OWL Ontology Construction Pipelines Grounded in BFO/CCO

---

## The Core Problem

Your target artifact — a human-quality OWL ontology like the ITD example — is approximately **15,000 lines / 1 MB of RDF-XML**, containing **443 classes, 158 object properties, 239 named individuals, 49 datatype properties, 90 annotation properties**, and SWRL rules. Even the most capable models (Claude with ~32K output tokens, GPT-4o with ~16K, Gemini with ~8K) can produce roughly 2,000–4,000 lines of XML in a single generation. You're asking the model to produce an artifact that is **4–8× larger than its maximum output capacity**, and that must be syntactically valid XML, semantically coherent OWL, and logically consistent with BFO/CCO upper ontologies.

This is not merely a token limit problem — it's a **compositional generation problem** where the parts must be structurally and semantically consistent with each other and with external constraints.

---

## Pattern 1: Decompose → Generate → Assemble (The Dominant Pattern)

**Also called:** Modular Generation, Divide-and-Conquer, Component-wise Generation

This is the most widely used and most reliable approach. Rather than asking the LLM to produce the final OWL file, you decompose the ontology into independently generable units, produce each via a separate LLM call, and then assemble them programmatically.

### How It Works for Ontology Generation

**Step 1 — Schema Planning (LLM call):** Generate a high-level ontology design document: the module decomposition, class hierarchy skeleton, property inventory, and namespace declarations. This is a natural-language + structured-data artifact that fits within a single output window.

**Step 2 — Parallel Component Generation (multiple LLM calls):** Generate each module independently:
- Annotation property declarations
- Class hierarchy (can be further split by BFO top-level category: Continuants vs. Occurrents)
- Object property declarations with domain/range
- Datatype property declarations
- Named individuals
- SWRL rules
- Class restriction axioms (existential, universal, cardinality)

**Step 3 — Deterministic Assembly (code, no LLM):** A programmatic assembler (Python with `rdflib` or `owlready2`) merges all fragments into a single valid OWL file, handles namespace declarations, deduplication, and structural validation.

### Why This Works

OWL ontologies are inherently modular — they're essentially a set of axioms with cross-references. Unlike prose or narrative code, **axiom order is irrelevant**. You can generate `owl:Class` declarations independently of `owl:ObjectProperty` declarations as long as they share a consistent namespace and IRI scheme. The assembly step is purely mechanical.

### Key Design Decisions

| Decision | Recommendation |
|----------|---------------|
| **Intermediate format** | Use JSON-LD or Turtle fragments (more compact than RDF-XML, fewer tokens wasted on verbosity) and convert to RDF-XML in assembly |
| **Granularity** | One LLM call per ontology module or per BFO category branch — not one call per class (too many API calls, loses relational context) |
| **Shared context** | Every component-generation prompt must include the schema plan and namespace map as input context |
| **IRI consistency** | Define the IRI minting scheme in the schema plan and enforce it deterministically, don't let the LLM invent IRIs ad hoc |

### Concrete Pipeline Architecture

```
┌─────────────────────────────────────────────────────────┐
│  SOURCE DOCUMENTS                                        │
└────────────┬────────────────────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────────────────────┐
│  STAGE 1: Entity & Concept Extraction (LLM)             │
│  Input: Document chunks                                  │
│  Output: JSON list of domain terms + definitions         │
└────────────┬────────────────────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────────────────────┐
│  STAGE 2: Ontology Schema Planning (LLM)                │
│  Input: Extracted terms + BFO/CCO reference              │
│  Output: Module plan, class hierarchy skeleton,          │
│          property inventory, namespace map                │
└────────────┬────────────────────────────────────────────┘
             │
       ┌─────┼─────┬──────────┬──────────┐
       ▼     ▼     ▼          ▼          ▼
   ┌──────┐┌────┐┌──────┐┌────────┐┌────────┐
   │Class ││Obj ││Data  ││Individ ││Axioms &│
   │Hier. ││Prop││Prop  ││uals    ││Rules   │
   │(LLM) ││(LLM)│(LLM) ││(LLM)   ││(LLM)  │
   └──┬───┘└─┬──┘└──┬───┘└───┬────┘└───┬────┘
      │      │      │        │         │
      └──────┴──────┴────┬───┴─────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│  STAGE 4: Deterministic Assembly (Code)                  │
│  rdflib / owlready2 merge, dedup, namespace resolution   │
└────────────┬────────────────────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────────────────────┐
│  STAGE 5: Validation & Repair (Code + LLM)              │
│  OWL reasoner check → error isolation → LLM repair       │
└────────────┬────────────────────────────────────────────┘
             │
             ▼
        [Final .owl file]
```

---

## Pattern 2: Incremental / Iterative Accumulation

**Also called:** Ontogenia pattern (from the Lippolis et al. 2025 ESWC paper), Snowball Generation, Stateful Continuation

Rather than generating components in parallel and merging, you build the ontology incrementally: each LLM call receives the ontology-so-far (or a compressed representation of it) and adds the next batch of elements.

### How It Works

1. **Seed call:** Generate the ontology header, imports, annotation property declarations, and the top-level class hierarchy (BFO alignment).
2. **Iteration N:** Feed back a summary or skeleton of what has been generated so far, plus the next batch of source material, and ask the LLM to generate the next module of classes/properties/individuals.
3. **Continue** until all source material is processed.

### The "Ontogenia" Variant (State-of-the-Art for Ontology Specifically)

From recent research (Lippolis et al., ESWC 2025), the **Ontogenia** prompting technique processes competency questions (CQs) one at a time, feeding the cumulative ontology back into the prompt at each step. This was shown to produce more cohesive ontologies than generating all at once, because the model can see what already exists and avoid duplication or contradiction.

### Advantages
- Natural coherence: each new addition "sees" prior work
- Good for ontologies driven by a sequential document or list of requirements
- Handles cross-references well because the model has prior context

### Disadvantages
- **Serial bottleneck:** Can't parallelize
- **Context window pressure:** As the ontology grows, the accumulated state consumes input tokens, leaving less room for new source material and output
- **Degradation over many iterations:** LLMs lose attention fidelity at the edges of long contexts

### Mitigation: Compressed State Representation

Instead of feeding back raw OWL/Turtle, maintain a **compressed ontology summary** as input context:

```json
{
  "classes": ["ITD:TargetSystemAnalysis", "ITD:IntelligenceProduct", ...],
  "properties": ["ITD:evaluates", "ITD:authored", ...],
  "key_axioms": ["TargetSystemAnalysis subClassOf obo:BFO_0000015", ...]
}
```

This uses ~10% of the tokens that raw OWL would consume, while giving the LLM enough context to avoid naming collisions and maintain BFO alignment.

---

## Pattern 3: Skeleton → Fill (Two-Phase Generation)

**Also called:** Template Expansion, Scaffold-and-Detail, Outline-then-Elaborate

### How It Works

**Phase 1 — Generate Skeleton (single LLM call):**
Produce a complete but minimal ontology: every class, property, and individual is declared, but with only `rdfs:label` and `rdfs:subClassOf` / `rdfs:subPropertyOf` — no definitions, no restrictions, no SWRL rules.

For the ITD ontology, this skeleton might be ~3,000 lines — within a single output window.

**Phase 2 — Enrich each element (multiple LLM calls):**
For each class (or batch of related classes), generate the full annotation set (`obo:IAO_0000115` definitions, `skos:altLabel`, etc.) and all restriction axioms (`owl:equivalentClass`, `owl:Restriction`, etc.).

### Why This Works for Ontologies

The skeleton establishes the structural backbone — the taxonomy and property graph — which is the hardest part to get right because it requires global coherence. Once the skeleton is locked in, enrichment is embarrassingly parallel: adding a definition to `ITD:TargetSystemAnalysis` doesn't affect the definition of `ITD:IntelligenceProduct`.

### Implementation

```python
# Phase 1: Skeleton generation
skeleton = llm_call(
    system="Generate a complete OWL ontology skeleton in Turtle format...",
    user=f"Domain terms: {extracted_terms}\nBFO alignment: {bfo_mapping}"
)

# Phase 2: Batch enrichment
for class_batch in chunk(skeleton.classes, batch_size=20):
    enrichment = llm_call(
        system="Add full annotations and restriction axioms...",
        user=f"Skeleton context: {skeleton_summary}\nClasses to enrich: {class_batch}"
    )
    merge_into(ontology, enrichment)
```

---

## Pattern 4: Intermediate Representation → Deterministic Compilation

**Also called:** DSL-First, Structured Intermediate, JSON-to-OWL Compilation

This is arguably the **most robust pattern for production systems** and is what many enterprise ontology pipelines use.

### Core Insight

**Don't ask the LLM to generate OWL at all.** Instead, have it generate a much more compact intermediate representation (IR), and then deterministically compile that IR into valid OWL.

### Why This Is Superior

1. **Token efficiency:** A class declaration in RDF-XML is ~15-20 lines. The same information in a compact JSON IR is 3-5 lines. You get **4-5× more ontology content per output token.**
2. **Guaranteed syntactic validity:** The compiler produces valid OWL by construction. The LLM never has to worry about XML namespace prefixes, closing tags, or RDF serialization quirks.
3. **Separation of concerns:** The LLM focuses on *what the ontology should contain* (semantic decisions), not *how to serialize it* (syntactic decisions).
4. **Testability:** You can validate the IR with a JSON schema before compilation, catching errors early.

### Example IR Schema

```json
{
  "classes": [
    {
      "iri": "ITD:TargetSystemAnalysis",
      "label": "Target System Analysis",
      "definition": "A process of analyzing a target system...",
      "parent": "obo:BFO_0000015",
      "bfo_category": "process",
      "restrictions": [
        {
          "property": "obo:RO_0000057",
          "type": "some",
          "filler": "ITD:IntelligenceAnalyst"
        }
      ],
      "annotations": {
        "obo:IAO_0000119": "JP 3-60",
        "skos:altLabel": ["TSA", "target analysis"]
      }
    }
  ],
  "object_properties": [
    {
      "iri": "ITD:evaluates",
      "label": "evaluates",
      "domain": "ITD:AssessmentProcess",
      "range": "ITD:IntelligenceProduct",
      "parent": "obo:RO_0000056",
      "characteristics": ["functional"]
    }
  ],
  "individuals": [...],
  "swrl_rules": [...]
}
```

### The Compiler

```python
from rdflib import Graph, Namespace, URIRef, Literal, BNode
from rdflib.namespace import RDF, RDFS, OWL, XSD

def compile_ontology(ir: dict) -> Graph:
    g = Graph()
    # Bind namespaces from IR
    for prefix, uri in ir["namespaces"].items():
        g.bind(prefix, Namespace(uri))
    
    # Compile classes
    for cls in ir["classes"]:
        cls_uri = resolve_iri(cls["iri"])
        g.add((cls_uri, RDF.type, OWL.Class))
        g.add((cls_uri, RDFS.label, Literal(cls["label"], lang="en")))
        g.add((cls_uri, RDFS.subClassOf, resolve_iri(cls["parent"])))
        
        if "definition" in cls:
            g.add((cls_uri, IAO["0000115"], Literal(cls["definition"], lang="en")))
        
        for restriction in cls.get("restrictions", []):
            bnode = BNode()
            g.add((cls_uri, RDFS.subClassOf, bnode))
            g.add((bnode, RDF.type, OWL.Restriction))
            g.add((bnode, OWL.onProperty, resolve_iri(restriction["property"])))
            # ... handle someValuesFrom, allValuesFrom, cardinality, etc.
    
    # Compile properties, individuals, rules...
    return g
```

### This Pattern Combines Naturally with Pattern 1

Each LLM call generates a fragment of the IR (not OWL), and the deterministic compiler produces the final file. The IR fragments are easy to validate, merge, and deduplicate before compilation.

---

## Pattern 5: Self-Continuing State Machine

**Also called:** Finish-Reason Loop, Auto-Continue, Truncation Recovery

This is the simplest pattern and works for cases where the LLM is generating a long sequential artifact that just happens to exceed the output window.

### How It Works

```python
full_output = ""
while True:
    response = llm_call(
        system="Generate the ontology in Turtle format...",
        messages=[
            {"role": "assistant", "content": full_output[-context_budget:]},
            {"role": "user", "content": "Continue from where you left off."}
        ]
    )
    full_output += response.content
    if response.finish_reason == "stop":
        break
```

### When to Use It
- Quick prototyping
- Small ontologies that are only 1.5–2× the output limit
- When you don't need high reliability

### When NOT to Use It
- **Your case.** At 15K lines / 4-8× the output limit, this pattern degrades severely. The model loses track of namespace prefixes, introduces duplicate declarations, and the XML/RDF structure becomes inconsistent across continuation boundaries.

---

## Pattern 6: Map-Reduce over Source Documents

**Also called:** Chunk-Extract-Merge, Parallel Extraction with Consolidation

When your source corpus is large (multiple documents, hundreds of pages), you need to handle both input AND output token limits.

### How It Works

```
[Doc 1 Chunk A] ──→ LLM ──→ [Partial ontology fragment A]  ─┐
[Doc 1 Chunk B] ──→ LLM ──→ [Partial ontology fragment B]   │
[Doc 2 Chunk A] ──→ LLM ──→ [Partial ontology fragment C]   ├──→ MERGE & DEDUPLICATE
[Doc 2 Chunk B] ──→ LLM ──→ [Partial ontology fragment D]   │
[Doc 3 Chunk A] ──→ LLM ──→ [Partial ontology fragment E]  ─┘
                                                              │
                                                              ▼
                                                    [Consolidated IR]
                                                              │
                                                              ▼
                                               LLM: Resolve conflicts,
                                               harmonize taxonomy,
                                               align with BFO/CCO
                                                              │
                                                              ▼
                                                    [Final IR → Compiler]
```

### The Critical Merge/Reduce Step

The naive merge produces duplicates, near-duplicates, and contradictions. The reduce step is where you need either:

- **Embedding-based deduplication:** Compute embeddings for each extracted term/class, cluster similar ones, and ask the LLM to canonicalize each cluster into a single ontology element.
- **LLM-assisted conflict resolution:** Feed pairs of potentially overlapping fragments to the LLM and ask it to merge them into a single consistent representation.

This is essentially the approach described in the **LKD-KGC** (Sun et al., 2025) and **EDC** (Zhang & Soh, 2024) frameworks.

---

## Pattern 7: Agentic / Multi-Agent Ontology Engineering

**Also called:** Agent-based Ontology Construction, LLM-as-Ontologist

This is the emerging SOTA approach, used in systems like **NeOn-GPT** (Fathallah et al., 2024) and **OntoEKG** (2025).

### Architecture

Multiple specialized LLM agents collaborate:

| Agent | Role |
|-------|------|
| **Domain Analyst** | Extracts concepts and relationships from source documents |
| **Taxonomy Architect** | Builds the class hierarchy, ensures BFO alignment |
| **Axiom Engineer** | Generates restriction axioms, equivalence classes, disjointness |
| **Validator** | Runs OWL reasoner, identifies inconsistencies, sends repair requests |
| **Integrator** | Merges outputs from other agents, resolves conflicts |

Each agent operates within its output token budget because its scope is narrow. The orchestrator manages the workflow and maintains global state.

### Why This Matters for Your BFO/CCO Constraint

BFO/CCO alignment requires specific expertise: knowing which BFO category a domain concept falls under, applying the correct CCO mid-level patterns, and avoiding common mistakes (like making a role a subclass of an object rather than a dependent continuant). A dedicated "BFO Alignment Agent" with a focused system prompt containing BFO axioms and CCO patterns will outperform a general-purpose prompt that tries to do everything.

---

## Recommended Architecture for ONTOS

Given your specific constraints (production DoD system, BFO/CCO grounding, human-quality target), I'd recommend combining **Patterns 1, 4, and 7**:

### The Hybrid Pipeline

```
Phase 1: EXTRACTION (Pattern 6 - Map)
  ├── Chunk source documents
  ├── Extract entities, relationships, definitions per chunk (LLM, parallel)
  └── Deduplicate and consolidate extractions (embedding + LLM)

Phase 2: DESIGN (Pattern 7 - Specialized Agents)
  ├── Taxonomy Agent: Build class hierarchy aligned to BFO (LLM)
  ├── Property Agent: Define object/data properties with domain/range (LLM)
  ├── Axiom Agent: Generate restrictions, equivalences, disjointness (LLM)
  └── Individual Agent: Instantiate named individuals (LLM)

Phase 3: OUTPUT (Pattern 4 - IR Compilation)
  ├── All agents output JSON IR fragments (not OWL)
  ├── Programmatic merge, deduplication, and validation of IR
  ├── Compile IR → valid OWL/RDF-XML via rdflib
  └── Run OWL reasoner (HermiT/Pellet) for consistency check

Phase 4: REPAIR (Agentic loop)
  ├── If reasoner finds issues → isolate problematic axioms
  ├── Send to Repair Agent (LLM) with error context
  └── Re-compile and re-validate until clean
```

### Key Advantages
- **No single LLM call needs to produce more than ~2K lines of JSON** (well within output limits)
- **Syntactic validity guaranteed** by the compiler, not the LLM
- **BFO compliance** enforced by a specialized agent with focused context
- **Parallelizable** across document chunks and ontology modules
- **Auditable** — every IR fragment traces back to a specific LLM call with specific source material

---

## Format Selection: Why Turtle/JSON-LD > RDF-XML for LLM Generation

A critical practical consideration: your target is RDF-XML (as in the ITD example), but RDF-XML is extremely verbose and token-inefficient. Compare:

**RDF-XML (14 lines, ~85 tokens):**
```xml
<owl:Class rdf:about="http://example.org/ITD/TargetSystemAnalysis">
    <rdfs:label xml:lang="en">Target System Analysis</rdfs:label>
    <obo:IAO_0000115 xml:lang="en">A process of analyzing a target system to identify vulnerabilities</obo:IAO_0000115>
    <rdfs:subClassOf rdf:resource="http://purl.obolibrary.org/obo/BFO_0000015"/>
    <rdfs:subClassOf>
        <owl:Restriction>
            <owl:onProperty rdf:resource="http://purl.obolibrary.org/obo/RO_0000057"/>
            <owl:someValuesFrom rdf:resource="http://example.org/ITD/IntelligenceAnalyst"/>
        </owl:Restriction>
    </rdfs:subClassOf>
</owl:Class>
```

**Equivalent Turtle (5 lines, ~40 tokens):**
```turtle
ITD:TargetSystemAnalysis a owl:Class ;
    rdfs:label "Target System Analysis"@en ;
    obo:IAO_0000115 "A process of analyzing a target system to identify vulnerabilities"@en ;
    rdfs:subClassOf obo:BFO_0000015 ;
    rdfs:subClassOf [ a owl:Restriction ; owl:onProperty obo:RO_0000057 ; owl:someValuesFrom ITD:IntelligenceAnalyst ] .
```

**Equivalent JSON IR (6 lines, ~35 tokens):**
```json
{"iri":"ITD:TargetSystemAnalysis","label":"Target System Analysis",
 "def":"A process of analyzing a target system to identify vulnerabilities",
 "parent":"obo:BFO_0000015",
 "restrictions":[{"prop":"obo:RO_0000057","type":"some","filler":"ITD:IntelligenceAnalyst"}]}
```

**The JSON IR is ~2.4× more token-efficient than RDF-XML.** For an ontology of 443 classes, this means fitting roughly **2.4× more ontology content into each LLM output call**, directly reducing the number of calls needed and improving coherence within each call.

Generate in compact IR or Turtle → convert to RDF-XML as the final deterministic step.

---

## Research Landscape: Key References

| System/Paper | Year | Approach | Key Insight |
|---|---|---|---|
| **LLMs4OL** (Giglou et al.) | 2023-2025 | Task decomposition into term typing, taxonomy, relations | Ontology learning as 3 separable NLP tasks |
| **Ontogenia** (Lippolis et al., ESWC) | 2025 | Incremental CQ-by-CQ with memory | Stateful accumulation outperforms one-shot |
| **NeOn-GPT** (Fathallah et al.) | 2024 | Prompt pipeline following NeOn methodology | Methodology-guided decomposition > ad hoc |
| **OntoEKG** | 2025 | LLM pipeline for enterprise KG ontologies | End-to-end from unstructured text to OWL |
| **EDC Framework** (Zhang & Soh) | 2024 | Extract → Define → Canonicalize | Three-stage schema normalization |
| **COMEM** (Wang et al.) | 2024 | Cascading small + large LLMs | Efficiency through hierarchical model routing |
| **Mateiu & Groza** | 2023 | Fine-tuned GPT-3 → OWL Functional Syntax | Direct NL-to-axiom translation |

### Key Finding from the Literature

The Lippolis et al. (2025) evaluation and the NeOn-GPT experiments consistently show that **LLMs struggle most with complex class expressions (intersections, unions, complements) and property restrictions (cardinality, existential, universal)**. Subsumption hierarchies are relatively easy; axiom engineering is hard. This argues strongly for Pattern 4 (IR compilation) where the LLM specifies *what* restriction it wants in a simple JSON structure, and the compiler handles the OWL serialization.

---

## Anti-Patterns to Avoid

**1. Asking for raw RDF-XML output.** Token-wasteful, error-prone, and the LLM will make serialization mistakes (unclosed tags, wrong namespace prefixes) that cascade.

**2. Single-shot generation with "just make it longer."** Models degrade in quality as output length increases. The last 25% of a max-length output is measurably worse than the first 25%.

**3. Naive continuation ("please continue").** Without compressed state feedback, the model loses track of what it already generated, producing duplicates and contradictions.

**4. Over-decomposition.** Generating one class per LLM call loses relational context — the model can't see sibling classes and will make inconsistent BFO alignment decisions. Batch related classes together (e.g., all subclasses of a given BFO category).

**5. Skipping programmatic validation.** Always run a Description Logic reasoner (HermiT, Pellet, ELK) on the assembled ontology. LLM-generated axioms will contain logical contradictions that only a reasoner can catch.
