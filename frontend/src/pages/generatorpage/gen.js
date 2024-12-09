import React, { useState, useEffect } from 'react';
import './gen.css'; // Import CSS for styling

// Sidebar component to display previous content
const Sidebar = ({ isVisible, onClose, history }) => (
  <div className={`gen-sidebar ${isVisible ? 'show' : ''}`}>
    <button className="gen-close-button" onClick={onClose}>Close Sidebar</button>
    <h5>Previous Content</h5>
    <div className="sidebar-scroll">
      <ul className="list-group">
        {history.map((entry, index) => (
          <li key={index} className="list-group-item">
            <strong>Prompt:</strong> {entry.prompt} <br />
            <strong>Generated:</strong> {entry.generatedText?.substring(0, 100) || entry.generatedImageUrl?.substring(0, 100)}...
          </li>
        ))}
      </ul>
    </div>
  </div>
);

// Account Icon Component
const AccountIcon = () => (
  <div className="gen-account-icon">VA</div>
);

// Text Generator Component
const TextGenerator = ({ onGenerate }) => {
  const [inputText, setInputText] = useState('');

  return (
    <div className="gen-input-box">
      <div className="mb-3">
        <label htmlFor="inputText" className="form-label">Enter your prompt:</label>
        <textarea
          className="form-control"
          id="inputText"
          rows="4"
          placeholder="Type something..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
        />
      </div>
      <button 
        className="btn btn-primary gen-generator-btn" 
        onClick={() => onGenerate(inputText)}
      >
        Generate Content
      </button>
    </div>
  );
};

// Main GenApp Component
const GenApp = () => {
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const [outputText, setOutputText] = useState('');
  const [outputImage, setOutputImage] = useState(''); // Base64 image
  const [imageError, setImageError] = useState(''); // State for image error
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false); // State to manage loading

  const toggleSidebar = () => {
    setSidebarVisible(!isSidebarVisible);
  };

  // Function to fetch generation history from server
  const fetchHistory = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/history');  // Updated URL
      if (!response.ok) {
        throw new Error('Failed to fetch history');
      }
      const data = await response.json();
      setHistory(data);
    } catch (error) {
      console.error('Error fetching history:', error);
    }
  };
  

  // Function to handle content generation
  const handleGenerate = async (text) => {
    setIsLoading(true); // Set loading to true when generation starts
    try {
      // Send the prompt to Flask server
      const response = await fetch('http://127.0.0.1:5000/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: text }), // Send the prompt as JSON
      });

      if (!response.ok) {
        throw new Error('Failed to generate content');
      }

      const data = await response.json();
      setOutputText(data.generatedText); // Set generated text
      setOutputImage(data.image); // Set the Base64-encoded image

      // Clear error state for the image
      setImageError('');

      // Refresh history
      fetchHistory();
    } catch (error) {
      console.error('Error generating content:', error);
      setOutputText('Error generating text. Please try again.');
      setOutputImage(''); // Reset image on error
      setImageError('Error generating image. Please try again.'); // Set image error
    } finally {
      setIsLoading(false); // Set loading to false when generation finishes
    }
  };

  useEffect(() => {
    fetchHistory(); // Fetch history on initial load
  }, []);

  return (
    <div className="gen-body" style={{ padding: '30px' }}>
      <Sidebar isVisible={isSidebarVisible} onClose={toggleSidebar} history={history} />
      <AccountIcon />
      <div className="gen-content" style={{ marginLeft: isSidebarVisible ? '250px' : '0', transition: 'margin-left 0.3s ease' }}>
        <button className="gen-open-button" onClick={toggleSidebar} style={{ display: isSidebarVisible ? 'none' : 'block' }}>
          Open Sidebar
        </button>
        <h1 className="text-center">Blog Content Generator</h1>
        <TextGenerator onGenerate={handleGenerate} />
        <div className="gen-output-container">
          <div className="gen-image-box">
            {isLoading ? (
              <div className="spinner"></div> // Show loading spinner
            ) : outputImage ? (
              <img src={`data:image/jpeg;base64,${outputImage}`} alt="Generated visual content" />
            ) : (
              <p>{imageError || 'No image generated.'}</p>
            )}
          </div>
          <div className="gen-text-box">
            <h5>Generated Content:</h5>
            <div id="outputText" className="border p-3 rounded">
              {isLoading ? 'Generating content...' : outputText || 'No content generated.'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GenApp;
