import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faTwitter, faInstagram, faLinkedin } from '@fortawesome/free-brands-svg-icons';

const Footer = () => {


  return (

    
    <footer className="w-full py-8 bg-[#ececec] text-black dark:bg-[#24262b] dark:text-white z-10">

      {/* blurred top border */}
      <div className=" top-0 left-0 w-full h-2 pointer-events-none z-20 shadow-[0_-45px_20px_rgba(0,0,0,1.2)] dark:shadow-[0_-40px_15px_rgba(255,255,255,0.5)]"></div>

        <div className="container mx-auto px-4">

        {/* Subscription Section */}
        <div className="text-center mb-12">
          <p className="text-black dark:text-white text-2xl mb-6">
            Join the Adventure newsletter to receive our best articles news
          </p>
          <p className="text-black dark:text-white text-xl mb-6">
            You can unsubscribe at any time.
          </p>
          <div className="flex justify-center">
            <form id="footerForm" className="flex flex-col sm:flex-row items-center">
              <input
                type="email"
                id="footerInput"
                className="footer-input p-2 mr-0 sm:mr-2 mb-4 sm:mb-0 rounded-md border border-gray-400 dark:border-white bg-white dark:bg-[#333] text-black dark:text-white text-lg outline-none"
                placeholder="Your Email"
                autoComplete="off"
              />
              <button
                type="submit"
                id="footerbtn"
                className="bg-transparent dark:text-white border border-black dark:border-white py-2 px-4 rounded-md text-lg hover:bg-white hover:text-black transition-all duration-300"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Information Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 text-center lg:text-left gap-8">

          {/* Company Info */}
          <div className="footer-col px-4">

            <h4 className="text-black dark:text-white text-xl mb-6 relative">
              Company
              <div className="absolute mx-[42%] lg:mx-0 bottom-[-10px] left-0 bg-[#e91e63] h-[2px] w-[50px]"></div>
            </h4>

            <ul>
              <li><a href="#" className="text-gray-700 dark:text-gray-400 hover:text-blue-500 dark:hover:text-white transition-all">About Us</a></li>
              <li><a href="#" className="text-gray-700 dark:text-gray-400 hover:text-blue-500 dark:hover:text-white transition-all">Our Services</a></li>
              <li><a href="#" className="text-gray-700 dark:text-gray-400 hover:text-blue-500 dark:hover:text-white transition-all">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-700 dark:text-gray-400 hover:text-blue-500 dark:hover:text-white transition-all">Affiliate Program</a></li>
              <li><a href="#" className="text-gray-700 dark:text-gray-400 hover:text-blue-500 dark:hover:text-white transition-all">Terms of Service</a></li>
            </ul>
          </div>

          {/* Help Section */}
          <div className="footer-col px-4">
            <h4 className="text-black dark:text-white text-xl mb-6 relative">
              Get Help
              <div className="absolute mx-[42%] lg:mx-0 bottom-[-10px] left-0 bg-[#e91e63] h-[2px] w-[50px]"></div>
            </h4>
            <ul>
              <li><a href="#" className="text-gray-700 dark:text-gray-400 hover:text-blue-500 dark:hover:text-white transition-all">FAQ</a></li>
              <li><a href="#" className="text-gray-700 dark:text-gray-400 hover:text-blue-500 dark:hover:text-white transition-all">Returns</a></li>
              <li><a href="#" className="text-gray-700 dark:text-gray-400 hover:text-blue-500 dark:hover:text-white transition-all">Shipping</a></li>
              <li><a href="#" className="text-gray-700 dark:text-gray-400 hover:text-blue-500 dark:hover:text-white transition-all">Order Status</a></li>
              <li><a href="#" className="text-gray-700 dark:text-gray-400 hover:text-blue-500 dark:hover:text-white transition-all">Payment Options</a></li>
            </ul>
          </div>

          {/* Contact Section */}
          <div className="footer-col px-4">
            <h4 className="text-black dark:text-white text-xl mb-6 relative">
              Contact Us
              <div className="absolute mx-[42%] lg:mx-0 bottom-[-10px] left-0 bg-[#e91e63] h-[2px] w-[50px]"></div>
            </h4>
            <ul>
              <li><a href="#" className="text-gray-700 dark:text-gray-400 hover:text-blue-500 dark:hover:text-white transition-all">Contact</a></li>
              <li><a href="#" className="text-gray-700 dark:text-gray-400 hover:text-blue-500 dark:hover:text-white transition-all">Support</a></li>
              <li><a href="#" className="text-gray-700 dark:text-gray-400 hover:text-blue-500 dark:hover:text-white transition-all">Destinations</a></li>
              <li><a href="#" className="text-gray-700 dark:text-gray-400 hover:text-blue-500 dark:hover:text-white transition-all">Sponsorships</a></li>
            </ul>
          </div>

          {/* Social Media Section */}
          <div className="footer-col px-4">
            <h4 className="text-black dark:text-white text-xl mb-6 relative">
              Follow Us
              <div className="absolute mx-[42%] lg:mx-0 bottom-[-10px] left-0 bg-[#e91e63] h-[2px] w-[50px]"></div>
            </h4>
            <div className="w-full px-[20%] lg:px-0 flex flex-wrap justify-start items-center gap-4">
              <a href="#" className="text-white bg-gray-500 hover:bg-white hover:text-black transition-all p-2 rounded-full">
                <FontAwesomeIcon icon={faFacebook} className='w-6' />
              </a>
              <a href="#" className="text-white bg-gray-500 hover:bg-white hover:text-black transition-all p-2 rounded-full">
                <FontAwesomeIcon icon={faTwitter} className='w-6' />
              </a>
              <a href="#" className="text-white bg-gray-500 hover:bg-white hover:text-black transition-all p-2 rounded-full">
                <FontAwesomeIcon icon={faInstagram} className='w-6' />
              </a>
              <a href="#" className="text-white bg-gray-500 hover:bg-white hover:text-black transition-all p-2 rounded-full">
                <FontAwesomeIcon icon={faLinkedin} className='w-6' />
              </a>
            </div>
          </div>

        </div>

        <hr className="my-4 border-t-2 border-gray-400 dark:border-red-800" />

        {/* Footer Bottom */}
        <div className="social-media-wrap text-center text-gray-700 dark:text-gray-400">
          <small className="text-sm">Copyright © 2024 | All rights reserved by SDC</small>
        </div>
      </div>
      
    </footer>
  );
};

export default Footer;
