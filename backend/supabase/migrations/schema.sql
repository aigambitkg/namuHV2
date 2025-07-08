-- =====================================================
-- RECRUITING PLATFORM - COMPLETE DATABASE SCHEMA
-- =====================================================
-- Tech Stack: Supabase (PostgreSQL), React/Next.js
-- Features: Multi-Role System, AI Integration, ATS, Community
-- =====================================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- For fuzzy text search
CREATE EXTENSION IF NOT EXISTS "vector"; -- For AI embeddings

-- =====================================================
-- ENUM TYPES
-- =====================================================

-- User roles
CREATE TYPE user_role AS ENUM ('applicant', 'recruiter', 'hiring_manager', 'admin', 'consultant');

-- Application status
CREATE TYPE application_status AS ENUM (
    'draft',
    'submitted',
    'screening',
    'shortlisted',
    'interview_scheduled',
    'interview_completed',
    'assessment',
    'reference_check',
    'offer_extended',
    'offer_accepted',
    'offer_declined',
    'rejected',
    'withdrawn'
);

-- Document types
CREATE TYPE document_type AS ENUM ('cv', 'cover_letter', 'certificate', 'reference', 'portfolio', 'other');

-- Job status
CREATE TYPE job_status AS ENUM ('draft', 'active', 'paused', 'closed', 'archived');

-- Message status
CREATE TYPE message_status AS ENUM ('sent', 'delivered', 'read');

-- Community post status
CREATE TYPE post_status AS ENUM ('active', 'hidden', 'reported', 'deleted');

-- =====================================================
-- CORE TABLES
-- =====================================================

-- Users table (extends Supabase Auth)
CREATE TABLE users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) UNIQUE NOT NULL,
    role user_role NOT NULL DEFAULT 'applicant',
    is_active BOOLEAN DEFAULT true,
    email_verified BOOLEAN DEFAULT false,
    mfa_enabled BOOLEAN DEFAULT false,
    last_login TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User profiles (shared base profile)
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone VARCHAR(20),
    avatar_url TEXT,
    bio TEXT,
    location VARCHAR(255),
    timezone VARCHAR(50) DEFAULT 'UTC',
    language VARCHAR(10) DEFAULT 'de',
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- APPLICANT SPECIFIC TABLES
-- =====================================================

-- Applicant profiles (extends user_profiles)
CREATE TABLE applicant_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    profile_id UUID UNIQUE NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
    title VARCHAR(255),
    years_experience INTEGER,
    current_position VARCHAR(255),
    current_company VARCHAR(255),
    salary_expectation_min INTEGER,
    salary_expectation_max INTEGER,
    notice_period_days INTEGER,
    available_from DATE,
    willing_to_relocate BOOLEAN DEFAULT false,
    preferred_locations TEXT[],
    work_permit_status VARCHAR(100),
    skills TEXT[],
    languages JSONB DEFAULT '[]', -- [{language: 'de', level: 'native'}]
    education JSONB DEFAULT '[]', -- [{degree, field, institution, year}]
    experience JSONB DEFAULT '[]', -- [{title, company, from, to, description}]
    talent_pool_opt_in BOOLEAN DEFAULT false,
    profile_completeness INTEGER DEFAULT 0,
    ai_embedding vector(1536), -- For AI matching
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Applicant documents
CREATE TABLE applicant_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type document_type NOT NULL,
    name VARCHAR(255) NOT NULL,
    file_url TEXT NOT NULL,
    file_size INTEGER,
    mime_type VARCHAR(100),
    is_primary BOOLEAN DEFAULT false,
    ai_parsed_content JSONB,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Applicant dashboard configuration
CREATE TABLE applicant_dashboards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    layout JSONB NOT NULL DEFAULT '{"blocks": []}',
    preferences JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- COMPANY & RECRUITER TABLES
-- =====================================================

-- Companies
CREATE TABLE companies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    logo_url TEXT,
    cover_image_url TEXT,
    website VARCHAR(255),
    industry VARCHAR(100),
    company_size VARCHAR(50),
    founded_year INTEGER,
    headquarters_location VARCHAR(255),
    locations TEXT[],
    benefits JSONB DEFAULT '[]',
    culture_values JSONB DEFAULT '[]',
    tech_stack TEXT[],
    social_links JSONB DEFAULT '{}',
    is_verified BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Recruiter profiles
CREATE TABLE recruiter_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    profile_id UUID UNIQUE NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
    company_id UUID REFERENCES companies(id) ON DELETE SET NULL,
    department VARCHAR(100),
    position VARCHAR(255),
    specializations TEXT[],
    calendar_link TEXT,
    availability_settings JSONB DEFAULT '{}',
    is_consultant BOOLEAN DEFAULT false,
    consultant_company VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Recruiter dashboard configuration
