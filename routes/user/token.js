const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");

dotenv.config();

const accessToken = (id) => {
  const token = jwt.sign({ userId: id }, process.env.SECRET_TOKEN, {
    expiresIn: "1d",
  });
  return token;
};

module.exports.accessToken = accessToken;
