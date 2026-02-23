# LACE Backlog Execution Plan

This file tracks execution for `docs/spec/IMPLEMENTATION_BACKLOG.md` in strict dependency order.

## Sequenced Work Plan

1. [x] StepSpec tool contract extension (`tool_name`, `mandatory`, pre/post, `skip_when`, `max_iterations`, `reads`, `writes`, `cost_hint`) + runtime `writes[]` enforcement.
2. [x] Mandatory gate ordering enforcement (`apply -> validate -> compile`, strict intent gates, draft bypass signal).
3. [x] Formal NodeIR state machines + dirty-flag transitions.
4. [x] Control-plane artifacts and schemas (`GlobalIntent`, `DocumentRoleMap`, required `EvidenceIndex`, optional `EvidenceGraph`).
5. [x] Explicit document role classification tool.
6. [x] Recursive orchestrator (`run_artifact`/`run_node`/`repair_loop` with bounded branch decisions).
7. [x] `ContextPackPlan` + `ContextPack` artifacts and deterministic bounded packing.
8. [x] `NodeRunPlan` + deterministic `NodeRunDecision` gate.
9. [x] Target-template contract extraction and persistence.
10. [x] Template conformance validation gate and report plumbing.
11. [x] Dependency-aware scheduler/topological execution policy.
12. [x] Source-author canonical model + style-by-author propagation.
13. [x] Prompt payload streamlining + strict no-blob validator.
14. [x] IR migration hardening and compatibility pass.

## Completed In This Iteration

- Added `StepSpec.contract` parsing in `src/lace/pipeline/definition.py` with validation for:
  - `tool_name`, `tool_description`, `mandatory`, `preconditions`, `postconditions`
  - `skip_when` (advisory string and optional predicate mapping)
  - `max_iterations`, `reads`, `writes`, `cost_hint`
- Added runtime contract checks in `src/lace/pipeline/runtime.py`:
  - reject undeclared step outputs
  - reject produced writes outside declared `writes[]` patterns
- Added tests:
  - `tests/unit/pipeline/test_definition.py`
  - `tests/unit/pipeline/test_runtime_features.py`

## Completed In This Iteration (Task 2)

- Added mandatory gate ordering checks in `src/lace/pipeline/runtime.py`:
  - compile requires prior validation
  - validation requires prior apply
  - validation/compile refs must point to expected upstream outputs
- Added explicit draft compile bypass + signaling in `src/lace/domain/steps/compiler.py`:
  - `allow_draft_compile`/`draft_mode`/`compile_mode=draft` support
  - `bundle.compile_gate` output contract
  - compile gate metrics persisted in run traces
- Added strict intent gate integration coverage:
  - citation-required without sources fails
  - requirement-trace enforcement without extracted requirements fails

## Completed In This Iteration (Task 3)

- Added formal node state-machine helper in `src/lace/domain/state_machine.py`:
  - `generation_state` progression and reset handling
  - `review_state` transitions with threshold-based outcomes
  - deterministic dirty-flag management
  - transition metadata (`before_state`, `after_state`, `event`, `timestamp`, `reason`, `provenance`)
- Wired state transitions into execution steps:
  - `src/lace/domain/steps/context_builder.py` marks `context_ready`
  - `src/lace/domain/steps/deterministic_apply.py` applies mutation resets + dirty flags + summary refresh
  - `src/lace/domain/steps/validate_artifact.py` applies validation/review outcomes
  - `src/lace/domain/steps/compiler.py` persists `compiled` state when repository is available
  - `src/lace/domain/steps/bootstrap.py` now passes repository to compiler step
- Hardened node schema contract in `src/lace/domain/validators/artifact_ir_schema.json`:
  - typed `generation_state` / `review_state` contracts with enum states, dirty flags, and transition arrays

## Completed In This Iteration (Task 4)

- Added typed control-plane schemas in `src/lace/domain/validators/`:
  - `global_intent_schema.json`
  - `document_role_map_schema.json`
  - `evidence_index_schema.json` (required artifact)
  - `evidence_graph_schema.json` (v1)
- Wired deterministic intent merge precedence in `src/lace/domain/steps/intent_parser.py`:
  - `intent_overrides > inferred_intent > defaults`
  - emits and validates `global_intent`
  - persists `global_intent` through repository control-plane APIs
