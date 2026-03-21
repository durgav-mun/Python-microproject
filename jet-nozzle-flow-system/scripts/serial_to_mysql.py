#!/usr/bin/env python3
"""
Serial to MySQL Bridge
Reads sensor data from Arduino via serial port and stores in MySQL database
"""

import serial
import mysql.connector
from mysql.connector import Error
import time
import json
import logging
from datetime import datetime
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('serial_bridge.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

class SerialToMySQLBridge:
    def __init__(self):
        self.serial_port = None
        self.db_connection = None
        self.config = self.load_config()
        
    def load_config(self):
        """Load configuration from environment variables"""
        return {
            'serial_port': os.getenv('SERIAL_PORT', 'COM3'),
            'baud_rate': int(os.getenv('BAUD_RATE', 9600)),
            'db_host': os.getenv('DB_HOST', 'localhost'),
            'db_user': os.getenv('DB_USER', 'root'),
            'db_password': os.getenv('DB_PASSWORD', ''),
            'db_name': os.getenv('DB_NAME', 'jet_nozzle_system'),
            'nozzle_id': int(os.getenv('NOZZLE_ID', 1)),
        }
    
    def connect_serial(self):
        """Establish serial connection with Arduino"""
        try:
            self.serial_port = serial.Serial(
                port=self.config['serial_port'],
                baudrate=self.config['baud_rate'],
                timeout=1
            )
            logger.info(f"✓ Serial connection established on {self.config['serial_port']}")
            time.sleep(2)  # Wait for Arduino to initialize
            return True
        except serial.SerialException as e:
            logger.error(f"✗ Failed to open serial port: {e}")
            return False
    
    def connect_mysql(self):
        """Establish MySQL database connection"""
        try:
            self.db_connection = mysql.connector.connect(
                host=self.config['db_host'],
                user=self.config['db_user'],
                password=self.config['db_password'],
                database=self.config['db_name']
            )
            logger.info(f"✓ MySQL connection established to {self.config['db_name']}")
            return True
        except Error as e:
            logger.error(f"✗ Failed to connect to MySQL: {e}")
            return False
    
    def parse_sensor_data(self, data_string):
        """Parse sensor data from Arduino format"""
        try:
            parts = data_string.strip().split('|')
            if parts[0] == 'SENSOR_DATA' and len(parts) == 6:
                return {
                    'pressure': float(parts[1]),
                    'temperature': float(parts[2]),
                    'flow_rate': float(parts[3]),
                    'velocity': float(parts[4]),
                    'timestamp': int(parts[5])
                }
            elif parts[0] == 'DEBUG':
                logger.debug(f"Arduino Debug: {' '.join(parts[1:])}")
                return None
        except (ValueError, IndexError) as e:
            logger.warning(f"Failed to parse data: {data_string} - {e}")
            return None
    
    def insert_flow_data(self, sensor_data):
        """Insert sensor data into database"""
        try:
            cursor = self.db_connection.cursor()
            
            insert_query = """
                INSERT INTO flow_data 
                (nozzle_id, flow_rate, pressure, temperature, velocity, recorded_at)
                VALUES (%s, %s, %s, %s, %s, NOW())
            """
            
            values = (
                self.config['nozzle_id'],
                sensor_data['flow_rate'],
                sensor_data['pressure'],
                sensor_data['temperature'],
                sensor_data['velocity']
            )
            
            cursor.execute(insert_query, values)
            self.db_connection.commit()
            flow_id = cursor.lastrowid
            
            logger.info(f"✓ Flow data inserted (ID: {flow_id}, Pressure: {sensor_data['pressure']} PSI)")
            
            # Calculate and save vector analysis
            self.calculate_and_save_vectors(sensor_data, flow_id)
            
            return True
        except Error as e:
            logger.error(f"✗ Database error: {e}")
            self.db_connection.rollback()
            return False
        finally:
            cursor.close()
    
    def calculate_and_save_vectors(self, sensor_data, flow_id):
        """Calculate velocity vectors and save to database"""
        try:
            import math
            
            velocity = sensor_data['velocity']
            # Assume 90-degree jet (adjust based on your nozzle)
            angle_deg = 90
            angle_rad = math.radians(angle_deg)
            
            velocity_x = velocity * math.cos(angle_rad)
            velocity_y = velocity * math.sin(angle_rad)
            velocity_z = 0
            magnitude = velocity
            
            cursor = self.db_connection.cursor()
            
            insert_query = """
                INSERT INTO vector_analysis 
                (nozzle_id, flow_id, velocity_x, velocity_y, velocity_z, magnitude)
                VALUES (%s, %s, %s, %s, %s, %s)
            """
            
            values = (
                self.config['nozzle_id'],
                flow_id,
                round(velocity_x, 4),
                round(velocity_y, 4),
                round(velocity_z, 4),
                magnitude
            )
            
            cursor.execute(insert_query, values)
            self.db_connection.commit()
            
            logger.debug(f"✓ Vector analysis saved (Vx: {velocity_x:.2f}, Vy: {velocity_y:.2f})")
        except Error as e:
            logger.error(f"✗ Vector calculation error: {e}")
            self.db_connection.rollback()
        finally:
            cursor.close()
    
    def read_serial_data(self):
        """Read data from serial port"""
        if self.serial_port and self.serial_port.in_waiting:
            try:
                line = self.serial_port.readline().decode('utf-8').strip()
                if line:
                    return line
            except UnicodeDecodeError as e:
                logger.warning(f"Serial decode error: {e}")
        return None
    
    def run(self):
        """Main loop - continuously read and store sensor data"""
        if not self.connect_serial():
            logger.error("Failed to connect to serial port")
            return False
        
        if not self.connect_mysql():
            logger.error("Failed to connect to MySQL")
            self.serial_port.close()
            return False
        
        logger.info("✓ Bridge ready - waiting for sensor data...")
        
        try:
            while True:
                data_string = self.read_serial_data()
                
                if data_string:
                    sensor_data = self.parse_sensor_data(data_string)
                    
                    if sensor_data:
                        self.insert_flow_data(sensor_data)
                
                time.sleep(0.1)  # Small delay to prevent CPU spinning
                
        except KeyboardInterrupt:
            logger.info("Received interrupt signal - shutting down gracefully")
        except Exception as e:
            logger.error(f"Unexpected error: {e}")
        finally:
            self.cleanup()
    
    def cleanup(self):
        """Clean up connections"""
        if self.serial_port:
            self.serial_port.close()
            logger.info("✓ Serial connection closed")
        
        if self.db_connection:
            self.db_connection.close()
            logger.info("✓ Database connection closed")

if __name__ == '__main__':
    bridge = SerialToMySQLBridge()
    bridge.run()
