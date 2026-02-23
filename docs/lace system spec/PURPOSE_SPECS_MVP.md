# LACE MVP — Purpose, Specs, and Scope (v0.1)

## Purpose
LACE (Long-Form Artifact Construction Engine) is a **stateful artifact manager** that can generate and maintain large structured documents **beyond LLM output limits** by:
- owning **state** (a canonical intermediate representation, IR),
- owning **structure** (outline + node graph),
- owning **regeneration** (targeted recompute of specific nodes),
- owning **validation** (schema + domain gates),
- and delegating **generation** to LLMs as a **stateless function**.

> **LLM = stateless generator**  
> **Engine = stateful artifact manager / compiler**

## What “success” looks like (MVP)
Given an initial outline and a target node, LACE can:
1) build bounded context for that node,
2) call an LLM that returns **structured edit actions** (not raw prose),
3) deterministically apply those actions to the IR,
4) validate the artifact,
5) compile the artifact to **Markdown** (and optionally **DOCX**),
6) persist run history so the same node can be regenerated later without losing structure.

## Non-goals (MVP)
- No collaboration/CRDT
- No distributed orchestration / worker fleet
- No full plugin marketplace
- No full ontology reasoner loop (OWL compile is “later”, but the design keeps the door open)

## MVP Feature Set
### Core data model
- Artifact = Outline + Node graph
- Node = {id, title, status, content blocks, references}
- Canonical IR stored as JSON (versioned)

### Pipeline execution (in-process)
- PipelineDefinition (YAML) with ordered/DAG steps
- StepRunner + StepRegistry
- Run persistence: PipelineRun + StepRun + Artifact blobs (content-addressed)

### LACE generation loop (single node)
- Context Builder
- Strategy Selector (simple policy)
- LLM Call (JSON schema response)
- Deterministic Apply
- Validation (basic checks)
- Compiler (Markdown required; DOCX optional)

### UI/CLI (MVP)
- CLI commands:
  - `lace init` (create artifact skeleton)
  - `lace run generate --artifact A --node N`
  - `lace run regen --artifact A --node N`
  - `lace compile --artifact A --target md`
  - `lace status --run RUN_ID`

## Output guarantees (MVP)
- IR remains structurally valid after every applied change (or the change is rejected)
- Every LLM response is schema-validated before apply
- Every run is replayable from persisted artifacts + step outputs (within model determinism limits)

## Compatibility / “vertical reuse”
The pipeline framework is **generic**. LACE is a set of pipeline step plugins that operate on LACE IR.
Future verticals (Ontology/Code/JSON) reuse the same runtime by swapping:
- validators,
- compilers,
- LLM provider adapters,
- and some strategy/context steps.
