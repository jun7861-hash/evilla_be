const router = require("express").Router();
const verify = require("./verifyToken");
const User = require("../../models/user");
const { propertyValidation } = require("../property/validation");

/* get all users */
router.get("/user", verify, async (req, res) => {
  const match = {};
  const sort = {};

  /* sample filter */
  if (req.query.role) {
    match.role = req.query.role === "1";
  }

  /* sample sort by and order by */
  if (req.query.sortby && req.query.orderby) {
    sort[req.query.sortby] = req.query.orderby === "desc" ? -1 : 1;
  }

  try {
    const { page, limit } = req.query;

    const data = await User.find()
      .limit(parseInt(limit) * 1)
      .skip((parseInt(page) - 1) * limit)
      .populate({
        path: "user",
        match,
        options: {
          sort,
        },
      })
      .exec();
    res.status(200).json({
      status: "success",
      name: "getAllUsers",
      method: "get",
      message: "Fetch successfully!",
      params: {
        page: "Number",
        limit: "Number",
      },
      data: data,
      total: data.length,
    });
  } catch (error) {
    res.status(400).json({
      status: "failed",
      name: "getAllUsers",
      method: "get",
      message: "Fetch failed",
      params: {
        page: "Number",
        limit: "Number",
      },
      error,
    });
  }
});

/* get user by userId */
router.get("/user/:userId", verify, async (req, res) => {
  try {
    const data = await User.findOne(req.params);s
    res.status(200).json({
      status: "success",
      name: "getUserById",
      method: "get",
      message: "Fetch successfully!",
      params: {
        id: "String",
      },
      data: data,
    });
  } catch (error) {
    res.status(400).json({
      status: "failed",
      name: "getUserById",
      method: "get",
      message: "Fetch failed",
      params: {
        id: "String",
      },
      error,
    });
  }
});

/* update user by userId */
router.patch("/user/:userId", verify, async (req, res) => {
  try {
    const data = await User.findOneAndUpdate(req.params, req.body);
    res.status(200).json({
      status: "success",
      name: "updateUserById",
      method: "patch",
      message: "Update successfully!",
      params: {
        id: "String",
        payload: "Object",
      },
      data: data,
    });
  } catch (error) {
    res.status(400).json({
      status: "failed",
      name: "updateUserById",
      method: "patch",
      message: "Update failed",
      params: {
        id: "String",
        payload: "Object",
      },
      error,
    });
  }
});

/* delete user by userId */
router.delete("/user/:userId", verify, async (req, res) => {
  try {
    const data = await User.findOneAndDelete(req.params);
    res.status(200).json({
      status: "success",
      name: "deleteUserById",
      method: "delete",
      message: "Delete successfully!",
      params: {
        id: "String",
      },
      data: data,
    });
  } catch (error) {
    res.status(400).json({
      status: "failed",
      name: "deleteUserById",
      method: "delete",
      message: "Delete failed",
      params: {
        id: "String",
      },
      error,
    });
  }
});

/* add property */
router.post("/property", async (req, res) => {
  const { error } = propertyValidation.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

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

module.exports = router;
