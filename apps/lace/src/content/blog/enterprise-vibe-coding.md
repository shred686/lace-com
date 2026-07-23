---
title: "Enterprise Vibe Coding Is Coming. The Trick Is Deciding What the Vibes Are Allowed to Touch."
description: "Vibe coding's productivity is real — and so is the risk. The 'fix' we are making isn't to review generated code harder. It's deciding which concerns generated code is allowed to have, and enforcing the boundary with an SDK."
seoTitle: "Enterprise Vibe Coding: A Safer Architecture | LACE"
seoDescription: "Enterprise vibe coding can be safe when identity, data, policy, limits, and audit are platform capabilities generated code cannot bypass."
category: "App Builder"
date: 2026-07-22
updated: 2026-07-23
author: "Michael Kerner"
featured: true
---

"Vibe coding" entered the vocabulary as a half-joke: prompt-in, code-out, run it, describe what's wrong, repeat. Don't waste your time in code review. It works or it doesn't.

The enterprise reaction was immediate — a mixture of horror and dismissal. And the horror isn't wrong. Vibe-coded software, as practiced in the wild: hand-rolled authentication that doesn't protect the API, secrets in source, 1990s level SQL injection opportunities, no audit trail, no access model, most scarily, everyone's local environment has terraform scripts with full-access given to the model. Every CISO who banned it had good reasons.

But dismissal is the wrong conclusion, because the productivity signal underneath the joke is real. People with no development background are producing working software in an afternoon. Product managers are themselves shipping features. The gap between "I can describe it" and "it exists" has collapsed from months to minutes — for exactly the class of small, specific software that fills every enterprise's unbuildable backlog.

So the interesting question was never "should enterprises allow vibe coding?" It's an engineering question: where, precisely, does the risk live in vibe-coded software — and can it be fenced?

## The risk is not evenly distributed

Look at what goes wrong when generated code fails in production, and a pattern jumps out: the failures cluster. Nobody has ever been breached through a poorly considered button color. No audit finding has ever cited an unfashionable layout. The UI layer — the part vibe coders most enjoy iterating on — is close to risk-free.

The damage concentrates in a specific and enumerable set of concerns:

- **Authentication and authorization** — who is this user, what may they see, what may they do
- **Persistence** — where data lives, how it's modeled, whether writes are safe and recoverable
- **Type and contract discipline** — whether the data crossing boundaries means what both sides think it means
- **Rate limiting and quota** — whether one runaway loop can take down a shared service
- **Scaling and sharding** — whether the thing survives contact with real load and real data volume
- **Audit and telemetry** — whether anyone can reconstruct what happened

Call these the enterprise concerns. They share three properties: they're where all the danger is, they're nearly identical across every application in the organization, and — critically — they're the part language models are worst at generating correctly, because correctness here isn't local. You can't verify an auth model by looking at one file. It has to agree with the organization's identity provider, its access policies, its data classification rules. A model confabulating a plausible-looking JWT validation function is the security equivalent of a hallucinated citation: fluent, confident, wrong in ways that don't show until it matters.

Meanwhile the concerns outside that list — screens, forms, workflow states, report layouts — are local, visually verifiable, and low-consequence. If the generated form is wrong, you can see it's wrong. The feedback loop that makes vibe coding work — look at it, describe the problem, regenerate — actually functions there.

The risk profile of vibe coding isn't a cloud. It's a map. And anything with a map can be fenced.

## The fence is an SDK

The architecture that follows from this observation is the one we built into LACE's App Builder, and it has two components: a sandbox and an SDK.

The sandbox is where the agent works. Generated code executes in an isolated environment with no direct access to databases, networks, credentials, or the host. This is table stakes — containment for code you didn't review.

<figure class="lp-fig lp-flow" aria-label="Diagram: an agent generates code in an isolated sandbox, which commits to Git, which builds into a container in the cloud — all reaching real resources only through the platform SDK.">
  <div class="lp-flow-row">
  <div class="lp-flow-node">
    <div class="lp-flow-box">
      <span class="lp-flow-badge">Isolated sandbox</span>
      <span class="lp-flow-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="3"></rect>
          <path d="M7.5 9.5 10 12l-2.5 2.5"></path>
          <path d="M13 14.5h4"></path>
        </svg>
      </span>
      <span class="lp-flow-title">Agent</span>
    </div>
    <span class="lp-flow-cap">Generates app code in isolation — no database, no network, no credentials, no host.</span>
  </div>

  <div class="lp-flow-arrow"><span class="lp-flow-arrow-label">commit</span></div>

  <div class="lp-flow-node">
    <div class="lp-flow-box">
      <span class="lp-flow-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="6" cy="6" r="2.4"></circle>
          <circle cx="6" cy="18" r="2.4"></circle>
          <circle cx="18" cy="9" r="2.4"></circle>
          <path d="M6 8.4v7.2"></path>
          <path d="M18 11.4v.6a3 3 0 0 1-3 3H6"></path>
        </svg>
      </span>
      <span class="lp-flow-title">Git</span>
    </div>
    <span class="lp-flow-cap">Generated source is versioned — every change is a reviewable, revertable artifact.</span>
  </div>

  <div class="lp-flow-arrow"><span class="lp-flow-arrow-label">build</span></div>

  <div class="lp-flow-node">
    <div class="lp-flow-box">
      <span class="lp-flow-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">
          <path d="M7 17.5a4 4 0 1 1 1-7.87A5 5 0 0 1 18 10.5a3.5 3.5 0 0 1-.5 7Z"></path>
          <rect x="9.5" y="11.5" width="5" height="5" rx="1"></rect>
          <path d="M12 11.5v5M9.5 14h5"></path>
        </svg>
      </span>
      <span class="lp-flow-title">Cloud container</span>
    </div>
    <span class="lp-flow-cap">Built and run behind the platform SDK — the only surface that reaches anything real.</span>
  </div>
  </div>

  <div class="lp-flow-base" aria-label="platform SDK: the governed capability surface underneath every stage">
    <span class="lp-flow-base-icon">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">
        <path d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Z"></path>
        <path d="m4 7.5 8 4.5 8-4.5"></path>
        <path d="M12 12v9"></path>
      </svg>
    </span>
    <span class="lp-flow-base-text"><strong>@platform/sdk</strong> — the governed capability surface. Imported in the sandbox, enforced in the container: the only path to identity, data, policy, limits, and audit.</span>
  </div>
