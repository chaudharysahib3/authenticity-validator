const mongoose=require('mongoose');

const documentSchema=new mongoose.Schema({
    title:{type:String, required:true},
    fileName:{type:String, required:true},
    fileType:{type:String ,enum:["pdf", "docx"], required:true},
    filePath:{type:String, required:true},
    uploadedBy:{type:mongoose.Schema.Types.ObjectId,ref:"User", required:true},
    textContent:{type:String},
    wordCount:{type:Number},
    status:{type:String, enum:["processing", "completed", "failed"], default:"processing"}
},{timestamps:true});

module.exports=mongoose.model("Document",documentSchema);