require("dotenv").config();

const express = require("express");
const multer = require("multer");
const cors = require("cors");
const axios = require("axios");

console.log("HF TOKEN 👉", process.env.HF_TOKEN ? "Loaded ✅" : "Missing ❌");

const app = express();

app.use(cors({
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"]
}));

app.use(express.json());

// Test route
app.get("/", (req, res) => {
    res.send("Backend is running 🚀");
});

// Multer setup
const storage = multer.memoryStorage();
const upload = multer({ storage });

// HF API
const HF_API =
    "https://api-inference.huggingface.co/models/linkanjarad/mobilenet_v2_1.0_224-plant-disease-identification";

// Predict Route
app.post("/predict", upload.single("file"), async (req, res) => {
    try {
        console.log("📥 Request received");

        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        const imageBuffer = req.file.buffer;

        console.log("🚀 Sending to Hugging Face...");

        const response = await axios.post(
            HF_API,
            imageBuffer,
            {
                headers: {
                    Authorization: `Bearer ${process.env.HF_TOKEN}`,
                    "Content-Type": "application/octet-stream",
                    "x-wait-for-model": "true" // ✅ FIXED
                },
                timeout: 120000,
            }
        );

        console.log("🧠 HF RESPONSE:", response.data);

        // ✅ Handle HF error safely
        if (response.data && response.data.error) {
            return res.status(500).json({
                error: response.data.error,
            });
        }

        // ✅ Validate response
        if (!Array.isArray(response.data)) {
            return res.status(500).json({
                error: "Invalid response from model",
            });
        }

        const result = response.data;

        const rawLabel = result[0]?.label || "Unknown";

        // Clean label
        const disease = rawLabel
            .replace("___", " ")
            .replace(/_/g, " ");

        const confidence = (result[0]?.score || 0) * 100;

        res.json({
            disease,
            confidence: confidence.toFixed(2),
            diagnosis: "AI detected plant condition",
            treatment: "Consult agricultural expert",
            prevention: "Maintain plant hygiene and monitor regularly",
        });

    } catch (error) {
        console.error("🔥 FULL ERROR:", error.response?.data || error.message);

        res.status(500).json({
            error: error.response?.data || error.message,
        });
    }
});

// Start server
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});