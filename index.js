const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

const app = express();

dotenv.config();

// CONNECT TO DB
mongoose.connect(
  process.env.DB_CONNECT,
  {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  },
  () => console.log("connected to mongoDB...")
);

// MODEL MIDDLEWARE
app.use(express.json());

// AUTH ROUTER
const authRouter = require("./routes/user/auth");
app.use("/", authRouter);

// USER ROUTER
const userRouter = require("./routes/user/user");
app.use("/", userRouter);

// PROPERTY ROUTER
const propertyRouter = require("./routes/property/property");
app.use("/", propertyRouter);

app.listen(3000, () => console.log("Server is running at port 3000..."));
