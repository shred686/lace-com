# LACE Implementation Backlog

This backlog is prioritized by delivery value per effort, with a concrete "Done Test" for every item.

## Verification Evidence

- Sync run (2026-02-12):
  - Command:
    - `python3 -m unittest tests.unit.domain.steps.test_validate_artifact_step tests.unit.domain.steps.test_source_selector_step tests.unit.domain.steps.test_strategy_selector_step tests.unit.domain.steps.test_intent_parser_step tests.unit.domain.steps.test_llm_call_step tests.unit.domain.steps.test_context_builder_step tests.unit.domain.compilers.test_compiler_registry tests.e2e.test_real_llm_master_e2e`
  - Result:
    - `Ran 60 tests ... OK`
- Last proof run (2026-02-12):
  - Command:
    - `python3 -m unittest tests.unit.domain.steps.test_validate_llm_step tests.unit.domain.steps.test_validate_artifact_step tests.unit.domain.steps.test_intent_parser_step tests.unit.domain.steps.test_llm_call_step tests.unit.domain.llm.test_provider_http_adapters tests.unit.domain.strategies.test_registry tests.unit.domain.compilers.test_compiler_registry`
  - Result:
    - `Ran 61 tests ... OK`
- Regression run (2026-02-12):
  - Command:
    - `python3 -m unittest discover -s tests/unit/domain -p 'test_*.py'`
  - Result:
    - `Ran 109 tests ... OK`
- P1 block stability proof run (2026-02-12):
  - Command:
    - `python3 -m unittest tests.unit.domain.steps.test_deterministic_apply_step.TestDeterministicApplyStep.test_equivalent_regeneration_keeps_stable_block_ids tests.unit.domain.steps.test_deterministic_apply_step.TestDeterministicApplyStep.test_patch_can_target_stable_block_id_after_equivalent_regeneration`
  - Result:
    - `Ran 2 tests ... OK`
- P1 strategy mode proof run (2026-02-12):
  - Command:
    - `python3 -m unittest tests.unit.domain.steps.test_llm_call_step tests.unit.domain.steps.test_strategy_selector_step tests.integration.test_intake_intent_selection_pipeline`
  - Result:
    - `Ran 14 tests ... OK`
- Integration regression run (2026-02-12):
  - Command:
    - `python3 -m unittest discover -s tests/integration -p 'test_*.py'`
  - Result:
    - `Ran 9 tests ... OK`
- P1 retrieval proof run (2026-02-12):
  - Command:
    - `python3 -m unittest tests.unit.domain.steps.test_source_selector_step tests.unit.domain.steps.test_context_builder_step`
  - Result:
    - `Ran 8 tests ... OK`

## P0 - Must Ship Before Trusting Live Runs

1. Strict JSON transport enforcement for LLM responses
- Priority: P0
- Effort: M
- Status: Done (2026-02-12)
- Scope:
  - Default to strict JSON mode (reject fenced/wrapped output).
  - Allow explicit repair mode only when configured.
- Done Test:
  - `tests/unit/domain/llm/test_provider_http_adapters.py`
    - strict mode rejects fenced JSON payloads.
    - repair mode accepts fenced JSON payloads.
  - `tests/unit/domain/steps/test_llm_call_step.py`
    - default mode is `strict`.
    - configured mode `repair` is honored and traceable in metrics.

2. Duplicate heading suppression in markdown compile
- Priority: P0
- Effort: S
- Status: Done (2026-02-12)
- Scope:
  - Remove duplicate leading heading in first content block when compiler already emits node heading.
- Done Test:
  - `tests/unit/domain/compilers/test_compiler_registry.py::test_markdown_compiler_strips_duplicate_leading_heading`

3. Citation intent inference from real prompt language
- Priority: P0
- Effort: S
- Status: Done (2026-02-12)
- Scope:
  - Infer `must_cite=true` for prompts containing "evidence", "from sources", "traceable", etc.
  - Preserve explicit override if `source_constraints.must_cite` is set.
