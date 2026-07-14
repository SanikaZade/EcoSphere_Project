-- ============================================================
-- EcoSphere ESG Platform — Full Sample Data Seed
-- Run this AFTER schema.sql has been applied.
-- Usage: psql -U postgres -d ecosphere -f seed.sql
-- ============================================================

-- Clean existing data (handled by SQLite init sequence)

-- ── SETTINGS ──────────────────────────────────────────────
INSERT INTO settings (auto_emission_calculation, evidence_required, badge_auto_award,
  weight_environmental, weight_social, weight_governance, notification_config)
VALUES (true, true, true, 40, 30, 30,
  '{"newComplianceIssue":{"inApp":true,"email":true},"approvalDecision":{"inApp":true,"email":false},"policyReminder":{"inApp":true,"email":true},"badgeUnlock":{"inApp":true,"email":false}}');

-- ── USERS ─────────────────────────────────────────────────
INSERT INTO users (id, name, email, password_hash, role) VALUES
  ('a1b2c3d4-0001-0001-0001-000000000001', 'Admin User',    'admin@ecosphere.com',    '$2a$10$RgxzCFZCE8FWNk5vGAHaauRJeTuRkEO4t7p5z0M6sJzDpkHqXk8Ri', 'Admin'),
  ('a1b2c3d4-0001-0001-0001-000000000002', 'Employee User', 'employee@ecosphere.com', '$2a$10$5bBVOEeqYh1t0o4OLOSY.uF5cA9HvFh9.S7WCKsMlHGhQhCHbEK3e', 'Employee');
-- passwords: admin123 / emp123

-- ── DEPARTMENTS ───────────────────────────────────────────
INSERT INTO departments (id, name, code, head, employee_count, status) VALUES
  ('d0000001-0000-0000-0000-000000000001', 'Operations',        'OPS',  'Ravi Sharma',       42, 'Active'),
  ('d0000001-0000-0000-0000-000000000002', 'Manufacturing',     'MFG',  'Priya Nair',        58, 'Active'),
  ('d0000001-0000-0000-0000-000000000003', 'Human Resources',   'HR',   'Anjali Mehta',      15, 'Active'),
  ('d0000001-0000-0000-0000-000000000004', 'Sustainability',    'SUS',  'Deepak Joshi',      10, 'Active'),
  ('d0000001-0000-0000-0000-000000000005', 'Finance',           'FIN',  'Sunita Rao',        20, 'Active'),
  ('d0000001-0000-0000-0000-000000000006', 'Supply Chain',      'SCM',  'Mohit Verma',       30, 'Active');

-- ── CATEGORIES ────────────────────────────────────────────
INSERT INTO categories (id, name, type, status) VALUES
  ('c0000001-0000-0000-0000-000000000001', 'Community Outreach',      'CSR Activity', 'Active'),
  ('c0000001-0000-0000-0000-000000000002', 'Environmental Clean-Up',  'CSR Activity', 'Active'),
  ('c0000001-0000-0000-0000-000000000003', 'Education & Literacy',    'CSR Activity', 'Active'),
  ('c0000001-0000-0000-0000-000000000004', 'Health & Wellness',       'CSR Activity', 'Active'),
  ('c0000001-0000-0000-0000-000000000005', 'Carbon Reduction',        'Challenge',    'Active'),
  ('c0000001-0000-0000-0000-000000000006', 'Energy Efficiency',       'Challenge',    'Active'),
  ('c0000001-0000-0000-0000-000000000007', 'Waste Management',        'Challenge',    'Active'),
  ('c0000001-0000-0000-0000-000000000008', 'Sustainable Procurement', 'Challenge',    'Active');

-- ── EMISSION FACTORS ──────────────────────────────────────
INSERT INTO emission_factors (id, activity_type, unit, value, updated_at) VALUES
  ('ef000001-0000-0000-0000-000000000001', 'Purchase',        'INR',        0.00021, '2025-01-15'),
  ('ef000001-0000-0000-0000-000000000002', 'Manufacturing',   'units',      2.34,    '2025-03-01'),
  ('ef000001-0000-0000-0000-000000000003', 'Expense',         'INR',        0.00018, '2025-01-15'),
  ('ef000001-0000-0000-0000-000000000004', 'Fleet',           'km',         0.21,    '2025-02-20');

