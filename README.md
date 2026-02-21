## 📖 Overview

**FleetFlow** modernizes mid-market logistics operations. Traditional fleet companies suffer from fragmented operations—vehicles are tracked on a whiteboard, drivers are scheduled via disparate spreadsheets, and fuel logs exist strictly on paper receipts. 

FleetFlow consolidates every moving part of a logistics operation into a single, cohesive, web-based **Command Center**. Utilizing a beautiful, modern *glassmorphism* UI, FleetFlow allows managers to gain real-time visibility into their fleet operations and actively scale their business using intelligent automation tools.

---

## ✨ Core Features

### 1. 🎛️ Live Command Center Dashboard
- **Real-Time KPIs:** Instantly view active vehicles, assets sent to maintenance (In Shop), overall fleet utilization percentage, and pending cargo loads.
- **Glassmorphism UI:** Built with premium, highly responsive user interface principles utilizing soft shadows, translucent panels, and smooth micro-animations.

### 2. 🤖 "Smart Match" Dispatch Algorithm
- **Automated Routing:** No more manual cross-referencing. Input the required cargo weight, and FleetFlow's exact-match algorithm will instantly query the database.
- **Efficiency First:** The system automatically selects the *smallest capable vehicle* to minimize overhead fuel costs.
- **Safety Compliant:** The system pairs that vehicle exclusively with the *highest-rated*, safely-licensed driver available for that specific vehicle class.
- **Atomic Transactions:** Uses secure SQLite transactions to simultaneously ensure vehicles and drivers are locked into the dispatch without race conditions.

### 3. 👥 Comprehensive Registry & HR Tracking
- **Vehicle Fleet Registry:** Track vehicle models, classes (e.g., Heavy Truck, Van), maximum payload capacities (kg), and live odometer readings.
- **Driver Management:** Track driver names, specialized license qualifications, unique safety scores, and employment statuses.

### 4. 📈 Operational & Financial Analytics
- **Live ROI Tracking:** An integrated analytics engine aggregates all expected revenues against real-world fuel and maintenance costs to calculate net profits in Rupees (₹).
- **Data Visualization:** Interactive bar charts built with Recharts clearly visualize operational trends over custom periods.

### 5. 🔒 Enterprise-Grade Security
- **JWT Authentication:** Stateful token-based access with localized storage persistence.
- **Role-Based Access Control (RBAC):** Customized access for specific roles — *Managers*, *Dispatchers*, *Safety Officers*, and *Finance Analysts*.

---

## �️ Technology Stack

FleetFlow operates on a modern, robust, TypeScript-first architecture.

### 💻 Frontend Client
- **Framework:** React 18 + Vite
- **Language:** TypeScript
- **State Management:** Zustand (Global store with localized Auth persistence)
- **Routing:** React Router v6
- **Styling/UI:** Custom Vanilla CSS (Design-system tokens, variables, keyframe animations)
- **Icons & Charts:** Lucide-React & Recharts

### ⚙️ Backend Server
- **Runtime:** Node.js + Express.js
- **Language:** TypeScript
- **Database:** SQLite3 (Serverless, local file-based database configured for high-concurrency transactions)
- **Security:** `bcrypt` (Password hashing) & `jsonwebtoken` (Auth)
- **Architecture:** Modular REST API

---

## 🗂️ Project Structure

```text
fleetFlow/
├── client/                     # React Frontend
│   ├── src/
│   │   ├── components/         # Reusable UI (FormInput, Layout, Modal, StatusPill, Toast)
│   │   ├── pages/              # Primary Routes (Analytics, Dashboard, Dispatch, Login, etc.)
│   │   ├── store/              # Zustand Global State (fleetStore.ts)
│   │   ├── App.tsx             # Root Component & Router
│   │   └── index.css           # Global Design System (Glassmorphism & Vars)
│   └── package.json    
├── server/                     # Express Backend
│   ├── src/
│   │   ├── db/                 # SQLite configuration and DB initialization
│   │   ├── middleware/         # Security (auth.ts & RBAC)
│   │   ├── routes/             # REST Endpoints (auth, drivers, logs, trips, vehicles)
│   │   ├── server.ts           # Express Application Entry
│   │   └── setup.ts            # Bootstrapper for seeding default Dev data
│   ├── app.db                  # Local SQLite Database file
│   └── package.json
└── README.md
```

