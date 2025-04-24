import { createContext, useEffect, useState } from "react";
import { dummyCourses } from "../assets/assets";
import { dummyTestimonial } from "../assets/assets";
import humanizeDuration from "humanize-duration";
import { useNavigate } from "react-router-dom";
import { useAuth, useUser } from "@clerk/clerk-react";

import axios from "axios";
import { toast } from "react-toastify";

export const AppContext = createContext();

export const AppContextProvider = (props) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const currency = import.meta.env.VITE_CURRENCY;
  const navigate = useNavigate();

  const { getToken } = useAuth();
  const { user } = useUser();

  const [allcourses, setAllcourses] = useState([]);
  const [isEducator, setIsEducator] = useState(false);
  const [enrolledcourses, setEnrolledcourses] = useState([]);
  const [userData, setUserData] = useState(null);

  //fetch user data
  async function fetchUserData() {
    if (user.publicMetadata.role === "educator") {
      setIsEducator(true);
    }

    try {
      const token = await getToken();
      // console.log(token);
      const { data } = await axios.get(backendUrl + "/api/user/user-data", {
        headers: { Authorization: `Bearer ${token}` },
      });
      // console.log(data.user);
      if (data.success) {
        setUserData(data.user);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  }

  //fetch all courses
  async function fetchallcourses() {
    setAllcourses(dummyCourses);
    try {
      const { data } = await axios.get(backendUrl + "/api/course/all-courses");
      if (data.success) {
        setAllcourses(data.courses);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
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

    return Math.floor(totalRating / course.courseRatings.length);
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
    course?.courseContent?.forEach((chapter) => {
      chapter.chapterContent.forEach((lecture) => {
        time += lecture.lectureDuration;
      });
    });
    return humanizeDuration(time * 60 * 1000, { units: ["h", "m"] });
  };

  //function to calculate total number of lectures in the course

  const calculateNoOfLectures = (course) => {
    let totallectures = 0;
    course?.courseContent?.forEach((chapter) => {
      if (Array.isArray(chapter.chapterContent)) {
        totallectures += chapter.chapterContent.length;
      }
    });
    return totallectures;
  };

  // fetch user enrolled courses

  async function fetchUserEnrolledCourses() {
    try {
      const token = await getToken();
      const { data } = await axios.get(
        backendUrl + "/api/user/user-enrolled-courses",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (data.success) {
        setEnrolledcourses(data.enrolledCourses.reverse());
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  }

  useEffect(() => {
    fetchallcourses();
  }, []);

  const logToken = async () => {
    console.log(await getToken());
  };

  useEffect(() => {
    if (user) {
      fetchUserData();
      fetchUserEnrolledCourses();
      logToken();
    }
  }, [user]);

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
    backendUrl,
    fetchUserEnrolledCourses,
    userData,
    setUserData,
    getToken,
    fetchallcourses,
  };

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};
