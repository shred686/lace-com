---
title: "We Tested the Best Models for Local Search"
description: "Semantic search that stays on the device needs an embedding model that also stays on the device. We benchmarked 40 open-weight models against a hand-graded 300-query set to find out which ones are actually worth the CPU."
seoTitle: "Local Embedding Model Benchmark for On-Device Search | LACE"
seoDescription: "A 40-model benchmark of open-weight embedding models on consumer CPU hardware, scored against a 300-query judged set, with CPU and GPU throughput numbers."
category: "Retrieval"
date: 2026-09-02
author: "Michael Kerner"
featured: true
---

Let's face it, we might be at peak token-wasting frenzy. The interesting thing about it is that we — me included — are quick to submit to a monetized, per-token workflow even where using an LLM isn't just unnecessary but actually *worse*: lower quality and more expensive than the "old, 2020-era" solution. Search is a good example.

Watch a coding agent try to find a file on your machine and you'll see it: it lists a directory, greps for a word, opens a couple of things that aren't it, greps for a different word, opens a couple more, and after eight or nine tool calls it usually gets there. Each of those calls costs tokens, and the whole time it's doing work that a normal hybrid search index would have done in a few milliseconds.

At scale — millions of documents, hundreds of users — you can go broke letting everyone run agentic search over their own files.

Embeddings themselves aren't free either. But we'd rather have the agent make one call to a search tool and let something that already knows the machine handle it: keyword matching, semantic matching, images, eventually audio. And we'd rather stop sending text off to cloud embedding models in the process. That's the basic idea behind LACE on the desktop — let the local hardware build the search index and guarantee privacy. But "semantic search" means embeddings, and if the search stays on the device, the embeddings have to be computed on the device too.

So we looked into what embedding models can actually run, effectively, on any old laptop.

## An embedding model is what lets you beat agentic search

Keyword search is vital, but it has a hard edge. If you remember "the receipt from the place in Mexico" and the file is actually named `ticket, Guadalajara`, or you're thinking of "the screenshot of that error from last week," keyword search won't get you there. An embedding model gets you from the phrase to the file by turning text into vectors where similar meanings land close together.

But volume is the constraint. Our test corpus is 2,651 real documents, 347,618 chunks. On a four-core laptop with 8 GB of RAM — our lowest supported tier — the model choice decides whether indexing takes hours or days, and it has to happen while the person is actively using the computer, so we can't run at more than 10–20% CPU.

Our first builds used Snowflake's Arctic Embed XS, and you'll see why below: 22.6M parameters, 384-dimensional output, running through ONNX Runtime on CPU.

## What we ran

We put together a registry of 40 open-weight embedding families under roughly 700M parameters. Cloud APIs weren't considered — the whole point is that nothing leaves the device.

The forty covered the Arctic models, BGE, Qwen3, Nomic, Mixedbread, ModernBERT-based models, E5, Granite, Jina, EmbeddingGemma, Voyage's nano model, a static embedding model, two BitNet models, and a handful of others. Arctic XS was the control, since we already knew it worked on the lowest-tier consumer hardware. We weren't trying to find the highest-scoring model — we were trying to find out whether any of the forty was enough better than a 22M-parameter model to be worth the extra CPU time, memory, and disk.

## How we scored them

We built our own judged set: 300 queries over those 2,651 documents, graded by humans. The queries are deliberately spread across the things people actually type into a desktop search box — plain English, Spanish and mixed-language, filenames and paths, code and config, filter-style requests, questions with no answer in the corpus, near-duplicate versions of the same document, distractors, PDFs with bad layout, Office and HTML files.

The short version: this is a very hard dataset.

## Results

nDCG@10 over the 240 development queries, on a 30,000-chunk screen, exact float32 search, best output dimension per model. The CPU column is chunks per second on the four-core CPU-only tier.

Here are the 18 best-performing options:

| Model | Params | nDCG@10 | vs. control | CPU chunks/s | Memory (MB) |
|---|---:|---:|---:|---:|---:|
| ModernBERT Embed Large | 395M | 0.652 | +0.079 | 1.29 | 2,556 |
| Arctic Embed M (v1) | 110M | 0.640 | +0.067 | 2.49 | 998 |
| Voyage 4 Nano | 340M | 0.634 | +0.061 | 2.84 | 2,339 |
| Arctic Embed M v2 | 305M | 0.632 | +0.060 | 5.34 | 2,247 |
| EmbeddingGemma 300M | 308M | 0.626 | +0.054 | 2.34 | 2,152 |
| Arctic Embed L v2 | 568M | 0.625 | +0.052 | 1.87 | 3,367 |
| ModernBERT Embed Base | 149M | 0.618 | +0.046 | 3.13 | 1,273 |
| BGE-M3 (dense) | 568M | 0.614 | +0.041 | 1.72 | 3,404 |
| Qwen3 Embedding 0.6B | 600M | 0.614 | +0.041 | 0.52 | 3,052 |
| Multilingual E5 Large | 560M | 0.603 | +0.031 | 1.67 | 3,317 |
| Arctic Embed S | 33M | 0.601 | +0.029 | 5.56 | 638 |
| Nomic Embed v1.5 | 137M | 0.597 | +0.025 | 3.61 | 1,255 |
| **Arctic Embed XS (control)** | **22.6M** | **0.573** | **—** | **15.96** | **586** |
| Multilingual E5 Small | 118M | 0.566 | −0.007 | 9.85 | 1,496 |
| Granite 97M Multilingual | 97M | 0.557 | −0.016 | 5.98 | 1,364 |
| Static Retrieval MRL | 31M (static) | 0.510 | −0.063 | 2,051 | 606 |
| MiniLM L6 v2 | 23M | 0.467 | −0.105 | 30.1 | 587 |
| Jina v2 Base Code | 161M | 0.178 | −0.395 | 2.30 | 1,500 |

