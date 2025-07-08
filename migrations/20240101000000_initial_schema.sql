-- Initial Schema Migration
-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "vector";

-- ENUM Types
CREATE TYPE user_role AS ENUM ('applicant', 'recruiter', 'hiring_manager', 'admin', 'consultant');
CREATE TYPE application_status AS ENUM (
    'draft', 'submitted', 'screening', 'shortlisted', 'interview_scheduled', 'interview_completed', 'assessment', 'reference_check', 'offer_extended', 'offer_accepted', 'offer_declined', 'rejected', 'withdrawn'
);
CREATE TYPE document_type AS ENUM ('cv', 'cover_letter', 'certificate', 'reference', 'portfolio', 'other');
CREATE TYPE job_status AS ENUM ('draft', 'active', 'paused', 'closed', 'archived');
CREATE TYPE message_status AS ENUM ('sent', 'delivered', 'read');
CREATE TYPE post_status AS ENUM ('active', 'hidden', 'reported', 'deleted');

-- Tabellen (alle CREATE TABLE ...)
-- ... (Hier alle Tabellen aus schema.sql einfügen) ...

-- Indizes (alle CREATE INDEX ...)
-- ... (Hier alle Indizes aus schema.sql einfügen) ...

-- Funktionen und Trigger (ohne RLS, ohne Seed)
-- ... (Hier alle Funktionen und Trigger aus schema.sql einfügen, außer RLS und Seed) ... 