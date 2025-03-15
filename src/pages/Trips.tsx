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
import { Plus, MessageCircle } from 'lucide-react';
import { addParticipantToTrip, createTrip, getTrips } from '../lib/appwrite/trip';
import { useAuth } from '../contexts/AuthContext';
import { getProfile } from '../lib/appwrite/users';
import { getRoomChats, sendRoomChat, subscribeToRoomChats } from '../lib/appwrite/roomChat';
import { Header } from '../components/layout/Header';

interface Trip {
  tripName: string;
  description: string;
  from: string;
  to: string;
  date: string;
  isFlexibleDate: boolean;
  createdBy: string;
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
  createdBy: string;
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
    createdBy: user ? user.$id : '',
    modeOfTravel: '',
    participants: [user!.$id]
  });
  const [selectedTrip, setSelectedTrip] = useState<FetchedTrip | null>(null);
  const [tripMessages, setTripMessages] = useState<any[]>([]);
  const [isTripChatOpen, setIsTripChatOpen] = useState(false);
  const [newTripMessage, setNewTripMessage] = useState('');

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
            createdBy: trip.createdBy === user?.$id ? 'Me' : userProfile.name,
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

  useEffect(() => {
    if (selectedTrip) {
      const fetchTripChats = async () => {
        const messages = await getRoomChats(selectedTrip.id);
        setTripMessages(messages);
      };

      fetchTripChats();

      const unsubscribe = subscribeToRoomChats(selectedTrip.id, (newMessage) => {
        setTripMessages(prev => [...prev, newMessage]);
      });

      return () => {
        unsubscribe();
      };
    }
  }, [selectedTrip]);

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
    if (!user) return;

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
        createdBy: user.$id,
        date: new Date(newTrip.date)
      });
      setTrips(prev => [...prev, { ...newTrip, id: createdTrip.$id }]);

      setNewTrip({
        tripName: '',
        description: '',
        from: '',
        to: '',
        date: '',
        isFlexibleDate: false,
        createdBy: user ? user.$id : '',
        modeOfTravel: '',
        participants: [user.$id],
      });
      handleClose();
    } catch (error) {
      console.error('Error creating trip:', error);
      alert('Failed to create trip. Please try again.');
    }
  };

  const handleJoinTrip = async (tripId: string) => {
    if (!user) return;

    try {
      await addParticipantToTrip(tripId, user.$id);
      console.log(`User with ID: ${user.$id} joined trip with ID: ${tripId}`);
    } catch (error) {
      console.error('Error joining trip:', error);
      alert('Failed to join trip. Please try again.');
    }
  };

  const handleSendTripMessage = async () => {
    if (!selectedTrip || !newTripMessage.trim() || !user) return;

    try {
      await sendRoomChat(selectedTrip.id, newTripMessage, user.$id);
      setNewTripMessage('');
    } catch (error) {
      console.error('Error sending trip message:', error);
    }
  };

  return (
    <Box sx={{ padding: 3, position: 'relative', minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <Header/>
      <Typography variant="h4" gutterBottom align="center" color="primary" sx={{ fontWeight: 'bold' }}>
        Explore Your Trips
      </Typography>

      <Grid container spacing={3}>
        {trips.map((trip, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card variant="outlined" sx={{ 
              boxShadow: 1, 
              borderRadius: 2, 
              backgroundColor: trip.createdBy === 'Me' ? '#d1e7dd' : 'white'
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
                <Typography>Participants: <strong>{trip.participants.length}</strong></Typography>
                {trip.createdBy !== 'Me' && (
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
                <Button 
                  variant="outlined" 
                  color="secondary" 
                  startIcon={<MessageCircle />} 
                  onClick={() => {
                    setSelectedTrip(trip);
                    setIsTripChatOpen(true);
                  }}
                  sx={{ marginTop: 2 }}
                >
                  Chat about this trip
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Fab
        color="primary"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
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

      {isTripChatOpen && selectedTrip && (
        <Dialog open={isTripChatOpen} onClose={() => setIsTripChatOpen(false)} sx={{ borderRadius: 2 }}>
          <DialogTitle sx={{ backgroundColor: '#f5f5f5', fontWeight: 'bold' }}>{selectedTrip.tripName} Chat</DialogTitle>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', padding: 2 }}>
            <div style={{ maxHeight: '300px', overflowY: 'auto', marginBottom: '16px' }}>
              {tripMessages.map((msg, index) => (
                <Typography key={index} sx={{ padding: 1, borderRadius: 1, backgroundColor: '#e3f2fd', marginBottom: 1 }}>
                  {msg.content}
                </Typography>
              ))}
            </div>
            <TextField
              value={newTripMessage}
              onChange={(e) => setNewTripMessage(e.target.value)}
              placeholder="Type a message..."
              fullWidth
              variant="outlined"
              sx={{ backgroundColor: '#fff', borderRadius: 1 }}
            />
          </DialogContent>
          <DialogActions sx={{ justifyContent: 'space-between' }}>
            <Button onClick={() => setIsTripChatOpen(false)} color="secondary" variant="outlined" sx={{ borderRadius: 1 }}>Close</Button>
            <Button onClick={handleSendTripMessage} variant="contained" color="primary" sx={{ borderRadius: 1 }}>
              Send
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
};

export default Trips;

