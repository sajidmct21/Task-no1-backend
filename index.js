import express from "express";
import env from "dotenv";
import cors from "cors";
import dbConnection from "./dbconnection/dbConnection.js";
import roleRouter from "./routes/user.router.js";

const app = express();
env.config();
app.use(cors());

app.use(express.json());

app.use("/", (req, res) => {
  res.send("Welcome to backend");
});

// Routers
app.use("/role", roleRouter);

// Global Error Handler
app.use((err, req, res, next) => {
  res.status(err.statusCode).json({
    statusCode: err.statusCode,
    name: err.name,
    message: err.message,
    stack: err.stack,
  });
});

// port
const port = process.env.PORT || 8000;

// db connection function
dbConnection();

// listen function
app.listen(port, () => {
  console.log(`App is running on port ${port}`);
});
