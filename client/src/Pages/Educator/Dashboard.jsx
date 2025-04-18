import React, { useContext, useEffect, useState } from "react";
import student from "../../assets/student.png";
import money from "../../assets/money.png";
import book from "../../assets/book.png";
import { AppContext } from "../../Context/AppContext";
import { dummyDashboardData } from "../../assets/assets";
import Loading from "../../Components/Student/Loading";

const Dashboard = () => {
  const { currency } = useContext(AppContext);
  const [dashboardData, setDashboardData] = useState(null);

  const fetchDashboardData = () => {
    setDashboardData(dummyDashboardData);
  };

  useEffect(() => {
    fetchDashboardData();
  }, [dashboardData]);

  return dashboardData ? (
    <>
        <div className="space-y-5 w-full">
          <div className="flex flex-wrap gap-5 items-center justify-center sm:justify-start">
            {/* Card 1 */}
            <div className="flex items-center gap-3 shadow-lg border border-blue-500 p-2 md:p-4 w-full sm:w-56 rounded-md">
              <img
                src={student}
                alt=""
                className="md:w-10 md:h-10 h-8 w-8 bg-gray-100 rounded"
              />
              <div className="flex flex-col">
                <p className="text-2xl font-medium text-gray-500">
                  {dashboardData.enrolledStudentsData.length}
                </p>
                <p className="text-base text-gray-500">Total Enrollments</p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="flex items-center gap-3 shadow-lg border border-blue-500 p-2 md:p-4 w-full sm:w-56 rounded-md">
              <img
                src={book}
                alt=""
                className="md:w-10 md:h-10 h-8 w-8 bg-gray-100 rounded"
              />
              <div className="flex flex-col">
                <p className="text-2xl font-medium text-gray-500">
                  {dashboardData.totalCourses}
                </p>
                <p className="text-base text-gray-500">Total Courses</p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="flex items-center gap-3 shadow-lg border border-blue-500 p-2 md:p-4 w-full sm:w-56 rounded-md">
              <img
                src={money}
                alt=""
                className="md:w-10 md:h-10 h-8 w-8 bg-gray-100 rounded"
              />
              <div className="flex flex-col">
                <p className="text-2xl font-medium text-gray-500 flex">
                  {currency}
                  <span>{dashboardData.totalEarnings}</span>
                </p>
                <p className="text-base text-gray-500">Total Earnings</p>
              </div>
            </div>
          </div>
        </div>

        {/* Latest Enrollments Table */}
        <div className="h-fit flex flex-col items-start justify-between md:p-8 md:pb-0 p-0 md:pt-8 pt-0 pb-0">
        <div className="w-full">
          <h2 className="text-lg font-medium pb-4 mt-4">Latest Enrollments</h2>
          <div className="relative overflow-x-scroll">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-gray-200 ">
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
                    className="border-b text-gray-500 border-gray-500/40 "
                  >
                    <th
                      scope="row"
                      className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap "
                    >
                      {index + 1}
                    </th>
                    <td className="px-6 py-4 text-gray-900 flex items-center gap-1">
                      <img
                        src={item.student?.imageUrl || "default-profile.png"}
                        alt="profile"
                        className="w-8 h-8 rounded-full object-cover "
                      />
                      <span>{item.student?.name || "Unknown Student"}</span>
                    </td>
                    <td className="px-6 py-4 text-gray-900">{item.courseTitle}</td>
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

export default Dashboard;
