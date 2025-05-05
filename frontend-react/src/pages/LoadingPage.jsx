

import React from 'react'

import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


function LoadingPage() {



  return (


      <div className="flex justify-center items-center h-screen bg-slate-800 gap-10">
        <FontAwesomeIcon icon={faSpinner} spin className="text-white text-4xl" />
        <div className="text-2xl text-white">
          <h6>Loading...</h6>
        </div>
      </div>


  )
}

export default LoadingPage
