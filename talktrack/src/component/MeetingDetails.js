// import React from 'react';
// import { useLocation } from 'react-router-dom';

// const MeetingDetails = () => {
//   const location = useLocation();
//   const { meetingDetails } = location.state;

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <h1 className="text-2xl font-bold mb-4">Meeting Details</h1>
//       <div className="mb-4">
//         <strong>Meeting ID:</strong> {meetingDetails.meetingId}
//       </div>
//       <div className="mb-4">
//         <strong>User Email:</strong> {meetingDetails.userEmail}
//       </div>
//       <div className="mb-4">
//         <strong>Video URL:</strong> <a href={meetingDetails.videoS3url} target="_blank" rel="noopener noreferrer">{meetingDetails.videoS3url}</a>
//       </div>
//     </div>
//   );
// };

// export default MeetingDetails;


// import React from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import VideoPlayer from './VideoPlayer';
// const MeetingDetails = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { meetingDetails } = location.state;
//    console.log( meetingDetails)
//    console.log(meetingDetails.meeting.videoS3url)
//    console.log( meetingDetails.videoaccess_url)
//   return (
//     <>
//     <div className="container mx-auto px-4 py-8">
//       <button 
//         className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mb-4"
//         onClick={() => navigate(-1)}
//       >
//         Go Back
//       </button>
//       <h1 className="text-2xl font-bold mb-4">Meeting Details</h1>
//       <div className="mb-4">
//         <strong>Meeting ID:</strong> {meetingDetails.meeting.meetingId}
//       </div>
//       <div className="mb-4">
//         <strong>User Email:</strong> {meetingDetails.meeting.userEmail}
//       </div>
//       <div className="mb-4">
//         <strong>Video URL:</strong> <a href={meetingDetails.meeting.videoS3url} target="_blank" rel="noopener noreferrer">{meetingDetails.videoS3url}</a>
//       </div>
//     </div>
//     {meetingDetails.videoaccess_url && <VideoPlayer videoUrl={meetingDetails.videoaccess_url} />}
//     </>
//   );
// };

// export default MeetingDetails;


// import React from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import VideoPlayer from './VideoPlayer';

// const MeetingDetails = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { meetingDetails } = location.state;

//   console.log(meetingDetails);
//   console.log(meetingDetails.meeting.videoS3url);
//   console.log(meetingDetails.videoaccess_url);

//   return (
//     <>
//       <div className="container mx-auto px-4 py-8">
//         <button 
//           className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mb-4"
//           onClick={() => navigate(-1)}
//         >
//           Go Back
//         </button>
//         <h1 className="text-2xl font-bold mb-4">Meeting Details</h1>
//         <div className="mb-4">
//           <strong>Meeting ID:</strong> {meetingDetails.meeting.meetingId}
//         </div>
//         <div className="mb-4">
//           <strong>User Email:</strong> {meetingDetails.meeting.userEmail}
//         </div>
//         <div className="mb-4">
//           <strong>Transcript:</strong> {meetingDetails.meeting.transcript}
//         </div>
//         <div className="mb-4">
//           <strong>Video URL:</strong> 
//           <a href={meetingDetails.meeting.videoS3url} target="_blank" rel="noopener noreferrer">
//             {meetingDetails.meeting.videoS3url}
//           </a>
//         </div>
//         {/* {meetingDetails.videoaccess_url && (
//           <div className="mb-4">
//             <strong>Presigned Video URL:</strong> 
//             <a href={meetingDetails.videoaccess_url} target="_blank" rel="noopener noreferrer">
//               {meetingDetails.videoaccess_url}
//             </a>
//           </div>
//         )} */}
//       </div>
//       {meetingDetails.videoaccess_url && <VideoPlayer videoUrl={meetingDetails.videoaccess_url} />}
//     </>
//   );
// };

// export default MeetingDetails;


// import React from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import VideoPlayer from './VideoPlayer';

// const MeetingDetails = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { meetingDetails } = location.state;
//   console.log(meetingDetails)
//   return (
//     <div className="container mx-auto px-4 py-8">
//       <button
//         className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mb-4"
//         onClick={() => navigate(-1)}
//       >
//         Go Back
//       </button>
//       {/* <h1 className="text-2xl font-bold mb-4">Meeting Details</h1> */}
//       <div className='flex  justify-center mb-10 pr-4'>
//       <div className="mt-8 pr-4">
//         <strong>Meeting ID:</strong> {meetingDetails.meeting.meetingId}
//       </div>
//       <div className="mt-8">
//         <strong>User Email:</strong> {meetingDetails.meeting.userEmail}
//       </div>
//       </div>
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//         <div>
//           <h2 className="text-xl font-semibold mb-2">Video</h2>
//           {meetingDetails.videoaccess_url && (
//             <VideoPlayer videoUrl={meetingDetails.videoaccess_url} />
//           )}
//         </div>
//         <div>
//           <h2 className="text-xl font-semibold mb-2">Transcription</h2>
//           <div className="bg-gray-100 p-4 rounded shadow-md overflow-y-auto" style={{ maxHeight: '58vh' }}>
//             {meetingDetails.meeting.transcript}
//           </div>
//         </div>
//       </div>
      
//       <div className="mt-4">
//         <strong>Video URL:</strong>
//         <a
//           href={meetingDetails.meeting.videoS3url}
//           target="_blank"
//           rel="noopener noreferrer"
//           className="text-blue-500 underline"
//         >
//           {meetingDetails.meeting.videoS3url}
//         </a>
//       </div>
//     </div>
//   );
// };

// export default MeetingDetails;


// import React,{useState} from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import VideoPlayer from './VideoPlayer';
// import ReactAudioPlayer from 'react-audio-player';
// import { format } from 'date-fns';
// import { FaClock } from 'react-icons/fa';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
// const MeetingDetails = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { meetingDetails } = location.state;
//   console.log(meetingDetails);
//   const [transcriptionType, setTranscriptionType] = useState('original');

//   const handleTranscriptionTypeChange = (type) => {
//     setTranscriptionType(type);
//   };
//   const getTranscription = (type) => {
//     if (type === 'original') {
//       return meetingDetails.meeting.transcript;
//     } else if (type === 'aws') {
//       return meetingDetails.meeting.transcriptionData.results.transcripts[0].transcript;
//     } else if (type === 'speaker'){
//       return renderSpeakerWiseTranscription();
//     }
//     // Add more conditions for other types if needed
//     return '';
//   };
//   const renderSpeakerWiseTranscription = () => {
//     const { speaker_labels } = meetingDetails.meeting.transcriptionData.results;
//     const segments = speaker_labels.segments;
//     const items = meetingDetails.meeting.transcriptionData.results.items;

//     let currentSpeaker = null;
//     let currentParagraph = [];
//     const speakerOrder = [];

//     segments.forEach(segment => {
//       const speaker = segment.speaker_label;
//       const startTime = parseFloat(segment.start_time);
//       const endTime = parseFloat(segment.end_time);

//       const speakerItems = items.filter(item =>
//         parseFloat(item.start_time) >= startTime &&
//         parseFloat(item.end_time) <= endTime &&
//         item.speaker_label === speaker
//       );

//       speakerItems.forEach(item => {
//         if (item.speaker_label !== currentSpeaker) {
//           if (currentParagraph.length > 0) {
//             speakerOrder.push({
//               speaker: currentSpeaker,
//               paragraph: currentParagraph.join(' ')
//             });
//             currentParagraph = [];
//           }
//           currentSpeaker = item.speaker_label;
//         }
//         currentParagraph.push(item.alternatives[0].content);
//       });
//     });

//     // Push the last paragraph
//     if (currentParagraph.length > 0) {
//       speakerOrder.push({
//         speaker: currentSpeaker,
//         paragraph: currentParagraph.join(' ')
//       });
//     }

//     return (
//       <div>
//         {speakerOrder.map(({ speaker, paragraph }, index) => (
//           <div key={index}>
//             <p><strong>Speaker {speaker}:</strong></p>
//             {/* <p><strong>Paragraph {index + 1}:</strong></p> */}
//             <p>{paragraph}</p>
//           </div>
//         ))}
//       </div>
//     );
//   };
//   const TranscriptionDisplay = ({ type }) => {
//     return (
//       <div className="bg-gray-100 p-4 rounded shadow-md overflow-y-auto" style={{ maxHeight: '58vh' }}>
//         {getTranscription(type)}
//       </div>
//     );
//   };

  