- Done Test:
  - `tests/unit/domain/steps/test_intent_parser_step.py::test_infers_must_cite_from_evidence_and_source_language`

4. Output token cap alignment with computed budget
- Priority: P0
- Effort: S
- Status: Done (2026-02-12)
- Scope:
  - If `max_tokens` is not explicitly provided, use `budget_estimate.estimated_output_tokens` for `llm_params.max_output_tokens`.
- Done Test:
  - `tests/unit/domain/strategies/test_registry.py::test_uses_budget_estimated_output_tokens_when_no_explicit_max`
  - `tests/unit/domain/strategies/test_registry.py::test_explicit_max_tokens_overrides_budget_estimate`

5. Hard citation/evidence enforcement in validation when `must_cite=true`
- Priority: P0
- Effort: M
- Status: Done (2026-02-12)
- Scope:
  - Enforce citation markers and/or evidence map in generated content.
  - Fail validation if citation contract missing.
- Done Test:
  - Add `tests/unit/domain/steps/test_validate_artifact_step.py` coverage:
    - fails for missing citations when `must_cite=true`.
    - passes with valid citation-bearing output.

6. Tighten LLM response schema contract (top-level and action-level)
- Priority: P0
- Effort: M
- Status: Done (2026-02-12)
- Scope:
  - Remove permissive `additionalProperties` where not needed.
  - Enforce expected top-level keys and action payload shape.
- Done Test:
  - Extend `tests/unit/domain/steps/test_validate_llm_step.py`:
    - rejects unexpected top-level keys.
    - rejects unexpected action keys for canonical action types.

## P1 - Quality and Scalability

Change record (2026-02-14):
- File: `docs/spec/IMPLEMENTATION_BACKLOG.md`
- Updated lines (approx): `115-124`
- Change: Updated the P1 reference note to point to the schema-first, domain-pipeline-extensible execution backlog:
  - `docs/todo/PROPOSAL_QUALITY_EXECUTION_BACKLOG.md`
  - Added completion note for Phase 4/5 quality hardening now tracked in that backlog:
    - numeric-claim grounding enforcement
    - cross-node redundancy indexing + objective-loop redundancy gates
    - live-run runtime gating notes (constraint/profile dependent fail-closed behavior)

Reference:
- Artifact quality execution plan (schema-first, domain-pipeline extensible):
  - `docs/todo/PROPOSAL_QUALITY_EXECUTION_BACKLOG.md`

7. Stable semantic block IDs + markdown block splitting
- Priority: P1
- Effort: L
- Status: Done (2026-02-12)
- Scope:
  - Stable IDs across regenerations.
  - Split generated markdown into structured blocks for patchability.
- Done Test:
  - Extend `tests/unit/domain/steps/test_deterministic_apply_step.py`:
    - block IDs remain stable across equivalent regenerations.
    - patch actions can target stable IDs after regeneration.

8. Realize or rename `outline_then_expand` strategy semantics
- Priority: P1
- Effort: M
- Status: Done (2026-02-12)
- Scope:
  - Implement true multi-pass outline+expand.
  - Enforce no-split behavior by suppressing split actions and forcing single-pass generation when `no_split=true`.
  - Expose split suppression rationale in strategy metrics.
- Done Test:
  - `tests/unit/domain/steps/test_strategy_selector_step.py`
    - auto-budget generate path emits `mode=outline_then_expand` when within threshold.
    - split suppression metrics include `split_allowed=0` and `split_suppressed_reason=user_requested_no_split`.
  - `tests/unit/domain/steps/test_llm_call_step.py`
    - `outline_then_expand` executes two LLM passes with phase-specific prompts.
    - `outline_then_expand` uses single pass when `no_split` is enforced.
    - no-split instruction is included in the final system prompt.
  - `tests/integration/test_intake_intent_selection_pipeline.py`
    - pipeline run records `llm_call.metrics.llm_pass_count = 2` for forced `outline_then_expand`.

9. Retrieval upgrade (hybrid + rerank)
- Priority: P1
- Effort: L
- Status: Done (2026-02-12)
- Scope:
  - Improve coverage on semantic prompt topics currently missed by keyword ranker.
