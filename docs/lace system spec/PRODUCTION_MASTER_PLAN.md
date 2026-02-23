# LACE Production Master Plan (V1) — PRD + Engineering Spec

Status date: 2026-02-12  
Scope: Move from MVP CLI runtime to production-grade Python backend services.

Primary principle:
- LLM = stateless generator.
- Engine = stateful artifact manager.

## 0.D) Recently Completed (Green Check)

- ✅ Real-provider E2E path operational from source inputs to compiled artifacts (`md`, `owl`) with persisted run trace.
- ✅ Strict JSON transport default with explicit repair mode and tighter response/schema enforcement.
- ✅ Citation intent inference + hard must-cite validation gates.
- ✅ No-split enforcement across intent/strategy/LLM prompting with split suppression telemetry.
- ✅ Debug trace transparency includes exact final LLM system prompt, serialized user prompt, and model response.
- ✅ Markdown duplicate-heading suppression in compiler output.
- ✅ OWL compiler output explicitly marked as stub export.
- ✅ Hybrid+rerank retrieval baseline with improved semantic topic coverage.
- ✅ Expanded unit/integration/live-E2E proof coverage for above behaviors.

## 0) Non-Negotiable V1 Requirements

This plan is anchored to the required target architecture:
- Python backend services.
- Backend service builds as Docker image.
- Docker Compose orchestration for local/dev/prod-like environments.
- PostgreSQL as system-of-record database.
- MinIO (S3-compatible) for file/object storage.
- Event-driven message queue for async workflows.
- No frontend scope for V1 (UI deferred).
- All major functionality exposed via versioned REST API.
- Bootstrap configuration from `.env` + environment variables + DB-backed central settings.
- Centralized LLM provider gateway supporting schema-mode JSON and plain-text modes.
- Provenance wrapper around all LLM invocations and all transformations.
- Generic pipeline streaming model for run/step/status events.
- Run control support: pause, resume, restart, cancel with persisted checkpoints.

### 0.A) V1 Invariants

Engineering cannot violate these without explicit design review:
- Canonical IR:
  - artifact/node/block IR is canonical state,
  - compilation is a pure function of `(IR revision + compiler version + settings snapshot)`.
- No direct LLM-to-state mutation:
  - LLM output must pass deterministic validation + apply before state mutation.
- Idempotency at two layers:
  - API mutation boundary,
  - worker handler boundary.
- Async-only generation:
  - no long-running synchronous generation in API handlers.
- Schema-versioned contracts:
  - REST payloads, event envelopes, IR schemas, settings schemas, transformation logs.
- Tenant scoping:
  - no tenant-ambiguous repository or API mutation paths.

### 0.B) V1 Non-Goals

- No full frontend product scope.
- No multi-user collaborative editing/CRDT.
- No Kubernetes requirement for V1 (Compose baseline).
- No billing subsystem (cost ledger only).
- No unrestricted web crawling source ingestion in V1.

### 0.C) Scope Preservation Rule

- This document extends the prior master plan; it does not remove previously approved scope.
- Legacy workstreams and acceptance criteria remain binding unless explicitly marked deprecated by design review.
- New P0/P1 items are additive hardening layers for production readiness.

## 1) Codebase Audit Snapshot (Current State)

### Strengths already implemented
- Deterministic pipeline runtime with retries, timeout handling, gates, lock heartbeat, and run persistence/resume.
- Strong domain pipeline chain:
  - `load -> resolve -> intent -> source ingest/select -> context -> strategy -> llm -> validate -> apply -> validate -> compile`.
- Contract-first behavior with broad JSON schema validation.
- Deterministic apply engine with action normalization, idempotency keys, history events, and conflict policy modes.
- Provider abstraction for OpenAI/Anthropic/local/fake providers.
- Baseline compilers (`md`, `docx`, `pdf`, `owl`) and substantial unit/integration coverage.

### Production blockers found
- No production REST service framework; runtime is CLI-first.
- No Dockerfile/Compose artifacts in repo.
- Filesystem persistence remains source of truth for runs/artifacts.
- No DB repository layer or migration stack.
- No MinIO/S3 storage adapter.
- No generic run streaming plane (UI/client observable event feed).
- No centralized `.env + env + DB settings` resolution system.
- No OMS-grade transformation log model fully enforced at runtime.
- Retrieval quality path remains deterministic keyword-first without hybrid/rerank.
- Token budgeting uses heuristics rather than provider tokenizer truth.
- Operational hardening gaps:
  - tenancy enforcement strategy,
  - explicit commit semantics,
  - schema/version migration policy,
  - supply-chain governance.

## 2) Target V1 Architecture

### 2.A) Services
- `lace-api` (FastAPI):
  - authn/authz,
  - contract validation,
  - run submission and control,
  - status/read APIs,
  - stream/replay endpoints.
- `lace-worker`:
  - queue consumers,
  - pipeline orchestration,
  - checkpointing,
  - compile/reindex/rollback handlers.
- `lace-migrations`:
  - schema migrations and bootstrap.
