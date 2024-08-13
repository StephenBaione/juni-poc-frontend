import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';

import { useSelector } from 'react-redux';

import NavBar from './components/Nav/navBar';

import ChatScreen from './components/ChatScreen/ChatScreen';
import AvatarViewer from './components/Avatar/avatarViewer';
import Auth from './components/Auth/Auth';
import FlowBuilder from './components/Flow/flowBuilder';
import ProfileScreen from './components/Profile/ProfileScreen';


import { ConversationService } from './data/services/conversationService';
import UserService from './services/userService';

import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';

import { Database } from './data/db';

import { ThemeProvider } from '@mui/material';
import theme from './Theme';

import { routeMap } from './components/utils';

function App() {
  const userService = new UserService();

  useEffect(() => {
    userService.loadUserFromLocal();
  }, []);
  
  const currentUser = useSelector((state) => state.currentUser);
  const ProtectedRoute = ({ children }) => {
    let location = useLocation();

    if (!currentUser?.userPresent || !currentUser?.user?.confirmed) {
      return <Navigate to={routeMap['login']} state={{ from: location }} replace />
    }

    return children;
  };

  const AuthRoute = ({ children }) => {
    const currentUser = useSelector((state) => state.currentUser);

    const location = useLocation();

    if (currentUser?.userPresent && currentUser?.user?.confirmed) {
      return <Navigate to={routeMap['home']} state={{ from: location }} replace />
    }

    return children;
  }

  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <NavBar />
        <Routes>
          <Route path="/" element={
            <ProtectedRoute>
              <ChatScreen />
            </ProtectedRoute>
          } />
          <Route path="/login" element={
            <AuthRoute>
              <Auth />
            </AuthRoute>
          } />
          <Route path="/avatar" element={
            <ProtectedRoute>
              <AvatarViewer />
            </ProtectedRoute>
          } />
          <Route path="/flow" element={
            <ProtectedRoute>
              <FlowBuilder />
            </ProtectedRoute>
          } />
          <Route path="/flow/:flow_id" element={
            <ProtectedRoute>
              <FlowBuilder 
                existing={true}
              />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <ProfileScreen />
            </ProtectedRoute>
          } />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
