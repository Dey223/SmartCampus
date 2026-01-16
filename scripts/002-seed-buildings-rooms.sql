-- Seed data for SmartCampus360
-- 3 Buildings with rooms as specified in the requirements

-- Insert buildings
INSERT INTO buildings (name, code, address, total_area_sqm, floors, year_built) VALUES
  ('Bâtiment Sciences', 'BAT-SCI', 'Campus Principal, Zone A', 4500.00, 4, 2015),
  ('Bâtiment Ingénierie', 'BAT-ING', 'Campus Principal, Zone B', 5200.00, 5, 2018),
  ('Bâtiment Administration', 'BAT-ADM', 'Campus Principal, Zone C', 2800.00, 3, 2010)
ON CONFLICT (code) DO NOTHING;

-- Insert rooms for Bâtiment Sciences
INSERT INTO rooms (building_id, name, code, floor, capacity, room_type, area_sqm, has_projector, has_ac, has_whiteboard) VALUES
  (1, 'Amphithéâtre Curie', 'SCI-A01', 0, 250, 'auditorium', 400.00, true, true, true),
  (1, 'Salle de cours S101', 'SCI-101', 1, 40, 'classroom', 60.00, true, true, true),
  (1, 'Salle de cours S102', 'SCI-102', 1, 40, 'classroom', 60.00, true, true, true),
  (1, 'Laboratoire Chimie', 'SCI-L01', 1, 25, 'lab', 80.00, true, true, false),
  (1, 'Salle de cours S201', 'SCI-201', 2, 35, 'classroom', 55.00, true, true, true),
  (1, 'Salle de cours S202', 'SCI-202', 2, 35, 'classroom', 55.00, true, true, true),
  (1, 'Laboratoire Physique', 'SCI-L02', 2, 20, 'lab', 75.00, true, true, false),
  (1, 'Salle de réunion S301', 'SCI-M01', 3, 12, 'meeting', 30.00, true, true, true),
  (1, 'Bureau Professeurs', 'SCI-O01', 3, 8, 'office', 45.00, false, true, false)
ON CONFLICT (code) DO NOTHING;

-- Insert rooms for Bâtiment Ingénierie
INSERT INTO rooms (building_id, name, code, floor, capacity, room_type, area_sqm, has_projector, has_ac, has_whiteboard) VALUES
  (2, 'Amphithéâtre Tesla', 'ING-A01', 0, 200, 'auditorium', 350.00, true, true, true),
  (2, 'Salle de cours I101', 'ING-101', 1, 45, 'classroom', 65.00, true, true, true),
  (2, 'Salle de cours I102', 'ING-102', 1, 45, 'classroom', 65.00, true, true, true),
  (2, 'Laboratoire Informatique 1', 'ING-L01', 1, 30, 'lab', 90.00, true, true, false),
  (2, 'Salle de cours I201', 'ING-201', 2, 40, 'classroom', 60.00, true, true, true),
  (2, 'Laboratoire Informatique 2', 'ING-L02', 2, 30, 'lab', 90.00, true, true, false),
  (2, 'Laboratoire Robotique', 'ING-L03', 3, 15, 'lab', 100.00, true, true, false),
  (2, 'Salle de réunion I401', 'ING-M01', 4, 15, 'meeting', 35.00, true, true, true),
  (2, 'Espace Coworking', 'ING-CW01', 4, 50, 'classroom', 120.00, true, true, true)
ON CONFLICT (code) DO NOTHING;

-- Insert rooms for Bâtiment Administration
INSERT INTO rooms (building_id, name, code, floor, capacity, room_type, area_sqm, has_projector, has_ac, has_whiteboard) VALUES
  (3, 'Salle de conférence', 'ADM-C01', 0, 80, 'auditorium', 150.00, true, true, true),
  (3, 'Accueil', 'ADM-ACC', 0, 10, 'office', 40.00, false, true, false),
  (3, 'Salle de réunion A101', 'ADM-M01', 1, 20, 'meeting', 45.00, true, true, true),
  (3, 'Salle de réunion A102', 'ADM-M02', 1, 10, 'meeting', 25.00, true, true, true),
  (3, 'Bureau Direction', 'ADM-O01', 2, 4, 'office', 35.00, true, true, false),
  (3, 'Bureau RH', 'ADM-O02', 2, 6, 'office', 40.00, false, true, false),
  (3, 'Salle Archives', 'ADM-ARC', 2, 2, 'office', 50.00, false, true, false)
ON CONFLICT (code) DO NOTHING;