-- ── PRODUCT PROFILES ──────────────────────────────────────
INSERT INTO product_profiles (id, product_name, sustainable_material, recycled_content, carbon_footprint) VALUES
  ('pp000001-0000-0000-0000-000000000001', 'EcoPack Carton',       true,  '80%',  '1.2 kg CO2e'),
  ('pp000001-0000-0000-0000-000000000002', 'BioPlastic Bottle',    true,  '60%',  '0.8 kg CO2e'),
  ('pp000001-0000-0000-0000-000000000003', 'Standard Steel Beam',  false, '15%',  '8.5 kg CO2e'),
  ('pp000001-0000-0000-0000-000000000004', 'Solar Panel Module',   true,  '30%',  '3.1 kg CO2e'),
  ('pp000001-0000-0000-0000-000000000005', 'Recycled Paper Ream',  true,  '100%', '0.3 kg CO2e');

-- ── EMPLOYEES ─────────────────────────────────────────────
INSERT INTO employees (id, name, department_id, gender, xp, points) VALUES
  ('em000001-0000-0000-0000-000000000001', 'Arjun Kapoor',   'd0000001-0000-0000-0000-000000000001', 'Male',   1200, 850),
  ('em000001-0000-0000-0000-000000000002', 'Sneha Patil',    'd0000001-0000-0000-0000-000000000002', 'Female', 980,  620),
  ('em000001-0000-0000-0000-000000000003', 'Rahul Gupta',    'd0000001-0000-0000-0000-000000000003', 'Male',   540,  300),
  ('em000001-0000-0000-0000-000000000004', 'Kavya Singh',    'd0000001-0000-0000-0000-000000000004', 'Female', 1750, 1200),
  ('em000001-0000-0000-0000-000000000005', 'Nikhil Desai',   'd0000001-0000-0000-0000-000000000005', 'Male',   420,  180),
  ('em000001-0000-0000-0000-000000000006', 'Pooja Iyer',     'd0000001-0000-0000-0000-000000000002', 'Female', 860,  500),
  ('em000001-0000-0000-0000-000000000007', 'Amit Tiwari',    'd0000001-0000-0000-0000-000000000006', 'Male',   310,  90),
  ('em000001-0000-0000-0000-000000000008', 'Divya Menon',    'd0000001-0000-0000-0000-000000000001', 'Female', 670,  410),
  ('em000001-0000-0000-0000-000000000009', 'Sanjay Kumar',   'd0000001-0000-0000-0000-000000000003', 'Male',   230,  60),
  ('em000001-0000-0000-0000-000000000010', 'Leela Sharma',   'd0000001-0000-0000-0000-000000000004', 'Female', 1100, 730),
  ('em000001-0000-0000-0000-000000000011', 'Rohit Chavan',   'd0000001-0000-0000-0000-000000000006', 'Male',   760,  480),
  ('em000001-0000-0000-0000-000000000012', 'Tanvi Bhatt',    'd0000001-0000-0000-0000-000000000005', 'Female', 590,  340);

-- ── ENVIRONMENTAL GOALS ───────────────────────────────────
INSERT INTO goals (id, department_id, title, target, actual, unit, due_date) VALUES
  ('go000001-0000-0000-0000-000000000001', 'd0000001-0000-0000-0000-000000000001', 'Reduce Scope 1 Emissions',         500,  312, 'tCO2e',   '2026-12-31'),
  ('go000001-0000-0000-0000-000000000002', 'd0000001-0000-0000-0000-000000000002', 'Lower Production Carbon Intensity', 800,  690, 'tCO2e',   '2026-09-30'),
  ('go000001-0000-0000-0000-000000000003', 'd0000001-0000-0000-0000-000000000004', 'Increase Renewable Energy Share',   80,   62,  '%',       '2026-12-31'),
  ('go000001-0000-0000-0000-000000000004', 'd0000001-0000-0000-0000-000000000006', 'Cut Supply Chain Emissions',        300,  210, 'tCO2e',   '2026-10-31'),
  ('go000001-0000-0000-0000-000000000005', 'd0000001-0000-0000-0000-000000000003', 'Reduce Paper Consumption',          40,   28,  'reams/mo','2026-06-30'),
  ('go000001-0000-0000-0000-000000000006', 'd0000001-0000-0000-0000-000000000005', 'Reduce Business Travel Emissions',  120,  95,  'tCO2e',   '2026-12-31');

