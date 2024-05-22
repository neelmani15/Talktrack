import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useUser } from '../contextapi/UserEmailContext';
import { useNavigate } from 'react-router-dom';

const UserDummyComponent = () => {
  const location = useLocation(); // Get the current location
  const navigate = useNavigate();
  const { setUserEmail,setUserPicture,setUserName } = useUser();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const email = queryParams.get('email');
    const picture = queryParams.get('picture')
    const name = queryParams.get('name')
    console.log(email);
    console.log(picture);
    console.log(name);
    setUserEmail(email || '');
    setUserPicture(picture || '')
    setUserName(name || '')
    navigate('/user');
  }, [location, navigate, setUserEmail]);

  return <div>Loading...</div>;
};

export default UserDummyComponent;
