

// import React, { useState } from 'react';
// import Modal from 'react-modal';
// import '../css/speakermodal.css';

// const SpeakerModal = ({ isOpen, onRequestClose, orderedSpeaker, position ,speakerName}) => {
//   const { top, left } = position;
//   const [hoveredSpeaker, setHoveredSpeaker] = useState(null);
//   const [isTooltipOpen, setIsTooltipOpen] = useState(false); // State to manage tooltip open/close
//   console.log(speakerName)

//   const handleMouseEnter = (index,speaker) => {
//     setHoveredSpeaker(index);
//     console.log(speaker)
//     setIsTooltipOpen(true);
//   };

//   const handleMouseLeave = () => {
//     setHoveredSpeaker(null);
//     setIsTooltipOpen(false);
//   };

//   return (
//     <Modal
//       isOpen={isOpen}
//       onRequestClose={onRequestClose}
//       contentLabel="Speaker Options"
//       className="modal"
//       overlayClassName="overlay"
//       style={{ content: { top: `${top}px`, left: `${left}px` } }}
//     >
//       <div className="ordered-speaker-list">
//         <ul>
//           {/* {orderedSpeaker.map((speaker, index) => (
//             <li
//               key={index}
//               onMouseEnter={() => handleMouseEnter(index,speaker)}
//               onMouseLeave={handleMouseLeave}
//               style={{ position: 'relative' }}
//             >
//               {speaker}
//               {(hoveredSpeaker === index && isTooltipOpen) && (
//                 <div
//                   className="custom-tooltip"
//                   onMouseEnter={() => setIsTooltipOpen(true)}
//                   onMouseLeave={() => setIsTooltipOpen(false)}
//                 >
                
//                   <div className="options">
//                     <button className="option-btn" onClick={() => console.log('Apply to current speaker')}>
//                       Apply to current speaker
//                     </button>
//                     <button className="option-btn" onClick={() => console.log('Apply to all speakers')}>
//                       Apply to all speakers
//                     </button>
//                   </div>
//                 </div>
//               )}
//             </li>
//           ))} */}
//            {speakerName && (
//             <li style={{ position: 'relative' }}>
//               {speakerName} <span>&#10004;</span>
//             </li>
//           )}
//            {orderedSpeaker.map((speaker, index) => (
//             // Skip rendering speakerName from orderedSpeaker list
//             speaker !== speakerName && (
//               <li
//                 key={index}
//                 onMouseEnter={() => handleMouseEnter(index, speaker)}
//                 onMouseLeave={handleMouseLeave}
//                 style={{ position: 'relative' }}
//               >
//                 {speaker}
//                 {(hoveredSpeaker === index && isTooltipOpen) && (
//                   <div
//                     className="custom-tooltip"
//                     onMouseEnter={() => setIsTooltipOpen(true)}
//                     onMouseLeave={() => setIsTooltipOpen(false)}
//                   >
//                     {/* Tooltip content */}
//                     <div className="options">
//                       <button className="option-btn" onClick={() => console.log('Apply to current speaker')}>
//                         Apply to current speaker
//                       </button>
//                       <button className="option-btn" onClick={() => console.log('Apply to all speakers')}>
//                         Apply to all {speakerName}
//                       </button>
//                     </div>
//                   </div>
//                 )}
//               </li>
//             )
//           ))}
//         </ul>
//       </div>
//     </Modal>
//   );
// };

// export default SpeakerModal;



import React, { useState } from 'react';
import Modal from 'react-modal';
import '../css/speakermodal.css';

const SpeakerModal = ({ isOpen, onRequestClose, orderedSpeaker, position ,speakerName,onApplyToCurrentSpeaker,onApplyToAllSpeaker,timestamp}) => {
  const { top, left } = position;
  const [hoveredSpeaker, setHoveredSpeaker] = useState(null);
  const [isTooltipOpen, setIsTooltipOpen] = useState(false); 
  console.log(speakerName)

  const handleMouseEnter = (index,speaker) => {
    setHoveredSpeaker(index);
    console.log(speaker)
    setIsTooltipOpen(true);
  };

  const handleMouseLeave = () => {
    setHoveredSpeaker(null);
    setIsTooltipOpen(false);
  };
  const handleApplyToCurrentSpeaker = (speaker) => {
    onApplyToCurrentSpeaker(speaker,timestamp);
  };
  const handleApplyToAllSpeaker = (speaker) => {
    onApplyToAllSpeaker(speaker,timestamp);
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Speaker Options"
      className="modal"
      overlayClassName="overlay"
      style={{ content: { top: `${top}px`, left: `${left}px` } }}
    >
      <div className="ordered-speaker-list">
        <ul>

           {speakerName && (
            <li style={{ position: 'relative' }}>
              {speakerName} <span>&#10004;</span>
            </li>
          )}
           {orderedSpeaker.map((speaker, index) => (
            // Skip rendering speakerName from orderedSpeaker list
            speaker !== speakerName && (
              <li
                key={index}
                onMouseEnter={() => handleMouseEnter(index, speaker)}
                onMouseLeave={handleMouseLeave}
                style={{ position: 'relative' }}
              >
                {speaker}
                {(hoveredSpeaker === index && isTooltipOpen) && (
                  <div
                    className="custom-tooltip"
                    onMouseEnter={() => setIsTooltipOpen(true)}
                    onMouseLeave={() => setIsTooltipOpen(false)}
                  >
                    {/* Tooltip content */}
                    <div className="options">
                      <button className="option-btn" onClick={()=>handleApplyToCurrentSpeaker(speaker)}>
                        Apply to current speaker
                      </button>
                      <button className="option-btn"  onClick={()=>handleApplyToAllSpeaker(speaker)}>
                        Apply to all {speakerName}
                      </button>
                    </div>
                  </div>
                )}
              </li>
            )
          ))}
        </ul>
      </div>
    </Modal>
  );
};

export default SpeakerModal;





