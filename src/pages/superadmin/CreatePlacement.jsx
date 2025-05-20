// src/pages/superadmin/CreatePlacement.jsx
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
      <Card elevation={3} sx={{ p: 3 }}>
        <Typography variant="h6" component="h2" sx={{ mb: 3 }}>
          Admin Assignment
        </Typography>

        <FormControlLabel
          control={
            <Switch
              checked={assignAdmin}
              onChange={toggleAssignAdmin}
              color="primary"
            />
          }
          label="Assign an admin to manage this placement"
          sx={{ mb: 2 }}
        />

        <Divider sx={{ mb: 3 }} />

        {assignAdmin ? (
          isLoadingAdmins ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
              <CircularProgress size={30} />
            </Box>
          ) : adminList && adminList.length > 0 ? (
            <FormControl fullWidth error={!!formErrors.assignedAdmin} sx={{ mb: 3 }}>
              <InputLabel id="admin-select-label">Assign Admin</InputLabel>
              <Select
                labelId="admin-select-label"
                value={placementData.assignedAdmin}
                label="Assign Admin"
                onChange={handleAdminChange}
                startAdornment={<Users size={18} style={{ marginRight: 8, color: '#6B7280' }} />}
              >
                {adminList.map(admin => (
                  <MenuItem key={admin._id} value={admin._id}>
                    {admin.email}
                  </MenuItem>
                ))}
              </Select>
              {formErrors.assignedAdmin && (
                <FormHelperText>{formErrors.assignedAdmin}</FormHelperText>
              )}
            </FormControl>
          ) : (
            <Alert severity="warning" sx={{ mb: 3 }}>
              {adminError
                ? `Error loading admins: ${adminError.data?.message || 'Unknown error'}`
                : 'No admins available to assign.'}
            </Alert>
          )
        ) : (
          <Box sx={{ display: 'flex', alignItems: 'center', my: 2, mb: 3 }}>
            <Info size={20} style={{ color: '#3B82F6', marginRight: 8 }} />
            <Typography variant="body2" color="textSecondary">
              No admin will be assigned to this placement. You can always assign an admin later.
            </Typography>
          </Box>
        )}

        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" color="textSecondary">
            Assigning an admin will give them permission to manage this placement, update student statuses, and post updates.
          </Typography>
        </Box>
      </Card>
    );
  };

  // Render placement details step
  const renderPlacementDetails = () => {
    return (
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h6" component="h2" sx={{ mb: 3 }}>
          Placement Details
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Company Name"
              name="companyName"
              value={placementData.companyName}
              onChange={handleInputChange}
              error={!!formErrors.companyName}
              helperText={formErrors.companyName || ''}
              InputProps={{
                startAdornment: <Building size={18} style={{ marginRight: 8, color: '#6B7280' }} />,
              }}
              required
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Job Title"
              name="jobTitle"
              value={placementData.jobTitle}
              onChange={handleInputChange}
              error={!!formErrors.jobTitle}
              helperText={formErrors.jobTitle || ''}
              InputProps={{
                startAdornment: <Briefcase size={18} style={{ marginRight: 8, color: '#6B7280' }} />,
              }}
              required
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Job Description"
              name="jobDescription"
              value={placementData.jobDescription}
              onChange={handleInputChange}
              error={!!formErrors.jobDescription}
              helperText={formErrors.jobDescription || ''}
              multiline
              minRows={4}
              InputProps={{
                startAdornment: <FileText size={18} style={{ marginRight: 8, color: '#6B7280', position: 'absolute', top: 12 }} />,
                sx: { paddingLeft: '28px' }
              }}
              required
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
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
                      startAdornment: <Calendar size={18} style={{ marginRight: 8, color: '#6B7280' }} />
                    }
                  }
                }}
              />
            </LocalizationProvider>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Application Link (Optional)"
              name="applicationLink"
              value={placementData.applicationLink}
              onChange={handleInputChange}
              placeholder="https://example.com/apply"
              InputProps={{
                startAdornment: <LinkIcon size={18} style={{ marginRight: 8, color: '#6B7280' }} />,
              }}
            />
          </Grid>
        </Grid>
      </Paper>
    );
  };

  // Render review step
  const renderReview = () => {
    return (
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h6" component="h2" sx={{ mb: 3 }}>
          Review Placement Information
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2">Company Name</Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>{placementData.companyName || 'Not provided'}</Typography>
            
            <Typography variant="subtitle2">Job Title</Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>{placementData.jobTitle || 'Not provided'}</Typography>
            
            {placementData.deadline && (
              <>
                <Typography variant="subtitle2">Application Deadline</Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {new Date(placementData.deadline).toLocaleDateString()}
                </Typography>
              </>
            )}
            
            {placementData.applicationLink && (
              <>
                <Typography variant="subtitle2">Application Link</Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>{placementData.applicationLink}</Typography>
              </>
            )}
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2">Admin Assignment</Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              {assignAdmin ? (
                placementData.assignedAdmin ? selectedAdminEmail : 'No admin selected'
              ) : 'No admin assigned'}
            </Typography>
            
            {placementData.eligibilityCriteria && (
              <>
                <Typography variant="subtitle2">Eligibility Criteria</Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>{placementData.eligibilityCriteria}</Typography>
              </>
            )}
          </Grid>
          
          <Grid item xs={12}>
            <Typography variant="subtitle2">Job Description</Typography>
            <Typography variant="body1" sx={{ mb: 2, whiteSpace: 'pre-wrap' }}>
              {placementData.jobDescription || 'Not provided'}
            </Typography>
          </Grid>
        </Grid>
      </Paper>
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
    <div className="p-6 max-w-5xl mx-auto">
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center' }}>
        <IconButton 
          onClick={handleCancel} 
          sx={{ mr: 2 }}
          aria-label="Go back to placement list"
        >
          <ArrowLeft />
        </IconButton>
        <Typography variant="h4" component="h1">
          Create New Placement
        </Typography>
      </Box>
      
      {successMessage && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {successMessage}
        </Alert>
      )}
      
      {errorMessage && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errorMessage}
        </Alert>
      )}
      
      <Box sx={{ mb: 4 }}>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>
      
      {renderStep()}
      
      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
        <Button
          variant="outlined"
          onClick={activeStep === 0 ? handleCancel : handleBackStep}
        >
          {activeStep === 0 ? 'Cancel' : 'Back'}
        </Button>
        
        <Button
          variant="contained"
          color="primary"
          onClick={handleNextStep}
          startIcon={activeStep === steps.length - 1 ? <CheckCircle size={20} /> : null}
        >
          {activeStep === steps.length - 1 ? 'Create Placement' : 'Next'}
        </Button>
      </Box>
      
      {/* Confirmation Dialog */}
      <Dialog
        open={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
      >
        <DialogTitle>Confirm Placement Creation</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to create this placement{assignAdmin && placementData.assignedAdmin ? ` and assign it to ${selectedAdminEmail}` : ''}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleSubmit} 
            color="primary" 
            variant="contained"
            disabled={isCreating || isAssigning}
            startIcon={isCreating || isAssigning ? <CircularProgress size={20} /> : <Save size={20} />}
          >
            {isCreating || isAssigning ? 'Creating...' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default CreatePlacement;