
import React from 'react'
import { useRef } from 'react'
import { useState } from 'react'
import { useEffect } from 'react';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaLongArrowAltLeft } from "react-icons/fa";
import { AuthContext } from '../../context/AuthContext'
import { UserContext } from '../../context/UserContext';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';

import axiosInstance from '../../axiosInstance'
import UserProfileCard from '../../components/Profile/UserProfileCard';
import EditProfilePopup from '../../components/Profile/EditProfilePopup';



const Profile = () => {
    
    const navigate = useNavigate();
    const { user, setUser } = useContext(UserContext);
    const {isLoggedIn, setIsLoggedIn} = useContext(AuthContext)

    const usernameRef = useRef(null);
    const emailRef = useRef(null);
    const passwordRef = useRef(null);
    const newPasswordRef = useRef(null);
    const firstNameRef = useRef(null);
    const lastNameRef = useRef(null);

    const [imagePreview, setImagePreview] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [editBtn, setEditBtn] = useState(false);

    // Initialize state from user local storage
    useEffect(() => {
        if (user) {
            setImagePreview(user.profile_picture || '');
                    
            // Ensure refs are initialized before accessing their values
            if (usernameRef.current) {
                usernameRef.current.value = user.username || '';
            }
            if (emailRef.current) {
                emailRef.current.value = user.email || '';
            }
            if (firstNameRef.current) {
                firstNameRef.current.value = user.first_name || '';
            }
            if (lastNameRef.current) {
                lastNameRef.current.value = user.last_name || '';
            }
        }
    }, [user]);

    // Input error
    const [errors, setErrors] = useState({
        error: '',
        email: '',
        username: '',
        password: '',
        new_password: ''
    });

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onload = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    // Update user profile
    const handleSaveBtn = async (e) => {
        e.preventDefault();

        setErrors('')
        setLoading(true);

        // Ensure the current password is provided
        if (!passwordRef.current.value) {
            
            setErrors({password: 'Please enter your current password'})
            setLoading(false);
            return;
        }

        try {
            // Create form data object
            const formData = new FormData();
            formData.append('id', user.id);
            formData.append('email', emailRef.current.value);
            formData.append('username', usernameRef.current.value);
            formData.append('first_name', firstNameRef.current.value);
            formData.append('last_name', lastNameRef.current.value);
            formData.append('password', passwordRef.current.value);

            if (newPasswordRef.current.value) {
                formData.append('new_password', newPasswordRef.current.value);
            }

            if (selectedFile) {
                formData.append('profile_picture', selectedFile);
            }

            // Get the access token from localStorage
            const accessToken = localStorage.getItem('accessToken');

            // Send a PUT request to update user details
            const putResponse = await axiosInstance.put(`/users/${user.id}/`, formData, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'multipart/form-data',
                },
            });

            // Update local state and user data after successful response
            setEditBtn(false);
            setLoading(false);
            setUser(putResponse.data);
            console.log("putResponse:", putResponse);
            localStorage.setItem('user', JSON.stringify(putResponse.data));

        } catch (error) {
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
        } finally {
            setLoading(false)
        }
    };

    // Delete user profile
    const handleDeleteBtn = async (e) => {
        
        setLoading(true)
        e.preventDefault();
        if (!window.confirm('Are you sure you want to delete your account?')) return;

        try{
            // Get the access token from localStorage
            const accessToken = localStorage.getItem('accessToken');
    
            await axiosInstance.delete(`/users/${user.id}/`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                }
            })

            localStorage.removeItem('user');
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            setUser(null);
            setIsLoggedIn(false); 
            navigate('/');
        
            console.log('Deleted and Logged out');
        }catch (error) {

            console.log('Full error details:', error);

            const errorMessage =
              error.response?.data?.detail ||
              error.response?.data?.message ||
              'Failed to delete account. Please try again.';
        
            alert(errorMessage);
        } finally {
            setLoading(false);
        }
    }

    if (!user) {
        return <div className="flex justify-center items-center h-screen bg-slate-800 gap-10">
                    <FontAwesomeIcon icon={faSpinner} spin className="text-white text-4xl" />
                    <div className='text-2xl text-white'>
                        <h6>Loading.. </h6>
                    </div>
                </div>;
    }
    
    return (

        <>
            {user && (

                <div className=" min-h-screen bg-gradient-to-r from-indigo-600 to-purple-700 flex flex-col items-center justify-center p-6 relative">
                    
                    {/* Button - back to home.jsx */}
                    <div className="absolute top-0 left-0 m-4">
                        <Link to='/home'>
                            <button className="flex items-center bg-teal-600 text-white px-6 py-3 rounded-full mt-2 gap-2 text-xl hover:bg-teal-700 transition duration-300 transform hover:scale-105">
                                <FaLongArrowAltLeft className="text-2xl" /> Home
                            </button>
                        </Link>
                    </div>

                    {/* Profile Card */}
                    <UserProfileCard user={user} onEditPopUp={() => setEditBtn(true)} onDeleteBtn={handleDeleteBtn} loading={loading}/>

                    {/* PopUp Component - Edit Profile */}
                    {editBtn && (
                        <EditProfilePopup
                        user={user}
                        usernameRef={usernameRef}
                        emailRef={emailRef}
                        passwordRef={passwordRef}
                        newPasswordRef={newPasswordRef}
                        firstNameRef={firstNameRef}
                        lastNameRef={lastNameRef}
                        imagePreview={imagePreview}
                        handleImageUpload={handleImageUpload}
                        handleSaveBtn={handleSaveBtn}
                        loading={loading}
                        setEditBtn={setEditBtn}
                        errors={errors}
                        setErrors={setErrors}
                        />
                    )}

                </div>
            )};
        </>
    );
};

export default Profile
