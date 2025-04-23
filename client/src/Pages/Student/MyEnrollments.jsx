import React, { useContext, useEffect } from "react";
import { AppContext } from "../../Context/AppContext";
import { useState } from "react";
import { Line } from "rc-progress";
import Footer from "../../Components/Student/Footer";
import axios from "axios";
import { toast } from "react-toastify";

const MyEnrollments = () => {
  const {
    enrolledcourses,
    fetchUserEnrolledCourses,
    calculateCourseDuration,
    navigate,
    userData,
    backendUrl,
    getToken,
    calculateNoOfLectures,
  } = useContext(AppContext);

  const [progressArray, setProgressArray] = useState([]);

  const getcourseProgress = async () => {
    try {
      const token = await getToken();
      const tempProgressArray = await Promise.all(
        enrolledcourses.map(async (course) => {
          console.log("course:", course._id);
          const { data } = await axios.post(
            `${backendUrl}/api/user/get-course-progress`,
            { courseId: course._id },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          console.log(data);
          let totalLectures = calculateNoOfLectures(course);
          const lectureCompleted = data.progressData
            ? data.progressData.lectureCompleted.length
            : 0;
          return { totalLectures, lectureCompleted };
        })
      );
      setProgressArray(tempProgressArray);
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (userData) {
      fetchUserEnrolledCourses();
    }
  }, [userData]);

  useEffect(() => {
    if (enrolledcourses.length > 0) {
      getcourseProgress();
    }
  }, [enrolledcourses]);

  return (
    <>
      <div className="md:px-36 px-2 pt-10 ">
        <h1 className="text-2xl font-semibold">My Enrollments</h1>
        <table className="md:table-auto table-fixed w-full overflow-auto border mt-10">
          <thead className="text-gray-900 border-b border-gray-500/20 text-sm text-left">
            <tr>
              <th className="px-4 py-3 font font-semibold truncate">Course</th>
              <th className="px-4 py-3 font font-semibold truncate max-sm:hidden">
                Duration
              </th>
              <th className="px-4 py-3 font font-semibold truncate max-sm:hidden">
                Completed
              </th>
              <th className="px-4 py-3 font font-semibold truncate max-sm:text-right">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {enrolledcourses.map((course, index) => {
              const progress = progressArray[index];
              console.log("progress:", progress);
              const isCompleted =
                progress &&
                progress.lectureCompleted / progress.totalLectures === 1;
              const buttonText = isCompleted ? "Completed" : "On Going";
              const buttonColor = isCompleted ? "bg-red-600" : "bg-green-600";

              return (
                <tr key={index} className="border-gray-500/20 border-b ">
                  <td className="md:px-4 pl-2 md:pl-4 py-3 flex max-sm:flex-col max-sm:items-start items-center space-x-3">
                    <img
                      src={course.courseThumbnail}
                      alt=""
                      className="w-20 sm:w-24 md:w-28"
                    />
                    <div className="flex-1">
                      <p className="mb-1 max-sm:text-sm">
                        {course.courseTitle}
                      </p>
                      <Line
                        strokeLinecap="round"
                        strokeWidth={2}
                        percent={
                          progress
                            ? (progress.lectureCompleted * 100) /
                              progress.totalLectures
                            : 0
                        }
                      />{" "}
                    </div>
                  </td>
                  <td className="px-4 py-3 max-sm:hidden">
                    {calculateCourseDuration(course)}
                  </td>
                  <td className="px-4 py-3 max-sm:hidden">
                    {progressArray[index] &&
                      `${progressArray[index].lectureCompleted}/${progressArray[index].totalLectures}`}{" "}
                    <span className="font-semibold">Lectures</span>
                  </td>
                  <td className="px-4 py-3 max-sm:text-right">
                    <button
                      onClick={() => navigate("/player/" + course._id)}
                      className={` cursor-pointer px-3 sm:px-5 py-1.5 sm:py-2  max-sm:text-xs text-white rounded ${buttonColor}`}
                    >
                      {buttonText}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <Footer />
    </>
  );
};

export default MyEnrollments;
