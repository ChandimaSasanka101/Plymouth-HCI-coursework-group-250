# 🛏️ Moden Furniture - Interactive 2D & 3D Visualization

> An interactive web-based 2D and 3D furniture visualization application built for interior designers and retail clients.

**Module:** PUSL3122 – HCI, Computer Graphics and Visualization  
**Group:** 250

---

## 📋 Table of Contents

- [About the Project](#about-the-project)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Team](#team)
- [Screenshots](#screenshots)
- [Video Demo](#video-demo)
- [License](#license)

---

## About the Project

**Moden Furniture** is a full-stack web application that enables interior designers and retail clients to design, visualize, and manage room layouts in both 2D and 3D. The application solves the real-world retail challenge of *spatial anxiety* — customers buying furniture that doesn't fit their space — by providing an immersive, real-time visualization tool.

The project was developed using an agile methodology with continuous user research, iterative prototyping (paper → Figma → React), and three rounds of user surveys involving industry professionals.

---

## Features

### 🔐 User Access & Security
- Secure login and registration for designers
- Password reset system using temporary tokens
- Role-based access control (Designer vs. Admin)

### 🗺️ Core Design Functionality
- Interactive **2D Layout Editor** with exact room dimension inputs
- Drag-and-drop furniture placement on a grid canvas
- Instant **2D → 3D rendering toggle** using React-Three-Fiber
- 360-degree OrbitControls for full 3D room inspection

### ✏️ Design Modification
- Scale and rotate individual furniture pieces
- Per-item and global color customization
- Real-time **collision detection** (AABB algorithm) to prevent overlapping
- Undo/Redo support via a custom history stack

### 💾 Project Management
- Save, edit, and delete room designs (persisted to MongoDB)
- Design Management Dashboard with search functionality

### 🛡️ Admin Capabilities
- Visual charts tracking new account creation
- User management (ban/unban accounts)

---

## Tech Stack

| Layer       | Technology                                      |
|-------------|-------------------------------------------------|
| Frontend    | React.js (SPA), CSS                             |
| 3D Graphics | Three.js, React-Three-Fiber, React-Three-Drei   |
| Backend     | Node.js, Express.js                             |
| Database    | MongoDB                                         |
| API Layer   | RESTful API (custom `DesignAPI` service)        |
| Auth        | Session-based with token-reset flow             |

> The application uses **WebGL via Three.js** for real-time rasterization-based 3D rendering, satisfying the module's graphics implementation requirement. All 3D furniture models are **procedurally generated** using Three.js primitive geometries and Physically Based Rendering (PBR) materials — no external `.gltf` files are loaded.

---

## Getting Started

### Prerequisites

- Node.js (v18+)
- npm or yarn
- MongoDB (local instance or MongoDB Atlas URI)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ChandimaSasanka101/Plymouth-HCI-coursework-group-250.git
   cd Plymouth-HCI-coursework-group-250
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../furniture-app
   npm install
   ```

4. **Configure environment variables**

   Create a `.env` file in the `/backend` directory:
   ```env
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   PORT=5000
   ```

5. **Run the application**

   In one terminal (backend):
   ```bash
   cd backend
   npm start
   ```

   In another terminal (frontend):
   ```bash
   cd furniture-app
   npm start
   ```

6. **Open in browser**
   ```
   http://localhost:3000
   ```

---

## Project Structure

```
Plymouth-HCI-coursework-group-250/
├── furniture-app/              # React frontend (SPA)
│   └── src/
│       ├── pages/
│       │   └── Design.jsx      # 2D/3D editor core component
│       ├── components/         # Reusable UI components
│       └── services/
│           └── DesignAPI.js    # API service layer
├── backend/                    # Node.js + Express backend
│   ├── routes/                 # API route handlers
│   ├── models/                 # MongoDB Mongoose schemas
│   └── controllers/            # Business logic
└── README.md
```

---

## Team

| Student ID | Name                        | Role                                      |
|------------|-----------------------------|-------------------------------------------|
| 10953004   | Duhudu A Wijesinghe         | Project Leader & Backend Developer        |
| 10952755   | Kandana Chandima Sasanka    | UI/UX Design Lead & Frontend Developer    |
| 10953031   | M M M S Muhandiram          | Frontend Developer & User Testing         |
| 10952719   | K H M R D Karunarathna      | Frontend Developer (Registration)         |
| 10953029   | R R Kasun Rathnayake        | Frontend Developer (Authentication)       |
| 10953030   | P M Undugoda                | Frontend Developer & UX Researcher        |

---

## Screenshots

> Paper prototypes → Figma high-fidelity mockups → Final React implementation.

The application went through three design phases informed by user research:
- **Survey 1** (10 respondents): Requirement gathering with industry professionals
- **Survey 2** (25 respondents): Color palette & accessibility validation → Monochromatic/dark theme selected
- **Survey 3** (28 respondents): A/B testing of two UI layouts → Design A (circular cards) adopted (60.7% preference)

---

## Video Demo

- 🎬 **YouTube:** [https://youtu.be/CT-_IAtLQyY3](https://youtu.be/CT-_IAtLQyY3)
- 📁 **OneDrive:** [View Presentation](https://liveplymouthacmy.sharepoint.com/:f:/g/personal/10953031_students_plymouth_ac_uk/IgB6gc4vh8n0SqsfNJxHPgybAZd0MD3EvSLooQAkVAhhdRE?e=wxeYL8)

---

## Key Implementation Details

### Collision Detection
Furniture overlap prevention is implemented using an **Axis-Aligned Bounding Box (AABB)** algorithm, preventing items from being placed on top of each other or outside room boundaries.

### 2D Drag-and-Drop
Built from scratch using native mouse event listeners — no third-party drag-and-drop libraries. Mouse offsets are calculated relative to the container's bounding rectangle to update X/Z coordinates in real time.

### Undo/Redo
A custom **history stack array** captures snapshots of the items state on every successful user interaction, enabling seamless forward/backward navigation through design states.

### Procedural 3D Models
All furniture models (tables, chairs, beds, etc.) are generated procedurally using Three.js `BoxGeometry` primitives with `meshStandardMaterial` and `meshPhysicalMaterial` for realistic surface simulation (e.g., tempered glass table tops, high-gloss varnish on cupboards).

---

## Known Limitations

1. **Mobile/Touch Support** — The 2D editor's drag-and-drop was optimized for desktop mouse events. Dedicated touch-event handlers are needed for tablet/mobile support.
2. **Real-time Global Illumination** — Full dynamic light bounce calculation is too resource-intensive for browser-based environments on older hardware. Currently uses optimized shadow mapping with a global lighting slider.

---

## Module

**PUSL3122 – HCI, Computer Graphics and Visualization**  
Supervisor: Dr. Taimur Bakhshi  
Deadline: 19/03/2026
