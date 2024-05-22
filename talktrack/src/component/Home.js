// import React, { useState ,useEffect} from 'react';
// import axios from 'axios';
// import DatePicker from 'react-datepicker';
// import 'react-datepicker/dist/react-datepicker.css';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import Profile from './profile';
// import { useLocation } from 'react-router-dom';
// import { useUser } from '../contextapi/UserEmailContext';
// import { useNavigate } from 'react-router-dom';
// const Home = () => {
//   const [isLoading, setIsLoading] = useState(false);
//   const navigate = useNavigate();
//   const [events, setEvents] = useState([]);
//   const [userId, setUserId] = useState(null);
//   const { userEmail}= useUser();
//   console.log(userEmail)
//   const [formData, setFormData] = useState({
//     summary: '',
//     description: '',
//     startTime: '',
//     endTime: ''
//   });


//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const startRecording = async (meetUrl) => {
//     try {
//       setIsLoading(true);
//       // Make a POST request to your backend to start recording
//       const response = await axios.post('http://localhost:5001/start-recording', { meetUrl ,userEmail});
//       console.log('Recording started successfully:', response.data);
//       setIsLoading(false);
//       toast.success('Meeting Recording successfully started!');

//     } catch (error) {
//       console.error('Error starting recording:', error);
//       setIsLoading(false);
//       toast.error('Failed to record meetings');
//     }
//   };

//   const handleMeetingLinkClick = (meetUrl) => {
//     // Call the startRecording function when the meeting link is clicked
//     startRecording(meetUrl);
//   };


//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       setIsLoading(true);
//       console.log(formData);
//       // Make a POST request to your backend route for scheduling a meeting
//       const response = await axios.post('http://localhost:5001/schedule-event', {formData});
//       console.log('Meeting scheduled successfully:', response.data);
//       setIsLoading(false);
//       setIsModalOpen(false);
//       toast.success('Events successfully schedule!');
//     } catch (error) {
//       console.error('Error scheduling meeting:', error);
//       setIsLoading(false);
//       toast.error('Failed to schedule events.');
//     }
//   };


//   const fetchEvents = async () => {
//     try {
//       setIsLoading(true);
//       // Make a GET request to fetch all events
//       const response = await axios.get('http://localhost:5001/allevents', {
//         withCredentials: true // Ensure credentials are sent along with the request
//       });
//       setEvents(response.data.alleventslist);
//       setIsLoading(false);
//       toast.success('Events fetched successfully!');
//     } catch (error) {
//       console.error('Error fetching events:', error);
//       setIsLoading(false);
//       toast.error('Failed to fetch events.');
//     }
//   };
//   const HandleMeetingdetails = async (eventUrl) => {
//     console.log(eventUrl);
//     const parts = eventUrl.split('/');
//     const meetingId = parts[parts.length - 1];
//     console.log(meetingId);
  
//     try {
//       const response = await axios.get(`http://localhost:5001/user/meetingdetails`, {
//         params: { meetingId } // Passing meetingId as a query parameter
//       });
//       console.log(response.data);
//       navigate('/meetingdetails', { state: { meetingDetails: response.data } });
//     } catch (error) {
//       console.error('Error fetching meeting details:', error);
//     }
//   };
//   const copyToClipboard = (text) => {
//     navigator.clipboard.writeText(text);
//     alert('Link copied to clipboard!');
//   };

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <div style={{display:"flex",justifyContent:'space-between'}}>
//       <h1 className="text-2xl font-bold mb-4">Home Page</h1>
//       <Profile/>
//       </div>
//       <button
//         className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
//         onClick={() => setIsModalOpen(true)}
//         disabled={isLoading}
//       >
//         {isLoading ? 'Scheduling...' : 'Schedule Meeting'}
//       </button>
//       {isModalOpen && (
//         <div className="fixed z-10 inset-0 overflow-y-auto">
//           <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
//             <div className="fixed inset-0 transition-opacity" aria-hidden="true">
//               <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
//             </div>
//             <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
//             <div className="inline-block rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-6 sm:align-middle sm:max-w-3xl sm:w-full">
//               <form onSubmit={handleSubmit}>
//                 <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
//                   <div className="mb-4">
//                     <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="summary">
//                       Summary
//                     </label>
//                     <input
//                       className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                       id="summary"
//                       type="text"
//                       placeholder="Summary"
//                       name="summary"
//                       value={formData.summary}
//                       onChange={handleInputChange}
//                       required
//                     />
//                   </div>
//                   <div className="mb-4">
//                     <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
//                       Description
//                     </label>
//                     <textarea
//                       className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                       id="description"
//                       placeholder="Description"
//                       name="description"
//                       value={formData.description}
//                       onChange={handleInputChange}
//                       required
//                     />
//                   </div>
//                   <div className="flex flex-wrap -mx-3 mb-6">
//   <div className="w-full md:w-1/2 px-10 py-2">
//     <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="startTime">
//       Start Time
//     </label>
//     <div className=''>
//       <DatePicker
//         selected={formData.startTime}
//         onChange={(date) => setFormData({ ...formData, startTime: date })}
//         showTimeSelect
//         timeFormat="HH:mm"
//         timeIntervals={15}
//         timeCaption="Time"
//         dateFormat="MMMM d, yyyy h:mm aa"
//         className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//         id="startTime" // Add id attribute
//       />
//     </div>
//   </div>
//   <div className="w-full md:w-1/2 px-6 py-2">
//     <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="endTime">
//       End Time
//     </label>
//     <div className="">
//       <DatePicker
//         selected={formData.endTime}
//         onChange={(date) => setFormData({ ...formData, endTime: date })}
//         showTimeSelect
//         timeFormat="HH:mm"
//         timeIntervals={15}
//         timeCaption="Time"
//         dateFormat="MMMM d, yyyy h:mm aa"
//         className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//         id="endTime" // Add id attribute
//       />
//     </div>
//   </div>
// </div>

