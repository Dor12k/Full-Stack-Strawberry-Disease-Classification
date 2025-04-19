
import "../../index.css"
import React from 'react';
import { useEffect } from "react";
import { useNavigate } from 'react-router-dom';


const Main = () => {

    // Generate the animated circuit board effect or glowing connections
    useEffect(() => {

        // Generate the animated circuit board effect or glowing connections
        const numCircles = 100;
        const circleContainer = document.querySelector(".circuit-field");

        for (let i = 0; i < numCircles; i++) {
            let circle = document.createElement("div");
            circle.classList.add("circle");
            circle.style.top = `${Math.random() * 100}vh`;
            circle.style.left = `${Math.random() * 100}vw`;
            circle.style.animationDuration = `${Math.random() * 3 + 2}s`;
            circleContainer.appendChild(circle);
        }
    }, []);
    
    const navigate = useNavigate();

    const handleClick = () => {
        
        navigate('/dashboard');  
        console.log("User is a guest and can not access Dashboard page")
    };


    return (

        <div className="relative min-h-screen bg-black overflow-hidden">

            {/* Circuit Board / Data Flow Background */}
            <div className="circuit-field absolute inset-0">
                                
            </div>

            {/* Hero Section */}
            <section className="relative z-0 flex flex-1 items-center justify-center text-center px-6 pt-32">
                
                <h2 className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-600 animate-glow pulse-animation">
                    AI & Computer Vision: Into the Future
                </h2>


            </section>

            {/* Dashboard button */}
            <div className="absolute inset-0 flex items-center justify-center">
                <button onClick={handleClick} className="h-16 bg-blue-500 text-white py-2 px-6 rounded-md hover:bg-blue-600 transition duration-300">
                    Continue as a guest
                </button>
            </div>

        </div>
    );
};

export default Main;