import React from "react";
import logo from "/LOGO.png";
import { FaUserCircle } from "react-icons/fa";
// import { dummyEducatorData } from "../../assets/assets";
import { Link, NavLink } from "react-router-dom";
import { UserButton, useUser } from "@clerk/clerk-react";

const Navbar = () => {
  // const educatorData = dummyEducatorData;
  const { user } = useUser();

  return (
    <>
      <div className="flex items-center justify-between px-4 sm:px-10 border-b border-gray-500 py-4 ">
        <Link title="Home" to={"/"} className="flex items-center">
          <img src={logo} className="h-8 w-12" alt="Logo" />
          <span className="text-black/80 text-lg hidden md:block lg:block sm:block font-semibold">
            MyDemy
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <p> 👋 Hi ! {user ? user.firstName : "Developer"}</p>
          {user ? <UserButton /> : <FaUserCircle />}
        </div>
      </div>
    </>
  );
};

export default Navbar;
