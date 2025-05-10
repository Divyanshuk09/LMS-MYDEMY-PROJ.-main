import React, { useContext, useEffect, useState } from "react";
// import { dummyStudentEnrolled } from "../../assets/assets";
import Loading from "../../Components/Student/Loading";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContext } from "../../Context/AppContext";
import { useTheme } from "../../Context/ThemeContext";

const StudentEnrolled = () => {
  const [enrolledStudents, setEnrolledStudents] = useState(null);
  const { backendUrl, getToken, isEducator } = useContext(AppContext);
  const { isDark } = useTheme();
  const fetchenrolledstudents = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get(
        backendUrl + "/api/educator/enrolled-students",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log(data);
      if (data.success) {
        setEnrolledStudents(data.enrolledStudents.reverse());
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (isEducator) {
      fetchenrolledstudents();
    }
  }, [isEducator]);

  return enrolledStudents ? (
    <>
      <div className="h-fit flex flex-col items-start justify-between md:p-8 md:pb-0 p-0 md:pt-8 pt-0 pb-0">
        <div className="w-full">
          <h2
            className={`text-lg font-medium pb-4 ${
              isDark ? "text-white" : "text-black"
            }`}
          >
            Enrolled Students
          </h2>
          <div className="relative overflow-x-scroll">
            <table
              className={`w-full text-sm text-left rtl:text-right ${
                isDark ? "text-white" : "text-gray-500"
              }`}
            >
              <thead
                className={`${
                  isDark
                    ? "bg-gray-800 text-gray-300"
                    : "bg-gray-200 text-gray-700"
                } text-xs uppercase`}
              >
                <tr>
                  <th scope="col" className="px-6 py-3">
                    #
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Student Name
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Course Title
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Purchased on
                  </th>
                </tr>
              </thead>
              <tbody>
                {enrolledStudents.map((item, index) => (
                  <tr
                    key={index}
                    className={`border-b ${
                    isDark
                      ? "bg-gray-600/20 border-gray-600"
                      : "bg-gray-100 border-gray-300"
                  }`}
                  >
                    <th
                      scope="row"
                      className={`px-6 py-4 font-medium whitespace-nowrap ${
                        isDark ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {index + 1}
                    </th>
                    <td
                      className={`px-6 py-4 flex items-center gap-3 ${
                        isDark ? "text-white" : "text-gray-900"
                      }`}
                    >
                      <img
                        src={item.student?.imageUrl || "default-profile.png"}
                        alt="profile"
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <span>{item.student?.name || "Unknown Student"}</span>
                    </td>
                    <td
                      className={`px-6 py-4 ${
                        isDark ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {item.courseTitle}
                    </td>
                    <td
                      className={`px-6 py-4 ${
                        isDark ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {new Date(item.purchaseDate).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  ) : (
    <Loading />
  );
};

export default StudentEnrolled;
