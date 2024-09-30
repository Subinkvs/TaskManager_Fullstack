import React, { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import TaskList from './components/TaskList';
import Login from './components/Login';
import Register from './components/Register';
import LandingPage from './components/LandingPage';
import TaskDetail from './components/TaskDetail';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // New loading state

  // Check if token exists in localStorage on component mount
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    setIsAuthenticated(!!token); // Convert token to boolean
    setIsLoading(false); // Set loading to false after checking token
  }, []);

  if (isLoading) {
    return <div>Loading...</div>; // Show loading message or spinner while checking authentication
  }

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Landing Page */}
          <Route path="/" element={<LandingPage />} />
          
          {/* Register Route */}
          <Route
            path="/register"
            element={isAuthenticated ? <Navigate to="/tasks" /> : <Register />}
          />

          {/* Login Route */}
          <Route
             path="/login"
             element={isAuthenticated ? <Navigate to="/tasks" /> : <Login setIsAuthenticated={setIsAuthenticated} />}
          />

        

          {/* Task List Route (Protected) */}
          <Route
            path="/tasks"
            element={isAuthenticated ? <TaskList setIsAuthenticated={setIsAuthenticated} /> : <Navigate to="/login" />}
          />

          {/* Task Detail Route */}
          <Route path="/task/:id" element={<TaskDetail />} />

          {/* Redirect for all undefined paths */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;




