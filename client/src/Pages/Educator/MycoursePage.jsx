import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContext } from "../../Context/AppContext";
import Loading from "../../Components/Student/Loading";
import { MdClose, MdPlayCircle } from "react-icons/md";
import { IoMdStar, IoMdStarOutline, IoIosArrowDown } from "react-icons/io";
import { LuAlarmClock, LuClock } from "react-icons/lu";
import { GiOpenBook } from "react-icons/gi";
import YouTube from "react-youtube";
import Footer from "../../Components/Student/Footer";
import humanizeDuration from "humanize-duration";
import { useTheme } from "../../Context/ThemeContext";

const MycoursePage = () => {
  const {
    currency,
    allcourses,
    calculateRating,
    calculateNoOfLectures,
    calculateCourseDuration,
    calculateChapterTime,
    getToken,
    backendUrl,
    userData,
  } = useContext(AppContext);

  const { id } = useParams();
  const [courseData, setCourseData] = useState(null);
  const [expandedChapters, setExpandedChapters] = useState({});
  const [isAlreadyEnrolled, setIsAlreadyEnrolled] = useState(false);
  const [playerData, setPlayerData] = useState(null);

  const { isDark } = useTheme();

  async function fetchCourseData() {
    try {
      const { data } = await axios.get(backendUrl + "/api/course/" + id);
      if (data.success) {
        setCourseData(data.courseData);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  }

  useEffect(() => {
    fetchCourseData();
  }, []);

  const toggleChapter = (index) => {
    setExpandedChapters((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };
  return courseData ? (
    <>
      <div className="flex flex-col-reverse lg:flex-row gap-6 lg:gap-10 px-4 pt-2 lg:px-6 lg:pt-4 relative">
        {/* Left Content */}
        <div className="w-full lg:w-3/5 text-gray-600">
          <h1
            className={`text-xl sm:text-2xl lg:text-3xl font-semibold ${
              isDark ? "text-gray-200" : "text-gray-900"
            } mb-2`}
          >
            {courseData?.courseTitle}
          </h1>
          <p
            className={`text-sm sm:text-base mb-3 ${
              isDark ? "text-gray-300" : "text-gray-600"
            }`}
            dangerouslySetInnerHTML={{
              __html: courseData?.courseDescription.slice(0, 200),
            }}
          />

          {/* Rating + Educator */}
          <div className="flex items-center gap-3 flex-wrap text-sm mb-2">
            <div className="flex items-center gap-1 text-yellow-500">
              {[...Array(5)].map((_, i) =>
                i < Math.floor(calculateRating(courseData)) ? (
                  <IoMdStar key={i} />
                ) : (
                  <IoMdStarOutline key={i} />
                )
              )}
            </div>
            <p className="text-blue-600">
              ({courseData?.courseRatings.length} rating
              {courseData?.courseRatings.length !== 1 && "s"})
            </p>
            <p className={`${isDark ? "text-gray-300" : "text-gray-500"}`}>
              {courseData?.enrolledStudents?.length} student
              {courseData?.enrolledStudents?.length !== 1 && "s"}
            </p>
          </div>

          <p className="text-sm mb-4">
            Course by:{" "}
            <span className="text-blue-600 underline">
              {courseData?.educator?.name}
            </span>
          </p>

          {/* Course Structure */}
          <h2
            className={`text-lg sm:text-xl font-semibold ${
              isDark ? "text-gray-300" : "text-gray-800"
            } mb-2`}
          >
            Course Structure
          </h2>
          <div className="space-y-2">
            {courseData?.courseContent?.map((chapter, index) => (
              <div key={index} className="border rounded">
                <div
                  onClick={() => toggleChapter(index)}
                  className={`flex items-center justify-between px-3 py-2 ${
                    isDark ? "bg-gray-600 text-white" : "bg-gray-300 text-black"
                  } cursor-pointer`}
                >
                  <div className="flex items-center gap-2">
                    <IoIosArrowDown
                      className={`transition-transform ${
                        expandedChapters[index] ? "rotate-180" : ""
                      }`}
                    />
                    <p className="font-medium text-sm sm:text-base">
                      {chapter.chapterTitle}
                    </p>
                  </div>
                  <p className="text-xs sm:text-sm">
                    {chapter.chapterContent.length} lectures -{" "}
                    {calculateChapterTime(chapter)}
                  </p>
                </div>

                {expandedChapters[index] && (
                  <ul className="px-4 py-2 text-sm text-gray-700 space-y-1">
                    {chapter.chapterContent.map((lecture, i) => (
                      <li
                        key={i}
                        className="flex items-center justify-between  py-1"
                      >
                        <div className="flex items-center gap-2">
                          <MdPlayCircle className="text-blue-500" />
                          <p
                            className={`${
                              isDark ? "text-gray-200" : "text-gray-700"
                            } text-xs sm:text-sm`}
                          >
                            {lecture.lectureTitle}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            className="text-xs text-blue-600 hover:underline cursor-pointer"
                            onClick={() =>
                              setPlayerData({
                                videoId: lecture.lectureUrl.split("/").pop(),
                              })
                            }
                          >
                            Watch
                          </button>
                          <p className="text-xs text-gray-500">
                            {humanizeDuration(
                              lecture.lectureDuration * 60 * 1000,
                              { units: ["h", "m"] }
                            )}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>

          {/* Full Description */}
          <h2
            className={`text-lg sm:text-xl font-semibold mt-6 ${
              isDark ? "text-gray-200" : "text-gray-800"
            } `}
          >
            Course Description
          </h2>
          <p
            className={`text-sm mt-2 ${
              isDark ? "text-gray-500" : "text-gray-600"
            }`}
            dangerouslySetInnerHTML={{
              __html: courseData?.courseDescription,
            }}
          />
        </div>

        {/* Right Sidebar */}
        <div
          className={`w-full lg:w-2/5 shadow-xl  z-10 rounded overflow-hidden  ${
            isDark
              ? "bg-gray-50/10 text-white shadow-gray-800"
              : "bg-white text-gray-500 shadow-gray-300"
          } `}
        >
          {playerData ? (
            <div className="relative">
              <span
                onClick={() => setPlayerData(null)}
                className="absolute right-1 top-1 text-white font-semibold text-2xl cursor-pointer z-20"
              >
                <MdClose />
              </span>
              <div className="w-full aspect-video">
                <YouTube
                  videoId={playerData.videoId}
                  opts={{
                    width: "100%",
                    height: "100%",
                    playerVars: {
                      autoplay: 1,
                    },
                  }}
                  className="w-full h-full aspect-video"
                />
              </div>
            </div>
          ) : (
            <img
              src={courseData.courseThumbnail}
              alt="course thumbnail"
              className="w-full"
            />
          )}
          <div className="p-4 sm:p-6">
            <div className="text-red-500 flex gap-2 items-center">
              <LuAlarmClock size={25} />
              <p>
                <span className="font-bold">5 days</span> left at this price!
              </p>
            </div>
            <h1
              className={`${
                isDark ? "text-white" : "text-black"
              } text-2xl sm:text-3xl flex gap-2 sm:gap-4 my-2 items-center`}
            >
              {currency}{" "}
              {(
                courseData.coursePrice -
                (courseData.discount * courseData.coursePrice) / 100
              ).toFixed()}{" "}
              <span className="text-sm sm:text-base line-through text-gray-500">
                {currency} {courseData.coursePrice}{" "}
              </span>{" "}
              <span className="text-sm sm:text-base text-gray-500">
                {courseData.discount}% off
              </span>
            </h1>
            <div className="flex flex-wrap gap-2 sm:gap-4 text-xs sm:text-sm my-2 items-center">
              <div className="flex items-center gap-2">
                <IoMdStar className="text-orange-500" />
                {calculateRating(courseData)}
              </div>
              <span>|</span>
              <div className="flex items-center gap-2">
                <LuClock
                  className={`${isDark ? "text-gray-300" : "text-black"}`}
                />
                {calculateCourseDuration(courseData)}
              </div>
              <span>|</span>
              <div className="flex items-center gap-2">
                <GiOpenBook
                  className={`${isDark ? "text-gray-300" : "text-black"}`}
                />
                {calculateNoOfLectures(courseData)} lessons
              </div>
            </div>

            <div className="mt-4">
              <h1
                className={`${
                  isDark ? "text-gray-400" : "text-black"
                } text-xl sm:text-2xl mb-2`}
              >
                What's in the course?
              </h1>
              <ul className="list-disc pl-4 text-sm sm:text-base space-y-1">
                <li>Lifetime access with free updates.</li>
                <li>Step-by-step, hands-on project guidance.</li>
                <li>Downloadable resources and source code.</li>
                <li>Quizzes to test your knowledge.</li>
                <li>Certification of completion</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  ) : (
    <Loading />
  );
};

export default MycoursePage;
