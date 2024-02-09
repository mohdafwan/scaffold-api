import jwt from "jsonwebtoken";

const auth = (req, res, next) => {
  let token = req.header("Authorization");

  if (!token) {
    token = req.cookies.token || req.body.token;
  } else {
    token = token.replace("Bearer ", "");
  }

  if (!token) {
    return res.status(403).send("Token is missing");
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    console.log(decoded);
    next();
  } catch (error) {
    console.error(error);
    return res.status(401).send("Invalid token");
  }
};

export default auth;
