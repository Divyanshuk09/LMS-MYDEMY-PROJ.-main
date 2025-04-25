import React from "react";
import { IoMdStar, IoMdStarOutline } from "react-icons/io";
import { dummyTestimonial } from "../../assets/assets";

const TestimonialSection = () => {
  return (
    <>
      <div className="py-10 md:px-40 px-8 ">
        <h1 className="md:text-3xl text-lg  font-medium text-gray-800">Testimonials</h1>
        <p className="text-sm  md:text-base text-gray-500 mt-3">
          Hear from our learners as they share their journeys of transformation,
          success, and how our <br /> platform has made a difference in their
          lives.
        </p>

        <div className="grid grid-cols-[repeat(auto-fit,_minmax(200px,_1fr))] px-4 md:px-0 md:my-16 my-10 gap-4  ">
        {dummyTestimonial.map((testimonials, index) => (
          <div className="text-sm text-left border border-gray-500/30 pb-6 rounded-lg bg-white shadow-[0px_4px_15px_0px] overflow-hidden shadow-black/5" key={index}>
            <div className="flex items-center gap-4 md:px-5 px-4 md:py-4 py-2 bg-gray-500/10 ">
              <img
                className="w-11 h-12 rounded-full"
                src={testimonials?.image}
                alt={testimonials?.name}
              />
              <div className="flex flex-col">
                <h1 className="md:text-lg text-xs font-medium text-gray-500">{testimonials?.name}</h1>
                <p className="text-gray-800/80 md:text-base text-[10px]">{testimonials?.role}</p>
              </div>
            </div>
              <div className="p-5 pb-7">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-yellow-500">
                        {i < Math.floor(testimonials.rating) ? (
                          <IoMdStar size={25} />
                        ) : (
                          <IoMdStarOutline size={25} />
                        )}
                      </span>
                    ))}
                </div>
                <p className="text-gray-500 mt-5 text-xs md:text-[14px] text-balance">{testimonials?.feedback}</p>
              </div>
              <a href="#" className="text-blue-500 hover:underline px-5"> Read more</a>
          </div>
        ))}
        </div>
        <div className="flex flex-wrap items-center justify-center gap-6 md:gap-8 md:mt-5 mt-5 max-w-2xl"></div>
      </div>
    </>
  );
};

export default TestimonialSection;
