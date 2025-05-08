import React, { useContext, useEffect, useState } from "react";
import student from "../../assets/student.png";
import money from "../../assets/money.png";
import book from "../../assets/book.png";
import { AppContext } from "../../Context/AppContext";
import Loading from "../../Components/Student/Loading";
import axios from "axios";
import { toast } from "react-toastify";
import { useTheme } from "../../Context/ThemeContext";

const Dashboard = () => {
  const { currency, backendUrl, getToken, isEducator } = useContext(AppContext);
  const { isDark } = useTheme();
  const [dashboardData, setDashboardData] = useState(null);

  const fetchDashboardData = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get(`${backendUrl}/api/educator/dashboard`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) {
        setDashboardData(data.dashboardData);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (isEducator) {
      fetchDashboardData();
    }
  }, [isEducator]);

  return dashboardData ? (
    <div className={`space-y-5 w-full ${isDark ? "text-white" : ""}`}>
      <div className="flex flex-wrap gap-5 items-center justify-center sm:justify-start">
        {/* Card */}
        {[
          {
            icon: student,
            label: "Total Enrollments",
            value: dashboardData.enrolledStudentsData.length,
          },
          {
            icon: book,
            label: "Total Courses",
            value: dashboardData.totalcourses,
          },
          {
            icon: money,
            label: "Total Earnings",
            value: `${currency}${Math.floor(
              dashboardData.totalEarnings
            ).toFixed(2)}`,
          },
        ].map((item, i) => (
          <div
            key={i}
            className={`flex items-center gap-3 shadow-lg border border-blue-500 p-2 md:p-4 w-full sm:w-56 rounded-md ${
              isDark ? " text-white" : "bg-white"
            }`}
          >
            <img
              src={item.icon}
              alt=""
              className="md:w-10 md:h-10 h-8 w-8 rounded"
            />
            <div className="flex flex-col">
              <p className="text-2xl font-medium">{item.value}</p>
              <p className="text-base text-gray-500">{item.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="h-fit flex flex-col items-start justify-between md:p-8 md:pb-0 p-0 md:pt-8 pt-0 pb-0">
        <div className="w-full">
          <h2 className="text-lg font-medium pb-4 mt-4">Latest Enrollments</h2>
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
                </tr>
              </thead>
              <tbody>
                {dashboardData.enrolledStudentsData.map((item, index) => (
                  <tr
                    key={index}
                    className={`border-b ${
                      isDark ? "border-gray-700" : "border-gray-500/40"
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
                      className={`px-6 py-4 flex items-center gap-1 ${
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <Loading />
  );
};

export default Dashboard;
