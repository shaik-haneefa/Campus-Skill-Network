# Campus Skill Network — Architecture & Technical Specifications

**Tagline:** *"Connect. Learn. Share. Grow."*

Campus Skill Network is an academic peer-to-peer micro-mentorship and skill-sharing platform tailored for college campuses. It enables verified students to exchange skills 1-on-1, manage calendar availability, schedule sessions at approved on-campus locations, communicate in real time, and build their campus academic reputation.

---

## 1. System Architecture Overview

```
                                  +-----------------------------+
                                  |    Student & Admin Browser  |
                                  |   (React 18 + Vite + TW)    |
                                  +--------------+--------------+
                                                 |
                       HTTPS REST (Axios)        |      WSS Socket.IO
                      +--------------------------+-------------------------+
                      |                                                    |
                      v                                                    v
         +----------------------------+                       +----------------------------+
         |     Express REST API       |                       |   Socket.IO Real-Time Hub  |
         |  - Auth & College Email    |                       |  - Peer Chat & Presence    |
         |  - Skill & Mentor Search   |                       |  - Real-Time Notifications |
         |  - Request & Session State |                       |  - Typing Indicators       |
         |  - Admin Moderation & Rpt  |                       |                            |
         +-------------+--------------+                       +-------------+--------------+
                       |                                                    |
                       +----------------------+-----------------------------+
                                              |
                                              v
                              +-------------------------------+
                              |    MongoDB Atlas / Mongoose   |
                              | - Users (Students & Admins)   |
                              | - Skills Catalog              |
                              | - Mentorship Requests         |
                              | - Availability Time Slots     |
                              | - Scheduled Sessions          |
                              | - Messages & Chat History     |
                              | - Feedback & Mentor Ratings   |
                              | - Campus Safe Locations       |
                              | - Notification Events         |
                              +-------------------------------+
```

---

## 2. Core Design Principle: Dual Role Equality

In Campus Skill Network, **no student is permanently classified as only a "learner" or only a "mentor"**.
- A student who is an advanced Python programmer may want to learn Acoustic Guitar or Public Speaking.
- A sophomore in Electronics may teach Aptitude Shortcuts while learning Full-Stack Web Development from a senior in Computer Science.
- The data architecture stores skills offered (`user.skills`) and learning interests (`user.interests`) independently.

---

## 3. Database Schema Reference (MongoDB Models)

### `User`
| Field | Type | Description |
|---|---|---|
| `name` | String | Full student name |
| `email` | String (unique) | College email address (e.g., `student1@college.edu`) |
| `password` | String (select: false) | Bcrypt hashed password (min 6 chars) |
| `studentId` | String (unique) | Official campus roll/ID number |
| `department` | String | Campus academic department |
| `year` | String | 1st Year, 2nd Year, 3rd Year, 4th Year, Postgraduate |
| `college` | String | College institution name |
| `bio` | String | Student background and mentoring bio |
| `profileImage` | String | URL to avatar image |
| `skills` | Array of Objects | `[{ name, category, level, description }]` |
| `interests` | Array of Strings | Skills student is looking to learn |
| `role` | String | `'student'` or `'admin'` |
| `isVerified` | Boolean | College email verification flag |
| `rating` | Number | Aggregate mentor rating (1.0 to 5.0) |
| `ratingsCount` | Number | Total feedback reviews received |
| `sessionsCompleted` | Number | Count of completed sessions |
| `isActive` | Boolean | Moderation status |

### `Skill`
| Field | Type | Description |
|---|---|---|
| `name` | String (unique) | Skill title (e.g. Python, DSA, Acoustic Guitar) |
| `category` | Enum | Programming, Web Development, Data Science, AI/ML, Aptitude, Communication, Sports, Music, Arts, Other |
| `description` | String | Learning outline or domain scope |

### `MentorshipRequest`
| Field | Type | Description |
|---|---|---|
| `learner` | ObjectId (User) | Student requesting mentorship |
| `mentor` | ObjectId (User) | Student receiving request |
| `skill` | String | Target skill |
| `message` | String | Learner's request details |
| `preferredDate` | String | Desired date |
| `preferredTime` | String | Desired time slot |
| `status` | Enum | `'pending'`, `'accepted'`, `'rejected'`, `'cancelled'`, `'completed'` |

### `Availability`
| Field | Type | Description |
|---|---|---|
| `mentor` | ObjectId (User) | Student mentor |
| `date` | String | Available date (YYYY-MM-DD) |
| `startTime` | String | Start time (e.g. "10:00 AM") |
| `endTime` | String | End time (e.g. "11:00 AM") |
| `isBooked` | Boolean | True when booked into a session |

### `Session`
| Field | Type | Description |
|---|---|---|
| `learner` | ObjectId (User) | Learner student |
| `mentor` | ObjectId (User) | Mentor student |
| `skill` | String | Skill topic |
| `date` | String | Meeting date |
| `startTime` | String | Meeting start |
| `endTime` | String | Meeting end |
| `location` | String | Approved campus location |
| `status` | Enum | `'scheduled'`, `'completed'`, `'cancelled'` |
| `notes` | String | Preparation instructions |

### `Location`
| Field | Type | Description |
|---|---|---|
| `name` | String (unique) | Zone name (e.g., Central Library — 2nd Floor Commons) |
| `building` | String | Campus building/block |
| `description` | String | Seating and study amenities |
| `isActive` | Boolean | Availability toggle |

### `Message`
| Field | Type | Description |
|---|---|---|
| `sender` | ObjectId (User) | Message author |
| `receiver` | ObjectId (User) | Message recipient |
| `message` | String | Message text |
| `conversationId` | String | Deterministic sorted ID (`user1_user2`) |
| `read` | Boolean | Read receipt |

### `Feedback`
| Field | Type | Description |
|---|---|---|
| `session` | ObjectId (Session) | Associated completed session |
| `learner` | ObjectId (User) | Reviewer |
| `mentor` | ObjectId (User) | Mentored student |
| `rating` | Number (1–5) | Star rating |
| `comment` | String | Qualitative feedback |

### `Notification`
| Field | Type | Description |
|---|---|---|
| `user` | ObjectId (User) | Target user |
| `title` | String | Notification headline |
| `message` | String | Body text |
| `type` | Enum | `'request'`, `'session'`, `'chat'`, `'feedback'`, `'system'` |
| `link` | String | Action route link |
| `isRead` | Boolean | Unread indicator |

---

## 4. Socket.IO Real-Time Architecture

- **`registerUser`**: Client emits user ID; server registers socket into room `user_<id>` and updates connected users map.
- **`joinConversation`**: Client joins room `conv_<conversationId>`.
- **`sendMessage`**: Server saves message to MongoDB, broadcasts to conversation room `conv_<conversationId>`, and pushes instant notification to recipient's `user_<id>` room.
- **`userTyping` / `userStopTyping`**: Broadcasts ephemeral typing indicators between peers.
- **`onlineUsersList`**: Emits real-time online presence array to all active sessions.

---

## 5. Security & Authentication Model

1. **Password Encryption**: Passwords salted and hashed with `bcryptjs` (pre-save hook). Passwords are never returned in queries (`select: false`).
2. **Stateless JWT Tokens**: Signed with `JWT_SECRET` with 30-day expiration.
3. **Route Protection**: `authMiddleware.protect` validates token and verifies user status is active.
4. **Role Enforcement**: `adminMiddleware.adminOnly` protects `/api/admin/*` routes from unauthorized access.
5. **CORS & Environment Configuration**: Configurable origin matching `CLIENT_URL`.
