# Security policy

Edu-Bridge is a portfolio demo, not a production service.

## Demo credentials

The accounts created by `backend/seed.py` use published passwords. They are meant for
local review and screenshots. Do not deploy the seed data to a public server with the
same credentials, and do not reuse the demo passwords for real accounts.

If you publish a hosted demo, use a separate database, remove or rotate the admin
account, and reset the data on a schedule.

## Secrets

- `backend/.env` is ignored by git.
- `backend/.env.example` contains placeholders only.
- Set long random values for `SECRET_KEY` and `JWT_SECRET_KEY` before any deployment.
- Do not commit database files, uploaded files or logs.

## Payments

The payment gateway is a mock function. It does not contact a payment provider and
does not store real card data. Use the test cards listed in the README.

## Reporting

If you find a security issue in this demo, open a private security advisory on the
GitHub repository or contact the repository owner directly.