- Done Test:
  - `tests/unit/domain/steps/test_source_selector_step.py`
    - selector provenance reports hybrid+rerank method.
    - improved recall for known semantic terms (`concise`, `readable`, `concrete`, `controls`) with reduced `missing_topics`.

10. Traceability claim guardrails
- Priority: P1
- Effort: M
- Status: Done (2026-02-12)
- Scope:
  - Flag unsupported assurance claims (for example "full traceability") if evidence map absent.
  - Warn when absolute claims are present without requirement-ID mapping.
- Done Test:
  - `tests/unit/domain/steps/test_validate_artifact_step.py`:
    - `test_warns_on_absolute_claim_without_requirement_ids`

11. Clarify versioning semantics (`version` vs `artifact_revision`)
- Priority: P1
- Effort: S
- Status: Planned
- Scope:
  - Contract/docs cleanup so schema version and mutable revision are unambiguous.
- Done Test:
  - `tests/unit/domain/steps/test_deterministic_apply_step.py` + docs lint/check:
    - expected version semantics asserted and documented.

12. OWL export strategy hardening
- Priority: P1
- Effort: L
- Status: Done (2026-02-12)
- Scope:
  - Mark current OWL output as explicit metadata stub in ontology output.
- Done Test:
  - `tests/unit/domain/compilers/test_compiler_registry.py`:
    - `test_owl_compiler_emits_structural_relations` asserts `lace:exportStub` is present.

13. Debug trace prompt transparency
- Priority: P1
- Effort: S
- Status: Done (2026-02-12)
- Scope:
  - In `--report-mode debug`, emit exact final system prompt and serialized user prompt as first-class report sections.
  - Order prompt sections before raw model response for easier debugging.
- Done Test:
  - `python3 -m unittest tests.e2e.test_real_llm_master_e2e`
  - `rg -n "^===== FILE: llm_call\\.final_(system|user)_prompt|^===== FILE: llm_call\\.output\\.llm_response" .lace/reports/live_e2e_trace_latest.txt`

14. Prompt payload streamlining for `llm_call.user_prompt`
- Priority: P1
- Effort: M
- Status: Done (2026-02-18)
- Scope:
  - Reduce oversized serialized `user_prompt` payload to the minimum fields required for model quality and determinism.
  - Preserve full fidelity in trace artifacts while sending a compact prompt body to provider.
  - Add explicit budgeting caps for prompt sections and truncation telemetry.
  - Add deterministic "no blob passing" validator for provider payloads:
    - reject (or warn outside strict mode) when payload includes full registries, full chunk lists, full outline trees, or full template documents.
    - require references + ranked slices + manifest IDs instead.
- Done Test:
  - `tests/unit/domain/steps/test_llm_call_step.py`:
    - compact prompt excludes non-essential duplicated sections.
    - required fields (constraints, sources, requirement IDs, target node context) remain present.
    - payload validator rejects blob-heavy prompt payloads in strict mode.
  - `tests/e2e/test_real_llm_master_e2e.py`:
    - debug report shows reduced prompt size with unchanged schema-valid action output.
    - debug report can include full trace artifacts while provider payload remains compact.

15. Dependency-aware node scheduling and generation order policy
- Priority: P1
- Effort: L
- Status: Done (2026-02-17)
- Scope:
  - Define and implement a deterministic node execution policy for recursive generation when dependency metadata is present.
  - Support DAG/topological scheduling so prerequisite nodes run before dependent nodes.
  - Keep parallelism for independent subtrees while blocking nodes with unmet dependencies.
  - Define behavior for dependency cycles (detect, fail fast, and emit actionable diagnostics).
  - Document ordering guarantees for both dependency-aware and dependency-free runs.
- Done Test:
  - Add `tests/integration/test_auto_recursive_generation.py` coverage:
    - dependent node does not run before all required dependencies are generated.
    - independent siblings can still run in parallel.
    - cyclic dependency graph fails with explicit validation/scheduling error.
  - Add `tests/unit` scheduler coverage:
    - topological ordering is deterministic.
    - queue behavior is stable under mixed split + dependency constraints.

