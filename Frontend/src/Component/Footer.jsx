import React from "react";

const Footer = () => {
  return (
    <footer className="w-full bg-zinc-900 text-white py-4">
      <hr />
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
        
        {/* Brand */}
        <div className="text-lg font-bold mb-2 md:mb-0">
          N-Daily
        </div>

        {/* Links */}
        <div className="flex gap-4 text-sm mb-2 md:mb-0">
          <a href="#" className="hover:text-gray-300">Privacy Policy</a>
          <a href="#" className="hover:text-gray-300">Terms of Service</a>
        </div>

        {/* Copyright */}
        <div className="text-sm text-gray-400">
          © {new Date().getFullYear()} N-Daily. All rights reserved.
        </div>

      </div>
    </footer>
  );
};

export default Footer;
