

import React, { useState, useEffect, useContext } from 'react';

import axiosInstance from '../../axiosInstance';
import ArticleGrid from '../../components/Articles/ArticleGrid';

import { Link } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';




function Articles() {

  const { user, setUser } = useContext(UserContext);
  const [loading, setLoading] = useState(true);
  const [articles, setArticle] = useState([]);

  useEffect(() => {

    const getArticles = async () => {
      
      try{
        const response = await axiosInstance.get('/articles/')
        setArticle(response.data);
      } catch (error) {
        console.error('Error fetching articles:', error);
      } finally {
        setLoading(false);
      }
    }
    getArticles();
  }, [])

  
  if (loading ) {
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

    <div className='flex flex-col'>

      {/* Button - add article */}
      {user.is_staff && (

        <div className="w-full my-4 px-2 lg:px-10 flex justify-end">
          <Link to="/add-article">
            <button className="bg-teal-600 text-white px-6 py-3 rounded-full mt-2 gap-2 text-xl hover:bg-teal-700 transition duration-300 transform hover:scale-105">
              Add Article
            </button>
          </Link>
        </div>

      )}

      {/* Articles grid */}
      <div className="w-full min-h-screen py-10 px-4 lg:px-20 bg-slate-50 dark:bg-[#1f1f1f] dark:text-white ">
        <ArticleGrid articles={articles} />
      </div>

    </div>
  )
}

export default Articles