- `lace-scheduler` (optional):
  - cleanup, retention, replay, repair utilities.

### 2.B) Platform Dependencies
- `postgres`:
  - canonical metadata and run state.
- `minio`:
  - blob/object persistence.
- `rabbitmq` (or equivalent):
  - async job/event transport with DLQ.
- `otel-collector` + metrics/log sinks:
  - traces, logs, metrics.

### 2.C) Package and Module Boundaries

`lace_core/`:
- IR schemas and migrations.
- deterministic apply engine.
- validators and compiler logic.
- no dependency on FastAPI/Postgres/MinIO/queue/provider SDKs.

`lace_adapters/`:
- Postgres repositories.
- MinIO adapter.
- queue adapter.
- provider adapters.
- OTel/OpenLineage emitters.

`lace_api/`:
- transport, auth, request mapping, response contracts.

`lace_worker/`:
- handler registry,
- execution state machine,
- checkpoint control.

### 2.D) Control-Flow Baseline
1. API accepts request and authenticates/authorizes.
2. API resolves effective settings:
   - defaults -> `.env` -> env -> DB settings -> request overrides.
3. API writes run + control metadata in Postgres (transaction).
4. API writes outbox event.
5. Outbox publisher emits queue event.
6. Worker consumes job and executes steps with provenance wrappers.
7. Worker uses LLM gateway for all provider interactions.
8. Worker persists:
   - state metadata in Postgres,
   - blobs in MinIO,
   - event stream and transformation logs.
9. API serves run/artifact/provenance stream/replay views.

### 2.E) Explicit V1 Architecture Decisions

These decisions are fixed for V1 to remove implementation ambiguity:
- Auth decision:
  - V1 uses service tokens for API auth (with tenant binding in token metadata),
  - OIDC/JWT integration is planned as a later hardening increment.
- Tenancy enforcement decision:
  - V1 uses strict `tenant_id` columns with repository/API enforcement,
  - Postgres RLS is deferred (optional hardening after V1 stabilization).
- PDF extraction decision:
  - V1 uses in-process extraction with strict timeout/memory/page limits,
  - extraction failures emit structured warnings and fail the run only when minimum extractability thresholds are not met.
- Queue/event persistence decision:
  - queue is authoritative for job dispatch and retries,
  - Postgres `run_events` is authoritative for replay and stream cursor state,
  - queue fanout events are optional integration hooks, not replay source of truth.
- Compile semantics decision:
  - commit and compile are decoupled,
  - compile failure never rolls back committed IR,
  - compile retries create a new compile attempt record.
- Settings governance decision:
  - `system` settings writable only by system admins,
  - `tenant` settings writable by tenant admins,
  - `user` settings writable by subject user or delegated admin policy,
  - all settings writes are versioned and auditable.
- Locking decision:
  - canonical mutation paths use DB-backed artifact lease rows (`artifact_locks`) with heartbeat/expiry,
  - no filesystem-only lock authority in production mode.

## 3) Production Gap Matrix

| ID | Workstream | Current | Priority | Effort |
|---|---|---|---|---|
| P0-0 | Defect closure and safety baseline | Partial ✅ | P0 | Medium |
| P0-1 | REST API foundation (FastAPI + OpenAPI + versioning) | Missing | P0 | Large |
| P0-2 | Containerization (`Dockerfile`, Compose stack) | Missing | P0 | Medium |
| P0-3 | PostgreSQL repositories + migrations | Missing | P0 | Large |
| P0-4 | MinIO object storage integration | Missing | P0 | Medium |
| P0-5 | Queue + worker runtime (event-driven) | Missing | P0 | Large |
| P0-6 | Transaction safety + outbox + idempotent handlers | Missing | P0 | Large |
| P0-7 | Security baseline (authz, ABAC, secrets, audit) | Missing | P0 | Large |
| P0-8 | Observability baseline (logs/metrics/traces/alerts) | Missing | P0 | Medium |
| P0-9 | Source persistence + robust extraction | Partial ✅ | P0 | Medium |
| P0-10 | Validation/governance hardening (must-cite/FSM/competency) | Partial ✅ | P0 | Medium |
| P0-11 | `.env` bootstrap + DB-backed settings | Partial ✅ | P0 | Medium |
| P0-12 | Centralized LLM provider gateway | Partial ✅ | P0 | Medium |
| P0-13 | OMS-conformant provenance/lineage/pedigree logging | Missing | P0 | Large |
| P0-14 | Generic pipeline streaming (topics + stream/replay API) | Missing | P0 | Medium |
| P0-15 | Run control pause/resume/restart with DB checkpoints | Missing | P0 | Medium |
| P0-16 | Tenancy + identity model enforcement | Missing | P0 | Medium |
| P0-17 | Schema/versioning policy + migration discipline | Missing | P0 | Medium |
| P0-18 | MVP filesystem-to-DB migration tooling | Missing | P0 | Medium |
| P1-1 | Rollback/version restore API and jobs | Partial | P1 | Medium |
| P1-2 | Retrieval upgrade (hybrid + rerank + deterministic fallback) | Partial ✅ | P1 | Medium |
| P1-3 | Provider-accurate tokenizer budgeting | Missing | P1 | Small |
| P1-4 | Compiler productionization + immutable output versions | Partial ✅ | P1 | Medium |
| P1-5 | Performance/load/SLO enforcement | Missing | P1 | Medium |
| P1-6 | CI/CD hardening (lint/type/security/release) | Missing | P1 | Medium |
| P1-7 | Backup/restore/DR runbooks and drills | Missing | P1 | Medium |
| P1-8 | Test hardening (adversarial/concurrency/corruption) | Partial ✅ | P1 | Medium |
| P1-9 | Supply-chain hardening (SBOM/signing/licenses) | Missing | P1 | Medium |
| P1-10 | Developer onboarding/docs/examples | Missing | P1 | Small |
| P2-1 | Example packs / typed profiles / advanced policy tooling | Partial | P2 | Medium |
| P2-2 | Git-for-documents API (branch/diff/log primitives) | Missing | P2 | Medium |
| P2-3 | Prompt/constraint-as-code policy DSL | Missing | P2 | Medium |
| P2-4 | Test-driven document quality API (`lace test`) | Missing | P2 | Medium |
| P2-5 | Provenance graph exporter (Neo4j/graph sinks) | Missing | P2 | Medium |
| P2-6 | Air-gapped/on-prem packaging profile | Missing | P2 | Medium |

