
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
                    className="px-5 py-2 border border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-black transition duration-300 rounded-md glow-on-hover">
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
                    className="px-5 py-2 bg-blue-600 text-white hover:bg-blue-500 transition duration-300 rounded-md shadow-md glow-on-hover ml-4">
                    Sign Up
                </button>
            </div>
            
        </div>
    )
}

export default Guest
