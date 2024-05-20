
import React, { useState } from 'react';

const Profile = () => {
  const [showDropdown, setShowDropdown] = useState(false);

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleGmailClick = () => {
    // Implement logic to show Gmail
    console.log('Showing Gmail...');
  };

  const handleLogout = () => {
    // Implement logic to log out
    console.log('Logging out...');
  };

  return (
    <div className="profile">
      <button className="profile-button" onClick={toggleDropdown}>
        Profile
      </button>
      {showDropdown && (
        <div className="dropdown">
          <button onClick={handleGmailClick}>Gmail</button>
          <button onClick={handleLogout}>Logout</button>
        </div>
      )}
    </div>
  );
};

export default Profile;
