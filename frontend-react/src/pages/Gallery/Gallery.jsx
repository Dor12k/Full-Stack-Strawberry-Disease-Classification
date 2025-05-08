
import React, { useEffect, useState } from 'react'

import LoadingPage from '../LoadingPage';
import axiosInstance from '../../axiosInstance';
import GalleryImages from '../../components/Gallery/GalleryImages';
import GalleryToolbar from '../../components/Gallery/GalleryToolbar';
import ScrollToTopButton from '../../components/utils/ScrollToTopButton';

function Gallery() {

  const [error, setError] = useState('');
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchSuggestions, setSearchSuggestions] = useState('');
  const [isFiltersVisible, setIsFiltersVisible] = useState(false);
  const [filteredGallery, setFilteredGallery] = useState(gallery);

  useEffect(() => {

    const fetchGallery = async () => {

      setLoading(true);

      try {

        const galleryResponse = await axiosInstance.get('/diseases/');
        setGallery(galleryResponse.data);
        setFilteredGallery(galleryResponse.data);

      } catch (error) {

        console.error("Failed to fetch gallery:", error);
        setError("Failed to load gallery. Please try again later.");

      } finally {
        setLoading(false);
      }
    };

    fetchGallery();
  }, []);

  
  // Toggle the visibility of the filters section
  const toggleFilters = () => {
    setIsFiltersVisible(!isFiltersVisible);
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchText(value);

    const lower = value.toLocaleLowerCase();

    if(!lower){
      setFilteredGallery(gallery);
      return
    }

    const newfilteredGallery = gallery.filter( (disease) => disease.name.toLowerCase().includes(lower));

    if(newfilteredGallery){
      setFilteredGallery(newfilteredGallery)
      setSearchSuggestions(newfilteredGallery.slice(0, 5));
    }
    else{
      setFilteredGallery([])
    }
  };

  const handleSearchButton = (e) => {

    const lower = searchText.toLocaleLowerCase();

    if(!lower){
      setFilteredGallery(gallery);
      return
    }

    const newfilteredGallery = gallery.filter( (disease) => disease.name.toLowerCase().includes(lower));

    if(newfilteredGallery){
      setFilteredGallery(newfilteredGallery)
    }
    else{
      setFilteredGallery([])
    }
  }
  
  const handleApplyFilters = (e) => {
    e.preventDefault();
  
    let filtered = gallery;
  
    // Filter by date
    if (selectedDate) {
      filtered = filtered.filter((item) =>
        item.images.some((image) => {
          if (!image.uploaded_at) return false;
          const imageDate = image.uploaded_at.split('T')[0];
          return imageDate === selectedDate;
        })
      );
    }
  
    // Filter by category
    if (selectedCategory !== "All") {
      filtered = filtered.filter((item) => item.category === selectedCategory.toLocaleLowerCase());
    }
  
    setFilteredGallery(filtered);
  };
  
  // Fallback for loading state if needed
  if ((loading) ) {

    return <LoadingPage/>
  }

  return (

    <div className="w-full min-h-screen flex flex-col bg-slate-100 dark:bg-[#1b1b1be9] dark:text-white">

      {/* Header with subtitle */}
      <div className="min-h-[80px] sm:min-h-[100px] lg:min-h-[120px] px-4 py-20 shadow-md text-center flex flex-col items-center justify-center bg-slate-100 dark:bg-[#1b1b1b] ">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-black dark:text-gray-100 tracking-wide drop-shadow-sm">
          🖼️ Images Gallery
        </h2>
        <p className="mt-2 text-sm sm:text-base lg:text-lg text-black dark:text-gray-400 max-w-xl">
          Explore, search and filter a stunning collection of images from various categories.
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col">

        {/* Toolbar */}
        <GalleryToolbar 
          searchText={searchText} 
          setSearchText={setSearchText} 
          searchSuggestions={searchSuggestions}
          setSearchSuggestions={setSearchSuggestions}
          filteredGallery={filteredGallery} 
          handleSearchChange={handleSearchChange} 
          handleSearchButton={handleSearchButton} 
          toggleFilters={toggleFilters} 
          isFiltersVisible={isFiltersVisible}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          handleApplyFilters={handleApplyFilters}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />

        {/* Gallery Section */}
        <GalleryImages filteredGallery={filteredGallery} />

      </div>

      
      <ScrollToTopButton />

    </div>

  )
}

export default Gallery
