import express from "express";
import cors from "cors";
import EcfrRoutes from "./API/ECFR/Ecfr.Routes.js";

const app = express();

app.use(cors()); // allows your server to accept requests from other origins. This is particularly useful if your API is accessed by client-side applications running on different domains
app.use(express.json()); // parses incoming requests with JSON payloads. It makes the JSON data available on req.body in your route handlers.

app.use("/ecfr", EcfrRoutes);

// 404 handler - keep this last
app.use("*", (req, res) => {
    res.status(404).json({ error: "page not found" });
});

export default app;
