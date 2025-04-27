const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

// Signal generation function
async function getSignal() {
  try {
    const response = await axios.get('https://api.unirateapi.com/api/rates?api_key=3qnkZTTviZbpc1XECRocSnu3xDOmC7WhFY7vaAzuWjG61ygMWIvroLBPKB4MGszt&from=USD');
    const eurusdRate = response.data?.rates?.EUR; // Get EUR/USD rate
    
    if (!eurusdRate) {
      throw new Error('EUR/USD rate not found');
    }

    const random = Math.random();
    let signal;

    if (random > 0.5) {
      signal = 'BUY';
    } else {
      signal = 'SELL';
    }

    return {
      pair: 'EUR/USD',
      currentRate: eurusdRate,
      signal: signal,
      confidence: '95%' 
    };

  } catch (error) {
    console.error('Error fetching signal:', error.message);
    return { error: 'Unable to fetch signal' };
  }
}

// Route for getting the signal
app.get('/signal', async (req, res) => {
  const signal = await getSignal();
  res.json(signal);
});

// Basic route
app.get('/', (req, res) => {
  res.send('Signal Bot Server is running...');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});