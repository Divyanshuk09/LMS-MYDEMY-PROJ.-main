import React, { useContext, useEffect, useState } from "react";
import humanizeDuration from "humanize-duration";
import { MdClose, MdPlayCircle } from "react-icons/md";
import { IoIosArrowDown } from "react-icons/io";
import { FaCheckCircle } from "react-icons/fa";
import { AppContext } from "../../Context/AppContext";
import { useParams } from "react-router-dom";
import Loading from "../../Components/Student/Loading";
import YouTube from "react-youtube";
import Rating from "../../Components/Student/Rating";
import Footer from "../../Components/Student/Footer";
import axios from "axios";
import { toast } from "react-toastify";
import { useTheme } from "../../Context/ThemeContext";

const Player = () => {
  const { isDark } = useTheme();
  const {
    enrolledcourses,
    calculateChapterTime,
    backendUrl,
    getToken,
    userData,
    fetchUserEnrolledCourses,
  } = useContext(AppContext);

  const { courseId } = useParams();
  const [courseData, setCourseData] = useState(null);
  const [expandedChapters, setExpandedChapters] = useState({});
  const [playerData, setPlayerData] = useState(null);

  const [progressData, setProgressData] = useState(null);
  const [initialRating, setInitialRating] = useState(0);

  const getcoursedata = () => {
    enrolledcourses.map((course) => {
      if (course._id === courseId) {
        setCourseData(course);
        course.courseRatings.map((item) => {
          if (item.userId === userData._id) {
            setInitialRating(item.rating);
          }
        });
      }
    });
  };

  const markLectureAsCompleted = async (lectureId) => {
    try {
      const token = await getToken();
      const { data } = await axios.post(
        backendUrl + "/api/user/update-course-progress",
        { courseId, lectureId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (data.success) {
        toast.success(data.message);
        getCourseProgress();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const getCourseProgress = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.post(
        backendUrl + "/api/user/get-course-progress",
        { courseId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (data.success) {
        setProgressData(data.progressData);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleRating = async (rating) => {
    try {
      const token = await getToken();
      const { data } = await axios.post(
        backendUrl + "/api/user/add-rating",
        { courseId, rating },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (data.success) {
        setInitialRating(data.rating);
        toast.success(data.message);
        fetchUserEnrolledCourses();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    getCourseProgress();
  }, []);

  useEffect(() => {
    if (enrolledcourses.length > 0) {
      getcoursedata();
    }
  }, [enrolledcourses]);

  useEffect(() => {
    if (playerData) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [playerData]);

  const toggleChapter = (index) => {
    setExpandedChapters((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return courseData ? (
    <>
      <div className="flex flex-col-reverse lg:flex-row gap-6 lg:gap-10 px-4 pt-2 lg:px-36 lg:pt-10 relative">
        {/* left column */}
        <div
          className={`w-full lg:w-3/5 ${
            isDark ? "text-gray-200" : "text-gray-600"
          }`}
        >
          <h2 className="md:text-2xl text-xl font-semibold">
            Course Structure :
          </h2>
          <div className="pt-5">
            {courseData &&
              courseData?.courseContent?.map((chapter, index) => (
                <div key={index} className="mt-1">
                  {/* Chapter Header */}
                  <div
                    onClick={() => toggleChapter(index)}
                    className={`flex items-center cursor-pointer justify-between border transition-all duration-100 border-gray-500/60 px-2 py-2 ${
                      isDark ? "bg-gray-800" : "bg-gray-100"
                    } `}
                  >
                    <div className="flex items-center gap-2">
                      <IoIosArrowDown
                        className={`cursor-pointer transition-transform duration-300 ${
                          expandedChapters[index] ? "rotate-180" : ""
                        }`}
                      />
                      <p
                        className={`${
                          isDark ? "text-gray-200" : "text-gray-800"
                        } font-semibold text-xs md:text-base`}
                      >
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
                      <ul className="list-disc md:pl-2 pl-2 pr-4 py-2 text-gray-600 border-l border-r border-b border-gray-300">
                        {chapter.chapterContent.map((lecture, i) => (
                          <li key={i} className="flex items-center gap-2 py-1">
                            {progressData &&
                            progressData.lectureCompleted.includes(
                              lecture.lectureId
                            ) ? (
                              <FaCheckCircle className="text-blue-500" />
                            ) : (
                              <MdPlayCircle className="text-blue-500" />
                            )}
                            <div
                              className={`flex items-center justify-between w-full ${
                                isDark ? "text-gray-400" : "text-gray-800"
                              }  text-xs md:text-default`}
                            >
                              <p className="text-xs md:text-sm">
                                {lecture.lectureTitle}
                              </p>
                              <div className="flex gap-2">
                                {lecture.lectureUrl && (
                                  <p
                                    onClick={() =>
                                      setPlayerData({
                                        ...lecture,
                                        chapter: index + 1,
                                        lecture: i + 1,
                                      })
                                    }
                                    className="text-[10px] md:text-sm text-blue-500 hover:underline cursor-pointer"
                                  >
                                    Watch
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
          <div
            className={`pt-4 pb-10 ${
              isDark ? "text-gray-500" : "text-gray-600"
            }`}
          >
            <h1
              className={`${
                isDark ? "text-gray-400" : "text-gray-800"
              } text-2xl mt-4 md:text-3xl font-semibold`}
            >
              Course Description :
            </h1>
            <p
              className={`text-sm mt-2 ${
                isDark ? "text-gray-300" : "text-gray-600"
              }`}
            >
              {courseData?.courseDescription && (
                <div
                  className="ql-editor text-sm"
                  dangerouslySetInnerHTML={{
                    __html: courseData.courseDescription,
                  }}
                  style={{
                    color: isDark ? "#D1D5DB" : "#4B5563",
                    padding: 0,
                    background: "transparent",
                  }}
                />
              )}
            </p>
          </div>

          <div className="flex items-center gap-2 py-3 mt-10">
            <h1
              className={`text-xl font-bold ${
                isDark ? "text-gray-500" : "text-gray-800"
              }`}
            >
              Rate this course:
            </h1>
            <Rating initialRating={initialRating} onRate={handleRating} />
          </div>
        </div>
        {/* right column  */}
        <div
          className={`w-full lg:max-w-2/5 h-fit shadow-xl z-10 rounded overflow-hidden  ${
            isDark
              ? "bg-gray-50/10 text-white shadow-gray-800"
              : "bg-white text-gray-500 shadow-gray-300"
          } `}
        >
          {playerData ? (
            <div className="relative">
              <span
                onClick={() => setPlayerData(null)}
                className="absolute right-1 top-1 text-white font-semibold text-2xl cursor-pointer"
              >
                <MdClose />
              </span>
              <YouTube
                videoId={playerData.lectureUrl.split("/").pop()}
                opts={{
                  width: "100% ",
                  height: "100%",
                  playerVars: { autoplay: 1 },
                }}
                iframeClassName="w-full aspect-video"
              />
              <div className="flex justify-between items-center mt-4 text-sm lg:text-base px-2">
                <p className="font-bold">
                  {playerData.chapter}.{playerData.lecture}{" "}
                  {playerData.lectureTitle}
                </p>
                <button
                  className="text-blue-600 hover:underline cursor-pointer"
                  onClick={() => markLectureAsCompleted(playerData.lectureId)}
                >
                  {progressData &&
                  progressData.lectureCompleted.includes(playerData.lectureId)
                    ? "Completed"
                    : "Mark as Completed"}
                </button>
              </div>
            </div>
          ) : (
            <img src={courseData ? courseData.courseThumbnail : ""} alt="" />
          )}
        </div>
      </div>
      <Footer />
    </>
  ) : (
    <Loading />
  );
};

export default Player;
