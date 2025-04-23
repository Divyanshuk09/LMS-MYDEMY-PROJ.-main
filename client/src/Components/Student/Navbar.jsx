import React, { useContext } from "react";
import logo from "/LOGO.png";
import { Link, useLocation } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import { useClerk, UserButton, useUser } from "@clerk/clerk-react";
import { AppContext } from "../../Context/AppContext";
import { toast } from "react-toastify";
import axios from "axios";

const Navbar = () => {
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
      console.error("Error updating role:", error);
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
        className={`flex items-center justify-between px-4 sm:px-10 md:px-14 lg:px-36 border-b border-gray-500 py-4 ${
          isCourseListPage ? "bg-white" : "bg-cyan-200/70"
        }`}
      >
        <Link to={"/"} className="flex items-center">
          <img src={logo} className="h-8 w-12" alt="Logo" />
          <span className="text-black/80 text-lg hidden md:block lg:block sm:block font-semibold">
            MyDemy
          </span>
        </Link>

        {/* Desktop view */}
        <div className="hidden md:flex text-gray-700 gap-8 items-center">
          {user && (
            <div className="flex items-center gap-5">
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
              className="bg-blue-500 text-white px-5 py-2 rounded-full hover:bg-blue-600"
            >
              Create Account
            </button>
          )}
        </div>

        {/* Mobile View */}
        <div className="md:hidden flex items-center gap-2 sm:gap-5 text-gray-700">
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
              <FaUserCircle size={25} />
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;
