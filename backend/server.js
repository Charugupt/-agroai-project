require("dotenv").config();

const express = require("express");
const multer = require("multer");
const cors = require("cors");
const axios = require("axios");

const app = express();

// ✅ CORS FIX
app.use(cors({
    origin: "*"
}));

app.use(express.json({ limit: "10mb" }));

console.log("HF TOKEN 👉", process.env.HF_TOKEN ? "Loaded ✅" : "Missing ❌");

// ✅ TEST ROUTE
app.get("/", (req, res) => {
    res.send("Backend is running 🚀");
});

// ✅ MULTER
const storage = multer.memoryStorage();
const upload = multer({ storage });

// ✅ HF MODEL
const HF_API = "https://api-inference.huggingface.co/models/linkanjarad/mobilenet_v2_1.0_224-plant-disease-identification";

// ✅ MAIN ROUTE
app.post("/predict", upload.single("file"), async (req, res) => {
    try {
        console.log("📥 Request received");

        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        // 🔥 CONVERT TO BASE64 (IMPORTANT FIX)
        const base64Image = req.file.buffer.toString("base64");

        console.log("🚀 Sending to HuggingFace...");

        if (!process.env.HF_TOKEN) {
            return res.status(500).json({ error: "HF_TOKEN missing in environment" });
        }

        const response = await axios({
            method: "POST",
            url: HF_API,
            headers: {
                Authorization: `Bearer ${process.env.HF_TOKEN}`,
                "Content-Type": "application/json",
            },
            data: {
                inputs: {
                    image: base64Image
                }
            },
            timeout: 120000
        });

        console.log("✅ HF RESPONSE:", response.data);

        // ❌ Model loading case
        if (response.data?.error) {
            return res.status(503).json({
                error: response.data.error
            });
        }

        if (!Array.isArray(response.data)) {
            return res.status(500).json({
                error: "Invalid model response"
            });
        }

        const result = response.data[0];

        const disease = result.label
            .replace("___", " ")
            .replace(/_/g, " ");

        const confidence = (result.score * 100).toFixed(2);

        res.json({
            disease,
            confidence,
            diagnosis: "AI detected plant condition",
            treatment: "Follow agricultural guidelines",
            prevention: "Ensure proper plant care"
        });

    } catch (error) {
        console.error("🔥 FULL ERROR:", error.response?.data || error.message);

        res.status(500).json({
            error: error.response?.data || error.message
        });
    }
});

// ✅ PORT FIX (VERY IMPORTANT FOR RENDER)
const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});