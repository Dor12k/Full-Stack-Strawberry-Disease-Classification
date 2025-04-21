

// src/components/Layout.jsx
import Header from "../components/Index/Header";
import Footer from "../components/Index/Footer";
import { Outlet } from "react-router-dom";

const HomePage = () => {
  return (
    <>
      <Header />

        <main className="min-h-screen">

          <Outlet />

        </main>

      <Footer />
    </>
  );
};

export default HomePage;
