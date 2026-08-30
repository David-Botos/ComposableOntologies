---
title: 'What language should you define an ontology in?'
description: >-
  GODP/DOL reached furthest but stayed in its research community. OTTR gave up
  power and traveled. CUE, from a different field, may fit the problem best.
pubDate: 2026-08-30
kind: essay
tags: ['ontologies', 'ontology-languages', 'composable-ontologies', 'entity-resolution']
newsletter: false
---

<aside style="margin:0 0 2.4rem;border:1px solid var(--line);border-left:3px solid var(--mint);border-radius:var(--radius);background:var(--bg-panel);padding:1.2rem 1.4rem;">
  <div style="font-family:var(--mono);font-size:0.72rem;letter-spacing:0.08em;text-transform:uppercase;color:var(--mint);margin-bottom:0.7rem;">TL;DR</div>
  <ul style="margin:0;padding-left:1.1rem;font-size:0.96rem;line-height:1.6;">
    <li style="margin-bottom:0.5rem;">Two ontology-language lineages tried to solve this. <strong>GODP/DOL</strong> was the most expressive and built real tooling (Hets, the Ontohub repository), but stayed inside its research community; <strong>OTTR</strong> committed to one substrate, made composition cheap, and got picked up by strangers. In this field, <strong>expressive power and reach were inversely correlated.</strong></li>
    <li style="margin-bottom:0.5rem;"><strong>CUE</strong> — from config validation, a different field entirely — solves the same "many parties, partial constraints, no central authority" problem with unification. Unrelated fields <strong>converge on unification-based composition</strong>; that convergence is the real finding.</li>
    <li style="margin-bottom:0.5rem;"><strong>Merge vs. link</strong> are different operations — "same thing, dedup it" vs. "distinct things, typed edge between them" — and <strong>no single tool does both well.</strong></li>
    <li style="margin-bottom:0;">So the answer isn't one language, it's <strong>three layers</strong>: a schema/constraint layer (define), a graph as relational backbone (relate), and a separate agent/workflow layer (operate) — letting you pay only for the complexity your data demands. This is a <strong>hypothesis to pressure-test</strong>, not a shipped architecture.</li>
  </ul>
</aside>

A support person is staring at a ticket she can't answer without engineering
context she doesn't have. Two floors away, an engineer is trying to remember
*why* a service got rewritten last spring — and the answer is in an email
thread he'll never find. Both of them are blocked on the same thing: the
company knows the answer, but no single person or system can see across the
domains where the pieces live.

You can't fix this by asking people to link everything by hand. At any real
scale, the number of connections between tickets, commits, contracts, and
conversations explodes faster than anyone can maintain them. That — not "graphs
are elegant" — is the honest justification for a knowledge-graph approach: the
linking has to be modeled and partly automated, because humans can't hold it in
their heads.

But here's the reframe that took me a collapsed system to learn: the goal is
**not one schema for the whole company.** It's letting each department own the
model of its own domain, and only *then* asking how those models connect. I
have the wreckage to prove the alternative fails. I built a single-schema
company graph — 16,879 nodes on production data — and when I audited its review
queue, **88% of it was noise**: raw, unclassifiable fragments crowding out the
handful of real decisions the system existed to surface. One shape, forced onto
support and code and strategy at once, broke under its own generality.

So the interesting question isn't "should we model our domains." It's the one I
kept dodging: **what do you actually write an ontology definition in?** This
piece is my current answer, assembled from three research lineages that each
took a run at it. It is a hypothesis, not a verdict — I'll say so again at the
end, and I mean it.

## Two prior attempts, and how each fared

Two lineages tried to build "a language for defining and composing ontologies."
They landed at opposite ends of an uncomfortable trade-off.

