

// File name: ArticleCard.jsx
// This componenets is create article card 
import React from 'react';

            
import { Link } from 'react-router-dom';



const ArticleCard = ({ article }) => {

  return (


    <div
      className={`
        rounded-2xl shadow-md overflow-hidden transition hover:shadow-xl
        ${article.type === 'horizontal' ? 'flex flex-row h-48' : ''}
        ${article.type === 'flat' ? 'border border-gray-200 bg-white' : 'bg-white'}
      `}
    >
        <img
        src={article.first_media}
        alt={article.title}
        className={`
            object-cover
            ${article.type === 'horizontal' ? 'w-1/3 h-full' : 'w-full h-48'}
        `}
        />

        <div className={`p-4 ${article.type === 'horizontal' ? 'w-2/3' : ''}`}>
            <h3 className="text-lg font-semibold text-gray-800">{article.title}</h3>
            <p className="mt-2 text-sm text-gray-600 line-clamp-3">{article.description}</p>
        </div>


        <div className={`p-4 ${article.type === 'horizontal' ? 'w-2/3' : ''}`}>
            <h3 className="text-lg font-semibold text-gray-800">{article.title}</h3>
            <p className="mt-2 text-sm text-gray-600 line-clamp-3">{article.description}</p>

            <Link
            to={`/articles/${article.slug}`}
            className="mt-3 inline-block text-blue-500 hover:underline"
            >
            Read More...
            </Link>
        </div>

    </div>


  );
};

export default ArticleCard;
