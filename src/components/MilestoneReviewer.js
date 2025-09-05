import React, { useState, useEffect } from 'react';
import {
  Box,
  Modal,
  Typography,
  Button,
  TextField,
  Divider,
  Alert,
  Card,
  CardContent,
  Grid,
  Chip,
  Link,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { IoClose, IoCheckmark, IoCloseCircle, IoWallet, IoEye } from 'react-icons/io5';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import BAPI from '../helper/variable';

const MilestoneReviewer = ({ 
  open, 
  onClose, 
  jobId, 
  onMilestoneReviewed 
}) => {
  const [milestones, setMilestones] = useState([]);
  const [selectedMilestone, setSelectedMilestone] = useState(null);
  const [reviewComments, setReviewComments] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [walletCheckDialog, setWalletCheckDialog] = useState(false);
  const [walletStatus, setWalletStatus] = useState({});
  const accessToken = localStorage.getItem('accessToken');

  // Fetch milestones when modal opens
  useEffect(() => {
    if (open && jobId) {
      fetchMilestones();
    }
  }, [open, jobId]);

  const fetchMilestones = async () => {
    try {
      const response = await axios.get(`${BAPI}/api/v0/chats/job-deliverables-overview/${jobId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      
      const deliverablesWithMilestones = response.data.deliverables || [];
      const milestonesData = deliverablesWithMilestones
        .filter(item => item.milestone)
        .map(item => ({
          ...item.milestone,
          deliverable: item.deliverable,
          payment_amount: item.payment_amount,
          payment_status: item.payment_status
        }));
      
      setMilestones(milestonesData);
      
      // Check wallet status for each milestone
      await checkWalletStatusForAllMilestones(milestonesData);
    } catch (error) {
      console.error('Error fetching milestones:', error);
    }
  };

  const checkWalletStatusForAllMilestones = async (milestonesData) => {
    const statuses = {};
    for (const milestone of milestonesData) {
      try {
        const response = await axios.get(
          `${BAPI}/api/v0/chats/check-wallet-for-milestone/${jobId}/${milestone.deliverable_number}`,
          {
            headers: { Authorization: `Bearer ${accessToken}` }
          }
        );
        statuses[milestone.id] = response.data.has_sufficient_balance;
      } catch (error) {
        statuses[milestone.id] = false;
      }
    }
    setWalletStatus(statuses);
  };

  const handleReview = async (milestoneId, action) => {
    if (action === 'APPROVE' && !walletStatus[milestoneId]) {
      setWalletCheckDialog(true);
      return;
    }

    if (action === 'APPROVE' && !reviewComments.trim()) {
      toast.error('Please provide review comments when approving a milestone');
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(`${BAPI}/api/v0/chats/review-milestone`, {
        milestone_id: milestoneId,
        action: action,
        review_comments: reviewComments.trim()
      }, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      
      toast.success(`Milestone ${action.toLowerCase()}ed successfully!`);
      setReviewComments('');
      fetchMilestones();
      onMilestoneReviewed();
      
    } catch (error) {
      console.error('Error reviewing milestone:', error);
      if (error.response?.status === 400) {
        toast.error(error.response.data.detail || 'Failed to review milestone');
      } else {
        toast.error('An error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'APPROVED': return 'success';
      case 'REJECTED': return 'error';
      case 'PENDING': return 'warning';
      default: return 'default';
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'PAID': return 'success';
      case 'PENDING': return 'warning';
      case 'REJECTED': return 'error';
      default: return 'default';
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const handleClose = () => {
    setReviewComments('');
    setSelectedMilestone(null);
    onClose();
  };

  return (
    <>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="milestone-reviewer-modal"
        aria-describedby="Review and approve milestones"
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: { xs: '95%', sm: '800px' },
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
              Review Milestones
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
              Review and approve milestones submitted by the freelancer. Each approved milestone will release the corresponding payment.
            </Typography>
          </Alert>

          {/* Milestones List */}
          {milestones.length === 0 ? (
            <Alert severity="warning">
              No milestones have been submitted yet. The freelancer will submit milestones as they complete deliverables.
            </Alert>
          ) : (
            <Grid container spacing={2}>
              {milestones.map((milestone) => (
                <Grid item xs={12} key={milestone.id}>
                  <Card 
                    sx={{ 
                      border: milestone.status === 'PENDING' ? '2px solid #ff9800' : '1px solid #e0e0e0',
                      opacity: milestone.status === 'PENDING' && !walletStatus[milestone.id] ? 0.6 : 1
                    }}
                  >
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Box>
                          <Typography variant="h6" sx={{ mb: 1 }}>
                            Deliverable {milestone.deliverable_number}: {milestone.title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            {milestone.description}
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                            <Chip 
                              label={milestone.status} 
                              color={getStatusColor(milestone.status)}
                              size="small"
                            />
                            <Chip 
                              label={milestone.payment_status} 
                              color={getPaymentStatusColor(milestone.payment_status)}
                              size="small"
                            />
                            <Chip 
                              label={formatCurrency(milestone.payment_amount)} 
                              color="primary"
                              variant="outlined"
                              size="small"
                            />
                          </Box>
                        </Box>
                        
                        {milestone.status === 'PENDING' && (
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <Button
                              variant="outlined"
                              size="small"
                              startIcon={<IoEye />}
                              onClick={() => setSelectedMilestone(milestone)}
                            >
                              View
                            </Button>
                            <Button
                              variant="contained"
                              color="success"
                              size="small"
                              startIcon={<IoCheckmark />}
                              disabled={!walletStatus[milestone.id] || isLoading}
                              onClick={() => handleReview(milestone.id, 'APPROVE')}
                            >
                              Approve
                            </Button>
                            <Button
                              variant="contained"
                              color="error"
                              size="small"
                              startIcon={<IoCloseCircle />}
                              disabled={isLoading}
                              onClick={() => handleReview(milestone.id, 'REJECT')}
                            >
                              Reject
                            </Button>
                          </Box>
                        )}
                      </Box>

                      {/* Wallet Warning */}
                      {milestone.status === 'PENDING' && !walletStatus[milestone.id] && (
                        <Alert severity="warning" sx={{ mt: 2 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <IoWallet />
                            <Typography variant="body2">
                              Insufficient wallet balance to approve this milestone. 
                              Please recharge your wallet to proceed.
                            </Typography>
                          </Box>
                        </Alert>
                      )}

                      {/* Submission Link */}
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                          <strong>Submission:</strong>{' '}
                          <Link href={milestone.submission_link} target="_blank" rel="noopener">
                            View Work
                          </Link>
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}

          {/* Review Comments Input */}
          {selectedMilestone && (
            <Box sx={{ mt: 3, p: 3, bgcolor: 'grey.50', borderRadius: 1 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Review Comments for: {selectedMilestone.title}
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Review Comments"
                value={reviewComments}
                onChange={(e) => setReviewComments(e.target.value)}
                placeholder="Provide feedback, suggestions, or approval comments..."
                helperText="Comments are required when approving milestones"
              />
              <Box sx={{ display: 'flex', gap: 2, mt: 2, justifyContent: 'flex-end' }}>
                <Button
                  variant="outlined"
                  onClick={() => setSelectedMilestone(null)}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  color="success"
                  disabled={!reviewComments.trim() || isLoading}
                  onClick={() => handleReview(selectedMilestone.id, 'APPROVE')}
                >
                  Approve with Comments
                </Button>
              </Box>
            </Box>
          )}
        </Box>
      </Modal>

      {/* Wallet Check Dialog */}
      <Dialog open={walletCheckDialog} onClose={() => setWalletCheckDialog(false)}>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IoWallet color="orange" />
            Insufficient Wallet Balance
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography>
            You don't have sufficient balance in your wallet to approve this milestone. 
            Please recharge your wallet to continue.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setWalletCheckDialog(false)}>
            Close
          </Button>
          <Button 
            variant="contained" 
            onClick={() => {
              setWalletCheckDialog(false);
              // Redirect to wallet page or show recharge modal
              toast.info('Please recharge your wallet to approve milestones');
            }}
          >
            Recharge Wallet
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default MilestoneReviewer;


