





import React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faTwitter, faInstagram, faLinkedin } from '@fortawesome/free-brands-svg-icons';


const Footer = () => {

  return (

    <footer className="'w-full bg-[#24262b] py-16 shadow-lg">

      <div className="container mx-auto">

        {/* Subscription Section */}
        <div className="text-center mb-12">
          <p className="text-white text-2xl mb-6">Join the Adventure newsletter to receive our best articles news</p>
          <p className="text-white text-xl mb-6">You can unsubscribe at any time.</p>
          <div className="flex justify-center">
            <form id="footerForm" className="flex items-center">
              <input
                type="email"
                id="footerInput"
                className="footer-input p-2 mr-2 rounded-md border border-white text-lg outline-none"
                placeholder="Your Email"
                autoComplete="off"
              />
              <button
                type="submit"
                id="footerbtn"
                className="bg-transparent text-white border border-white py-2 px-4 rounded-md text-lg hover:bg-white hover:text-black transition-all duration-300"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Information Section */}
        <div className="flex justify-between">
          {/* Company Info */}
          <div className="footer-col w-1/4 px-4">
            <h4 className="text-white text-xl mb-6 relative">
              Company
              <div className="absolute bottom-[-10px] left-0 bg-[#e91e63] h-[2px] w-[50px]"></div>
            </h4>
            <ul>
              <li><a href="#" className="text-gray-400 hover:text-white transition-all">About Us</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-all">Our Services</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-all">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-all">Affiliate Program</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-all">Terms of Service</a></li>
            </ul>
          </div>

          {/* Help Section */}
          <div className="footer-col w-1/4 px-4">
            <h4 className="text-white text-xl mb-6 relative">
              Get Help
              <div className="absolute bottom-[-10px] left-0 bg-[#e91e63] h-[2px] w-[50px]"></div>
            </h4>
            <ul>
              <li><a href="#" className="text-gray-400 hover:text-white transition-all">FAQ</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-all">Returns</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-all">Shipping</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-all">Order Status</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-all">Payment Options</a></li>
            </ul>
          </div>

          {/* Contact Section */}
          <div className="footer-col w-1/4 px-4">
            <h4 className="text-white text-xl mb-6 relative">
              Contact Us
              <div className="absolute bottom-[-10px] left-0 bg-[#e91e63] h-[2px] w-[50px]"></div>
            </h4>
            <ul>
              <li><a href="#" className="text-gray-400 hover:text-white transition-all">Contact</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-all">Support</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-all">Destinations</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-all">Sponsorships</a></li>
            </ul>
          </div>
          

          {/* Social Media Section */}       
          <div className="footer-col w-1/4 px-4 ">

            <h4 className="text-white text-xl mb-6 relative">
              Follow Us
              <div className="absolute bottom-[-10px] left-0 bg-[#e91e63] h-[2px] w-[50px]"></div>
            </h4>

            <div className="w-full social-links flex flex-col lg:flex-row lg:justify-start items-center justify-center space-x-4">

              <a href="#" className="text-white bg-gray-500 hover:bg-white hover:text-black transition-all p-2 rounded-full ml-4 lg:ml-0">
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

        <hr className="my-12 border-t-2 border-gray-700" />

        {/* Footer Bottom */}
        <div className="social-media-wrap text-center text-gray-400 py-4">
          <small className="text-sm">Copyright © 2024 | All rights reserved by SDC</small>
        </div>
      </div>

    </footer>

  );
};

export default Footer;
