---
title: "Why we made citations mandatory, not optional, in our retrieval pipeline"
description: "LACE refuses to answer unless every claim resolves to a specific, permission-checked source passage. Here's what that constraint forced us to change."
category: "Retrieval"
date: 2026-07-14
author: "LACE Engineering"
featured: true
---

Most RAG systems treat citations as a presentation feature: generate an answer, then decorate it with whatever chunks happened to be in the context window. We built LACE the other way around. **If a claim can't be resolved to a specific source passage, the claim doesn't ship.** Not "ships with a warning" — doesn't ship.

That sounds like a product slogan. It's actually an engineering constraint, and it forced changes at every layer of the retrieval stack.

## Chunks can't carry receipts

The first casualty was the humble text chunk. If your unit of retrieval is a 512-token window with fuzzy boundaries, your citation is at best "somewhere in this blob." Auditors don't accept blobs, and neither do lawyers.

So LACE's ingest pipeline is parser-agnostic but structure-preserving. Documents are decomposed into canonical **blocks** — text, tables, figures, structure — each with stable identity and provenance. Retrieval operates over projections of those blocks, and evidence carries document, block, and span identity all the way through the answer. When LACE cites §4.2 of a master service agreement, clicking the citation opens the actual §4.2, highlighted, in the actual document version that was ingested.

Tables were the hardest case. Flattening a table into prose destroys the very thing that makes a numeric answer defensible: the row and column that give the cell its meaning. So tables stay tables. A question about the 2027 renewal fee is answered from the cell at the intersection of *Renewal* and *2027* — and the citation points at that cell, not at a paragraph that mentions money.

## "I don't know" is a first-class answer

Mandatory citations have an uncomfortable corollary: sometimes the sources don't support any answer. A generative model, left to its own devices, will fill that silence with something fluent.

LACE separates **generation from verification**. Retrieval produces evidence; the answer is composed against that evidence; and a validation pass checks that each claim is actually entailed by its cited span. Claims that fail don't get a smaller font — the system either narrows the answer to what the evidence supports or declines with the retrieval trail attached, so a human can see exactly what was searched and what came back.

Declining turns out to be a feature buyers ask about, unprompted. Regulated organizations have been burned by confident nonsense. A system that can prove *why* it didn't answer earns more trust than one that always answers.

## Permissions are part of the citation

A citation you're not allowed to open is a data leak with extra steps. That's why access control in LACE runs at the moment of retrieval, not at index time. Connector access snapshots flow forward with every document, and every retrieval — search, chat, agent tool call, graph query — filters against the caller's live permissions.

The subtle consequence: two users can ask the same question and get different answers, each fully cited against the documents *they* are allowed to see. That's not a bug in a governed enterprise. That's the requirement.

## What it costs, honestly

Evidence-first retrieval is more work. Ingest is heavier because structure must survive. Retrieval is more complex because hybrid lexical/vector legs have to be fused without losing span identity. Answer synthesis is slower because verification is a real pass, not a vibe.

We think the trade is obviously right for the markets LACE serves. A three-second answer you can defend in an audit beats a one-second answer you have to retract in a deposition.

Every answer in LACE ends the same way: with receipts. That's the whole point.
