# backend/tests/test_mentorship.py
from conftest import login


def test_mentorship_accept_flow_and_session_scheduling(client, app):
    student = login(client, "student@test.local")
    mentor_id = app.config["IDS"]["mentor"]

    requested = client.post(
        "/api/mentorship/requests",
        json={"mentor_id": mentor_id, "message": "Help with Python."},
        headers=student,
    )
    assert requested.status_code == 201
    request_id = requested.get_json()["request"]["id"]

    mentor = login(client, "mentor@test.local")
    accepted = client.patch(
        f"/api/mentorship/requests/{request_id}",
        json={"status": "accepted"},
        headers=mentor,
    )
    assert accepted.status_code == 200
    assert accepted.get_json()["request"]["status"] == "accepted"

    student_requests = client.get("/api/mentorship/requests", headers=student)
    assert student_requests.get_json()["requests"][0]["status"] == "accepted"

    scheduled = client.post(
        "/api/mentorship/sessions",
        json={
            "request_id": request_id,
            "scheduled_at": "2026-12-20T18:30:00",
            "mode": "online",
            "link": "https://meet.example.com/test",
            "notes": "First call",
        },
        headers=mentor,
    )
    assert scheduled.status_code == 201
    session_id = scheduled.get_json()["session"]["id"]

    done = client.patch(
        f"/api/mentorship/sessions/{session_id}",
        json={"status": "done", "notes": "Completed the first call."},
        headers=student,
    )
    assert done.status_code == 200
    assert done.get_json()["session"]["status"] == "done"

    notes = client.get("/api/notifications", headers=student).get_json()
    assert any("Session" in item["title"] for item in notes["notifications"])
