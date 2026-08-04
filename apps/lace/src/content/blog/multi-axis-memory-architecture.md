---
title: "Most AI Memory Systems Have Exactly One Axis. That's the Bug."
description: "How LACE stores, ranks, and governs memory across users, datasets, agents, and the organization itself."
seoTitle: "Multi-Axis AI Memory Architecture | LACE"
seoDescription: "A per-user fact table can't express a fact about a dataset, an agent, or an organization — and it has no ACL, no history, and no gate between an LLM's guess and durable storage. Here's how LACE's memory kernel fixes all four."
category: "Agents"
date: 2026-08-04
author: "Michael Kerner"
featured: true
---

Open almost any agent memory library and you'll find the same shape: a table of facts keyed by user, a vector index over the text, and a top-k lookup at the start of every turn.

```text
user_123 → ["prefers metric units", "works in finance", "timezone is CST"]
```

Fine for a consumer chatbot. It falls apart the moment memory has to live inside a real organization.

Four problems show up immediately:

1. **A fact rarely belongs to one person.** "Invoices in this dataset use European date format" is a fact about a *dataset*. "This agent times out on multi-page PDFs" is a fact about an *agent*. "Fiscal year ends in September" is a fact about the *organization*. A per-user table can only express one of these cleanly, so everything else gets duplicated or dropped.

2. **Memory formed from restricted content inherits nothing.** If a memory is distilled from a document you can read and I can't, and it lands in a shared table with no ACL, the system has just built a quiet exfiltration channel out of your access controls. This is the most common serious defect I see, and almost never mentioned in the README.

3. **Truth changes, and the old truth still matters.** "The vendor is Acme" was true until the contract was reassigned in March. A system that only stores the current value can answer *what is true* but not *what we believed on 3 March* — the exact question that appears in audits, incident reviews, and disputes.

4. **Models are not authorities.** If an LLM's output is written straight to durable storage, the memory is only as reliable as the worst hallucination in the worst turn, and there's no record of what was rejected or why.

LACE memory is built around these four problems. What follows is how the architecture actually works.

## The axis model

Memory is not addressed by subject. It is addressed by `(axis_type, axis_id)`.

```python
_BUILTIN_AXIS_TYPES = frozenset({
    "tenant", "user", "agent", "session",
    "dataset", "doc", "app", "channel", "team", "project",
})
```

We already have tenant / organization isolation. Everything within it is a partition:

- `("user", <subject_hash>)` — personal facts
- `("dataset", "ds_4f21")` — what we've learned about a whole dataset (Teams channels, SharePoint libraries, etc.)
- `("doc", "doc_4h76")` — what we want retained from a specific document
- `("agent", "agent_extract_v3")` — lessons an agent has accumulated
- `("session", <session_id>)` — this-conversation scratch

**The axis vocabulary is validated in application code.** An app a user or a dev within an organization made can register a new axis type at bootstrap and start writing to it with no schema migration.

```python
def register_axis_type(axis_type: str) -> str:
    """Register a custom app axis type."""
    name = " ".join(str(axis_type or "").strip().lower().split()).replace(" ", "_")
    if not name:
        raise ValueError("axis_type must be a non-empty string")
    if name not in _BUILTIN_AXIS_TYPES:
        _APP_AXIS_TYPES.add(name)
    return name
```

A legal app can register `case`. A support app can register `ticket`.

**A memory has one primary axis but can carry facets** — cross-cutting tags of the same `{axis_type, axis_id}` shape. A fact learned on the user axis while working on a specific dataset can carry a dataset facet, so it surfaces under both anchors without duplicating the row. Recall opts in with `match_facets=True`. Forgetting becomes one row instead of N.

## The read path: anchor sets and weighted fusion

A turn does not have "a user." It has a *context*: who is asking, in what session, against which datasets, with which documents open, driven by which agent.

Recall turns that context into a weighted **anchor set**:

```python
def assemble_anchor_set(...) -> list[Anchor]:
    anchors = []
    if user_id is not None:
        anchors.append(Anchor(axis_type="user", axis_id=..., weight=1.0))
    anchors.append(Anchor(axis_type="tenant", axis_id="*", weight=0.6))
    for ds_id in (dataset_ids or []):
        anchors.append(Anchor(axis_type="dataset", axis_id=ds_id, weight=0.9))
    for doc_id in (doc_ids or []):
        anchors.append(Anchor(axis_type="doc", axis_id=doc_id, weight=0.8))
    if agent_id is not None:
        anchors.append(Anchor(axis_type="agent", axis_id=agent_id, weight=0.7))
    if session_id is not None:
        anchors.append(Anchor(axis_type="session", axis_id=session_id,
                              weight=1.0, memory_class="working"))
    anchors.sort(key=lambda a: a.weight, reverse=True)
    return anchors
```

