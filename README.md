# 🎓 Campus Skill Network

> **"Connect. Learn. Share. Grow."**  
> *A peer-to-peer micro-mentorship and skill-sharing web platform built specifically for college campuses.*

---

## 🌟 Overview

Students on every college campus possess diverse technical, creative, and academic skills — ranging from **Data Structures & Algorithms, Python, and Full-Stack Web Development** to **Public Speaking, Aptitude Prep, Music, and Sports**. However, students rarely have a structured, safe, and transparent directory to discover peers who can mentor them in these subjects.

**Campus Skill Network** bridges this divide. It empowers any student to simultaneously act as both a **Learner** and a **Mentor**, schedule 1-on-1 sessions at approved campus zones, collaborate via real-time chat, and earn verifiable peer feedback ratings.

---

## ✨ Key Features

- 🔐 **College Email Verification & Authentication**: Secure registration requiring official institutional emails, bcrypt password hashing, and stateless JWT tokens.
- 🔄 **Dual Learner-Mentor Role**: No permanent student typecasting. A student can teach Python while learning Acoustic Guitar.
- 🔍 **Skill Catalog & Mentor Discovery**: Search by keyword, filter by domain categories (Programming, AI/ML, Communication, Aptitude, Arts, etc.), department, and year.
- 📩 **Mentorship Requests**: Formal 1-on-1 request system with proposed dates, custom notes, and real-time state tracking (Pending, Accepted, Rejected, Cancelled).
- 🕒 **Mentor Availability Calendar**: Mentors specify open meeting windows between lectures and exams.
- 📍 **Approved Safe Campus Meeting Locations**: Sessions are bound to safe, physical on-campus zones (e.g. Central Library Commons, Tech Labs, Student Center).
- 💬 **Real-Time Chat (Socket.IO)**: Peer-to-peer instant messaging with typing indicators, read receipts, and MongoDB persistence.
- 🔔 **Instant Notifications**: Real-time push and persistent alerts for requests, schedule confirmations, chat messages, and reviews.
- ⭐ **Feedback & Star Rating Engine**: Learners submit 1–5 star reviews and comments after completed sessions, automatically updating mentor ratings.
- 🛡️ **Comprehensive Admin Dashboard**: Campus-wide metrics, student account suspension/activation, role changes, skills curriculum curation, and meeting zone management.
- 📱 **Modern & Responsive UI**: Built with React 18, Vite, and Tailwind CSS with custom glassmorphism and accessible color palettes.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, Vite, Tailwind CSS, React Router DOM v6, Axios, Lucide Icons |
| **Backend** | Node.js, Express.js, Socket.IO |
| **Database** | MongoDB Atlas / Local MongoDB, Mongoose ODM |
| **Authentication** | JSON Web Tokens (JWT), BcryptJS |
| **Real-Time** | WebSockets via Socket.IO client/server |
| **Environment** | Dotenv, Cross-Origin Resource Sharing (CORS) |

---

## 📁 Project Structure

```
Campus-Skill-Network/
│
├── frontend/                     # React + Vite Client Application
│   ├── public/                   # Public static assets
│   ├── src/
│   │   ├── assets/               # Brand graphics and images
│   │   ├── components/           # Reusable UI Components
│   │   │   ├── Button.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── Loading.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── SkillCard.jsx
│   │   │   ├── MentorCard.jsx
│   │   │   ├── RequestCard.jsx
│   │   │   ├── SessionCard.jsx
│   │   │   ├── NotificationCard.jsx
│   │   │   └── RatingStars.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx   # Global session state & Socket.IO client
│   │   ├── pages/                # Application views
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── VerifyEmail.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── EditProfile.jsx
│   │   │   ├── Skills.jsx
│   │   │   ├── MentorSearch.jsx
│   │   │   ├── MentorProfile.jsx
│   │   │   ├── Requests.jsx
│   │   │   ├── Availability.jsx
│   │   │   ├── ScheduleSession.jsx
│   │   │   ├── Sessions.jsx
│   │   │   ├── Chat.jsx
│   │   │   ├── Notifications.jsx
│   │   │   ├── Feedback.jsx
│   │   │   └── admin/            # Administrator Panels
│   │   │       ├── AdminDashboard.jsx
│   │   │       ├── ManageUsers.jsx
│   │   │       ├── ManageSkills.jsx
│   │   │       ├── ManageLocations.jsx
│   │   │       └── ManageReports.jsx
│   │   ├── routes/
│   │   │   ├── AppRoutes.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   └── AdminRoute.jsx
│   │   ├── services/             # Axios API services
│   │   │   ├── api.js
│   │   │   ├── authService.js
│   │   │   ├── userService.js
│   │   │   ├── skillService.js
│   │   │   ├── requestService.js
│   │   │   ├── sessionService.js
│   │   │   ├── chatService.js
│   │   │   ├── feedbackService.js
│   │   │   ├── notificationService.js
│   │   │   └── adminService.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── backend/                      # Node.js + Express API Server
│   ├── config/
│   │   └── db.js                 # MongoDB connection handler
│   ├── controllers/              # Business logic controllers
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── skillController.js
│   │   ├── requestController.js
│   │   ├── availabilityController.js
│   │   ├── sessionController.js
│   │   ├── chatController.js
│   │   ├── feedbackController.js
│   │   ├── notificationController.js
│   │   └── adminController.js
│   ├── middleware/               # Auth, role check, error handling
│   │   ├── authMiddleware.js
│   │   ├── adminMiddleware.js
│   │   └── errorMiddleware.js
│   ├── models/                   # Mongoose schemas
│   │   ├── User.js
│   │   ├── Skill.js
│   │   ├── MentorshipRequest.js
│   │   ├── Availability.js
│   │   ├── Session.js
│   │   ├── Location.js
│   │   ├── Message.js
│   │   ├── Feedback.js
│   │   └── Notification.js
│   ├── routes/                   # Express route dispatchers
│   ├── services/                 # Email & notification services
│   ├── socket/
│   │   └── chatSocket.js         # Socket.IO peer messaging & presence
│   ├── utils/
│   │   ├── generateToken.js
│   │   └── validators.js
│   ├── seed.js                   # Pre-populated demo database seeder
│   ├── server.js                 # Server entry point
│   ├── .env                      # Active environment configuration
│   ├── .env.example              # Environment variables template
│   └── package.json
│
├── docs/                         # Detailed Architecture & Technical Guides
│   ├── ARCHITECTURE.md           # System design & database relationships
│   ├── API_DOCUMENTATION.md      # Endpoint references
│   ├── MONGODB_ATLAS_GUIDE.md    # MongoDB Atlas cloud setup guide
│   └── TESTING_WALKTHROUGH.md    # Testing script & demo walkthrough
│
├── .gitignore
└── README.md
```

