-- Sample data for demonstrations and testing
-- Energy readings, reservations, presence data, and maintenance tickets

-- Sample energy readings for the past 7 days (hourly data for each building)
INSERT INTO energy_readings (building_id, reading_type, value, unit, recorded_at)
SELECT 
  b.id,
  'electricity',
  CASE 
    WHEN EXTRACT(HOUR FROM ts) BETWEEN 8 AND 18 THEN 50 + RANDOM() * 100 -- Peak hours
    ELSE 15 + RANDOM() * 30 -- Off-peak
  END,
  'kWh',
  ts
FROM buildings b
CROSS JOIN generate_series(
  NOW() - INTERVAL '7 days',
  NOW(),
  INTERVAL '1 hour'
) AS ts;

-- Sample HVAC readings
INSERT INTO energy_readings (building_id, reading_type, value, unit, recorded_at)
SELECT 
  b.id,
  'hvac',
  CASE 
    WHEN EXTRACT(HOUR FROM ts) BETWEEN 8 AND 18 THEN 30 + RANDOM() * 50
    ELSE 10 + RANDOM() * 15
  END,
  'kWh',
  ts
FROM buildings b
CROSS JOIN generate_series(
  NOW() - INTERVAL '7 days',
  NOW(),
  INTERVAL '1 hour'
) AS ts;

-- Sample reservations
INSERT INTO reservations (room_id, user_name, user_email, user_type, title, description, start_time, end_time, status, attendees_count) VALUES
  (1, 'Prof. Ahmed Benali', 'a.benali@utc.ma', 'professor', 'Cours Physique Quantique', 'Cours magistral pour L3 Physique', NOW() + INTERVAL '1 day' + INTERVAL '9 hours', NOW() + INTERVAL '1 day' + INTERVAL '11 hours', 'confirmed', 180),
  (2, 'Dr. Fatima Zahra', 'f.zahra@utc.ma', 'professor', 'TD Mathématiques', 'Travaux dirigés Analyse 2', NOW() + INTERVAL '1 day' + INTERVAL '14 hours', NOW() + INTERVAL '1 day' + INTERVAL '16 hours', 'confirmed', 35),
  (4, 'Prof. Youssef El Amrani', 'y.elamrani@utc.ma', 'professor', 'TP Chimie Organique', 'Travaux pratiques pour M1', NOW() + INTERVAL '2 days' + INTERVAL '10 hours', NOW() + INTERVAL '2 days' + INTERVAL '13 hours', 'confirmed', 20),
  (10, 'Association Étudiante', 'asso@utc.ma', 'student', 'Hackathon IoT', 'Compétition de programmation 24h', NOW() + INTERVAL '5 days' + INTERVAL '8 hours', NOW() + INTERVAL '6 days' + INTERVAL '20 hours', 'pending', 150),
  (13, 'Dr. Karim Tazi', 'k.tazi@utc.ma', 'professor', 'Atelier Machine Learning', 'Formation pratique Python ML', NOW() + INTERVAL '3 days' + INTERVAL '9 hours', NOW() + INTERVAL '3 days' + INTERVAL '17 hours', 'confirmed', 28),
  (17, 'Direction UTC', 'direction@utc.ma', 'staff', 'Conseil Université', 'Réunion trimestrielle', NOW() + INTERVAL '4 days' + INTERVAL '14 hours', NOW() + INTERVAL '4 days' + INTERVAL '17 hours', 'confirmed', 15),
  (8, 'Équipe Recherche', 'research@utc.ma', 'professor', 'Soutenance Thèse', 'Soutenance de doctorat en IA', NOW() + INTERVAL '7 days' + INTERVAL '10 hours', NOW() + INTERVAL '7 days' + INTERVAL '13 hours', 'confirmed', 10);

-- Sample presence readings (current day simulation)
INSERT INTO presence_readings (room_id, occupancy_count, is_occupied, temperature, humidity, co2_level, recorded_at)
SELECT 
  r.id,
  CASE 
    WHEN EXTRACT(HOUR FROM ts) BETWEEN 8 AND 18 THEN FLOOR(RANDOM() * r.capacity * 0.8)
    ELSE 0
  END,
  EXTRACT(HOUR FROM ts) BETWEEN 8 AND 18,
  20 + RANDOM() * 6,
  40 + RANDOM() * 25,
  400 + FLOOR(RANDOM() * 600),
  ts
