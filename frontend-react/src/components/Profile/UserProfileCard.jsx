

// Profile Card

import React from "react";
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


export default function UserProfileCard({ user, onEditPopUp, onDeleteBtn, loading }) {


    return (

        <>
            {/* Profile Card */}
            <div className="bg-blue-900 shadow-2xl rounded-xl p-6 sm:p-10 w-full max-w-md mx-auto text-center border-white border-solid border-2">

                {/* User profile picture */}
                <div className="mb-6">
                    {user.profile_picture ? (
                        <img
                            src={user.profile_picture}
                            alt="Profile"
                            className="w-32 h-32 sm:w-40 sm:h-40 rounded-full mx-auto border-8 object-cover object-center border-white shadow-lg"
                            />
                    ) : (
                        <div
                            data-testid='profile-placeholder'
                            className="w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-gray-300 mx-auto border-8 border-white shadow-lg"
                        ></div>
                    )}
                </div>

                {/* Username */}
                <h2 className="text-3xl sm:text-5xl font-bold text-teal-700 mb-4">
                    {user.username || 'Username'}
                </h2>

                {/* User personal details */}
                <div className="space-y-4 text-left text-blue-400">
                    <div className='flex flex-col sm:flex-row gap-1 sm:gap-5 text-lg sm:text-2xl'>
                        <p className="font-semibold">Email:</p>
                        {user.email && <p>{user.email}</p>}
                    </div>

                    <div className='flex flex-col sm:flex-row gap-1 sm:gap-5 text-lg sm:text-2xl'>
                        <p className="font-semibold">Full Name:</p>
                        <div className='flex gap-2'>
                            {user.first_name && <p>{user.first_name}</p>}
                            {user.last_name && <p>{user.last_name}</p>}
                        </div>
                    </div>
                </div>

                {/* Buttons - Edit and Delete profile */}
                <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-20 mt-6">

                    <button
                        onClick={() => onEditPopUp(true)}
                        className="bg-teal-600 text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-full hover:bg-teal-700 transition duration-300 transform hover:scale-105"
                    >
                        Edit Profile
                    </button>

                    {loading ? (
                        <button
                            type="submit"
                            className="px-5 sm:px-6 py-2.5 sm:py-3 rounded-full bg-purple-800 outline-none hover:bg-purple-600 text-white"
                            disabled
                        >
                            <FontAwesomeIcon icon={faSpinner} spin /> Please wait...
                        </button>
                    ) : (
                        <button
                            onClick={onDeleteBtn}
                            className="bg-red-600 text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-full hover:bg-red-700 transition duration-300 transform hover:scale-105"
                        >
                            Delete Profile
                        </button>
                    )}
                </div>
            </div>
        </>
    );
}
