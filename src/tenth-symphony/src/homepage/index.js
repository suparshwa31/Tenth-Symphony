import "./styles.css";
import { useState } from "react";
import FileUpload from "react-material-file-upload";
import Button from '@mui/material/Button';

export default function Homepage() {
  const [files, setFiles] = useState([]);
  const [fileUploaded, setFileUploaded] = useState(true)

  const handleSubmit = async () => {
    const formData = new FormData();
    console.log(files)
    formData.append('file', files[0]);

    try {
      // Make both API requests concurrently
      const uploadResponse = await fetch('https://fb75-35-247-61-40.ngrok-free.app/upload', {
          method: 'POST',
          mode: "cors",
          headers:{
            // "Content-Type": "multipart/form-data",
            "ngrok-skip-browser-warning": "true",
            // "Origin": window.location.origin
          },
          body: formData,
        })

      // Check if both requests were successful
      if (uploadResponse.ok) {
        console.log('File uploaded successfully');
        setFileUploaded(true);

        // You can add further actions here after both calls are successful
      } else {
        console.error('Failed to upload file or call /prompt API');
      }
      
    } catch (error) {
      console.error('Error during file upload and prompt call:', error);
    }
  };

  const upload = async () =>{
    const playlistApi = "https://c48f-35-247-61-40.ngrok-free.app";
    console.log(files)
  }

  return (
    <div className="App">
      <h1>The Tenth Symphony</h1>
      <h1>Upload your desired video</h1>
      <h2>Video should be lesser than 500 MB. Upload a short video</h2>
      <FileUpload value={files} onChange={setFiles} />
      <Button variant="contained" color="success" style={{marginTop: '20px'}} onClick={handleSubmit}>
        Submit
      </Button>
    </div>
  );
}