## 4) Workstream Specifications

### P0-0 Defect Closure and Safety Baseline (Prerequisite)

Deliverables:
- Close verified defects and missing safety behavior from secondary review.
- Ensure no silent data loss paths in:
  - apply,
  - storage writes,
  - compilers,
  - resume/replay.
- Centralize duplicated constants and shared contracts.
- Externalize hardcoded runtime limits/defaults into settings.
- Add regression tests per closed defect.
- Track closure of external audit catalog items:
  - A1-A9 (verified bugs),
  - B1-B6 (missing error handling),
  - C1-C4 (contract/schema mismatches),
  - D1-D8 (hardcoded values),
  - E1-E6 (test coverage gaps),
  - F1-F4 (minor hardening).

Exit criteria:
- Defect list is fully mapped to tests and closed issues.
- No silent truncation/silent skip in critical paths.

### P0-1 REST API Foundation

Deliverables:
- FastAPI `/v1` API with generated OpenAPI.
- API-first sequencing:
  - API delivery remains in front of infrastructure hardening sequence.
- Stable error envelope:
  - `error_code`,
  - `message`,
  - `details`,
  - `correlation_id`,
  - `retryable`.
- Async mutation semantics:
  - `202 Accepted` + `run_id`.

Exit criteria:
- All major capabilities callable via REST.
- OpenAPI contract tests pass.

### P0-2 Containerization and Compose

Deliverables:
- Production-grade images for API and worker.
- Compose stack:
  - `api`, `worker`, `migrations`, `postgres`, `minio`, `queue`, telemetry components.
- Healthchecks and readiness wiring.

Exit criteria:
- Full stack starts with deterministic smoke results.

### P0-3 PostgreSQL Data Layer

Deliverables:
- Replace filesystem canonical persistence with Postgres metadata + MinIO blobs.
- Migration toolchain and schema baseline.
- Minimum tables:
  - `artifacts`, `artifact_revisions`, `artifact_nodes`,
  - `artifact_locks`,
  - `runs`, `step_runs`, `run_checkpoints`, `run_control_commands`,
  - `run_events`,
  - `job_executions`, `change_events`,
  - `sources`, `source_units`,
  - `compiled_artifacts`,
  - `tenant_quotas`,
  - `settings`, `transformation_logs`,
  - `outbox_events`.

Exit criteria:
- No production write/read path relies on filesystem JSON for canonical state.

### P0-4 MinIO Object Storage

Deliverables:
- Immutable key design:
  - tenant/artifact/revision/version addressed.
- Signed URL support with scoped TTL.
- Blob classes:
  - source raws,
  - IR snapshots,
  - compiled bundles,
  - replay/event payloads.

Exit criteria:
- Immutable output versioning enforced and tested.

### P0-5 Event Queue and Worker Runtime

Deliverables:
- Queue topics for run, step, streaming, provenance, compile, rollback.
- Dead-letter queue behavior and retry policy.
- Worker handler registry with stable handler version metadata.

Exit criteria:
- Duplicate delivery does not produce duplicate commits.
- DLQ scenarios are auditable and recoverable.

### P0-6 Transaction Safety, Outbox, and Idempotent Handlers

Deliverables:
- Transactional outbox contract:
  - `id`, `tenant_id`, `topic`, `key`, `payload_json`, `schema_version`, `status`, `publish_attempts`, `last_error`, `created_at`, `published_at`.
- Idempotency at API and handler levels.
- Explicit apply/commit flow:
  - staged -> validated -> committed -> compiled.
