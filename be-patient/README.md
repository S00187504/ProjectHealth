# Practice Manager API

A comprehensive healthcare management system built with Express.js, MongoDB, and Node.js.

## Features


## ProjectHealth Backend (be-patient)

### Background
ProjectHealth is a comprehensive healthcare management platform designed to streamline patient, appointment, and medical record management for clinics and healthcare providers. The backend (be-patient) is built with Node.js and Express, providing RESTful APIs for handling users, patients, appointments, and medical records. It connects to a MongoDB database and supports authentication and authorization for secure access.

### Features
- User authentication and authorization
- Patient management (CRUD operations)
- Appointment scheduling and management
- Medical record storage and retrieval
- Admin and client roles

### Prerequisites
Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v16 or higher recommended)
- [npm](https://www.npmjs.com/)
- [MongoDB](https://www.mongodb.com/) (local or Atlas)

### Step-by-Step Setup Guide

#### 1. Clone the Repository
```powershell
# In PowerShell, navigate to your desired directory and run:
git clone https://github.com/S00187504/ProjectHealth.git
cd ProjectHealth/be-patient
```

#### 2. Install Dependencies
```powershell
npm install
```

#### 3. Configure Environment Variables
Edit the `.env` file in the `be-patient` folder. Set your MongoDB connection string and JWT secret:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
NODE_ENV=development
JWT_SECRET=your_jwt_secret
```
You can use MongoDB Atlas or a local MongoDB instance. Replace `your_mongodb_connection_string` and `your_jwt_secret` with your own values.

#### 4. Seed the Database (Optional)
To create an admin user or seed appointments, use the scripts provided:
```powershell
# Create an admin user
node scripts/createAdmin.js

# Seed appointments
node scripts/seedAppointments.js
```

#### 5. Start the Backend Server
```powershell
npm start
```
The server will run on the port specified in your `.env` file (default: 5000).

#### 6. API Endpoints
The backend exposes RESTful endpoints for users, patients, appointments, and medical records. You can interact with these endpoints using tools like [Postman](https://www.postman.com/) or connect the frontend (see `fe-patient` folder).

### Folder Structure
- `config/` - Database configuration
- `controllers/` - Route logic for appointments, patients, users, medical records
- `middleware/` - Authentication middleware
- `models/` - Mongoose models
- `routes/` - API route definitions
- `scripts/` - Utility scripts for seeding data
- `utils/` - Helper functions

### Support
For issues or questions, please open an issue on the GitHub repository.
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
