


import "../../index.css";

import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { UserContext } from "../../context/UserContext";
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useContext, useEffect, useRef, useState } from "react";

import axiosInstance from '../../axiosInstance';

import leafIcon from "/images/Dashboard/leaf.svg";
import strawberryIcon from "/images/Dashboard/strawberry.svg";
import ScrollToTopButton from "../utils/ScrollToTopButton";




const Dashboard = () => {

  const navigate = useNavigate();
  const containerRef = useRef(null);
  const [fadeIn, setFadeIn]  = useState(false);
  const [loading, setLoading] = useState(false);
  const {user, setUser} = useContext(UserContext);
  const {isLoggedIn, setIsLoggedIn, setManualRedirecting} = useContext(AuthContext)
  
  
  // Log in as a guest
  const handleGuestButton = async (e) => {

    setLoading(true);

    try{

      const response = await axiosInstance.post('/guest-login/')
    
      const user = response.data.user
      const accessToken = response.data.access;
      const refreshToken = response.data.refresh;

      if (!user || !accessToken || !refreshToken) {
        throw new Error("Invalid guest login response");
      }

      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user', JSON.stringify(user));

      setUser(user);      
      
      const isDarkMode = document.documentElement.classList.contains('dark');

      document.body.style.backgroundColor = isDarkMode ? 'black' : 'white';

      containerRef.current.classList.add('transition-background');
      containerRef.current.classList.remove('opacity-100');
      containerRef.current.classList.add('opacity-0');

      const handleTransitionEnd = () => {
        
        containerRef.current.removeEventListener('transitionend', handleTransitionEnd);
    
        // console.log("Navigating with state:", { fromDashboard: true });
        console.log("Login as a guest successful");
    
        setIsLoggedIn(true);
      };

      containerRef.current.addEventListener('transitionend', handleTransitionEnd);

    }catch(error){
      console.log("Error: ", error);
    }finally{
      setLoading(false);
    }
  }
  
  useEffect(() => {

    // setFadeIn(true);
    const container = document.querySelector(".animated-background");

    if (!container) return;

    const numIcons = 50;
    const icons = [strawberryIcon, leafIcon];

    for (let i = 0; i < numIcons; i++) {
      const img = document.createElement("img");
      img.src = icons[Math.floor(Math.random() * icons.length)];
      img.className = "floating-icon";
      img.style.left = `${Math.random() * 100}vw`;
      img.style.top = `${Math.random() * 100}vh`;
      img.style.animationDuration = `${4 + Math.random() * 6}s`;
      img.style.opacity = `${0.3 + Math.random() * 0.5}`;
      container.appendChild(img);
    }

    return () => {
      container.innerHTML = "";
    };
  }, []);

  return (

    <div
      ref={containerRef}
      className={`relative w-full min-h-screen bg-green-200 dark:bg-[#010201] overflow-hidden opacity-100 transition-background ${fadeIn  ? "fade-in" : "" }`}
    >

      {/* Background */}
      <div className="animated-background absolute inset-0 z-0 pointer-events-none" />

      {/* Main Text */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 py-20">

        <h1 className="text-5xl md:text-6xl font-extrabold text-green-500 mb-6 animate-glow leading-tight tracking-wide">
            From Seed to <span className="text-red-400">Strawberry 🍓</span>
        </h1>

        <p className="text-xl mt-10 md:text-2xl text-green-950 dark:text-gray-200 mb-10 max-w-3xl mx-auto leading-relaxed">
            Explore the remarkable journey of a strawberry — from seed to harvest — and see how AI transforms plant care into science.
        </p>

        {/* Video */}
        <div className="w-full overflow-hidden rounded-3xl border-4 border-red-400 shadow-2xl mb-10 max-w-4xl mx-auto backdrop-blur-sm cursor-pointer bg-white/10">
            <video controls className="w-full h-auto rounded-2xl">
                <source src="/videos/Home/videoplayback.mp4" type="video/mp4" />
                Your browser does not support the video tag.
            </video>
        </div>

        {/* Button */}
        <button onClick={handleGuestButton} disabled={loading}
                className="flex flex-row gap-2 lg:text-xl glow-on-hover bg-gradient-to-r from-green-500 to-red-500 hover:from-red-600 hover:to-pink-600 text-slate-200 font-semibold py-3 px-10 rounded-full shadow-xl text-lg transition-transform duration-300 transform hover:scale-105" >

              {loading ? 
              
                <div className="flex flex-row gap-4 mt-0 mb-1 ">

                  <FontAwesomeIcon icon={faSpinner} spin className="pt-2"/> 
                  <p> Please wait... </p> 

                </div>
              
              : 
              <div className="flex flex-row gap-2 mt-0 mb-1">
                <div className="text-2xl">🍓</div>
                <div className="pt-1">Continue as a Guest</div>
              </div>
            }

              
        </button>

      </div>

      <ScrollToTopButton />

    </div>
    
  );
};

export default Dashboard;
