// UserContext.js

import React, { createContext, useState, useContext } from 'react';

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [userEmail, setUserEmail] = useState('');
  const [meetings, setMeetings] = useState([]);

  return (
    <UserContext.Provider value={{ userEmail, setUserEmail,meetings, setMeetings  }}>
      {children}
    </UserContext.Provider>
  );
};
