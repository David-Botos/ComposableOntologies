---
title: 'Every company needs its own ontology — and they need to compose'
description: >-
  The company brain isn't one model. It's many, composed. Here's the argument,
  starting from a real knowledge graph that collapsed, and where it points.
pubDate: 2026-08-27
kind: essay
tags: ['ontologies', 'knowledge-graphs', 'entity-resolution', 'company-brain']
newsletter: true
buttondownId: 'em_4bkn5x5bvc9frtmwy4fv333ard'
---

There's a dream a lot of smart people are pouring money into right now: the
**company brain**. One system that remembers everything your organization
knows — every ticket, commit, contract, and hallway decision — and lets you
reason across all of it. Ask it anything. It answers with the full context of
the business.

I believe in the dream. I also think most attempts at it are going to hit the
same wall, because they're built on a wrong assumption: that a company's
knowledge can live in one model.

It can't. And I have the wreckage to prove it.

## The monolith that collapsed

I built a real one. A knowledge graph of an entire company's memory — 16,879
nodes on production data. Communications, tickets, commits, pull requests, call
transcripts, the identities tying them together, and the strategic directions
sitting on top. An AI pipeline read raw, unstructured source material and
proposed structured, source-cited claims. A human confirmed each one before
anything was written: `propose → review → mutate`.

For a while it felt like the dream was working. Then I audited the review
queue.

Of 3,507 items waiting for human judgment, **3,084 — 88% — were noise.** Raw,
unclassifiable fragments the extractor coughed up: "screen readers," "the
provided URL." Only about **71** were genuine strategic decisions, and most of
those were already handled. The rare, high-value calls the whole system existed
to surface were buried under a landfill of cheap extraction debris.

The instinct is to blame the prompt. Write a better filter. Use a smarter
model. That instinct is wrong. The failure was **architectural**: one
undifferentiated schema forced support tickets, code changes, and strategy into
the same shape, and a single queue had to serve all of them. High-stakes
strategic judgment and high-volume entity typing have completely different
economics; jamming them into one pipe broke both.

But even the schema was only the symptom. The deeper mistake was that I'd
dictated the whole model myself — one generalist guessing at domains I don't
live in. A good ontology carries nuance only the daily specialist knows: which
records are the same, when a ticket links to a PR, what workflows grow the
graph, how agents should read and write it. That's more than one person can
hold — and there was no tooling to let each specialist own their piece, or to
test-drive the agent side the way you'd test any other code. **Authorship and
tooling, not schema shape, is what actually broke.**

## Why one schema can never be enough

Here's the thing I should have taken seriously earlier: **a company is not one
thing that knows.** It's a dozen experts who each see the world differently.

A support lead's model of the world is tickets, severities, and resolutions. An
engineer's is repositories, services, and commits. A head of strategy's is
bets, capabilities, and partners. Each of these is a faithful, correct picture
of *one corner* of the company. They are not the same picture, and no amount of
schema cleverness collapses them into one without losing what makes each of
them useful.

An **ontology** — and I mean this as plainly as possible — is just a map of
what matters in a given world and how the pieces connect. A chef's map of a
kitchen is nothing like a surgeon's map of an operating room. Both are exact.
Both are right. They're different worlds. Software has spent decades forcing
everyone onto one map. That's the mistake.

## The reframe: compose, don't merge

So the fix isn't a better monolith. It's **separation of concerns for
knowledge itself.**

Give each domain its own ontology, mapped directly to that domain's operational
reality. Let the domain expert — not a central data team — own it end to end:
how their data is sourced, how it's extracted, how entities inside their world
get resolved. Support looks like support. Code looks like code.

Then treat the connections between domains as their own explicit, first-class
thing: a **glue layer.** Not an accident that emerges from a shared schema, but
a deliberate, reviewable definition of how an `Organization` in the support
ontology relates to an `Organization` in the contracts ontology.

The company brain, then, isn't one model. It's **many models, composed.**

## What the glue actually is

This is where it gets interesting, and where I think the real research lives.
Knitting two ontologies together comes in two flavors:

- **Mechanical matching** — the deterministic cases. A shared identifier is a
  hard key; you match on it and you're done. This is well-trodden ground —
  decades of entity-resolution and record-linkage literature to stand on
  instead of reinventing it.
- **Judgment-based resolution** — everything else. When there's no clean key
  and someone (or some model) has to make a call about whether these two things
  are the same thing. This wants a pluggable resolver, customizable per pair of
  ontologies.

And here's the structural insight that makes the whole thing tractable:
**creating a cross-ontology link is the same operation as creating a node
inside one ontology.** Propose it, resolve it (mechanically or by judgment),
confirm it, mutate the graph. The glue layer doesn't need a whole new machine —
it reuses the plumbing that already works.

## Why I think this should be open source

You could build all of this as a closed product. Plenty of startups will. But
infrastructure this foundational — the format for defining an ontology, the
harness for extracting into it, the way to test how agents read and write it,
the layer for gluing domains together — shouldn't belong to one vendor. It's the substrate the entire company-brain
wave is going to be built on, and substrates are public goods.

That's what I want to build: **open-source infrastructure for composable
ontologies.** So that a domain expert anywhere — in a company, a hospital, a
county agency — can model their world well, and knit it to the next one without
being forced to abandon their own view.

## The open questions

None of this is settled, and that's the point of gathering people. The ones I'm
chewing on:

- Is a glue definition fundamentally a *declarative schema* or *executable
  logic*? (I think both — split by mechanical vs. judgment — but the exact
  shape of each isn't nailed down.)
- What should decomposition evals actually score: shape-correctness, or
  precision/recall against a labeled dataset you can compare across versions?
- How do you define the boundary of a "domain" rigorously enough that you don't
  quietly rebuild the monolith one domain at a time?
- Where does the glue-layer design break first?

If any of this resonates — if you're building in this direction, or you're a
domain expert tired of your team's real model living only in people's heads, or
you just want to argue about where I'm wrong — come find the others.

That's what this site is for.
