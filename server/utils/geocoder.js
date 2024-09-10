const NodeGeocoder = require('node-geocoder');

// Options for Google Geocoding
const options = {
  provider: 'google',
  apiKey: process.env.GOOGLE_MAPS_API_KEY, // Replace with your Google API key
  formatter: null // 'gpx', 'string', etc. 
};

const geocoder = NodeGeocoder(options);

module.exports = geocoder;
