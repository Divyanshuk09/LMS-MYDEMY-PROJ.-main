import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../Context/AppContext";
import Loading from "../../Components/Student/Loading";
import axios from "axios";
import { BsThreeDotsVertical } from "react-icons/bs";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../Context/ThemeContext";

const MyCourses = () => {
  const { currency, backendUrl, getToken, isEducator } = useContext(AppContext);
  const [courses, setCourses] = useState(null);
  const [showPopUp, setShowPopUp] = useState({});
  const [delbtn, setDelbtn] = useState("Delete");
  const { isDark } = useTheme();
  const navigate = useNavigate();

  const fetchEducatorCourses = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get(
        `${backendUrl}/api/educator/my-courses`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (data.success) {
        setCourses(data.courses);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (isEducator) {
      fetchEducatorCourses();
    }
  }, [isEducator]);

  const openmodel = (courseId) => {
    setShowPopUp((prev) => ({
      ...prev,
      [courseId]: !prev[courseId],
    }));
  };

  const handleDelete = async (courseId) => {
    try {
      setDelbtn("Deleting...");

      const token = await getToken();
      const res = await axios.delete(
        `${backendUrl}/api/educator/remove-course`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          data: { courseId },
        }
      );

      if (res.data.success) {
        toast.success("Course deleted successfully!");
        fetchEducatorCourses(); // Re-fetch courses after deletion
      } else {
        toast.error(res.data.message);
      }
      setDelbtn("Delete"); // Reset button text after the action
    } catch (err) {
      if (err.response && err.response.status === 409) {
        toast.error("Cannot delete course. Students are enrolled.");
      } else {
        toast.error("Failed to delete course");
      }
      setDelbtn("Delete"); // Reset button text if there's an error
    }
  };

  return courses ? (
    <div className="h-fit flex flex-col items-start justify-between md:p-8 md:pb-10 p-0 md:pt-2 pt-0 pb-0">
      <div className="w-full">
        <h2
          className={`${
            isDark ? "text-gray-300" : "text-black"
          } text-lg font-medium pb-4`}
        >
          My Courses
        </h2>

        <div className="relative overflow-x-auto pb-10">
          <table
            className={`w-full text-sm ${
              isDark ? "text-gray-300" : "text-gray-500"
            }`}
          >
            <thead
              className={`text-xs uppercase ${
                isDark
                  ? "bg-gray-700 text-gray-300"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              <tr>
                <th className="px py-3">#</th>
                <th className="px-6 py-3 text-left">Courses</th>
                <th className="px-6 py-3 text-left">Earnings</th>
                <th className="px-6 py-3 text-left">Students</th>
                <th className="px-6 py-3 text-left">Published On</th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course) => (
                <tr
                  key={course._id}
                  className={`border-b ${
                    isDark
                      ? "hover:bg-gray-600/20 border-gray-600"
                      : "hover:bg-gray-100 border-gray-300"
                  }`}
                >
                  {/* Number */}
                  <td className="px-4 py-4">{courses.indexOf(course) + 1}</td>

                  {/* Course Thumbnail & Title */}
                  <td
                    onClick={() =>
                      navigate(`/educator/my-courses/${course._id}`)
                    }
                    className="px-6 py-4 whitespace-nowrap cursor-pointer flex items-center gap-3"
                  >
                    <img
                      src={course.courseThumbnail}
                      alt="course"
                      className="w-16 rounded"
                    />
                    <span
                      className={`truncate ${
                        isDark ? "text-gray-300" : "text-gray-900"
                      }`}
                    >
                      {course.courseTitle}
                    </span>
                  </td>

                  {/* Earnings */}
                  <td
                    onClick={() =>
                      navigate(`/educator/my-courses/${course._id}`)
                    }
                    className={`px-6 py-4 cursor-pointer ${
                      isDark ? "text-gray-300" : "text-gray-900"
                    }`}
                  >
                    {currency}{" "}
                    {Math.floor(
                      course.enrolledStudents.length *
                        (course.coursePrice -
                          (course.discount * course.coursePrice) / 100)
                    )}
                  </td>

                  {/* Students */}
                  <td
                    onClick={() =>
                      navigate(`/educator/my-courses/${course._id}`)
                    }
                    className={`px-6 py-4 cursor-pointer ${
                      isDark ? "text-gray-300" : "text-gray-900"
                    }`}
                  >
                    {course.enrolledStudents.length}
                  </td>

                  {/* Published Date */}
                  <td
                    onClick={() =>
                      navigate(`/educator/my-courses/${course._id}`)
                    }
                    className={`px-6 py-4 cursor-pointer ${
                      isDark ? "text-gray-300" : "text-gray-900"
                    }`}
                  >
                    {new Date(course.createdAt).toLocaleDateString()}
                  </td>

                  {/* Three Dots Menu */}
                  <td className="py-4 relative">
                    <div
                      className="bg-gray-600 p-2 w-fit rounded-full text-white cursor-pointer hover:bg-gray-700 transition"
                      onClick={() => openmodel(course._id)}
                    >
                      <BsThreeDotsVertical />
                    </div>

                    {showPopUp[course._id] && (
                      <div className="absolute top-12 right-0 mt-2 w-fit bg-white shadow-lg  z-10">
                        <button
                          disabled={delbtn !== "Delete"}
                          className="w-full text-black py-2 px-4 hover:bg-red-400 text-sm text-left"
                          onClick={() => handleDelete(course._id)}
                        >
                          {delbtn}
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  ) : (
    <Loading />
  );
};

export default MyCourses;
