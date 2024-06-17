// import React, { useRef } from 'react';

// const AudioPlayer = ({ audioUrl }) => {
//   const audioRef = useRef(null);

//   const handleForward = () => {
//     if (audioRef.current) {
//       audioRef.current.currentTime += 10; // Forward 10 seconds
//     }
//   };

//   const handleRewind = () => {
//     if (audioRef.current) {
//       audioRef.current.currentTime -= 5; // Rewind 5 seconds
//       if (audioRef.current.currentTime < 0) {
//         audioRef.current.currentTime = 0; // Prevent negative time
//       }
//     }
//   };

//   return (
//     <div className="audio-player">
//       <audio ref={audioRef} controls>
//         <source src={audioUrl} type="audio/mpeg" />
//         Your browser does not support the audio element.
//       </audio>
//       <div className="controls">
//         <button onClick={handleRewind}>Rewind 5s</button>
//         <button onClick={handleForward}>Forward 10s</button>
//       </div>
//     </div>
//   );
// };

// export default AudioPlayer;



// import React, { useRef } from 'react';
// import { FaForward, FaBackward } from 'react-icons/fa'; // Import the icons from react-icons

// const AudioPlayer = ({ audioUrl }) => {
//   const audioRef = useRef(null);

//   const handleForward = () => {
//     if (audioRef.current) {
//       audioRef.current.currentTime += 10; // Forward 10 seconds
//     }
//   };

//   const handleRewind = () => {
//     if (audioRef.current) {
//       audioRef.current.currentTime -= 5; // Rewind 5 seconds
//       if (audioRef.current.currentTime < 0) {
//         audioRef.current.currentTime = 0; // Prevent negative time
//       }
//     }
//   };

//   return (
//     <div className="audio-player " >
//       <audio ref={audioRef} controls>
//         <source src={audioUrl} type="audio/mpeg" />
//         Your browser does not support the audio element.
//       </audio>
//       <div className="controls mt-2 flex-row space-x-4">
//         <button 
//           onClick={handleRewind} 
//           className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded inline-flex items-center"
//         >
//           <FaBackward className="mr-2" /> Rewind 5s
//         </button>
//         <button 
//           onClick={handleForward} 
//           className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded inline-flex items-center"
//         >
//           <FaForward className="mr-2" /> Forward 10s
//         </button>
//       </div>
//     </div>
//   );
// };

// export default AudioPlayer;

// import React from 'react';
// import AudioPlayer from 'react-h5-audio-player';
// import 'react-h5-audio-player/lib/styles.css';

// const CustomAudioPlayer = ({ audioUrl }) => {
//   const audioRef = React.useRef(null);

//   const handleForward = () => {
//     if (audioRef.current) {
//       audioRef.current.audio.current.currentTime += 10; // Forward 10 seconds
//     }
//   };

//   const handleRewind = () => {
//     if (audioRef.current) {
//       audioRef.current.audio.current.currentTime -= 5; // Rewind 5 seconds
//       if (audioRef.current.audio.current.currentTime < 0) {
//         audioRef.current.audio.current.currentTime = 0; // Prevent negative time
//       }
//     }
//   };

//   return (
//     <div className="audio-player">
//       <AudioPlayer
//         ref={audioRef}
//         src={audioUrl}
//         onPlay={e => console.log("onPlay")}
//       />
      
//     </div>
//   );
// };

// export default CustomAudioPlayer;


import React from 'react';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import '../css/audio.css'; // Import your custom CSS

const CustomAudioPlayer = ({ audioUrl }) => {
  const audioRef = React.useRef(null);

  const handleForward = () => {
    if (audioRef.current) {
      audioRef.current.audio.current.currentTime += 10; // Forward 10 seconds
    }
  };

  const handleRewind = () => {
    if (audioRef.current) {
      audioRef.current.audio.current.currentTime -= 5; // Rewind 5 seconds
      if (audioRef.current.audio.current.currentTime < 0) {
        audioRef.current.audio.current.currentTime = 0; // Prevent negative time
      }
    }
  };

  return (
    <div className="audio-player">
      <AudioPlayer
        ref={audioRef}
        src={audioUrl}
        onPlay={e => console.log("onPlay")}
      />
    </div>
  );
};

export default CustomAudioPlayer;
