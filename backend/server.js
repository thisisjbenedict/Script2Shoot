const express = require("express");
const cors = require("cors");
const multer = require("multer");
const {extractText} = require("./services/pdfService");
const {analyzeScript} = require("./services/analysisService");

const app = express();
const upload = multer({
    dest: "uploads/"
});

const PORT = 3001;

app.use(cors());

app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
});

app.get("/health",
    (req, res) => {
        res.json({
            status: "UP",
            service: "AD Copilot Backend",
        });
    }
);

app.post("/upload", 
    upload.single("script"), 
    async (req, res) => {
        try{
            if (!req.file) {
                return res.status(400).json({
                    error: "No file uploaded"
                });
            }
        
            const text = await extractText(req.file.path);
            const analysis = await analyzeScript(text);
            res.json({
                success: "true",
                fileName: req.file.originalname,
                preview: text.substring(0, 500),
                analysis,
            });
        } catch(error){
            console.error(error);
            res.status(500).json({
                error: "Upload failed",
            });
        }
    }
);