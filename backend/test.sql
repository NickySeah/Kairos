CREATE DATABASE kairos_db;
CREATE TABLE events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    start_time DATETIME NOT NULL,
    end_time DATETIME NOT NULL,
    location VARCHAR(200),
    all_day BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
);

INSERT INTO events (title, description, start_time, end_time, location, all_day)
VALUES
('Team Meeting', 'Discuss project updates', '2025-09-01 10:00:00', '2025-09-01 11:00:00', 'Conference Room A', FALSE),
('Doctor Appointment', 'Routine check-up', '2025-09-02 09:30:00', '2025-09-02 10:00:00', 'Health Clinic', FALSE),
('Lunch with Sarah', 'Catch up with Sarah', '2025-09-03 12:30:00', '2025-09-03 13:30:00', 'Cafe Blue', FALSE),
('Project Deadline', 'Submit final report', '2025-09-05 00:00:00', '2025-09-05 23:59:59', NULL, TRUE),
('Birthday Party', 'John’s birthday celebration', '2025-09-06 18:00:00', '2025-09-06 21:00:00', 'John’s House', FALSE),
('Yoga Class', 'Evening yoga session', '2025-09-07 19:00:00', '2025-09-07 20:00:00', 'Gym Studio', FALSE),
('Company Holiday', 'National holiday', '2025-09-08 00:00:00', '2025-09-08 23:59:59', NULL, TRUE),
('Webinar: AI in Business', 'Online webinar', '2025-09-09 15:00:00', '2025-09-09 16:30:00', 'Online', FALSE),
('Dinner with Family', 'Family time', '2025-09-10 19:30:00', '2025-09-10 21:00:00', 'Home', FALSE),
('Gym Session', 'Morning workout', '2025-09-11 07:00:00', '2025-09-11 08:00:00', 'Fitness Center', FALSE);