**GODP / DOL** is the maximalist. DOL — the Distributed Ontology, Model, and
Specification Language — became an [OMG standard in 2018](https://www.omg.org/spec/DOL/)
after nearly a decade of work in the Ontolog community, and it is genuinely
ambitious: it can relate ontologies written in *different logics*, express
formal mappings between them, and hand proof obligations to a theorem prover.
Built on top of it, [Generic Ontology Design Patterns](https://arxiv.org/abs/1906.08724)
(GODP) add fully typed parameters — patterns whose arguments are type-checked,
"not just macros" — so you can safely reuse an abstract pattern and have the
tooling verify the instantiation is sound. As a piece of engineering it solves
the "safe reuse of an abstract structure" problem about as rigorously as anyone
has.

And it genuinely shipped infrastructure — this isn't vaporware. There's a
running reference stack: the Hets analysis engine, and
[Ontohub](https://github.com/ontohub/ontohub), a git-backed semantic repository
that hosts heterogeneous ontologies and expresses their relationships *in* DOL,
with real repositories published against it. What it never did was cross out of
its originating research community. After all those years there's still no
approachable primer for a working engineer, essentially one lineage of authors,
and no independent reimplementation by people with no connection to the
project. It built a home; not many outsiders moved in. That's the adoption
signal, and it's a quiet one.

**OTTR** — Reasonable Ontology Templates, from the ISWC 2018 line of work — made
the opposite bet. It committed to a single substrate (RDF/OWL), dropped the
cross-logic ambition entirely, and in exchange shipped like a real product: a
[readable primer](https://primer.ottr.xyz/), a [proper specification](https://spec.ottr.xyz/)
split into small documents, a Java reference tool
([Lutra](https://gitlab.com/ottr/lutra/lutra)) — and the tell that it actually
escaped its origin, an [independent Python reimplementation](https://github.com/Callidon/pyOTTR)
by someone with no connection to the original Oslo authors. Less powerful. More
real.

The lesson worth stating plainly: **in this field, expressive power and reach
were inversely correlated.** The lineage that tried to support everything built
serious tooling but stayed inside its own research community. The one that
committed to a single substrate and made composition cheap is the one strangers
picked up and rebuilt. Both shipped; only one traveled.

## A third data point, from the wrong field

Here's where it gets interesting. [CUE](https://cuelang.org) is not an ontology
tool and its authors would not describe it as one. It's a configuration and
data-validation language, used in production for things like Kubernetes config.
But read its [own stated design goal](https://cuelang.org/docs/concept/how-cue-enables-configuration/)
and it's eerily familiar: multiple teams each define their own constraints over
shared data, and the system unifies them — order-independently, with no central
authority deciding whose schema wins. In CUE, types and values live in one
lattice and "constraints unify like any other value." Teams at companies like
[Mercari run it on real Kubernetes fleets](https://engineering.mercari.com/en/blog/entry/20220127-kubernetes-configuration-management-with-cue/)
for exactly this reason.

That's the composable-ontologies problem, arrived at from a completely
unrelated direction. And that convergence — not any single feature — is the
actual finding here: **when independent fields solve "many parties define
partial constraints over shared structure," they converge on unification-based
composition** — not macro-expansion (GODP's mechanism) and not
heterogeneous-logic integration (DOL's). Two teams reached the same shape
without talking to each other. That's the strongest evidence I have that the
shape is right.

## The distinction that decides the architecture

This is the one part I'd ask you to actually keep, because it's the piece you'll
reach for the next time you're designing one of these systems. Two entities can
relate in two fundamentally different ways, and conflating them is where designs
go wrong:

<figure style="margin:1.8rem 0;display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,240px),1fr));gap:1rem;">
  <div style="border:1px solid var(--mint-dim);border-radius:var(--radius);background:rgba(143,230,164,0.05);padding:1.2rem;">
    <div style="font-family:var(--mono);font-size:0.75rem;letter-spacing:0.08em;text-transform:uppercase;color:var(--mint);margin-bottom:0.7rem;">Merge</div>
    <div style="font-family:var(--mono);font-size:1.1rem;color:var(--cream);line-height:1.5;">A&nbsp;●&nbsp;&nbsp;&nbsp;B&nbsp;●&nbsp;&nbsp;→&nbsp;&nbsp;<span style="color:var(--mint);">●</span></div>
    <p style="margin:0.7rem 0 0;font-size:0.9rem;color:var(--cream-dim);">Same thing, one node. Entity resolution / dedup. <strong style="color:var(--cream);">Unification fits.</strong></p>
  </div>
  <div style="border:1px solid var(--line);border-radius:var(--radius);background:rgba(126,199,216,0.05);padding:1.2rem;">
    <div style="font-family:var(--mono);font-size:0.75rem;letter-spacing:0.08em;text-transform:uppercase;color:var(--blue);margin-bottom:0.7rem;">Link</div>
    <div style="font-family:var(--mono);font-size:1.1rem;color:var(--cream);line-height:1.5;">A&nbsp;●&nbsp;<span style="color:var(--blue);">—closes→</span>&nbsp;B&nbsp;●</div>
    <p style="margin:0.7rem 0 0;font-size:0.9rem;color:var(--cream-dim);">Distinct things, typed edge. Stay separate. <strong style="color:var(--cream);">Wants a graph.</strong></p>
  </div>
</figure>

- **Merge** — these two records are *the same thing*. The `acme-corp` in the
  support ontology and the `Acme Corporation` in the contracts ontology are one
  entity; you deduplicate them into a single node. This is entity resolution,
  and unification-style composition (CUE) is a natural fit for it.
- **Link** — these two things *stay distinct* but reference each other. A pull
  request closes a ticket which cites an email. Three separate things, three
  separate domains, joined by typed relations you do **not** want to collapse
  into one record. This wants a first-class edge in a graph.

Say it out loud, because it's the design constraint the rest of the piece has to
resolve: **no single tool in this research does both well.** Not CUE, not OTTR,
not DOL. That's not a gap to paper over — it's the reason the architecture has
to be more than one language.

## The architecture that falls out of it

If merging and linking are different operations, and no one language is good at
both, then the honest move is to stop looking for the one language and instead
split the system into three layers, each doing the single thing it's actually
good at.

<figure style="margin:1.8rem 0;display:grid;gap:0.5rem;">
  <div style="border:1px solid var(--mint-dim);border-left:3px solid var(--mint);border-radius:var(--radius);background:rgba(143,230,164,0.05);padding:1rem 1.2rem;">
    <div style="font-family:var(--mono);font-size:0.72rem;letter-spacing:0.08em;text-transform:uppercase;color:var(--mint);">Layer 1 · Define</div>
    <div style="color:var(--cream);margin-top:0.2rem;">Schema / constraint layer — each domain's shapes, composed by <em>unifying</em> constraints.</div>
  </div>
  <div style="border:1px solid var(--line);border-left:3px solid var(--blue);border-radius:var(--radius);background:rgba(126,199,216,0.05);padding:1rem 1.2rem;">
    <div style="font-family:var(--mono);font-size:0.72rem;letter-spacing:0.08em;text-transform:uppercase;color:var(--blue);">Layer 2 · Relate</div>
    <div style="color:var(--cream);margin-top:0.2rem;">Graph as relational backbone — typed cross-domain <em>links</em>, validated against layer 1, never merged into it.</div>
  </div>
  <div style="border:1px solid rgba(230,181,103,0.4);border-left:3px solid var(--amber);border-radius:var(--radius);background:rgba(230,181,103,0.05);padding:1rem 1.2rem;">
    <div style="font-family:var(--mono);font-size:0.72rem;letter-spacing:0.08em;text-transform:uppercase;color:var(--amber);">Layer 3 · Operate</div>
    <div style="color:var(--cream);margin-top:0.2rem;">Agent / workflow layer — extraction, orchestration, and the rules that grow the graph. Reads and writes the graph; doesn't define what's valid.</div>
  </div>
</figure>

1. **A schema / constraint layer** — each domain defines its own shapes and
   preconditions, and departments compose by *unifying* overlapping constraints
   rather than importing each other's whole schema. This is the merge-friendly
   layer, and it's the one that looks like CUE.
2. **A graph as the relational backbone** — where the *links* between domains
   live as first-class, typed relations, validated against the shapes from layer
   1 but never merged into them. This is the layer that does what CUE can't.
3. **A separate agent / workflow layer** — extraction, orchestration, and the
   rules that grow the graph over time. It reads and writes against the graph
   but is *not* the same system that defines what's valid.

That third split isn't a preference; it's a pattern that shows up in every piece
of prior art here. DOL has Hets. OTTR has Lutra. In both, the language that
*defines* is a different thing from the engine that *executes*. When two
independent research programs both separate definition from execution, that's
the design telling you where the seam goes.

And the practical payoff — the reason an organization could start on Monday
rather than after a two-year modeling project — is that this architecture lets
you **pay only for the complexity your data actually demands.** Begin with a
couple of deterministic rules for entity resolution: a shared ID is a hard key,
match on it, done. Add probabilistic or judgment-based resolution *only* where
your own data forces it. This isn't a novel risk at the resolution layer; it's
already proven ground. Libraries like [Splink](https://github.com/moj-analytical-services/splink)
and [Dedupe](https://github.com/dedupeio/dedupe) are pluggable, incremental
entity-resolution pipelines running at real scale today. You stand on that
literature; you don't reinvent it. It's TDD for ontology-building: start with
the simplest thing that passes, harden where reality pushes back.

## This is a hypothesis, not a conclusion

I want to be honest about what this is. The three-layer split is assembled from
research and one collapsed system's worth of scar tissue — it is not a shipped,
battle-tested architecture, and I haven't committed publicly to the specific
tools that would fill each layer. Naming them now would turn a mission into a
premature product decision.

What I'm confident about is narrower: the merge-vs-link distinction is real, and
the convergence of unrelated fields on unification-based composition is a signal
worth taking seriously. Everything above that is the current best guess.

So this is the ask, not a sign-off: if you've built ontology tooling, done
entity resolution at scale, or spent time inside DOL, OTTR, or CUE and think the
three-layer split breaks somewhere — I want to hear exactly where. This site is
open infrastructure for composable ontologies, meant to be owned and
pressure-tested by the people building in this direction, not a conclusion
you're asked to nod along to. Come find where I'm wrong.
