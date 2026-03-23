# 🛏️ Moden Furniture - Interactive 2D & 3D Visualization

> A full-stack interactive 2D and 3D furniture visualization application built for PUSL3122 HCI, Computer Graphics and Visualization.

**Project Model:** Interactive Workspace & Retail Consultation Tool
**Module:** PUSL3122 HCI, Computer Graphics and Visualization
**University:** Plymouth University

A comprehensive web application tailored for interior designers and retail clients. It features secure role-based access, an interactive 2D layout editor with real-time collision detection, instant realistic 3D scene rendering, procedural 3D furniture generation, and persistent project portfolio management.

## Architecture

**MERN Stack SPA** - Robust client-server architecture utilizing a React Single Page Application (SPA) frontend. It features localized state management for 2D object manipulation and seamless viewport conversion that maps directly to a WebGL 3D canvas, connected to a custom RESTful "DesignAPI" service layer.

## Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React.js, HTML5, CSS |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB (JSON serialization for layout states) |
| **Graphics & 3D** | WebGL, Three.js, React-Three-Fiber, React-Three-Drei |
| **Collision Logic** | Custom Axis-Aligned Bounding Box (AABB) Algorithm |
| **Modeling** | Procedural 3D Modeling with Physically Based Rendering (PBR) |
| **State Tracking** | Custom History Stack Array (Undo/Redo functionality) |

## Design System

* **Primary Theme:** Dark Theme / Monochromatic Grays (Palette 1 - chosen via A/B testing for visual comfort and reduced eye strain).
* **Accent Color:** Light Grey / White (reserved for primary calls-to-action like the 3D Render toggle for clear system feedback).
* **Card Design:** Circular Image Cards (Design A layout - preferred for premium brand perception).
* **Interaction Layout:** Maximized central workspace with essential tools accessible on a left-aligned sidebar.

## Features

### 1.0 Designer & Client Features

| Feature | Description | Status |
| :--- | :--- | :---: |
| 1.1 User Registration | Secure account creation for designers | ✅ |
| 1.2 Authentication | Secure login & password reset via temporary tokens | ✅ |
| 1.3 Profile Management | User profile management dashboard | ✅ |
| 1.4 Room Specification | Input exact room dimensions, select wall & floor colors | ✅ |
| 1.5 2D Layout Creation | Interactive 2D grid with real-time drag-and-drop mechanics | ✅ |
| 1.6 3D Visualization | Instant 2D-to-3D toggle using React-Three-Fiber | ✅ |
| 1.7 Item Manipulation | Scale (W/D sliders), rotate, and reposition furniture | ✅ |
| 1.8 Collision Detection | AABB algorithm preventing overlapping/out-of-bound items | ✅ |
| 1.9 Aesthetic Customization | Dedicated color picker and global lighting/shading controls | ✅ |
| 1.10 Project Management | Save, retrieve, edit, and delete layouts via MongoDB | ✅ |
| 1.11 Undo/Redo System | Custom history stack for error prevention and recovery | ✅ |

### 2.0 Admin Features

| Feature | Description | Status |
| :--- | :--- | :---: |
| 2.1 Admin Dashboard | Visual charts tracking new account creation | ✅ |
| 2.2 User Management | Secure interface for managing access (Ban/Unban users) | ✅ |

---

## Project Structure

```text
coursework-group-250/
├── backend/
│   ├── src/
│   │   ├── controllers/  # Business logic (Design API, Auth logic)
│   │   ├── middleware/   # Authorization, error handling
│   │   ├── models/       # MongoDB schemas (User, Layout Designs)
│   │   ├── routes/       # RESTful API endpoints
│   │   └── server.js     # Express server entry point
│   └── package.json
└── frontend/
    ├── src/
    │   ├── components/   # Reusable UI (2D Grid, 3D Canvas, Controls)
    │   ├── pages/        # Route components (Home, Editor, Dashboard)
    │   ├── services/     # API integration (DesignAPI service layer)
    │   └── App.jsx       # Main React component & routing
    └── package.json