CREATE TABLE recruiter_dashboards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    layout JSONB NOT NULL DEFAULT '{"blocks": []}',
    preferences JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- JOB POSTING TABLES
-- =====================================================

-- Jobs
CREATE TABLE jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    recruiter_id UUID NOT NULL REFERENCES users(id),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    requirements TEXT NOT NULL,
    responsibilities TEXT NOT NULL,
    benefits TEXT,
    location VARCHAR(255),
    remote_option VARCHAR(50), -- 'onsite', 'remote', 'hybrid'
    employment_type VARCHAR(50), -- 'full-time', 'part-time', 'contract', 'freelance'
    seniority_level VARCHAR(50),
    department VARCHAR(100),
    salary_min INTEGER NOT NULL, -- Required field
    salary_max INTEGER NOT NULL, -- Required field
    salary_currency VARCHAR(3) DEFAULT 'EUR',
    salary_period VARCHAR(20) DEFAULT 'yearly',
    application_deadline DATE,
    start_date DATE,
    required_languages JSONB DEFAULT '[]',
    required_skills TEXT[],
    nice_to_have_skills TEXT[],
    experience_years_min INTEGER,
    experience_years_max INTEGER,
    education_requirements JSONB DEFAULT '[]',
    process_stages JSONB NOT NULL, -- Required: [{stage, description, duration}]
    is_hidden BOOLEAN DEFAULT false, -- For hidden job postings
    status job_status DEFAULT 'draft',
    views_count INTEGER DEFAULT 0,
    applications_count INTEGER DEFAULT 0,
    ai_embedding vector(1536), -- For AI matching
    external_posting_urls JSONB DEFAULT '[]', -- For multiposting
    metadata JSONB DEFAULT '{}',
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Job views tracking
CREATE TABLE job_views (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    ip_address INET,
    user_agent TEXT,
    viewed_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- APPLICATION MANAGEMENT TABLES
-- =====================================================

-- Applications
CREATE TABLE applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    applicant_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status application_status DEFAULT 'draft',
    current_stage VARCHAR(100),
    cover_letter TEXT,
    cv_document_id UUID REFERENCES applicant_documents(id),
    additional_documents UUID[],
    answers JSONB DEFAULT '{}', -- For custom questions
    match_score NUMERIC(5,2), -- AI calculated match percentage
    ai_evaluation JSONB, -- Detailed AI evaluation
    recruiter_notes TEXT,
    is_quick_apply BOOLEAN DEFAULT false,
    applied_via VARCHAR(50) DEFAULT 'platform', -- 'platform', 'quick_apply', 'external'
    metadata JSONB DEFAULT '{}',
    submitted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(job_id, applicant_id)
);

-- Application stages tracking
CREATE TABLE application_stages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
    stage_name VARCHAR(100) NOT NULL,
    status VARCHAR(50) NOT NULL,
    entered_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    notes TEXT,
    metadata JSONB DEFAULT '{}'
);

-- Application evaluations
CREATE TABLE application_evaluations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
    evaluator_id UUID NOT NULL REFERENCES users(id),
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    strengths TEXT,
    weaknesses TEXT,
    recommendation VARCHAR(50), -- 'strong_yes', 'yes', 'maybe', 'no', 'strong_no'
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Application notes (for quick notes feature)
CREATE TABLE application_notes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id),
    note TEXT NOT NULL,
    is_private BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- TALENT POOL TABLES
-- =====================================================

-- Talent pools
CREATE TABLE talent_pools (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    created_by UUID NOT NULL REFERENCES users(id),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    tags TEXT[],
    is_active BOOLEAN DEFAULT true,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Talent pool members
CREATE TABLE talent_pool_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pool_id UUID NOT NULL REFERENCES talent_pools(id) ON DELETE CASCADE,
    applicant_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    added_by UUID NOT NULL REFERENCES users(id),
    match_score NUMERIC(5,2),
    notes TEXT,
    tags TEXT[],
    added_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(pool_id, applicant_id)
);

-- =====================================================
-- COMMUNICATION TABLES
-- =====================================================