//                 </div>
//                 <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
//                   <button
//                     type="submit"
//                     className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-500 text-base font-medium text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
//                     disabled={isLoading}
//                   >
//                     {isLoading ? 'Scheduling...' : 'Schedule Meeting'}
//                   </button>
//                   <button
//                     onClick={() => setIsModalOpen(false)}
//                     type="button"
//                     className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
//                   >
//                     Cancel
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         </div>
//       )}
//       {/* <button
//         className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
//         // onClick={handleScheduleMeeting}
//         disabled={isLoading}
//       >
//         {isLoading ? 'Scheduling...' : 'Schedule Meeting'}
//       </button> */}
//       <button
//         className="ml-2 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
//         onClick={fetchEvents}
//         disabled={isLoading}
//       >
//         {isLoading ? 'Loading...' : 'Show All Events'}
//       </button>
//       <div className="mt-8">
//         <h2 className="text-xl font-bold mb-4">List of Events</h2>
//         <table className="min-w-full divide-y divide-gray-200">
//           <thead className="bg-gray-50">
//             <tr>
//               <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Summary</th>
//               <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
//               <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Time</th>
//               <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">End Time</th>
//               <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Meeting Link</th>
//             </tr>
//           </thead>
//           <tbody className="bg-white divide-y divide-gray-200">
//             {events.map((event, index) => (
//               <tr key={index}>
//                 <td className="px-6 py-4 whitespace-nowrap">{event.summary}</td>
//                 {/* <td className="px-6 py-4 whitespace-nowrap">{event.description}</td> */}
//                 <td
//         className="px-6 py-4 whitespace-nowrap"
//         onClick={() => HandleMeetingdetails(event.url)}
//         style={{ cursor: 'pointer' }}
//       >
//         {event.description}
//       </td>
//                 <td className="px-6 py-4 whitespace-nowrap">{new Date(event.start).toLocaleString()}</td>
//                 <td className="px-6 py-4 whitespace-nowrap">{new Date(event.end).toLocaleString()}</td>
//                 <td className="px-14 py-4 whitespace-nowrap relative">
//   {/* Copy URL button */}
//                   {/* <button
//                     onClick={() => copyToClipboard(event.url)}
//                     className="p-1 rounded-full bg-gray-200 hover:bg-gray-300 focus:outline-none"
//                   >
//                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
//                       <path fillRule="evenodd" d="M3 4a2 2 0 012-2h9a2 2 0 012 2v2h1a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h1V4zm2 2v1h10V6H5zm1 4a1 1 0 011-1h8a1 1 0 011 1v1H6V10zm1 3a1 1 0 011-1h6a1 1 0 011 1v1H7v-1z" clipRule="evenodd" />
//                     </svg>
//                   </button> */}
                  