Recall then fans out **per anchor**, runs hybrid retrieval inside each, and merges the ranked lists with anchor-weighted Reciprocal Rank Fusion.

```text
score(memory) = Σ  (anchor.weight / (k + rank_in_that_anchor))
                 over every anchor that returned it

# k is the usual RRF constant (60).
# A memory that ranks well under several high-weight anchors naturally rises to the top.
```

### Each anchor: three channels

Each anchor runs three channels (retrieval methods) over its own partition:

- **Dense** — HNSW over `embedding_v2 halfvec(3072)`
- **Lexical** — Postgres full-text with a GIN index
- **Entity** — normalized set overlap on extracted entities:

```text
memory_entities = {"acme", "invoice", "dd/mm/yyyy", "september"}
query_entities  = {"acme", "invoice", "date", "format"}

shared = memory_entities ∩ query_entities   # {"acme", "invoice"}
score  = len(shared) / len(query_entities)  # 2/4 = 0.5
```

Three ranked lists are fused with standard RRF (`k=60`):

```python
def _rrf_score(ranks: list[int]) -> float:
    return sum(1.0 / (_RRF_K + r) for r in ranks)
```

RRF is necessary. The three channels produce scores on completely different scales. This is a cheap, deterministic fix for normalization. A memory that ranks well in two channels beats one that ranks brilliantly in only one — usually the right call.

The dense channel is optional. When no query vector is available, the fusion simply degrades to lexical + entity on the same code path. If the incoming query is keyword-based, that works fine.

### Salience and recency as boosts

**Salience** = how important the system (or a human) has judged this memory to be (0–1).
**Recency** = how recently the memory was last used or updated (decays exponentially, ~30-day half-life).

```python
salience = max(0.0, min(1.0, float(rec.salience or 0.5)))
recency  = _recency_weight(rec.updated_at)          # exp decay, 30-day half-life
boost = 1.0 + 0.3 * salience + 0.1 * recency
if rec.memory_class == "procedural":
    boost += 0.15
if rec.pinned:
    boost += 0.5
```

Salience and recency multiply a relevance-derived score. They never become the primary ranking terms. Making them primary produces this failure: a recent, high-salience, irrelevant fact outranks the one fact that actually answers the question.

### A fact that repeats across anchors gets boosted for free

```python
for anchor, hr in anchor_results:
    for rank, (rec, _score) in enumerate(hr.items, start=1):
        contribution = anchor.weight / (_RRF_K + rank)
        by_id[rec.memory_id] = by_id.get(rec.memory_id, 0.0) + contribution
```

A memory that surfaces under several anchors is naturally boosted. No special case required. Then a single MMR pass (λ = 0.7) runs across the post-RRF list, because near-duplicates are most likely when the same fact was learned along two different axes.

## The write path: the model proposes, the memory kernel writes

"Recording memory" is an LLM call with a strict JSON schema and `temperature=0.0`. It runs *after* the answer streams, so routine memory formation costs the response path nothing. It can also be accumulated and sent through a provider batch API to cut the cost further.

### What actually gets sent

Stripped to the essentials, this is the real call. System prompt:

```text
You extract durable, reusable long-term memories from a conversation turn.
Only propose facts worth remembering across future sessions: stable user
preferences and traits (semantic), notable events that occurred (episodic),
and how-to rules for working with this subject (procedural). Do NOT propose
ephemeral chit-chat, one-off task details, or restated context. Use a short
normalized key (e.g. 'pref:timezone', 'fact:role'). If nothing is worth
remembering, return an empty proposals array. Return ONLY JSON matching
the schema.
```

User prompt, built from the turn that just happened:

```text
User said:
Just a heads up, invoices in this dataset are always DD/MM/YYYY, not the
US format.

Extract any durable memories from the above as JSON: {"proposals": [...]}.
```

And the expected response — the model's entire job is to fill in this one shape:

```json
{
  "proposals": [
    {
      "memory_class": "semantic",
      "key": "fact:date_format",
      "value": "Invoices in this dataset use DD/MM/YYYY dates, not US format.",
      "entities": ["invoice", "date format", "dd/mm/yyyy"],
      "salience": 0.7,
      "supersedes_key": null
    }
  ]
}
```

