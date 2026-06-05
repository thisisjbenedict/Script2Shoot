import {useState} from "react";
import axios from "axios";
import api from "./services/api";
import { getHealth } from "./services/healthservice";
import { uploadScript } from "./services/scriptService";

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadResponse, setUploadResponse] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);

  const handleUpload = async () => {
    setError(null);
    setUploadResponse(null);
    
    if(!selectedFile){
      setError("Please select a PDF file.");
      return;
    }
    
    const formData = new FormData();
    formData.append("script", selectedFile);
    
    try {
      setIsUploading(true);
      const result = await uploadScript(formData);
      setUploadResponse(result);
    } catch(error) {
      setError(error.message);
    } finally {
      setIsUploading(false);
    }
  }


  return (
    <div>
      <h1>AD Copilot</h1>

      <input
        type="file"
        accept=".pdf"
        onChange={(event) => {
          setSelectedFile(
            event.target.files[0]
          )
        }}
      />

      { isUploading 
          ?<p>Uploading...</p>
          : <button disabled={isUploading} onClick={handleUpload}>Upload</button> }

      { error && (<p>Error: {error}</p>) }

      { uploadResponse && (
        <div>
          <p>Uploaded:{" "}{uploadResponse.fileName}</p> 
          <p>Preview: <pre>{uploadResponse.preview}</pre></p>
          <p>Project Summary: <pre>{uploadResponse.analysis ?.projectSummary}</pre></p>
        </div>)}
    </div>
  );
}

export default App;