

// FOOTER



import React from 'react';

const Footer = () => {
    return (


        <footer className="bg-blue-950 text-white py-8">
        <div className="container mx-auto px-6">
          {/* Footer Top Section */}
          <div className="flex justify-between items-center mb-6">
            <div className="text-lg font-semibold">
              <h4 className="text-2xl font-extrabold text-white">Future Inc.</h4>
              <p className="text-sm">Innovating the world of AI & Computer Vision</p>
            </div>
            <div className="flex space-x-6">
              {/* Social Media Icons */}
              <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-blue-400">
                <i className="fab fa-linkedin fa-2x"></i>
              </a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-400">
                <i className="fab fa-github fa-2x"></i>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-blue-400">
                <i className="fab fa-twitter fa-2x"></i>
              </a>
            </div>
          </div>
  
          {/* Footer Middle Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mb-6">
            <div>
              <h5 className="text-xl font-bold">Quick Links</h5>
              <ul className="mt-4">
                <li><a href="#" className="text-white hover:text-blue-400">About Us</a></li>
                <li><a href="#" className="text-white hover:text-blue-400">Services</a></li>
                <li><a href="#" className="text-white hover:text-blue-400">Contact</a></li>
                <li><a href="#" className="text-white hover:text-blue-400">Blog</a></li>
              </ul>
            </div>
            <div>
              <h5 className="text-xl font-bold">Resources</h5>
              <ul className="mt-4">
                <li><a href="#" className="text-white hover:text-blue-400">Documentation</a></li>
                <li><a href="#" className="text-white hover:text-blue-400">API Reference</a></li>
                <li><a href="#" className="text-white hover:text-blue-400">Support</a></li>
              </ul>
            </div>
            <div>
              <h5 className="text-xl font-bold">Get In Touch</h5>
              <p className="mt-4">Email: <a href="mailto:support@future.com" className="text-white hover:text-blue-400">support@future.com</a></p>
              <p className="mt-2">Phone: <a href="tel:+1234567890" className="text-white hover:text-blue-400">+123-456-7890</a></p>
            </div>
          </div>
  
          {/* Footer Bottom Section */}
          <div className="text-center text-sm">
            <p>&copy; {new Date().getFullYear()} Future Inc. All rights reserved.</p>
            <p className="text-sm mt-2">Built with love by the Future Inc. team</p>
          </div>
        </div>
      </footer>
    );
};

export default Footer;