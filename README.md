# Cape Bites

Cape Bites is a full-stack web app for discovering Asian restaurants in Cape Town, South Africa. Browse restaurants on a list or an interactive map, search and filter them by cuisine, create an account, and leave star ratings and written reviews.

**Live demo:** _coming soon_

<!-- Add screenshots here, e.g. ![Directory page](docs/directory.png) -->

## Features

- Restaurant directory backed by MongoDB Atlas, with real Cape Town listings
- Search by name, cuisine, or neighborhood, with cuisine filter chips
- Interactive Mapbox map that stays in sync with the search and filters
- Restaurant cards and details pages with photos, cuisine pills, and tags
- Account registration, login, and logout using server-side sessions
- Star ratings and written reviews (signed-in users only, one review per restaurant, edit or delete your own)
- Average rating and review count on every restaurant, calculated from real reviews
- Responsive layout with a list/map toggle on small screens
- Loading skeletons, empty states, and error messages with a retry button
- Fallback colours when a restaurant photo fails to load
- Keyboard focus styles and reduced-motion support

## Tech Stack

| Layer    | Technology                                                       |
| -------- | ---------------------------------------------------------------- |
| Frontend | React 19, React Router, Vite, Mapbox GL (react-map-gl), plain CSS |
| Backend  | Node.js, Express 5                                               |
| Database | MongoDB Atlas with Mongoose                                      |
| Auth     | express-session, connect-mongo session store, bcryptjs           |
| Testing  | Node's built-in test runner (`node --test`)                      |

## Project Structure

```text
client/   React frontend (Vite)
  src/components/   Reusable UI (cards, filters, map, status messages)
  src/pages/        Route-level pages
  src/context/      Authentication state
  src/lib/          API base URL and request helpers
server/   Express API
  models/      Mongoose models (User, Restaurant, Review)
  routes/      Route modules (auth, restaurants, reviews)
  middleware/  Shared Express middleware (requireAuth)
  lib/         Shared helpers (rating summary)
  test/        API tests
  seed.js   Seeds the restaurant collection
```

## Getting Started

### Prerequisites

- Node.js 20+
- A free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster
- A [Mapbox](https://www.mapbox.com/) public access token

### Setup

```bash
git clone <repo-url>
cd server && npm install
cd ../client && npm install
```

**Server:** copy `server/.env.example` to `server/.env` and fill in:

| Variable         | Description                                                      |
| ---------------- | ---------------------------------------------------------------- |
| `MONGO_URI`      | MongoDB Atlas connection string                                  |
| `SESSION_SECRET` | Random string of at least 32 characters                          |
| `CLIENT_ORIGIN`  | Frontend URL allowed by CORS (default `http://localhost:5173`)   |

Generate a session secret with:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Client:** copy `client/.env.example` to `client/.env` and fill in:

| Variable                   | Description                                                  |
| -------------------------- | ------------------------------------------------------------ |
| `VITE_API_URL`             | API base URL (default `http://localhost:5000/api`)           |
| `VITE_MAPBOX_ACCESS_TOKEN` | Mapbox public token (restrict it to your site URLs in Mapbox) |

Never commit real `.env` files. Restart Vite after changing environment variables.

### Seed the database

```bash
cd server
npm run seed
```

The seed script upserts by restaurant `id`, so it is safe to run more than once.

### Run

```bash
# Terminal 1 - API on http://localhost:5000
cd server && npm run dev

# Terminal 2 - client on http://localhost:5173
cd client && npm run dev
```

### Test

```bash
cd server && npm test
```

## API

Base URL: `http://localhost:5000/api`

| Method | Endpoint               | Description                                        | Auth |
| ------ | ---------------------- | -------------------------------------------------- | ---- |
| GET    | `/health`              | Health check                                       | No   |
| GET    | `/restaurants`         | List restaurants, highest rated first              | No   |
| GET    | `/restaurants/:id`     | Get one restaurant (404 if not found)              | No   |
| GET    | `/restaurants/:id/reviews` | List a restaurant's reviews, newest first      | No   |
| POST   | `/restaurants/:id/reviews` | Post a review: `rating` 1-5, optional `comment` | Yes  |
| PUT    | `/reviews/:reviewId`   | Edit your own review (same fields as posting)      | Yes  |
| DELETE | `/reviews/:reviewId`   | Delete your own review                             | Yes  |
| POST   | `/auth/register`       | Create an account and start a session              | No   |
| POST   | `/auth/login`          | Log in and start a session                         | No   |
| POST   | `/auth/logout`         | Destroy the session and clear the cookie           | No   |
| GET    | `/auth/me`             | Return the current user, or `null`                 | No   |

## Technical Decisions

- **Server-side sessions instead of JWTs.** Sessions are stored in MongoDB and sent as an `HttpOnly` cookie, so JavaScript in the browser can never read the credential. Logging out destroys the session on the server, which is harder to do with stateless tokens.
- **Passwords** are hashed with bcrypt (cost 12). Inputs are validated on the server, and the session ID is regenerated on login to prevent session fixation.
- **One review per user per restaurant** is enforced by a compound unique index in MongoDB, not just by the API, so a double-click or a race between two requests cannot create duplicates.
- **Authorization:** a `requireAuth` middleware protects writes, and editing or deleting a review also checks that it belongs to the signed-in user (401 when signed out, 403 for someone else's review).
- **Shared validation.** Posting and editing a review use the same `validateReview` helper, so the rules cannot drift apart.
- **Accessible star rating.** The stars are real radio buttons, so keyboard and screen reader users can pick a rating. The hover preview and highlighting are plain React state and CSS.
- **Stored average rating.** Each restaurant keeps its own `rating` and `reviewCount`, recalculated with an aggregation whenever a review is added or deleted, so listing restaurants stays fast because nothing is calculated on read.
- **GeoJSON `location` field** on each restaurant, ready for map rendering and geospatial queries.
- **App factory (`createApp`)** takes its session store and user model as arguments, so tests can run the real app without a live database.
- **CSS variables for theming.** Colours, fonts, and corner sizes are defined once in `client/src/index.css`, so the whole theme can change by editing a few values. No UI library is used.
- **Filters derived from the data.** The cuisine chips are built from each restaurant's `tags`, so a new cuisine appears in the filter without any client changes.

## Roadmap

- [x] Reviews and ratings (create, read, delete, one review per user per restaurant)
- [x] Edit your own review
- [x] Cuisine filters
- [ ] Price filters
- [x] Restaurant and review API tests
- [ ] Client tests
- [ ] Deployment and CI

## Data Note

Restaurant listings are sourced from public restaurant and tourism listings and should be checked for current details. Reviews in Cape Bites are written by app users; reviews from other platforms are not copied.

Restaurant photos are from [Unsplash](https://unsplash.com). They are chosen to match each restaurant's cuisine and are illustrative, so they may not show the restaurant's own food.
