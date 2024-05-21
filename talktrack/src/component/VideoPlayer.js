// src/App.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactPlayer from 'react-player';
// import './App.css';

function VideoPlayer({ videoUrl }) {
  console.log(videoUrl) 
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
