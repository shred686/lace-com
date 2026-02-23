# LACE: Groundbreaking Feature & Innovation Catalog

**Purpose:** Catalog of high-impact ideas, algorithms, and technical solutions to explore further. Each entry is a light synopsis for evaluation and prioritization.

---

## I. ALGORITHMIC INNOVATIONS

### 1. Wavefront Propagation Scheduler
Generate nodes in parallel by computing the "wavefront" — the set of nodes whose dependencies (parent summaries, sibling context, constraint inputs) are fully resolved. Execute all wavefront-eligible nodes concurrently, then propagate results up/down the tree and compute the next wavefront. Analogous to dataflow scheduling in hardware synthesis.

**Why only LACE can do this:** The recursive IR with explicit `deps.parents/children/references`, per-node locking (`FileNodeLockManager` scoped to `(artifact_id, node_id)`), and idempotent apply keys mean parallel node generation is architecturally safe. No other system has a dependency graph + deterministic apply that enables formal parallelism.

**Impact:** A 100-page proposal with 40 leaf nodes could generate 8-12 nodes per wavefront instead of sequentially. Wall-clock time drops from hours to minutes. This is the "GPU parallelism" equivalent for document generation.

---

### 2. Incremental Differential Re-generation (IDR)
When a source changes, a constraint is updated, or a user edits a block, compute the minimal "blast radius" by tracing the IR's dependency graph, terminology references, competency spec bindings, and cross-reference links. Only re-generate affected nodes. Use content-addressed hashing to prove unaffected subtrees are unchanged (hash-verified no-change certificates).

**Why it matters:** Transforms LACE from a batch generation tool into a **living document maintenance system**. Changing one source citation in a 200-page compliance document re-generates only the 3-5 nodes that reference it. For regulated industries, the hash-proven no-change certificates for unaffected sections are themselves a compliance asset.

---

### 3. Action Algebra & Formal Merge Calculus
Formalize the action types (`replace_node_content`, `append_node_blocks`, `patch_node_blocks`, etc.) as an algebraic system with composition, commutativity, and conflict rules. Define when two action sequences are semantically equivalent, when they conflict, and when they can be safely reordered. This enables:
- **Concurrent edit merge** (human + LLM, or two LLM passes on overlapping nodes)
- **Minimal diff patches** between any two IR revisions
- **Convergence proofs** for multi-pass generation strategies

The existing `ACTION_ORDER`, `_sort_actions`, `apply_mode` (conservative/structural), and `_protected_blocks` mechanisms are 80% of this algebra already. This would make LACE the first document system with formally verifiable merge semantics — the CRDT equivalent for structured document trees.

---

### 4. Predictive Generation Cost Estimator
Before executing a generation run, predict: how many LLM calls will be needed, estimated token consumption, expected quality score, and probability of validation failure — using features like context completeness, constraint specificity, source coverage, node depth, and historical run metrics. This enables **cost-optimized planning**: "Generate this section with Claude Opus for $0.47 estimated, or with Sonnet for $0.09 with 15% lower expected quality."

---

## II. KNOWLEDGE & REASONING ENGINES

### 5. Ontology-Grounded Semantic Validator (OntVal)
After each generation pass, compile the current IR to OWL, load it into an in-process reasoner (Owlready2 / SPARQL engine), and run **formal consistency checks**: Are rdfs:subClassOf relationships satisfied? Do assertions in Section 4.2 contradict claims in Section 7.1? Do CompetencySpec SPARQL queries actually entail against the generated knowledge?

The OWL compiler already generates class hierarchies from the node tree. CompetencySpecs already support `sparql` and `reasoner` evaluation methods. Closing the loop — feeding compiler output back into validation — creates the first LLM generation system with **machine-verified logical consistency**.

---

### 6. Citation Graph Entailment Engine
Build a first-class citation graph within the IR: which specific claims in which specific blocks are supported by which specific source passages, with what confidence, through what reasoning chain. When the LLM cites a source, **verify the source actually supports the claim** via embedding similarity or NLI (natural language inference). Detect citation fabrication. Auto-generate formal citation appendices with traceability.

**Impact:** Citation fabrication is the #1 liability risk of AI-generated documents. This transforms LACE from "generated this proposal" to "generated this proposal with machine-verified citation integrity." Directly fundable under IC/DoD programs for automated report generation.

---

