import React, { useContext } from "react";
import logo from "/LOGO.png";
import { Link, useLocation } from "react-router-dom";
import { FaMoon, FaSun, FaUserCircle } from "react-icons/fa";
import { useClerk, UserButton, useUser } from "@clerk/clerk-react";
import { AppContext } from "../../Context/AppContext";
import { toast } from "react-toastify";
import axios from "axios";
import { useTheme } from "../../Context/ThemeContext";

const Navbar = () => {
  const { isDark, toggleTheme } = useTheme();

  const location = useLocation();
  const isCourseListPage = location.pathname.includes("/course-list");

  const { openSignIn } = useClerk();
  const { user } = useUser();

  const { isEducator, setIsEducator, navigate, backendUrl, getToken } =
    useContext(AppContext);

  const becomeEducator = async () => {
    if (isEducator) {
      navigate("/educator");
      return;
    }

    try {
      const token = await getToken();

      const { data } = await axios.get(
        `${backendUrl}/api/educator/update-role`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (data.success) {
        setIsEducator(true);
        toast.success(data.message);
        navigate("/educator");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to update role"
      );
    }
  };

  return (
    <>
      <div
        className={`flex items-center justify-between px-4 sm:px-10 md:px-14 lg:px-36 border-b border-gray-500 py-4
    ${
      isCourseListPage
        ? isDark
          ? "bg-gray-900 "
          : "bg-white "
        : isDark
        ? "bg-cyan-900/70 "
        : "bg-cyan-300/70 "
    }
  `}
      >
        <a href="/" className="flex items-center">
          <img src={logo} className="h-12 w-12" alt="Logo" />
        </a>

        {/* Desktop view */}
        <div
          className={`hidden md:flex ${
            isDark ? "text-gray-300" : "text-gray-700"
          } gap-8 items-center`}
        >
          {user && (
            <div className="flex items-center gap-5">
              <button
                onClick={becomeEducator}
                className=" hover:underline cursor-pointer"
              >
                {isEducator ? "Educator Dashboard" : "Become Educator"}
              </button>{" "}
              |
              <Link to="/my-enrollments" className=" hover:underline">
                My Enrollments
              </Link>
            </div>
          )}

          <div className="flex gap-2">
            {user ? (
              <UserButton />
            ) : (
              <button
                onClick={() => openSignIn()}
                className="bg-blue-500 text-white px-5 py-2 rounded-full hover:bg-blue-600"
              >
                Log in
              </button>
            )}
            <button
              className={`p-2 rounded-full text-black  cursor-pointer ${
                isDark
                  ? "bg-gray-800/20 hover:bg-gray-700/50"
                  : "bg-gray-200 hover:bg-gray-300"
              } `}
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

        {/* Mobile View */}
        <div
          className={`md:hidden flex items-center gap-2 sm:gap-5  ${
            isDark ? "text-gray-300" : "text-gray-700"
          }`}
        >
          {user && (
            <div className="text-sm flex gap-2">
              <button
                onClick={becomeEducator}
                className="hover:text-gray-900 hover:underline cursor-pointer"
              >
                {isEducator ? "Educator Dashboard" : "Become Educator"}
              </button>{" "}
              |
              <Link
                to="/my-enrollments"
                className="hover:text-gray-900 hover:underline"
              >
                My Enrollments
              </Link>
            </div>
          )}

          {user ? (
            <UserButton />
          ) : (
            <button
              onClick={() => openSignIn()}
              className="text-cyan-400 hover:text-cyan-300"
            >
              <div className="flex items-center gap-1">
                <FaUserCircle size={25} />
                <p className="text-black hover:underline cursor-pointer">
                  Login
                </p>
              </div>
            </button>
          )}
          <button
            className="bg-gray-200 text-black p-2 rounded-full"
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
