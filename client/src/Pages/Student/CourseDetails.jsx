import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AppContext } from "../../Context/AppContext";
import Loading from "../../Components/Student/Loading";
import { MdClose, MdPlayCircle } from "react-icons/md";
import { IoMdStar, IoMdStarOutline, IoIosArrowDown } from "react-icons/io";
import { LuAlarmClock, LuClock } from "react-icons/lu";
import { GiOpenBook } from "react-icons/gi";
import YouTube from "react-youtube";
import Footer from "../../Components/Student/Footer";
import humanizeDuration from "humanize-duration";

const CourseDetails = () => {
  const {
    currency,
    allcourses,
    calculateRating,
    calculateNoOfLectures,
    calculateCourseDuration,
    calculateChapterTime,
  } = useContext(AppContext);

  const { id } = useParams();
  const [courseData, setCourseData] = useState(null);
  const [expandedChapters, setExpandedChapters] = useState({});
  const [isAlreadyEnrolled, setIsAlreadyEnrolled] = useState(false);
  const [playerData, setPlayerData] = useState(null);
  async function fetchCourseData() {
    const findCourse = allcourses.find((course) => course._id === id);
    setCourseData(findCourse);
  }

  useEffect(() => {
    fetchCourseData();
  }, [allcourses]);

  const toggleChapter = (index) => {
    setExpandedChapters((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return courseData ? (
    <>
      <div className="flex md:flex-row flex-col-reverse gap-10 relative items-start justify-between md:px-36 px-4  md:pt-30 pt-2 text-left">
        <div className="absolute top-0 left-0 w-full md:pt-36 pt-18 px-7 md:px-0 space-y-7 h-section-height bg-gradient-to-b from-cyan-200/70"></div>

        {/* Left Column */}
        <div className="max-w-xl z-10 text-gray-500">
          <h1 className="md:text-[44px] text-lg font-semibold text-gray-800">
            {courseData?.courseTitle}
          </h1>
          <p
            className="md:text-base md:pt-2 text-sm"
            dangerouslySetInnerHTML={{
              __html: courseData.courseDescription.slice(0, 200),
            }}
          ></p>

          {/* Reviews and Ratings */}
          <div className="flex items-center space-x-2 mt-1">
            <p className="text-xs md:text-sm">{calculateRating(courseData)}</p>
            <div className="flex text-sm">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="text-yellow-500">
                  {i < Math.floor(calculateRating(courseData)) ? (
                    <IoMdStar className="text-xs md:text-sm" />
                  ) : (
                    <IoMdStarOutline className="text-xs md:text-sm" />
                  )}
                </span>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <p className="text-blue-500 md:text-sm text-xs">
                ({courseData?.courseRatings.length}{" "}
                {courseData?.courseRatings.length > 1 ? "ratings" : "rating"})
              </p>
              <span className="md:text-sm text-xs mt-0.5">
                {courseData?.enrolledStudents?.length}{" "}
                {courseData?.enrolledStudents?.length > 1
                  ? "students"
                  : "student"}
              </span>
            </div>
          </div>

          {/* Educator */}
          <p className="text-xs md:text-sm mt-2">
            Course by:{" "}
            <span className="text-blue-500 underline">
              {courseData?.educator?.name}
            </span>
          </p>

          {/* Course Structure */}
          <div className="pt-8 text-gray-800">
            <h1 className="text-xl font-semibold">Course Structure</h1>
            <div className="pt-5">
              {courseData?.courseContent?.map((chapter, index) => (
                <div key={index} className="mt-1">
                  {/* Chapter Header */}
                  <div
                    onClick={() => toggleChapter(index)}
                    className="flex items-center cursor-pointer justify-between border transition-all duration-100 border-gray-500/60 px-2 py-2 bg-gray-100"
                  >
                    <div className="flex items-center gap-2">
                      <IoIosArrowDown
                        className={`cursor-pointer transition-transform duration-300 ${
                          expandedChapters[index] ? "rotate-180" : ""
                        }`}
                      />
                      <p className="text-gray-800 font-semibold text-xs md:text-base">
                        {chapter.chapterTitle}
                      </p>
                    </div>
                    <p className="text-[10px] md:text-sm">
                      {chapter.chapterContent.length} lectures -{" "}
                      {calculateChapterTime(chapter)}
                    </p>
                  </div>

                  {/* Lecture List */}
                  {expandedChapters[index] && (
                    <div className="overflow-hidden transition-all duration-300 max-h-96">
                      <ul className="list-disc md:pl-10 pl-4 pr-4 py-2 text-gray-600 border-l border-r border-b border-gray-300">
                        {chapter.chapterContent.map((lecture, i) => (
                          <li key={i} className="flex items-center gap-2 py-1">
                            <MdPlayCircle className="text-blue-500" />
                            <div className="flex items-center justify-between w-full text-gray-800 text-xs md:text-default">
                              <p className="text-xs md:text-sm">
                                {lecture.lectureTitle}
                              </p>
                              <div className="flex gap-2">
                                {lecture.isPreviewFree && (
                                  <p
                                    onClick={() =>
                                      setPlayerData({
                                        videoId: lecture.lectureUrl
                                          .split("/")
                                          .pop(),
                                      })
                                    }
                                    className="text-[10px] md:text-sm text-blue-500 hover:underline cursor-pointer"
                                  >
                                    Preview
                                  </p>
                                )}
                                <p className="text-[10px] md:text-sm">
                                  {humanizeDuration(
                                    lecture.lectureDuration * 60 * 1000,
                                    { units: ["h", "m"] }
                                  )}
                                </p>
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
            {/* courseDescription */}
            <div className="pt-4 pb-10 text-gray-600">
              <h1 className="text-gray-800 text-2xl mt-4 md:text-3xl font-semibold">
                Course Description :
              </h1>
              <p
                dangerouslySetInnerHTML={{
                  __html: courseData?.courseDescription?.slice(0, 200) || "",
                }}
              ></p>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="max-w-xl w-60 mx-auto shadow-xl shadow-gray-400 mt-4 z-10 rounded overflow-hidden bg-white min-w-[300px] sm:min-w-[420px] text-gray-500">
          {playerData ? (
            <div className="relative">
              <span onClick={()=>setPlayerData(null)} className="absolute right-1 top-1 text-white font-semibold text-2xl cursor-pointer"><MdClose/></span>
              <YouTube
                videoId={playerData.videoId}
                opts={{
                  width: "100%",
                  height: "120%",
                  playerVars: {
                    autoplay: 1,
                  },
                }}
                className="w-full aspect-video"
              />
            </div>
          ) : (
            <img src={courseData.courseThumbnail} alt="" />
          )}
          <div className="p-6">
            <div className="text-red-500 flex gap-2 items-center">
              <LuAlarmClock size={25} />
              <p>
                <span className="font-bold">5 days</span> left at this price!
              </p>
            </div>
            <h1 className="text-black text-3xl flex gap-4 my-2 items-center ">
              {currency}{" "}
              {(
                courseData.coursePrice -
                (courseData.discount * courseData.coursePrice) / 100
              ).toFixed()}{" "}
              <span className="text-base line-through text-gray-500">
                {currency} {courseData.coursePrice}{" "}
              </span>{" "}
              <span className="text-base text-gray-500">
                {courseData.discount}% off
              </span>
            </h1>
            <div className="flex gap-2 text-xs md:text-base md:gap-4 my-2 items-center">
              <div className="flex items-center gap-2">
                <IoMdStar className="text-orange-500" width={28} />
                {calculateRating(courseData)}
              </div>
              {" | "}
              <div className="flex items-center gap-2">
                <LuClock className="text-black" />
                {calculateCourseDuration(courseData)}
              </div>
              {" | "}
              <div className="flex items-center gap-2">
                <GiOpenBook className="text-black" />
                {calculateNoOfLectures(courseData)} lessons
              </div>
            </div>

            <button
              className={`mt-2 bg-blue-600 md:text-base text-sm font-mono text-white w-full py-3 rounded font-semibold transition-transform duration-200 ease-in-out hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 hover:bg-blue-500 cursor-pointer`}
              disabled={isAlreadyEnrolled}
            >
              {isAlreadyEnrolled ? "Already Enrolled" : "Enroll Now"}
            </button>

            <div>
              <h1 className="text-black md:text-2xl text-xl my-4">
                What's in the course ?{" "}
              </h1>
              <ul className="list-disc md:ml-6 ml-3 md:text-base text-sm">
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

      <Footer />
    </>
  ) : (
    <Loading />
  );
};

export default CourseDetails;
