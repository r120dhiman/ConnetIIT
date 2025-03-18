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
  SelectChangeEvent,
  useTheme,
  useMediaQuery,
  SwipeableDrawer
} from '@mui/material';
import { Plus, MessageCircle, ArrowLeft } from 'lucide-react';
import { addParticipantToTrip, createTrip, getTrips } from '../lib/appwrite/trip';
import { useAuth } from '../contexts/AuthContext';
import { getProfile } from '../lib/appwrite/users';
import { getRoomChats, sendRoomChat, subscribeToRoomChats } from '../lib/appwrite/roomChat';
import { Header } from '../components/layout/Header';
import { toast } from 'react-toastify'; // Import toast

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

  const muiTheme = useTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const colors = {
    primary: {
      main: '#6366f1',
      light: '#818cf8',
      dark: '#4f46e5',
      contrast: '#ffffff'
    },
    secondary: {
      main: '#f43f5e',
      light: '#fb7185',
      dark: '#e11d48',
      contrast: '#ffffff'
    },
    background: {
      default: '#f9fafb',
      paper: '#ffffff',
      alt: '#f3f4f6',
    },
    text: {
      primary: '#1f2937',
      secondary: '#4b5563',
      muted: '#9ca3af',
    },
    success: {
      light: '#dcfce7',
      main: '#22c55e',
    }
  };

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

  useEffect(() => {
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

  useEffect(() => {
    if (selectedTrip && isMobile) {
      setIsDrawerOpen(true);
    }
  }, [selectedTrip, isMobile]);

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
      toast.error('Please fill in all required fields.'); // Use toast for error
      return;
    }
    if (newTrip.date < today) {
      toast.error("Date cannot be in the past."); // Use toast for error
      return;
    }

    try {
      // Create trip with the user as both creator and participant
      const tripData = {
        ...newTrip,
        createdBy: user.$id,
        date: new Date(newTrip.date),
        participants: [user.$id] // Ensure user is in participants array
      };

      const createdTrip = await createTrip(tripData);
      
      // Update local state with the new trip
      setTrips(prev => [...prev, {
        ...tripData,
        id: createdTrip.$id,
        createdBy: 'Me', // Display 'Me' for the current user
        date: tripData.date.toISOString().split('T')[0]
      }]);

      // Reset form
      setNewTrip({
        tripName: '',
        description: '',
        from: '',
        to: '',
        date: '',
        isFlexibleDate: false,
        createdBy: user.$id,
        modeOfTravel: '',
        participants: [user.$id],
      });
      handleClose();
      toast.success('Trip created successfully!'); // Use toast for success
    } catch (error) {
      console.error('Error creating trip:', error);
      toast.error('Failed to create trip. Please try again.'); // Use toast for error
    }
  };

  const handleJoinTrip = async (tripId: string) => {
    if (!user) return;

    try {
      await addParticipantToTrip(tripId, user.$id);
      
      // Update the local state immediately to reflect the change
      setTrips(prevTrips => prevTrips.map(trip => {
        if (trip.id === tripId) {
          return {
            ...trip,
            participants: [...trip.participants, user.$id] // Add the new participant
          };
        }
        return trip;
      }));

      // Optional: Update the selected trip if it's the one being joined
      if (selectedTrip?.id === tripId) {
        setSelectedTrip(prev => prev ? {
          ...prev,
          participants: [...prev.participants, user.$id]
        } : null);
      }

      toast.success('Successfully joined the trip!'); // Use toast for success
    } catch (error) {
      console.error('Error joining trip:', error);
      toast.error('Failed to join trip. Please try again.'); // Use toast for error
    }
  };

  const handleSendTripMessage = async () => {
    if (!selectedTrip || !newTripMessage.trim() || !user) return;

    try {
      await sendRoomChat(selectedTrip.id, newTripMessage, user.$id);
      setNewTripMessage('');
      toast.success('Message sent!'); // Use toast for success
    } catch (error) {
      console.error('Error sending trip message:', error);
      toast.error('Failed to send message.'); // Use toast for error
    }
  };

  return (
    <Box sx={{ 
      height: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      backgroundColor: colors.background.default
    }}>
      <Header />
      
      <Box sx={{ 
        flex: 1, 
        display: 'flex', 
        gap: 3, 
        p: { xs: 2, md: 4 },
        height: 'calc(100vh - 64px)',
        maxWidth: '1800px',
        margin: '0 auto',
        width: '100%',
        flexDirection: { xs: 'column', md: 'row' }
      }}>
        {/* Left Side - Trips List */}
        <Box sx={{ 
          flex: { xs: 1, md: '0 0 45%' },
          overflowY: 'auto',
          backgroundColor: colors.background.paper,
          borderRadius: '16px',
          p: { xs: 2, md: 3 },
          boxShadow: '0 4px 6px -1px rgb(99 102 241 / 0.1)'
        }}>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            mb: 4
          }}>
            <Typography variant="h5" sx={{ 
              fontWeight: '600',
              color: colors.text.primary,
              background: `linear-gradient(120deg, ${colors.primary.main}, ${colors.secondary.main})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              Your Trips
                    </Typography>
                    <Button 
                      variant="contained" 
              startIcon={<Plus size={18} />}
              onClick={handleOpen}
              sx={{
                borderRadius: '12px',
                textTransform: 'none',
                bgcolor: colors.primary.main,
                '&:hover': { 
                  bgcolor: colors.primary.dark,
                  boxShadow: `0 0 20px ${colors.primary.main}40`
                }
              }}
            >
              New Trip
                    </Button>
          </Box>

          <Grid container spacing={2}>
            {trips.map((trip, index) => (
              <Grid item xs={12} key={index}>
                <Card 
                  variant="outlined" 
                  sx={{ 
                    border: 'none',
                    borderRadius: '12px',
                    backgroundColor: selectedTrip?.id === trip.id 
                      ? `${colors.primary.main}10`
                      : trip.createdBy === 'Me' 
                      ? colors.success.light
                      : colors.background.paper,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: selectedTrip?.id === trip.id
                      ? `0 0 0 2px ${colors.primary.main}`
                      : '0 1px 3px 0 rgb(0 0 0 / 0.1)',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: `0 10px 15px -3px ${colors.primary.main}20`
                    }
                  }}
                  onClick={() => setSelectedTrip(trip)}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" sx={{ 
                      fontWeight: '600',
                      color: colors.text.primary,
                      mb: 1
                    }}>
                      {trip.tripName}
                    </Typography>
                    <Typography sx={{ 
                      color: colors.text.secondary,
                      mb: 2,
                      fontSize: '0.95rem'
                    }}>
                      {trip.description}
                    </Typography>
                    
                    <Box sx={{ 
                      display: 'flex', 
                      gap: 3,
                      mb: 2,
                      color: colors.text.muted
                    }}>
                      <Box>
                        <Typography variant="caption" sx={{ color: colors.text.muted }}>
                          From
                        </Typography>
                        <Typography sx={{ fontWeight: '500' }}>{trip.from}</Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" sx={{ color: colors.text.muted }}>
                          To
                        </Typography>
                        <Typography sx={{ fontWeight: '500' }}>{trip.to}</Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" sx={{ color: colors.text.muted }}>
                          Date
                        </Typography>
                        <Typography sx={{ fontWeight: '500' }}>{trip.date}</Typography>
                      </Box>
                    </Box>

                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <Box sx={{ 
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1
                      }}>
                        <Typography sx={{ 
                          fontSize: '0.875rem',
                          color: colors.text.muted
                        }}>
                          Created by <span style={{ fontWeight: '500' }}>{trip.createdBy}</span>
                        </Typography>
                        <Box sx={{ 
                          display: 'flex',
                          alignItems: 'center',
                          gap: 0.5,
                          backgroundColor: colors.background.alt,
                          px: 1.5,
                          py: 0.5,
                          borderRadius: 'full',
                          fontSize: '0.875rem'
                        }}>
                          <span>👥</span> {trip.participants.length}
                        </Box>
                      </Box>
                      
                      {trip.createdBy !== 'Me' && !trip.participants?.includes(user!.$id) && (
                        <Button 
                          variant="outlined"
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleJoinTrip(trip.id);
                          }}
                          sx={{ 
                            borderRadius: '10px',
                            textTransform: 'none',
                            borderColor: colors.primary.main,
                            color: colors.primary.main,
                            '&:hover': {
                              borderColor: colors.primary.dark,
                              backgroundColor: `${colors.primary.main}10`
                            }
                          }}
                        >
                          Join Trip
                </Button>
                      )}
                    </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
        </Box>

        {/* Desktop Chat Section */}
        {!isMobile && (
          <Box sx={{ 
            flex: '0 0 55%',
            backgroundColor: colors.background.paper,
            borderRadius: '16px',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 4px 6px -1px rgb(99 102 241 / 0.1)'
          }}>
            {selectedTrip ? (
              <>
                <Box sx={{ 
                  p: 3,
                  borderBottom: `1px solid ${colors.background.alt}`,
                  background: `linear-gradient(to right, ${colors.primary.main}05, ${colors.primary.main}10)`
                }}>
                  <Typography variant="h5" sx={{ 
                    fontWeight: '600',
                    color: colors.text.primary,
                  }}>
                    {selectedTrip.tripName}
                  </Typography>
                  <Typography sx={{ color: colors.text.secondary, mt: 0.5 }}>
                    Trip Discussion
                  </Typography>
                </Box>
                
                <Box sx={{ 
                  flex: 1, 
                  overflowY: 'auto',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2,
                  p: 3,
                  backgroundColor: colors.background.default
                }}>
                  {tripMessages.map((msg, index) => (
                    <Box key={index} sx={{
                      alignSelf: msg.userId === user?.$id ? 'flex-end' : 'flex-start',
                      maxWidth: '70%',
                      backgroundColor: msg.userId === user?.$id 
                        ? colors.primary.main
                        : colors.background.paper,
                      color: msg.userId === user?.$id 
                        ? colors.primary.contrast
                        : colors.text.primary,
                      p: 2.5,
                      borderRadius: '16px',
                      boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)'
                    }}>
                      <Typography sx={{ 
                        color: msg.userId === user?.$id 
                          ? colors.primary.contrast
                          : colors.text.primary 
                      }}>
                        {msg.content}
                      </Typography>
                      <Typography variant="caption" sx={{ 
                        color: msg.userId === user?.$id 
                          ? `${colors.primary.contrast}80`
                          : colors.text.muted,
                        display: 'block',
                        mt: 1
                      }}>
                        {new Date(msg.$createdAt).toLocaleTimeString()}
                      </Typography>
                    </Box>
                  ))}
                </Box>

                <Box sx={{ 
                  p: 3,
                  borderTop: `1px solid ${colors.background.alt}`,
                  backgroundColor: colors.background.paper
                }}>
                  <Box sx={{ 
                    display: 'flex',
                    gap: 2,
                    backgroundColor: colors.background.alt,
                    p: 1,
                    borderRadius: '12px'
                  }}>
                    <TextField
                      value={newTripMessage}
                      onChange={(e) => setNewTripMessage(e.target.value)}
                      placeholder="Type your message..."
                      fullWidth
                      multiline
                      maxRows={4}
                      variant="standard"
                      InputProps={{
                        disableUnderline: true,
                      }}
                      sx={{ 
                        px: 2,
                        '& .MuiInputBase-input': {
                          py: 1.5,
                          color: colors.text.primary
                        }
                      }}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendTripMessage();
                        }
                      }}
                    />
                    <Button 
                      onClick={handleSendTripMessage}
                      disabled={!newTripMessage.trim()}
                      sx={{
                        borderRadius: '10px',
                        px: 3,
                        textTransform: 'none',
                        bgcolor: colors.primary.main,
                        color: colors.primary.contrast,
                        '&:hover': {
                          bgcolor: colors.primary.dark
                        },
                        '&.Mui-disabled': {
                          bgcolor: colors.text.muted
                        }
                      }}
                    >
                      Send
                    </Button>
                  </Box>
                </Box>
              </>
            ) : (
              <Box sx={{ 
                display: 'flex', 
                height: '100%',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                gap: 2,
                color: colors.text.muted
              }}>
                <MessageCircle size={48} />
                <Typography>
                  Select a trip to view the discussion
                </Typography>
              </Box>
            )}
          </Box>
        )}

        {/* Mobile Chat Drawer */}
        {isMobile && (
          <SwipeableDrawer
            anchor="bottom"
            open={isDrawerOpen && selectedTrip !== null}
            onClose={() => {
              setIsDrawerOpen(false);
            }}
            onOpen={() => setIsDrawerOpen(true)}
            swipeAreaWidth={56}
            disableSwipeToOpen={false}
            ModalProps={{
              keepMounted: true,
            }}
            PaperProps={{
              sx: {
                height: '90vh',
                borderTopLeftRadius: '20px',
                borderTopRightRadius: '20px',
                overflow: 'visible',
                backgroundColor: colors.background.paper,
              }
            }}
          >
            {/* Drawer Handle */}
            <Box
              sx={{
                position: 'absolute',
                top: -20,
                left: '50%',
                transform: 'translateX(-50%)',
                height: '4px',
                width: '40px',
                borderRadius: '2px',
                backgroundColor: colors.text.muted,
                my: 1
              }}
            />
            
            {selectedTrip ? (
              <>
                <Box sx={{ 
                  p: 2,
                  borderBottom: `1px solid ${colors.background.alt}`,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  position: 'sticky',
                  top: 0,
                  backgroundColor: colors.background.paper,
                  zIndex: 1
                }}>
                  <Button
                    startIcon={<ArrowLeft />}
                    onClick={() => {
                      setIsDrawerOpen(false);
                      setTimeout(() => setSelectedTrip(null), 300);
                    }}
                    sx={{
                      minWidth: 'auto',
                      p: 1,
                      color: colors.text.primary
                    }}
                  />
                  <Box>
                    <Typography variant="h6" sx={{ 
                      fontWeight: '600',
                      color: colors.text.primary,
                    }}>
                      {selectedTrip.tripName}
                    </Typography>
                    <Typography sx={{ color: colors.text.secondary }}>
                      Trip Discussion
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ 
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  height: 'calc(90vh - 140px)',
                  position: 'relative'
                }}>
                  <Box sx={{ 
                    flex: 1, 
                    overflowY: 'auto',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    p: 2,
                    backgroundColor: colors.background.default
                  }}>
                    {tripMessages.map((msg, index) => (
                      <Box key={index} sx={{
                        alignSelf: msg.userId === user?.$id ? 'flex-end' : 'flex-start',
                        maxWidth: '70%',
                        backgroundColor: msg.userId === user?.$id 
                          ? colors.primary.main
                          : colors.background.paper,
                        color: msg.userId === user?.$id 
                          ? colors.primary.contrast
                          : colors.text.primary,
                        p: 2.5,
                        borderRadius: '16px',
                        boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)'
                      }}>
                        <Typography sx={{ 
                          color: msg.userId === user?.$id 
                            ? colors.primary.contrast
                            : colors.text.primary 
                        }}>
                          {msg.content}
                        </Typography>
                        <Typography variant="caption" sx={{ 
                          color: msg.userId === user?.$id 
                            ? `${colors.primary.contrast}80`
                            : colors.text.muted,
                          display: 'block',
                          mt: 1
                        }}>
                          {new Date(msg.$createdAt).toLocaleTimeString()}
                        </Typography>
                      </Box>
                    ))}
                  </Box>

                  <Box sx={{ 
                    p: 2,
                    borderTop: `1px solid ${colors.background.alt}`,
                    backgroundColor: colors.background.paper,
                    position: 'sticky',
                    bottom: 0,
                    zIndex: 1
                  }}>
                    <Box sx={{ 
                      display: 'flex',
                      gap: 2,
                      backgroundColor: colors.background.alt,
                      p: 1,
                      borderRadius: '12px'
                    }}>
                      <TextField
                        value={newTripMessage}
                        onChange={(e) => setNewTripMessage(e.target.value)}
                        placeholder="Type your message..."
                        fullWidth
                        multiline
                        maxRows={4}
                        variant="standard"
                        InputProps={{
                          disableUnderline: true,
                        }}
                        sx={{ 
                          px: 2,
                          '& .MuiInputBase-input': {
                            py: 1.5,
                            color: colors.text.primary
                          }
                        }}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSendTripMessage();
                          }
                        }}
                      />
                      <Button 
                        onClick={handleSendTripMessage}
                        disabled={!newTripMessage.trim()}
                        sx={{
                          borderRadius: '10px',
                          px: 3,
                          textTransform: 'none',
                          bgcolor: colors.primary.main,
                          color: colors.primary.contrast,
                          '&:hover': {
                            bgcolor: colors.primary.dark
                          },
                          '&.Mui-disabled': {
                            bgcolor: colors.text.muted
                          }
                        }}
                      >
                        Send
                      </Button>
                    </Box>
                  </Box>
                </Box>
              </>
            ) : (
              <Box sx={{ 
                display: 'flex', 
                height: '100%',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                gap: 2,
                color: colors.text.muted
              }}>
                <MessageCircle size={48} />
                <Typography>
                  Select a trip to view the discussion
                </Typography>
              </Box>
            )}
          </SwipeableDrawer>
        )}
      </Box>

      {/* Create Trip Dialog */}
      <Dialog 
        open={open} 
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
        sx={{ 
          '& .MuiDialog-paper': { 
            borderRadius: { xs: '20px 20px 0 0', md: '20px' },
            m: { xs: 0, md: 2 },
            position: { xs: 'fixed', md: 'relative' },
            bottom: { xs: 0, md: 'auto' },
            width: { xs: '100%', md: '600px' },
            height: { xs: '100%', md: 'auto' },
            maxHeight: { xs: '100%', md: '90vh' },
            overflow: 'hidden',
          }
        }}
      >
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          overflow: 'hidden',
        }}>
          {/* Fixed Header */}
          <DialogTitle sx={{
            p: 3,
            background: `linear-gradient(120deg, ${colors.primary.main}15, ${colors.primary.main}25)`,
            borderBottom: `1px solid ${colors.background.alt}`,
            position: 'sticky',
            top: 0,
            zIndex: 2,
          }}>
            <Typography variant="h5" sx={{ 
              fontWeight: '600',
              color: colors.text.primary,
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}>
              <Plus size={24} />
              Create New Trip
            </Typography>
          </DialogTitle>

          {/* Scrollable Content */}
          <DialogContent 
            sx={{ 
              flex: 1,
              p: 3,
              overflowY: 'auto !important',
              WebkitOverflowScrolling: 'touch',
              '&::-webkit-scrollbar': {
                width: '8px',
                display: { xs: 'none', md: 'block' }
              },
              '&::-webkit-scrollbar-track': {
                background: colors.background.default,
              },
              '&::-webkit-scrollbar-thumb': {
                background: colors.text.muted,
                borderRadius: '4px',
              },
              '&::-webkit-scrollbar-thumb:hover': {
                background: colors.text.secondary,
              },
              padding: '24px !important',
            }}
          >
            <Box  sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: 3,
              pb: { xs: 4, md: 2 }
            }} >
              {/* Basic Details Section */}
              <Box>
                <Typography variant="subtitle2" sx={{ 
                  color: colors.text.secondary,
                  mb: 2,
                  fontWeight: 500
                }}>
                  Basic Details
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <TextField
                    label="Trip Name"
                    name="tripName"
                    value={newTrip.tripName}
                    onChange={handleInputChange}
                    fullWidth
                    required
                    variant="outlined"
                    placeholder="Enter a memorable name for your trip"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        backgroundColor: colors.background.default,
                        '&:hover': {
                          backgroundColor: colors.background.alt,
                        },
                        '&.Mui-focused': {
                          backgroundColor: colors.background.paper,
                        }
                      }
                    }}
                  />
                  <TextField
                    label="Description"
                    name="description"
                    value={newTrip.description}
                    onChange={handleInputChange}
                    multiline
                    rows={3}
                    fullWidth
                    placeholder="Describe your trip plans..."
                    variant="outlined"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        backgroundColor: colors.background.default,
                        '&:hover': {
                          backgroundColor: colors.background.alt,
                        },
                        '&.Mui-focused': {
                          backgroundColor: colors.background.paper,
                        }
                      }
                    }}
                  />
                </Box>
              </Box>

              {/* Location Section */}
              <Box>
                <Typography variant="subtitle2" sx={{ 
                  color: colors.text.secondary,
                  mb: 2,
                  fontWeight: 500
                }}>
                  Location Details
                </Typography>
                <Box sx={{ 
                  display: 'grid', 
                  gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                  gap: 2
                }}>
                  <TextField
                    label="From"
                    name="from"
                    value={newTrip.from}
                    onChange={handleInputChange}
                    fullWidth
                    variant="outlined"
                    placeholder="Starting point"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        backgroundColor: colors.background.default,
                      }
                    }}
                  />
                  <TextField
                    label="To"
                    name="to"
                    value={newTrip.to}
                    onChange={handleInputChange}
                    fullWidth
                    variant="outlined"
                    placeholder="Destination"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        backgroundColor: colors.background.default,
                      }
                    }}
                  />
                </Box>
              </Box>

              {/* Date Section */}
              <Box>
                <Typography variant="subtitle2" sx={{ 
                  color: colors.text.secondary,
                  mb: 2,
                  fontWeight: 500
                }}>
                  Date & Flexibility
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
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
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        backgroundColor: colors.background.default,
                      }
                    }}
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        name="isFlexibleDate"
                        checked={newTrip.isFlexibleDate}
                        onChange={handleInputChange}
                        sx={{ 
                          '&.Mui-checked': { 
                            color: colors.primary.main 
                          }
                        }}
                      />
                    }
                    label={
                      <Typography sx={{ color: colors.text.secondary }}>
                        Dates are flexible
                      </Typography>
                    }
                  />
                </Box>
              </Box>

              {/* Travel Mode Section */}
              <Box>
                <Typography variant="subtitle2" sx={{ 
                  color: colors.text.secondary,
                  mb: 2,
                  fontWeight: 500
                }}>
                  Mode of Travel
                </Typography>
                <FormControl fullWidth>
                  {/* <InputLabel id="mode-of-travel-label">Mode of Travel</InputLabel> */}
                  <Select
                    labelId="mode-of-travel-label"
                    name="modeOfTravel"
                    value={newTrip.modeOfTravel}
                    onChange={handleInputChange}
                    displayEmpty
                    sx={{
                      borderRadius: 2,
                      backgroundColor: colors.background.default,
                      '& .MuiSelect-select': {
                        py: 1.5,
                      },
                      '& .MuiMenu-paper': {
                        maxHeight: '40vh',
                      }
                    }}
                    MenuProps={{
                      PaperProps: {
                        sx: {
                          maxHeight: '40vh',
                          mt: 1,
                        }
                      },
                      style: {
                        maxHeight: '40vh',
                      }
                    }}
                  >
                    <MenuItem disabled value="">
                      <em>Select travel mode</em>
                    </MenuItem>
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
                    sx={{
                      mt: 2,
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        backgroundColor: colors.background.default,
                      }
                    }}
                  />
                )}
              </Box>
            </Box>
          </DialogContent>

          {/* Fixed Footer */}
          <DialogActions sx={{ 
            p: 3,
            borderTop: `1px solid ${colors.background.alt}`,
            gap: 2,
            position: 'sticky',
            bottom: 0,
            backgroundColor: colors.background.paper,
            zIndex: 2,
            mt: 'auto',
            boxShadow: '0 -4px 6px -1px rgba(0, 0, 0, 0.05)'
          }}>
            <Button 
              onClick={handleClose} 
              variant="outlined" 
              sx={{ 
                borderRadius: 2,
                borderColor: colors.text.muted,
                color: colors.text.secondary,
                '&:hover': {
                  borderColor: colors.text.primary,
                  backgroundColor: colors.background.alt
                }
              }}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit} 
              variant="contained" 
              startIcon={<Plus />}
              sx={{ 
                borderRadius: 2,
                bgcolor: colors.primary.main,
                '&:hover': {
                  bgcolor: colors.primary.dark
                },
                px: 3
              }}
            >
              Create Trip
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </Box>
  );
};

export default Trips;
