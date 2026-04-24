require("dotenv").config();

const express = require("express");
const multer = require("multer");
const cors = require("cors");
const axios = require("axios");

console.log("HF TOKEN 👉", process.env.HF_TOKEN ? "Loaded ✅" : "Missing ❌");

const app = express();
app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
    res.send("Backend is running 🚀");
});

// Multer setup (file upload)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// ✅ CORRECT Hugging Face API (NO query params)
const HF_API =
    "https://api-inference.huggingface.co/models/linkanjarad/mobilenet_v2_1.0_224-plant-disease-identification";

// Disease Info (you can expand this later)
const DISEASE_DATA = {
    Healthy: {
        diagnosis: "The plant appears healthy.",
        treatment: "No treatment required.",
        prevention: "Maintain proper care and watering.",
    },
};

// ✅ Predict Route
app.post("/predict", upload.single("file"), async (req, res) => {
    try {
        console.log("📥 Request received");

        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        const imageBuffer = req.file.buffer;

        console.log("🚀 Sending to Hugging Face...");

        // ✅ Correct axios usage
        const response = await axios.post(
            HF_API,
            imageBuffer,
            {
                headers: {
                    Authorization: `Bearer ${process.env.HF_TOKEN}`,
                    "Content-Type": "application/octet-stream",
                },
                timeout: 60000,
            }
        );

        console.log("✅ HF RESPONSE:", response.data);

        // ✅ Handle HF error safely
        if (response.data?.error) {
            return res.status(500).json({
                error: response.data.error,
            });
        }

        if (!Array.isArray(response.data)) {
            return res.status(500).json({
                error: "Invalid response from model",
            });
        }

        const result = response.data;

        // Extract prediction
        const disease = result[0]?.label || "Unknown";
        const confidence = (result[0]?.score || 0) * 100;

        const info =
            DISEASE_DATA[disease] || {
                diagnosis: "Data not available",
                treatment: "Consult expert",
                prevention: "Maintain plant hygiene",
            };

        // Final response
        res.json({
            disease,
            confidence: confidence.toFixed(2),
            diagnosis: info.diagnosis,
            treatment: info.treatment,
            prevention: info.prevention,
        });

    } catch (error) {
        console.error("🔥 FULL ERROR:", error.response?.data || error.message);

        res.status(500).json({
            error: error.response?.data || error.message,
        });
    }
});

// Server start
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});