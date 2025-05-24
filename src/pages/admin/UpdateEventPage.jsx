import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Calendar, Upload, X, ImageIcon } from 'lucide-react';
import { 
  useGetEventByIdQuery,
  useUpdateEventMutation 
} from '../../features/events/eventsApiSlice';

const UpdateEventPage = () => {
  const navigate = useNavigate();
  const { eventId } = useParams();
  const { data: eventResponse, isLoading: fetchLoading, error } = useGetEventByIdQuery(eventId);
  const [updateEvent, { isLoading: updateLoading }] = useUpdateEventMutation();
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: ''
  });
  
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [currentImage, setCurrentImage] = useState(null);

  // Populate form when event data is loaded
  useEffect(() => {
    if (eventResponse?.data) {
      const event = eventResponse.data;
      setFormData({
        title: event.title || '',
        description: event.description || '',
        date: event.date ? new Date(event.date).toISOString().split('T')[0] : ''
      });
      setCurrentImage(event.image);
    }
  }, [eventResponse]);

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

  const removeNewImage = () => {
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
      };

      // Only include image if a new one was selected
      if (imageFile) {
        eventData.image = imageFile;
      }

      await updateEvent({ eventId, eventData }).unwrap();
      setNotification({ show: true, message: 'Event updated successfully!', type: 'success' });
      
      // Navigate back to events page after a short delay
      setTimeout(() => {
        navigate('/events');
      }, 1500);
      
    } catch (error) {
      setNotification({ 
        show: true, 
        message: error?.data?.message || 'Failed to update event', 
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

  if (fetchLoading) {
    return (
      <div className="min-h-screen" style={{
        background: 'linear-gradient(135deg, #0f172a, #581c87, #0f172a)'
      }}>
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="relative mx-auto mb-6">
              <div className="w-16 h-16 rounded-full border-4 border-purple-400/30 animate-spin"></div>
              <div className="absolute top-0 left-0 w-16 h-16 rounded-full border-4 border-t-purple-400 animate-spin"></div>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Loading event...</h3>
            <p className="text-slate-300">Please wait while we fetch your event details</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen" style={{
        background: 'linear-gradient(135deg, #0f172a, #581c87, #0f172a)'
      }}>
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-pink-600 to-purple-600 flex items-center justify-center">
              <X size={32} className="text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-4">Error loading event</h3>
            <p className="text-slate-300 mb-6">We couldn't load your event details</p>
            <button
              onClick={() => navigate('/events')}
              className="px-6 py-3 rounded-2xl font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-2xl transform"
              style={{
                background: 'linear-gradient(90deg, #9333ea, #db2777, #4f46e5)',
                boxShadow: '0 10px 25px -5px rgba(147, 51, 234, 0.3)'
              }}
            >
              Back to Events
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{
      background: 'linear-gradient(135deg, #0f172a, #581c87, #0f172a)'
    }}>
      {/* Floating Particles */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-20 w-32 h-32 rounded-full opacity-10 animate-pulse" style={{
          background: 'linear-gradient(135deg, #9333ea, #db2777)'
        }}></div>
        <div className="absolute top-1/3 right-20 w-24 h-24 rounded-full opacity-10 animate-pulse delay-1000" style={{
          background: 'linear-gradient(135deg, #4f46e5, #2563eb)'
        }}></div>
        <div className="absolute bottom-20 left-1/4 w-40 h-40 rounded-full opacity-5 animate-pulse delay-2000" style={{
          background: 'linear-gradient(135deg, #8b5cf6, #a855f7)'
        }}></div>
      </div>

      <div className="relative z-10 p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center mb-8">
            <button
              onClick={() => navigate('/events')}
              className="mr-6 p-3 rounded-2xl transition-all duration-300 hover:scale-110 hover:rotate-3 transform"
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.10)'
              }}
            >
              <ArrowLeft size={24} className="text-white" />
            </button>
            <div>
              <h1 className="text-5xl font-bold text-white mb-3" style={{
                background: 'linear-gradient(90deg, #c084fc, #f472b6, #818cf8)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent'
              }}>
                Update Event
              </h1>
              <p className="text-xl text-slate-300">Modify your event details and make it shine</p>
            </div>
          </div>

          {/* Notification */}
          {notification.show && (
            <div className={`fixed top-6 right-6 z-50 p-4 rounded-2xl shadow-2xl text-white flex items-center space-x-3 transition-all duration-500 transform ${
              notification.type === 'success' 
                ? 'bg-gradient-to-r from-green-500 to-emerald-600' 
                : 'bg-gradient-to-r from-red-500 to-pink-600'
            }`} style={{
              backdropFilter: 'blur(16px)',
              border: '1px solid rgba(255, 255, 255, 0.20)'
            }}>
              <span className="font-medium">{notification.message}</span>
              <button 
                onClick={() => setNotification({ show: false, message: '', type: 'success' })}
                className="p-1 rounded-full hover:bg-white/20 transition-colors duration-200"
              >
                <X size={16} />
              </button>
            </div>
          )}

          {/* Form */}
          <div className="rounded-3xl shadow-2xl p-8 transition-all duration-500" style={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(255, 255, 255, 0.10)'
          }}>
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Title */}
              <div>
                <label htmlFor="title" className="block text-lg font-semibold text-white mb-3">
                  Event Title <span className="text-purple-400">*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-4 py-4 rounded-2xl text-white placeholder-slate-400 transition-all duration-300 focus:scale-[1.02] focus:shadow-2xl border-0 outline-none"
                  style={{
                    background: 'rgba(255, 255, 255, 0.10)',
                    backdropFilter: 'blur(8px)',
                    border: '1px solid rgba(255, 255, 255, 0.20)'
                  }}
                  placeholder="Enter your amazing event title"
                  required
                />
              </div>

              {/* Date */}
              <div>
                <label htmlFor="date" className="block text-lg font-semibold text-white mb-3">
                  Event Date <span className="text-purple-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    min={getTodayDate()}
                    className="w-full px-4 py-4 rounded-2xl text-white transition-all duration-300 focus:scale-[1.02] focus:shadow-2xl border-0 outline-none"
                    style={{
                      background: 'rgba(255, 255, 255, 0.10)',
                      backdropFilter: 'blur(8px)',
                      border: '1px solid rgba(255, 255, 255, 0.20)',
                      colorScheme: 'dark'
                    }}
                    required
                  />
                  <Calendar size={20} className="absolute right-4 top-4 text-purple-400 pointer-events-none" />
                </div>
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-lg font-semibold text-white mb-3">
                  Event Description <span className="text-purple-400">*</span>
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={5}
                  className="w-full px-4 py-4 rounded-2xl text-white placeholder-slate-400 transition-all duration-300 focus:scale-[1.02] focus:shadow-2xl border-0 outline-none resize-none"
                  style={{
                    background: 'rgba(255, 255, 255, 0.10)',
                    backdropFilter: 'blur(8px)',
                    border: '1px solid rgba(255, 255, 255, 0.20)'
                  }}
                  placeholder="Describe your event in detail and make it compelling..."
                  required
                />
              </div>

              {/* Current Image Display */}
              {currentImage && !imagePreview && (
                <div>
                  <label className="block text-lg font-semibold text-white mb-3">
                    Current Event Image
                  </label>
                  <div className="relative rounded-2xl overflow-hidden">
                    <img
                      src={currentImage}
                      alt="Current event"
                      className="w-full h-64 object-cover"
                    />
                    <div className="absolute bottom-4 left-4 px-3 py-2 rounded-xl text-white font-medium" style={{
                      background: 'rgba(0, 0, 0, 0.6)',
                      backdropFilter: 'blur(8px)'
                    }}>
                      Current Image
                    </div>
                  </div>
                </div>
              )}

              {/* Image Upload */}
              <div>
                <label className="block text-lg font-semibold text-white mb-3">
                  {currentImage ? 'Update Event Image (Optional)' : 'Event Image (Optional)'}
                </label>
                
                {!imagePreview ? (
                  <div className="rounded-2xl p-12 text-center transition-all duration-300 hover:scale-[1.02] cursor-pointer group" style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(8px)',
                    border: '2px dashed rgba(168, 85, 247, 0.50)'
                  }}>
                    <input
                      type="file"
                      id="image-upload"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                    <label htmlFor="image-upload" className="cursor-pointer">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-3" style={{
                        background: 'linear-gradient(135deg, #a855f7, #4f46e5)'
                      }}>
                        <ImageIcon size={32} className="text-white" />
                      </div>
                      <p className="text-white mb-2 font-medium">
                        {currentImage ? 'Click to upload a new image' : 'Click to upload an image'}
                      </p>
                      <p className="text-slate-400">PNG, JPG, GIF up to 5MB</p>
                    </label>
                  </div>
                ) : (
                  <div className="relative rounded-2xl overflow-hidden">
                    <img
                      src={imagePreview}
                      alt="New event preview"
                      className="w-full h-64 object-cover"
                    />
                    <button
                      type="button"
                      onClick={removeNewImage}
                      className="absolute top-4 right-4 p-2 rounded-full text-white transition-all duration-300 hover:scale-110 hover:rotate-90"
                      style={{
                        background: 'linear-gradient(135deg, #dc2626, #ef4444)'
                      }}
                    >
                      <X size={16} />
                    </button>
                    <div className="absolute bottom-4 left-4 px-3 py-2 rounded-xl text-white font-medium" style={{
                      background: 'linear-gradient(135deg, #059669, #10b981)',
                      backdropFilter: 'blur(8px)'
                    }}>
                      New Image
                    </div>
                  </div>
                )}
              </div>

              {/* Submit Buttons */}
              <div className="flex space-x-6 pt-8">
                <button
                  type="button"
                  onClick={() => navigate('/events')}
                  className="flex-1 px-6 py-4 rounded-2xl font-semibold text-white transition-all duration-300 hover:scale-105 transform"
                  style={{
                    background: 'rgba(255, 255, 255, 0.10)',
                    backdropFilter: 'blur(8px)',
                    border: '1px solid rgba(255, 255, 255, 0.20)'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updateLoading}
                  className="flex-1 px-6 py-4 rounded-2xl font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transform flex items-center justify-center space-x-3"
                  style={{
                    background: updateLoading 
                      ? 'rgba(147, 51, 234, 0.5)' 
                      : 'linear-gradient(90deg, #9333ea, #db2777, #4f46e5)',
                    boxShadow: '0 20px 25px -5px rgba(147, 51, 234, 0.3)'
                  }}
                >
                  {updateLoading ? (
                    <>
                      <div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin"></div>
                      <span>Updating...</span>
                    </>
                  ) : (
                    <span>Update Event</span>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Form Tips */}
          <div className="mt-8 rounded-2xl p-6 transition-all duration-500" style={{
            background: 'rgba(251, 191, 36, 0.10)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(251, 191, 36, 0.30)'
          }}>
            <div className="flex items-start">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mr-4" style={{
                background: 'linear-gradient(135deg, #f59e0b, #facc15)'
              }}>
                <Calendar size={24} className="text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-yellow-400 mb-3">Update Guidelines</h3>
                <div className="text-slate-300 space-y-2">
                  <p>• Only upload a new image if you want to replace the current one</p>
                  <p>• All changes will be saved when you click "Update Event"</p>
                  <p>• Make sure all required fields are filled out</p>
                  <p>• The event date should be today or in the future</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateEventPage;