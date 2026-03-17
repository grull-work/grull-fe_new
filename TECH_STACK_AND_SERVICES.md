# Grull: Comprehensive Technology & Services Manifest

This document is the definitive source of truth for the entire technology stack and every third-party service powering the Grull platform.

---

## 🛠️ The Backend Engine (Python / FastAPI)

Our backend is built for high-concurrency, security, and absolute data integrity.

### 1. Core Framework & Logic
- **FastAPI**: The asynchronous foundation for our high-performance APIs.
- **Starlette**: The underlying ASGI toolkit powering our web services.
- **Pydantic (v1.10)**: Strict data validation and settings management.
- **Python-Multipart**: Handling complex form data and file uploads.
- **Requests**: For synchronous external service communication.

### 2. Database & Data Integrity
- **PostgreSQL (v15)**: Our primary relational data store.
- **SQLAlchemy (v2.0)**: Advanced asynchronous ORM for complex queries.
- **Alembic**: Precise version control for our database schema.
- **Asyncpg & Psycopg2-Binary**: High-efficiency database drivers.
- **SQLAlchemy-Utils**: Standardized types for URLs, Phone Numbers, and Currencies.
- **SQLAlchemy-CIText**: Native case-insensitive text support for usernames/emails.

### 3. Real-Time & Process Management
- **Socket.io**: Bi-directional, real-time event communication via `python-socketio`.
- **Uvicorn / Gunicorn**: Robust production-grade ASGI/WSGI server management.
- **FastAPI-Shell**: Interactive terminal for real-time debugging and data manipulation.

### 4. Security & Identity
- **FastAPI-Users**: Comprehensive authentication management.
- **JWT (Python-Jose)**: Secure token-based session handling.
- **Bcrypt & Passlib**: Industry-standard password hashing and security.

### 5. Observability & Testing
- **Prometheus & Grafana**: Real-time system health and API metrics visualization.
- **Prometheus-Fastapi-Instrumentator**: Automatic capture of performance metrics.
- **Python-Json-Logger**: Structured, searchable logs for production monitoring.
- **Pytest, Httpx, Trio**: A full-coverage automated testing suite.

---

## 🎨 The Frontend Experience (React 19 / TypeScript)

A premium, role-focused workspace designed for clarity and speed.

### 1. UI Architecture & Design
- **React 19**: Powered by the latest React features and performance.
- **TypeScript**: Type-safe development for extreme reliability.
- **Material UI (MUI) v7**: A world-class, premium component library.
- **React-Bootstrap**: Flexible grid and component utilities.
- **Animate.css**: Subtle micro-animations for high-end user feedback.
- **React-Icons**: A unified library for professional iconography.
- **Emotion (@emotion/styled)**: Advanced, scoped styling for pixel-perfect design.

### 2. Communication & State
- **Socket.io-client**: Zero-latency chat and project status updates.
- **Axios**: Intelligent HTTP client for all API interactions.
- **React Router v7**: Seamless navigation and protected project routes.
- **Query-String**: Precise parsing of complex URL parameters.

### 3. Identity & Assets
- **Firebase**: Powering our **Google Social Login** and hosting infrastructure.
- **Cloudinary**: Global CDN for lightning-fast image and project file delivery.
- **JWT-Decode**: Client-side session parsing and security checks.

### 4. Specialized Utilities
- **Dayjs**: Highly accurate date/time manipulation for project deadlines.
- **React-Hot-Toast**: Elegant, non-intrusive notifications.
- **React-Select**: Advanced, searchable dropdown components.
- **Web-Vitals**: Continuous monitoring of user experience performance.

---

## 🔑 Global Services & Credentials

The following external services are mandatory for full system functionality:

| Service | Specific Usage | Required Credentials / Keys |
| :--- | :--- | :--- |
| **Razorpay** | Payment Gateway, Wallet Transfers, Milestones. | `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET` |
| **Cloudinary** | Image Hosting, Project Proofs, User Avatars. | `CLOUDINARY_CLOUD_NAME`, `UPLOAD_PRESET` |
| **Firebase** | **Google Identity Service**, Web Hosting. | `apiKey`, `authDomain`, `appId` |
| **PostgreSQL** | Permanent Project & Financial Storage. | `POSTGRES_DATABASE_URL` |
| **Prometheus** | Performance Metric Collection. | Docker Service Configuration |

---

## 🔧 Deployment & environment Variables

### Backend Configuration (`grull-be/.env`)
- **Database Connection**: `POSTGRES_DATABASE_URL`
- **Port**: Default is `8000`.

### Frontend Configuration (`grull-fe_new/.env`)
The frontend must point to the backend API.
```env
# Local Development
REACT_APP_BACKEND=http://127.0.0.1:8000

# Production Transition (Examples)
# REACT_APP_BACKEND=https://api.grull.dev/
# REACT_APP_BACKEND=https://api.dev.grull.work/
```

---
**This manifest covers 100% of the libraries and services that make Grull a state-of-the-art professional marketplace.**
