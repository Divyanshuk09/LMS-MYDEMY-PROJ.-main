import React from "react";
import SearchBar from "./SearchBar";
import Companies from "./Companies";
import { useTheme } from "../../Context/ThemeContext";

const Hero = () => {
  const { isDark } = useTheme();

  return (
    <div
      className={`flex flex-col items-center justify-center w-full md:pt-15 pt-10 px-7 md:px-0 space-y-7 text-center ${
        isDark
          ? "bg-gradient-to-b from-cyan-900/70 text-white"
          : "bg-gradient-to-b from-cyan-300/70 text-black"
      }`}
    >
      <h1 className="relative text-[25px] leading-[35px] md:text-[41px] md:leading-[50px] font-bold max-w-2xl mx-auto">
        Empower your future with the courses designed to{" "}
        <span className={isDark ? "text-blue-500" : "text-blue-400"}>
          fit your choice
        </span>
      </h1>

      <p
        className={`md:block hidden text-lg max-w-2xl mx-auto ${
          isDark ? "text-gray-300" : "text-gray-500"
        }`}
      >
        We bring together world-class instructors, interactive content, and a
        supportive community to help you achieve your personal and professional
        goals.
      </p>

      <p
        className={`md:hidden max-w-sm mx-auto ${
          isDark ? "text-gray-300" : "text-gray-500"
        }`}
      >
        We bring together world-class instructors, interactive content, and a
        supportive community to help you achieve your personal and professional
        goals.
      </p>

      <SearchBar />
    </div>
  );
};

export default Hero;
