<p align="center">
  <img src="https://raw.githubusercontent.com/Deepak-132006/Commerza-Ecommerce/master/client/src/assets/logo/Logo-LS-NoBG.png" width="600" alt="Commerza Logo"/>
</p>

<p align="center">
  A Full-Stack E-commerce platform with JWT authentication, role-based access, real payment integration, and a dedicated admin dashboard.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Java-17-ED8B00?style=flat&logo=openjdk&logoColor=white" />
  <img src="https://img.shields.io/badge/Spring%20Boot-6DB33F?style=flat&logo=springboot&logoColor=white" />
  <img src="https://img.shields.io/badge/Spring%20Security-6DB33F?style=flat&logo=springsecurity&logoColor=white" />
  <img src="https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/Tailwind%20CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white" />
  <img src="https://img.shields.io/badge/PostgreSQL-4169E1?style=flat&logo=postgresql&logoColor=white" />
  <img src="https://img.shields.io/badge/Docker-2496ED?style=flat&logo=docker&logoColor=white" />
  <img src="https://img.shields.io/badge/Razorpay-02042B?style=flat&logo=razorpay&logoColor=white" />
</p>

<p align="center">
  <a href="https://commerza-ecommerce.vercel.app/"><b>🌐 Live Demo</b></a>
</p>

---

## 📌 Overview

**Commerza** is a full-stack e-commerce application built with **React** on the frontend and **Spring Boot** on the backend. It ships with a complete customer storefront — browsing, cart, favorites, checkout, and Razorpay payments — alongside a **separate admin dashboard** for managing products, categories, and orders through the same secured REST API.

The backend follows a layered architecture (controller → service → repository → entity), uses **PostgreSQL** via Spring Data JPA/Hibernate, and is protected end-to-end with **JWT-based authentication and role-based authorization**. The application is fully deployed in production: the React client on **Vercel**, the Dockerized Spring Boot API on **Render**, and the database on **Supabase**.

---

## 🖼️ Screenshots

<table>
  <tr>
    <td align="center">
      <img src="https://raw.githubusercontent.com/Deepak-132006/Commerza-Ecommerce/master/details/Commerza_Home.jpeg" width="420"/><br/>
      <sub><b>Home</b></sub>
    </td>
    <td align="center">
      <img src="https://raw.githubusercontent.com/Deepak-132006/Commerza-Ecommerce/master/details/Commerza_Products.jpeg" width="420"/><br/>
      <sub><b>Products</b></sub>
    </td>
  </tr>
  <tr>
    <td align="center">
      <img src="https://raw.githubusercontent.com/Deepak-132006/Commerza-Ecommerce/master/details/Commerza_Cart.jpeg" width="420"/><br/>
      <sub><b>Cart</b></sub>
    </td>
    <td align="center">
      <img src="https://raw.githubusercontent.com/Deepak-132006/Commerza-Ecommerce/master/details/Commerza_Checkout.jpeg" width="420"/><br/>
      <sub><b>Checkout</b></sub>
    </td>
  </tr>
  <tr>
    <td align="center">
      <img src="https://raw.githubusercontent.com/Deepak-132006/Commerza-Ecommerce/master/details/Commerza_Login.jpeg" width="420"/><br/>
      <sub><b>Login</b></sub>
    </td>
    <td align="center">
      <img src="https://raw.githubusercontent.com/Deepak-132006/Commerza-Ecommerce/master/details/Commerza_Register.jpeg" width="420"/><br/>
      <sub><b>Register</b></sub>
    </td>
  </tr>
</table>

---

## ✨ Features

### 🛍️ Customer Application
- User registration and login with JWT authentication
- Product browsing with category-based filtering
- Shopping cart — add, update quantity, remove, view running totals
- Favorites / wishlist
- Full checkout flow with **Razorpay** payment integration
- Backend-verified payment signatures — the frontend never decides if a payment is valid
- Stock reservation and finalization tied to payment status
- Forgot password flow
- Transactional email notifications via Spring Mail

### 🛠️ Admin Dashboard
- Separate React-based admin application, communicating with the same Spring Boot API
- **Product management** — create, update, delete, and manage product details
- **Category management**
- **Order management** — view orders and update order status
- Protected admin-only routes so regular customers cannot access the dashboard

### 🔐 Authentication & Authorization
- JWT-based authentication with Spring Security
- Access token + refresh token flow
- Axios interceptors that automatically:
  - Attach the access token to every outgoing request
  - Detect `401 Unauthorized` responses
  - Silently request a new access token using the refresh token and retry the original request
  - Redirect to login when refresh fails
- **Role-based access control** with `USER` and `ADMIN` roles
- Admin APIs and admin dashboard routes are protected by role checks on both the backend and the frontend

---

## 🏗️ System Architecture

<p align="center">
  <img src="https://raw.githubusercontent.com/Deepak-132006/Commerza-Ecommerce/master/details/Commerza_Architecture.png" width="800" alt="Commerza System Architecture"/>
</p>

The React customer client and the separate React admin dashboard are both deployed on **Vercel** and communicate with a single Spring Boot REST API over HTTPS. The API is containerized with a multi-stage Dockerfile and deployed on **Render**, where Spring Security validates every request's JWT and enforces role-based access before it reaches the controller layer. From there, requests flow through the service and repository layers to **Supabase PostgreSQL** (via the Session Pooler), while payments are handled through **Razorpay**, with order creation and signature verification both happening on the backend rather than being trusted from the client.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React.js, Tailwind CSS, Axios |
| **Backend** | Spring Boot (Java 17) |
| **Security** | Spring Security, JWT (Access + Refresh Tokens) |
| **Database** | PostgreSQL |
| **ORM** | Spring Data JPA / Hibernate |
| **Payments** | Razorpay |
| **Email** | Spring Mail |
| **Containerization** | Docker (multi-stage build) |
| **Frontend Hosting** | Vercel |
| **Backend Hosting** | Render |
| **Database Hosting** | Supabase |

---

## ⭐ Highlights

- **Real production data migration** — existing local PostgreSQL data was migrated to Supabase using `pg_dump` and `pg_restore`, rather than launching with an empty database.
- **Production-grade auth** — full JWT access/refresh token rotation handled transparently through Axios interceptors, plus role-based authorization for `USER` and `ADMIN`.
- **Real payment integration** — Razorpay order creation and payment signature verification are both handled server-side, keeping the backend as the source of truth.
- **Two clients, one API** — a customer storefront and a fully separate admin dashboard, both consuming the same secured Spring Boot REST API.
- **Containerized backend** — a multi-stage Dockerfile keeps the Maven/JDK build environment out of the final runtime image.
- **Independently deployed services** — frontend (Vercel), backend (Render), and database (Supabase) are deployed and scaled independently, secrets managed entirely through environment variables.

---

## 📬 Contact

**Deepak N**

- 🌐 Live Project: [commerza-ecommerce.vercel.app](https://commerza-ecommerce.vercel.app/)
- 📧 Email: [deepakn1196@gmail.com](mailto:deepakn1196@gmail.com)
- 💻 GitHub: [@Deepak-132006](https://github.com/Deepak-132006)
- 🔗 LinkedIn: [deepak-n-b416bb309](https://linkedin.com/in/deepak-n-b416bb309)

<p align="center">
  <img src="https://raw.githubusercontent.com/Deepak-132006/Commerza-Ecommerce/master/client/src/assets/logo/Logo-NoBG.png" width="70" alt="Commerza"/>
</p>

<p align="center"><sub>Project completed on 16 August 2026</sub></p>