## P0/P1 Additions - Source Author + Target Template (2026-02-17)

### Redesign Contract: Recursive Tool Orchestration (Must Implement)

This redesign is explicitly **not** a single linear pass. It is a bounded recursive engine with two nested loops:

- **Loop A (artifact recursion):** root -> child -> grandchild node execution.
- **Loop B (intra-node repair):** generate -> validate -> repair/regenerate until pass or budget/attempt cap.

Execution model requirement:

1. **Global tools run once (or infrequently) per artifact run**
- `INGEST_SOURCES (D)`
- `BUILD_EVIDENCE_INDEX (A/D)`
- `EXTRACT_SEMANTICS (LLM)`:
  - requirements/constraints/competency specs
  - terminology/entities/canonical facts
  - optional semantic links
- `BUILD_TARGET_TEMPLATE (LLM)` when template role exists
- `SELECT/BUILD_STRUCTURE (LLM)`
- `PLAN_OUTLINE + NODE_BRIEFS + DEPENDENCIES (LLM)` initial decomposition

2. **Per-node recursive toolchain runs for every node**
- `BUILD_CONTEXT (D)` with strict token packing and ranked refs (no blob flooding)
- `SELECT_STRATEGY (D/A)`
- `GENERATE_CONTENT (LLM)`
- `VALIDATE_RESPONSE (D)`
- `APPLY (D)`
- `VALIDATE_NODE (H)`
- Optional branch decisions from orchestrator:
  - split further
  - retrieve more evidence
  - regenerate/patch
  - mark failed after bounded attempts

3. **Artifact-level gate runs periodically/finally**
- `VALIDATE_ARTIFACT (H)` (intent-gated or final hard gate)
- `COMPILE (D)` only on pass or explicitly allowed draft mode

4. **Guardrails**
- Max node iterations (repair loop cap)
- Max recursion depth / max nodes
- Deterministic context budget allocator
- Deterministic state mutation ownership (LLM never owns state writes)

Required redesign invariants:

- Every successful generated node must persist:
  - `content_blocks[]`
  - `summaries.short`
  - requirement/evidence refs
  - `alignment`
  - `review_state`
  - `generation_state in {"validated","final"}`
- Parent nodes must be summarizable from validated children.
- Global intent must influence every node via packed context.
- Context must pass references and ranked slices, not full registries/blobs.

Failure behavior requirement:

- Dependency cycles must fail fast with explicit diagnostics.
- Validation failures must feed deterministic repair decisions.
- No unbounded loops.

16. SOURCE_AUTHOR canonical model (document + chunk, multi-assignment)
- Priority: P0
- Effort: M
- Status: Done (2026-02-18)
- Scope:
  - Introduce canonical source-author identities with deterministic IDs:
    - `kind`: `person | position | org_unit | entity`
    - `label`, `aliases`, `confidence`, `provenance`
  - Support one-to-many assignment at both levels:
    - whole document (`source.authors[]`)
    - chunk/unit (`source_unit.authors[]`)
  - Persist registry index in IR:
    - `ir.registry.source_authors`
    - reverse links from author -> source units
  - Preserve and migrate existing `doc_meta.author`, `author_role`, `org`, `dept` into canonical representation.
- Where to wire:
  - `src/lace/domain/steps/source_ingest.py`
  - `src/lace/domain/steps/source_selector.py`
  - `src/lace/domain/steps/context_builder.py`
  - `src/lace/domain/validators/source_unit_schema.json`
  - `src/lace/domain/validators/source_ingest_report_schema.json`
  - `src/lace/domain/validators/artifact_ir_schema.json`
- Done Test:
  - Add `tests/unit/domain/steps/test_source_ingest_step.py` coverage:
    - source authors are emitted for both document and chunk contexts.
    - multiple authors can be attached to one chunk.
  - Add `tests/unit/domain/steps/test_source_selector_step.py` coverage:
    - role/person/org/dept style requests resolve via canonical source-author links.

