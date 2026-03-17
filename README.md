# Grull Frontend

This repository contains the React frontend for the Grull application.

## Tech Stack

### Core
- **Framework**: [React 19](https://react.dev/)
- **Language**: TypeScript / JavaScript
- **Build Tool**: `react-scripts`

### UI & Styling
- **Design System**: [Material UI (MUI) v7](https://mui.com/)
- **Styling**: Vanilla CSS, Emotion (@emotion/react)
- **Animations**: [Animate.css](https://animate.style/)
- **Components**: `react-bootstrap` (Select components)
- **Icons**: `react-icons`, `@mui/icons-material`

### State & Navigation
- **Routing**: [react-router-dom v7](https://reactrouter.com/)
- **API Client**: [Axios](https://axios-http.com/) (Handling REST API calls)

### Real-time & Backend Services
- **Real-time**: [socket.io-client](https://socket.io/docs/v4/client-api/) (Handling real-time chat updates)
- **Backend-as-a-Service**: [Firebase](https://firebase.google.com/) (Used for specific features or hosting)

### Utilities
- **Date Handling**: [dayjs](https://day.js.org/)
- **Auth Tokens**: `jwt-decode`
- **URL Parsing**: `query-string`
- **Feedback**: `react-hot-toast` (Notifications)

## Setup & Running
First, install the dependencies:
```bash
npm install
```
Then, run the development server:
```bash
npm run dev
```
The application will be available at `http://localhost:3000`.
