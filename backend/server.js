const express = require("express");
const multer = require("multer");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors());
app.use(express.json());

// Multer setup (for file upload)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// 👉 Hugging Face API
const HF_API =
    "https://api-inference.huggingface.co/models/linkanjarad/mobilenet_v2_1.0_224-plant-disease-identification";

// 🔑 PUT YOUR TOKEN HERE
const HF_TOKEN = process.env.HF_TOKEN;

// 👉 Disease Info (you can expand this)
const DISEASE_DATA = {
    Healthy: {
        diagnosis: "The plant appears healthy.",
        treatment: "No treatment required.",
        prevention: "Maintain proper care and watering.",
    },
};

// 👉 Upload + Predict API
app.post("/api/upload", upload.single("file"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        const imageBuffer = req.file.buffer;

        // 🔥 Call Hugging Face API
        const response = await axios.post(HF_API, imageBuffer, {
            headers: {
                Authorization: `Bearer ${HF_TOKEN}`,
                "Content-Type": "application/octet-stream",
            },
        });

        const result = response.data;

        // 👉 Extract prediction
        const disease = result[0]?.label || "Unknown";
        const confidence = (result[0]?.score || 0) * 100;

        const info =
            DISEASE_DATA[disease] || {
                diagnosis: "Data not available",
                treatment: "Consult expert",
                prevention: "Maintain plant hygiene",
            };

        res.json({
            disease,
            confidence: confidence.toFixed(2),
            diagnosis: info.diagnosis,
            treatment: info.treatment,
            prevention: info.prevention,
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({
            error: "Prediction failed",
            details: error.message,
        });
    }
});

// 👉 Server start
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});