-- ── POLICIES ──────────────────────────────────────────────
INSERT INTO policies (id, title, published_at, status) VALUES
  ('po000001-0000-0000-0000-000000000001', 'Environmental Management Policy',       '2025-01-10', 'Published'),
  ('po000001-0000-0000-0000-000000000002', 'Carbon Neutrality Roadmap 2030',        '2025-03-15', 'Published'),
  ('po000001-0000-0000-0000-000000000003', 'Supplier Code of Conduct',              '2025-02-01', 'Published'),
  ('po000001-0000-0000-0000-000000000004', 'Diversity & Inclusion Policy',          '2025-04-20', 'Published'),
  ('po000001-0000-0000-0000-000000000005', 'Anti-Bribery & Corruption Policy',      '2024-11-05', 'Published'),
  ('po000001-0000-0000-0000-000000000006', 'Waste Reduction & Recycling Guidelines','2025-05-12', 'Draft'),
  ('po000001-0000-0000-0000-000000000007', 'Water Conservation Policy',             '2025-06-01', 'Draft');

-- ── BADGES ────────────────────────────────────────────────
INSERT INTO badges (id, name, description, unlock_rule, icon) VALUES
  ('ba000001-0000-0000-0000-000000000001', 'Green Pioneer',     'Awarded for reaching 500 XP',              '{"type":"xp","value":500}',                '🌱'),
  ('ba000001-0000-0000-0000-000000000002', 'Eco Champion',      'Awarded for reaching 1000 XP',             '{"type":"xp","value":1000}',               '🏆'),
  ('ba000001-0000-0000-0000-000000000003', 'Sustainability Star','Awarded for reaching 1500 XP',            '{"type":"xp","value":1500}',               '⭐'),
  ('ba000001-0000-0000-0000-000000000004', 'Points Leader',     'Awarded for reaching 500 points',          '{"type":"points","value":500}',            '💎'),
  ('ba000001-0000-0000-0000-000000000005', 'Challenge Crusher', 'Completed 3 challenges',                   '{"type":"challengesCompleted","value":3}',  '⚡'),
  ('ba000001-0000-0000-0000-000000000006', 'Impact Maker',      'Completed 5 challenges',                   '{"type":"challengesCompleted","value":5}',  '🌍');

-- ── REWARDS ───────────────────────────────────────────────
INSERT INTO rewards (id, name, description, points_required, stock, status) VALUES
  ('rw000001-0000-0000-0000-000000000001', 'Eco Water Bottle',        'Stainless steel reusable bottle',         100, 50, 'Active'),
  ('rw000001-0000-0000-0000-000000000002', 'Sustainable Travel Kit',  'Bamboo toothbrush + soap bar set',        200, 30, 'Active'),
  ('rw000001-0000-0000-0000-000000000003', 'Plant-a-Tree Certificate','Certificate for 1 tree planted in name',  150, 100,'Active'),
  ('rw000001-0000-0000-0000-000000000004', 'Extra Leave Day',         '1 additional leave day voucher',          500, 20, 'Active'),
  ('rw000001-0000-0000-0000-000000000005', 'Green Store Voucher',     'INR 500 voucher at partnered green stores',300, 40, 'Active'),
  ('rw000001-0000-0000-0000-000000000006', 'Solar Powered Backpack',  'Backpack with integrated solar panel',    800, 10, 'Active');

