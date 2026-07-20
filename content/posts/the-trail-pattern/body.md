<!--section:recap-->

Last time we told the story of the flowchart pattern: you draw the system, the code **is** the
drawing, and every run records itself as it goes. "Why did it do that?" became a question with an
answer by construction.

But that story had a hidden assumption tucked inside it. Someone drew a plan first. The record was
honest because there was a drawing to walk.

<!--section:no-plan-->

Now picture an analyst opening a dashboard. There is no flowchart. There never was one. They click
on a bar, brush a range, stare, back up, and try something else — that isn't a plan being executed,
that's **exploration**.

So where does the honest record go when nothing was drawn in advance?

<!--section:footprints-->

The first half of the answer doesn't change. Each gesture still leaves a **footprint** — a small
commit that records *who asked* and *what was computed*. Brush a price range and the record says:
you requested it, the system computed it, 214 rows survived.

"A small commit" is doing a lot of work in that sentence. Before going any further, let's put one
on the table.

<!--section:one-footprint-->

This is the entire footprint for clicking the *Formal* bar. Not a sketch of it — the whole thing:

```
{ id: "s4", parent: "s3",          ← the tree lives in this one field
  key: "selection:bar",
  value: { field: "category", value: "Formal" },  ← a RECIPE, not a snapshot
  cause: { requestedBy: "user", intent: "clicked the Formal bar" } }
```

Four fields. `value` is a **recipe**, not a snapshot — it records the claim *"the bar selection is
Formal"*, never the 214 rows that resulted. `cause` says who asked and why. `parent` says which
step it came after.

Note what's absent: **no state**. Just who claimed what, after which step.

<!--section:the-trail-->

That little `parent` field is the whole architecture. Every footprint names the one before it, so
the marks chain into a **trail** — the branching record of everywhere you went, including where you
stood before you changed your mind.

Nothing here was drawn in advance. The record *is* the map — drawn by walking. And the map has
exactly one moving part: the **cursor**, the footprint you are currently standing on.

Which leaves an obvious question. If no footprint stores state — where did the dashboard's state go?

<!--section:the-fold-->

It's computed, every time, by a fold along the path from the root to wherever you stand:

```
state = {};
for (step of pathFromRootTo(cursor))
  state[step.key] = step.value;   // last wins
```

Walk it for real. Say `s1` brushed the scatter to 40–200, `s2` selected the *Formal* bar, `s3`
narrowed the brush to 150–200:

```
fold to s3  →  { scatter: 150–200, bar: Formal }
fold to s2  →  { scatter: 40–200,  bar: Formal }
```

That second line **is** time travel. There is no undo machinery anywhere — standing at `s2` just
means folding less.

<!--section:the-fork-->

Time travel invites mischief: walk back to `s2` and *act*. What happens?

Here's the part that surprised me: the trail never decides. There is no branch logic, no decider —
the only decision state is **where you're standing**. A new step's parent is simply your feet.
Stand at the tip and act: the branch grows. Stand in the past and act: the fork exists the moment
you act — and nothing was erased, because the old future is still there, hanging off the same
parent. Like an accountant's book: a correction is a new entry, never a crossed-out one.

Flowcharts have deciders because branches are futures to pick. Trails have only a cursor, because
branches are **pasts that already happened**.

<!--section:lanes-->

Branches multiply, so they get names — git-style. Work normally and you're on `main`; travel back
and act, and the new lane names itself from your stated intent: `premium-focus`. Checkpoints are
just trail markers you can walk back to.

And standing *anywhere* on *any* lane rebuilds the dashboard exactly as it was — same filters, same
charts, same 214 rows. It's the same fold from the last section, run along a different path.

Everything so far — the rebuild, the fork, the time travel — falls out of one architectural
decision that's easy to miss. It was the last piece to click for me, so let's slow down for it.

<!--section:inversion-->

Every interactive dashboard you've used is built on an event bus:

```
click → mutate the crossfilter → emit "change" → listeners redraw
```

The filter is the source of truth; history, if it exists at all, is a bolted-on side-effect
watching the changes go by — and it can drift. The trail runs the same wire **backwards**:

```
click → append to the log → notify "the log moved"
      → re-derive the filter from the fold — fresh, every time
```

In an event bus, the click updates the filter and history watches. In a trail, **the click updates
history and the filter is watching.** That one inversion buys three things for free: the record can
never desync from the dashboard, because the dashboard is *derived* from the record; replay and
time travel are just folding to an older step, a consequence rather than a feature; and there are
no feedback loops, because a re-render is a read — only a hand or an agent can write.

<!--section:two-walkers-->

Only a hand or an agent can write — and both do. A human and an AI agent walk the **same trail**,
and when the agent brushes a range, the pipeline is identical to when you do: same append, same
fold, same redraw. The *only* difference is one field — `requestedBy: "agent"` instead of
`"user"`. That single field is why one mark renders amber and one blue.

So you can ask the agent, "compare my two paths," and it doesn't guess. It reads the trail and
narrates the real difference — which filters changed, which analyses exist on only one side, with
real row counts for each.

<!--section:honesty-->

Two walkers writing to one record raises the stakes for what a mark is allowed to *mean*. So the
trail is strict about a subtle thing: **looking is not claiming**. Zooming, panning, and
rearranging charts are recorded as views — they never filter the data, because a viewport is not a
data claim. Filters and statistical tests are recorded as claims, because they are.

And the statistics ledger is stricter than you are. Run a test on a branch, then abandon the
branch? The alpha you spent stays spent. The ledger never refunds it.

<!--section:consumer-->

By now this might sound like a lot of machinery to hold in your head. Here's the part that makes it
practical: you hold none of it. This is the whole consumer view —

```
const dashboard = buildDashboard(def);  // the charts, declared once
const session   = dashboard.createSession();  // one live trail
const view      = createSessionView(sessionSource(session));

function PriceChart() {
  const state = useSessionView(view);  // re-renders as the log moves
  return <Scatter {...chartProps(state)} />;
}
```

No `onLog` handler, no fold call, no redraw wiring — anywhere. Everything this post walked through
is the engine diagram; this is the car.

<!--section:pattern-pair-->

Step back and there are two patterns, side by side. **Plans leave flowcharts**: one walk of a
drawing that existed first, so the log is a line — an array. **Explorations leave trails**: a walk
with no drawing, so the log is a tree — the map, drawn by walking.

Two core patterns, one ecosystem. Same footprints, different ground.

<!--section:its-real-->

This isn't a thought experiment. **vizfootprint** is the trail pattern running today: a cockpit of
five linked charts, an agent co-driving on the same record, and git-style paths over your whole
analysis history — compare them, switch between them, bring one step over. The trail core has a
name of its own — **foottrail** — and a rule: it becomes its own package the day a second app
walks it.

And it stands on named shoulders, honestly: the version tree is a fully-persistent tree (Driscoll
et al., 1989); the parent pointer is git's; the fold is event sourcing's; the branching undo is the
Vim/Emacs undo-tree tradition (Berlage, 1994); keep-every-version analysis is VisTrails' and
Trrack's. Known bones — what's new is **who**: mixed-principal causes, honest rejection, and a
statistics ledger riding the tree.

<!--section:close-->

The first post opened on a whiteboard, because for programs, the whiteboard was the map.

Explorations never had one. Now they do — it's just drawn the other way around: not before you go,
but **as you walk**.
