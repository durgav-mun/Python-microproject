# Jet Nozzle Flow System

## Project Overview

The Jet Nozzle Flow System is a comprehensive full-stack application for monitoring, analyzing, and optimizing jet nozzle flow dynamics. It combines real-time sensor data collection via Arduino, cloud data storage in MySQL, and interactive visualization through a React-based web interface.

## Features

- **Real-Time Monitoring**: Live sensor data display for pressure, temperature, flow rate, and velocity
- **Data Analysis**: Historical data analysis with trends and anomaly detection
- **Vector Calculations**: Complex flow field analysis with velocity vector decomposition
- **Nozzle Design Optimization**: Tools for designing and testing nozzle configurations
- **System Health Monitoring**: Data freshness checks and system status reporting
- **RESTful API**: Complete API for integration with external systems

## Technology Stack

### Frontend
- **Framework**: React 18.2
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Visualization**: Chart.js with React wrapper
- **Styling**: CSS3 with responsive design

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MySQL 8.0+
- **ORM**: Native MySQL2 driver

### Hardware
- **Microcontroller**: Arduino Uno
- **Sensors**: Pressure, Temperature, Flow Rate, Velocity
- **Communication**: Serial (USB)

### Data Bridge
- **Language**: Python 3.7+
- **Libraries**: PySerial, mysql-connector-python

## Project Structure

```
jet-nozzle-flow-system/
├── frontend/              # React web application
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── pages/        # Page components
│   │   ├── services/     # API integration
│   │   └── styles/       # Stylesheets
│   └── package.json
│
├── backend/              # Node.js/Express API
│   ├── config/          # Database configuration
│   ├── controllers/     # Request handlers
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   ├── services/        # Business logic
│   └── package.json
│
├── database/            # MySQL schemas and queries
│   ├── schema.sql      # Table definitions
│   ├── seed.sql        # Sample data
│   └── queries.sql     # Analysis queries
│
├── hardware/            # Arduino and circuit files
│   ├── arduino/        # Arduino sketch
│   ├── circuit/        # Circuit diagrams
│   └── docs/           # Hardware documentation
│
├── scripts/            # Python utilities
│   └── serial_to_mysql.py  # Data bridge
│
└── docs/              # Project documentation
```

## Installation & Setup

### Prerequisites
- Node.js 16+ and npm
- Python 3.7+
- MySQL 8.0+
- Arduino IDE (for firmware uploads)

### Quick Start

#### 1. Database Setup
```bash
mysql -u root -p < database/schema.sql
mysql -u root -p < database/seed.sql
```

#### 2. Backend Setup
```bash
cd backend
npm install
npm run dev
```

#### 3. Frontend Setup
```bash
cd frontend
npm install
npm start
```

#### 4. Arduino Setup
- Upload `hardware/arduino/nozzle_sensor.ino` to your Arduino Uno
- Connect sensors according to [hardware setup guide](hardware/docs/hardware_setup.md)

#### 5. Python Bridge Setup
```bash
pip install -r requirements.txt
python scripts/serial_to_mysql.py
```

## API Documentation

### Base URL
```
http://localhost:5000/api
```

### Main Endpoints

**Nozzles Management**
- `GET /nozzles` - Get all nozzles
- `GET /nozzles/:id` - Get nozzle details
- `POST /nozzles` - Create new nozzle
- `PUT /nozzles/:id` - Update nozzle
- `DELETE /nozzles/:id` - Delete nozzle

**Flow Data**
- `GET /flow/data?nozzleId=1&timeRange=24` - Get flow data
- `GET /flow/latest?nozzleId=1` - Get latest measurement
- `GET /flow/statistics?nozzleId=1` - Get statistics
- `POST /flow` - Record flow data

**Vector Analysis**
- `POST /vectors/calculate` - Calculate velocity vectors
- `GET /vectors/analysis?nozzleId=1` - Get analysis results
- `GET /vectors/:id` - Get vector analysis by ID

**System**
- `GET /health` - System health check

## Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# Database
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=password
DB_NAME=jet_nozzle_system

# Server
PORT=5000
NODE_ENV=development

# Serial Connection
SERIAL_PORT=COM3
BAUD_RATE=9600
NOZZLE_ID=1
```

## Usage Examples

### Frontend Components

**Dashboard View**
```javascript
import Dashboard from './components/Dashboard';

<Dashboard />
```

**Sensor Data Display**
```javascript
import SensorData from './components/SensorData';

<SensorData data={sensorReadings} />
```

### Backend Controllers

**Create Nozzle**
```bash
curl -X POST http://localhost:5000/api/nozzles \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Nozzle A",
    "diameter": 5.0,
    "length": 10.0,
    "angle": 90,
    "material": "stainless-steel"
  }'
```

**Get Flow Data**
```bash
curl http://localhost:5000/api/flow/data?nozzleId=1&timeRange=24
```

## Database Schema

### Tables

- **nozzles**: Nozzle configuration and specifications
- **flow_data**: Time-series flow measurements
- **vector_analysis**: Calculated velocity vector components
- **user_sessions**: User authentication sessions
- **system_logs**: System events and diagnostics

## Hardware Integration

### Arduino Sensor Connections

- Pin A0: Pressure Sensor (0-5V analog)
- Pin A1: Temperature Sensor (0-5V analog)
- Pin 2: Flow Rate Sensor (digital pulse)
- Pin 3: Velocity Sensor (digital pulse)

### Sensor Calibration

Detailed calibration procedures are provided in [Hardware Setup Guide](hardware/docs/hardware_setup.md)

## Performance

### Expected Throughput
- **Frontend**: ~1000 concurrent users
- **Backend**: ~500 requests/second
- **Database**: ~1000 IPS (inserts per second)
- **Sensor Sampling**: 1 Hz (configurable)

### Database Optimization
- Indexed on (nozzle_id, timestamp) for fast queries
- Automatic cleanup of old data (30+ days)
- Partitioned tables for large datasets

## Troubleshooting

### Common Issues

**Serial Port Not Found**
- Check Arduino connection
- Verify COM port in .env
- Install CH340 driver if needed

**Database Connection Error**
- Confirm MySQL is running
- Check credentials in .env
- Verify database exists

**API Not Responding**
- Check backend server is running (`npm run dev`)
- Verify port 5000 is not in use
- Check console for error messages

## Development

### Code Style

- Frontend: ESLint with React plugin
- Backend: Standard Node.js conventions
- Database: SQL best practices

### Testing

```bash
# Backend tests
cd backend && npm test

# Frontend tests
cd frontend && npm test
```

## Deployment

### Production Checklist

- [ ] Set NODE_ENV=production
- [ ] Use environment-specific .env file
- [ ] Enable HTTPS/SSL
- [ ] Configure database backups
- [ ] Set up monitoring/alerts
- [ ] Configure CORS for frontend domain

### Docker Deployment

```bash
docker-compose up -d
```

## Documentation

- [Hardware Setup Guide](hardware/docs/hardware_setup.md)
- [API Reference](docs/api_reference.md)
- [Database Design](docs/database_design.md)
- [Troubleshooting Guide](docs/troubleshooting.md)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - See LICENSE file for details

## Support & Contact

For issues, questions, or suggestions:
- Create an issue on GitHub
- Contact: support@jetnozzle.dev
- Documentation: https://docs.jetnozzle.dev

## Changelog

### Version 1.0.0 (Initial Release)
- Core system architecture
- Frontend dashboard
- Backend API
- Arduino integration
- Database schema
- Python data bridge

---

**Last Updated**: March 2026
**Version**: 1.0.0