17. Style-by-author contract propagation ("in the style of the CEO")
- Priority: P1
- Effort: M
- Status: Done (2026-02-18)
- Scope:
  - Convert user prompt + intent into explicit style-author targets:
    - `position` (for example CEO, CTO)
    - `person` (named individual)
    - `org_unit/entity` (for example Legal Department)
  - Ensure style-author constraints are propagated through:
    - `intent` -> `source_selection` -> `context_bundle` -> final LLM prompt
  - Add optional strict mode:
    - fail validation when requested style-author evidence is absent.
- Where to wire:
  - `src/lace/domain/steps/intent_parser.py`
  - `src/lace/domain/steps/source_selector.py`
  - `src/lace/domain/steps/context_builder.py`
  - `src/lace/domain/steps/llm_call.py`
  - `src/lace/domain/steps/validate_artifact.py`
- Done Test:
  - Add `tests/unit/domain/steps/test_intent_parser_step.py`:
    - prompt "in the style of the CEO" produces style-author target.
  - Add `tests/unit/domain/steps/test_context_builder_step.py`:
    - context bundle includes resolved style-author evidence citations.
  - Add `tests/unit/domain/steps/test_validate_artifact_step.py`:
    - strict style-author mode fails when no matching evidence exists.

18. Master document target-template contract ("target format" source role)
- Priority: P0
- Effort: L
- Status: Planned
- Scope:
  - Add explicit source roles:
    - `knowledge_base`, `constraints`, `competency_spec`, `rules`, `target_template`
  - Support a master document/template source that defines output contract:
    - required section/order skeleton
    - required block types/placeholders/tables
    - formatting and structure anchors
    - minimal slot model:
      - `slot_id`
      - `slot_type` (`paragraph|table|list|bullets` in v1)
      - `required: bool`
      - `hints`
      - optional `evidence_required: bool`
  - Persist contract in IR generation state:
    - `ir.generation.target_template_contract`
  - Enforce contract deterministically in planning/apply/compile.
- Where to wire:
  - `src/lace/domain/steps/source_ingest.py` (role tagging + extraction bootstrap)
  - `src/lace/domain/steps/populate_outline_plan.py`
  - `src/lace/domain/steps/lock_outline_plan.py`
  - `src/lace/domain/steps/plan_artifact.py`
  - `src/lace/domain/steps/deterministic_apply.py`
  - `src/lace/domain/steps/compiler.py`
  - `src/lace/domain/validators/source_unit_schema.json`
  - `src/lace/domain/validators/artifact_ir_schema.json`
  - `src/lace/domain/validators/outline_plan_schema.json`
- Done Test:
  - Add `tests/unit/domain/steps/test_source_ingest_step.py`:
    - target template role is detected and contract extracted.
  - Add `tests/unit/domain/steps/test_populate_outline_plan_step.py`:
    - required template sections are enforced in outline draft.
    - slot requirements are materialized into node briefs/context constraints.
  - Add `tests/unit/domain/steps/test_compiler_step.py`:
    - compiled output preserves template ordering constraints.

19. Template conformance validation gate
- Priority: P1
- Effort: M
- Status: Planned
- Scope:
  - Add validation checks for template conformance:
    - missing required sections
    - missing required slots/placeholders
    - ordering violations
  - Surface conformance evidence in quality report and objective loop.
- Where to wire:
  - `src/lace/domain/steps/validate_artifact.py`
  - `src/lace/app.py` objective evaluation plumbing
  - `src/lace/domain/validators/validation_report_schema.json`
- Done Test:
  - Add `tests/unit/domain/steps/test_validate_artifact_step.py`:
    - conformance violations are reported with actionable codes.
    - slot-level violations include `slot_id` and expected slot type in findings.
  - Add `tests/integration/test_generate_pipeline_e2e.py`:
    - run fails when template-conformance gate is enabled and violated.

