import React, { useContext } from "react";
import { RiHome5Line } from "react-icons/ri";
import { TiDocumentAdd } from "react-icons/ti";
import { GrDocumentUser } from "react-icons/gr";
import { LuUserRoundCheck } from "react-icons/lu";
import { NavLink } from "react-router-dom";
import { AppContext } from "../../Context/AppContext";

const Sidebar = () => {
  const { isEducator } = useContext(AppContext);

  return (
    isEducator && (
      <div className="md:w-64 w-16 border-r min-h-screen text-base border-gray-500 py-2 flex flex-col">
        <ul className="">
          <li>
            <NavLink
            title="Dashboard"
              to="/educator/"
              className={({ isActive }) =>
                `flex items-center md:flex-row flex-col md:justify-start justify-center py-3.5 md:px-10 gap-3 hover:text-blue-500 ${
                  isActive
                    ? "bg-indigo-50 border-r-[6px] border-indigo-500/90"
                    : "hover:bg-gray-100/90 border-r-[6px] border-white hover:border-gray-100/90"
                }`
              }
            >
              <RiHome5Line className="w-6 h-6 " />
              <span className="hidden md:inline">Dashboard</span>
            </NavLink>
          </li>
          <li>
            <NavLink
            title="Add course"
              to="/educator/add-course"
              className={({ isActive }) =>
                `flex items-center md:flex-row flex-col md:justify-start justify-center py-3.5 md:px-10 gap-3 hover:text-blue-500 ${
                  isActive
                    ? "bg-indigo-50 border-r-[6px] border-indigo-500/90"
                    : "hover:bg-gray-100/90 border-r-[6px] border-white hover:border-gray-100/90"
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
                `flex items-center md:flex-row flex-col md:justify-start justify-center py-3.5 md:px-10 gap-3 hover:text-blue-500 ${
                  isActive
                    ? "bg-indigo-50 border-r-[6px] border-indigo-500/90"
                    : "hover:bg-gray-100/90 border-r-[6px] border-white hover:border-gray-100/90"
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
                `flex items-center md:flex-row flex-col md:justify-start justify-center py-3.5 md:px-10 gap-3 hover:text-blue-500 ${
                  isActive
                    ? "bg-indigo-50 border-r-[6px] border-indigo-500/90"
                    : "hover:bg-gray-100/90 border-r-[6px] border-white hover:border-gray-100/90"
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
