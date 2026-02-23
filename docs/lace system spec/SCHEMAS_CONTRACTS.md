# LACE MVP — Schemas and Contracts (v0.1)

This document lists the **minimal** schemas/contracts required to implement the MVP with testable, deterministic behavior.

## Naming conventions
- `*.v1` means the first stable contract version.
- “Type names” are logical identifiers; storage may be JSON.

---

## 1) Pipeline Runtime Contracts

### 1.1 PipelineDefinition (YAML)
A PipelineDefinition describes:
- pipeline id + version
- inputs + outputs
- ordered steps (or DAG)
- per-step params + retry policy + gates

**Key property**: all refs between steps are explicit (by `steps.<id>.outputs.<key>`).

### 1.2 PipelineRun
Represents a single invocation.
Minimum fields:
- `run_id`, `pipeline_id`, `pipeline_version`
- `status`: queued|running|succeeded|failed
- `created_at`, `finished_at`
- `input_refs`: pointers to stored input artifacts
- `output_refs`: pointers to stored outputs

### 1.3 StepRun
Minimum fields:
- `run_id`, `step_id`, `attempt`
- `status`: queued|running|succeeded|failed|skipped
- `started_at`, `finished_at`
- `error`: {code, message, retryable, details?}
- `input_refs`, `output_refs`
- `metrics`: tokens, latency, provider/model identifiers, prompt hash (for LLM steps)

Observability fields now emitted (where applicable):
- `strategy_id`, `strategy_version`, `strategy_mode`
- `policy_decision`, `policy_reason`
- `estimated_total_tokens`, `split_threshold_tokens`, `node_depth`
- `applied_action_count`, `split_action_count`, `content_action_count`, `replayed`

### 1.4 ArtifactRef (content-addressed)
Minimum fields:
- `ref_id` (hash)
- `type` (logical type name)
- `media_type` (application/json, text/markdown, etc.)
- `bytes`, `created_at`

### 1.5 NodeLock.v1
Minimum fields:
- `lock_id`
- `artifact_id`
- `node_id`
- `owner_id` (typically run id)
- `acquired_at`, `expires_at`

MVP policy:
- lock scope is `artifact_id + node_id`
- single writer per node
- TTL-based stale lock recovery

---

## 2) LACE Domain Contracts (MVP)

### 2.1 GenerationRequest.v1
Minimum fields:
- `artifact_id`
- `target_node_id`
- `operation`: generate|regenerate
- `constraints`: {style?, terminology?, max_tokens?, citations?}
- `compiler_targets`: ["md"] (optional ["docx"])

Phase 2 additive constraint keys:
- `outline_mode`: bool (force outline-only strategy behavior)
- `allow_empty_content`: bool (used by outline flow validation)
- `strategy_id`: string (optional explicit strategy plugin selection)
- `max_split_depth`: int (auto strategy recursion depth guard)

### 2.2 ArtifactIR.v1
Minimum fields:
- `artifact_id`, `version`
- `outline`: ordered list of node ids
- `nodes`: map node_id -> NodeIR
- `terminology`: {terms, preferred_labels} (optional MVP-lite)
- `history`: list of ChangeEvent refs (or embedded)

Extended optional fields (Phase 1 foundation):
- `root_node_id`
- `metadata`
- `links`
- `requirements`
- `profiles`
- `registry`
- `generation`
- `validation`

### 2.3 NodeIR.v1
Minimum fields:
- `node_id`, `title`
- `content_blocks`: list[Block]
- `deps`: {parents, children, references}
- `status`: empty|draft|final

Extended optional fields (Phase 1 foundation):
- `node_type`
- `summaries`
- `constraints`
- `alignment`
- `dependencies`
- `generation_state`
- `provenance`
- `review_state`

### 2.4 StrategyInput.v1
What ContextBuilder produces:
- `node_id`, `node_title`
- `resolved_constraints`
- `dependency_summaries` (optional MVP-lite)
- `terminology_snapshot` (optional)
- `existing_content` (if regenerate)

