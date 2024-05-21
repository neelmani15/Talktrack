// src/App.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactPlayer from 'react-player';
import './App.css';

function VideoPlayer(url ) {
  const [videoUrl, setVideoUrl] = useState('');
  const meetingId = '123456'; // Example meeting ID

  useEffect(() => {
    const fetchVideoUrl = async () => {
      try {
        const response = await axios.get(`/video-url/${meetingId}`);
        setVideoUrl(response.data.url);
      } catch (error) {
        console.error('Error fetching video URL:', error);
      }
    };

    fetchVideoUrl();
  }, [meetingId]);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Video Player</h1>
        {videoUrl ? (
          <ReactPlayer url={videoUrl} controls width="640px" height="360px" />
        ) : (
          <p>Loading video...</p>
        )}
      </header>
    </div>
  );
}

export default VideoPlayer;