- Added control-plane generation/persistence in `src/lace/domain/steps/source_ingest.py`:
  - emits and validates `document_role_map`, `evidence_index`, `evidence_graph`
  - strict citation mode marks missing provenance anchors as warning when no sources are available
  - persists control-plane artifacts through repository control-plane APIs
- Added control-plane storage APIs in `src/lace/domain/storage.py`:
  - `load_control_plane_artifacts(...)`
  - `save_control_plane_artifacts(...)`
- Updated context payload wiring in `src/lace/domain/steps/context_builder.py`:
  - loads control-plane artifacts from IR metadata/repository/source selection
  - injects control-plane artifacts into `strategy_input` and `context_bundle`

## Completed In This Iteration (Task 5)

- Added dedicated role-classifier step:
  - `src/lace/domain/steps/document_role_classifier.py`
  - emits normalized/validated `DocumentRoleMap` and classification metrics
- Wired role-classifier into registry and pipeline:
  - `src/lace/domain/steps/bootstrap.py` registers `lace.DocumentRoleClassifier.v1`
  - `pipelines/lace.GenerateNodeContentPipeline.yaml` inserts `classify_document_roles` between ingest and source selection
- Wired downstream role-map influence in `src/lace/domain/steps/source_selector.py`:
  - consumes explicit `document_role_map` input
  - applies deterministic role-based source filtering for selection
  - uses role-map signals in style evidence candidate scoring when metadata role is missing
  - emits `role_map_influence_applied`/`role_map_matched_sources` metrics for traceability
- Added/updated tests:
  - `tests/unit/domain/steps/test_document_role_classifier_step.py`
  - `tests/unit/domain/steps/test_source_selector_step.py`
  - `tests/integration/test_intake_intent_selection_pipeline.py`

## Completed In This Iteration (Task 6)

- Extended recursive auto orchestrator in `src/lace/app.py` with bounded per-node repair loop:
  - added `max_node_iterations` parameter to `run_recursive_generation_auto(...)`
  - introduced per-node retry execution with generate->regenerate loop and terminal error classification
- Added explicit split/generate branch decision trace payloads:
  - deterministic `reason` and `complexity_estimate` for each completed node
  - surfaced in `progress_hook` node events and result `orchestration_trace`
- Added deterministic node-attempt telemetry:
  - per-node `node_attempt_count`
  - run-level `orchestration_trace.max_node_iterations`
- Hardened recursive failure detail reporting:
  - node-level validation details are attached when available (`validation_scope=node`, error/warning previews)
  - preserves explicit dependency-cycle diagnostics
- Added integration coverage in `tests/integration/test_auto_recursive_generation.py`:
  - split/generate decisions include reason and complexity estimate in trace/events
  - repair loop succeeds within iteration cap
  - repair loop stops at configured cap with deterministic failure details

## Completed In This Iteration (Task 7)

- Added deterministic context bridge artifacts in `src/lace/domain/steps/context_builder.py`:
  - `ContextPackPlan` with category budgets, top-k limits, ranking policies, and selected manifest IDs
  - `ContextPack` with bounded packed payload slices, inclusion manifest IDs, and token breakdown
- Wired strategy/context payloads to consume packed slices instead of raw blobs:
  - `strategy_input.source_selection` and `requirements_registry` now use packed slices
  - `strategy_input` now carries `context_pack_plan` and `context_pack`
  - `context_bundle` now includes context pack plan/pack summaries and trace fields:
    - `context_pack_token_breakdown`
    - `requirements_slice_count`
    - `requirements_configured_k`
- Hardened provider-facing control-plane payload in `src/lace/domain/steps/context_builder.py`:
  - removes raw `evidence_index.chunk_store`
  - keeps manifest/ranked-index/provenance summaries only
- Added/updated validation schemas in `src/lace/domain/validators/`:
  - `context_pack_plan_schema.json` (new)
  - `context_pack_schema.json` (new)
  - `context_bundle_schema.json` (updated)
  - `strategy_input_schema.json` (updated)
- Added unit coverage in `tests/unit/domain/steps/test_context_builder_step.py`:
  - context pack token breakdown respects category token allocations
  - manifests contain ranked slice IDs
  - provider-facing payload excludes raw chunk/blob fields

## Completed In This Iteration (Task 8)

