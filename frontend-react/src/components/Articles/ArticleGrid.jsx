


// File name: ArticleGrid.jsx
// This componenets is create article grid 
import React from 'react';
import ArticleCard from './ArticleCard';



const ArticleGrid = ({ articles }) => {


    return (
  
  

        // <div className=" mx-auto my-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">




        //     {[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20].map((item, i) => (
        //         <ArticleCard key={i} article={articles[0]} />
        //     ))}



        // </div>

        
    //   <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

    //     {[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20].map((item, i) => (
    //         <ArticleCard key={i} article={articles[0]} />
    //     ))}

    // </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">


        {articles.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
  
      
    );
  };
  
  export default ArticleGrid;

  