---

## 🚀 Local Installation & Setup

You will need two separate terminal windows to run the frontend and backend concurrently.

### 1. Initialize the Backend (Terminal 1)
```bash
# Navigate to the server directory
cd server

# Install dependencies
npm install

# Start the development server (Defaults to Port 3000)
npm run dev
```
*(Note: Upon its first run, `setup.ts` will automatically build the `app.db` SQLite database and seed it with dummy vehicles, drivers, and the admin account).*

### 2. Initialize the Frontend (Terminal 2)
```bash
# Navigate to the client directory
cd client

# Install dependencies
npm install

# Start the Vite development build
npm run dev
```
*(Vite will serve the client at `http://localhost:5173`)*

### 3. Accessing the System
Navigate to `http://localhost:5173` in your browser. 
Use the pre-seeded admin account to explore the dashboard:
- **Email:** `admin@fleetflow.com`
- **Password:** `password123`

*(You can also use the 'Register here' link on the login page to provision a new user under a different Operational Role.)*

---

## 📡 API Reference Schema

All endpoints are prefixed with `/api` and require an `Authorization: Bearer <token>` header (except Auth routes).

### Authentication (`/api/auth`)
- `POST /login`: Authenticates user and returns JWT.
- `POST /register`: Creates a new user with encrypted password.
- `GET /me`: Returns details of the currently authenticated user.

### Vehicles (`/api/vehicles`)
- `GET /`: Returns the fleet registry.
- `POST /`: Adds a new vehicle to the registry.
- `PATCH /:id/status`: Updates a specific vehicle's operational status.

### Drivers (`/api/drivers`)
- `GET /`: Returns the personnel registry.
- `POST /`: Registers a new driver.

### Trips & Dispatch (`/api/trips`)
- `GET /`: Lists all historical and active dispatches.
- `POST /dispatch`: **(Transaction)** Initiates the Smart Match dispatch—updates trip, driver, and vehicle tables atomically.
- `POST /:id/complete`: Marks a trip as done and releases assigned assets back to `AVAILABLE`.

### Maintenance & Logs (`/api/logs`)
- `GET /`: Fetches all fuel and repair logs.
- `POST /`: Submits a new financial log against a specific vehicle.

### Analytics (`/api/analytics`)
- `GET /`: Aggregates the raw JSON payload summarizing fleet business performance based on Dispatches and Logs.

---

## 🔮 Future Roadmap Themes
1. **Live GPS Tracking:** Integrating Mapbox or Google Maps APIs to visually plot `ON_TRIP` vehicles in real-time.
2. **Predictive Maintenance ML:** Implementing a lightweight regression model to warn managers *before* a vehicle breaks down based on the frequency of `IN_SHOP` log submissions.
3. **Automated Client Billing:** Generating PDF invoices for completed trips instantly.

---

## 👥 Team & Contributions

This project was built collaboratively during the hackathon. Here is our team breakdown:

- **Kushal S** 
  - **Role:** Full-Stack Developer & Architect 
  - **Contributions:** Led the overall system architecture, implemented the backend SQLite schema, developed the automated "Smart Match" dispatch algorithm, and built the core React dashboard components.

- **Neal** 
  - **Role:** Frontend & UI/UX Designer
  - **Contributions:** Designed the glassmorphism UI system, developed the Recharts financial analytics views, and implemented the generalized CSS styles and animations.

- **Jayanth** 
  - **Role:** Backend Developer
  - **Contributions:** Implemented the JWT Authentication, Role-Based Access Control (RBAC) middleware, and the REST endpoints for Vehicle and Driver registries.

- **Pushkar** 
  - **Role:** Product Manager & Presentation
  - **Contributions:** Directed feature prioritization, wrote the project documentation and Voiceover scripts, and conducted QA testing across all dispatch workflows.

*(Note: Please replace the placeholder names and roles above with your actual team members before submission!)*

---

## 🤝 Contribution & License

Created exclusively as an ERP Logistics software submission. 
Codebase is open-source under the **MIT License**. Standard contribution rules apply: fork, branch, test, and submit a PR!
