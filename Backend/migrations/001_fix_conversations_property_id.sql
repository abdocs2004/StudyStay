-- Migration: allow conversations.property_id to be NULL
-- Reason: Owners can message students about a housing request (post) that has
-- no property attached, and students can message owners without picking a
-- specific property first. The original schema had property_id as NOT NULL,
-- which caused every conversation-creation request without a property_id to
-- fail with a SQL error (this was the root cause of "chat stopped working").
--
-- Run this once against your existing `studystay` database:
--   mysql -u root -p studystay < migrations/001_fix_conversations_property_id.sql

USE `studystay`;

ALTER TABLE `conversations`
  MODIFY COLUMN `property_id` INT NULL;
