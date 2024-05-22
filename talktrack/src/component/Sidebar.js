import React from 'react';

const Sidebar = ({ onScheduleMeetingClick, onShowAllEventsClick, isLoading }) => {
  return (
    <div className="bg-gray-100 w-64 h-full p-4">
      <ul>
        <li>
          <button
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mb-4"
            onClick={onScheduleMeetingClick}
            disabled={isLoading}
          >
            {isLoading ? 'Scheduling...' : 'Schedule Meetings'}
          </button>
        </li>
        <li>
          <button
            className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
            onClick={onShowAllEventsClick}
            disabled={isLoading}
          >
            {isLoading ? 'Loading...' : 'List All Events'}
          </button>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;