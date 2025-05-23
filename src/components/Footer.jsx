import { Link } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { 
  GraduationCap, 
  User, 
  LogOut, 
  Menu, 
  X, 
  Mail, 
  Phone, 
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Heart,
  Sparkles
} from 'lucide-react';
// Footer Component
export const Footer = () => {
  const quickLinks = [
    { name: 'Home', href: '/' },
    { name: 'About Us', href: '/about' },
    { name: 'Login', href: '/login' },
    { name: 'Register', href: '/register' },
    { name: 'Contact', href: '/contact' }
  ];

  const features = [
    'Complaints Management',
    'Events Portal', 
    'Lost and Found',
    'Placements',
    'Academic Resources'
  ];

  const socialLinks = [
    { icon: Facebook, href: '#', color: 'hover:text-blue-400' },
    { icon: Twitter, href: '#', color: 'hover:text-sky-400' },
    { icon: Instagram, href: '#', color: 'hover:text-pink-400' },
    { icon: Linkedin, href: '#', color: 'hover:text-blue-500' }
  ];

  return (
    <footer className="relative bg-gradient-to-br from-slate-900 via-purple-900/50 to-slate-900 border-t border-white/10">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-purple-500/10 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-indigo-500/10 rounded-full filter blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center mb-6 group">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-purple-500/25 transition-all duration-300">
                  <GraduationCap className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center">
                  <Sparkles className="w-2 h-2 text-yellow-800" />
                </div>
              </div>
              <span className="ml-3 text-xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent">
                College Mate
              </span>
            </div>
            <p className="text-slate-300 leading-relaxed mb-6">
              Your all-in-one platform for managing college life with cutting-edge technology and seamless user experience.
            </p>
            
            {/* Social Links */}
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className={`w-10 h-10 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 flex items-center justify-center text-slate-400 ${social.color} transition-all duration-300 hover:scale-110 hover:bg-white/10`}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold text-white mb-6 flex items-center">
              <div className="w-1 h-6 bg-gradient-to-b from-purple-500 to-indigo-500 rounded-full mr-3"></div>
              Quick Links
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-slate-300 hover:text-white hover:translate-x-2 transition-all duration-300 flex items-center group"
                  >
                    <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Features */}
          <div>
            <h3 className="text-lg font-bold text-white mb-6 flex items-center">
              <div className="w-1 h-6 bg-gradient-to-b from-pink-500 to-purple-500 rounded-full mr-3"></div>
              Features
            </h3>
            <ul className="space-y-3">
              {features.map((feature, index) => (
                <li key={index} className="text-slate-300 flex items-center group hover:text-white transition-colors duration-300">
                  <div className="w-1.5 h-1.5 bg-pink-400 rounded-full mr-3 opacity-60 group-hover:opacity-100 transition-opacity duration-300"></div>
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-bold text-white mb-6 flex items-center">
              <div className="w-1 h-6 bg-gradient-to-b from-indigo-500 to-blue-500 rounded-full mr-3"></div>
              Contact Us
            </h3>
            <div className="space-y-4">
              <div className="flex items-center text-slate-300 hover:text-white transition-colors duration-300 group">
                <div className="w-8 h-8 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 flex items-center justify-center mr-3 group-hover:bg-white/10 transition-all duration-300">
                  <Mail className="w-4 h-4" />
                </div>
                <span className="text-sm">support@collegemate.com</span>
              </div>
              <div className="flex items-center text-slate-300 hover:text-white transition-colors duration-300 group">
                <div className="w-8 h-8 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 flex items-center justify-center mr-3 group-hover:bg-white/10 transition-all duration-300">
                  <Phone className="w-4 h-4" />
                </div>
                <span className="text-sm">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center text-slate-300 hover:text-white transition-colors duration-300 group">
                <div className="w-8 h-8 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 flex items-center justify-center mr-3 group-hover:bg-white/10 transition-all duration-300">
                  <MapPin className="w-4 h-4" />
                </div>
                <span className="text-sm">123 Education Ave, Learning City</span>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="border-t border-white/10 pt-8 mb-8">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-2xl font-bold text-white mb-4">Stay Updated</h3>
            <p className="text-slate-300 mb-6">Get the latest updates about new features and college events.</p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-purple-500 transition-all duration-300"
              />
              <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-slate-400 text-sm flex items-center">
              © {new Date().getFullYear()} College Mate. Made with 
              <Heart className="w-4 h-4 text-red-400 mx-1 animate-pulse" /> 
              for students
            </p>
            <div className="flex items-center space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-slate-400 hover:text-white text-sm transition-colors duration-300">
                Privacy Policy
              </a>
              <a href="#" className="text-slate-400 hover:text-white text-sm transition-colors duration-300">
                Terms of Service
              </a>
              <a href="#" className="text-slate-400 hover:text-white text-sm transition-colors duration-300">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