-- Messages
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sender_id UUID NOT NULL REFERENCES users(id),
    recipient_id UUID NOT NULL REFERENCES users(id),
    subject VARCHAR(255),
    content TEXT NOT NULL,
    status message_status DEFAULT 'sent',
    application_id UUID REFERENCES applications(id) ON DELETE SET NULL,
    parent_message_id UUID REFERENCES messages(id) ON DELETE SET NULL,
    is_system_message BOOLEAN DEFAULT false,
    metadata JSONB DEFAULT '{}',
    sent_at TIMESTAMPTZ DEFAULT NOW(),
    delivered_at TIMESTAMPTZ,
    read_at TIMESTAMPTZ
);

-- Message attachments
CREATE TABLE message_attachments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    message_id UUID NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
    file_name VARCHAR(255) NOT NULL,
    file_url TEXT NOT NULL,
    file_size INTEGER,
    mime_type VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- COMMUNITY TABLES
-- =====================================================

-- Community posts
CREATE TABLE community_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    author_id UUID NOT NULL REFERENCES users(id),
    title VARCHAR(500) NOT NULL,
    content TEXT NOT NULL,
    category VARCHAR(50),
    tags TEXT[],
    is_anonymous BOOLEAN DEFAULT true,
    status post_status DEFAULT 'active',
    views_count INTEGER DEFAULT 0,
    likes_count INTEGER DEFAULT 0,
    dislikes_count INTEGER DEFAULT 0,
    comments_count INTEGER DEFAULT 0,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Community post reactions
CREATE TABLE community_reactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_id UUID REFERENCES community_posts(id) ON DELETE CASCADE,
    comment_id UUID REFERENCES community_comments(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id),
    reaction_type VARCHAR(20) NOT NULL, -- 'like', 'dislike'
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(post_id, user_id),
    UNIQUE(comment_id, user_id),
    CHECK (
        (post_id IS NOT NULL AND comment_id IS NULL) OR 
        (post_id IS NULL AND comment_id IS NOT NULL)
    )
);

-- Community comments
CREATE TABLE community_comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_id UUID NOT NULL REFERENCES community_posts(id) ON DELETE CASCADE,
    author_id UUID NOT NULL REFERENCES users(id),
    parent_comment_id UUID REFERENCES community_comments(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    is_anonymous BOOLEAN DEFAULT true,
    status post_status DEFAULT 'active',
    likes_count INTEGER DEFAULT 0,
    dislikes_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- AI & AUTOMATION TABLES
-- =====================================================

-- AI generated content
CREATE TABLE ai_generated_content (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id),
    content_type VARCHAR(50) NOT NULL, -- 'cv', 'cover_letter', 'job_description'
    prompt TEXT,
    generated_content TEXT NOT NULL,
    model_used VARCHAR(50),
    tokens_used INTEGER,
    feedback_rating INTEGER,
    is_saved BOOLEAN DEFAULT false,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- AI coaching sessions
CREATE TABLE ai_coaching_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id),
    session_type VARCHAR(50), -- 'career', 'interview', 'resume'
    messages JSONB NOT NULL DEFAULT '[]',
    summary TEXT,
    recommendations JSONB DEFAULT '[]',
    duration_seconds INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    ended_at TIMESTAMPTZ
);

-- =====================================================
-- ANALYTICS & STATISTICS TABLES
-- =====================================================

-- Recruiter KPIs
CREATE TABLE recruiter_kpis (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    recruiter_id UUID NOT NULL REFERENCES users(id),
    company_id UUID REFERENCES companies(id),
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    jobs_posted INTEGER DEFAULT 0,
    applications_received INTEGER DEFAULT 0,
    candidates_screened INTEGER DEFAULT 0,
    interviews_scheduled INTEGER DEFAULT 0,
    offers_extended INTEGER DEFAULT 0,
    offers_accepted INTEGER DEFAULT 0,
    avg_time_to_hire_days NUMERIC(5,2),
    avg_cost_per_hire NUMERIC(10,2),
    quality_of_hire_score NUMERIC(3,2),
    metadata JSONB DEFAULT '{}',
    calculated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(recruiter_id, period_start, period_end)
);

-- Company analytics
CREATE TABLE company_analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES companies(id),
    date DATE NOT NULL,
    active_jobs INTEGER DEFAULT 0,
    total_applications INTEGER DEFAULT 0,
    total_views INTEGER DEFAULT 0,
    conversion_rate NUMERIC(5,2),
    avg_time_to_fill_days NUMERIC(5,2),
    top_sources JSONB DEFAULT '[]',
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(company_id, date)
);

-- =====================================================
-- AUDIT & COMPLIANCE TABLES
-- =====================================================

-- Audit logs
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50),
    entity_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- GDPR data retention
CREATE TABLE data_retention_policies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    entity_type VARCHAR(50) NOT NULL,
    retention_days INTEGER NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- User and profile indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_user_profiles_user_id ON user_profiles(user_id);

