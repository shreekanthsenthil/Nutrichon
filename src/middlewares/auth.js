const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    console.log(token)
    if (token === "" || !token) {
      // return res.json({ message: "User not logged in." });
      req.flash('errors', 'Authentication Required to Perform the Action')
      return res.redirect('/')
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "key");
    // console.log(decoded);
    req.userData = decoded;
    next();
  } catch (err) {
    console.log(err);
    return res.status(401).json({
      message: "Auth failed!",
    });
  }
};
