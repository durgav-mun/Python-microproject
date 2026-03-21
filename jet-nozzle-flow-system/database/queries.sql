-- Useful analysis queries for the Jet Nozzle Flow System

-- 1. Get average flow rate for each nozzle over the last 24 hours
SELECT 
    n.id,
    n.name,
    AVG(f.flow_rate) as avg_flow_rate,
    MAX(f.flow_rate) as max_flow_rate,
    MIN(f.flow_rate) as min_flow_rate,
    COUNT(f.id) as measurement_count
FROM nozzles n
LEFT JOIN flow_data f ON n.id = f.nozzle_id 
    AND f.recorded_at >= DATE_SUB(NOW(), INTERVAL 24 HOUR)
GROUP BY n.id, n.name
ORDER BY n.id;

-- 2. Get pressure and temperature trends for a specific nozzle
SELECT 
    recorded_at,
    flow_rate,
    pressure,
    temperature,
    velocity
FROM flow_data
WHERE nozzle_id = ? 
    AND recorded_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
ORDER BY recorded_at DESC;

-- 3. Identify anomalies - flow rates outside normal range
SELECT 
    f.id,
    n.name,
    f.flow_rate,
    f.pressure,
    f.temperature,
    f.recorded_at,
    CASE 
        WHEN f.flow_rate > (SELECT AVG(flow_rate) * 1.2 FROM flow_data WHERE nozzle_id = n.id) THEN 'HIGH'
        WHEN f.flow_rate < (SELECT AVG(flow_rate) * 0.8 FROM flow_data WHERE nozzle_id = n.id) THEN 'LOW'
        ELSE 'NORMAL'
    END as anomaly_status
FROM flow_data f
JOIN nozzles n ON f.nozzle_id = n.id
WHERE f.recorded_at >= DATE_SUB(NOW(), INTERVAL 24 HOUR)
ORDER BY f.recorded_at DESC;

-- 4. Get vector analysis for flow visualization
SELECT 
    v.id,
    v.nozzle_id,
    v.velocity_x,
    v.velocity_y,
    v.velocity_z,
    v.magnitude,
    v.created_at,
    n.name as nozzle_name
FROM vector_analysis v
JOIN nozzles n ON v.nozzle_id = n.id
WHERE v.created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
ORDER BY v.created_at DESC;

-- 5. Performance summary for all nozzles
SELECT 
    n.name,
    n.material,
    n.diameter,
    MAX(f.pressure) as max_pressure_recorded,
    AVG(f.temperature) as avg_temperature,
    COUNT(DISTINCT DATE(f.recorded_at)) as days_active,
    MAX(f.recorded_at) as last_recording
FROM nozzles n
LEFT JOIN flow_data f ON n.id = f.nozzle_id
GROUP BY n.id, n.name, n.material, n.diameter
ORDER BY n.id;

-- 6. System health check - data freshness
SELECT 
    n.id,
    n.name,
    MAX(f.recorded_at) as last_data_point,
    TIMESTAMPDIFF(MINUTE, MAX(f.recorded_at), NOW()) as minutes_since_last_reading
FROM nozzles n
LEFT JOIN flow_data f ON n.id = f.nozzle_id
GROUP BY n.id, n.name
ORDER BY last_data_point DESC;

-- 7. Export flow data for external analysis
SELECT 
    n.name as nozzle_name,
    f.flow_rate,
    f.pressure,
    f.temperature,
    f.velocity,
    f.recorded_at
FROM flow_data f
JOIN nozzles n ON f.nozzle_id = n.id
WHERE f.recorded_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
ORDER BY f.recorded_at ASC;
