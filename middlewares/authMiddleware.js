const { verifyToken } = require("../utilities/jwt.js");

const authMiddleware = (roles = []) => {
  return (req, res, next) => {
    const authHeader = req.headers?.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized Access" });
    }

    const token = authHeader.split(" ")[1];

    try {
      const decoded = verifyToken(token);
      req.user = decoded;

      if (roles.length && !roles.includes(req.user.emptype)) {
        return res.status(403).json({
          error: "Forbidden: You do not have access to this resource",
        });
      }

      next();
    } catch (err) {
      res.status(401).json({ error: "Invalid token" });
    }
  };
};

module.exports = authMiddleware;
