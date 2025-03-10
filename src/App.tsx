// import React from 'react';
import { BrowserRouter } from 'react-router';
import { Routes, Route } from 'react-router';
import { AuthProvider } from './contexts/AuthContext';
import { Header } from './components/layout/Header';
import { Feed } from './pages/Feed';
// import { Challenges } from './pages/Challenges';
import { SignIn } from './pages/SignIn';
import { SignUp } from './pages/SignUp';
import { PrivateRoute } from './components/auth/PrivateRoute';
import { Chat } from './pages/Chat';
import { Profile } from './pages/Profile';
import NotFound from './pages/NotFound';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="min-h-screen bg-gray-50">
          {/* <Header /> */}
          <main className="container mx-auto py-6">
            <Routes>
              <Route path="/sign-in" element={<SignIn />} />
              <Route path="/sign-up" element={<SignUp />} />
              <Route path="/" element={<PrivateRoute><Feed /></PrivateRoute>} />
              <Route path="/feed" element={<PrivateRoute><Feed /></PrivateRoute>} />
              {/* <Route path="/challenges" element={<PrivateRoute><Challenges /></PrivateRoute>} /> */}
              <Route path="/chat" element={<PrivateRoute><Chat /></PrivateRoute>} />
              <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
              <Route path="*" element={<NotFound/>} />
            </Routes>
          </main>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;