//   const renderMeetingDetails = () => {
//     return (
//       <>
//         <div className='flex justify-center mb-10 pr-4'>
//           <div className="mt-8 pr-4">
//             <strong>Meeting ID:</strong> {meetingDetails.meeting.meetingId}
//           </div>
//           <div className="mt-8">
//             <strong>User Email:</strong> {meetingDetails.meeting.userEmail}
//           </div>
//         </div>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//           <div>
//             <h2 className="text-xl font-semibold mb-2">Video</h2>
//             {meetingDetails.videoaccess_url && (
//               <VideoPlayer videoUrl={meetingDetails.videoaccess_url} />
//             )}
//           </div>
//           <div>
//             <h2 className="text-xl font-semibold mb-2">Transcription</h2>
//             <div className="mt-4 mb-4" >
//               {/* <button className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mr-2 rounded ${transcriptionType === 'original' ? 'bg-blue-700' : ''}`} onClick={() => handleTranscriptionTypeChange('original')} >
//                 Whisper Text
//               </button> */}
//               <button className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mr-2 rounded ${transcriptionType === 'aws' ? 'bg-blue-700' : ''}`} onClick={() => handleTranscriptionTypeChange('aws')} >
//                 Text
//               </button>
//               <button className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mr-2 rounded ${transcriptionType === 'speaker' ? 'bg-blue-700' : ''}`} onClick={() => handleTranscriptionTypeChange('speaker')} >
//                 Speaker
//               </button>
//             </div>
//             <TranscriptionDisplay type={transcriptionType} />
//             {/* <div className="bg-gray-100 p-4 rounded shadow-md overflow-y-auto" style={{ maxHeight: '58vh' }}>
//               {meetingDetails.meeting.transcript}
//             </div> */}
//           </div>
//         </div>
//         <div className="mt-4">
//           <h2 className="text-xl font-semibold mb-2">Audio</h2>
//           {meetingDetails.audioaccess_url && (
//             <ReactAudioPlayer
//               src={meetingDetails.audioaccess_url}
//               controls
//             />
//           )}
//         </div>
//         <div className="mt-4">
//           <strong>Video URL:</strong>
//           <a
//             href={meetingDetails.meeting.videoS3url}
//             target="_blank"
//             rel="noopener noreferrer"
//             className="text-blue-500 underline"
//           >
//             {meetingDetails.meeting.videoS3url}
//           </a>
//         </div>
//       </>
//     );
//   };

//   const renderEventDetails = () => {
//     const { event } = meetingDetails;
//     return (
//       <>

//       <strong>
//       <h1 className='text-center font-bold'>This event not happened yet</h1>
//       </strong>

//       <div className='flex flex-col'>
//         <div className='flex flex-row  items-center mt-8'>
//         <div className='mr-8'>
//             <strong>MeetingId:</strong> {event.MeetingId}
//           </div>
          
//           {/* <div className='mr-8'>
//             <strong>Start Time:</strong> {new Date(event.start).toLocaleString()}
//           </div> */}
//           <FontAwesomeIcon icon={faCalendarAlt} className="text-gray-500 mr-1" />
//                       {format(new Date(event.start), 'EEE, MMM do')}
//                       <FaClock className="inline-block ml-2 mr-1" />
//                       {format(new Date(event.start), 'h:mm a')}
//                       <div className='mr-8 ml-4'>
//             <strong>Meeting URL:</strong>
//             <a
//               href={event.url}
//               target="_blank"
//               rel="noopener noreferrer"
//               className="text-blue-500 underline"
//             >
//               {event.url}
//             </a>
//           </div>            
//         </div>
//         <div className='flex flex-row  items-center mt-8'>
          
//           <div className='mr-8'>
//             <strong>Event Summary:</strong> {event.summary}
//           </div>
//           <div className='mr-8'>
//             <strong>Description:</strong> {event.description}
//           </div>
//         </div>
//       </div>




//       </>
//     );
//   };
  
//   return (
//     <div className="container mx-auto px-4 py-8">
//       <button
//         className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mb-4"
//         onClick={() => navigate(-1)}
//       >
//         Go Back
//       </button>
//       {meetingDetails.meeting ? renderMeetingDetails() : renderEventDetails()}
//     </div>
//   );
// };

// export default MeetingDetails;


// import React, { useState, useEffect } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import VideoPlayer from './VideoPlayer';
// import AudioPlayer from './AudioPlayer'; // Import the AudioPlayer component
// import { format } from 'date-fns';
// import { FaClock } from 'react-icons/fa';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faCalendarAlt } from '@fortawesome/free-solid-svg-icons';

// const MeetingDetails = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { meetingDetails } = location.state;
//   console.log(meetingDetails);
//   const [transcriptionType, setTranscriptionType] = useState('original');

//   const handleTranscriptionTypeChange = (type) => {
//     setTranscriptionType(type);
//   };

//   const getTranscription = (type) => {
//     if (type === 'original') {
//       return meetingDetails.meeting.transcript;
//     } else if (type === 'aws') {
//       return meetingDetails.meeting.transcriptionData.results.transcripts[0].transcript;
//     } else if (type === 'speaker'){
//       return renderSpeakerWiseTranscription();
//     }else if (type === 'assemblyspeaker'){
//       return renderSpeakerWiseTranscription();
//     }
//     return '';
//   };

//   const renderSpeakerWiseTranscription = () => {
//     const { speaker_labels } = meetingDetails.meeting.transcriptionData.results;
//     const segments = speaker_labels.segments;
//     const items = meetingDetails.meeting.transcriptionData.results.items;

//     let currentSpeaker = null;
//     let currentParagraph = [];
//     const speakerOrder = [];

//     segments.forEach(segment => {
//       const speaker = segment.speaker_label;
//       const startTime = parseFloat(segment.start_time);
//       const endTime = parseFloat(segment.end_time);

//       const speakerItems = items.filter(item =>
//         parseFloat(item.start_time) >= startTime &&
//         parseFloat(item.end_time) <= endTime &&
//         item.speaker_label === speaker
//       );

//       speakerItems.forEach(item => {
//         if (item.speaker_label !== currentSpeaker) {
//           if (currentParagraph.length > 0) {
//             speakerOrder.push({
//               speaker: currentSpeaker,
//               paragraph: currentParagraph.join(' ')
//             });
//             currentParagraph = [];
//           }
//           currentSpeaker = item.speaker_label;
//         }
//         currentParagraph.push(item.alternatives[0].content);
//       });
//     });

//     if (currentParagraph.length > 0) {
//       speakerOrder.push({
//         speaker: currentSpeaker,
//         paragraph: currentParagraph.join(' ')
//       });
//     }

//     return (
//       <div>
//         {speakerOrder.map(({ speaker, paragraph }, index) => (
//           <div key={index}>
//             <p><strong>Speaker {speaker}:</strong></p>
//             <p>{paragraph}</p>
//           </div>
//         ))}
//       </div>
//     );
//   };

//   const TranscriptionDisplay = ({ type }) => {
//     return (
//       <div className="bg-gray-100 p-4 rounded shadow-md overflow-y-auto" style={{ maxHeight: '58vh' }}>
//         {getTranscription(type)}
//       </div>
//     );
//   };

//   const renderMeetingDetails = () => {
//     return (
//       <>
//         <div className='flex justify-center mb-10 pr-4'>
//           <div className="mt-8 pr-4">
//             <strong>Meeting ID:</strong> {meetingDetails.meeting.meetingId}
//           </div>
//           <div className="mt-8">
//             <strong>User Email:</strong> {meetingDetails.meeting.userEmail}
//           </div>
//         </div>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//           <div>
//             <h2 className="text-xl font-semibold mb-2">Video</h2>
//             {meetingDetails.videoaccess_url && (
//               <VideoPlayer videoUrl={meetingDetails.videoaccess_url} />
//             )}
//           </div>
          
//           <div>
//             <h2 className="text-xl font-semibold mb-2">Transcription</h2>
//             <div className="mt-4 mb-4" >
//               <button className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mr-2 rounded ${transcriptionType === 'original' ? 'bg-blue-700' : ''}`} onClick={() => handleTranscriptionTypeChange('original')} >
//                 Whisper Text
//               </button>
//               <button className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mr-2 rounded ${transcriptionType === 'aws' ? 'bg-blue-700' : ''}`} onClick={() => handleTranscriptionTypeChange('aws')} >
//                 AWS Text
//               </button>
//               <button className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mr-2 rounded ${transcriptionType === 'speaker' ? 'bg-blue-700' : ''}`} onClick={() => handleTranscriptionTypeChange('speaker')} >
//                 Speaker
//               </button>
//               <button className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mr-2 rounded ${transcriptionType === 'assemblyspeaker' ? 'bg-blue-700' : ''}`} onClick={() => handleTranscriptionTypeChange('assemblyspeaker')} >
//                 assemblySpeaker
//               </button>
              
//             </div>
//             <TranscriptionDisplay type={transcriptionType} />
//           </div>
//         </div>
//         <div className="mt-4">
//           <strong>Video URL:</strong>
//           <a
//             href={meetingDetails.meeting.videoS3url}
//             target="_blank"
//             rel="noopener noreferrer"
//             className="text-blue-500 underline"
//           >
//             {meetingDetails.meeting.videoS3url}
//           </a>
//         </div>
//         <div>
//             <h2 className="text-xl font-semibold mb-2">Audio</h2>
//             {meetingDetails.audioaccess_url && (
//               <AudioPlayer audioUrl={meetingDetails.audioaccess_url} />
//             )}
//           </div>
//       </>
//     );
//   };

//   const renderEventDetails = () => {
//     const { event } = meetingDetails;
//     return (
//       <>
//         <strong>
//           <h1 className='text-center font-bold'>This event not happened yet</h1>
//         </strong>
//         <div className='flex flex-col'>
//           <div className='flex flex-row items-center mt-8'>
//             <div className='mr-8'>
//               <strong>MeetingId:</strong> {event.MeetingId}
//             </div>
//             <FontAwesomeIcon icon={faCalendarAlt} className="text-gray-500 mr-1" />
//             {format(new Date(event.start), 'EEE, MMM do')}
//             <FaClock className="inline-block ml-2 mr-1" />
//             {format(new Date(event.start), 'h:mm a')}
//             <div className='mr-8 ml-4'>
//               <strong>Meeting URL:</strong>
//               <a
//                 href={event.url}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="text-blue-500 underline"
//               >
//                 {event.url}
//               </a>
//             </div>
//           </div>
//           <div className='flex flex-row items-center mt-8'>
//             <div className='mr-8'>
//               <strong>Event Summary:</strong> {event.summary}
//             </div>
//             <div className='mr-8'>
//               <strong>Description:</strong> {event.description}
//             </div>
//           </div>
//         </div>
//       </>
//     );
//   };
  
