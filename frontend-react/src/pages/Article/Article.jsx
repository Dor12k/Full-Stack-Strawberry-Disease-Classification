

import React, { useState, useEffect, useContext } from 'react';
import axiosInstance from '../../axiosInstance';
import { UserContext } from '../../context/UserContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

import { useParams } from 'react-router-dom';

const Article = () => {

  const { user } = useContext(UserContext);
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [username, setUsername] = useState('');
  const [rating, setRating] = useState(4);
  const [text, setText] = useState('');
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [messageColor, setMessageColor] = useState('green');

  
  const { slug  } = useParams();

  useEffect(() => {

    if(user){
      setUsername(user.username);
    }
    

    const getArticle = async () => {
      try {
        const response = await axiosInstance.get(`/articles/${slug}/`);
        console.log("response", response);
        setArticle(response.data.article);
        setReviews(response.data.reviews);
      } catch (error) {
        console.error('Error fetching article:', error);
      } finally {
        setLoading(false);
      }
    };
    getArticle();
  }, [slug , user]);

  const handlePostReview = async () => {
    setErrors({});
    setMessage('');
    if (user.username !== username) {
      setErrors({ username: 'Please enter your username' });
      return;
    }

    try {
      const response = await axiosInstance.post(`/articles/${article.slug}/feedback/`, {
        username,
        rating,
        text,
      });
      setMessage('Feedback submitted successfully!');
      setMessageColor('green');
      setUsername('');
      setRating(4);
      setText('');
      setReviews((prev) => [...prev, response.data]);
    } catch (error) {
      if (error.response && error.response.data) {
        const data = error.response.data;
        setErrors({
          username: data.username?.[0],
          rating: data.rating?.[0],
          text: data.text?.[0],
        });
        setMessage(data.detail || 'Something went wrong. Please try again later.');
        setMessageColor('red');
      }
    }
  };

  if (loading || !article) {
    return (
      <div className="flex justify-center items-center h-screen bg-slate-800 gap-10">
        <FontAwesomeIcon icon={faSpinner} spin className="text-white text-4xl" />
        <div className="text-2xl text-white">
          <h6>Loading...</h6>
        </div>
      </div>
    );
  }

  return (

    

    <div className=" w-full flex flex-col items-center justify-center dark:bg-[#1b1b1be1] dark:text-white">


        {/* Article Profile */}
        <div className="w-[80%] lg:w-[60%] flex flex-col lg:flex-row mt-20 gap-2 text-center rounded-3xl transition-all duration-300 bg-amber-100 dark:bg-[#1a1a1a] dark:text-white">

            {/* Author Profile */}
            <div className=" m-10 lg:w-1/3 lg:mx-20 lg:my-10 flex flex-col items-center justify-center gap-4">

                <img
                    src={article?.author_details?.picture_url || ''}
                    className="w-1/2 lg:w-3/4 lg:h-[80%] rounded-full transition-transform duration-300 hover:scale-105"
                    alt="Author"
                />
                <p className="w-1/5 lg:w-full h-[20%] flex items-center justify-center text-xl font-semibold">{article?.author?.name}</p>
            </div>

            {/* Article Details */}
            <div className="m-5 lg:w-2/3 lg:mx-8 lg:my-10 lg:text-start ">

                <h1 className="text-3xl font-bold pb-6">{article.title}</h1>

                <div className="h-32 pb-4">
                    <p className="text-xl">{article.description}</p>
                </div>

                <div className="h-32 pb-4">
                    <p className="text-xl">{article.introduction}</p>
                </div>

                {/* Article Tags */}
                <div>
                    {article.subject.map((subject, index) => (
                    <a key={index} href="#" className="text-xl font-bold text-blue-600 hover:text-blue-800">
                        <p className="inline-block mr-3">#{subject.title}</p>
                    </a>
                    ))}
                </div>
            </div>
        </div>

        <main className="w-[80%] lg:w-[60%] mt-20 p-6 space-y-10 text-start flex flex-col md:flex-row items-center justify-center rounded-3xl md:space-y-0 md:space-x-10 bg-amber-100 dark:bg-[#1a1a1a] dark:text-white">

            {/* Article Text + Images */}
            <div className="w-full ">
            {[[article.first_paragraph, article.first_media], 
              [article.second_paragraph, article.second_media], 
              [article.third_paragraph, article.third_media]].map((item, index) => item[0] && (
                    <div key={index} className="mb-0">
                        <p className='w-full p-2 lg:p-10 lg:text-2xl whitespace-pre-wrap break-words'>{item[0]}</p>
                        {/* Check if the media is video or image */}
                        {item[1]?.match(/\.(mp4|webm|ogg)$/i) ? (
                            <video 
                            src={item[1]} 
                            controls 
                            className="w-1/2 lg:w-1/3 m-auto p-8 rounded-[70px]"
                            >
                            Your browser does not support the video tag.
                            </video>
                            
                        ) : (
                            <img 
                            src={item[1]} 
                            alt="Article Media" 
                            className="w-full lg:w-[50%] m-auto p-8 rounded-[70px]" 
                            />
                        )}
                    </div>
                )
            )}
            </div>
        </main>

        {/* Feedback Form */}
        <section className="w-[80%] lg:w-[60%] p-6 my-10 rounded-xl shadow-lg  bg-amber-100 dark:bg-[#1a1a1a] dark:text-white ">

            <h2 className="text-2xl font-bold mb-4">Leave a Comment</h2>
            <div className="mb-4">
                <label className="block mb-1 font-semibold">Username</label>
                <input
                    type="text"
                    className="w-full border border-gray-300 rounded-lg p-2 dark:text-black"
                    value={username || user?.username || ''}
                    placeholder="Enter username"
                    onChange={(e) => setUsername(e.target.value)}
                />
                {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username}</p>}
            </div>

            <div className="mb-4">
            <label className="block mb-1 font-semibold">Rating (0-5)</label>
            <input
                type="number"
                min="0"
                max="5"
                className="w-full border border-gray-300 rounded-lg p-2 dark:text-black"
                value={rating}
                onChange={(e) => setRating(e.target.value)}
            />
            {errors.rating && <p className="text-red-500 text-sm mt-1">{errors.rating}</p>}
            </div>

            <div className="mb-4">
            <label className="block mb-1 font-semibold">Feedback</label>
            <textarea
                className="w-full border border-gray-300 rounded-lg p-2 dark:text-black"
                rows="4"
                value={text}
                onChange={(e) => setText(e.target.value)}
            />
            {errors.text && <p className="text-red-500 text-sm mt-1">{errors.text}</p>}
            </div>

            {message && <div className={`mb-4 text-sm font-semibold text-${messageColor}-600`}>{message}</div>}

            <button
            onClick={handlePostReview}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
            Submit Feedback
            </button>
        </section>

        {/* Reviews Section */}
        <section className="w-[80%] lg:w-[60%] mb-10 p-6 rounded-xl dark:bg-[#1a1a1a] dark:text-white">

            {reviews.map((review, index) => (
            <div key={index} className=" px-8 pt-6">
                <h2 className="text-2xl font-semibold">
                {review.username} {review.rating}{' '}
                {'⭐'.repeat(review.rating)}
                </h2>
                <p className="text-lg p-4 whitespace-pre-wrap break-words">{review.text}</p>
            </div>
            ))}

        </section>
    </div>
  );
};

export default Article;
