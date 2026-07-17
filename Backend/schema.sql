-- MySQL Schema Setup Script for StudyStay

-- CREATE DATABASE IF NOT EXISTS `studystay` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
-- USE `studystay`;

-- 1. Users Table
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(100) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `role` ENUM('student', 'owner', 'admin') NOT NULL DEFAULT 'student',
  `phone` VARCHAR(20) NULL,
  `university` VARCHAR(150) NULL,
  `verification_status` ENUM('pending', 'verified', 'rejected') NOT NULL DEFAULT 'pending',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 2. Properties Table
CREATE TABLE IF NOT EXISTS `properties` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `owner_id` INT NOT NULL,
  `title` VARCHAR(200) NOT NULL,
  `description` TEXT NOT NULL,
  `city` VARCHAR(100) NOT NULL,
  `address` VARCHAR(255) NOT NULL,
  `nearby_university` VARCHAR(150) NOT NULL,
  `rent` DECIMAL(10, 2) NOT NULL,
  `rooms` INT NOT NULL DEFAULT 1,
  `bathrooms` INT NOT NULL DEFAULT 1,
  `halls` INT NOT NULL DEFAULT 0,
  `size` INT NOT NULL DEFAULT 0,
  `type` VARCHAR(50) NOT NULL DEFAULT 'شقة كاملة', -- or 'بنظام أفراد'
  `occupancy` VARCHAR(50) NOT NULL DEFAULT 'متاح',
  `image` VARCHAR(500) NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`owner_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 3. Student Requests / Posts Table
CREATE TABLE IF NOT EXISTS `posts` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `student_id` INT NOT NULL,
  `property_id` INT NULL, -- Optional property link
  `description` TEXT NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`student_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`property_id`) REFERENCES `properties`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB;

-- 4. Messages / Chat Threads Table
CREATE TABLE IF NOT EXISTS `messages` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `sender_id` INT NOT NULL,
  `receiver_id` INT NOT NULL,
  `property_id` INT NULL,
  `message` TEXT NOT NULL,
  `is_read` TINYINT(1) NOT NULL DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`sender_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`receiver_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`property_id`) REFERENCES `properties`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB;

ALTER TABLE properties
ADD COLUMN latitude DECIMAL(10,7) NULL,
ADD COLUMN longitude DECIMAL(10,7) NULL;

ALTER TABLE posts
ADD COLUMN university VARCHAR(150) NOT NULL,
ADD COLUMN city VARCHAR(100) NOT NULL,
ADD COLUMN preferred_area VARCHAR(150) NULL,
ADD COLUMN budget DECIMAL(10,2) NOT NULL,
ADD COLUMN rooms INT DEFAULT 1,
ADD COLUMN bathrooms INT DEFAULT 1,
ADD COLUMN area INT DEFAULT 0,
ADD COLUMN status ENUM('active','closed') DEFAULT 'active';

CREATE TABLE property_images (
    id INT AUTO_INCREMENT PRIMARY KEY,
    property_id INT NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (property_id)
    REFERENCES properties(id)
    ON DELETE CASCADE
);

CREATE TABLE favorites (

    id INT AUTO_INCREMENT PRIMARY KEY,

    user_id INT NOT NULL,

    property_id INT NULL,

    post_id INT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    FOREIGN KEY (property_id)
        REFERENCES properties(id)
        ON DELETE CASCADE,

    FOREIGN KEY (post_id)
        REFERENCES posts(id)
        ON DELETE CASCADE
);

