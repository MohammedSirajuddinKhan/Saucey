//get user info
const getUserController = async (req, res) => {
  res.status(200).send({
    message: "user data",
  });
};

module.exports = getUserController;
