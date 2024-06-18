// import React from 'react';

// const Sidebar = ({ onScheduleMeetingClick, onShowAllEventsClick,onShowLiveMeeting, isLoading }) => {
//   return (
//     <div className="bg-gray-100 w-64 h-full p-4">
//       <ul>
//         <li>
//           <button
//             className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mb-4"
//             onClick={onScheduleMeetingClick}
//             disabled={isLoading}
//           >
//             {isLoading ? 'Scheduling...' : 'Schedule Meetings'}
//           </button>
//         </li>
//         <li>
//           <button
//             className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded mb-4"
//             onClick={onShowAllEventsClick}
//             disabled={isLoading}
//           >
//             {isLoading ? 'Loading...' : 'Meetings'}
//           </button>
//         </li>
//         {/* <li>
//           <button
//             className="w-full bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
//             onClick={onShowLiveMeeting}
//             disabled={isLoading}
//           >
//             {isLoading ? 'Adding...' : 'Add to Live Meeting'}
//           </button>
//         </li> */}
//       </ul>
//     </div>
//   );
// };

// export default Sidebar;


import React, { useState } from 'react';

const Sidebar = ({ onScheduleMeetingClick, onShowScheduleEventsClick,onShowLiveEventsClick, onShowLiveMeeting, isLoading }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleMouseEnter = () => {
    setIsDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    setIsDropdownOpen(false);
  };

  return (
    <div className="bg-gray-200 text-white w-64 h-full p-4">
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
            className="w-full bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mb-4"
            onClick={onShowLiveMeeting}
            disabled={isLoading}
          >
            {isLoading ? 'Adding...' : 'Add to Live Meeting'}
          </button>
        </li>
        <li
          className="relative"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <button
            className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded mb"
            disabled={isLoading}
          >
            {isLoading ? 'Loading...' : 'Meetings'}
          </button>
          {isDropdownOpen && (
            <div className="absolute left-0 w-full bg-green-300 text-black rounded shadow-lg z-10">
              <button
                className="w-full text-left px-4 py-2 hover:bg-green-400"
                onClick={onShowScheduleEventsClick}
                disabled={isLoading}
              >
                {isLoading ? 'Checking...' : 'Scheduled Meet List'}
              </button>
              <button
                className="w-full text-left px-4 py-2 hover:bg-green-400"
                onClick={onShowLiveEventsClick}
                disabled={isLoading}
              >
                {isLoading ? 'Checking...' : 'Live Meet List'}
              </button>
            </div>
          )}
        </li>
        
      </ul>
    </div>
  );
};

export default Sidebar;
