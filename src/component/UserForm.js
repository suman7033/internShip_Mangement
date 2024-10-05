// src/UserForm.js
import React, { useState } from 'react';
import Modal from 'react-modal';
import "../component/userForm.css";

Modal.setAppElement('#root'); // For accessibility

const UserForm = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    username: '',
    address: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    if (formData.name.length < 3) return "Name must be at least 3 characters.";
    if (!/\S+@\S+\.\S+/.test(formData.email)) return "Email is invalid.";
    if (!/^\d{10}$/.test(formData.phone)) return "Phone number must be 10 digits.";
    if (formData.username.length < 3) return "Username must be at least 3 characters.";
    if (!formData.address) return "Address is required.";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setError('');

    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      console.log('User created:', data);
      setFormData({
        name: '',
        email: '',
        phone: '',
        username: '',
        address: '',
      });
      setIsOpen(false);
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };

  return (
    <div>
      <button onClick={() => setIsOpen(true)}>Create User</button>
      <Modal isOpen={isOpen} onRequestClose={() => setIsOpen(false)} contentLabel="Create User">
        <h2>Create User</h2>
        <form onSubmit={handleSubmit}>
          <label>Name</label>
          <input type="text" name="name" required value={formData.name} onChange={handleChange} />
          <label>Email</label>
          <input type="email" name="email" required value={formData.email} onChange={handleChange} />
          <label>Phone</label>
          <input type="text" name="phone" required value={formData.phone} onChange={handleChange} />
          <label>Username</label>
          <input type="text" name="username" required value={formData.username} onChange={handleChange} />
          <label>Address</label>
          <input type="text" name="address" required value={formData.address} onChange={handleChange} />
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <button type="submit">Create User</button>
          <button type="button" onClick={() => setIsOpen(false)}>Cancel</button>
        </form>
      </Modal>
    </div>
  );
};

export default UserForm;
