# backend/tests/test_auth.py
from conftest import login


def test_student_registration_then_login_returns_token(client):
    response = client.post(
        "/api/auth/register",
        json={
            "name": "New Student",
            "email": "new.student@test.local",
            "password": "StrongPass123",
            "role": "student",
            "profile": {"education": "BSc", "interests": "Data"},
        },
    )
    assert response.status_code == 201
    assert response.get_json()["status"] == "active"

    headers = login(client, "new.student@test.local", "StrongPass123")
    me = client.get("/api/auth/me", headers=headers)
    assert me.status_code == 200
    assert me.get_json()["user"]["role"] == "student"
    assert me.get_json()["profile"]["education"] == "BSc"
    assert "password_hash" not in me.get_json()["user"]


def test_ngo_registration_is_pending_and_login_is_blocked(client):
    response = client.post(
        "/api/auth/register",
        json={
            "name": "New NGO",
            "email": "new.ngo@test.local",
            "password": "StrongPass123",
            "role": "ngo",
            "profile": {"org_type": "Education", "mission": "Teach"},
        },
    )
    assert response.status_code == 201
    assert response.get_json()["status"] == "pending"

    blocked = client.post(
        "/api/auth/login",
        json={"email": "new.ngo@test.local", "password": "StrongPass123"},
    )
    assert blocked.status_code == 403
    assert "awaiting admin approval" in blocked.get_json()["error"]


def test_admin_approval_lets_a_pending_ngo_log_in(client, app):
    admin = login(client, "admin@test.local", "Admin@12345")
    pending_id = app.config["IDS"]["pending"]
    approve = client.patch(
        f"/api/admin/pending/{pending_id}", json={"action": "approve"}, headers=admin
    )
    assert approve.status_code == 200
    assert approve.get_json()["user"]["status"] == "active"

    headers = login(client, "pending@test.local")
    assert headers["Authorization"].startswith("Bearer ")


def test_wrong_role_requests_return_403(client, app):
    student = login(client, "student@test.local")
    program_payload = {
        "title": "Should fail",
        "type": "donation",
        "description": "Students cannot create programs.",
    }
    response = client.post("/api/programs", json=program_payload, headers=student)
    assert response.status_code == 403

    donor = login(client, "donor@test.local")
    admin_only = client.get("/api/admin/users", headers=donor)
    assert admin_only.status_code == 403
