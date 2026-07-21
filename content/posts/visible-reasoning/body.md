<!--section:three-eras-->

Every technology era has asked people to trust something new — and every era
earned that trust with different machinery.

When machines replaced human work, the question was **reliability**: "did it
perform the task correctly?" Metrics, logs, and audits answered it. When the
internet connected the world, the question became **privacy**: "can anyone
access my data?" Consent systems and encryption answered that one.

Generative AI breaks the pattern, because it doesn't just automate work — it
**reasons**. So the question changed shape: *"can we trust how the system
thinks?"* That question has no established machinery yet. This post is about
building some.

<!--section:reasoning-->

Start with what actually changed. Software used to ship a **response**: you
asked, it answered, and checking the answer was enough. A reasoning system
ships two things — the response *and the reasoning* that produced it.

The observability playbook already covers *what* to capture: the steps, the
calls, the logs. What it doesn't say is *how* the record should be shaped so
that a person reads it and trusts it. A story makes that gap concrete.

<!--section:career-question-->

A student opens a chat and asks, in good faith: *"What career path should I
pursue?"*

Behind the frontend, the backend goes to work. It fetches `schoolData(123)` —
grades, a robotics-fair win, a school-magazine article. It fetches
`socialMedia(123)` — likes, posts, talks. The answer comes back: **"You could
be a great researcher."** Reasonable. Nothing looks broken, because nothing
is broken yet.

<!--section:the-flip-->

Two minutes later, the student asks the exact same question.

This time the backend fetches only `socialMedia(123)`. The school data never
gets called — a timeout, a stale cache, a flaky tool; it hardly matters
which. The answer comes back: **"You could be a leader — maybe President."**

Same student. Same question. Two minutes apart. *"How did my career flip in
two minutes?"*

<!--section:what-went-wrong-->

A developer digs in. Both answers were fluent, confident, and plausible —
read side by side, nothing about the words says which one to trust. The flip
only becomes visible when each answer is linked to the data it actually used:

```
run 1   read schoolData ✓  socialMedia ✓   →  "Researcher"
run 2   read socialMedia ✓                 →  "President"
```

The second answer never saw the school data. That is the entire bug — and
without a recorded link between reasoning and data, no amount of log volume
will hand it to you.

<!--section:connected-logs-->

Now make the setup honest to 2026: the school agent belongs to one
organization, the media agent to another, and an orchestrator sits in front.
Digging through each org's logs separately doesn't just get tedious — the
link you need runs *between* them.

So the thing to build is **connected logs**: one record threading through
every agent, where each step keeps exactly two things — the reasoning, and
the data that step used. That is the observability half. What remains is the
half that actually builds trust: how you *show* it.

<!--section:show-evidence-->

Run the question again with both sources connected, and the answer lands
somewhere honest: **"you could be a robotics scientist."** Better — but an
answer alone still asks for blind trust.

Trust forms at presentation. So present the answer **with its evidence**:
the fair win, the robotics posts, the liked talks, the baseball season. Four
candidates — and immediately a new problem. Which of them actually mattered?
We need to sort.

<!--section:influence-score-->

Take one piece of evidence — the robotics-fair win — and walk its path up
the connected log toward the final answer, one term at a time:

- **Sp** — its similarity to the reasoning step that used it (its parent).
- **Sgp** — its similarity to the step above that (its grandparent).
- **Relevancy** — the average across those ancestors: did it stay on topic?
- **Persistence** — how many ancestors clear a threshold: did it *keep*
  mattering, or spike once?
- **Depth** — how far it sits from the final answer: closer speaks louder.

Normalize, weight, add:

```
influence(d) = w1·relevancy + w2·persistence + w3·depth
```

One number per piece of evidence. And to be plain about what it is: every
term is a similarity proxy, cheap and deterministic — a ranking aid, not a
causal verdict. None of these terms is sacred. This is **one way** to score
influence, not the only way.

<!--section:ranked-->

Now the presentation writes itself. Score every candidate, sort, and show
the top evidence with the answer: the fair win first, the robotics posts
second, the liked talks third — and the baseball season, honestly, near
zero.

The student no longer gets a verdict from a black box. They get an answer
with receipts, ranked by how much each one pushed.

<!--section:its-real-->

This is running today. **agentfootprint** ships the influence score as its
default evidence ranker, and — more to the point — ships the seam that makes
it replaceable: `localizeContextBug({ scorer })` accepts any
`InfluenceScorer`, so a contrastive scorer, a learned one, or yours plugs
into the same rail.

```
import { localizeContextBug } from 'agentfootprint/debug';

await localizeContextBug({ artifacts, embedder }); // default
await localizeContextBug({
  artifacts, embedder,
  scorer: myScorer,         // any InfluenceScorer
});
```

The influence score is a **reference implementation, not the definition**.
The idea this post argues for is *visible reasoning* — connected logs plus
ranked evidence, shown with the answer. The plug-in point is that statement
made executable: the ranking is swappable; showing your work is not.

<!--section:close-->

Three posts, three patterns. The flowchart pattern records **plans** — draw
the system, and the code is the drawing. The trail pattern records
**explorations** — no plan, so the record becomes the map. Visible reasoning
is the *why* of the whole series: the record exists so a person can see how
the system thinks — and decide to trust it.

Observability gives us connected logs. Reasoning gives us something worth
reading. The influence score — one implementation among many — decides what
to show first. Together, that is transparency. And transparency, era after
era, is how machines have always earned our trust.
