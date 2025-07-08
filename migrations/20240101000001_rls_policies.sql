-- RLS Policies Migration
-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE applicant_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE recruiter_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Applicants can view own applicant profile" ON applicant_profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Applicants can update own applicant profile" ON applicant_profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Public can view active jobs" ON jobs FOR SELECT USING (status = 'active' AND is_hidden = false);
CREATE POLICY "Recruiters can manage company jobs" ON jobs FOR ALL USING (
    auth.uid() IN (
        SELECT user_id FROM recruiter_profiles WHERE company_id = jobs.company_id
    )
);
CREATE POLICY "Applicants can view own applications" ON applications FOR SELECT USING (auth.uid() = applicant_id);
CREATE POLICY "Recruiters can view company applications" ON applications FOR SELECT USING (
    job_id IN (
        SELECT id FROM jobs WHERE company_id IN (
            SELECT company_id FROM recruiter_profiles WHERE user_id = auth.uid()
        )
    )
);
CREATE POLICY "Users can view own messages" ON messages FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = recipient_id); 