- Compile failure policy:
  - compile failures never invalidate committed IR,
  - compile retries are explicit and auditable.

Exit criteria:
- Crashes/retries cannot produce double-apply or corrupted canonical pointer.

### P0-7 Security Baseline

Deliverables:
- Authn/Authz implementation and enforcement.
- V1 auth mechanism is service-token based.
- ABAC labels integrated with access control decisions.
- Secret-management interface:
  - dev uses `.env`,
  - production targets external secret backends via adapter contract.
- Upload hardening:
  - size/type guardrails,
  - archive and parser safeguards.
- Prompt-safety controls:
  - treat sources as untrusted,
  - redaction policy before provider calls.
- Audit logging:
  - run control commands,
  - settings changes,
  - privileged mutations.

Exit criteria:
- Security checklist and threat model tests pass.

### P0-8 Observability Baseline

Deliverables:
- Structured logs with run/step correlation.
- Day-1 logging requirement:
  - every API/worker log line carries `run_id`, `step_id` when applicable, and `correlation_id`.
- OTel traces across API -> outbox -> worker -> provider.
- Metrics:
  - latency/error/throughput,
  - queue depth,
  - per-run token/cost ledger.
- Alerts for backlog and SLO burn.

Exit criteria:
- Any run can be diagnosed from one correlation identifier.
- Pilot load baseline is measured and documented before wider rollout.

### P0-9 Source Intake Persistence and Extraction

Deliverables:
- Durable source and source-unit persistence.
- Production extraction path for:
  - `md`, `txt`, `json`, `docx`, `pdf`.
- PDF extraction strategy:
  - in-process extraction with strict timeout/memory/page limits,
  - structured warnings on partial extraction with deterministic failure thresholds.
- Stable segmentation/chunk IDs and extraction metadata:
  - method,
  - tool version,
  - content hashes.

Exit criteria:
- Re-ingestion is deterministic and replayable.

### P0-10 Validation and Governance Hardening

Deliverables:
- Enforce must-cite with evidence references.
- Persist retrieval evidence objects:
  - quotes/snippets + `source_unit` references required for must-cite validation.
- Node lifecycle FSM:
  - `empty -> outlined -> draft -> final`.
- Deterministic competency paths including `llm_judge` contract.
- Parent-chain constraint inheritance with trace.

Exit criteria:
- Validation failures are machine-actionable with deterministic codes.

### P0-11 `.env` Bootstrap and DB-Backed Central Settings

Deliverables:
- Config bootstrap loader with precedence:
  - default -> `.env` -> env -> DB setting -> request override.
- Settings model with scope:
  - `system`, `tenant`, `user`, `run`.
- Settings resolution trace persisted per run (hash + snapshot pointer).
- Settings governance:
  - role-based write permissions by scope,
  - versioned setting records,
  - immutable settings snapshot pinned per run.

Exit criteria:
- Runtime behavior can be changed by settings without code deploy.

### P0-12 Centralized LLM Provider Gateway

Deliverables:
- Single gateway interface for all provider interactions.
- Capability matrix per provider/model:
  - limits,
  - schema mode support,
  - finish reason normalization.
- Contracted operation modes:
  - schema-mode JSON,
  - plain-text mode.
- Fallback/failover and retry policy centralized.
- Resilience controls:
  - exponential backoff,
  - circuit-breaker behavior for degraded providers,
  - normalized truncation/finish-reason handling.

Exit criteria:
- Pipeline steps no longer embed provider-specific transport logic.

### P0-13 OMS-Conformant Provenance/Lineage/Pedigree Logging

Deliverables:
- Transformation envelope for every stage and major data mutation.
- Required fields:
  - identity/security labels,
  - provenance sources and collection context,
  - lineage input/output entities with hashes and URIs,
  - pedigree confidence/validation/evals/risk flags,
  - genai metadata (model/provider/params/usage),
  - telemetry ids (`trace_id`, `span_id`, `parent_span_id`),
  - OpenLineage job/run/status facets,
  - retention policy metadata.
- ABAC and retention metadata integrated with storage/access policy.

Exit criteria:
- 100% stage coverage for transformation logs.
- Provenance graph can reconstruct derivation for any committed revision.

### P0-14 Generic Pipeline Streaming

Deliverables:
- Generic run-event envelope:
  - `event_id`, `event_type`, `sequence`, `occurred_at`,
  - `pipeline_id`, `run_id`, `step_id`, `attempt`,
  - `status`, `progress_pct`, `payload`, `payload_schema_version`.
- Streaming semantics:
  - per-run ordered stream,
  - cursor support via `after_event_id`,
  - heartbeat frames,
  - replay + live tail without gap/duplication.
- Source-of-truth policy:
  - replay is served from persisted Postgres `run_events` rows,
  - queue messages are not relied on as the canonical replay history.
- Payload safety policy:
  - default redacted samples,
  - authorized full payload retrieval via URI.

Exit criteria:
- Late-subscribing client can replay + tail with no gap/duplicate events.

