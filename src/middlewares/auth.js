const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (token === "" || !token) {
      return res.json({ message: "User not logged in." });
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
