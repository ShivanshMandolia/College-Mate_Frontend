import React, { useState } from 'react';
import { Upload, Calendar, MapPin, Tag, FileText, Camera, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Mock mutation hook
const useCreateFoundItemMutation = () => {
  return [
    async (data) => {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { unwrap: () => Promise.resolve({ id: 1, ...data }) };
    },
    { isLoading: false }
  ];
};

const PostFoundItem = () => {
  const navigate = useNavigate();
  const [createFoundItem, { isLoading }] = useCreateFoundItemMutation();

  const [formData, setFormData] = useState({
    title: '',
    name: '',
    description: '',
    landmark: '',
    category: '',
    dateFound: '',
    image: null
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    { value: 'electronics', label: 'Electronics' },
    { value: 'books', label: 'Books' },
    { value: 'clothing', label: 'Clothing' },
    { value: 'accessories', label: 'Accessories' },
    { value: 'documents', label: 'Documents' },
    { value: 'other', label: 'Other' }
  ];

  const handleInputChange = (e) => {
    // Add null check for event and target
    if (!e || !e.target) {
      console.error('Invalid event object in handleInputChange');
      return;
    }

    const { name, value } = e.target;
    
    // Add null check for name and value
    if (name == null) {
      console.error('Input name is null or undefined');
      return;
    }

    setFormData(prev => ({
      ...prev,
      [name]: value || '' // Ensure value is never null/undefined
    }));

    // Clear error when user starts typing
    if (errors && errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleImageChange = (e) => {
    // Add comprehensive null checks
    if (!e || !e.target || !e.target.files) {
      console.error('Invalid event object or files in handleImageChange');
      return;
    }

    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({
          ...prev,
          image: 'Please select a valid image file'
        }));
        return;
      }

      // Validate file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        setErrors(prev => ({
          ...prev,
          image: 'File size must be less than 10MB'
        }));
        return;
      }

      setFormData(prev => ({
        ...prev,
        image: file
      }));
      
      // Create preview with error handling
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          setImagePreview(reader.result);
        }
      };
      reader.onerror = () => {
        console.error('Error reading file');
        setErrors(prev => ({
          ...prev,
          image: 'Error reading image file'
        }));
      };
      reader.readAsDataURL(file);

      // Clear any previous image errors
      if (errors.image) {
        setErrors(prev => ({
          ...prev,
          image: ''
        }));
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Add null checks and trim safely
    if (!formData.title || !formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.name || !formData.name.trim()) {
      newErrors.name = 'Item name is required';
    }

    if (!formData.description || !formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.landmark || !formData.landmark.trim()) {
      newErrors.landmark = 'Found location is required';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    if (!formData.dateFound) {
      newErrors.dateFound = 'Date found is required';
    } else {
      // Validate date is not in the future
      const selectedDate = new Date(formData.dateFound);
      const today = new Date();
      today.setHours(23, 59, 59, 999); // End of today
      
      if (selectedDate > today) {
        newErrors.dateFound = 'Date found cannot be in the future';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    // Prevent default form submission
    if (e && e.preventDefault) {
      e.preventDefault();
    }

    // Prevent double submission
    if (isSubmitting) {
      return;
    }

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setErrors(prev => ({ ...prev, submit: '' })); // Clear previous submit errors

    try {
      // Create a clean data object
      const submitData = {
        title: formData.title?.trim() || '',
        name: formData.name?.trim() || '',
        description: formData.description?.trim() || '',
        landmark: formData.landmark?.trim() || '',
        category: formData.category || '',
        dateFound: formData.dateFound || '',
        image: formData.image || null
      };

      const result = await createFoundItem(submitData);
      if (result && result.unwrap) {
        const unwrappedResult = await result.unwrap();
        console.log('Found item created:', unwrappedResult);
        navigate('/student/lost-found');
      }
    } catch (error) {
      console.error('Error creating found item:', error);
      setErrors(prev => ({
        ...prev,
        submit: 'Failed to create found item listing. Please try again.'
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get today's date for max attribute
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  return (
    <div 
      className="min-h-screen relative"
      style={{
        background: 'linear-gradient(135deg, #0f172a, #581c87, #0f172a)',
      }}
    >
      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute top-20 left-20 w-32 h-32 rounded-full animate-pulse"
          style={{ background: 'rgba(147, 51, 234, 0.1)' }}
        ></div>
        <div 
          className="absolute top-40 right-32 w-20 h-20 rounded-full animate-pulse"
          style={{ background: 'rgba(79, 70, 229, 0.15)' }}
        ></div>
        <div 
          className="absolute bottom-32 left-40 w-24 h-24 rounded-full animate-pulse"
          style={{ background: 'rgba(59, 130, 246, 0.08)' }}
        ></div>
      </div>

      <div className="relative z-10 px-4 md:px-8 py-8 max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/student/lost-found')}
            className="inline-flex items-center text-slate-300 hover:text-white mb-6 transition-all duration-300 group"
          >
            <ArrowLeft className="h-4 w-4 mr-2 transition-transform group-hover:-translate-x-1" />
            Back to Lost & Found
          </button>
          
          <div className="text-center mb-8">
            <h1 
              className="text-5xl md:text-7xl font-bold mb-4"
              style={{
                background: 'linear-gradient(90deg, #c084fc, #f472b6, #818cf8)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent'
              }}
            >
              Post Found Item
            </h1>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Help someone reunite with their lost item by posting what you found.
            </p>
          </div>
        </div>

        {/* Form Card */}
        <div 
          className="relative p-8 rounded-3xl border transition-all duration-500 hover:scale-[1.02]"
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
          }}
        >
            <div className="space-y-8">
              {/* Title */}
              <div className="group">
                <label htmlFor="title" className="flex items-center text-lg font-semibold text-white mb-3">
                  <div 
                    className="w-8 h-8 rounded-xl mr-3 flex items-center justify-center transition-transform group-hover:scale-110"
                    style={{ background: 'linear-gradient(135deg, #a855f7, #4f46e5)' }}
                  >
                    <FileText className="h-4 w-4 text-white" />
                  </div>
                  Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title || ''}
                  onChange={handleInputChange}
                  placeholder="e.g., Found iPhone with Blue Case"
                  className={`w-full px-6 py-4 rounded-2xl text-white placeholder-slate-400 transition-all duration-300 focus:scale-[1.02] focus:outline-none ${
                    errors.title 
                      ? 'border-2 border-red-500 bg-rgba(255, 0, 0, 0.1)' 
                      : 'border border-white/20 bg-white/5 backdrop-blur-sm focus:border-purple-500 focus:bg-white/10'
                  }`}
                  style={{
                    backdropFilter: 'blur(8px)'
                  }}
                />
                {errors.title && (
                  <p className="text-red-400 text-sm mt-2 animate-pulse">{errors.title}</p>
                )}
              </div>

              {/* Item Name */}
              <div className="group">
                <label htmlFor="name" className="flex items-center text-lg font-semibold text-white mb-3">
                  <div 
                    className="w-8 h-8 rounded-xl mr-3 flex items-center justify-center transition-transform group-hover:scale-110"
                    style={{ background: 'linear-gradient(135deg, #6366f1, #2563eb)' }}
                  >
                    <Tag className="h-4 w-4 text-white" />
                  </div>
                  Item Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name || ''}
                  onChange={handleInputChange}
                  placeholder="e.g., iPhone"
                  className={`w-full px-6 py-4 rounded-2xl text-white placeholder-slate-400 transition-all duration-300 focus:scale-[1.02] focus:outline-none ${
                    errors.name 
                      ? 'border-2 border-red-500 bg-rgba(255, 0, 0, 0.1)' 
                      : 'border border-white/20 bg-white/5 backdrop-blur-sm focus:border-purple-500 focus:bg-white/10'
                  }`}
                  style={{
                    backdropFilter: 'blur(8px)'
                  }}
                />
                {errors.name && (
                  <p className="text-red-400 text-sm mt-2 animate-pulse">{errors.name}</p>
                )}
              </div>

              {/* Category */}
              <div className="group">
                <label htmlFor="category" className="flex items-center text-lg font-semibold text-white mb-3">
                  <div 
                    className="w-8 h-8 rounded-xl mr-3 flex items-center justify-center transition-transform group-hover:scale-110"
                    style={{ background: 'linear-gradient(135deg, #3b82f6, #0891b2)' }}
                  >
                    <div className="w-4 h-4 rounded bg-white/80"></div>
                  </div>
                  Category *
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category || ''}
                  onChange={handleInputChange}
                  className={`w-full px-6 py-4 rounded-2xl text-white transition-all duration-300 focus:scale-[1.02] focus:outline-none ${
                    errors.category 
                      ? 'border-2 border-red-500 bg-rgba(255, 0, 0, 0.1)' 
                      : 'border border-white/20 bg-white/5 backdrop-blur-sm focus:border-purple-500 focus:bg-white/10'
                  }`}
                  style={{
                    backdropFilter: 'blur(8px)'
                  }}
                >
                  <option value="" className="bg-slate-800 text-white">Select a category</option>
                  {categories.map(category => (
                    <option key={category.value} value={category.value} className="bg-slate-800 text-white">
                      {category.label}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <p className="text-red-400 text-sm mt-2 animate-pulse">{errors.category}</p>
                )}
              </div>

              {/* Found Location */}
              <div className="group">
                <label htmlFor="landmark" className="flex items-center text-lg font-semibold text-white mb-3">
                  <div 
                    className="w-8 h-8 rounded-xl mr-3 flex items-center justify-center transition-transform group-hover:scale-110"
                    style={{ background: 'linear-gradient(135deg, #8b5cf6, #a855f7)' }}
                  >
                    <MapPin className="h-4 w-4 text-white" />
                  </div>
                  Found Location *
                </label>
                <input
                  type="text"
                  id="landmark"
                  name="landmark"
                  value={formData.landmark || ''}
                  onChange={handleInputChange}
                  placeholder="e.g., Library 2nd Floor, Building A Cafeteria"
                  className={`w-full px-6 py-4 rounded-2xl text-white placeholder-slate-400 transition-all duration-300 focus:scale-[1.02] focus:outline-none ${
                    errors.landmark 
                      ? 'border-2 border-red-500 bg-rgba(255, 0, 0, 0.1)' 
                      : 'border border-white/20 bg-white/5 backdrop-blur-sm focus:border-purple-500 focus:bg-white/10'
                  }`}
                  style={{
                    backdropFilter: 'blur(8px)'
                  }}
                />
                {errors.landmark && (
                  <p className="text-red-400 text-sm mt-2 animate-pulse">{errors.landmark}</p>
                )}
              </div>

              {/* Date Found */}
              <div className="group">
                <label htmlFor="dateFound" className="flex items-center text-lg font-semibold text-white mb-3">
                  <div 
                    className="w-8 h-8 rounded-xl mr-3 flex items-center justify-center transition-transform group-hover:scale-110"
                    style={{ background: 'linear-gradient(135deg, #f472b6, #db2777)' }}
                  >
                    <Calendar className="h-4 w-4 text-white" />
                  </div>
                  Date Found *
                </label>
                <input
                  type="date"
                  id="dateFound"
                  name="dateFound"
                  value={formData.dateFound || ''}
                  onChange={handleInputChange}
                  max={getTodayDate()}
                  className={`w-full px-6 py-4 rounded-2xl text-white transition-all duration-300 focus:scale-[1.02] focus:outline-none ${
                    errors.dateFound 
                      ? 'border-2 border-red-500 bg-rgba(255, 0, 0, 0.1)' 
                      : 'border border-white/20 bg-white/5 backdrop-blur-sm focus:border-purple-500 focus:bg-white/10'
                  }`}
                  style={{
                    backdropFilter: 'blur(8px)',
                    colorScheme: 'dark'
                  }}
                />
                {errors.dateFound && (
                  <p className="text-red-400 text-sm mt-2 animate-pulse">{errors.dateFound}</p>
                )}
              </div>

              {/* Description */}
              <div className="group">
                <label htmlFor="description" className="flex items-center text-lg font-semibold text-white mb-3">
                  <div 
                    className="w-8 h-8 rounded-xl mr-3 flex items-center justify-center transition-transform group-hover:scale-110"
                    style={{ background: 'linear-gradient(135deg, #facc15, #fb923c)' }}
                  >
                    <FileText className="h-4 w-4 text-slate-800" />
                  </div>
                  Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description || ''}
                  onChange={handleInputChange}
                  rows={4}
                  placeholder="Provide a detailed description of the found item including color, brand, distinctive features, etc."
                  className={`w-full px-6 py-4 rounded-2xl text-white placeholder-slate-400 transition-all duration-300 focus:scale-[1.02] focus:outline-none resize-none ${
                    errors.description 
                      ? 'border-2 border-red-500 bg-rgba(255, 0, 0, 0.1)' 
                      : 'border border-white/20 bg-white/5 backdrop-blur-sm focus:border-purple-500 focus:bg-white/10'
                  }`}
                  style={{
                    backdropFilter: 'blur(8px)'
                  }}
                />
                {errors.description && (
                  <p className="text-red-400 text-sm mt-2 animate-pulse">{errors.description}</p>
                )}
              </div>

              {/* Image Upload */}
              <div className="group">
                <label htmlFor="image" className="flex items-center text-lg font-semibold text-white mb-3">
                  <div 
                    className="w-8 h-8 rounded-xl mr-3 flex items-center justify-center transition-transform group-hover:scale-110"
                    style={{ background: 'linear-gradient(135deg, #818cf8, #c084fc)' }}
                  >
                    <Camera className="h-4 w-4 text-white" />
                  </div>
                  Upload Image (Optional)
                </label>
                <div 
                  className="flex justify-center px-8 py-12 border-2 border-dashed rounded-3xl transition-all duration-300 hover:border-purple-500 hover:bg-white/5 cursor-pointer group"
                  style={{
                    borderColor: 'rgba(168, 85, 247, 0.3)',
                    background: 'rgba(255, 255, 255, 0.02)'
                  }}
                >
                  <div className="space-y-4 text-center">
                    {imagePreview ? (
                      <div className="mb-6">
                        <img 
                          src={imagePreview} 
                          alt="Preview" 
                          className="mx-auto h-40 w-40 object-cover rounded-2xl border-2 border-purple-500/50 shadow-2xl"
                        />
                      </div>
                    ) : (
                      <div 
                        className="mx-auto w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
                        style={{ background: 'linear-gradient(135deg, #a855f7, #4f46e5)' }}
                      >
                        <Upload className="h-8 w-8 text-white" />
                      </div>
                    )}
                    <div className="text-white">
                      <label
                        htmlFor="image"
                        className="relative cursor-pointer font-semibold text-purple-400 hover:text-purple-300 transition-colors"
                      >
                        <span className="text-lg">
                          {imagePreview ? 'Change image' : 'Upload an image'}
                        </span>
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
                    <p className="text-slate-400 text-sm">PNG, JPG, GIF up to 10MB</p>
                  </div>
                </div>
                {errors.image && (
                  <p className="text-red-400 text-sm mt-2 animate-pulse">{errors.image}</p>
                )}
              </div>

              {/* Submit Error */}
              {errors.submit && (
                <div 
                  className="p-6 rounded-2xl border animate-pulse"
                  style={{
                    background: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    backdropFilter: 'blur(8px)'
                  }}
                >
                  <p className="text-red-400 font-medium">{errors.submit}</p>
                </div>
              )}

              {/* Submit Buttons */}
              <div className="flex gap-6 pt-4">
                <button
                  type="button"
                  onClick={() => navigate('/student/lost-found')}
                  className="flex-1 py-4 px-8 rounded-2xl font-semibold text-white transition-all duration-300 hover:scale-105 hover:-translate-y-1"
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(8px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  onClick={handleSubmit}
                  disabled={isLoading || isSubmitting}
                  className="flex-1 py-4 px-8 rounded-2xl font-bold text-white transition-all duration-300 hover:scale-105 hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:translate-y-0 relative overflow-hidden"
                  style={{
                    background: 'linear-gradient(90deg, #9333ea, #db2777, #4f46e5)',
                    boxShadow: '0 20px 25px -5px rgba(147, 51, 234, 0.3)'
                  }}
                >
                  <span className="relative z-10">
                    {isLoading || isSubmitting ? 'Creating...' : 'Post Found Item'}
                  </span>
                  {!isLoading && !isSubmitting && (
                    <div 
                      className="absolute inset-0 opacity-0 hover:opacity-20 transition-opacity duration-300"
                      style={{
                        background: 'linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.2), transparent)'
                      }}
                    />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
   
  );
};

export default PostFoundItem;