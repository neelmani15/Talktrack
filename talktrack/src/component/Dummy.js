import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useUser } from '../contextapi/UserEmailContext';
import { useNavigate } from 'react-router-dom';

const UserDummyComponent = () => {
  const location = useLocation(); // Get the current location
  const navigate = useNavigate();
  const { setUserEmail } = useUser();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const email = queryParams.get('email');
    console.log(email);
    setUserEmail(email || '');
    navigate('/user');
  }, [location, navigate, setUserEmail]);

  return <div>Loading...</div>;
};

export default UserDummyComponent;
