# backend/routes/programs.py
from flask import Blueprint, jsonify, request
from flask_jwt_extended import verify_jwt_in_request
from marshmallow import ValidationError
from sqlalchemy import or_

from extensions import db
from models import Donation, Program
from schemas import ProgramSchema
from utils.security import api_error, current_user, roles_required

programs_bp = Blueprint("programs", __name__)
program_schema = ProgramSchema()

UPDATABLE = [
    "title",
    "type",
    "description",
    "start_date",
    "end_date",
    "target_amount",
    "volunteer_slots",
    "status",
]


@programs_bp.get("/programs")
def list_programs():
    query = Program.query
    status = request.args.get("status")
    program_type = request.args.get("type")
    search = request.args.get("q", "").strip()
    mine = request.args.get("mine") in ("1", "true", "yes")

    if mine:
        verify_jwt_in_request()
        user = current_user()
        if user is None or user.role != "ngo":
            return api_error("Only NGOs can list their own programs.", 403)
        query = query.filter(Program.ngo_id == user.id)

    if status:
        query = query.filter(Program.status == status)
    if program_type:
        query = query.filter(Program.type == program_type)
    if search:
        like = f"%{search}%"
        query = query.filter(
            or_(Program.title.ilike(like), Program.description.ilike(like))
        )

    programs = query.order_by(Program.created_at.desc()).all()
    return jsonify({"programs": [p.to_dict() for p in programs]})


@programs_bp.get("/programs/<int:program_id>")
def get_program(program_id):
    program = db.session.get(Program, program_id)
    if program is None:
        return api_error("Program not found.", 404)
    body = program.to_dict()
    body["application_count"] = len(program.applications)
    return jsonify({"program": body})


@programs_bp.post("/programs")
@roles_required("ngo")
def create_program():
    user = current_user()
    payload = request.get_json(silent=True) or {}
    try:
        data = program_schema.load(payload)
    except ValidationError as err:
        return api_error("Check the program fields.", 400, err.messages)

    program = Program(ngo_id=user.id, **data)
    db.session.add(program)
    db.session.commit()
    return jsonify({"program": program.to_dict()}), 201


@programs_bp.put("/programs/<int:program_id>")
@roles_required("ngo")
def update_program(program_id):
    user = current_user()
    program = db.session.get(Program, program_id)
    if program is None:
        return api_error("Program not found.", 404)
    if program.ngo_id != user.id:
        return api_error("You can only edit your own programs.", 403)

    payload = request.get_json(silent=True) or {}
    try:
        data = program_schema.load(payload, partial=True)
    except ValidationError as err:
        return api_error("Check the program fields.", 400, err.messages)

    for key in UPDATABLE:
        if key in data:
            setattr(program, key, data[key])
    db.session.commit()
    return jsonify({"program": program.to_dict()})


@programs_bp.delete("/programs/<int:program_id>")
@roles_required("ngo", "admin")
def delete_program(program_id):
    user = current_user()
    program = db.session.get(Program, program_id)
    if program is None:
        return api_error("Program not found.", 404)
    if user.role != "admin" and program.ngo_id != user.id:
        return api_error("You can only delete your own programs.", 403)

    donations = Donation.query.filter_by(program_id=program.id).count()
    if donations:
        return api_error(
            f"This program has {donations} donation records. Mark it completed instead.",
            409,
        )
    db.session.delete(program)
    db.session.commit()
    return jsonify({"message": "Program deleted."})
