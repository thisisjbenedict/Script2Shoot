const fs = require("fs");
const pdf = require("pdf-parse");

const extractText = async (filePath) => {
  try{
    const fileBuffer = fs.readFileSync(filePath);
    const pdfData = await pdf(fileBuffer);
    return pdfData.text;
  } catch(error) {
    console.error("PDF extraction failed", error);
     throw error;
  }
};

module.exports = {
  extractText,
};