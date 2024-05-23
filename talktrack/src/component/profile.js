
import React, { useState, useEffect } from 'react';
import { useUser } from '../contextapi/UserEmailContext';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { userEmail, userPicture, userName } = useUser();
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

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
    console.log('Logging out...');
  };

  return (
    <div className="relative group">
      <style>
        {`
          .dropdown {
            opacity: 0;
            visibility: hidden;
            transition: opacity 0.3s, visibility 0.3s;
          }
          .group:hover .dropdown {
            opacity: 1;
            visibility: visible;
            transition-delay: 0s;
          }
          .dropdown-hide {
            opacity: 0;
            visibility: hidden;
            transition-delay: 3s;
          }
        `}
      </style>
      <button className="profile-button flex items-center">
        <img
          src={user ? user.picture : userPicture}
          alt="Profile"
          className="w-10 h-10 rounded-full"
        />
      </button>
      <div className="dropdown absolute right-0 mt-2 w-60 bg-white border border-gray-300 rounded-md shadow-lg group-hover:dropdown-hide">
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
    </div>
  );
};

export default Profile;

