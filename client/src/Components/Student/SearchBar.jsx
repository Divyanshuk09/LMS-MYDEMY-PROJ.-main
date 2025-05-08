import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../Context/ThemeContext";

const SearchBar = ({ data }) => {
  const navigate = useNavigate();
  const [coursename, setCoursename] = useState(data ? data : "");
  const { isDark } = useTheme();

  const onSearchHandler = (e) => {
    e.preventDefault();
    navigate("/course-list/" + coursename);
  };

  return (
    <form
      onSubmit={onSearchHandler}
      className={`max-w-xl w-full md:h-14 h-12 rounded-lg border flex items-center 
        ${isDark ? " border-gray-700" : "bg-white border-gray-500/20"}`}
    >
      <div className="md:w-auto w-10 px-3 flex items-center justify-center">
        <FaSearch className={`${isDark ? "text-white" : "text-black"}`} />
      </div>
      <input
        className={`w-full h-full outline-none px-2 
          ${isDark ? "bg-transparent text-white placeholder-gray-400" : "text-black"}`}
        type="text"
        value={coursename}
        onChange={(e) => setCoursename(e.target.value)}
        placeholder="Search for courses"
      />
      <button
        className="bg-blue-500 md:px-10 px-7 md:py-3 py-2 mx-1 text-white rounded hover:bg-blue-600"
      >
        Search
      </button>
    </form>
  );
};

export default SearchBar;
