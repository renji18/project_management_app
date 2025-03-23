# **Task Management App**

A full-stack task management application built with **Next.js, Prisma, Redux, NextAuth.js, and SST (Serverless Stack) on AWS**.

## **Table of Contents**

1. [Features](#features)
2. [Tech Stack](#tech-stack)
3. [Getting Started](#getting-started)
   - [Prerequisites](#prerequisites)
   - [Environment Variables](#environment-variables)
   - [Installation](#installation)
   - [Running Locally](#running-locally)
4. [Architecture](#architecture)
5. [Testing](#testing)
6. [API Endpoints](#api-endpoints)

---

## **1. Features**

- User authentication with **NextAuth.js** (email/password & OAuth)
- Task creation, assignment, and status tracking
- Role-based access for task owners and assignees
- Real-time updates using Redux for state management
- UI with a clean and modern design
- Serverless backend with **SST** deployed on AWS
- Secure user authentication & password hashing

---

## **2. Tech Stack**

### **Frontend**

- **Next.js** (React framework)
- **Tailwind CSS** (for styling)
- **Redux Toolkit** (state management)

### **Backend**

- **Next.js API Routes** (server-side API)
- **Prisma ORM** (database management)
- **PostgreSQL (Supabase)** (database)
- **NextAuth.js** (authentication)
- **SST (Serverless Stack)** (for AWS deployment)

---

## **3. Getting Started**

### **Prerequisites**

Before you start, ensure you have:

- **Node.js v18+** installed
- **AWS CLI** configured (`AWS_PROFILE` set up)
- **PostgreSQL Database (Supabase or Local DB)**

### **Environment Variables**

Create a `.env.local` file in the root directory and add the following:

```env
NEXTAUTH_SECRET=your_secret_key
DATABASE_URL=Supabase pool url with pgbouncer=true
DIRECT_DATABASE_URL=Supabase main url for migrations
NEXTAUTH_URL=http://localhost:3000
AWS_PROFILE=your_aws_profile
PRISMA_CLIENT_ENGINE_EXPERIMENTAL_FEATURES=disable_prepared_statements
```

## **Installation**

Clone the repository and install dependencies:

```sh
git clone https://github.com/renji18/project_management_app.git
cd task-management-app
npm install
```

## **Start The Development server**

npm run dev

## **Architecture**

This project follows a **Full Stack Serverless Architecture** using **SST** and **Next.js**.

### **Frontend**

- Built with **Next.js** and **TypeScript**.
- Uses **Redux Toolkit** for state management.
- **NextAuth.js** for authentication.
- Tailwind CSS for styling.

### **Backend**

- Serverless API using **SST (Serverless Stack)** deployed on **AWS Lambda**.
- **Prisma ORM** with **PostgreSQL (Supabase)** as the database.
- Authentication and session management handled via **NextAuth.js** with database-backed sessions.

### **Infrastructure**

- **SST (Serverless Stack)** for backend deployment.
- **AWS Lambda** for executing API functions.
- **Amazon RDS (via Supabase)** for persistent database storage.
- **CloudFront** for frontend deployment.


## **API Endpoints**

| Method | Endpoint         | Description                                      |
|--------|-----------------|--------------------------------------------------|
| POST   | /api/auth/register | Register a new user                           |
| POST   | /api/auth/signin   | Authenticate and log in a user                 |
| POST   | /api/auth/signout  | Log out the authenticated user                 |
| GET    | /api/user          | Get authenticated user details                 |
| PUT    | /api/user/name     | Update the authenticated user's name           |
| PUT    | /api/user/password | Change the user's password                     |
| DELETE | /api/user          | Delete the authenticated user account          |
| GET    | /api/tasks         | Retrieve all tasks for the authenticated user  |
| POST   | /api/tasks         | Create a new task                              |
| PUT    | /api/tasks/:id     | Update an existing task                        |
| DELETE | /api/tasks/:id     | Delete a task                                  |