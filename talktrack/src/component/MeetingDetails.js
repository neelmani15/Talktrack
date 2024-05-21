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


import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import VideoPlayer from './VideoPlayer';

const MeetingDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { meetingDetails } = location.state;

  console.log(meetingDetails);
  console.log(meetingDetails.meeting.videoS3url);
  console.log(meetingDetails.videoaccess_url);

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <button 
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mb-4"
          onClick={() => navigate(-1)}
        >
          Go Back
        </button>
        <h1 className="text-2xl font-bold mb-4">Meeting Details</h1>
        <div className="mb-4">
          <strong>Meeting ID:</strong> {meetingDetails.meeting.meetingId}
        </div>
        <div className="mb-4">
          <strong>User Email:</strong> {meetingDetails.meeting.userEmail}
        </div>
        <div className="mb-4">
          <strong>Video URL:</strong> 
          <a href={meetingDetails.meeting.videoS3url} target="_blank" rel="noopener noreferrer">
            {meetingDetails.meeting.videoS3url}
          </a>
        </div>
        {/* {meetingDetails.videoaccess_url && (
          <div className="mb-4">
            <strong>Presigned Video URL:</strong> 
            <a href={meetingDetails.videoaccess_url} target="_blank" rel="noopener noreferrer">
              {meetingDetails.videoaccess_url}
            </a>
          </div>
        )} */}
      </div>
      {meetingDetails.videoaccess_url && <VideoPlayer videoUrl={meetingDetails.videoaccess_url} />}
    </>
  );
};

export default MeetingDetails;
