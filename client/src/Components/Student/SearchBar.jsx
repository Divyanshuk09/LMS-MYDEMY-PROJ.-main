import React from "react";
import { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
const SearchBar = ({data}) => {
  const navigate = useNavigate();
  const [coursename, setCoursename] = useState(data ? data : "");
  
  const onSearchHandler = (e)=>{
    e.preventDefault();
    navigate('/course-list/'+ coursename)
  }

  return (
    <>
      <form onSubmit={onSearchHandler} className="max-w-xl w-full md:h-14 h-12 bg-white rounded-lg border border-gray-500/20 flex items-center ">
        <div className="md:w-auto w-10 px-3">
          <FaSearch />
        </div>
        <input
          className="w-full h-full outline-none px-2 text-black"
          type="text"
          value={coursename}
          onChange={(e) => setCoursename(e.target.value)}
          name=""
          placeholder="Search for courses"
          id=""
        />
        <button className="bg-blue-500 md:px-10 px-7 md:py-3 py-2 mx-1 text-white rounded">
          Search
        </button>
      </form>
    </>
  );
};

export default SearchBar;
