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
   'hostel',
   'wifi',
   'classroom',
   'mess',
   'other'
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
    <Box 
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f172a, #581c87, #0f172a)',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: '10%',
          left: '10%',
          width: '300px',
          height: '300px',
          background: 'radial-gradient(circle, rgba(147, 51, 234, 0.2) 0%, transparent 70%)',
          borderRadius: '50%',
          zIndex: 0,
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          bottom: '10%',
          right: '10%',
          width: '400px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(79, 70, 229, 0.15) 0%, transparent 70%)',
          borderRadius: '50%',
          zIndex: 0,
        }
      }}
    >
      <Box 
        sx={{
          position: 'relative',
          zIndex: 1,
          padding: '2rem',
          maxWidth: '800px',
          margin: '0 auto',
        }}
      >
        {/* Header */}
        <Box sx={{ marginBottom: '2rem' }}>
          <Button
            startIcon={<ArrowLeft className="w-5 h-5" />}
            onClick={() => navigate('/student/complaints')}
            sx={{
              marginBottom: '1rem',
              color: '#cbd5e1',
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255, 255, 255, 0.10)',
              borderRadius: '12px',
              padding: '12px 20px',
              textTransform: 'none',
              fontSize: '14px',
              fontWeight: 500,
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                background: 'rgba(255, 255, 255, 0.10)',
                transform: 'translateY(-2px)',
                boxShadow: '0 10px 25px -5px rgba(147, 51, 234, 0.2)',
                border: '1px solid rgba(147, 51, 234, 0.3)',
              }
            }}
          >
            Back to Complaints
          </Button>
          
          <Typography 
            variant="h3" 
            sx={{
              background: 'linear-gradient(90deg, #c084fc, #f472b6, #818cf8)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
              fontWeight: 700,
              fontSize: { xs: '2rem', md: '2.5rem' },
              marginBottom: '0.5rem',
              textAlign: 'center',
            }}
          >
            Create New Complaint
          </Typography>
          
          <Typography 
            variant="body1" 
            sx={{
              color: '#cbd5e1',
              textAlign: 'center',
              fontSize: '18px',
              opacity: 0.9,
            }}
          >
            Fill in the details below to submit your complaint
          </Typography>
        </Box>

        {/* Error Alert */}
        {submitError && (
          <Alert 
            severity="error" 
            sx={{
              marginBottom: '2rem',
              background: 'rgba(239, 68, 68, 0.1)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '16px',
              color: '#fecaca',
              '& .MuiAlert-icon': {
                color: '#f87171'
              }
            }}
          >
            {submitError}
          </Alert>
        )}

        {/* Complaint Form */}
        <Card
          sx={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(255, 255, 255, 0.10)',
            borderRadius: '24px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(147, 51, 234, 0.3)',
              transform: 'translateY(-4px)',
              boxShadow: '0 32px 64px -12px rgba(147, 51, 234, 0.15)',
            }
          }}
        >
          <CardContent sx={{ padding: '2rem' }}>
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
                        <FileText className="w-5 h-5 text-purple-400 mr-2" />
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        background: 'rgba(255, 255, 255, 0.05)',
                        backdropFilter: 'blur(8px)',
                        borderRadius: '16px',
                        color: '#ffffff',
                        transition: 'all 0.3s ease',
                        '& fieldset': {
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                        },
                        '&:hover fieldset': {
                          border: '1px solid rgba(147, 51, 234, 0.5)',
                        },
                        '&.Mui-focused fieldset': {
                          border: '2px solid #9333ea',
                          boxShadow: '0 0 20px rgba(147, 51, 234, 0.3)',
                        },
                      },
                      '& .MuiInputLabel-root': {
                        color: '#cbd5e1',
                        '&.Mui-focused': {
                          color: '#c084fc',
                        },
                      },
                      '& .MuiFormHelperText-root': {
                        color: '#fca5a5',
                      },
                    }}
                  />
                </Grid>

                {/* Category */}
                <Grid item xs={12} md={6}>
                  <FormControl 
                    fullWidth 
                    error={!!errors.category}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        background: 'rgba(255, 255, 255, 0.05)',
                        backdropFilter: 'blur(8px)',
                        borderRadius: '16px',
                        color: '#ffffff',
                        '& fieldset': {
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                        },
                        '&:hover fieldset': {
                          border: '1px solid rgba(147, 51, 234, 0.5)',
                        },
                        '&.Mui-focused fieldset': {
                          border: '2px solid #9333ea',
                          boxShadow: '0 0 20px rgba(147, 51, 234, 0.3)',
                        },
                      },
                      '& .MuiInputLabel-root': {
                        color: '#cbd5e1',
                        '&.Mui-focused': {
                          color: '#c084fc',
                        },
                      },
                      '& .MuiFormHelperText-root': {
                        color: '#fca5a5',
                      },
                    }}
                  >
                    <InputLabel>Category</InputLabel>
                    <Select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      label="Category"
                      required
                      MenuProps={{
                        PaperProps: {
                          sx: {
                            background: 'rgba(15, 23, 42, 0.95)',
                            backdropFilter: 'blur(16px)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: '16px',
                            '& .MuiMenuItem-root': {
                              color: '#ffffff',
                              '&:hover': {
                                background: 'rgba(147, 51, 234, 0.2)',
                              },
                              '&.Mui-selected': {
                                background: 'rgba(147, 51, 234, 0.3)',
                              },
                            },
                          },
                        },
                      }}
                    >
                      {categoryOptions.map((option) => (
                        <MenuItem key={option} value={option}>
                          {option.charAt(0).toUpperCase() + option.slice(1)}
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
                        <MapPin className="w-5 h-5 text-purple-400 mr-2" />
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        background: 'rgba(255, 255, 255, 0.05)',
                        backdropFilter: 'blur(8px)',
                        borderRadius: '16px',
                        color: '#ffffff',
                        '& fieldset': {
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                        },
                        '&:hover fieldset': {
                          border: '1px solid rgba(147, 51, 234, 0.5)',
                        },
                        '&.Mui-focused fieldset': {
                          border: '2px solid #9333ea',
                          boxShadow: '0 0 20px rgba(147, 51, 234, 0.3)',
                        },
                      },
                      '& .MuiInputLabel-root': {
                        color: '#cbd5e1',
                        '&.Mui-focused': {
                          color: '#c084fc',
                        },
                      },
                      '& .MuiFormHelperText-root': {
                        color: '#fca5a5',
                      },
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
                        <Info className="w-5 h-5 text-purple-400 mr-2 mt-3" />
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        background: 'rgba(255, 255, 255, 0.05)',
                        backdropFilter: 'blur(8px)',
                        borderRadius: '16px',
                        color: '#ffffff',
                        '& fieldset': {
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                        },
                        '&:hover fieldset': {
                          border: '1px solid rgba(147, 51, 234, 0.5)',
                        },
                        '&.Mui-focused fieldset': {
                          border: '2px solid #9333ea',
                          boxShadow: '0 0 20px rgba(147, 51, 234, 0.3)',
                        },
                      },
                      '& .MuiInputLabel-root': {
                        color: '#cbd5e1',
                        '&.Mui-focused': {
                          color: '#c084fc',
                        },
                      },
                      '& .MuiFormHelperText-root': {
                        color: '#fca5a5',
                      },
                    }}
                  />
                </Grid>

                {/* Image Upload */}
                <Grid item xs={12}>
                  <Box 
                    sx={{
                      border: '2px dashed rgba(147, 51, 234, 0.5)',
                      borderRadius: '20px',
                      padding: '2rem',
                      textAlign: 'center',
                      background: 'rgba(255, 255, 255, 0.03)',
                      backdropFilter: 'blur(8px)',
                      transition: 'all 0.3s ease',
                      cursor: 'pointer',
                      '&:hover': {
                        background: 'rgba(255, 255, 255, 0.08)',
                        border: '2px dashed rgba(147, 51, 234, 0.8)',
                        transform: 'translateY(-2px)',
                      }
                    }}
                  >
                    <input
                      type="file"
                      id="image-upload"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={handleImageChange}
                    />
                    <label htmlFor="image-upload" style={{ cursor: 'pointer', display: 'block' }}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Upload 
                          className="w-8 h-8 mb-2" 
                          style={{ 
                            color: '#c084fc',
                            background: 'linear-gradient(135deg, #9333ea, #c084fc)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                          }} 
                        />
                        <Typography 
                          variant="subtitle1" 
                          sx={{ 
                            fontWeight: 600, 
                            marginBottom: '0.5rem',
                            color: '#ffffff',
                          }}
                        >
                          {imagePreview ? 'Change Image' : 'Upload Image'}
                        </Typography>
                        <Typography 
                          variant="body2" 
                          sx={{ color: '#cbd5e1', opacity: 0.8 }}
                        >
                          JPG, PNG or GIF (Max. 5MB)
                        </Typography>
                      </Box>
                    </label>

                    {errors.image && (
                      <Typography 
                        color="error" 
                        variant="caption" 
                        sx={{ 
                          display: 'block', 
                          marginTop: '0.5rem',
                          color: '#fca5a5',
                        }}
                      >
                        {errors.image}
                      </Typography>
                    )}

                    {imagePreview && (
                      <Box sx={{ marginTop: '1rem', position: 'relative' }}>
                        <Box
                          component="img"
                          src={imagePreview}
                          alt="Preview"
                          sx={{
                            maxHeight: '240px',
                            borderRadius: '16px',
                            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                          }}
                        />
                      </Box>
                    )}
                  </Box>
                </Grid>

                {/* Submit Button */}
                <Grid item xs={12} sx={{ marginTop: '1rem' }}>
                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    disabled={isLoading}
                    startIcon={isLoading ? <CircularProgress size={20} /> : <Send className="w-5 h-5" />}
                    sx={{
                      background: 'linear-gradient(90deg, #9333ea, #db2777, #4f46e5)',
                      padding: '16px 32px',
                      borderRadius: '16px',
                      boxShadow: '0 20px 25px -5px rgba(147, 51, 234, 0.4)',
                      fontSize: '16px',
                      fontWeight: 600,
                      textTransform: 'none',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      border: 'none',
                      '&:hover': {
                        transform: 'scale(1.02) translateY(-2px)',
                        boxShadow: '0 25px 50px -12px rgba(147, 51, 234, 0.5)',
                        background: 'linear-gradient(90deg, #a855f7, #e879f9, #6366f1)',
                      },
                      '&:disabled': {
                        background: 'rgba(107, 114, 128, 0.5)',
                        color: 'rgba(255, 255, 255, 0.5)',
                        transform: 'none',
                        boxShadow: 'none',
                      },
                    }}
                  >
                    {isLoading ? 'Submitting...' : 'Submit Complaint'}
                  </Button>
                </Grid>
              </Grid>
            </form>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default CreateComplaint;