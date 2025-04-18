import React, { useContext, useEffect, useState } from "react";
import Footer from "../../Components/Student/Footer";
import { Link, useNavigate, useParams } from "react-router-dom";
import CourseCard from "../../Components/Student/CourseCard";
import { AppContext } from "../../Context/AppContext";
import SearchBar from "../../Components/Student/SearchBar";
import { MdCancel } from "react-icons/md";

const CourseList = ({ data }) => {
  const navigate = useNavigate();
  const { allcourses } = useContext(AppContext);
  const { input } = useParams();
  // console.log(allcourses);
  const [filteredCourse, setFilteredCourse] = useState([]);

  useEffect(() => {
    if (allcourses && allcourses.length > 0) {
      const tempcourses = allcourses.slice();

      input
        ? setFilteredCourse(
            tempcourses.filter((item) =>
              item.courseTitle.toLowerCase().includes(input.toLowerCase())
            )
          )
        : setFilteredCourse(tempcourses);
    }
  }, [allcourses, input]);

  return (
    <>
      <div className="relative md:px-36 sm:px-12 md:pt-20 pt-5 text-left">
        <div className="flex md:flex-row flex-col gap-6 items-start px-4 md:px-0 justify-between w-full">
          <div>
            <h1 className="md:text-4xl text-2xl font-semibold ">Course List</h1>
            <p className="text-gray-500">
              <span onClick={() => navigate("/")} className="text-blue-500">
                Home
              </span>
              {" / "}
              <span>Course List</span>
            </p>
          </div>
          <SearchBar data={input} />
        </div>
        {input && (
          <div className="inline-flex items-center gap-4 px-4 ml-4 md:ml-0 mt-2 md:py-2 border md:mt-8 md:-mb-8 text-gray-800">
            <p>{input}</p>
            <span onClick={() => navigate("/course-list")} className="cursor-pointer">
              <MdCancel />
            </span>
          </div>
        )}
        <div className="flex flex-col items-center w-full">
          <div className="list grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 my-8 gap-3 px-2 md:p-0">
            {filteredCourse.map((course, index) => (
              <CourseCard key={index} course={course} />
            ))}
          </div>

          <button className="text-gray-500 border cursor-pointer border-gray-500/30 px-10 py-3 rounded hover:bg-gray-200 hover:underline">
            Load More
          </button>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CourseList;
