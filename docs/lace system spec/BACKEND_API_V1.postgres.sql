-- LACE Backend API v1 draft schema
-- Canonical state in Postgres; large blobs in MinIO referenced by object keys.

BEGIN;

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS artifacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id TEXT NOT NULL DEFAULT 'default',
  artifact_id TEXT NOT NULL,
  title TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'archived', 'deleted')),
  root_node_id TEXT,
  current_revision_no BIGINT NOT NULL DEFAULT 0 CHECK (current_revision_no >= 0),
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_by TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (tenant_id, artifact_id)
);

CREATE TABLE IF NOT EXISTS artifact_revisions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id TEXT NOT NULL DEFAULT 'default',
  artifact_id TEXT NOT NULL,
  revision_no BIGINT NOT NULL CHECK (revision_no >= 1),
  ir_version TEXT NOT NULL,
  ir_hash TEXT NOT NULL,
  ir_json JSONB NOT NULL,
  source_run_id TEXT,
  created_by TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (tenant_id, artifact_id, revision_no),
  FOREIGN KEY (tenant_id, artifact_id)
    REFERENCES artifacts (tenant_id, artifact_id)
      ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_artifact_revisions_lookup
  ON artifact_revisions (tenant_id, artifact_id, revision_no DESC);

CREATE TABLE IF NOT EXISTS artifact_nodes (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL DEFAULT 'default',
  artifact_id TEXT NOT NULL,
  revision_no BIGINT NOT NULL CHECK (revision_no >= 1),
  node_id TEXT NOT NULL,
  title TEXT NOT NULL,
  status TEXT NOT NULL,
  deps JSONB NOT NULL DEFAULT '{"parents":[],"children":[],"references":[]}'::jsonb,
  generation_state JSONB,
  review_state JSONB,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (tenant_id, artifact_id, revision_no, node_id),
  FOREIGN KEY (tenant_id, artifact_id, revision_no)
    REFERENCES artifact_revisions (tenant_id, artifact_id, revision_no)
      ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_artifact_nodes_by_artifact
  ON artifact_nodes (tenant_id, artifact_id, node_id);

CREATE TABLE IF NOT EXISTS sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id TEXT NOT NULL DEFAULT 'default',
  artifact_id TEXT NOT NULL,
  source_id TEXT NOT NULL,
  filename TEXT,
  media_type TEXT NOT NULL,
  bytes BIGINT CHECK (bytes IS NULL OR bytes >= 0),
  sha256 TEXT,
  minio_bucket TEXT NOT NULL,
  minio_object_key TEXT NOT NULL,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_by TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (tenant_id, artifact_id, source_id),
  UNIQUE (tenant_id, minio_bucket, minio_object_key),
  FOREIGN KEY (tenant_id, artifact_id)
    REFERENCES artifacts (tenant_id, artifact_id)
      ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_sources_by_artifact
  ON sources (tenant_id, artifact_id, created_at DESC);

CREATE TABLE IF NOT EXISTS compiled_outputs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id TEXT NOT NULL DEFAULT 'default',
  artifact_id TEXT NOT NULL,
  compilation_id TEXT NOT NULL,
  revision_no BIGINT CHECK (revision_no IS NULL OR revision_no >= 1),
  target TEXT NOT NULL CHECK (target IN ('md', 'docx', 'pdf', 'owl')),
  status TEXT NOT NULL CHECK (status IN ('queued', 'running', 'succeeded', 'failed')),
  media_type TEXT,
  bytes BIGINT CHECK (bytes IS NULL OR bytes >= 0),
  minio_bucket TEXT,
  minio_object_key TEXT,
  error_json JSONB,
  created_by TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  finished_at TIMESTAMPTZ,
  UNIQUE (tenant_id, artifact_id, compilation_id),
  FOREIGN KEY (tenant_id, artifact_id)
    REFERENCES artifacts (tenant_id, artifact_id)
      ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_compiled_outputs_artifact
  ON compiled_outputs (tenant_id, artifact_id, created_at DESC);

CREATE TABLE IF NOT EXISTS step_types_catalog (
  id BIGSERIAL PRIMARY KEY,
  type_id TEXT NOT NULL,
  version TEXT NOT NULL,
  description TEXT,
  input_schema JSONB,
  output_schema JSONB,
  param_schema JSONB,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (type_id, version)
);

CREATE TABLE IF NOT EXISTS pipelines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id TEXT NOT NULL DEFAULT 'default',
  pipeline_id TEXT NOT NULL,
  name TEXT,
  description TEXT,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_by TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (tenant_id, pipeline_id)
);