- Added deterministic node orchestration bridge artifacts:
  - `lace.NodeRunPlan.v1` schema in `src/lace/domain/validators/node_run_plan_schema.json`
  - `lace.NodeRunDecision.v1` schema in `src/lace/domain/validators/node_run_decision_schema.json`
- Added runtime deterministic decision gate in `src/lace/pipeline/runtime.py`:
  - `build_node_run_decision(...)` validates legality against gate/order/state constraints
  - `enforce_node_run_decision(...)` blocks illegal decisions with deterministic errors
  - decision checks include:
    - compile-before-validate blocking
    - generate-without-context blocking
    - mixed split/generate suggestion normalization
  - wired new schema aliases into runtime type-schema map (`lace.NodeRunPlan.v1`, `lace.NodeRunDecision.v1`)
- Wired recursive orchestrator integration in `src/lace/app.py`:
  - per-node `NodeRunPlan` artifact emission from applied actions + node context
  - deterministic `NodeRunDecision` gate enforcement before split/generate branch execution
  - structured decision trace now includes:
    - `node_run_plans`
    - decision legality/replacement metadata (`violations`, `replacement_applied`, `node_run_plan_id`)
  - progress events include deterministic replacement signal (`decision_replacement_applied`)
- Added/updated tests:
  - `tests/integration/test_auto_recursive_generation.py`
    - illegal mixed LLM node plan is replaced by legal deterministic split decision
  - `tests/unit/pipeline/test_runtime_features.py`
    - compile-before-validate decisions are blocked
    - generate-without-context decisions are blocked

## Completed In This Iteration (Task 9)

- Added master target-template contract extraction in `src/lace/domain/steps/source_ingest.py`:
  - normalized source roles now include `knowledge_base|constraints|competency_spec|rules|target_template`
  - target-template sources are detected and transformed into:
    - ordered required sections
    - v1 slot model (`slot_id`, `slot_type`, `required`, `hints`, optional `evidence_required`)
  - emits `ingest_report.target_template_contract` and related metrics
- Wired contract propagation through planning and context:
  - `src/lace/domain/steps/source_selector.py` includes contract in control-plane payloads
  - `src/lace/domain/steps/populate_outline_plan.py` enforces required template section order in root outline drafts and materializes slot requirements into `node_specs`/`context_constraints`
  - `src/lace/domain/steps/lock_outline_plan.py` carries contract into locked `outline_plan` and lock hash material
  - `src/lace/domain/steps/context_builder.py` includes active `target_template_contract` in `profile_constraints`
  - `src/lace/domain/steps/plan_artifact.py` consults template sections for deterministic split synthesis and includes contract in emitted outline plans
- Persisted contract into IR generation state:
  - `src/lace/domain/steps/deterministic_apply.py` now writes `ir.generation.target_template_contract` (root runs) and records `target_template_contract_written` metric
  - locked-outline enforcement now validates split child ordering against locked order (not only set equality)
- Compiler ordering enforcement:
  - `src/lace/domain/compilers/markdown.py` applies `generation.target_template_contract.required_section_order` when traversing root children
- Updated schemas:
  - `src/lace/domain/validators/source_unit_schema.json`
  - `src/lace/domain/validators/source_ingest_report_schema.json`
  - `src/lace/domain/validators/source_selection_response_schema.json`
  - `src/lace/domain/validators/outline_plan_schema.json`
  - `src/lace/domain/validators/artifact_ir_schema.json`
- Added/updated tests:
  - `tests/unit/domain/steps/test_source_ingest_step.py`
    - target template role detection and contract extraction
  - `tests/unit/domain/steps/test_populate_outline_plan_step.py`
    - required template section enforcement in outline draft
    - slot requirements materialized into node spec context constraints
  - `tests/unit/domain/steps/test_compiler_step.py`
    - compiled markdown preserves template section ordering

## Completed In This Iteration (Task 10)

- Added template-conformance validation gate in `src/lace/domain/steps/validate_artifact.py`:
  - detects and evaluates `ir.generation.target_template_contract` (with outline-plan fallback)
  - validates:
    - missing required sections
    - missing required slots/placeholders
    - required section ordering violations
  - supports strict enforcement via:
    - `constraints.enforce_template_conformance=true`
    - alias `constraints.template_conformance_gate=true`
  - when enforcement is disabled, emits warnings; when enabled, emits blocking errors
  - slot-level findings include actionable fields:
    - `slot_id`
    - `expected_slot_type`
    - optional `section_id`
