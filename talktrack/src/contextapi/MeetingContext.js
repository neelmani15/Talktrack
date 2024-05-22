import React, { createContext, useContext, useState } from 'react';

const UserEmailContext = createContext();

export const useUser = () => useContext(UserEmailContext);

export const UserEmailProvider = ({ children }) => {
  const [userEmail, setUserEmail] = useState('');
  const [meetings, setMeetings] = useState([]); // Add meetings state

  return (
    <UserEmailContext.Provider value={{ userEmail, setUserEmail, meetings, setMeetings }}>
      {children}
    </UserEmailContext.Provider>
  );
};
