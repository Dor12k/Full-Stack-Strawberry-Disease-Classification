
{/* This components is the guest nav bar design*/}
import React from 'react'




function Guest({setType, setShow, setErrors}) {
    

    return (

        <div className='flex'>

            <div>
                <button 
                    data-testid="signin-nav-button"
                    onClick={() => {setType('signin'); setShow(true); setErrors({
                        email: '',
                        username: '',
                        password: '',
                        error: '',
                      })}} 
                      className="px-5 py-2 border border-red-900 text-#252627ad hover:bg-red-800 hover:text-white transition duration-300 rounded-md shadow-md ">
                    Sign In
                </button>
            </div>

            <div>
                <button 
                    data-testid="signup-nav-button"
                    onClick={() => {setType('signup'); setShow(true); setErrors({
                        email: '',
                        username: '',
                        password: '',
                        error: '',
                      })}}   
                      className="visible w-24 px-5 py-2 bg-red-800 text-white hover:bg-red-800 hover:text-white transition duration-300 rounded-md shadow-md  ml-4">
                    Sign Up
                </button>
            </div>
            
        </div>
    )
}

export default Guest
