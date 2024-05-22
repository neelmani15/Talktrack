import React from 'react';
import image from '../Images/info.png'; // Import your image here

const Modal = ({ title, message, onClose }) => {
  return (
    <div className="fixed z-10 inset-0 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        <div className="relative bg-white rounded-lg p-6 max-w-md w-full">
          <div className="flex justify-center mb-8">
            <img src={image} alt="Image" className="w-12 h-12" />
          </div>
          <div className="text-center mb-2 text-xl font-bold">{title}</div>
          <div className="text-center mb-2">{message}</div>
          <div className="text-center">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              onClick={onClose}
            >
              OK
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
