import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
              Quick Links
            </h3>
            <ul className="mt-4 space-y-4">
              <li>
                <Link to="/" className="text-base text-gray-500 hover:text-gray-900">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-base text-gray-500 hover:text-gray-900">
                  Login
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-base text-gray-500 hover:text-gray-900">
                  Register
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
              Features
            </h3>
            <ul className="mt-4 space-y-4">
              <li>
                <span className="text-base text-gray-500">Complaints Management</span>
              </li>
              <li>
                <span className="text-base text-gray-500">Events Portal</span>
              </li>
              <li>
                <span className="text-base text-gray-500">Lost and Found</span>
              </li>
              <li>
                <span className="text-base text-gray-500">Placements</span>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
              Contact
            </h3>
            <ul className="mt-4 space-y-4">
              <li>
                <span className="text-base text-gray-500">support@collegemate.com</span>
              </li>
              <li>
                <span className="text-base text-gray-500">+1 (555) 123-4567</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-200 pt-8">
          <p className="text-base text-gray-400 text-center">
            © {new Date().getFullYear()} College Mate. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;