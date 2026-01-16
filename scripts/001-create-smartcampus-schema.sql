-- SmartCampus360 Database Schema
-- Creates all tables for the smart campus management system

-- Buildings table
CREATE TABLE IF NOT EXISTS buildings (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  code VARCHAR(50) UNIQUE NOT NULL,
  address TEXT,
  total_area_sqm DECIMAL(10, 2),
  floors INTEGER DEFAULT 1,
  year_built INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Rooms table
CREATE TABLE IF NOT EXISTS rooms (
  id SERIAL PRIMARY KEY,
  building_id INTEGER REFERENCES buildings(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  code VARCHAR(50) UNIQUE NOT NULL,
  floor INTEGER DEFAULT 0,
  capacity INTEGER DEFAULT 0,
  room_type VARCHAR(50) DEFAULT 'classroom', -- classroom, lab, office, meeting, auditorium
  area_sqm DECIMAL(10, 2),
  has_projector BOOLEAN DEFAULT false,
  has_ac BOOLEAN DEFAULT false,
  has_whiteboard BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Energy readings table (IoT sensor data)
CREATE TABLE IF NOT EXISTS energy_readings (
  id SERIAL PRIMARY KEY,
  building_id INTEGER REFERENCES buildings(id) ON DELETE CASCADE,
  room_id INTEGER REFERENCES rooms(id) ON DELETE SET NULL,
  reading_type VARCHAR(50) NOT NULL, -- electricity, gas, water, hvac
  value DECIMAL(15, 4) NOT NULL,
  unit VARCHAR(20) NOT NULL, -- kWh, m3, etc.
  recorded_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Energy alerts table
CREATE TABLE IF NOT EXISTS energy_alerts (
  id SERIAL PRIMARY KEY,
  building_id INTEGER REFERENCES buildings(id) ON DELETE CASCADE,
  room_id INTEGER REFERENCES rooms(id) ON DELETE SET NULL,
  alert_type VARCHAR(50) NOT NULL, -- overconsumption, anomaly, threshold_exceeded
  severity VARCHAR(20) DEFAULT 'medium', -- low, medium, high, critical
  message TEXT NOT NULL,
  threshold_value DECIMAL(15, 4),
  actual_value DECIMAL(15, 4),
  is_resolved BOOLEAN DEFAULT false,
  resolved_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Reservations table
CREATE TABLE IF NOT EXISTS reservations (
  id SERIAL PRIMARY KEY,
  room_id INTEGER REFERENCES rooms(id) ON DELETE CASCADE,
  user_name VARCHAR(255) NOT NULL,
  user_email VARCHAR(255) NOT NULL,
  user_type VARCHAR(50) DEFAULT 'student', -- student, professor, staff, external
  title VARCHAR(255) NOT NULL,
  description TEXT,
  start_time TIMESTAMP NOT NULL,
  end_time TIMESTAMP NOT NULL,
  status VARCHAR(50) DEFAULT 'pending', -- pending, confirmed, cancelled, completed
  attendees_count INTEGER DEFAULT 1,
  equipment_needed TEXT[], -- array of equipment codes
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Presence/Occupancy readings table
CREATE TABLE IF NOT EXISTS presence_readings (
  id SERIAL PRIMARY KEY,
  room_id INTEGER REFERENCES rooms(id) ON DELETE CASCADE,
  occupancy_count INTEGER DEFAULT 0,
  is_occupied BOOLEAN DEFAULT false,
  temperature DECIMAL(5, 2), -- Celsius
  humidity DECIMAL(5, 2), -- Percentage
  co2_level INTEGER, -- ppm
  recorded_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Maintenance tickets table
CREATE TABLE IF NOT EXISTS maintenance_tickets (
  id SERIAL PRIMARY KEY,
  building_id INTEGER REFERENCES buildings(id) ON DELETE CASCADE,
  room_id INTEGER REFERENCES rooms(id) ON DELETE SET NULL,
  ticket_type VARCHAR(50) NOT NULL, -- incident, preventive, inspection
  category VARCHAR(100) NOT NULL, -- electrical, plumbing, hvac, furniture, cleaning, security
  priority VARCHAR(20) DEFAULT 'medium', -- low, medium, high, urgent
  status VARCHAR(50) DEFAULT 'open', -- open, in_progress, pending_parts, resolved, closed
  title VARCHAR(255) NOT NULL,
  description TEXT,
  reported_by VARCHAR(255),
  reporter_email VARCHAR(255),
  assigned_to VARCHAR(255),
  estimated_cost DECIMAL(10, 2),
  actual_cost DECIMAL(10, 2),
  scheduled_date TIMESTAMP,
  resolved_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Equipment table
CREATE TABLE IF NOT EXISTS equipment (
  id SERIAL PRIMARY KEY,
  room_id INTEGER REFERENCES rooms(id) ON DELETE SET NULL,
  name VARCHAR(255) NOT NULL,
  code VARCHAR(50) UNIQUE NOT NULL,
  category VARCHAR(100) NOT NULL, -- projector, computer, hvac_unit, furniture, lab_equipment
  brand VARCHAR(100),
  model VARCHAR(100),
  purchase_date DATE,
  warranty_end DATE,
  last_maintenance DATE,
  next_maintenance DATE,
  status VARCHAR(50) DEFAULT 'operational', -- operational, maintenance, broken, retired
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_energy_readings_building ON energy_readings(building_id);
CREATE INDEX IF NOT EXISTS idx_energy_readings_recorded_at ON energy_readings(recorded_at);
CREATE INDEX IF NOT EXISTS idx_reservations_room ON reservations(room_id);
CREATE INDEX IF NOT EXISTS idx_reservations_time ON reservations(start_time, end_time);
CREATE INDEX IF NOT EXISTS idx_presence_room ON presence_readings(room_id);
CREATE INDEX IF NOT EXISTS idx_presence_recorded_at ON presence_readings(recorded_at);
CREATE INDEX IF NOT EXISTS idx_maintenance_building ON maintenance_tickets(building_id);
CREATE INDEX IF NOT EXISTS idx_maintenance_status ON maintenance_tickets(status);
