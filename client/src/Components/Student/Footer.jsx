import React from "react";
import logo from "/LOGO.png";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-900 md:px-36 text-left w-full mt-10">
      <div className="flex flex-col md:flex-row items-start px-8 md:px-0 justify-center gap-10 md:gap-32 py-10 border-b border-white/30">
        {/* Logo & Description */}
        <div className="w-full flex md:items-start items-center flex-col ">
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="Logo" className="h-8 w-8 bg-[#89898991] rounded-full" />
            <span className="text-white text-lg font-bold">MyDemy</span>
          </Link>

          <p className="mt-6 text-center md:text-left text-sm text-white/80">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Magni
            animi, maiores dolores dolor error repellendus delectus, corporis
            quasi, unde necessitatibus quia magnam sit accusantium ipsa nisi
            incidunt vel nihil eos.
          </p>
        </div>

        {/* Company Links */}
        <div className="flex flex-col md:items-start items-center w-full">
          <h2 className="text-white mb-5 font-semibold">Company</h2>
          <ul className="flex  md:flex-col w-full justify-between md:text-sm text-xs text-white/80 md:space-y-2">
            <Link to="/" className="hover:underline">Home</Link>
            <Link to="/about" className="hover:underline">About us</Link>
            <Link to="/contact" className="hover:underline">Contact us</Link>
            <Link to="/privacy" className="hover:underline">Privacy policy</Link>
          </ul>
        </div>

        {/* Newsletter */}
        <div className="md:flex flex-col hidden md:items-start w-full">
          <h2 className="text-white/80 font-semibold mb-5">
            Subscribe to our newsletter
          </h2>
          <p className="text-sm text-white/60">
            The latest news, articles, and resources, sent to your inbox weekly.
          </p>
          <div className="flex items-center gap-2 pt-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="border border-gray-500/30 bg-gray-800 text-gray-500 placeholder-gray-500 outline-none w-64 h-9 rounded px-2 text-sm"
            />
            <button className="bg-[#2563EB] hover:bg-[#1d4ed8] w-24 h-9 text-white rounded-r-md text-sm cursor-pointer">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      <p className="py-4 text-center text-xs md:text-sm text-white/60">
        Copyright 2024 © MyDemy. All Right Reserved.
      </p>
    </footer>
  );
};

export default Footer;
