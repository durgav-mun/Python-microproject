from flask import Blueprint, request, jsonify
from groq import Groq
import os

chat_bp = Blueprint('chat', __name__)
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

SYSTEM_PROMPT = """You are a fluid dynamics assistant for a fluid simulation web app.
Help users understand concepts like Bernoulli's principle, flow rate, pressure, velocity, nozzle behavior, and simulation results.
Keep answers concise and practical."""

@chat_bp.route('/api/chat', methods=['POST'])
def chat():
    data = request.get_json()
    user_message = data.get('message', '').strip()
    if not user_message:
        return jsonify({'error': 'Message is required'}), 400

    try:
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": user_message}
            ]
        )
        reply = response.choices[0].message.content
        return jsonify({'reply': reply})
    except Exception as e:
        return jsonify({'error': str(e)}), 500
