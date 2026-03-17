# Grull: Full-Stack Technology & Services Overview

This document provides a consolidated list of the technologies, frameworks, and third-party services used across both the Frontend and Backend of the Grull platform.

---

## 🛠️ Combined Technology Stack

### Backend (Python/FastAPI)
- **Framework**: FastAPI (Async high-performance web framework)
- **Database**: PostgreSQL (Relational Database)
- **ORM**: SQLAlchemy 2.0 (Asynchronous ORM)
- **Migrations**: Alembic (Database schema version control)
- **Real-Time**: Socket.io (via `python-socketio`)
- **Server**: Gunicorn / Uvicorn (ASGI/WSGI)
- **Validation**: Pydantic v1.10
- **Auth**: FastAPI-Users (JWT-based session management)
- **Monitoring**: Prometheus (Metrics) & Grafana (Visualization)

### Frontend (React/JavaScript)
- **Framework**: React 19 (Modern UI library)
- **UI System**: Material UI (MUI) v7 (Premium design components)
- **Routing**: React Router v7
- **Styling**: Vanilla CSS, Emotion (@emotion/styled), Animate.css
- **API Client**: Axios (HTTP requests)
- **Real-Time**: Socket.io-client
- **Utilities**: Dayjs (Dates), JWT-Decode (Auth), React-Hot-Toast (Notifications)

---

## 🌐 Third-Party Services & Dependencies

The following external services are required for the full functionality of the platform:

| Service | Category | Usage | Required Credentials |
| :--- | :--- | :--- | :--- |
| **Razorpay** | Payments | Handling funds, wallet recharges, and transactions. | `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET` |
| **Cloudinary** | Asset Mgmt | Hosting and delivering user-uploaded images and project files. | `CLOUDINARY_CLOUD_NAME`, `UPLOAD_PRESET` |
| **Firebase** | Infrastructure | Used for frontend hosting and potential future auth/analytics. | `firebase-tools`, `firebase.json` configuration |
| **PostgreSQL** | Database | Core relational data storage (Self-hosted or Cloud). | `POSTGRES_DATABASE_URL` |
| **Prometheus** | Monitoring | Collecting real-time system performance metrics. | Integrated via Backend `instrumentator` |
| **Grafana** | Monitoring | Visualizing system health and API usage. | Connected to Prometheus data source |

---

## 🔑 Environment Variables Summary

### Backend (`grull-be/.env`)
```env
POSTGRES_DATABASE_URL=postgresql+asyncpg://<user>:<password>@<host>:<port>/<db_name>
```

### Frontend (`grull-fe_new/.env`)
```env
REACT_APP_BACKEND=http://127.0.0.1:8000
REACT_APP_CLOUDINARY_CLOUD_NAME=dlpcihcmz
REACT_APP_CLOUDINARY_UPLOAD_PRESET=er103mfg
```

---
**This documentation ensures all team members have a clear understanding of the project's technological dependencies.**
