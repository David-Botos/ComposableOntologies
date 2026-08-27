---
title: 'Digest #000 — how this works (and three things worth your time)'
description: >-
  What the monthly graph-data digest is, and a first small batch: probabilistic
  record linkage, a classic dedupe library, and the vocabulary everyone quietly
  reuses.
pubDate: 2026-08-20
kind: digest
tags: ['digest', 'entity-resolution', 'reading']
newsletter: true
buttondownId: 'em_5d05yq2e398h09bgny7zkj4pyg'
---

Welcome to the digest. Once a month I send out the most interesting things I've
been reading about graph data, ontologies, and entity resolution — each with a
short note on *why it matters* for building composable ontologies. Not a link
dump. A digest: read, filtered, and argued with.

This is issue zero, so it's short. It also doubles as the template — every
future issue looks like this.

> **The format:** three to five items, each with a one-line "what it is" and a
> longer "why it matters to us." Occasionally a longer riff at the end.

---

## 1. Probabilistic record linkage, done seriously

**What it is:** Splink is an open-source library for linking records across
datasets at scale using probabilistic matching (Fellegi–Sunter under the hood),
built by the UK Ministry of Justice's data team.
[github.com/moj-analytical-services/splink](https://github.com/moj-analytical-services/splink)

**Why it matters to us:** This is exactly the *mechanical matching* half of the
glue layer, already battle-tested on government-scale data. When we talk about
"deterministic and probabilistic entity resolution across two ontologies,"
Splink is a reference implementation of the probabilistic end — and a reminder
that we should stand on this literature rather than reinvent it.

## 2. The classic you should read even if you don't use it

**What it is:** `dedupe`, a long-running Python library for fuzzy matching,
deduplication, and entity resolution using active learning.
[github.com/dedupeio/dedupe](https://github.com/dedupeio/dedupe)

**Why it matters to us:** The *active learning* framing is the interesting
part. It asks a human to label the genuinely ambiguous pairs and learns from
them — which is structurally the same idea as our human-gated
`propose → resolve → confirm` loop, applied to entity resolution specifically.
Good prior art for how the judgment-based resolver should ask for help.

## 3. The vocabulary everyone quietly reuses

**What it is:** schema.org — the shared, extensible vocabulary of types and
relationships that quietly underpins a huge fraction of structured data on the
web. [schema.org](https://schema.org)

**Why it matters to us:** When we say an ontology can be "pulled from an
off-the-shelf standard or built custom," schema.org is the canonical
off-the-shelf. Worth studying not because you'll adopt it wholesale, but for
how it handles extension and overlap — the exact problems the glue layer has to
solve.

---

That's it for issue zero. If you have something I should read next month — a
paper, a repo, a post — reply to the email or find me in the community. Half the
point of doing this in public is that your reading list is better than mine.
