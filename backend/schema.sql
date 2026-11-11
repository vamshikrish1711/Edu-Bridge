-- backend/schema.sql
-- MySQL 8 schema for Edu-Bridge. The Flask app also runs on SQLite.
CREATE DATABASE IF NOT EXISTS edubridge CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE edubridge;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  role VARCHAR(20) NOT NULL,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(190) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  phone VARCHAR(30),
  status VARCHAR(20) NOT NULL DEFAULT 'active',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX ix_users_email (email),
  INDEX ix_users_role (role),
  INDEX ix_users_status (status),
  CONSTRAINT ck_user_role CHECK (role IN ('student','ngo','donor','mentor','admin')),
  CONSTRAINT ck_user_status CHECK (status IN ('active','pending','suspended'))
) ENGINE=InnoDB;

CREATE TABLE student_profiles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL UNIQUE,
  education VARCHAR(200), skills TEXT, interests TEXT, location VARCHAR(120),
  date_of_birth DATE, address TEXT,
  CONSTRAINT fk_student_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE ngo_profiles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL UNIQUE,
  org_type VARCHAR(80), mission TEXT, contact_number VARCHAR(30), address TEXT, description TEXT,
  CONSTRAINT fk_ngo_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE donor_profiles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL UNIQUE,
  donation_type VARCHAR(20) DEFAULT 'monetary',
  CONSTRAINT fk_donor_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE mentor_profiles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL UNIQUE,
  expertise VARCHAR(255), availability VARCHAR(255),
  CONSTRAINT fk_mentor_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE programs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  ngo_id INT NOT NULL,
  title VARCHAR(180) NOT NULL,
  type VARCHAR(20) NOT NULL,
  description TEXT NOT NULL,
  start_date DATE, end_date DATE,
  target_amount DECIMAL(12,2) DEFAULT 0,
  volunteer_slots INT DEFAULT 0,
  status VARCHAR(20) NOT NULL DEFAULT 'upcoming',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX ix_programs_ngo (ngo_id),
  INDEX ix_programs_status (status),
  CONSTRAINT fk_program_ngo FOREIGN KEY (ngo_id) REFERENCES users(id) ON DELETE RESTRICT,
  CONSTRAINT ck_program_type CHECK (type IN ('donation','volunteering','mentorship','scholarship')),
  CONSTRAINT ck_program_status CHECK (status IN ('upcoming','active','completed'))
) ENGINE=InnoDB;

CREATE TABLE applications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  program_id INT NOT NULL,
  student_id INT NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  message TEXT, created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, decided_at DATETIME,
  UNIQUE KEY uq_application_once (program_id, student_id),
  INDEX ix_applications_program (program_id),
  INDEX ix_applications_student (student_id),
  CONSTRAINT fk_application_program FOREIGN KEY (program_id) REFERENCES programs(id) ON DELETE CASCADE,
  CONSTRAINT fk_application_student FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT ck_application_status CHECK (status IN ('pending','approved','rejected'))
) ENGINE=InnoDB;

CREATE TABLE mentorship_requests (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT NOT NULL,
  mentor_id INT NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  message TEXT, created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, decided_at DATETIME,
  INDEX ix_requests_student (student_id),
  INDEX ix_requests_mentor (mentor_id),
  CONSTRAINT fk_request_student FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_request_mentor FOREIGN KEY (mentor_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT ck_request_status CHECK (status IN ('pending','accepted','rejected'))
) ENGINE=InnoDB;

CREATE TABLE mentorship_sessions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  request_id INT NOT NULL,
  mentor_id INT NOT NULL,
  student_id INT NOT NULL,
  scheduled_at DATETIME NOT NULL,
  mode VARCHAR(20) DEFAULT 'online',
  location VARCHAR(255), link VARCHAR(500), notes TEXT,
  status VARCHAR(20) NOT NULL DEFAULT 'scheduled',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX ix_sessions_request (request_id),
  CONSTRAINT fk_session_request FOREIGN KEY (request_id) REFERENCES mentorship_requests(id) ON DELETE CASCADE,
  CONSTRAINT fk_session_mentor FOREIGN KEY (mentor_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_session_student FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT ck_session_status CHECK (status IN ('scheduled','done','cancelled'))
) ENGINE=InnoDB;

CREATE TABLE resources (
  id INT AUTO_INCREMENT PRIMARY KEY,
  uploader_id INT NOT NULL,
  title VARCHAR(180) NOT NULL,
  type VARCHAR(20) NOT NULL,
  topic VARCHAR(120) NOT NULL,
  skill_level VARCHAR(20) NOT NULL,
  description TEXT, file_path VARCHAR(500), url VARCHAR(500),
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX ix_resources_topic (topic),
  INDEX ix_resources_level (skill_level),
  CONSTRAINT fk_resource_uploader FOREIGN KEY (uploader_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT ck_resource_type CHECK (type IN ('pdf','video','link','ebook')),
  CONSTRAINT ck_resource_level CHECK (skill_level IN ('beginner','intermediate','advanced'))
) ENGINE=InnoDB;

CREATE TABLE donations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  donor_id INT NOT NULL,
  program_id INT NULL,
  student_id INT NULL,
  amount DECIMAL(12,2) NOT NULL,
  donation_type VARCHAR(20) NOT NULL DEFAULT 'monetary',
  payment_ref VARCHAR(80),
  receipt_no VARCHAR(40) UNIQUE,
  status VARCHAR(20) NOT NULL DEFAULT 'success',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX ix_donations_donor (donor_id),
  INDEX ix_donations_program (program_id),
  INDEX ix_donations_student (student_id),
  CONSTRAINT fk_donation_donor FOREIGN KEY (donor_id) REFERENCES users(id) ON DELETE RESTRICT,
  CONSTRAINT fk_donation_program FOREIGN KEY (program_id) REFERENCES programs(id) ON DELETE RESTRICT,
  CONSTRAINT fk_donation_student FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE RESTRICT,
  CONSTRAINT ck_donation_target CHECK (program_id IS NOT NULL OR student_id IS NOT NULL),
  CONSTRAINT ck_donation_status CHECK (status IN ('success','failed'))
) ENGINE=InnoDB;

CREATE TABLE notifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  title VARCHAR(160) NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX ix_notifications_user (user_id),
  INDEX ix_notifications_read (is_read),
  CONSTRAINT fk_notification_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;
