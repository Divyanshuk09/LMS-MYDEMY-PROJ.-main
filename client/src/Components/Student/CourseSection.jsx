import React, { useContext } from "react";
import CourseCard from "./CourseCard";
import { Link } from "react-router-dom";
import { AppContext } from "../../Context/AppContext";

const CourseSection = () => {
  const { allcourses } = useContext(AppContext);

  return (
    <>
      <div className="py-16 md:px-40 px-8">
        <h1 className="md:text-3xl text-lg  font-medium text-gray-800">
          Learn from the best
        </h1>
        <p className="text-sm  md:text-base text-gray-500 mt-3">
          Discover our top-rated courses across various categories. From coding
          and design to business <br /> and wellness, our couses are crafted to
          deliver
        </p>

        <div className="grid grid-cols-[repeat(auto-fit,_minmax(200px,_1fr))] px-4 md:px-0 md:my-16 my-10 gap-4">
          {allcourses.slice(0, 4).map((course, index) => (
            <CourseCard key={index} course={course} />
          ))}
        </div>

        <Link
          to={"/course-list"}
          onClick={() => scrollTo(0, 0)}
          className="text-gray-500 border border-gray-500/30 px-10 py-3 rounded"
        >
          Show all courses
        </Link>
        <div className="flex flex-wrap items-center justify-center gap-6 md:gap-8 md:mt-5 mt-5 max-w-2xl"></div>
      </div>
    </>
  );
};

export default CourseSection;
