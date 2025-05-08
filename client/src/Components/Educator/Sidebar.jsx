import React, { useContext } from "react";
import { RiHome5Line } from "react-icons/ri";
import { TiDocumentAdd } from "react-icons/ti";
import { GrDocumentUser } from "react-icons/gr";
import { LuUserRoundCheck } from "react-icons/lu";
import { NavLink } from "react-router-dom";
import { AppContext } from "../../Context/AppContext";
import { useTheme } from "../../Context/ThemeContext";

const Sidebar = () => {
  const { isEducator } = useContext(AppContext);
  const { isDark } = useTheme();

  const baseLink = `flex items-center md:flex-row flex-col md:justify-start justify-center py-3.5 md:px-10 gap-3 ${
    isDark ? "hover:text-white" : "hover:text-blue-500"
  }`;

  return (
    isEducator && (
      <div
        className={`md:w-64 w-16 border-r min-h-screen text-base py-2 flex flex-col ${
          isDark
            ? "border-white bg-gray-900 text-white"
            : "border-gray-500 bg-white text-gray-900"
        }`}
      >
        <ul>
          <li>
            <NavLink
              title="Dashboard"
              to="/educator/"
              className={({ isActive }) =>
                `${baseLink} ${
                  isActive
                    ? isDark
                      ? "bg-gray-800 text-white border-r-[6px] border-indigo-500/90"
                      : "bg-gray-200 text-black border-r-[6px] border-indigo-500/90"
                    : isDark
                    ? "hover:bg-gray-800 text-white border-white hover:border-gray-800 border-r-[6px]"
                    : "hover:bg-gray-100/90 text-black border-white hover:border-gray-100/90 border-r-[6px]"
                }`
              }
            >
              <RiHome5Line className="w-6 h-6" />
              <span className="hidden md:inline">Dashboard</span>
            </NavLink>
          </li>

          <li>
            <NavLink
              title="Add course"
              to="/educator/add-course"
              className={({ isActive }) =>
                `${baseLink} ${
                  isActive
                    ? isDark
                      ? "bg-gray-800 text-white border-r-[6px] border-indigo-500/90"
                      : "bg-gray-200 text-black border-r-[6px] border-indigo-500/90"
                    : isDark
                    ? "hover:bg-gray-800 text-white border-white hover:border-gray-800 border-r-[6px]"
                    : "hover:bg-gray-100/90 text-black border-white hover:border-gray-100/90 border-r-[6px]"
                }`
              }
            >
              <TiDocumentAdd className="w-6 h-6" />
              <span className="hidden md:inline">Add Course</span>
            </NavLink>
          </li>

          <li>
            <NavLink
              title="My courses"
              to="/educator/my-courses"
              className={({ isActive }) =>
                `${baseLink} ${
                  isActive
                    ? isDark
                      ? "bg-gray-800 text-white border-r-[6px] border-indigo-500/90"
                      : "bg-gray-200 text-black border-r-[6px] border-indigo-500/90"
                    : isDark
                    ? "hover:bg-gray-800 text-white border-white hover:border-gray-800 border-r-[6px]"
                    : "hover:bg-gray-100/90 text-black border-white hover:border-gray-100/90 border-r-[6px]"
                }`
              }
            >
              <GrDocumentUser className="w-6 h-6" />
              <span className="hidden md:inline">My Course</span>
            </NavLink>
          </li>

          <li>
            <NavLink
              title="Student Enrolled"
              to="/educator/student-enrolled"
              className={({ isActive }) =>
                `${baseLink} ${
                  isActive
                    ? isDark
                      ? "bg-gray-800 text-white border-r-[6px] border-indigo-500/90"
                      : "bg-gray-200 text-black border-r-[6px] border-indigo-500/90"
                    : isDark
                    ? "hover:bg-gray-800 text-white border-white hover:border-gray-800 border-r-[6px]"
                    : "hover:bg-gray-100/90 text-black border-white hover:border-gray-100/90 border-r-[6px]"
                }`
              }
            >
              <LuUserRoundCheck className="w-6 h-6" />
              <span className="hidden md:inline">Student Enrolled</span>
            </NavLink>
          </li>
        </ul>
      </div>
    )
  );
};

export default Sidebar;
