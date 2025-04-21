
import React from 'react'
import { useEffect } from 'react';
import { useContext } from 'react'
import { AuthContext } from '../../context/AuthContext';
import { UserContext } from '../../context/UserContext';
import axiosInstance from '../../axiosInstance'

function Home() {

    const savedUser = localStorage.getItem('user');
    const accessToken = localStorage.getItem('accessToken')
    const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext); 
    const { userContext, setUserContext } = useContext(UserContext);

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

    
    // Optional: Add a fallback for loading state if needed
    if (isLoggedIn === undefined) {
        return <div>Loading...</div>;
    }



  return (


    <main className="flex flex-col min-h-screen">

        {/* Section 1 – Top */}
        <section className="flex-1 min-h-[500px] bg-white dark:bg-[#1f1f1f] dark:text-white flex items-center justify-center">

            <div className="flex flex-col lg:flex-row items-center justify-center h-full w-full px-6 sm:px-10 py-12 gap-14 dark:bg-[#1a1a1a] dark:text-white bg-white text-black transition-colors duration-500">

                {/* Text + Button */}
                <div className="flex-1 max-w-3xl flex flex-col items-center lg:items-start justify-center min-w-0 space-y-6 text-center lg:text-left gap-2 lg:mb-4  lg:ml-16">

                    <h1 className="lg:text-5xl sm:text-5xl font-bold tracking-tight">
                        Try Our New Application
                    </h1>

                    <p className="text-lg sm:text-xl lg:text-3xl leading-relaxed text-center lg:text-left">
                        Discover our new Android app and easily classify strawberry plant leaf diseases on the go!<br />
                        Enjoy fast and accurate results anytime, anywhere!<br /><br />
                        Download today and get a 14-day free trial!
                    </p>

                    <a href="#" className="inline-block">
                        <img
                            src="/images/gg.png"
                            alt="Google Play"
                            className="w-40 sm:w-48 mx-auto lg:w-[200px] lg:h-22 lg:my-4 lg:mx-0 hover:scale-105 transition-transform duration-300"
                        />
                    </a>
                </div>

                {/* Video Preview */}
                <div className="flex-1 max-w-md flex justify-center">
                    <video
                    controls
                    className="w-full h-auto lg:h-[550px] lg:w-[300px] rounded-[30px] shadow-lg border border-gray-300 dark:border-gray-700 hover:cursor-pointer"
                    >
                    <source src="/videos/App_Preview.mp4" type="video/mp4"  />
                    Your browser does not support the video tag.
                    </video>
                </div>

            </div>

        </section>


        {/* Classification Section */}  
        <section className="flex-1 min-h-[500px] bg-[#ffe6c1db] dark:bg-[#1f1f1f] text-black dark:text-white py-16 px-6 sm:px-12 transition-colors duration-500">
                
            <div className="flex flex-col lg:flex-row gap-12 items-stretch max-w-screen-xl mx-auto px-6 py-2 w-full">

                {/* Text */}
                <div className="flex-[1.8] px-16 bg-[#fff8ef] dark:bg-[#2a2a2a] p-8 rounded-[30px] shadow-lg flex flex-col justify-center min-h-[500px]">

                    <h2 className="text-4xl lg:text-6xl font-bold mb-6">Quick Classification</h2>

                    <p className="text-base sm:text-lg lg:text-3xl text-left leading-relaxed text-gray-800 dark:text-gray-300">
                        Use our model to quickly diagnose diseases in your plant's leaves.
                        Simply upload a photo of your strawberry plant leaf, and our model will classify the disease for you. <br/><br/>
                        
                        <b>Don't have an image? </b> No problem, browse
                        <a href="/gallery" className="text-blue-500 hover:text-blue-600 font-semibold ml-1"> our gallery </a> 
                        and choose a sample to get started!
                    </p>
                    </div>

                    {/* Upload */}
                    <form
                    method="POST"
                    encType="multipart/form-data"
                    className="flex-[1] rounded-[30px] p-8 bg-white dark:bg-[#2a2a2a] shadow-lg w-full max-w-md"
                    id="drop-area"
                    >
                    <label htmlFor="input-file" className="w-full h-[90%] cursor-pointer block">
                        <input name="image" type="file" accept="image/*" id="input-file" hidden />
                        <div className="w-full h-[98%] border-2 border-dashed border-[#bbb5ff] dark:border-[#555] bg-[#f7f8ff] dark:bg-[#1f1f1f] rounded-[20px] flex flex-col items-center justify-center p-6 text-center">
                        <img
                            src="/images/upload.png"
                            alt="Upload"
                            className="w-[60%] mb-6 rounded-[20px]"
                        />
                        <p className="text-base sm:text-lg mb-2 text-gray-700 dark:text-gray-300">
                            Drag and Drop or Click here to upload an image of a Strawberry Plant Leaf to Process
                        </p>
                        <span className="text-sm text-gray-500 dark:text-gray-400">Image must be less than 50 MB</span>
                        </div>
                    </label>

                    <input
                        type="button"
                        onClick={() => console.log("Clear clicked")}
                        value="Clear"
                        className="my-1 lg:my-2 w-full h-[50px] bg-blue-500 hover:bg-blue-600 text-white text-lg font-semibold rounded-[50px] cursor-pointer transition-colors duration-300"
                        id="btn"
                    />
                </form>
            </div>     

        </section>


        {/* Popular Articles Section */}
        <section className="bg-[#f5f5f5] dark:bg-[#1a1a1a] text-black dark:text-white py-16 px-6 sm:px-12 transition-colors duration-500">

            <div className="max-w-7xl mx-auto">

                {/* Section Header */}
                <div className="flex justify-between items-center mb-8">
                    <h3 className="text-2xl sm:text-3xl font-semibold">Popular Articles</h3>
                    <a href="/articles" className="text-blue-600 hover:text-pink-500 font-medium transition-colors duration-300">
                        View all articles
                    </a>
                </div>

                {/* Articles Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                    {[1, 2, 3, 4].map((_, i) => (
                        <div key={i}
                             className="relative bg-[#e9e6f0] dark:bg-[#2e2e2e] text-[#1E1E1E] dark:text-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">

                        {/* Reviews Preview */}
                        <div className="absolute top-4 left-4 text-lg font-bold text-white opacity-0 hover:opacity-100 transition-opacity duration-300">
                            Reviews 4.8 ⭐
                        </div>

                        <a href="/article/sample-article">
                            <img src="/images/Smart-Argiculture.jpg" alt="Article" className="w-full h-52 object-cover"/>
                        </a>

                        <div className="p-5">
                            <h4 className="text-lg font-semibold mb-2">Sample Article</h4>
                            <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
                              Short description of the article goes here.
                            </p>
                            <p className="text-sm font-medium text-gray-800 dark:text-gray-200">John Doe</p>
                            <a href="/article/sample-article" className="text-blue-600 dark:text-blue-400 text-sm font-medium hover:underline">
                                Read More
                            </a>
                        </div>
                    </div>
                ))}
                </div>
            </div>
        </section>


    </main>
  )
}

export default Home
