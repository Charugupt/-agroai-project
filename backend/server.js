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

// Multer setup (file upload)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Hugging Face API
const HF_API =
    "https://api-inference.huggingface.co/models/linkanjarad/mobilenet_v2_1.0_224-plant-disease-identification";

// Disease Info (basic)
const DISEASE_DATA = {
    "Tomato healthy": {
        diagnosis: "The plant appears healthy.",
        treatment: "No treatment required.",
        prevention: "Maintain proper care and watering.",
    },
};

// Predict Route
app.post("/predict", upload.single("file"), async (req, res) => {
    try {
        console.log("📥 Request received");

        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        const imageBuffer = req.file.buffer;

        console.log("🚀 Sending to Hugging Face...");
        console.log("API HIT");

        const response = await axios.post(
            HF_API,
            imageBuffer,
            {
                headers: {
                    Authorization: `Bearer ${process.env.HF_TOKEN}`,
                    "Content-Type": "application/octet-stream",
                },
                params: {
                    wait_for_model: true
                },
                timeout: 120000,
            }
        );

        console.log("✅ HF RESPONSE:", response.data);

        // ❌ If model still loading
        if (response.data?.error?.includes("loading")) {
            return res.status(503).json({
                error: "Model is loading, try again in few seconds",
            });
        }

        // ❌ Invalid response
        if (!Array.isArray(response.data)) {
            return res.status(500).json({
                error: "Invalid response from model",
            });
        }

        const result = response.data;

        // 🔥 CLEAN LABEL (VERY IMPORTANT FIX)
        const rawLabel = result[0]?.label || "Unknown";

        const disease = rawLabel
            .replace("___", " ")
            .replace(/_/g, " ");

        const confidence = (result[0]?.score || 0) * 100;

        // Info mapping
        const info =
            DISEASE_DATA[disease] || {
                diagnosis: "Limited model support (Tomato/Potato/Corn only)",
                treatment: "Try using supported plant types",
                prevention: "Use clear image of supported crops",
            };

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