The models not shown fall between 0.46 and 0.60, close to one of the above.

## Conclusions

**Quality costs CPU, which you already knew.** ModernBERT Embed Large was the best model we ran. It also does 1.29 chunks a second on four cores where Arctic XS does 15.96 — roughly 12x the compute, plus 4.4x the memory and 2.7x the disk per vector. On the test corpus that works out to something like six hours of indexing for the control and about three days for ModernBERT Large.

**Parameter count doesn't mean much.** The second-best model was Arctic Embed M, 110M parameters, from 2024. It beat the more modern Qwen3 Embedding 0.6B, BGE-M3, Multilingual E5 Large, and Arctic L v2 — all roughly five times its size. Snowflake's own newer, 305M-parameter Arctic M v2 scored slightly under the old 110M version on our queries. We'd been using parameter count and leaderboard rank as a rough guide for what to test, and we won't do that again.

**The static model is genuinely interesting.** static-retrieval-mrl-en-v1 has no transformer layers, so it embedded at just over 2,000 chunks a second on four cores — 128x faster than the control, at roughly the same memory. It loses on quality. But it makes a two-stage index plausible: embed everything with the static model in the first few minutes so the user has something to search, then re-embed with a better model in the background. We haven't built that yet.

**A specialist model does badly on a general corpus.** Jina's code embedding model scored 0.178 on our mixed corpus, with Recall@10 of 0.223. Our corpus has a code slice, but it's mostly ordinary documents, and a code-specialist model just doesn't handle those.

**The control's real weakness is Spanish.** On the Spanish and mixed-language slice, Arctic XS scores 0.72. Almost every multilingual model scores 1.0 there. Multilingual E5 Small is worth a second look for this reason — it ties the control overall while running at 9.85 chunks a second.

One more finding: truncating Matryoshka models to 256 dimensions saved 75% of vector storage, cost between 0.015 and 0.06 in score, and didn't change embedding speed at all — the model still runs every layer, so a Nomic model truncated to 256d is still a 137M-parameter model doing 137M-parameter work. But it does save real storage space.

## With a GPU

Everything above is CPU-only, because we can't assume everyone has a GPU. With one, unsurprisingly, everything changes.

We ran the control model through three execution providers on the same Windows machine — a Ryzen 9 8945HS with an RTX 4070 (8 GB). CPU ONNX on 16 threads did 31.4 chunks a second at batch size one. CUDA did 233.7 at batch one and 329.1 at batch 32 — 26x the CPU number at that batch size.

Larger models gain more from the GPU than the small one does. Here are the top ten from the results table with both numbers. The CPU column is the four-core tier from the systems screen; the GPU column is the rate we observed while each model embedded the 30,000-chunk screen corpus on the 4070, including writing vectors out and checkpointing — a real-world rate, not a clean throughput benchmark. Arctic M v1 hasn't had a CUDA pass yet, since its adapter isn't on the native queue, so its screen ran on CPU.

| Model | nDCG@10 | CPU chunks/s (4 cores) | GPU chunks/s (RTX 4070) | Full corpus on CPU | Full corpus on GPU |
|---|---:|---:|---:|---:|---:|
| ModernBERT Embed Large | 0.652 | 1.29 | 25 | ~3 days | ~4 hours |
| Arctic Embed M (v1) | 0.640 | 2.49 | not run | ~39 hours | — |
| Voyage 4 Nano | 0.634 | 2.84 | 41 | ~34 hours | ~2.5 hours |
| Arctic Embed M v2 | 0.632 | 5.34 | 80 | ~18 hours | ~1.2 hours |
| EmbeddingGemma 300M | 0.626 | 2.34 | 66 | ~41 hours | ~1.5 hours |
| Arctic Embed L v2 | 0.625 | 1.87 | 37 | ~52 hours | ~2.6 hours |
| ModernBERT Embed Base | 0.618 | 3.13 | 65 | ~31 hours | ~1.5 hours |
| BGE-M3 (dense) | 0.614 | 1.72 | 40 | ~56 hours | ~2.4 hours |
| Qwen3 Embedding 0.6B | 0.614 | 0.52 | 25 | ~8 days | ~4 hours |
| Mixedbread Embed Large v1 | 0.606 | 1.49 | 46 | ~65 hours | ~2.1 hours |
| **Arctic Embed XS (control)** | **0.573** | **15.96** | **234 (batch 1) / 329 (batch 32)** | **~6 hours** | **~20–25 minutes** |

The point: on four cores, CPU-only, every model in the top ten is a day-plus job to index, and Qwen3 is over a week. On a laptop GPU, all of them finish in an afternoon.

Install cost is worth noting too: the CUDA runtime pack is 1.96 GB, versus 103 MB for the CPU pack.

## TLDR

Arctic XS is the right default for a consumer-grade embedder. For an enterprise-grade system, it makes sense to ship a small/medium/large set of models so that better local hardware gets a better model automatically.

Small models are probably better than their parameter count suggests, and the expensive ones are probably more expensive on a laptop than their benchmark score suggests. A promising path is to use a static-retrieval model to get to a somewhat-usable vector index within a few minutes, while a better model re-indexes in the background over a longer stretch.

Can you convert cloud-based embeddings to embeddings that run on the user's own hardware, and save a potentially massive bill in the process? Yes.
