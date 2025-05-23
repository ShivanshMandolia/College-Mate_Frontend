import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreateLostItemMutation } from '../../features/lostFound/lostFoundApiSlice';
import { Upload, Calendar, MapPin, Tag, FileText, Camera, ArrowLeft } from 'lucide-react';

const PostLostItem = () => {
  const navigate = useNavigate();
  const [createLostItem, { isLoading }] = useCreateLostItemMutation();

  const [formData, setFormData] = useState({
    title: '',
    name: '',
    description: '',
    landmark: '',
    category: '',
    dateLost: '',
    image: null
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});

  const categories = [
    { value: 'electronics', label: 'Electronics' },
    { value: 'books', label: 'Books' },
    { value: 'clothing', label: 'Clothing' },
    { value: 'accessories', label: 'Accessories' },
    { value: 'documents', label: 'Documents' },
    { value: 'other', label: 'Other' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        image: file
      }));
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.name.trim()) {
      newErrors.name = 'Item name is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.landmark.trim()) {
      newErrors.landmark = 'Last seen location is required';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    if (!formData.dateLost) {
      newErrors.dateLost = 'Date lost is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const result = await createLostItem(formData).unwrap();
      console.log('Lost item request created:', result);
      navigate('/student/lost-found');
    } catch (error) {
      console.error('Error creating lost item request:', error);
      setErrors({ submit: 'Failed to create lost item request. Please try again.' });
    }
  };

  return (
    <div className="min-h-screen" style={{
      background: 'linear-gradient(135deg, #0f172a, #581c87, #0f172a)',
    }}>
      {/* Floating particles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute top-20 left-10 w-2 h-2 rounded-full animate-pulse"
          style={{ background: 'rgba(147, 51, 234, 0.20)' }}
        ></div>
        <div 
          className="absolute top-40 right-20 w-1 h-1 rounded-full animate-pulse"
          style={{ background: 'rgba(79, 70, 229, 0.20)' }}
        ></div>
        <div 
          className="absolute bottom-32 left-1/4 w-1.5 h-1.5 rounded-full animate-pulse"
          style={{ background: 'rgba(59, 130, 246, 0.10)' }}
        ></div>
        <div 
          className="absolute top-1/3 right-1/3 w-1 h-1 rounded-full animate-pulse"
          style={{ background: 'rgba(147, 51, 234, 0.15)' }}
        ></div>
      </div>

      <div className="relative px-4 md:px-8 py-8 max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/student/lost-found')}
            className="inline-flex items-center text-slate-300 hover:text-white mb-6 transition-all duration-300 group"
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.10)',
              borderRadius: '12px',
              padding: '12px 20px'
            }}
          >
            <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
            Back to Lost & Found
          </button>
          
          <div className="text-center mb-8">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-4">
              <span style={{
                background: 'linear-gradient(90deg, #c084fc, #f472b6, #818cf8)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent'
              }}>
                Post Lost Item
              </span>
            </h1>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Let others know about your lost item so they can help you find it.
            </p>
          </div>
        </div>

        {/* Form */}
        <div 
          className="rounded-3xl p-8 transition-all duration-500 hover:scale-[1.02]"
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.10)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.3)'
          }}
        >
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Title */}
            <div className="group">
              <label htmlFor="title" className="flex items-center text-lg font-medium text-white mb-3">
                <div 
                  className="p-2 rounded-lg mr-3 transition-all duration-300 group-hover:scale-110"
                  style={{ background: 'linear-gradient(135deg, #a855f7, #4f46e5)' }}
                >
                  <FileText className="h-5 w-5 text-white" />
                </div>
                Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g., Lost iPhone 13 Pro"
                className={`w-full px-6 py-4 rounded-2xl text-white placeholder-slate-400 transition-all duration-300 focus:scale-[1.02] focus:outline-none ${
                  errors.title ? 'border-2 border-red-500' : 'border border-white/20 focus:border-purple-400'
                }`}
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(8px)'
                }}
              />
              {errors.title && (
                <p className="text-red-400 text-sm mt-2 animate-pulse">{errors.title}</p>
              )}
            </div>

            {/* Item Name */}
            <div className="group">
              <label htmlFor="name" className="flex items-center text-lg font-medium text-white mb-3">
                <div 
                  className="p-2 rounded-lg mr-3 transition-all duration-300 group-hover:scale-110"
                  style={{ background: 'linear-gradient(135deg, #6366f1, #2563eb)' }}
                >
                  <Tag className="h-5 w-5 text-white" />
                </div>
                Item Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="e.g., iPhone 13 Pro"
                className={`w-full px-6 py-4 rounded-2xl text-white placeholder-slate-400 transition-all duration-300 focus:scale-[1.02] focus:outline-none ${
                  errors.name ? 'border-2 border-red-500' : 'border border-white/20 focus:border-purple-400'
                }`}
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(8px)'
                }}
              />
              {errors.name && (
                <p className="text-red-400 text-sm mt-2 animate-pulse">{errors.name}</p>
              )}
            </div>

            {/* Category */}
            <div className="group">
              <label htmlFor="category" className="flex items-center text-lg font-medium text-white mb-3">
                <div 
                  className="p-2 rounded-lg mr-3 transition-all duration-300 group-hover:scale-110"
                  style={{ background: 'linear-gradient(135deg, #3b82f6, #0891b2)' }}
                >
                  <Tag className="h-5 w-5 text-white" />
                </div>
                Category *
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className={`w-full px-6 py-4 rounded-2xl text-white transition-all duration-300 focus:scale-[1.02] focus:outline-none ${
                  errors.category ? 'border-2 border-red-500' : 'border border-white/20 focus:border-purple-400'
                }`}
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(8px)'
                }}
              >
                <option value="" className="bg-slate-800">Select a category</option>
                {categories.map(category => (
                  <option key={category.value} value={category.value} className="bg-slate-800">
                    {category.label}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="text-red-400 text-sm mt-2 animate-pulse">{errors.category}</p>
              )}
            </div>

            {/* Last Seen Location */}
            <div className="group">
              <label htmlFor="landmark" className="flex items-center text-lg font-medium text-white mb-3">
                <div 
                  className="p-2 rounded-lg mr-3 transition-all duration-300 group-hover:scale-110"
                  style={{ background: 'linear-gradient(135deg, #8b5cf6, #a855f7)' }}
                >
                  <MapPin className="h-5 w-5 text-white" />
                </div>
                Last Seen Location *
              </label>
              <input
                type="text"
                id="landmark"
                name="landmark"
                value={formData.landmark}
                onChange={handleInputChange}
                placeholder="e.g., Library 2nd Floor, Building A Cafeteria"
                className={`w-full px-6 py-4 rounded-2xl text-white placeholder-slate-400 transition-all duration-300 focus:scale-[1.02] focus:outline-none ${
                  errors.landmark ? 'border-2 border-red-500' : 'border border-white/20 focus:border-purple-400'
                }`}
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(8px)'
                }}
              />
              {errors.landmark && (
                <p className="text-red-400 text-sm mt-2 animate-pulse">{errors.landmark}</p>
              )}
            </div>

            {/* Date Lost */}
            <div className="group">
              <label htmlFor="dateLost" className="flex items-center text-lg font-medium text-white mb-3">
                <div 
                  className="p-2 rounded-lg mr-3 transition-all duration-300 group-hover:scale-110"
                  style={{ background: 'linear-gradient(135deg, #f472b6, #db2777)' }}
                >
                  <Calendar className="h-5 w-5 text-white" />
                </div>
                Date Lost *
              </label>
              <input
                type="date"
                id="dateLost"
                name="dateLost"
                value={formData.dateLost}
                onChange={handleInputChange}
                max={new Date().toISOString().split('T')[0]}
                className={`w-full px-6 py-4 rounded-2xl text-white transition-all duration-300 focus:scale-[1.02] focus:outline-none ${
                  errors.dateLost ? 'border-2 border-red-500' : 'border border-white/20 focus:border-purple-400'
                }`}
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(8px)'
                }}
              />
              {errors.dateLost && (
                <p className="text-red-400 text-sm mt-2 animate-pulse">{errors.dateLost}</p>
              )}
            </div>

            {/* Description */}
            <div className="group">
              <label htmlFor="description" className="flex items-center text-lg font-medium text-white mb-3">
                <div 
                  className="p-2 rounded-lg mr-3 transition-all duration-300 group-hover:scale-110"
                  style={{ background: 'linear-gradient(135deg, #facc15, #fb923c)' }}
                >
                  <FileText className="h-5 w-5 text-white" />
                </div>
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                placeholder="Provide a detailed description of the lost item including color, brand, distinctive features, etc."
                className={`w-full px-6 py-4 rounded-2xl text-white placeholder-slate-400 transition-all duration-300 focus:scale-[1.02] focus:outline-none resize-none ${
                  errors.description ? 'border-2 border-red-500' : 'border border-white/20 focus:border-purple-400'
                }`}
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(8px)'
                }}
              />
              {errors.description && (
                <p className="text-red-400 text-sm mt-2 animate-pulse">{errors.description}</p>
              )}
            </div>

            {/* Image Upload */}
            <div className="group">
              <label htmlFor="image" className="flex items-center text-lg font-medium text-white mb-3">
                <div 
                  className="p-2 rounded-lg mr-3 transition-all duration-300 group-hover:scale-110"
                  style={{ background: 'linear-gradient(135deg, #0891b2, #2563eb)' }}
                >
                  <Camera className="h-5 w-5 text-white" />
                </div>
                Upload Image (Optional)
              </label>
              <div 
                className="flex justify-center px-6 pt-8 pb-8 border-2 border-dashed rounded-2xl transition-all duration-300 hover:border-purple-400 hover:scale-[1.02] cursor-pointer"
                style={{ borderColor: 'rgba(255, 255, 255, 0.20)', background: 'rgba(255, 255, 255, 0.02)' }}
              >
                <div className="space-y-4 text-center">
                  {imagePreview ? (
                    <div className="mb-4">
                      <img 
                        src={imagePreview} 
                        alt="Preview" 
                        className="mx-auto h-32 w-32 object-cover rounded-2xl border-2 border-white/20" 
                      />
                    </div>
                  ) : (
                    <div 
                      className="mx-auto h-16 w-16 rounded-2xl flex items-center justify-center"
                      style={{ background: 'linear-gradient(135deg, #a855f7, #4f46e5)' }}
                    >
                      <Upload className="h-8 w-8 text-white" />
                    </div>
                  )}
                  <div className="flex text-lg text-slate-300">
                    <label
                      htmlFor="image"
                      className="relative cursor-pointer font-medium text-purple-400 hover:text-purple-300 transition-colors duration-300"
                    >
                      <span>{imagePreview ? 'Change image' : 'Upload an image'}</span>
                      <input
                        id="image"
                        name="image"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="sr-only"
                      />
                    </label>
                  </div>
                  <p className="text-sm text-slate-400">PNG, JPG, GIF up to 10MB</p>
                </div>
              </div>
            </div>

            {/* Submit Error */}
            {errors.submit && (
              <div 
                className="p-6 rounded-2xl border-2 border-red-400 animate-pulse"
                style={{ background: 'rgba(239, 68, 68, 0.10)' }}
              >
                <p className="text-red-400 text-lg font-medium">{errors.submit}</p>
              </div>
            )}

            {/* Submit Buttons */}
            <div className="flex gap-6 pt-4">
              <button
                type="button"
                onClick={() => navigate('/student/lost-found')}
                className="flex-1 py-4 px-6 rounded-2xl text-white font-medium transition-all duration-300 hover:scale-105 hover:-translate-y-1"
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
                disabled={isLoading}
                className="flex-1 py-4 px-6 rounded-2xl text-white font-medium transition-all duration-300 hover:scale-105 hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:translate-y-0"
                style={{
                  background: 'linear-gradient(90deg, #9333ea, #db2777, #4f46e5)',
                  boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)'
                }}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                    Creating...
                  </span>
                ) : (
                  'Post Lost Item Request'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PostLostItem;