### 7. Constraint Satisfaction Propagation Network
Model the hierarchical constraint system not as static merge but as a **bidirectional propagation network** (like AI planning/scheduling CSP solvers). When a constraint is asserted at any level, implications propagate: a word-count constraint on a parent automatically budgets to children proportionally; a must-cite on one node creates soft citation-awareness on siblings for coherence; a page limit at the profile level adjusts split thresholds and strategy scores throughout the tree.

Currently these are independent heuristics. With constraint propagation, they become a single coherent planning system — LACE behaves like an AI project manager reasoning about document structure.

---

### 8. Source Triangulation Engine
When multiple sources provide **conflicting information** on the same topic, the system identifies the conflict, classifies it (factual contradiction, different timeframes, different scopes, opinion divergence), presents it to the user, and generates content that either:
- Acknowledges the tension explicitly ("Source A states X; however, Source B reports Y")
- Lets the user resolve with a policy decision
- Applies a source precedence hierarchy (primary > secondary > tertiary)

No other system even detects multi-source conflict — they silently pick one or hallucinate a merge.

---

### 9. Incremental Knowledge Distillation
As artifacts are generated across runs, extract and store structured knowledge (entities, relationships, facts, definitions) in a persistent knowledge base. Future generations query this base for cross-artifact context. The terminology registry is the seed of this — extend it to a full entity-relationship store that grows with every generation.

**Effect:** The more you use LACE, the richer its understanding of your domain. An organization generating 50 proposals builds a knowledge base that makes proposal 51 significantly better.

---

## III. ENTERPRISE-GRADE DIFFERENTIATION

### 10. Continuous Compliance Attestation (CCA)
After every apply, produce a signed attestation record: "At revision N, node X satisfies competency specs [A, B, C], terminology constraints [D, E], style targets [F], with evidence [hash-linked]." Attestation records are content-addressed and immutable. When an auditor asks "was this document compliant at the time of submission?", LACE produces a **cryptographic proof chain** from source ingestion through every transformation to final compilation.

**Impact:** First AI content generation platform that can pass a SOC 2 Type II audit for generated content integrity. For FedRAMP, ITAR, and FDA submissions, this is a procurement requirement, not a nice-to-have.

---

### 11. Redaction-Aware Multi-Classification Compilation
A single IR with per-block classification labels compiles to multiple versions at different classification levels: SECRET, CUI, UNCLASS, PUBLIC. The compiler automatically redacts or substitutes content based on ABAC tags. Compilation-level guarantees ensure **no classified material leaks** into lower-classification outputs.

The block-level IR granularity provides natural label attachment points. The production plan already includes ABAC labels. A redaction filter as a pre-compilation IR transformation preserves the deterministic purity guarantee.

**Impact:** IC and DoD spend enormous effort manually producing multi-classification document versions. Automated, provably-correct multi-classification compilation is directly fundable under NSA data-centric security programs.

---

### 12. Regulatory Change Impact Analyzer
When a regulation updates (new NIST 800-53 revision, updated FAR clause), ingest the updated source, diff against the prior version, and **automatically compute which nodes in which artifacts are affected**. Produce an impact report: "These claims in these sections reference provisions that changed, with these deltas, requiring these re-generation actions." Optionally auto-queue re-generation pipeline runs.

Combines source ingestion diffing + citation graph tracing + IDR blast radius computation into a complete regulatory change management system.

---

### 13. Policy-Driven Generation Governance
Define organizational policies constraining: what can be generated, by whom, with what models, under what review requirements, with what classification ceilings, and with what approval workflows. Policies are themselves version-controlled artifacts with audit trails. A "defense contractor policy" might require: all proposals use approved terminology registries, all sections pass NIST CompetencySpecs, all LLM calls route through an approved provider list, and all outputs require human review before compilation.

---

## IV. PLATFORM & ECOSYSTEM

### 14. Artifact Genome System
Every artifact carries its "genome" — the complete specification of strategies, constraints, sources, styles, terminology, and generation parameters that produced it. You can:
- **Clone** a genome to produce a structurally similar but content-different artifact
- **Cross-breed** two genomes to combine strengths (one's style profile + another's structure profile)
- **Evolve** genomes by tracking which configurations produce the highest validation scores across runs

This turns artifact templates into **living, adaptive configurations** that improve over time.

---

### 15. Artifact Template Exchange (ATE)
Marketplace for shareable, composable artifact templates: structure profiles, constraint sets, CompetencySpec packs, terminology registries, style anchors, and strategy configurations. Examples:
- "DoD Proposal Pack" (FAR/DFARS structure, compliance CompetencySpecs, government terminology)
- "NIST 800-171 Overlay" (layers on top of any base template)
- "Academic Paper Pack" (journal-specific formatting, citation styles, review criteria)

