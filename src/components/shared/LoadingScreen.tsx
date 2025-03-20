import React from 'react';
import Loader from './Loader';

interface LoadingScreenProps {
  message?: string;
  showFacts?: boolean;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({
  message = "Loading your content...",
  showFacts = true
}) => {
  return (
    <Loader
      message={message}
      showFacts={showFacts}
      size="large"
      fullScreen={true}
    />
  );
};

export { LoadingScreen };
export default Loader; 