module.exports = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).send({
        message: "Please login first",
      });
    }

    if (req.user.usertype !== "admin") {
      return res.status(403).send({
        message: "Admin access required",
      });
    }

    next();
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error in admin middleware",
      error,
    });
  }
};