### P0-15 Run Control with DB Checkpoints

Deliverables:
- Run states:
  - `queued`, `running`, `pausing`, `paused`, `resuming`, `succeeded`, `failed`, `cancelled`.
- Control commands:
  - `pause`, `resume`, `restart`, `cancel`.
- Persist safe checkpoints at step boundaries.
- Resume/restart from checkpoint after app crash/redeploy.

Exit criteria:
- User can pause run, restart app, and resume without losing committed work.

### P0-16 Tenancy and Identity Model

Deliverables:
- Tenancy implementation decision:
  - multi-tenant with strict `tenant_id` scoping.
- Identity implementation decision:
  - service-token auth in V1.
- Repository contract:
  - no repository method exists without `tenant_id` parameter.
- Repository/API enforcement:
  - no unscoped access methods.

Exit criteria:
- Cross-tenant read/write isolation proven by tests.

### P0-17 Schema/Versioning Policy

Deliverables:
- Uniform schema id/version policy for:
  - IR,
  - events,
  - API contracts,
  - settings,
  - provenance logs.
- Compatibility rules:
  - events accept N and N-1,
  - deterministic IR migration path required for breaking changes.
- Migration governance:
  - forward migrations required,
  - rollback policy documented.

Exit criteria:
- Compatibility and migration suites pass in CI.

### P0-18 MVP Data Migration and Compatibility

Deliverables:
- `lace-migrate` tooling to import existing filesystem artifacts/runs into Postgres/MinIO.
- Deterministic import reports:
  - imported count,
  - skipped count,
  - validation failures with reasons.
- Backward compatibility policy for legacy artifact snapshots during transition.

Exit criteria:
- Existing MVP data can be migrated without manual intervention for supported snapshots.

### P1-1 Rollback and Version Restore

Deliverables:
- Rollback API/job with dry-run and diff preview.
- Explicit rollback events and audit records.

Exit criteria:
- Rollback restores exact expected revision hash.

### P1-2 Retrieval Upgrade

Deliverables:
- Minimal P0 baseline preserved:
  - deterministic keyword + section boosting + citation enforcement.
- P1 uplift:
  - hybrid retrieval,
  - rerank with topic/citation quality objectives.

Exit criteria:
- Retrieval quality thresholds met on curated corpora.

### P1-3 Token Budgeting Upgrade

Deliverables:
- Provider-aware tokenizer integration.
- Accurate budget enforcement before provider call.

Exit criteria:
- Context overflow incidents reduced to zero on regression corpus.

### P1-4 Compiler Productionization

Deliverables:
- Deterministic compiler behavior and richer formatting quality.
- Immutable compile artifact version records.
- Golden suites for all compiler targets.

Exit criteria:
- Compiler outputs stable across deterministic fixtures.

### P1-5 Performance and SLO

Deliverables:
- SLO definitions and load/soak plans.
- Capacity models for queue and worker scaling.

Exit criteria:
- SLO targets met under expected concurrency.

### P1-6 CI/CD Hardening

Deliverables:
- lint, format, type, unit, integration, contract tests.
- security scanning and gating.
- release automation with versioned images.

Exit criteria:
- Release pipeline enforces quality and security gates.

### P1-7 Backup/Restore and DR

Deliverables:
- Backup policy for Postgres and MinIO.
- Restore rehearsal and DR runbook with measured RTO/RPO.

Exit criteria:
- Successful full restore drill documented.

### P1-8 Test Hardening

Deliverables:
- Adversarial fixtures for malformed/partial/oversized payloads.
- Concurrency tests:
  - lock contention,
  - duplicate events,
  - concurrent run-store writes.
- Corruption tests:
  - truncated state,
  - stale locks,
  - missing blob refs.
- Opt-in real provider integration lane (env-gated).

Exit criteria:
- Failure-mode suites are mandatory and stable.

### P1-9 Supply-Chain Hardening

Deliverables:
- SBOM generation (CycloneDX/SPDX).
- Image signing and attestation for released artifacts.
- Dependency governance:
  - pinning policy,
  - update cadence,
  - license allow/deny rules.

Exit criteria:
- Release promotion requires signed images and policy-compliant SBOM.

### P1-10 Developer Onboarding and Operator Docs

Deliverables:
- Developer quickstart for local Compose stack.
- API usage cookbook and minimal client examples.
- Operations runbooks:
  - deploy,
  - rollback,
  - incident triage,
  - key rotation.

Exit criteria:
- New engineer can run stack and execute first API workflow in under 30 minutes from docs.

## 5) Required REST API Surface (V1)

Core:
- `POST /v1/artifacts`
- `GET /v1/artifacts/{artifact_id}`
- `PATCH /v1/artifacts/{artifact_id}`
- `GET /v1/artifacts/{artifact_id}/nodes/{node_id}`

