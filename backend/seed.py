# backend/seed.py
from datetime import datetime, timedelta

import bcrypt

from app import create_app
from extensions import db
from models import (
    Application,
    Donation,
    MentorProfile,
    MentorshipRequest,
    MentorshipSession,
    NgoProfile,
    Notification,
    Program,
    Resource,
    StudentProfile,
    DonorProfile,
    User,
)

DEMO_PASSWORD = "Demo@12345"
ADMIN_PASSWORD = "Admin@12345"
NOW = datetime.utcnow()


def make_user(role, name, email, password, status, phone, profile, profile_cls):
    user = User.query.filter_by(email=email).first()
    if user:
        return user
    user = User(
        role=role,
        name=name,
        email=email,
        phone=phone,
        status=status,
        password_hash=bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode(
            "utf-8"
        ),
        created_at=NOW - timedelta(days=120),
    )
    db.session.add(user)
    db.session.flush()
    if profile_cls is not None:
        db.session.add(profile_cls(user_id=user.id, **profile))
    return user


def main():
    app = create_app()
    with app.app_context():
        if User.query.filter_by(email="admin@edubridge.test").first():
            print("Seed already present. No changes made.")
            print_counts()
            return

        make_user(
            "admin", "Ananya Rao", "admin@edubridge.test", ADMIN_PASSWORD, "active",
            "9876500001", {}, None,
        )

        ngo1 = make_user(
            "ngo", "Pratham Learning Trust", "ngo1@edubridge.test", DEMO_PASSWORD,
            "active", "9876500002",
            {"org_type": "Education", "mission": "Keep girls in school through Class 12.",
             "contact_number": "020-25678901", "address": "Kothrud, Pune 411038",
             "description": "Runs scholarships and weekend classes for 1,200 students."},
            NgoProfile,
        )
        ngo2 = make_user(
            "ngo", "Saksham Foundation", "ngo2@edubridge.test", DEMO_PASSWORD,
            "active", "9876500003",
            {"org_type": "Livelihoods", "mission": "Train young adults for first jobs.",
             "contact_number": "080-41234567", "address": "Indiranagar, Bengaluru 560038",
             "description": "Digital skills and library programs across 18 districts."},
            NgoProfile,
        )
        ngo3 = make_user(
            "ngo", "Udaan Skills Collective", "ngo3@edubridge.test", DEMO_PASSWORD,
            "pending", "9876500004",
            {"org_type": "Vocational training", "mission": "Short courses for school dropouts.",
             "contact_number": "0141-2233445", "address": "Malviya Nagar, Jaipur 302017",
             "description": "Pending review. Submitted registration on 4 Nov 2026."},
            NgoProfile,
        )

        mentors = []
        mentor_data = [
            ("Rohan Mehta", "mentor1@edubridge.test", "Data science, Python",
             "Weekends, 6-9 pm", "Pune", "MSc Statistics, 9 years in analytics."),
            ("Kavya Iyer", "mentor2@edubridge.test", "Product design, Figma",
             "Tue and Thu, 7-9 pm", "Bengaluru", "Leads design at a fintech."),
            ("Arjun Nair", "mentor3@edubridge.test", "Finance, accounting",
             "Saturday mornings", "Kochi", "Chartered accountant, 12 years."),
            ("Sneha Kulkarni", "mentor4@edubridge.test", "Public health, research",
             "Flexible, 3 hours a week", "Mumbai", "Programme lead at a health nonprofit."),
        ]
        for i, (name, email, expertise, availability, city, note) in enumerate(mentor_data, 1):
            mentors.append(
                make_user(
                    "mentor", name, email, DEMO_PASSWORD, "active", f"98765100{i:02d}",
                    {"expertise": expertise, "availability": availability},
                    MentorProfile,
                )
            )

        students = []
        student_data = [
            ("Aisha Khan", "student1@edubridge.test", "Class 12, science", "Python, Excel",
             "Data, scholarships", "Pune", "2007-04-12"),
            ("Vikram Patil", "student2@edubridge.test", "BCom second year", "Accounting, Tally",
             "Finance, internships", "Nagpur", "2005-09-03"),
            ("Meera Joshi", "student3@edubridge.test", "BSc Computer Science", "Java, SQL",
             "Software, design", "Indore", "2004-01-21"),
            ("Rahul Das", "student4@edubridge.test", "Class 11, commerce", "Communication",
             "Volunteering, debate", "Kolkata", "2008-06-30"),
            ("Fatima Sheikh", "student5@edubridge.test", "BA English", "Writing, research",
             "Public health, media", "Hyderabad", "2005-11-17"),
            ("Karan Singh", "student6@edubridge.test", "Diploma, electrical", "Wiring, AutoCAD",
             "Vocational training", "Delhi", "2004-08-08"),
        ]
        for name, email, education, skills, interests, city, dob in student_data:
            students.append(
                make_user(
                    "student", name, email, DEMO_PASSWORD, "active", "9876520000",
                    {"education": education, "skills": skills, "interests": interests,
                     "location": city, "date_of_birth": datetime.strptime(dob, "%Y-%m-%d").date(),
                     "address": f"{city}, India"},
                    StudentProfile,
                )
            )

        donors = []
        for i, (name, email) in enumerate(
            [("Nisha Agarwal", "donor1@edubridge.test"),
             ("Sanjay Kapoor", "donor2@edubridge.test"),
             ("Priya Menon", "donor3@edubridge.test")], 1
        ):
            donors.append(
                make_user(
                    "donor", name, email, DEMO_PASSWORD, "active", f"98765300{i:02d}",
                    {"donation_type": "monetary"}, DonorProfile,
                )
            )

        programs = []
        program_data = [
            (ngo1, "Scholarship for Class 12 Girls", "scholarship",
             "Covers fees, books and exam costs for 60 girls in Pune.", 300000, 0, "active",
             "2026-01-01", "2026-12-31"),
            (ngo1, "Weekend STEM Mentorship", "mentorship",
             "Twelve weekend sessions on Python, maths and career planning.", 0, 20, "active",
             "2026-02-01", "2026-11-30"),
            (ngo2, "Digital Literacy Drive", "volunteering",
             "Teach basic computer skills in 12 government schools.", 0, 30, "active",
             "2026-03-01", "2026-12-15"),
            (ngo2, "Rural Library Fund", "donation",
             "Books and shelves for eight village libraries in Karnataka.", 500000, 0, "active",
             "2026-01-15", "2026-12-31"),
            (ngo1, "Winter Coding Bootcamp", "mentorship",
             "Four-week Python bootcamp for 40 students.", 150000, 10, "upcoming",
             "2026-12-10", "2027-01-08"),
            (ngo2, "Nutrition Support Kits", "donation",
             "Monthly food kits for 200 families. Closed after 6 months.", 250000, 0,
             "completed", "2025-11-01", "2026-04-30"),
            (ngo1, "Career Readiness Workshop", "volunteering",
             "Resume reviews and mock interviews for final-year students.", 0, 15, "upcoming",
             "2026-12-01", "2026-12-20"),
            (ngo2, "Girls in Science Scholarship", "scholarship",
             "Lab fees and coaching for 45 girls across Karnataka.", 400000, 0, "active",
             "2026-04-01", "2026-12-31"),
        ]
        for ngo, title, ptype, desc, target, slots, status, start, end in program_data:
            program = Program.query.filter_by(title=title, ngo_id=ngo.id).first()
            if not program:
                program = Program(
                    ngo_id=ngo.id, title=title, type=ptype, description=desc,
                    target_amount=target, volunteer_slots=slots, status=status,
                    start_date=datetime.strptime(start, "%Y-%m-%d").date(),
                    end_date=datetime.strptime(end, "%Y-%m-%d").date(),
                    created_at=NOW - timedelta(days=100),
                )
                db.session.add(program)
                db.session.flush()
            programs.append(program)

        resource_data = [
            (mentors[0], "Python for Beginners", "pdf", "Python", "beginner",
             "62-page workbook with exercises.", None),
            (mentors[0], "SQL Joins Explained", "video", "Data Science", "intermediate",
             "18-minute walkthrough.", "https://example.com/sql-joins"),
            (mentors[1], "Figma Practice File", "link", "Design", "beginner",
             "Duplicate this file and rebuild three screens.", "https://example.com/figma-practice"),
            (mentors[2], "Budgeting Worksheet", "pdf", "Finance", "beginner",
             "Monthly budget template for students.", None),
            (mentors[3], "Public Health Reading List", "ebook", "Public Health", "advanced",
             "Eight papers on community health.", "https://example.com/health-readings"),
            (ngo1, "Scholarship Checklist", "pdf", "Scholarships", "beginner",
             "Documents needed for the Class 12 scholarship.", None),
            (ngo1, "Interview Questions", "pdf", "Careers", "intermediate",
             "30 questions asked in campus interviews.", None),
            (ngo2, "Digital Skills Syllabus", "pdf", "Computer Basics", "beginner",
             "Week-by-week plan for the digital literacy drive.", None),
            (ngo2, "Library Catalogue Template", "link", "Library", "intermediate",
             "Sheet template for village library records.", "https://example.com/catalogue"),
            (mentors[1], "Design Portfolio Review", "video", "Design", "advanced",
             "How to present three case studies.", "https://example.com/portfolio-review"),
        ]
        for uploader, title, rtype, topic, level, desc, url in resource_data:
            if not Resource.query.filter_by(title=title, uploader_id=uploader.id).first():
                db.session.add(Resource(
                    uploader_id=uploader.id, title=title, type=rtype, topic=topic,
                    skill_level=level, description=desc, url=url,
                ))

        app_data = [
            (students[0], programs[0], "approved"),
            (students[1], programs[0], "pending"),
            (students[2], programs[1], "approved"),
            (students[3], programs[2], "pending"),
            (students[4], programs[3], "approved"),
            (students[5], programs[7], "approved"),
            (students[0], programs[6], "rejected"),
            (students[1], programs[2], "approved"),
            (students[2], programs[7], "pending"),
            (students[3], programs[4], "pending"),
        ]
        for student, program, status in app_data:
            if not Application.query.filter_by(
                student_id=student.id, program_id=program.id
            ).first():
                db.session.add(Application(
                    student_id=student.id, program_id=program.id, status=status,
                    message="Please consider my application.",
                    created_at=NOW - timedelta(days=30),
                    decided_at=NOW - timedelta(days=25) if status != "pending" else None,
                ))

        req1 = MentorshipRequest.query.filter_by(
            student_id=students[0].id, mentor_id=mentors[0].id
        ).first()
        if not req1:
            req1 = MentorshipRequest(
                student_id=students[0].id, mentor_id=mentors[0].id, status="accepted",
                message="I want to learn Python and statistics.",
                created_at=NOW - timedelta(days=20), decided_at=NOW - timedelta(days=19),
            )
            db.session.add(req1)
            db.session.flush()
        for student, mentor, status in [
            (students[1], mentors[1], "pending"),
            (students[2], mentors[0], "rejected"),
            (students[3], mentors[2], "accepted"),
        ]:
            if not MentorshipRequest.query.filter_by(
                student_id=student.id, mentor_id=mentor.id
            ).first():
                db.session.add(MentorshipRequest(
                    student_id=student.id, mentor_id=mentor.id, status=status,
                    message="I need guidance on my next step.",
                    created_at=NOW - timedelta(days=15),
                    decided_at=NOW - timedelta(days=14) if status != "pending" else None,
                ))

        if not MentorshipSession.query.filter_by(request_id=req1.id).first():
            db.session.add(MentorshipSession(
                request_id=req1.id, mentor_id=mentors[0].id, student_id=students[0].id,
                scheduled_at=NOW + timedelta(days=4), mode="online",
                link="https://meet.example.com/rohan-aisha",
                notes="Review the Python workbook before the call.", status="scheduled",
            ))
            db.session.add(MentorshipSession(
                request_id=req1.id, mentor_id=mentors[0].id, student_id=students[0].id,
                scheduled_at=NOW - timedelta(days=6), mode="online",
                link="https://meet.example.com/rohan-aisha-1",
                notes="Discussed loops and functions.", status="done",
            ))

        donation_data = [
            (donors[0], programs[0], None, 25000, 270, "SEED-DON-01"),
            (donors[1], programs[3], None, 50000, 240, "SEED-DON-02"),
            (donors[2], programs[1], None, 15000, 210, "SEED-DON-03"),
            (donors[0], None, students[0], 5000, 180, "SEED-DON-04"),
            (donors[1], None, students[1], 7500, 150, "SEED-DON-05"),
            (donors[2], programs[0], None, 20000, 120, "SEED-DON-06"),
            (donors[0], programs[3], None, 30000, 90, "SEED-DON-07"),
            (donors[1], programs[7], None, 40000, 60, "SEED-DON-08"),
            (donors[2], None, students[2], 6000, 30, "SEED-DON-09"),
            (donors[0], programs[5], None, 12000, 10, "SEED-DON-10"),
            (donors[1], programs[0], None, 18000, 5, "SEED-DON-11"),
            (donors[2], programs[3], None, 4000, 2, "SEED-DON-12"),
        ]
        for donor, program, student, amount, days, ref in donation_data:
            if Donation.query.filter_by(payment_ref=ref).first():
                continue
            donation = Donation(
                donor_id=donor.id, program_id=program.id if program else None,
                student_id=student.id if student else None, amount=amount,
                donation_type="monetary", payment_ref=ref,
                status="failed" if ref == "SEED-DON-12" else "success",
                created_at=NOW - timedelta(days=days),
            )
            db.session.add(donation)
            db.session.flush()
            if donation.status == "success":
                donation.receipt_no = f"ED-2026-{donation.id:06d}"
                recipient = program.ngo_id if program else student.id
                db.session.add(Notification(
                    user_id=donor.id, title="Donation recorded",
                    message=f"Donation of INR {amount:,} recorded. Receipt {donation.receipt_no}.",
                    created_at=donation.created_at,
                ))
                db.session.add(Notification(
                    user_id=recipient, title="Donation received",
                    message=f"{donor.name} donated INR {amount:,}.",
                    created_at=donation.created_at,
                ))

        db.session.commit()
        print("Seed complete.")
        print_counts()


def print_counts():
    print(f"users={User.query.count()} programs={Program.query.count()} "
          f"resources={Resource.query.count()} donations={Donation.query.count()} "
          f"applications={Application.query.count()}")
    print(f"mentorship_requests={MentorshipRequest.query.count()} "
          f"sessions={MentorshipSession.query.count()}")
    print("Demo accounts use published passwords. Do not deploy this seed in production.")


if __name__ == "__main__":
    main()
