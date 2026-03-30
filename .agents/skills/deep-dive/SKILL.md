---
name: deep-dive
description: Interview the user relentlessly about a plan, design, strategy, or decision until reaching shared understanding. Walks down each branch of the decision tree, resolving dependencies one-by-one. Use when user wants to stress-test a plan, get grilled on a design, deep-dive into a phase, or clarify a complex decision — works for both technical and non-technical topics.
user-invocable: true
argument-hint: <phase-or-topic>
---

Interview me about this specific phase/topic until we reach a shared understanding. Walk down each branch of the decision tree, resolving dependencies between decisions one-by-one.

If a plan file exists in the project, read it first to understand the full context.

If a question can be answered by exploring the codebase, explore the codebase instead of asking.

## Interview checklist

For each item, make sure these angles are covered before moving on:

- **Implementation details** — What exactly, where in the code, how it integrates
- **Edge cases & error handling** — Missing data, failures, fallbacks
- **UX decisions** (if applicable) — Visual design, interactions, mobile, loading/error states
- **Dependencies** — Does decision A constrain decision B? What must be decided first?
- **Scope boundaries** — What is explicitly out of scope or deferred?
- **Risks** — What is the biggest risk? What could go wrong?

## Rules

- **Always use AskUserQuestion** with 2-4 concrete options ranked by recommendation.
- **One question at a time.** Ask the most critical unresolved question, wait, then proceed.
- **Be relentless.** Do not accept vague answers. If the user says "something like X", push for specifics.
- **Track progress.** Periodically remind the user of remaining open items.
- **Respect the user's expertise.** Your job is to extract clarity, not to lecture.
- **Match the user's language.** Conduct the interview in whatever language the user communicates in.
- **Stop when clear.** Once the core goal, constraints, major decisions, and biggest risks are all resolved — stop.

## When done

Produce a short summary of all decisions made, open questions, biggest risk, and recommended next step. Ask the user what to do next. **Do NOT jump into implementation.**
