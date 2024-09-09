const NodeGeocoder = require('node-geocoder');

// Options for Google Geocoding
const options = {
  provider: 'google',
  apiKey: 'AIzaSyCjKInqEFfmZUula4J3LJ4V6Lhm_GjK7l0', // Replace with your Google API key
  formatter: null // 'gpx', 'string', etc. 
};

const geocoder = NodeGeocoder(options);

module.exports = geocoder;