20. Recursive orchestrator implementation (global-once + node recursion + repair loop)
- Priority: P0
- Effort: L
- Status: Planned
- Scope:
  - Implement explicit orchestrator control flow:
    - `run_artifact(root_id)`
    - `run_node(node_id)` recursive
    - `decide_split_or_generate(node)`
    - `build_context_pack(node)` deterministic bounded packing
    - `repair_loop(node)` bounded retries
  - Separate global/infrequent tools from per-node tools.
  - Add deterministic branch decisions for:
    - split required
    - more evidence required
    - regenerate required
    - fail terminal
  - Preserve existing guardrails (`max_nodes`, dependency blockers) and extend with per-node iteration caps.
- Where to wire:
  - `src/lace/app.py` recursive orchestration paths
  - `src/lace/domain/steps/context_builder.py`
  - `src/lace/domain/steps/validate_artifact.py`
  - pipeline wiring in `pipelines/lace.GenerateNodeContentPipeline.yaml`
- Done Test:
  - Add `tests/integration/test_auto_recursive_generation.py`:
    - root->children recursion executes deterministically.
    - node-level repair loop exits on pass/fail cap.
    - dependency-cycle path fails with explicit diagnostics.
    - split/generate decisions emit explicit reasons and complexity estimates in trace.
  - Add `tests/integration/test_outline_recursive_and_longform.py`:
    - parent summary is produced from validated children.
  - Add `tests/integration/test_quality_scorecard_loop.py`:
    - bounded remediation loop respects max passes and gating.
    - apply->validate ordering is visible in run trace for each mutation loop.

21. Tool contract model in pipeline definitions (StepSpec extension)
- Priority: P0
- Effort: M
- Status: Planned
- Scope:
  - Extend tool/step contracts to declare:
    - `tool_name`, `tool_description`, `mandatory`
    - `preconditions[]`, `postconditions[]`
    - `skip_when` (advisory + optional machine predicate)
    - `max_iterations`
    - `reads[]`, `writes[]`
    - `cost_hint`
  - Enforce contract boundaries at runtime (especially `writes[]`).
- Where to wire:
  - `src/lace/pipeline/definition.py`
  - `src/lace/pipeline/runtime.py`
  - `src/lace/domain/steps/bootstrap.py`
  - `pipelines/lace.GenerateNodeContentPipeline.yaml`
- Done Test:
  - Add `tests/unit/pipeline/test_definition.py`:
    - extended fields parse and validate.
  - Add `tests/unit/pipeline/test_runtime_features.py`:
    - runtime rejects writes outside declared `writes[]`.

22. Global control-plane artifacts and schemas (`GlobalIntent`, `DocumentRoleMap`, EvidenceIndex, optional EvidenceGraph v1)
- Priority: P0
- Effort: L
- Status: Planned
- Scope:
  - Add typed schema artifacts for:
    - `GlobalIntent`
    - `DocumentRoleMap`
    - `EvidenceIndex` (required): chunk store, ranked retrieval indices, provenance anchors, manifest IDs
    - EvidenceGraph v1 (optional): semantic edges with provenance
  - Persist and reuse these artifacts across node recursion.
  - Add deterministic merge precedence for overrides:
    - `intent_overrides > inferred_intent > defaults`
  - Require EvidenceIndex availability when strict citation mode is active.
- Where to wire:
  - `src/lace/domain/validators/` (new schemas)
  - `src/lace/domain/steps/intent_parser.py`
  - `src/lace/domain/steps/source_ingest.py`
  - `src/lace/domain/steps/context_builder.py`
  - `src/lace/domain/storage.py`
- Done Test:
  - Add `tests/unit/domain/steps/test_intent_parser_step.py`:
    - global intent schema validation + override precedence.
  - Add `tests/unit/domain/steps/test_source_ingest_step.py`:
    - document role map emits multi-role confidence + provenance hooks.
    - EvidenceIndex manifest contains chunk/provenance anchors required for strict citation mode.

23. Mandatory gate ordering enforcement (apply->validate->compile + strict intent gates)
- Priority: P0
- Effort: M
- Status: Planned
- Scope:
  - Enforce gate ordering deterministically:
    - content mutation requires apply before validation
    - validation must pass before compile unless draft mode explicitly allowed
  - Enforce strict intent gates:
    - citation-required implies evidence/provenance path availability
    - requirement-mapping-required implies extraction+coverage presence
  - Add explicit draft-mode bypass signal in outputs and traces.
