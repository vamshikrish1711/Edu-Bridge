# Edu-Bridge

Edu-Bridge is a full-stack platform for education nonprofits, students, donors and
mentors. NGOs publish programs, students apply, donors fund a program or a named
student, and mentors accept requests and schedule sessions. Admins review NGO and
mentor accounts and see platform analytics.

This repository is a portfolio demo. All data is synthetic and every payment uses a
mock gateway.

## Demo accounts

| Role | Email | Password |
| --- | --- | --- |
| Admin | `admin@edubridge.test` | `Admin@12345` |
| Student | `student1@edubridge.test` | `Demo@12345` |
| NGO | `ngo1@edubridge.test` | `Demo@12345` |
| Donor | `donor1@edubridge.test` | `Demo@12345` |
| Mentor | `mentor1@edubridge.test` | `Demo@12345` |

The pending NGO demo is `ngo3@edubridge.test` with password `Demo@12345`. Login is
blocked until an admin approves the account.

> These credentials are published for the demo. They are created by
> `backend/seed.py` and must not be reused in a production deployment. The admin
> account can change platform data, so a public demo should use a separate database
> and a periodic reset.

## Features

### Students
- Register with an education profile, skills, interests and location.
- Browse and filter programs by status, type and search term.
- Apply to a program and track each application from pending to approved.
- Request a mentor from the directory and view scheduled sessions.
- See donations directed to them and download the PDF receipt.

### NGOs
- Create and edit donation, volunteering, mentorship and scholarship programs.
- Review student applications and approve or reject them.
- Track funds raised against each program target.
- Upload study resources as a file or a URL.
- Receive notifications when students apply and donors give.

### Donors
- Give to a program or directly to a named student.
- Use the mock payment gateway with success and failure test cards.
- Download a numbered PDF receipt for every successful donation.
- See giving history, programs supported and students funded.

### Mentors
- Review mentorship requests and accept or reject them.
- Schedule online or in-person sessions with an accepted mentee.
- Mark sessions as done and upload study resources.

### Admins
- Approve or reject pending NGO and mentor accounts.
- Search users, suspend accounts and reactivate them.
- View all programs and donations.
- See analytics for monthly donations, student participation, mentorship acceptance
  and the top NGOs by funds raised.

## Tech stack

| Layer | Tools |
| --- | --- |
| Frontend | React 18, Vite, React Router, Axios, recharts, plain CSS |
| Backend | Python 3.12, Flask, Flask-SQLAlchemy, Flask-Migrate |
| Auth | Flask-JWT-Extended, bcrypt, role-based access control |
| Validation | marshmallow |
| Documents | ReportLab PDF receipts |
| Database | SQLite by default, MySQL 8 via PyMySQL |
| Tests | pytest |

## Architecture

```text
React SPA (Vite)
      |
      |  Axios + JWT bearer token
      v
Flask REST API  --->  SQLAlchemy models  --->  SQLite or MySQL 8
      |
      +---> ReportLab PDF receipts
      +---> Local file uploads
      +---> In-app notifications
```

- JWT access tokens carry the user id and role. Each protected route checks the role
  on the server, not only in the browser.
- Marshmallow schemas validate registration, login, programs and donations.
- Passwords are hashed with bcrypt. Password hashes never leave the API.
- Donations use a backend mock gateway and store both successful and failed attempts.
- The frontend keeps the token in `localStorage` and attaches it with an Axios
  interceptor. A 401 response clears the token and returns the user to login.

## Project structure

```text
edu-bridge/
├── backend/
│   ├── app.py                 Flask app factory, blueprints and error handlers
│   ├── config.py              Environment configuration
│   ├── extensions.py          SQLAlchemy, Migrate, JWT and CORS instances
│   ├── schemas.py             marshmallow request schemas
│   ├── seed.py                Idempotent demo data
│   ├── schema.sql             MySQL 8 schema
│   ├── models/                Twelve SQLAlchemy models
│   ├── routes/                Auth, programs, applications, mentorship,
│   │                          resources, donations, notifications, admin
│   ├── utils/                 Security, uploads, receipts, mail and notifications
│   ├── tests/                 pytest suite
│   └── uploads/               Local uploaded files
├── frontend/
│   ├── src/api/               Axios client and receipt download helper
│   ├── src/auth/              Authentication context
│   ├── src/components/        Layout, navbar, guards, cards and toasts
│   ├── src/pages/             Public, student, NGO, donor, mentor and admin pages
│   └── src/styles.css         Responsive plain CSS
├── docs/ARCHITECTURE.md       Data model, API and design notes
├── run.sh                     Starts both servers and opens the browser
└── README.md
```

