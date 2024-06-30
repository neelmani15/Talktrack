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
import Modal from './Modal';

const Meetings = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { userEmail,userPicture,userName, meetings, setMeetings } = useUser();
  const [isNoEvents, setIsNoEvents] = useState(false);
  const [formData, setFormData] = useState({
    summary: '',
    description: '',
    startTime: '',
    endTime: '',
    attendees: ['']
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLiveMeetingModalOpen, setIsLiveMeetingModalOpen] = useState(false);
  const [meetingUrl, setMeetingUrl] = useState('');

  const startRecording = async (meetUrl) => {
    try {
      setIsLoading(true);
      const response = await axios.post('http:///start-recording', { meetUrl, userEmail });
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
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
      const response = await axios.post('http:///user/schedule-event', { dataToSubmit });
      setIsLoading(false);
      setIsModalOpen(false);
      toast.success('Events successfully scheduled!');
      fetchEvents(); // Refresh events after scheduling a new one
    } catch (error) {
      setIsLoading(false);
      toast.error('Failed to schedule events.');
    }
  };

  const fetchEvents = async () => {
    try {
      setIsLoading(true);
      const response = await axios.post('http:///user/allevents', {userEmail});
      if(response.data.message === "No events found for the user."){
        setIsNoEvents(true);
        // toast.warning('No events found for the user.');
        setIsLoading(false);
        return
      }else{
      setMeetings(response.data.alleventslist);
      console.log(response.data)
      setIsLoading(false);
      toast.success('Events fetched successfully!');
      }
    } catch (error) {
      setIsLoading(false);
      toast.error('Failed to fetch events.');
    }
  };

  const handleMeetingDetails = async (eventUrl) => {
    const parts = eventUrl.split('/');
    const meetingId = parts[parts.length - 1];
    try {
      // const response = await axios.post('http:///user/meetingdetails', { meetingId,userEmail });
      
      navigate('/meetingdetails', { state: { meetingDetails: { meetingId,userEmail }} });
    } catch (error) {
      console.error('Error fetching meeting details:', error);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Link copied to clipboard!');
  };
  const handleCloseModal = () => {
    setIsNoEvents(false);
  };

  const handleLiveMeetingSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);

      console.log(meetingUrl);
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/user/start-live-meeting`, { meetUrl: meetingUrl, userEmail });
      setIsLoading(false);
      setIsLiveMeetingModalOpen(false);
      toast.success('Live meeting added successfully!');
    } catch (error) {
      setIsLoading(false);
      toast.error('Failed to add live meeting.');
    }
  };

  return (
    <div className="h-screen flex">
      <Sidebar
        onScheduleMeetingClick={() => setIsModalOpen(true)}
        onShowAllEventsClick={fetchEvents}
        onShowLiveMeeting={()=>setIsLiveMeetingModalOpen(true)}
        isLoading={isLoading}
      />
      <div className="flex-1 p-6">
      {isNoEvents && (
        <Modal
          title="No Events Found"
          message="No events found for the user."
          onClose={handleCloseModal}
        />
      )}
        <Navbar />
        <div className="container mx-auto px-4 py-8">
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
          {isLiveMeetingModalOpen && (
            <div className="fixed z-10 inset-0 overflow-y-auto">
              <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                  <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                </div>
                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                <div className="inline-block rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-6 sm:align-middle sm:max-w-3xl sm:w-full">
                  <form onSubmit={handleLiveMeetingSubmit}>
                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                      <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="meetingUrl">
                          Meeting URL
                        </label>
                        <input
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                          id="meetingUrl"
                          type="text"
                          placeholder="Meeting URL"
                          value={meetingUrl}
                          onChange={(e) => setMeetingUrl(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                      <button
                        type="submit"
                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-500 text-base font-medium text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                        disabled={isLoading}
                      >
                        {isLoading ? 'Adding...' : 'Add to Live Meeting'}
                      </button>
                      <button
                        onClick={() => setIsLiveMeetingModalOpen(false)}
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
            <h2 className="text-xl font-bold mb-4">Meetings</h2>
            <table className="min-w-full divide-y divide-gray-200">
              <tbody className="bg-white divide-y divide-gray-200">
                {meetings.map((event, index) => (
                  <tr key={index}>
                    <td
                      className="px-2 py-2 whitespace-nowrap"
                      onClick={() => handleMeetingDetails(event.url)}
                      style={{ cursor: 'pointer' }}
                    >
                      {event.summary}
                    </td>
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
                          <path fillRule="evenodd" d="M5 4a2 2 0 00-2 2v8a2 2 0 002 2h5v2H8l3 3-3-3h-2v-2h5a2 2 0 002-2V6a2 2 0 00-2-2H5zm5 10V8l5 3-5 3z" clipRule="evenodd" />
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

export default Meetings;
