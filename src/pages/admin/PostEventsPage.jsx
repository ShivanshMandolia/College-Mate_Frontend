import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Upload, X, ImageIcon } from 'lucide-react';
import { useCreateEventMutation } from '../../features/events/eventsApiSlice';

const CreateEventPage = () => {
  const navigate = useNavigate();
  const [createEvent, { isLoading }] = useCreateEventMutation();
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: ''
  });
  
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setNotification({ show: true, message: 'Image size should be less than 5MB', type: 'error' });
        setTimeout(() => setNotification({ show: false, message: '', type: 'error' }), 3000);
        return;
      }
      
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    // Reset file input
    const fileInput = document.getElementById('image-upload');
    if (fileInput) fileInput.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.description.trim() || !formData.date) {
      setNotification({ show: true, message: 'Please fill in all required fields', type: 'error' });
      setTimeout(() => setNotification({ show: false, message: '', type: 'error' }), 3000);
      return;
    }

    try {
      const eventData = {
        ...formData,
        image: imageFile
      };

      await createEvent(eventData).unwrap();
      setNotification({ show: true, message: 'Event created successfully!', type: 'success' });
      
      // Navigate back to events page after a short delay
      setTimeout(() => {
        navigate('/events');
      }, 1500);
      
    } catch (error) {
      setNotification({ 
        show: true, 
        message: error?.data?.message || 'Failed to create event', 
        type: 'error' 
      });
      setTimeout(() => setNotification({ show: false, message: '', type: 'error' }), 3000);
    }
  };

  // Get today's date in YYYY-MM-DD format for min date
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-600/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-600/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex items-center mb-8 animate-fade-in-up">
          <button
            onClick={() => navigate('/events')}
            className="mr-6 p-3 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 hover:border-purple-500/50 transition-all duration-300 hover:scale-105 hover:-translate-y-1"
          >
            <ArrowLeft size={24} className="text-white" />
          </button>
          <div>
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent mb-4">
              Create New Event
            </h1>
            <p className="text-xl text-slate-300 font-medium">Fill in the details to create your amazing event</p>
          </div>
        </div>

        {/* Notification */}
        {notification.show && (
          <div className={`fixed top-6 right-6 z-50 p-6 rounded-2xl backdrop-blur-md shadow-2xl border transition-all duration-500 transform ${
            notification.type === 'success' 
              ? 'bg-green-500/20 border-green-500/50 text-green-100' 
              : 'bg-red-500/20 border-red-500/50 text-red-100'
          } flex items-center space-x-3 animate-slide-in`}>
            <span className="font-medium">{notification.message}</span>
            <button 
              onClick={() => setNotification({ show: false, message: '', type: 'success' })}
              className="p-1 hover:bg-white/10 rounded-full transition-colors duration-200"
            >
              <X size={18} />
            </button>
          </div>
        )}

        {/* Form */}
        <div className="bg-white/5 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/10 p-8 md:p-12 hover:bg-white/10 hover:border-purple-500/50 transition-all duration-500 animate-fade-in-up delay-200">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Title */}
            <div className="space-y-3">
              <label htmlFor="title" className="block text-lg font-semibold text-white mb-3">
                Event Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-6 py-4 bg-white/5 backdrop-blur-sm border border-white/20 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500/50 text-white placeholder-slate-400 transition-all duration-300 hover:bg-white/10 focus:bg-white/10"
                placeholder="Enter your amazing event title"
                required
              />
            </div>

            {/* Date */}
            <div className="space-y-3">
              <label htmlFor="date" className="block text-lg font-semibold text-white mb-3">
                Event Date *
              </label>
              <div className="relative">
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  min={getTodayDate()}
                  className="w-full px-6 py-4 bg-white/5 backdrop-blur-sm border border-white/20 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500/50 text-white transition-all duration-300 hover:bg-white/10 focus:bg-white/10"
                  required
                />
                <Calendar size={24} className="absolute right-6 top-4 text-purple-400 pointer-events-none" />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-3">
              <label htmlFor="description" className="block text-lg font-semibold text-white mb-3">
                Event Description *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={6}
                className="w-full px-6 py-4 bg-white/5 backdrop-blur-sm border border-white/20 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500/50 text-white placeholder-slate-400 resize-none transition-all duration-300 hover:bg-white/10 focus:bg-white/10"
                placeholder="Describe your event in detail... What makes it special?"
                required
              />
            </div>

            {/* Image Upload */}
            <div className="space-y-3">
              <label className="block text-lg font-semibold text-white mb-3">
                Event Image (Optional)
              </label>
              
              {!imagePreview ? (
                <div className="border-2 border-dashed border-white/20 rounded-2xl p-12 text-center hover:border-purple-500/50 hover:bg-white/5 transition-all duration-300 cursor-pointer group">
                  <input
                    type="file"
                    id="image-upload"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <label htmlFor="image-upload" className="cursor-pointer">
                    <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <ImageIcon size={40} className="text-white" />
                    </div>
                    <p className="text-white text-xl font-medium mb-2">Click to upload an image</p>
                    <p className="text-slate-400">PNG, JPG, GIF up to 5MB</p>
                  </label>
                </div>
              ) : (
                <div className="relative group">
                  <img
                    src={imagePreview}
                    alt="Event preview"
                    className="w-full h-80 object-cover rounded-2xl border border-white/20"
                  />
                  <div className="absolute inset-0 bg-black/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-4 right-4 p-3 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all duration-300 hover:scale-110 shadow-lg"
                  >
                    <X size={20} />
                  </button>
                </div>
              )}
            </div>

            {/* Submit Buttons */}
            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-6 pt-8">
              <button
                type="button"
                onClick={() => navigate('/events')}
                className="flex-1 px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-2xl hover:bg-white/20 border border-white/20 hover:border-white/30 transition-all duration-300 font-semibold text-lg hover:scale-105 hover:-translate-y-1"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 px-8 py-4 bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 text-white rounded-2xl hover:scale-105 hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:translate-y-0 transition-all duration-300 font-semibold text-lg shadow-2xl hover:shadow-purple-500/25 flex items-center justify-center space-x-3"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                    <span>Creating Magic...</span>
                  </>
                ) : (
                  <span>Create Event ✨</span>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Form Tips */}
        <div className="mt-8 bg-gradient-to-r from-purple-600/10 via-pink-600/10 to-indigo-600/10 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-8 animate-fade-in-up delay-400">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xl">💡</span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-4">Tips for creating an amazing event</h3>
              <div className="grid md:grid-cols-2 gap-4 text-slate-300">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  <span>Use a clear and engaging title</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-pink-400 rounded-full"></div>
                  <span>Provide detailed information</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-indigo-400 rounded-full"></div>
                  <span>Add an eye-catching image</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                  <span>Double-check the date</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slide-in {
          from {
            opacity: 0;
            transform: translateX(100px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
        
        .animate-slide-in {
          animation: slide-in 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
        
        .delay-200 {
          animation-delay: 200ms;
        }
        
        .delay-400 {
          animation-delay: 400ms;
        }
        
        .delay-500 {
          animation-delay: 500ms;
        }
        
        .delay-1000 {
          animation-delay: 1000ms;
        }
      `}</style>
    </div>
  );
};

export default CreateEventPage;