Templates are versioned, content-addressed, and composable. **Network effect**: every published template makes LACE more valuable for everyone.

---

### 16. Strategy Plugin Ecosystem
Third-party developers encode domain expertise as strategy plugins:
- A former proposal manager publishes "Winning Technical Approach Strategy"
- A legal team publishes "Contract Compliance Strategy"
- An academic publishes "Literature Review Strategy"

Plugins declare scoring functions, plan shapes, and prompt template requirements. The registry composes them automatically. Creates a developer ecosystem where domain experts — not LLM engineers — contribute generation intelligence.

---

### 17. Cross-Artifact Knowledge Graph
Across an organization's artifacts, build a persistent knowledge graph connecting: terms, claims, evidence, section structures, and source citations. When generating Section 3.2 of Proposal B, the system surfaces: "Section 5.1 of Proposal A (which won) made a similar claim with this specific framing."

Each artifact's OWL compilation contributes to the organizational graph. The terminology registry, provenance chains, and content-addressed blocks provide the linkage. **Institutional memory for document generation**.

---

## V. NOVEL LLM ORCHESTRATION PATTERNS

### 18. Adversarial Self-Critique with Safe Replay
After primary generation, run a "red team" LLM call that receives the proposed actions and constraints, asks "What's wrong? What constraints are violated? What claims are unsupported?" The red team returns critique actions routed back through the strategy selector as a refinement pass.

Because apply is deterministic and idempotent, you can safely replay the original generation, then apply refinement patches, without state corruption. The `patch_node_blocks` action type enables surgical fixes. The `conservative` apply mode protects human edits during critique-driven patches.

**Impact:** Transforms single-pass unreliable generation into a **converging refinement loop**. For proposals where a missed compliance requirement means disqualification, this is existentially valuable.

---

### 19. Hierarchical Prompt Decomposition (HPD)
Decompose generation into a hierarchy of increasingly specific prompts driven by IR tree structure:
1. **Thesis pass**: Generate section's thesis and key claims (outline-level actions)
2. **Expansion pass**: For each claim, generate supporting arguments with citations (block-level actions)
3. **Polish pass**: For each argument block, refine prose against style targets (patch-level actions)

Each level produces different action types, each level's output is validated and applied before the next starts. Each pass is independently checkpointed, auditable, and resumable. This is how expert writers actually work.

---

### 20. Speculative Parallel Generation with Deterministic Merge
When multiple strategies score closely, run them **in parallel**. Generate content from each, compare candidates using validation scores and competency spec pass rates, select the winner. Because content-addressed hashing enables comparing candidates without applying either to the canonical IR, this is safe.

**Speculative execution for document generation** — a technique from CPU microarchitecture applied to LLM orchestration. Trades compute cost for quality.

---

### 21. Feedback-Directed Strategy Evolution
After each run, measure outcomes: validation pass rate, competency scores, terminology drift, conflict count. Feed these metrics back into strategy registry as historical performance data. Strategies that consistently fail for specific artifact types get score penalties; strategies that consistently produce high scores get boosted.

**Online learning for strategy selection.** LACE gets better at choosing generation approaches the more you use it. This is the compounding-value moat — duration of use translates directly to quality advantage.

---

### 22. Multi-Provider Federated Generation
Split generation across multiple LLM providers simultaneously, with the deterministic apply engine merging results: Claude for nuanced policy prose, GPT-4 for technical content, a specialized model for compliance language, a fast model for boilerplate. The strategy selector routes each node to the optimal provider based on node type, constraints, and historical provider performance for that content category.

---

### 23. Artifact-Aware Retrieval-Augmented Generation (A-RAG)
Go beyond generic RAG. The retrieval system is aware of the full IR structure: it knows which node is being generated, what its parents contain, what its siblings contain, what constraints apply, what terminology is required, and what competency specs must be satisfied. Retrieval queries are **dynamically constructed** from this context, not from the user prompt alone. Source ranking weights citation relevance, style match, recency, and authority — all computable from the existing source metadata.

---

## VI. COMPILATION & OUTPUT INNOVATIONS

### 24. Semantic Diff Compiler
A compilation target that produces a **structured semantic diff** between two IR revisions. Not textual diff — a structured report: "In Section 3.2, the compliance claim was strengthened from passive to active voice. In Section 5.1, a new source citation was added. In the terminology registry, 'Zero Trust Architecture' was normalized." Renderable as a change report, PR-style review document, or regulatory change log.

