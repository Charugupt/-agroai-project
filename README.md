# 🌿 AgroAI – Smart Crop Disease Detection System

A production-level full-stack AI web application for identifying plant leaf diseases using Deep Learning.

## 🚀 Features
- **Premium UI**: Dark mode with glassmorphism and smooth animations.
- **Deep Learning**: CNN model built with TensorFlow for multi-class classification.
- **3-Tier Architecture**: React (Vite) + Node.js (Express) + Python (Flask).
- **Comprehensive Analysis**: Get diagnosis, treatment protocols, and prevention tips.

## 🛠️ Setup Instructions

### 1. ML Service (AI API)
```bash
cd ml-service
pip3 install -r requirements.txt
python3 train_model.py  # Generates the model file
python3 app.py          # Starts Flask on port 5000
```

### 2. Backend (Node.js)
```bash
cd backend
npm install
node server.js          # Starts Express on port 3000
```

### 3. Frontend (React)
```bash
cd frontend
npm install
npm run dev             # Starts Vite on port 5173
```

## 🏗️ Architecture
- **Frontend**: React, Tailwind CSS, Framer Motion, Lucide Icons.
- **Backend**: Node.js, Express, Multer (File Handling), Axios.
- **ML Service**: Python, Flask, TensorFlow, Keras, NumPy, Pillow.

## 🎯 Final Goal
This application is designed to be a demo-ready product for placements and real-world agricultural intelligence demos.
