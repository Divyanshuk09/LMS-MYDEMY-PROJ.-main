import { createContext, useEffect, useState } from "react";
import { dummyCourses } from "../assets/assets";
import { dummyTestimonial } from "../assets/assets";
import humanizeDuration from "humanize-duration";
import { useNavigate } from "react-router-dom";

export const AppContext = createContext();

export const AppContextProvider = (props) => {
  const currency = import.meta.env.VITE_CURRENCY;
  const navigate = useNavigate();

  const [allcourses, setAllcourses] = useState([]);
  const [isEducator, setIsEducator] = useState(true);
  const [enrolledcourses, setEnrolledcourses] = useState([]);

  //fetch all courses
  async function fetchallcourses() {
    setAllcourses(dummyCourses);
  }

  //function to calculate average rating of course
  const calculateRating = (course) => {
    if (!course.courseRatings || course.courseRatings.length === 0) {
      return 0;
    }

    let totalRating = 0;
    course.courseRatings.forEach((rating, i) => {
      totalRating += rating.rating;
    });

    const avg = totalRating / course.courseRatings.length;
    return avg;
  };

  //function to calc course chapter time

  const calculateChapterTime = (chapter) => {
    let time = 0;
    chapter.chapterContent.forEach((lecture) => {
      time += lecture.lectureDuration;
    });
    return humanizeDuration(time * 60 * 1000, { units: ["h", "m"] });
  };

  //function to call course duration

  const calculateCourseDuration = (course) => {
    let time = 0;
    course.courseContent.forEach((chapter) => {
      chapter.chapterContent.forEach((lecture) => {
        time += lecture.lectureDuration;
      });
    });
    return humanizeDuration(time * 60 * 1000, { units: ["h", "m"] });
  };

  //function to calculate total number of lectures in the course

  const calculateNoOfLectures = (course) => {
    let totallectures = 0;
    course.courseContent.forEach((chapter) => {
      if (Array.isArray(chapter.chapterContent)) {
        totallectures += chapter.chapterContent.length;
      }
    });
    return totallectures;
  };

  // fetch user enrolled courses  

  async function fetchenrolledcourses() {
    setEnrolledcourses(dummyCourses)
  }

  useEffect(() => {
    fetchallcourses();
    fetchenrolledcourses();
  }, []);

  const value = {
    navigate,
    currency,
    allcourses,
    calculateRating,
    isEducator,
    setIsEducator,
    calculateNoOfLectures,
    calculateCourseDuration,
    calculateChapterTime,
    enrolledcourses,
    fetchenrolledcourses,

  };

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};
