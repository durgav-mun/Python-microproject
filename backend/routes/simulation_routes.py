from flask import Blueprint, request, jsonify
from models.simulation_model import save_simulation, get_user_simulations

simulation_bp = Blueprint('simulation', __name__)

@simulation_bp.route('/api/simulations', methods=['POST'])
def save_sim():
    data = request.json
    user_id = data.get('user_id')
    params = data.get('params')
    results = data.get('results')
    
    if not user_id or not params or not results:
        return jsonify({"error": "Missing required fields"}), 400
        
    success, message = save_simulation(user_id, params, results)
    if success:
        return jsonify({"message": message}), 201
    else:
        return jsonify({"error": message}), 500

@simulation_bp.route('/api/simulations/<user_id>', methods=['GET'])
def get_history(user_id):
    simulations = get_user_simulations(user_id)
    return jsonify({"simulations": simulations}), 200