Runs:
- `POST /v1/runs/generate`
- `POST /v1/runs/regenerate`
- `POST /v1/runs/expand`
- `POST /v1/runs/enrich`
- `POST /v1/runs/patch`
- `POST /v1/runs/outline`
- `POST /v1/runs/auto`
- `GET /v1/runs/{run_id}`
- `GET /v1/runs/{run_id}/steps`
- `GET /v1/runs/{run_id}/events`
- `POST /v1/runs/{run_id}:pause`
- `POST /v1/runs/{run_id}:resume`
- `POST /v1/runs/{run_id}:restart`
- `POST /v1/runs/{run_id}:cancel`

Streaming/replay:
- `GET /v1/runs/{run_id}/stream`
- `GET /v1/runs/{run_id}/events/replay`

Sources/compile/rollback:
- `POST /v1/sources:ingest`
- `GET /v1/sources`
- `GET /v1/sources/{source_id}`
- `POST /v1/compile`
- `GET /v1/compiled/{artifact_id}`
- `POST /v1/artifacts/{artifact_id}:rollback`

Settings/provider/provenance:
- `GET /v1/settings/system`
- `PUT /v1/settings/system`
- `GET /v1/settings/tenants/{tenant_id}`
- `PUT /v1/settings/tenants/{tenant_id}`
- `GET /v1/settings/users/{user_id}`
- `PUT /v1/settings/users/{user_id}`
- `GET /v1/providers/capabilities`
- `POST /v1/providers/validate`
- `GET /v1/provenance/runs/{run_id}`
- `GET /v1/provenance/entities/{entity_id}`

Ops:
- `GET /health/live`
- `GET /health/ready`
- `GET /metrics`

API behavior:
- Mutation endpoints require `Idempotency-Key`.
- Mutation endpoints return `202 Accepted` for async operations.
- `X-Request-Id` and `X-Correlation-Id` are propagated to events/logs/traces.
- Read endpoints support pagination/cursor semantics.

## 6) Data and Event Contracts (V1 Baseline)

### 6.A) Core Postgres Entities (minimum)
- `runs`:
  - `tenant_id`, `run_id`, `pipeline_id`, `status`, `requested_by`, `effective_settings_hash`, `started_at`, `ended_at`.
- `step_runs`:
  - `tenant_id`, `run_id`, `step_id`, `attempt`, `status`, `metrics`, `error`.
- `artifact_revisions`:
  - `tenant_id`, `artifact_id`, `revision_id`, `ir_schema_version`, `ir_hash`, `ir_uri`, `content_hash`, `status` (`staged|validated|committed`), `created_at`.
- `compiled_artifacts`:
  - `tenant_id`, `artifact_id`, `revision_id`, `target`, `compiler_version`, `bundle_hash`, `bundle_uri`, `status`.
- `artifact_locks`:
  - `tenant_id`, `artifact_id`, `lock_owner`, `lock_type`, `acquired_at`, `heartbeat_at`, `expires_at`.
- `run_checkpoints`, `run_control_commands`.
- `run_events`:
  - `tenant_id`, `run_id`, `sequence`, `event_id`, `event_type`, `occurred_at`, `payload_json`, `redaction_level`, `content_hash`, `content_uri`, `schema_version`.
- `sources`, `source_units`.
- `settings`.
- `tenant_quotas`.
- `change_events`.
- `transformation_logs`.
- `job_executions`.
- `outbox_events`.

### 6.B) Settings Contract (minimum)
- `setting_id`,
- `scope_type`,
- `scope_id`,
- `key`,
- `value_json`,
- `priority`,
- `effective_from`,
- `effective_to`,
- `updated_by`,
- `updated_at`.

### 6.C) Transformation Log Contract (minimum)

Identity:
- `id`, `run_id`, `stage`, `activity_name`, `started_at`, `ended_at`, `agent`.

Telemetry/lineage:
- `trace_id`, `span_id`, `parent_span_id`.
- `inputs[]`, `outputs[]` with:
  - `entity_id`,
  - `content_hash`,
  - `uri`.
- `lineage.was_derived_from[]`, `job_name`, `status`.

Provenance/pedigree:
- `provenance.sources[]`, `collection_context`.
- `pedigree.final_confidence`, `validation`, `evals[]`, `risk_flags[]`.

Security/governance:
- `classification`, `caveats[]`, `releasability[]`, `abac_labels[]`.
- `retention_policy` (`policy_id`, `not_after`).
- governance links (`dataset_card`, `model_card`, `factsheet_id`).

GenAI:
- `model_id`, `model_provider`, `model_version`, `parameters`, `usage`, `tool_calls`.

### 6.D) MinIO Buckets (minimum)
- `lace-artifacts`
- `lace-sources`
- `lace-compiled`
- `lace-replay`
- `lace-provenance`

