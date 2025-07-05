import { Navbar } from "flowbite-react";
import { Link } from "react-router-dom";
import React from "react";

const Header = () => {
  return;
  <Navbar className="border-b-2">
    <Link to="/" className="self-center text-sm sm:text-xl font-semibold">
      <span className="px-2">Yochira Clothing</span>
    </Link>
  </Navbar>;
};

export default Header;
