# 🏗️ Construction Management System

A full-stack web-based **Construction Management System** designed to help construction companies manage workers, construction sites, worker assignments, attendance, and workforce operations from a centralized platform.

The system consists of a **React-based Admin Dashboard**, **Node.js + Express.js REST API**, **PostgreSQL database**, and a **React Native + Expo mobile application** for workers.

---

## 🚀 Overview

Construction companies often manage workers, sites, assignments, and attendance through disconnected manual processes.

This project provides a centralized system that allows administrators to:

- Manage construction workers
- Manage construction sites
- Assign workers to sites
- Track assignment history
- Manage worker attendance
- View attendance history
- Monitor workforce statistics
- Secure administrative operations with JWT authentication

A dedicated worker mobile application is also being developed to extend these capabilities to field workers.

---

## ✨ Key Features

### 👨‍💼 Admin Dashboard

- 🔐 Admin authentication
- 👷 Worker management
- 🏗️ Construction site management
- 🔄 Worker-site assignment
- 📋 Assignment history
- 🕐 Attendance management
- 📊 Attendance history
- 📈 Dashboard statistics
- 🔒 Protected API routes
- 🔑 JWT-based authentication

### 📱 Worker Mobile Application

The worker application is being developed using **React Native, Expo, Expo Router, and TypeScript**.

Planned workflow:

- Splash screen
- Welcome screen
- Worker login
- Worker registration
- Personal information
- Work-site selection
- Worker dashboard
- Attendance marking
- Attendance history
- Worker profile

> 🚧 The worker mobile application is currently under development. Some planned features are not yet implemented.

---

# 🧩 System Architecture

