# Practice Manager - Patient Management System

A comprehensive healthcare management system with a Next.js frontend and Express.js backend.

## Project Structure

This project consists of two main components:

- `fe-patient`: Next.js frontend application for patients and administrators
- `be-patient`: Express.js backend API with MongoDB database

## Features

### Frontend (fe-patient)
- User authentication (login/signup)
- Role-based access control (admin vs patient)
- Patient appointment submission
- Dashboard for administrators
- Dark/light mode support
- Responsive design
- Form data persistence

### Backend (be-patient)
- RESTful API architecture
- MongoDB database with Mongoose ODM
- JWT authentication
- User and patient management
- Appointment scheduling
- Medical records management
- Notification system

## Getting Started

### Prerequisites
- Node.js (v16+)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
   ```
   cd be-patient
   ```

2. Install dependencies:
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

4. Start the development server:
   ```
   npm run dev
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd fe-patient
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

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

### Medical Records
- `POST /api/medicalrecords` - Create a new medical record
- `GET /api/medicalrecords` - Get all medical records (admin only)
- `GET /api/medicalrecords/:id` - Get medical record by ID
- `GET /api/medicalrecords/patient/:patientId` - Get records by patient
- `PUT /api/medicalrecords/:id` - Update medical record
- `DELETE /api/medicalrecords/:id` - Delete medical record

## Technologies Used

### Frontend
- Next.js 14
- React
- TypeScript
- Tailwind CSS
- Shadcn UI
- React Context API
- Axios

### Backend
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- Node.js


