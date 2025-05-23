


{/* This componenet in the sign in pop up form */}

import React from 'react';
import axios from 'axios';
import { useState } from 'react';
import { useContext } from 'react'
import { jwtDecode } from 'jwt-decode';
import { FaFacebook } from "react-icons/fa";
import { BiLogoGmail } from "react-icons/bi";
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../../context/AuthContext';
import { UserContext } from '../../../context/UserContext';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axiosInstance from '../../../axiosInstance';
import InputField from './InputField'; 

const SignInForm = ({errors, setErrors, setShow}) => {

  // Status and errors for signIn/signUp
  const navigate = useNavigate();
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const {user, setUser} = useContext(UserContext);
  const {isLoggedIn, setIsLoggedIn} = useContext(AuthContext)



  // Update user details in signin/signup window
  const [state, setState] = useState({
      email: '',
      username: '',
      password: '',
  })
  
  // Update the field in the signin/signup window
  const inputHandle = (e) => {
      setState({
          ...state,
          [e.target.name]: e.target.value
      })
  }
  
  // Submit form of signin
  const handleSignIn = async (e) => {

    e.preventDefault();

    setErrors('');
    setLoading(true);

    const userData = state

    try{
        const response = await axios.post('http://127.0.0.1:8000/api/v1/token/', userData) 

        // Store token in localStorage
        console.log("Sign In successful");
        // console.log("Sign In response: ", response);

        const user = response.data.user
        const accessToken = response.data.access;
        const refreshToken = response.data.refresh;

        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('user', JSON.stringify(user));

        setUser(user);
        setErrors(''); 
        setShow(false);
        setSuccess(true);
        setIsLoggedIn(true);
        navigate("/home");
        
    }catch(error){
            console.log(error)
            // Handle different error response formats
            if (error.response) {
                
                if (error.response.data) {
                    if (error.response.headers['content-type'].includes('application/json')) {
                        setErrors(prevErrors => ({
                            ...prevErrors,
                            ...(error.response.data.email && { email: error.response.data.email }),
                            ...(error.response.data.username && { username: error.response.data.username }),
                            ...(error.response.data.password && { password: error.response.data.password }),
                            ...(error.response.data.new_password && { new_password: error.response.data.new_password })
                        }));
                        console.log("Error response data:", error.response.data);
                    } else {
                        console.log("Error response is not JSON. Received HTML or other content.", error);
                        setErrors({ error: 'An unexpected error occurred on the server. Please try again later.' });
                    }
                }
                else{
                    setErrors({ error: 'An unexpected error occurred.' });
                }
            } else if (error.request) {
                // No response received from the server
                console.log("No response received:", error.request);
                setErrors({ error: 'No response received from the server. Please try again later.' });
            } else {
                // Error in setting up the request
                console.log("Error in request:", error.message);
                setErrors({ error: 'An error occurred while sending the request. Please try again later.' });
            }        
    }finally{
        setLoading(false)
    }
  }

  return (

    <>
        <h2 className="text-green-500 text-center text-xl pb-4 font-semibold">Sign in seconds</h2>

        <form onSubmit={handleSignIn} className="space-y-2">

        {/* Email Field */}
        <InputField
            onChange={inputHandle}
            label="Email"
            type="email"
            name="email"
            id="email"
            placeholder="email"
            value={state.email}
            autoComplete="email"
            className="w-full px-3 py-2 rounded-md border border-green-300 text-white placeholder-gray-400 focus:outline-none focus:border-[#A63A3A] transition-colors"
                    
        />
        {errors.email && (
            <div data-testid="email-error" className="text-red-600 text-sm mt-0 px-0 lg:text-lg ml-2 font-bold">
                {errors.email}
            </div>
        )}

        {/* Password Field */}
        <InputField
            onChange={inputHandle}
            label="Password"
            type="password"
            name="password"
            id="password"
            placeholder="password"
            value={state.password}
            autoComplete="current-password"
            className="w-full px-3 py-2 rounded-md border border-green-300 text-white placeholder-gray-400 focus:outline-none focus:border-[#A63A3A] transition-colors"
                   
        />
        {errors.password && (
            <div data-testid="password-error" className="text-red-600 text-sm mt-1 px-1 lg:text-lg ml-2 font-bold">
                {errors.password}
            </div>
        )}

        {/* General Error */}
        {errors.error && (
            <div
            data-testid="error-error"
            className="text-red-600 text-sm mt-2 px-1 font-semibold"
            >
            {errors.error}
            </div>
        )}

        {/* Success message */}
        {success && (
            <div className="text-green-500 text-base mt-4 px-1 font-semibold">
            Login Successful
            </div>
        )}

        {/* Submit Button */}
        <div>
            {loading ? (
            <button
                type="submit"
                className="w-full py-2 rounded-md bg-green-600 text-white font-semibold cursor-not-allowed flex items-center justify-center gap-2"
                disabled
            >
                <FontAwesomeIcon icon={faSpinner} spin />
                Please wait...
            </button>
            ) : (
            <button
                type="submit"
                className="w-full py-2 lg:text-xl mt-6 rounded-md bg-green-600 hover:bg-green-700 transition-colors text-white font-semibold"
            >
                Sign In
            </button>
            )}
        </div>

        {/* Or divider */}
        <div className="flex items-center justify-center gap-3 py-4">
            <hr className="flex-grow border border-slate-500" />
            <span className="text-white text-sm">Or</span>
            <hr className="flex-grow border border-slate-500" />
        </div>

        {/* Gmail Button */}
        <div>
            <button
            type="button"
            className="w-full flex justify-center items-center gap-2 py-2 rounded-md bg-red-600 hover:bg-red-700 text-white font-semibold transition-colors"
            >
            <BiLogoGmail className="text-xl" />
            <span>Login with Gmail</span>
            </button>
        </div>

        {/* Facebook Button */}
        <div>
            <button
            type="button"
            className="w-full flex justify-center items-center gap-2 py-2 rounded-md bg-blue-700 hover:bg-blue-800 text-white font-semibold transition-colors"
            >
            <FaFacebook className="text-xl" />
            <span>Login with Facebook</span>
            </button>
        </div>

        </form>
    </>

  );
};

export default SignInForm;
