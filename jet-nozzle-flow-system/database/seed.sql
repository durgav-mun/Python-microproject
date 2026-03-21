-- Insert sample nozzles
INSERT INTO nozzles (name, diameter, length, angle, material, description) VALUES
('Nozzle A - Standard', 5.0, 10.0, 90, 'stainless-steel', 'Standard jet nozzle for testing'),
('Nozzle B - High Pressure', 3.5, 15.0, 75, 'titanium', 'High pressure resistant nozzle'),
('Nozzle C - Wide Spray', 8.0, 8.0, 120, 'ceramic', 'Wide spray pattern nozzle'),
('Nozzle D - Precision', 2.0, 12.0, 90, 'stainless-steel', 'Precision angle nozzle');

-- Insert sample flow data
INSERT INTO flow_data (nozzle_id, flow_rate, pressure, temperature, velocity) VALUES
(1, 45.5, 50.0, 22.5, 12.3),
(1, 46.2, 51.2, 23.1, 12.4),
(1, 44.8, 49.5, 21.9, 12.1),
(2, 32.1, 75.0, 24.2, 15.8),
(2, 33.4, 76.5, 25.1, 16.1),
(3, 58.9, 40.0, 20.5, 10.5),
(3, 59.2, 41.2, 20.8, 10.6),
(4, 18.5, 85.0, 26.3, 18.9);

-- Insert sample vector analysis
INSERT INTO vector_analysis (nozzle_id, flow_id, velocity_x, velocity_y, velocity_z, magnitude) VALUES
(1, 1, 10.2, 6.8, 0, 12.3),
(1, 2, 10.3, 6.9, 0, 12.4),
(2, 5, 13.8, 8.2, 0, 15.8),
(3, 7, 8.9, 6.2, 0, 10.6),
(4, 8, 16.2, 9.8, 0, 18.9);

-- Insert system logs
INSERT INTO system_logs (event_type, description, severity) VALUES
('STARTUP', 'System initialized and database connection established', 'INFO'),
('SENSOR_CALIBRATION', 'Pressure sensors calibrated successfully', 'INFO'),
('DATA_COLLECTION', 'Flow data collection started', 'INFO'),
('SYSTEM_CHECK', 'All systems operational', 'INFO');
