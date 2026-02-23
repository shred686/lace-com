# LACE MVP Acceptance Checklist

Status date: 2026-02-11

This checklist is the MVP go/no-go contract.
CI must fail if any required item is unchecked.

## Required Gates (CI enforced)
<!-- mvp-checklist:start -->
- [x] Pipeline runtime executes `lace.GenerateNodeContentPipeline` end-to-end with deterministic step refs.
- [x] Node locking is enabled with TTL and cross-process filesystem lock implementation.
- [x] Lock TTL is heartbeated while a run is active to avoid stale ownership during long steps.
- [x] Run persistence exists (`.lace/runs/<run_id>.json`) with resumable successful-step restoration.
- [x] LLM layer is provider-neutral with at least `openai`, `anthropic`, and deterministic fake provider adapters.
- [x] Provider error mapping produces canonical step errors (`RATE_LIMIT`, `LLM_TIMEOUT`, `TRANSIENT`, `SCHEMA_INVALID`, `VALIDATION_FAILED`).
- [x] LLM responses are JSON-schema validated before apply; invalid payloads are rejected.
- [x] Deterministic apply enforces idempotency via stable action identity and apply idempotency keys.
- [x] Validation gate blocks compilation if artifact validation is not `ok`.
- [x] Compiler registry supports `md`, `docx`, and `owl` targets with pluggable registration.
- [x] CLI supports `init`, `run generate`, `run regen`, `status`, and `compile`.
- [x] Full automated test suite passes in CI.
<!-- mvp-checklist:end -->

## Exit Criteria
- MVP is ready only when every required gate above is checked and CI is green.
