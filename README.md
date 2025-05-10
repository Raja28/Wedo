# 📋 WeDo - Team Task Management System

WeDo is a collaborative task management web application designed to help teams assign, track, and manage tasks efficiently. Built with a modern tech stack, it supports secure authentication, task CRUD operations, real-time notifications, and intelligent dashboards.

---

## 🚀 Features

### ✅ User Authentication
- Secure registration and login functionality
- Industry-standard password hashing (bcrypt)
- JWT-based session management

### ✅ Task Management
- Create, Read, Update, and Delete tasks
- Task attributes:
  - `title`
  - `description`
  - `dueDate`
  - `createdBy`
  - `assignedTo`
  - `priority` (Low, Medium, High)
  - `status` (To Do, In Progress, Completed, Blocked)

### ✅ Team Collaboration
- Assign tasks to other registered users

### ✅ Dashboard
- Personalized dashboard for each user displaying:
  - Tasks assigned to them
  - Tasks created by them
  - Overdue tasks

### ✅  Filter
- Filter tasks based on:
  - Status
  - Priority

---

## ⚙️ Tech Stack

| Layer      | Technology          |
|------------|---------------------|
| Frontend   | Next.js (React + RTK) |
| Backend    | Node.js with Express|
| Database   | MongoDB             |
| Auth       | JWT + bcrypt        |
| Versioning | Git + GitHub        |

---


### 📦 Installation

```bash
git clone https://github.com/Raja28/Wedo.git
cd wedo
npm install
npm run dev
