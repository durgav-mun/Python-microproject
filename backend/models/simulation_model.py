import datetime
from db import get_db

def save_simulation(user_id, params, results):
    db = get_db()
    simulation_entry = {
        "user_id": user_id,
        "params": params,
        "results": results,
        "timestamp": datetime.datetime.utcnow()
    }
    db.simulations.insert_one(simulation_entry)
    return True, "Simulation saved successfully"

def get_user_simulations(user_id):
    db = get_db()
    # Sort by timestamp descending (-1)
    simulations = list(db.simulations.find({"user_id": user_id}).sort("timestamp", -1))
    
    # Convert ObjectId to string for JSON serialization
    for sim in simulations:
        sim['_id'] = str(sim['_id'])
        
    return simulations