//   return (
//     <div className="container mx-auto px-4 py-8">
//       <button
//         className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mb-4"
//         onClick={() => navigate(-1)}
//       >
//         Go Back
//       </button>
//       {meetingDetails.meeting ? renderMeetingDetails() : renderEventDetails()}
//     </div>
//   );
// };

// export default MeetingDetails;




// import React, { useState, useEffect } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import VideoPlayer from './VideoPlayer';
// import CustomAudioPlayer from './AudioPlayer'; // Import the CustomAudioPlayer component
// import { format } from 'date-fns';
// import { FaClock } from 'react-icons/fa';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faCalendarAlt } from '@fortawesome/free-solid-svg-icons';

// const MeetingDetails = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { meetingDetails } = location.state;
//   console.log(meetingDetails);
//   const [transcriptionType, setTranscriptionType] = useState('assemblyspeaker');

//   const handleTranscriptionTypeChange = (type) => {
//     setTranscriptionType(type);
//   };

//   const getTranscription = (type) => {
//     if (type === 'original') {
//       return meetingDetails.meeting.transcript;
//     } else if (type === 'aws') {
//       return meetingDetails.meeting.transcriptionData.results.transcripts[0].transcript;
//     } else if (type === 'speaker'){
//       return renderSpeakerWiseTranscription();
//     } else if (type === 'assemblyspeaker'){
//       return renderAssemblySpeakerTranscription();
//     }
//     else if (type === 'assemblytext'){
//       return renderAssemblySpeakerTextTranscription();
//     }
//     return '';
//   };

//   const renderSpeakerWiseTranscription = () => {
//     const { speaker_labels } = meetingDetails.meeting.transcriptionData.results;
//     const segments = speaker_labels.segments;
//     const items = meetingDetails.meeting.transcriptionData.results.items;
//     const { orderedSpeaker } = meetingDetails.meeting;

//     const speakerNameMap = {};
//     let index = 0;
//     for (const speakerName in orderedSpeaker) {
//       speakerNameMap[`spk_${index}`] = speakerName;
//       index++;
//     }

//     let currentSpeaker = null;
//     let currentParagraph = [];
//     const speakerOrder = [];

//     segments.forEach(segment => {
//       const speaker = segment.speaker_label;
//       const startTime = parseFloat(segment.start_time);
//       const endTime = parseFloat(segment.end_time);

//       const speakerItems = items.filter(item =>
//         parseFloat(item.start_time) >= startTime &&
//         parseFloat(item.end_time) <= endTime &&
//         item.speaker_label === speaker
//       );

//       speakerItems.forEach(item => {
//         const mappedSpeaker = speakerNameMap[item.speaker_label] || item.speaker_label;
//         if (mappedSpeaker !== currentSpeaker) {
//           if (currentParagraph.length > 0) {
//             speakerOrder.push({
//               speaker: currentSpeaker,
//               paragraph: currentParagraph.join(' ')
//             });
//             currentParagraph = [];
//           }
//           currentSpeaker = mappedSpeaker;
//         }
//         currentParagraph.push(item.alternatives[0].content);
//       });
//     });

//     if (currentParagraph.length > 0) {
//       speakerOrder.push({
//         speaker: currentSpeaker,
//         paragraph: currentParagraph.join(' ')
//       });
//     }

//     return (
//       <div>
//         {speakerOrder.map(({ speaker, paragraph }, index) => (
//           <div key={index}>
//             <p><strong>{speaker}</strong></p>
//             <p>{paragraph}</p>
//           </div>
//         ))}
//       </div>
//     );
//   };
//   const renderAssemblySpeakerTranscription = () => {
//     const { assemblytranscritps, orderedSpeaker } = meetingDetails.meeting;
//     console.log("Assembly Transcript", assemblytranscritps);
//     console.log("Order Speaker", orderedSpeaker);
  
//     const orderedNames = Object.keys(orderedSpeaker);
//     const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"; // You can extend it for more speakers

//     const speakerNameMap = {};
//     for (let i = 0; i < orderedNames.length; i++) {
//       speakerNameMap[alphabet[i]] = orderedNames[i];
//     }

//     return (
//       <div>
//         {assemblytranscritps.map((entry, index) => (
//           <div key={index}>
//             <p><strong>{speakerNameMap[entry.speaker]}</strong></p>
//             <p>{entry.text}</p>
//           </div>
//         ))}
//       </div>
//     );
//   };
  
  
//   const renderAssemblySpeakerTextTranscription = () => {
//     const { assemblytranscritps } = meetingDetails.meeting;
//     const combinedText = assemblytranscritps.map(entry => entry.text).join(' ');
//     console.log(assemblytranscritps)

//     return (
//       <div>
//         {combinedText}
//       </div>
//     );
//   };


//   const TranscriptionDisplay = ({ type }) => {
//     return (
//       <div className="bg-gray-100 p-4 rounded shadow-md overflow-y-auto" style={{ maxHeight: '58vh' }}>
//         {getTranscription(type)}
//       </div>
//     );
//   };

//   const renderMeetingDetails = () => {
//     return (
//       <>
//         <div className='flex justify-center mb-10 pr-4'>
//           <div className="mt-8 pr-4">
//             <strong>Meeting ID:</strong> {meetingDetails.meeting.meetingId}
//           </div>
//           <div className="mt-8">
//             <strong>User Email:</strong> {meetingDetails.meeting.userEmail}
//           </div>
//         </div>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//           <div>
//             <h2 className="text-xl font-semibold mb-2">Video</h2>
//             {meetingDetails.videoaccess_url && (
//               <VideoPlayer videoUrl={meetingDetails.videoaccess_url} />
//             )}
//           </div>
          
//           <div>
//             <h2 className="text-xl font-semibold mb-2">Transcription</h2>
//             <div className="mt-4 mb-4" >
//               {/* <button className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mr-2 rounded ${transcriptionType === 'original' ? 'bg-blue-700' : ''}`} onClick={() => handleTranscriptionTypeChange('original')} >
//                 Whisper
//               </button>
//               <button className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mr-2 rounded ${transcriptionType === 'aws' ? 'bg-blue-700' : ''}`} onClick={() => handleTranscriptionTypeChange('aws')} >
//                 AWS
//               </button>
//               <button className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mr-2 rounded ${transcriptionType === 'speaker' ? 'bg-blue-700' : ''}`} onClick={() => handleTranscriptionTypeChange('speaker')} >
//                 Speaker
//               </button> */}
//               <button className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mr-2 rounded ${transcriptionType === 'assemblyspeaker' ? 'bg-blue-700' : ''}`} onClick={() => handleTranscriptionTypeChange('assemblyspeaker')} >
//                 AssemblySpeaker
//               </button>
//               <button className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mr-2 rounded ${transcriptionType === 'assemblytext' ? 'bg-blue-700' : ''}`} onClick={() => handleTranscriptionTypeChange('assemblytext')} >
//                 Assembly
//               </button>
              
//             </div>
//             <TranscriptionDisplay type={transcriptionType} />
//           </div>
//         </div>
      
//         <div className='mt-10'>
           
//             {meetingDetails.audioaccess_url && (
//               <CustomAudioPlayer audioUrl={meetingDetails.audioaccess_url} />
//             )}
//           </div>
//       </>
//     );
//   };

//   const renderEventDetails = () => {
//     const { event } = meetingDetails;
//     return (
//       <>
//         <strong>
//           <h1 className='text-center font-bold'>This event not happened yet</h1>
//         </strong>
//         <div className='flex flex-col'>
//           <div className='flex flex-row items-center mt-8'>
//             <div className='mr-8'>
//               <strong>MeetingId:</strong> {event.MeetingId}
//             </div>
//             <FontAwesomeIcon icon={faCalendarAlt} className="text-gray-500 mr-1" />
//             {format(new Date(event.start), 'EEE, MMM do')}
//             <FaClock className="inline-block ml-2 mr-1" />
//             {format(new Date(event.start), 'h:mm a')}
//             <div className='mr-8 ml-4'>
//               <strong>Meeting URL:</strong>
//               <a
//                 href={event.url}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="text-blue-500 underline"
//               >
//                 {event.url}
//               </a>
//             </div>
//           </div>
//           <div className='flex flex-row items-center mt-8'>
//             <div className='mr-8'>
//               <strong>Event Summary:</strong> {event.summary}
//             </div>
//             <div className='mr-8'>
//               <strong>Description:</strong> {event.description}
//             </div>
//           </div>
//         </div>
//       </>
//     );
//   };
  
//   return (
//     <div className="container mx-auto px-4 py-8">
//       <button
//         className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mb-4"
//         onClick={() => navigate(-1)}
//       >
//         Go Back
//       </button>
//       {meetingDetails.meeting ? renderMeetingDetails() : renderEventDetails()}
//     </div>
//   );
// };

// export default MeetingDetails;

// import React, { useState } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import VideoPlayer from './VideoPlayer';
// import CustomAudioPlayer from './AudioPlayer'; // Import the CustomAudioPlayer component
// import { format } from 'date-fns';
// import { FaClock } from 'react-icons/fa';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
// import Sidebar from './Sidebar';