- Surfaced conformance evidence in validation outputs:
  - report now includes `template_conformance_findings`
  - `quality_evidence.template_conformance` now carries conformance summary metrics
  - added conformance telemetry metrics (`template_conformance_missing_sections`, `template_conformance_missing_slots`, ordering violations)
- Extended objective-loop plumbing in `src/lace/app.py`:
  - objective-set parser now accepts `template_conformance` objectives
  - objective evaluator now checks:
    - `max_missing_required_sections`
    - `max_missing_required_slots`
    - `max_ordering_violations`
  - added objective failure codes:
    - `OBJECTIVE_TEMPLATE_MISSING_SECTIONS`
    - `OBJECTIVE_TEMPLATE_MISSING_SLOTS`
    - `OBJECTIVE_TEMPLATE_ORDERING`
- Updated schema:
  - `src/lace/domain/validators/validation_report_schema.json`
    - added `template_conformance_findings`
- Added/updated tests:
  - `tests/unit/domain/steps/test_validate_artifact_step.py`
    - conformance violations reported with actionable codes
    - slot violations include `slot_id` + `expected_slot_type`
    - ordering violations reported
  - `tests/integration/test_generate_pipeline_e2e.py`
    - run fails when template-conformance gate is enabled and violated

## Completed In This Iteration (Task 11)

- Implemented deterministic dependency-aware scheduling in `src/lace/app.py`:
  - scheduler evaluates the full pending queue each cycle (not only initial slot count),
  - deterministic candidate ordering is based on dependency signature + node id,
  - prerequisites (`deps.parents` + `deps.references`) must be in `processed` before scheduling,
  - independent ready siblings are still dispatched in parallel up to `max_parallel_llm_calls`.
- Added explicit scheduling helpers:
  - `_load_dependency_index(...)`
  - `_plan_dependency_scheduling_cycle(...)`
  - `_dependency_blockers(...)` (index-backed blocker checks)
- Hardened cycle/deadlock detection:
  - only emits `DEPENDENCY_CYCLE` when no node can be scheduled from the full pending queue,
  - cycle details now remain deterministic from scheduler-ordered blocked nodes.
- Documented runtime ordering guarantees:
  - dependency-aware runs: deterministic topological dispatch over discovered nodes,
  - dependency-free runs: deterministic sibling ordering by node id with bounded parallel dispatch.
- Added/updated tests:
  - `tests/unit/test_app_recursive_scheduler.py`
    - deterministic topological scheduling order
    - stable queue behavior under mixed ready/blocked constraints
  - `tests/integration/test_auto_recursive_generation.py`
    - independent siblings start before first sibling completion (parallel dispatch)
    - cycle failure asserts blocked-node diagnostics include both participants

## Completed In This Iteration (Task 12)

- Implemented canonical source-author modeling in `src/lace/domain/steps/source_ingest.py`:
  - deterministic source-author IDs with normalized kinds:
    - `person | position | org_unit | entity`
  - emits author assignments at both levels:
    - document/source report (`sources[].authors`)
    - chunk/source unit (`source_units[].authors`)
  - builds and emits `source_author_registry` with reverse links to source IDs and source-unit IDs
  - persists source-author registry to:
    - control-plane metadata (`metadata.control_plane.source_author_registry`)
    - IR registry (`registry.source_authors`)
- Extended source selection to use canonical author links in `src/lace/domain/steps/source_selector.py`:
  - applies include-source influence from style-author targets via `source_author_registry`
  - resolves role/person/org/dept requests via canonical author matches even when legacy doc metadata is missing
  - adds source-author influence metrics:
    - `source_author_influence_applied`
    - `source_author_matched_sources`
- Extended style intent parsing and contract propagation in `src/lace/domain/steps/intent_parser.py`:
  - parses prompt phrases like `in the style of ...`
  - emits normalized `source_constraints.style_author_targets[]`
  - emits `source_constraints.style_author_mode` (`off|preferred|required`)
- Extended context + prompt propagation:
  - `src/lace/domain/steps/context_builder.py` now carries `source_author_registry` in control-plane summaries
  - `src/lace/domain/steps/llm_call.py` prompt payload now carries:
    - `sources.style_author_evidence[]`
    - `constraints.style_author_targets[]`
  - user prompt rendering now includes explicit style-author targets and evidence sections
