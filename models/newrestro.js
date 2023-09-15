const mongoose = require('mongoose')

const restaurantSchema = new mongoose.Schema({
    name: String,
    city: String,
    location_id: Number,
    city_id: Number,
    locality: String,
    thumb: Array,
    aggregate_rating: Number,
    rating_text: String,
    min_price: Number,
    contact_number: Number,
    cuisine: Array,
    mealtype_id: Number,
  })

  const Restaurant = mongoose.model('Restaurant', restaurantSchema)
// console.log(Restaurant);


module.exports = Restaurant;