CREATE TABLE IF NOT EXISTS pipeline_drafts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id TEXT NOT NULL DEFAULT 'default',
  pipeline_id TEXT NOT NULL,
  draft_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'validated', 'invalid', 'published', 'archived')),
  base_version TEXT,
  draft_document JSONB NOT NULL,
  validation_status TEXT
    CHECK (validation_status IS NULL OR validation_status IN ('unknown', 'ok', 'failed')),
  last_validation_report JSONB,
  created_by TEXT,
  updated_by TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (tenant_id, draft_id),
  FOREIGN KEY (tenant_id, pipeline_id)
    REFERENCES pipelines (tenant_id, pipeline_id)
      ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_pipeline_drafts_by_pipeline
  ON pipeline_drafts (tenant_id, pipeline_id, updated_at DESC);

CREATE TABLE IF NOT EXISTS pipeline_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id TEXT NOT NULL DEFAULT 'default',
  pipeline_id TEXT NOT NULL,
  version TEXT NOT NULL,
  source_draft_id TEXT,
  definition_yaml TEXT NOT NULL,
  definition_json JSONB,
  definition_hash TEXT NOT NULL,
  published_by TEXT,
  published_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  deprecated BOOLEAN NOT NULL DEFAULT FALSE,
  UNIQUE (tenant_id, pipeline_id, version),
  FOREIGN KEY (tenant_id, pipeline_id)
    REFERENCES pipelines (tenant_id, pipeline_id)
      ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_pipeline_versions_lookup
  ON pipeline_versions (tenant_id, pipeline_id, published_at DESC);

