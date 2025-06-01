

{/* This componenet in the sign up pop up form */}

import axios from 'axios';
import React from 'react';
import { useState } from 'react';
import InputField from './InputField'; 
import { FaFacebook } from "react-icons/fa";
import { BiLogoGmail } from "react-icons/bi";
import { useNavigate } from 'react-router-dom';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import axiosInstance from '../../../axiosInstance';

const SignUpForm = ({errors, setErrors, setShow }) => {
    
    const navigate = useNavigate();
    const [success, setSuccess] = useState(false)
    const [loading, setLoading] = useState(false)

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

    // Submit form of signUp
    const handleRegistration = async (e) => {
        e.preventDefault();
        setLoading(true);

        const userData = {
            email: state.email,
            username: state.username,
            password: state.password,
        }

        console.log("user data:", userData)
        try{
            // const response = await axios.post('http://127.0.0.1:8000/api/v1/users/', userData);
            const response = await axiosInstance.post('/users/', userData);

            response
            
            setErrors({});
            setShow(false);
            setSuccess(true);
            navigate("/");
            console.log("Registration successful");

        }catch(error){
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
        <h2 className="text-green-500 pb-4 text-center text-2xl font-bold">Sign up in seconds</h2>

        <form onSubmit={handleRegistration} className="space-y-4">

        {/* Username Field */}
        <InputField
            onChange={inputHandle}
            label="Username"
            type="text"
            name="username"
            id="username"
            placeholder="Username"
            value={state.username}
            autoComplete="username"
            className="w-full px-4 py-2 rounded-lg border text-black border-green-300 bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        {errors.username && (
            <small>
            <div data-testid="username-error" className="text-red-600 text-sm lg:text-lg ml-2 mt-2 font-bold">{errors.username}</div>
            </small>
        )}

        {/* Email Field */}
        <InputField
            onChange={inputHandle}
            label="Email"
            type="email"
            name="email"
            id="email"
            placeholder="Email"
            value={state.email}
            autoComplete="email"
            className="w-full px-4 py-2  text-black rounded-lg border border-green-300 bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        {errors.email && (
            <small>
            <div data-testid="email-error" className="text-red-600 text-sm lg:text-lg ml-2 mt-2 font-bold">{errors.email}</div>
            </small>
        )}

        {/* Password Field */}
        <InputField
            onChange={inputHandle}
            label="Password"
            type="password"
            name="password"
            id="password"
            placeholder="Password"
            value={state.password}
            autoComplete="current-password"
            className="w-full px-4 py-2  text-black rounded-lg border border-green-300 bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        {errors.password && (
            <small>
            <div data-testid="password-error" className="text-red-600 text-sm lg:text-lg ml-2 mt-2 font-bold">{errors.password}</div>
            </small>
        )}

        {errors.error && (
            <div data-testid="error-error" className="text-red-700 text-sm lg:text-lg ml-2 font-bold">{errors.error}</div>
        )}

        {success && (
            <div className="text-green-600 font-semibold text-center text-sm lg:text-lg ml-2">Registration Successful!</div>
        )}

        {/* Submit Button */}
        <div>
            {loading ? (
            <button
                type="submit"
                className="w-full px-4 py-2 mt-8 lg:text-xl rounded-lg bg-green-600 hover:bg-green-700 text-white flex items-center justify-center"
                disabled
            >
                <FontAwesomeIcon icon={faSpinner} spin className="mr-2" />
                Please wait...
            </button>
            ) : (
            <button
                type="submit"
                name="sign up"
                className="w-full px-4 py-2 mt-4 lg:text-xl rounded-lg bg-green-600 hover:bg-green-700 text-white font-semibold transition-colors"
            >
                Sign Up
            </button>
            )}
        </div>

        {/* Divider */}
        <div className="flex items-center my-4">
            <div className="flex-grow h-px bg-gray-300"></div>
            <span className="mx-2 text-gray-500">Or</span>
            <div className="flex-grow h-px bg-gray-300"></div>
        </div>

        {/* Gmail Button */}
        <button className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white transition-colors">
            <BiLogoGmail />
            <span>Sign Up with Gmail</span>
        </button>

        {/* Facebook Button */}
        <button className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors">
            <FaFacebook />
            <span>Sign Up with Facebook</span>
        </button>
        </form>
    </>
  );
};

export default SignUpForm;
