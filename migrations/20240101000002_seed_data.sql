-- Seed Data Migration
INSERT INTO data_retention_policies (entity_type, retention_days, description) VALUES
('application', 180, 'Applications retained for 6 months after rejection/withdrawal'),
('message', 365, 'Messages retained for 1 year'),
('cv', 730, 'CVs retained for 2 years with consent'),
('audit_log', 2555, 'Audit logs retained for 7 years'); 