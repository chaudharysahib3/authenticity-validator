require("dotenv").config();
const express=require('express');
const app=express();
const connectDB=require("./config/db.js");
const authRoute=require("./routes/authRoutes");
const documentRoutes=require("./routes/documentRoutes");
const cors=require("cors");
connectDB();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server Working");
});

app.use("/api/auth", authRoute);
app.use("/api/document", documentRoutes);

app.listen(5000,()=>{
    console.log(`hello form port ${5000}`);
})