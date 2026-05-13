require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userModel = require("../models/userModel.js");
const restaurantModel = require("../models/restaurantModel.js");
const categoryModel = require("../models/categoryModel.js");
const foodModel = require("../models/foodModel.js");
const orderModel = require("../models/orderModel.js");

const seed = async () => {
  await mongoose.connect(process.env.MONGODB_URI);

  const beforeCounts = await Promise.all([
    userModel.countDocuments(),
    restaurantModel.countDocuments(),
    categoryModel.countDocuments(),
    foodModel.countDocuments(),
    orderModel.countDocuments(),
  ]);

  const hashPassword = async (value) => {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(value, salt);
  };

  const adminPassword = await hashPassword("Admin123!");
  const vendorPassword = await hashPassword("Vendor123!");
  const clientPassword = await hashPassword("Customer123!");

  const admin = await userModel.findOneAndUpdate(
    { email: "admin@biteme.test" },
    {
      $set: {
        username: "BiteMe Admin",
        email: "admin@biteme.test",
        password: adminPassword,
        phone: "9000000001",
        address: ["BiteMe HQ, Bandra Kurla Complex, Mumbai"],
        usertype: "admin",
        answer: "admin",
      },
    },
    { new: true, upsert: true, setDefaultsOnInsert: true },
  );

  const vendor = await userModel.findOneAndUpdate(
    { email: "vendor@biteme.test" },
    {
      $set: {
        username: "BiteMe Kitchen",
        email: "vendor@biteme.test",
        password: vendorPassword,
        phone: "9000000002",
        address: ["12 Market Lane, Indiranagar, Bengaluru"],
        usertype: "vendor",
        answer: "vendor",
      },
    },
    { new: true, upsert: true, setDefaultsOnInsert: true },
  );

  const client = await userModel.findOneAndUpdate(
    { email: "customer@biteme.test" },
    {
      $set: {
        username: "Customer One",
        email: "customer@biteme.test",
        password: clientPassword,
        phone: "9000000003",
        address: ["41 River Road, Andheri West, Mumbai"],
        usertype: "client",
        answer: "customer",
      },
    },
    { new: true, upsert: true, setDefaultsOnInsert: true },
  );

  const restaurantsData = [
    {
      title: "Bombay Tiffin House",
      imageUrl:
        "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80",
      time: "20-30 mins",
      pickup: true,
      delivery: true,
      isOpen: true,
      rating: 4.8,
      address: "18 Linking Road, Bandra West, Mumbai",
    },
    {
      title: "Biryani Bazaar",
      imageUrl:
        "https://images.unsplash.com/photo-1633321702518-7feccafb94d5?auto=format&fit=crop&w=1200&q=80",
      time: "25-35 mins",
      pickup: true,
      delivery: true,
      isOpen: true,
      rating: 4.7,
      address: "77 MG Road, Indiranagar, Bengaluru",
    },
    {
      title: "Masala Junction",
      imageUrl:
        "https://images.unsplash.com/photo-1604908177522-040eb2c7bd15?auto=format&fit=crop&w=1200&q=80",
      time: "18-28 mins",
      pickup: true,
      delivery: true,
      isOpen: true,
      rating: 4.6,
      address: "31 Park Street, Salt Lake, Kolkata",
    },
    {
      title: "Dosa Point",
      imageUrl:
        "https://images.unsplash.com/photo-1630383249896-424e482df921?auto=format&fit=crop&w=1200&q=80",
      time: "15-25 mins",
      pickup: true,
      delivery: true,
      isOpen: true,
      rating: 4.9,
      address: "14 Anna Salai, T. Nagar, Chennai",
    },
  ];

  const restaurants = [];
  for (const restaurantData of restaurantsData) {
    const restaurant = await restaurantModel.findOneAndUpdate(
      { title: restaurantData.title },
      {
        $set: {
          ...restaurantData,
          owner: admin._id,
        },
      },
      { new: true, upsert: true, setDefaultsOnInsert: true },
    );
    restaurants.push(restaurant);
  }

  const categoriesData = [
    {
      title: "South Indian",
      imageUrl:
        "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=1200&q=80",
      restaurant: restaurants[3]._id,
    },
    {
      title: "Biryani",
      imageUrl:
        "https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=1200&q=80",
      restaurant: restaurants[1]._id,
    },
    {
      title: "Street Food",
      imageUrl:
        "https://images.unsplash.com/photo-1526318896980-cf78c088247c?auto=format&fit=crop&w=1200&q=80",
      restaurant: restaurants[0]._id,
    },
    {
      title: "North Indian",
      imageUrl:
        "https://images.unsplash.com/photo-1598103442097-8b74394b95c6?auto=format&fit=crop&w=1200&q=80",
      restaurant: restaurants[2]._id,
    },
    {
      title: "Thali",
      imageUrl:
        "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=1200&q=80",
      restaurant: restaurants[0]._id,
    },
    {
      title: "Rolls",
      imageUrl:
        "https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=1200&q=80",
      restaurant: restaurants[2]._id,
    },
    {
      title: "Tiffins",
      imageUrl:
        "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=1200&q=80",
      restaurant: restaurants[3]._id,
    },
    {
      title: "Wraps",
      imageUrl:
        "https://images.unsplash.com/photo-1509722747041-616f39b57569?auto=format&fit=crop&w=1200&q=80",
      restaurant: restaurants[0]._id,
    },
  ];

  const categories = [];
  for (const categoryData of categoriesData) {
    const category = await categoryModel.findOneAndUpdate(
      {
        title: categoryData.title,
        restaurant: categoryData.restaurant,
      },
      { $set: categoryData },
      { new: true, upsert: true, setDefaultsOnInsert: true },
    );
    categories.push(category);
  }

  const foodsData = [
    {
      title: "Vada Pav Combo",
      description: "Mumbai-style vada pav with fried chilli and lemon soda.",
      price: 89,
      imageUrl:
        "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=1200&q=80",
      restaurant: restaurants[0]._id,
      category: categories[2]._id,
      rating: 4.8,
      isAvailable: true,
      ingredients: ["Potato patty", "Pav", "Dry chutney", "Lemon soda"],
    },
    {
      title: "Pav Bhaji Feast",
      description: "Butter pav with slow-cooked bhaji and onion-lime salad.",
      price: 149,
      imageUrl:
        "https://images.unsplash.com/photo-1625938145744-8b8b1b6c2fdf?auto=format&fit=crop&w=1200&q=80",
      restaurant: restaurants[0]._id,
      category: categories[4]._id,
      rating: 4.7,
      isAvailable: true,
      ingredients: ["Pav", "Bhaji", "Butter", "Onion salad"],
    },
    {
      title: "Rawa Masala Dosa",
      description: "Crispy dosa with potato masala, chutney, and sambar.",
      price: 129,
      imageUrl:
        "https://images.unsplash.com/photo-1630383249896-424e482df921?auto=format&fit=crop&w=1200&q=80",
      restaurant: restaurants[3]._id,
      category: categories[0]._id,
      rating: 4.9,
      isAvailable: true,
      ingredients: [
        "Rava batter",
        "Potato masala",
        "Coconut chutney",
        "Sambar",
      ],
    },
    {
      title: "Idli Sambar Set",
      description: "Soft idlis served with sambar and two house chutneys.",
      price: 99,
      imageUrl:
        "https://images.unsplash.com/photo-1626132647523-66d8b9c6d04b?auto=format&fit=crop&w=1200&q=80",
      restaurant: restaurants[3]._id,
      category: categories[6]._id,
      rating: 4.6,
      isAvailable: true,
      ingredients: ["Idli", "Sambar", "Coconut chutney", "Tomato chutney"],
    },
    {
      title: "Hyderabadi Chicken Biryani",
      description: "Layered rice, saffron, kebab-style chicken, and raita.",
      price: 329,
      imageUrl:
        "https://images.unsplash.com/photo-1563379091339-03246963d0d3?auto=format&fit=crop&w=1200&q=80",
      restaurant: restaurants[1]._id,
      category: categories[1]._id,
      rating: 4.9,
      isAvailable: true,
      ingredients: ["Chicken", "Basmati rice", "Saffron", "Raita"],
    },
    {
      title: "Kolkata Chicken Roll",
      description: "Egg paratha wrap with spiced chicken and onion salad.",
      price: 179,
      imageUrl:
        "https://images.unsplash.com/photo-1565299507177-b0ac66763828?auto=format&fit=crop&w=1200&q=80",
      restaurant: restaurants[2]._id,
      category: categories[5]._id,
      rating: 4.5,
      isAvailable: true,
      ingredients: ["Chicken", "Paratha", "Egg", "Onion salad"],
    },
    {
      title: "Amritsari Chole Kulche",
      description: "Street-style chole with stuffed kulcha and pickled onions.",
      price: 159,
      imageUrl:
        "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=1200&q=80",
      restaurant: restaurants[2]._id,
      category: categories[3]._id,
      rating: 4.8,
      isAvailable: true,
      ingredients: ["Chole", "Kulcha", "Pickled onions", "Mint chutney"],
    },
    {
      title: "Paneer Butter Masala Thali",
      description: "Rich paneer curry served with roti, rice, and salad.",
      price: 239,
      imageUrl:
        "https://images.unsplash.com/photo-1598103442097-8b74394b95c6?auto=format&fit=crop&w=1200&q=80",
      restaurant: restaurants[2]._id,
      category: categories[3]._id,
      rating: 4.7,
      isAvailable: true,
      ingredients: ["Paneer", "Butter gravy", "Roti", "Rice"],
    },
    {
      title: "Cheese Dabeli",
      description: "Sweet-spicy dabeli with cheese, pomegranate, and sev.",
      price: 79,
      imageUrl:
        "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=1200&q=80",
      restaurant: restaurants[0]._id,
      category: categories[2]._id,
      rating: 4.6,
      isAvailable: true,
      ingredients: ["Spiced potato", "Pav", "Cheese", "Sev"],
    },
    {
      title: "Mysore Masala Dosa",
      description: "Spicy chutney dosa with potato filling and sambar.",
      price: 139,
      imageUrl:
        "https://images.unsplash.com/photo-1601050690117-5b5b6f5c4b08?auto=format&fit=crop&w=1200&q=80",
      restaurant: restaurants[3]._id,
      category: categories[0]._id,
      rating: 4.8,
      isAvailable: true,
      ingredients: ["Dosa", "Red chutney", "Potato filling", "Sambar"],
    },
    {
      title: "Veg Uttapam Trio",
      description: "Thick rice pancake topped with onion, tomato, and chilli.",
      price: 119,
      imageUrl:
        "https://images.unsplash.com/photo-1630383249896-424e482df921?auto=format&fit=crop&w=1200&q=80",
      restaurant: restaurants[3]._id,
      category: categories[6]._id,
      rating: 4.5,
      isAvailable: true,
      ingredients: ["Rice batter", "Onion", "Tomato", "Chilli"],
    },
    {
      title: "Butter Chicken Rice Bowl",
      description: "Smoky butter chicken over jeera rice with onion salad.",
      price: 299,
      imageUrl:
        "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=1200&q=80",
      restaurant: restaurants[2]._id,
      category: categories[3]._id,
      rating: 4.9,
      isAvailable: true,
      ingredients: ["Butter chicken", "Jeera rice", "Onion salad", "Ghee"],
    },
    {
      title: "Malabar Parotta Chicken Curry",
      description: "Kerala-style parotta with rich chicken curry and pickle.",
      price: 269,
      imageUrl:
        "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=1200&q=80",
      restaurant: restaurants[1]._id,
      category: categories[1]._id,
      rating: 4.7,
      isAvailable: true,
      ingredients: ["Parotta", "Chicken curry", "Pickle", "Coconut"],
    },
  ];

  const foods = [];
  for (const foodData of foodsData) {
    const food = await foodModel.findOneAndUpdate(
      { title: foodData.title, restaurant: foodData.restaurant },
      { $set: foodData },
      { new: true, upsert: true, setDefaultsOnInsert: true },
    );
    foods.push(food);
  }

  const restaurantIds = [
    ...new Set(foods.map((food) => food.restaurant.toString())),
  ];
  for (const restaurantId of restaurantIds) {
    const foodIds = foods
      .filter((food) => food.restaurant.toString() === restaurantId)
      .map((food) => food._id);

    await restaurantModel.updateOne(
      { _id: restaurantId },
      { $set: { foods: foodIds } },
    );
  }

  const seededOrders = [];
  const orderSeeds = [
    {
      buyer: client._id,
      restaurant: restaurants[0]._id,
      food: foods[0],
      quantity: 2,
      address: client.address?.[0] || "41 River Road, Andheri West, Mumbai",
      status: "Preparing",
      paymentType: "COD",
      isPaid: false,
    },
    {
      buyer: client._id,
      restaurant: restaurants[3]._id,
      food: foods[2],
      quantity: 1,
      address: client.address?.[0] || "41 River Road, Andheri West, Mumbai",
      status: "Pending",
      paymentType: "Card",
      isPaid: true,
    },
    {
      buyer: vendor._id,
      restaurant: restaurants[1]._id,
      food: foods[4],
      quantity: 1,
      address: vendor.address?.[0] || "12 Market Lane, Indiranagar, Bengaluru",
      status: "Out for delivery",
      paymentType: "COD",
      isPaid: false,
    },
  ];

  for (const orderSeed of orderSeeds) {
    const seededOrder = await orderModel.findOneAndUpdate(
      {
        buyer: orderSeed.buyer,
        restaurant: orderSeed.restaurant,
        address: orderSeed.address,
      },
      {
        $set: {
          foods: [
            {
              food: orderSeed.food._id,
              quantity: orderSeed.quantity,
              title: orderSeed.food.title,
              price: orderSeed.food.price,
            },
          ],
          address: orderSeed.address,
          total: orderSeed.food.price * orderSeed.quantity,
          status: orderSeed.status,
          paymentType: orderSeed.paymentType,
          isPaid: orderSeed.isPaid,
        },
      },
      { new: true, upsert: true, setDefaultsOnInsert: true },
    );

    seededOrders.push(seededOrder);
  }

  const afterCounts = await Promise.all([
    userModel.countDocuments(),
    restaurantModel.countDocuments(),
    categoryModel.countDocuments(),
    foodModel.countDocuments(),
    orderModel.countDocuments(),
  ]);

  console.log(
    JSON.stringify(
      {
        beforeCounts: {
          users: beforeCounts[0],
          restaurants: beforeCounts[1],
          categories: beforeCounts[2],
          foods: beforeCounts[3],
          orders: beforeCounts[4],
        },
        afterCounts: {
          users: afterCounts[0],
          restaurants: afterCounts[1],
          categories: afterCounts[2],
          foods: afterCounts[3],
          orders: afterCounts[4],
        },
        credentials: {
          admin: { email: "admin@biteme.test", password: "Admin123!" },
          vendor: { email: "vendor@biteme.test", password: "Vendor123!" },
          client: { email: "customer@biteme.test", password: "Customer123!" },
        },
        ids: {
          admin: admin._id.toString(),
          vendor: vendor._id.toString(),
          client: client._id.toString(),
          restaurants: restaurants.map((restaurant) =>
            restaurant._id.toString(),
          ),
          categories: categories.map((category) => category._id.toString()),
          foods: foods.map((food) => food._id.toString()),
          seededOrders: seededOrders.map((order) => order._id.toString()),
        },
      },
      null,
      2,
    ),
  );

  await mongoose.disconnect();
};

seed().catch((error) => {
  console.error(error);
  mongoose.disconnect().finally(() => process.exit(1));
});
