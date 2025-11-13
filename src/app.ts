import "reflect-metadata";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import routes from "./routes";
import errorMiddleware from "./middlewares/error.middleware";
import { initializeModules } from "./modules";

// Wire up all module dependencies
initializeModules();

const app = express();

// Middleware setup
app.use(express.json());
app.use(helmet());

app.use(morgan("combined"));


app.use(cors());


//Health check endpoint
app.get("/api/v1/health", (req, res) => {
    if (process.env.NODE_ENV !== "test") {
        console.log(`[${new Date().toISOString()}] Health check ping`);
    }
    res.status(200).json({ success: true, message: "Server is healthy 🚀" });
});

app.use("/api/v1", routes);

app.use(errorMiddleware);

export default app;