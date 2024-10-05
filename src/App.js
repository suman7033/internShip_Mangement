import React, { useState, useEffect } from 'react';
import "./App.css";

const App = () => {
  const [showForm, setShowForm] = useState(false);
  const [data, setData] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null); 
  const [openEdit, setOpenEdit] = useState(false);

  // Using state to hold form values
  const [formValues, setFormValues] = useState({
    name: '',
    email: '',
    phone: '',
    username: '',
    address: ''
  });

  const showFn = () => {
    setShowForm(prev => !prev);
    setOpenEdit(false);
    setShowForm(true);
    resetForm(); // Reset the form when adding a new user
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch("https://internship-f6f32-default-rtdb.firebaseio.com/user.json");
      const result = await response.json();
      if (result) {
        const users = Object.keys(result).map(key => ({
          id: key,
          ...result[key]
        }));
        setData(users);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const resetForm = () => {
    setFormValues({
      name: '',
      email: '',
      phone: '',
      username: '',
      address: ''
    });
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues(prevValues => ({
      ...prevValues,
      [name]: value
    }));
  };

  const HandleSubmit = async (event) => {
    event.preventDefault();
    const obj = { ...formValues };
    try {
      const response = await fetch("https://internship-f6f32-default-rtdb.firebaseio.com/user.json", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(obj),
      });
      const postData = await response.json();
      setData([...data, { id: postData.name, ...obj }]);
      fetchData();
      console.log("AfterPost", postData);
    } catch (error) {
      console.log(error);
    }
    resetForm();
    setOpenEdit(false);
    setShowForm(false);
  };

  const EditHandler = (index) => {
    setOpenEdit(true);
    setEditingIndex(index);   
    const userToEdit = data[index];   
    setFormValues({ ...userToEdit });  // Populate form with the selected user data
  };

  const HandleEditSubmit = async (event) => {
    event.preventDefault();
    const updatedUser = { ...formValues };

    const userId = data[editingIndex].id;
    const updatedData = [...data];
    updatedData[editingIndex] = { ...updatedUser, id: userId };
    setData(updatedData);

    try {
      await fetch(`https://internship-f6f32-default-rtdb.firebaseio.com/user/${userId}.json`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedUser),
      });
      console.log("AfterEdit", updatedUser);
      fetchData();
    } catch (error) {
      console.log(error);
    }
    resetForm();
    setOpenEdit(false);
    setShowForm(false);
  };

  const DeleteHandler = async (index) => {
    const userId = data[index].id;
    try {
      await fetch(`https://internship-f6f32-default-rtdb.firebaseio.com/user/${userId}.json`, {
        method: 'DELETE',
      });

      const updatedData = data.filter((_, i) => i !== index);
      setData(updatedData);
      fetchData();

      console.log("User deleted successfully");
    } catch (error) {
      console.log(error);
    }
    resetForm();
    setOpenEdit(false);
    setShowForm(false);
  };

  return (
    <>
      <div className='table-div'>
        <h1>User Management</h1>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>UserName</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => {
              return (
                <tr key={index}>
                  <td>{item.name}</td>
                  <td>{item.email}</td>
                  <td>{item.phone}</td>
                  <td>{item.username}</td>
                  <td>
                    <button className='table-btn' onClick={() => EditHandler(index)}>Edit</button>
                    <button className='table-btn' onClick={() => DeleteHandler(index)}>Delete</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="main-btn">
        <button className="Add_btn" onClick={showFn}>{showForm ? "Back" : "Add_User"}</button>
      </div>

      {(showForm || openEdit) && (
        <div className='App-div'>
          <form className='form' onSubmit={openEdit ? HandleEditSubmit : HandleSubmit}>
            <h1>{openEdit ? "Edit User" : "Add User"}</h1>
            <label>Name</label>
            <input type='text' required minLength="3" placeholder='Name..' name="name" value={formValues.name} onChange={handleChange} />
            <br />

            <label>Email</label>
            <input type='email' required placeholder='Email..' name="email" value={formValues.email} onChange={handleChange} />
            <br />

            <label>Phone</label>
            <input type='number' required placeholder='Phone..' name="phone" value={formValues.phone} onChange={handleChange} />
            <br />

            <label>Username</label>
            <input type='text' minLength="3" placeholder='UserName..' required name="username" value={formValues.username} onChange={handleChange} />
            <br />

            <label>Address</label>
            <input type='text' required placeholder='Address..' name="address" value={formValues.address} onChange={handleChange} />
            <br />
            <button type="submit" className='submit-btn'>{openEdit ? "Update" : "Submit"}</button>
          </form>
        </div>
      )}
    </>
  );
};

export default App;
