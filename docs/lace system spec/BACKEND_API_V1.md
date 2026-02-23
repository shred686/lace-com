# LACE Backend API v1 Draft

This spec defines the API surface for:
- runtime execution (artifact generation/regeneration/recursive runs),
- live run streaming (WebSocket + SSE replay fallback),
- artifact/source/compile operations,
- pipeline authoring (draft, validate, publish, alias).

## Canonical artifacts
- OpenAPI contract: `docs/spec/BACKEND_API_V1.openapi.yaml`
- Postgres schema: `docs/spec/BACKEND_API_V1.postgres.sql`

## Design boundaries
- Postgres is canonical for state (`artifacts`, `runs`, `run_events`, `change_events`, pipeline authoring tables).
- MinIO is canonical for large blobs (source uploads, compiled outputs, optional archived payloads).
- `run_events.seq` is the authoritative cursor for replay/reconnect.
- Pipeline drafts are mutable; pipeline versions are immutable.
- `POST /v1/runs` accepts a pipeline reference by `version` or `alias`.

## Event model baseline
Run event envelope fields:
- `event_id`, `run_id`, `artifact_id`, `node_id`, `seq`, `ts`, `type`, `payload`, `provenance_refs`.

Baseline `type` values:
- `run_started`, `run_completed`, `run_failed`
- `step_started`, `step_completed`, `step_failed`
- `node_start`, `node_completed`, `node_failed`, `node_blocked`, `node_skip`
- `change_event_applied`, `metrics_update`

## Alignment with existing runtime
This draft keeps current runtime semantics from:
- `src/lace/app.py` (`run_generation_pipeline`, `run_recursive_generation_auto`, progress events)
- `src/lace/domain/validators/generation_request_schema.json`
- `src/lace/domain/validators/change_event_schema.json`
- `pipelines/lace.GenerateNodeContentPipeline.yaml`