---

## ⚡ Quick Start Guide

### 1. Prerequisites
- **Node.js** (v18.0.0 or higher recommended, verified with v22+)
- **npm** (v9+ or higher)
- **MongoDB** (A free MongoDB Atlas cloud connection or local MongoDB server)

---

### 2. Environment Configuration

In `backend/.env`:
```env
PORT=5000
CLIENT_URL=http://localhost:5173
MONGODB_URI=mongodb://127.0.0.1:27017/campus-skill-network
# For MongoDB Atlas, use:
# MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/campus-skill-network?retryWrites=true&w=majority
JWT_SECRET=campus_skill_network_super_secure_jwt_secret_key_2026_dev
COLLEGE_EMAIL_DOMAIN=@college.edu
NODE_ENV=development
```

---

### 3. Seed Database with Realistic Demo Data

The backend includes an automatic seeder script that populates realistic student accounts, skills, locations, requests, availability slots, and reviews:

```bash
cd backend
npm run seed
```

---

### 4. Running the Project

#### Start the Backend (Terminal 1):
```bash
cd backend
npm run dev
```
*Backend runs on `http://localhost:5000` with nodemon auto-reload.*

#### Start the Frontend (Terminal 2):
```bash
cd frontend
npm run dev
```
*Frontend runs on `http://localhost:5173`.*

---

## 🧪 Demo Test Accounts

The login page contains **1-click quick-fill buttons** for fast evaluation:

| Account | Email | Password | Role / Primary Skills |
|---|---|---|---|
| **Aarav Sharma** | `student1@college.edu` | `password123` | Student (DSA, Web Dev, Python) |
| **Priya Patel** | `student2@college.edu` | `password123` | Student (Public Speaking, Aptitude) |
| **Rohan Verma** | `student3@college.edu` | `password123` | Student (Acoustic Guitar, Python) |
| **Sneha Kulkarni** | `student4@college.edu` | `password123` | Student (Machine Learning, Photography) |
| **Admin Console** | `admin@college.edu` | `password123` | Campus Administrator |

---

## 🌐 API Overview

| Route | Method | Description | Access |
|---|---|---|---|
| `/api/auth/register` | POST | Register new student | Public |
| `/api/auth/login` | POST | Authenticate & retrieve JWT | Public |
| `/api/auth/me` | GET | Retrieve authenticated profile | Private |
| `/api/users` | GET | Search student mentors | Public |
| `/api/users/profile` | PUT | Update personal profile | Private |
| `/api/users/skills` | POST | Add skill to student profile | Private |
| `/api/skills` | GET | List catalog skills & counts | Public |
| `/api/requests` | POST | Send mentorship request | Private |
| `/api/requests/:id/accept` | PUT | Accept mentorship request | Private (Mentor) |
| `/api/availability` | POST | Publish open time slot | Private (Mentor) |
| `/api/sessions` | POST | Schedule meeting in safe zone | Private |
| `/api/sessions/:id/complete` | PUT | Mark session completed | Private |
| `/api/feedback` | POST | Rate mentor (1–5 ★) & review | Private (Learner) |
| `/api/messages/conversations` | GET | Fetch active chat threads | Private |
| `/api/admin/reports` | GET | Fetch campus metrics | Admin |
| `/api/admin/users` | GET | Moderation user directory | Admin |
| `/api/admin/locations` | POST | Create campus safe zone | Admin |

*For complete details, see [docs/API_DOCUMENTATION.md](docs/API_DOCUMENTATION.md).*

---

## ☁️ MongoDB Atlas Cloud Setup

For detailed instructions on creating a free MongoDB Atlas cluster, whitelisting IP access, creating database credentials, and obtaining your connection string, see [docs/MONGODB_ATLAS_GUIDE.md](docs/MONGODB_ATLAS_GUIDE.md).

---

## 📜 Academic License

Developed for academic demonstration and campus community skill sharing.  
Released under the [MIT License](LICENSE).
