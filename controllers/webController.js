const restaurantModel = require("../models/restaurantModel.js");
const categoryModel = require("../models/categoryModel.js");
const foodModel = require("../models/foodModel.js");
const userModel = require("../models/userModel.js");
const orderModel = require("../models/orderModel.js");
const mongoose = require("mongoose");
const JWT = require("jsonwebtoken");

const getCookieValue = (cookieHeader, name) => {
  if (!cookieHeader) {
    return null;
  }

  const cookies = cookieHeader.split(";").map((item) => item.trim());
  const cookie = cookies.find((item) => item.startsWith(`${name}=`));
  if (!cookie) {
    return null;
  }

  return decodeURIComponent(cookie.split("=").slice(1).join("="));
};

const resolveViewer = async (req) => {
  try {
    const token = getCookieValue(req.headers.cookie, "bitemeToken");
    if (!token) {
      return null;
    }

    const decoded = JWT.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findById(decoded.id).lean();
    if (!user) {
      return null;
    }

    return {
      id: user._id.toString(),
      username: user.username,
      email: user.email,
      phone: user.phone,
      address: user.address,
      profile: user.profile,
      usertype: user.usertype,
    };
  } catch (error) {
    return null;
  }
};

const requireViewer = async (req, res) => {
  const viewer = await resolveViewer(req);
  if (!viewer) {
    res.redirect("/login");
    return null;
  }
  return viewer;
};

