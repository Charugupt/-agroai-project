const express = require("express");
const multer = require("multer");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
    res.send("Backend is running 🚀");
});

// Multer setup (for file upload)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Hugging Face API
const HF_API =
    "https://api-inference.huggingface.co/models/linkanjarad/mobilenet_v2_1.0_224-plant-disease-identification?wait_for_model=true";

const HF_TOKEN = process.env.HF_TOKEN;

// Disease Info
const DISEASE_DATA = {
    Healthy: {
        diagnosis: "The plant appears healthy.",
        treatment: "No treatment required.",
        prevention: "Maintain proper care and watering.",
    },
};

// Predict API
app.post("/predict", upload.single("file"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        const imageBuffer = req.file.buffer;

        // 🔥 Hugging Face Call (FINAL FIXED)
        const response = await axios({
            method: "POST",
            url: HF_API,
            headers: {
                Authorization: `Bearer ${HF_TOKEN}`,
                "Content-Type": "application/octet-stream",
            },
            data: imageBuffer,
            timeout: 60000,
        });

        console.log("HF RESPONSE:", response.data);

        // Safe handling
        let result = [];

        if (Array.isArray(response.data)) {
            result = response.data;
        } else if (response.data?.error) {
            console.log("HF ERROR:", response.data.error);
            throw new Error(response.data.error);
        } else {
            console.log("UNKNOWN RESPONSE:", response.data);
            throw new Error("Invalid response from model");
        }

        // Extract prediction
        const disease = result[0]?.label || "Unknown";
        const confidence = (result[0]?.score || 0) * 100;

        // Get info
        const info =
            DISEASE_DATA[disease] || {
                diagnosis: "Data not available",
                treatment: "Consult expert",
                prevention: "Maintain plant hygiene",
            };

        // Send response
        res.json({
            disease,
            confidence: confidence.toFixed(2),
            diagnosis: info.diagnosis,
            treatment: info.treatment,
            prevention: info.prevention,
        });

    } catch (error) {
        console.error("ERROR:", error.response?.data || error.message);

        res.status(500).json({
            error: "Prediction failed",
        });
    }
});

// Server start
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});