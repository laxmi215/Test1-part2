
import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';

function MainPage() {
  React.useEffect(() => {
    const token = window.localStorage.getItem('authToken');
    if (!token) {
      window.location.href = '/login';
    }
  }, []);
  return (
    <div style={{ textAlign: 'center', marginTop: '100px' }}>
      <h1>Discussion Board</h1>
      <button onClick={() => window.location.href = '/register'}>Register</button>
      <button onClick={() => window.location.href = '/login'}>Login</button>
      <button onClick={() => window.location.href = '/'}>Cancel</button>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<MainPage />} />
      </Routes>
    </Router>
  );
}

export default App;
