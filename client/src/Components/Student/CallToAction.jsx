import React from "react";
import { FaArrowRight } from "react-icons/fa";
import { useClerk, useUser, UserButton } from "@clerk/clerk-react";
import { useTheme } from "../../Context/ThemeContext";

const CalltoAction = () => {
  const { openSignIn } = useClerk();
  const { isSignedIn, user } = useUser();
  const { isDark } = useTheme();
  return (
    <div className="py-10 md:px-40 px-8 flex flex-col justify-center items-center">
      <h1
        className={`md:text-3xl text-lg font-semibold ${
          isDark ? "text-gray-300" : "text-gray-800"
        }`}
      >
        Learn anything, anytime & anywhere
      </h1>
      <p
        className={`text-sm md:text-lg ${
          isDark ? "text-gray-400" : "text-gray-500"
        } mt-3`}
      >
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Veritatis
        expedita ab quasi, animi, officia ex similique odio <br /> iusto
        corrupti consequuntur earum error nisi est quibusdam.
      </p>
      <div className="flex gap-5 mt-5">
        {isSignedIn ? (
          <button
            disabled
            className="cursor-not-allowed bg-blue-500 font-semibold text-white md:px-9 px-4 md:py-3 py-1 rounded text-sm"
          >
            Get Started
          </button>
        ) : (
          <button
            onClick={() => openSignIn()}
            className="cursor-pointer bg-blue-600 hover:bg-blue-500 font-semibold text-white md:px-9 px-4 md:py-3 py-1 rounded text-sm"
          >
            Get Started
          </button>
        )}
        <button
          className={`cursor-pointer ${
            isDark ? "text-white" : "text-black"
          } font-semibold flex items-center gap-2 group transition-all`}
        >
          Learn More
          <FaArrowRight className="transform transition-transform duration-300 group-hover:translate-x-1" />
        </button>
      </div>
    </div>
  );
};

export default CalltoAction;
