# 🚀 StayEase — Full-Stack Booking Platform (TypeScript + Vite + MongoDB)

StayEase is a full-stack web application for listing, searching, and booking accommodations with real-time availability.

It uses:

- **Frontend:** React + Vite (TypeScript) — deployed on Render  
- **Backend:** Node.js + Express + TypeScript — deployed on Render  
- **Database:** MongoDB Atlas  
- **Build Tools:** Vite (client), TypeScript Compiler (server)

---

## 📁 Project Structure

        root/
        │── client/ # React + Vite frontend
        │── server/ # Express + TypeScript backend
        │── package.json
        │── README.md


---

## 🛠️ Tech Stack

### **Frontend**
- React + TypeScript  
- Vite  
- Axios  
- Tailwind

### **Backend**
- Node.js  
- Express  
- TypeScript  
- MongoDB + Mongoose  
- dotenv  
- CORS  

---

## ⚙️ Environment Variables

Create a `server/.env` file:

        PORT=5000
        MONGO_URI=your_mongodb_atlas_connection_string
        NODE_ENV=development
        JWT_SECRET=your-secret-key


---

## 🧩 Installation & Setup

### **1️⃣ Clone Repository**
        git clone <your-repo-url>
        cd StayEase

### 2️⃣ Install Dependencies
        npm install
### 3️⃣ Run Development Mode

        npm run dev
        This runs:
        npm run dev:server → Express + TS
        npm run dev:client → Vite frontend

Your apps will run on:

Frontend: http://localhost:5173

Backend: http://localhost:5000

---

## 📜 Available Scripts
        {
          "scripts": {
            "dev": "concurrently \"npm run dev:server\" \"npm run dev:client\"",
            "dev:client": "cd client && vite",
            "dev:server": "cd server && tsx index.ts",
            "build:client": "cd client && vite build",
            "build:server": "cd server && tsc -p tsconfig.server.json",
            "build": "npm run build:client && npm run build:server",
            "start": "node server/dist/index.js"
          }
        }
        
---

## 🚀 Deployment
#### 🌐 Frontend — Render (Static Site)
1. Go to Render → New → Static Site

2. Select repo

3. Set:

        Build Command:    npm run build:client
        Publish Directory: client/dist
   
4. Deploy 🎉

#### ⚡ Backend — Render (Web Service)
1. Go to Render → New → Web Service

2. Select repo

3. Set
   
        Root Directory:   server
        Build Command:    npm run build:server
        Start Command:    node dist/index.js
   
4. Add environment variables

5. Deploy 🎉

---

## 🔗 Production URLs
        
        Frontend: https://your-frontend.onrender.com
        Backend:  https://your-backend.onrender.com

---

## 🧠 Proposal (Project Idea Overview)
#### Problem:

Travelers often struggle to find reliable short-term accommodations, and property owners lack an organized platform to manage listings and bookings. The process becomes inefficient, scattered, and time-consuming for both sides.

#### Solution:

1. StayEase provides a streamlined platform offering:

2. Secure user authentication (JWT)

3. Easy property listing and management

4. Real-time accommodation search & filtering

5. Fast booking system with history tracking

6. Image upload support for property photos

7. A smooth React + Express architecture for scalability

#### Outcome:

A reliable, user-friendly, and scalable booking platform that simplifies accommodation browsing, listing, and reservation — benefiting both travelers and property owners.

#### 📜 Commands Summary
| Task                                            | Command                                                     |
| ----------------------------------------------- | ----------------------------------------------------------- |
| **Clone Repository**                            | `git clone <repo-url>`                                      |
| **Install All Dependencies**                    | `npm install`                                               |
| **Run Full Development (Frontend + Backend)**   | `npm run dev`                                               |
| **Run Backend Only**                            | `cd server && npm run dev:server`                           |
| **Run Frontend Only**                           | `cd client && npm run dev:client`                           |
| **Build Frontend**                              | `cd client && npm run build:client`                         |
| **Build Backend**                               | `cd server && npm run build:server`                         |
| **Start Production Server**                     | `npm start`                                                 |
| **Deploy Backend (Render)**                     | Build: `npm run build:server` → Start: `node dist/index.js` |
| **Deploy Frontend (Render / Vercel / Netlify)** | Build: `npm run build:client` → Publish: `client/dist`      |

---

## 🧑‍💻 Contributing

Pull requests and suggestions are welcome!
