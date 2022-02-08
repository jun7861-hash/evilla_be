const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");

dotenv.config();

module.exports = (req, res, next) => {
  const token = req.header("auth-token");
  if (!token) return res.status(403).json({ message: "Access denied!" });

  try {
    const verified = jwt.verify(token, process.env.SECRET_TOKEN);
    req.user = verified;
    next();
  } catch (error) {
    res.status(400).send(error);
  }
};
