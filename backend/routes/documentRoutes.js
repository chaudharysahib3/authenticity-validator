const express=require("express");
const router=express.Router();

const {uploadDocument}=require("../controllers/documentController");
const  protect  = require("../middleware/authMiddleware");
const upload=require("../middleware/uploadMiddleware");

// console.log("protect:", typeof protect);
// console.log("upload:", typeof upload);
// console.log("upload.single:", typeof upload.single);
// console.log("uploadDocument:", typeof uploadDocument);

router.post("/upload",protect, upload.single("file"), uploadDocument);


module.exports=router;