That's the whole extraction step. One narrow system prompt, one strict schema (`memory_class` is an enum of exactly three values, every field required, no extra properties allowed), one cheap model call. Nothing here is durable yet — it's a proposal, and proposals don't get to write to storage.

Its output is typed as `MemoryProposal`, not `MemoryRecord` — the proposal carries no authority. The only thing in the system allowed to write durable memory:

```python
def consolidate_proposals(*, store, tenant_id, scope, subject_ref,
                          proposals, source_ref=None, policy=None,
                          axis_override=None) -> ConsolidationOutcome:
```

It is deterministic end to end:

- **Policy gate.** Disabled or incognito → zero writes. Every blocked proposal still gets a `rejected` event. Silence is not acceptable.
- **Shape validation, no coercion.** Empty key or value → rejected with reason. Class not allowed → rejected. Malformed proposals fail visibly.
- **Dedup.** Identical value already active under the same key → `duplicate_no_change`.
- **Supersede-by-key.** A changed value supersedes the old record rather than mutating it.
- **Audit everything.** `proposed`, `applied`, `rejected`, `superseded`.

One production detail that matters:

```python
# Order matters for the Postgres self-FK + active-dedup unique index:
# first mark the old row superseded with a NULL pointer (frees the unique index),
# then insert the new active row, then link old→new.
if existing is not None:
    store.supersede(memory_id=existing.memory_id, superseded_by=None)
store.insert(new_record)
if existing is not None:
    store.update_fields(
        memory_id=existing.memory_id,
        fields={"superseded_by": new_record.memory_id, "invalid_at": now_bi},
    )
```

A partial unique index enforces "at most one active record per `(tenant, scope, subject, class, key)`." The three-step dance turns that constraint into a real database invariant instead of an application convention that drifts.

The tool surface the model itself can call is deliberately narrow:

```python
SAFE_WRITE_AXES = frozenset({"user", "session", "agent"})
```

An agent can write to its own axis, the user's, or the session's. It cannot write to `tenant`, `dataset`, or `doc` from a tool call — those are governed formation paths.

## Bi-temporality: what did we believe on 3 March?

Every record carries `valid_at` and `invalid_at`. Supersession sets `invalid_at` on the outgoing row rather than deleting it.

```sql
SELECT ... FROM memory_records
WHERE tenant_id = %s
  AND (valid_at   IS NULL OR valid_at   <= %s)   -- existed then
  AND (invalid_at IS NULL OR invalid_at >  %s)   -- not yet superseded then
  AND status != 'redacted'
  AND status != 'archived'
ORDER BY COALESCE(valid_at, created_at) DESC
```

Redacted rows stay hidden even in historical queries. Bi-temporality gives you auditability; it must not give you a privacy bypass.

## Promotion: how an organization learns (and how it refuses to)

If forty users independently hold "our fiscal year ends in September," that is not forty user preferences. It is organizational knowledge.

Promotion groups active records by normalized `(memory_class, key)`, then counts distinct subjects and distinct values:

```python
if len(subjects) < min_subjects:        # default 3
    continue

if len(distinct_values) > 1:
    # Contradiction across subjects — never silently promote
    outcome.contested_keys.append(nkey)
    store.append_event(
        tenant_id=tenant_id,
        kind="promotion_contested",
        payload={
            "key": nkey,
            "subject_count": len(subjects),
            "distinct_values": sorted(distinct_values),
        },
    )
    continue
```

Two rules do the real work:

- **Disagreement.** Different values for the same key → the key is *contested* and skipped. Never majority-voted into a fake "consensus."
- **Promotion is governance-gated by default.** `auto_apply=False` records a `promotion_proposed` event for review. Nothing is written until a human or policy says so. With `auto_apply=True`, the tenant memory is written and any stale tenant value is bi-temporally superseded.

The contested-key log turns out to be independently useful. A key where thirty people hold five different values usually points at a real ambiguity in how the organization talks about something.

All of this is surfaced in a UI, where anyone can review, accept, modify, or remove entries — true promotion is gated by privileges.

## ACL inheritance: the step everyone skips

The access-control list is what makes this workable for enterprise clients.

Memories formed from a dataset or document carry `acl_ref` — a snapshot of the source's access control (`principals`, `deny_principals`, `classification`, `compartments`).

At recall time a standalone gate runs after ranking and before packing:

