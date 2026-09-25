# MongoDB Atlas Setup & Configuration Guide

This guide provides step-by-step instructions for connecting Campus Skill Network to a free MongoDB Atlas cloud cluster.

---

## Step 1: Create a Free MongoDB Atlas Account
1. Visit [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas).
2. Sign up with your Google account or email address.
3. Accept terms and proceed to the Atlas console.

---

## Step 2: Deploy a Free M0 Shared Cluster
1. Click **"Create Deployment"** or **"Build a Database"**.
2. Select the **M0 Free** cluster tier (always free, 512 MB storage).
3. Choose your preferred cloud provider (AWS, Google Cloud, or Azure) and select the region geographically closest to your campus.
4. Click **"Create Cluster"**. Provisioning takes 1–3 minutes.

---

## Step 3: Create a Database User
1. Under **"Security"** in the left sidebar, navigate to **Database Access**.
2. Click **"Add New Database User"**.
3. Authentication Method: **Password**.
4. Choose a username (e.g. `campus_user`) and a secure password (e.g. `CampusSecurePass2026`).
5. Under **Database User Privileges**, select **Read and write to any database**.
6. Click **"Add User"**.
> ⚠️ **Important:** Remember this username and password; you will place them in your `.env` file.

---

## Step 4: Configure Network IP Whitelist
1. Under **"Security"** in the left sidebar, click **Network Access**.
2. Click **"Add IP Address"**.
3. For local academic development, select **"Allow Access from Anywhere"** (`0.0.0.0/0`) or enter your current public IP.
4. Click **"Confirm"**. It will take approximately 30 seconds for the status to turn green (Active).

---

## Step 5: Copy Your Connection String
1. Return to **Database Deployments** in the sidebar.
2. Click the **"Connect"** button next to your cluster.
3. Select **"Drivers"** (Node.js).
4. Copy the connection string format:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
   ```
5. Replace:
   - `<username>` with your Atlas user (e.g. `campus_user`)
   - `<password>` with your Atlas password (e.g. `CampusSecurePass2026`)
   - Add the database name before the `?` query parameter: `/campus-skill-network?`
   
   **Final Format:**
   ```
   mongodb+srv://campus_user:CampusSecurePass2026@cluster0.xxxxx.mongodb.net/campus-skill-network?retryWrites=true&w=majority
   ```

---

## Step 6: Add to `backend/.env`
Open `backend/.env` and replace `MONGODB_URI`:
```env
PORT=5000
CLIENT_URL=http://localhost:5173
MONGODB_URI=mongodb+srv://campus_user:CampusSecurePass2026@cluster0.xxxxx.mongodb.net/campus-skill-network?retryWrites=true&w=majority
JWT_SECRET=campus_skill_network_super_secure_jwt_secret_key_2026_dev
COLLEGE_EMAIL_DOMAIN=@college.edu
```

---

## Step 7: Seed & Verify Database Connection
Run the seed command in the `backend/` directory:
```bash
cd backend
npm run seed
```
You should see:
```
Connected to MongoDB for seeding: mongodb+srv://...
🧹 Old data wiped clean.
✅ Seeded 12 skills into catalog.
✅ Seeded 5 approved campus locations.
✅ Seeded 5 student/admin accounts.
✅ Seeded mentor availability time slots.
✅ Seeded mentorship requests.
✅ Seeded scheduled and completed sessions.
✅ Seeded chat messages and notifications.
🎉 SEEDING COMPLETED SUCCESSFULLY!
```

---

## Step 8: Start Backend Server
```bash
npm run dev
```
Console output:
```
✅ MongoDB Connected Successfully: cluster0-shard-00-00.xxxxx.mongodb.net / Database: campus-skill-network
====================================================
🚀 Campus Skill Network Server running on port 5000
📡 Client URL: http://localhost:5173
🔗 REST API: http://localhost:5000/api/health
====================================================
```
