

import './Article.css'
import React from 'react';
import sanitizeHtml from 'sanitize-html';
import axiosInstance from '../../axiosInstance';

import { useParams } from 'react-router-dom';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { useState, useEffect, useContext, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import FormattedParagraph from '../../components/Articles/FormattedParagraph';



const Article = () => {

  const { slug } = useParams();
  const { user } = useContext(UserContext);

  const navigate = useNavigate();
  const hasFetchedRef = useRef(false);
  const [text, setText] = useState('');
  const [rating, setRating] = useState(4);
  const [errors, setErrors] = useState({});
  const [reviews, setReviews] = useState([]);
  const [message, setMessage] = useState('');
  const [username, setUsername] = useState('');
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [messageColor, setMessageColor] = useState('green');


  useEffect(() => {

    if(user){
      setUsername(user.username);
    }
    
    if (!user || hasFetchedRef.current) return;

    const getArticle = async () => {

      try {
        const articleRresponse = await axiosInstance.get(`/articles/${slug}/`);
        setArticle(articleRresponse.data);
        
        const feedbackResponse = await axiosInstance.get(`/articles/${slug}/feedback`);
        setReviews(feedbackResponse.data);
        
        if (!user?.is_premium && !user?.is_staff && articleRresponse.data.card !== 'regular') {
          navigate('/home');
          console.log('Article: User try to access a premium article');
          alert('This article is available for premium users only.');
        }else{
          console.log('Article page loaded successful');
        }

      } catch (error) {
        console.error('Error fetching article:', error);
      } finally {
        setLoading(false);
        hasFetchedRef.current = true;
      }
    };
    getArticle();
  }, [navigate, slug , user, ]);

  const handlePostReview = async () => {
    setErrors({});
    setMessage('');
    if (user.username !== username) {
      setErrors({ username: 'Please enter your username' });
      return;
    }

    try {
      const response = await axiosInstance.post(`/articles/${slug}/feedback/`, {
        username,
        rating,
        text,
      });

      const isUpdate = reviews.some(r => r.username === response.data.username);
      
      
      setMessage(isUpdate ? 'Feedback updated successfully!' : 'Feedback submitted successfully!');
      setMessageColor('green');
      setRating(4);
      setText('');

      setReviews(prev =>
        isUpdate
          ? prev.map(r => r.username === response.data.username ? response.data : r) 
          : [...prev, response.data]
      );

    } catch (error) {

      if (error.response && error.response.data) {

        const data = error.response.data;
        setMessageColor('red');
        
        setErrors({
          username: data.username?.[0],
          rating: data.rating?.[0],
          text: data.text?.[0],

        });
      }else{
          setMessage(data.detail || 'Something went wrong. Please try again later.');
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

        {/* Button - add article */}
        {user.is_staff && (

          <div className="w-full my-4 px-2 lg:px-10 flex justify-end">
            <Link to={`/edit-article/${article.slug}`}>
              <button className="bg-teal-600 text-white px-6 py-3 rounded-full mt-2 gap-2 text-xl hover:bg-teal-700 transition duration-300 transform hover:scale-105">
                Edit Article
              </button>
            </Link>
          </div>

        )}

        {/* Article Profile */}
        <div className="w-[80%] lg:w-[60%] flex flex-col lg:flex-row mt-20 gap-2 text-center rounded-3xl transition-all duration-300 bg-amber-100 dark:bg-[#1a1a1a] dark:text-white">

            {/* Author Profile */}
            <div className="m-10 lg:w-1/3 lg:mx-20 lg:my-10 flex flex-col items-center justify-center gap-4">

                <img
                    src={article?.author_details?.picture_url || ''}
                    className="w-1/2 lg:w-3/4 lg:h-[80%] rounded-full transition-transform duration-300 hover:scale-105"
                    alt="Author"
                />
                <p className="w-1/5 lg:w-full h-[20%] flex items-center justify-center text-xl font-semibold">{article?.author_details?.name}</p>
            </div>

            {/* Article Details */}
            <div className="m-5 lg:w-2/3 lg:mx-8 lg:my-10 lg:text-start ">

                <h1 className="text-3xl font-bold pb-6">{article.title}</h1>

                <div className={`${article.card == 'flat' ? 'h-72 lg:h-48' : 'h-72 lg:h-32 pb-4'}`}>
                    <p className="text-xl" dangerouslySetInnerHTML={ {__html: article.description}}></p>
                </div>

                <div className={`${article.card == 'flat' ? 'h-72 lg:h-48' : 'h-72 lg:h-32 pb-4'}`}>
                    <p className="text-xl" dangerouslySetInnerHTML={ {__html: article.introduction}}></p>
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

        {/* Article Text + Images */}
        <div className="w-[80%] lg:w-[60%] mt-20 p-6 space-y-10 text-start flex flex-col md:flex-row items-center justify-center rounded-3xl md:space-y-0 md:space-x-10 bg-amber-100 dark:bg-[#1a1a1a] dark:text-white">

          <div className="w-full lg:text-xl lg:p-10">
            {[[article.first_paragraph, article.first_media], 
              [article.second_paragraph, article.second_media], 
              [article.third_paragraph, article.third_media]].map((item, index) => item[0] && (
              <div key={index} className="mb-4">

                <div className="article-content prose prose-sm dark:prose-invert whitespace-pre-line list-decimal list-inside"
                  dangerouslySetInnerHTML={{
                    __html: sanitizeHtml(item[0], {
                    allowedTags: ['p', 'ol', 'ul', 'li', 'strong', 'em', 'br', 'u', 'blockquote'], 
                    allowedAttributes: {'*': ['class'], }, })
                  }}
                />
                        

                {/* Check if the media is video or image */}
                {item[1]?.match(/\.(mp4|webm|ogg)$/i) ? (
                    <video 
                    src={item[1]} 
                    controls 
                    className={`w-1/2 lg:w-1/3 m-auto p-8 rounded-[70px]
                                ${(article.id == 1) && index == 2 ? 'lg:cursor-pointer' : 'lg:cursor-auto'} `}>
                      Your browser does not support the video tag.
                    </video>
                    
                ) : (
                    <img 
                    src={item[1]} 
                    alt="Article Media" 
                    className={`w-full m-auto p-8 rounded-[70px]
                                ${(article.id == 6 || article.id == 8) && index == 2 ? 'lg:w-[100%]' : 'lg:w-[50%]'} 
                              `}
                    />
                )}
                </div>
              )
            )}
            </div>
        </div>

        {/* Feedback Form */}
        <section className="w-[80%] lg:w-[60%] p-6 my-10 rounded-xl shadow-lg  bg-amber-100 dark:bg-[#1a1a1a] dark:text-white ">

            <h2 className="text-2xl font-bold mb-4">Leave a Comment</h2>

            <div className="mb-4">
                <label className="lg:text-xl block mb-1 font-semibold">Username</label>
                <input
                    type="text"
                    className="w-full lg:text-xl border border-gray-300 rounded-lg p-2 dark:text-black"
                    value={username || user?.username || ''}
                    placeholder="Enter username"
                    onChange={(e) => setUsername(e.target.value)}
                />
                {errors.username && <p className="text-red-500 text-sm lg:text-xl mt-1">{errors.username}</p>}
            </div>

            <div className="mb-4">
            <label className="lg:text-xl block mb-1 font-semibold">Rating (0-5)</label>
            <input
                type="number"
                min="0"
                max="5"
                className="w-full lg:text-xl border border-gray-300 rounded-lg p-2 dark:text-black"
                value={rating}
                onChange={(e) => setRating(e.target.value)}
            />
            {errors.rating && <p className="text-red-500 text-sm lg:text-xl mt-1">{errors.rating}</p>}
            </div>

            <div className="mb-4">
            <label className="lg:text-xl block mb-1 font-semibold">Feedback</label>
            <textarea
                className="w-full lg:text-xl border border-gray-300 rounded-lg p-2 dark:text-black"
                rows="4"
                value={text}
                onChange={(e) => setText(e.target.value)}
            />
            {errors.text && <p className="text-red-500 text-sm lg:text-xl mt-1">{errors.text}</p>}
            </div>

            {message && <div className={`mb-4 text-sm lg:text-xl font-semibold text-${messageColor}-600`}>{message}</div>}

            <button onClick={handlePostReview} className="lg:text-xl bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700" >
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
                <p className="text-lg lg:text-xl p-4 whitespace-pre-wrap break-words">{review.text}</p>
            </div>
            ))}

        </section>

    </div>
  );
};

export default Article;
