import express from "express";
import dotenv from "dotenv";
import authRouter from "./routes/auth_routes.js";
import activateRouter from "./routes/activate_routes.js";
import connectDB from "./config/db.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import { createServer } from "http";
import { Server } from "socket.io";
import registerSocketHandlers from "./sockets/index.js";

dotenv.config();

const app = express();

app.use(cookieParser());
app.use(express.json({ limit: "8mb" }));
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  })
);
app.use("/storage", express.static("storage"));
app.use(authRouter);
app.use(activateRouter);

connectDB();

// Web - Sockets logic
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

const socketUserMapping = {};
io.on("connection", (socket) => {
  registerSocketHandlers(io, socket, socketUserMapping); 
});


httpServer.listen(process.env.PORT, () =>
  console.log("Listening on PORT: ", process.env.PORT)
);

// console.log(crypto.randomBytes(64).toString('hex'));
