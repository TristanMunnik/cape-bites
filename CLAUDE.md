# Cape Bites

Full-stack directory of Asian restaurants in Cape Town: browse on a list or map, filter by cuisine, sign in, and leave star ratings and reviews.

## Stack
- `client/`: React 19 + Vite, plain CSS, Mapbox GL. ES modules, no semicolons, 4-space indent.
- `server/`: Express 5 + Mongoose (MongoDB Atlas), session auth with `express-session` + `connect-mongo`. CommonJS, semicolons, single quotes, 4-space indent.
- CI: GitHub Actions runs server tests and client lint + build on every push and PR to main.

## Commands
- Server tests: `cd server && npm test` (Node's built-in `node:test`, no database needed)
- Server dev: `cd server && npm run dev`
- Client lint / build / dev: `cd client && npm run lint`, `npm run build`, `npm run dev`

## Architecture and patterns
- `server/app.js` exports `createApp({ sessionStore, ...models })`. Routers are factories that take their models, e.g. `createReviewsRouter({ Restaurant, Review })`. This dependency injection is what lets tests pass in fake models, so keep it for new routes.
- Small reusable logic lives in `server/lib/` as one function per file (e.g. `updateRatingSummary.js`, `validateReview.js`).
- Routes use `try/catch` and `next(error)`; the error handler in `app.js` returns a generic 500. Return `{ message }` JSON for client-facing errors.
- `requireAuth` middleware protects routes that need a signed-in user.
- The client calls the API only through `client/src/lib/api.js` (`apiRequest`).
- Tests in `server/test/` build the app with fake in-memory models, so they never touch MongoDB. New server features need tests in the same style.

## Rules
- Secrets live in `server/.env` / `client/.env` and are never committed; add new variables to the matching `.env.example`.
- Anything that calls a paid external API (such as the Claude API) runs only on the server, never in the client.
- Accessibility: semantic HTML, labelled controls, keyboard support and visible focus for any new UI.

## Workflow (enforced by hooks in `.claude/`)
- Features start with `/new-feature <name>`, which creates `feature/<name>` and `docs/intent/<name>.md` from `docs/intent/_template.md`.
- Code under `server/` and `client/` can't be edited on main, or on a feature branch until its intent file says `Status: approved`.
- Before Claude finishes a turn, server tests and client lint run for whichever side changed, and failures must be fixed.