- Added strict style-author validation in `src/lace/domain/steps/validate_artifact.py`:
  - when `style_author_mode=required`, validation fails if requested style-author targets have no matching source evidence
  - quality evidence now reports style-author coverage summary
- Updated schema contracts:
  - `src/lace/domain/validators/source_unit_schema.json` (adds `authors`)
  - `src/lace/domain/validators/source_ingest_report_schema.json` (adds `source_author_registry`)
  - `src/lace/domain/validators/source_selection_response_schema.json` (adds `source_author_registry`)
  - `src/lace/domain/validators/prompt_payload_schema.json` (adds style-author targets/evidence payload slices)
  - `src/lace/domain/validators/artifact_ir_schema.json` (documents `registry.source_authors`)
- Added/updated tests:
  - `tests/unit/domain/steps/test_source_ingest_step.py`
    - canonical source authors emitted for both document and chunk contexts
    - multi-assignment coverage
  - `tests/unit/domain/steps/test_source_selector_step.py`
    - role/person/org/dept style requests resolved through canonical source-author links
  - `tests/unit/domain/steps/test_intent_parser_step.py`
    - prompt `in the style of the CEO` produces style-author target contract
  - `tests/unit/domain/steps/test_context_builder_step.py`
    - context bundle includes resolved style-author evidence citations
  - `tests/unit/domain/steps/test_validate_artifact_step.py`
    - strict style-author mode fails when no matching evidence exists

## Completed In This Iteration (Task 13)

- Streamlined provider-facing prompt payload generation in `src/lace/domain/steps/llm_call.py`:
  - compact `strategy_output` projection now keeps only high-value planning hints/measurements
  - planning-memory custom props are flattened to scalar summaries (no nested object/list blobs)
- Added deterministic no-blob validator for provider prompt payloads in `src/lace/domain/steps/llm_call.py`:
  - strict mode rejects prompt payloads that include forbidden blob keys or oversized blob-like sections
  - warn mode records non-blocking validator findings in response notes/metrics
  - mode resolution supports `prompt_payload_no_blob_mode|no_blob_mode` (`strict|warn|off`) from constraints/policy/params
- Added explicit prompt payload budgeting telemetry:
  - payload fitting now records initial/final chars, max budget, truncation applied, and truncation steps
  - surfaced as `llm_call` metrics (`prompt_payload_*`)
- Hardened prompt payload schema in `src/lace/domain/validators/prompt_payload_schema.json`:
  - `planning_memory.local_custom_props` now scalar-only
  - `planning_memory` disallows undeclared top-level properties
- Added/updated tests in `tests/unit/domain/steps/test_llm_call_step.py`:
  - compact payload excludes non-essential duplicated strategy sections
  - required compact fields remain present under truncation
  - strict no-blob mode rejects forbidden payload keys
  - warn mode allows execution while surfacing deterministic findings

## Completed In This Iteration (Task 14)

- Hardened IR migration framework in `src/lace/domain/ir_migrations.py`:
  - normalized version parsing supports aliases like `v1`, numeric values, and missing versions
  - missing version now defaults to legacy `0` and deterministically migrates forward
  - migration-step failures are wrapped with explicit from/to context
  - added deterministic compatibility-pass pipeline executed after version migration
- Added v1 compatibility pass (`v1_hardening`) in `src/lace/domain/ir_migrations.py`:
  - normalizes legacy/malformed top-level IR shapes (`artifact_revision`, `history`, `history_events`, `idempotency_keys`)
  - repairs legacy node payloads:
    - canonical `node_id`, `title`, `status`
    - canonical `content_blocks` objects from string/dict variants
    - canonical `deps.parents|children|references` string-list surfaces
  - infers and enforces root/outline invariants (`root_node_id`, `outline`, fallback root node)
  - hardens optional containers (`metadata.control_plane`, `requirements`, `profiles`, `registry`, `generation`, `validation`)
  - normalizes `generation.target_template_contract.schema_version` when missing
- Hardened repository load error reporting in `src/lace/domain/storage.py`:
  - migration errors now include artifact id and artifact path context
  - migrated/normalized payloads are persisted back to artifact JSON on load
- Added/updated migration tests in `tests/unit/domain/test_ir_migrations.py`:
  - missing version migration behavior
  - version alias normalization
  - compatibility normalization of legacy node/top-level shapes
  - repository load coverage for alias + legacy payload repair
