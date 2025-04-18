import React from "react";
import SearchBar from "./SearchBar";
import Companies from "./Companies";
const Hero = () => {
  return (
    <>
      <div className="flex flex-col items-center justify-center w-full md:pt-36 pt-18 px-7 md:px-0 space-y-7 text-center bg-gradient-to-b from-cyan-200/70 ">
        <h1 className="relative text-[25px] leading-[35px] md:text-[41px] md:leading-[50px] font-bold text-black max-w-2xl mx-auto">
          Empower your future with the courses designed to{" "}
          <span className="text-blue-400">fit your choice</span>
            </h1>
        <p className="md:block hidden text-gray-500 max-w-2xl mx-auto">
          We bring together world-class instructors, interactive content, and a
          supportive community to help you achieve your personal and
          professional goals.
        </p>
        <p className="md:hidden text-gray-500 max-w-sm mx-auto">
          We bring together world-class instructors, interactive content, and a
          supportive community to help you achieve your personal and
          professional goals.
        </p>
        <SearchBar/>
      </div>
    </>
  );
};

export default Hero;
