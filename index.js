import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import colors from "colors";
import connectDB from "./config/db.js";
import UserRouter from "./routes/UserRoute.js";
import PostRouter from "./routes/PostRoute.js";

// DOTENV
dotenv.config();

// MONGODB Connection
 connectDB();

// REST OBJECT
const app = express();

// middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Test ROUTES
app.get("/", (req, res) => {
  res
    .status(200).send("hello sir, This is backend Testing endpoint")
});

// All ROUTES
app.use("/api/v1/auth",UserRouter);
app.use("/api/v1/post",PostRouter)

// PORT
const PORT = process.env.PORT || 5000;

// connect to db and start server
const start = async()=>{
 await  connectDB();
 app.listen(PORT, () => {
  console.log(`Server is running at port : ${PORT}`.bgBlue.white);
})
}

// start
start();