// const MeetingDetails = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { meetingDetails } = location.state;
//   console.log(meetingDetails);
//   const [transcriptionType, setTranscriptionType] = useState('assemblyspeaker');

//   const handleTranscriptionTypeChange = (type) => {
//     setTranscriptionType(type);
//   };

//   const getTranscription = (type) => {
//     if (type === 'original') {
//       return meetingDetails.meeting.transcript;
//     } else if (type === 'aws') {
//       return meetingDetails.meeting.transcriptionData.results.transcripts[0].transcript;
//     } else if (type === 'speaker'){
//       return renderSpeakerWiseTranscription();
//     } else if (type === 'assemblyspeaker'){
//       return renderAssemblySpeakerTranscription();
//     }
//     else if (type === 'assemblytext'){
//       return renderAssemblySpeakerTextTranscription();
//     }
//     return '';
//   };

//   const renderSpeakerWiseTranscription = () => {
//     const { speaker_labels } = meetingDetails.meeting.transcriptionData.results;
//     const segments = speaker_labels.segments;
//     const items = meetingDetails.meeting.transcriptionData.results.items;
//     const { orderedSpeaker } = meetingDetails.meeting;

//     const speakerNameMap = {};
//     let index = 0;
//     for (const speakerName in orderedSpeaker) {
//       speakerNameMap[`spk_${index}`] = speakerName;
//       index++;
//     }

//     let currentSpeaker = null;
//     let currentParagraph = [];
//     const speakerOrder = [];

//     segments.forEach(segment => {
//       const speaker = segment.speaker_label;
//       const startTime = parseFloat(segment.start_time);
//       const endTime = parseFloat(segment.end_time);

//       const speakerItems = items.filter(item =>
//         parseFloat(item.start_time) >= startTime &&
//         parseFloat(item.end_time) <= endTime &&
//         item.speaker_label === speaker
//       );

//       speakerItems.forEach(item => {
//         const mappedSpeaker = speakerNameMap[item.speaker_label] || item.speaker_label;
//         if (mappedSpeaker !== currentSpeaker) {
//           if (currentParagraph.length > 0) {
//             speakerOrder.push({
//               speaker: currentSpeaker,
//               paragraph: currentParagraph.join(' ')
//             });
//             currentParagraph = [];
//           }
//           currentSpeaker = mappedSpeaker;
//         }
//         currentParagraph.push(item.alternatives[0].content);
//       });
//     });

//     if (currentParagraph.length > 0) {
//       speakerOrder.push({
//         speaker: currentSpeaker,
//         paragraph: currentParagraph.join(' ')
//       });
//     }

//     return (
//       <div>
//         {speakerOrder.map(({ speaker, paragraph }, index) => (
//           <div key={index}>
//             <p><strong>{speaker}</strong></p>
//             <p>{paragraph}</p>
//           </div>
//         ))}
//       </div>
//     );
//   };
  
//   const renderAssemblySpeakerTranscription = () => {
//     const { assemblytranscritps, orderedSpeaker } = meetingDetails.meeting;
//     console.log("Assembly Transcript", assemblytranscritps);
//     console.log("Order Speaker", orderedSpeaker);
  
//     const orderedNames = Object.keys(orderedSpeaker);
//     const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"; // You can extend it for more speakers

//     const speakerNameMap = {};
//     for (let i = 0; i < orderedNames.length; i++) {
//       speakerNameMap[alphabet[i]] = orderedNames[i];
//     }

//     return (
//       <div>
//         {assemblytranscritps.map((entry, index) => (
//           <div key={index}>
//             <p><strong>{speakerNameMap[entry.speaker]}</strong></p>
//             <p>{entry.text}</p>
//           </div>
//         ))}
//       </div>
//     );
//   };
  
//   const renderAssemblySpeakerTextTranscription = () => {
//     const { assemblytranscritps } = meetingDetails.meeting;
//     const combinedText = assemblytranscritps.map(entry => entry.text).join(' ');
//     console.log(assemblytranscritps)

//     return (
//       <div>
//         {combinedText}
//       </div>
//     );
//   };

//   const TranscriptionDisplay = ({ type }) => {
//     return (
//       <div className="bg-gray-100 p-4 pb-2  overflow-y-auto" style={{ maxHeight: '58vh' }}>

//         {getTranscription(type)}
//       </div>
//     );
//   };

//   const renderMeetingDetails = () => {
//     return (
//       <>
//         <div className='flex justify-center mb-10 pr-4'>
//           <div className="mt-8 pr-4">
//             <strong>Meeting ID:</strong> {meetingDetails.meeting.meetingId}
//           </div>
//           <div className="mt-8">
//             <strong>User Email:</strong> {meetingDetails.meeting.userEmail}
//           </div>
//         </div>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//           <div>
//             <h2 className="text-xl font-semibold mb-2">Video</h2>
//             {meetingDetails.videoaccess_url && (
//               <VideoPlayer videoUrl={meetingDetails.videoaccess_url} />
//             )}
//           </div>
//           <div>
//   <h2 className="text-xl font-semibold mb-2">Transcript</h2>
//   <div className="mt-4 mb-4">
//     <div className="bg-gray-100 border-b-4">
//       <button
//         className={`font-bold py-2 px-4 mr-2 rounded ${
//           transcriptionType === 'assemblyspeaker'
//             ? 'text-blue-700 border-b-4 border-blue-700'
//             : 'text-white-200'
//         }`}
//         onClick={() => handleTranscriptionTypeChange('assemblyspeaker')}
//       >
//        Speaker
//       </button>
//       <button
//         className={`font-bold py-2 px-4 mr-2 rounded ${
//           transcriptionType === 'assemblytext'
//             ? 'text-blue-700 border-b-4 border-blue-700'
//             : 'text-white-200'
//         }`}
//         onClick={() => handleTranscriptionTypeChange('assemblytext')}
//       >
//         Text
//       </button>
//     </div>
//     <TranscriptionDisplay type={transcriptionType} />
//   </div>
// </div>

//         </div>
      
//         <div className='mt-10'>
//           {meetingDetails.audioaccess_url && (
//             <CustomAudioPlayer audioUrl={meetingDetails.audioaccess_url} />
//           )}
//         </div>
//       </>
//     );
//   };

//   const renderEventDetails = () => {
//     const { event } = meetingDetails;
//     return (
//       <>
//         <strong>
//           <h1 className='text-center font-bold'>This event not happened yet</h1>
//         </strong>
//         <div className='flex flex-col'>
//           <div className='flex flex-row items-center mt-8'>
//             <div className='mr-8'>
//               <strong>MeetingId:</strong> {event.MeetingId}
//             </div>
//             <FontAwesomeIcon icon={faCalendarAlt} className="text-gray-500 mr-1" />
//             {format(new Date(event.start), 'EEE, MMM do')}
//             <FaClock className="inline-block ml-2 mr-1" />
//             {format(new Date(event.start), 'h:mm a')}
//             <div className='mr-8 ml-4'>
//               <strong>Meeting URL:</strong>
//               <a
//                 href={event.url}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="text-blue-500 underline"
//               >
//                 {event.url}
//               </a>
//             </div>
//           </div>
//           <div className='flex flex-row items-center mt-8'>
//             <div className='mr-8'>
//               <strong>Event Summary:</strong> {event.summary}
//             </div>
//             <div className='mr-8'>
//               <strong>Description:</strong> {event.description}
//             </div>
//           </div>
//         </div>
//       </>
//     );
//   };

//   return (
//     <div className="container mx-auto ">
//       {meetingDetails.meeting ? renderMeetingDetails() : renderEventDetails()}
//     </div>
//   );
// };

// export default MeetingDetails;



// import React, { useState } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import VideoPlayer from './VideoPlayer';
// import CustomAudioPlayer from './AudioPlayer'; // Import the CustomAudioPlayer component
// import { format } from 'date-fns';
// import { FaClock } from 'react-icons/fa';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
// import Sidebar from './Sidebar';

// const MeetingDetails = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { meetingDetails } = location.state;
//   console.log(meetingDetails);
//   const [transcriptionType, setTranscriptionType] = useState('assemblyspeaker');

//   const handleTranscriptionTypeChange = (type) => {
//     setTranscriptionType(type);
//   };

//   const getTranscription = (type) => {
//     if (type === 'original') {
//       return meetingDetails.meeting.transcript;
//     } else if (type === 'aws') {
//       return meetingDetails.meeting.transcriptionData.results.transcripts[0].transcript;
//     } else if (type === 'speaker') {
//       return renderSpeakerWiseTranscription();
//     } else if (type === 'assemblyspeaker') {
//       return renderAssemblySpeakerTranscription();
//     } else if (type === 'assemblytext') {
//       return renderAssemblySpeakerTextTranscription();
//     }
//     return '';
//   };

//   const renderSpeakerWiseTranscription = () => {
//     const { speaker_labels } = meetingDetails.meeting.transcriptionData.results;
//     const segments = speaker_labels.segments;
//     const items = meetingDetails.meeting.transcriptionData.results.items;
//     const { orderedSpeaker } = meetingDetails.meeting;

//     const speakerNameMap = {};
//     let index = 0;
//     for (const speakerName in orderedSpeaker) {
//       speakerNameMap[`spk_${index}`] = speakerName;
//       index++;
//     }

//     let currentSpeaker = null;
//     let currentParagraph = [];
//     const speakerOrder = [];

