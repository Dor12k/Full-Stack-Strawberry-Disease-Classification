
import React from 'react'
import { useState } from 'react';
import { useEffect } from 'react';
import { useContext } from 'react';
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { useLocation } from "react-router-dom";
import { AuthContext } from '../../context/AuthContext';
import { UserContext } from '../../context/UserContext';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import LoadingPage from '../LoadingPage';
import axiosInstance from '../../axiosInstance';
import ArticleCard from '../../components/Articles/ArticleCard';
import ScrollToTopButton from '../../components/utils/ScrollToTopButton';



function Home() {

    const savedUser = localStorage.getItem('user');
    const accessToken = localStorage.getItem('accessToken');

    const [ fadeIn, setFadeIn]  = useState(false);
    const [ loading, setLoading ] = useState(true);
    const [ classify, setClassify ] = useState(false);
    const [ isDragging, setIsDragging ] = useState(false);
    const [ imagePreview, setImagePreview ] = useState('');
    const [ selectedFile, setSelectedFile ] = useState(null);
    const [ popularArticles, setPopularArticles ] = useState([]);
    const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext); 
    const [ classificationLabel, setClassificationLabel ] = useState('');
    const [ classificationScore, setClassificationScore ] = useState('');
    

    // Check accessToken for user premission
    useEffect(()=>{

        setFadeIn(true)
        const fetchProtectedData = async () =>{

            try{
                
                const protectedResponse = await axiosInstance.get('/protected-view/');
                console.log("Home view successful");

                // const popularResponse = await axiosInstance.get('/articles/popular/?limit=4');
                const popularResponse = await axiosInstance.get('/articles/specific/');
                setPopularArticles(popularResponse.data);
                
            }catch(error){
                console.log("Home view failed or fetching articles failed:", error);
            }
        }
        fetchProtectedData();
    }, [accessToken])

    // Unified function to handle any image file upload (from input or drag-drop)
    function handleImageFile(file) {
        if (file) {
            setSelectedFile(file);
            setImagePreview(URL.createObjectURL(file));
            handleClassification(file);
        }
    }

    const handleFileInputChange = (e) => {
        
        if (e.target.files && e.target.files[0]) {
            handleImageFile(e.target.files[0]);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        const file = e.dataTransfer.files[0];
        if (file) {
            handleImageFile(file);
        }
        setIsDragging(false);
    }

    // Classify given image
    const handleClassification = async (file) => {

        setClassify(true)

        const formData = new FormData();
        formData.append('file', file)

        try{

            //  const response = await axiosInstance.post('https://aistrawberries.com/prediction/', formData, {
            //     headers: {
            //         'Authorization': `Bearer ${accessToken}`,
            //         'Content-Type': 'multipart/form-data',
            //     },
            // });

            // setClassificationLabel(response.data.label);
            // setClassificationScore(`${response.data.score}%`);

            setClassificationLabel('Angular Leaf Spot');
            setClassificationScore('95%');

            setClassify(false)

        }catch(error){
            console.log("Error", error);
            setClassify(false);
        }
    }

    const handleClear = () => {
        setClassify(false)
        setSelectedFile(null);
        setClassificationLabel('');
        setClassificationScore('');
        setImagePreview(''); 
    };

    // Fallback for loading state if needed
    if ((loading && isLoggedIn === undefined) ) {
        return <LoadingPage/>
    }

    return (

        <div className={`flex flex-col min-h-screen  dark:bg-[#1a1a1a] ${fadeIn  ? "fade-in" : "" }`}>
            
            {/* Section 1 – Top */}
            <section className="flex-1 min-h-[500px] dark:text-white flex items-center justify-center">

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
                                src="/images/Home/gg.png"
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
                        <source src="/videos/Home/App_Preview.mp4" type="video/mp4"  />
                        Your browser does not support the video tag.
                        </video>
                    </div>

                </div>

            </section>

            {/* Classification Section */}  
            <section className="flex-1 h-[500px] bg-[#ffe6c1db] dark:bg-[#1f1f1f] text-black dark:text-white py-16 px-6 sm:px-12 my-16 rounded-[30px] shadow-[0_12px_30px_-10px_rgba(0,0,0,0.15),0_-4px_8px_-2px_rgba(0,0,0,0.1)] transition-all duration-500">

                <div className="flex flex-col lg:flex-row gap-12 items-stretch max-w-screen-xl mx-auto px-6 py-2 w-full">

                    {/* Text */}
                    <div className="flex-[1.8] px-16 bg-[#fff8ef] dark:bg-[#2a2a2a] p-8 rounded-[30px] shadow-lg flex flex-col justify-center h-[500px]">

                        <h2 className="text-4xl lg:text-6xl font-bold mb-6">Quick Classification</h2>
                        <p className="text-base sm:text-lg lg:text-2xl text-left leading-relaxed text-gray-800 dark:text-gray-300">
                            Unsure about your strawberry plant's health? Upload a photo and let our AI model diagnose it for you — instantly and effortlessly. <br /><br />

                            <b>No image available?</b> We've got you covered — {" "}
                            <a href="/gallery" className="text-blue-500 hover:text-blue-600 hover:underline font-semibold">explore our sample gallery</a>
                            {" "}to get started.
                        </p>
                    </div>

                    {/* Upload */}
                    {imagePreview ? 
                    (
                        <div className="flex flex-col justify-between gap-2 bg-[#fff8ef] dark:bg-[#2a2a2a] p-4 lg:p-8 rounded-[30px] shadow-lg flex-1 h-[500px]">
                            
                            <div className="w-full flex-1 border-2 border-dashed border-[#bbb5ff] bg-[#f7f8ff] rounded-[20px] flex flex-col items-center justify-center text-center dark:border-[#2a2a2a] dark:bg-[#2a2a2a]">
                                
                                <img alt="Upload" src={imagePreview} className="w-full max-h-[200px] sm:max-h-[400px] md:max-h-[290px] rounded-t-[20px]" />      
                                
                                    {classify ?
                                    (
                                        <div className='w-full h-10 lg:h-20 flex items-center justify-center mx-2 my-2 lg:text-2xl sm:text-lg'>
                                            <div className='flex items-center justify-center gap-4'>
                                                <FontAwesomeIcon icon={faSpinner} spin /> Please wait...
                                            </div>
                                        </div>
                                    ):(
                                        <div className="w-full px-4 mb-2 lg:text-2xl sm:text-lg">
                                            <div className="grid grid-cols-5 items-center text-left">
                                                {/* Headers */}
                                                <p className="col-span-3 mb-2 text-gray-700 dark:text-gray-300">Classication</p>
                                                <p className="flex items-center justify-center col-span-2 mb-2 text-gray-700 dark:text-gray-300">Accuracy</p>

                                                {/* Values */}
                                                <Link  to={`/articles/${classificationLabel.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9\-]/g, '')}`} className="col-span-3">
                                                <p className="mb-2 underline text-blue-500 hover:text-blue-700 dark:text-blue-500 dark:hover:text-blue-700 break-words">
                                                    {classificationLabel}
                                                </p>
                                                </Link>

                                                <p className="col-span-2 mb-1 flex items-center justify-center text-green-500 dark:text-green-500">
                                                    {classificationScore}
                                                </p>
                                            </div>
                                        </div>

                                    )}

                            </div>

                            <button id="btn" type="submit" onClick={() => handleClear()} className="min-h-[50px] my-1 lg:my-2 w-full bg-blue-500 hover:bg-blue-600 text-white text-lg font-semibold rounded-[50px] cursor-pointer transition-colors duration-300">
                                Clear
                            </button>

                        </div>
                    ):(
                        <form id="drop-area" method="POST" encType="multipart/form-data" onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}
                                className={`flex-[1] rounded-[30px] p-4 lg:p-8 bg-[#fff8ef] dark:bg-[#2a2a2a] shadow-lg w-full max-w-md ${isDragging ? 'bg-blue-100 dark:bg-blue-900 border-blue-500' : 'bg-[#fff8ef] dark:bg-[#2a2a2a]'} transition-all duration-300 `}>
                            
                            <label htmlFor="input-file" className="w-full h-[90%] cursor-pointer block">

                                <input id="input-file" onChange={handleFileInputChange} name="image" type="file" accept="image/*" hidden />

                                <div className={`w-full h-[98%] border-2 rounded-[20px] p-6 text-center flex flex-col items-center justify-center 
                                        ${isDragging ? 'border-blue-500 bg-blue-100 dark:bg-blue-900' : 'border-[#bbb5ff] dark:border-[#555] bg-[#f7f8ff] dark:bg-[#1f1f1f]'} 
                                        transition-all duration-300 ease-in-out hover:scale-105 hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-gray-800`}>

                                    
                                    <img alt="Upload" src="/images/Home/upload.png" className="w-[60%] mb-6 rounded-[20px]"/>

                                    <p className="text-base sm:text-lg mb-2 text-gray-700 dark:text-gray-300">
                                        Drag and Drop or Click here to upload an image of a Strawberry Plant Leaf to Process
                                    </p>
                                    
                                    <span className="text-sm text-gray-500 dark:text-gray-400">Image must be less than 50 MB</span>
                                </div>

                            </label>

                            <input id="btn" type="button" onClick={handleClear} value="Clear" className="mt-4 lg:my-2 w-full h-[50px] bg-blue-500 hover:bg-blue-600 text-white text-lg font-semibold rounded-[50px] cursor-pointer transition-colors duration-300" />
                        </form>
                    )}

                </div>     

            </section>

            {/* Popular Articles Section */}
            <section className=" text-black dark:text-white py-16 px-6 sm:px-12 transition-colors duration-500">

                <div className="max-w-7xl mx-auto">

                    {/* Section Header */}
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="text-2xl sm:text-3xl font-semibold">Popular Articles</h3>
                        <a href="/articles" className="text-blue-600 hover:text-pink-500 text-2xl font-medium transition-colors duration-300">
                            View all articles
                        </a>
                    </div>

                    {/* Articles Grid */}
                    <div className="grid grid-cols-1sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">

                        {popularArticles.map((article,) => (
                            <div key={article.id} className='h-[80%]'>
                                <ArticleCard article={article} />
                            </div>
                        ))}

                    </div>
                </div>
            </section>

            <ScrollToTopButton />

        </div>
    )
}

export default Home
