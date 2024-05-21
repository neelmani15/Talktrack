import React from 'react';
import Profile from './profile';

const Navbar = () => {
  return (
    <nav className="bg-gray-800 p-4 flex justify-between items-center">
      <h1 className="text-white text-xl">Riktam.ai</h1>
      <Profile />
    </nav>
  );
};

export default Navbar;
