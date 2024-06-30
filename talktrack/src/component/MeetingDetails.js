
// import React, { useState, useEffect,useRef } from 'react';
// import axios from 'axios';
// import { useLocation, useNavigate } from 'react-router-dom';
// import VideoPlayer from './VideoPlayer';
// import CustomAudioPlayer from './AudioPlayer';
// import { format } from 'date-fns';
// import { FaClock } from 'react-icons/fa';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
// import Sidebar from './Sidebar';
// import SpeakerModal from './speakereditmodal';
// import Loader from './Loader';
// const MeetingDetails = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const [loading,setLoading]=useState(true)
//   const [transcriptionType, setTranscriptionType] = useState('assemblyspeaker');
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [selectedSpeaker, setSelectedSpeaker] = useState('');
//   const [selectedSpeakerTimestamp, setSelectedSpeakerTimestamp] = useState('');
//   const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });
//   const [isTranscriptsUpdated, setIsTranscriptsUpdated] = useState(false);
//   const [UpdatedMappedTranscript, setUpdatedMappedTranscript] = useState([]);
//   const [meetingDetails, setMeetingDetails] = useState(location.state?.meetingDetails || {});
//   const audioPlayerRef = useRef(null);
//   const [highlightedTranscript, setHighlightedTranscript] = useState(null);
//   const transcriptRefs = useRef([]);
//   useEffect(() => {
//     const fetchData = async () => {
//       console.log("fetch data is executed ")
//       try {
//         const { meetingId, userEmail } = location.state;
//         const response = await axios.post('http:///user/meetingdetails', { meetingId, userEmail });
//         setMeetingDetails(response.data);
//       } catch (error) {
//         console.log("Error:", error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     if (!location.state?.meetingDetails) {
//       fetchData();
//     } else {
//       setLoading(false);
//     }
//   }, []);


//   useEffect(() => {
//     const sendMappedTranscripts = async () => {
//       try {
//         console.log(UpdatedMappedTranscript)
//         const response = await axios.post('http:///user/update-mapped-transcript', {
//           meetingId: meetingDetails.meeting.meetingId,
//           UpdatedMappedTranscript
//         });

//         setMeetingDetails((prevDetails) => ({
//           ...prevDetails,
//           meeting: {
//             ...prevDetails.meeting,
//             MappedTranscript:response.data.MappedTranscript
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
//   }, [isTranscriptsUpdated]);
  
//   const handleOpenModal = (event, speaker, speakerslectedtime) => {
//     const rect = event.target.getBoundingClientRect();
//     setModalPosition({ top: rect.bottom + window.scrollY + 40, left: rect.left + window.scrollX });
//     setSelectedSpeaker(speaker);
//     setSelectedSpeakerTimestamp(speakerslectedtime);
//     setIsModalOpen(true);
//   };

//   const handleCloseModal = () => {
//     setIsModalOpen(false);
//     setSelectedSpeaker('');
//   };
//   const handleApplyToCurrentSpeaker = async (speakerName) => {
//     const updatedTranscripts = meetingDetails.meeting.MappedTranscript.map((entry) => {
//       if (entry.start === selectedSpeakerTimestamp) {
//         return { ...entry, speakerName:speakerName};
//       }
//       return entry;
//     });

//     setUpdatedMappedTranscript(updatedTranscripts);
//     setIsTranscriptsUpdated(true);
//     setIsModalOpen(false);
//   };

//   const handleApplyToAllSpeaker = async (updatedname) => {
//     const updatedTranscripts = meetingDetails.meeting.MappedTranscript.map((entry) => {
//       if (entry.speakerName === selectedSpeaker) {
//         return { ...entry, speakerName: updatedname };
//       }
//       return entry;
//     });

//     setUpdatedMappedTranscript(updatedTranscripts);
//     setIsTranscriptsUpdated(true);
//     handleCloseModal();
//   };

//   const handleTranscriptionTypeChange = (type) => {
//     setTranscriptionType(type);
//   };