- Where to wire:
  - `src/lace/pipeline/runtime.py`
  - `src/lace/domain/steps/validate_artifact.py`
  - `src/lace/domain/steps/compiler.py`
  - `src/lace/app.py`
- Done Test:
  - Add `tests/integration/test_status_and_compile.py`:
    - compile blocked when validation fails without draft allowance.
  - Add `tests/integration/test_generate_pipeline_e2e.py`:
    - strict citation/requirement intent gates are enforced.

24. Formal NodeIR state machines (`generation_state`, `review_state`) with transition invariants
- Priority: P0
- Effort: M
- Status: Planned
- Scope:
  - Implement explicit transition table for `generation_state`:
    - `empty -> planned -> context_ready -> drafted -> enriched -> validated -> compiled`
    - `* -> failed` terminal on hard fail
  - Implement explicit transition table for `review_state`:
    - `unreviewed -> auto_reviewed -> needs_revision|approved|rejected`
  - Reset rules:
    - any content mutation resets stale review/validation state
  - Add deterministic node dirty flags:
    - `content_dirty`
    - `context_dirty` (relevant requirements/constraints/dependencies changed)
    - `validation_dirty`
    - `summary_dirty`
  - Dirty flag rules:
    - any apply sets `content_dirty`, `validation_dirty`, `summary_dirty`
    - relevant context dependency changes set `context_dirty`
    - successful validation/summary clears corresponding flags
  - Persist transition metadata:
    - before/after state, event, timestamp, reason, provenance
- Where to wire:
  - `src/lace/domain/steps/context_builder.py` (`context_ready`)
  - `src/lace/domain/steps/deterministic_apply.py`
  - `src/lace/domain/steps/validate_artifact.py`
  - `src/lace/domain/steps/compiler.py`
  - `src/lace/domain/validators/artifact_ir_schema.json`
- Done Test:
  - Add `tests/unit/domain/steps/test_deterministic_apply_step.py`:
    - mutation transitions and reset behavior.
    - dirty flags are set/cleared deterministically on apply/validate/summary events.
  - Add `tests/unit/domain/steps/test_validate_artifact_step.py`:
    - review-state transitions with findings and thresholds.

25. Backward compatibility rollout modes (fixed/advisory/enforced)
- Priority: P1
- Effort: M
- Status: Planned
- Scope:
  - Support staged rollout:
    - `fixed` mode: existing linear pipeline behavior
    - `advisory` mode: orchestrator emits ToolCallPlan but runtime logs-only
    - `enforced` mode: ToolCallPlan drives execution
  - Add explicit mode to run metadata and status output.
- Where to wire:
  - `src/lace/app.py`
  - `src/lace/cli.py`
  - `src/lace/pipeline/runtime.py`
- Done Test:
  - Add `tests/unit/test_cli_run_modes.py`:
    - mode flags map to expected runtime behavior.
  - Add `tests/integration/test_intake_intent_selection_pipeline.py`:
    - advisory mode emits plan without execution drift.

26. Security guardrails for tool writes and mutation safety
- Priority: P0
- Effort: M
- Status: Planned
- Scope:
  - Enforce IR write-surface restrictions per tool contract.
  - Reject undeclared mutation attempts with deterministic errors.
  - Preserve immutable audit trail for rejected writes.
- Where to wire:
  - `src/lace/pipeline/runtime.py`
  - `src/lace/domain/steps/deterministic_apply.py`
  - `src/lace/pipeline/stores.py`
- Done Test:
  - Add `tests/unit/pipeline/test_runtime_features.py`:
    - undeclared writes are blocked.
  - Add `tests/unit/pipeline/test_stores.py`:
    - rejection events are persisted in trace.

