from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow as tf
from tensorflow.keras.preprocessing import image
import numpy as np
import os
from disease_info import DISEASE_DATA, CLASS_NAMES

app = Flask(__name__)
CORS(app)

# Load the model
MODEL_PATH = os.path.join(os.path.dirname(__file__), 'plant_disease_model.h5')
model = None

if os.path.exists(MODEL_PATH):
    model = tf.keras.models.load_model(MODEL_PATH)
    print("Model loaded successfully.")
else:
    print("Model file not found. Please run train_model.py first.")

def predict_disease(img_path):
    if model is None:
        return "Unknown", 0.0
        
    img = image.load_img(img_path, target_size=(128, 128))
    img_array = image.img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0) / 255.0
    
    predictions = model.predict(img_array)
    score = np.max(predictions[0])
    class_idx = np.argmax(predictions[0])
    
    return CLASS_NAMES[class_idx], float(score)

@app.route('/predict', methods=['POST'])
def predict():
    if 'file' not in request.files:
        return jsonify({"error": "No file uploaded"}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No file selected"}), 400
        
    # Save temp file
    temp_path = os.path.join(os.path.dirname(__file__), 'temp_upload.jpg')
    file.save(temp_path)
    
    try:
        disease_name, confidence = predict_disease(temp_path)
        
        # Get metadata
        info = DISEASE_DATA.get(disease_name, {
            "diagnosis": "Data not available for this condition.",
            "treatment": "Consult an agricultural expert.",
            "prevention": "Maintain general crop hygiene."
        })
        
        response = {
            "disease": disease_name,
            "confidence": round(confidence * 100, 2),
            "diagnosis": info["diagnosis"],
            "treatment": info["treatment"],
            "prevention": info["prevention"]
        }
        
        return jsonify(response)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if os.path.exists(temp_path):
            os.remove(temp_path)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
