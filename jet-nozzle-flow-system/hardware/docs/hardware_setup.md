# Hardware Setup Guide - Jet Nozzle Flow System

## Overview
This document provides detailed instructions for setting up the hardware components of the Jet Nozzle Flow System.

## Components Required

### Sensors
- **Pressure Sensor**: 0-200 PSI analog sensor (4-20mA or 0-5V output)
- **Temperature Sensor**: Thermistor or PT100 RTD (analog output)
- **Flow Rate Sensor**: Turbine or paddlewheel sensor (pulse output)
- **Velocity Sensor**: Anemometer or similar (pulse output)

### Microcontroller & Interface
- **Arduino Uno** or compatible board
- **USB to Serial adapter** (if needed)
- **Power supply**: 5V for Arduino, appropriate voltage for sensors

### Additional Components
- **Resistors**: 10kΩ pull-up resistors for digital inputs
- **Capacitors**: 0.1µF for noise filtering
- **Wiring**: 22 AWG recommended
- **Connectors**: JST connectors for modular design

## Pin Configuration

### Arduino Pin Mapping
```
Pressure Sensor     → A0 (Analog Input)
Temperature Sensor  → A1 (Analog Input)
Flow Rate Sensor    → Pin 2 (Digital Input - Interrupt)
Velocity Sensor     → Pin 3 (Digital Input - Interrupt)
5V Output          → Power for sensors
GND                → Common ground
```

## Sensor Calibration

### Pressure Sensor Calibration
1. Connect a known pressure source
2. Record the analog output at minimum and maximum known pressures
3. Record values in PRESSURE_MIN_MV and PRESSURE_MAX_MV constants
4. Run calibration routine to establish linear mapping

### Temperature Sensor Calibration
1. Place sensor in water bath at known temperatures (0°C, 25°C, 100°C)
2. Record analog values at each temperature
3. Establish linear relationship and update calibration constants
4. Test across operating range

### Flow Rate Sensor Calibration
1. Set known flow rates using calibrated flow meter
2. Count pulses from sensor over fixed time period
3. Calculate K-factor (pulses per liter)
4. Update kFactor constant in Arduino code

## Wiring Diagram

```
                    Arduino Uno
┌─────────────────────────────────────────┐
│                                         │
│  5V ──────┬─────────────────────────┤  │
│           │                         │►─┤
│  GND ─────┼─────────────────────────┤  │
│           │                         │► │
│  A0 ◄─────┤─── Pressure Sensor     │  │
│  A1 ◄─────┤─── Temperature Sensor  │  │
│  D2 ◄─────┤─── Flow Rate Sensor    │  │
│  D3 ◄─────┤─── Velocity Sensor     │  │
│           │                         │  │
│  USB ──────┴──────── To PC          │  │
└─────────────────────────────────────────┘
```

## Circuit Protection

### Preventing Sensor Damage
- Add 0.1µF capacitors in parallel with analog inputs for noise filtering
- Include 10kΩ pull-up resistors on digital inputs from pulse sensors
- Use ferrite beads on power lines if EMI is present

### Overvoltage Protection
- Add Zener diodes for sensors that exceed 5V
- Implement voltage dividers to scale higher voltage signals

## Testing & Validation

### Pre-deployment Testing
1. **Load Test**: Verify each sensor individually with multimeter
2. **Functional Test**: Run Arduino code and verify serial output
3. **Data Quality**: Check for noise and stability in readings
4. **Long-term Test**: Run system for 24 hours and verify data integrity

### Common Issues & Troubleshooting

| Issue | Cause | Solution |
|-------|-------|----------|
| No serial output | Arduino not uploading | Check USB driver and board selection |
| Noisy readings | Electromagnetic interference | Add ferrite beads, separate power lines |
| Wrong pressure values | Uncalibrated sensor | Recalibrate using known pressures |
| Missing pulse counts | Interrupt conflicts | Review interrupt priority and handlers |

## Power Considerations

### Current Draw Estimates
- Arduino Uno: ~50mA @ 5V
- Pressure Sensor: ~20mA
- Temperature Sensor: ~5mA
- Flow/Velocity Sensors: ~10mA each (typical)

**Total: ~95mA typical**

### Recommended Power Supply
- 9V 1A external adapter connected to Arduino barrel jack
- Internal 5V regulator handles conversion

## Signal Conditioning

### For Noisy Environments
1. Implement software filtering (moving average)
2. Add RC low-pass filters to analog inputs
3. Use shielded twisted-pair cabling
4. Ensure proper grounding

## Installation Best Practices

1. Mount Arduino in weatherproof enclosure if outdoors
2. Use strain relief on all connectors
3. Label all wires and connectors
4. Provide adequate ventilation for heat dissipation
5. Keep sensor cables away from high-current carrying wires

## Serial Communication Protocol

Data transmitted at 9600 baud in the format:
```
SENSOR_DATA|pressure|temperature|flowRate|velocity|timestamp
DEBUG|message
```

Example:
```
SENSOR_DATA|50.25|22.50|45.30|12.15|1234567890
```

## References

- Arduino Pin Configuration: [Official Arduino Documentation](https://docs.arduino.cc)
- Sensor Datasheets: Check manufacturer specifications
- Interrupt Configuration: Arduino attachInterrupt() documentation
