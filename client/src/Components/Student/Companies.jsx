import React from "react";
import MicroSoft from "../../assets/companies/microsoft.png";
import walmart from "../../assets/companies/walmart.png";
import accenture from "../../assets/companies/accenture.png";
import adobe from "../../assets/companies/adobe.png";
import paypal from "../../assets/companies/paypal.png";
import { useTheme } from "../../Context/ThemeContext";
const Companies = () => {
  const { isDark } = useTheme();
  return (
    <>
      <div className="pt-16">
        <p
          className={`md:text-3xl text-lg  font-medium ${
            isDark ? "text-gray-400" : "text-gray-800"
          }`}
        >
          Trusted by learners from
        </p>
        <div
          className={`${
            isDark ? "bg-gray-900/100 rounded-xl" : ""
          } flex flex-wrap items-center justify-center gap-6 md:gap-8 md:mt-5 mt-5 `}
        >
          <img
            src={MicroSoft}
            alt="MicroSoft log"
            className="w-30 md:w-35 bg"
          />
          <img src={walmart} alt="MicroSoft log" className="w-35 md:w-45" />
          <img src={accenture} alt="MicroSoft log" className="w-30 md:w-38" />
          <img src={adobe} alt="MicroSoft log" className="w-20 md:w-30" />
          <img src={paypal} alt="MicroSoft log" className="w-18 md:w-24" />
        </div>
      </div>
    </>
  );
};

export default Companies;
