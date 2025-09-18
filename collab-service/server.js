import http from "http";
import "dotenv/config";
import app from "./app.js";
const port = process.env.PORT;

const server = http.createServer(app);
server.listen(port);
