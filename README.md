# Cape Bites

Cape Bites is a portfolio project for discovering and reviewing Asian restaurants in Cape Town, South Africa.

The app is inspired by the idea of location-based community review platforms, while using its own brand, design, data model, and user experience.

> Project status: planning and initial setup.

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

## Roadmap

- [x] Initialize the Git repository
- [x] Define the first MVP
- [ ] Create the client and server structure
- [ ] Build an Express health-check route
- [ ] Connect the server to MongoDB
- [ ] Create the Restaurant model
- [ ] Add restaurant API routes
- [ ] Display restaurants in React
- [ ] Add restaurant details
- [ ] Add authentication
- [ ] Add reviews and ratings
- [ ] Add focused tests
- [ ] Improve responsive accessibility
- [ ] Deploy the application

## Project Structure

The project will be organized into separate frontend and backend applications:

```text
client/   React frontend
server/   Express and Node.js backend
```

## Local Development

Setup instructions will be added once the client and server applications have been created.

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

Restaurant details and review content should be verified before being presented as real-world information. Seed data used during development will be clearly labelled as demo data.
