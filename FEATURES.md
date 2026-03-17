# Grull Frontend - Detailed Component & UI Specification

This document provides a detailed breakdown of the features and UI logic implemented in the Grull React application.

---

## 1. Dynamic Chat & Communication Engine
### Message Context Awareness
- **Status Chips**: The `MessageBubble.js` component dynamically renders status indicators (e.g., "Accepted", "Pending", "Rejected") based on the message ID and its database status.
- **Action-Linked Bubbles**: Specific message types (like `NEGOTIATION_PENDING`) render action buttons (Accept/Reject) only for the relevant user.
- **Hybrid Layout**: Centered system messages (e.g., "Job is now Ongoing") are mixed with left/right aligned user bubbles for better readability.

### Real-Time Signal Handling
- **Socket.io Integration**: Uses `socket.io-client` for zero-latency message synchronization.
- **Live UI Updates**: Component states (`setMessages`) are updated immediately upon receiving a socket event, preventing the need for polling.

## 2. Integrated Milestone Management
- **Milestones Tracker**: A top-right popup list that tracks all "Phase 2" project parts.
- **Visual Progress**: Automatically applies `text-decoration: line-through` and `opacity: 0.6` to completed topics.
- **Smart Tooltip**: Real-time feedback in the chat header showing current progress (e.g., "2/5 Deliverables Done").

## 3. Role-Based Interaction Security
- **Dynamic Toolbar Visibility**:
    - **Employer**: Sees the "Plus" (+) icon to initiate project part definitions.
    - **Freelancer**: Sees the "Calendar/Upload" icon to submit proof of work.
- **URL-Level Protection**: `Freelancerchat.js` and `ClientChat.js` perform secondary ID verification to ensure users cannot spoof roles by navigating to direct routes.

## 4. Job Dashboard & Marketplace
- **Fluid browsing**: Responsive grid of job cards with category-specific filtering.
- **Application Portal**: Multi-field forms for freelancers to specify rates and provide detailed proposals.
- **Employer Control Panel**: Consolidated view of all applicants with one-click "Accept Price" functionality.

## 5. Financial Dashboard (Wallet UI)
- **Visual Wallet**: Clean, card-based interface showing current balance.
- **Transaction History**: List of recent inbound/outbound transfers with clear descriptions (e.g., "Payment from 25.ghost.3").
- **Payment Integration**: Razorpay-triggered modal for secure balance recharging.

## 6. Modern Tech Stack & Styling
- **MUI v7 Theming**: Custom-themed Material UI components for a premium, consistent design language.
- **Emotion CSS**: Scoped styling using `@emotion/styled` for component-specific isolation.
- **Animate.css**: Subtle micro-animations on modal appearances and state changes for a polished feel.

## 7. State Management & Navigation
- **React Router v7**: Declarative routing with protected paths and dynamic parameter handling (e.g., `/jobdetails/:jobId`).
- **Axios Interceptors**: Global handling of JWT tokens and error responses to ensure seamless session persistence.
- **React Hot Toast**: Real-time accessible notifications for successful actions and error feedback.
