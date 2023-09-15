const mongoose = require('mongoose')

const mealtypeSchema = mongoose.Schema({
    name: String,
    content: String,
    image: String,
    meal_type: Number,
})

const mealTypes = mongoose.model('meal_type', mealtypeSchema);
module.exports = mealTypes;