```text
                         CONSTRUCTION MANAGEMENT SYSTEM
                                      │
                 ┌────────────────────┴────────────────────┐
                 │                                         │
                 ▼                                         ▼
       ┌────────────────────┐                    ┌────────────────────┐
       │   Admin Dashboard  │                    │   Worker Mobile    │
       │    React + Vite    │                    │ React Native + Expo│
       └─────────┬──────────┘                    └─────────┬──────────┘
                 │                                         │
                 └────────────────┬────────────────────────┘
                                  │
                              REST APIs
                                  │
                                  ▼
                     ┌────────────────────────┐
                     │   Node.js + Express.js │
                     │       Backend API      │
                     └────────────┬───────────┘
                                  │
                    ┌─────────────┴─────────────┐
                    │                           │
                    ▼                           ▼
           ┌──────────────────┐        ┌──────────────────┐
           │    PostgreSQL    │        │ JWT Authentication│
           │     Database     │        │  Protected APIs  │
           └──────────────────┘        └──────────────────┘
🛠️ Tech Stack
Layer	Technologies
Frontend	React, Vite, JavaScript, CSS
Backend	Node.js, Express.js
Database	PostgreSQL
Authentication	JWT, bcrypt
Mobile	React Native, Expo, Expo Router, TypeScript
API	REST API, Fetch API
Development	VS Code, Git, GitHub, Thunder Client
Deployment	Vercel, Render
📁 Project Structure
construction-management-system/
│
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── adminController.js
│   │   ├── assignmentController.js
│   │   ├── attendanceController.js
│   │   ├── dashboardController.js
│   │   ├── siteController.js
│   │   └── workerController.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── routes/
│   │   ├── adminRoutes.js
│   │   ├── assignmentRoutes.js
│   │   ├── attendanceRoutes.js
│   │   ├── dashboardRoutes.js
│   │   ├── siteRoutes.js
│   │   └── workerRoutes.js
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── style.css
│   └── package.json
│
├── worker-app/
│   ├── assets/
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   ├── constants/
│   │   └── hooks/
│   ├── app.json
│   └── package.json
│
└── README.md
🔐 Authentication

The system uses JWT-based authentication for protected administrative operations.

Authentication Flow
Admin Login
     │
     ▼
Express.js API
     │
     ▼
Credential Validation
     │
     ▼
JWT Token
     │
     ▼
Protected API Requests
     │
     ▼
Admin Dashboard

Protected API requests use:

Authorization: Bearer <JWT_TOKEN>
🗄️ Core Modules
Module	Functionality
Admin	Authentication and authorization
Workers	Worker creation, viewing and updating
Sites	Construction site management
Assignments	Worker-site allocation
Assignment History	Historical worker assignments
Attendance	Attendance management
Attendance History	Attendance records
Dashboard	Workforce and operational statistics
🔌 REST API

The backend follows a modular REST API architecture.

/api/admin
/api/workers
/api/sites
/api/assignments
/api/attendance
/api/dashboard

Each module has dedicated routes and controllers to keep the backend maintainable and scalable.

🚀 Getting Started
1. Clone Repository
git clone https://github.com/jemmiii/construction-management-system.git
cd construction-management-system
2. Backend Setup
cd backend
npm install

Create a .env file:

PORT=5000

DB_HOST=your_database_host
DB_PORT=5432
DB_NAME=your_database_name
DB_USER=your_database_user
DB_PASSWORD=your_database_password

JWT_SECRET=your_jwt_secret

Start the backend:

node server.js

Backend:

http://localhost:5000
3. Frontend Setup

Open a new terminal:

cd frontend
npm install
npm run dev

Vite will display the local development URL in the terminal.

4. Worker App Setup
cd worker-app
npm install
npx expo start

The mobile application can be opened using Expo Go during development.

📊 Admin Workflow
                    Admin Login
                         │
                         ▼
                    Dashboard
                         │
        ┌────────────────┼────────────────┐
        │                │                │
        ▼                ▼                ▼
     Workers           Sites        Assignments
                                         │
                                         ▼
                                Assignment History

                         │
                         ▼
                     Attendance
                         │
                         ▼
                  Attendance History
👷 Worker Management

Administrators can manage workers through the dashboard.

Current worker operations include:

Add workers
View workers
View worker details
Update worker information
Assign workers to sites
Unassign workers
View assignment history
🏗️ Site Management

The site module allows administrators to manage construction locations.

Capabilities include:

Create construction sites
View construction sites
Update site information
Assign workers to sites
Monitor site workforce allocation
🔄 Worker-Site Assignment

Workers can be allocated to specific construction sites through the assignment module.

Worker
   │
   ▼
Select Site
   │
   ▼
Create Assignment
   │
   ▼
Worker Assigned
   │
   ▼
Assignment History

Administrators can also unassign workers when their site assignment changes.

🕐 Attendance

The attendance module provides centralized attendance tracking for workers.

It supports:

Attendance records
Attendance status
Attendance history
Worker-based attendance tracking
Site-based workforce monitoring
📱 Worker Mobile App Roadmap

The worker application is being developed in phases.

Current Development
Splash screen
Welcome screen
Login
Worker registration
Personal information
Work-site selection
Worker dashboard
Attendance
Attendance history
Profile
Planned Enhancements
📍 GPS-based site verification
📏 Geofencing
📷 Camera-based attendance
👤 Face verification
💰 Salary information
📲 WhatsApp notifications
🔔 Workforce notifications
📊 Additional worker services
☁️ Deployment

The project is designed using separate deployment services:

                    GitHub
                      │
          ┌───────────┴───────────┐
          │                       │
          ▼                       ▼
       Vercel                   Render
          │                       │
          ▼                       ▼
    React Frontend          Node.js Backend
                                  │
                                  ▼
                             PostgreSQL
Production Stack
Frontend: Vercel
Backend: Render
Database: PostgreSQL
Source Control: GitHub
🔒 Security

Sensitive credentials should never be committed to GitHub.

Never commit:

.env
Database passwords
JWT secrets
API keys
Access tokens
Private credentials

Use environment variables for local development and production deployment.

🎯 Project Goals

The system aims to provide construction companies with a centralized platform to:

Digitize workforce management
Manage construction sites
Simplify worker allocation
Track attendance
Maintain assignment history
Monitor workforce operations
Reduce manual administrative work
Extend workforce management to mobile devices
🔮 Future Improvements

Planned future improvements include:

GPS attendance verification
Geofencing
Face recognition
Payroll management
Salary slips
Leave management
Worker notifications
WhatsApp integration
Real-time notifications
Advanced analytics
Role-based access control
Multi-company support
Worker document management
📌 Project Status
Component	Status
Admin Dashboard	✅ Completed
Backend REST API	✅ Completed
PostgreSQL Integration	✅ Completed
JWT Authentication	✅ Implemented
Worker Management	✅ Completed
Site Management	✅ Completed
Worker-Site Assignment	✅ Completed
Assignment History	✅ Completed
Attendance Management	✅ Completed
Attendance History	✅ Completed
Worker Mobile App	🚧 In Development
GPS Verification	🔮 Planned
Face Verification	🔮 Planned
Payroll	🔮 Planned
👨‍💻 Author

Jemin Patidar

B.Tech — Information Technology
Manipal University Jaipur

⭐ Project

If you find this project interesting, feel free to explore the source code and follow the development of the worker mobile application.
