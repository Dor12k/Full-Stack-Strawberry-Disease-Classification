

import "../../index.css"
import React from 'react';
import Guest from "./Header/Guest";
import Member from "./Header/Member";
import SignInForm from "./Header/SignInForm";
import SignUpForm from "./Header/SignUpForm";

import { useState } from "react";
import { useContext } from 'react'
import { Link } from 'react-router-dom';
import { RxCross2 } from "react-icons/rx";
import { AuthContext } from '../../context/AuthContext';


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

    return (

        <>


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
            <nav className="relative z-10 w-full top-0 left-0 backdrop-blur-lg bg-black shadow-lg border-b border-gray-700 px-6 py-4 flex justify-between items-center  bg-currentColor">
                
                {/* Logo */}
                <Link to='/'>
                    <h1 className="text-2xl font-extrabold text-blue-400 tracking-wider">
                        🤖 AI Vision
                    </h1>                   
                </Link>

                {/* Navigation Links */}
                <ul className="hidden md:flex gap-6">
                    {["Home", "About", "Contact"].map((item) => (
                        <li key={item}>
                        <a href="#" className="text-gray-300 hover:text-blue-400 transition duration-300 hover:scale-110">
                            {item}
                        </a>
                        </li>
                    ))}
                </ul>
    
                {/* Auth Buttons */}
                <div className="flex gap-4">
                    {!isLoggedIn 
                    ? <Guest setType={setType} setShow={setShow} setErrors={setErrors}/> 
                    : <Member setIsLoggedIn={setIsLoggedIn}/>} 
                </div>
    
            </nav>

        </>
    );
};

export default Header;