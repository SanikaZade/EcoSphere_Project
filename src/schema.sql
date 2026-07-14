-- USERS (for auth)
CREATE TABLE users (
  id TEXT PRIMARY KEY DEFAULT (hex(randomblob(16))),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'Employee',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- DEPARTMENTS
CREATE TABLE departments (
  id TEXT PRIMARY KEY DEFAULT (hex(randomblob(16))),
  name TEXT NOT NULL,
  code TEXT NOT NULL,
  head TEXT,
  parent_id TEXT REFERENCES departments(id),
  employee_count INT DEFAULT 0,
  status TEXT DEFAULT 'Active',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- CATEGORIES
CREATE TABLE categories (
  id TEXT PRIMARY KEY DEFAULT (hex(randomblob(16))),
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('CSR Activity', 'Challenge')),
  status TEXT DEFAULT 'Active',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- EMISSION FACTORS
CREATE TABLE emission_factors (
  id TEXT PRIMARY KEY DEFAULT (hex(randomblob(16))),
  activity_type TEXT NOT NULL,
  unit TEXT NOT NULL,
  value NUMERIC NOT NULL,
  updated_at DATE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- PRODUCT ESG PROFILES
CREATE TABLE product_profiles (
  id TEXT PRIMARY KEY DEFAULT (hex(randomblob(16))),
  product_name TEXT NOT NULL,
  sustainable_material BOOLEAN DEFAULT false,
  recycled_content TEXT,
  carbon_footprint TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ENVIRONMENTAL GOALS
CREATE TABLE goals (
  id TEXT PRIMARY KEY DEFAULT (hex(randomblob(16))),
  department_id TEXT REFERENCES departments(id),
  title TEXT NOT NULL,
  target NUMERIC NOT NULL,
  actual NUMERIC DEFAULT 0,
  unit TEXT,
  due_date DATE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ESG POLICIES
CREATE TABLE policies (
  id TEXT PRIMARY KEY DEFAULT (hex(randomblob(16))),
  title TEXT NOT NULL,
  published_at DATE,
  status TEXT DEFAULT 'Draft',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- BADGES
CREATE TABLE badges (
  id TEXT PRIMARY KEY DEFAULT (hex(randomblob(16))),
  name TEXT NOT NULL,
  description TEXT,
  unlock_rule TEXT NOT NULL,
  icon TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- REWARDS
CREATE TABLE rewards (
  id TEXT PRIMARY KEY DEFAULT (hex(randomblob(16))),
  name TEXT NOT NULL,
  description TEXT,
  points_required INT NOT NULL,
  stock INT DEFAULT 0,
  status TEXT DEFAULT 'Active',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- EMPLOYEES
CREATE TABLE employees (
  id TEXT PRIMARY KEY DEFAULT (hex(randomblob(16))),
  name TEXT NOT NULL,
  department_id TEXT REFERENCES departments(id),
  gender TEXT,
  xp INT DEFAULT 0,
  points INT DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- CARBON TRANSACTIONS
CREATE TABLE carbon_transactions (
  id TEXT PRIMARY KEY DEFAULT (hex(randomblob(16))),
  department_id TEXT REFERENCES departments(id),
  source TEXT NOT NULL,
  emission_factor_id TEXT REFERENCES emission_factors(id),
  quantity NUMERIC NOT NULL,
  emissions NUMERIC NOT NULL,
  date DATE NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- CSR ACTIVITIES
CREATE TABLE csr_activities (
  id TEXT PRIMARY KEY DEFAULT (hex(randomblob(16))),
  category_id TEXT REFERENCES categories(id),
  title TEXT NOT NULL,
  date DATE,
  location TEXT,
  status TEXT DEFAULT 'Upcoming',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- EMPLOYEE PARTICIPATION (CSR only)
CREATE TABLE employee_participation (
  id TEXT PRIMARY KEY DEFAULT (hex(randomblob(16))),
  employee_id TEXT REFERENCES employees(id),
  activity_id TEXT REFERENCES csr_activities(id),
  proof TEXT,
  approval_status TEXT DEFAULT 'Pending',
  points_earned INT DEFAULT 0,
  completion_date DATE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- CHALLENGES
CREATE TABLE challenges (
  id TEXT PRIMARY KEY DEFAULT (hex(randomblob(16))),
  title TEXT NOT NULL,
  category_id TEXT REFERENCES categories(id),
  description TEXT,
  xp INT DEFAULT 0,
  difficulty TEXT DEFAULT 'Medium',
  evidence_required BOOLEAN DEFAULT false,
  deadline DATE,
  status TEXT DEFAULT 'Draft',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- CHALLENGE PARTICIPATION
CREATE TABLE challenge_participation (
  id TEXT PRIMARY KEY DEFAULT (hex(randomblob(16))),
  challenge_id TEXT REFERENCES challenges(id),
  employee_id TEXT REFERENCES employees(id),
  progress INT DEFAULT 0,
  proof TEXT,
  approval TEXT DEFAULT 'Pending',
  xp_awarded INT DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- POLICY ACKNOWLEDGEMENTS
CREATE TABLE acknowledgements (
  id TEXT PRIMARY KEY DEFAULT (hex(randomblob(16))),
  policy_id TEXT REFERENCES policies(id),
  employee_id TEXT REFERENCES employees(id),
  acknowledged_at DATE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- AUDITS
CREATE TABLE audits (
  id TEXT PRIMARY KEY DEFAULT (hex(randomblob(16))),
  title TEXT NOT NULL,
  scope TEXT,
  date DATE,
  status TEXT DEFAULT 'Scheduled',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- COMPLIANCE ISSUES
CREATE TABLE compliance_issues (
  id TEXT PRIMARY KEY DEFAULT (hex(randomblob(16))),
  audit_id TEXT REFERENCES audits(id),
  severity TEXT DEFAULT 'Medium',
  description TEXT NOT NULL,
  owner TEXT NOT NULL,
  due_date DATE NOT NULL,
  status TEXT DEFAULT 'Open',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- TRAINING COMPLETIONS
CREATE TABLE training_completions (
  id TEXT PRIMARY KEY DEFAULT (hex(randomblob(16))),
  employee_id TEXT REFERENCES employees(id),
  training_name TEXT NOT NULL,
  completed_date DATE,
  hours NUMERIC DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- EARNED BADGES
CREATE TABLE earned_badges (
  id TEXT PRIMARY KEY DEFAULT (hex(randomblob(16))),
  employee_id TEXT REFERENCES employees(id),
  badge_id TEXT REFERENCES badges(id),
  unlocked_at DATE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- NOTIFICATIONS
CREATE TABLE notifications (
  id TEXT PRIMARY KEY DEFAULT (hex(randomblob(16))),
  type TEXT NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- SETTINGS (single row per org)
CREATE TABLE settings (
  id TEXT PRIMARY KEY DEFAULT (hex(randomblob(16))),
  auto_emission_calculation BOOLEAN DEFAULT true,
  evidence_required BOOLEAN DEFAULT true,
  badge_auto_award BOOLEAN DEFAULT true,
  weight_environmental INT DEFAULT 40,
  weight_social INT DEFAULT 30,
  weight_governance INT DEFAULT 30,
  notification_config TEXT DEFAULT '{
    "newComplianceIssue": {"inApp": true, "email": true},
    "approvalDecision": {"inApp": true, "email": false},
    "policyReminder": {"inApp": true, "email": true},
    "badgeUnlock": {"inApp": true, "email": false}
  }',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
