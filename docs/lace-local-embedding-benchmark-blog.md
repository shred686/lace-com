# We tested 40 embedding models for local search on consumer CPU hardware

Let's face it, we might be at peak token-wasting frenzy. The interesting thing to me about it is that we (me included) are quick to submit to a monetized per-token workflow even where not only is it probably unecessary to use an LLM to do the task, but in same cases (like search) it's actually WORSE in quality and more expensive than using "those old 2020" type solutions. 

If you've watched a coding agent try to find a file on your machine: It lists a directory, greps for a word, opens a couple of things that aren't it, greps for a different word, opens a couple more, and after eight or nine tool calls it does usually gets there. Each of those calls costs tokens, and the whole time it's doing work that a normal hybrid search index would have done in a few milliseconds.

And at scale, millions of documents or pages and horizontally out to hundreds of users, you can literally go broke if you let everyone use agentic search.

The thing is, embeddings themselves aren't free.

BUt I would rather the agent make one call to a search tool and let something that already knows the machine handle it - i.e. an index. Keyword matching, semantic matching, images, eventually audio. And also: stop sending our text off to cloud embedding models. That's the basic idea behind LACE as it applied to the desktop: let the local hardware build the search index and guarantee privacy. But "semantic search" means embeddings, and if the search stays on the device then the embeddings have to be computed on the device too.

So I looked into what embedding models can run effectively on any old laptop.

## Embedding model is absolutely necessary if you want to out-perform agentic search

Keyword search is vital for effective search. But let's say you remember "the receipt from the place in Mexico" when it is filed as "ticket, Guadalajara" or "the screenshot of that error from last week," you will not get there with keyword search. An embedding model gets you from the phrase to the file by turning text into vectors where similar meanings land close together.

But, volume? Our test corpus is 2,651 real documents, 347,618 chunks. On a four-core laptop with 8 GB of RAM, which is the lowest tier we will be testing on, the model choice decides whether that takes hours or days, and it's doing that work while the person is trying to use the computer, so we can't run at anything higher than 10-20% CPU.

Our first builds used Snowflake Arctic Embed XS and you will see why below. It's 22.6M parameters, 384-dimensional output, runs through ONNX Runtime on CPU.

## What we ran

We put together a registry of 40 open-weight embedding families under about 700M parameters. Cloud APIs weren't considered.

The forty covered: the Arctic models, BGE, Qwen3, Nomic, Mixedbread, ModernBERT-based models, E5, Granite, Jina, EmbeddingGemma, Voyage's nano model, a static embedding model, the two BitNet models, and some others. Arctic XS was the control model, since we already new it worked well on the lowest-possible consumer hardware. We weren't trying to find the highest-scoring model. We were trying to find out if any of them was enough better than a 22M model to be worth the extra CPU time, memory, and disk.

## How we scored them

We built our own judged set: 300 queries over those 2,651 documents, graded by humans. The queries are deliberately spread across the things people actually type into a desktop search box, so there's plain English, Spanish and mixed-language, filenames and paths, code and config, filter-style requests, questions with no answer in the corpus, versions of the same document, distractors, PDFs with bad layout, Office and HTML files.

The tldr; this is a VERY HARD dataset.

## Results

nDCG@10 over the 240 development queries, 30,000-chunk screen, exact float32 search, best output dimension per model. The CPU column is chunks per second on the four-core CPU-only tier.

Here are the 18 best resulting options:

| Model | Params | nDCG@10 | vs control | CPU chunks/s | Memory (MB) |
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
| **Arctic Embed XS (control)** | **22.6M** | **0.573** | — | **15.96** | **586** |
| Multilingual E5 Small | 118M | 0.566 | −0.007 | 9.85 | 1,496 |
| Granite 97M Multilingual | 97M | 0.557 | −0.016 | 5.98 | 1,364 |
| Static Retrieval MRL | 31M (static) | 0.510 | −0.063 | 2,051 | 606 |
| MiniLM L6 v2 | 23M | 0.467 | −0.105 | 30.1 | 587 |
| Jina v2 Base Code | 161M | 0.178 | −0.395 | 2.30 | 1,500 |

