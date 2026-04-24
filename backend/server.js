require("dotenv").config();

const express = require("express");
const multer = require("multer");
const cors = require("cors");
const axios = require("axios");

console.log("HF TOKEN 👉", process.env.HF_TOKEN ? "Loaded ✅" : "Missing ❌");

const app = express();

// ✅ CORS FIX (important for frontend)
app.use(cors({
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"]
}));

app.use(express.json());

// ✅ TEST ROUTE
app.get("/", (req, res) => {
    res.send("Backend is running 🚀");
});

// ✅ MULTER (file upload)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// ✅ HUGGING FACE MODEL
const HF_API =
    "https://api-inference.huggingface.co/models/linkanjarad/mobilenet_v2_1.0_224-plant-disease-identification";

// ✅ PREDICT ROUTE (FINAL FIXED)
app.post("/predict", upload.single("file"), async (req, res) => {
    try {
        console.log("📥 Request received");

        // ❌ No file check
        if (!req.file) {
            console.log("❌ FILE NOT RECEIVED");
            return res.status(400).json({ error: "No file uploaded" });
        }

        // 🔥 CONVERT IMAGE TO BASE64 (CRITICAL FIX)
        const base64Image = req.file.buffer.toString("base64");

        console.log("🚀 Sending to Hugging Face...");

        const response = await axios.post(
            HF_API,
            {
                inputs: base64Image
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.HF_TOKEN}`,
                    "Content-Type": "application/json"
                },
                timeout: 120000
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

        // ✅ CLEAN LABEL
        const rawLabel = result[0]?.label || "Unknown";

        const disease = rawLabel
            .replace("___", " ")
            .replace(/_/g, " ");

        const confidence = (result[0]?.score || 0) * 100;

        // ✅ RESPONSE BACK TO FRONTEND
        res.json({
            disease,
            confidence: confidence.toFixed(2),
            diagnosis: "AI-based diagnosis result",
            treatment: "Follow proper crop care",
            prevention: "Use healthy plants & clean environment"
        });

    } catch (error) {
        console.error("🔥 FULL ERROR:", error.response?.data || error.message);

        res.status(500).json({
            error: error.response?.data || error.message,
        });
    }
});

// ✅ SERVER START
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});