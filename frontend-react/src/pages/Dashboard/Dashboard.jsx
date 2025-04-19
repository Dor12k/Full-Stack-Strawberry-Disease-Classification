

import React from 'react'
import { useEffect } from 'react';
import { useContext } from 'react'
import { AuthContext } from '../../context/AuthContext';
import { UserContext } from '../../context/UserContext'
import Header from '../../components/Index/Header';
import Footer from '../../components/Index/Footer';
import axiosInstance from '../../axiosInstance'




function Dashboard() {

  const accessToken = localStorage.getItem('accessToken')

  const { userContext, setUserContext } = useContext(UserContext);
  const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext); 
  const savedUser = localStorage.getItem('user');

  savedUser
  setIsLoggedIn
  userContext, setUserContext

  // Check accessToken for user premission
  useEffect(()=>{

    const fetchProtectedData = async () =>{

    try{
        const response = await axiosInstance.get('/protected-view/');
        response

        console.log("Dashboard view successful")

    }catch(error){
        console.error('Error fetching data:', error)
        console.error('Error fetching data:', error.response.data)
        console.log("Dashboard view failed:", error.response.data.detail)
    }
  }
  fetchProtectedData();
  }, [accessToken])
  


 

  const handleBtnGetID = async () => {

    // Get the access token from localStorage
    const accessToken = localStorage.getItem('accessToken');

    const user = JSON.parse(localStorage.getItem('user'));  // Parse the user data to an object
    

    // Send a GET request by user id
    const putResponse =  await axiosInstance.get(`/users/${user.id}/`, 
        {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'multipart/form-data',
            }
        })

        console.log("handleBtnGetID: ", putResponse.data)
  }

  const handleBtnGet = async () => {

    // Get the access token from localStorage
    const accessToken = localStorage.getItem('accessToken');

    // Send a PUT request to update user details
    const putResponse = await axiosInstance.get('/users/',
        {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'multipart/form-data',
            }
        })

        console.log("handleBtnGet: ", putResponse.data)
  }

  const handleBtnProfile = async () => {

    // Get the access token from localStorage
    const accessToken = localStorage.getItem('accessToken');

    // Send a PUT request to update user details
    const putResponse = await axiosInstance.get('/users/profile/',
        {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'multipart/form-data',
            }
        })

        console.log("handleBtnProfile: ", putResponse.data)
  }



 // Optional: Add a fallback for loading state if needed
  if (isLoggedIn === undefined) {
    return <div>Loading...</div>;
  }

  return (
    
      <>    
        <Header/>
              
          <div className="min-h-screen bg-gray-800 text-white flex flex-col items-center justify-center gap-10">
            
            
            <h1 className="text-4xl"> Welcome to Dashboard </h1>

            <div className="flex items-center justify-center top-36 left-32 m-4 gap-52">
                
                <div>
                    <button onClick={handleBtnGet} className="flex items-center bg-teal-600 text-white px-6 py-3 rounded-full mt-2 gap-2 text-xl hover:bg-teal-700 transition duration-300 transform hover:scale-105">
                        Button Get
                    </button>
                </div>


                <div>
                    <button onClick={handleBtnGetID} className="flex items-center bg-teal-600 text-white px-6 py-3 rounded-full mt-2 gap-2 text-xl hover:bg-teal-700 transition duration-300 transform hover:scale-105">
                        Button Get ID
                    </button>
                </div>


                <div>
                    <button onClick={handleBtnProfile} className="flex items-center bg-teal-600 text-white px-6 py-3 rounded-full mt-2 gap-2 text-xl hover:bg-teal-700 transition duration-300 transform hover:scale-105">
                        Button Profile
                    </button>
                </div>
                
                
            </div>
          </div>

        <Footer/>    
      </>
  )
}

export default Dashboard