//     segments.forEach((segment) => {
//       const speaker = segment.speaker_label;
//       const startTime = parseFloat(segment.start_time);
//       const endTime = parseFloat(segment.end_time);

//       const speakerItems = items.filter(
//         (item) =>
//           parseFloat(item.start_time) >= startTime &&
//           parseFloat(item.end_time) <= endTime &&
//           item.speaker_label === speaker
//       );

//       speakerItems.forEach((item) => {
//         const mappedSpeaker = speakerNameMap[item.speaker_label] || item.speaker_label;
//         if (mappedSpeaker !== currentSpeaker) {
//           if (currentParagraph.length > 0) {
//             speakerOrder.push({
//               speaker: currentSpeaker,
//               paragraph: currentParagraph.join(' '),
//             });
//             currentParagraph = [];
//           }
//           currentSpeaker = mappedSpeaker;
//         }
//         currentParagraph.push(item.alternatives[0].content);
//       });
//     });

//     if (currentParagraph.length > 0) {
//       speakerOrder.push({
//         speaker: currentSpeaker,
//         paragraph: currentParagraph.join(' '),
//       });
//     }

//     return (
//       <div>
//         {speakerOrder.map(({ speaker, paragraph }, index) => (
//           <div key={index}>
//             <p>
//               <strong>{speaker}</strong>
//             </p>
//             <p>{paragraph}</p>
//           </div>
//         ))}
//       </div>
//     );
//   };

//   const renderAssemblySpeakerTranscription = () => {
//     const { assemblytranscritps, orderedSpeaker } = meetingDetails.meeting;
//     console.log('Assembly Transcript', assemblytranscritps);
//     console.log('Order Speaker', orderedSpeaker);

//     const orderedNames = Object.keys(orderedSpeaker);
//     const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'; // You can extend it for more speakers

//     const speakerNameMap = {};
//     for (let i = 0; i < orderedNames.length; i++) {
//       speakerNameMap[alphabet[i]] = orderedNames[i];
//     }

//     return (
//       <div>
//         {assemblytranscritps.map((entry, index) => (
//           <div key={index}>
//             <p>
//             <strong>{speakerNameMap[entry.speaker]}</strong>
//             </p>
//             <p>{entry.text}</p>
//           </div>
//         ))}
//       </div>
//     );
//   };

//   const renderAssemblySpeakerTextTranscription = () => {
//     const { assemblytranscritps } = meetingDetails.meeting;
//     const combinedText = assemblytranscritps.map((entry) => entry.text).join(' ');
//     console.log(assemblytranscritps);

//     return <div>{combinedText}</div>;
//   };

//   const TranscriptionDisplay = ({ type }) => {
//     return (
//       <div className="bg-gray-100 p-4 pb-2 overflow-y-auto" style={{ maxHeight: '58vh' }}>
//         {getTranscription(type)}
//       </div>
//     );
//   };

//   const renderMeetingDetails = () => {
//     return (
//       <>
//         <div className="flex justify-center mb-10 pr-4">
//           <div className="mt-2 pr-4">
//             <strong>Meeting ID:</strong> {meetingDetails.meeting.meetingId}
//           </div>
//           <div className="mt-2">
//             <strong>User Email:</strong> {meetingDetails.meeting.userEmail}
//           </div>
//         </div>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <div>
//             <h2 className="text-xl font-semibold mb-2">Video</h2>
//             {meetingDetails.videoaccess_url && <VideoPlayer videoUrl={meetingDetails.videoaccess_url} />}
//           </div>
//           <div>
//             <h2 className="text-xl font-semibold mb-2">Transcript</h2>
//             <div className="mt-4 mb-4">
//               <div className="bg-gray-100 border-b-4">
//                 <button
//                   className={`font-bold py-2 px-4 mr-2 rounded ${
//                     transcriptionType === 'assemblyspeaker' ? 'text-blue-700 border-b-4 border-blue-700' : 'text-white-200'
//                   }`}
//                   onClick={() => handleTranscriptionTypeChange('assemblyspeaker')}
//                 >
//                   Speaker
//                 </button>
//                 <button
//                   className={`font-bold py-2 px-4 mr-2 rounded ${
//                     transcriptionType === 'assemblytext' ? 'text-blue-700 border-b-4 border-blue-700' : 'text-white-200'
//                   }`}
//                   onClick={() => handleTranscriptionTypeChange('assemblytext')}
//                 >
//                   Text
//                 </button>
//               </div>
//               <TranscriptionDisplay type={transcriptionType} />
//             </div>
//           </div>
//         </div>

//         <div className="mt-2">
//         <h2 className="text-xl font-semibold mb-2">Audio</h2>
//           {meetingDetails.audioaccess_url && <CustomAudioPlayer audioUrl={meetingDetails.audioaccess_url} />}
//         </div>
//       </>
//     );
//   };

//   const renderEventDetails = () => {
//     console.log('i am executed ')
//     const { event } = meetingDetails;
//     console.log(event)
//     return (
//       <>
//         <strong>
//           <h1 className="text-center font-bold">This event not happened yet</h1>
//         </strong>
//         <div className="flex flex-col">
//           <div className="flex flex-row items-center mt-8">
//             <div className="mr-8">
//               <strong>MeetingId:</strong> {event.MeetingId}
//             </div>
//             <FontAwesomeIcon icon={faCalendarAlt} className="text-gray-500 mr-1" />
//             {format(new Date(event.start), 'EEE, MMM do')}
//             <FaClock className="inline-block ml-2 mr-1" />
//             {format(new Date(event.start), 'h:mm a')}
//             <div className="mr-8 ml-4">
//               <strong>Meeting URL:</strong>
//               <a href={event.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
//                 {event.url}
//               </a>
//             </div>
//           </div>
//           <div className="flex flex-row items-center mt-8">
//             <div className="mr-8">
//               <strong>Event Summary:</strong> {event.summary}
//             </div>
//           </div>
//         </div>
//       </>
//     );
//   };

//   return (
//     <div className="flex h-screen">
//       <Sidebar
//         onScheduleMeetingClick={() => navigate('/schedule-meeting')}
//         onShowAllEventsClick={() => navigate('/meetings')}
//         onShowLiveMeeting={() => navigate('/live-meeting')}
//         isLoading={false}
//       />
//       <div className="flex-1 p-6 overflow-y-auto">
//         {meetingDetails.meeting ? renderMeetingDetails() : renderEventDetails()}
//       </div>
//     </div>
//   );
// };

// export default MeetingDetails;


// import React, { useState ,useEffect} from 'react';
// import axios from 'axios';
// import { useLocation, useNavigate } from 'react-router-dom';
// import VideoPlayer from './VideoPlayer';
// import CustomAudioPlayer from './AudioPlayer'; // Import the CustomAudioPlayer component
// import { format } from 'date-fns';
// import { FaClock } from 'react-icons/fa';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
// import Sidebar from './Sidebar';
// import SpeakerModal from './speakereditmodal';

// const MeetingDetails = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   // const { meetingDetails } = location.state;
//   const [transcriptionType, setTranscriptionType] = useState('assemblyspeaker');
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [selectedSpeaker, setSelectedSpeaker] = useState('');
//   const [selectedSpeakerTimestamp, setSelectedSpeakerTimestamp] = useState('');
//   const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });
//   const [isTranscriptsUpdated, setIsTranscriptsUpdated] = useState(false);
//   const [UpdatedMappedTranscript, setUpdatedMappedTranscript] = useState([]);
//   const [meetingDetails, setMeetingDetails] = useState(location.state?.meetingDetails || {});


// useEffect(() => {
//           const { assemblytranscritps, orderedSpeaker, orderSpeakerTimeBasis } = meetingDetails.meeting;
//         console.log("Assembly Transcript", assemblytranscritps);
//         console.log("Ordered Speaker", orderedSpeaker);
//         console.log("Speakers Order Time Basis", orderSpeakerTimeBasis);

//         // Create a mapping of speaker letters to indices
//         const speakerLetters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
//         const speakers = {};

//         // Loop through each dialogue and assign the incrementing value to each speaker
//         assemblytranscritps.transcriptionData.forEach((dialogue) => {
//           if (!(dialogue.speaker in speakers)) {
//             speakers[dialogue.speaker] = speakerLetters[Object.keys(speakers).length];
//           }
//         });

//         console.log("Speakers", speakers);
//         const speakersKeys = Object.keys(speakers);

//         const speakerNameMap = {};
//         let anonymousCount = 1;

//         // Map the orderedSpeaker array names to the speaker letters
//         orderedSpeaker.forEach((name, index) => {
//           if (speakersKeys[index]) {
//             speakerNameMap[speakersKeys[index]] = name;
//           }
//         });

//         // Assign Anonymous labels for any additional speakers not in orderedSpeaker
//         speakersKeys.forEach((letter, index) => {
//           if (!(letter in speakerNameMap)) {
//             speakerNameMap[letter] = `Anonymous ${anonymousCount++}`;
//           }
//         });

//         console.log("Speaker Name Map", speakerNameMap);

//         const formatTime = (milliseconds) => {
//           let totalSeconds = Math.floor(milliseconds / 1000);
//           let hours = Math.floor(totalSeconds / 3600);
//           let minutes = Math.floor((totalSeconds % 3600) / 60);
//           let seconds = totalSeconds % 60;

//           return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
//         };

//         const convertToTimeFormat = (isoString) => {
//           const date = new Date(isoString);
//           const hours = String(date.getUTCHours()).padStart(2, '0');
//           const minutes = String(date.getUTCMinutes()).padStart(2, '0');
//           const seconds = String(date.getUTCSeconds()).padStart(2, '0');
//           return `${hours}:${minutes}:${seconds}`;
//         };

