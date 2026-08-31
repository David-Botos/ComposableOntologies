---
title: 'What language should you define an ontology in?'
description: >-
  GODP/DOL is the most powerful and rigorous. OTTR gave up scope and reached
  more people. CUE, from a different field, may fit the problem best.
pubDate: 2026-08-30
kind: essay
tags: ['ontologies', 'ontology-languages', 'composable-ontologies', 'entity-resolution']
newsletter: true
buttondownId: 'em_178hsw5x9g82xtat20rqsjzvgs'
---

<aside style="margin:0 0 2.4rem;border:1px solid var(--line);border-left:3px solid var(--mint);border-radius:var(--radius);background:var(--bg-panel);padding:1.2rem 1.4rem;">
  <div style="font-family:var(--mono);font-size:0.72rem;letter-spacing:0.08em;text-transform:uppercase;color:var(--mint);margin-bottom:0.7rem;">TL;DR</div>
  <ul style="margin:0;padding-left:1.1rem;font-size:0.96rem;line-height:1.6;color:var(--cream-dim);">
    <li style="margin-bottom:0.5rem;"><strong>GODP/DOL</strong> is the most powerful and rigorous, with real tooling behind it (Hets, the Ontohub repository); <strong>OTTR</strong> narrowed scope, made composition cheap, and reached more people. Expressive power and reach have pulled in opposite directions — a fact about adoption, not the ideas.</li>
    <li style="margin-bottom:0.5rem;"><strong>CUE</strong>, from config validation entirely, solves the same "many parties, partial constraints, no central authority" problem with unification. Unrelated fields <strong>converge on unification-based composition</strong> — that convergence is the real finding.</li>
    <li style="margin-bottom:0.5rem;"><strong>Merge vs. link</strong> are different operations — "same thing, dedup it" vs. "distinct things, typed edge" — and <strong>no single tool does both well.</strong></li>
    <li style="margin-bottom:0;">So the answer isn't one language, it's <strong>three layers</strong>: schema/constraint (define), a graph as backbone (relate), and a separate agent/workflow layer (operate). That's the shape I'd build on — and what composable ontologies is building toward.</li>
  </ul>
</aside>

A support rep can't answer a ticket without engineering context she doesn't
have. Two floors away, an engineer can't remember why a service got rewritten
last spring — the answer's in an email thread he'll never find. The company
knows; no single person or system can see across the domains where the pieces
live.

You can't fix that by hand. At scale, the connections between tickets, commits,
contracts, and conversations explode faster than anyone can maintain them — which
is the real case for a knowledge graph: the linking has to be modeled and partly
automated, because no one can hold it all in their head.

But the fix isn't one schema dictated top-down by the C-suite or a central data
team that's never done the work. It's the reverse — let the people who live in
each domain, ontology experts or not, model their own corner in a form they can
read and reason about, and only *then* ask how those models connect. Force
support, code, and strategy into one shared shape instead and it collapses under
its own generality; the decisions that matter drown in noise. Plenty of teams
have lived that.

And the schema is only the symptom. A good ontology — its shapes, its
entity-resolution rules, the workflows that grow it, how agents read and write
it — is more nuance than one generalist can hold and more work than one person
can do. Only the specialist who works with a domain's data every day knows which
records are the same, or when a ticket should link to a PR. So the gap isn't
schema shape; it's **authorship and tooling** — and the tooling to let each
specialist define their model and test-drive the agent side doesn't exist yet.

Which leaves a narrower question: **what do you actually write an ontology
definition in?** Three research lineages took a run at it. Here's the answer, and
what to take away even if you never read the research.

## Two attempts, opposite outcomes

