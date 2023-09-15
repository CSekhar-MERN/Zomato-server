const mongoose = require('mongoose')

// location Schema
const locationSchema = new mongoose.Schema({
    name: String,
    city_id: String,
    location_id: String,
    city: String,
    country_name: String,
  });

  const locations = mongoose.model('locations', locationSchema);

  module.exports = locations;