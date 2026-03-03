import {useState} from"react";
import API from "../services/api";


function Upload() {
    const [file, setFile]=useState(null);
    const [title, setTitle]=useState("");
    const [result, setResult]=useState(null);

    const handleUpload=async(e)=>{
        e.preventDefault();

        const formData=new FormData();
        formData.append("file", file);
        formData.append("title", title);

        try{
          const res=await API.post("/document/upload", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
          });
          setResult(res.data);
        } catch (err){
            alert("Upload failed");
        }
    }
    return (
        <div className="container">
            <h2>Upload Document</h2>
            <form onSubmit={handleUpload}>
                <input type="text" placeholder="Document Title"
                onChange={(e) => setTitle(e.target.value)}
                />

                <input type="file"
                onChange={(e)=> setFile(e.target.files[0])}
                />

                <button type="submit">Upload</button>
            </form>

            {
                result && (
                    <div className="result-box">
                        <h3>Analysis Result</h3>
                        <p>Plagiarism: {result.plagiarism ?? 0}%</p>
                        <p>AI Probability: {result.aiProbability}%</p>
                        
                    </div>
                )
            }
        </div>
    );
}

export default Upload;;