//         let mappedTranscripts;

//         if (orderSpeakerTimeBasis.length > 0) {
//           const minLength = Math.min(assemblytranscritps.transcriptionData.length, orderSpeakerTimeBasis.length);
//           mappedTranscripts = assemblytranscritps.transcriptionData.slice(0, minLength).map((entry, index) => {
//             const timeBasis = orderSpeakerTimeBasis[index];
//             const previousSpeaker = timeBasis.previous;
//             return {
//               ...entry,
//               speakerName: previousSpeaker
//             };
//           });
//         } else {
//           mappedTranscripts = assemblytranscritps.transcriptionData.map((entry, index) => {
//             const speakerIndex = index % orderedSpeaker.length;
//             const speakerName = orderedSpeaker[speakerIndex];
//             return {
//               ...entry,
//               speakerName
//             };
//           });
//         }
//         const speakerDictionary = {};
//         mappedTranscripts.forEach((entry) => {
//           speakerDictionary[entry.speaker] = entry.speakerName;
//         });

//         console.log("Mapped Transcript Speaker", mappedTranscripts);
//         console.log("Speaker Dictionary", speakerDictionary);
//         // console.log("Mapped Transcript Speaker", mappedTranscripts);
//         const initialTranscripts = assemblytranscritps.transcriptionData.map((entry) => {
//                                   return {
//                                     speakerName: speakerNameMap[entry.speaker] || `Anonymous ${anonymousCount++}`,
//                                     speaketime: entry.start,
//                                     text: entry.text
//                                   };
//                         });
//         console.log("Intital mapped",initialTranscripts)
//         setUpdatedMappedTranscript(initialTranscripts)
// }, [meetingDetails.meeting]);

//   const handleOpenModal = (event, speaker, timestamp) => {
//     const rect = event.target.getBoundingClientRect();
//     setModalPosition({ top: rect.bottom + window.scrollY + 40, left: rect.left + window.scrollX });
//     setSelectedSpeaker(speaker);
//     setSelectedSpeakerTimestamp(timestamp);
//     setIsModalOpen(true);
//   };

//   const handleCloseModal = () => {
//     setIsModalOpen(false);
//     setSelectedSpeaker('');
//   };
//   const formatTime = (milliseconds) => {
//     let totalSeconds = Math.floor(milliseconds / 1000);
//     let hours = Math.floor(totalSeconds / 3600);
//     let minutes = Math.floor((totalSeconds % 3600) / 60);
//     let seconds = totalSeconds % 60;

//     return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
//   };

//   useEffect(() => {
//     const sendMappedTranscripts = async () => {
//       try {
//         const response = await axios.post('http://localhost:5001/user/update-mapped-transcript', {
//           meetingId: meetingDetails.meeting.meetingId,
//           UpdatedMappedTranscript: UpdatedMappedTranscript
//         });

//         setMeetingDetails(prevDetails => ({
//           ...prevDetails,
//           meeting: {
//             ...prevDetails.meeting,
//             UpdatedMappedTranscript: UpdatedMappedTranscript
//           }
//         }));
//         console.log('Updated meeting:', response.data);
//       } catch (error) {
//         console.error('Error updating mapped transcript:', error);
//       } finally {
//         setIsTranscriptsUpdated(false);
//       }
//     };

//     if (isTranscriptsUpdated) {
//       sendMappedTranscripts();
//     }
//   }, [isTranscriptsUpdated,UpdatedMappedTranscript]);
//   const handleApplyToCurrentSpeaker = async (speakerName, timestamp) => {
//     const updatedTranscripts = meetingDetails.meeting.mappedTranscript.map(entry => {
//       const entryTime = formatTime(entry.start);

//       if (entryTime === timestamp) {
//         return { ...entry, speakerName };
//       }
//       return entry;
//     });

//     setMeetingDetails(prevDetails => ({
//       ...prevDetails,
//       meeting: {
//         ...prevDetails.meeting,
//         UpdatedMappedTranscript: updatedTranscripts,
//       }
//     }));
//     setIsTranscriptsUpdated(true);
//     setIsModalOpen(false);
//   };

//   const handleApplyToAllSpeaker = async (updatedname, timestamp) => {
//     console.log("i aexcuted form all speakers")
//     console.log(updatedname);
//     console.log(timestamp);
//     const updatedTranscripts = meetingDetails.meeting.mappedTranscript.map(entry => {
//       if (entry.speakerName ===selectedSpeaker) {
//         console.log(selectedSpeaker)
//         console.log(updatedname)
//         return { ...entry, speakerName: updatedname };
//       }
//       return entry;
//     });

//     setMeetingDetails(prevDetails => ({
//       ...prevDetails,
//       meeting: {
//         ...prevDetails.meeting,
//         UpdatedMappedTranscript: updatedTranscripts,
//       }
//     }));
//     setIsTranscriptsUpdated(true);
//     handleCloseModal();
//   };
//   const handleTranscriptionTypeChange = (type) => {
//     setTranscriptionType(type);
//   };

//   const getTranscription = (type) => {
//     if (type === 'original') {
//       return meetingDetails.meeting.transcript;
//     } else if (type === 'aws') {
//       return meetingDetails.meeting.transcriptionData.results.transcripts[0].transcript;
//     } else if (type === 'speaker') {
//       return renderSpeakerWiseTranscription();
//     } else if (type === 'assemblyspeaker') {
//       return renderAssemblySpeakerTranscription();
//     } else if (type === 'assemblytext') {
//       return renderAssemblySpeakerTextTranscription();
//     }
//     return '';
//   };
      
//   const { orderedSpeaker } = meetingDetails.meeting;
//   const convertToTimeFormat = (isoString) => {
//     const date = new Date(isoString);
//     const hours = String(date.getUTCHours()).padStart(2, '0');
//     const minutes = String(date.getUTCMinutes()).padStart(2, '0');
//     const seconds = String(date.getUTCSeconds()).padStart(2, '0');
//     return `${hours}:${minutes}:${seconds}`;
// };

// // Convert each ISO 8601 date string in orderedSpeaker to HH:MM:SS format
// const formattedOrderedSpeaker = {};
// Object.keys(orderedSpeaker).forEach((key) => {
//     formattedOrderedSpeaker[key] = convertToTimeFormat(orderedSpeaker[key]);
// });

// console.log("Formatted Ordered Speaker", formattedOrderedSpeaker);

//   const renderSpeakerWiseTranscription = () => {
//     const { speaker_labels } = meetingDetails.meeting.transcriptionData.results;
//     const segments = speaker_labels.segments;
//     const items = meetingDetails.meeting.transcriptionData.results.items;
//     const { orderedSpeaker } = meetingDetails.meeting;

//       console.log("hey ia m excuted ")
     

//     const speakerNameMap = {};
//     let index = 0;
//     for (const speakerName in orderedSpeaker) {
//       console.log(speakerName)
//       speakerNameMap[`spk_${index}`] = speakerName;
//       index++;
//     }

//     let currentSpeaker = null;
//     let currentParagraph = [];
//     const speakerOrder = [];

//     segments.forEach((segment) => {
//       const speaker = segment.speaker_label;
//       const startTime = parseFloat(segment.start_time);
//       const endTime = parseFloat(segment.end_time);

//       const speakerItems = items.filter(
//         (item) =>
//           parseFloat(item.start_time) >= startTime &&
//           parseFloat(item.end_time) <= endTime &&
//           item.speaker_label === speaker
//       );

//       speakerItems.forEach((item) => {
//         const mappedSpeaker = speakerNameMap[item.speaker_label] || item.speaker_label;
//         if (mappedSpeaker !== currentSpeaker) {
//           if (currentParagraph.length > 0) {
//             speakerOrder.push({
//               speaker: currentSpeaker,
//               paragraph: currentParagraph.join(' '),
//             });
//             currentParagraph = [];
//           }
//           currentSpeaker = mappedSpeaker;
//         }
//         currentParagraph.push(item.alternatives[0].content);
//       });
//     });

//     if (currentParagraph.length > 0) {
//       speakerOrder.push({
//         speaker: currentSpeaker,
//         paragraph: currentParagraph.join(' '),
//       });
//     }

//     return (
//       <div>
//         {speakerOrder.map(({ speaker, paragraph }, index) => (
//           <div key={index}>
//             <p>
//               <strong>{speaker}</strong>
//             </p>
//             <p>{paragraph}</p>
//           </div>
//         ))}
//       </div>
//     );
//   };

// const renderAssemblySpeakerTranscription = () => {

  
//   return (
//           <div>
//       {UpdatedMappedTranscript.map((entry, index) => (
//         <div key={index}>
//           <p>
//             <strong>{entry.speakerName}</strong>
//             <button onClick={(event) => handleOpenModal(event, entry.speakerName, formatTime(entry.speaketime))} className="text-blue-500 underline ml-2">
//               Edit
//             </button>
//             <span> ({formatTime(entry.speaketime)})</span>
//           </p>
//           <p>{entry.text}</p>
//         </div>
//       ))}
//     </div>
//         );
// };



//   const renderAssemblySpeakerTextTranscription = () => {
//     const { assemblytranscritps } = meetingDetails.meeting;
//     // const combinedText = assemblytranscritps.plainTextTranscription.map((entry) => entry.text).join(' ');
//     const combinedText = assemblytranscritps.plainTextTranscription;
//     return <div>{combinedText}</div>;
//   };

