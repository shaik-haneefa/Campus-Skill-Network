# Campus Skill Network — Testing & Validation Walkthrough

This document outlines the complete step-by-step verification process to test all peer mentorship and administrative capabilities.

---

## Pre-Loaded Demo Accounts (Password: `password123`)

| Student / Role | Email | Key Skills |
|---|---|---|
| **Aarav Sharma** | `student1@college.edu` | Data Structures & Algorithms, Web Development, Python |
| **Priya Patel** | `student2@college.edu` | Public Speaking, Aptitude & Reasoning, Badminton |
| **Rohan Verma** | `student3@college.edu` | Acoustic Guitar, Python Basics |
| **Sneha Kulkarni** | `student4@college.edu` | Machine Learning, Digital Photography |
| **Campus Admin** | `admin@college.edu` | Administrator Console & Moderation |

---

## Complete End-to-End Workflow Verification

```
[ Register / 1-Click Login ]
              |
              v
       [ Dashboard ] ──────> [ Manage Profile & Add Skills ]
              |
              v
     [ Explore Skills ]
              |
              v
      [ Select Mentor ] ─────> [ Send Mentorship Request ]
                                           |
                                           v
                          [ Mentor Logs In & Accepts Request ]
                                           |
                                           v
                          [ Mentor Adds Availability Slots ]
                                           |
                                           v
                       [ Learner Picks Slot & Campus Safe Zone ]
                                           |
                                           v
                              [ Session Created & Scheduled ]
                                           |
                                           v
                              [ Real-Time Socket.IO Chat ]
                                           |
                                           v
                              [ Session Marked as Completed ]
                                           |
                                           v
                              [ Learner Leaves 5★ Feedback ]
                                           |
                                           v
                             [ Mentor Rating Updated in Real Time! ]
```

---

### Step 1: Login with 1-Click Demo Fill
1. Open frontend in browser: `http://localhost:5173`.
2. Click **"Log In"** in top navbar.
3. Click the **"Student 1 (Aarav)"** quick-fill button, then click **"Sign In to Network"**.
4. You are greeted with Aarav's personalized Student Dashboard.

---

### Step 2: Add a New Skill to Your Profile
1. Navigate to **"My Profile"** in the sidebar or navbar.
2. Click **"Add Skill"**.
3. Enter:
   - Skill Name: `Docker & Containers`
   - Category: `Web Development`
   - Level: `Intermediate`
   - Description: `Containerizing Node.js apps and writing docker-compose files.`
4. Click **"Save Skill to Profile"**.
5. The skill instantly appears on Aarav's profile!

---

### Step 3: Discover Mentors & Send Mentorship Request
1. Click **"Explore Mentors"** in the navbar.
2. Filter by Category: `Communication` or type `Public Speaking`.
3. Locate **Priya Patel** (Debate finalist).
4. Click **"Request"**.
5. Modal appears:
   - Skill: `Public Speaking (Expert)`
   - Message: `Hi Priya, I have an upcoming technical symposium presentation and want feedback on my delivery.`
   - Preferred Date: Select tomorrow's date.
   - Preferred Time: `03:30 PM`.
6. Click **"Send Request"**.
7. Toast notification confirms: *"Mentorship request sent successfully."*

---

### Step 4: Mentor Receives & Accepts Request
1. Log out from Aarav's account (via avatar dropdown -> "Sign Out").
2. Log in as **Priya Patel** (`student2@college.edu` / `password123`).
3. Notice the red notification badge on the bell icon in navbar.
4. Navigate to **"Requests"** page -> **Incoming Requests**.
5. You see Aarav's request for `Public Speaking`.
6. Click **"Accept Request"**.
7. The status updates to **Accepted** with green confirmation!

---

### Step 5: Mentor Sets Available Campus Slots
1. While logged in as Priya, navigate to **"Set Availability"** in the sidebar.
2. In the "Add Time Slot" form, select tomorrow's date.
3. Start Time: `03:30 PM`, End Time: `04:30 PM`.
4. Click **"Add Availability Slot"**.
5. The slot appears under **Your Scheduled Slots** as **Open**.

---

### Step 6: Learner Schedules the Session
1. Log out as Priya, and log back in as **Aarav** (`student1@college.edu`).
2. Go to **"Requests"** -> **Sent Requests**.
3. Priya's request now shows **Ready to schedule**.
4. Click **"Book Slot"**.
5. In the schedule form:
   - Select Priya's open slot (`03:30 PM – 04:30 PM`).
   - Select an approved campus meeting location:
     `Central Library — 2nd Floor Study Commons`.
   - Add notes: *"Will bring my presentation slides on my laptop."*
6. Click **"Confirm & Schedule Session"**.
7. You are redirected to **"My Sessions"**, where the session is listed under **Upcoming**!

---

### Step 7: Real-Time Chat & Coordination
1. Click the **"Chat"** button on the session card or open **"Chat"** from navbar.
2. Click **Priya Patel** in the conversations list.
3. Type: *"Hi Priya! I've booked our session at the Central Library Commons. See you tomorrow!"* and hit Send.
4. The message appears instantly with timestamp.

---

### Step 8: Complete Session & Submit Rating Feedback
1. In the **"Sessions"** page, click **"Mark Complete"** on the session card.
2. Status turns to green **Completed**.
3. As the learner, click **"Rate & Review"**.
4. Select 5 Stars (★★★★★) and write:
   *"Priya gave invaluable feedback on pacing, body language, and slide transitions. Super helpful session!"*
5. Click **"Submit Review"**.
6. Priya's mentor rating and review count update immediately!

---

## Admin Flow Verification
1. Log out and sign in with the Admin account:
   - Email: `admin@college.edu`
   - Password: `password123`
2. Click **"Admin"** in the top navbar.
3. View platform-wide statistics (Total Students, Completed Sessions, Average Rating).
4. Go to **"Manage Students"**:
   - Test searching by name or department.
   - Toggle account status active/inactive.
5. Go to **"Campus Locations"**:
   - Add a new approved meeting zone (e.g. `Innovation Hub — 1st Floor`).
   - Edit or toggle active status.
6. Go to **"Analytics & Reports"**:
   - Inspect completion ratios and campus engagement graphs.
