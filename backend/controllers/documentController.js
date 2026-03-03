const Document = require("../models/Document");
const pdfParse = require("pdf-parse");
const mammoth = require('mammoth');
const fs = require("fs");
const {preprocessText,
  calculateTF,
  calculateIDF,
  calculateTFIDF,
  cosineSimilarity}=require("../utils/tfidf");
const {detectAIProbability}=require("../utils/aiDetection");


const uploadDocument = async (req, res) => {
  try {

    console.log("===== UPLOAD STARTED =====");

    if (!req.file) {
      console.log("❌ No file received");
      return res.status(400).json({ message: "No file uploaded" });
    }

    const { title } = req.body;
    const filePath = req.file.path;
    const fileType = req.file.mimetype;

    console.log("📁 File Info:");
    console.log("Title:", title);
    console.log("Path:", filePath);
    console.log("Type:", fileType);

    let extractedText = "";

    // ===== PDF =====
    if (fileType === "application/pdf") {
      console.log("📄 Extracting PDF...");
      const buffer = fs.readFileSync(filePath);
      const pdfData = await pdfParse(buffer);
      extractedText = pdfData?.text || "";
    }

    // ===== DOCX =====
    else if (
      fileType ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      console.log("📄 Extracting DOCX...");
      const result = await mammoth.extractRawText({ path: filePath });
      extractedText = result?.value || "";
    }

    else {
      console.log("❌ Unsupported file type");
      return res.status(400).json({ message: "Unsupported file type" });
    }

    console.log("📝 Extracted text length:", extractedText.length);

    // ===== WORD COUNT =====
    const wordCount = extractedText
      ? extractedText.trim().split(/\s+/).length
      : 0;

    console.log("🔢 Word count:", wordCount);

    // ===== PREPROCESS =====
    const newDocsWords = extractedText
      ? preprocessText(extractedText)
      : [];

    console.log("🔄 Preprocessed words:", newDocsWords.length);

    const previousDocs = await Document.find() || [];
    console.log("📚 Previous documents:", previousDocs.length);

    let plagiarismScore = 0;

    if (previousDocs.length > 0 && newDocsWords.length > 0) {

      console.log("⚙ Running TF-IDF...");

      const processedDocs = previousDocs.map(doc =>
        preprocessText(doc.textContent || "")
      );

      processedDocs.push(newDocsWords);

      const idf = calculateIDF(processedDocs);

      const newTF = calculateTF(newDocsWords);
      const newVector = calculateTFIDF(newTF, idf);

      let highestSimilarity = 0;

      for (let i = 0; i < previousDocs.length; i++) {

        const tf = calculateTF(processedDocs[i]);
        const vector = calculateTFIDF(tf, idf);

        const similarity = cosineSimilarity(newVector, vector);

        if (similarity > highestSimilarity) {
          highestSimilarity = similarity;
        }
      }

      plagiarismScore = Number((highestSimilarity * 100).toFixed(2));
      console.log("📊 Plagiarism Score:", plagiarismScore, "%");
    }

    // ===== AI DETECTION =====
    console.log("🤖 Running AI Detection...");
    const aiProbability = extractedText
      ? detectAIProbability(extractedText)
      : 0;

    console.log("🤖 AI Probability:", aiProbability, "%");

    // ===== SAVE DOCUMENT =====
    const document = await Document.create({
      title,
      fileName: req.file.originalname,
      fileType: fileType.includes("pdf") ? "pdf" : "docx",
      filePath,
      uploadedBy: req.user._id,
      textContent: extractedText,
      wordCount,
      plagiarismScore,
      aiProbability,
      status: "completed"
    });

    console.log("✅ Document saved successfully");
    console.log("===== UPLOAD COMPLETED =====");

    res.status(201).json({
      message: "Document uploaded successfully",
      plagiarismScore,
      aiProbability,
      document
    });

  } catch (error) {
    console.error("🔥 UPLOAD ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

module.exports={uploadDocument};