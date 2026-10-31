# Cape Bites

Cape Bites is a full-stack web app for discovering Asian restaurants in Cape Town, South Africa. Browse restaurants on a list or an interactive map, search them, and create an account. Restaurant reviews are the next feature.

**Live demo:** _coming soon_

<!-- Add screenshots here, e.g. ![Directory page](docs/directory.png) -->

## Features

- Restaurant directory backed by MongoDB Atlas, with real Cape Town listings
- Search by name, cuisine, or neighborhood
- Interactive Mapbox map synced with the search results
- Restaurant details pages with client-side routing
- Account registration, login, and logout using server-side sessions
- Responsive layout with a list/map toggle on small screens
- Loading, empty, and error states

## Tech Stack

| Layer    | Technology                                                       |
| -------- | ---------------------------------------------------------------- |
| Frontend | React 19, React Router, Vite, Mapbox GL (react-map-gl)           |
| Backend  | Node.js, Express 5                                               |
| Database | MongoDB Atlas with Mongoose                                      |
| Auth     | express-session, connect-mongo session store, bcryptjs           |
| Testing  | Node's built-in test runner (`node --test`)                      |

## Project Structure

```text
client/   React frontend (Vite)
server/   Express API
  models/   Mongoose models (User, Restaurant)
  routes/   Route modules (auth)
  test/     API tests
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
| POST   | `/auth/register`       | Create an account and start a session              | No   |
| POST   | `/auth/login`          | Log in and start a session                         | No   |
| POST   | `/auth/logout`         | Destroy the session and clear the cookie           | No   |
| GET    | `/auth/me`             | Return the current user, or `null`                 | No   |

## Technical Decisions

- **Server-side sessions instead of JWTs.** Sessions are stored in MongoDB and sent as an `HttpOnly` cookie, so JavaScript in the browser can never read the credential. Logging out destroys the session on the server, which is harder to do with stateless tokens.
- **Passwords** are hashed with bcrypt (cost 12). Inputs are validated on the server, and the session ID is regenerated on login to prevent session fixation.
- **GeoJSON `location` field** on each restaurant, ready for map rendering and geospatial queries.
- **App factory (`createApp`)** takes its session store and user model as arguments, so tests can run the real app without a live database.

## Roadmap

- [ ] Reviews and ratings (create, read, one review per user per restaurant)
- [ ] Cuisine and price filters
- [ ] Restaurant and API tests, client tests
- [ ] Deployment and CI

## Data Note

Restaurant listings are sourced from public restaurant and tourism listings and should be checked for current details. Reviews in Cape Bites are written by app users; reviews from other platforms are not copied.