CREATE TABLE conversations (

    id INT AUTO_INCREMENT PRIMARY KEY,

    student_id INT NOT NULL,

    owner_id INT NOT NULL,

    property_id INT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (student_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    FOREIGN KEY (owner_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    FOREIGN KEY (property_id)
        REFERENCES properties(id)
        ON DELETE CASCADE
);

ALTER TABLE messages
ADD COLUMN conversation_id INT NULL;

ALTER TABLE messages
ADD CONSTRAINT fk_messages_conversation
FOREIGN KEY (conversation_id)
REFERENCES conversations(id)
ON DELETE CASCADE;

CREATE TABLE notifications (

    id INT AUTO_INCREMENT PRIMARY KEY,

    user_id INT NOT NULL,

    title VARCHAR(255),

    body TEXT,

    is_read BOOLEAN DEFAULT FALSE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE
);

CREATE INDEX idx_property_city ON properties(city);

CREATE INDEX idx_property_rent ON properties(rent);

CREATE INDEX idx_property_rooms ON properties(rooms);

CREATE INDEX idx_property_university ON properties(nearby_university);

CREATE INDEX idx_posts_budget ON posts(budget);

CREATE INDEX idx_posts_university ON posts(university);

ALTER TABLE users
ADD COLUMN profile_image VARCHAR(500) NULL,
ADD COLUMN bio TEXT NULL;
-- ============================================================
-- Admin & Monetization System
-- ============================================================

-- Property / post moderation. Named `approval_status` (not `status`) to
-- avoid colliding with `properties.occupancy` and the existing
-- `posts.status` column (active/closed, used by students to open/close
-- their own requests).
ALTER TABLE properties
ADD COLUMN approval_status ENUM('pending','approved','rejected') NOT NULL DEFAULT 'pending',
ADD COLUMN rejection_reason TEXT NULL;

ALTER TABLE posts
ADD COLUMN approval_status ENUM('pending','approved','rejected') NOT NULL DEFAULT 'pending',
ADD COLUMN rejection_reason TEXT NULL;

-- Backfill: anything created before this migration should stay publicly
-- visible instead of disappearing behind the new approval gate.
UPDATE properties SET approval_status = 'approved' WHERE approval_status = 'pending';
UPDATE posts SET approval_status = 'approved' WHERE approval_status = 'pending';

CREATE TABLE IF NOT EXISTS payment_requests (
  id INT AUTO_INCREMENT PRIMARY KEY,
  payer_id INT NOT NULL,
  target_user_id INT NOT NULL,
  property_id INT NULL,
  post_id INT NULL,
  payment_method ENUM('instapay','vodafone_cash','orange_cash','etisalat_cash') NOT NULL,
  amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  transaction_reference VARCHAR(255) NULL,
  payment_proof VARCHAR(500) NULL,
  status ENUM('pending','approved','rejected') NOT NULL DEFAULT 'pending',
  admin_notes TEXT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  approved_at TIMESTAMP NULL,
  FOREIGN KEY (payer_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (target_user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE SET NULL,
  FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE INDEX idx_payment_requests_payer ON payment_requests(payer_id, target_user_id, status);

-- users.suspended lets admins deactivate an account without deleting it.
ALTER TABLE users
ADD COLUMN is_suspended BOOLEAN NOT NULL DEFAULT FALSE;

-- ============================================================
-- Cloudinary, property features, payment commission, reviews
-- ============================================================
ALTER TABLE users
ADD COLUMN profile_image_public_id VARCHAR(255) NULL;

ALTER TABLE property_images
ADD COLUMN public_id VARCHAR(255) NULL;

ALTER TABLE properties
ADD COLUMN image_public_id VARCHAR(255) NULL,
ADD COLUMN features JSON NULL,
ADD COLUMN views INT NOT NULL DEFAULT 0;

ALTER TABLE payment_requests
ADD COLUMN payment_proof_public_id VARCHAR(255) NULL,
ADD COLUMN sender_phone VARCHAR(20) NULL,
ADD COLUMN commission_rate DECIMAL(5,4) NULL,
ADD COLUMN base_rent DECIMAL(10,2) NULL;

CREATE TABLE IF NOT EXISTS reviews (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT NOT NULL,
  owner_id INT NOT NULL,
  property_id INT NULL,
  rating TINYINT NOT NULL,
  comment TEXT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE SET NULL,
  UNIQUE KEY uniq_student_owner_review (student_id, owner_id),
  CONSTRAINT chk_review_rating CHECK (rating BETWEEN 1 AND 5)
) ENGINE=InnoDB;
