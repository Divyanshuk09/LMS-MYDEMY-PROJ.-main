import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../Context/AppContext";
import Loading from "../../Components/Student/Loading";

const MyCourses = () => {
  const { currency, allcourses } = useContext(AppContext);
  const [courses, setCourses] = useState(null);

  const fetchEducatorCourses = async () => {
    setCourses(allcourses);
  };

  useEffect(() => {
    fetchEducatorCourses();
  }, []);

  return courses ? (
    <>
      <div className="h-fit flex flex-col items-start justify-between md:p-8 md:pb-0 p-0 md:pt-8 pt-0 pb-0">
        <div className="w-full">
          <h2 className="text-lg font-medium pb-4">My Courses</h2>
           <div className="relative overflow-x-scroll">
              <table className="w-full text-sm text-left rtl:text-right text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-gray-200 ">
                  <tr>
                    <th scope="col" className="px-6 py-3">
                      All Courses
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Earnings
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Students
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Published On
                    </th>
                  </tr>
                </thead>
                <tbody className="text-sm text-gray-500">
                  {courses.map((course) => (
                    <tr
                      key={course._id}
                      className="border-b text-gray-500 border-gray-500/40 "
                    >
                      <th
                      scope="row"
                      className="px-6 py-4 flex items-center gap-2 font-medium text-gray-900 whitespace-nowrap "
                    >
                        <img
                          src={course.courseThumbnail}
                          alt="course Image"
                          className="w-16"
                        />
                        <span className="truncate ">
                          {course.courseTitle}
                        </span>
                      </th>

                      <td className="px-6 py-4 text-gray-900">
                        {currency}{" "}
                        {Math.floor(
                          // Earnings = Total Students × (Original Price - (Discount % × Original Price)/ 100)
                          course.enrolledStudents.length *
                            (course.coursePrice -
                              (course.discount * course.coursePrice) / 100)
                        )}
                      </td>

                      <td className="px-6 py-4 text-gray-900">
                        {course.enrolledStudents.length}
                      </td>
                      <td className="px-6 py-4 text-gray-900">
                        {new Date(course.createdAt).toLocaleDateString()}
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

export default MyCourses;