CREATE TABLE IF NOT EXISTS pipeline_aliases (
  tenant_id TEXT NOT NULL DEFAULT 'default',
  pipeline_id TEXT NOT NULL,
  alias TEXT NOT NULL,
  version TEXT NOT NULL,
  updated_by TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (tenant_id, pipeline_id, alias),
  FOREIGN KEY (tenant_id, pipeline_id, version)
    REFERENCES pipeline_versions (tenant_id, pipeline_id, version)
      ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id TEXT NOT NULL DEFAULT 'default',
  run_id TEXT NOT NULL,
  artifact_id TEXT NOT NULL,
  target_node_id TEXT,
  mode TEXT NOT NULL CHECK (mode IN ('node', 'outline_recursive', 'auto_recursive')),
  operation TEXT NOT NULL CHECK (operation IN ('generate', 'regenerate', 'expand', 'enrich', 'patch', 'outline_only')),
  pipeline_id TEXT NOT NULL,
  pipeline_version TEXT,
  pipeline_alias TEXT,
  status TEXT NOT NULL CHECK (status IN ('queued', 'running', 'succeeded', 'failed', 'cancel_requested', 'cancelled')),
  idempotency_key TEXT,
  requested_by TEXT,
  request_json JSONB NOT NULL,
  progress_json JSONB,
  metrics_json JSONB,
  error_json JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  started_at TIMESTAMPTZ,
  finished_at TIMESTAMPTZ,
  UNIQUE (tenant_id, run_id),
  FOREIGN KEY (tenant_id, artifact_id)
    REFERENCES artifacts (tenant_id, artifact_id)
      ON DELETE RESTRICT,
  FOREIGN KEY (tenant_id, pipeline_id)
    REFERENCES pipelines (tenant_id, pipeline_id)
      ON DELETE RESTRICT
);
CREATE UNIQUE INDEX IF NOT EXISTS ux_runs_idempotency_key
  ON runs (tenant_id, idempotency_key)
  WHERE idempotency_key IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_runs_by_artifact
  ON runs (tenant_id, artifact_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_runs_by_status
  ON runs (tenant_id, status, created_at DESC);

CREATE TABLE IF NOT EXISTS run_steps (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL DEFAULT 'default',
  run_id TEXT NOT NULL,
  step_id TEXT NOT NULL,
  attempt INTEGER NOT NULL CHECK (attempt >= 1),
  status TEXT NOT NULL CHECK (status IN ('queued', 'running', 'succeeded', 'failed', 'skipped')),
  started_at TIMESTAMPTZ,
  finished_at TIMESTAMPTZ,
  input_refs JSONB,
  output_refs JSONB,
  metrics JSONB,
  error_json JSONB,
  UNIQUE (tenant_id, run_id, step_id, attempt),
  FOREIGN KEY (tenant_id, run_id)
    REFERENCES runs (tenant_id, run_id)
      ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_run_steps_by_run
  ON run_steps (tenant_id, run_id, step_id);

CREATE TABLE IF NOT EXISTS run_events (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL DEFAULT 'default',
  run_id TEXT NOT NULL,
  seq BIGINT NOT NULL CHECK (seq >= 1),
  event_id TEXT NOT NULL,
  event_type TEXT NOT NULL,
  artifact_id TEXT,
  node_id TEXT,
  payload_json JSONB NOT NULL,
  provenance_refs JSONB,
  request_id TEXT,
  correlation_id TEXT,
  ts TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (tenant_id, run_id, seq),
  UNIQUE (tenant_id, event_id),
  FOREIGN KEY (tenant_id, run_id)
    REFERENCES runs (tenant_id, run_id)
      ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_run_events_replay
  ON run_events (tenant_id, run_id, seq);
CREATE INDEX IF NOT EXISTS idx_run_events_type_ts
  ON run_events (tenant_id, event_type, ts DESC);

CREATE TABLE IF NOT EXISTS change_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id TEXT NOT NULL DEFAULT 'default',
  event_id TEXT NOT NULL,
  run_id TEXT NOT NULL,
  artifact_id TEXT NOT NULL,
  node_id TEXT NOT NULL,
  step_id TEXT NOT NULL,
  operation TEXT NOT NULL CHECK (operation IN ('generate', 'regenerate', 'expand', 'enrich', 'patch', 'outline_only')),
  apply_idempotency_key TEXT,
  before_hash TEXT NOT NULL,
  after_hash TEXT NOT NULL,
  applied_actions JSONB NOT NULL,
  conflicts JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (tenant_id, event_id),
  FOREIGN KEY (tenant_id, run_id)
    REFERENCES runs (tenant_id, run_id)
      ON DELETE CASCADE,
  FOREIGN KEY (tenant_id, artifact_id)
    REFERENCES artifacts (tenant_id, artifact_id)
      ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_change_events_artifact_node
  ON change_events (tenant_id, artifact_id, node_id, created_at DESC);

CREATE TABLE IF NOT EXISTS run_control_commands (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL DEFAULT 'default',
  run_id TEXT NOT NULL,
  command TEXT NOT NULL CHECK (command IN ('pause', 'resume', 'cancel', 'retry')),
  requested_by TEXT,
  requested_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  payload_json JSONB,
  ack_status TEXT NOT NULL DEFAULT 'pending' CHECK (ack_status IN ('pending', 'accepted', 'rejected', 'completed')),
  ack_at TIMESTAMPTZ,
  ack_message TEXT,
  FOREIGN KEY (tenant_id, run_id)
    REFERENCES runs (tenant_id, run_id)
      ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_run_control_commands_by_run
  ON run_control_commands (tenant_id, run_id, requested_at DESC);

CREATE TABLE IF NOT EXISTS artifact_locks (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL DEFAULT 'default',
  artifact_id TEXT NOT NULL,
  node_id TEXT NOT NULL,
  owner_run_id TEXT NOT NULL,
  lock_id TEXT NOT NULL,
  acquired_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  heartbeat_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ NOT NULL,
  released_at TIMESTAMPTZ,
  FOREIGN KEY (tenant_id, artifact_id)
    REFERENCES artifacts (tenant_id, artifact_id)
      ON DELETE CASCADE,
  FOREIGN KEY (tenant_id, owner_run_id)
    REFERENCES runs (tenant_id, run_id)
      ON DELETE CASCADE
);
CREATE UNIQUE INDEX IF NOT EXISTS ux_artifact_locks_active
  ON artifact_locks (tenant_id, artifact_id, node_id)
  WHERE released_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_artifact_locks_expiration
  ON artifact_locks (tenant_id, expires_at)
  WHERE released_at IS NULL;

CREATE TABLE IF NOT EXISTS outbox_events (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL DEFAULT 'default',
  topic TEXT NOT NULL,
  event_key TEXT,
  payload_json JSONB NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'published', 'failed')),
  attempts INTEGER NOT NULL DEFAULT 0 CHECK (attempts >= 0),
  available_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  published_at TIMESTAMPTZ,
  last_error TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_outbox_dispatch
  ON outbox_events (status, available_at, id);

COMMIT;
