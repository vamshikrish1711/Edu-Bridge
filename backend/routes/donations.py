# backend/routes/donations.py
import uuid
from datetime import datetime

from flask import Blueprint, jsonify, request, send_file
from marshmallow import ValidationError

from extensions import db
from models import Donation, Program, User
from schemas import DonationSchema
from utils.notify import notify
from utils.receipts import build_receipt
from utils.security import api_error, current_user, roles_required

donations_bp = Blueprint("donations", __name__)
donation_schema = DonationSchema()

FAIL_CARD = "4000000000000002"


def mock_charge(amount, card_number):
    value = float(amount)
    if value < 10 or value > 500000:
        return False, "Amount must be between INR 10 and INR 500,000."
    if str(card_number).replace(" ", "") == FAIL_CARD:
        return False, "The test card was declined by the mock gateway."
    return True, f"PAY-{uuid.uuid4().hex[:12].upper()}"


@donations_bp.post("/donations")
@roles_required("donor")
def create_donation():
    user = current_user()
    payload = request.get_json(silent=True) or {}
    try:
        data = donation_schema.load(payload)
    except ValidationError as err:
        return api_error("Check the donation fields.", 400, err.messages)

    program = None
    student = None
    if data.get("program_id"):
        program = db.session.get(Program, data["program_id"])
        if program is None:
            return api_error("Program not found.", 404)
    else:
        student = db.session.get(User, data["student_id"])
        if student is None or student.role != "student":
            return api_error("Student not found.", 404)

    ok, reference = mock_charge(data["amount"], data["card_number"])
    donation = Donation(
        donor_id=user.id,
        program_id=program.id if program else None,
        student_id=student.id if student else None,
        amount=data["amount"],
        donation_type=data["donation_type"],
        payment_ref=reference,
        status="success" if ok else "failed",
    )
    db.session.add(donation)
    db.session.flush()

    if ok:
        donation.receipt_no = f"ED-{datetime.utcnow().year}-{donation.id:06d}"
        recipient_id = program.ngo_id if program else student.id
        target = program.title if program else f"support for {student.name}"
        notify(
            user.id,
            "Donation recorded",
            f"Donation of INR {float(donation.amount):,.0f} recorded for {target}. "
            f"Receipt {donation.receipt_no} is ready.",
        )
        notify(
            recipient_id,
            "Donation received",
            f"{user.name} donated INR {float(donation.amount):,.0f} for {target}.",
        )
        db.session.commit()
        return jsonify({"donation": donation.to_dict()}), 201

    db.session.commit()
    return jsonify(
        {"error": reference, "donation": donation.to_dict()}
    ), 402


@donations_bp.get("/donations")
@roles_required("donor", "student", "ngo", "admin")
def list_donations():
    user = current_user()
    query = Donation.query
    if user.role == "donor":
        query = query.filter(Donation.donor_id == user.id)
    elif user.role == "student":
        query = query.filter(Donation.student_id == user.id)
    elif user.role == "ngo":
        query = query.join(Program).filter(Program.ngo_id == user.id)
    donations = query.order_by(Donation.created_at.desc()).all()
    total = sum(float(d.amount) for d in donations if d.status == "success")
    return jsonify(
        {
            "donations": [d.to_dict() for d in donations],
            "summary": {"total": total, "count": len(donations)},
        }
    )


@donations_bp.get("/donations/<int:donation_id>/receipt")
@roles_required("donor", "student", "ngo", "admin")
def download_receipt(donation_id):
    user = current_user()
    donation = db.session.get(Donation, donation_id)
    if donation is None:
        return api_error("Donation not found.", 404)
    if donation.status != "success":
        return api_error("No receipt exists for a failed payment.", 400)

    allowed = user.role == "admin" or donation.donor_id == user.id
    if donation.student_id == user.id:
        allowed = True
    if donation.program and donation.program.ngo_id == user.id:
        allowed = True
    if not allowed:
        return api_error("You cannot view this receipt.", 403)

    pdf = build_receipt(donation)
    return send_file(
        pdf,
        mimetype="application/pdf",
        as_attachment=True,
        download_name=f"{donation.receipt_no}.pdf",
    )