//   const getTranscription = (type) => {
//     if (type === 'assemblyspeaker') {
//       return renderAssemblySpeakerTranscription();
//     } else if (type === 'assemblytext') {
//       return renderAssemblySpeakerTextTranscription();
//     }
//     return '';
//   };

//   const formatTime = (milliseconds) => {
//     let totalSeconds = Math.floor(milliseconds / 1000);
//     let hours = Math.floor(totalSeconds / 3600);
//     let minutes = Math.floor((totalSeconds % 3600) / 60);
//     let seconds = totalSeconds % 60;
//     return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
//   };



//   useEffect(() => {
//     if (highlightedTranscript !== null && transcriptRefs.current[highlightedTranscript]) {
//       transcriptRefs.current[highlightedTranscript].scrollIntoView({ behavior: 'smooth', block: 'center' });
//     }
//   }, [highlightedTranscript]);

//   const handleTranscriptClick = (timestamp) => {
//     console.log("I am executed from transcript click",timestamp);
//     const timeParts = timestamp.split(':').map(part => parseInt(part, 10));
//     const timeInSeconds = (timeParts[0] * 3600) + (timeParts[1] * 60) + timeParts[2];

//     if (audioPlayerRef.current && audioPlayerRef.current.audio) {
//       const audioElement = audioPlayerRef.current.audio;
//       if (audioElement) {
//         audioElement.currentTime = timeInSeconds;
//         audioElement.play();
//       }
//     }
//   };
//   const renderAssemblySpeakerTranscription = () => {
//     if (!meetingDetails.meeting.MappedTranscript) return null;

//     return (
//       <div className="transcript-container">
//         {meetingDetails.meeting.MappedTranscript.length > 0 ? (
//           meetingDetails.meeting.MappedTranscript.map((entry, index) => (
//             <div>
//               <p>
//                 <strong>{entry.speakerName}</strong>
//                 <button onClick={(event) => handleOpenModal(event, entry.speakerName, entry.start)} className='text-slate-400 pl-2 text-2xl'>
//                 {'\u2304'}
//                 </button>
//                 {/* <span> ({formatTime(entry.start)})</span> */}
//                 <span

//                 key={index}
//                 ref={(el) => transcriptRefs.current[formatTime(entry.start)] = el}
//                 className={`cursor-pointer ${highlightedTranscript === formatTime(entry.start) ? 'bg-yellow-200' : ''}`}
//                 onClick={() => handleTranscriptClick(formatTime(entry.start))}

//                 > 
//                 ({formatTime(entry.start)})</span>
//               </p>
//               <p>{entry.text}</p>
//             </div>
//           ))
//         ) : (
//           <p>No transcripts available.</p>
//         )}
//       </div>
//     );
//   };
//   const renderAssemblySpeakerTextTranscription = () => {
//     const { assemblytranscritps } = meetingDetails.meeting;
//     const combinedText = assemblytranscritps.plainTextTranscription;
//     return <div>{combinedText}</div>;
//   };

//   const TranscriptionDisplay = ({ type }) => {
//     return (
//       <div className="bg-gray-100 p-4 overflow-y-auto max-h-80">
//         {getTranscription(type)}
//       </div>
//     );
//   };
//   const renderMeetingDetails = () => {
//     console.log(meetingDetails)
//         return (
//           <>
//             <div className="flex justify-center mb-10 pr-4">
//               <div className="mt-2 pr-4">
//                 <strong>Meeting ID:</strong> {meetingDetails.meeting.meetingId}
//               </div>
//               <div className="mt-2">
//                 <strong>User Email:</strong> {meetingDetails.meeting.userEmail}
//               </div>
//             </div>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div>
//                 <h2 className="text-xl font-semibold mb-2">Video</h2>
//                 {meetingDetails.videoaccess_url && <VideoPlayer videoUrl={meetingDetails.videoaccess_url} />}
//               </div>
//               <div>
//                 <h2 className="text-xl font-semibold mb-2">Transcript</h2>
//                 <div className="mt-4 mb-4">
//                   <div className="bg-gray-100 border-b-4">
//                     <button
//                       className={`font-bold py-2 px-4 mr-2 rounded  ${
//                         transcriptionType === 'assemblyspeaker' ? 'text-blue-700 border-b-4 border-blue-700' : 'text-white-200'
//                       }`}
//                       onClick={() => handleTranscriptionTypeChange('assemblyspeaker')}
//                     >
//                       Speaker
//                     </button>
//                     <button
//                       className={`font-bold py-2 px-4 mr-2 rounded ${
//                         transcriptionType === 'assemblytext' ? 'text-blue-700 border-b-4 border-blue-700' : 'text-white-200'
//                       }`}
//                       onClick={() => handleTranscriptionTypeChange('assemblytext')}
//                     >
//                       Text
//                     </button>
//                   </div>
//                   <TranscriptionDisplay type={transcriptionType} />
//                 </div>
//               </div>
//             </div>
    
