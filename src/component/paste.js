import React, { useState,useRef } from 'react';
import "./App.css";

const App = () => {
  
  const [showForm, setShowForm]=useState(false);
  const [data,setData]=useState([]);

  const nameRef=useRef();
  const emailRef=useRef();
  const phoneRef=useRef()
  const usernameRef=useRef();
  const AddressRef=useRef();

  const showFn=()=>{
     if(showForm==true){
      setShowForm(false);
     }else{
      setShowForm(true);
     }
  }

  const HandleSubmit=async(event)=>{
    event.preventDefault()
     const obj={
      name:nameRef.current.value,
      email:emailRef.current.value,
      phone:phoneRef.current.value,
      username:usernameRef.current.value,
      address:AddressRef.current.value,
     }
     try{
       const response=await fetch("https://internship-f6f32-default-rtdb.firebaseio.com/user.json",{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(obj),
       });
       const PostData=await response.json();
       setData([obj]);
       console.log("AfterPost",PostData);
     }catch(error){
       console.log(error);
     }
  }
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
          </tr>
        </thead>
        <tbody>
          {data.map((item,index)=>{
             return <tr key={index}>
              <td>{item.name}</td>
              <td>{item.email}</td>
              <td>{item.phone}</td>
              <td>{item.username}</td>
              <td><button className='table-btn'>Edit</button></td>
              <td><button className='table-btn'>Delete</button></td>
             </tr>
          })}
        </tbody>
       </table>
    </div>
    <div className="main-btn">
    <button className="Add_btn" onClick={showFn}>{showForm ? "Back":"Add_User"}</button>
    <br/>
    {/* <button className='btn'>Edit</button>&nbsp; &nbsp;
    <button className='btn'>Delete</button> */}
    </div>
    {showForm && <div className='App-div'>
       
      <form className='form'  onSubmit={HandleSubmit}>
        <h1>Welcome</h1>
        <label>Name</label>
        <input type='text' required minLength="3" placeholder='Name..' ref={nameRef}/>
        <br />
        
        <label>Email</label> 
        <input type='email' required placeholder='Email..' ref={emailRef}/>
        <br />

        <label>Phone</label>
        <input type='number' required placeholder='Phone..' ref={phoneRef}/>
        <br />

        <label>Username</label>
        <input type='text' minLength="3" placeholder='UserName..'required  ref={usernameRef}/>
        <br />

        <label>Address</label>
        <input type='text' required placeholder='Address..' ref={AddressRef}/>
        <br/>
        <button type="submit" className='submit-btn'>Submit</button>
      </form>
    </div>}
    </>
  )
}

export default App;
