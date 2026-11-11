# backend/utils/mail.py
from datetime import datetime


def send_mail(to_email, subject, body):
    stamp = datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S")
    print(f"[mail {stamp}] to={to_email} subject={subject}")
    print(body)
