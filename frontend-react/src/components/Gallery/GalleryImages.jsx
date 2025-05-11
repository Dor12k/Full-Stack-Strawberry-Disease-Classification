
import React from 'react'
import { Link } from 'react-router-dom'




function GalleryImages( {filteredGallery, onCardClick, imagePreview, setImagePreview, diseasePreview, setDiseasePreview} ) {
    

    return (

        <div className="flex-1 flex flex-col items-center justify-center overflow-y-auto p-6 bg-gray-100 dark:bg-[#1b1b1be9]">
            
            
            {/* Image preview */}
            {imagePreview && (

                <div aria-hidden="true" onClick={() => setImagePreview(null)} className="fixed inset-0 z-50 bg-black bg-opacity-70 flex items-center justify-center" >

                    <div onClick={(e) => e.stopPropagation()} className="relative max-w-4xl max-h-[90vh] w-full lg:p-10 sm:p-10 bg-white dark:bg-[#1e1e1e] rounded-xl shadow-xl overflow-hidden" >

                    {/* Close button */}
                    <button aria-label="Close" onClick={() => setImagePreview(null)} className="absolute top-1 right-3 text-gray-700 dark:text-gray-300 text-3xl font-bold hover:text-red-500 dark:hover:text-red-500" >
                        &times;
                    </button>

                    {/* Image */}
                    <img alt={diseasePreview.name || 'Preview'} src={imagePreview.image} className="w-full h-auto max-h-[75vh] object-contain rounded-lg" />

                    {/* Disease Name and Info */}
                    {imagePreview && (
                        <div className="mt-5 flex flex-col lg:flex-row items-center justify-center gap-6 p-2 ">

                            <p className="text-lg lg:text-2xl text-center text-gray-700 dark:text-gray-300 ">
                                {diseasePreview.name}
                            </p>
                            
                            {/* Disease Link */}
                            <Link
                                to={`/articles/${diseasePreview.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9\-]/g, '')}`}
                                className="lg:text-2xl underline text-blue-500 hover:text-blue-700 dark:text-blue-500 dark:hover:text-blue-700 "
                            >
                                {diseasePreview.name}
                            </Link>

                            {/* Date Info */}
                            <p className="lg:text-2xl text-center text-gray-600 dark:text-gray-300 ">
                                Uploaded: {new Date(imagePreview.uploaded_at).toLocaleDateString()}
                            </p>

                        </div>
                    )}
                    </div>
                </div>
            )}

            {/* Images gallery */}
            <div>

                {filteredGallery?.map((disease) => (
                    <div key={disease.id} className="mb-16 lg:mx-40">

                        <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-6 border-b-4 border-green-400 pb-2 inline-block">
                            {disease.name}
                        </h2>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-20">

                            {disease.images.map((img) => (

                                <div key={img.id} onClick={() => {onCardClick(disease.id, img.id); setImagePreview(img); setDiseasePreview(disease) }} className="group bg-white dark:bg-[#1e1e1e] rounded-2xl shadow-lg overflow-hidden transition-transform transform hover:scale-105 hover:shadow-2xl cursor-pointer" >

                                    <img src={img.image} alt={disease.name} className="w-full h-80 object-cover transition-opacity duration-300 group-hover:opacity-90" />

                                    <div className="p-3 flex flex-row items-center justify-between">

                                        <div className='flex flex-row items-center justify-center gap-2'>

                                            <p className="text-sm lg:text-[15px] lg:mt-[2px] font-bold tracking-wider text-gray-500 dark:text-gray-400">
                                                Description: 
                                            </p>

                                            <Link to={`/articles/${disease.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9\-]/g, '')}`} >

                                                <p className=" underline text-blue-500 hover:text-blue-700 dark:text-blue-500 dark:hover:text-blue-700 break-words">
                                                    {disease.name}
                                                </p>
                                            
                                            </Link>

                                        </div>

                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            Uploaded: {new Date(img.uploaded_at).toLocaleDateString()}
                                        </p>

                                    </div>
                                </div>
                            ))}

                        </div>

                    </div>
                ))}

            </div>

        </div>

    )
}

export default GalleryImages