//             <div className="mt-21">
//               <h2 className="text-xl font-semibold mb-1">Audio</h2>
//               {meetingDetails.audioaccess_url && <CustomAudioPlayer audioUrl={meetingDetails.audioaccess_url} />}
//             </div>
//           </>
//         );
//       };
    
//       const renderEventDetails = () => {
//         const { event } = meetingDetails;
//         return (
//           <>
//             <strong>
//               <h1 className="text-center font-bold">This event not happened yet</h1>
//             </strong>
//             <div className="flex flex-col">
//               <div className="flex flex-row items-center mt-8">
//                 <div className="mr-8">
//                   <strong>MeetingId:</strong> {event.MeetingId}
//                 </div>
//                 <FontAwesomeIcon icon={faCalendarAlt} className="text-gray-500 mr-1" />
//                 {format(new Date(event.start), 'EEE, MMM do')}
//                 <FaClock className="inline-block ml-2 mr-1" />
//                 {format(new Date(event.start), 'h:mm a')}
//                 <div className="mr-8 ml-4">
//                   <strong>Meeting URL:</strong>
//                   <a href={event.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
//                     {event.url}
//                   </a>
//                 </div>
//               </div>
//               <div className="flex flex-row items-center mt-8">
//                 <div className="mr-8">
//                   <strong>Event Summary:</strong> {event.summary}
//                 </div>
//               </div>
//             </div>
//           </>
//         );
//       };
    

//   return (
//     <div className="flex h-screen">
//         <Sidebar
//         onScheduleMeetingClick={() => navigate('/schedule-meeting')}
//         onShowAllEventsClick={() => navigate('/meetings')}
//         onShowLiveMeeting={() => navigate('/live-meeting')}
//         isLoading={false}
//       />
//      <div className="flex-1 p-6 overflow-y-auto">
//         {loading ? (
//           <Loader />
//         ) : (
//           meetingDetails.meeting ? renderMeetingDetails() : renderEventDetails()
//         )}
//       </div>

//       {loading ? (
//           <div></div>
//         ) : (
//           <SpeakerModal
//         isOpen={isModalOpen}
//         onRequestClose={handleCloseModal}
//         speakerName={selectedSpeaker}
//         orderedSpeaker={meetingDetails.meeting.orderedSpeaker}
//         position={modalPosition}
//         onApplyToCurrentSpeaker={handleApplyToCurrentSpeaker}
//         onApplyToAllSpeaker={handleApplyToAllSpeaker}
//         timestamp={selectedSpeakerTimestamp}
//       />
//         )}
//     </div>
//   );
// };

// export default MeetingDetails;

// import React, { useState, useEffect, useRef } from 'react';
// import axios from 'axios';
// import { useLocation, useNavigate } from 'react-router-dom';
// import VideoPlayer from './VideoPlayer';
// import CustomAudioPlayer from './AudioPlayer';
// import { format } from 'date-fns';
// import { FaClock } from 'react-icons/fa';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
// import Sidebar from './Sidebar';
// import SpeakerModal from './speakereditmodal';
// import Loader from './Loader';

