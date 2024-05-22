
import React, { useState,useEffect } from 'react';
import { useUser } from '../contextapi/UserEmailContext';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const { userEmail,userPicture,userName } = useUser();
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Load user data from storage if available
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    }
  }, [user]);

  useEffect(() => {
    if (userEmail && userPicture && userName) {
      setUser({ email: userEmail, picture: userPicture, name: userName });
    }
  }, [userEmail, userPicture, userName]);

  // console.log(userPicture);
  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleGmailClick = () => {
    // Implement logic to show Gmail
    console.log('Showing Gmail...');
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/')
    // Implement logic to log out
    console.log('Logging out...');
  };

  return (
    <div className="relative">
      <button className="profile-button flex items-center" onClick={toggleDropdown}>
        <img
          src={user ? user.picture : userPicture}
          alt="Profile"
          className="w-10 h-10 rounded-full"
        />
      </button>
      {showDropdown && (
        <div className="dropdown absolute right-0 mt-2 w-60 bg-white border border-gray-300 rounded-md shadow-lg">
          <div className="p-4">
            <p className="font-semibold">{user ? user.name : userName}</p>
            <p className="text-sm text-gray-600">{user ? user.email : userEmail}</p>
          </div>
          <div className="border-t border-gray-200">
            <button 
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
