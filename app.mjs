import "dotenv/config";
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { connect } from "./config/database.mjs";
import User from "./model/User.mjs";
import auth from "./middleware/auth.mjs";
const app = express();

// Middleware
app.use(express.json());
// Connect to the database
connect();

// Root endpoint
app.get("/", (req, res) => {
  res.send("<h1>SYS</h1>");
});

// User registration endpoint
app.post("/register", async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    // Validate input fields
    if (!firstName && !lastName && !email && !password) {
      return res.status(400).send("All fields are required");
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send("User already exists");
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = await User.create({
      firstName,
      lastName,
      email: email.toLowerCase(),
      password: hashedPassword,
    });

    // Generate JWT token
    const token = jwt.sign(
      { user_id: user._id, email: user.email },
      process.env.SECRET_KEY,
      { expiresIn: "2h" }
    );

    // Attach token to user object
    user.token = token;
    user.password = undefined;
    // Return user data with token
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

// User Login endpoint
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!(email && password)) {
      res.status(400).send("some field are missing");
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).send("Invalid email or password");
    }
    const token = jwt.sign(
      { user_id: user._id, email: user.email },
      process.env.SECRET_KEY,
      { expiresIn: "2h" }
    );
    user.password = undefined;
    res.status(200).send({ user, token });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: {
        err: "Internal Server Error",
      },
    });
  }
});

app.get("/dashboard", auth, (req, res) => {
  res.send("Welcome to the dashboard");
});

export default app;