// const MeetingDetails = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(true);
//   const [transcriptionType, setTranscriptionType] = useState('assemblyspeaker');
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [selectedSpeaker, setSelectedSpeaker] = useState('');
//   const [selectedSpeakerTimestamp, setSelectedSpeakerTimestamp] = useState('');
//   const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });
//   const [isTranscriptsUpdated, setIsTranscriptsUpdated] = useState(false);
//   const [UpdatedMappedTranscript, setUpdatedMappedTranscript] = useState([]);
//   const [meetingDetails, setMeetingDetails] = useState(location.state?.meetingDetails || {});
//   const audioPlayerRef = useRef(null);
//   const [highlightedTranscript, setHighlightedTranscript] = useState(null);
//   const transcriptRefs = useRef([]);

//   useEffect(() => {
//     const fetchData = async () => {
//       console.log("fetch data is executed");
//       try {
//         const { meetingId, userEmail } = location.state;
//         const response = await axios.post('http:///user/meetingdetails', { meetingId, userEmail });
//         setMeetingDetails(response.data);
//       } catch (error) {
//         console.log("Error:", error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     if (!location.state?.meetingDetails) {
//       fetchData();
//     } else {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     const sendMappedTranscripts = async () => {
//       try {
//         console.log(UpdatedMappedTranscript);
//         const response = await axios.post('http:///user/update-mapped-transcript', {
//           meetingId: meetingDetails.meeting.meetingId,
//           UpdatedMappedTranscript,
//         });

//         setMeetingDetails((prevDetails) => ({
//           ...prevDetails,
//           meeting: {
//             ...prevDetails.meeting,
//             MappedTranscript: response.data.MappedTranscript,
//           },
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
//   }, [isTranscriptsUpdated]);

//   const handleOpenModal = (event, speaker, speakerslectedtime) => {
//     const rect = event.target.getBoundingClientRect();
//     setModalPosition({ top: rect.bottom + window.scrollY + 40, left: rect.left + window.scrollX });
//     setSelectedSpeaker(speaker);
//     setSelectedSpeakerTimestamp(speakerslectedtime);
//     setIsModalOpen(true);
//   };

//   const handleCloseModal = () => {
//     setIsModalOpen(false);
//     setSelectedSpeaker('');
//   };

//   const handleApplyToCurrentSpeaker = async (speakerName) => {
//     const updatedTranscripts = meetingDetails.meeting.MappedTranscript.map((entry) => {
//       if (entry.start === selectedSpeakerTimestamp) {
//         return { ...entry, speakerName: speakerName };
//       }
//       return entry;
//     });

//     setUpdatedMappedTranscript(updatedTranscripts);
//     setIsTranscriptsUpdated(true);
//     setIsModalOpen(false);
//   };

//   const handleApplyToAllSpeaker = async (updatedname) => {
//     const updatedTranscripts = meetingDetails.meeting.MappedTranscript.map((entry) => {
//       if (entry.speakerName === selectedSpeaker) {
//         return { ...entry, speakerName: updatedname };
//       }
//       return entry;
//     });

//     setUpdatedMappedTranscript(updatedTranscripts);
//     setIsTranscriptsUpdated(true);
//     handleCloseModal();
//   };

//   const handleTranscriptionTypeChange = (type) => {
//     setTranscriptionType(type);
//   };

//   const getTranscription = (type) => {
//     if (type === 'assemblyspeaker') {
//       return renderAssemblySpeakerTranscription();
//     } else if (type === 'assemblytext') {
//       return renderAssemblySpeakerTextTranscription();
//     }
//     return '';
//   };

//   const formatTime = (milliseconds) => {
//     let totalSeconds = Math.floor(milliseconds / 1000);
//     let hours = Math.floor(totalSeconds / 3600);
//     let minutes = Math.floor((totalSeconds % 3600) / 60);
//     let seconds = totalSeconds % 60;
//     return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
//   };

//   useEffect(() => {
//     if (highlightedTranscript !== null && transcriptRefs.current[highlightedTranscript]) {
//       transcriptRefs.current[highlightedTranscript].scrollIntoView({ behavior: 'smooth', block: 'center' });
//     }
//   }, [highlightedTranscript]);