Every change_event records exact `applied_actions` with types and targets. Block-level IR means diffs are at the semantic unit level, not the line level.

---

### 25. Interactive Hyperlinked Compilation (IHC)
Compile to an interactive HTML format where:
- Every paragraph links to its source citations
- Every term links to its terminology registry definition
- Every section links to its competency spec evidence
- Every claim links to its provenance chain

The compiled output isn't just a document — it's a **navigable evidence package**. An auditor can verify every claim without leaving the document. A fundamentally new document format that only makes sense when generated by a system with LACE's provenance architecture.

---

### 26. Multi-Modal Typed Blocks (Tables, Figures, Equations)
Extend block types beyond prose to include `figure`, `table`, `equation`, `diagram`, `data_visualization`. Each carries structured metadata (a table has rows/columns/headers; a figure has alt text, caption, image reference). LLM generates these as structured actions. Each compiler renders appropriately: Markdown uses text representations, DOCX uses native Word objects, PDF uses proper typesetting, OWL encodes data tables as property assertions.

This is table-stakes for production proposals and specs, which require compliance matrices, architecture diagrams, and cost tables.

---

### 27. Deterministic Compilation Proof Certificates
For every compilation, produce a signed proof certificate: IR content hash + compiler version + settings hash + output hash. Independently verifiable: given the same inputs, anyone can reproduce the same output hash. Provides **non-repudiation** for generated documents.

For ITAR-controlled technical data, export compliance requires proving specific document versions exist in specific forms. This is a capability no human-authored document can provide.

---

### 28. Bidirectional Compilation (Decompilation)
Import existing documents (DOCX, PDF, Markdown) **back into the IR structure**. Parse document structure into node trees, extract blocks, infer constraints, and populate the terminology registry from existing usage. This enables LACE to work with legacy documents, not just generate new ones. Organizations can "onboard" their existing document portfolios into the LACE ecosystem.

---

### 29. Format-Aware Generation
Make the LLM aware of target format constraints **during generation**, not just after. If generating for a 10-page PDF, constrain content length accordingly. If generating for OWL, generate content that maps cleanly to ontological structures. If generating for a compliance matrix (DOCX table), generate structured claim-evidence pairs rather than prose paragraphs. The compilation target becomes a generation constraint, not just an output step.

---

## VII. SEQUENCED ROADMAP (Mapped to Production Master Plan)

### Phase A Extensions (Platform Foundation — P0-0 to P0-6, P0-11, P0-12, P0-14, P0-15)

Integrate during the platform foundation build. These ride on infrastructure being created anyway.

| Priority | Idea | Extends | Hard Prerequisites | Integration Point |
|----------|------|---------|-------------------|-------------------|
| 1 | #22 Multi-Provider Federated | P0-12 (LLM Gateway) | P0-12 | Add `FederatedRouter` to LLM gateway; routes sub-tasks to optimal providers via capability matrix |
| 2 | #14 Artifact Genome System | P0-3 (Postgres), P0-4 (MinIO) | P0-3, P0-4 | Add `artifact_genome` table to DB schema; store genome fingerprints (source_hashes + strategy_id + model_id + constraint_hash) alongside each revision |
| 3 | #4 Predictive Cost Estimator | P0-12 (Gateway), P0-11 (Settings) | P0-3, P0-12 | Enhance `LLMCallStep` pre-call path with cost prediction from historical data; replace heuristic `_build_budget_estimate()` |
| 4 | #1 Wavefront Propagation Scheduler | P0-5 (Queue/Worker), P0-15 (Run Control) | P0-3, P0-5 | Replace sequential BFS in `run_recursive_generation_auto()` with DAG-aware parallel dispatcher using queue workers |
| 5 | #20 Speculative Parallel Generation | P0-5 (Queue), P0-12 (Gateway) | P0-5, P0-12 | Add `speculative_mode` to gateway; dispatch N providers concurrently, score/select best response |

---

### Phase B Extensions (Governance + Provenance — P0-7 to P0-10, P0-13)

Integrate during the governance, security, and provenance build.