The models not shown fall between 0.46 and 0.60 or are similar to one of the above

## Conclusions

**Quality costs CPU (which you already know).** ModernBERT Embed Large was the best model we ran. It also does 1.29 chunks a second on four cores where Arctic XS does 15.96, so roughly 12 times the compute, plus 4.4 times the memory and 2.7 times the disk per vector. On the test corpus that works out to something like six hours of indexing for the control and about three days for ModernBERT Large.

**Size (parameter count) doesn't mean much.** The second-best model was Arctic Embed M, 110M parameters, from 2024. It beat more modern Qwen3 Embedding 0.6B, BGE-M3, Multilingual E5 Large, and Arctic L v2, which are all around five times bigger. Snowflake's own newer 305M Arctic M v2 scored slightly under the old 110M one on our queries. We had been using parameter count and leaderboard rank as a rough guide when picking what to test and I don't think we'd do that again.

**The static model is interesting.** static-retrieval-mrl-en-v1 has no transformer layers, so it embedded at just over 2,000 chunks a second on four cores. That's 128 times faster than the control at about the same memory. It loses in quality. But it makes a two-stage index plausible: embed everything with the static model in the first few minutes so the user has something to search, then re-embed with a better model in the background. We haven't built that yet.

**A specialist model, i.e. coding does badly on a general corpus.** Jina's code embedding model scored 0.178 on our mixed corpus, with Recall@10 of 0.223. The corpus has a code slice, but it's mostly ordinary documents, and the model just doesn't handle those.

**The control's real weakness is Spanish.** On the Spanish and mixed-language slice Arctic XS scores 0.72. Almost every multilingual model scores 1.0. Multilingual E5 Small is interesting here because it ties the control overall at 9.85 chunks a second.

One more thing: truncating Matryoshka models to 256 dimensions saved 75% of vector storage, cost between 0.015 and 0.06 in score, and did not change embedding speed at all. The model still runs every layer. Nomic at 256d is still a 137M model. But it does really save storage space.

## With a GPU

Everything above is CPU because we can't predict everyone's hardware. As you expect, with a GPU everything is differnet.

We ran the control model through three execution providers on the same Windows machine, a Ryzen 9 8945HS with an RTX 4070 (8 GB). CPU ONNX on 16 threads did 31.4 chunks a second at batch size one. CUDA did 233.7 at batch one and 329.1 at batch 32, which is 26 times the CPU number at that batch size.

Larger models gain more from the GPU than the small one does. Here are the top ten from the results table with both numbers. The CPU column is the four-core tier from the systems screen. The GPU column is the rate we observed while each model embedded the 30,000-chunk screen corpus on the 4070, which includes writing the vectors out and checkpointing, so it's a real-world rate rather than a clean throughput benchmark. Arctic M v1 hasn't had a CUDA pass yet because its adapter isn't on the native queue, so its screen ran on CPU.

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

The point: on four cores and CPU-only, every model in the top ten is a day-plus job to index and Qwen3 is over a week. On the laptop GPU all of them finish in an afternoon.

Install side cost: CUDA runtime pack is 1.96 GB. The CPU pack is 103 MB.

## TLDR

Arctic XS makes the most sense as the consumer grade embedder. If you are making this an enterprise-grade system, it would make sense to ship a small-medium-large set of models son that better local hardware gets better models.

Small models are probably better than their parameter count suggests, and the expensive one is probably more expensive on a laptop than its benchmark score suggests. A very interesting path would be to use the static retrieval paths to get to somewhat-usable vector indexes within a few minutes, while running the rest of the index over a longer stretch.

All-in-all, can you can convert your cloud-based embeddings to user's running embeddings on their own hardware and save a potentially massive bill? Yes.
