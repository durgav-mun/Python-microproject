from flask import Flask
from flask_cors import CORS
from routes.auth_routes import auth_bp
from routes.simulation_routes import simulation_bp
from routes.advanced_routes import advanced_bp
from routes.monitoring_routes import monitoring_bp

app = Flask(__name__)
CORS(app) # Enable CORS for frontend requests

# Database is initialized lazily via PyMongo
# Register blueprints
app.register_blueprint(auth_bp)
app.register_blueprint(simulation_bp)
app.register_blueprint(advanced_bp)
app.register_blueprint(monitoring_bp)

@app.route('/')
def index():
    return {"status": "Fluid Simulation API is running"}

if __name__ == '__main__':
    print("Starting server on http://localhost:5000")
    app.run(debug=True, port=5000)
