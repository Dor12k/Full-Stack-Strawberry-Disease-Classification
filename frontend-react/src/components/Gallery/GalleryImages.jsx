
import React from 'react'

function GalleryImages( {filteredGallery} ) {
    

    return (

        <div className="flex-1 overflow-y-auto p-6 bg-gray-100 dark:bg-[#1b1b1be9]">
            
            <div>

                {filteredGallery?.map((disease) => (
                    <div key={disease.id} className="mb-16 lg:mx-40">

                        <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-6 border-b-4 border-green-400 pb-2 inline-block">
                            {disease.name}
                        </h2>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-20">
                            {disease.images.map((img) => (
                            <div
                                key={img.id}
                                className="group bg-white dark:bg-[#1e1e1e] rounded-2xl shadow-lg overflow-hidden transition-transform transform hover:scale-105 hover:shadow-2xl"
                            >
                                <img
                                src={img.image}
                                alt={disease.name}
                                className="w-full h-80 object-cover transition-opacity duration-300 group-hover:opacity-90"
                                />

                                <div className="p-3 flex flex-row items-center justify-between">

                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        Description: {disease.name}
                                    </p>

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
