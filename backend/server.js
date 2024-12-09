const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const cors = require('cors');
// const axios = require('axios');
const { spawn } = require('child_process');
const bodyParser = require('body-parser');
require('dotenv').config(); 
// Create an Express app
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.log('Error connecting to MongoDB:', err));

// User model
const User = mongoose.model('users', new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
}));

const contactSchema = new mongoose.Schema({
  name: String,
  email: String,
  message: String,
}, { timestamps: true });

const Contact = mongoose.model('Contact', contactSchema);
const historySchema = new mongoose.Schema({prompt: String,
  generatedText: String,
  image: String,}, { strict: false }); // Flexible schema
const History = mongoose.model('History', historySchema, 'history'); // Map to existing collection


// JWT secret key (store in a .env file in a real project)
const JWT_SECRET =  process.env.JWT_SECRET;

// Registration route
app.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists.' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully.' });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

// Login route
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Find user by username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Compare the password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Incorrect password.' });
    }

    // Generate a JWT token
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });

    res.json({ message: 'Login successful.', token, redirect: '/generator' });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Bearer <token>
  if (!token) {
    return res.status(401).json({ message: 'No token provided.' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token.' });
    }
    req.userId = decoded.userId;
    next();
  });
};

// Protected route (only accessible with a valid token)
app.get('/generator', verifyToken, (req, res) => {
  res.json({ message: 'Welcome to the generator, user authenticated!' });
});

app.post('/contact', async (req, res) => {
  try {
    // Get data from request
    const { name, email, message } = req.body;

    // Basic validation
    if (!name || !email || !message) {
      return res.status(400).json({ message: 'All fields are required!' });
    }

    // Create a new contact submission in the second database (Contact database)
    const newSubmission = new Contact({
      name,
      email,
      message,
    });

    // Save to the second database
    await newSubmission.save();

    // Respond with a success message
    res.status(200).json({ message: 'Thank you for your submission!' });
  } catch (error) {
    console.error('Error occurred:', error);
    res.status(500).json({ message: 'An error occurred while processing your request.' });
  }
});

// Route to get history
app.get('/history', async (req, res) => {
  try {
    // Fetch all documents from the collection, excluding the _id field
    const history = await History.find({}, { _id: 0 });
    res.status(200).json(history);
  } catch (error) {
    console.error('Error fetching history:', error);
    res.status(500).json({ message: 'Error fetching history.' });
  }
});




async function insertData(prompt, generatedText, imageData) {
  try {
      const history = new History({
        prompt: prompt,
        generatedText: generatedText,
        image: imageData
    });

      await history.save();
      console.log(`Document inserted sucessfully`);
  } catch (err) {
      console.error('Error inserting document:');
  }
}













app.post('/generate', (req, res) => {
  const prompt = req.body.prompt;

  if (!prompt) {
      return res.status(400).json({ error: 'No prompt provided' });
  }

  // Spawn a Python process
  const pythonProcess = spawn('python', ['app.py', prompt]);

  // Capture the Python script output
  let output = '';
  pythonProcess.stdout.on('data', (data) => {
      output += data.toString();
  });

  pythonProcess.stderr.on('data', (error) => {
      console.error('Error:', error.toString());
  });

  pythonProcess.on('close', async (code) => {
      if (code === 0) {
          try {
              const response = JSON.parse(output);
              const { generatedText, imageData } = response;
              res.json(response); // Send the AI-generated content back to the client
              await insertData(prompt, generatedText, imageData);
          } catch (err) {
              res.status(500).json({ error: 'Failed to parse Python response' });
          }
      } else {
          res.status(500).json({ error: 'Python script failed to execute' });
      }
  });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