-- Job indexes
CREATE INDEX idx_jobs_company_id ON jobs(company_id);
CREATE INDEX idx_jobs_status ON jobs(status);
CREATE INDEX idx_jobs_title_trgm ON jobs USING gin(title gin_trgm_ops);
CREATE INDEX idx_jobs_location ON jobs(location);
CREATE INDEX idx_jobs_salary ON jobs(salary_min, salary_max);
CREATE INDEX idx_jobs_ai_embedding ON jobs USING ivfflat (ai_embedding vector_cosine_ops);

-- Application indexes
CREATE INDEX idx_applications_job_id ON applications(job_id);
CREATE INDEX idx_applications_applicant_id ON applications(applicant_id);
CREATE INDEX idx_applications_status ON applications(status);
CREATE INDEX idx_applications_match_score ON applications(match_score);

-- Message indexes
CREATE INDEX idx_messages_sender_id ON messages(sender_id);
CREATE INDEX idx_messages_recipient_id ON messages(recipient_id);
CREATE INDEX idx_messages_sent_at ON messages(sent_at);

-- Community indexes
CREATE INDEX idx_community_posts_author_id ON community_posts(author_id);
CREATE INDEX idx_community_posts_created_at ON community_posts(created_at);
CREATE INDEX idx_community_posts_status ON community_posts(status);

-- Analytics indexes
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE applicant_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE recruiter_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Users can read their own data
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (auth.uid() = id);

-- Applicants can manage their profiles
CREATE POLICY "Applicants can view own applicant profile" ON applicant_profiles
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Applicants can update own applicant profile" ON applicant_profiles
    FOR UPDATE USING (auth.uid() = user_id);

-- Public can view active jobs
CREATE POLICY "Public can view active jobs" ON jobs
    FOR SELECT USING (status = 'active' AND is_hidden = false);

-- Recruiters can manage company jobs
CREATE POLICY "Recruiters can manage company jobs" ON jobs
    FOR ALL USING (
        auth.uid() IN (
            SELECT user_id FROM recruiter_profiles 
            WHERE company_id = jobs.company_id
        )
    );

-- Applications visibility
CREATE POLICY "Applicants can view own applications" ON applications
    FOR SELECT USING (auth.uid() = applicant_id);

CREATE POLICY "Recruiters can view company applications" ON applications
    FOR SELECT USING (
        job_id IN (
            SELECT id FROM jobs 
            WHERE company_id IN (
                SELECT company_id FROM recruiter_profiles 
                WHERE user_id = auth.uid()
            )
        )
    );

-- Messages visibility
CREATE POLICY "Users can view own messages" ON messages
    FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = recipient_id);

-- =====================================================
-- FUNCTIONS AND TRIGGERS
-- =====================================================

-- Updated timestamp trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to all relevant tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_jobs_updated_at BEFORE UPDATE ON jobs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_applications_updated_at BEFORE UPDATE ON applications
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to calculate profile completeness
CREATE OR REPLACE FUNCTION calculate_profile_completeness(applicant_id UUID)
RETURNS INTEGER AS $$
DECLARE
    completeness INTEGER := 0;
    profile applicant_profiles%ROWTYPE;
BEGIN
    SELECT * INTO profile FROM applicant_profiles WHERE user_id = applicant_id;
    
    IF profile.title IS NOT NULL THEN completeness := completeness + 10; END IF;
    IF profile.years_experience IS NOT NULL THEN completeness := completeness + 10; END IF;
    IF profile.skills IS NOT NULL AND array_length(profile.skills, 1) > 0 THEN completeness := completeness + 15; END IF;
    IF profile.education IS NOT NULL AND jsonb_array_length(profile.education) > 0 THEN completeness := completeness + 15; END IF;
    IF profile.experience IS NOT NULL AND jsonb_array_length(profile.experience) > 0 THEN completeness := completeness + 20; END IF;
    IF EXISTS (SELECT 1 FROM applicant_documents WHERE user_id = applicant_id AND type = 'cv') THEN completeness := completeness + 20; END IF;
    IF profile.bio IS NOT NULL THEN completeness := completeness + 10; END IF;
    
    RETURN LEAST(completeness, 100);
END;
$$ LANGUAGE plpgsql;

-- Function to increment view counts
CREATE OR REPLACE FUNCTION increment_job_views(job_id_param UUID, user_id_param UUID DEFAULT NULL)
RETURNS VOID AS $$
BEGIN
    -- Log the view
    INSERT INTO job_views (job_id, user_id, ip_address)
    VALUES (job_id_param, user_id_param, inet_client_addr());
    
    -- Update the counter
    UPDATE jobs 
    SET views_count = views_count + 1 
    WHERE id = job_id_param;
