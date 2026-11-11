# Architecture

Edu-Bridge is a single-page React application backed by a Flask REST API. The API owns
all business rules, role checks and database access. The browser never receives a
password hash or a database credential.

## Request flow

```text
Browser
  -> React Router page
  -> Axios client (adds Bearer token)
  -> Flask blueprint (/api)
  -> JWT identity + role guard
  -> marshmallow validation
  -> SQLAlchemy model / query
  -> JSON response
```

The Vite development server proxies `/api` and `/uploads` to the Flask server. In
production, serve the built frontend and reverse-proxy `/api` to Flask.

## Roles

| Capability | Student | NGO | Donor | Mentor | Admin |
| --- | --- | --- | --- | --- | --- |
| Browse programs and resources | yes | yes | yes | yes | yes |
| Apply to a program | yes | - | - | - | - |
| Create and edit programs | - | own | - | - | - |
| Review applications | - | own programs | - | mentorship programs | all |
| Request a mentor | yes | - | - | - | - |
| Accept mentorship requests | - | - | - | own | all |
| Schedule sessions | own | - | - | own | - |
| Donate | - | - | yes | - | - |
| Upload resources | - | yes | - | yes | - |
| Approve NGO and mentor accounts | - | - | - | - | yes |
| Suspend users | - | - | - | - | yes |
| View analytics | - | - | - | - | yes |

NGO and mentor accounts start as `pending`. The login route rejects pending accounts
until an admin approves them. Suspended accounts are also blocked.

## Data model

| Table | Purpose |
| --- | --- |
| `users` | Account, role, status and password hash |
| `student_profiles` | Education, skills, interests, location and date of birth |
| `ngo_profiles` | Organisation type, mission, contact details and description |
| `donor_profiles` | Donation preference |
| `mentor_profiles` | Expertise and availability |
| `programs` | NGO program with type, dates, target and status |
| `applications` | One student application per program |
| `mentorship_requests` | Student request to a mentor |
| `mentorship_sessions` | Scheduled session with mode, link or location |
| `resources` | Study resource metadata and optional file path or URL |
| `donations` | Donor, target, amount, mock reference, receipt and status |
| `notifications` | In-app message for one user |

Constraints and indexes:

- `users.email` is unique.
- `applications` has a unique `(program_id, student_id)` pair.
- A donation must point to exactly one program or one student.
- Status and type columns use check constraints.
- Foreign keys use cascade where child records should disappear with the parent, and
  restrict where financial history must be kept.
- Indexes cover login, role, status, program, application and notification lookups.

## API conventions

- All routes are under `/api`.
- JSON is used for normal requests and responses.
- Uploads use multipart form data.
- Protected routes expect `Authorization: Bearer <jwt>`.
- Validation failures return `400` with an `error` message and a `fields` object.
- Missing or invalid tokens return `401`.
- Role failures and inactive accounts return `403`.
- Missing records return `404`.
- Duplicate applications and decided records return `409`.
- A declined mock payment returns `402` and still stores a failed donation record.

## Frontend routes

Public routes: `/`, `/login`, `/register`, `/programs`, `/programs/:id`, `/resources`.

Authenticated routes:

| Role | Routes |
| --- | --- |
| Student | `/student`, `/student/mentors`, `/student/donations` |
| NGO | `/ngo`, `/ngo/programs/new`, `/ngo/programs/:id/edit`, `/ngo/applications`, `/ngo/resources` |
| Donor | `/donor`, `/donor/donate`, `/donor/receipts` |
| Mentor | `/mentor`, `/mentor/sessions/new`, `/mentor/resources` |
| Admin | `/admin/approvals`, `/admin/users`, `/admin/programs`, `/admin/donations`, `/admin/analytics` |

Shared authenticated routes: `/profile`, `/notifications`.

`ProtectedRoute` checks the current user and role in the browser. The API repeats the
check on every request.

## Design decisions

- **SQLite first, MySQL ready.** SQLite keeps the demo easy to run. Portable column
  types and `schema.sql` keep the MySQL 8 path open.
- **Server-side role checks.** Hiding a button is not authorization. Every protected
  route uses a role guard and ownership checks.
- **JWT in localStorage.** This keeps the demo simple. A production system should
  consider short-lived access tokens with refresh tokens in secure cookies.
- **Mock gateway as a function.** The payment boundary is isolated in
  `routes/donations.py`, so a real provider can replace it without changing the UI.
- **Receipts generated on demand.** ReportLab builds the PDF from the donation record,
  which avoids storing duplicate documents.
- **Idempotent seed.** Records are looked up by email, title or payment reference before
  insertion, so running the seed twice does not duplicate data.
- **Plain CSS.** One stylesheet with breakpoints at 900 px and 600 px keeps the build
  small and the layout predictable.

## Operational notes

- Uploaded files live in `backend/uploads` and are served by `GET /api/uploads/<name>`.
- The maximum upload size is 20 MB.
- Mail is printed to the backend console. Notifications are stored in the database.
- Alembic migrations live in `backend/migrations`.
- The CI workflow runs the backend test suite and a production frontend build.
