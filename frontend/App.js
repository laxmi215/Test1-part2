import React, { useEffect } from 'react';
import './App.css';
import './discussion-board.css';

function App() {
  useEffect(() => {
    const token = window.localStorage.getItem('authToken');
    if (!token) {
      window.location.href = '/login';
    }
  }, []);

  const handleCancel = () => {
    window.location.href = '/'; // Redirect to home or another page
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '100px' }}>
      <h1>Discussion Board</h1>
      <button onClick={() => window.location.href = '/register'}>Register</button>
      <button onClick={() => window.location.href = '/login'}>Login</button>
      <button onClick={handleCancel}>Cancel</button>
    </div>
  );
}

export default App;
