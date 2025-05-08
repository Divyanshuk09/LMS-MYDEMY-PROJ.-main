import React from "react";
import logo from "/LOGO.png";
import { FaXTwitter, FaFacebookF, FaInstagram } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { useTheme } from "../../Context/ThemeContext";

const Footer = () => {
  const { isDark } = useTheme();

  const iconClass = isDark
    ? "text-white hover:bg-gray-800"
    : "text-gray-700 hover:bg-gray-100";

  return (
    <footer
      className={`flex flex-col-reverse md:flex-row justify-between items-center px-4 md:px-10 py-4 border-t ${
        isDark
          ? "bg-gray-900 text-white border-white"
          : "bg-white text-gray-700 border-gray-200"
      } text-sm`}
    >
      {/* Left side: Logo and text */}
      <div className="flex items-center gap-2">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="Logo" className="h-8 w-12 rounded-full p-1" />
          <span
            className={`font-semibold ${
              isDark ? "text-white" : "text-black"
            } text-base md:block hidden`}
          >
            MyDemy
          </span>
        </Link>
        <span className="hidden md:inline-block border-l h-4 mx-2 border-gray-400" />
        <span className="text-xs md:text-sm text-gray-500">
          All right reserved. Copyright @MyDemy
        </span>
      </div>

      {/* Right side: Socials */}
      <div className="flex gap-2 mt-2 md:mt-0">
        <a
          href="#"
          className={`border p-2 rounded-full cursor-pointer ${iconClass}`}
        >
          <FaFacebookF className="text-sm" />
        </a>
        <a
          href="#"
          className={`border p-2 rounded-full cursor-pointer ${iconClass}`}
        >
          <FaXTwitter className="text-sm" />
        </a>
        <a
          href="#"
          className={`border p-2 rounded-full cursor-pointer ${iconClass}`}
        >
          <FaInstagram className="text-sm" />
        </a>
      </div>
    </footer>
  );
};

export default Footer;