-- ── CARBON TRANSACTIONS ───────────────────────────────────
INSERT INTO carbon_transactions (id, department_id, source, emission_factor_id, quantity, emissions, date) VALUES
  ('ct000001-0000-0000-0000-000000000001', 'd0000001-0000-0000-0000-000000000002', 'Manufacturing', 'ef000001-0000-0000-0000-000000000002', 120,  280.80, '2026-01-15'),
  ('ct000001-0000-0000-0000-000000000002', 'd0000001-0000-0000-0000-000000000002', 'Manufacturing', 'ef000001-0000-0000-0000-000000000002', 95,   222.30, '2026-02-10'),
  ('ct000001-0000-0000-0000-000000000003', 'd0000001-0000-0000-0000-000000000001', 'Fleet',         'ef000001-0000-0000-0000-000000000004', 1200, 252.00, '2026-01-20'),
  ('ct000001-0000-0000-0000-000000000004', 'd0000001-0000-0000-0000-000000000001', 'Fleet',         'ef000001-0000-0000-0000-000000000004', 950,  199.50, '2026-02-18'),
  ('ct000001-0000-0000-0000-000000000005', 'd0000001-0000-0000-0000-000000000006', 'Fleet',         'ef000001-0000-0000-0000-000000000004', 2200, 462.00, '2026-01-25'),
  ('ct000001-0000-0000-0000-000000000006', 'd0000001-0000-0000-0000-000000000005', 'Expense',       'ef000001-0000-0000-0000-000000000003', 500000, 90.00, '2026-02-05'),
  ('ct000001-0000-0000-0000-000000000007', 'd0000001-0000-0000-0000-000000000003', 'Purchase',      'ef000001-0000-0000-0000-000000000001', 200000, 42.00, '2026-03-01'),
  ('ct000001-0000-0000-0000-000000000008', 'd0000001-0000-0000-0000-000000000002', 'Manufacturing', 'ef000001-0000-0000-0000-000000000002', 110,  257.40, '2026-03-12'),
  ('ct000001-0000-0000-0000-000000000009', 'd0000001-0000-0000-0000-000000000001', 'Fleet',         'ef000001-0000-0000-0000-000000000004', 1100, 231.00, '2026-03-20'),
  ('ct000001-0000-0000-0000-000000000010', 'd0000001-0000-0000-0000-000000000006', 'Purchase',      'ef000001-0000-0000-0000-000000000001', 350000, 73.50, '2026-04-05');

-- ── CSR ACTIVITIES ────────────────────────────────────────
INSERT INTO csr_activities (id, category_id, title, date, location, status) VALUES
  ('ca000001-0000-0000-0000-000000000001', 'c0000001-0000-0000-0000-000000000002', 'Riverside Clean-Up Drive',       '2026-02-22', 'Pune Riverfront',    'Completed'),
  ('ca000001-0000-0000-0000-000000000002', 'c0000001-0000-0000-0000-000000000001', 'Village Skill Development Camp', '2026-03-10', 'Nashik Village',     'Completed'),
  ('ca000001-0000-0000-0000-000000000003', 'c0000001-0000-0000-0000-000000000003', 'Digital Literacy Workshop',      '2026-04-05', 'Govt School, Pune',  'Completed'),
  ('ca000001-0000-0000-0000-000000000004', 'c0000001-0000-0000-0000-000000000004', 'Free Health Check-up Camp',      '2026-05-18', 'Company Premises',   'Completed'),
  ('ca000001-0000-0000-0000-000000000005', 'c0000001-0000-0000-0000-000000000002', 'Tree Plantation Drive',          '2026-07-20', 'Pune Hills',         'Upcoming'),
  ('ca000001-0000-0000-0000-000000000006', 'c0000001-0000-0000-0000-000000000001', 'Women Entrepreneur Summit',      '2026-08-15', 'Conference Hall',    'Upcoming');

-- ── EMPLOYEE PARTICIPATION ────────────────────────────────
INSERT INTO employee_participation (id, employee_id, activity_id, proof, approval_status, points_earned, completion_date) VALUES
  ('ep000001-0000-0000-0000-000000000001', 'em000001-0000-0000-0000-000000000001', 'ca000001-0000-0000-0000-000000000001', 'cleanup_proof_arjun.jpg', 'Approved', 40, '2026-02-22'),
  ('ep000001-0000-0000-0000-000000000002', 'em000001-0000-0000-0000-000000000004', 'ca000001-0000-0000-0000-000000000001', 'cleanup_proof_kavya.jpg', 'Approved', 40, '2026-02-22'),
  ('ep000001-0000-0000-0000-000000000003', 'em000001-0000-0000-0000-000000000002', 'ca000001-0000-0000-0000-000000000002', 'skill_dev_sneha.jpg',     'Approved', 40, '2026-03-10'),
  ('ep000001-0000-0000-0000-000000000004', 'em000001-0000-0000-0000-000000000010', 'ca000001-0000-0000-0000-000000000003', 'dliteracy_leela.pdf',     'Approved', 40, '2026-04-05'),
  ('ep000001-0000-0000-0000-000000000005', 'em000001-0000-0000-0000-000000000008', 'ca000001-0000-0000-0000-000000000004', null,                      'Pending',  0,  null),
  ('ep000001-0000-0000-0000-000000000006', 'em000001-0000-0000-0000-000000000003', 'ca000001-0000-0000-0000-000000000002', null,                      'Pending',  0,  null);

