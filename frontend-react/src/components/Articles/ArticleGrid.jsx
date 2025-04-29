


// File name: ArticleGrid.jsx
// This componenets is create article grid 
import React from 'react';
import ArticleCard from './ArticleCard';

const ArticleGrid = ({ articles }) => {


  return (

    <div className="grid sm:grid-cols-1 lg:grid-cols-4 auto-rows-[400px] gap-16 lg:mx-80">

      {articles.map(article => (
          <ArticleCard key={article.id} article={article} />
        ))}

    </div>
  );
};

export default ArticleGrid;
  
