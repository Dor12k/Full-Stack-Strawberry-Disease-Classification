

{/* This components is the member nav bar design*/}

import React from 'react'
import { useContext } from 'react'
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../../context/UserContext';
import { Link } from 'react-router-dom';


function Member({setIsLoggedIn}) {
        
    // Status and errors for signIn/signUp
    const navigate = useNavigate();

    const {user, setUser} = useContext(UserContext);

    // Logout button
    const handleLogOut = () => {

        console.log('Logged out successful');
        localStorage.removeItem('user')
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        
        setIsLoggedIn(false)
        setUser(null)
        navigate('/')
    }  

    const handleProfileBtn = () => {

        navigate('/profile')

    }

    return (

        <div className='flex'>
                
            <button 
                data-testid="signout-nav-button"
                onClick={handleLogOut} 
                className="px-5 py-2 border border-red-900 text-#252627ad hover:bg-red-800 hover:text-white transition duration-300 rounded-md shadow-md ">
                Sign Out
            </button>


            <Link to='/profile' >
                <button        
                    data-testid="profile-nav-button"
                    className="visible w-24 h-[100%] px-5 py-2 bg-red-800 text-white hover:bg-red-800 hover:text-white transition duration-300 rounded-md shadow-md ml-4">
                    Profile
                </button>                                          
            </Link>

        </div>
    )
}

export default Member
