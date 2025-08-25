const jwt = require("jsonwebtoken");


function authMiddleware(req, res, next) {
  const token = req.cookies.token;
  if (!token) return res.status(401).send("Please login first");

  try {
    const decoded = jwt.verify(token, "123");
    req.user = decoded; // { id, role }
    next();
  } catch (err) {
    console.log(err.message)
    return res.status(403).send("Invalid Token");
  }
}

module.exports = authMiddleware