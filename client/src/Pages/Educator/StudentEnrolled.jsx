import React, { useContext, useEffect, useState } from "react";
// import { dummyStudentEnrolled } from "../../assets/assets";
import Loading from "../../Components/Student/Loading";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContext } from "../../Context/AppContext";

const StudentEnrolled = () => {
  const [enrolledStudents, setEnrolledStudents] = useState(null);
  const { backendUrl, getToken, isEducator } = useContext(AppContext);
  const fetchenrolledstudents = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get(
        backendUrl + "/api/educator/enrolled-students",
        { headers: { Authorization: `Bearer ${token}` } }
      );
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
          <h2 className="text-lg font-medium pb-4">Enrolled Students</h2>
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
                  <th scope="col" className="px-6 py-3">
                    Purchased on
                  </th>
                </tr>
              </thead>
              <tbody>
                {enrolledStudents.map((item, index) => (
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
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <span>{item.student?.name || "Unknown Student"}</span>
                    </td>
                    <td className="px-6 py-4 text-gray-900">
                      {item.courseTitle}
                    </td>
                    <td className="px-6 py-4 text-gray-900">
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
