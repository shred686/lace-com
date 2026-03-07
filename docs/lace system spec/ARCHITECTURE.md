# LACE Platform — Authoritative Architecture Reference

> **Purpose**: This document is the single authoritative reference for the LACE platform
> architecture. It is designed to be included as context in any LLM prompt to convey a
> complete high-level understanding of the system. Last updated: 2026-03-06.

---

## Table of Contents

1. [What is LACE?](#1-what-is-lace)
2. [Repo Layout](#2-repo-layout)
3. [System Component Map](#3-system-component-map)
4. [The Pipeline System](#4-the-pipeline-system)
5. [Step Catalog](#5-step-catalog)
6. [The Control Plane](#6-the-control-plane)
7. [Published Apps](#7-published-apps)
8. [The Agent Runtime](#8-the-agent-runtime)
9. [LLM Providers](#9-llm-providers)
10. [Domain Schema](#10-domain-schema)
11. [Storage Backends](#11-storage-backends)
12. [Ingest + Retrieval Plane](#12-ingest--retrieval-plane)
13. [API Surface](#13-api-surface)
14. [Frontend Architecture](#14-frontend-architecture)
15. [Runtime Dataflow](#15-runtime-dataflow)
16. [Docker Compose Stack](#16-docker-compose-stack)
17. [Key Environment Variables](#17-key-environment-variables)
18. [Model Registry](#18-model-registry)
19. [Implementation Status](#19-implementation-status)

---

## 1. What is LACE?

**LACE** (Long-Form Artifact Construction Engine) is a **stateful pipeline platform** for
authoring and generating large structured artifacts — proposals, technical specifications,
ontologies, reports — using LLMs as structured reasoning engines.

### Core Design Principles

```
┌─────────────────────────────────────────────────────────────────────┐
│                     LACE DESIGN PRINCIPLES                          │
│                                                                     │
│  1. DETERMINISTIC-FIRST                                             │
│     LLMs produce structured JSON. A single gated step              │
│     (DeterministicApply) is the only point of IR mutation.         │
│     Same input → reproducible output (within LLM variance).        │
│                                                                     │
│  2. PIPELINE-DRIVEN                                                 │
│     All generation is expressed as versioned YAML pipeline          │
│     definitions with typed step contracts. No ad-hoc code paths.   │
│                                                                     │
│  3. MULTI-TIER PERSISTENCE                                          │
│     Postgres (canonical) + filesystem mirrors.                      │
│     Every step's inputs/outputs are persisted as blob refs.        │
│                                                                     │
│  4. POLICY-CONTROLLED                                               │
│     All runs flow through the Control Plane for plan approval,      │
│     budget enforcement, and runtime supervision.                    │
│                                                                     │
│  5. ARTIFACT AS IR                                                  │
│     Artifacts are structured Intermediate Representations (IR),     │
│     not raw text. Content is block-level, node-level, compilable   │
│     to multiple targets (md, docx, pdf, owl).                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 2. Repo Layout

```
LACE/
├── src/lace/                          # Core Python package
│   ├── __main__.py                    # Entry: python -m lace
│   ├── cli.py                         # CLI commands (init, run, compile, ui)
│   ├── app.py                         # Core orchestration functions
│   │
│   ├── api/                           # FastAPI server + data layer
│   │   ├── server.py                  # Entry: python -m lace.api.server
│   │   ├── router.py                  # API route registration
│   │   ├── models.py                  # Pydantic request/response models
│   │   ├── store.py                   # File-backed state store
│   │   ├── mvp_store.py               # Simplified file store (MVP)
│   │   └── postgres_store.py          # Postgres-backed state store
│   │
│   ├── domain/                        # Core domain logic
│   │   ├── ir.py                      # ArtifactIR, NodeIR, Block dataclasses
│   │   ├── constraints.py             # Constraint hierarchy merging
│   │   ├── steps/                     # All step implementations
│   │   │   ├── bootstrap.py           # Step registry (maps type_id → class)
│   │   │   ├── load.py                # LoadArtifact step
│   │   │   ├── source_ingest.py       # SourceIngest step
│   │   │   ├── classify.py            # DocumentRoleClassifier step
│   │   │   ├── context.py             # PrepareContext, BuildContext steps
│   │   │   ├── intent.py              # IntentParser step
│   │   │   ├── outline.py             # SelectStructureProfile, PopulateOutlinePlan
│   │   │   ├── plan.py                # PlanArtifact, StrategySelector steps
│   │   │   ├── llm_call.py            # LLMCall step
│   │   │   ├── validate.py            # ValidateLLMResponse, ValidateArtifact
│   │   │   ├── apply.py               # DeterministicApply step
│   │   │   ├── compile.py             # Compiler step
│   │   │   ├── gate.py                # GateStep, ValidateIngestPolicy
│   │   │   ├── human_review.py        # HumanReviewStep
│   │   │   ├── tool_agent.py          # ToolAgentStep (LLM + tools loop)
│   │   │   ├── prompt.py              # PromptStep
│   │   │   └── api_call.py            # ApiCallStep
│   │   ├── llm/
│   │   │   └── providers.py           # OpenAI, Anthropic, Local, Replay providers
│   │   ├── model_gateway/             # Task-typed model runtime (embedding/ner/...)
│   │   │   ├── gateway.py             # ModelGateway (routing, caching, invocation logs)
│   │   │   ├── resolver.py            # Alias/model resolution via model registry
│   │   │   └── providers/             # Embedding + NER adapters (+ multimodal scaffolds)
│   │   ├── compilers/
│   │   │   ├── markdown.py            # → .md
│   │   │   ├── docx.py                # → .docx
│   │   │   ├── pdf.py                 # → .pdf
│   │   │   └── owl.py                 # → .owl (ontology)
│   │   └── strategies/                # Content generation strategies
│   │
│   ├── pipeline/                      # Pipeline orchestration engine
│   │   ├── definition.py              # PipelineDefinition, StepSpec, TypedRef
│   │   └── runtime.py                 # Orchestrator (step executor, retry, lock)
│   │
│   ├── control_plane/                 # Policy, supervision, action routing
│   │   ├── contracts.py               # AppPolicyModel, RunPlanRequest/Response
│   │   ├── service.py                 # ControlPlaneService (plan/supervise/execute)
│   │   ├── router.py                  # Policy evaluation, plan approval
│   │   ├── supervisor.py              # Run health assessment, action recommendation
│   │   ├── snapshot.py                # Health snapshot builder
│   │   └── executor.py                # Action executor (pause/cancel/retry/etc.)
│   │
│   └── agent_runtime/                 # Agent task execution
│       ├── contracts.py               # AgentTaskRequest/ResultModel
│       ├── worker.py                  # AgentWorker main executor
│       ├── workspace.py               # Workspace mount management
│       ├── result_normalizer.py       # Normalize results across adapters
│       └── adapters/
│           ├── generic_harness.py     # Demo-supported adapter (default enabled)
│           ├── claude_code_cli.py     # Optional adapter (disabled by default)
│           └── codex_cli.py           # Optional adapter (disabled by default)
│
├── pipelines/                         # Bundled pipeline YAML definitions
│   ├── lace.GenerateNodeContentPipeline.yaml   # 20-step generation pipeline
│   └── lace.IngestPipeline.yaml               # 3-step source ingest pipeline
│
├── frontend/                          # React 18 + TypeScript + Vite
│   └── src/
│       ├── pages/                     # One file per route (host/runtime pages included)
│       ├── components/                # Shared UI components
│       │   ├── pipeline/              # Pipeline DAG visualization
│       │   ├── control/               # Supervision UI
│       │   └── steps/                 # Step catalog browser
│       ├── runtime-ui/                # Pipeline/App UI runtime SDK + plugin loader
│       │   ├── sdk.ts                 # Stable runtime API wrapper for plugin UIs
│       │   ├── loader.ts              # Dynamic component loading + sdk range checks
│       │   ├── events.ts              # Run event stream helpers (SSE)
│       │   ├── iframe-bridge.ts       # Parent/iframe isolation bridge
│       │   └── plugins/               # Built-in runtime UI modules
│       │       ├── gov-proposal/      # gov-proposal new/session/run views
│       │       └── artifact-generator/ # artifact-generator new-run view
│       └── lib/api.ts                 # Typed API client
│
├── migrations/
│   └── sql/
│       ├── full_schema.sql            # Complete Postgres schema
│       └── 0001_*.sql … 0014_*.sql    # Migration files (includes ingest2 + model invocations)
│
├── alembic/                           # Alembic migration runner config
├── structure_profiles/                # Outline structure profile templates
├── tests/                             # Unit, integration, e2e tests
├── scripts/                           # Smoke tests, MVP acceptance checks
├── docs/                              # Documentation (this file lives here)
├── docker-compose.yml                 # Full stack (postgres, minio, nats, api)
├── Dockerfile                         # API container
└── pyproject.toml                     # Package manifest + dependencies
```

Backend compatibility matrix (runtime/API behavior):

| Capability | File backend | Postgres backend | Notes |
|---|---|---|---|
| Artifact CRUD + IR patching | Yes | Yes | Shared API contracts and `DeterministicApply` path. |
| Runs (create/cancel/retry) | Yes | Yes | Same run lifecycle semantics. |
| Pause/resume controls | Yes | Yes | Capability surfaced by `GET /v1/runtime/backend`. |
| Run trace session + frames | Yes | Yes | `GET /v1/runs/{id}/trace*` supported on both. |
| Retrieval (`/v1/retrieve`, `/expand`) | Yes | Yes | File uses deterministic fallback ranking; Postgres uses ingest schema + pgvector/FTS. |
| App releases/sessions | Yes | Yes | Backed by MVP store implementations in both modes. |
| Distributed locks | No | Yes | File backend intentionally does not provide lock primitives. |

---

## 3. System Component Map

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                           LACE PLATFORM                                      │
│                                                                              │
│  ┌─────────────────┐      ┌──────────────────────────────────────────────┐  │
│  │   CLI (lace)    │      │              React Frontend                   │  │
│  │                 │      │  Dashboard │ Artifacts │ Pipelines │ Apps     │  │
│  │  init           │      │  Runs/Ops  │ Workspace │ Steps     │ Admin    │  │
│  │  run            │      └──────────────────┬───────────────────────────┘  │
│  │  compile        │                         │ HTTP / WebSocket             │
│  │  ui             │                         ▼                              │
│  └────────┬────────┘      ┌──────────────────────────────────────────────┐  │
│           │               │              FastAPI Server                   │  │
│           │ calls         │         src/lace/api/server.py                │  │
│           ▼               │                                               │  │
│  ┌─────────────────────────────────────────────────────────────────────┐ │  │
│  │                       app.py (Orchestration)                        │ │  │
│  │   run_generation_pipeline()  │  compile_artifact()  │  get_status() │ │  │
│  └──────────────────────────────┬──────────────────────────────────────┘ │  │
│                                 │                                         │  │
│          ┌──────────────────────┼──────────────────────┐                 │  │
│          │                      │                      │                  │  │
│          ▼                      ▼                      ▼                  │  │
│  ┌───────────────┐   ┌──────────────────┐   ┌──────────────────────┐    │  │
│  │ Control Plane │   │ Pipeline Runtime │   │   Agent Runtime      │    │  │
│  │               │   │                  │   │                      │    │  │
│  │ plan()        │   │ Orchestrator     │   │ AgentWorker          │    │  │
│  │ supervise()   │   │ StepRunner       │   │ Adapters:            │    │  │
│  │ execute()     │   │ TypedRef resolve │   │  - GenericHarness    │    │  │
│  │               │   │ Retry / Timeout  │   │  - ClaudeCodeCLI     │    │  │
│  │ Policies      │   │ Lock Manager     │   │  - CodexCLI          │    │  │
│  │ Supervision   │   │                  │   │                      │    │  │
│  └───────┬───────┘   └────────┬─────────┘   └──────────┬───────────┘    │  │
│          │                    │                         │                 │  │
│          └────────────────────┼─────────────────────────┘                │  │
│                               │                                           │  │
│          ┌────────────────────┼──────────────────────────────┐           │  │
│          │                    │  Domain Steps (20+)          │           │  │
│          │   LLMCall  ←──────►│  LoadArtifact               │           │  │
│          │                    │  SourceIngest               │           │  │
│          │  ┌──────────────┐  │  DeterministicApply ◄── ONLY│           │  │
│          │  │ LLM Providers│  │  Compiler             mutation          │  │
│          │  │  OpenAI      │  │  ValidateArtifact           │           │  │
│          │  │  Anthropic   │  │  HumanReviewStep            │           │  │
│          │  │  Local/Replay│  │  ToolAgentStep              │           │  │
│          │  └──────────────┘  └────────────────────────────┘           │  │
│          │                                                               │  │
│          ▼                                                               │  │
│  ┌──────────────────────────────────────────────────────────────────┐   │  │
│  │                       Storage Layer                               │   │  │
│  │                                                                   │   │  │
│  │   Postgres (canonical)     │  File system (mirror/dev)           │   │  │
│  │   ├── artifacts            │  .lace/artifacts/                   │   │  │
│  │   ├── runs / run_steps     │  .lace/runs/                        │   │  │
│  │   ├── control_plane_events │  .lace/blobs/                       │   │  │
│  │   ├── published_apps       │  .lace/llm_cassettes/ (LLM replay)  │   │  │
│  │   └── agent_tasks          │                                      │   │  │
│  │                                                                   │   │  │
│  │   MinIO (blob store)        │  NATS JetStream (event fan-out)    │   │  │
│  └──────────────────────────────────────────────────────────────────┘   │  │
└──────────────────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## 4. The Pipeline System

### What is a Pipeline?

A pipeline is a **versioned YAML document** that declares:
- Named typed **inputs** (e.g., a `GenerationRequest`)
- An ordered list of **steps**, each with explicit typed input refs and output declarations
- **Retry / timeout** policies per step
- **Gates** (validation contracts) on step inputs

Pipelines are **declarative and deterministic**: same inputs → same execution path (LLM
content varies but schema/structure is enforced at every gate).

### Pipeline Definition Model

```
PipelineDefinition
├── schema_version: string
├── pipeline_id: string          (e.g., "lace.GenerateNodeContentPipeline")
├── version: string              (e.g., "1.0.0")
├── defaults:
│   ├── retry: { max_attempts, backoff_ms }
│   └── timeout_ms: int
├── inputs: [TypedRef]           (declared pipeline-level inputs)
├── outputs: [TypedRef]          (declared pipeline-level outputs)
└── steps: [StepSpec]
    ├── id: string               (e.g., "load", "llm_call", "apply")
    ├── type_id: string          (e.g., "lace.LLMCall.v1")
    ├── inputs: [TypedRef]       (resolved from pipeline inputs or prior step outputs)
    │   └── TypedRef: { type, ref }
    │       └── ref syntax:  "steps.{step_id}.outputs.{key}"
    │                        "pipeline.inputs.{key}"
    ├── outputs: [TypedRef]      (declared outputs this step must produce)
    ├── params: dict             (static step configuration)
    ├── retry: { max_attempts }  (overrides default)
    ├── timeout_ms: int          (overrides default)
    └── gates: [GateSpec]        (validation before step executes)
        └── GateSpec: { type_id: "required_keys.v1", params: { keys: [...] } }
```

### Shipped Pipelines

#### A. `lace.GenerateNodeContentPipeline` (20 steps)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│          GenerateNodeContentPipeline  —  Step Execution Order               │
│                                                                             │
│  INPUT: GenerationRequest                                                   │
│   { artifact_id, node_id, operation, constraints, compiler_targets }        │
│                                                                             │
│   Step 01: load               LoadArtifact                                 │
│             └─ Lock node, load ArtifactIR from store                       │
│   Step 02: ingest_sources     SourceIngest                                 │
│             └─ Dataset-aware ingest, chunking, embeddings + NER via Model Gateway │
│   Step 03: classify_document_roles  DocumentRoleClassifier                 │
│             └─ LLM assigns role: primary / reference / background          │
│   Step 04: resolve_constraints      (built-in resolver)                    │
│             └─ Merge constraint hierarchy (artifact → node → request)      │
│   Step 05: parse_intent       IntentParser                                 │
│             └─ Extract user intent from prompt text                         │
│   Step 06: prepare_context    PrepareContext                               │
│             └─ Build generation context (TOC, summaries, node deps)        │
│   Step 07: enforce_ingest_policy    ValidateIngestPolicy                   │
│             └─ Gate: require sources if policy demands                      │
│   Step 08: select_sources     SelectSourceProfile                          │
│             └─ Rank and select most relevant sources                        │
│   Step 09: select_structure_profile  SelectStructureProfile                │
│             └─ LLM → choose outline structure template                      │
│   Step 10: populate_outline_plan    PopulateOutlinePlan                    │
│             └─ LLM → generate section/subsection plan                      │
│   Step 11: lock_outline_plan        (built-in)                             │
│             └─ Finalize hierarchical outline                                │
│   Step 12: build_context      BuildContext                                 │
│             └─ Assemble full generation prompt context                     │
│   Step 13: plan_artifact      PlanArtifact                                 │
│             └─ LLM → generate content action plan (structured JSON)        │
│   Step 14: validate_plan      ValidateLLMResponse                          │
│             └─ Gate: validate plan JSON against declared schema            │
│   Step 15: select_strategy    StrategySelector                             │
│             └─ Choose generation strategy based on plan + constraints      │
│   Step 16: prepare_prompt     PreparePrompt                                │
│             └─ Render prompts + provider request deterministically         │
│   Step 17: llm_call           LLMCall                                      │
│             └─ *** MAIN LLM CALL *** → content JSON                        │
│   Step 18: validate_llm       ValidateLLMResponse                          │
│             └─ Gate: validate LLM output JSON against schema               │
│   Step 19: apply              DeterministicApply                           │
│             └─ *** ONLY IR MUTATION POINT *** → mutate ArtifactIR         │
│   Step 20: validate           ValidateArtifact                             │
│             └─ Quality checks: evidence, citations, numeric grounding      │
│   Step 21: compile            Compiler                                      │
│             └─ Emit: .md / .docx / .pdf / .owl                             │
│                                                                             │
│  OUTPUTS: change_event, updated_ir, compiled, validation                   │
└─────────────────────────────────────────────────────────────────────────────┘
```

#### B. `lace.IngestPipeline` (3 steps)

```
┌──────────────────────────────────────────────────────────┐
│  IngestPipeline  (pre-generation source understanding)   │
│                                                          │
│  INPUT: { artifact_id, source_refs }                     │
│                                                          │
│  Step 1: load             LoadArtifact                  │
│  Step 2: ingest_sources   SourceIngest                  │
│  Step 3: classify         DocumentRoleClassifier        │
│                                                          │
│  OUTPUTS: ingest_report, document_role_map              │
└──────────────────────────────────────────────────────────┘
```

### Pipeline Orchestrator (`pipeline/runtime.py`)

```
Orchestrator.run(pipeline_def, inputs, run_id)
│
├── For each StepSpec (sequential):
│   │
│   ├── 1. Resolve TypedRefs → actual values from pipeline inputs / prior outputs
│   ├── 2. Run Gate checks (required_keys.v1, etc.)
│   ├── 3. Load StepRunner from registry by type_id
│   ├── 4. Execute step with retry + timeout envelope
│   │       └── on failure: retry up to max_attempts with backoff
│   ├── 5. Validate declared outputs are present (no undeclared outputs)
│   ├── 6. Persist step inputs + outputs as content-addressed blob refs
│   └── 7. Accumulate outputs for downstream TypedRef resolution
│
├── On run resume: restore succeeded step outputs, skip re-execution
├── Node locking: FileNodeLockManager prevents concurrent writes to same node
└── Emit RunEvents at each state transition (queued → running → succeeded/failed)
```

### Custom Pipelines

Users can author custom pipeline YAML and register them via:
- `POST /v1/pipelines` (store as `pipeline_authoring` record in DB)
- Pipeline is then resolvable by `pipeline_ref.alias`
- Bundled pipelines (`lace.*`) always available as fallback

### §4.3 Run Modes, Operations, and Statuses

```
RunMode (how the artifact tree is traversed):
  node              Execute pipeline against a single target node
  outline_recursive Build/expand outline recursively across nodes
  auto_recursive    Auto-split and recurse generation across tree

RunOperation (what generation action to take):
  generate          Initial content generation for an empty/draft node
  regenerate        Replace existing content with a fresh generation
  expand            Expand existing content (add depth/sections)
  enrich            Enrich existing content (add evidence, citations)
  patch             Targeted patch to specific blocks or sections
  outline_only      Build outline structure without generating content
  ingest            Ingest and classify sources only (no content gen)

RunStatus (lifecycle states):
  queued            Persisted, awaiting thread pool pick-up
  running           Actively executing pipeline steps
  pause_requested   Pause signal received, waiting for checkpoint
  paused            Execution halted at checkpoint
  succeeded         All steps completed, outputs validated
  failed            Unrecoverable error (step exhausted retries)
  cancel_requested  Cancel signal received, waiting for checkpoint
  cancelled         Execution cleanly stopped before completion
```

### §4.4 Objective Loop (Quality Remediation)

`src/lace/app.py` adds optional objective-based auto-remediation on top of a completed
pipeline run:

```
run_generation_pipeline() completes
         │
         ▼
  Evaluate validation quality evidence vs objective targets
         │
    met? ├─── YES ─── return result
         │
        NO
         ▼
  Auto-run remediation pass:
    - operation: "regenerate" with stricter constraints
    - typically re-runs full GenerateNodeContentPipeline
         │
         ▼
  Re-evaluate objectives
    - still unmet → fail run with objective_loop metadata
    - met → return result
```

Configured via constraints on the run request. Produces `objective_loop` key in run
metadata recording pass count, scores per objective, and final disposition.

### §4.5 Runtime Pipeline Resolution

When `POST /v1/runs` is called with a `pipeline_ref`, resolution is dynamic:

```
pipeline_ref.alias  ──►  pipeline_aliases table
                                │
                                ▼ (concrete version)
                         pipeline_versions table
                                │
                                ▼ (definition_document JSON)
                    Normalize authoring/runtime shape:
                    type_id / type field mapping
                                │
                                ▼
              Materialize runtime YAML to:
              .lace/api_state/runtime_pipelines/
                {pipeline_id}@{version}-{hash}.yaml
                                │
                         (if not found)
                                ▼
                    Fall back to bundled YAML:
                    pipelines/lace.GenerateNodeContentPipeline.yaml
                    pipelines/lace.IngestPipeline.yaml

Note: Built-in pipelines are bootstrapped into pipeline_versions at
startup and aliased as "latest" automatically.
```

---

## 5. Catalog Ontology

LACE now treats workflow authoring as four peer catalog planes:

- `StepDefinition`: executable work that happens inside a run
- `ConnectorDefinition`: provider/auth/policy/config definitions for external systems
- `TriggerDefinition`: ingress definitions that start runs
- `SessionDefinition`: long-lived bidirectional interaction definitions

This boundary is deliberate. Steps are not allowed to absorb ingress or session semantics.

### 5.1 Step Plane

Step definitions use these canonical kinds:

- `primitive`: directly executable building blocks
- `template`: opinionated wrappers over primitives
- `composition`: reusable black-box multi-step workflows
- `control_flow`: orchestration constructs such as loops, branches, and waits
- `custom_code`: constrained escape hatch when no reusable abstraction fits

Primary authoritative fields:

- `definition_kind`
- `primitive_family`
- `resolution_strategy`
- `flags`
- `builder_visibility`
- `replacement_step_type_id`
- `planner_preference_rank`
- `side_effects`

`category` remains for display/backward compatibility only. It must never drive builder or runtime behavior.

Key normalized fields:

- `definition_kind`: `primitive|template|composition|control_flow|custom_code`
- `primitive_family`: `llm_call|agent_loop|http_call|transform|data_query|data_mutate|embed|code_exec`
- `resolution_strategy`: `direct_runner|template_delegate|subpipeline_expand|control_flow_runner|custom_runner`
- `base_step_type_id`: template delegate target
- `composition_pipeline_ref`: composition target pipeline
- `provenance`: `system|tenant|agent_generated`
- `builder_visibility`: `public|advanced|internal|deprecated`
- `replacement_step_type_id`: successor step type for deprecated entries
- `planner_preference_rank`: lower is more preferred by planner agents
- `side_effects`: `pure|reads_external|writes_external|mutates_internal_ir|interactive_pause|time_pause`

Current public primitive surface is intentionally small:

- `lace.LLMCall.v1`
- `lace.ApiCallStep.v1` (`HTTP Call`)
- `lace.ToolAgent.v1`
- `lace.Transform.v1`
- `lace.RetrieveSegments.v1`
- `lace.EmbeddingCall.v1`
- `lace.DataMutate.v1`
- `lace.CodeExec.v1`

Examples:

- `lace.StrictJsonLLMCall.v1`: `template` over `lace.LLMCall.v1`
- `lace.HybridRetrieve.v1`: `template` over `lace.RetrieveSegments.v1`
- `lace.WebFetch.v1`: `template` over `lace.ApiCallStep.v1`
- `lace.IngestWorkflow.v1`: `composition` over `lace.IngestPipeline`
- `lace.RAGRetrievalWorkflow.v1`: `composition` over `lace.RAGRetrievalWorkflowPipeline`
- `lace.WebSearch.v1`: `composition` over `lace.WebSearchPipeline`
- `lace.ForEach.v1` / `lace.Branch.v1` / `lace.WaitForInput.v1`: `control_flow`
- `lace.SubPipeline.v1`: control-flow/materialization macro with deterministic expansion semantics

### 5.2 Builder Visibility and Deprecation

Builder visibility is explicit:

- `public`: default-visible to builders and LLM planners
- `advanced`: hidden from default builder views, visible in advanced mode
- `internal`: framework/runtime-only, not builder-visible
- `deprecated`: hidden from default builder views and must carry a replacement mapping

Deprecation is explicit, not informal. The intended state is:

- `status=deprecated`
- `builder_visibility=deprecated`
- `replacement_step_type_id` set

Default `/v1/steps/catalog` behavior is builder-oriented:

- only `llm_visible=true`
- no `internal` entries
- no `advanced` entries unless explicitly requested
- no `deprecated` entries in default builder flows

### 5.3 Planner Policy

Planner agents should prefer definitions in this order:

1. `composition`
2. `template`
3. `primitive`
4. `control_flow` when orchestration is required
5. `custom_code`

This policy is encoded in catalog metadata through `planner_preference_rank`; it is not prompt-only behavior.

### 5.4 Side-Effect Typing

Side-effect typing is part of the contract:

- `pure`: no external writes and no IR mutation
- `reads_external`: reads providers, retrieval planes, or model systems
- `writes_external`: writes or publishes external state
- `mutates_internal_ir`: internal Artifact IR mutation only
- `interactive_pause`: requires human or interactive resume
- `time_pause`: delays or waits until time-based resume

Examples:

- `Transform` -> `pure`
- `HTTP Call` -> `reads_external`
- `DataMutate` -> `writes_external`
- `DeterministicApply` -> `mutates_internal_ir`
- `WaitForInput` -> `interactive_pause`
- `Delay` -> `time_pause`

### 5.5 Sibling Planes

`ConnectorDefinition` owns provider and policy wiring:

- auth schema
- config schema
- policy schema
- default credentials and headers
- provider metadata

`TriggerDefinition` owns ingress:

- `lace.WebhookTrigger.v1`
- `lace.ScheduleTrigger.v1`
- `lace.EmailReceivedTrigger.v1`
- `lace.SmsReceivedTrigger.v1`
- `lace.VoiceCallTrigger.v1`
- `lace.QueueTrigger.v1`

`SessionDefinition` owns long-lived interaction state:

- `lace.ChatSession.v1`
- `lace.VoiceSession.v1`
- `lace.RealtimeSession.v1`

Inbound email, SMS, voice, or webhook behavior must be modeled as triggers, not ordinary action steps. Realtime phone/chat/voice state must be modeled as sessions, not flattened into HTTP-shaped actions.

See [docs/spec/ENTERPRISE_CATALOG_ONTOLOGY.md](/home/mkern/LACE/docs/spec/ENTERPRISE_CATALOG_ONTOLOGY.md) for the canonical ontology contract and governance rules. `docs/spec/STEP_DEFINITION_MODEL.md` remains useful for detailed step-definition mechanics.

---

## 6. The Control Plane

The control plane is the **policy + supervision layer** that wraps every run. No run
executes without passing through it.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         CONTROL PLANE                                       │
│                       src/lace/control_plane/                               │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  ControlPlaneService                                                 │   │
│  │                                                                      │   │
│  │  plan(RunPlanRequest) → RunPlanResponse                             │   │
│  │  ├── Load AppPolicy for app_id                                       │   │
│  │  ├── Evaluate pipeline_bindings (allowed? version pinned?)           │   │
│  │  ├── Check budget_caps (tokens, steps, max_sources)                  │   │
│  │  ├── Validate data_policy (requires sources? upload allowed?)        │   │
│  │  └── Return: { approved: bool, remediation_hints: [...] }           │   │
│  │                                                                      │   │
│  │  supervise(run_id) → SupervisionResult                              │   │
│  │  ├── build_snapshot(run_id)                                          │   │
│  │  │   └── Collect: metrics, validation status, error traces           │   │
│  │  ├── recommend_actions(snapshot)                                     │   │
│  │  │   Detects: stuck run, retry storm, evidence gap, budget breach    │   │
│  │  │   Recommends: continue | pause | cancel | retry | switch_model    │   │
│  │  │              | reduce_scope | request_input | trigger_regen       │   │
│  │  │              | trigger_agent | open_incident                      │   │
│  │  └── If policy.authority_mode == "auto_act":                         │   │
│  │      └── execute_action() automatically                              │   │
│  │                                                                      │   │
│  │  execute_action(action, run_id) → void                              │   │
│  │  └── Pause / cancel / retry step / modify constraints               │   │
│  │      Persist to control_plane_events table                           │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  AppPolicyModel (stored in app_policies table):                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  allowed_pipelines: [PipelineBinding]                                │   │
│  │    └── { pipeline_id, version | alias }                              │   │
│  │  budget_caps:                                                        │   │
│  │    └── max_total_tokens, max_output_tokens_per_call, max_steps       │   │
│  │  data_policy:                                                        │   │
│  │    └── require_sources: bool, max_sources: int                       │   │
│  │  supervision_policy:                                                  │   │
│  │    └── authority_mode: observe | recommend | auto_act                │   │
│  │        allowed_actions: [action_type]                                │   │
│  │  agent_policy:                                                       │   │
│  │    └── allowed_adapters: [...], network_mode, timeout_seconds        │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  SupervisorThread (background, every N seconds):                            │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  while True:                                                         │   │
│  │      active_runs = find_active_runs()                                │   │
│  │      for run in active_runs:                                         │   │
│  │          supervise(run.id)                                           │   │
│  │      sleep(LACE_SUPERVISOR_POLL_INTERVAL_SECONDS)                   │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 7. Published Apps

### Current Architecture (Implemented)

**Apps** are now the first-class runtime boundary for end-user execution. Pipelines are still
the execution contract, but users launch and monitor runs through an App release that pins:

- `pipeline_binding` (what pipeline/version the app runs)
- `policy` (control-plane guardrails)
- `ui_binding` + UI runtime metadata (how the frontend UI is loaded)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                   PIPELINE → APP RELEASE → UI RUNTIME                      │
│                                                                             │
│  Pipeline (YAML + step graph)                                               │
│      │ publish/bind                                                         │
│      ▼                                                                      │
│  AppRelease                                                                 │
│  ├── pipeline_binding                                                       │
│  ├── policy                                                                  │
│  ├── ui_schema (intent/config schema for UI)                               │
│  ├── ui_binding (module entrypoints + sdk range + metadata)                │
│  ├── ui_module_id/ui_module_version (optional registry pin)                │
│  └── ui_isolation_mode: host | iframe                                      │
│      │                                                                      │
│      │ activated release                                                    │
│      ▼                                                                      │
│  App Session                                                                │
│  ├── session messages                                                       │
│  ├── session UI state (per view_id hydration state)                         │
│  └── linked run records                                                     │
│      │                                                                      │
│      ▼                                                                      │
│  Runtime UI Host                                                            │
│  ├── resolves active release + ui-runtime payload                           │
│  ├── loads plugin entrypoint for page intent                                │
│  ├── streams run events (SSE; WS available)                                 │
│  └── calls stable SDK controls (start/pause/resume/retry/review)           │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Route Resolution Model

Pipeline routes are now first-class entrypoints:

- `/pipelines/{pipeline_slug}/new` resolves to an active app release via
  `GET /v1/pipelines/{pipeline_slug}/entry/new`
- resolved route is always app-runtime-backed (`/apps/{app_id}/new`)
- legacy `artifacts/new` remains a compatibility page, not the long-term app runtime model

### Concise Runbook: Add Pipeline + App + Runtime UI

Use this sequence for a clean, repeatable first-class runtime launch.

1. Create a pipeline record (`POST /v1/pipelines/{...}`) and publish at least one version via draft validate/publish (`/v1/pipelines/{pipeline_id}/draft*`).
2. Ensure the pipeline version has alias `latest` (or pin a specific version in app release policy/binding).
3. Add a runtime UI plugin component under `frontend/src/runtime-ui/plugins/{your-plugin}/` and export `default` or `RuntimeView`.
4. Register the plugin entrypoint in `frontend/src/runtime-ui/loader.ts` if using built-in local plugin mapping (for example `/plugins/{your-plugin}/new-run.js`).
5. Create the app (`POST /v1/apps`) and then create app release (`POST /v1/apps/{app_id}/releases`) with:
   - `pipeline_binding` set to your pipeline (`pipeline_id` + alias/version)
   - `policy.allowed_pipelines` aligned with that same pipeline
   - `ui_binding.entrypoints.new_run` pointing at your plugin entrypoint
   - explicit pipeline slug in `ui_schema.pipeline_slug` and/or `ui_binding.metadata.pipeline_slug`
6. Confirm route resolution works: `GET /v1/pipelines/{pipeline_slug}/entry/new` returns `/apps/{app_id}/new`.
7. Confirm runtime boot works: `/apps/{app_id}/new` must load active release + `ui-runtime`, then render your plugin in host/iframe mode.
8. Confirm run execution works from UI: plugin creates session (`POST /v1/apps/{app_id}/sessions`) and starts runs (`POST /v1/apps/{app_id}/sessions/{session_id}/runs`) and receives updates from `GET /v1/runs/{run_id}/events/stream`.

Notes:
- App release creation updates the app's active release and policy baseline in state.
- Keep `policy.allowed_pipelines` and release `pipeline_binding` consistent, or planner clamp behavior may select a different pipeline than intended.
- If adding new step types for the pipeline, update both step runtime registration (`src/lace/domain/steps/bootstrap.py`) and step catalog contracts (`src/lace/api/contracts.py`).

### Runtime UI Modules (Current Built-ins)

- `lace.ui.gov_proposal`:
  - `frontend/src/runtime-ui/plugins/gov-proposal/new-run.tsx`
  - `frontend/src/runtime-ui/plugins/gov-proposal/session-home.tsx`
  - `frontend/src/runtime-ui/plugins/gov-proposal/run-detail.tsx`
- `lace.ui.artifact_generator`:
  - `frontend/src/runtime-ui/plugins/artifact-generator/new-run.tsx`

Runtime host + loader:

- host page: `frontend/src/pages/AppRuntimeHostPage.tsx`
- iframe page: `frontend/src/pages/RuntimeUiIframePage.tsx`
- loader/runtime checks: `frontend/src/runtime-ui/loader.ts`
- SDK contract wrapper: `frontend/src/runtime-ui/sdk.ts`
- event stream helpers: `frontend/src/runtime-ui/events.ts`

---

## 8. The Agent Runtime

The Agent Runtime lets pipeline steps delegate tasks to **autonomous sub-agents** (code
generation, external tool invocation, web browsing, etc.) via a typed contract.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          AGENT RUNTIME                                      │
│                      src/lace/agent_runtime/                                │
│                                                                             │
│  INVOCATION: lace.ToolAgent.v1 for tool-loop orchestration                   │
│                                                                             │
│  AgentTaskRequestModel (input to AgentWorker):                              │
│  ├── task_id, app_id, run_id, step_key                                      │
│  ├── provider: { provider, model, options }                                 │
│  ├── task: { objective, instructions, acceptance_criteria, constraints }    │
│  ├── workspace: { mount_workspace_rw: bool, sources: [...] }                │
│  └── runtime: { adapter, image, network_mode, timeout_seconds }             │
│                                                                             │
│  AgentWorker.run_task(request):                                             │
│  ├── Prepare workspace (mount RW/RO, copy sources)                         │
│  ├── Select adapter by runtime.adapter                                      │
│  ├── Execute adapter                                                        │
│  ├── Normalize result (errors, cost, timeline)                              │
│  └── Return AgentTaskResultModel                                            │
│                                                                             │
│  ADAPTERS:                                                                  │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │  GenericHarnessAdapter  (IMPLEMENTED)                                │  │
│  │  └── Docker container + shell commands                               │  │
│  │      Mount workspace, run arbitrary commands, capture stdout/stderr  │  │
│  │                                                                      │  │
│  │  ClaudeCodeCliAdapter   (OPTIONAL, DISABLED BY DEFAULT)              │  │
│  │  └── Not demo-supported in this release                              │  │
│  │                                                                      │  │
│  │  CodexCliAdapter        (OPTIONAL, DISABLED BY DEFAULT)              │  │
│  │  └── Not demo-supported in this release                              │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│  Runtime adapter exposure is gated by `LACE_AGENT_RUNTIME_ENABLED_ADAPTERS`
│  (comma-separated); default is `generic_harness`.                          │
│                                                                             │
│  AgentTaskResultModel (output):                                             │
│  ├── status: succeeded | failed                                             │
│  ├── summary: string                                                        │
│  ├── outputs: dict (adapter-defined key-value pairs)                       │
│  ├── patch_set: PatchSetArtifact (structured code/file changes)            │
│  ├── commands: [CommandRunRecord]                                           │
│  ├── audit_timeline: [AgentTimelineEvent]                                  │
│  ├── errors: [dict]                                                         │
│  └── cost_estimate: dict                                                   │
│                                                                             │
│  PERSISTENCE: agent_tasks + agent_task_events + agent_task_artifacts tables │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 9. LLM Providers

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          LLM PROVIDER SYSTEM                                │
│                     src/lace/domain/llm/providers.py                        │
│                                                                             │
│  LLMRequest                          LLMResponse                           │
│  ├── model: str                      ├── provider: str                     │
│  ├── system_prompt: str              ├── model: str                        │
│  ├── user_prompt: str                ├── content: dict  (parsed JSON)      │
│  ├── response_schema_id: str | None  ├── raw_text: str                     │
│  ├── response_schema: dict | None    ├── usage: { input_tokens,            │
│  ├── temperature: float              │            output_tokens }           │
│  ├── max_output_tokens: int          └── metadata: dict                    │
│  ├── strict_json_only: bool                                                 │
│  └── metadata: dict                                                         │
│                                                                             │
│  PROVIDERS:                                                                 │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │  OpenAIProvider       → https://api.openai.com/v1/responses          │  │
│  │                         Auth: OPENAI_API_KEY env var                  │  │
│  │                         JSON Schema enforcement + fallback mode       │  │
│  │                                                                      │  │
│  │  AnthropicProvider    → https://api.anthropic.com/v1/messages        │  │
│  │                         Auth: ANTHROPIC_API_KEY env var              │  │
│  │                         Claude-family models                         │  │
│  │                                                                      │  │
│  │  LocalProvider        → Deterministic fake for unit tests            │  │
│  │                         Returns scripted or static JSON responses     │  │
│  │                                                                      │  │
│  │  ReplayCachedProvider → Wraps a real provider with cassette cache    │  │
│  │                         Modes: off | record | replay_exact           │  │
│  │                               | prefer_replay | replay_last          │  │
│  │                         Cache: .lace/llm_cassettes/ (configurable)   │  │
│  │                                                                      │  │
│  │  ScriptedJSONProvider → Multi-step scripted responses (e2e tests)   │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  Provider Registry: runtime map of provider_id → provider instance          │
│  Resolved at step execution time via params.provider + params.model         │
│                                                                             │
│  Steps that invoke providers:                                               │
│  LLMCall, StrategySelector, SelectStructureProfile,                         │
│  PopulateOutlinePlan, PlanArtifact, DocumentRoleClassifier                  │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 10. Domain Schema

### Core IR (in-memory / file / Postgres)

```
ArtifactIR                            NodeIR
├── artifact_id: str                  ├── node_id: str
├── version: str                      ├── title: str
├── artifact_revision: int            ├── content_blocks: [Block]
├── outline: [node_id, ...]           ├── deps: { parents, children, refs }
├── nodes: { node_id → NodeIR }       ├── status: empty|draft|review|final
├── root_node_id: str                 ├── constraints: dict | None
├── metadata: dict | None             ├── generation_state: dict | None
├── links: [dict] | None              ├── review_state: dict | None
├── requirements: dict | None         ├── summaries: dict | None
├── profiles: dict | None             └── alignment: dict | None
├── registry: dict | None
├── generation: dict | None           Block
├── validation: dict | None           ├── block_id: str | None
├── history: [revision_hash]          ├── block_type: paragraph|code|quote|
├── history_events: [dict]            │              list_item|...
└── idempotency_keys: [str]           ├── markdown: str
                                      ├── body: str | None
                                      └── meta: dict | None
```

### Postgres Schema (canonical)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          POSTGRES SCHEMA                                    │
│                      migrations/sql/full_schema.sql                         │
│                                                                             │
│  ARTIFACT DOMAIN                                                            │
│  ───────────────                                                            │
│  artifacts                                                                  │
│  ├── artifact_id (PK), tenant_id                                            │
│  ├── artifact_key, title, status                                            │
│  ├── root_node_key, current_revision_no                                     │
│  └── metadata                                                               │
│                                                                             │
│  artifact_revisions                                                         │
│  ├── revision_id (PK), artifact_id (FK)                                     │
│  ├── revision_no, ir_version, ir_hash                                       │
│  ├── ir_json (full IR snapshot)                                             │
│  └── source_run_id (FK → runs)                                              │
│                                                                             │
│  nodes       → artifact_id, node_key, parent_id, ordinal, depth            │
│               title, status, node_snapshot_json, deps_json                  │
│  blocks      → artifact_id, node_id, block_key, ordinal, block_type        │
│               content_text, citations_json                                   │
│  sources     → artifact_id, source_key, title, source_type, url            │
│               file_ref, metadata                                             │
│  compiled_outputs → artifact_id, target, output_ref, created_at            │
│                                                                             │
│  RUN EXECUTION                                                              │
│  ─────────────                                                              │
│  runs                                                                       │
│  ├── run_id (PK), artifact_id (FK), target_node_id                         │
│  ├── mode, operation, status                                                │
│  ├── pipeline_id, pipeline_version, pipeline_hash                           │
│  ├── progress (JSON), metrics (JSON), error                                 │
│  └── created_at, started_at, finished_at                                   │
│                                                                             │
│  run_steps   → run_id, step_id, attempt, status                            │
│               input_refs, output_refs, inputs, outputs                       │
│               metrics, error, started_at, finished_at                        │
│  run_events  → run_id, seq, event_type, payload, created_at                │
│  change_events → artifact_id, seq, change_type, payload                    │
│                                                                             │
│  CONTROL PLANE                                                              │
│  ─────────────                                                              │
│  app_policies        → app_id, policy_json                                  │
│  published_apps      → app_id, title, description, active_release_id       │
│  app_releases        → release_id, app_id, version_label                   │
│                         pipeline_binding, policy, ui_schema                │
│                         ui_binding, ui_module_id, ui_module_version        │
│                         ui_runtime_contract_version, ui_isolation_mode     │
│  app_sessions        → session_id, app_id, release_id                      │
│                         user_id, status, started_at, closed_at             │
│  app_session_ui_state (logical; persisted in MVP state document)            │
│                        → app_id, session_id, view_id, state, updated_at     │
│  app_session_messages → message_id, session_id, role, content              │
│                          referenced_run_id                                   │
│  app_session_runs    → session_run_id, session_id, run_id                  │
│  ui_modules          → module_id, display_name, publisher, status          │
│  ui_module_versions  → module_id, version, entrypoints_json, manifest_json │
│                        integrity_sha256, signature, sdk_api_min/max        │
│  control_plane_events → event_id, app_id, run_id, event_type, payload      │
│                                                                             │
│  AGENT RUNTIME                                                              │
│  ──────────────                                                             │
│  agent_tasks         → task_id, adapter, request_json, result_json         │
│                         status, created_at, started_at, finished_at         │
│  agent_task_events   → event_id, task_id, kind, message, data_json, ts     │
│  agent_task_artifacts → artifact_id, task_id, patch_id, format             │
│                          changes_json, summary                               │
│  service_registry    → entry_id, service_type, provider, credentials_json  │
│  credential_bindings → binding_id, app_id, service_entry_id                │
│                                                                             │
│  PIPELINE AUTHORING                                                         │
│  ──────────────────                                                         │
│  pipelines           → pipeline_id, title, description, owner              │
│  pipeline_drafts     → draft_id, pipeline_id, definition_document          │
│  pipeline_versions   → version_id, pipeline_id, version, definition_document│
│                         definition_hash, published_at                       │
│  pipeline_aliases    → alias_id, pipeline_id, alias, version               │
│  step_templates      → template_id, name, type_id, params_schema           │
│  step_types          → type_id, name, schema_version, input_schema         │
│                         output_schema, description                          │
│  step_versions       → version_id, type_id, version, implementation_ref    │
│                                                                             │
│  RUN CONTROL / LOCKING / SEQUENCE ALLOCATORS                                │
│  ────────────────────────────────────────────                               │
│  run_control_commands → command_id, run_id, command_type, payload           │
│  artifact_locks       → lock_id, artifact_id, node_id, holder, acquired_at │
│  mvp_state_documents  → doc_id, tenant_id, key, document_json              │
│  tenant_settings      → tenant_id, settings_json                           │
│  run_seq              → sequence allocator for per-run event ordering       │
│  artifact_change_seq  → sequence allocator for artifact change events       │
│  run_trace_seq        → sequence allocator for trace frame ordering         │
│                                                                             │
│  INGEST PLANE (schema: lace_ingest)                                         │
│  ────────────────────────────────                                            │
│  resources        → resource_id, source_key, title, document_type          │
│  resource_versions → version_id, resource_id, version_number, summary      │
│  segments         → segment_id, resource_id, segment_number, view_type     │
│                      text, span_start, span_end                             │
│  segment_vectors  → vector_id, segment_id, embedding (pgvector)            │
│  segment_lexical  → lexical_id, segment_id, tsvector (full-text)           │
│  annotations      → annotation_id, segment_id, annotation_type, content    │
│                                                                             │
│  OBSERVABILITY                                                              │
│  ─────────────                                                              │
│  run_trace_sessions → session_id, run_id, tenant_id, trace_level           │
│  run_trace_frames   → frame_id, session_id, seq, phase, payload            │
│  run_trace_blob_refs → blob_ref_id, frame_id, type_prefix                 │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 10.1 Step Taxonomy (Execution vs Authoring)

- `Step Instance`: a concrete step node in a pipeline definition (`steps[]` entry with `id`, `type_id`, `inputs`, `params`, `outputs`).
- `Step Type`: a stable behavior contract identifier (for example `lace.LLMCall.v1`, `lace.RetrieveSegments.v1`).
  Registry metadata now includes canonical authoring/runtime fields:
  `definition_kind`, `primitive_family`, `resolution_strategy`, optional `base_step_type_id`, optional `composition_pipeline_ref`, `provenance`, `flags`, `builder_visibility`, `replacement_step_type_id`, `planner_preference_rank`, and `side_effects`.
  Legacy UI/grouping fields (`category`, `is_governance`, `framework_bundle`, `origin`) remain for compatibility, but `category` is display-only and must not drive planner, builder, or runtime behavior.
- `Step Version`: the implementation binding for a step type (`impl_kind` + `impl_ref`, plus version/status/schema metadata).
- `impl_kind`: execution substrate for a step version (`python_module`, `oci_image`, `wasm`, `script`), not the behavior contract itself.
- `Step Template`: a no-code step definition record that delegates to a primitive runner after frozen/exposed param merge and validation.
- `Step Composition`: a no-code step definition record that delegates to a registered subpipeline through explicit input/output bindings.
- `SubPipeline Step`: `lace.SubPipeline.v1` remains the explicit macro step type that expands deterministically into prefixed child steps (`{id_prefix}__{child_step_id}`) before execution.
- `ForEach Step`: `lace.ForEach.v1` is a sequential control-flow step that materializes generated child steps per item (`{foreach_step_id}__{index}__{child_step_id}`) and exposes collected `results` + `count` outputs on the parent step.
- `ParallelForEach Step`: `lace.ParallelForEach.v1` is the bounded-concurrency companion to `lace.ForEach.v1`; it reuses the same `loop.item|loop.index|loop.count` scope model, runs up to `max_concurrency` iteration bodies at once, and still exposes `results` + `count` in original input order.
- `RepeatUntil Step`: `lace.RepeatUntil.v1` is the bounded iterative-refinement control-flow step; it runs an inline step body or referenced subpipeline body sequentially until a declarative `stop_condition` becomes true or `max_iterations` is reached, while exposing ordered `iterations` plus termination metadata on the parent step.
- `Branch Step`: `lace.Branch.v1` is the conditional-routing control-flow step; it evaluates declarative branch conditions in order, executes exactly one matching inline step body or referenced subpipeline body, and exposes stable parent outputs for the selected branch.
- `Reduce Step`: `lace.Reduce.v1` is the deterministic fan-in control-flow step; it folds an ordered collection into one accumulated result by exposing `reduce.accumulator|reduce.item|reduce.index|reduce.count` to an inline step body or referenced subpipeline body that must return `accumulator`.
- `TryCatch Step`: `lace.TryCatch.v1` is the structured recovery control-flow step; it executes a try body first, executes a catch body only if try fails, and exposes stable parent outputs plus reserved `catch.error|catch.failed_step_id|catch.failed_phase|catch.try_status` refs to the catch body.
- `Fallback Step`: `lace.Fallback.v1` is the ordered-alternative control-flow step; it evaluates candidates sequentially, stops at the first success, and exposes reserved `fallback.attempt_index|fallback.candidate_id|fallback.failures|fallback.last_failure` refs to later candidates.
- `Switch Step`: `lace.Switch.v1` is the selector-based dispatch control-flow step; it resolves one selector value, executes exactly one exact-match case or optional default case, and exposes stable parent outputs plus reserved `switch.selector|switch.case_id|switch.case_value|switch.match_mode` refs to the selected body.
- `Return Step`: `lace.Return.v1` is the intentional early-success control-flow step; it terminates the current pipeline scope successfully, preserves stable `payload|reason|message` outputs, and skips later sibling steps in that same scope without treating the run as failed.
- `WaitForInput Step`: `lace.WaitForInput.v1` is the pause-and-resume control-flow step; it marks the current pipeline scope as `waiting_for_input`, persists prompt/schema checkpoint metadata, and resumes deterministically once external input is submitted to the waiting step.
- `Delay Step`: `lace.Delay.v1` is the duration-based scheduling control-flow step; it marks the current pipeline scope as `delayed`, persists `duration_seconds|scheduled_at|resume_at` checkpoint metadata, and resumes automatically later without blocking a worker thread.
- `WaitUntil Step`: `lace.WaitUntil.v1` is the absolute-time scheduling control-flow step; it marks the current pipeline scope as `waiting_until`, persists `scheduled_at|resume_at` checkpoint metadata, and resumes automatically when UTC time reaches `resume_at` without blocking a worker thread.
- `Legacy Subpipeline Syntax`: `subpipeline: <pipeline_id>` remains supported for backward compatibility and expands during load/materialization.
- `LLMCall` vs `ToolAgent`: `LLMCall` is single-shot; `ToolAgent` is multi-turn tool-loop with allowlists and bounded turns.

Rule of thumb:
- Add new `Step Types` for new runtime capabilities.
- Use `Step Templates` for reusable no-code configuration of existing primitives.
- Use `Step Compositions` when reusing full multi-step flows through the flat catalog.
- Use `lace.SubPipeline.v1` when the pipeline author intentionally wants the explicit macro step, not when a reusable composition contract already exists.
- Use `lace.ForEach.v1` when reusing an existing capability or subpipeline per item in a deterministic collection.
- Use `lace.ParallelForEach.v1` when the same per-item work is independent and you need bounded concurrency without giving up ordered collected outputs.
- Use `lace.RepeatUntil.v1` when the same capability or subpipeline should refine iteratively against a bounded declarative exit condition.
- Use `lace.Branch.v1` when a pipeline needs explicit first-match routing with an optional default path instead of leaking conditional behavior into primitive steps.
- Use `lace.Reduce.v1` when a pipeline needs deterministic fan-in or accumulation after iterating over ordered results.
- Use `lace.TryCatch.v1` when a pipeline needs explicit recovery semantics and should encapsulate whether the primary or fallback path produced the final outputs.
- Use `lace.Fallback.v1` when a pipeline needs an ordered list of alternatives and should stop at the first successful provider, parser, retrieval strategy, or subpipeline.
- Use `lace.Switch.v1` when routing is driven by a single explicit selector key such as artifact type, provider, mode, or environment, rather than repeated conditional branches.
- Use `lace.Return.v1` when a pipeline should end the current scope intentionally and successfully after a guard clause, fast path, approval signal, or other explicit short-circuit condition.
- Use `lace.WaitForInput.v1` when a pipeline must pause for structured external input without treating the run as failed or overloading human-review semantics.
- Use `lace.Delay.v1` when a pipeline should cool off, defer continuation, or throttle downstream work for a bounded duration without sleeping inside an active worker.
- Use `lace.WaitUntil.v1` when a pipeline should resume at a specific UTC timestamp window; use `lace.Delay.v1` for relative waits.
- Keep `framework` and `governance` as flags, never as the primary ontology kind.
- Choose `impl_kind` based on where/how a capability executes, independent of the capability identity.

For the complete normalized mapping and runtime rules, see `docs/spec/STEP_DEFINITION_MODEL.md`.

Example (`lace.SubPipeline.v1`):
```yaml
steps:
  - id: ingest
    type: lace.SubPipeline.v1
    params:
      pipeline_ref: { pipeline_id: lace.IngestPipeline, alias: latest }
      id_prefix: ingest
      input_bindings:
        request: pipeline.inputs.request
      output_bindings:
        ingest_report: pipeline.outputs.ingest_report
```

Example (`lace.ForEach.v1`, inline step body):
```yaml
steps:
  - id: summarize_chunks
    type: lace.ForEach.v1
    params:
      items_ref: steps.chunk.outputs.chunks
      item_name: chunk
      mode: sequential
      output_strategy: collect
      body:
        step:
          id: summarize
          type: lace.LLMCall.v1
          inputs:
            chunk_text:
              type: string
              ref: loop.item.text
          outputs:
            llm_response: lace.LLMResponse.v1
```

Example (`lace.ForEach.v1`, subpipeline body):
```yaml
steps:
  - id: process_requirements
    type: lace.ForEach.v1
    params:
      items_ref: steps.requirements.outputs.items
      item_name: requirement
      mode: sequential
      output_strategy: collect
      body:
        pipeline_ref:
          alias: lace.RequirementAnalysisPipeline@latest
        input_bindings:
          requirement: loop.item
          requirement_index: loop.index
          requirement_count: loop.count
```

Example (`lace.ParallelForEach.v1`, inline step body):
```yaml
steps:
  - id: embed_chunks
    type: lace.ParallelForEach.v1
    params:
      items_ref: steps.chunk.outputs.chunks
      item_name: chunk
      max_concurrency: 8
      output_strategy: collect
      failure_policy: fail_fast
      body:
        step:
          id: embed
          type: lace.EmbeddingCall.v1
          inputs:
            text:
              type: string
              ref: loop.item.text
          outputs:
            vector: array
```

Example (`lace.ParallelForEach.v1`, subpipeline body):
```yaml
steps:
  - id: analyze_requirements
    type: lace.ParallelForEach.v1
    params:
      items_ref: steps.requirements.outputs.items
      item_name: requirement
      max_concurrency: 4
      output_strategy: collect
      failure_policy: collect_failures
      body:
        pipeline_ref:
          alias: lace.RequirementAnalysisPipeline@latest
        input_bindings:
          requirement: loop.item
          requirement_index: loop.index
          requirement_count: loop.count
```

Example (`lace.RepeatUntil.v1`, inline step body):
```yaml
steps:
  - id: regenerate_until_valid
    type: lace.RepeatUntil.v1
    params:
      max_iterations: 3
      stop_condition:
        ref: iteration.outputs.validation.passed
        operator: equals
        value: true
      on_exhaustion: fail
      body:
        step:
          id: validate
          type: lace.ValidateLLMResponse.v1
          inputs:
            candidate:
              type: object
              ref: repeat.last.outputs
          outputs:
            validation: object
```

Example (`lace.RepeatUntil.v1`, subpipeline body):
```yaml
steps:
  - id: refine_until_ready
    type: lace.RepeatUntil.v1
    params:
      max_iterations: 4
      stop_condition:
        ref: iteration.outputs.readiness.score
        operator: gte
        value: 0.95
      on_exhaustion: fail
      body:
        pipeline_ref:
          alias: lace.RefinementPassPipeline@latest
        input_bindings:
          artifact_id: pipeline.inputs.artifact_id
          prior_result: repeat.last.outputs
          iteration_index: repeat.index
```

Example (`lace.Branch.v1`, inline step body):
```yaml
steps:
  - id: route_generation
    type: lace.Branch.v1
    params:
      selection_mode: first_match
      branches:
        - id: remediation
          condition:
            ref: steps.validation.outputs.passed
            operator: equals
            value: false
          body:
            step:
              id: repair
              type: lace.LLMCall.v1
              inputs:
                artifact:
                  type: object
                  ref: pipeline.inputs.artifact
              outputs:
                repaired: object
      default_branch:
        id: standard_path
        body:
          step:
            id: continue
            type: lace.Transform.v1
            inputs:
              input:
                type: object
                ref: pipeline.inputs.artifact
            outputs:
              output: object
```

Example (`lace.Branch.v1`, subpipeline body):
```yaml
steps:
  - id: route_generation
    type: lace.Branch.v1
    params:
      selection_mode: first_match
      branches:
        - id: ontology_path
          condition:
            ref: pipeline.inputs.artifact_type
            operator: equals
            value: ontology
          body:
            pipeline_ref:
              alias: lace.OntologyPipeline@latest
            input_bindings:
              artifact_id: pipeline.inputs.artifact_id
        - id: fast_path
          condition:
            ref: steps.score.outputs.confidence
            operator: gte
            value: 0.95
          body:
            pipeline_ref:
              alias: lace.FastPathPipeline@latest
            input_bindings:
              artifact_id: pipeline.inputs.artifact_id
      default_branch:
        id: standard_path
        body:
          pipeline_ref:
            alias: lace.StandardPathPipeline@latest
          input_bindings:
            artifact_id: pipeline.inputs.artifact_id
```

Example (`lace.Reduce.v1`, inline step body):
```yaml
steps:
  - id: merge_summaries
    type: lace.Reduce.v1
    params:
      items_ref: steps.summarize_chunks.outputs.results
      initial_accumulator:
        summaries: []
      result_ref: reduce.final.outputs.accumulator
      body:
        step:
          id: merge_one
          type: lace.Transform.v1
          inputs:
            accumulator:
              type: object
              ref: reduce.accumulator
            item:
              type: object
              ref: reduce.item
            index:
              type: integer
              ref: reduce.index
          outputs:
            accumulator: object
```

Example (`lace.Reduce.v1`, subpipeline body):
```yaml
steps:
  - id: merge_evidence
    type: lace.Reduce.v1
    params:
      items_ref: steps.retrieve.outputs.results
      initial_accumulator:
        evidence: []
        citations: []
      on_empty: return_initial
      body:
        pipeline_ref:
          alias: lace.MergeEvidenceItemPipeline@latest
        input_bindings:
          accumulator: reduce.accumulator
          item: reduce.item
          index: reduce.index
          count: reduce.count
```

Example (`lace.TryCatch.v1`, inline try + subpipeline catch):
```yaml
steps:
  - id: resilient_parse
    type: lace.TryCatch.v1
    params:
      try_body:
        step:
          id: parse
          type: lace.Transform.v1
          inputs:
            input:
              type: object
              ref: pipeline.inputs.payload
          outputs:
            parsed: object
      catch_body:
        pipeline_ref:
          alias: lace.ParseRepairPipeline@latest
        input_bindings:
          raw: pipeline.inputs.payload
          error: catch.error
          error_message: catch.error.message
          failed_step_id: catch.failed_step_id
```

Example (`lace.TryCatch.v1`, subpipeline try + inline catch):
```yaml
steps:
  - id: retrieval_with_recovery
    type: lace.TryCatch.v1
    params:
      try_body:
        pipeline_ref:
          alias: lace.PrimaryRetrievalPipeline@latest
        input_bindings:
          query: pipeline.inputs.query
      catch_body:
        step:
          id: fallback_retrieve
          type: lace.RetrieveSegments.v1
          inputs:
            query:
              type: string
              ref: pipeline.inputs.query
          outputs:
            segments: array
```

Example (`lace.Fallback.v1`, inline candidates):
```yaml
steps:
  - id: llm_with_fallback
    type: lace.Fallback.v1
    params:
      candidates:
        - id: primary_openai
          body:
            step:
              id: call_openai
              type: lace.LLMCall.v1
              inputs:
                prompt:
                  type: string
                  ref: pipeline.inputs.prompt
              outputs:
                response: object
              params:
                provider: openai
                model: gpt-5
        - id: anthropic_backup
          body:
            step:
              id: call_anthropic
              type: lace.LLMCall.v1
              inputs:
                prompt:
                  type: string
                  ref: pipeline.inputs.prompt
              outputs:
                response: object
              params:
                provider: anthropic
                model: claude-sonnet
```

Example (`lace.Fallback.v1`, subpipeline candidate with failure context):
```yaml
steps:
  - id: retrieval_fallback
    type: lace.Fallback.v1
    params:
      candidates:
        - id: dense
          body:
            step:
              id: retrieve_dense
              type: lace.RetrieveSegments.v1
              inputs:
                query:
                  type: string
                  ref: pipeline.inputs.query
              outputs:
                segments: array
        - id: sparse
          body:
            pipeline_ref:
              alias: lace.SparseRetrievalPipeline@latest
            input_bindings:
              query: pipeline.inputs.query
              prior_failures: fallback.failures
              last_failure: fallback.last_failure
```

Example (`lace.Switch.v1`, inline case body):
```yaml
steps:
  - id: provider_router
    type: lace.Switch.v1
    params:
      selector_ref: pipeline.inputs.provider
      match_mode: exact
      cases:
        - value: openai
          case_id: openai_call
          body:
            step:
              id: call_openai
              type: lace.LLMCall.v1
              inputs:
                prompt:
                  type: string
                  ref: pipeline.inputs.prompt
              outputs:
                response: object
              params:
                provider: openai
        - value: anthropic
          case_id: anthropic_call
          body:
            step:
              id: call_anthropic
              type: lace.LLMCall.v1
              inputs:
                prompt:
                  type: string
                  ref: pipeline.inputs.prompt
              outputs:
                response: object
              params:
                provider: anthropic
```

Example (`lace.Switch.v1`, subpipeline case body):
```yaml
steps:
  - id: artifact_router
    type: lace.Switch.v1
    params:
      selector_ref: pipeline.inputs.artifact_type
      match_mode: exact
      cases:
        - value: ontology
          case_id: ontology_path
          body:
            pipeline_ref:
              alias: lace.OntologyPipeline@latest
            input_bindings:
              artifact_id: pipeline.inputs.artifact_id
              artifact_type: switch.selector
              selected_case: switch.case_id
      default_case:
        case_id: generic_path
        body:
          pipeline_ref:
            alias: lace.GenericArtifactPipeline@latest
```

Example (`lace.Return.v1`, top-level early return):
```yaml
steps:
  - id: return_empty
    type: lace.Return.v1
    inputs:
      payload:
        type: object
        ref: steps.prepare.outputs.empty_result
      reason:
        type: string
        ref: pipeline.inputs.mode
    params:
      return_code: early_success
      message: No sources available; returning empty result.
```

Example (`lace.Return.v1`, subpipeline-local return):
```yaml
steps:
  - id: route_mode
    type: lace.Switch.v1
    params:
      selector_ref: pipeline.inputs.mode
      match_mode: exact
      cases:
        - value: fast
          case_id: fast_path
          body:
            pipeline_ref:
              alias: lace.FastPathPipeline@latest
            input_bindings:
              mode: pipeline.inputs.mode
```

Inside `lace.FastPathPipeline@latest`:
```yaml
steps:
  - id: return_now
    type: lace.Return.v1
    inputs:
      payload:
        type: object
        ref: steps.fast_summary.outputs.summary
    params:
      return_code: fast_path
      message: Fast-path result is sufficient.
```

Example (`lace.WaitForInput.v1`, top-level pause and resume):
```yaml
steps:
  - id: ask_for_mode
    type: lace.WaitForInput.v1
    params:
      prompt: Select the generation mode.
      input_schema:
        type: object
        required: [mode]
        properties:
          mode:
            type: string
            enum: [fast, standard, deep]
```

Example (`lace.WaitForInput.v1`, subpipeline-local pause):
```yaml
steps:
  - id: route_mode
    type: lace.Switch.v1
    params:
      selector_ref: pipeline.inputs.mode
      match_mode: exact
      default_case:
        case_id: collect_missing
        body:
          pipeline_ref:
            alias: lace.CollectMissingMetadataPipeline@latest
```

Inside `lace.CollectMissingMetadataPipeline@latest`:
```yaml
steps:
  - id: request_metadata
    type: lace.WaitForInput.v1
    params:
      title: Missing Metadata Required
      prompt: Provide the missing opportunity metadata.
      input_schema:
        type: object
        required: [opportunity_id, client_name]
        properties:
          opportunity_id:
            type: string
          client_name:
            type: string
```

Example (`lace.Delay.v1`, top-level scheduled pause):
```yaml
steps:
  - id: cool_off
    type: lace.Delay.v1
    params:
      duration_seconds: 300
```

Example (`lace.WaitUntil.v1`, top-level absolute-time pause):
```yaml
steps:
  - id: wait_for_deadline
    type: lace.WaitUntil.v1
    params:
      timestamp: "2026-03-10T09:00:00Z"
      message: Waiting for submission window
```

Example (`lace.Delay.v1`, subpipeline-local delay):
```yaml
steps:
  - id: retry_path
    type: lace.TryCatch.v1
    params:
      try_body:
        pipeline_ref:
          alias: lace.PrimaryRetrievalPipeline@latest
      catch_body:
        pipeline_ref:
          alias: lace.DegradedRetrievalPipeline@latest
```

Inside `lace.DegradedRetrievalPipeline@latest`:
```yaml
steps:
  - id: cool_off
    type: lace.Delay.v1
    params:
      duration_seconds: 30
  - id: retry
    type: lace.RetrieveSegments.v1
    inputs:
      query:
        type: string
        ref: pipeline.inputs.query
```

Dry-run API example (`POST /v1/pipeline-drafts/{draft_id}/dry-run`):
```json
{
  "draft_id": "demo.foreach",
  "ok": true,
  "simulated_steps": [
    {
      "step_index": 2,
      "step_id": "summarize_chunks",
      "type_id": "lace.ForEach.v1",
      "status": "ready",
      "input_bindings": [],
      "output_bindings": ["count", "results"],
      "diagnostic": null
    }
  ],
  "diagnostics": []
}
```

The dry-run response validates the `ForEach` authoring contract, confirms the collected parent outputs (`results`, `count`), and leaves generated iteration children inspectable at runtime rather than inventing synthetic dry-run-only semantics.

---

## 11. Storage Backends

```
┌───────────────────────────────────────────────────────────────────────┐
│                        STORAGE LAYER                                  │
│                                                                       │
│  TWO MODES (selected via LACE_STATE_BACKEND env var):                 │
│                                                                       │
│  ┌─────────────────────────────────────────────────────────────────┐ │
│  │  FILE BACKEND (default, dev/test)                               │ │
│  │  src/lace/api/store.py + mvp_store.py                           │ │
│  │                                                                 │ │
│  │  .lace/                                                         │ │
│  │  ├── artifacts/          ArtifactIR JSON files                  │ │
│  │  ├── runs/               Run state JSON files                   │ │
│  │  ├── blobs/              Content-addressed blob store           │ │
│  │  └── llm_cassettes/      LLM replay cache (cassettes)          │ │
│  └─────────────────────────────────────────────────────────────────┘ │
│                                                                       │
│  ┌─────────────────────────────────────────────────────────────────┐ │
│  │  POSTGRES BACKEND (production)                                  │ │
│  │  src/lace/api/postgres_store.py                                 │ │
│  │                                                                 │ │
│  │  PostgreSQL 15+ with pgvector extension                         │ │
│  │  All tables in migrations/sql/full_schema.sql                   │ │
│  │  Migrations managed by Alembic (0001–0014)                     │ │
│  └─────────────────────────────────────────────────────────────────┘ │
│                                                                       │
│  OBJECT STORE (MinIO):                                                │
│  └── S3-compatible blob store for ingest originals + derived artifacts│
│      and large compiled outputs                                       │
│      Port 9000 (API), 9001 (MinIO console)                           │
│                                                                       │
│  EVENT BUS (NATS JetStream, optional):                                │
│  └── Change events fan-out to subscribers                             │
│      LACE_EVENT_BUS=jetstream, NATS_URL=nats://localhost:4222        │
└───────────────────────────────────────────────────────────────────────┘
```

---

## 12. Ingest + Retrieval Plane

Ingest is a dedicated **Postgres schema** (`lace_ingest`) with a dataset-first relational core and object artifacts in MinIO. Source ingestion is executed by `lace.SourceIngest.v1`, and persistence is finalized through `PostgresApiStateStore.persist_ingest_annotations()` in the run path.

Key ingest2 entities:
- `datasets`, `dataset_items`, `dataset_item_versions`, `dataset_ingest_runs`
- `resources`/`resource_versions` linked to dataset/item/version
- `segments`, `segment_lexical`, `segment_vectors`, `annotations`
- `model_invocations` for model-call auditability

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                     INGEST 2.0 WRITE + READ PATH                            │
│                                                                             │
│  WRITE PATH (SourceIngest + persistence hook):                              │
│                                                                             │
│  dataset → item → item_version                                              │
│       │                                                                     │
│       ├── original binary stored in MinIO (bucket/object key in Postgres)   │
│       └── resource/resource_version linkage                                  │
│                    │                                                         │
│                    ▼                                                         │
│          segment creation by view                                            │
│          section | fixed | table_row | transcript | scene | late            │
│                    │                                                         │
│                    ├── lexical index (segment_lexical / tsvector)           │
│                    ├── embeddings (segment_vectors / pgvector)              │
│                    │     via ModelGateway task `embedding.text`             │
│                    └── enrichments/annotations                              │
│                          (NER, summaries, language, quality, provenance)    │
│                          via ModelGateway task `ner.text`                   │
│                                                                             │
│  Model aliases used by ingest defaults:                                     │
│  - default.embedding.search                                                 │
│  - default.ner.general                                                      │
│                                                                             │
│  READ PATH (POST /v1/retrieve):                                             │
│                                                                             │
│  filters: dataset_id(s), item_ids, security_labels, view_types              │
│  modes: dense | sparse | hybrid                                             │
│  returns: ranked segments + score explainability + provenance anchors        │
│                                                                             │
│  Postgres backend: pgvector + FTS hybrid retrieval.                         │
│  File backend: deterministic fallback retrieval for contract parity.         │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Trace and Eventing

```
RUN TRACE SYSTEM (PipelineTraceSink):
├── run_trace_sessions  — one per run, records trace_level
├── run_trace_frames    — one per event during execution
│   └── frame phases: step_start | step_end | step_error | span | checkpoint
│       payloads inlined when small; stored in blob refs when large
└── run_trace_blob_refs — blob pointer for large frame payloads
    └── forensic mode (deep_trace.py) adds full function-level spans

Trace retention (background sweep thread at API startup):
├── LACE_TRACE_RETENTION_SWEEP_INTERVAL_SECONDS  (sweep frequency)
└── LACE_TRACE_RETENTION_SWEEP_LIMIT             (max frames deleted per sweep)

EVENT STREAMS:
├── run_events table          → canonical ordered log (per-run sequence)
├── NATS JetStream (optional) → fan-out to subscribers
│   ├── Subject: runs.<run_id>.events
│   └── Subject: artifacts.<artifact_id>.changes
│       Stream: LACE_RUN_EVENTS (default name)
├── control_plane_events      → planning/supervision/action events
└── agent_task_events         → agent runtime lifecycle events
```

---

## 13. API Surface

All routes are in `src/lace/api/server.py`. Legacy parity routes still exist under
`/api/v1/*` for backward compatibility.

### Pipeline/App/UI Runtime Endpoints

```
GET    /v1/pipelines/{pipeline_slug}/entry/new
       Resolve first-class pipeline launch route → /apps/{app_id}/new

GET    /v1/apps/{app_id}/active-release
GET    /v1/apps/{app_id}/releases/{release_id}/ui-runtime
       Return runtime UI contract (ui_binding, ui_schema, capabilities,
       isolation mode, ui module validation result)

GET    /v1/ui-modules
POST   /v1/ui-modules
GET    /v1/ui-modules/{module_id}
GET    /v1/ui-modules/{module_id}/versions
POST   /v1/ui-modules/{module_id}/versions
GET    /v1/ui-modules/{module_id}/versions/{version}
POST   /v1/ui-modules/{module_id}/versions/{version}/verify-signature
       Public UI module registry management + signature verification lifecycle

POST   /v1/apps/{app_id}/sessions
GET    /v1/apps/{app_id}/sessions
GET    /v1/apps/{app_id}/sessions/{session_id}

GET    /v1/apps/{app_id}/sessions/{session_id}/ui-state?view_id=...
PUT    /v1/apps/{app_id}/sessions/{session_id}/ui-state
       Persist/hydrate per-session UI view state

GET    /v1/apps/{app_id}/sessions/{session_id}/runs
POST   /v1/apps/{app_id}/sessions/{session_id}/runs
       Start runs through app session context (plan+run flow)

GET    /v1/apps/{app_id}/sessions/{session_id}/messages
POST   /v1/apps/{app_id}/sessions/{session_id}/messages
       Session conversation/feed API
```

### Run Control + Events (used by runtime UI SDK)

```
POST   /v1/runs
GET    /v1/runs/{run_id}
POST   /v1/runs/{run_id}/pause
POST   /v1/runs/{run_id}/resume
POST   /v1/runs/{run_id}/cancel
POST   /v1/runs/{run_id}/retry
POST   /v1/runs/{run_id}/human-review
GET    /v1/runs/{run_id}/events
GET    /v1/runs/{run_id}/events/stream        # SSE
WS     /v1/runs/{run_id}/stream               # WebSocket
GET    /v1/runs/{run_id}/trace
GET    /v1/runs/{run_id}/trace/frames/{seq}
```

### Dataset + Ingest APIs (Ingest 2.0 hard cutover)

```
GET    /v1/datasets
POST   /v1/datasets
GET    /v1/datasets/{dataset_id}
PATCH  /v1/datasets/{dataset_id}
DELETE /v1/datasets/{dataset_id}

GET    /v1/datasets/{dataset_id}/items
POST   /v1/datasets/{dataset_id}/items
POST   /v1/datasets/{dataset_id}/items/upload/presign
POST   /v1/datasets/{dataset_id}/items/{item_id}/reprocess
DELETE /v1/datasets/{dataset_id}/items/{item_id}

GET    /v1/items/{item_id}
GET    /v1/items/{item_id}/versions
GET    /v1/items/{item_id}/download

GET    /v1/datasets/{dataset_id}/ingest/runs
GET    /v1/datasets/{dataset_id}/ingest/health
```

Hard cutover note:
- `/v1/data-stores*` was removed in favor of `/v1/datasets*`.
- run source metadata now uses `dataset_ids` (with compatibility fallback support where needed).

### Other Platform Domains

- Artifacts/workspace CRUD + compilation + source management
- Retrieval (`/v1/retrieve`, `/v1/retrieve/expand`) with dataset/item/security/view filters and score provenance explainability
- Pipeline authoring + step catalog
- Control-plane supervision/actions
- Agent runtime, integrations, admin/ops

For exact request/response shapes, use `http://localhost:8000/docs` and the generated
OpenAPI document (`/openapi.json`).

---

## 14. Frontend Architecture

LACE frontend remains a Vite + React SPA, now with a dedicated runtime UI subsystem
for pipeline/app-specific experiences.

### Route Model

```
/pipelines/:pipelineSlug/new                        -> PipelineEntryNewPage
/apps/:appId/new                                    -> AppRuntimeHostPage
/apps/:appId/sessions/:sessionId                    -> AppRuntimeHostPage
/datasets                                            -> Datasets list page
/datasets/:datasetId                                 -> Dataset detail page
/runtime-ui/iframe                                  -> RuntimeUiIframePage
```

Compatibility/legacy routes still exist (`/artifacts/new`, `/apps/:appId/gov-runtime`), but
first-class user launch should be pipeline slug -> app runtime host. Dataset UX is now first-class (`/datasets*`) and replaces former data-store-first navigation.

### Runtime UI Subsystem (`frontend/src/runtime-ui/*`)

- `loader.ts`: dynamic import for runtime UI modules and SDK compatibility checks
- `sdk.ts`: stable API contract wrapper for plugin UIs (session, run, control, review APIs)
- `events.ts`: SSE event stream + merge helpers for progressive run state
- `iframe-bridge.ts`: postMessage bridge and allowlist for iframe-isolated UIs
- `types.ts`: runtime-facing TypeScript models

### UI Isolation Modes

- `host`: plugin React component renders directly in host page
- `iframe`: plugin renders in sandboxed iframe (`allow-scripts allow-forms`) via bridge
- isolation mode is controlled by `app_releases.ui_isolation_mode` / `ui_binding.isolation_mode`

### Plugin Entry Points (Built-in)

- Gov proposal:
  - `frontend/src/runtime-ui/plugins/gov-proposal/new-run.tsx`
  - `frontend/src/runtime-ui/plugins/gov-proposal/session-home.tsx`
  - `frontend/src/runtime-ui/plugins/gov-proposal/run-detail.tsx`
- Artifact generator:
  - `frontend/src/runtime-ui/plugins/artifact-generator/new-run.tsx`

### State + Data

- TanStack Query for server state and hydration
- Session-scoped UI state persisted through `/v1/apps/{app_id}/sessions/{session_id}/ui-state`
- Run updates consumed through `/v1/runs/{run_id}/events/stream` (SSE) with websocket fallback support

---

## 15. Runtime Dataflow

### A. Pipeline Route -> App Runtime Resolution

```
User opens /pipelines/{pipeline_slug}/new
      │
      ▼
Frontend: PipelineEntryNewPage
      │ GET /v1/pipelines/{pipeline_slug}/entry/new
      ▼
Backend resolves active app release bound to that slug
      │
      ▼
Frontend navigates -> /apps/{app_id}/new
```

### B. App Runtime UI Boot Sequence

```
AppRuntimeHostPage
  1) GET /v1/apps/{app_id}/active-release
  2) GET /v1/apps/{app_id}/releases/{release_id}/ui-runtime
  3) Select entrypoint by page intent:
     - new_run
     - session_home
     - run_detail
  4) loadRuntimeUiComponent(entrypoint, sdk_api_min/max)
  5) Render plugin in host mode OR iframe mode
  6) Fallback to baseline runtime page if module validation/load fails
```

### C. Session + Run Execution Flow

```
Runtime UI Plugin (using runtime-ui/sdk.ts)
  │ POST /v1/apps/{app_id}/sessions                         (new session)
  │ POST /v1/apps/{app_id}/sessions/{session_id}/runs       (start run)
  ▼
FastAPI run creation + control-plane plan
  ▼
Pipeline orchestrator executes typed steps
  ▼
run_events + run_trace_frames persisted
  ▼
UI subscribes GET /v1/runs/{run_id}/events/stream (SSE)
  ▼
plugin updates progress/cards/gates/logs in real time
```

### D. User Intervention Loop

The runtime SDK exposes user controls that map to run control endpoints:

- `pauseRun` -> `POST /v1/runs/{run_id}/pause`
- `resumeRun` -> `POST /v1/runs/{run_id}/resume`
- `cancelRun` -> `POST /v1/runs/{run_id}/cancel`
- `retryRun` -> `POST /v1/runs/{run_id}/retry`
- `submitHumanReviewDecision` -> `POST /v1/runs/{run_id}/human-review`

All actions are persisted in run/control-plane events for provenance + audit.

---

## 16. Docker Compose Stack

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        DOCKER COMPOSE STACK                                 │
│                           docker-compose.yml                                │
│                                                                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌────────────┐  ┌──────────┐  │
│  │ postgres │  │  minio   │  │   nats   │  │ migrations │  │   api    │  │
│  │          │  │          │  │          │  │            │  │          │  │
│  │ port:5432│  │ port:9000│  │ port:4222│  │ runs SQL   │  │ port:8000│  │
│  │ pgvector │  │ port:9001│  │ port:8222│  │ migrations │  │ FastAPI  │  │
│  │ enabled  │  │ (console)│  │ (monitor)│  │ on startup │  │ server   │  │
│  └──────────┘  └──────────┘  └──────────┘  └────────────┘  └──────────┘  │
│       ▲              ▲             ▲               ▲               │        │
│       │              │             │               │               │        │
│       └──────────────┴─────────────┴───────────────┴───────────────┘        │
│                            depends_on chain                                  │
│                                                                             │
│  ENVIRONMENT (api service):                                                 │
│  ├── DATABASE_URL=postgresql://lace:lace@postgres:5432/lace                 │
│  ├── LACE_STATE_BACKEND=postgres                                             │
│  ├── LACE_RUN_STORE_BACKEND=postgres                                         │
│  ├── LACE_EVENT_BUS=jetstream                                                │
│  ├── NATS_URL=nats://nats:4222                                               │
│  ├── OPENAI_API_KEY (from host env)                                          │
│  └── ANTHROPIC_API_KEY (from host env)                                       │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 17. Key Environment Variables

| Variable | Values | Purpose |
|---|---|---|
| `LACE_STATE_BACKEND` | `postgres` \| `file` | Artifact/run state store |
| `LACE_RUN_STORE_BACKEND` | `postgres` \| `file` | Run step storage |
| `DATABASE_URL` | `postgresql://...` | Postgres connection |
| `LACE_EVENT_BUS` | `jetstream` \| `none` | Change event fan-out |
| `NATS_URL` | `nats://host:4222` | NATS JetStream endpoint |
| `LACE_UI_MODULE_SIGNING_KEYS` | JSON map or `key=secret,...` | HMAC keys for UI module signature verification |
| `LACE_RESUME_PENDING_RUNS` | `1` | Resume queued/running runs on startup |
| `LACE_RESUME_LIMIT` | `100` | Max runs to resume |
| `LACE_SUPERVISOR_CADENCE` | `1` | Enable supervisor background thread |
| `LACE_SUPERVISOR_POLL_INTERVAL_SECONDS` | `5` | Supervision check frequency |
| `LACE_METRICS_PERSIST` | `1` | Persist metrics snapshots |
| `LACE_METRICS_PERSIST_INTERVAL_SECONDS` | `60` | Metrics snapshot frequency |
| `LACE_LLM_REPLAY_CACHE_DIR` | `.lace/llm_cassettes` | LLM cassette location |
| `OPENAI_API_KEY` | `sk-...` | OpenAI provider auth |
| `ANTHROPIC_API_KEY` | `sk-ant-...` | Anthropic provider auth |
| `LACE_API_KEY` | `<token>` | API server auth token |
| `LACE_ENABLE_DEBUG_STATE_ENDPOINT` | `0` \| `1` | Enable `/v1/debug/state` (default `0`, keep disabled for demos) |
| `LACE_TENANT_ID` | `<uuid>` | Tenant scoping for multi-tenant deployments |
| `LACE_TRACE_RETENTION_SWEEP_INTERVAL_SECONDS` | `3600` | Trace sweep frequency |
| `LACE_TRACE_RETENTION_SWEEP_LIMIT` | `1000` | Max trace frames deleted per sweep |

**LLM replay policy modes** (set per-request or per-step as `llm_replay.mode`):

| Mode | Behavior |
|---|---|
| `off` | No caching; always call the real provider |
| `record` | Call real provider and save response to cassette |
| `replay_exact` | Replay from cassette; fail if no exact match |
| `prefer_replay` | Replay from cassette if match exists; otherwise call provider |
| `replay_last` | Always replay the most recently recorded response |

---

## 18. Model Registry

The model registry is a tenant-scoped catalog of LLM and other AI model entries stored in Postgres. It powers model selection in the Admin UI and Model Gateway task routing for ingest/runtime model calls.

### Schema

```
model_registry_entries
├── tenant_id, model_id (unique composite PK)
├── display_name, model_kind, provider, provider_model_id
├── status: active | deprecated | archived
├── capabilities: [text_generation, tool_calling, json_schema, vision_input,
│                  audio_input, audio_output, reasoning, prompt_caching,
│                  web_search, embedding]
├── modalities: { input: [...], output: [...] }
├── limits: { context_window_tokens, max_input_tokens, max_output_tokens,
│             max_batch_items, max_images, max_audio_seconds }
├── generation_defaults, endpoint, credential_binding
├── metadata: { catalog_source, last_synced_at, ... }
└── tags: [catalog:litellm, provider:<name>, mode:<mode>]

model_registry_aliases
└── tenant_id, alias → model_id  (purpose-keyed named aliases, e.g. "default/llm")

model_invocations
└── tenant_id, invocation_key, run_id, step_key, task, model_id, provider,
    request_hash, status, usage_json, error_json, metadata, created_at
    (model-call audit trail used by Model Gateway)
```

Migrations:
- `migrations/sql/0011_model_registry_tables.sql` (registry + aliases)
- `migrations/sql/0014_model_gateway_invocations.sql` (model invocation logging)

### 18.1 Model Gateway Integration

`src/lace/domain/model_gateway/*` provides task-typed model execution with:
- resolver: alias/model-id lookup against model registry (`ModelResolver`)
- policy gate: provider/task policy checks (`evaluate_policy`)
- provider adapters: embedding + NER (local-first defaults), multimodal task scaffolds
- cache support: in-memory request-key cache for deterministic test/dev paths
- audit logging: writes `model_invocations` rows when Postgres is configured

Day-1 implemented tasks:
- `embedding.text`
- `ner.text`

Scaffolded task IDs (feature-flagged for follow-on execution):
- `ocr.image`
- `asr.audio`
- `asr.video`
- `scene.video`
- `embedding.image`

### Syncing from LiteLLM

The model registry is populated from the LiteLLM model price/context-window catalog via:

```
scripts/sync_model_registry_from_litellm.py
```

**Standard sync (Postgres, all models):**

```bash
python3 scripts/sync_model_registry_from_litellm.py \
  --backend postgres \
  --database-url "$DATABASE_URL" \
  --tenant-id default \
  --archive-missing
```

**`--archive-missing`** marks any previously-synced LiteLLM model that is no longer present in the upstream catalog as `archived`. Without this flag, stale entries remain `active`.

**Options:**

| Flag | Default | Purpose |
|---|---|---|
| `--backend` | auto-detected from env | `postgres` or `file` |
| `--database-url` | `$DATABASE_URL` | Postgres connection string |
| `--tenant-id` | `$LACE_TENANT_ID` or `default` | Tenant to write into |
| `--url` | LiteLLM GitHub raw JSON | Override catalog source URL |
| `--provider` | *(all)* | Filter to specific provider(s), repeatable |
| `--limit` | *(all)* | Cap number of models processed |
| `--archive-missing` | off | Mark removed models as archived |
| `--dry-run` | off | Count changes without writing |

**Filter examples:**

```bash
# Only OpenAI + Anthropic models
python3 scripts/sync_model_registry_from_litellm.py \
  --backend postgres --database-url "$DATABASE_URL" \
  --provider openai --provider anthropic --archive-missing

# Dry-run to preview counts
python3 scripts/sync_model_registry_from_litellm.py \
  --backend postgres --database-url "$DATABASE_URL" \
  --dry-run
```

**Output** is a JSON summary:

```json
{
  "ok": true,
  "backend": "postgres",
  "tenant_id": "default",
  "source_url": "...",
  "processed": 4200,
  "synced": 4187,
  "skipped": 13,
  "archived": 42,
  "dry_run": false,
  "archive_missing": true
}
```

**When to run:** After deploying a new environment or periodically to pick up newly-released models from the LiteLLM catalog. The Admin page surfaces these entries for model selection.

---

## 19. Implementation Status

```
COMPONENT                                     STATUS
──────────────────────────────────────────────────────────────────────────────
Core ArtifactIR + NodeIR + Block              ✅ Complete
File-backed state store                       ✅ Complete
Postgres-backed state store                   ✅ Complete (migrations 0001–0014)
Ingest2 dataset relational core               ✅ Complete (datasets/items/versions/runs)
Model Gateway (embedding + NER + audit logs) ✅ Complete (local-first, alias-routed)
Pipeline definition + orchestration           ✅ Complete
GenerateNodeContentPipeline (20 steps)        ✅ Complete
IngestPipeline (3 steps)                      ✅ Complete
All 20+ step types with typed contracts       ✅ Complete
OpenAI provider integration                   ✅ Complete
Anthropic provider integration                ✅ Complete
Local / Replay / Scripted providers           ✅ Complete
DeterministicApply (gated IR mutation)        ✅ Complete
Multi-target compilation (md/docx/pdf/owl)    ✅ Complete
Control Plane: plan + supervise + execute     ✅ Complete
Published Apps: create/release/session/msg    ✅ Complete
Pipeline -> App route resolver (`/pipelines/*/new`) ✅ Complete
App release UI runtime contract endpoint      ✅ Complete
Runtime UI plugin loader + SDK contract        ✅ Complete
Runtime UI iframe isolation bridge             ✅ Complete
Session UI state hydrate/persist API           ✅ Complete
UI module registry schema + release pin fields ✅ Complete
Agent Runtime: GenericHarnessAdapter          ✅ Complete
Full Postgres schema with migrations          ✅ Complete (0001–0014)
React frontend with typed API client          ✅ Complete
Dataset API/UI hard cutover (`/v1/datasets*`) ✅ Complete
Pipeline DAG visualization                    ✅ Complete
Docker Compose stack                          ✅ Complete
Trace / observability / function tracing      ✅ Complete
Integration registry (service credentials)    ✅ Complete
──────────────────────────────────────────────────────────────────────────────
ClaudeCodeCliAdapter                          🟡 Stub (not implemented)
CodexCliAdapter                               🟡 Stub (not implemented)
Collaborative multi-user app sessions         🟡 Planned
Gov proposal UX polish + richer draft editing 🟡 In progress
Public UI module registry API endpoints       🟡 Planned
LLM-generated UI scaffolding workflow hardening 🟡 Planned
Advanced retrieval tuning (rerank/multimodal) 🟡 Planned
HTML / LaTeX compiler targets                 🟡 Planned
App marketplace / multi-tenant sharing        🟡 Planned
──────────────────────────────────────────────────────────────────────────────
```

---

*End of LACE Architecture Reference — docs/ARCHITECTURE.md (19 sections)*
