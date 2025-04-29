
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
            <div data-testid="edit-profile-popup" className="absolute w-[600px] h-[1000px] bg-blue-500 rounded-3xl transition-opacity duration-300 ease-in-out top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-8 shadow-2xl z-50 flex flex-col justify-center px-16" >
                <form onSubmit={(e) => { e.preventDefault(); handleSaveBtn(e); }} className="h-[1000px]">

                    {/* Profile Picture */}
                    <div className="mb-6 relative">
                        <label htmlFor="file-input" className="w-40 h-40 rounded-full shadow-lg cursor-pointer block mx-auto">
                            {imagePreview ? (
                                <img
                                    src={imagePreview}
                                    alt="Edit Profile"
                                    className="w-40 h-40 rounded-full mx-auto border-8 border-white shadow-lg mb-6"
                                />
                            ) : (
                                <div className="w-40 h-40 rounded-full bg-gray-300 mx-auto border-8 border-white shadow-lg mb-6 relative flex items-center justify-center text-white text-lg bg-opacity-50">
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
                    <div>

                        {[
                            { label: 'Username', id: 'username-edit', name: 'username', ref: usernameRef, type: 'text' },
                            { label: 'Email', id: 'email-edit', name: 'email', ref: emailRef, type: 'email' },
                            { label: 'Password', id: 'password-edit', name: 'password', ref: passwordRef, type: 'password' },
                            { label: 'New Password', id: 'new-password-edit', name: 'new_password', ref: newPasswordRef, type: 'password' },
                            { label: 'First Name', id: 'first-name-edit', name: 'first_name', ref: firstNameRef, type: 'text' },
                            { label: 'Last Name', id: 'last-name-edit', name: 'last_name', ref: lastNameRef, type: 'text' },
                        ].map(({ label, id, name, ref, type }) => (
                            <div key={id} className="flex flex-col gap-3 mb-3 text-white text-xl">
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
                                    <small className="text-danger my-2 px-1 text-red-600 text-lg">
                                        {errors[name]}
                                    </small>
                                )}
                            </div>
                        ))}

                    </div>

                    {/* General Error */}
                    {errors.error && (
                        <div className="flex flex-col gap-3 mb-3 text-white text-xl">
                            <small className="text-danger px-1 text-red-800 text-2xl">
                                {errors.error}
                            </small>
                        </div>
                    )}

                    {/* Submit Button */}
                    <div className="w-48 m-auto flex items-center justify-center">
                        {loading ? (
                            <button type="submit" className="w-56 px-6 py-3 rounded-full mt-6 bg-purple-800 text-white" disabled>
                                <FontAwesomeIcon icon={faSpinner} spin /> Please wait...
                            </button>
                        ) : (
                            <button data-testid="editProfile-save-button" type="submit" className="w-32 bg-teal-600 text-white px-6 py-3 rounded-full mt-6 hover:bg-teal-700 hover:shadow-lg transition duration-300 transform hover:scale-105">
                                Save
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </>
    );
};

export default EditProfilePopup;
