

// Profile Card

import React from "react";
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


export default function UserProfileCard({ user, onEditPopUp, onDeleteBtn, loading }) {


    return (

    <>
        {/* Profile Card */}
        <div className="bg-blue-900 shadow-2xl rounded-xl p-10 w-full max-w-md text-center border-white border-solid border-2">

            {/* User profile picture */}
            <div className="mb-6">
                {user.profile_picture ? (
                    <img src={user.profile_picture } alt="Profile" className="w-40 h-40 rounded-full mx-auto border-8 border-white shadow-lg mb-6" />
                ) : (
                    <div data-testid='profile-placeholder' className="w-40 h-40 rounded-full bg-gray-300 mx-auto border-8 border-white shadow-lg mb-6"></div>
                )}
            </div>

            <h2 className="text-5xl font-bold text-teal-700 mb-4">{user.username || 'Username'}</h2> 

            {/* User personal details */}
            <div className="space-y-4 text-left text-blue-400">
                <div className='flex gap-5 text-2xl'>
                    <p>Email:</p>
                    {user.email && (
                        <p>{user.email}</p>
                    )}
                </div>

                <div className='flex gap-5 text-2xl'>
                    <p>Full Name:</p>

                    <div className='flex gap-2 text-2xl'>
                        {user.first_name && (
                            <p>{user.first_name}</p>

                        )}
                        {user.last_name && (
                            <p>{user.last_name}</p>

                        )}
                    </div>

                </div>
            </div>

            {/* Buttons - Edit and Delete profile */}            
            <div className="flex items-center justify-center gap-20 mt-5">

                <button onClick={() => {onEditPopUp(true)}} className="bg-teal-600 text-white px-6 py-3 rounded-full mt-6 hover:bg-teal-700 transition duration-300 transform hover:scale-105">
                    Edit Profile
                </button>

                {loading ? 
                (
                    <button type="submit" className="w-56 px-6 py-3 rounded-full mt-6 bg-purple-800 outline-none hover:bg-purple-600 text-white" disabled>
                        <FontAwesomeIcon icon={faSpinner} spin /> Please wait...
                    </button>
                ):(
                    <button onClick={onDeleteBtn} className="bg-red-600 text-white px-6 py-3 rounded-full mt-6 hover:bg-red-700 transition duration-300 transform hover:scale-105">
                        Delete Profile
                    </button>
                )}

            </div>

        </div>

    </>
    );
}
