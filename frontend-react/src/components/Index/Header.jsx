

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
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faMoon } from '@fortawesome/free-solid-svg-icons';

const Header = () => {
    
    // const {user, setUser} = useContext(UserContext);
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

                {/* SignUp pop up window */}
                <div className={`${show ? 'visible opacity-100' : 'invisible opacity-0 pointer-events-none'} 
                                fixed inset-0 flex justify-center items-center bg-[#252627ad] z-10 transition-opacity duration-500`}>
                    
                    {/* Overlay - Dark background */}
                    <div onClick={() => setShow(false)} className="absolute inset-0 bg-black bg-opacity-30 z-40"/>

                        {/* Pop up window */}
                        <div role="dialog" className="w-[400px] bg-[#212123] px-6 py-4 rounded-md relative z-50 transform transition-all duration-500 scale-95"  
                            aria-modal="true" data-testid={type === 'signin' ? 'sign-in-modal' : 'sign-up-modal'} style={{ transform: show ? 'scale(1)' : 'scale(0.95)' }} >

                        <button onClick={() => setShow(false)} role="button" aria-label="Close" name="close" className="absolute right-4 top-4 text-xl cursor-pointer text-white z-70">
                            <RxCross2 />
                        </button>

                        {type === 'signin' 
                            ? <SignInForm errors={errors} setErrors={setErrors} setShow={setShow}/> 
                            : <SignUpForm errors={errors} setErrors={setErrors} setShow={setShow}/>
                        }
                    </div>
                </div>

        
                {/* Navigation Bar */}
                <nav className="relative z-10 w-full top-0 left-0 backdrop-blur-lg
                                bg-[#ececec] dark:bg-[#1f1f1f] dark:text-white shadow-lg border-b border-gray-100 
                                dark:border-gray-700 px-4 py-3 sm:px-6 sm:py-4 flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-0">



                    {/* Logo */}
                    <div>
                        <Link to='/'>
                            {!darkMode 
                                ? (<img src="/images/logo1.png" alt="Google Play" className="w-[250px] animate-slide-up" />)
                                : (<img src="/images/logo2.png" alt="Google Play" className="w-[250px] animate-slide-up" />)
                            }
                                            
                        </Link>
                    </div>

                    {/* Navigation Links */}
                    <div>

                    <ul className="hidden md:flex gap-6">
                        {[
                            { label: "Home", path: "/home" },
                            { label: "About", path: "/about" },
                            { label: "Contact", path: "/contact" },
                            { label: "Gallery", path: "/gallery" },
                            { label: "Articles", path: "/articles" },
                        ].map(({ label, path }) => (
                            <li key={label}>
                            <Link
                                to={path}
                                className="text-[#1f2121] dark:text-white text-2xl hover:text-blue-600 transition duration-300 hover:scale-110"
                            >
                                {label}
                            </Link>
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
                        <div className="mb-1">

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