//                   {/* Open in new tab button */}
//                   <button
//                     onClick={() => {
//                       handleMeetingLinkClick(event.url);
//                       window.open(event.url, '_blank');
//                   }}
//                     className="p-1 rounded-full bg-gray-200 hover:bg-gray-300 focus:outline-none"
//                   >
//                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
//                       <path fillRule="evenodd" d="M5 4a2 2 0 00-2 2v8a2 2 0 002 2h5v2H8l3 3 3-3h-2v-2h5a2 2 0 002-2V6a2 2 0 00-2-2H5zm5 10V8l5 3-5 3z" clipRule="evenodd" />
//                     </svg>
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//       {/* <button 
//         className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
//         onClick={() => handleMeetingLinkClick('https://meet.google.com/wec-tdvh-voc')} disabled={isLoading}>
//         {isLoading ? 'Recording...' : 'Start Recording'}
//       </button> */}
//       <ToastContainer />
//     </div>
//   );
// };

// export default Home;




import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contextapi/UserEmailContext';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { format } from 'date-fns';
import { FaClock } from 'react-icons/fa';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import { FaPlus, FaTrash } from 'react-icons/fa';

const Home = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const { userEmail } = useUser();
  const [formData, setFormData] = useState({
    summary: '',
    description: '',
    startTime: '',
    endTime: '',
    attendees: [''] 
  });

  const [isModalOpen, setIsModalOpen] = useState(false);

  const startRecording = async (meetUrl) => {
    try {
      setIsLoading(true);
      const response = await axios.post('http://localhost:5001/start-recording', { meetUrl, userEmail });
      setIsLoading(false);
      // toast.success('Meeting Recording successfully started!');

    } catch (error) {
      setIsLoading(false);
      // toast.error('Failed to record meetings');
    }
  };
  const handleAttendeeChange = (index, e) => {
    const newAttendees = formData.attendees.map((attendee, i) =>
      i === index ? e.target.value : attendee
    );
    setFormData({ ...formData, attendees: newAttendees });
  };
  
  const addAttendee = () => {
    setFormData({ ...formData, attendees: [...formData.attendees, ''] });
  };
  
  const removeAttendee = (index) => {
    const newAttendees = formData.attendees.filter((_, i) => i !== index);
    setFormData({ ...formData, attendees: newAttendees });
  };
  

  const handleMeetingLinkClick = (meetUrl) => {
    startRecording(meetUrl);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const filteredAttendees = formData.attendees.filter(email => email.trim() !== '');
      const dataToSubmit = { ...formData, userEmail, attendees: filteredAttendees };
      // const dataToSubmit = { ...formData, userEmail };
      const response = await axios.post('http://localhost:5001/user/schedule-event', { dataToSubmit });
      setIsLoading(false);
      setIsModalOpen(false);
      toast.success('Events successfully scheduled!');
    } catch (error) {
      setIsLoading(false);
      toast.error('Failed to schedule events.');
    }
  };

  const fetchEvents = async () => {
    try {
      setIsLoading(true);
      const response = await axios.post('http://localhost:5001/user/allevents', {userEmail});
      setEvents(response.data.alleventslist);
      console.log(response.data)
      setIsLoading(false);
      toast.success('Events fetched successfully!');
    } catch (error) {
      setIsLoading(false);
      toast.error('Failed to fetch events.');
    }
  };

  const handleMeetingDetails = async (eventUrl) => {
    const parts = eventUrl.split('/');
    const meetingId = parts[parts.length - 1];
    try {
      const response = await axios.get(`http://localhost:5001/user/meetingdetails`, { params: { meetingId } });
      navigate('/meetingdetails', { state: { meetingDetails: response.data } });
    } catch (error) {
      console.error('Error fetching meeting details:', error);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Link copied to clipboard!');
  };

  return (
    <div className="h-screen flex">
      <Sidebar 
        onScheduleMeetingClick={() => setIsModalOpen(true)}
        onShowAllEventsClick={fetchEvents}
        isLoading={isLoading}
      />
      <div className="flex-1 p-6">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold mb-4">Home Page</h1>
          {isModalOpen && (
            <div className="fixed z-10 inset-0 overflow-y-auto">
              <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                  <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                </div>
                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                <div className="inline-block rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-6 sm:align-middle sm:max-w-3xl sm:w-full">
                  <form onSubmit={handleSubmit}>
                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                      <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="summary">
                          Summary
                        </label>
                        <input
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                          id="summary"
                          type="text"
                          placeholder="Summary"
                          name="summary"
                          value={formData.summary}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
                          Description
                        </label>
                        <textarea
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                          id="description"
                          placeholder="Description"
                          name="description"
                          value={formData.description}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="flex flex-wrap -mx-3 mb-6">
                        <div className="w-full md:w-1/2 px-3 py-2">
                          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="startTime">
                            Start Time
                          </label>
                          <DatePicker
                            selected={formData.startTime}
                            onChange={(date) => setFormData({ ...formData, startTime: date })}
                            showTimeSelect
                            timeFormat="HH:mm"
                            timeIntervals={15}
                            timeCaption="Time"
                            dateFormat="MMMM d, yyyy h:mm aa"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="startTime"
                          />
                        </div>
                        <div className="w-full md:w-1/2 px-3 py-2">
                          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="endTime">
                            End Time
                          </label>
                          <DatePicker
                            selected={formData.endTime}
                            onChange={(date) => setFormData({ ...formData, endTime: date })}
                            showTimeSelect
                            timeFormat="HH:mm"
                            timeIntervals={15}
                            timeCaption="Time"
                            dateFormat="MMMM d, yyyy h:mm aa"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="endTime"
                          />
                        </div>
                      </div>
                      <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                          Attendees
                        </label>
                        {formData.attendees.map((attendee, index) => (
                          <div key={index} className="flex mb-2 items-center">
                            <input
                              type="email"
                              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                              placeholder="Attendee Email"
                              value={attendee}
                              onChange={(e) => handleAttendeeChange(index, e)}
                            />
                            <button
                              type="button"
                              className="ml-2 p-2 bg-red-500 text-white rounded-full"
                              onClick={() => removeAttendee(index)}
                            >
                              <FaTrash />
                            </button>
                            <button
                              type="button"
                              className="ml-2 p-2 bg-green-500 text-white rounded-full"
                              onClick={addAttendee}
                            >
                              <FaPlus />
                            </button>
                          </div>
                        ))}
                      </div>

                    </div>
                    <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                      <button
                        type="submit"
                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-500 text-base font-medium text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                        disabled={isLoading}
                      >
                        {isLoading ? 'Scheduling...' : 'Schedule Meeting'}
                      </button>
                      <button
                        onClick={() => setIsModalOpen(false)}
                        type="button"
                        className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}
          <div className="mt-8">
            <h2 className="text-xl font-bold mb-4">List of Events</h2>
            <table className="min-w-full divide-y divide-gray-200">
              
              <tbody className="bg-white divide-y divide-gray-200">
                {events.map((event, index) => (
                  <tr key={index}>
                    <td className="px-2 py-2 whitespace-nowrap"
                    onClick={() => handleMeetingDetails(event.url)}
                    style={{ cursor: 'pointer' }}>{event.summary}</td>
                    {/* <td
                      className="px-6 py-4 whitespace-nowrap"
                      onClick={() => handleMeetingDetails(event.url)}
                      style={{ cursor: 'pointer' }}
                    >
                      {event.description}
                    </td> */}
                    {/* <td className="px-6 py-4 whitespace-nowrap">{new Date(event.start).toLocaleString()}</td> */}
                    {/* <td className="px-6 py-4 whitespace-nowrap">{new Date(event.end).toLocaleString()}</td> */}
                    {/* <td className="px-6 py-4 whitespace-nowrap">
                        {format(new Date(event.start), 'EEE, MMM do')}
                        <FaClock className="inline-block ml-2 mr-1" />
                        {format(new Date(event.start), 'h:mm a')}
                      </td> */}
                      <td className="px-2 py-2 whitespace-nowrap">
                        <FontAwesomeIcon icon={faCalendarAlt} className="text-gray-500 mr-1" />
                        {format(new Date(event.start), 'EEE, MMM do')}
                        <FaClock className="inline-block ml-2 mr-1" />
                        {format(new Date(event.start), 'h:mm a')}
                      </td>
                    <td className="px-2 py-2 whitespace-nowrap relative">
                      <button
                        onClick={() => {
                          handleMeetingLinkClick(event.url);
                          window.open(event.url, '_blank');
                        }}
                        className="p-1 rounded-full bg-gray-200 hover:bg-gray-300 focus:outline-none"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M5 4a2 2 0 00-2 2v8a2 2 0 002 2h5v2H8l3 3 3-3h-2v-2h5a2 2 0 002-2V6a2 2 0 00-2-2H5zm5 10V8l5 3-5 3z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <ToastContainer />
        </div>
      </div>
    </div>
  );
};

export default Home;
