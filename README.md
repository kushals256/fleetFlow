# FleetFlow 🚚

FleetFlow is a complete, end-to-end Enterprise Resource Planning (ERP) tool designed specifically for mid-market logistics companies. It bridges the gap between disconnected systems by providing a single, cohesive Command Center to manage vehicles, drivers, dispatches, and financial analytics.

Built with a stunning, highly-responsive glassmorphism UI, FleetFlow makes complex fleet operations seamless, efficient, and beautiful.

## ✨ Key Features

- **Command Center Dashboard:** Get a real-time overview of your fleet's operations, including active vehicles, vehicles in maintenance, utilization rates, and pending cargo.
- **Asset & Personnel Management:** Maintain detailed registries of your vehicles (capacity, odometer, status) and drivers (license categories, safety scores).
- **Smart Match Dispatching:** Our automated "Smart Match" algorithm eliminates manual cross-referencing. Just input the cargo weight, and FleetFlow automatically assigns the *smallest capable vehicle* alongside the *safest qualified driver* to maximize fuel efficiency and compliance.
- **Maintenance & Fuel Logs:** Track all running costs directly in Rupees (₹). Dispatchers and drivers can easily log fuel fill-ups or mechanical repairs, feeding directly into the system's financial engine.
- **Operational Analytics:** Visualize your business health with beautiful charts mapping revenue against operating costs, calculating Return on Investment (ROI) per vehicle, and displaying detailed monthly breakdowns.
- **Role-Based Access Control (RBAC):** Secure JWT authentication with specialized roles (Manager, Dispatcher, Safety Officer, Finance).

## 🚀 Tech Stack

### Frontend
- **Framework:** React 18 + Vite
- **Language:** TypeScript
- **State Management:** Zustand
- **Routing:** React Router DOM
- **Styling:** Vanilla CSS variables with custom animations and a premium glassmorphism design system.
- **Icons & Visualization:** Lucide-React & Recharts.

### Backend
- **Framework:** Node.js with Express
- **Language:** TypeScript
- **Database:** SQLite3 (Serverless, zero-configuration database)
- **Authentication:** JSON Web Tokens (JWT) & bcrypt

## 🛠️ Local Setup Instructions

Follow these steps to run FleetFlow on your local machine.

### 1. Start the Backend Server
Open a terminal and navigate to the backend directory:
```bash
cd fleetFlow/server
npm install
npm run dev
```
*The server will start on `http://localhost:3000` and automatically initialize the SQLite database with seed data.*

### 2. Start the Frontend Application
Open a new, separate terminal and navigate to the frontend directory:
```bash
cd fleetFlow/client
npm install
npm run dev
```
*Vite will start the client on `http://localhost:5173`.*

### 3. Login
Open your browser and navigate to `http://localhost:5173`. 
You can register a new account or use the default seeded Manager account:
- **Email:** `admin@fleetflow.com`
- **Password:** `password123`

## 💡 About The Project

FleetFlow was created to solve a major problem in logistics: the reliance on multiple, disconnected tools like separate spreadsheets for drivers and disparate tracking apps for vehicles. By centralizing operations and automating logistics decisions with intelligent algorithms (like *Smart Match*), FleetFlow acts as an active partner in scaling logistics businesses.
