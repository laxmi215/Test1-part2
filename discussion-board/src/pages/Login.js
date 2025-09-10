import React, { useState, useEffect } from 'react';

function Login() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  // Removed automatic redirect. Only redirect after successful login.

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (data.token) {
        window.localStorage.setItem('authToken', data.token);
        window.location.href = 'http://localhost:5000'; // Redirect to backend main page
      } else {
        setError(data.message || 'Login failed. Please check your credentials and try again.');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: 'auto', marginTop: 50 }}>
      <h2>Login</h2>
      <div>
        <label>Email:</label>
        <input name="username" type="email" value={form.username} onChange={handleChange} placeholder="Enter your email" />
      </div>
      <div>
        <label>Password:</label>
        <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="Enter your password" />
      </div>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <button type="submit">Submit</button>
      <button type="button" onClick={() => window.location.href = '/'}>Cancel</button>
    </form>
  );
}

export default Login;
