# Campus Skill Network — REST API Documentation

All API routes are prefixed with `/api`.
Authenticated requests require the header:
```
Authorization: Bearer <JWT_TOKEN>
```

---

## 1. Authentication (`/api/auth`)

### Register Student
- **`POST /api/auth/register`**
- **Access:** Public
- **Body:**
  ```json
  {
    "name": "Alex Morgan",
    "email": "alex@college.edu",
    "studentId": "CS2024-001",
    "department": "Computer Science & Engineering",
    "year": "2nd Year",
    "college": "Campus University",
    "password": "password123",
    "confirmPassword": "password123"
  }
  ```
- **Response (201):** User object with `token`.

### Login Student / Admin
- **`POST /api/auth/login`**
- **Access:** Public
- **Body:**
  ```json
  {
    "email": "student1@college.edu",
    "password": "password123"
  }
  ```
- **Response (200):** User profile, roles, and `token`.

### Current User Profile
- **`GET /api/auth/me`**
- **Access:** Private
- **Response (200):** Authenticated user document.

### Verify College Email
- **`POST /api/auth/verify-email`**
- **Access:** Public
- **Body:** `{ "token": "...", "email": "..." }`

---

## 2. Users & Directory (`/api/users`)

- **`GET /api/users`** — Search and filter campus directory.
  - Query parameters:
    - `search`: Keyword string across name, department, bio, skills
    - `skill`: Specific skill name
    - `category`: Skill domain category
    - `department`: College department
    - `year`: Academic year
    - `sort`: `rating` | `sessions` | `newest`
- **`GET /api/users/:id`** — Get public student profile with received reviews.
- **`PUT /api/users/profile`** — Update personal profile, bio, department, and avatar.
- **`POST /api/users/skills`** — Add a skill to the student's offered list.
  - Body: `{ "name": "Python", "category": "Programming", "level": "Intermediate", "description": "..." }`
- **`DELETE /api/users/skills/:skillName`** — Remove a skill.
- **`PUT /api/users/interests`** — Update learning interest topics.

---

## 3. Skills Catalog (`/api/skills`)

- **`GET /api/skills`** — Returns all skills in platform catalog with mentor counts.
- **`GET /api/skills/categories`** — Returns list of categories.
- **`POST /api/skills`** — Add new skill to catalog (Private).
- **`PUT /api/skills/:id`** — Edit skill (Admin).
- **`DELETE /api/skills/:id`** — Remove skill (Admin).

---

## 4. Mentorship Requests (`/api/requests`)

- **`POST /api/requests`** — Send 1-on-1 mentorship request.
  - Body:
    ```json
    {
      "mentorId": "65b...",
      "skill": "Data Structures & Algorithms",
      "message": "Need help with Binary Trees",
      "preferredDate": "2026-09-29",
      "preferredTime": "04:00 PM"
    }
    ```
- **`GET /api/requests/sent`** — Get requests sent by the current student.
- **`GET /api/requests/received`** — Get requests received by current student as mentor.
- **`PUT /api/requests/:id/accept`** — Accept incoming request (Mentor only).
- **`PUT /api/requests/:id/reject`** — Reject incoming request (Mentor only).
- **`PUT /api/requests/:id/cancel`** — Cancel pending request (Learner only).

---

## 5. Availability Slots (`/api/availability`)

- **`POST /api/availability`** — Mentor defines available time slot.
  - Body: `{ "date": "2026-09-28", "startTime": "10:00 AM", "endTime": "11:00 AM" }`
- **`GET /api/availability/:mentorId?`** — List open slots for mentor.
- **`DELETE /api/availability/:id`** — Delete unbooked slot.

---

## 6. Sessions (`/api/sessions`)

- **`POST /api/sessions`** — Schedule session for accepted request.
  - Body:
    ```json
    {
      "mentorshipRequestId": "65b...",
      "slotId": "65b...", // OR date, startTime, endTime
      "location": "Central Library — 2nd Floor Commons",
      "notes": "Bring laptop"
    }
    ```
- **`GET /api/sessions`** — List sessions (filter: `status=scheduled|completed|cancelled`).
- **`GET /api/sessions/:id`** — Get session details.
- **`PUT /api/sessions/:id/complete`** — Mark session completed (increments session counters).
- **`PUT /api/sessions/:id/cancel`** — Cancel session.

---

## 7. Messages & Chat (`/api/messages`)

- **`GET /api/messages/conversations`** — Returns active threads with peers.
- **`GET /api/messages/:conversationId`** — Returns message history and marks as read.
- **`POST /api/messages`** — REST fallback endpoint for sending message.

---

## 8. Feedback & Ratings (`/api/feedback`)

- **`POST /api/feedback`** — Submit star rating and review for completed session.
  - Body: `{ "sessionId": "...", "rating": 5, "comment": "Great session!" }`
- **`GET /api/feedback/:mentorId`** — Get reviews for mentor.

---

## 9. Notifications (`/api/notifications`)

- **`GET /api/notifications`** — Get notifications list and unread count.
- **`PUT /api/notifications/:id/read`** — Mark single notification read.
- **`PUT /api/notifications/read-all`** — Mark all read.

---

## 10. Campus Locations (`/api/locations`)

- **`GET /api/locations`** — List approved safe meeting locations.

---

## 11. Admin Console (`/api/admin`)

- **`GET /api/admin/reports`** — Aggregated platform metrics and analytics.
- **`GET /api/admin/users`** — List and search all students.
- **`PUT /api/admin/users/:id/toggle-status`** — Activate or deactivate account.
- **`PUT /api/admin/users/:id/toggle-role`** — Change student to admin or vice versa.
- **`POST /api/admin/locations`** — Create safe meeting zone.
- **`PUT /api/admin/locations/:id`** — Update meeting zone.
- **`DELETE /api/admin/locations/:id`** — Remove meeting zone.
