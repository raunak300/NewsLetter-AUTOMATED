import React from 'react';
import Footer from '../Component/Footer';
import Navbar from '../Component/Nav';
import Component from '../Component/Component';

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <Navbar />

      {/* Page Content - will grow to push footer down */}
      <div className="flex-grow">
        <Component />
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Home;
