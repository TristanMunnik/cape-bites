# Cape Bites

Cape Bites is a portfolio project for discovering and reviewing Asian restaurants in Cape Town, South Africa.

The app is inspired by the idea of location-based community review platforms, while using its own brand, design, data model, and user experience.

> Project status: React and Express foundation complete; restaurant data is stored in MongoDB Atlas and the directory includes an interactive Mapbox map. Reviews and authentication are planned.

## MVP

MVP means Minimum Viable Product. It is the smallest useful version of the application that proves the main idea.

The first version of Cape Bites will allow users to:

- Browse Asian restaurants in Cape Town
- Search and filter restaurants
- View restaurant details
- Create an account and log in
- Read restaurant reviews
- Leave ratings and written reviews

## Planned User Flow

```text
Open the app
  -> Browse restaurants
  -> Search or filter restaurants
  -> Open a restaurant details page
  -> Read reviews
  -> Log in or register
  -> Leave a rating and review
```

## Planned Technology

- MongoDB for storing users, restaurants, and reviews
- Express and Node.js for the backend API
- React for the frontend
- JavaScript across the project

## Planned Data Models

### User

- Username
- Email
- Password

### Restaurant

- Name
- Description
- Cuisine
- Cape Town neighborhood
- Address
- Price range
- Image
- Opening hours

### Review

- Rating
- Comment
- Author
- Restaurant
- Creation date

## Planned Pages

- Restaurant listing page
- Restaurant details page
- Registration page
- Login page
- Review form

The interface will include loading, empty, and error states so users always understand what is happening.

## Project Structure

The project will be organized into separate frontend and backend applications:

```text
client/   React frontend
server/   Express and Node.js backend
```

## Local Development

Clone the repository, then install dependencies in both applications:

```bash
cd server
npm install

cd ../client
npm install
```

Create `server/.env` from `server/.env.example` and add your MongoDB Atlas connection string.
Never commit the real `.env` file.

Create `client/.env` and set `VITE_MAPBOX_ACCESS_TOKEN` to a Mapbox public access token. Restrict the token to your local and deployed website URLs in your Mapbox account. Restart Vite after changing environment variables. Never commit the real `.env` file.

Run the applications in two terminals:

```bash
# Terminal 1
cd server
npm run dev
```

```bash
# Terminal 2
cd client
npm run dev
```

The client runs on Vite's local URL, usually `http://localhost:5173`.
The Express API runs on `http://localhost:5000`.

Environment variables will be stored in local `.env` files and will never be committed to the repository. A safe `.env.example` file will document the required variable names.

## Portfolio Goals

This project is being built to demonstrate practical full-stack development skills, including:

- Designing a database-backed application
- Building and consuming REST APIs
- Creating React user interfaces
- Implementing authentication and authorization
- Validating user input
- Handling loading and error states
- Writing focused tests
- Documenting technical decisions
- Deploying a full-stack application

## Data Note

Restaurant listings are sourced from public restaurant and tourism listings and should be checked for current details. Reviews in Cape Bites should be written by app users; do not copy reviews from other platforms.
