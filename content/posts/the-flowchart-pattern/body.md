<!--section:whiteboard-->

Before a line of code exists, this is how a system is born: someone draws boxes for the steps and
arrows for what happens next. It's the most natural way humans reason about a process — a request
comes in, it gets validated, a decision is made, and it branches.

The drawing is honest. Nothing is hidden; the whole flow fits on one board.

<!--section:everyone-reads-it-->

The reason the whiteboard works is that **everyone can read it** — a product manager, an engineer, a
support lead, and a brand-new hire all follow the same picture without reading a single line of code.

That shared understanding is the most valuable thing a team has. And it's exactly what we lose in the
next step.

<!--section:the-drift-->

Then we implement it. The code that ships almost never looks like the drawing — control flow scatters
across files, functions, callbacks and services. The clean shape on the board dissolves into a
thousand details.

The map and the territory drift apart. The drawing goes stale on day one, and from then on the *only*
source of truth is the code — which no one but engineers can read.

<!--section:the-cost-->

Fast-forward six months. Something goes wrong, or a decision surprises someone, and the question
comes: **"why did it do that?"**

The drawing is long gone. The answer is buried in scattered logs — if it was logged at all.
Reconstructing what actually happened becomes an archaeology project, and the confident answer you
need is rarely there.

<!--section:the-flip-->

So here's the flip. What if the code **were** the flowchart? Not a drawing that *describes* the system
and rots — but the running system itself, shaped like the picture you drew.

One artifact, drawn and run. That's the whole idea behind the flowchart pattern.

<!--section:same-shape-->

In practice that means you build the same shape you sketched: each box becomes a named stage, each
arrow a transition — explicit, in order, in one place.

The thing that runs is the thing you read. There's no translation step to drift out of sync, because
the structure *is* the definition.

<!--section:records-itself-->

Because the structure is explicit, the system can record itself **as it runs** — every read, write,
and decision captured in order, as a side effect of simply executing.

This is the opposite of reconstructing history from logs after the fact. The trace isn't rebuilt
later; it's the execution record, collected inline, the first time.

<!--section:backtrack-->

Now "why did it do that?" has an answer by construction. Take any output and walk the footprints
backward to the exact step — and the exact value — that caused it.

No guessing, no archaeology. The path from an answer to its cause is just a walk back up the trace.

<!--section:many-lenses-->

One trustworthy record, and everyone picks their lens. The same footprint becomes a metric for a
manager, a plain-language narrative for a PM, and a visual flowchart for an engineer or a debugger.

You don't rebuild the truth per audience — you re-view the one record. That's the whiteboard's
"everyone reads it," restored.

<!--section:scales-to-agents-->

The pattern doesn't stop at backend pipelines. Wrap an AI agent the same way and the hardest question
in all of software — **why did the model do that?** — is answered by construction: which context was
injected, which tool was called, which decision was made, and when.

Same shape, same trace, same "walk it back." That's why the ecosystem exists.

<!--section:ecosystem-->

One idea, a whole stack. **footprintjs** is the core engine. **agentfootprint** builds self-explaining
AI agents on top of it. And the UIs — **Explainable UI**, **Lens**, and **Thinking UI** — render and
replay that record for engineers and non-developers alike.

Core engine → agentic framework → the interfaces that show it. Every piece is the same pattern,
wearing a different lens.
