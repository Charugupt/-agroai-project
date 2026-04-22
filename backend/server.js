const express = require('express');
const multer = require('multer');
const axios = require('axios');
const cors = require('cors');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const Scan = require('./models/Scan');

const app = express();
const port = 3000;
const FLASK_URL = 'http://localhost:5000/predict';

// MongoDB Connection
const MONGO_URI = 'mongodb+srv://sonalgupta8291_db_user:sonal%4010@cluster0.2my6fbk.mongodb.net/?appName=Cluster0';
mongoose.connect(MONGO_URI)
    .then(() => console.log('✅ Connected to MongoDB'))
    .catch(err => console.error('❌ MongoDB Connection Error:', err));

app.use(cors());
app.use(express.json());

// Setup storage for Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, 'uploads');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir);
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

// Route: Upload and Analyze
app.post('/api/upload', upload.single('file'), async (req, res) => {
    console.log("🔥 API HIT /api/upload");
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    const filePath = req.file.path;

    try {
        const formData = new FormData();
        formData.append('file', fs.createReadStream(filePath));

        // Forward to Flask API
        const response = await axios.post(FLASK_URL, formData, {
            headers: {
                ...formData.getHeaders()
            }
        });

        const result = response.data;

        // Convert image to Base64 for database storage (beginner-friendly way to show history)
        const imageBuffer = fs.readFileSync(filePath);
        const base64Image = `data:${req.file.mimetype};base64,${imageBuffer.toString('base64')}`;

        // Save to MongoDB
        const newScan = new Scan({
            image: base64Image,
            disease: result.disease,
            confidence: result.confidence
        });
        await newScan.save();

        // Clean up the uploaded file
        fs.unlinkSync(filePath);

        res.json(result);
    } catch (error) {
        console.error('Error in communication with AI Service:', error.message);
        // Ensure file is deleted even on error
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Route: Get History
app.get('/api/history', async (req, res) => {
    try {
        const scans = await Scan.find().sort({ createdAt: -1 });
        res.json(scans);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch history' });
    }
});

app.listen(port, () => {
    console.log(`Backend server running at http://localhost:${port}`);
});
