import React from "react";
import logo from "/LOGO.png";
import { FaUserCircle } from "react-icons/fa";
// import { dummyEducatorData } from "../../assets/assets";
import { Link, NavLink } from "react-router-dom";
import { UserButton, useUser } from "@clerk/clerk-react";
import { useTheme } from "../../Context/ThemeContext";
import { FaSun, FaMoon } from "react-icons/fa";

const Navbar = () => {
  // const educatorData = dummyEducatorData;
  const { user } = useUser();
  const { isDark, toggleTheme } = useTheme();

  return (
    <>
      <div
        className={`flex items-center justify-between px-4 sm:px-10 border-b ${
          isDark ? "border-white" : "border-gray-500"
        } py-4 `}
      >
        <a href="/" className="flex items-center">
          <img src={logo} className="h-12 w-12" alt="Logo" />
        </a>

        <div
          className={`flex items-center gap-2 ${
            isDark ? "text-white" : "text-black"
          }`}
        >
          <p> 👋 Hi ! {user ? user.firstName : "Developer"}</p>
          {user ? <UserButton /> : <FaUserCircle />}
          <button
            className={`p-2 rounded-full ${
              isDark
                ? "bg-gray-800/20 hover:bg-gray-700/50"
                : "bg-gray-200 hover:bg-gray-300"
            }  text-black cursor-pointer bg-gray-200`}
            onClick={toggleTheme}
          >
            {isDark ? (
              <FaSun className="text-yellow-400" />
            ) : (
              <FaMoon className="text-gray-800" />
            )}
          </button>
        </div>
      </div>
    </>
  );
};

export default Navbar;
