# 🏡 StayEase – Full-Stack Booking Platform (TypeScript + Vite + MongoDB)

StayEase is a full-stack web application for listing, searching, and booking accommodations with real-time availability.

Users can browse stays, apply rich filters, and make bookings, while hosts can create and manage listings. The platform is built with a modern TypeScript stack and deployed fully on Render.

---

# 🌐 Live Demo Links

| Module                 | Deployment | URL                                           |
| ---------------------- | ---------- | --------------------------------------------- |
| **Frontend (Client)**  | Render     | https://stayease-2-lkca.onrender.com/         |
| **Backend (API Server)** | Render   | https://stayease-1-mijo.onrender.com/         |

---

# 📂 Project Structure

        StayEase/
        │
        ├── client/ # React + Vite frontend (TypeScript)
        │ ├── src/
        │ │ ├── components/ # UI components (ListingCard, SearchFilters, Header, etc.)
        │ │ ├── pages/ # Route pages (Home, SearchResults, Listings, Bookings, Reviews)
        │ │ ├── hooks/ # Reusable React hooks
        │ │ ├── lib/ # API helpers / utilities
        │ │ ├── main.tsx # App entry
        │ │ └── index.css # Global styles
        │ ├── public/
        │ ├── index.html
        │ ├── tailwind.config.ts
        │ └── vite.config.ts
        │
        ├── server/ # Express + TypeScript backend
        │ ├── models/ # Mongoose models (Listing, Booking, Review, User)
        │ ├── dist/ # Compiled JS output (production)
        │ ├── scripts/ # Build / tooling scripts
        │ ├── bookingsRoutes.ts # Booking-related routes
        │ ├── listingsRoutes.ts # Listing-related routes (search, CRUD)
        │ ├── routes.ts # Route aggregator
        │ ├── db.ts # MongoDB connection
        │ ├── storage.ts # File storage helpers
        │ ├── index.ts # Server entry point
        │ ├── tsconfig.server.json
        │ └── vite.ts # Dev tooling config
        │
        ├── uploads/ # Uploaded assets (local/dev)
        ├── attached_assets/ # Design or static assets
        ├── shared/ # Shared configs / utilities
        ├── design_guidelines.md # Design system / UI guidelines
        ├── components.json # UI component config (for tooling)
        ├── package.json # Root scripts (dev, build, start)
        ├── package-lock.json
        ├── tsconfig.json # Root TS config
        ├── postcss.config.cjs
        ├── jsconfig.json
        ├── vercel.json # Hosting config (optional)
        └── README.md

---

# 🚀 Tech Stack

## Frontend

- React + TypeScript  
- Vite  
- Tailwind CSS  
- Axios  
- React Router  

## Backend

- Node.js  
- Express  
- TypeScript  
- MongoDB + Mongoose  
- dotenv  
- CORS  
- JWT Authentication (for protected routes)

## Deployment & Database

- Render – Frontend (static)  
- Render – Backend (web service)  
- MongoDB Atlas – Database  

---

# ⚙️ Environment Variables

Create a `server/.env` file:

        PORT=5000
        MONGO_URI=your_mongodb_atlas_connection_string
        NODE_ENV=production
        JWT_SECRET=your-secret-key


Create a `client/.env` file:

        VITE_API_URL=https://stayease-1-mijo.onrender.com


---

# 🧩 Installation & Local Setup

## 1️⃣ Clone Repository
        git clone <your-repo-url>
        cd StayEase


## 2️⃣ Install Dependencies (Root)
        npm install

This installs dependencies for both `client` and `server` via the root config (or install separately if preferred).

## 3️⃣ Run in Development Mode
        npm run dev


This runs:

- `npm run dev:server` → Express + TypeScript backend  
- `npm run dev:client` → Vite React frontend  

Default dev URLs:

- Frontend: http://localhost:5173  
- Backend:  http://localhost:5000  

---

# 📜 Available Scripts (Root)

        {
        "scripts": {
        "dev": "concurrently "npm run dev:server" "npm run dev:client"",
        "dev:client": "cd client && vite",
        "dev:server": "cd server && tsx index.ts",
        "build:client": "cd client && vite build",
        "build:server": "cd server && tsc -p tsconfig.server.json",
        "build": "npm run build:client && npm run build:server",
        "start": "node server/dist/index.js"
        }
        }


---

# 🚀 Deployment

## 🌐 Frontend – Render (Static Site)

        Root Directory: client
        Build Command: npm run build:client
        Publish Directory: client/dist


## ⚡ Backend – Render (Web Service)

        Root Directory: server
        Build Command: npm run build:server
        Start Command: node dist/index.js


Add the same environment variables from `server/.env` in the Render dashboard for the backend service.

---

# 🔗 Production URLs

        Frontend: https://stayease-2-lkca.onrender.com/
        Backend: https://stayease-1-mijo.onrender.com/


---

# 🧠 Project Overview

StayEase aims to streamline the process of finding and managing short‑term accommodations.

**Key capabilities:**

1. Secure authentication for users (guests/hosts).  
2. Host tools to create and manage property listings.  
3. Rich search and filtering over location, price, dates, and type.  
4. Booking flow with history tracking.  
5. Image support for listings.  
6. Clean React + Express architecture for scalability and maintainability.

---

## 📜 Commands Summary

| Task                                      | Command                                  |
| ----------------------------------------- | ---------------------------------------- |
| Clone Repository                          | `git clone <repo-url>`                   |
| Install All Dependencies                  | `npm install`                            |
| Run Full Development (Frontend + Backend) | `npm run dev`                            |
| Run Backend Only                          | `cd server && npm run dev:server`        |
| Run Frontend Only                         | `cd client && npm run dev:client`        |
| Build Frontend                            | `cd client && npm run build:client`      |
| Build Backend                             | `cd server && npm run build:server`      |
| Build Full Project                        | `npm run build`                          |
| Start Production Server                   | `npm start`                              |

---

## 🧑‍💻 Contributing

Pull requests and suggestions are welcome.

---

## ✨ **Maintainer**

👩‍💻 **Suhaani Garg**
Full-Stack Developer • Project Lead

---
