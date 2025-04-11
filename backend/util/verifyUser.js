import { errorHandler } from "./error.js";
import jwt from "jsonwebtoken";
export const verifyToken = (req, res, next) => {
  const token = req.cookies.token;

  console.log("token", token);
  if (!token) return console.log("not token");

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return errorHandler(403, "forbidden");
    req.user = user;
    next();
  });
};
