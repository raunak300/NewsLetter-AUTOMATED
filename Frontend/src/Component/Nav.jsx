import React from "react";

const Navbar = () => {
  return (
    <nav className="w-full h-14 bg-gray-900 text-white flex items-center justify-between px-4 sticky top-0 z-50 shadow-md">
      {/* Logo / Brand */}
      <div className="text-xl font-bold">N-Daily</div>

      {/* Extra Links (hidden on smaller screens) */}
      <div className="hidden lg:flex gap-6">
        <a href="#" className="hover:text-gray-300">Home</a>
        <a href="#" className="hover:text-gray-300">Categories</a>
        <a href="#" className="hover:text-gray-300">About</a>
      </div>

      {/* Placeholder for right side (login etc.) */}
      <div className="hidden md:flex">
        <button className="bg-blue-600 hover:bg-blue-700 px-4 py-1 rounded">
          Login
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
