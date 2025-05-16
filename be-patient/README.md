# Practice Manager API

A comprehensive healthcare management system built with Express.js, MongoDB, and Node.js.

## Features

- Express.js server with RESTful API architecture
- MongoDB database with Mongoose ODM
- JWT authentication with role-based access control
- User and patient management
- Appointment scheduling and tracking
- Medical records management
- Error handling middleware
- CORS configuration for frontend integration

## Installation

1. Clone the repository
2. Install dependencies
   ```
   npm install
   ```
3. Create a `.env` file with the following variables:
   ```
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/practice-manager
   NODE_ENV=development
   JWT_SECRET=your_jwt_secret
   ```
   
   For the JWT_SECRET, generate a secure random string:
   ```
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

4. Run the server
   ```
   npm run dev
   ```

## API Endpoints

### Authentication
- `POST /api/users/login` - Authenticate user and get token
- `POST /api/users` - Register a new user
- `GET /api/users/profile` - Get user profile (protected)
- `PUT /api/users/profile` - Update user profile (protected)

### Patients
- `POST /api/patients` - Create a new patient record
- `GET /api/patients` - Get all patients (admin only)
- `GET /api/patients/:id` - Get patient by ID
- `PUT /api/patients/:id` - Update patient information
- `DELETE /api/patients/:id` - Delete a patient record

### Appointments
- `POST /api/appointments` - Create a new appointment
- `GET /api/appointments` - Get all appointments (admin only)
- `GET /api/appointments/:id` - Get appointment by ID
- `GET /api/appointments/patient/:patientId` - Get appointments by patient
- `PUT /api/appointments/:id` - Update appointment details
- `DELETE /api/appointments/:id` - Cancel/delete appointment

### Medical Records
- `POST /api/medicalrecords` - Create a new medical record
- `GET /api/medicalrecords` - Get all medical records (admin only)
- `GET /api/medicalrecords/:id` - Get medical record by ID
- `GET /api/medicalrecords/patient/:patientId` - Get records by patient
- `PUT /api/medicalrecords/:id` - Update medical record
- `DELETE /api/medicalrecords/:id` - Delete medical record

## Admin User Creation

To create an admin user for testing:

```
npm run create-admin
```

This creates an admin with:
- Email: admin@example.com
- Password: admin123

## Development

```
npm run dev
```

## Production

```
npm start
```



## Security Features

- Password hashing with bcrypt
- JWT authentication
- Protected routes with middleware
- Role-based access control
- Input validation
- Error handling

## Frontend Integration

This backend is designed to work with the `fe-patient` Next.js frontend. To run the complete application:

1. Start this backend server
2. Set up and run the frontend application
3. Ensure CORS is properly configured if running on different domains

## License

[MIT](LICENSE)