## Getting started

### Prerequisites

- Python 3.12
- Node.js 20 or newer
- npm
- MySQL 8 (optional; SQLite is the default)

### Backend

```bash
cd backend
cp .env.example .env
python3.12 -m venv .venv
.venv/bin/pip install -r requirements.txt
.venv/bin/python seed.py
.venv/bin/python app.py
```

The API runs on `http://127.0.0.1:5000`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The app runs on `http://localhost:5173`.

### One command

```bash
./run.sh
```

`run.sh` starts both servers, picks the next free port if 5000 or 5173 is busy, and
opens the frontend in the default browser. Logs go to `backend.log` and
`frontend.log`.

## Mock payments

The mock gateway accepts amounts from INR 10 to INR 500,000.

| Card | Result |
| --- | --- |
| `4111111111111111` | Success |
| `4000000000000002` | Declined with HTTP 402 |

Successful donations get a receipt number such as `ED-2026-000013` and a downloadable
PDF. Failed attempts are stored with status `failed` and do not get a receipt. No real
card data is processed.

## Tests

```bash
cd backend
.venv/bin/python -m pytest -q
```

The suite covers registration and login, pending NGO blocking, admin approval, role
guards, program filters, application review notifications, application isolation,
mentorship acceptance and session scheduling, donation success and failure, PDF
receipt generation, the single-target rule and analytics totals.

Current result: **13 passed, 0 failed**.

The GitHub Actions workflow runs the same tests plus a production frontend build.

## API overview

All routes are under `/api`. Protected routes expect `Authorization: Bearer <token>`.

| Area | Endpoints |
| --- | --- |
| Health | `GET /health` |
| Auth | `POST /auth/register`, `POST /auth/login`, `GET /auth/me` |
| Profile | `GET /profile`, `PUT /profile`, `GET /students` |
| Programs | `GET /programs`, `GET /programs/<id>`, `POST /programs`, `PUT /programs/<id>`, `DELETE /programs/<id>` |
| Applications | `POST /programs/<id>/apply`, `GET /applications`, `PATCH /applications/<id>` |
| Mentorship | `GET /mentors`, `GET/POST /mentorship/requests`, `PATCH /mentorship/requests/<id>`, `GET/POST /mentorship/sessions`, `PATCH /mentorship/sessions/<id>` |
| Resources | `GET /resources`, `POST /resources`, `DELETE /resources/<id>` |
| Uploads | `POST /uploads`, `GET /uploads/<filename>` |
| Donations | `POST /donations`, `GET /donations`, `GET /donations/<id>/receipt` |
| Notifications | `GET /notifications`, `PATCH /notifications/<id>/read`, `POST /notifications/read-all` |
| Admin | `GET /admin/users`, `PATCH /admin/users/<id>/status`, `GET /admin/pending`, `PATCH /admin/pending/<id>`, `GET /admin/analytics` |

## Database

SQLite is the default and stores data in `backend/edubridge.db`. To use MySQL 8:

```bash
mysql -u root -p < backend/schema.sql
```

Then set the connection string in `backend/.env`:

```text
DATABASE_URL=mysql+pymysql://user:password@localhost:3306/edubridge
```

Alembic migrations live in `backend/migrations`.

## Security and demo notes

- `backend/.env` is ignored. Keep secrets out of commits.
- The demo accounts are intentionally public. Do not deploy this seed as a production
  service.
- The payment gateway is a local function. It does not contact a payment provider.
- Uploads accept PDF, MP4, EPUB and DOCX files up to 20 MB.
- Notifications are in-app only. Outgoing mail is printed to the backend console.
- See [SECURITY.md](SECURITY.md) for the demo security policy.

## License

MIT. See [LICENSE](LICENSE).
