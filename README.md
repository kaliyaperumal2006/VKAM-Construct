# ApexConstruct - Building Constructor Website

ApexConstruct is a full-stack web application designed for a premium Building Constructor business. 

It allows clients to:
1. Browse high-grade building construction materials (Standard, Premium, Luxury) across different structure types (Home, Shop, Commercial Building).
2. Input their square footage and structure preferences to calculate instant, accurate construction quotes and budget ranges.
3. Apply for construction projects and track their application review status in real-time.

It allows administrators (builders) to:
1. Manage structure types, modify base rates per square foot, and update price multipliers.
2. Edit detailed material specs for each package level.
3. View client construction requests, update their status (Pending, Under Review, Approved, Declined), and append engineer inspection updates.

---

## Technical Stack

- **Frontend**: React.js (Vite) with premium custom responsive CSS (dark gold theme with glassmorphism).
- **Backend**: Node.js + Express.js API.
- **Database**: MongoDB (configured for MongoDB Atlas cloud hosting).

---

## Directory Structure

```
B:\Building Constructor\
├── backend\                 # Express REST API
│   ├── config\              # MongoDB database connection
│   ├── models\              # Mongoose database schemas (User, Structure, Application)
│   ├── routes\              # Route handlers (auth, structures, applications)
│   ├── middleware\          # JSON Web Token verification
│   ├── .env                 # API environment configuration (ports, secrets, Atlas URI)
│   ├── seed.js              # Database seed script (creates default structures & admin)
│   └── server.js            # Express server entry point
├── frontend\                # React (Vite) client
│   ├── src\
│   │   ├── components\      # Shared UI (Navbar, Footer)
│   │   ├── context\         # Global state & Authentication (AuthContext)
│   │   ├── pages\           # Home, MaterialGuide, Estimator, Tracker, AdminLogin, AdminDashboard
│   │   ├── index.css        # Premium custom theme stylesheet
│   │   └── App.jsx          # Hash-based routing layout
│   └── index.html           # Main HTML (SEO optimized title and meta tags)
└── README.md
```

---

## How to Set Up & Run

### 1. Database Configuration (MongoDB Atlas)

Since the database is hosted online, you should configure your connection string:
1. Open the [backend/.env](file:///B:/Building%20Constructor/backend/.env) file.
2. Replace the `MONGODB_URI` placeholder with your actual **MongoDB Atlas connection URI**:
   ```env
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxxx.mongodb.net/building_constructor?retryWrites=true&w=majority
   ```
3. *(Optional)* Update the `JWT_SECRET` with a secure random key.

> **💡 Note: Offline Demo Mode Fallback**
> If the backend cannot connect to a database or is offline, the application will automatically enter **Offline Demo Mode**.
> - **Estimator & Apply**: Submitting requests will save them to your browser's local storage.
> - **Tracker**: You can search for local requests, or input the demo ID: `BC-DEMO12` to see a sample timeline.
> - **Admin Dashboard**: You can log in using username `admin` and password `admin123`. Any changes to prices, materials, or applications will be saved locally inside your browser's Cache, ensuring a fully functional mock presentation.

---

### 2. Run the Backend API

To seed default data and start the server:

1. Open a terminal in the `backend` folder and run the seed script to create the admin user and standard materials checklist:
   ```bash
   node seed.js
   ```
2. Start the backend developer server:
   ```bash
   npm run dev
   ```
   *The API will start running at `http://localhost:5000`.*

---

### 3. Run the Frontend React App

To start the Vite development server:

1. Open a terminal in the `frontend` folder.
2. Run the development server:
   ```bash
   npm run dev
   ```
   *Vite will compile and serve the frontend local URL (e.g. `http://localhost:5173`). Open this link in your web browser.*

---

## Default Login Credentials (Admin)
- **Username**: `admin`
- **Password**: `admin123`
