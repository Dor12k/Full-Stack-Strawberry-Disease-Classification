
// Edit profile pop up

import React from 'react';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const EditProfilePopup = ({
    user,
    usernameRef,
    emailRef,
    passwordRef,
    newPasswordRef,
    firstNameRef,
    lastNameRef,
    imagePreview,
    handleImageUpload,
    handleSaveBtn,
    loading,
    setEditBtn,
    errors = {},
    setErrors,
}) => {


    return (
        <>
            {/* Overlay */}
            <div onClick={() => {setEditBtn(false); setErrors('');}} data-testid="overlay-background" className="absolute w-full h-full bg-black bg-opacity-30 z-40 transition-opacity duration-800 ease-in-out" />

            {/* Popup Form */}
            <div
                data-testid="edit-profile-popup"
                className="absolute w-[90vw] max-w-xl sm:max-w-2xl max-h-[90vh] bg-blue-500 rounded-3xl transition-opacity duration-300 ease-in-out top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-6 sm:p-8 shadow-2xl z-50 flex flex-col overflow-y-auto"
                >
                <form
                    onSubmit={(e) => {
                    e.preventDefault();
                    handleSaveBtn(e);
                    }}
                    className="flex flex-col"
                >
                    {/* Profile Picture */}
                    <div className="mb-6 relative self-center">
                    <label htmlFor="file-input" className="block w-32 h-32 sm:w-40 sm:h-40 rounded-full shadow-lg cursor-pointer">
                        {imagePreview ? (
                        <img
                            src={imagePreview}
                            alt="Edit Profile"
                            className="w-full h-full rounded-full object-cover border-8 border-white shadow-lg"
                        />
                        ) : (
                        <div className="w-full h-full p-4 rounded-full bg-gray-300 border-8 border-white shadow-lg flex items-center justify-center text-white text-sm sm:text-lg bg-opacity-50 text-center">
                            Upload your profile picture
                        </div>
                        )}
                        <input
                        data-testid="input-img-edit"
                        type="file"
                        id="file-input"
                        name="profile_picture"
                        accept="image/*"
                        className="absolute w-full h-full top-0 left-0 opacity-0 cursor-pointer z-10"
                        onChange={handleImageUpload}
                        />
                    </label>
                    </div>

                    {/* Input Fields */}
                    <div className="space-y-4">
                        {[
                            { label: 'Username', id: 'username-edit', name: 'username', ref: usernameRef, type: 'text' },
                            { label: 'Email', id: 'email-edit', name: 'email', ref: emailRef, type: 'email' },
                            { label: 'Password', id: 'password-edit', name: 'password', ref: passwordRef, type: 'password' },
                            { label: 'New Password', id: 'new-password-edit', name: 'new_password', ref: newPasswordRef, type: 'password' },
                            { label: 'First Name', id: 'first-name-edit', name: 'first_name', ref: firstNameRef, type: 'text' },
                            { label: 'Last Name', id: 'last-name-edit', name: 'last_name', ref: lastNameRef, type: 'text' },
                        ].map(({ label, id, name, ref, type }) => (
                            <div key={id} className="flex flex-col text-white text-base sm:text-lg">
                            <label htmlFor={id}>{label}</label>
                            <input
                                ref={ref}
                                type={type}
                                id={id}
                                name={name}
                                defaultValue={user?.[name] || ''}
                                placeholder={user?.[name] || label}
                                autoComplete={name}
                                className="px-3 py-2 rounded-md border outline-none border-[#c1c1c7] focus:border-purple-500 bg-transparent"
                            />
                            {errors[name] && (
                                <small className="text-danger p-1 text-red-600 text-sm lg:text-xl">
                                {errors[name]}
                                </small>
                            )}
                            </div>
                        ))}
                    </div>

                    {/* General Error */}
                    {errors.error && (
                        <div className="mt-4 text-red-600 bg-white text-lg lg:text-2xl text-center font-bold ">
                            {errors.error}
                        </div>
                    )}


                    {/* Submit & Close Buttons */}

                    <div className="w-full lg:text-xl flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 mt-6">

                        {loading ? 
                            (
                                <button
                                    type="submit"
                                    className="w-40 lg:w-44 sm:w-44 px-6 py-3 border-2 rounded-full bg-purple-800 text-white flex items-center justify-center gap-2 cursor-not-allowed"
                                    disabled
                                >
                                    <FontAwesomeIcon icon={faSpinner} spin />
                                    Please wait...
                                </button>
                            ) 
                            : 
                            (
                                <button data-testid="editProfile-save-button" type="submit"
                                        className="w-40 sm:w-44 px-6 py-3 border-2 rounded-full bg-teal-600 text-white hover:bg-teal-700 hover:shadow-lg transition duration-300 transform hover:scale-105">
                                    Save
                                </button>
                            )
                        }

                        <button
                            type="button"
                            onClick={() => { setEditBtn(false); setErrors(''); }}
                            className="w-40 sm:w-44 px-6 py-3 border-2 rounded-full bg-red-600 text-white hover:bg-red-700 transition duration-300 transform hover:scale-105"
                        >
                            Close
                        </button>

                    </div>

                </form>
            </div>
        </>
    );
};

export default EditProfilePopup;
