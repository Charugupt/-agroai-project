from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from disease_info import DISEASE_DATA

app = Flask(__name__)
CORS(app)

@app.route('/predict', methods=['POST'])
def predict():
    if 'file' not in request.files:
        return jsonify({"error": "No file uploaded"}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No file selected"}), 400

    # Dummy prediction (since ML is removed)
    disease_name = "Healthy"
    confidence = 0.95

    info = DISEASE_DATA.get(disease_name, {
        "diagnosis": "Data not available.",
        "treatment": "Consult expert.",
        "prevention": "General care."
    })

    return jsonify({
        "disease": disease_name,
        "confidence": round(confidence * 100, 2),
        "diagnosis": info["diagnosis"],
        "treatment": info["treatment"],
        "prevention": info["prevention"]
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)