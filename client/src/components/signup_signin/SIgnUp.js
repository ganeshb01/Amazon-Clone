import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Signup = () => {

  const [udata, setUdata] = useState({
    fname: "",
    email: "",
    mobile: "",
    password: "",
    cpassword: ""
  });

  // console.log(udata);

  const adddata = (e) => {
    const { name, value } = e.target;
    // console.log(name,value);

    setUdata((pre) => {
      return {
        ...pre,
        [name]: value
      }
    })
  };

  const senddata = async (e) => {
    e.preventDefault();
    const { fname, email, mobile, password, cpassword } = udata;
    if(fname === ""){
      toast.warn("fname field empty",{
        position : "top-center",
    })
    }else if(mobile === ""){
      toast.warn("mobile field empty",{
        position : "top-center",
    })
    }
    else if(email === ""){
      toast.warn("email is empty",{
        position : "top-center",
    })
    }
    else if(password === ""){
      toast.warn("password is empty",{
        position : "top-center",
    })
    }
    else if(cpassword === ""){
      toast.warn("cpassword is empty",{
        position : "top-center",
    })
    
    }
    const res = await fetch("register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        fname, email, mobile, password, cpassword
      })
    });
    const data = await res.json();
   // console.log(data);

   if(res.status === 422 || !data){
    //alert("no data")
    toast.warn("invalid details.",{
        position : "top-center",
    })
   }else{
    //alert("data succesfully adde");
    toast.success("data succesfully adde",{
      position : "top-center",
    })
    setUdata({
      ...udata, fname: "", email: "",
      mobile: "", password: "", cpassword: ""
  });
   }
  }
  return (
    <section>
      <div className='sign_container'>
        <div className="sign_header">
          <img src="./blacklogoamazon.png" alt="signupimg" />
        </div>
        <div className="sign_form">
          <from method='POST'>
            <h1>Sign-Up</h1>
            <div className="form_data">
              <label htmlFor="fname">Your name</label>
              <input type="text"
                onChange={adddata}
                value={udata.fname}
                name="fname"
                id="fname" />
            </div>
            <div className="form_data">
              <label htmlFor="email">Email</label>
              <input type="email"
                onChange={adddata}
                value={udata.email}
                name="email"
                id="email" />
            </div>
            <div className="form_data">
              <label htmlFor="number">Mobile</label>
              <input type="text"
                onChange={adddata}
                value={udata.mobile}
                name="mobile"
                id="mobile" />
            </div>
            <div className="form_data">
              <label htmlFor="password">Password</label>
              <input type="password"
                onChange={adddata}
                value={udata.password}
                name="password"
                id="password" placeholder='At least 6 char' />
            </div>
            <div className="form_data">
              <label htmlFor="cpassword">Password Again</label>
              <input type="cpassword"
                onChange={adddata}
                value={udata.cpassword}
                name="cpassword"
                id="cpassword" />
            </div>
            <button type="submit" className="signin_btn" onClick={senddata}>Continue</button>
            <div className='signin_info'>
              <p>Already have an account</p>
              <NavLink to='/login'>Signin</NavLink>
            </div>
          </from>
        </div>
        <ToastContainer />
      </div>
    </section>

  )
}

export default Signup
