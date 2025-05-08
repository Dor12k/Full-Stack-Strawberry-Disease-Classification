

// src/components/Layout.jsx
import Header from "../components/Index/Header";
import Footer from "../components/Index/Footer";
import { Outlet } from "react-router-dom";
import { useState } from "react";

const HomePage = () => {
  
  const [ fadeIn, setFadeIn]  = useState(false);
  
  return (
    <>
      <Header />

        <main className={`min-h-screen dark:bg-[#1b1b1be9] dark:text-white ${fadeIn  ? "fade-in" : "" }`}>

          <Outlet />

        </main>

      <Footer />
    </>
  );
};

export default HomePage;
