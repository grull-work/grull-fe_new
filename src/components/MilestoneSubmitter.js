import React, { useState, useEffect } from 'react';
import {
  Box,
  Modal,
  Typography,
  Button,
  TextField,
  Divider,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Grid,
  Card,
  CardContent
} from '@mui/material';
import { IoClose, IoCheckmark, IoLink } from 'react-icons/io5';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import BAPI from '../helper/variable';

const MilestoneSubmitter = ({ 
  open, 
  onClose, 
  jobId, 
  onMilestoneSubmitted 
}) => {
  const [deliverableNumber, setDeliverableNumber] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [submissionLink, setSubmissionLink] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [availableDeliverables, setAvailableDeliverables] = useState([]);
  const accessToken = localStorage.getItem('accessToken');

  // Get available deliverables when modal opens
  useEffect(() => {
    if (open && jobId) {
      fetchAvailableDeliverables();
    }
  }, [open, jobId]);

  const fetchAvailableDeliverables = async () => {
    try {
      const response = await axios.get(`${BAPI}/api/v0/chats/job-deliverables/${jobId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      
      // Filter deliverables that don't have milestones yet
      const deliverables = response.data.deliverables || [];
      const available = deliverables.filter(d => d.status === 'PENDING');
      setAvailableDeliverables(available);
    } catch (error) {
      console.error('Error fetching deliverables:', error);
    }
  };

  const handleSubmit = async () => {
    if (!deliverableNumber || !title || !description || !submissionLink) {
      toast.error('Please fill in all fields');
      return;
    }

    if (!accessToken) {
      toast.error('No access token found. Please login again.');
      return;
    }

    // Validate URL format
    try {
      new URL(submissionLink);
    } catch {
      toast.error('Please enter a valid URL for your submission');
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(`${BAPI}/api/v0/chats/submit-milestone`, {
        job_id: jobId,
        deliverable_number: parseInt(deliverableNumber),
        title: title.trim(),
        description: description.trim(),
        submission_link: submissionLink.trim()
      }, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      
      toast.success('Milestone submitted successfully! Waiting for client review.');
      setDeliverableNumber('');
      setTitle('');
      setDescription('');
      setSubmissionLink('');
      fetchAvailableDeliverables();
      onMilestoneSubmitted();
      
    } catch (error) {
      console.error('Error submitting milestone:', error);
      if (error.response?.status === 400) {
        toast.error(error.response.data.detail || 'Failed to submit milestone');
      } else {
        toast.error('An error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setDeliverableNumber('');
    setTitle('');
    setDescription('');
    setSubmissionLink('');
    onClose();
  };

  const getSelectedDeliverable = () => {
    return availableDeliverables.find(d => d.deliverable_number === parseInt(deliverableNumber));
  };

  const selectedDeliverable = getSelectedDeliverable();

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="milestone-submitter-modal"
      aria-describedby="Submit milestone for completed deliverable"
    >
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: { xs: '95%', sm: '700px' },
        maxHeight: '90vh',
        bgcolor: 'background.paper',
        borderRadius: 2,
        boxShadow: 24,
        p: 3,
        overflow: 'auto'
      }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" component="h2" fontWeight="bold">
            Submit Milestone
          </Typography>
          <Button
            onClick={handleClose}
            sx={{ minWidth: 'auto', p: 1 }}
          >
            <IoClose size={24} />
          </Button>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {/* Info Alert */}
        <Alert severity="info" sx={{ mb: 3 }}>
          <Typography variant="body2">
            Submit your completed work as a milestone. The client will review and approve it before payment is released.
          </Typography>
        </Alert>

        {/* Available Deliverables */}
        {availableDeliverables.length > 0 && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Available Deliverables:
            </Typography>
            <Grid container spacing={1}>
              {availableDeliverables.map((deliverable) => (
                <Grid item key={deliverable.id}>
                  <Chip
                    label={`${deliverable.deliverable_number}: ${deliverable.title}`}
                    color="primary"
                    variant="outlined"
                    size="small"
                    onClick={() => {
                      setDeliverableNumber(deliverable.deliverable_number);
                      setTitle(deliverable.title);
                      setDescription(deliverable.description);
                    }}
                  />
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {/* Selected Deliverable Details */}
        {selectedDeliverable && (
          <Card sx={{ mb: 3, bgcolor: 'grey.50' }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 1 }}>
                Deliverable {selectedDeliverable.deliverable_number}: {selectedDeliverable.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                {selectedDeliverable.description}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Deadline:</strong> {new Date(selectedDeliverable.deadline).toLocaleDateString()}
              </Typography>
            </CardContent>
          </Card>
        )}

        {/* Form */}
        <Box component="form" onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
          <Grid container spacing={3}>
            {/* Deliverable Number */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Deliverable Number</InputLabel>
                <Select
                  value={deliverableNumber}
                  onChange={(e) => setDeliverableNumber(e.target.value)}
                  label="Deliverable Number"
                >
                  {availableDeliverables.map((deliverable) => (
                    <MenuItem key={deliverable.id} value={deliverable.deliverable_number}>
                      {deliverable.deliverable_number}: {deliverable.title}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Title */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                label="Milestone Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Homepage Design Completed"
                helperText="Give a clear title for your completed work"
              />
            </Grid>

            {/* Description */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                label="Work Description"
                multiline
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what you've completed, any changes made, and how it meets the requirements..."
                helperText="Be detailed about what you've delivered"
              />
            </Grid>

            {/* Submission Link */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                label="Submission Link"
                value={submissionLink}
                onChange={(e) => setSubmissionLink(e.target.value)}
                placeholder="https://example.com/your-work or https://drive.google.com/file/..."
                helperText="Provide a link to your completed work (Google Drive, Figma, GitHub, etc.)"
                InputProps={{
                  startAdornment: <IoLink style={{ marginRight: 8, color: 'gray' }} />
                }}
              />
            </Grid>
          </Grid>

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', gap: 2, mt: 4, justifyContent: 'flex-end' }}>
            <Button
              variant="outlined"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={isLoading || !deliverableNumber || !title || !description || !submissionLink}
              startIcon={<IoCheckmark />}
            >
              {isLoading ? 'Submitting...' : 'Submit Milestone'}
            </Button>
          </Box>
        </Box>

        {/* Help Text */}
        <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
          <Typography variant="body2" color="text.secondary">
            <strong>Tip:</strong> Make sure your submission link is accessible to the client. 
            For design work, consider using Figma, Canva, or Google Drive. For code, use GitHub, 
            GitLab, or similar platforms. Include clear documentation of what you've completed.
          </Typography>
        </Box>
      </Box>
    </Modal>
  );
};

export default MilestoneSubmitter;


