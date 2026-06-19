import React from "react";
import Navbar from "../../layouts/Navbar";
import Search from "../../assets/icons/search.png";
import Gadgets from "../../assets/categories/gadgets.jpg";
import Mobiles from "../../assets/categories/mobile.jpg";
import Laptops from "../../assets/categories/laptops.webp";
import Tabs from "../../assets/categories/tabs.avif";
import Watches from "../../assets/categories/smart-watches.jpg";
import Airpods from "../../assets/categories/airpods.avif";
import Books from "../../assets/categories/books.webp";
import Shirts from "../../assets/categories/shirts.jpg";
import Pants from "../../assets/categories/pants.jpg";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate()
  return (
    <div>
      <div>
        <Navbar />
      </div>
      <div>
        <div className="flex m-2 ">
          <input
            type="text"
            placeholder="Search for Products "
            className="p-3 bg-white border-[2px] rounded-2xl border-gray-200 focus:outline-evergreen focus:outline-2 w-full relative"
          />
          <img src={Search} alt="" className="absolute w-6 top-23 right-8 lg:top-27" />
        </div>
        <div className="mt-8">
          <p className="px-2 ml-2 text-center font- text-2xl font-medium text-evergreen">
           Top Categories
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 justify-items-center p-4 mt-4">
            <div className="w-full w-[400px]  rounded-md relative bg-hunter-green group "
            onClick={() => navigate("/products/mobiles")}>
              <img
                src={Mobiles}
                alt=""
                className="rounded-md w-full h-[180px] object-cover transition-transform duration-300 group-hover:scale-102"
              />
              <div className="absolute inset-0  rounded-md bg-gradient-to-t from-black/80 via-black/30 to-transparent group-hover:scale-102 duration-200"></div>

              <div className="absolute inset-0 flex flex-col items-center font-inter justify-center text-porcelain text-2xl">
                <p className="text-2xl font-bold">MOBILES</p>
                <p className="mt-4 text-[14px]">Shop now</p>
              </div>
            </div>
            <div className="w-full w-[400px] rounded-md relative bg-hunter-green group"
            onClick={() => navigate("/products/laptops")}>
              <img
                src={Laptops}
                alt=""
                className="rounded-md w-full h-[180px] object-cover transition-transform duration-300 group-hover:scale-102"
              />
              <div className="absolute inset-0 rounded-md bg-gradient-to-t from-black/80 via-black/30 to-transparent group-hover:scale-102 duration-200"></div>

              <div className="absolute inset-0 flex flex-col items-center font-inter justify-center text-porcelain text-2xl">
                <p className="text-2xl font-bold">LAPTOPS</p>
                <p className="mt-4 text-[14px]">Shop now</p>
              </div>
            </div>
            <div className="w-full w-[400px] rounded-md relative bg-hunter-green group"
            onClick={() => navigate("/products/tablets")}>
              <img
                src={Tabs}
                alt=""
                className="rounded-md w-full h-[180px] object-cover transition-transform duration-300 group-hover:scale-102"
              />
              <div className="absolute inset-0 rounded-md bg-gradient-to-t from-black/80 via-black/30 to-transparent group-hover:scale-102 duration-200"></div>

              <div className="absolute inset-0 flex flex-col items-center font-inter justify-center text-porcelain text-2xl">
                <p className="text-2xl font-bold">TABLETS</p>
                <p className="mt-4 text-[14px]">Shop now</p>
              </div>
            </div>
            <div className="w-full w-[400px] rounded-md relative bg-hunter-green group"
            onClick={() => navigate("/products/smart-watches")}>
              <img
                src={Watches}
                alt=""
                className="rounded-md w-full h-[180px] object-cover transition-transform duration-300 group-hover:scale-102"
              />
              <div className="absolute inset-0 rounded-md bg-gradient-to-t from-black/80 via-black/30 to-transparent group-hover:scale-102 duration-200"></div>

              <div className="absolute inset-0 flex flex-col items-center font-inter justify-center text-porcelain text-2xl">
                <p className="text-2xl font-bold">SMART WATCHES</p>
                <p className="mt-4 text-[14px]">Shop now</p>
              </div>
            </div>
            <div className="w-full w-[400px] rounded-md relative bg-hunter-green group"
            onClick={() => navigate("/products/airpods")}>
              <img
                src={Airpods}
                alt=""
                className="rounded-md w-full h-[180px] object-cover transition-transform duration-300 group-hover:scale-102"
              />
              <div className="absolute inset-0 rounded-md bg-gradient-to-t from-black/80 via-black/30 to-transparent group-hover:scale-102 duration-200"></div>

              <div className="absolute inset-0 flex flex-col items-center font-inter justify-center text-porcelain text-2xl">
                <p className="text-2xl font-bold">AIRPODS</p>
                <p className="mt-4 text-[14px]">Shop now</p>
              </div>
            </div>
            <div className="w-full w-[400px] rounded-md relative bg-hunter-green group"
            onClick={() => navigate("/products/books")}>
              <img
                src={Books}
                alt=""
                className="rounded-md w-full h-[180px] object-cover transition-transform duration-300 group-hover:scale-102"
              />
              <div className="absolute inset-0 rounded-md bg-gradient-to-t from-black/80 via-black/30 to-transparent group-hover:scale-102 duration-200"></div>

              <div className="absolute inset-0 flex flex-col items-center font-inter justify-center text-porcelain text-2xl">
                <p className="text-2xl font-bold">BOOKS</p>
                <p className="mt-4 text-[14px]">Shop now</p>
              </div>
            </div>
            <div className="w-full w-[400px] rounded-md relative bg-hunter-green group"
            onClick={() => navigate("/products/shirts")}>
              <img
                src={Shirts}
                alt=""
                className="rounded-md w-full h-[180px] object-cover transition-transform duration-300 group-hover:scale-102"
              />
              <div className="absolute inset-0 rounded-md bg-gradient-to-t from-black/80 via-black/30 to-transparent group-hover:scale-102 duration-200"></div>

              <div className="absolute inset-0 flex flex-col items-center font-inter justify-center text-porcelain text-2xl">
                <p className="text-2xl font-bold">SHIRTS</p>
                <p className="mt-4 text-[14px]">Shop now</p>
              </div>
            </div>
            <div className="w-full w-[400px] rounded-md relative bg-hunter-green group"
            onClick={() => navigate("/products/pants")}>
              <img
                src={Pants}
                alt=""
                className="rounded-md w-full h-[180px] object-cover transition-transform duration-300 group-hover:scale-102"
              />
              <div className="absolute inset-0 rounded-md bg-gradient-to-t from-black/80 via-black/30 to-transparent group-hover:scale-102 duration-200"></div>

              <div className="absolute inset-0 flex flex-col items-center font-inter justify-center text-porcelain text-2xl">
                <p className="text-2xl font-bold">PANTS</p>
                <p className="mt-4 text-[14px]">Shop now</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
