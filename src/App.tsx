// import React from 'react';
import { BrowserRouter } from 'react-router';
import { Routes, Route } from 'react-router';
import { AuthProvider } from './contexts/AuthContext';
// import { Header } from './components/layout/Header';
import { Feed } from './pages/Feed';
// import { Challenges } from './pages/Challenges';
import { SignIn } from './pages/SignIn';
import { SignUp } from './pages/SignUp';
import { PrivateRoute } from './components/auth/PrivateRoute';
import { Chat } from './pages/Chat';
import { Profile } from './pages/Profile';
import NotFound from './pages/NotFound';
// import Callback from './pages/Callback';
import OnBoarding from './pages/OnBoarding';
import AnonymousChat from './pages/AnonymousChat';
import Communities from './pages/Communities';
// import Home from './pages/Home';
import Trips from './pages/Trips';
import ChatRoom from './pages/ChatRoom';
import { ToastContainer } from 'react-toastify';
import { useState, useEffect } from 'react';
import { LoadingScreen } from './components/shared/LoadingScreen';
import Callback from './contexts/callback';

function App() {
  const [appLoading, setAppLoading] = useState(true);

  useEffect(() => {
    // Simulate checking session, loading fonts, or any initial setup
    const timer = setTimeout(() => {
      setAppLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);

  if (appLoading) {
    return <LoadingScreen message="Setting up ConnectIIT..." />;
  }

  return (
    <>
    <ToastContainer/>
    <BrowserRouter>
      <AuthProvider>
        <div className="min-h-screen " style={{padding: '0px'}}>
          {/* <Header /> */}
          <main className="  " style={{padding: '0px'}}>
            <Routes>
            <Route path="/sign-in" element={<SignIn />} />
              <Route path="/sign-up" element={<SignUp />} />
              {/* <Route path="/chat12" element={<ChatTry/>} /> */}
              <Route path="/callback" element={<Callback />} />
              <Route path="/" element={<PrivateRoute><Feed/></PrivateRoute>} />
              {/* <Route path="/feed" element={<PrivateRoute><Feed /></PrivateRoute>} /> */}
              {/* <Route path="/challenges" element={<PrivateRoute><Challenges /></PrivateRoute>} /> */}
              <Route path="/chat" element={<PrivateRoute><Chat /></PrivateRoute>} />
              <Route path="/chat-room" element={<PrivateRoute><ChatRoom/></PrivateRoute>} />
              <Route path="/chat-anonymously" element={<PrivateRoute><AnonymousChat /></PrivateRoute>} />
              <Route path="/onboarding" element={<OnBoarding/>} />
              <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
              <Route path="/travel" element={<PrivateRoute><Trips /></PrivateRoute>} />
              <Route path="/communities" element={<PrivateRoute><Communities /></PrivateRoute>} />
              <Route path="*" element={<NotFound/>} />
            </Routes>
          </main>
        </div>
      </AuthProvider>
    </BrowserRouter>
    </>
  );
}

export default App;