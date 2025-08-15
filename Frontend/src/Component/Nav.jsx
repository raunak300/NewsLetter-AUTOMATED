import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-[#04233A] text-white px-6 py-4 flex  items-center">
      {/* Logo */}
      <div className="text-2xl font-bold w-[40%]">ArticleHub</div>

      {/* Links */}
      <ul className="flex gap-6">
        <li>
          <Link to="/" className="hover:text-gray-300">
            Home
          </Link>
        </li>
        <li>
          <Link to="/" className="hover:text-gray-300">
            Articles
          </Link>
        </li>
        
        <li>
          <a
            href="https://portfolio-rust-ten-82.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-300"
          >
            Portfolio
          </a>
        </li>
      </ul>

      {/* Search */}
      {/* <div className="hover:text-gray-300 cursor-pointer">Search</div> */}
    </nav>
  );
};

export default Navbar;
