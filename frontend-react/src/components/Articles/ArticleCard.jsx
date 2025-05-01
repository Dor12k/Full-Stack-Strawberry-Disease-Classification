

// This components represent a card
import React from 'react';
import { Link } from 'react-router-dom';

const getCardSizeClasses = (type) => {
  switch (type) {
    case 'horizontal':
      
      return 'lg:col-span-2';
    case 'vertical':
      return 'lg:row-span-2 row-span-2';
    case 'flat':
      return 'lg:col-span-4 lg:row-span-1';
    case 'mid':
      return 'lg:col-span-2 lg:row-span-2' ;
    case 'end':
      return 'lg:col-span-2';
    case 'regular':
    default:
      return '';
  }
};

const getImageHeight = (type) => {
  switch (type) {
    case 'vertical':
      return 'h-[80%]';
    case 'mid':
      return 'h-[80%]'; 
    case 'flat':
      return 'h-[50%]'; 
    default:
      return 'h-[56%]';
  }
};

const ArticleCard = ({ article }) => {
  const sizeClasses = getCardSizeClasses(article.card);
  const imageHeight = getImageHeight(article.card);
  const isRestricted = article.card !== 'regular';

  const Wrapper = isRestricted ? React.Fragment : Link;
  const wrapperProps = isRestricted ? {} : { to: `/articles/${article.slug}`, className: 'block h-full' };

  return (

    <div className={`h-full  ${sizeClasses}`}>
      <Wrapper {...wrapperProps}>

        <div className={`h-full  flex flex-col rounded-2xl shadow-md overflow-hidden transition-all duration-300 hover:scale-105 hover:-translate-y-1 hover:shadow-2xl bg-white dark:bg-[#2d2d2d] ${!isRestricted ? 'cursor-pointer' : 'cursor-auto'}`}>

          {/* Image with overlay */}
          <div className={`relative group w-full ${imageHeight} ${article.card == 'flat' ? 'h-[250px]' : 'h-[100%]'} ${article.card == 'mid' ? 'h-[60%] lg:h-[80%]' : 'text-left'}`}>

            <img alt={article.title} src={article.first_media} className='object-fill w-full h-full'/>

            {/* Overlay container */}
            <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition duration-300 pointer-events-none">

              {/* Lock icon - centered */}
              {isRestricted && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <img
                    src="/images/Articles/locker.png"
                    alt="Locked"
                    className="w-60 h-60 opacity-0 group-hover:opacity-100 transition duration-500"
                  />
                </div>
              )}

              {/* Rating text - bottom left */}
              <div className="absolute bottom-2 left-4 text-white text-lg font-bold">
                Reviews: {article.average_rating} ⭐
              </div>
            </div>

          </div>

          {/* Text content */}
          <div className={`p-4 flex flex-col justify-between flex-1 overflow-hidden 
            ${article.card == 'flat' ? 'text-center lg:mx-60 lg:mt-5'  : 'text-left'}
            ${article.card == 'mid' ? ''  : 'text-left'}
            ${article.card == 'vertical' ? ''  : 'text-left'}
             `
            }>
        
            <div className="overflow-hidden">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white line-clamp-2">
                {article.title}
              </h3>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 line-clamp-3">
                {article.description}
              </p>
            </div>

            <span className="mt-3 inline-block font-bold text-blue-500 dark:text-blue-400 hover:underline">
              Read More...
            </span>

          </div>
        </div>

      </Wrapper>
    </div>
  );
};

export default ArticleCard;
