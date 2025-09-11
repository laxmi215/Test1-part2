import React, { useState } from 'react';

function Register() {
  const [form, setForm] = useState({
    userid: '',
    password: '',
    givenName: '',
    familyName: '',
    phone: ''
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!/^\S+@\S+\.\S+$/.test(form.userid)) {
      errs.userid = 'Invalid email address';
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
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (data.success) {
        window.location.href = '/login';
      } else {
        setErrors({
          ...errs,
          form: data.message || 'Registration failed. Please try again.'
        });
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: 'auto', marginTop: 50 }}>
      <h2>Register</h2>
      {errors.form && <div style={{ color: 'red', marginBottom: '12px' }}>{errors.form}</div>}
      <div>
        <label>Email:</label>
        <input name="userid" type="email" value={form.userid} onChange={handleChange} placeholder="Enter your email" />
        {errors.userid && <div style={{ color: 'red' }}>{errors.userid}</div>}
      </div>
      <div>
        <label>Password:</label>
        <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="Enter your password" />
        {errors.password && <div style={{ color: 'red' }}>{errors.password}</div>}
      </div>
      <div>
        <label>Given Name(s):</label>
        <input name="givenName" value={form.givenName} onChange={handleChange} placeholder="Enter your given name(s)" />
        {errors.givenName && <div style={{ color: 'red' }}>{errors.givenName}</div>}
      </div>
      <div>
        <label>Family Name(s):</label>
        <input name="familyName" value={form.familyName} onChange={handleChange} placeholder="Enter your family name(s)" />
        {errors.familyName && <div style={{ color: 'red' }}>{errors.familyName}</div>}
      </div>
      <div>
        <label>Phone:</label>
        <input name="phone" type="tel" value={form.phone} onChange={handleChange} placeholder="Enter your phone number" />
        {errors.phone && <div style={{ color: 'red' }}>{errors.phone}</div>}
      </div>
      <button type="submit">Submit</button>
      <button type="button" onClick={() => window.location.href = '/'}>Cancel</button>
    </form>
  );
}

export default Register;
