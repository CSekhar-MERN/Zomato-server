const express = require("express");
const mongoose = require("mongoose");
const locations = require("./models/location");
const Restaurant = require("./models/newrestro");
const mealTypes = require("./models/mealtype");
const menuitem = require("./models/menu-item");
const User = require("./models/users");
const cors = require("cors"); // Import the cors package
const menuItem = require("./models/menu-item");

// const uri = "mongodb://127.0.0.1/zomato";
const uri =
  "mongodb+srv://ChandraSekhar:VmE7MlxssUxOOUu9@zomatoclustor.xcush5e.mongodb.net/zomato?retryWrites=true&w=majority";

mongoose.connect(uri, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

const app = express();

// Enable CORS for all routes
app.use(express.json());
app.use(cors());

// Define the restaurant schema
const restaurantSchema = new mongoose.Schema({
  name: String,
  city: String,
  locality: String,
});

const Restaurantss = mongoose.model("Restaurantss", restaurantSchema);
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

// app.set('view engine', 'ejs');
// app.use(express.urlencoded({ extended: true }));

// Routes
app.get("/", (req, res) => {
  res.render("index");
  // res.send('Hello there')
});

app.post("/restaurants", async (req, res) => {
  const restaurant = new Restaurantss(req.body);
  await restaurant.save();
  res.redirect("/restaurants");
  // const { name, city, locality } = req.body;
  // const restaurant = new Restaurant({ name, city, locality });
  // restaurant.save()
  // .then(() => res.redirect('/restaurants'))
  // .catch((error) => console.error('Error saving restaurant:', error));
});

app.get("/restaurants", async (req, res) => {
  const restaurants = await Restaurantss.find({});

  // restaurants.forEach((restaurants) =>{
  //   // console.log(restaurants.city)
  // });

  res.render("restaurants", { restaurants });
});

app.get("/mealtypes", async (req, res) => {
  try {
    const mealData = await mealTypes.find({});
    res.json(mealData);
  } catch (error) {
    console.log("Eroor in fetching meal_types is :", error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/locations", async (req, res) => {
  try {
    const locationsData = await locations.find({});
    locationsData.forEach((location) => {
      // console.log(location.city);
    });
    res.json(locationsData);
    // res.render('locations', { locations: locationsData });
  } catch (error) {
    console.error("Error fetching locations:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/restro", async (req, res) => {
  try {
    const restroData = await Restaurant.find({});
    restroData.forEach((restro) => {
      // console.log(restro.location_id)
    });
    res.json(restroData);
  } catch (error) {
    console.error("Error fetching locations:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/restroById/:id", async (req, res) => {
  const { id } = req.params;
  console.log("id is ", id);
  try {
    const restroData = await Restaurant.findById({ _id: id });
    res.json(restroData);
  } catch (error) {
    console.error("Error fetching locations:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/restro/:city", async function (req, res) {
  const { city } = req.params;
  try {
    const result = await Restaurant.find({ city: city });
    console.log("Result By City is : " + result);

    result.forEach((city) => {
      console.log();
    });

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/restroByCityId/:city_id", async function (req, res) {
  const { city_id } = req.params;
  try {
    const result = await Restaurant.find({ city_id: city_id });
    console.log("Result By CityId is : " + result);

    result.forEach((city_id) => {
      console.log();
    });

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/restroByMeal/:mealtype_id", async (req, res) => {
  try {
    const mealtype_id = Number(req.params.mealtype_id);
    console.log("Received mealtype_id:", mealtype_id);

    const restaurants = await Restaurant.find({ mealtype_id });

    if (restaurants.length === 0) {
      console.log("No matching restaurants found");
      return res.json({
        message: "No matching restaurants found",
        response: [],
      });
    }

    console.log("Filter Mealtype restaurants:", restaurants);

    res.json({ message: "Data fetched", restaurants });
  } catch (error) {
    console.error("Error fetching restaurants:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get(
  "/restroByMeal&Location/:mealtype_id/:location_id",
  async (req, res) => {
    try {
      const location_id = Number(req.params.location_id);
      const mealtype_id = Number(req.params.mealtype_id);

      console.log("MealType_id, locattion_id is : ", mealtype_id, location_id);

      const restaurants = await Restaurant.find({ mealtype_id, location_id });

      res.json({ message: "Data fetched", restaurants });
      console.log("Location&Meal data is : ", restaurants);
    } catch (error) {
      console.error("Error fetching restaurants:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

app.get("/restroByLocation/:location_id", async function (req, res) {
  try {
    const location_id = Number(req.params.location_id);

    console.log("Received mealtype_id:", location_id);

    const restaurants = await Restaurant.find({ location_id });

    if (restaurants.length === 0) {
      console.log("No matching restaurants found");
      return res.json({
        message: "No matching restaurants found",
        response: [],
      });
    }

    console.log("Found restaurants:", restaurants);

    res.json({ message: "Data fetched", response: restaurants });
  } catch (error) {
    console.error("Error fetching restaurants:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/restroByCuisine/:cuisineId", async (req, res) => {
  try {
    const cuisineId = Number(req.params.cuisineId);

    console.log("Received mealtype_id:", cuisineId);

    const restaurants = await Restaurant.find({ "cuisine.id": cuisineId });

    if (restaurants.length === 0) {
      console.log("No matching restaurants found");
      return res.json({
        message: "No matching restaurants found",
        response: [],
      });
    }

    console.log("Found restaurants:", restaurants);

    res.json({ message: "Data fetched", response: restaurants });
  } catch (error) {
    console.error("Error fetching restaurants:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/restroByPriceRange/:minPrice/:maxPrice", async (req, res) => {
  try {
    const minPrice = Number(req.params.minPrice);
    const maxPrice = Number(req.params.maxPrice);

    console.log("Received minPrice:", minPrice);
    console.log("Received maxPrice:", maxPrice);

    const restaurants = await Restaurant.find({
      min_price: { $gte: minPrice, $lte: maxPrice },
    });

    if (restaurants.length === 0) {
      console.log("No matching restaurants found");
      return res.json({
        message: "No matching restaurants found",
        response: [],
      });
    }

    console.log("Found restaurants:", restaurants);

    res.json({ message: "Data fetched", response: restaurants });
  } catch (error) {
    console.error("Error fetching restaurants by price range:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// const menu = new menuitem({
//   restaurant_name: "Domino's",
//   restaurant_id: '64815bf5f4bf015f13c76693',
//   menu_items: [{name: 'Corn Pizza', description: 'A delectable combination of sweet and juicy golden corn', price: 379, qty: 10, image_url: 'Assets/breakfast.jpg'},{name: 'Margherita', description: 'Classic delight with 100% real mozzarella cheese', price: 239, qty: 4, image_url: 'Assets/breakfast.jpg'},{name: 'Farmhosue', description: 'Delightful combination of onion capsicum, tomato & grilled mashroom', price: 459, qty: 6, image_url: 'Assets/breakfast.jpg'}]
// })
// console.log(menu);
// menu.save();
app.get("/menuItem/:restaurant_id", async (req, res) => {
  const { restaurant_id } = req.params;
  console.log("restaurant_id is ", restaurant_id);
  try {
    const menuData = await menuitem.find({ restaurant_id: restaurant_id });
    menuData.forEach((menu) => {
      // console.log(location.city);
    });
    res.json(menuData);
    // res.render('locations', { locations: locationsData });
  } catch (error) {
    console.error("Error fetching Menu Items:", error);
    res.status(500).send("Internal Server Error");
  }
});


app.post("/signup", async (req, res) => {
  console.log("signup data is : ", req.body);
  const user_data = new User({
    fullname: req.body.fullname,
    email: req.body.email,
    password: req.body.password,
  });
  console.log("user data is : ", user_data);
  // Find the email is already exist in database or not
  const verify = await User.find({ email: req.body.email });
  let result = true;
  // If exist then send false message to front end
  if (verify.length > 0) {
    result = false;
    console.log("User Email is already found in database ");
  }
  // If not exist save in database
  else {
    const user = await user_data.save();
    console.log("New User is stored in database " + user);
    result = true;
    // console.log('Data is already found in database ')
  }
  try {
    // const user = await user_data.save();
    res.status(200).json(result);
  } catch (err) {
    res.send(err);
  }
});

// Login Api
app.post("/login", async (req, res) => {
  // Get the values from request body
  const payload = {
    email: req.body.email,
    password: req.body.password,
  };

  // Find the email and password in database.
  const verify = await User.find(payload);
  console.log("Find data is : ", verify);
  // If email and password is correct then send true to front end.
  if (verify.length > 0) {
    result = true;
  }
  // Otherwise send false to front end.
  else {
    result = false;
  }
  try {
    res.status(200).json(verify);
  } catch (err) {
    res.send(err);
  }
});

// Start the server
app.listen(5000, () => {
  console.log("Server started on port 5000");
});
