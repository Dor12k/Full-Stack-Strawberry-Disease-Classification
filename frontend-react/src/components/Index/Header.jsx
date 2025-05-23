

import "../../index.css"
import React from 'react';
import Guest from "./Header/Guest";
import Member from "./Header/Member";
import SignInForm from "./Header/SignInForm";
import SignUpForm from "./Header/SignUpForm";

import { useState } from "react";
import { useEffect } from "react";
import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { RxCross2 } from "react-icons/rx";
import { AuthContext } from '../../context/AuthContext';
import { UserContext } from "../../context/UserContext";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faMoon } from '@fortawesome/free-solid-svg-icons';

import strawberryIcon from "/images/Header/strawberry-icon.svg";

const Header = () => {
    
    const {user, setUser} = useContext(UserContext);
    const {isLoggedIn, setIsLoggedIn} = useContext(AuthContext)

    // Define type=signIn/signUp
    const [type, setType] = useState('')

    // Sign in pop up window
    const [show, setShow] = useState(false)

    // Input error dict
    const [errors, setErrors] = useState({
        email: '',
        username: '',
        password: '',
        error: '',
    });

    const [darkMode, setDarkMode] = useState(() => {
        return localStorage.getItem('theme') === 'dark';
    });
    
    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [darkMode]);


    return (

        <>
        
            {/* Header Wrapper */}
            <header>

                {/* SignUp / SignIn pop up window */}
                <div className={`${show ? 'visible opacity-100' : 'invisible opacity-0 pointer-events-none'} 
                                fixed inset-0 flex justify-center items-center bg-[#252725ad] z-50 transition-opacity duration-500`}>
                    
                    {/* Overlay */}
                    <div onClick={() => setShow(false)} className="absolute inset-0 bg-black bg-opacity-30 z-40" />

                    {/* Pop-up window */}
                    <div
                        role="dialog"
                        aria-modal="true"
                        data-testid={type === 'signin' ? 'sign-in-modal' : 'sign-up-modal'}
                        style={{ transform: show ? 'scale(1)' : 'scale(0.95)' }}
                        className="w-[90%] max-w-md bg-[#324137] px-6 py-6 rounded-2xl shadow-lg shadow-black relative z-50 transition-all duration-500 scale-95"
                    >
                        {/* Close Button */}
                        <button
                            onClick={() => setShow(false)}
                            role="button"
                            aria-label="Close"
                            name="close"
                            className="absolute right-4 top-4 text-xl text-red-600 hover:text-red-800 z-70"
                        >
                            <RxCross2 />
                        </button>

                        {/* Optional decorative image */}
                        <div className="absolute top-6 left-8 w-8 h-20">
                            <img src="/images/Header/strawberry-icon.svg" alt="Strawberry" />
                        </div>

                        {/* Actual Form */}
                        {type === 'signin' 
                            ? <SignInForm errors={errors} setErrors={setErrors} setShow={setShow}/> 
                            : <SignUpForm errors={errors} setErrors={setErrors} setShow={setShow}/>
                        }
                    </div>
                </div>

        
                {/* Navigation Bar */}
                <nav className="relative z-10 w-full top-0 left-0 backdrop-blur-lg
                    bg-[#ececec] dark:bg-[#222222] dark:text-white
                    shadow-[0_-15px_32px_-2px_rgba(0,0,0,1.1)] dark:shadow-[0_-10px_25px_-0px_rgba(255,255,255,1.05)]
                    border-b border-gray-100 dark:border-gray-700
                    px-4 py-3 sm:px-6 sm:py-4 flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0">



                    {/* Logo */}
                    <div>
                        <Link to='/'>
                            {!darkMode 
                                ? (<img src="/images/Header/logo1.png" alt="Google Play" className="w-[250px] animate-slide-up" />)
                                : (<img src="/images/Header/logo2.png" alt="Google Play" className="w-[250px] animate-slide-up" />)
                            }
                                            
                        </Link>
                    </div>

                    {/* Navigation Links */}
                    <div>
                        <ul className="flex flex-row md:flex-row gap-6">
                            {[
                            { label: "Home", path: "/home" },
                            { label: "About", path: "/about" },
                            { label: "Contact", path: "/contact" },
                            { label: "Gallery", path: "/gallery" },
                            { label: "Articles", path: "/articles" },
                            ].map(({ label, path }) => (
                            <li key={label}>
                                {user ? (
                                <Link
                                    to={path}
                                    className="text-xl text-[#1a1a1a] dark:text-white dark:hover:text-blue-600 lg:text-2xl hover:text-blue-600 transition duration-300 hover:scale-110"
                                >
                                    {label}
                                </Link>
                                ) : (
                                <span
                                    onClick={() => {
                                    setType('signin');
                                    setShow(true);
                                    setErrors({
                                        email: '',
                                        username: '',
                                        password: '',
                                        error: '',
                                    });
                                    }}
                                    className="text-red-600 font-bold cursor-pointer text-lg lg:text-xl hover:text-green-500"
                                >
                                    {label}
                                </span>
                                )}
                            </li>
                            ))}
                        </ul>
                    </div>
        
                    {/* Right Corener */}
                    <div className="flex items-center justify-center gap-6">
                        
                        {/* Auth Buttons */}
                        <div className="flex gap-4">
                            {!isLoggedIn 
                            ? <Guest setType={setType} setShow={setShow} setErrors={setErrors}/> 
                            : <Member setIsLoggedIn={setIsLoggedIn}/>} 
                        </div>

                        {/* Dark/Light Mode */}
                        <div className="mb-[0.1rem]">

                            <button onClick={() => setDarkMode(!darkMode)}
                                    className="flex items-center text-lg gap-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-black dark:text-white rounded-full shadow hover:text-white hover:bg-red-800 transition duration-300">
                                
                                <FontAwesomeIcon icon={darkMode ? faSun : faMoon} size="lg"/>
                                {darkMode ? 'Light Mode' : 'Dark Mode'}

                            </button>

                        </div>

                    </div>

                </nav>
                
            </header>
        </>
    );
};

export default Header;