//With Reference to
// 1) https://www.w3schools.com/nodejs/nodejs_websockets.asp
// 2)https://karlhadwen.medium.com/node-js-websocket-tutorial-real-time-chat-room-using-multiple-clients-44a8e26a953e
// for broadcasting message

/**
 * AI Assistance Disclosure:
 * Tool: ChatGPT (model: GPT 5.0), date: 2025-09-23
 * Purpose: To understand how to implement heart-beat mechanism and prevent socket timeout
 * Author Review: I validated correctness, security, and performance of the code and modified the code to fit use case
 */

import WebSocket from "ws";
import * as Y from "yjs";
import logger from "../utils/logger.js";

function getYDoc(roomToDocMap, userId, roomId) {
  let doc;
  if (!roomToDocMap.has(roomId)) {
    doc = new Y.Doc();
    roomToDocMap.set(roomId, [doc, [userId]]);
  } else {
    const [stored_doc, users] = roomToDocMap.get(roomId);
    users.push(userId);
    doc = stored_doc;
  }
  return doc;
}

function handleCursorUpdates(message) {
  const text = message.toString();
  if (text.startsWith("{")) {
    const data = JSON.parse(text);
    if (data.type === "cursor") {
      return text;
    }
  }
  return null;
}

function handleInitialDocSync(message, ws, ydoc) {
  const text = message.toString();
  if (text.startsWith("{")) {
    const data = JSON.parse(text);
    if (data.type === "sync") {
      const initialState = Buffer.from(data.ydocState, "base64");
      const update = Y.encodeStateAsUpdate(ydoc, initialState);
      const updateAsString = Buffer.from(update).toString("base64");

      const payload = {
        type: "sync",
        ydocUpdate: updateAsString,
      };
      ws.send(JSON.stringify(payload));
      return true;
    }
  }
  return false;
}
function broadcastToRoom(webSocketServer, websocket, roomId, update) {
  webSocketServer.clients.forEach((client) => {
    logger.info(`client ${client.userId}`);
    if (
      client !== websocket &&
      client.readyState === WebSocket.OPEN &&
      client.room === roomId
    ) {
      logger.info(`WSS Sends update back to other user ${client.userId}`);
      logger.info(`what is sent from server:${update}`);
      client.send(update);
    }
  });
}

function handleSocketConnection(wss, ws, request, roomToDocMap) {
  const path_params = request.url.split("/");
  const userId = path_params[2];
  const roomId = path_params[3];

  ws.isAlive = true;
  ws.room = roomId;
  ws.userId = userId;
  const doc = getYDoc(roomToDocMap, userId, roomId);

  ws.on("pong", () => {
    ws.isAlive = true;
    logger.info("received pong from client");
  });

  ws.on("error", console.error);

  ws.on("message", (update) => {
    const cursorData = handleCursorUpdates(update);

    if (cursorData != null) {
      logger.info(`Broadcasting cursor updates ${cursorData}`);
      broadcastToRoom(wss, ws, roomId, cursorData);
      return;
    }

    if (handleInitialDocSync(update, ws, doc)) {
      return;
    }

    logger.info(`Message Received from ${ws.userId}`);
    const yUpdate = new Uint8Array(update);
    Y.applyUpdate(doc, yUpdate);
    broadcastToRoom(wss, ws, roomId, yUpdate);
  });

  ws.on("close", function () {
    roomToDocMap.delete(userId);
  });
}
export { handleSocketConnection };
