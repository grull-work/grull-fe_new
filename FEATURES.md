# Grull Frontend - Detailed Features

This document outlines the frontend features and user experience implemented in the Grull React application.

## 1. User Experience & UI
- **Modern Dashboard**: Intuitive interfaces for both clients and freelancers to manage their activities.
- **Responsive Design**: Built with Material UI (MUI) v7 for a consistent experience across desktop and mobile.
- **Interactive Feedback**: Real-time notifications (toasts) and visual status chips in chat.

## 2. Dynamic Chat Interface
- **State-Aware Bubbles**: Message bubbles that change appearance and actions based on the message status (e.g., Pending, Accepted).
- **Negotiation Tools**: Dedicated UI for proposing and accepting price changes directly within the chat.
- **Role-Restricted Tools**: Dynamic visibility of tools (like the Plus icon for clients or Calendar for freelancers) based on user roles.

## 3. Milestone & Project Management
- **Milestone Tracker**: A dedicated header-based popup to view all project parts.
- **Auto-Progress**: Visual feedback (strike-through) when a project part is submitted and accepted.
- **Project Part Definition**: Guided workflow for clients to define specific topics and deadlines for a project.

## 4. Job Marketplace UI
- **Browse & Discovery**: Powerful browsing interface to find and filter relevant jobs.
- **Detailed Job Pages**: Comprehensive views of job requirements, budgets, and applicant counts.
- **Application Workflow**: Step-by-step proposal submission for freelancers.

## 5. Account & Finance Dashboard
- **Profile Customization**: Visual editor for user profiles, skills, and company details.
- **Wallet Overview**: Real-time balance display and transaction history.
- **Account Security**: Secure login and registration flows with error handling.

## 6. Real-Time Capabilities
- **Live Updates**: Instant message reception and status changes without page refreshes via Socket.io.
- **Online Presence**: (Planned) Visual indicators for user availability.
