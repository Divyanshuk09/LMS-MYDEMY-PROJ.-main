import React from "react";
import Navbar from "../../Components/Educator/Navbar";
import Sidebar from "../../Components/Educator/Sidebar";
import Footer from "../../Components/Educator/Footer";
import { Outlet } from "react-router-dom";
import { useTheme } from "../../Context/ThemeContext";

const Educator = () => {
  const { isDark } = useTheme();
  return (
    <div
      className={`text-default h-screen flex flex-col ${
        isDark ? "bg-gray-900/50" : "bg-white"
      }`}
    >
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <div className="flex-1 overflow-y-auto p-5">
          <Outlet />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Educator;