END;
$$ LANGUAGE plpgsql;

-- Function for AI matching score calculation (placeholder for actual implementation)
CREATE OR REPLACE FUNCTION calculate_match_score(job_id_param UUID, applicant_id_param UUID)
RETURNS NUMERIC AS $$
DECLARE
    score NUMERIC := 0;
    job_record jobs%ROWTYPE;
    applicant_record applicant_profiles%ROWTYPE;
BEGIN
    -- Get job and applicant data
    SELECT * INTO job_record FROM jobs WHERE id = job_id_param;
    SELECT * INTO applicant_record FROM applicant_profiles WHERE user_id = applicant_id_param;
    
    -- Basic matching logic (to be enhanced with actual AI/vector similarity)
    -- This is a simplified version - actual implementation would use vector similarity
    
    -- Skills matching
    IF applicant_record.skills IS NOT NULL AND job_record.required_skills IS NOT NULL THEN
        score := score + (
            SELECT COUNT(*)::NUMERIC * 10 
            FROM unnest(applicant_record.skills) AS s
            WHERE s = ANY(job_record.required_skills)
        );
    END IF;
    
    -- Experience matching
    IF applicant_record.years_experience >= job_record.experience_years_min THEN
        score := score + 20;
    END IF;
    
    -- Location matching
    IF applicant_record.preferred_locations IS NOT NULL THEN
        IF job_record.location = ANY(applicant_record.preferred_locations) OR job_record.remote_option = 'remote' THEN
            score := score + 15;
        END IF;
    END IF;
    
    -- Salary matching
    IF applicant_record.salary_expectation_min <= job_record.salary_max 
       AND applicant_record.salary_expectation_max >= job_record.salary_min THEN
        score := score + 15;
    END IF;
    
    RETURN LEAST(score, 100);
END;
$$ LANGUAGE plpgsql;

-- Function to anonymize user data for GDPR compliance
CREATE OR REPLACE FUNCTION anonymize_user_data(user_id_param UUID)
RETURNS VOID AS $$
BEGIN
    -- Update user table
    UPDATE users 
    SET email = 'deleted_' || gen_random_uuid() || '@anonymous.com',
        is_active = false
    WHERE id = user_id_param;
    
    -- Update profiles
    UPDATE user_profiles
    SET first_name = 'DELETED',
        last_name = 'USER',
        phone = NULL,
        avatar_url = NULL,
        bio = NULL
    WHERE user_id = user_id_param;
    
    -- Remove documents
    DELETE FROM applicant_documents WHERE user_id = user_id_param;
    
    -- Anonymize messages
    UPDATE messages
    SET content = '[Message deleted for privacy]'
    WHERE sender_id = user_id_param OR recipient_id = user_id_param;
    
    -- Log the action
    INSERT INTO audit_logs (user_id, action, entity_type, entity_id)
    VALUES (user_id_param, 'user_data_anonymized', 'user', user_id_param);
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- INITIAL DATA SETUP
-- =====================================================

-- Insert default data retention policies
INSERT INTO data_retention_policies (entity_type, retention_days, description) VALUES
('application', 180, 'Applications retained for 6 months after rejection/withdrawal'),
('message', 365, 'Messages retained for 1 year'),
('cv', 730, 'CVs retained for 2 years with consent'),
('audit_log', 2555, 'Audit logs retained for 7 years');

-- =====================================================
-- EDGE FUNCTIONS HELPERS (Supabase Edge Functions)
-- =====================================================

-- Helper function for Edge Functions to validate API requests
CREATE OR REPLACE FUNCTION validate_api_request(api_key TEXT, required_role user_role DEFAULT NULL)
RETURNS TABLE(is_valid BOOLEAN, user_id UUID, error_message TEXT) AS $$
DECLARE
    key_user_id UUID;
    key_role user_role;
BEGIN
    -- Validate API key (simplified - actual implementation would be more complex)
    SELECT u.id, u.role INTO key_user_id, key_role
    FROM users u
    WHERE u.id = auth.uid();
    
    IF key_user_id IS NULL THEN
        RETURN QUERY SELECT false, NULL::UUID, 'Invalid API key'::TEXT;
    ELSIF required_role IS NOT NULL AND key_role != required_role THEN
        RETURN QUERY SELECT false, key_user_id, 'Insufficient permissions'::TEXT;
    ELSE
        RETURN QUERY SELECT true, key_user_id, NULL::TEXT;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 