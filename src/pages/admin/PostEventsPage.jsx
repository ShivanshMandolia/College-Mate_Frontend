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
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button
            onClick={() => navigate('/events')}
            className="mr-4 p-2 rounded-lg hover:bg-gray-200 transition-colors duration-200"
          >
            <ArrowLeft size={24} className="text-gray-600" />
          </button>
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Create New Event</h1>
            <p className="text-lg text-gray-600">Fill in the details to create your event</p>
          </div>
        </div>

        {/* Notification */}
        {notification.show && (
          <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg ${
            notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
          } text-white flex items-center space-x-2`}>
            <span>{notification.message}</span>
            <button onClick={() => setNotification({ show: false, message: '', type: 'success' })}>
              <X size={16} />
            </button>
          </div>
        )}

        {/* Form */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Event Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter event title"
                required
              />
            </div>

            {/* Date */}
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
                <Calendar size={20} className="absolute right-3 top-2.5 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Event Description *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={5}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="Describe your event in detail..."
                required
              />
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Event Image (Optional)
              </label>
              
              {!imagePreview ? (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors duration-200">
                  <input
                    type="file"
                    id="image-upload"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <label htmlFor="image-upload" className="cursor-pointer">
                    <ImageIcon size={48} className="mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-600 mb-2">Click to upload an image</p>
                    <p className="text-sm text-gray-400">PNG, JPG, GIF up to 5MB</p>
                  </label>
                </div>
              ) : (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Event preview"
                    className="w-full h-64 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors duration-200"
                  >
                    <X size={16} />
                  </button>
                </div>
              )}
            </div>

            {/* Submit Buttons */}
            <div className="flex space-x-4 pt-6">
              <button
                type="button"
                onClick={() => navigate('/events')}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center space-x-2"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Creating...</span>
                  </>
                ) : (
                  <span>Create Event</span>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Form Tips */}
        <div className="mt-6 bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">Tips for creating a great event</h3>
              <div className="mt-2 text-sm text-blue-700">
                <ul className="list-disc list-inside space-y-1">
                  <li>Use a clear and descriptive title</li>
                  <li>Provide detailed information in the description</li>
                  <li>Add an attractive image to make your event stand out</li>
                  <li>Make sure the date is accurate</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateEventPage;