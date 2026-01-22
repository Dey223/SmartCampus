-- Announcements table
CREATE TABLE IF NOT EXISTS announcements (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  category VARCHAR(50) DEFAULT 'general', -- general, emergency, event, academic
  author_name VARCHAR(100),
  author_email VARCHAR(255),
  target_audience VARCHAR(50) DEFAULT 'all', -- all, students, staff
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index
CREATE INDEX IF NOT EXISTS idx_announcements_created_at ON announcements(created_at);
