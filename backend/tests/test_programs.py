# backend/tests/test_programs.py
from conftest import login


def test_public_program_list_filters_by_status_and_type(client, app):
    response = client.get("/api/programs?status=active&type=scholarship")
    assert response.status_code == 200
    rows = response.get_json()["programs"]
    assert len(rows) == 1
    assert rows[0]["title"] == "Test Scholarship"
    assert rows[0]["ngo_name"] == "Test NGO"


def test_application_approval_creates_notification_for_student(client, app):
    student = login(client, "student@test.local")
    program_id = app.config["IDS"]["program"]
    applied = client.post(
        f"/api/programs/{program_id}/apply",
        json={"message": "I need this scholarship."},
        headers=student,
    )
    assert applied.status_code == 201
    application_id = applied.get_json()["application"]["id"]

    ngo = login(client, "ngo@test.local")
    approved = client.patch(
        f"/api/applications/{application_id}",
        json={"status": "approved"},
        headers=ngo,
    )
    assert approved.status_code == 200
    assert approved.get_json()["application"]["status"] == "approved"

    notes = client.get("/api/notifications", headers=student).get_json()
    assert any("approved" in item["title"].lower() for item in notes["notifications"])


def test_student_cannot_read_another_students_applications(client, app):
    first = login(client, "student@test.local")
    program_id = app.config["IDS"]["program"]
    client.post(f"/api/programs/{program_id}/apply", json={}, headers=first)

    client.post(
        "/api/auth/register",
        json={
            "name": "Second Student",
            "email": "second.student@test.local",
            "password": "StrongPass123",
            "role": "student",
        },
    )
    second = login(client, "second.student@test.local", "StrongPass123")
    rows = client.get("/api/applications", headers=second).get_json()["applications"]
    assert rows == []