//   const handleTranscriptClick = (timestamp) => {
//     console.log("Clicked transcript timestamp:", timestamp);
//     const timeParts = timestamp.split(':').map(part => parseInt(part, 10));
//     const timeInSeconds = (timeParts[0] * 3600) + (timeParts[1] * 60) + timeParts[2];

//     if (audioPlayerRef.current && audioPlayerRef.current.audio) {
//       const audioElement = audioPlayerRef.current.audio;
//       if (audioElement) {
//         console.log("Setting audio time to:", timeInSeconds);
//         audioElement.currentTime = timeInSeconds;
//         audioElement.play();
//       } else {
//         console.log("Audio element not found.");
//       }
//     } else {
//       console.log("Audio player ref or audio not available.");
//     }
//   };
//   const handleTimeUpdate = (currentTime) => {
//     if (meetingDetails.meeting && meetingDetails.meeting.MappedTranscript) {
//       const currentTranscript = meetingDetails.meeting.MappedTranscript.find((entry) => {
//         const entryTime = entry.start / 1000;
//         return currentTime >= entryTime && currentTime < entryTime + 5;
//       });

//       if (currentTranscript) {
//         setHighlightedTranscript(currentTranscript.start);
//       }
//     }
//   };
//   const renderAssemblySpeakerTranscription = () => {
//     if (!meetingDetails.meeting.MappedTranscript) return null;

//     return (
//       <div className="transcript-container">
//         {meetingDetails.meeting.MappedTranscript.length > 0 ? (
//           meetingDetails.meeting.MappedTranscript.map((entry, index) => (
//             <div key={index}>
//               <p>
//                 <strong>{entry.speakerName}</strong>
//                 <button onClick={(event) => handleOpenModal(event, entry.speakerName, entry.start)} className='text-slate-400 pl-2 text-2xl'>
//                   {'\u2304'}
//                 </button>
//                 <span
//                   key={index}
//                   ref={(el) => transcriptRefs.current[formatTime(entry.start)] = el}
//                   className={`cursor-pointer ${highlightedTranscript === formatTime(entry.start) ? 'bg-yellow-200' : ''}`}
//                   onClick={() => handleTranscriptClick(formatTime(entry.start))}
//                 >
//                   ({formatTime(entry.start)})
//                 </span>
//               </p>
//               <p>{entry.text}</p>
//             </div>
//           ))
//         ) : (
//           <p>No transcripts available.</p>
//         )}
//       </div>
//     );
//   };

//   const renderAssemblySpeakerTextTranscription = () => {
//     const { assemblytranscritps } = meetingDetails.meeting;
//     const combinedText = assemblytranscritps.plainTextTranscription;
//     return <div>{combinedText}</div>;
//   };

//   const TranscriptionDisplay = ({ type }) => {
//     return (
//       <div className="bg-gray-100 p-4 overflow-y-auto max-h-80">
//         {getTranscription(type)}
//       </div>
//     );
//   };

//   const renderMeetingDetails = () => {
//     console.log(meetingDetails);
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
//           {meetingDetails.audioaccess_url && <CustomAudioPlayer ref={audioPlayerRef} audioUrl={meetingDetails.audioaccess_url} onTimeUpdate={handleTimeUpdate}  />}
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
//         {loading ? (
//           <Loader />
//         ) : (
//           meetingDetails.meeting ? renderMeetingDetails() : renderEventDetails()
//         )}
//       </div>

//       {loading ? (
//         <div></div>
//       ) : (
//         <SpeakerModal
//           isOpen={isModalOpen}
//           onRequestClose={handleCloseModal}
//           speakerName={selectedSpeaker}
//           orderedSpeaker={meetingDetails.meeting.orderedSpeaker}
//           position={modalPosition}
//           onApplyToCurrentSpeaker={handleApplyToCurrentSpeaker}
//           onApplyToAllSpeaker={handleApplyToAllSpeaker}
//           timestamp={selectedSpeakerTimestamp}
//         />
//       )}
//     </div>
//   );
// };

// export default MeetingDetails;


import React, { useState, useEffect, useRef } from 'react';
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
import Loader from './Loader';

const MeetingDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [transcriptionType, setTranscriptionType] = useState('assemblyspeaker');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSpeaker, setSelectedSpeaker] = useState('');
  const [selectedSpeakerTimestamp, setSelectedSpeakerTimestamp] = useState('');
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });
  const [isTranscriptsUpdated, setIsTranscriptsUpdated] = useState(false);
  const [UpdatedMappedTranscript, setUpdatedMappedTranscript] = useState([]);
  const [meetingDetails, setMeetingDetails] = useState(location.state?.meetingDetails || {});
  const audioPlayerRef = useRef(null);
  const [highlightedTranscript, setHighlightedTranscript] = useState(null);
  const transcriptRefs = useRef([]);

  useEffect(() => {
    const fetchData = async () => {
      console.log("fetch data is executed");
      try {
        const { meetingId, userEmail } = location.state;
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/user/meetingdetails`, { meetingId, userEmail });
        setMeetingDetails(response.data);
      } catch (error) {
        console.log("Error:", error);
      } finally {
        setLoading(false);
      }
    };
    if (!location.state?.meetingDetails) {
      fetchData();
    } else {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const sendMappedTranscripts = async () => {
      try {
        console.log(UpdatedMappedTranscript);
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/user/update-mapped-transcript`, {
          meetingId: meetingDetails.meeting.meetingId,
          UpdatedMappedTranscript,
        });

        setMeetingDetails((prevDetails) => ({
          ...prevDetails,
          meeting: {
            ...prevDetails.meeting,
            MappedTranscript: response.data.MappedTranscript,
          },
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
  }, [isTranscriptsUpdated]);

  const handleOpenModal = (event, speaker, speakerslectedtime) => {
    const rect = event.target.getBoundingClientRect();
    setModalPosition({ top: rect.bottom + window.scrollY + 40, left: rect.left + window.scrollX });
    setSelectedSpeaker(speaker);
    setSelectedSpeakerTimestamp(speakerslectedtime);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedSpeaker('');
  };

  const handleApplyToCurrentSpeaker = async (speakerName) => {
    const updatedTranscripts = meetingDetails.meeting.MappedTranscript.map((entry) => {
      if (entry.start === selectedSpeakerTimestamp) {
        return { ...entry, speakerName: speakerName };
      }
      return entry;
    });

    setUpdatedMappedTranscript(updatedTranscripts);
    setIsTranscriptsUpdated(true);
    setIsModalOpen(false);
  };

  const handleApplyToAllSpeaker = async (updatedname) => {
    const updatedTranscripts = meetingDetails.meeting.MappedTranscript.map((entry) => {
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
    if (type === 'assemblyspeaker') {
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

  useEffect(() => {
    if (highlightedTranscript !== null && transcriptRefs.current[highlightedTranscript]) {
      transcriptRefs.current[highlightedTranscript].scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [highlightedTranscript]);

  // const handleTranscriptClick = (timestamp) => {
  //   console.log("Clicked transcript timestamp:", timestamp);
  //   const timeParts = timestamp.split(':').map(part => parseInt(part, 10));
  //   const timeInSeconds = (timeParts[0] * 3600) + (timeParts[1] * 60) + timeParts[2];

  //   if (audioPlayerRef.current && audioPlayerRef.current.audio) {
  //     const audioElement = audioPlayerRef.current.audio;
  //     if (audioElement) {
  //       console.log("Setting audio time to:", timeInSeconds);
  //       audioElement.currentTime = timeInSeconds;
  //       audioElement.play();
  //     } else {
  //       console.log("Audio element not found.");
  //     }
  //   } else {
  //     console.log("Audio player ref or audio not available.");
  //   }
  // };
  const handleTranscriptClick = (timestamp) => {
    console.log("Clicked transcript timestamp:", timestamp);
    const timeParts = timestamp.split(':').map(part => parseInt(part, 10));
    const timeInSeconds = (timeParts[0] * 3600) + (timeParts[1] * 60) + timeParts[2];
  
    if (audioPlayerRef.current && audioPlayerRef.current.audio) {
      const audioElement = audioPlayerRef.current.audio;
      if (audioElement) {
        console.log("Setting audio time to:", timeInSeconds);
        audioElement.currentTime = timeInSeconds;
        audioElement.play();
        // Update the highlighted transcript state
        setHighlightedTranscript(timestamp);
      } else {
        console.log("Audio element not found.");
      }
    } else {
      console.log("Audio player ref or audio not available.");
    }
  };
  
  const handleTimeUpdate = (currentTime) => {
    if (meetingDetails.meeting && meetingDetails.meeting.MappedTranscript) {
      const currentTranscript = meetingDetails.meeting.MappedTranscript.find((entry) => {
        const entryTime = entry.start / 1000;
        return currentTime >= entryTime && currentTime < entryTime + 5;
      });

      if (currentTranscript) {
        setHighlightedTranscript(currentTranscript.start);
      }
    }
  };
  // const renderAssemblySpeakerTranscription = () => {
  //   if (!meetingDetails.meeting.MappedTranscript) return null;
  
  //   return (
  //     <div className="transcript-container">
  //       {meetingDetails.meeting.MappedTranscript.length > 0 ? (
  //         meetingDetails.meeting.MappedTranscript.map((entry, index) => (
  //           <div
  //             key={index}
  //             ref={(el) => (transcriptRefs.current[entry.start] = el)}
  //             className={`cursor-pointer ${highlightedTranscript === entry.start ? 'bg-yellow-200' : ''}`}
  //             onClick={() => handleTranscriptClick(formatTime(entry.start))}
  //           >
  //             <p>
  //               <strong>{entry.speakerName}</strong>
  //               <button
  //                 onClick={(event) => handleOpenModal(event, entry.speakerName, entry.start)}
  //                 className="text-slate-400 pl-2 text-2xl"
  //               >
  //                 {'\u2304'}
  //               </button>
  //               <span> ({formatTime(entry.start)})</span>
  //             </p>
  //             <p>{entry.text}</p>
  //           </div>
  //         ))
  //       ) : (
  //         <p>No transcripts available.</p>
  //       )}
  //     </div>
  //   );
  // };
    

  const renderAssemblySpeakerTranscription = () => {
    if (!meetingDetails.meeting.MappedTranscript) return null;
  
    return (
      <div className="transcript-container">
        {meetingDetails.meeting.MappedTranscript.length > 0 ? (
          meetingDetails.meeting.MappedTranscript.map((entry, index) => (
            <div
              key={index}
              ref={(el) => (transcriptRefs.current[entry.start] = el)}
              className={`cursor-pointer ${highlightedTranscript === entry.start ? 'bg-yellow-200' : ''}`}
              onClick={() => handleTranscriptClick(formatTime(entry.start))}
            >
              <p>
                <strong>{entry.speakerName}</strong>
                <button
                  onClick={(event) => {
                    event.stopPropagation();
                    handleOpenModal(event, entry.speakerName, entry.start);
                  }}
                  className="text-slate-400 pl-2 text-2xl"
                >
                  {'\u2304'}
                </button>
                <span> ({formatTime(entry.start)})</span>
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
    console.log(meetingDetails);
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
          {meetingDetails.audioaccess_url && <CustomAudioPlayer ref={audioPlayerRef} audioUrl={meetingDetails.audioaccess_url} onTimeUpdate={handleTimeUpdate} />}
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
        {loading ? (
          <Loader />
        ) : (
          meetingDetails.meeting ? renderMeetingDetails() : renderEventDetails()
        )}
      </div>

      {loading ? (
        <div></div>
      ) : (
        <SpeakerModal
          isOpen={isModalOpen}
          onRequestClose={handleCloseModal}
          speakerName={selectedSpeaker}
          orderedSpeaker={meetingDetails.meeting.orderedSpeaker}
          position={modalPosition}
          onApplyToCurrentSpeaker={handleApplyToCurrentSpeaker}
          onApplyToAllSpeaker={handleApplyToAllSpeaker}
          timestamp={selectedSpeakerTimestamp}
        />
      )}
    </div>
  );
};

export default MeetingDetails;


