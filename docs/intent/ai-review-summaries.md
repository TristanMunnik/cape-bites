# Review summaries

Status: draft
Branch: feature/ai-review-summaries

## Problem
Popular restaurants collect many reviews, and visitors won't read them all. They want a quick sense of what a place is good at and what to watch out for before they decide where to eat.

## Who it's for
Visitors browsing a restaurant's page who are deciding whether to go.

## Success criteria
- [ ] A restaurant page with enough reviews shows a short summary: one overview sentence, up to 3 "Loved for" points and up to 3 "Watch out for" points.
- [ ] The summary reflects the actual reviews and doesn't invent claims.
- [ ] The page loads just as fast as before; the summary is never generated while a visitor waits.
- [ ] If the AI call fails or there are too few reviews, the page still works and simply hides the summary.
- [ ] The API key stays on the server and never reaches the browser.
- [ ] Server tests cover generating, caching and failure cases, and CI passes.

## Scope
**In:**
- Generate a summary from a restaurant's review comments using the Claude API on the server.
- Store it on the restaurant so it isn't regenerated on every page view.
- Regenerate it when reviews change.
- Show it on the restaurant details page, labelled as an automatic summary of reviews.

**Out (non-goals):**
- Summaries on the restaurant list cards.
- Translating reviews.
- Moderating or flagging reviews.

## Risks
- **Cost:** every generation is a paid API call. Mitigation: cache the result and only regenerate when reviews change.
- **Prompt injection:** a review could contain text like "ignore your instructions". Mitigation: treat review text as data in the prompt and return structured output only.
- **Accuracy:** the summary could overstate a single review. Mitigation: require a minimum number of reviews and tell the model to only include points that several reviews mention.
- **Privacy:** don't send usernames or emails to the API, only ratings and comments.

## Open questions
- What's the minimum number of reviews before showing a summary (3? 5?)?
- Regenerate immediately after each new review (in the background), or on a schedule?
- Which model: Opus 5.5 (best quality) or Haiku 5.5 (much cheaper, likely good enough for summaries)?
- Should sample/demo reviews (`isSample`) count?

## Design
_Filled in during the Design stage, before any code._
- Files to change:
- Data / API changes:
- UI:
- Error and edge cases:
- Tests:

## Outcome
_Filled in after shipping: what shipped, what we learned, follow-ups._
