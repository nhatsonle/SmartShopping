# Smart Shopping & Pantry Management System

A comprehensive application designed to assist users in planning grocery shopping, managing food inventory, and planning meals. The system promotes efficient consumption habits, minimizes food waste, and ensures balanced nutrition.

## Features

- User authentication and family group management
- Shopping list creation and management with real-time updates
- Pantry inventory tracking with expiry date notifications
- Recipe suggestions based on available ingredients
- Meal planning with automated shopping list generation
- Admin panel for managing system data

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL with Sequelize ORM
- **Authentication**: JWT with Passport.js
- **Real-time**: Socket.IO

## Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a PostgreSQL database
4. Create a `.env` file in the root directory (see `.env.example` for required variables)
5. Run database migrations:
   ```
   npm run db:migrate
   ```
6. Seed the database with initial data:
   ```
   npm run db:seed
   ```
7. Start the development server:
   ```
   npm run dev
   ```

## API Documentation

API documentation is available at `/api-docs` when the server is running.

## Testing

Run the test suite:
```
npm test
```

## License

ISC
