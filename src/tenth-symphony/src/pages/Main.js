import {useState, useRef, useEffect} from 'react';
import '../styles/main.scss'
import FileUpload from "react-material-file-upload";
import Button from '@mui/material/Button';

import loadingImage from '../images/loadingImage.png'


// BEM - Block Element Modifier
function Main() {
  const audioRef = useRef()
  const [playlistQuery, setPlaylistQuery] = useState();
  const [duration, setDuration] = useState(5);
  const [songLink, setSongLink] = useState();
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState([]);
  const [fileUploaded, setFileUploaded] = useState(true)
  const [startDownload, setStartDownload] = useState(false)

  const handleSubmit = async () => {
    const formData = new FormData();
    console.log(files)
    formData.append('file', files[0]);
    
    try {
      // Make both API requests concurrently
      const uploadResponse = await fetch('https://268b-35-204-96-131.ngrok-free.app/upload', {
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
  const search = async () =>{
    setStartDownload(true);
    setLoading(true);
    const playlistApi = "https://268b-35-204-96-131.ngrok-free.app";
    const response = await fetch(`${playlistApi}/playlist_gen`,{
        method: "POST",
        mode: "cors",
        headers:{
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
            // "Origin": window.location.origin
        },
        body: JSON.stringify({
            text:playlistQuery,
            duration
        })
    })
    const result = await response.json()
    console.log(result)
    if(result.Success){
        setSongLink(`${playlistApi}/static/${result.filename}`)
    }else{
        
        alert("it broke!")
    }
    setLoading(false);
    // alert("search")
  }

  const downloadButton = async () => {
    
    try {
        const response = await fetch(`https://268b-35-204-96-131.ngrok-free.app/download`);
        console.log(response.body)
        const blob = await response.blob();
  
        // Create a temporary anchor element and trigger a click to download the file
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = "merged.mp4";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      } catch (error) {
        console.error('Error downloading video:', error);
      }
    setStartDownload(false)
  }

  useEffect(() => {
    if(songLink && audioRef.current){
        fetch(songLink, {
            
            mode: "cors",
            headers:{
                "ngrok-skip-browser-warning": "true",
                // "Origin": window.location.origin
            },
        }).then((response) => {
            return response.blob()
        }).then((blob) => {
            const audioPlayer = audioRef.current;
            const audioURL = URL.createObjectURL(blob);
            audioPlayer.src = audioURL;
        })
    }
  },[songLink, audioRef]);
  return (
    <main className="flex flex-column w-100 justify-center align-center justify-center">
        <div className="App">
      <h1>Upload your desired video</h1>
      <h2>Video should be lesser than 500 MB. Upload a short video</h2>
      <FileUpload value={files} onChange={setFiles} />
      {/* <Button variant="contained" color="success" style={{marginTop: '20px'}} onClick={handleSubmit}>
        Submit
      </Button> */}
    </div>
        <div className='search flex flex-column align-center'>
            {loading && <img src={loadingImage} className='loading-image' />}
            <label>Generate your coding playlists using Audiocraft</label>
      <input 
      className="search-input"
      type="text" 
      placeholder='example Lofi with mellow electric background music'
      value={playlistQuery} 
      onChange={(e) => setPlaylistQuery(e.target.value)} 
      />
      <div className='flex align-center'><span className='label-hint' style={{marginRight: "7px"}}>How long do you want in seconds?</span></div>
      
      <input className='duration' type="number" value={duration} onChange={(e) => setDuration(e.target.value)} />
      <button className='search-submit' onClick={async() => {
        await search();
        await handleSubmit();
      }}>Generate Song</button>

      </div>
      <div>
        {songLink && <div className='flex flex-column'>
            <audio controls ref={audioRef}>
                <source src={songLink} type="audio/ogg" />
                Your browser does not support the audio element.
            </audio>
        </div>}
      </div>
      {startDownload && <div className='align-center'><h1>Video ready. Download here!</h1>
      <div className='flex ' style={{justifyContent: 'center'}}><Button variant="contained" color="success" onClick={downloadButton}style={{marginTop: '20px'}} className='align-center'>
        Download
      </Button></div>
      </div>}
    </main>
  );
}

export default Main;
