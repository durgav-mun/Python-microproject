-- Create database
CREATE DATABASE IF NOT EXISTS jet_nozzle_system;
USE jet_nozzle_system;

-- Nozzles table
CREATE TABLE IF NOT EXISTS nozzles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  diameter DECIMAL(10, 2) COMMENT 'Diameter in mm',
  length DECIMAL(10, 2) COMMENT 'Length in mm',
  angle INT COMMENT 'Angle in degrees',
  material VARCHAR(50),
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY unique_name (name)
);

-- Flow data table
CREATE TABLE IF NOT EXISTS flow_data (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nozzle_id INT NOT NULL,
  flow_rate DECIMAL(10, 4) COMMENT 'Flow rate in L/min',
  pressure DECIMAL(10, 2) COMMENT 'Pressure in PSI',
  temperature DECIMAL(6, 2) COMMENT 'Temperature in Celsius',
  velocity DECIMAL(10, 4) COMMENT 'Velocity in m/s',
  recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (nozzle_id) REFERENCES nozzles(id) ON DELETE CASCADE,
  INDEX idx_nozzle_time (nozzle_id, recorded_at)
);

-- Vector analysis table
CREATE TABLE IF NOT EXISTS vector_analysis (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nozzle_id INT NOT NULL,
  flow_id INT,
  velocity_x DECIMAL(10, 4),
  velocity_y DECIMAL(10, 4),
  velocity_z DECIMAL(10, 4),
  magnitude DECIMAL(10, 4),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (nozzle_id) REFERENCES nozzles(id) ON DELETE CASCADE,
  FOREIGN KEY (flow_id) REFERENCES flow_data(id) ON DELETE SET NULL,
  INDEX idx_nozzle_created (nozzle_id, created_at)
);

-- User sessions table
CREATE TABLE IF NOT EXISTS user_sessions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  session_token VARCHAR(255) UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP,
  INDEX idx_token (session_token)
);

-- System logs table
CREATE TABLE IF NOT EXISTS system_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  event_type VARCHAR(50),
  description TEXT,
  severity ENUM('INFO', 'WARNING', 'ERROR', 'CRITICAL'),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_severity_time (severity, created_at)
);
