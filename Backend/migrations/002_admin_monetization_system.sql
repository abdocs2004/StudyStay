-- Migration: Admin & Monetization system
-- Run once against your existing database:
--   mysql -u root -p studystay < migrations/002_admin_monetization_system.sql

USE `studystay`;

ALTER TABLE properties
ADD COLUMN approval_status ENUM('pending','approved','rejected') NOT NULL DEFAULT 'pending',
ADD COLUMN rejection_reason TEXT NULL;

ALTER TABLE posts
ADD COLUMN approval_status ENUM('pending','approved','rejected') NOT NULL DEFAULT 'pending',
ADD COLUMN rejection_reason TEXT NULL;

-- Don't hide everything you already had live behind the new gate.
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

ALTER TABLE users
ADD COLUMN is_suspended BOOLEAN NOT NULL DEFAULT FALSE;