FROM rooms r
CROSS JOIN generate_series(
  NOW() - INTERVAL '24 hours',
  NOW(),
  INTERVAL '15 minutes'
) AS ts
WHERE r.room_type IN ('classroom', 'lab', 'auditorium');

-- Sample maintenance tickets
INSERT INTO maintenance_tickets (building_id, room_id, ticket_type, category, priority, status, title, description, reported_by, reporter_email, assigned_to, scheduled_date) VALUES
  (1, 4, 'incident', 'electrical', 'high', 'in_progress', 'Panne éclairage laboratoire', 'Plusieurs néons ne fonctionnent plus dans le laboratoire de chimie', 'Technicien de surface', 'tech@utc.ma', 'Mohamed Electricien', NOW() + INTERVAL '1 day'),
  (2, 13, 'incident', 'hvac', 'urgent', 'open', 'Climatisation en panne', 'La climatisation du lab info ne fonctionne plus, température élevée', 'Prof. Tazi', 'k.tazi@utc.ma', NULL, NULL),
  (1, 1, 'preventive', 'cleaning', 'medium', 'pending_parts', 'Nettoyage amphithéâtre', 'Nettoyage approfondi prévu avant rentrée', 'Service entretien', 'entretien@utc.ma', 'Équipe nettoyage', NOW() + INTERVAL '3 days'),
  (3, 20, 'incident', 'plumbing', 'high', 'resolved', 'Fuite d''eau bureau', 'Fuite détectée sous le lavabo du bureau direction', 'Secrétaire', 'secretariat@utc.ma', 'Ali Plombier', NOW() - INTERVAL '2 days'),
  (2, 16, 'preventive', 'security', 'low', 'open', 'Vérification extincteurs', 'Contrôle annuel des extincteurs du bâtiment', 'Service sécurité', 'securite@utc.ma', NULL, NOW() + INTERVAL '10 days'),
  (1, NULL, 'inspection', 'electrical', 'medium', 'open', 'Audit énergétique', 'Audit trimestriel de la consommation électrique', 'Direction technique', 'dtech@utc.ma', 'Bureau études', NOW() + INTERVAL '5 days');

-- Sample energy alerts
INSERT INTO energy_alerts (building_id, room_id, alert_type, severity, message, threshold_value, actual_value, is_resolved) VALUES
  (2, 13, 'overconsumption', 'high', 'Consommation HVAC anormalement élevée dans le Lab Informatique 1', 50.00, 78.50, false),
  (1, NULL, 'threshold_exceeded', 'medium', 'Seuil de consommation journalière dépassé pour Bâtiment Sciences', 800.00, 856.30, false),
  (3, NULL, 'anomaly', 'low', 'Pic de consommation détecté hors heures ouvrables', NULL, 45.20, true);

-- Sample equipment
INSERT INTO equipment (room_id, name, code, category, brand, model, purchase_date, warranty_end, last_maintenance, next_maintenance, status) VALUES
  (1, 'Vidéoprojecteur Amphithéâtre', 'PROJ-SCI-A01', 'projector', 'Epson', 'EB-L1755U', '2022-09-01', '2025-09-01', '2024-06-15', '2025-06-15', 'operational'),
  (4, 'Hotte aspirante 1', 'HOOD-SCI-L01-1', 'lab_equipment', 'Köttermann', 'Série 2000', '2020-03-15', '2025-03-15', '2024-09-01', '2025-03-01', 'operational'),
  (13, 'Serveur calcul', 'SRV-ING-L01', 'computer', 'Dell', 'PowerEdge R750', '2023-01-10', '2026-01-10', '2024-07-20', '2025-01-20', 'operational'),
  (13, 'Station travail 1', 'WS-ING-L01-01', 'computer', 'HP', 'Z4 G4', '2022-06-01', '2025-06-01', '2024-06-01', '2025-06-01', 'operational'),
  (16, 'Robot industriel', 'ROB-ING-L03', 'lab_equipment', 'KUKA', 'KR 10 R1100', '2021-11-20', '2024-11-20', '2024-05-15', '2024-11-15', 'maintenance'),
  (10, 'Système audio', 'AUD-ING-A01', 'projector', 'Bose', 'Professional', '2023-03-01', '2026-03-01', '2024-03-01', '2025-03-01', 'operational');
