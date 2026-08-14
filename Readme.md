# 📝 To-Do Full-Stack Web Application

A full-stack To-Do web application built to help users create, organize, and manage their daily tasks.

The application provides user authentication, task management, categories, priorities, due dates, search, filtering, overdue task tracking, and a responsive dashboard.

## 🌐 Live Demo

👉 https://todo-fullstackibo.netlify.app/
---

## 📌 Features

### 🔐 User Authentication
- User registration
- User login
- JWT authentication
- Secure password hashing using bcrypt
- Protected API routes
- User logout

### ✅ Task Management
- Create tasks
- View tasks
- Edit tasks
- Delete tasks
- Mark tasks as completed
- Mark completed tasks as pending
- Tasks are associated with individual users

### 🏷️ Task Organization
- Task priorities:
  - Low
  - Medium
  - High
- Task categories:
  - General
  - School
  - Work
  - Personal
  - Shopping
  - Other
- Due dates
- Overdue task detection

### 🔎 Search & Filtering
- Search tasks by title and content
- Filter by:
  - All tasks
  - Pending
  - Completed
- Filter by category

### 📊 Dashboard
The dashboard displays:

- Total tasks
- Pending tasks
- Completed tasks
- Overdue tasks
- User information
- Task list
- Task management controls

### 📱 Responsive Design

The application is designed to work across:

- Desktop
- Laptop
- Tablet
- Mobile devices

---

## 🛠️ Technologies Used

### Frontend

- HTML5
- CSS3
- JavaScript
- Fetch API
- Local Storage

### Backend

- Node.js
- Express.js
- MySQL2
- JWT
- bcryptjs
- CORS
- dotenv

### Database

- MySQL
- MariaDB/phpMyAdmin for local development
- Aiven MySQL for production

### Deployment

- Netlify - Frontend
- Render - Backend
- Aiven - Database

---

## 📂 Project Structure

```text
todo-fullstack/
│
├── backend/
│   │
│   ├── config/
│   │   └── database.js
│   │
│   ├── controllers/
│   │   ├── authController.js
│   │   └── taskController.js
│   │
│   ├── middleware/
│   │   └── authMiddleware.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── taskRoutes.js
│   │
│   ├── .env
│   ├── .gitignore
│   ├── package.json
│   └── server.js
│
├── frontend/
│   │
│   ├── css/
│   │   └── styles.css
│   │
│   ├── js/
│   │   ├── api.js
│   │   ├── auth.js
│   │   └── dashboard.js
│   │
│   ├── index.html
│   ├── login.html
│   ├── register.html
│   └── dashboard.html
│
└── README.md