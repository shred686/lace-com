---
title: "Agents that ask first: designing approval gates that don't kill velocity"
description: "How LACE decides which agent actions need human sign-off, which run free — and why the answer is a policy, not a vibe."
category: "Agents"
date: 2026-06-12
author: "LACE Engineering"
---

There are two failure modes for enterprise agents. The famous one is the agent that does something it shouldn't — sends the wrong refund, emails the wrong customer, edits the wrong record. The quieter one is the agent so wrapped in review steps that it's just a slow form. Most deployments die of the second disease while designing against the first.

LACE's answer is that **approval is a property of the action, not of the agent.**

## Gate the tool, not the conversation

In LACE, an agent's abilities are explicit capabilities: this tool, this knowledge, this pipeline, granted per-agent, per-version. Any tool capability can be marked `approval_required`. When the agent invokes that tool, the run pauses in a `waiting_approval` state; a human sees the proposed action, its inputs, and the evidence trail behind it, and approves or rejects with one click.

Everything else — reading, retrieving, drafting, classifying — runs at full speed. The contracts intake agent drafts its reply in seconds; only *sending* it waits for counsel. Velocity where mistakes are cheap, ceremony where they're expensive.

This is a deliberate contrast with review-the-whole-conversation designs. Approving a transcript is theater: the reviewer can't tell which sentence moves money. Approving a tool call with typed arguments — recipient, amount, clause cited — is an actual decision.

## The platform enforces; the model proposes

An approval gate is only as good as its enforcement point. If the gate lives in the prompt ("please ask before sending emails"), it's a suggestion. LACE's gates live in the runtime: the tool dispatcher checks capability policy before execution, the same way it checks permissions and budgets. A model can't talk its way past a dispatcher.

The same layer enforces budget caps (the agent stops proposing work when its spend limit is reached), loop guards (repeated near-identical tool calls trip a breaker instead of burning tokens), and allowed-action lists. None of these depend on the model being well-behaved. That's the point.

## Making reviewers fast

Human-in-the-loop fails when humans become the queue. Three design choices keep LACE reviewers fast:

- **Evidence is attached.** The approval card shows the draft *and* its citations. Reviewers verify, they don't re-research.
- **Decisions are one click** — from Slack, email, or the workspace, wherever the reviewer already is.
- **Everything is recorded.** Approvals, rejections, and the reasons land in the same audit trail as the agent's own steps, so the review load itself is measurable — and gates that never catch anything can be relaxed with data, not anecdotes.

That last point is underrated. Teams start conservative: gate everything that touches the outside world. Two months of audit trail later, they can see that, say, status-update replies were approved 100% of the time with zero edits — a gate that can safely come off — while pricing responses got edited a third of the time, and stay gated. **Approval policy becomes an empirical question.**

## Prove it before you promote it

Gates are the runtime defense. The other half is not deploying a bad agent in the first place. Every LACE agent can be scored against evaluation suites before promotion, and deployments bind a specific agent version to a specific policy — so "it worked in the demo" and "it's what's running in production" are, verifiably, the same artifact.

Agents earn autonomy the way people do: by producing a record. The difference is that with LACE, the record is complete.
