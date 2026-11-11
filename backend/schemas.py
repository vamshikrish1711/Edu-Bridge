# backend/schemas.py
from marshmallow import EXCLUDE, Schema, ValidationError, fields, validate, validates_schema


class BaseSchema(Schema):
    class Meta:
        unknown = EXCLUDE


class RegisterSchema(BaseSchema):
    name = fields.Str(required=True, validate=validate.Length(min=2, max=120))
    email = fields.Email(required=True)
    password = fields.Str(required=True, validate=validate.Length(min=8, max=128))
    role = fields.Str(
        required=True,
        validate=validate.OneOf(["student", "ngo", "donor", "mentor"]),
    )
    phone = fields.Str(load_default=None, validate=validate.Length(max=30))
    profile = fields.Dict(load_default=dict)


class LoginSchema(BaseSchema):
    email = fields.Email(required=True)
    password = fields.Str(required=True)


class ProgramSchema(BaseSchema):
    title = fields.Str(required=True, validate=validate.Length(min=3, max=180))
    type = fields.Str(
        required=True,
        validate=validate.OneOf(["donation", "volunteering", "mentorship", "scholarship"]),
    )
    description = fields.Str(required=True, validate=validate.Length(min=10))
    start_date = fields.Date(required=False, allow_none=True, format="%Y-%m-%d")
    end_date = fields.Date(required=False, allow_none=True, format="%Y-%m-%d")
    target_amount = fields.Decimal(
        load_default=0, places=2, validate=validate.Range(min=0, max=100000000)
    )
    volunteer_slots = fields.Int(load_default=0, validate=validate.Range(min=0, max=100000))
    status = fields.Str(
        load_default="upcoming",
        validate=validate.OneOf(["upcoming", "active", "completed"]),
    )

    @validates_schema
    def check_dates(self, data, **kwargs):
        start, end = data.get("start_date"), data.get("end_date")
        if start and end and end < start:
            raise ValidationError("End date must be on or after start date.", "end_date")


class DonationSchema(BaseSchema):
    program_id = fields.Int(allow_none=True)
    student_id = fields.Int(allow_none=True)
    amount = fields.Decimal(
        required=True, places=2, validate=validate.Range(min=10, max=500000)
    )
    donation_type = fields.Str(
        load_default="monetary", validate=validate.OneOf(["monetary", "material"])
    )
    card_number = fields.Str(required=True, validate=validate.Length(min=12, max=19))

    @validates_schema
    def check_target(self, data, **kwargs):
        if bool(data.get("program_id")) == bool(data.get("student_id")):
            raise ValidationError(
                "Give to exactly one program or one student.", "program_id"
            )
