import jwt from "jsonwebtoken";

const verifyToken = (req, res, next) => {
  try {
    // 1. Read Authorization header
    const authHeader = req.headers.authorization;

    // 2. Check if token exists and starts with 'Bearer'
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ message: "Access denied: No token provided" });
    }

    // 3. Extract the actual token
    const token = authHeader.split(" ")[1];

    // 4. Verify token using secret key
    const decodedPayload = jwt.verify(token, process.env.SECRET_KEY);

    // 5. Put decoded user info into req.user (for access in next routes)
    req.user = decodedPayload;

    // 6. Allow request to proceed
    next();
  } catch (error) {
    console.error("JWT Verification Error:", error);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

export default verifyToken;
