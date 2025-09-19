import http from "http";
import "dotenv/config";
import app from "./app.js";
import { startDB } from "./db/connection.js";

const port = process.env.PORT;
const server = http.createServer(app);

async function startServer() {
  try {
    await startDB();
    server.listen(port);
    console.log(`Collab-service-server listening on ${port}`);
  } catch (error) {
    console.log("Unable to start collab-service server");
  }
}

startServer();
