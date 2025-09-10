import React, { useState } from 'react';

function Register() {
  const [form, setForm] = useState({
    username: '',
    password: '',
    givenName: '',
    familyName: '',
    phone: ''
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!/^\S+@\S+\.\S+$/.test(form.username)) {
      errs.username = 'Invalid email address';
    }
    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(form.password)) {
      errs.password = 'Password must be 8+ chars, include upper, lower, digit';
    }
    if (!form.givenName) errs.givenName = 'Required';
    if (!form.familyName) errs.familyName = 'Required';
    if (!/^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/.test(form.phone)) {
      errs.phone = 'Invalid phone number';
    }
    return errs;
  };

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length === 0) {
      try {
  const res = await fetch('http://localhost:5000/api/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: form.username,
            password: form.password,
            givenName: form.givenName,
            familyName: form.familyName,
            phone: form.phone
          })
        });
        const data = await res.json();
        console.log('Registration response:', data);
        if (res.ok && data.success) {
          window.location.href = '/login';
        } else {
          setErrors({
            ...errs,
            form: data.message || 'Registration failed. Please try again.'
          });
        }
      } catch (error) {
        setErrors({
          ...errs,
          form: 'Network error. Please try again.'
        });
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: 'auto' }}>
      <h2>Register</h2>
      {errors.form && <div style={{ color: 'red' }}>{errors.form}</div>}
      <div>
        <label>Email:</label>
        <input name="username" value={form.username} onChange={handleChange} />
        {errors.username && <span style={{ color: 'red' }}>{errors.username}</span>}
      </div>
      <div>
        <label>Password:</label>
        <input name="password" type="password" value={form.password} onChange={handleChange} />
        {errors.password && <span style={{ color: 'red' }}>{errors.password}</span>}
      </div>
      <div>
        <label>Given Name:</label>
        <input name="givenName" value={form.givenName} onChange={handleChange} />
        {errors.givenName && <span style={{ color: 'red' }}>{errors.givenName}</span>}
      </div>
      <div>
        <label>Family Name:</label>
        <input name="familyName" value={form.familyName} onChange={handleChange} />
        {errors.familyName && <span style={{ color: 'red' }}>{errors.familyName}</span>}
      </div>
      <div>
        <label>Phone:</label>
        <input name="phone" value={form.phone} onChange={handleChange} />
        {errors.phone && <span style={{ color: 'red' }}>{errors.phone}</span>}
      </div>
      <button type="submit">Register</button>
    </form>
  );
}

export default Register;
