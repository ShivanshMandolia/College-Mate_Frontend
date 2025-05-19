import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormHelperText,
  Alert,
  CircularProgress,
  Grid,
} from '@mui/material';
import {
  Upload,
  MapPin,
  FileText,
  Info,
  ArrowLeft,
  Send,
} from 'lucide-react';
import { useCreateComplaintMutation } from '../../features/complaints/complaintsApiSlice';

const CreateComplaint = () => {
  const navigate = useNavigate();
  const [createComplaint, { isLoading }] = useCreateComplaintMutation();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    landmark: '',
    image: null,
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');

  // Category options for the dropdown
  const categoryOptions = [
    'Road Issues',
    'Water Supply',
    'Electricity',
    'Garbage Collection',
    'Street Lighting',
    'Public Safety',
    'Noise Pollution',
    'Others',
  ];

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };

  // Handle image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors({
          ...errors,
          image: 'Image size should be less than 5MB',
        });
        return;
      }

      setFormData({
        ...formData,
        image: file,
      });

      // Create image preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);

      // Clear error if it exists
      if (errors.image) {
        setErrors({
          ...errors,
          image: '',
        });
      }
    }
  };

  // Form validation
  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length < 5) {
      newErrors.title = 'Title should be at least 5 characters';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length < 20) {
      newErrors.description = 'Description should be at least 20 characters';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    if (!formData.landmark.trim()) {
      newErrors.landmark = 'Landmark is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');

    if (!validateForm()) {
      return;
    }

    try {
      await createComplaint(formData).unwrap();
      navigate('/student/complaints');
    } catch (error) {
      console.error('Failed to create complaint:', error);
      setSubmitError(error?.data?.message || 'Failed to create complaint. Please try again.');
    }
  };

  return (
    <Box className="p-6 max-w-3xl mx-auto">
      {/* Header */}
      <Box className="mb-6">
        <Button
          startIcon={<ArrowLeft className="w-5 h-5" />}
          variant="text"
          onClick={() => navigate('/student/complaints')}
          className="mb-4 text-gray-600 hover:text-gray-800"
        >
          Back to Complaints
        </Button>
        <Typography variant="h4" className="font-bold text-gray-800 mb-2">
          Create New Complaint
        </Typography>
        <Typography variant="body1" className="text-gray-600">
          Fill in the details below to submit your complaint
        </Typography>
      </Box>

      {/* Error Alert */}
      {submitError && (
        <Alert severity="error" className="mb-6">
          {submitError}
        </Alert>
      )}

      {/* Complaint Form */}
      <Card className="shadow-md">
        <CardContent className="p-6">
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {/* Title */}
              <Grid item xs={12}>
                <TextField
                  name="title"
                  label="Complaint Title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Brief title describing the issue"
                  fullWidth
                  required
                  error={!!errors.title}
                  helperText={errors.title}
                  InputProps={{
                    startAdornment: (
                      <FileText className="w-5 h-5 text-gray-400 mr-2" />
                    ),
                  }}
                />
              </Grid>

              {/* Category */}
              <Grid item xs={12} md={6}>
                <FormControl fullWidth error={!!errors.category}>
                  <InputLabel>Category</InputLabel>
                  <Select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    label="Category"
                    required
                  >
                    {categoryOptions.map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.category && (
                    <FormHelperText>{errors.category}</FormHelperText>
                  )}
                </FormControl>
              </Grid>

              {/* Landmark */}
              <Grid item xs={12} md={6}>
                <TextField
                  name="landmark"
                  label="Landmark"
                  value={formData.landmark}
                  onChange={handleInputChange}
                  placeholder="Nearby location or address"
                  fullWidth
                  required
                  error={!!errors.landmark}
                  helperText={errors.landmark}
                  InputProps={{
                    startAdornment: (
                      <MapPin className="w-5 h-5 text-gray-400 mr-2" />
                    ),
                  }}
                />
              </Grid>

              {/* Description */}
              <Grid item xs={12}>
                <TextField
                  name="description"
                  label="Description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Detailed description of the issue"
                  multiline
                  rows={4}
                  fullWidth
                  required
                  error={!!errors.description}
                  helperText={errors.description}
                  InputProps={{
                    startAdornment: (
                      <Info className="w-5 h-5 text-gray-400 mr-2 mt-3" />
                    ),
                  }}
                />
              </Grid>

              {/* Image Upload */}
              <Grid item xs={12}>
                <Box className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                  <input
                    type="file"
                    id="image-upload"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                  <label htmlFor="image-upload" className="cursor-pointer">
                    <Box className="flex flex-col items-center">
                      <Upload className="w-8 h-8 text-gray-400 mb-2" />
                      <Typography variant="subtitle1" className="font-medium mb-1">
                        {imagePreview ? 'Change Image' : 'Upload Image'}
                      </Typography>
                      <Typography variant="body2" className="text-gray-500">
                        JPG, PNG or GIF (Max. 5MB)
                      </Typography>
                    </Box>
                  </label>

                  {errors.image && (
                    <Typography color="error" variant="caption" className="block mt-2">
                      {errors.image}
                    </Typography>
                  )}

                  {imagePreview && (
                    <Box className="mt-4 relative">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="max-h-60 mx-auto rounded-lg shadow-sm"
                      />
                    </Box>
                  )}
                </Box>
              </Grid>

              {/* Submit Button */}
              <Grid item xs={12} className="mt-4">
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={isLoading}
                  startIcon={isLoading ? <CircularProgress size={20} /> : <Send className="w-5 h-5" />}
                  className="bg-blue-600 hover:bg-blue-700 py-3 text-base font-medium"
                >
                  {isLoading ? 'Submitting...' : 'Submit Complaint'}
                </Button>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default CreateComplaint;