### 6.E) Queue Topics/Events (minimum)
- `pipeline.run.requested`
- `pipeline.run.started`
- `pipeline.run.progress`
- `pipeline.run.pause.requested`
- `pipeline.run.paused`
- `pipeline.run.resume.requested`
- `pipeline.run.resumed`
- `pipeline.run.completed`
- `pipeline.run.failed`
- `pipeline.run.cancelled`
- `pipeline.step.started`
- `pipeline.step.progress`
- `pipeline.step.completed`
- `pipeline.step.failed`
- `pipeline.llm.prompt`
- `pipeline.llm.response`
- `pipeline.llm.usage`
- `pipeline.validation.result`
- `pipeline.apply.result`
- `pipeline.compile.result`
- `pipeline.warning`
- `pipeline.error`
- `compile.requested`
- `rollback.requested`
- `provenance.logged`
- `openlineage.start`
- `openlineage.complete`

### 6.F) Event Envelope and Streaming Semantics

Every event includes:
- `event_id`,
- `event_type`,
- `schema_version`,
- `occurred_at`,
- `sequence` (monotonic per run),
- `tenant_id`,
- `pipeline_id`,
- `run_id`,
- `step_id`,
- `attempt`,
- `request_id`,
- `correlation_id`,
- `idempotency_key`,
- `status`,
- `progress_pct`,
- `payload_schema_version`,
- `payload`,
- `redaction_level`,
- `content_hash`,
- `content_uri`.

Streaming semantics:
- ordering guarantee is per `run_id`.
- replay endpoint returns stable ordered pages with cursor.
- stream endpoint supports:
  - heartbeat,
  - `after_event_id`,
  - handoff from replay to live tail.
- replay source of truth is Postgres `run_events`.

## 7) Delivery Phases

Execution strategy:
- API-first implementation remains first in sequence.
- Delivery is incremental to avoid big-bang rewrite risk while preserving full V1 end-state.

### Phase 0 (API-First Pilot Slice)
Scope:
- `P0-0`, `P0-1`, `P0-2`, `P0-7`, `P0-8`, `P0-12`, `P0-14`.

Goal:
- expose stable API early with security/logging/provider abstraction and live streaming baseline.

Exit artifacts:
- pilot-capable REST service with auth, structured logs, metrics, and event stream.
- correlation id and observability conventions enforced from first release.
- baseline subsets of `P0-7` and `P0-8` are delivered here; full hardening remains in Phase B.

### Phase A (P0 Safety + Platform Foundation)
Scope:
- `P0-3` to `P0-6`, `P0-9`, `P0-11`, `P0-15`, `P0-16`, `P0-17`, `P0-18`.

Goal:
- safe deterministic baseline,
- canonical DB/object persistence + outbox/worker correctness + tenancy/versioning foundation.

Exit artifacts:
- OpenAPI + contract tests.
- migrations + schema baseline.
- outbox publisher + worker handler framework.
- stream and replay endpoints with ordering/cursor tests.
- run control checkpoints and crash-recovery tests.

### Phase B (P0 Governance + Security + Provenance)
Scope:
- `P0-7`, `P0-8`, `P0-10`, `P0-13`.

Goal:
- secure tenant-scoped operations and OMS-grade traceability.

Exit artifacts:
- threat model and security checklist.
- tenancy enforcement test suite.
- provenance query endpoints and lineage proofs.
- schema compatibility and migration policy docs/tests.

### Phase C (P1 Reliability + Quality)
Scope:
- `P1-1` to `P1-4`.

Goal:
- rollback safety, retrieval quality, tokenizer correctness, compiler stability.

### Phase D (P1 Release Readiness)
Scope:
- `P1-5` to `P1-10`.

Goal:
- SLO readiness, CI/CD hardening, DR confidence, supply-chain compliance.

Exit artifacts:
- load/soak reports,
- DR drill report,
- signed release images + SBOM artifacts.

## 8) Quality Gates (Mandatory Before Production)

- Full test suites pass:
  - unit,
  - integration,
  - contract,
  - failure-mode,
  - queue/worker idempotency.
- P0-0 defect regression suite is green.
- Idempotency proof:
  - replay same mutation N times -> one committed revision.
- Determinism proof:
  - fixed sources + fixed settings snapshot -> deterministic IR hash where applicable.
- Stream/replay proof:
  - replay + live tail has no gap/duplicate events.
- Security proof:
  - authz, upload fuzzing, secret handling, signed URL scope tests.
- Schema/version proof:
  - N-1 event compatibility tests pass.
- Operational proof:
  - OTel trace continuity,
  - OpenLineage start/complete events,
  - backup/restore drill pass.
- Migration proof:
  - filesystem MVP snapshots import cleanly via `lace-migrate` with deterministic reports.
- Supply-chain proof:
  - SBOM produced,
  - images signed,
  - dependency/license policy gates pass.

## 9) Definition of Done (Global V1)

LACE is production-ready when:
- All P0/P1 workstreams are accepted.
- System runs in Compose with:
  - `api + worker + migrations + postgres + minio + queue`.
- All major capabilities are exposed through versioned REST APIs.
- No canonical state depends on local filesystem persistence.
- Run pause/resume/restart works with DB checkpoints across app restarts.
- Streaming and replay endpoints provide ordered, policy-safe visibility.
- LLM access is centralized via gateway with explicit schema/plain-text modes.
- Provenance/lineage/pedigree/security/retention logs are emitted for all transformations.
- Tenancy/identity model is implemented and enforced.
- Schema/versioning policy is implemented and enforced.
- Security, observability, reliability, DR, and supply-chain controls are operationally verified.