const homePageController = async (req, res) => {
  try {
    const query = (req.query.q || "").trim();
    const viewer = await resolveViewer(req);

    const [restaurants, categories, foods] = await Promise.all([
      restaurantModel
        .find({})
        .populate("owner", "username usertype")
        .sort({ createdAt: -1 })
        .limit(12)
        .lean(),
      categoryModel
        .find({})
        .populate("restaurant", "title address imageUrl")
        .sort({ createdAt: -1 })
        .limit(12)
        .lean(),
      foodModel
        .find({})
        .populate("restaurant", "title address imageUrl")
        .populate("category", "title")
        .sort({ createdAt: -1 })
        .limit(12)
        .lean(),
    ]);

    const normalize = (items) => {
      if (!query) return items;
      const needle = query.toLowerCase();
      return items.filter((item) => {
        const values = [
          item.title,
          item.address,
          item.description,
          item.owner?.username,
          item.category?.title,
          item.restaurant?.title,
        ];
        return values
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(needle));
      });
    };

    const filteredRestaurants = normalize(restaurants);
    const filteredCategories = normalize(categories);
    const filteredFoods = normalize(foods);

    return res.status(200).render("index", {
      query,
      restaurants: filteredRestaurants,
      categories: filteredCategories,
      foods: filteredFoods,
      viewer,
      cuisineChips: filteredCategories.slice(0, 8),
      stats: {
        restaurants: filteredRestaurants.length,
        categories: filteredCategories.length,
        foods: filteredFoods.length,
      },
      featuredRestaurant: filteredRestaurants[0] || null,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send("Failed to load home page");
  }
};

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const restaurantPageController = async (req, res) => {
  try {
    const viewer = await resolveViewer(req);
    if (!isValidObjectId(req.params.id)) {
      return res.status(404).render("404");
    }

    const restaurant = await restaurantModel
      .findById(req.params.id)
      .populate("owner", "username email phone usertype")
      .lean();

    if (!restaurant) {
      return res.status(404).render("restaurant", {
        restaurant: null,
        foods: [],
        categories: [],
        viewer,
      });
    }

    const [foods, categories] = await Promise.all([
      foodModel
        .find({ restaurant: restaurant._id })
        .populate("category", "title")
        .sort({ createdAt: -1 })
        .lean(),
      categoryModel
        .find({ restaurant: restaurant._id })
        .sort({ createdAt: -1 })
        .lean(),
    ]);

    return res.status(200).render("restaurant", {
      restaurant,
      foods,
      categories,
      viewer,
      similarRestaurants: [],
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send("Failed to load restaurant page");
  }
};

const loginPageController = async (req, res) => {
  try {
    const viewer = await resolveViewer(req);
    if (viewer) {
      return res.redirect("/");
    }

    return res.status(200).render("login", {
      activePage: "login",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send("Failed to load login page");
  }
};

const registerPageController = async (req, res) => {
  try {
    const viewer = await resolveViewer(req);
    if (viewer) {
      return res.redirect("/");
    }

    return res.status(200).render("register", {
      activePage: "register",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send("Failed to load register page");
  }
};

const foodPageController = async (req, res) => {
  try {
    const viewer = await resolveViewer(req);
    if (!isValidObjectId(req.params.id)) {
      return res.status(404).render("404");
    }

    const food = await foodModel
      .findById(req.params.id)
      .populate("restaurant", "title address imageUrl rating time isOpen")
      .populate("category", "title imageUrl")
      .lean();

    if (!food) {
      return res.status(404).render("404");
    }

    const similarFoods = await foodModel
      .find({
        restaurant: food.restaurant?._id,
        _id: { $ne: food._id },
      })
      .populate("category", "title")
      .sort({ createdAt: -1 })
      .limit(4)
      .lean();

    return res.status(200).render("food", {
      viewer,
      food,
      similarFoods,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send("Failed to load food page");
  }
};

const checkoutPageController = async (req, res) => {
  try {
    const viewer = await requireViewer(req, res);
    if (!viewer) return;

    if (!isValidObjectId(req.params.id)) {
      return res.status(404).render("404");
    }

    const food = await foodModel
      .findById(req.params.id)
      .populate("restaurant", "title address imageUrl rating time isOpen")
      .populate("category", "title")
      .lean();

    if (!food) {
      return res.status(404).render("404");
    }

    const defaultAddress = Array.isArray(viewer.address)
      ? viewer.address[0] || ""
      : viewer.address || "";

    return res.status(200).render("checkout", {
      viewer,
      food,
      defaultAddress,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send("Failed to load checkout page");
  }
};

const profilePageController = async (req, res) => {
  try {
    const viewer = await requireViewer(req, res);
    if (!viewer) return;

    const recentOrders = await orderModel
      .find({ buyer: viewer.id })
      .populate("restaurant", "title address imageUrl")
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    return res.status(200).render("profile", {
      viewer,
      recentOrders,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send("Failed to load profile page");
  }
};

const ordersPageController = async (req, res) => {
  try {
    const viewer = await requireViewer(req, res);
    if (!viewer) return;

    const orders = await orderModel
      .find({ buyer: viewer.id })
      .populate("restaurant", "title address imageUrl")
      .populate("foods.food", "title imageUrl price")
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).render("orders", {
      viewer,
      orders,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send("Failed to load orders page");
  }
};

const orderDetailPageController = async (req, res) => {
  try {
    const viewer = await requireViewer(req, res);
    if (!viewer) return;

    if (!isValidObjectId(req.params.id)) {
      return res.status(404).render("404");
    }

    const filter =
      viewer.usertype === "admin"
        ? { _id: req.params.id }
        : { _id: req.params.id, buyer: viewer.id };
    const order = await orderModel
      .findOne(filter)
      .populate("restaurant", "title address imageUrl")
      .populate("buyer", "username email phone address")
      .populate("foods.food", "title imageUrl price")
      .lean();

    if (!order) {
      return res.status(404).render("404");
    }

    return res.status(200).render("order-detail", {
      viewer,
      order,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send("Failed to load order detail page");
  }
};

const adminPageController = async (req, res) => {
  try {
    const viewer = await requireViewer(req, res);
    if (!viewer) return;

    if (!["admin", "vendor"].includes(viewer.usertype)) {
      return res.redirect("/");
    }

    const [
      usersCount,
      restaurantsCount,
      categoriesCount,
      foodsCount,
      ordersCount,
      users,
      restaurants,
      categories,
      foods,
      orders,
      orderStatusBreakdown,
      paymentBreakdown,
    ] = await Promise.all([
      userModel.countDocuments({}),
      restaurantModel.countDocuments({}),
      categoryModel.countDocuments({}),
      foodModel.countDocuments({}),
      orderModel.countDocuments({}),
      userModel
        .find({})
        .sort({ createdAt: -1 })
        .limit(viewer.usertype === "admin" ? 8 : 4)
        .lean(),
      restaurantModel
        .find({})
        .populate("owner", "username email usertype")
        .sort({ createdAt: -1 })
        .limit(8)
        .lean(),
      categoryModel
        .find({})
        .populate("restaurant", "title")
        .sort({ createdAt: -1 })
        .limit(8)
        .lean(),
      foodModel
        .find({})
        .populate("restaurant", "title")
        .populate("category", "title")
        .sort({ createdAt: -1 })
        .limit(8)
        .lean(),
      orderModel
        .find({})
        .populate("restaurant", "title")
        .populate("buyer", "username email")
        .populate("foods.food", "title price")
        .sort({ createdAt: -1 })
        .limit(10)
        .lean(),
      orderModel.aggregate([
        { $group: { _id: "$status", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
      orderModel.aggregate([
        { $group: { _id: "$paymentType", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
    ]);

    return res.status(200).render("admin", {
      viewer,
      usersCount,
      restaurantsCount,
      categoriesCount,
      foodsCount,
      ordersCount,
      users,
      restaurants,
      categories,
      foods,
      orders,
      orderStatusBreakdown,
      paymentBreakdown,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send("Failed to load admin page");
  }
};

module.exports = {
  homePageController,
  restaurantPageController,
  loginPageController,
  registerPageController,
  foodPageController,
  checkoutPageController,
  profilePageController,
  ordersPageController,
  orderDetailPageController,
  adminPageController,
};
