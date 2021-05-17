const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");

const { MONGO_URI } = require("./src/config/mongodb");
const app = express();
app.use(
  express.urlencoded({
    extended: false,
  })
);

app.use(express.static(__dirname + '/public'));
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .catch((err) => {
    console.log(err);
  });

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header(
    "Access-Control-Allow-Headers",
    "Set-Cookie,Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Credentials", true);
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT,POST,PATCH,DELETE,GET");
    return res.status(200).json({});
  }
  next();
});

const userRoutes = require("./src/routes/user.routes");
const postRoutes = require("./src/routes/post.routes");
const fronendRoutes = require("./src/routes/frontend.routes")

app.use("/users", userRoutes);
app.use("/posts", postRoutes);
app.use("/", fronendRoutes)

app.use((req, res, next) => {
  const error = new Error("Not found!!!!!!");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

module.exports = app;
