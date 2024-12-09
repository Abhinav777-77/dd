import axios from 'axios';

const getDataFromBackend = async () => {
  try {
    const response = await axios.get('http://localhost:3000/api/data');  // Make sure this URL matches your backend server
    console.log(response.data);  // This should log the message from the backend
  } catch (error) {
    console.error("Error fetching data from backend:", error);
  }
};

// Call the function to fetch data
getDataFromBackend();