-- ── CHALLENGES ────────────────────────────────────────────
INSERT INTO challenges (id, title, category_id, description, xp, difficulty, evidence_required, deadline, status) VALUES
  ('ch000001-0000-0000-0000-000000000001', 'Go Paperless for 30 Days',      'c0000001-0000-0000-0000-000000000007', 'Avoid printing any documents for 30 consecutive days.', 200, 'Easy',   false, '2026-08-31', 'Active'),
  ('ch000001-0000-0000-0000-000000000002', 'Switch Off Standby Devices',    'c0000001-0000-0000-0000-000000000006', 'Ensure all devices are powered off when not in use for a week.', 150, 'Easy', false, '2026-07-31', 'Active'),
  ('ch000001-0000-0000-0000-000000000003', 'Carpool Challenge',              'c0000001-0000-0000-0000-000000000005', 'Carpool to office at least 3 days per week for a month.',       300, 'Medium', true, '2026-09-30', 'Active'),
  ('ch000001-0000-0000-0000-000000000004', 'Zero Waste Workweek',           'c0000001-0000-0000-0000-000000000007', 'Produce zero non-recyclable waste at your workstation.',         350, 'Hard',   true, '2026-08-15', 'Active'),
  ('ch000001-0000-0000-0000-000000000005', 'Green Supplier Audit',          'c0000001-0000-0000-0000-000000000008', 'Audit at least 2 suppliers for sustainability compliance.',      500, 'Hard',   true, '2026-10-31', 'Under Review'),
  ('ch000001-0000-0000-0000-000000000006', 'Reduce Water Usage by 20%',     'c0000001-0000-0000-0000-000000000005', 'Track and reduce personal/team water consumption by 20%.',      250, 'Medium', true, '2026-09-15', 'Draft'),
  ('ch000001-0000-0000-0000-000000000007', 'Energy Audit Completion',       'c0000001-0000-0000-0000-000000000006', 'Complete an energy audit of your department operations.',       400, 'Hard',   true, '2026-11-30', 'Draft');

-- ── CHALLENGE PARTICIPATION ───────────────────────────────
INSERT INTO challenge_participation (id, challenge_id, employee_id, progress, proof, approval, xp_awarded) VALUES
  ('cp000001-0000-0000-0000-000000000001', 'ch000001-0000-0000-0000-000000000001', 'em000001-0000-0000-0000-000000000001', 100, 'paperless_arjun.pdf', 'Approved', 200),
  ('cp000001-0000-0000-0000-000000000002', 'ch000001-0000-0000-0000-000000000002', 'em000001-0000-0000-0000-000000000004', 100, null,                  'Approved', 150),
  ('cp000001-0000-0000-0000-000000000003', 'ch000001-0000-0000-0000-000000000003', 'em000001-0000-0000-0000-000000000001', 80,  'carpool_arjun.jpg',   'Pending',  0),
  ('cp000001-0000-0000-0000-000000000004', 'ch000001-0000-0000-0000-000000000001', 'em000001-0000-0000-0000-000000000010', 100, null,                  'Approved', 200),
  ('cp000001-0000-0000-0000-000000000005', 'ch000001-0000-0000-0000-000000000004', 'em000001-0000-0000-0000-000000000004', 60,  null,                  'Pending',  0),
  ('cp000001-0000-0000-0000-000000000006', 'ch000001-0000-0000-0000-000000000002', 'em000001-0000-0000-0000-000000000008', 100, null,                  'Approved', 150),
  ('cp000001-0000-0000-0000-000000000007', 'ch000001-0000-0000-0000-000000000005', 'em000001-0000-0000-0000-000000000010', 90,  'audit_leela.pdf',     'Pending',  0);