| Priority | Idea | Extends | Hard Prerequisites | Integration Point |
|----------|------|---------|-------------------|-------------------|
| 1 | #7 Constraint Propagation Network | P0-10 (Validation) | P0-10, P0-3 | New step `lace.ConstraintPropagation.v1` after `resolve_constraints`; bidirectional constraint solver over IR tree |
| 2 | #5 OntVal (Semantic Validator) | P0-10 (Validation) | P0-10, P0-3 | New competency evaluator method `ontology_consistency`; feed OWL compiler output back into validation |
| 3 | #8 Source Triangulation | P0-9 (Sources), P0-10 (Validation) | P0-9, P0-10 | Enhance `SourceSelectorStep` scoring with triangulation pass requiring N>=2 corroborating source_units per claim |
| 4 | #6 Citation Graph Entailment | P0-10 (must-cite), P0-13 (Provenance) | P0-9, P0-10 | New gate between `validate_llm` and `apply`; verifies entailment between cited sources and generated claims |
| 5 | #13 Policy-Driven Governance | P0-7 (Security), P0-10, P0-11 | P0-7, P0-10, P0-11 | Enhance `ResolveConstraintsStep` to consult org-level policies from settings DB + ABAC labels |
| 6 | #27 Compilation Proof Certificates | P0-13 (Provenance), P0-6 (Transactions) | P0-13, P0-4, P0-6 | Add certificate generation to `CompilerStep`; hash(IR + compiler_version + settings) -> signed certificate in `CompiledBundle` |
| 7 | #10 Continuous Compliance Attestation | P0-13 (Provenance), P0-7 (Security) | P0-13, P0-7, P0-3 | Post-pipeline compliance evaluator consuming `transformation_logs`; emits immutable attestation records |
| 8 | #11 Redaction-Aware Compilation | P0-7 (Security), P0-13 (Provenance) | P0-7, P0-13 | Add `classification_filter` to `CompileRequest`; compilers filter blocks by classification before rendering |

---

### Phase C/D Extensions (Reliability + Release Readiness — P1-1 to P1-8)

Require the Phase A/B platform to be stable. Align with quality and reliability hardening.

| Priority | Idea | Extends | Hard Prerequisites | Integration Point |
|----------|------|---------|-------------------|-------------------|
| 1 | #2 IDR (Incremental Re-gen) | P1-1 (Rollback), P1-4 (Compilers) | P0-3, P0-6, P1-1 | New pipeline `lace.IncrementalRegeneratePipeline.yaml`; accepts diff_request, traces blast radius, regenerates only affected nodes |
| 2 | #19 Hierarchical Prompt Decomposition | P1-3 (Tokenizer), P0-12 | P0-12, P1-3 | New strategy plugin `HierarchicalDecompositionStrategy`; multi-pass plan (thesis -> expand -> polish) with per-pass validation |
| 3 | #24 Semantic Diff Compiler | P1-4 (Compilers) | P0-3, P1-1, P1-4 | New compiler `SemanticDiffCompiler` target="diff"; accepts two IR revisions, produces structured change report |
| 4 | #29 Format-Aware Generation | P1-3 (Tokenizer), P1-4 (Compilers) | P0-12, P1-3, P1-4 | Pass `compiler_targets` into `strategy_input`; format-specific prompt template variants |
| 5 | #9 Knowledge Distillation | P1-2 (Retrieval) | P0-9, P1-2 | Post-generation extraction step; persists entities/relationships to knowledge store; retrieval system queries both raw sources + distilled knowledge |
| 6 | #12 Regulatory Impact Analyzer | P1-1 (Rollback), P1-2 (Retrieval) | P0-9, P0-13, P1-1 | New API endpoint `POST /v1/artifacts/{id}:impact-analysis`; traces changed-source -> citation graph -> affected nodes |
| 7 | #18 Adversarial Self-Critique | P1-8 (Test Hardening), P0-10 | P0-12, P0-10, P1-8 | New optional step `lace.AdversarialCritique.v1` between `validate_llm` and `apply`; critique model flags issues, triggers refinement |

---

### Phase E: Innovation Platform (Post-V1)

Require full V1 stability. Ecosystem and platform-scale features.

| Priority | Idea | Hard Prerequisites | Notes |
|----------|------|--------------------|-------|
| 1 | #3 Action Algebra | P0-6, P1-1, P1-8 | Refactor `DeterministicApplyStep` with formal algebra; enables concurrent collaborative generation |
| 2 | #26 Multi-Modal Typed Blocks | P0-4, P1-4 | Extend `SUPPORTED_BLOCK_TYPES` to include figure, table, equation, diagram; update all compilers |
| 3 | #17 Cross-Artifact Knowledge Graph | P0-3, P0-9, P0-13, Idea #14 | Graph DB or Postgres graph extension; post-generation knowledge extraction pipeline |
| 4 | #16 Strategy Plugin Ecosystem | P0-1, P0-7, P1-6 | Remote plugin discovery, version resolution, sandboxed execution |
| 5 | #15 Artifact Template Exchange | P0-1, P0-7, P1-6 | New API surface for template CRUD + marketplace |
| 6 | #25 Interactive Hyperlinked Compilation | P0-1, P1-4, P0-14 | New `InteractiveHTMLCompiler` target="html"; self-contained HTML bundle with embedded JS |
| 7 | #28 Bidirectional Compilation | P1-4, P1-8 | `Decompiler` protocol mirroring `Compiler`; DOCX/PDF/MD -> IR round-trip |

