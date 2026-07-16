-- Migration: Cloudinary integration, property features, payment commission
-- details, and the reviews system.
-- Run once:
--   mysql -u root -p studystay < migrations/003_cloudinary_features_reviews.sql

USE `studystay`;

-- Cloudinary public_id tracking (needed to delete/replace images on Cloudinary,
-- not just overwrite the DB row).
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

-- Reviews: a student may review a given owner once (prevents duplicate
-- reviews from the same student on the same owner across properties).
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
