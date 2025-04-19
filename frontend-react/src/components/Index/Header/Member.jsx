

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

        console.log('Logged out');
        localStorage.removeItem('user')
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        console.log('User logged out ', user);
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
                className="px-5 py-2 border border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-black transition duration-300 rounded-md glow-on-hover">
                Sign Out
            </button>


            <Link to='/profile' >
                <button        
                    data-testid="profile-nav-button"
                    className="visible w-24 px-5 py-2 bg-blue-600 text-white hover:bg-blue-500 transition duration-300 rounded-md shadow-md glow-on-hover ml-4">
                    Profile
                </button>                                          
            </Link>

        </div>
    )
}

export default Member
