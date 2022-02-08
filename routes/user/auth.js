const router = require("express").Router();
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcryptjs");
const User = require("../../models/user");
const { signupValidation, signinValidation } = require("./validation");
const { accessToken } = require("./token");
const { refreshToken } = require("./refreshToken");

dotenv.config();

let refreshTokens = [];

router.post("/signup", async (req, res) => {
  const { error } = signupValidation.validate(req.body);
  if (error) return res.status(400).send({ message: error.details[0].message });

  /* check if email already exist */
  const isEmailExist = await User.findOne({ email: req.body.email });
  if (isEmailExist)
    return res.status(400).send({ message: "Email is already exist." });

  /* hash password */
  const salt = await bcrypt.genSalt(16);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  const newUser = new User({
    userId: uuidv4(),
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword,
    role: req.body.role,
    agreeToTerms: req.body.agreeToTerms,
  });

  try {
    if (!newUser.agreeToTerms) {
      return res.status(200).send({ message: "You must agree to terms." });
    }
    const addUser = await newUser.save();
    res.send(addUser);
  } catch (err) {
    res.status(400).send(err);
  }
});

router.post("/signin", async (req, res) => {
  const { error } = signinValidation.validate(req.body);
  if (error) return res.status(201).send(error.details[0].message);

  /* check if user email is exist/correct */
  const userInfo = await User.findOne({ email: req.body.email });
  if (!userInfo)
    return res
      .status(200)
      .send({ message: "Email or password is incorrect. //[EMAIL]" });

  /* check if password is match */
  const validPassword = await bcrypt.compare(
    req.body.password,
    userInfo.password
  );
  if (!validPassword)
    return res
      .status(200)
      .send({ message: "Email or password is incorrect. //[PASSWORD]" });

  const token1 = accessToken(userInfo.userId);
  const token2 = refreshToken(userInfo.userId);

  /* list down refreshToken to array */
  refreshTokens.push(token2);
  res.setHeader("auth-token", token1);

  /* response with accessToken and refreshToken */
  res.send({
    token: token1,
    refreshToken: token2,
  });
});

router.post("/renewAccessToken", async (req, res) => {
  const refreshToken = req.body.token;
  if (!refreshToken || !refreshTokens.includes(refreshToken)) {
    return res.status(403).json({
      status: failed,
      name: "renewAccessToken",
      method: "post",
      message: "renew token: @param{token}",
      error,
    });
  }

  jwt.verify(refreshToken, process.env.SECRET_REFRESH_TOKEN, (error, user) => {
    if (!error) {
      const accessToken = jwt.sign(
        { userId: user.userId },
        process.env.SECRET_TOKEN,
        {
          expiresIn: "1d",
        }
      );
      return res.status(201).json({
        status: "success",
        name: "renewAccessToken",
        method: "post",
        message: "renew token: @param{token}",
        data: accessToken,
      });
    } else {
      return res.status(403).json({
        status: failed,
        name: "renewAccessToken",
        method: "post",
        message: "renew token: @param{token}",
        error,
      });
    }
  });
});

module.exports = router;