27. ContextPackPlan (D) and ContextPack (D) bridge artifacts
- Priority: P0
- Effort: M
- Status: Planned
- Scope:
  - Add first-class deterministic planning artifact:
    - `ContextPackPlan`: category budgets, top-k limits, ranking policy, selected IDs/manifests
  - Add first-class materialized payload artifact:
    - `ContextPack`: packed slices only + inclusion manifest IDs
  - Make orchestrator consume plan artifacts rather than raw blobs.
- Where to wire:
  - `src/lace/domain/steps/context_builder.py`
  - `src/lace/domain/validators/` (new context pack plan schema)
  - `src/lace/domain/validators/context_bundle_schema.json`
- Done Test:
  - Add `tests/unit/domain/steps/test_context_builder_step.py`:
    - context packs never exceed token budget allocations.
    - manifests include only ranked slice IDs.
    - provider-facing payload excludes raw registry/chunk blobs.

28. NodeRunPlan (LLM) and NodeRunDecision (D gate) bridge artifacts
- Priority: P0
- Effort: M
- Status: Planned
- Scope:
  - Add per-node orchestration plan artifact from LLM:
    - split/generate/repair tool suggestions for current node
  - Add deterministic gate artifact:
    - `NodeRunDecision` validates legality against contracts, gates, and state
  - Enforce legal ordering regardless of LLM suggestion.
- Where to wire:
  - `src/lace/app.py` (recursive orchestration loop)
  - `src/lace/pipeline/runtime.py`
  - `src/lace/domain/validators/` (new node run plan/decision schemas)
- Done Test:
  - Add `tests/integration/test_auto_recursive_generation.py`:
    - illegal LLM plan ordering is rejected and replaced by legal deterministic decision.
  - Add `tests/unit/pipeline/test_runtime_features.py`:
    - compile-before-validate and generate-without-context decisions are blocked.

29. Explicit document role classification tool (foundational)
- Priority: P0
- Effort: M
- Status: Planned
- Scope:
  - Implement dedicated role classifier tool producing `DocumentRoleMap`:
    - multi-role labels, confidence by role, structured hooks, provenance
  - Ensure classifier outputs feed:
    - template extraction
    - requirements/constraints/competency extraction
    - style-by-author selection
- Where to wire:
  - `src/lace/domain/steps/source_ingest.py` (or dedicated new step module)
  - `src/lace/domain/steps/bootstrap.py`
  - `pipelines/lace.GenerateNodeContentPipeline.yaml`
- Done Test:
  - Add `tests/unit/domain/steps/test_source_ingest_step.py`:
    - classifier assigns multi-role outputs with confidence and provenance hooks.
  - Add `tests/integration/test_intake_intent_selection_pipeline.py`:
    - role map directly affects downstream tool selection.

### Trace Assertion Requirement (for recursion/orchestration/context changes)

Any backlog item that modifies orchestration, recursion, context packing, or validation gating MUST include trace assertions in tests for at least:

- `context_pack_token_breakdown` present
- `requirements_slice_count <= configured_k`
- `node_attempt_count <= max_node_iterations`
- split/generate decision includes reason + estimate
- apply->validate ordering observed
- compile blocked on failed validation unless draft mode is explicitly enabled

### Updated Execution Order (insertions)

1. Tool contracts (StepSpec extension: reads/writes/pre/post/cost)
2. Mandatory gate ordering enforcement (apply->validate->compile + strict intent gates)
3. State machines + dirty flags (`generation_state`, `review_state`, reset rules)
4. Control-plane schemas and persistence (`GlobalIntent`, `DocumentRoleMap`, required `EvidenceIndex`, optional `EvidenceGraph`)
5. Explicit document role classifier tool
6. Recursive orchestrator implementation (`run_artifact`/`run_node`/`repair_loop`)
7. ContextPackPlan + ContextPack bridge artifacts
8. NodeRunPlan + NodeRunDecision bridge artifacts
9. Target-template contract extraction (with minimal slot model)
10. Template conformance validation gate
11. Dependency-aware scheduler
12. Source author + style-by-author propagation
13. Prompt payload streamlining + no-blob validator
14. IR migrations hardening
