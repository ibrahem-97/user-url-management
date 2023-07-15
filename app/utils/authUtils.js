const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../../config");

const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({
      error: true,
      message: "unauthorized",
    });
  }

  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.user = decoded;
    next();
  } catch (error) {
    console.error("Error in authenticateToken:", error);
    res.status(403).json({
      error: true,
      message: "unauthorized",
    });
  }
};

const authenticateTokenAdmin = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({
      error: true,
      message: "unauthorized",
    });
  }
  try {
    const decoded = jwt.verify(token, jwtSecret);
    if (decoded.type != "admin") {
      return res.status(401).json({
        error: true,
        message: "unauthorized",
      });
    }
    req.user = decoded;
    next();
  } catch (error) {
    console.error("Error in authenticateToken:", error);
    res.status(403).json({
      error: true,
      message: "unauthorized",
    });
  }
};

module.exports = { authenticateToken, authenticateTokenAdmin };
