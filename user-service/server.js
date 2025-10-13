import http from "http";
import index from "./index.js";
import "dotenv/config";
import { connectToDB } from "./model/repository.js";
import config from "../../config/config.json";

const port = process.env.PORT || 3001;
const USER_SERVICE_BASE_URL = config.USER_SERVICE_BASE_URL || `http://localhost:${port}`;

const server = http.createServer(index);

await connectToDB()
  .then(() => {
    console.log("MongoDB Connected!");

    server.listen(port);
    console.log("User service server listening on " + USER_SERVICE_BASE_URL);
  })
  .catch((err) => {
    console.error("Failed to connect to DB");
    console.error(err);
  });
