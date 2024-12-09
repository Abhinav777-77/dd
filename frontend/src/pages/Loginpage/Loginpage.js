import React, { useEffect, useState } from 'react';
import axios from 'axios'; // Import axios to make HTTP requests
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection
import './Loginpage.css'; // Ensure this path is correct based on your project structure
import {useAuth} from './auth';
const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true); // State to toggle between login and sign up
  const [username, setUsername] = useState(''); // State for username
  const [email, setEmail] = useState(''); // State for email (only for registration)
  const [password, setPassword] = useState(''); // State for password
  const [errorMessage, setErrorMessage] = useState(''); // State for error message
  const [successMessage, setSuccessMessage] = useState(''); // State for success message
  const navigate = useNavigate(); // To handle redirection
  const { login } = useAuth();

  useEffect(() => {
    const wrapper = document.querySelector('.wrapper');
    const registerLink = document.querySelector('.register-link');
    const loginLink = document.querySelector('.login-link');

    // Event listener for the register link
    registerLink.onclick = () => {
      wrapper.classList.add('active');
      setIsLogin(false); // Switch to registration
    };

    // Event listener for the login link
    loginLink.onclick = () => {
      wrapper.classList.remove('active');
      setIsLogin(true); // Switch to login
    };
  }, []); // Empty dependency array to run only once when the component mounts

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission

    setErrorMessage(''); // Clear any previous errors
    setSuccessMessage(''); // Clear any previous success messages

    try {
      if (isLogin) {
        // Login API call
        const response = await axios.post('http://127.0.0.1:5000/login', {
          username,
          password,
        });

        if (response.data.redirect === '/generator') {
          console.log('Login Success:', response.data);
          login();
          navigate('/dp'); // Redirect to dashboard on successful login
        } else if (response.data.redirect === '/incorrect') {
          navigate('/incorrect'); // Redirect to incorrect page if the password is wrong
        }
      } else {
        // Registration API call
        const response = await axios.post('http://127.0.0.1:5000/register', {
          username,
          email,
          password,
        });
        console.log('Registration Success:', response.data);

        // Redirect to dashboard after successful registration
        navigate('/dp');
      }
    } catch (error) {
      console.error('Error:', error.response?.data || error.message);
      setErrorMessage(error.response?.data?.message || 'Something went wrong, please try again.');
    }
  };

  return (
    <div className="centeredpage">
    <div className="wrapper">
    <span className="rotate-bg"></span>
    <span className="rotate-bg2"></span>

    {/* Login Form */}
    <div className={`form-box login ${isLogin ? '' : 'hidden'}`}>
      <h2 className="title animation" style={{ '--i': 0, '--j': 21 }}>Login</h2>
      <form onSubmit={handleSubmit}>
        {/* Display error message if any */}
        {errorMessage && <p className="error-message">{errorMessage}</p>}

        <div className="input-box animation" style={{ '--i': 1, '--j': 22 }}>
          <input
            type="text"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)} // Set username
          />
          <label>Username</label>
          <i className='bx bxs-user'></i>
        </div>

        <div className="input-box animation" style={{ '--i': 2, '--j': 23 }}>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)} // Set password
          />
          <label>Password</label>
          <i className='bx bxs-lock-alt'></i>
        </div>
        <button type="submit" className="btn animation" style={{ '--i': 3, '--j': 24 }}>Login</button>
        <div className="linkTxt animation" style={{ '--i': 5, '--j': 25 }}>
          <p>Don't have an account? <a href="#" className="register-link">Sign Up</a></p>
        </div>
      </form>
    </div>
    <div className="info-text login">
      <h2 className="animation" style={{ '--i': 0, '--j': 20 }}>Welcome Back!</h2>
      <p className="animation" style={{ '--i': 1, '--j': 21 }}>Say goodbye to writer's block. Sign in and let Blog Boost shape your thoughts into high-quality blogs.</p>
    </div>
    {/* Sign Up Form */}
    <div className={`form-box register ${isLogin ? 'hidden' : ''}`}>
      <h2 className="title animation" style={{ '--i': 17, '--j': 0 }}>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        {/* Display success message if any */}
        {successMessage && <p className="success-message">{successMessage}</p>}

        {/* Display error message if any */}
        {errorMessage && <p className="error-message">{errorMessage}</p>}

        <div className="input-box animation" style={{ '--i': 18, '--j': 1 }}>
          <input
            type="text"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)} // Set username for registration
          />
          <label>Username</label>
          <i className='bx bxs-user'></i>
        </div>

        <div className="input-box animation" style={{ '--i': 19, '--j': 2 }}>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)} // Set email
          />
          <label>Email</label>
          <i className='bx bxs-envelope'></i>
        </div>

        <div className="input-box animation" style={{ '--i': 20, '--j': 3 }}>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)} // Set password for registration
          />
          <label>Password</label>
          <i className='bx bxs-lock-alt'></i>
        </div>
        <button type="submit" className="btn animation" style={{ '--i': 21, '--j': 4 }}>Sign Up</button>
        <div className="linkTxt animation" style={{ '--i': 22, '--j': 5 }}>
          <p>Already have an account? <a href="#" className="login-link">Log In</a></p>
        </div>
      </form>
    </div>
    <div className="info-text register">
      <h2 className="animation" style={{ '--i': 17, '--j': 0 }}>Welcome</h2>
      <p className="animation" style={{ '--i': 18, '--j': 1 }}>"Join BlogBoost and revolutionize the way you create blogs. Sign up now to unleash the full potential of AI-powered content creation!"</p>
    </div>
  </div>
   </div>
);
};

export default LoginPage;
