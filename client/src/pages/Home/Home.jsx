import React from "react";
import Navbar from "../../layouts/Navbar";
import Search from "/src/assets/icons/search.png"

const Home = () => {
  return (
    <div>
      <div>
        <Navbar />
      </div>
      <div>
        <div className="flex m-2 ">
          <input type="text" placeholder="Search for Products " className="p-3 bg-white border-[2px] rounded-2xl border-gray-200 focus:outline-evergreen focus:outline-2 w-full relative"/>
          <img src={Search} alt="" className="absolute"/>
        </div>
      </div>
    </div>
  );
};

export default Home;