**GODP / DOL** is the maximalist. DOL became an [OMG standard in 2018](https://www.omg.org/spec/DOL/)
after a decade of work: it relates ontologies written in *different logics*,
expresses formal mappings between them, and discharges proof obligations to a
theorem prover. [Generic Ontology Design Patterns](https://arxiv.org/abs/1906.08724)
add fully typed, checkable parameters on top. It's rigorous, serious work — with
a running stack (the Hets engine plus the git-backed
[Ontohub](https://github.com/ontohub/ontohub) repository), not vaporware. What it
never got was reach: no approachable on-ramp for a working engineer, and it
stayed inside the research community. That last mile — "rigorously defined" to
"in a developer's hands" — is exactly the gap, and it's harder than the formal
work, not easier.

**OTTR** made the opposite bet: one substrate (RDF/OWL), no cross-logic ambition,
and in exchange it shipped like a product — a [primer](https://primer.ottr.xyz/),
a [spec](https://spec.ottr.xyz/), a reference tool
([Lutra](https://gitlab.com/ottr/lutra/lutra)), and the real tell: an
[independent Python reimplementation](https://github.com/Callidon/pyOTTR) by
someone with no connection to the original authors. Less powerful, more adopted.

The lesson: **expressive power and reach have pulled in opposite directions.**
Both shipped real systems; they differ only in how far each has traveled — a fact
about adoption, not about the quality of the ideas.

## A third clue, from the wrong field

[CUE](https://cuelang.org) isn't an ontology tool — it's a config and
data-validation language, used in production for things like Kubernetes. But its
[stated design goal](https://cuelang.org/docs/concept/how-cue-enables-configuration/)
is eerily familiar: many teams each define their own constraints over shared
data, and the system *unifies* them — order-independently, no central authority
deciding whose schema wins. That's the composable-ontologies problem, reached
from a completely unrelated direction.

And that convergence is the finding: **when independent fields solve "many
parties, partial constraints, shared structure," they land on unification** — not
GODP's macro-expansion, not DOL's heterogeneous-logic integration. Two fields,
the same shape, no contact. That's the strongest evidence the shape is right.

## The distinction that decides everything

Keep this one — it's what you'll reach for the next time you design one of these
systems. Two things can relate in two fundamentally different ways, and
conflating them is where designs break:

<figure style="margin:1.8rem 0;display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,240px),1fr));gap:1rem;">
  <div style="border:1px solid var(--mint-dim);border-radius:var(--radius);background:var(--bg-panel);padding:1.2rem;">
    <div style="font-family:var(--mono);font-size:0.75rem;letter-spacing:0.08em;text-transform:uppercase;color:var(--mint);margin-bottom:0.7rem;">Merge</div>
    <div style="font-family:var(--mono);font-size:1.1rem;color:var(--cream);line-height:1.5;">A&nbsp;●&nbsp;&nbsp;&nbsp;B&nbsp;●&nbsp;&nbsp;→&nbsp;&nbsp;<span style="color:var(--mint);">●</span></div>
    <p style="margin:0.7rem 0 0;font-size:0.9rem;color:var(--cream-dim);">Same thing, one node. Entity resolution / dedup. <strong style="color:var(--cream);">Unification fits.</strong></p>
  </div>
  <div style="border:1px solid var(--line);border-radius:var(--radius);background:var(--bg-panel);padding:1.2rem;">
    <div style="font-family:var(--mono);font-size:0.75rem;letter-spacing:0.08em;text-transform:uppercase;color:var(--blue);margin-bottom:0.7rem;">Link</div>
    <div style="font-family:var(--mono);font-size:1.1rem;color:var(--cream);line-height:1.5;">A&nbsp;●&nbsp;<span style="color:var(--blue);">—closes→</span>&nbsp;B&nbsp;●</div>
    <p style="margin:0.7rem 0 0;font-size:0.9rem;color:var(--cream-dim);">Distinct things, typed edge. Stay separate. <strong style="color:var(--cream);">Wants a graph.</strong></p>
  </div>
</figure>

**Merge**: `acme-corp` in the support ontology and `Acme Corporation` in
contracts are one entity — you dedup them into a single node, and
unification-style composition (CUE) fits. **Link**: a PR closes a ticket that
cites an email — three distinct things in three domains, joined by typed edges
you must *not* collapse into one record. That wants a first-class edge in a
graph. And **no single tool does both well** — not CUE, not OTTR, not DOL. That's
not a gap to paper over; it's why the architecture has to be more than one
language.

## The architecture that falls out of it

Stop hunting for the one language. Split the system into three layers, each doing
the single thing it's good at:

<figure style="margin:1.8rem 0;display:grid;gap:0.5rem;">
  <div style="border:1px solid var(--mint-dim);border-left:3px solid var(--mint);border-radius:var(--radius);background:var(--bg-panel);padding:1rem 1.2rem;">
    <div style="font-family:var(--mono);font-size:0.72rem;letter-spacing:0.08em;text-transform:uppercase;color:var(--mint);">Layer 1 · Define</div>
    <div style="color:var(--cream);margin-top:0.2rem;">Schema / constraint layer — each domain's shapes, composed by <em>unifying</em> constraints.</div>
  </div>
  <div style="border:1px solid var(--line);border-left:3px solid var(--blue);border-radius:var(--radius);background:var(--bg-panel);padding:1rem 1.2rem;">
    <div style="font-family:var(--mono);font-size:0.72rem;letter-spacing:0.08em;text-transform:uppercase;color:var(--blue);">Layer 2 · Relate</div>
    <div style="color:var(--cream);margin-top:0.2rem;">Graph as relational backbone — typed cross-domain <em>links</em>, validated against layer 1, never merged into it.</div>
  </div>
  <div style="border:1px solid rgba(230,181,103,0.4);border-left:3px solid var(--amber);border-radius:var(--radius);background:var(--bg-panel);padding:1rem 1.2rem;">
    <div style="font-family:var(--mono);font-size:0.72rem;letter-spacing:0.08em;text-transform:uppercase;color:var(--amber);">Layer 3 · Operate</div>
    <div style="color:var(--cream);margin-top:0.2rem;">Agent / workflow layer — extraction, orchestration, and the rules that grow the graph. Reads and writes the graph; doesn't define what's valid.</div>
  </div>
</figure>

That define/execute split isn't a preference — it shows up in every piece of
prior art here. DOL has Hets. OTTR has Lutra. When independent research programs
all separate the language that *defines* from the engine that *executes*, that's
the design telling you where the seam goes.

The payoff is that you start small. Begin with a couple of deterministic
entity-resolution rules — a shared ID is a hard key, done — and add probabilistic
or judgment-based resolution only where your own data forces it. That's proven
ground: [Splink](https://github.com/moj-analytical-services/splink) and
[Dedupe](https://github.com/dedupeio/dedupe) run incremental resolution at real
scale today. The same test-first discipline should extend to the agent layer —
define the model, then develop how agents read and write against it like any
other code: write the check, watch it fail, make it pass. That's the part almost
no tooling supports yet, and much of what this project is building.

## The takeaway

Two things to carry out of this: **merge and link are different operations, and
you need both**, and **the answer isn't one language — it's three layers**
(define, relate, operate). Get those right and you can start with almost nothing
and add complexity only where your data demands it.

If you're building AI on your own data, that's the shape: model your world one
domain at a time, in a form your own people can read; connect domains without
collapsing them; develop the agent side test-first. No boiling the ocean, and no
renting your own data back from a vendor.

This is one piece of a larger map. Composable ontologies is the effort to build
the part that doesn't exist yet — the tooling that lets a domain's own specialist
author their model and workflows and test how agents use them. The OntoIOp
researchers named the target a decade ago — heterogeneity, modularity, links,
annotation — and did the rigorous work. Carrying it out of the lab and into
working hands is the job now, and what I'm building toward.

**Worked in this space?** Built ontology tooling, resolved entities at scale, or
spent real time in DOL, OTTR, CUE, or OntoIOp — and something here landed, or made
you think *that's wrong, and here's why*? Tell me what you know. That's how the
map gets drawn faster.
