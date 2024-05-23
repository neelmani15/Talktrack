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


import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import VideoPlayer from './VideoPlayer';
import { format } from 'date-fns';
import { FaClock } from 'react-icons/fa';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
const MeetingDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { meetingDetails } = location.state;

  const renderMeetingDetails = () => {
    return (
      <>
        <div className='flex justify-center mb-10 pr-4'>
          <div className="mt-8 pr-4">
            <strong>Meeting ID:</strong> {meetingDetails.meeting.meetingId}
          </div>
          <div className="mt-8">
            <strong>User Email:</strong> {meetingDetails.meeting.userEmail}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-semibold mb-2">Video</h2>
            {meetingDetails.videoaccess_url && (
              <VideoPlayer videoUrl={meetingDetails.videoaccess_url} />
            )}
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-2">Transcription</h2>
            <div className="bg-gray-100 p-4 rounded shadow-md overflow-y-auto" style={{ maxHeight: '58vh' }}>
              {meetingDetails.meeting.transcript}
            </div>
          </div>
        </div>
        <div className="mt-4">
          <strong>Video URL:</strong>
          <a
            href={meetingDetails.meeting.videoS3url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 underline"
          >
            {meetingDetails.meeting.videoS3url}
          </a>
        </div>
      </>
    );
  };

  const renderEventDetails = () => {
    const { event } = meetingDetails;
    return (
      <>

      <strong>
      <h1 className='text-center font-bold'>This event not happened yet</h1>
      </strong>

      <div className='flex flex-col'>
        <div className='flex flex-row  items-center mt-8'>
        <div className='mr-8'>
            <strong>MeetingId:</strong> {event.MeetingId}
          </div>
          
          {/* <div className='mr-8'>
            <strong>Start Time:</strong> {new Date(event.start).toLocaleString()}
          </div> */}
          <FontAwesomeIcon icon={faCalendarAlt} className="text-gray-500 mr-1" />
                      {format(new Date(event.start), 'EEE, MMM do')}
                      <FaClock className="inline-block ml-2 mr-1" />
                      {format(new Date(event.start), 'h:mm a')}
                      <div className='mr-8 ml-4'>
            <strong>Meeting URL:</strong>
            <a
              href={event.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline"
            >
              {event.url}
            </a>
          </div>            
        </div>
        <div className='flex flex-row  items-center mt-8'>
          
          <div className='mr-8'>
            <strong>Event Summary:</strong> {event.summary}
          </div>
          <div className='mr-8'>
            <strong>Description:</strong> {event.description}
          </div>
        </div>
      </div>




      </>
    );
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <button
        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mb-4"
        onClick={() => navigate(-1)}
      >
        Go Back
      </button>
      {meetingDetails.meeting ? renderMeetingDetails() : renderEventDetails()}
    </div>
  );
};

export default MeetingDetails;
