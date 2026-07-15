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

But these footprints don't trace a drawn diagram. There's no chart for them to land on.

<!--section:the-trail-->

They form something else: a **trail**. The record *is* the map — drawn by walking, not drawn in
advance.

One footprint is one mark on the ground. A **foottrail** is the branching record of everywhere you
went — including where you stood before you changed your mind.

<!--section:the-fork-->

Because you do change your mind. You walk back to a mid-trail footprint and step a different way.
Here's the rule that makes the record trustworthy: the trail doesn't erase — it **branches**.

Both futures truly exist. Like an accountant's book, nothing is ever crossed out; a correction is a
new entry. History is never rewritten.

<!--section:time-travel-->

A branching record makes an old dream mundane: **time travel**. Stand at any footprint on any
branch, and the dashboard rebuilds exactly what you saw there — the same filters, the same charts,
the same rows.

Lanes get names, git-style: work normally and you're on `main`; travel back and act, and a new path
names itself from your stated intent. Checkpoints are just trail markers you can walk back to.

<!--section:two-walkers-->

Here's where it gets interesting: a human and an AI agent can walk the **same trail**. Every mark
records who made it — your click and the agent's test land in the same book, each one signed.

So you can ask the agent, "compare my two paths," and it doesn't guess. It reads the trail and
narrates the real difference — which filters changed, which analyses exist on only one side, with
real row counts for each.

<!--section:honesty-->

The trail is also honest about a subtle thing: **looking is not claiming**. Zooming, panning, and
rearranging charts are recorded as views — they never filter the data, because a viewport is not a
data claim. Filters and statistical tests are recorded as claims, because they are.

And the statistics ledger is stricter than you are. Run a test on a branch, then abandon the
branch? The alpha you spent stays spent. The ledger never refunds it.

<!--section:pattern-pair-->

Step back and there are two patterns, side by side. **Plans leave flowcharts**: one walk of a
drawing that existed first, so the log is a line — an array. **Explorations leave trails**: a walk
with no drawing, so the log is a tree — the map, drawn by walking.

Two core patterns, one ecosystem. Same footprints, different ground.

<!--section:its-real-->

This isn't a thought experiment. **vizfootprint** is the trail pattern running today: a cockpit of
five linked charts, an agent co-driving on the same record, and git-style paths over your whole
analysis history — compare them, switch between them, bring one step over.

The trail core has a name of its own — **foottrail** — and a rule: it becomes its own package the
day a second app walks it.

<!--section:close-->

The first post opened on a whiteboard, because for programs, the whiteboard was the map.

Explorations never had one. Now they do — it's just drawn the other way around: not before you go,
but **as you walk**.
