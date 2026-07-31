---
title: "Knowledge Graphs Were Never a Technology Problem. They Were a Labor Problem."
description: "Knowledge Graph materialization is hard, and it's something that LLMs can actually do."
seoTitle: "Why Knowledge Graphs Failed — and What Changed | LACE"
seoDescription: "Knowledge graphs were never blocked on graph technology. They were blocked on the cost of human judgment at scale. LLM classification collapses that cost — for bounded questions with governed answers."
category: "Knowledge Graph"
date: 2026-07-31
author: "Michael Kerner"
featured: true
---

Knowledge graphs have been "the future of enterprise data" since I've been alive and coding, and probably longer. Every few years someone declares the era open. The machinery has existed the whole time: description logics, RDF and OWL, graph databases, SPARQL, entity-relationship theory older than most working engineers. Storage was never the blocker. Query languages were never the blocker. And yet almost nobody has a knowledge graph — and the organizations that DO paid astronomically for them. What most enterprises have instead is a data warehouse, a document repository, and a slide deck about the knowledge graph initiative that stalled in year two.

I want to be precise about why, because the reason just changed, and understanding exactly what changed tells you exactly how to build now.

## The three barriers

Three things kill knowledge group construction projects, and they killed ours too.

First: you needed a complete ontology before extracting anything. And no, a dump of your relational DB schema doesn't work. To populate a graph you need classes, relations, and constraints — somewhere for facts to land. Classical methodology made this a waterfall: convene the experts, model the domain for months, then extract. But a schema designed in a vacuum is always wrong at the edges in ways only real data reveals, and changing the schema AFTER knowledge graph population is a total breaking proposition. So projects either modeled forever and never shipped, or shipped a schema that was obsolute the day it touched real documents.

Second: nothing mapped to it. The knowledge you want in the graph already exists, locked in relational systems and documents that were never designed to be knowledge graph triples. Mapping structured data at scale was bordering on rocket science — hand-authored mappings per table, per system, maintained forever against schema drift. Unstructured documents were flatly impossible. Pre-LLM NLP could tag names and match patterns, but any form of prose document structure was beyond it, and every new relation type meant training a new model on a new labeled dataset.

Third — and this is the actual killer: every single fact on the graph requires an act of reasoning. Is this a Person or an Organization? Is "the Company" on page 40 the same entity as the filer defined on page 1? Is this figure a base salary or a target bonus? Is this relationship guaranteed_by, or merely party_to? None of these is mechanical. All of them are semantic. And a graph worth having contains millions to billions of facts. One minute of judgment per decision, times a hundred million data points.

Look at who actually shipped a KG at scale and this stops being theory. Google bought Freebase, seeded from Wikipedia, and paid curation teams to do the work. Wikidata recruited a volunteer crowd the size of a small country. Defense and intelligence systems run huge teams of analysts doing the mapping and the judgment by hand, billed by the hour — and if you think frontier model API costs are high... Every knowledge graph that ever worked at scale worked because somebody paid for human judgment, one data point at a time.

## The wrong lesson from LLMs

When models arrived that could genuinely read, the tempting conclusion was: problem solved. Point the model at the corpus and say "build me a knowledge graph." This is more or less what Microsoft's GraphRAG documentation describes, and in my experience it burns an enormous number of tokens and never converges on anything you can use.

The failure mode is specific. Asked open-endedly, the model does real semantic work and then emits it in vocabulary you don't govern. It invents classes. It coins relations. It decides identity by vibe, and does it differently on Tuesday than on Monday. You get something that looks like a graph — nodes, edges, impressive demo — with no schema discipline, no identity discipline, and no way to reconcile its improvised labels back to anything. The naive approach doesn't remove the barrier. It hides the barrier under a demo.

Some solutions: pass in a JSON schema of the entities and relations you want extracted. This is a step up from open-schema extraction, but now every LLM call is an isolated window, massive entity duplication will ensue, relationship de-normalization will multiply edge counts. It works on ONE single LLM context window, with a simple schema. ONce the class and relationship counts grow and the documents exceed a single context window, you will have massive problems that can't be solved without more LLM calls to normalize, de-dup, etc.

In act, in our initial development, one single document on average would spawn 175 separate LLM calls in order to generate anything usable.

In short: "Hey chat, generate a knowledge graph for these documents, based on this schema..." does not work in production.

But here's what LLMs actually do reliably enough to build infrastructure on: classification. Give the model a bounded question with a finite answer set — what is this, against this class table — and it will do that simple, repeatable task well. Fast, cheap, consistent, and actually gradeable: a bounded question has a right answer you can score, which means quality becomes measurable instead of vibes. There's a cost bonus hiding in here too. The expensive side of LLM inference is output tokens, not input. A classification result is a few tokens long. You can ship a large class table into the prompt and get a one-word answer back, and the economics still work.

