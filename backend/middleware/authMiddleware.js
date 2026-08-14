const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
    // Get Authorization header
    const authHeader = req.headers.authorization;

    // Check if token exists
    if (!authHeader) {
        return res.status(401).json({
            message: "Access denied. No token provided."
        });
    }

    // Expected format:
    // Authorization: Bearer TOKEN
    const parts = authHeader.split(" ");

    if (parts.length !== 2 || parts[0] !== "Bearer") {
        return res.status(401).json({
            message: "Invalid authorization format."
        });
    }

    const token = parts[1];

    // Verify token
    jwt.verify(
        token,
        process.env.JWT_SECRET,
        (err, decoded) => {

            if (err) {
                return res.status(403).json({
                    message: "Invalid or expired token."
                });
            }

            // Store user information in request
            req.user = decoded;

            // Continue to the next middleware/controller
            next();
        }
    );
};

module.exports = authenticateToken;