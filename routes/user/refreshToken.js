const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");

dotenv.config();

const refreshToken = (id) => {
  const token = jwt.sign(
    { userId: id },
    process.env.SECRET_REFRESH_TOKEN,
    {
      expiresIn: "2d",
    }
  );
  return token;
};

module.exports.refreshToken = refreshToken;
