const jwt = require("jsonwebtoken");

const userModel = require("../models/userModel");

const login = async (req, res) => {
  var payload = [];
  payload["title"] = "Login";

  const { email, password } = req.body;
  console.log("--->", email, password);
  if (email == undefined && password == undefined) {
    res.render("user/login", payload);
  } else {
    const user = await userModel.findOne({ email, password });
    console.log(user._id);
    if (user) {
      req.session.isLoggedIn = true;
      req.session.userId = user._id;
      res.redirect("/");

    }
  }
};

const accessTokenSecret = "youraccesstokensecret";

const authorize = async (req, res, next) => {
  const { email, password } = req.body;
  console.log("--->", email, password);
  // const users = await userModel.findOne({ email, password });

  // Filter user from the users array by username and password
  const user = await userModel.findOne({ email, password });
  console.log(user);

  if (user) {
    // Generate an access token
    const accessToken = jwt.sign(
      { email: user.email, password: user.password },
      accessTokenSecret
    );
    console.log(accessToken);

    res.json({
      accessToken,
    });
  } else {
    res.send("Username or password incorrect");
  }
};

module.exports = { login, authorize };
