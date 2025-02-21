export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  
  try {
    // Fetch from NiteStats
    const response = await fetch('https://api.nitestats.com/v1/epic/lightswitch');
    const data = await response.json();
    
    // Return the data
    res.status(200).json(data);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to fetch status' });
  }
}
