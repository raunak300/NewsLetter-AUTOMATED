// Footer.jsx
import React from "react";

const Footer = () => {
  return (
    <footer className="bg-[#04233A] text-white py-8">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Brand */}
        <div>
          <h2 className="text-xl font-bold mb-2">ArticleHub</h2>
          <p className="text-gray-300 text-sm">
            Your trusted source for insightful articles on technology,
            business, and innovation. We deliver quality content that informs
            and inspires.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="font-semibold mb-2">Quick Links</h3>
          <ul className="space-y-1 text-sm text-gray-300">
            <li><a href="#" className="hover:text-white">About Us</a></li>
            <li><a href="#" className="hover:text-white">Contact</a></li>
            <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-white">Terms of Service</a></li>
          </ul>
        </div>

        {/* Categories */}
        <div>
          <h3 className="font-semibold mb-2">Categories</h3>
          <ul className="space-y-1 text-sm text-gray-300">
            <li><a href="#" className="hover:text-white">Technology</a></li>
            <li><a href="#" className="hover:text-white">Business</a></li>
            <li><a href="#" className="hover:text-white">Innovation</a></li>
            <li><a href="#" className="hover:text-white">Research</a></li>
          </ul>
        </div>

      </div>
      <hr className="border-gray-600 my-6" />
      <div className="text-center text-gray-400 text-sm">
        © {new Date().getFullYear()} ArticleHub. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
