# LACE MVP Review and Bootstrap Plan

## Purpose and end goal (as interpreted)
- Build a deterministic, stateful engine that manages long-form artifact generation beyond single LLM call limits.
- Keep LLM usage stateless and contract-bound (action JSON), with all state/validation/apply/compilation in engine code.
- Reuse one generic pipeline runtime across verticals (document generation now, OWL/code generation later) by swapping domain step packs, validators, and compilers.

## Confirmed decisions (2026-02-11)
- Keep MVP storage simple: filesystem blobs + in-memory stores first.
- Add `action_id` now and support `block_id` (with `block_index` backward compatibility).
- Implement node-level locking immediately.
- Finalize compiler ABI now for `md`, `docx`, and `owl` targets.
- Keep LLM layer provider-neutral from the start.

## High-impact gaps in current docs

1. Contract drift between pipeline YAML and schema document
- `docs/spec/lace.GenerateNodeContentPipeline.yaml` references `lace.ArtifactNodeRef.v1`, `lace.ResolvedConstraints.v1`, and `lace.ValidatedLLMResponse.v1`.
- `docs/spec/SCHEMAS_CONTRACTS.md` does not define these contracts.
- Risk: immediate runtime/parser ambiguity and ad-hoc implementations.

2. Missing action identity and idempotency contract
- `LLMResponse.v1` actions do not define stable `action_id`.
- `TEST_STRATEGY.md` requires idempotency behavior, but no contract exists for dedupe/replay semantics.
- Risk: duplicate writes on retries, hard-to-debug replay behavior.

3. IR versioning and migration plan is underspecified
- `ArtifactIR.v1` has version field, but migration rules are not defined.
- Risk: early schema changes force broad refactors.

4. Node/block patch addressability is underdefined
- Actions use `block_index`, which is fragile across concurrent or iterative edits.
- Risk: apply conflicts and brittle regeneration.

5. Concurrency/locking semantics are not specified
- Architecture mentions lock behavior in `LoadArtifact`, but lock model (scope, TTL, stale lock policy) is unspecified.
- Risk: hard migration from single-run assumptions to safe multi-run behavior.

6. Validation gates are too coarse for future verticals
- Current docs list generic validation but no typed gate contract lifecycle (pre-apply, post-apply, compile-time, cross-artifact).
- Risk: vertical-specific rules get hardcoded into steps.

7. Compiler plugin ABI is missing
- Extensibility depends on swapping compilers, but no explicit compiler interface contract exists.
- Risk: document compiler assumptions leak into runtime, making OWL/code targets expensive to add.

8. Observability contracts are missing
- Metrics are mentioned but no required fields for step metrics, model usage, prompt hash linkage, or correlation IDs.
- Risk: difficult production diagnosis and cost analysis.

9. Storage abstraction is only partially specified
- Postgres and blob store are named, but table-level constraints/indexes and transaction boundaries are not documented.
- Risk: rewrite pressure when adding resume/retry correctness.

10. Docs index references stale paths
- `docs/spec/README_INDEX.md` points to `docs/...` and `pipelines/...` paths that do not match current tree exactly.
- Risk: onboarding confusion and tooling drift.

## Design decisions that avoid immediate refactors

1. Stabilize contracts first
- Add a contract file for every referenced `*.v1` type in pipeline YAML.
- Keep `v1` immutable; introduce `v1_1` / `v2` only through additive compatibility strategy.

2. Use stable block IDs now (not only indexes)
- Keep `block_index` for MVP compatibility, but add optional `block_id` and prefer it in deterministic apply.
- This enables robust patch semantics for regen and future collaboration.

3. Introduce `action_id` + apply idempotency key
- `action_id` in `LLMResponse`.
- `apply_idempotency_key = sha256(run_id + step_id + normalized_actions)`.
- Deterministic apply checks previous keys before mutating IR.

4. Formalize plugin ABI boundaries now
- Runtime plugins:
  - `Step` interface
  - `ValidatorGate` interface
  - `Compiler` interface (`compile(ir, request, validation_report) -> CompiledBundle`)
- Domain packs (docs/OWL/code) register these separately.

5. Separate runtime contracts from domain contracts
- `lace.pipeline.*` types are engine-level and must remain domain-agnostic.
- Domain schemas live in `lace.domain.<vertical>.*`.

6. Add migration hook points immediately
- `IRStore.load()` returns latest internal model, running migrations from stored version if needed.
- Keep migrators in a dedicated registry.

7. Model capability in strategy plan
- `StrategyPlan.llm_params` should include `supports_json_schema` and fallback handling fields.
- Prevent hardcoding to one provider behavior.

8. Add compile target registry
- `compiler_targets` is validated against runtime registry (`md` now, `owl`/`code` later).
- No compiler selection logic inside pipeline step bodies.

## Recommended MVP implementation phases

Phase 0 (done in this bootstrap commit)
- Repo scaffold with runtime contracts, parser, registry, and stores.
- Unit tests for definition parsing and content-addressed artifact store.

Phase 1 (next)
- Implement concrete steps:
  - `LoadArtifact`, `ResolveConstraints`, `ContextBuilder`, `StrategySelector`
  - `LLMCall` adapter with strict response capture
  - `ValidateLLMResponse`, `DeterministicApply`, `ValidationLayer`, `CompilerMd`
- Wire full pipeline execution with fake LLM in tests.

Phase 2
- Add RunStore persistence adapter (Postgres), migrations, and resume logic.
- Add structured logs and per-step metrics.

Phase 3
- Add compiler/validator registries and first alternative vertical:
  - `owl` compiler skeleton
  - ontology validation gates (syntax + reasoner adapter stub)

Phase 4
- Add repair-loop pipeline and DAG/fan-out support for module-level generation.

## Remaining decision

1. Which provider adapters should be implemented first in Phase 1 (`openai`, `anthropic`, both)?