## The reduction

So the move is a reduction: break down KG construction into its iterable, simple actions until every remaining decision is that shape. Do it honestly and something striking happens — every atomic decision in the pipeline turns out to be a classification. Is this span an entity mention at all? Which class, from this list? This mention of "Azure" — which of these two known entities is it? Does this sentence assert a relation between these two entities, which predicate from this vocabulary, in which direction? Are these two extracted fragments the same real-world thing? Is this fact asserted, negated, hypothetical, or historical? And when nothing offered fits: does one of the nearest existing classes actually express this, or is it genuinely new?

That list isn't a simplification of what our extraction pipeline does in LACE. It is exhaustively what the model does in it. Everything between the classifications — parsing, windowing, candidate retrieval, constraint checking, deduplication, ledger writes — is deterministic code. The deterministic layer is allowed to look things up, narrow options, validate answers, and detect gaps. It is never allowed to make a semantic judgment. Every model decision is bounded, carries its evidence, lands in a governed vocabulary, and costs a fraction of a cent.

<figure class="lp-fig lp-reduce" aria-label="Diagram: an unbounded interpretation problem decomposes into a bounded, looping classification question, which writes to an evidence ledger, which serves the knowledge graph and UI.">
  <div class="lp-reduce-node">
    <span class="lp-reduce-icon">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="9"></circle>
        <path d="M9.2 9.5a2.8 2.8 0 0 1 5.4.9c0 1.8-2.6 2-2.6 3.8"></path>
        <path d="M12 17.2h.01"></path>
      </svg>
    </span>
    <span class="lp-reduce-title">"Build me a knowledge graph"</span>
    <span class="lp-reduce-cap">Open-ended interpretation — unbounded judgment, improvised vocabulary, ungradeable output.</span>
  </div>

  <div class="lp-reduce-arrow"><span class="lp-reduce-arrow-label">decompose</span></div>

  <div class="lp-reduce-loop" aria-label="Atomic classification questions, bounded and gradeable, looping once per span or fact across the corpus">
    <div class="lp-reduce-loop-head">
      <span class="lp-reduce-loop-title">Atomic questions</span>
      <span class="lp-reduce-loop-badge">Bounded · per fact</span>
    </div>
    <div class="lp-reduce-card">
      <div class="lp-reduce-card-q">
        <span class="lp-reduce-card-label">Q</span>
        <span>Which class is "Azure" — <code>Organization</code>, <code>Location</code>, or <code>Product</code>?</span>
      </div>
      <div class="lp-reduce-card-a">
        <span class="lp-reduce-card-label lp-reduce-card-label-a">A</span>
        <span><code>Organization</code> — conf 0.97</span>
      </div>
    </div>
    <div class="lp-reduce-loop-foot">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
        <path d="M4 12a8 8 0 0 1 14-5.3"></path>
        <path d="M18 3v4h-4"></path>
        <path d="M20 12a8 8 0 0 1-14 5.3"></path>
        <path d="M6 21v-4h4"></path>
      </svg>
      <span>next span, next fact — same bounded question, asked again across the corpus</span>
    </div>
    <div class="lp-reduce-loop-arc" aria-hidden="true"></div>
  </div>

  <div class="lp-reduce-arrow"><span class="lp-reduce-arrow-label">writes</span></div>

  <div class="lp-reduce-node">
    <span class="lp-reduce-icon">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">
        <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H18v18H6.5A2.5 2.5 0 0 1 4 18.5v-13Z"></path>
        <path d="M8 3v18"></path>
      </svg>
    </span>
    <span class="lp-reduce-title">Evidence ledger</span>
    <div class="lp-reduce-record">assert( Azure, is_a, Organization ) · span p.14 · conf 0.97</div>
  </div>

  <div class="lp-reduce-arrow"><span class="lp-reduce-arrow-label">serves</span></div>

  <div class="lp-reduce-node">
    <span class="lp-reduce-icon">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="6" cy="6" r="2.2"></circle>
        <circle cx="18" cy="6" r="2.2"></circle>
        <circle cx="12" cy="18" r="2.2"></circle>
        <path d="M7.8 7.3 10.5 16"></path>
        <path d="M16.2 7.3 13.5 16"></path>
        <path d="M8.2 6h7.6"></path>
      </svg>
    </span>
    <span class="lp-reduce-title">Knowledge graph / UI</span>
    <span class="lp-reduce-cap">Deterministic reads, in milliseconds, with receipts.</span>
  </div>
</figure>

Once we had that reduction built and the connecting layers held, the three barriers fell.

The schema stopped being a prerequisite. It became the answer sheet, shipped inside every question, so the model classifies against our vocabulary instead of describing the world freehand. It also stopped needing to be right up front: when a real document asserts something the schema can't express, that's one more classification, and a "genuinely new" verdict becomes a versioned amendment proposal with the evidence attached. The schema grows from contact with data, under governance, instead of calcifying.