-- ── ACKNOWLEDGEMENTS ──────────────────────────────────────
INSERT INTO acknowledgements (id, policy_id, employee_id, acknowledged_at) VALUES
  ('ack00001-0000-0000-0000-000000000001', 'po000001-0000-0000-0000-000000000001', 'em000001-0000-0000-0000-000000000001', '2026-01-15'),
  ('ack00001-0000-0000-0000-000000000002', 'po000001-0000-0000-0000-000000000001', 'em000001-0000-0000-0000-000000000002', '2026-01-16'),
  ('ack00001-0000-0000-0000-000000000003', 'po000001-0000-0000-0000-000000000002', 'em000001-0000-0000-0000-000000000004', '2026-03-20'),
  ('ack00001-0000-0000-0000-000000000004', 'po000001-0000-0000-0000-000000000002', 'em000001-0000-0000-0000-000000000010', '2026-03-21'),
  ('ack00001-0000-0000-0000-000000000005', 'po000001-0000-0000-0000-000000000003', 'em000001-0000-0000-0000-000000000001', '2026-02-05'),
  ('ack00001-0000-0000-0000-000000000006', 'po000001-0000-0000-0000-000000000004', 'em000001-0000-0000-0000-000000000003', '2026-04-25'),
  ('ack00001-0000-0000-0000-000000000007', 'po000001-0000-0000-0000-000000000005', 'em000001-0000-0000-0000-000000000005', '2025-11-10'),
  ('ack00001-0000-0000-0000-000000000008', 'po000001-0000-0000-0000-000000000001', 'em000001-0000-0000-0000-000000000008', '2026-01-18');

-- ── AUDITS ────────────────────────────────────────────────
INSERT INTO audits (id, title, scope, date, status) VALUES
  ('au000001-0000-0000-0000-000000000001', 'Q1 Environmental Compliance Audit',  'Emissions, Waste, Energy',      '2026-04-01', 'Completed'),
  ('au000001-0000-0000-0000-000000000002', 'Supply Chain ESG Audit',             'Supplier Practices',            '2026-05-15', 'Completed'),
  ('au000001-0000-0000-0000-000000000003', 'Annual Governance Review',            'Policies, Disclosures',         '2026-06-10', 'In Progress'),
  ('au000001-0000-0000-0000-000000000004', 'Midyear Social Impact Assessment',   'CSR, D&I, Training',            '2026-07-20', 'Scheduled'),
  ('au000001-0000-0000-0000-000000000005', 'ISO 14001 Re-Certification Audit',   'Environmental Management System','2026-09-01', 'Scheduled');

-- ── COMPLIANCE ISSUES ─────────────────────────────────────
INSERT INTO compliance_issues (id, audit_id, severity, description, owner, due_date, status) VALUES
  ('ci000001-0000-0000-0000-000000000001', 'au000001-0000-0000-0000-000000000001', 'High',   'Scope 1 emissions exceeded Q1 target by 12%',           'Ravi Sharma',  '2026-06-30', 'Open'),
  ('ci000001-0000-0000-0000-000000000002', 'au000001-0000-0000-0000-000000000001', 'Medium', 'Waste disposal records incomplete for Feb batch',        'Priya Nair',   '2026-05-31', 'Resolved'),
  ('ci000001-0000-0000-0000-000000000003', 'au000001-0000-0000-0000-000000000002', 'High',   'Supplier XYZ failed environmental standards checklist',   'Mohit Verma',  '2026-07-15', 'Open'),
  ('ci000001-0000-0000-0000-000000000004', 'au000001-0000-0000-0000-000000000002', 'Low',    'Missing MSDS sheets for 3 chemical inputs',              'Priya Nair',   '2026-06-15', 'Resolved'),
  ('ci000001-0000-0000-0000-000000000005', 'au000001-0000-0000-0000-000000000003', 'Medium', 'Board diversity policy not yet updated for FY2026',      'Anjali Mehta', '2026-08-01', 'Open'),
  ('ci000001-0000-0000-0000-000000000006', 'au000001-0000-0000-0000-000000000001', 'Low',    'Fleet maintenance logs missing for 2 vehicles (March)',  'Ravi Sharma',  '2026-05-15', 'Resolved');

