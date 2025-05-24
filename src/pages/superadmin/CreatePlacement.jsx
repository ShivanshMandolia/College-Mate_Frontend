import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  useCreatePlacementMutation,
  useGetAllAdminsQuery,
  useAssignPlacementToAdminMutation,
} from '../../features/placements/placementsApiSlice';
import { 
  TextField, 
  Button, 
  Typography, 
  Box, 
  Paper, 
  Grid, 
  FormControl, 
  FormHelperText,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  Divider,
  IconButton,
  Card,
  CardContent,
  FormControlLabel,
  Switch,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Step,
  StepLabel,
  Stepper
} from '@mui/material';
import { 
  Building, 
  Briefcase, 
  FileText, 
  Calendar, 
  Link as LinkIcon, 
  Users, 
  Save, 
  ArrowLeft,
  Info,
  CheckCircle
} from 'lucide-react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

const CreatePlacement = () => {
  const navigate = useNavigate();
  
  const [createPlacement, { isLoading: isCreating }] = useCreatePlacementMutation();
  const { data: adminData, isLoading: isLoadingAdmins, error: adminError } = useGetAllAdminsQuery();
  const [assignPlacementToAdmin, { isLoading: isAssigning }] = useAssignPlacementToAdminMutation();
  
  const [adminList, setAdminList] = useState([]);
  
  // Process admin data when it's loaded
  useEffect(() => {
    if (adminData) {
      // Handle the adminData structure correctly
      const admins = Array.isArray(adminData) ? adminData : (adminData.data || []);
      setAdminList(admins);
    }
  }, [adminData]);
  
  const [placementData, setPlacementData] = useState({
    companyName: '',
    jobTitle: '',
    jobDescription: '',
    eligibilityCriteria: '',
    deadline: null,
    applicationLink: '',
    assignedAdmin: '',
  });
  
  const [assignAdmin, setAssignAdmin] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [activeStep, setActiveStep] = useState(0);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [createdPlacementId, setCreatedPlacementId] = useState(null);
  const [selectedAdminEmail, setSelectedAdminEmail] = useState('');

  const steps = ['Admin Assignment', 'Placement Details', 'Review & Submit'];
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPlacementData({
      ...placementData,
      [name]: value
    });
    
    // Clear error for this field if it exists
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: ''
      });
    }
  };
  
  const handleDateChange = (date) => {
    setPlacementData({
      ...placementData,
      deadline: date
    });
    
    // Clear error for this field if it exists
    if (formErrors.deadline) {
      setFormErrors({
        ...formErrors,
        deadline: ''
      });
    }
  };

  const handleAdminChange = (e) => {
    const adminId = e.target.value;
    setPlacementData({
      ...placementData,
      assignedAdmin: adminId
    });
    
    // Find and store the selected admin's email
    const selectedAdmin = adminList.find(admin => admin._id === adminId);
    if (selectedAdmin) {
      setSelectedAdminEmail(selectedAdmin.email);
    }

    // Clear error for this field if it exists
    if (formErrors.assignedAdmin) {
      setFormErrors({
        ...formErrors,
        assignedAdmin: ''
      });
    }
  };

  const toggleAssignAdmin = (e) => {
    const checked = e.target.checked;
    setAssignAdmin(checked);
    
    // Clear the assigned admin if toggled off
    if (!checked) {
      setPlacementData({
        ...placementData,
        assignedAdmin: ''
      });
      setSelectedAdminEmail('');
    }
  };
  
  const validateStep = (step) => {
    const errors = {};
    
    if (step === 0) {
      // Validate admin assignment step
      if (assignAdmin && !placementData.assignedAdmin) {
        errors.assignedAdmin = 'Please select an admin to assign';
        return { isValid: false, errors };
      }
    } else if (step === 1) {
      // Validate placement details step
      if (!placementData.companyName.trim()) {
        errors.companyName = 'Company name is required';
      }
      
      if (!placementData.jobTitle.trim()) {
        errors.jobTitle = 'Job title is required';
      }
      
      if (!placementData.jobDescription.trim()) {
        errors.jobDescription = 'Job description is required';
      }
      
      if (Object.keys(errors).length > 0) {
        return { isValid: false, errors };
      }
    }
    
    return { isValid: true, errors };
  };

  const handleNextStep = () => {
    const { isValid, errors } = validateStep(activeStep);
    
    if (!isValid) {
      setFormErrors(errors);
      return;
    }
    
    if (activeStep === steps.length - 1) {
      // Last step - show confirmation dialog
      setConfirmDialogOpen(true);
    } else {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };
  
  const handleBackStep = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };
  
  const handleSubmit = async () => {
    setConfirmDialogOpen(false);
    
    // Clear previous messages
    setSuccessMessage('');
    setErrorMessage('');
    
    try {
      // First, create the placement without admin assignment
      const placementToSubmit = {
        companyName: placementData.companyName,
        jobTitle: placementData.jobTitle,
        jobDescription: placementData.jobDescription,
        eligibilityCriteria: placementData.eligibilityCriteria || '',
        deadline: placementData.deadline,
        applicationLink: placementData.applicationLink || '',
      };
      
      // Create the placement first
      const result = await createPlacement(placementToSubmit).unwrap();
      
      // Store the created placement ID
      const placementId = result.data._id;
      setCreatedPlacementId(placementId);
      
      // If admin assignment is enabled, assign the admin
      if (assignAdmin && placementData.assignedAdmin) {
        await assignPlacementToAdmin({ 
          placementId, 
          adminId: placementData.assignedAdmin 
        }).unwrap();
      }
      
      setSuccessMessage('Placement created successfully!');
      
      // Redirect to the SuperAdmin placement list page after a short delay
      setTimeout(() => {
        navigate('/superadmin/placements');
      }, 1500);
    } catch (err) {
      console.error('Failed to create placement:', err);
      setErrorMessage(err.data?.message || 'Failed to create placement. Please try again.');
    }
  };
  
  const handleCancel = () => {
    navigate('/superadmin/placements');
  };

  // Render admin assignment step
  const renderAdminAssignment = () => {
    return (
      <div style={{
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(255, 255, 255, 0.10)',
        borderRadius: '24px',
        padding: '32px',
        transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
        boxShadow: '0 25px 50px -12px rgba(147, 51, 234, 0.10)'
      }}>
        <Typography 
          variant="h6" 
          component="h2" 
          sx={{ 
            mb: 3, 
           
            fontWeight: 600,
            background: 'linear-gradient(90deg, #c084fc, #f472b6, #818cf8)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent'
          }}
        >
          Admin Assignment
        </Typography>

        <FormControlLabel
          control={
            <Switch
              checked={assignAdmin}
              onChange={toggleAssignAdmin}
              sx={{
                '& .MuiSwitch-switchBase.Mui-checked': {
                  color: '#a855f7',
                  '&:hover': {
                    backgroundColor: 'rgba(168, 85, 247, 0.08)',
                  },
                },
                '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                  background: 'linear-gradient(90deg, #9333ea, #db2777)',
                },
                '& .MuiSwitch-track': {
                  backgroundColor: 'rgba(255, 255, 255, 0.20)',
                },
              }}
            />
          }
          label={
            <Typography sx={{ color: '#ffffff', fontWeight: 500 }}>
              Assign an admin to manage this placement
            </Typography>
          }
          sx={{ mb: 2 }}
        />

        <Divider sx={{ mb: 3, borderColor: 'rgba(255, 255, 255, 0.10)' }} />

        {assignAdmin ? (
          isLoadingAdmins ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
              <CircularProgress 
                size={30} 
                sx={{ color: '#a855f7' }}
              />
            </Box>
          ) : adminList && adminList.length > 0 ? (
            <FormControl 
              fullWidth 
              error={!!formErrors.assignedAdmin} 
              sx={{ 
                mb: 3,
                '& .MuiOutlinedInput-root': {
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(8px)',
                  borderRadius: '16px',
                  border: '1px solid rgba(255, 255, 255, 0.20)',
                  color: '#ffffff',
                  '&:hover': {
                    border: '1px solid rgba(168, 85, 247, 0.50)',
                  },
                  '&.Mui-focused': {
                    border: '1px solid #a855f7',
                    boxShadow: '0 0 0 2px rgba(168, 85, 247, 0.20)',
                  }
                },
                '& .MuiInputLabel-root': {
                  color: '#cbd5e1',
                  '&.Mui-focused': {
                    color: '#c084fc',
                  }
                }
              }}
            >
              <InputLabel id="admin-select-label">Assign Admin</InputLabel>
              <Select
                labelId="admin-select-label"
                value={placementData.assignedAdmin}
                label="Assign Admin"
                onChange={handleAdminChange}
                startAdornment={<Users size={18} style={{ marginRight: 8, color: '#c084fc' }} />}
                sx={{
                  '& .MuiSelect-icon': {
                    color: '#c084fc',
                  }
                }}
                MenuProps={{
                  PaperProps: {
                    sx: {
                      background: 'rgba(15, 23, 42, 0.95)',
                      backdropFilter: 'blur(16px)',
                      border: '1px solid rgba(255, 255, 255, 0.10)',
                      borderRadius: '16px',
                      '& .MuiMenuItem-root': {
                        color: '#ffffff',
                        '&:hover': {
                          background: 'rgba(168, 85, 247, 0.20)',
                        },
                        '&.Mui-selected': {
                          background: 'linear-gradient(90deg, rgba(147, 51, 234, 0.20), rgba(219, 39, 119, 0.20))',
                          '&:hover': {
                            background: 'linear-gradient(90deg, rgba(147, 51, 234, 0.30), rgba(219, 39, 119, 0.30))',
                          }
                        }
                      }
                    }
                  }
                }}
              >
                {adminList.map(admin => (
                  <MenuItem key={admin._id} value={admin._id}>
                    {admin.email}
                  </MenuItem>
                ))}
              </Select>
              {formErrors.assignedAdmin && (
                <FormHelperText sx={{ color: '#f87171' }}>
                  {formErrors.assignedAdmin}
                </FormHelperText>
              )}
            </FormControl>
          ) : (
            <Alert 
              severity="warning" 
              sx={{ 
                mb: 3,
                background: 'rgba(251, 146, 60, 0.10)',
                border: '1px solid rgba(251, 146, 60, 0.30)',
                borderRadius: '16px',
                color: '#ffffff',
                '& .MuiAlert-icon': {
                  color: '#fb923c',
                }
              }}
            >
              {adminError
                ? `Error loading admins: ${adminError.data?.message || 'Unknown error'}`
                : 'No admins available to assign.'}
            </Alert>
          )
        ) : (
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            my: 2, 
            mb: 3,
            padding: '16px',
            background: 'rgba(59, 130, 246, 0.10)',
            border: '1px solid rgba(59, 130, 246, 0.30)',
            borderRadius: '16px'
          }}>
            <Info size={20} style={{ color: '#3B82F6', marginRight: 8 }} />
            <Typography variant="body2" sx={{ color: '#cbd5e1' }}>
              No admin will be assigned to this placement. You can always assign an admin later.
            </Typography>
          </Box>
        )}

        <Box sx={{ 
          mt: 2, 
          padding: '16px',
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.10)'
        }}>
          <Typography variant="body2" sx={{ color: '#cbd5e1' }}>
            Assigning an admin will give them permission to manage this placement, update student statuses, and post updates.
          </Typography>
        </Box>
      </div>
    );
  };

  // Custom styled TextField component
  const StyledTextField = ({ startIcon, multiline, minRows, ...props }) => (
    <TextField
      {...props}
      InputProps={{
        startAdornment: startIcon ? React.cloneElement(startIcon, { 
          size: 18, 
          style: { 
            marginRight: 8, 
            color: '#c084fc',
            ...(multiline && { position: 'absolute', top: 12 })
          } 
        }) : undefined,
        sx: {
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(8px)',
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.20)',
          color: '#ffffff',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          ...(multiline && { paddingLeft: '36px' }),
          '&:hover': {
            border: '1px solid rgba(168, 85, 247, 0.50)',
            transform: 'translateY(-2px)',
          },
          '&.Mui-focused': {
            border: '1px solid #a855f7',
            boxShadow: '0 0 0 2px rgba(168, 85, 247, 0.20)',
            transform: 'translateY(-2px)',
          },
          '& .MuiInputBase-input': {
            color: '#ffffff',
            '&::placeholder': {
              color: '#cbd5e1',
              opacity: 0.7,
            }
          }
        }
      }}
      InputLabelProps={{
        sx: {
          color: '#cbd5e1',
          '&.Mui-focused': {
            color: '#c084fc',
          }
        }
      }}
      FormHelperTextProps={{
        sx: {
          color: props.error ? '#f87171' : '#cbd5e1',
          marginLeft: '4px'
        }
      }}
      multiline={multiline}
      minRows={minRows}
    />
  );

  // Render placement details step
  const renderPlacementDetails = () => {
    return (
      <div style={{
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(255, 255, 255, 0.10)',
        borderRadius: '24px',
        padding: '32px',
        transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
        boxShadow: '0 25px 50px -12px rgba(147, 51, 234, 0.10)'
      }}>
        <Typography 
          variant="h6" 
          component="h2" 
          sx={{ 
            mb: 3,
            background: 'linear-gradient(90deg, #c084fc, #f472b6, #818cf8)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
            fontWeight: 600
          }}
        >
          Placement Details
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <StyledTextField
              fullWidth
              label="Company Name"
              name="companyName"
              value={placementData.companyName}
              onChange={handleInputChange}
              error={!!formErrors.companyName}
              helperText={formErrors.companyName || ''}
              startIcon={<Building />}
              required
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <StyledTextField
              fullWidth
              label="Job Title"
              name="jobTitle"
              value={placementData.jobTitle}
              onChange={handleInputChange}
              error={!!formErrors.jobTitle}
              helperText={formErrors.jobTitle || ''}
              startIcon={<Briefcase />}
              required
            />
          </Grid>
          
          <Grid item xs={12}>
            <StyledTextField
              fullWidth
              label="Job Description"
              name="jobDescription"
              value={placementData.jobDescription}
              onChange={handleInputChange}
              error={!!formErrors.jobDescription}
              helperText={formErrors.jobDescription || ''}
              multiline
              minRows={4}
              startIcon={<FileText />}
              required
            />
          </Grid>
          
          <Grid item xs={12}>
            <StyledTextField
              fullWidth
              label="Eligibility Criteria"
              name="eligibilityCriteria"
              value={placementData.eligibilityCriteria}
              onChange={handleInputChange}
              multiline
              minRows={2}
              placeholder="e.g., Minimum CGPA, Branch, Year, etc."
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Application Deadline"
                value={placementData.deadline}
                onChange={handleDateChange}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    error: !!formErrors.deadline,
                    helperText: formErrors.deadline || '',
                    InputProps: {
                      startAdornment: <Calendar size={18} style={{ marginRight: 8, color: '#c084fc' }} />,
                      sx: {
                        background: 'rgba(255, 255, 255, 0.05)',
                        backdropFilter: 'blur(8px)',
                        borderRadius: '16px',
                        border: '1px solid rgba(255, 255, 255, 0.20)',
                        color: '#ffffff',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        '&:hover': {
                          border: '1px solid rgba(168, 85, 247, 0.50)',
                          transform: 'translateY(-2px)',
                        },
                        '&.Mui-focused': {
                          border: '1px solid #a855f7',
                          boxShadow: '0 0 0 2px rgba(168, 85, 247, 0.20)',
                          transform: 'translateY(-2px)',
                        },
                        '& .MuiInputBase-input': {
                          color: '#ffffff',
                        }
                      }
                    },
                    InputLabelProps: {
                      sx: {
                        color: '#cbd5e1',
                        '&.Mui-focused': {
                          color: '#c084fc',
                        }
                      }
                    }
                  },
                  popper: {
                    sx: {
                      '& .MuiPaper-root': {
                        background: 'rgba(15, 23, 42, 0.95)',
                        backdropFilter: 'blur(16px)',
                        border: '1px solid rgba(255, 255, 255, 0.10)',
                        borderRadius: '16px',
                        color: '#ffffff',
                      }
                    }
                  }
                }}
              />
            </LocalizationProvider>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <StyledTextField
              fullWidth
              label="Application Link (Optional)"
              name="applicationLink"
              value={placementData.applicationLink}
              onChange={handleInputChange}
              placeholder="https://example.com/apply"
              startIcon={<LinkIcon />}
            />
          </Grid>
        </Grid>
      </div>
    );
  };

  // Render review step
  const renderReview = () => {
    return (
      <div style={{
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(255, 255, 255, 0.10)',
        borderRadius: '24px',
        padding: '32px',
        transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
        boxShadow: '0 25px 50px -12px rgba(147, 51, 234, 0.10)'
      }}>
        <Typography 
          variant="h6" 
          component="h2" 
          sx={{ 
            mb: 3,
            background: 'linear-gradient(90deg, #c084fc, #f472b6, #818cf8)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
            fontWeight: 600
          }}
        >
          Review Placement Information
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <div style={{
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '16px',
              padding: '20px',
              border: '1px solid rgba(255, 255, 255, 0.10)',
              marginBottom: '16px'
            }}>
              <Typography variant="subtitle2" sx={{ color: '#c084fc', fontWeight: 600, mb: 1 }}>
                Company Name
              </Typography>
              <Typography variant="body1" sx={{ color: '#ffffff', mb: 2 }}>
                {placementData.companyName || 'Not provided'}
              </Typography>
              
              <Typography variant="subtitle2" sx={{ color: '#c084fc', fontWeight: 600, mb: 1 }}>
                Job Title
              </Typography>
              <Typography variant="body1" sx={{ color: '#ffffff', mb: 2 }}>
                {placementData.jobTitle || 'Not provided'}
              </Typography>
              
              {placementData.deadline && (
                <>
                  <Typography variant="subtitle2" sx={{ color: '#c084fc', fontWeight: 600, mb: 1 }}>
                    Application Deadline
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#ffffff', mb: 2 }}>
                    {new Date(placementData.deadline).toLocaleDateString()}
                  </Typography>
                </>
              )}
              
              {placementData.applicationLink && (
                <>
                  <Typography variant="subtitle2" sx={{ color: '#c084fc', fontWeight: 600, mb: 1 }}>
                    Application Link
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#60a5fa', mb: 2, wordBreak: 'break-all' }}>
                    {placementData.applicationLink}
                  </Typography>
                </>
              )}
            </div>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <div style={{
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '16px',
              padding: '20px',
              border: '1px solid rgba(255, 255, 255, 0.10)',
              marginBottom: '16px'
            }}>
              <Typography variant="subtitle2" sx={{ color: '#c084fc', fontWeight: 600, mb: 1 }}>
                Admin Assignment
              </Typography>
              <Typography variant="body1" sx={{ color: '#ffffff', mb: 2 }}>
                {assignAdmin ? (
                  placementData.assignedAdmin ? selectedAdminEmail : 'No admin selected'
                ) : 'No admin assigned'}
              </Typography>
              
              {placementData.eligibilityCriteria && (
                <>
                  <Typography variant="subtitle2" sx={{ color: '#c084fc', fontWeight: 600, mb: 1 }}>
                    Eligibility Criteria
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#ffffff', mb: 2 }}>
                    {placementData.eligibilityCriteria}
                  </Typography>
                </>
              )}
            </div>
          </Grid>
          
          <Grid item xs={12}>
            <div style={{
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '16px',
              padding: '20px',
              border: '1px solid rgba(255, 255, 255, 0.10)'
            }}>
              <Typography variant="subtitle2" sx={{ color: '#c084fc', fontWeight: 600, mb: 1 }}>
                Job Description
              </Typography>
              <Typography variant="body1" sx={{ color: '#ffffff', whiteSpace: 'pre-wrap' }}>
                {placementData.jobDescription || 'Not provided'}
              </Typography>
            </div>
          </Grid>
        </Grid>
      </div>
    );
  };
  
  // Render the current step
  const renderStep = () => {
    switch (activeStep) {
      case 0:
        return renderAdminAssignment();
      case 1:
        return renderPlacementDetails();
      case 2:
        return renderReview();
      default:
        return null;
    }
  };
  
  return (
    <div 
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f172a, #581c87, #0f172a)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Floating background elements */}
      <div style={{
        position: 'absolute',
        top: '10%',
        left: '10%',
        width: '200px',
        height: '200px',
        background: 'radial-gradient(circle, rgba(147, 51, 234, 0.1) 0%, transparent 70%)',
        borderRadius: '50%',
        animation: 'float 6s ease-in-out infinite',
      }} />
      <div style={{
        position: 'absolute',
        top: '60%',
        right: '15%',
        width: '150px',
        height: '150px',
        background: 'radial-gradient(circle, rgba(79, 70, 229, 0.1) 0%, transparent 70%)',
        borderRadius: '50%',
        animation: 'float 8s ease-in-out infinite reverse',
      }} />
      
      <div style={{ 
        padding: '24px',
        maxWidth: '1200px',
        margin: '0 auto',
        position: 'relative',
        zIndex: 1
      }}>
        <Box sx={{ 
          mb: 4, 
          display: 'flex', 
          alignItems: 'center',
          padding: '24px',
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(10px)',
          borderRadius: '20px',
          border: '1px solid rgba(255, 255, 255, 0.10)'
        }}>
          <IconButton 
            onClick={handleCancel} 
            sx={{ 
              mr: 2,
              background: 'rgba(255, 255, 255, 0.10)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255, 255, 255, 0.20)',
              color: '#c084fc',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                background: 'rgba(168, 85, 247, 0.20)',
                transform: 'scale(1.05) translateY(-2px)',
                boxShadow: '0 10px 25px -5px rgba(168, 85, 247, 0.25)',
              }
            }}
            aria-label="Go back to placement list"
          >
            <ArrowLeft />
          </IconButton>
          <Typography 
            variant="h4" 
            component="h1"
            sx={{
              background: 'linear-gradient(90deg, #c084fc, #f472b6, #818cf8)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
              fontWeight: 700,
              fontSize: { xs: '28px', md: '36px' }
            }}
          >
            Create New Placement
          </Typography>
        </Box>
        
        {successMessage && (
          <Alert 
            severity="success" 
            sx={{ 
              mb: 3,
              background: 'rgba(34, 197, 94, 0.10)',
              border: '1px solid rgba(34, 197, 94, 0.30)',
              borderRadius: '16px',
              color: '#ffffff',
              backdropFilter: 'blur(8px)',
              '& .MuiAlert-icon': {
                color: '#22c55e',
              }
            }}
          >
            {successMessage}
          </Alert>
        )}
        
        {errorMessage && (
          <Alert 
            severity="error" 
            sx={{ 
              mb: 3,
              background: 'rgba(239, 68, 68, 0.10)',
              border: '1px solid rgba(239, 68, 68, 0.30)',
              borderRadius: '16px',
              color: '#ffffff',
              backdropFilter: 'blur(8px)',
              '& .MuiAlert-icon': {
                color: '#ef4444',
              }
            }}
          >
            {errorMessage}
          </Alert>
        )}
        
        <Box sx={{ 
          mb: 4,
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(10px)',
          borderRadius: '20px',
          padding: '24px',
          border: '1px solid rgba(255, 255, 255, 0.10)'
        }}>
          <Stepper 
            activeStep={activeStep} 
            alternativeLabel
            sx={{
              '& .MuiStepLabel-label': {
                color: '#cbd5e1',
                fontWeight: 500,
                '&.Mui-active': {
                  color: '#c084fc',
                  fontWeight: 600,
                },
                '&.Mui-completed': {
                  color: '#a855f7',
                  fontWeight: 600,
                }
              },
              '& .MuiStepIcon-root': {
                color: 'rgba(255, 255, 255, 0.20)',
                '&.Mui-active': {
                  color: '#a855f7',
                },
                '&.Mui-completed': {
                  color: '#22c55e',
                }
              },
              '& .MuiStepConnector-line': {
                borderColor: 'rgba(255, 255, 255, 0.20)',
              },
              '& .Mui-active .MuiStepConnector-line': {
                borderColor: '#a855f7',
              },
              '& .Mui-completed .MuiStepConnector-line': {
                borderColor: '#22c55e',
              }
            }}
          >
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>
        
        <div style={{ marginBottom: '32px' }}>
          {renderStep()}
        </div>
        
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(10px)',
          borderRadius: '20px',
          padding: '24px',
          border: '1px solid rgba(255, 255, 255, 0.10)'
        }}>
          <Button
            variant="outlined"
            onClick={activeStep === 0 ? handleCancel : handleBackStep}
            sx={{
              background: 'rgba(255, 255, 255, 0.10)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255, 255, 255, 0.20)',
              borderRadius: '16px',
              padding: '12px 24px',
              color: '#ffffff',
              fontWeight: 500,
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                background: 'rgba(255, 255, 255, 0.20)',
                border: '1px solid rgba(255, 255, 255, 0.30)',
                transform: 'translateY(-2px)',
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.25)',
              }
            }}
          >
            {activeStep === 0 ? 'Cancel' : 'Back'}
          </Button>
          
          <Button
            variant="contained"
            onClick={handleNextStep}
            startIcon={activeStep === steps.length - 1 ? <CheckCircle size={20} /> : null}
            sx={{
              background: 'linear-gradient(90deg, #9333ea, #db2777, #4f46e5)',
              borderRadius: '16px',
              padding: '12px 32px',
              fontWeight: 600,
              boxShadow: '0 20px 25px -5px rgba(147, 51, 234, 0.25)',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                transform: 'scale(1.05) translateY(-4px)',
                boxShadow: '0 25px 50px -12px rgba(147, 51, 234, 0.40)',
                background: 'linear-gradient(90deg, #a855f7, #f472b6, #6366f1)',
              }
            }}
          >
            {activeStep === steps.length - 1 ? 'Create Placement' : 'Next'}
          </Button>
        </Box>
        
        {/* Confirmation Dialog */}
        <Dialog
          open={confirmDialogOpen}
          onClose={() => setConfirmDialogOpen(false)}
          PaperProps={{
            sx: {
              background: 'rgba(15, 23, 42, 0.95)',
              backdropFilter: 'blur(16px)',
              border: '1px solid rgba(255, 255, 255, 0.10)',
              borderRadius: '24px',
              color: '#ffffff',
              minWidth: '400px'
            }
          }}
        >
          <DialogTitle sx={{ 
           
            fontWeight: 600,
            background: 'linear-gradient(90deg, #c084fc, #f472b6)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent'
          }}>
            Confirm Placement Creation
          </DialogTitle>
          <DialogContent>
            <DialogContentText sx={{ color: '#cbd5e1' }}>
              Are you sure you want to create this placement{assignAdmin && placementData.assignedAdmin ? ` and assign it to ${selectedAdminEmail}` : ''}?
            </DialogContentText>
          </DialogContent>
          <DialogActions sx={{ padding: '16px 24px' }}>
            <Button 
              onClick={() => setConfirmDialogOpen(false)}
              sx={{
                background: 'rgba(255, 255, 255, 0.10)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255, 255, 255, 0.20)',
                borderRadius: '12px',
                color: '#ffffff',
                '&:hover': {
                  background: 'rgba(255, 255, 255, 0.20)',
                }
              }}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit} 
              variant="contained"
              disabled={isCreating || isAssigning}
              startIcon={isCreating || isAssigning ? <CircularProgress size={20} sx={{ color: '#ffffff' }} /> : <Save size={20} />}
              sx={{
                background: 'linear-gradient(90deg, #9333ea, #db2777)',
                borderRadius: '12px',
                fontWeight: 600,
                '&:hover': {
                  background: 'linear-gradient(90deg, #a855f7, #f472b6)',
                  transform: 'scale(1.02)',
                },
                '&:disabled': {
                  background: 'rgba(147, 51, 234, 0.50)',
                  color: '#ffffff',
                }
              }}
            >
              {isCreating || isAssigning ? 'Creating...' : 'Create'}
            </Button>
          </DialogActions>
        </Dialog>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        
        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
        }
        
        ::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, #9333ea, #db2777);
          border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, #a855f7, #f472b6);
        }
      `}</style>
    </div>
  );
};

export default CreatePlacement; 