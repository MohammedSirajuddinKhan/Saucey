module.exports = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).send({
        message: "Please login first",
      });
    }

    if (!["admin", "vendor"].includes(req.user.usertype)) {
      return res.status(403).send({
        message: "Admin or vendor access required",
      });
    }

    next();
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error in vendor authorization middleware",
      error,
    });
  }
};