-- ── TRAINING COMPLETIONS ──────────────────────────────────
INSERT INTO training_completions (id, employee_id, training_name, completed_date, hours) VALUES
  ('tc000001-0000-0000-0000-000000000001', 'em000001-0000-0000-0000-000000000001', 'ESG Fundamentals',                '2026-01-20', 8),
  ('tc000001-0000-0000-0000-000000000002', 'em000001-0000-0000-0000-000000000002', 'ESG Fundamentals',                '2026-01-22', 8),
  ('tc000001-0000-0000-0000-000000000003', 'em000001-0000-0000-0000-000000000004', 'Carbon Accounting Masterclass',   '2026-02-10', 16),
  ('tc000001-0000-0000-0000-000000000004', 'em000001-0000-0000-0000-000000000010', 'Sustainability Reporting (GRI)',   '2026-03-05', 12),
  ('tc000001-0000-0000-0000-000000000005', 'em000001-0000-0000-0000-000000000003', 'Workplace Safety & Environment',  '2026-02-28', 6),
  ('tc000001-0000-0000-0000-000000000006', 'em000001-0000-0000-0000-000000000008', 'ESG Fundamentals',                '2026-01-25', 8),
  ('tc000001-0000-0000-0000-000000000007', 'em000001-0000-0000-0000-000000000011', 'Green Supply Chain Management',   '2026-04-12', 10),
  ('tc000001-0000-0000-0000-000000000008', 'em000001-0000-0000-0000-000000000001', 'Advanced Carbon Markets',         '2026-05-01', 20),
  ('tc000001-0000-0000-0000-000000000009', 'em000001-0000-0000-0000-000000000005', 'ESG Fundamentals',                '2026-03-15', 8),
  ('tc000001-0000-0000-0000-000000000010', 'em000001-0000-0000-0000-000000000012', 'Diversity & Inclusion in ESG',    '2026-04-20', 6);

-- ── EARNED BADGES ─────────────────────────────────────────
INSERT INTO earned_badges (id, employee_id, badge_id, unlocked_at) VALUES
  ('eb000001-0000-0000-0000-000000000001', 'em000001-0000-0000-0000-000000000001', 'ba000001-0000-0000-0000-000000000001', '2026-01-30'),
  ('eb000001-0000-0000-0000-000000000002', 'em000001-0000-0000-0000-000000000001', 'ba000001-0000-0000-0000-000000000002', '2026-03-15'),
  ('eb000001-0000-0000-0000-000000000003', 'em000001-0000-0000-0000-000000000004', 'ba000001-0000-0000-0000-000000000001', '2026-02-10'),
  ('eb000001-0000-0000-0000-000000000004', 'em000001-0000-0000-0000-000000000004', 'ba000001-0000-0000-0000-000000000002', '2026-03-20'),
  ('eb000001-0000-0000-0000-000000000005', 'em000001-0000-0000-0000-000000000004', 'ba000001-0000-0000-0000-000000000003', '2026-05-01'),
  ('eb000001-0000-0000-0000-000000000006', 'em000001-0000-0000-0000-000000000004', 'ba000001-0000-0000-0000-000000000004', '2026-04-15'),
  ('eb000001-0000-0000-0000-000000000007', 'em000001-0000-0000-0000-000000000002', 'ba000001-0000-0000-0000-000000000001', '2026-02-20'),
  ('eb000001-0000-0000-0000-000000000008', 'em000001-0000-0000-0000-000000000010', 'ba000001-0000-0000-0000-000000000001', '2026-03-01'),
  ('eb000001-0000-0000-0000-000000000009', 'em000001-0000-0000-0000-000000000010', 'ba000001-0000-0000-0000-000000000002', '2026-05-10'),
  ('eb000001-0000-0000-0000-000000000010', 'em000001-0000-0000-0000-000000000008', 'ba000001-0000-0000-0000-000000000001', '2026-03-25'),
  ('eb000001-0000-0000-0000-000000000011', 'em000001-0000-0000-0000-000000000001', 'ba000001-0000-0000-0000-000000000005', '2026-04-01');

-- ── NOTIFICATIONS ─────────────────────────────────────────
INSERT INTO notifications (id, type, message, read, created_at) VALUES
  ('no000001-0000-0000-0000-000000000001', 'newComplianceIssue', 'New compliance issue: Scope 1 emissions exceeded Q1 target',        false, datetime('now', '-10 days')),
  ('no000001-0000-0000-0000-000000000002', 'approvalDecision',   'CSR participation approved for Arjun Kapoor',                       true,  datetime('now', '-15 days')),
  ('no000001-0000-0000-0000-000000000003', 'badgeUnlock',        'Kavya Singh unlocked "Sustainability Star"',                        true,  datetime('now', '-7 days')),
  ('no000001-0000-0000-0000-000000000004', 'policyReminder',     'Please acknowledge the Environmental Management Policy',            false, datetime('now', '-3 days')),
  ('no000001-0000-0000-0000-000000000005', 'newComplianceIssue', 'New compliance issue: Supplier XYZ failed standards checklist',     false, datetime('now', '-2 days')),
  ('no000001-0000-0000-0000-000000000006', 'approvalDecision',   'Challenge participation approved for Leela Sharma (+200 XP)',       true,  datetime('now', '-5 days'));
