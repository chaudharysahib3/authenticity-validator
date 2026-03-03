const mongoose=require("mongoose");

const reportSchema=new mongoose.Schema({
    documentId:{type:mongoose.Schema.Types.ObjectId, ref:"Document", require:true},
    plagiarismScore:{type:Number, default:0},
    aiGeneratedProbability:{type:Number, default:0},
    authenticityScore:{type:Number},
    matchedDocs:[{
        documentId:{type:mongoose.Schema.Types.ObjectId, ref:"Document"},
        similarity:Number
    }],
},{ timestamps: true });

module.exports = mongoose.model("Report", reportSchema);