Mapping became a classification task. Which class does this table's rows represent? Which attribute is this column? Which known entity does this row refer to? Same bounded questions, same class table — and we've pushed this cost down further with smaller models, because column classification doesn't need a frontier model. Documents, the historically hopeless case, became the strong case, because reading a clause and classifying what it asserts is precisely the task these models perform well.

And the labor economics inverted. Human judgment stopped scaling with the number of facts and started scaling with the size of the schema plus the number of exceptions. People govern the vocabulary, curate the registry of known entities, and rule on the escalations the model produces. One person can run this. We've proven it on datasets of tens of thousands of documents. The line item that only Google, a volunteer planet, or a billable-hours army could ever fund is a suprisingly low inference budget.

And further optimizations can be done. Giving the LLM relevant classes and relationships for passages to focus on, using a simple embeddings and retrieval approach, or even a simple, cheap model such as GLiNER2 for a cheap NER pass beforehand actually WORKS.

<figure class="lp-fig lp-bars" aria-label="Diagram: the cost of one semantic judgment, an analyst-minute versus a bounded model classification call, roughly a thousand-fold difference.">
  <div class="lp-bars-row">
    <span class="lp-bars-label">Analyst, one judgment</span>
    <span class="lp-bars-track"><span class="lp-bars-fill" style="width: 100%"></span></span>
    <span class="lp-bars-value">~$1 / fact</span>
  </div>
  <div class="lp-bars-row">
    <span class="lp-bars-label">Bounded classification call</span>
    <span class="lp-bars-track"><span class="lp-bars-fill lp-bars-fill-alt" style="width: 3%"></span></span>
    <span class="lp-bars-value">~$0.001 / fact</span>
  </div>
  <p class="lp-bars-foot">Multiply either figure by a hundred million facts. One number is a payroll. The other is an inference budget.</p>
</figure>

## Why bother

Collapsing the barrier only matters if the thing behind it is worth having. It is, and the advantages split cleanly by what you compare the graph against.

Against your relational systems, the graph answers questions nobody designed for. Relational joins run along foreign keys somebody anticipated in advance; in a graph, the entity itself is the join key, so "every contract, invoice, ticket, and filing that touches Acme or any of its subsidiaries" is one hop instead of an N-system integration project. "Which of our suppliers are ultimately owned by an entity sanctioned last quarter" becomes a two-hop traversal instead of a question your 2019 schema never imagined. Identity becomes data instead of an ETL prayer: the same company living in six systems under six IDs and four spellings is a first-class, evidenced, revisable record, where merges and splits are logged events with provenance instead of silent overwrites. And a bitemporal graph distinguishes when something was true from when you learned it — "what did we believe about this ownership structure on May 4th, and what changed since" is a query, not an archaeology project.

Against RAG, the graph computes where search can only retrieve. "How many of our contracts auto-renew in the next 90 days and lack a termination-for-convenience clause?" Retrieval returns passages. It cannot count. The graph returns the number, and the list, each entry citing its clause. It can also give you the confident negative — "none," or "exactly these twelve" — where search can only say "here's what I found" and miss silently. For compliance questions, the difference between no results and NO is the entire product. Cross-document assembly gets paid for once: an executive's full picture is spread across forty filings, and RAG re-derives it at every query from whatever snippets fit the context window, with per-query cost and per-query hallucination risk, while the graph assembles it once at write time with evidence. And disagreement becomes an object. Two filings state different revenue figures — one is a restatement. RAG blends them or picks one arbitrarily, per query. A graph with conflict machinery keeps both claims, both sources, and a governed ruling about which is accepted. Inspectable, not vanished.

Underneath all of it runs one meta-advantage: understanding is paid for once, at write time, and amortized over every read. RAG spends inference — cost, latency, error bars — on every question, forever. The graph spends it once per document, banks the result as typed, evidenced, governed facts, and serves everything after that deterministically, in milliseconds, with receipts.

## The caveat

Everything above assumes the graph is governed, and that assumption is doing real work. A naive LLM-extracted graph — improvised vocabulary, vibe-based identity, no evidence chain — delivers none of this. It delivers wrong answers with the confidence of structure, which is worse than search. The advantages come from the governance: the schema discipline, the identity ledger, the evidence links, the conflict machinery. The reduction to classification doesn't make that governance unnecessary. It makes it affordable, because the judgment inside every one of those million governed decisions now costs cents instead of minutes.

Knowledge graphs were never blocked on graph technology. They were blocked on the price of a semantic judgment at every data point. That price just collapsed — for exactly one shape of question. The engineering discipline now is making sure every question you ask has that shape.

What's next for us: realtime ingestion, streaming data at scale, and cross-ontology, cross-domain graph construction.
