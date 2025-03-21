import React, { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import { motion } from 'framer-motion';

// Collection of interesting facts to display during loading
const loadingFacts = [
  "The first computer bug was an actual bug - a moth found in the Harvard Mark II computer in 1947.",
  "An average person spends 6 months of their lifetime waiting at traffic lights.",
  "There are more possible iterations of a game of chess than there are atoms in the observable universe.",
  "The average person walks the equivalent of five times around the world in their lifetime.",
  "Every day, your heart creates enough energy to drive a truck for 20 miles.",
  "Hawaii moves 7.5cm closer to Alaska every year.",
  "The first message sent over the internet was 'LOG'. The system crashed after 'LO'.",
  "The shortest war in history was between Britain and Zanzibar in 1896. It lasted just 38 minutes.",
  "A day on Venus is longer than a year on Venus.",
  "A group of flamingos is called a 'flamboyance'.",
  "The world's oldest known living tree is over 5,000 years old.",
  "Honey never spoils. Archaeologists have found pots of honey in ancient Egyptian tombs that are over 3,000 years old and still perfectly good to eat.",
  "Cows have best friends and get stressed when they are separated.",
  "Octopuses have three hearts, nine brains, and blue blood.",
  "A bolt of lightning is five times hotter than the surface of the sun.",
  "Every second, your body produces 25 million new cells.",
  "The Great Barrier Reef is the largest living structure on Earth.",
  "A hummingbird weighs less than a penny.",
  "The total weight of all the ants on Earth is greater than the weight of all humans.",
  "The fingerprints of koalas are so similar to humans that they have on occasion been confused at crime scenes."
];

interface LoaderProps {
  message?: string;
  showFacts?: boolean;
  size?: 'small' | 'medium' | 'large';
  fullScreen?: boolean;
}

const Loader: React.FC<LoaderProps> = ({
  message = "Loading...",
  showFacts = true,
  size = 'medium',
  fullScreen = false
}) => {
  const [currentFactIndex, setCurrentFactIndex] = useState(
    Math.floor(Math.random() * loadingFacts.length)
  );

  // Updated colors matching the new theme
  const colors = {
    primary: {
      main: '#4f46e5', // Adjusted primary color for contrast
      light: '#818cf8',
      dark: '#3b3b8c',
      contrast: '#ffffff'
    },
    text: {
      primary: '#ffffff', // Changed to white for better contrast
      secondary: '#e0e0e0', // Lighter gray for secondary text
      muted: '#b0b0b0',
    },
    background: {
      default: '#1B1730', // New background color
      paper: '#2A2635', // Slightly lighter for paper elements
    }
  };

  // Calculate size values
  const getSize = () => {
    switch (size) {
      case 'small': return { spinner: 32, spacing: 1.5 };
      case 'large': return { spinner: 64, spacing: 3 };
      default: return { spinner: 48, spacing: 2 };
    }
  };

  const sizeValues = getSize();

  // Change the fact every 4 seconds
  useEffect(() => {
    if (!showFacts) return;
    
    const interval = setInterval(() => {
      setCurrentFactIndex((prevIndex) => {
        let newIndex;
        do {
          newIndex = Math.floor(Math.random() * loadingFacts.length);
        } while (newIndex === prevIndex && loadingFacts.length > 1);
        
        return newIndex;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [showFacts]);

  const containerStyles = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    height: fullScreen ? '100vh' : '100%',
    width: '100%',
    padding: 3,
    gap: sizeValues.spacing,
    backgroundColor: fullScreen ? colors.background.default : 'transparent'
  };

  return (
    <Box sx={containerStyles} >
      <CircularProgress
        size={sizeValues.spinner}
        thickness={4}
        sx={{
          color: colors.primary.main,
          '& .MuiCircularProgress-circle': {
            strokeLinecap: 'round',
          }
        }}
      />
      
      <Typography 
        variant={size === 'small' ? 'body2' : 'body1'} 
        sx={{ 
          color: colors.text.primary,
          fontWeight: 500,
          mt: 1
        }}
      >
        {message}
      </Typography>
      
      {showFacts && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          key={currentFactIndex}
          style={{ maxWidth: '450px' }}
        >
          <Typography
            variant={size === 'small' ? 'caption' : 'body2'}
            sx={{ 
              color: colors.text.secondary,
              mt: 1,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              fontStyle: 'italic',
              background: `linear-gradient(120deg, ${colors.primary.main}15, ${colors.primary.main}25)`,
              padding: 2,
              borderRadius: 2,
            }}
          >
            <span style={{ fontSize: '1.2em' }}>💡</span>
            {loadingFacts[currentFactIndex]}
          </Typography>
        </motion.div>
      )}
    </Box>
  );
};

export default Loader; 