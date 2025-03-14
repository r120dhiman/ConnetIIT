import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Fab,
  Grid,
  TextField,
  Typography,
  FormControlLabel,
  Checkbox,
  MenuItem,
  FormControl,
  Select,
  InputLabel,
  SelectChangeEvent
} from '@mui/material';
import { Plus } from 'lucide-react';
import { addParticipantToTrip, createTrip, getTrips } from '../lib/appwrite/trip';
import { useAuth } from '../contexts/AuthContext';
import { getProfile } from '../lib/appwrite/users';

interface Trip {
  tripName: string;
  description: string;
  from: string;
  to: string;
  date: string;
  isFlexibleDate: boolean;
  createdBy: string; // This will be filled automatically
  modeOfTravel: string;
  participants: string[];
}

interface FetchedTrip {
  id: string;
  tripName: string;
  description: string;
  from: string;
  to: string;
  date: string;
  isFlexibleDate: boolean;
  createdBy: string; // This will be filled automatically
  modeOfTravel: string;
  participants: string[];
}

const Trips: React.FC = () => {
  const { user } = useAuth();
  
  const [trips, setTrips] = useState<FetchedTrip[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [newTrip, setNewTrip] = useState<Trip>({
    tripName: '',
    description: '',
    from: '',
    to: '',
    date: '',
    isFlexibleDate: false,
    createdBy: user ? user.$id : '', // Automatically set createdBy to user ID
    modeOfTravel: '',
    participants: [user!.$id]
  });

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const fetchedTrips = await getTrips();
        const mappedTrips = await Promise.all(fetchedTrips.map(async trip => {
          const userProfile = await getProfile(trip.createdBy);
          return {
            id: trip.$id,
            tripName: trip.tripName,
            description: trip.description,
            from: trip.from,
            to: trip.to,
            date: trip.date,
            isFlexibleDate: trip.isFlexibleDate,
            createdBy: trip.createdBy === user?.$id ? 'Me' : userProfile.name, // Set createdBy to 'Me' if created by current user
            modeOfTravel: trip.modeOfTravel,
            participants: trip.participants
          };
        }));
        setTrips(mappedTrips);
      } catch (error) {
        console.error('Error fetching trips:', error);
      }
    };

    fetchTrips();
  }, [user]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>
  ) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setNewTrip(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async () => {
    if (!user) return; // Only proceed if user exists

    const today = new Date().toISOString().split('T')[0];
    if (!newTrip.tripName || !newTrip.date) {
      alert('Please fill in all required fields.');
      return;
    }
    if (newTrip.date < today) {
      alert("Date cannot be in the past.");
      return;
    }

    try {
      const createdTrip = await createTrip({
        ...newTrip,
        createdBy: user.$id, // Use actual user ID
        date: new Date(newTrip.date) // Ensure date is in Date format
      });
      setTrips(prev => [...prev, { ...newTrip, id: createdTrip.$id }]);

      setNewTrip({
        tripName: '',
        description: '',
        from: '',
        to: '',
        date: '',
        isFlexibleDate: false,
        createdBy: user ? user.$id : '', // Reset createdBy to user ID
        modeOfTravel: '',
        participants: [user.$id], // Ensure the user is added as a participant
      });
      handleClose();
    } catch (error) {
      console.error('Error creating trip:', error);
      alert('Failed to create trip. Please try again.');
    }
  };

  const handleJoinTrip = async (tripId: string) => {
    if (!user) return; // Ensure user is logged in

    try {
      await addParticipantToTrip(tripId, user.$id); // Add the user as a participant to the trip
      console.log(`User with ID: ${user.$id} joined trip with ID: ${tripId}`);
    } catch (error) {
      console.error('Error joining trip:', error);
      alert('Failed to join trip. Please try again.');
    }
  };

  return (
    <Box sx={{ padding: 3, position: 'relative', minHeight: '100vh', backgroundColor: '#eaeff1' }}>
      <Typography variant="h4" gutterBottom align="center" color="primary" sx={{ fontWeight: 'bold' }}>
        Explore Your Trips
      </Typography>

      <Grid container spacing={3}>
        {trips.map((trip, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card variant="outlined" sx={{ 
              boxShadow: 3, 
              borderRadius: 2, 
              transition: '0.3s', 
              '&:hover': { boxShadow: 6 },
              backgroundColor: trip.createdBy === 'Me' ? '#d1e7dd' : 'white' // Highlight if created by current user
            }}>
              <CardContent>
                <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>{trip.tripName}</Typography>
                <Typography color="textSecondary" sx={{ marginBottom: 1 }}>{trip.description}</Typography>
                <Typography>From: <strong>{trip.from}</strong></Typography>
                <Typography>To: <strong>{trip.to}</strong></Typography>
                <Typography>Date: <strong>{trip.date}</strong></Typography>
                <Typography>Mode of Travel: <strong>{trip.modeOfTravel}</strong></Typography>
                <Typography>Flexible Date: <strong>{trip.isFlexibleDate ? 'Yes' : 'No'}</strong></Typography>
                <Typography>Created By: <strong>{trip.createdBy}</strong></Typography>
                <Typography>Participants: <strong>{trip.participants.length}</strong></Typography> {/* Show number of participants */}
                {trip.createdBy !== 'Me' && ( // Only show Join Trip button if not created by current user
                  trip.participants?.includes(user!.$id) ? (
                    <Typography variant="body2" color="textSecondary" sx={{ marginTop: 2 }}>
                      Status: Joined
                    </Typography>
                  ) : (
                    <Button 
                      variant="contained" 
                      color="primary" 
                      onClick={() => handleJoinTrip(trip.id)} 
                      sx={{ marginTop: 2, borderRadius: 2 }}
                    >
                      Join Trip
                    </Button>
                  )
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Fab
        color="primary"
        sx={{ position: 'fixed', bottom: 16, right: 16, boxShadow: 3 }}
        onClick={handleOpen}
      >
        <Plus size={24} />
      </Fab>

      <Dialog open={open} onClose={handleClose} sx={{ '& .MuiDialog-paper': { borderRadius: 2 } }}>
        <DialogTitle>Create New Trip</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
            <TextField
              label="Trip Name"
              name="tripName"
              value={newTrip.tripName}
              onChange={handleInputChange}
              fullWidth
              required
              variant="outlined"
              sx={{ backgroundColor: '#fff', borderRadius: 1 }}
            />
            <TextField
              label="Description"
              name="description"
              value={newTrip.description}
              onChange={handleInputChange}
              multiline
              rows={3}
              fullWidth
              variant="outlined"
              sx={{ backgroundColor: '#fff', borderRadius: 1 }}
            />
            <TextField
              label="From"
              name="from"
              value={newTrip.from}
              onChange={handleInputChange}
              fullWidth
              variant="outlined"
              sx={{ backgroundColor: '#fff', borderRadius: 1 }}
            />
            <TextField
              label="To"
              name="to"
              value={newTrip.to}
              onChange={handleInputChange}
              fullWidth
              variant="outlined"
              sx={{ backgroundColor: '#fff', borderRadius: 1 }}
            />
            <TextField
              label="Date"
              name="date"
              type="date"
              value={newTrip.date}
              onChange={handleInputChange}
              InputLabelProps={{ shrink: true }}
              fullWidth
              required
              variant="outlined"
              sx={{ backgroundColor: '#fff', borderRadius: 1 }}
            />
            <FormControlLabel
              control={
                <Checkbox
                  name="isFlexibleDate"
                  checked={newTrip.isFlexibleDate}
                  onChange={handleInputChange}
                  sx={{ '&.Mui-checked': { color: 'primary.main' } }}
                />
              }
              label="Flexible Date"
            />
            <FormControl fullWidth>
              <InputLabel>Mode of Travel</InputLabel>
              <Select
                name="modeOfTravel"
                value={newTrip.modeOfTravel}
                onChange={handleInputChange}
                label="Mode of Travel"
                variant="outlined"
                sx={{ backgroundColor: '#fff', borderRadius: 1 }}
              >
                <MenuItem value="Airways">Airways</MenuItem>
                <MenuItem value="Railways">Railways</MenuItem>
                <MenuItem value="Roadways">Roadways</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </Select>
            </FormControl>
            {newTrip.modeOfTravel === 'Other' && (
              <TextField
                label="Specify Other"
                name="modeOfTravel"
                value={newTrip.modeOfTravel}
                onChange={handleInputChange}
                fullWidth
                variant="outlined"
                sx={{ backgroundColor: '#fff', borderRadius: 1 }}
              />
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary" variant="outlined" sx={{ borderRadius: 1 }}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary" startIcon={<Plus />} sx={{ borderRadius: 1 }}>
            Create Trip
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Trips;
