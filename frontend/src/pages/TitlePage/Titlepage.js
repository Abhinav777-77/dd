import React, { useRef,useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import './Titlepage.css'; // Import the CSS file
import imagepath from './image.jpg';

const TitlePage = () => {
    const navigate = useNavigate();   
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    // Function to start the full animation and redirect after completion


    // Handle key press event

    const handleNavigate = () => {
        navigate('/Login'); // Replace '/next-page' with your target route
    };



    const handleFormSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission behavior

        try {
            const response = await axios.post('http://127.0.0.1:5000/contact', {
                name,    // Name state
                email,   // Email state
                message  // Message state
            }, {
                headers: { 'Content-Type': 'application/json' } // Add appropriate headers
            });

            if (response.status === 200) {
                alert(response.data.message); // Show success message
                setName('');                 // Reset name field
                setEmail('');                // Reset email field
                setMessage('');              // Reset message field
            }
        } catch (error) {
            console.error('Error submitting the form:', error);
            alert('An error occurred. Please try again later.');
        }
    };
   
    return (
        <div>
            {/* Navbar */}
            <nav className="navbar navbar-expand-lg navbar-custom navbar-dark fixed-top">
                <a className="navbar-brand" href="#">Blog Boost</a>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ml-auto">
                        <li className="nav-item"><a className="nav-link" href="#features">Features</a></li>
                        <li className="nav-item"><a className="nav-link" href="#about">About</a></li>
                        <li className="nav-item"><a className="nav-link" href="#contact">Contact Us</a></li>
                    </ul>
                </div>
            </nav>

            {/* Jumbotron */}
            <div className="jumbotron text-center bg-primary text-white py-5 mt-5">
                <h1 className="display-4">Streamline your content effortlessly with Blog Boost</h1>
                <p className="lead">Revolutionize the way you create blogs using AI</p>
            </div>

            {/* New Search Box */}
            {/* <div className="textbox" id="textbox" ref={textboxRef}>
                <div className="textbox-box">
                    <div className="textbox-field">
                        <div className="textbox-label">Article Title</div>
                        <input
                            className="textbox-text"
                            type="text"
                            placeholder="Type here..."
                            ref={searchInputRef}
                            onKeyPress={handleKeyPress}
                        />
                    </div>
                    <div className="textbox-action" onClick={handleSearchButtonClick}>
                        <svg viewBox="0 0 24 24">
                            <path d="M4,11V13H16L10.5,18.5L11.92,19.92L19.84,12L11.92,4.08L10.5,5.5L16,11H4Z"></path>
                        </svg>
                    </div>
                </div>
            </div> */}






            <div className="blogboost-container">
                <div className="blogboost-box" onClick={handleNavigate}>
                    Try Blog Boost
                </div>
            </div>











            {/* Features Section */}
            <section id="features" className="content-container bg-light">
                <div className="container features">
                    <h2 className="display-4 text-center">Features</h2>
                    <p className="lead text-center">Discover the unique features of Blog Boost</p>
                    <div className="row">
                        <div className="col-md-4">
                            <h3>AI-Powered Content</h3>
                            <p>Generate high-quality blog content in seconds using advanced AI algorithms, tailored to your preferences.</p>
                        </div>
                        <div className="col-md-4">
                            <h3>SEO-Optimized Titles</h3>
                            <p>Enhance your content's discoverability with SEO-optimized blog titles and headings.</p>
                        </div>
                        <div className="col-md-4">
                            <h3>User-Friendly Interface</h3>
                            <p>Enjoy a simple and intuitive interface that makes content creation easy and accessible for everyone.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* About Section */}
            <section id="about" className="content-container">
                <div className="container about">
                    <h2 className="display-4 text-center">About Us</h2>
                <p className="col-md-8">Learn more about Blog Boost and our mission</p>
                    <div className="row">
                        <div className="col-md-8">
                            <h3>Blog Boost is your go-to platform for generating blog content quickly and efficiently using AI-powered text generation. Whether you're a seasoned writer or just getting started, our tool streamlines your content creation process, so you can focus on what matters most—your ideas. We believe in the power of technology to simplify complex tasks and help individuals and businesses alike to scale their content production effortlessly.</h3>
                        </div>
                        <div className="col-md-4">
                            <div className=""><img src={imagepath} alt="image not found"  style={{ width: '550px', height: '450px' }} className='card-image' ></img></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact Us Section */}
            <section id="contact" className="content-container bg-light">
                <div className="container">
                    <h2 className="display-4 text-center">Contact Us</h2>
                    <p className="lead text-center">Get in touch with our team</p>
                    <div className="row">
                        <div className="col-md-6 offset-md-3">
                            <form onSubmit={handleFormSubmit}>
                                <div className="form-group">
                                    <label htmlFor="name">Name</label>
                                    <input type="text" className="form-control" id="name" placeholder="Your name"  value={name} onChange={(e) => setName(e.target.value)}  />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="email">Email</label>
                                    <input type="email" className="form-control" id="email" placeholder="Your email"  value={email} onChange={(e) => setEmail(e.target.value)}  />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="message">Message</label>
                                    <textarea className="form-control" id="message" rows="5" placeholder="Your message" value={message} onChange={(e) => setMessage(e.target.value)}></textarea>
                                </div>
                                <button type="submit" className="btn btn-primary btn-block">Submit</button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="footer bg-dark text-white text-center py-3">
                <div className="container">
                    <p>&copy; 2024 Blog Boost. All Rights Reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default TitlePage;
 