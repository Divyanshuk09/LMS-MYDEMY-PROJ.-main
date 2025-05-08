import React, { useContext } from "react";
import { AppContext } from "../../Context/AppContext";
import { Link } from "react-router-dom";
import { IoMdStar, IoMdStarOutline } from "react-icons/io";
import { useTheme } from "../../Context/ThemeContext";
const CourseCard = ({ course }) => {
  const { currency, calculateRating } = useContext(AppContext);
  const { isDark } = useTheme();
  return (
    <>
      <Link
        to={"/course/" + course._id}
        onClick={() => scrollTo(0, 0)}
        className={`border ${
          isDark ? "border-white" : "border-gray-500/30"
        } pb-6 overflow-hidden rounded-lg shadow-md shadow-gray-400 z-10`}
      >
        <img className="w-full" src={course?.courseThumbnail} alt="" />
        <div className="p-3 text-left">
          <h3
            className={`${
              isDark ? "text-white" : "text-black"
            } md:text-base text-sm font-semibold`}
          >
            {course?.courseTitle}
          </h3>
          <p className="text-gray-500">By: {course?.educator?.name}</p>

          <div className="flex items-center space-x-2">
            <p className={`text-sm ${isDark ? "text-white" : "text-black"}`}>
              {calculateRating(course)}
            </p>
            <div className="flex text-sm">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="text-yellow-500">
                  {i < Math.floor(calculateRating(course)) ? (
                    <IoMdStar />
                  ) : (
                    <IoMdStarOutline />
                  )}
                </span>
              ))}
            </div>

            <p className="text-blue-500">({course?.courseRatings?.length})</p>
          </div>
          <p className="text-base font-semibold text-gray-500">
            {currency}
            {(
              course.coursePrice -
              (course.discount * course.coursePrice) / 100
            ).toFixed(2)}
          </p>
        </div>
      </Link>
    </>
  );
};

export default CourseCard;
