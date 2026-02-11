# FoodHub Server

FoodHub is a full-stack food ordering platform that allows users to discover, browse, and order meals from various providers. This repository contains the backend server, built with Node.js, Express, TypeScript, and Prisma ORM, and is deployed at [https://foodhub-server-one.vercel.app/](https://foodhub-server-one.vercel.app/).

The frontend is available at [https://foodhub-client-pi.vercel.app/](https://foodhub-client-pi.vercel.app/).

---

## 📑 Table of Contents

- [🛠️ Tech Stack](#-tech-stack)
- [🚀 Features](#-features)
- [📦 API Modules](#-api-modules)
- [🗄️ Database Schema](#-database-schema)
- [🧩 Utilities & Middleware](#-utilities--middleware)
- [📜 Scripts](#-scripts)
- [🚀 Deployment](#-deployment)
- [🏁 Getting Started](#-getting-started)
- [📄 License](#-license)

---

## 🛠️ Tech Stack

- **Node.js** & **Express** (v5)
- **TypeScript** (strict mode)
- **Prisma ORM** (PostgreSQL)
- **Zod** (schema validation)
- **Better Auth** (authentication)
- **Nodemailer** (email)
- **Vercel** (deployment)
- **dotenv** (env config)

## 🚀 Features

- User authentication (email/password, email verification)
- Role-based access: Customer, Provider, Admin
- Provider profile management
- Category & meal management (CRUD)
- Order placement, status tracking, and order items
- Review & rating system for meals
- Pagination & sorting for all list endpoints
- Centralized error handling & logging
- Email notifications (verification, etc.)

## 📦 API Modules

- **User**: Registration, login, profile, status update
- **Provider Profile**: Create/update provider info
- **Category**: CRUD for meal categories
- **Meal**: CRUD for meals, featured/available flags
- **Order**: Place, update, and view orders
- **Order Item**: Linked to orders and meals
- **Review**: CRUD for meal reviews

## 🗄️ Database Schema

- **User**: id, name, email, role, phone, address, status, etc.
- **ProviderProfile**: id, userId, name, address, description, logo, isOpen
- **Category**: id, name, emoji, image
- **Meal**: id, providerId, categoryId, name, description, price, image, isAvailable, isFeatured, averageRating, totalReviews
- **Order**: id, customerId, providerId, totalAmount, address, paymentType, status
- **OrderItem**: id, orderId, mealId, quantity, price
- **Review**: id, customerId, mealId, orderId, rating, comment
- **Session/Account/Verification**: For authentication

## 🧩 Utilities & Middleware

- **AppError**: Custom error classes (BadRequest, Unauthorized, Forbidden, NotFound)
- **asyncHandler**: Async error wrapper for Express
- **logger**: Centralized logging utility
- **paginationSortingHelper**: Pagination & sorting logic
- **sendResponse**: Standardized API responses
- **auth.middleware**: Authentication & role-based authorization
- **globalErrorHandler**: Centralized error handler (Prisma-aware)
- **notFound**: 404 handler
- **requestLogger**: HTTP request logging

## 📜 Scripts

- `npm run dev` — Start dev server with hot reload
- `npm run build` — Build TypeScript & generate Prisma client
- `npm run start` — Start production server
- `npm run seed:admin` — Seed initial admin user
- `npm run deploy` — Deploy migrations, build, seed, and start

## 🚀 Deployment

- **Backend**: [https://foodhub-server-one.vercel.app/](https://foodhub-server-one.vercel.app/)
- **Frontend**: [https://foodhub-client-pi.vercel.app/](https://foodhub-client-pi.vercel.app/)

## 🏁 Getting Started

1. Clone the repo and install dependencies:
   ```sh
   npm install
   ```
2. Set up your `.env` file (see `.env.example` if available)
3. Run database migrations:
   ```sh
   npx prisma migrate dev
   ```
4. Start the dev server:
   ```sh
   npm run dev
   ```

## 📄 License

This project is for educational purposes.
