

import React from 'react'

import { useState } from 'react';
import { useEffect } from 'react';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import { AuthContext } from '../context/AuthContext';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


function LoadingPage() {


  const navigate = useNavigate();
  const [fadeIn, setFadeIn]  = useState(true);
  const {user, setUser} = useContext(UserContext);
  const {isLoggedIn, setIsLoggedIn} = useContext(AuthContext);
  const isDarkMode = document.documentElement.classList.contains('dark');




  return (


      <div className={`flex justify-center items-center h-screen bg-slate-800 gap-10 ${isDarkMode ? 'bg-[#1a1a1a]' : 'bg-slate-200'} ${fadeIn  ? "fade-in" : "" }`}>
        
        <FontAwesomeIcon icon={faSpinner} spin className="text-white text-4xl" />

        <div className="text-2xl text-white">
          <h6>Loading...</h6>
        </div>
        
      </div>


  )
}

export default LoadingPage