</figure>

The SDK is the interesting part. It's the only surface through which sandboxed code can reach anything real, and it's designed on a simple principle: every enterprise concern exists exclusively as a governed capability, never as something the generated code implements.

The generated app doesn't authenticate users — it asks the SDK who the current user is, and the platform's identity layer answers. It doesn't write SQL — it declares the data it needs against typed contracts, and the platform's persistence layer handles storage, sharding, migration, and backup. It doesn't implement permissions — every data access flows through the platform's policy engine, which enforces the same document-level and field-level controls as everything else in the environment. Rate limits, quotas, retry semantics, telemetry: all ambient, all inherited, all invisible to the app code.

<figure class="lp-fig lp-tree" aria-label="Diagram: the SDK exposes each enterprise concern as a governed capability, and deliberately omits raw database, network, and filesystem access.">
  <div class="lp-tree-head">
    <span class="lp-tree-dot"></span>
    <span class="lp-tree-dot"></span>
    <span class="lp-tree-dot"></span>
    <span class="lp-tree-name">platform-sdk/</span>
  </div>
  <div class="lp-tree-body">
    <div class="lp-tree-row"><span class="lp-tree-branch">├─</span><span class="lp-tree-dir">identity/</span><span class="lp-tree-note">who the current user is</span></div>
    <div class="lp-tree-row"><span class="lp-tree-branch">├─</span><span class="lp-tree-dir">data/</span><span class="lp-tree-note">typed persistence contracts</span></div>
    <div class="lp-tree-row"><span class="lp-tree-branch">├─</span><span class="lp-tree-dir">policy/</span><span class="lp-tree-note">document- &amp; field-level access</span></div>
    <div class="lp-tree-row"><span class="lp-tree-branch">├─</span><span class="lp-tree-dir">limits/</span><span class="lp-tree-note">rate limits &amp; quotas</span></div>
    <div class="lp-tree-row"><span class="lp-tree-branch">└─</span><span class="lp-tree-dir">audit/</span><span class="lp-tree-note">telemetry &amp; the event log</span></div>
    <div class="lp-tree-gap"></div>
    <div class="lp-tree-row is-omitted"><span class="lp-tree-branch">✕</span><span class="lp-tree-dir">db/ · net/ · fs/</span><span class="lp-tree-note">no API exists — the capability isn't there to misuse</span></div>
  </div>
</figure>

The load-bearing property is what the SDK omits. There is no API for opening a raw database connection, because that API doesn't exist in the sandbox. The agent cannot hand-roll auth — not because a linter catches it, not because a code review rejects it, but because the capability isn't there to misuse. This is the same structural-enforcement insight that applies everywhere agents operate: you don't get reliability by instructing an agent to behave. You get it by constructing a world where the wrong behavior is unrepresentable.

Prompt-level guardrails are suggestions. SDK Capability boundaries are physics.

## What's left is the good part

Subtract the enterprise concerns, and what remains for the vibe coder — human, agent, or the usual pair of them — is precisely the layer where vibing works: the interface, the workflow, the experience.

This is not a consolation prize. It's most of what makes an internal tool fit a team. Two inspection-intake apps can share identical auth, storage, and audit machinery and still succeed or fail entirely on whether the workflow matches how the team actually operates — which fields, which states, which view the supervisor sees Monday morning. That knowledge lives with the team, not with IT, and conversational iteration is genuinely the best interface anyone has built for extracting it.

So the team members splash around. Describes the tool, looks at it, changes it, ships it — in an afternoon, with the blast radius limited to wonky UI. Underneath, the app is indistinguishable from custom-built enterprise software, because the enterprise parts weren't generated. They were inherited.

And because agents in LACE are governed components too, "the vibe coder" is increasingly an agent in Agent Studio working the same loop — building, checking its work against the rendered UI, iterating — inside the same fences, under the same audit.

## The inversion

Here's the framing shift worth taking away. The instinct is to treat generated code as a quality problem: review it harder, test it more, trust it less. That instinct doesn't scale, and it gives up the entire productivity gain.

The alternative is to treat it as a jurisdiction problem: decide which concerns generated code is allowed to have, make everything else a platform capability, and enforce the boundary structurally. Then the question "can we trust vibe-coded software?" dissolves, because the parts that required trust were never vibe-coded.

Enterprise software was always majorly a plumbing problem. The revolution isn't that AI writes the plumbing. It's that nobody writes the plumbing anymore — and the 20% that's left is finally cheap enough to get right.

Let them vibe.