### 2.4a ArtifactNodeRef.v1
Minimum fields:
- `artifact_id`
- `node_id`
- `title`

### 2.4b ResolvedConstraints.v1
Minimum fields:
- `node_id`
- `effective_constraints`
- `resolution_trace` (optional MVP-lite)

### 2.5 StrategyPlan.v1
What StrategySelector produces:
- `mode`: outline_then_expand|rewrite|repair (MVP: outline_then_expand + rewrite)
- `prompt_template_id`
- `llm_params`: {provider, model, temperature, max_output_tokens, supports_json_schema?}

### 2.6 LLMResponse.v1 (schema-validated)
**Critical**: LLM outputs **actions**, not raw prose.

Minimum fields:
- `actions`: list[Action]

Actions (MVP):
- `set_node_content` {action_id, node_id, markdown}
- `append_block` {action_id, node_id, markdown}
- `replace_block` {action_id, node_id, markdown, block_index?|block_id?}

Phase 1 additive actions:
- `set_node_title` {action_id, node_id, title}
- `propose_split` {action_id, node_id, children[]}
  - child shape: `{node_id, title, node_type?}`
  - deterministic apply creates child nodes, links parent/child deps, and inserts children in outline order.

Idempotency note:
- `action_id` must be stable within one response.
- apply layer computes deterministic `apply_idempotency_key` from normalized actions + run context.

### 2.6a ValidatedLLMResponse.v1
Minimum fields:
- `actions`: list[Action] (schema-validated, normalized)
- `schema_id`
- `validated_at`

### 2.7 ChangeEvent.v1
Minimum fields:
- `event_id`, `artifact_id`, `node_id`
- `operation`
- `applied_actions` (normalized)
- `before_hash`, `after_hash`
- `created_at`
- `run_id`, `step_id`

### 2.8 ValidationReport.v1
Minimum fields:
- `ok`: bool
- `errors`: list[{code, message, node_id?}]
- `warnings`: list[{code, message, node_id?}]

Additive fields implemented:
- `competency_evidence`: list of per-spec evaluation evidence objects
  - `method=required_phrases`: includes `missing_phrases`, `passed`
  - `method=checklist`: includes `passed_items`, `total_items`, `pass_rate`, `threshold`, `missing_items`, `passed`

MVP checks:
- response schema valid
- node referenced exists
- markdown non-empty for set/replace
- terminology drift
- content target constraints (`min/max chars`, `min/max blocks`) when provided
- cross-reference integrity for `deps.references` and `deps.children`
- competency spec evaluation (required phrases + checklist mode)

### 2.9 CompiledBundle.v1
Minimum fields:
- `targets`: map target -> ArtifactRef
Targets (MVP): `md`
Optional: `docx`

### 2.10 CompilerPlugin.v1
Compiler interface contract:
- `target`: string identifier (e.g., `md`, `docx`, `owl`)
- `compile(ir, request) -> compiled artifact`
- must declare output media type

MVP targets:
- implemented: `md`, `docx` (minimal), `owl` (minimal RDF/XML)

---

## 3) Error codes (starter set)
- `TRANSIENT` (retryable)
- `RATE_LIMIT` (retryable)
- `LLM_TIMEOUT` (retryable)
- `SCHEMA_INVALID` (not retryable unless you choose “repair loop”)
- `APPLY_CONFLICT` (not retryable; requires regeneration/plan change)
- `LOCK_CONFLICT` (not retryable; node is already locked by another run)
- `VALIDATION_FAILED` (not retryable; requires repair)
- `COMPILATION_FAILED` (depends; often retryable if transient IO)

---

## 4) Versioning rules (MVP)
- PipelineDefinition version pins:
  - step type ids + versions
  - validator schema ids
  - compiler target versions
- ArtifactIR loading:
  - stored payloads are migrated through a registry to latest supported IR version before parsing
  - missing migration paths fail fast
- LLM call records:
  - provider, model, prompt_template_id, prompt hash, and request correlation id
