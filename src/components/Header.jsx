// src/components/Header.jsx
import React from "react";
import { Avatar } from "flowbite-react";
import { HiOutlineUser } from "react-icons/hi2";

const Header = () => {
  return (
    <header className="flex items-center justify-between P-2 bg-[#172e75] shadow-md text-white">
      {/* Logo */}
      <div className="flex items-center ">
        <img
          src="/src/assets/logo/logo2.png" // replace with your logo path
          alt="Logo"
          className="h-30 w-30 rounded-full"
        />
        <span className="text-xl font-semibold"></span>
      </div>

      {/* User profile */}
      <div className="flex items-center space-x-2 mr-10">
        <span className="font-medium">Chamith Sandeepa</span>
        <HiOutlineUser className="w-6 h-6 text-white" />
      </div>
    </header>
  );
};

export default Header;
