# Be Patient API

A RESTful API backend built with Express.js, MongoDB, and Node.js.

## Features

- Express.js server
- MongoDB database with Mongoose ORM
- JWT authentication
- User registration and login
- Protected routes
- Error handling middleware

## Installation

1. Clone the repository
2. Install dependencies
   ```
   npm install
   ```
3. Create a `.env` file with the following variables:
   ```
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/be-patient
   NODE_ENV=development
   JWT_SECRET=your_jwt_secret
   ```
4. Run the server
   ```
   npm run dev
   ```

## API Endpoints

### Users
- `POST /api/users` - Register a new user
- `POST /api/users/login` - Login a user
- `GET /api/users/profile` - Get user profile (protected)

## Development

```
npm run dev
```

## Production

```
npm start
``` 