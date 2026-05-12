const JWT = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).send({
        message: "please provide token",
      });
    }

    // get token from: Authorization: Bearer <token>
    const token = authHeader.split(" ")[1];
    JWT.verify(token, process.env.JWT_SECRET, (err, decode) => {
      if (err) {
        return res.status(401).send({
          message: "unauthorized user",
        });
      }

      req.user = decode;
      req.userId = decode.id;
      req.body = req.body || {};
      req.body.id = decode.id;
      next();
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "please provide token",
      error,
    });
  }
};
