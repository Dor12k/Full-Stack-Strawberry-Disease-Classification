


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

      <h2 className='text-white pb-4 text-center text-xl'>Sign in seconds</h2>

      <form onSubmit={handleSignIn}>       

        {/* Email Field */}
        <InputField
          onChange={inputHandle} 
          label="Email"
          type="email" 
          name="email" 
          id="email" 
          placeholder='email' 
          value={state.email} 
          autoComplete="email"
          className='px-3 py-2 rounded-md border outline-none border-[#5c5c5e] focus:border-purple-500 bg-transparent' 
        />
        <small>{errors.email && <div data-testid="email-error" className='text-danger my-2 px-1 text-red-600 text-lg'>{errors.email}</div>}</small>

        {/* Password Field */}
        <InputField
          onChange={inputHandle} 
          label="Password"
          type="password" 
          name="password" 
          id="password" 
          placeholder='password' 
          value={state.password} 
          autoComplete="current-password"
          className='px-3 py-2 rounded-md border outline-none border-[#5c5c5e] focus:border-purple-500 bg-transparent' 
        />
        <small>{errors.password && <div data-testid="password-error" className='text-danger my-2 px-1 text-red-600 text-lg'>{errors.password}</div>}</small>

    
        {errors.error && <div  data-testid="error-error" className='text-danger px-1 text-red-600 text-lg z-50 mb-5'>{errors.error}</div>}

        {success && <div className='alert alert-success px-1 text-green-600 text-xl mb-6'>Login Successful</div>}

        {/* Sign In button */}
        <div>
            {loading ? (
                <button type="submit" className='px-3 py-2 mt-1 rounded-md bg-purple-800 w-full outline-none hover:bg-purple-600 text-white' disabled><FontAwesomeIcon icon={faSpinner} spin /> Please wait...</button>
            ) : (
                <button type="submit" className='px-3 py-2 mt-1 rounded-md bg-purple-800 w-full outline-none hover:bg-purple-600 text-white'>Sign In</button>
            )}
        </div>

        <div className='flex py-4 justify-between items-center px-3'>
          
          <div className='w-[45%] h-[1px] bg-slate-500 '></div>

          <div className='w-[6%] text-center flex pb-1 px-1 text-white'>Or</div>

          <div className='w-[45%] h-[1px] bg-slate-500 '></div>

        </div>

        <div className='pb-4'>

            <button className='px-3 flex justify-center items-center gap-2 py-2 rounded-md bg-red-500 w-full outline-none hover:bg-red-600 text-white'>

            <span><BiLogoGmail /></span>

            <span>Login with Gmail </span>

            </button>

        </div>

        <div className='pb-4'>
            <button className='px-3 flex justify-center items-center gap-2 py-2 rounded-md bg-blue-500 w-full outline-none hover:bg-blue-600 text-white'>
                <span><FaFacebook /></span>
                <span>Login with Facebook </span>
            </button>
        </div>

      </form>
    </>

  );
};

export default SignInForm;
