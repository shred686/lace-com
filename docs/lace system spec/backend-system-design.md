Good — let’s summarize this cleanly and at the right abstraction level.

This is the **Component Architecture** for LACE backend (MVP → scalable path), aligned with your philosophy:

> Engine owns state
> LLM is stateless
> Postgres is canonical
> Messaging scales, but does not define truth

---

# LACE Backend Component Architecture

## 1️⃣ API Layer (Control + Streaming Interface)

**Technology**: FastAPI

### Responsibilities

* REST endpoints (control plane)
* WebSocket endpoint (live run streaming)
* Authentication (future multi-tenant)
* Request validation
* Idempotency handling

### Interfaces

**REST (Control Plane)**

* Create artifact
* Start run
* Pause/resume/cancel
* Retrieve run status
* Fetch event history
* Compile artifact

**WebSocket (Data Plane)**

* `/runs/{run_id}/stream`
* Streams structured RunEvents
* Supports reconnect via cursor replay

This layer never directly mutates IR.
It delegates to the Engine.

---

## 2️⃣ Run Orchestrator (Execution Controller)

This is the brain of execution.

### Responsibilities

* Lifecycle management of runs
* Step sequencing
* Recursive node execution
* Emitting structured RunEvents
* Managing state transitions

### Guarantees

* Ordered execution per run
* Monotonic event sequencing
* Durable checkpoints
* Deterministic Apply as sole IR writer

This component owns:

* Run status
* Step transitions
* Error states
* Regeneration logic

---

## 3️⃣ Pipeline Engine (Core Logic Layer)

This is the internal long-form engine.

### Contains

* ContextBuilder
* Strategy Selector (split vs full-node)
* LLM Adapter
* Deterministic Apply
* Validator
* Compiler

### Key Design Rule

LLM produces **proposals**.
Deterministic Apply produces **state mutations**.

Only Apply writes to IR.

---

## 4️⃣ Canonical Storage (Source of Truth)

**Technology**: Postgres

### Tables

* `artifacts`
* `nodes`
* `blocks`
* `runs`
* `run_events` (append-only)
* `change_events` (block-level provenance)

### Role

This is the canonical system of record.

Even when messaging is introduced later:

* Postgres remains truth
* Messaging mirrors events
* UI replay depends on DB, not broker

---

## 5️⃣ Event Layer (Phase 0: DB + WS, Phase 1: JetStream)

### Phase 0 (MVP)

* Append RunEvent to Postgres
* Broadcast via in-process WebSocket
* UI reconnect uses cursor replay via REST

No external broker.

### Phase 1 (Scaling)

Introduce:
**NATS JetStream**

* API writes to Postgres (truth)
* Then publishes event to JetStream
* Multiple consumers can subscribe
* UI can scale horizontally

Messaging becomes scalability infrastructure,
not correctness infrastructure.

---

## 6️⃣ Background Execution Model

Phase 0:

* In-process async worker
* Single container

Phase 1:

* Distributed workers
* Message-based dispatch
* Horizontal scaling

Separated conceptually from:

* Artifact state events

Two logical channels:

1. State evolution events
2. Job execution tasks

---

# Data Flow Overview

### When a run starts:

1. REST → Create Run
2. Run Orchestrator starts
3. For each pipeline step:

   * LLM call
   * Deterministic Apply
   * Persist IR changes
   * Append RunEvent
   * Broadcast event
4. UI updates live
5. Run completes

---

# Core Architectural Principles

### 1. Engine is Stateful

Owns artifact structure and regeneration.

### 2. LLM is Stateless

Pure function call. No persistence responsibility.

### 3. Postgres is Canonical

Events are replayable.
Broker never defines truth.

### 4. Events Are Typed State Changes

Not logs.
Not text streams.
Structured transitions.

### 5. Deterministic Apply is Gatekeeper

No direct LLM writes to IR.

---

# Clean Layer Separation

```
Frontend
    ↓
API (REST + WS)
    ↓
Run Orchestrator
    ↓
Pipeline Engine
    ↓
Deterministic Apply
    ↓
Postgres (Canonical IR + Events)
    ↓
(Optional) NATS JetStream
```

---

# Why This Architecture Is Correct For LACE

Because LACE is:

* A stateful artifact engine
* Provenance heavy
* Regeneration capable
* Replay dependent
* Audit sensitive

This design:

* Preserves correctness
* Enables live UI streaming
* Allows horizontal scaling later
* Avoids premature infra complexity
* Protects your IR model

---

If you’d like next, I can:

* Compress this into a 1-page “Architecture v1.0 Summary”
* Or convert this into a diagram-ready Markdown block
* Or map this directly onto your repo folder structure (backend layout)
