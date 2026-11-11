# backend/tests/test_donations.py
from conftest import login


def test_donation_success_returns_receipt_number(client, app):
    donor = login(client, "donor@test.local")
    response = client.post(
        "/api/donations",
        json={
            "program_id": app.config["IDS"]["program"],
            "amount": 500,
            "donation_type": "monetary",
            "card_number": "4111111111111111",
        },
        headers=donor,
    )
    assert response.status_code == 201
    donation = response.get_json()["donation"]
    assert donation["status"] == "success"
    assert donation["receipt_no"].startswith("ED-")
    assert donation["amount"] == 500.0


def test_donation_failure_uses_test_card_and_stores_failed_record(client, app):
    donor = login(client, "donor@test.local")
    response = client.post(
        "/api/donations",
        json={
            "program_id": app.config["IDS"]["program"],
            "amount": 500,
            "donation_type": "monetary",
            "card_number": "4000000000000002",
        },
        headers=donor,
    )
    assert response.status_code == 402
    body = response.get_json()
    assert "declined" in body["error"]
    assert body["donation"]["status"] == "failed"
    assert body["donation"]["receipt_no"] is None


def test_receipt_generation_returns_a_valid_pdf(client, app):
    donor = login(client, "donor@test.local")
    created = client.post(
        "/api/donations",
        json={
            "program_id": app.config["IDS"]["program"],
            "amount": 1250,
            "donation_type": "monetary",
            "card_number": "4111111111111111",
        },
        headers=donor,
    )
    donation_id = created.get_json()["donation"]["id"]
    receipt = client.get(f"/api/donations/{donation_id}/receipt", headers=donor)
    assert receipt.status_code == 200
    assert receipt.mimetype == "application/pdf"
    assert receipt.data.startswith(b"%PDF-")
    assert len(receipt.data) > 1000


def test_donation_requires_exactly_one_target(client, app):
    donor = login(client, "donor@test.local")
    response = client.post(
        "/api/donations",
        json={
            "program_id": app.config["IDS"]["program"],
            "student_id": app.config["IDS"]["student"],
            "amount": 100,
            "card_number": "4111111111111111",
        },
        headers=donor,
    )
    assert response.status_code == 400
    assert "program_id" in response.get_json()["fields"]


def test_analytics_totals_match_created_donations(client, app):
    donor = login(client, "donor@test.local")
    for amount in (100, 250):
        response = client.post(
            "/api/donations",
            json={
                "program_id": app.config["IDS"]["program"],
                "amount": amount,
                "card_number": "4111111111111111",
            },
            headers=donor,
        )
        assert response.status_code == 201

    admin = login(client, "admin@test.local", "Admin@12345")
    analytics = client.get("/api/admin/analytics", headers=admin)
    assert analytics.status_code == 200
    body = analytics.get_json()
    assert body["total_donations"] == 350.0
    assert body["counts"]["donations"] == 2
    assert body["active_programs"] == 1
