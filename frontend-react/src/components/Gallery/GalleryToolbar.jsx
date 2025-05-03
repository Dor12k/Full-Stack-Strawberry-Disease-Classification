
// This components is toolbar for gallery photos

import React, { useState } from 'react';

function GallerySearch( {
  searchText, setSearchText, 
  searchSuggestions, setSearchSuggestions, 
  filteredGallery, 
  handleSearchChange, handleSearchButton, 
  toggleFilters, isFiltersVisible,
  selectedDate, setSelectedDate,
  handleApplyFilters,
  selectedCategory,
  setSelectedCategory,

} ) {



  
  
  return (
    
    
    <div className="w-full px-4 py-3 bg-gray-100 dark:bg-[#2c2c2c] border-b border-gray-300 dark:border-gray-700 shadow-sm">

      <div className="flex flex-col lg:justify-normal lg:gap-10 lg:mx-[25%] sm:flex-row sm:items-center sm:justify-between gap-3">
        
        <h2 className="text-xl lg:w-40 font-semibold text-gray-800 dark:text-white">
          Search Images
        </h2>

        {/* Input field */}
        <div className='w-full lg:w-[50%] flex flex-col'>

          <div className="relative lg:w-full sm:w-1/2">
              
              {/* Input field */}
              <input
                type="text"
                placeholder="Search by keyword..."
                value={searchText}
                onChange={handleSearchChange}
                className="w-full px-4 py-2 pl-10 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#1f1f1f] text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-600 transition"
              />

              {/* Icon */}
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 dark:text-gray-400 pointer-events-none"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 14a4 4 0 100-8 4 4 0 000 8zm0 0l5 5m5-5a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>

          </div>

          {searchText && searchSuggestions.length > 0 && (
            <ul className="absolute z-10 mt-14 bg-white dark:bg-[#1f1f1f] border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-y-auto">
              {searchSuggestions.map((item) => (
                <li
                  key={item.id}
                  onClick={() => {
                    setSearchText(item.name);  // update the input
                    handleSearchButton(item.name);      // trigger search
                    const fakeEvent = { target: { value: item.name } };
                    handleSearchChange(fakeEvent);
                    setSearchSuggestions([]);
                  }}
                  className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                >
                  {item.name}
                </li>
              ))}
            </ul>
          )}

        </div>
        
        {/* Search Button */}
        <button onClick={handleSearchButton} className="w-full lg:w-52 px-4 py-2 mt-3  sm:w-auto sm:mt-0 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-500 transition">
          Search
        </button>

        {/* Filter Button */}
        <button onClick={toggleFilters} className="w-full lg:w-52 px-4 py-2 mt-3 sm:w-auto sm:mt-0 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-500 transition">
          {isFiltersVisible ? 'Hide Filters' : 'Show Filters'}
        </button>

      </div>

      {/* Filters Section */}
      {isFiltersVisible && (
        <div className="mt-6 bg-white dark:bg-[#2a2a2a] p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Advanced Filters</h3>

          <form>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
              <select 
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#1f1f1f] text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-600">
                <option>All</option>
                <option>Leaf</option>
                <option>Fruit</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Date</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#1f1f1f] text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-600"
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                className="px-4 py-2 bg-gray-300 text-gray-700 dark:bg-gray-600 dark:text-white rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500"
                onClick={toggleFilters}
              >
                Close
              </button>

              <button
                type="submit"
                onClick={handleApplyFilters}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-500"
              >
                Apply Filters
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}

export default GallerySearch;