## 10) Secondary Review Reconciliation Notes

The external A-F review items and subsequent suggestions were integrated as follows:
- Defect/error-handling hardening captured under `P0-0`.
- Test coverage hardening captured under `P1-8`.
- `.env` + DB settings captured under `P0-11`.
- Central LLM abstraction and mode support captured under `P0-12`.
- OMS provenance/logging captured under `P0-13`.
- Generic pipeline streaming captured under `P0-14`.
- Pause/resume/restart persistence captured under `P0-15`.
- Tenancy/identity model captured under `P0-16`.
- Schema/versioning governance captured under `P0-17`.
- MVP data migration captured under `P0-18`.
- Supply-chain standards captured under `P1-9`.

Items already implemented in current code are still preserved as regression requirements, not removed from planning.

## 11) Legacy Workstream Coverage Map (No-Loss)

Original workstreams remain represented as follows:
- Prompt hardening and prompt/runtime safety -> `P0-10`, `P0-12`, `P0-13`.
- Source intake and extraction hardening -> `P0-9`, `P0-10`.
- Summaries and strategy/planning quality -> `P0-10`, `P1-2`.
- `llm_judge`/competency validation patterns -> `P0-10`.
- Constraint inheritance and policy propagation -> `P0-10`, `P0-17`.
- Token budgeting and model-limit management -> `P0-12`, `P1-3`.
- Lifecycle FSM and run state governance -> `P0-10`, `P0-15`.
- Rollback/version restore -> `P1-1`.
- Compiler quality and deterministic outputs -> `P1-4`.
- IR boundary validation and schema rigor -> `P0-17`.
- Production operations and runtime hardening -> `P0-6`, `P0-7`, `P0-8`, `P1-5`, `P1-7`.
- Legacy filesystem compatibility and transition -> `P0-18`.

## 12) External Audit Catalog (A-F) Preservation Appendix

This appendix preserves the reviewed issue catalog so no findings are lost during planning transitions.

### A) Verified bugs
- A1. Block deletion index shifting in deterministic apply.
- A2. `compiled_dir` parameter ignored in recursive build path.
- A3. Non-atomic artifact writes.
- A4. Lock heartbeat race condition.
- A5. Resume with inline JSON refs silently fails.
- A6. IR round-trip silently drops non-dict/non-string blocks.
- A7. Anthropic provider ignores truncation stop reason.
- A8. PDF compiler silent truncation limits.
- A9. OWL compiler slug collisions.

### B) Missing error handling
- B1. DOCX parsing not safely wrapped.
- B2. Source ingestion path traversal risk.
- B3. CLI file I/O errors surface raw tracebacks.
- B4. Plugin factory failures can crash pipeline.
- B5. Graph cycle detection missing in compilers.
- B6. Strategy plan schema/policy assumption mismatch.

### C) Contract/schema mismatches
- C1. Duplicated action constants across validators/apply logic.
- C2. Context bundle schema exists but is not enforced.
- C3. Runtime schema map missing new step output types.
- C4. IR block `markdown/body` ambiguity in round-trip.

### D) Hardcoded values to externalize
- D1. Default model id.
- D2. Context token budget defaults.
- D3. Output token limits.
- D4. PDF truncation constants.
- D5. DOCX page defaults.
- D6. CLI `max_nodes`.
- D7. CLI `max_split_depth`.
- D8. Provider timeout defaults.

### E) Test coverage gaps
- E1. No real-provider LLM integration path.
- E2. Thin coverage for new intake steps.
- E3. Missing adversarial fixtures and assertions.
- E4. Missing concurrency tests around locking/store.
- E5. Missing corruption/recovery suites.
- E6. Insufficient compiler golden tests across targets.

### F) Minor hardening
- F1. `_MISSING` sentinel leak prevention.
- F2. Unbounded UI cache growth.
- F3. Migration loop guard on version advancement.
- F4. Startup schema validation sweep.

Execution note:
- All A-F items are planned under `P0-0` and `P1-8`, with supporting ownership in `P0-6`, `P0-10`, `P0-12`, `P1-4`, and `P0-17`.

## 13) Innovation Backlog (User-Endorsed Bright Ideas)

These are intentionally tracked as non-blocking differentiators to avoid derailing V1 delivery:
- `P2-2` Git-for-documents API:
  - revision log, semantic diff, branch/merge abstractions over IR revisions.
- `P2-3` Prompt/constraint-as-code:
  - validated policy DSL for organizational writing rules and prompt templates.
- `P2-4` Test-driven document generation:
  - competency spec execution as API-testable quality gates (`lace test` semantics).
- `P2-5` Lineage graph export:
  - optional exporter from transformation/provenance logs to graph stores.
- `P2-6` Air-gapped/on-prem packaging:
  - self-host profile with reduced external dependencies for disconnected deployments.