```python
def filter_by_acl(memories, *, caller_grants, acl_axes_only=True):
    if caller_grants is None:
        return list(memories)          # no grants supplied → no-op
    result = []
    for mem in memories:
        if acl_axes_only and (mem.axis_type or "") not in _ACL_AXES:
            result.append(mem)          # user/tenant/agent axes carry no acl_ref
            continue
        if _memory_acl_visible(mem.acl_ref or {}, caller_grants):
            result.append(mem)
    return result
```

Three properties we defend:

- It is a **gate**, not a ranking signal. Access control never touches the score. Downranking inaccessible content leaks existence through ordering.
- It runs **after ranking, before packing**. That is the cheapest place to be strict.
- Missing ACL is treated as public. This is a deliberate availability-over-strictness choice. Formation writers are responsible for producing well-formed `acl_ref`s; a bug there fails open. The alternative — fail closed — would make every pre-migration or ACL-missing row invisible and silently break recall.

## Packing: budget, provenance, and per-axis floors

Recall returns a ranked list. Something still has to decide what enters the prompt.

```python
DEFAULT_AXIS_WEIGHTS = {
    "user": 1.0, "session": 1.0, "dataset": 0.9,
    "doc": 0.8, "agent": 0.7, "tenant": 0.6,
}
```

The packer:

1. Guarantees pinned and procedural memories first.
2. Allocates the remaining budget across in-play axes by anchor weight, with a **per-axis floor** so no axis is starved.
3. MMR-dedups within each axis.
4. Tags every line with provenance and counts tokens with the real model-aware tokenizer.

Rendered output looks like:

```text
**How to work with this subject:**
- Always cite the source dataset when quoting figures. [user · 2026-04-11]

**Known facts & preferences:**
- Invoices in this dataset use DD/MM/YYYY dates. [dataset:ds_4f21 · 2026-05-02]
- Fiscal year ends in September. [org · 2026-03-18]
```

The provenance tag tells the model where a fact came from and how old it is. It also makes the prompt human-readable when someone asks "why did the agent say that?"

## Forgetting is a feature with three mechanisms

**Decay → archive → evict.** Salience decays exponentially from *last recall*, not from creation:

```text
decayed = salience × exp(−age_since_last_recall / half_life_days)
```

Defaults: 30-day half-life, floor 0.05, 90-day recall horizon. A frequently used low-salience fact is not archived out from under an active workflow. Hard deletion is `policy_gate=True` by default — blocked unless the caller explicitly opts in.

**Episodic → semantic rollup.** Over time the system accumulates many similar short-lived memories about the same topic (e.g. repeated notes that "the Q3 close always slips"). It groups those related episodic records into clusters using only the data itself — shared entities first, then a simple token signature of the values. The clustering is deterministic: same rows always produce the same groups. An optional LLM step can then turn each cluster into one clean, durable semantic memory ("Q3 close routinely slips"). That new memory is written through the normal audited path, and the original episodic records are archived.

**Redaction erase.** `redact` soft-deletes for audit. `forget` / `forget_axis` hard-erase for a subject or an entire axis, with the redaction recorded.

## One fabric, not four

The consistent structural choice is a refusal to add a second store.

- **Working memory** is simply `(session, <session_id>)` with `memory_class='working'` and a short TTL — one hour, superseded by key. It is durably stored, so context compaction cannot lose it.
- **Editable core-memory blocks** (persona, human, etc.) are pinned records with `key='block:<label>'` and a `{"_block": True}` marker. We render them in stable order for KV-cache friendliness, edited through the same supersede-by-key path.
- **Unified recall** blends memory and the document corpus. Both live in the same embedding space, so the same query vector drives both legs and the results RRF-fuse into one ranked list tagged `source = 'memory' | 'knowledge'`.

## The thesis

Hybrid search, RRF, and MMR are well-understood.

What isn't shipped in most systems is governance:

- Who is allowed to write a memory
- Which memories a given caller is allowed to see
- What the system believed at a past point in time
- What was rejected and why
- Whether the fact injected into the prompt can be traced to its origin
- Whether an organization can form shared knowledge without laundering one person's mistaken belief into policy

Those questions decide whether AI memory is usable in an enterprise or regulated environment. They are architectural, not model-level. No amount of frontier capability fixes a memory layer that cannot tell you where a fact came from or whether the reader was allowed to see it.

Building multi-axis memory as a deterministically-written process is more engineering work up front than a user-keyed fact table — what most LLM chat providers give you. But over time it is memory that actually evolves and is auditable.