---

### Research Track (Parallel — Start Anytime)

Design and prototyping work that can proceed independently of production phases.

| Idea | Research Activities Now | Production Integration |
|------|------------------------|----------------------|
| #21 Feedback-Directed Strategy Evolution | Design fitness functions using existing `StepResult.metrics`; prototype bandit/evolutionary algorithms for strategy selection scoring | Phase C/D: Replace static `score()` in strategy plugins with learned scoring function |
| #23 Artifact-Aware RAG (A-RAG) | Design artifact-aware retrieval model using node position, dependency depth, sibling content; prototype enhanced scoring beyond keyword matching | Phase C: Replace `SourceSelectorStep` scoring with A-RAG model during P1-2 retrieval upgrade |

---

## VIII. DEPENDENCY GRAPH (Critical Path)

```
P0-0 (defects) ──> ALL PHASES

Phase A Foundation:
  P0-3 (Postgres) ──> P0-6 (transactions) ──> #14 Genome
  P0-4 (MinIO) ──────────────────────────────> #14 Genome
  P0-5 (Queue) ───────────────────────────────> #1 Wavefront, #20 Speculative
  P0-12 (Gateway) ────────────────────────────> #4 Cost Estimator, #22 Federated
  P0-15 (Run Control) ────────────────────────> #1 Wavefront

Phase B Governance:
  P0-7 (Security) ──> #10 CCA, #11 Redaction, #13 Policy
  P0-9 (Sources) ───> #6 Citation, #8 Triangulation
  P0-10 (Validation) > #5 OntVal, #6 Citation, #7 Constraints, #8 Triangulation
  P0-13 (Provenance) > #10 CCA, #11 Redaction, #27 Proof Certs

Phase C/D Reliability:
  P1-1 (Rollback) ──> #2 IDR, #12 Regulatory Impact, #24 Semantic Diff
  P1-2 (Retrieval) ─> #9 Knowledge Distill, #23 A-RAG (from research)
  P1-3 (Tokenizer) ─> #19 HPD, #29 Format-Aware
  P1-4 (Compilers) ─> #24 Semantic Diff, #29 Format-Aware
  P1-8 (Testing) ───> #18 Adversarial Critique

Phase E (Post-V1):
  Full V1 ──> #3 Action Algebra, #15 ATE, #16 Strategy Ecosystem,
              #17 Knowledge Graph, #25 IHC, #26 Multi-Modal, #28 Decompilation
  #14 Genome ──> #17 Knowledge Graph
```

---

## IX. IMPACT TIER RANKING

**Tier 1 — Keynote-Anchoring / DARPA-Grade:**
1. **Wavefront Propagation Scheduler** (#1) — 5-10x speed, architecturally close to ready
2. **Citation Graph Entailment Engine** (#6) — solves the #1 AI content liability
3. **Continuous Compliance Attestation** (#10) — unlocks regulated industry procurement
4. **Adversarial Self-Critique** (#18) — quality breakthrough via deterministic replay
5. **Interactive Hyperlinked Compilation** (#25) — creates a new document format category

**Tier 2 — Strong Competitive Moat:**
6. **Incremental Differential Re-generation** (#2) — batch tool -> living document system
7. **Feedback-Directed Strategy Evolution** (#21) — compounding value moat
8. **Cross-Artifact Knowledge Graph** (#17) — institutional memory
9. **Ontology-Grounded Semantic Validator** (#5) — machine-verified logical consistency
10. **Constraint Satisfaction Propagation** (#7) — AI project manager for documents

**Tier 3 — Platform Scale:**
11. **Artifact Template Exchange** (#15) — network effects marketplace
12. **Strategy Plugin Ecosystem** (#16) — developer ecosystem
13. **Artifact Genome System** (#14) — adaptive template evolution
14. **Multi-Provider Federated Generation** (#22) — optimal provider routing
15. **Bidirectional Compilation** (#28) — legacy document onboarding
