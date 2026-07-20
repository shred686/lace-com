---
title: "Running LACE with no internet: what actually changes in an air-gapped deployment"
description: "No external AI calls, no telemetry home, no package registry. What breaks when the network goes away — and how the platform is built so nothing does."
category: "Deployment"
date: 2026-05-28
author: "LACE Engineering"
---

"Do you support air-gapped?" is a checkbox on a lot of vendor questionnaires. It's worth spelling out what the checkbox actually means, because for an AI platform the honest answer is usually "mostly, except…" — and the exceptions are exactly the parts a security officer cares about.

Here's what changes when LACE runs inside a disconnected enclave, and what deliberately doesn't.

## What doesn't change

The important answer first: **the product**. Search, the knowledge graph, agents, workflows, and the app builder run identically in an enclave, because none of them assume an external dependency at runtime. The governance substrate — permissions at query time, budgets, approval gates, audit — is the same code enforcing the same rules. There is no "lite mode" for classified networks.

That's an architectural outcome, not a porting effort. LACE's services were built to talk to *configured* endpoints — model endpoints, object storage, databases — never to hard-coded clouds. An air-gapped deployment is a configuration of the same system, not a fork of it.

## Models come inside the boundary

The obvious change: no calls to external AI providers. Models run on infrastructure inside the enclave, and LACE's model registry resolves every purpose — retrieval embedding, reranking, generation, extraction — to those local endpoints.

The registry matters more here than anywhere else. In a connected deployment, "which model handles which purpose" is a cost and quality decision. In an enclave, it's also an accreditation decision: the security plan names the models, and the platform's per-call attribution (tenant, initiator, purpose, model, tokens) is the evidence that the named models are the ones actually being used.

## Updates become artifacts, not downloads

With no path to a package registry or image repository, delivery changes shape: releases arrive as signed, digest-pinned bundles that cross the boundary through the organization's own transfer process, and are promoted through the same validation gates as any other environment.

This is where "we support air-gapped" claims usually fray — an update process that quietly assumes `pip install` will work. LACE's rule is stricter and simpler: production activation requires validation and digest promotion, never a mutable pull. The air gap doesn't weaken the delivery discipline; it's the environment the discipline was designed for.

## Telemetry stays home

Observability doesn't leave the enclave — it just doesn't leave. Structured logs, traces, prompt traces, and cost attribution land in the enclave's own observability stack. Nothing phones home; there is no home to phone.

The upside surprises people: because LACE's audit trail was designed as a *product feature* (regulated buyers need it), the enclave operator gets the full evidence chain locally — every answer's sources, every agent action, every approval — without any dependency on us.

## What we gave up, honestly

Two things are genuinely harder disconnected. Model refresh cadence is slower, because new weights ride the same artifact process as code. And support is asynchronous — our engineers don't get a tunnel; diagnostics travel as exported bundles that the customer reviews before release.

Both trade-offs are the entire reason enclaves exist. The platform's job is to make them cheap. Everything your organization knows keeps working for you — even, especially, where the internet can't reach.
