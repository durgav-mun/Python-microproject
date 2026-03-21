/*
  Jet Nozzle Flow System - Arduino Sensor Code
  Reads sensor data and transmits via Serial to be stored in MySQL database
*/

// Sensor pins
#define PRESSURE_SENSOR_PIN A0
#define TEMPERATURE_SENSOR_PIN A1
#define FLOW_RATE_SENSOR_PIN 2
#define VELOCITY_SENSOR_PIN 3

// Sensor calibration constants
#define PRESSURE_MIN_MV 4.0      // 4mV at 0 PSI
#define PRESSURE_MAX_MV 19.0     // 19mV at 200 PSI
#define PRESSURE_MIN_PSI 0.0
#define PRESSURE_MAX_PSI 200.0

#define TEMP_SENSOR_OFFSET 0.0
#define TEMP_SENSOR_SCALE 0.1

// Timing
#define SAMPLE_RATE_MS 1000
#define DATA_SEND_INTERVAL_MS 5000

// Global variables
volatile uint32_t flowPulseCount = 0;
volatile uint32_t velocityPulseCount = 0;

unsigned long lastSampleTime = 0;
unsigned long lastSendTime = 0;

struct SensorData {
  float pressure;
  float temperature;
  float flowRate;
  float velocity;
  unsigned long timestamp;
};

void setup() {
  Serial.begin(9600);
  
  pinMode(FLOW_RATE_SENSOR_PIN, INPUT);
  pinMode(VELOCITY_SENSOR_PIN, INPUT);
  
  // Attach interrupts for pulse sensors
  attachInterrupt(digitalPinToInterrupt(FLOW_RATE_SENSOR_PIN), countFlowPulse, RISING);
  attachInterrupt(digitalPinToInterrupt(VELOCITY_SENSOR_PIN), countVelocityPulse, RISING);
  
  delay(1000); // Stabilization delay
  Serial.println("Jet Nozzle Sensor System Initialized");
}

void loop() {
  unsigned long currentTime = millis();
  
  if (currentTime - lastSampleTime >= SAMPLE_RATE_MS) {
    lastSampleTime = currentTime;
    
    // Read sensors
    SensorData data = readAllSensors();
    
    // Send data periodically
    if (currentTime - lastSendTime >= DATA_SEND_INTERVAL_MS) {
      lastSendTime = currentTime;
      transmitData(data);
    }
  }
}

/**
 * Read all sensor values
 */
SensorData readAllSensors() {
  SensorData data;
  
  data.pressure = readPressureSensor();
  data.temperature = readTemperatureSensor();
  data.flowRate = calculateFlowRate();
  data.velocity = calculateVelocity();
  data.timestamp = millis();
  
  return data;
}

/**
 * Read pressure sensor (0-200 PSI)
 */
float readPressureSensor() {
  int rawValue = analogRead(PRESSURE_SENSOR_PIN);
  float voltage = rawValue * (5.0 / 1023.0); // Convert to voltage (0-5V)
  
  // Linear interpolation
  float pressure = PRESSURE_MIN_PSI + 
                   ((voltage - PRESSURE_MIN_MV) / (PRESSURE_MAX_MV - PRESSURE_MIN_MV)) * 
                   (PRESSURE_MAX_PSI - PRESSURE_MIN_PSI);
  
  return constrain(pressure, PRESSURE_MIN_PSI, PRESSURE_MAX_PSI);
}

/**
 * Read temperature sensor (analog)
 */
float readTemperatureSensor() {
  int rawValue = analogRead(TEMPERATURE_SENSOR_PIN);
  float voltage = rawValue * (5.0 / 1023.0);
  
  // Convert voltage to temperature (linear approximation)
  float temperature = (voltage - 2.5) / 0.01; // Example: 10mV per °C
  
  return temperature;
}

/**
 * Calculate flow rate from pulse count
 */
float calculateFlowRate() {
  noInterrupts();
  uint32_t pulses = flowPulseCount;
  flowPulseCount = 0;
  interrupts();
  
  // K-factor from flow sensor datasheet (pulses per liter)
  float kFactor = 5400.0; // Example value
  
  // Calculate flow rate in L/min
  float flowRate = (pulses / kFactor) * (1000 / SAMPLE_RATE_MS) * 60;
  
  return flowRate;
}

/**
 * Calculate velocity from sensor pulses
 */
float calculateVelocity() {
  noInterrupts();
  uint32_t pulses = velocityPulseCount;
  velocityPulseCount = 0;
  interrupts();
  
  // Convert pulses to velocity (m/s)
  // This depends on the specific velocity sensor used
  float velocity = (pulses / 1000.0) * (1000 / SAMPLE_RATE_MS);
  
  return velocity;
}

/**
 * Interrupt handler for flow rate sensor
 */
void countFlowPulse() {
  flowPulseCount++;
}

/**
 * Interrupt handler for velocity sensor
 */
void countVelocityPulse() {
  velocityPulseCount++;
}

/**
 * Transmit sensor data via Serial
 */
void transmitData(SensorData data) {
  // Format: SENSOR_DATA|pressure|temperature|flowRate|velocity|timestamp
  Serial.print("SENSOR_DATA|");
  Serial.print(data.pressure, 2);
  Serial.print("|");
  Serial.print(data.temperature, 2);
  Serial.print("|");
  Serial.print(data.flowRate, 2);
  Serial.print("|");
  Serial.print(data.velocity, 2);
  Serial.print("|");
  Serial.println(data.timestamp);
  
  // Optional: Debug output
  debugPrint(data);
}

/**
 * Debug output to Serial
 */
void debugPrint(SensorData data) {
  Serial.print("DEBUG: P=");
  Serial.print(data.pressure);
  Serial.print(" PSI, T=");
  Serial.print(data.temperature);
  Serial.print(" °C, FR=");
  Serial.print(data.flowRate);
  Serial.print(" L/min, V=");
  Serial.print(data.velocity);
  Serial.println(" m/s");
}
