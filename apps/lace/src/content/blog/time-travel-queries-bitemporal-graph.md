---
title: "Time-travel queries: building a knowledge graph that remembers what you knew"
description: "LACE's graph tracks valid time and transaction time separately — so 'what did we believe on March 3rd' is a real, auditable query."
category: "Knowledge Graph"
date: 2026-06-30
author: "LACE Engineering"
---

Ask most knowledge graphs what the renewal fee is and they'll tell you. Ask them what the renewal fee *was believed to be last March, before the amendment was ingested*, and they'll stare at you blankly. The fact was overwritten. The history is gone.

For the teams LACE serves — legal, compliance, intelligence, finance — that overwrite is disqualifying. Investigations, litigation holds, and audits all hinge on a question ordinary graphs cannot answer: **what did we know, and when did we know it?**

## Two clocks, not one

Every assertion in LACE's knowledge graph carries two time dimensions:

- **Valid time** — when the fact held in the world. The fee was $1.1M for the 2026 term and $1.2M for the 2027 term.
- **Transaction time** — when LACE believed it. We learned about the 2027 fee on July 2nd, when the amendment was ingested.

The two clocks answer different questions, and conflating them is how systems lie by accident. "The fee in March 2026" is a valid-time question. "What our analysts would have seen in March 2026" is a transaction-time question. During a dispute, the difference is the whole case.

## Corrections supersede. They never erase.

When a fact changes — or turns out to have been wrong — LACE closes the old assertion and writes a new one that supersedes it. The old assertion keeps its evidence links, its approval history, and its time bounds. Nothing is rewritten in place.

This sounds like an implementation detail until the first time someone asks *"why did last quarter's report say $1.1M?"* — and instead of a shrug, you scrub the timeline back and see exactly which assertion was live, which document it cited, and who approved it.

## Identity that survives mergers (and typos)

Time travel gets harder when entities themselves are fluid. "Acme Corp," "ACME Inc.," and "Acme Corporation" are one company scattered across three spellings — until the day one of them turns out to be a subsidiary and needs to be split back out.

LACE treats identity resolution as governed, reversible history: merge decisions are recorded with their scores and approvers, and a merge can be unwound without corrupting the assertions that referenced it. Facts pin to a named resolution epoch rather than a mutable canonical ID, so an entity split doesn't silently rewrite what past queries would have returned.

## Conflicts are surfaced, never averaged

Two sources disagree on a notice period: 90 days in the signed agreement, 60 in the summary deck someone circulated. A conventional pipeline picks one — usually whichever arrived last — and the disagreement vanishes.

LACE keeps both assertions, flags the conflict, and shows the two source passages side by side for a human ruling. The ruling itself becomes part of the record: what was accepted, on what evidence, by whom. Truth, in a governed graph, is a decision with an audit trail — not a race condition.

## Why this matters beyond compliance

Bitemporal modeling started as a compliance requirement, but it changed how the product feels. The timeline scrubber in the graph explorer — watch the enterprise evolve month by month — is consistently the moment in a demo where someone leans forward. It turns out organizations don't just want to know what's true. They want to see how they came to believe it.

That's not something you can retrofit onto a graph that forgets. You have to build on two clocks from the first row.