//   const TranscriptionDisplay = ({ type }) => {
//     return (
//       <div className="bg-gray-100 p-4  overflow-y-auto max-h-80">
//         {getTranscription(type)}
//       </div>
//     );
//   };

//   const renderMeetingDetails = () => {
//     return (
//       <>
//         <div className="flex justify-center mb-10 pr-4">
//           <div className="mt-2 pr-4">
//             <strong>Meeting ID:</strong> {meetingDetails.meeting.meetingId}
//           </div>
//           <div className="mt-2">
//             <strong>User Email:</strong> {meetingDetails.meeting.userEmail}
//           </div>
//         </div>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <div>
//             <h2 className="text-xl font-semibold mb-2">Video</h2>
//             {meetingDetails.videoaccess_url && <VideoPlayer videoUrl={meetingDetails.videoaccess_url} />}
//           </div>
//           <div>
//             <h2 className="text-xl font-semibold mb-2">Transcript</h2>
//             <div className="mt-4 mb-4">
//               <div className="bg-gray-100 border-b-4">
//                 <button
//                   className={`font-bold py-2 px-4 mr-2 rounded  ${
//                     transcriptionType === 'assemblyspeaker' ? 'text-blue-700 border-b-4 border-blue-700' : 'text-white-200'
//                   }`}
//                   onClick={() => handleTranscriptionTypeChange('assemblyspeaker')}
//                 >
//                   Speaker
//                 </button>
//                 <button
//                   className={`font-bold py-2 px-4 mr-2 rounded ${
//                     transcriptionType === 'assemblytext' ? 'text-blue-700 border-b-4 border-blue-700' : 'text-white-200'
//                   }`}
//                   onClick={() => handleTranscriptionTypeChange('assemblytext')}
//                 >
//                   Text
//                 </button>
//               </div>
//               <TranscriptionDisplay type={transcriptionType} />
//             </div>
//           </div>
//         </div>

//         <div className="mt-21">
//           <h2 className="text-xl font-semibold mb-1">Audio</h2>
//           {meetingDetails.audioaccess_url && <CustomAudioPlayer audioUrl={meetingDetails.audioaccess_url} />}
//         </div>
//       </>
//     );
//   };

//   const renderEventDetails = () => {
//     const { event } = meetingDetails;
//     return (
//       <>
//         <strong>
//           <h1 className="text-center font-bold">This event not happened yet</h1>
//         </strong>
//         <div className="flex flex-col">
//           <div className="flex flex-row items-center mt-8">
//             <div className="mr-8">
//               <strong>MeetingId:</strong> {event.MeetingId}
//             </div>
//             <FontAwesomeIcon icon={faCalendarAlt} className="text-gray-500 mr-1" />
//             {format(new Date(event.start), 'EEE, MMM do')}
//             <FaClock className="inline-block ml-2 mr-1" />
//             {format(new Date(event.start), 'h:mm a')}
//             <div className="mr-8 ml-4">
//               <strong>Meeting URL:</strong>
//               <a href={event.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
//                 {event.url}
//               </a>
//             </div>
//           </div>
//           <div className="flex flex-row items-center mt-8">
//             <div className="mr-8">
//               <strong>Event Summary:</strong> {event.summary}
//             </div>
//           </div>
//         </div>
//       </>
//     );
//   };

//   return (
//     <div className="flex h-screen">
//       <Sidebar
//         onScheduleMeetingClick={() => navigate('/schedule-meeting')}
//         onShowAllEventsClick={() => navigate('/meetings')}
//         onShowLiveMeeting={() => navigate('/live-meeting')}
//         isLoading={false}
//       />
//       <div className="flex-1 p-6 overflow-y-auto">
//         {meetingDetails.meeting ? renderMeetingDetails() : renderEventDetails()}
//       </div>
//       <SpeakerModal
//         isOpen={isModalOpen}
//         onRequestClose={handleCloseModal}
//         speakerName={selectedSpeaker}
//         orderedSpeaker={meetingDetails?.meeting?.orderedSpeaker}
//         position={modalPosition}
//         onApplyToCurrentSpeaker={handleApplyToCurrentSpeaker}
//         onApplyToAllSpeaker={handleApplyToAllSpeaker}
//         timestamp={selectedSpeakerTimestamp}
//       />
//     </div>
//   );
// };

// export default MeetingDetails;


import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import VideoPlayer from './VideoPlayer';
import CustomAudioPlayer from './AudioPlayer';
import { format } from 'date-fns';
import { FaClock } from 'react-icons/fa';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import Sidebar from './Sidebar';
import SpeakerModal from './speakereditmodal';

const MeetingDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [transcriptionType, setTranscriptionType] = useState('assemblyspeaker');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSpeaker, setSelectedSpeaker] = useState('');
  const [selectedSpeakerTimestamp, setSelectedSpeakerTimestamp] = useState('');
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });
  const [isTranscriptsUpdated, setIsTranscriptsUpdated] = useState(false);
  const [UpdatedMappedTranscript, setUpdatedMappedTranscript] = useState([]);
  const [meetingDetails, setMeetingDetails] = useState(location.state?.meetingDetails || {});

  useEffect(() => {
    const { assemblytranscritps, orderedSpeaker, orderSpeakerTimeBasis } = meetingDetails.meeting;
  console.log("Assembly Transcript", assemblytranscritps);
  console.log("Ordered Speaker", orderedSpeaker);
  console.log("Speakers Order Time Basis", orderSpeakerTimeBasis);

  // Create a mapping of speaker letters to indices
  const speakerLetters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
  const speakers = {};

  // Loop through each dialogue and assign the incrementing value to each speaker
  assemblytranscritps.transcriptionData.forEach((dialogue) => {
    if (!(dialogue.speaker in speakers)) {
      speakers[dialogue.speaker] = speakerLetters[Object.keys(speakers).length];
    }
  });

  console.log("Speakers", speakers);
  const speakersKeys = Object.keys(speakers);

  const speakerNameMap = {};
  let anonymousCount = 1;

  // Map the orderedSpeaker array names to the speaker letters
  orderedSpeaker.forEach((name, index) => {
    if (speakersKeys[index]) {
      speakerNameMap[speakersKeys[index]] = name;
    }
  });

  // Assign Anonymous labels for any additional speakers not in orderedSpeaker
  speakersKeys.forEach((letter, index) => {
    if (!(letter in speakerNameMap)) {
      speakerNameMap[letter] = `Anonymous ${anonymousCount++}`;
    }
  });

  console.log("Speaker Name Map", speakerNameMap);

  const formatTime = (milliseconds) => {
    let totalSeconds = Math.floor(milliseconds / 1000);
    let hours = Math.floor(totalSeconds / 3600);
    let minutes = Math.floor((totalSeconds % 3600) / 60);
    let seconds = totalSeconds % 60;

    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  const convertToTimeFormat = (isoString) => {
    const date = new Date(isoString);
    const hours = String(date.getUTCHours()).padStart(2, '0');
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');
    const seconds = String(date.getUTCSeconds()).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  };

  let mappedTranscripts;

  if (orderSpeakerTimeBasis.length > 0) {
    const minLength = Math.min(assemblytranscritps.transcriptionData.length, orderSpeakerTimeBasis.length);
    mappedTranscripts = assemblytranscritps.transcriptionData.slice(0, minLength).map((entry, index) => {
      const timeBasis = orderSpeakerTimeBasis[index];
      const previousSpeaker = timeBasis.previous;
      return {
        ...entry,
        speakerName: previousSpeaker
      };
    });
  } else {
    mappedTranscripts = assemblytranscritps.transcriptionData.map((entry, index) => {
      const speakerIndex = index % orderedSpeaker.length;
      const speakerName = orderedSpeaker[speakerIndex];
      return {
        ...entry,
        speakerName
      };
    });
  }
  const speakerDictionary = {};
  mappedTranscripts.forEach((entry) => {
    speakerDictionary[entry.speaker] = entry.speakerName;
  });

  console.log("Mapped Transcript Speaker", mappedTranscripts);
  console.log("Speaker Dictionary", speakerDictionary);

    const initialTranscripts = assemblytranscritps.transcriptionData.map((entry) => ({
      speakerName: speakerNameMap[entry.speaker] || `Anonymous ${anonymousCount++}`,
      speaketime: entry.start,
      text: entry.text
    }));

    setUpdatedMappedTranscript(initialTranscripts);
  }, [meetingDetails.meeting]);

  const handleOpenModal = (event, speaker, timestamp) => {
    const rect = event.target.getBoundingClientRect();
    setModalPosition({ top: rect.bottom + window.scrollY + 40, left: rect.left + window.scrollX });
    setSelectedSpeaker(speaker);
    setSelectedSpeakerTimestamp(timestamp);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedSpeaker('');
  };

  useEffect(() => {
    const sendMappedTranscripts = async () => {
      try {
        const response = await axios.post('http://localhost:5001/user/update-mapped-transcript', {
          meetingId: meetingDetails.meeting.meetingId,
          UpdatedMappedTranscript
        });

        setMeetingDetails((prevDetails) => ({
          ...prevDetails,
          meeting: {
            ...prevDetails.meeting,
            UpdatedMappedTranscript
          }
        }));
        console.log('Updated meeting:', response.data);
      } catch (error) {
        console.error('Error updating mapped transcript:', error);
      } finally {
        setIsTranscriptsUpdated(false);
      }
    };

    if (isTranscriptsUpdated) {
      sendMappedTranscripts();
    }
  }, [isTranscriptsUpdated, UpdatedMappedTranscript]);

  const handleApplyToCurrentSpeaker = async (speakerName, timestamp) => {
    const updatedTranscripts = UpdatedMappedTranscript.map((entry) => {
      if (formatTime(entry.speaketime) === timestamp) {
        return { ...entry, speakerName };
      }
      return entry;
    });

    setUpdatedMappedTranscript(updatedTranscripts);
    setIsTranscriptsUpdated(true);
    setIsModalOpen(false);
  };

  const handleApplyToAllSpeaker = async (updatedname) => {
    const updatedTranscripts = UpdatedMappedTranscript.map((entry) => {
      if (entry.speakerName === selectedSpeaker) {
        return { ...entry, speakerName: updatedname };
      }
      return entry;
    });

    setUpdatedMappedTranscript(updatedTranscripts);
    setIsTranscriptsUpdated(true);
    handleCloseModal();
  };

  const handleTranscriptionTypeChange = (type) => {
    setTranscriptionType(type);
  };

  const getTranscription = (type) => {
    if (type === 'original') {
      return meetingDetails.meeting.transcript;
    } else if (type === 'aws') {
      return meetingDetails.meeting.transcriptionData.results.transcripts[0].transcript;
    } else if (type === 'speaker') {
      return renderSpeakerWiseTranscription();
    } else if (type === 'assemblyspeaker') {
      return renderAssemblySpeakerTranscription();
    } else if (type === 'assemblytext') {
      return renderAssemblySpeakerTextTranscription();
    }
    return '';
  };

  const formatTime = (milliseconds) => {
    let totalSeconds = Math.floor(milliseconds / 1000);
    let hours = Math.floor(totalSeconds / 3600);
    let minutes = Math.floor((totalSeconds % 3600) / 60);
    let seconds = totalSeconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  const renderSpeakerWiseTranscription = () => {
    const { speaker_labels, items } = meetingDetails.meeting.transcriptionData.results;
    const segments = speaker_labels.segments;
    const { orderedSpeaker } = meetingDetails.meeting;

    const speakerNameMap = {};
    let index = 0;
    for (const speakerName in orderedSpeaker) {
      speakerNameMap[`spk_${index}`] = speakerName;
      index++;
    }

    let currentSpeaker = null;
    let currentParagraph = [];
    const speakerOrder = [];

    segments.forEach((segment) => {
      const speaker = segment.speaker_label;
      const startTime = parseFloat(segment.start_time);
      const endTime = parseFloat(segment.end_time);

      const speakerItems = items.filter(
        (item) =>
          parseFloat(item.start_time) >= startTime &&
          parseFloat(item.end_time) <= endTime &&
          item.speaker_label === speaker
      );

      speakerItems.forEach((item) => {
        const mappedSpeaker = speakerNameMap[item.speaker_label] || item.speaker_label;
        if (mappedSpeaker !== currentSpeaker) {
          if (currentParagraph.length > 0) {
            speakerOrder.push({
              speaker: currentSpeaker,
              paragraph: currentParagraph.join(' '),
            });
            currentParagraph = [];
          }
          currentSpeaker = mappedSpeaker;
        }
        currentParagraph.push(item.alternatives[0].content);
      });
    });

    if (currentParagraph.length > 0) {
      speakerOrder.push({
        speaker: currentSpeaker,
        paragraph: currentParagraph.join(' '),
      });
    }

    return (
      <div>
        {speakerOrder.map(({ speaker, paragraph }, index) => (
          <div key={index}>
            <p>
              <strong>{speaker}</strong>
            </p>
            <p>{paragraph}</p>
          </div>
        ))}
      </div>
    );
  };

  // const renderAssemblySpeakerTranscription = () => {
  //   console.log(UpdatedMappedTranscript)
  //   return (
  //     <div>
  //       {UpdatedMappedTranscript.map((entry, index) => (
  //         <div key={index}>
  //           <p>
  //             <strong>{entry.speakerName}</strong>
  //             <button
  //               onClick={(event) => handleOpenModal(event, entry.speakerName, formatTime(entry.speaketime))}
  //               className="text-blue-500 underline ml-2"
  //             >
  //               Edit
  //             </button>
  //             <span> ({formatTime(entry.speaketime)})</span>
  //           </p>
  //           <p>{entry.text}</p>
  //         </div>
  //       ))}
  //     </div>
  //   );
  // };
  const renderAssemblySpeakerTranscription = () => {
    if (!meetingDetails.meeting.UpdatedMappedTranscript) return null;

    return (
      <div className="transcript-container">
        {meetingDetails.meeting.UpdatedMappedTranscript.length > 0 ? (
          meetingDetails.meeting.UpdatedMappedTranscript.map((entry, index) => (
            <div>
              <p>
                <strong>{entry.speakerName}</strong>
                <button onClick={(event) => handleOpenModal(event, entry.speakerName, formatTime(entry.speaketime))} className="text-blue-500 underline ml-2">
                  Edit
                </button>
                <span> ({formatTime(entry.speaketime)})</span>
              </p>
              <p>{entry.text}</p>
            </div>
          ))
        ) : (
          <p>No transcripts available.</p>
        )}
      </div>
    );
  };
  const renderAssemblySpeakerTextTranscription = () => {
    const { assemblytranscritps } = meetingDetails.meeting;
    const combinedText = assemblytranscritps.plainTextTranscription;
    return <div>{combinedText}</div>;
  };

  const TranscriptionDisplay = ({ type }) => {
    return (
      <div className="bg-gray-100 p-4 overflow-y-auto max-h-80">
        {getTranscription(type)}
      </div>
    );
  };
  const renderMeetingDetails = () => {
        return (
          <>
            <div className="flex justify-center mb-10 pr-4">
              <div className="mt-2 pr-4">
                <strong>Meeting ID:</strong> {meetingDetails.meeting.meetingId}
              </div>
              <div className="mt-2">
                <strong>User Email:</strong> {meetingDetails.meeting.userEmail}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h2 className="text-xl font-semibold mb-2">Video</h2>
                {meetingDetails.videoaccess_url && <VideoPlayer videoUrl={meetingDetails.videoaccess_url} />}
              </div>
              <div>
                <h2 className="text-xl font-semibold mb-2">Transcript</h2>
                <div className="mt-4 mb-4">
                  <div className="bg-gray-100 border-b-4">
                    <button
                      className={`font-bold py-2 px-4 mr-2 rounded  ${
                        transcriptionType === 'assemblyspeaker' ? 'text-blue-700 border-b-4 border-blue-700' : 'text-white-200'
                      }`}
                      onClick={() => handleTranscriptionTypeChange('assemblyspeaker')}
                    >
                      Speaker
                    </button>
                    <button
                      className={`font-bold py-2 px-4 mr-2 rounded ${
                        transcriptionType === 'assemblytext' ? 'text-blue-700 border-b-4 border-blue-700' : 'text-white-200'
                      }`}
                      onClick={() => handleTranscriptionTypeChange('assemblytext')}
                    >
                      Text
                    </button>
                  </div>
                  <TranscriptionDisplay type={transcriptionType} />
                </div>
              </div>
            </div>
    
            <div className="mt-21">
              <h2 className="text-xl font-semibold mb-1">Audio</h2>
              {meetingDetails.audioaccess_url && <CustomAudioPlayer audioUrl={meetingDetails.audioaccess_url} />}
            </div>
          </>
        );
      };
    
      const renderEventDetails = () => {
        const { event } = meetingDetails;
        return (
          <>
            <strong>
              <h1 className="text-center font-bold">This event not happened yet</h1>
            </strong>
            <div className="flex flex-col">
              <div className="flex flex-row items-center mt-8">
                <div className="mr-8">
                  <strong>MeetingId:</strong> {event.MeetingId}
                </div>
                <FontAwesomeIcon icon={faCalendarAlt} className="text-gray-500 mr-1" />
                {format(new Date(event.start), 'EEE, MMM do')}
                <FaClock className="inline-block ml-2 mr-1" />
                {format(new Date(event.start), 'h:mm a')}
                <div className="mr-8 ml-4">
                  <strong>Meeting URL:</strong>
                  <a href={event.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                    {event.url}
                  </a>
                </div>
              </div>
              <div className="flex flex-row items-center mt-8">
                <div className="mr-8">
                  <strong>Event Summary:</strong> {event.summary}
                </div>
              </div>
            </div>
          </>
        );
      };
    

  return (
    <div className="flex h-screen">
        <Sidebar
        onScheduleMeetingClick={() => navigate('/schedule-meeting')}
        onShowAllEventsClick={() => navigate('/meetings')}
        onShowLiveMeeting={() => navigate('/live-meeting')}
        isLoading={false}
      />
      <div className="flex-1 p-6 overflow-y-auto">
        {meetingDetails.meeting ? renderMeetingDetails() : renderEventDetails()}
      </div>
      <SpeakerModal
        isOpen={isModalOpen}
        onRequestClose={handleCloseModal}
        speakerName={selectedSpeaker}
        orderedSpeaker={meetingDetails?.meeting?.orderedSpeaker}
        position={modalPosition}
        onApplyToCurrentSpeaker={handleApplyToCurrentSpeaker}
        onApplyToAllSpeaker={handleApplyToAllSpeaker}
        timestamp={selectedSpeakerTimestamp}
      />
    </div>
  );
};

export default MeetingDetails;
