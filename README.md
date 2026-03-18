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
