const JWT = require("jsonwebtoken");
const userModel = require("../models/userModel.js");

const getCookieValue = (cookieHeader, name) => {
  if (!cookieHeader) return null;

  const cookies = cookieHeader.split(";").map((item) => item.trim());
  const match = cookies.find((item) => item.startsWith(`${name}=`));

  if (!match) return null;

  return decodeURIComponent(match.slice(name.length + 1));
};

module.exports = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const queryToken = req.query?.Authorization || req.query?.authorization;
    const cookieToken = getCookieValue(req.headers.cookie, "bitemeToken");

    const tokenSource = authHeader || queryToken || cookieToken;

    if (!tokenSource) {
      return res.status(401).send({
        message: "please provide token",
      });
    }

    const token = tokenSource.startsWith("Bearer ")
      ? tokenSource.split(" ")[1]
      : tokenSource;

    const decode = JWT.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findById(decode.id);

    if (!user) {
      return res.status(401).send({
        message: "unauthorized user",
      });
    }

    req.user = user;
    req.userId = user._id;
    req.body = req.body || {};
    req.body.id = user._id;
    next();
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: "please provide token",
      error,
    });
  }
};
