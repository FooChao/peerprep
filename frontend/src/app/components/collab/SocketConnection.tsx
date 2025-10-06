/**
 * AI Assistance Disclosure:
 * Tool: ChatGPT(model: GPT 5.0), date: 2025-10-06
 * Purpose: To understand how to track and send cursor information between users
 * Author Review: I validated correctness, security, and performance of the method suggested and modified areas such as
 * uing createDecorationsCollection instead of deltaDecorations suggested by the model
 */

// With Reference to https://stackoverflow.com/questions/68453051/decode-a-uint8array-into-a-json for uint8array to string conversion

import * as Y from "yjs";
import * as monaco from "monaco-editor";

function createInlineStyle(className: string, styles: string) {
  if (document.getElementById(className)) return;
  const style = document.createElement("style");
  style.innerHTML = `.${className} { ${styles} }`;
  document.head.appendChild(style);
}

function initEditor(
  userId: string,
  cursorCollections: Record<string, monaco.editor.IEditorDecorationsCollection>,
  editorInstance: monaco.editor.IStandaloneCodeEditor,
  ydoc: Y.Doc,
  ws: WebSocket
) {
  console.log("Connected to server Websocket Succesfully");
  cursorCollections[userId] = editorInstance.createDecorationsCollection([]);

  cursorCollections[userId].set([
    {
      range: new monaco.Range(1, 1, 1, 1),
      options: {
        className: "local-cursor",
        hoverMessage: { value: `User ${userId}` },
      },
    },
  ]);
  const initialState: Uint8Array = Y.encodeStateVector(ydoc);
  const stateAsString: string = Buffer.from(initialState).toString("base64");

  const payload = {
    type: "sync",
    userId: userId,
    ydocState: stateAsString,
  };

  ws.send(JSON.stringify(payload));
}

function onEditorChangeHandler(
  update: Uint8Array,
  origin: string,
  clientWS: WebSocket
) {
  if (origin != "remote" && clientWS.readyState === WebSocket.OPEN) {
    clientWS.send(update);
  }
}

function onCursorChangeHandler(
  cursorCollections: Record<string, monaco.editor.IEditorDecorationsCollection>,
  event: monaco.editor.ICursorSelectionChangedEvent,
  clientWS: WebSocket,
  userId: string
) {
  const { startLineNumber, startColumn, endLineNumber, endColumn } =
    event.selection;
  if (clientWS.readyState === WebSocket.OPEN) {
    const cursorUpdate = {
      type: "cursor",
      userId: userId,
      selection: {
        startLineNumber: startLineNumber,
        startColumn: startColumn,
        endLineNumber: endLineNumber,
        endColumn: endColumn,
      },
    };
    clientWS.send(JSON.stringify(cursorUpdate));
  }

  cursorCollections[userId].set([
    {
      range: new monaco.Range(
        startLineNumber,
        startColumn,
        endLineNumber,
        endColumn
      ),
      options: {
        className: "local-cursor",
        hoverMessage: { value: `User ${userId}` },
      },
    },
  ]);
}

function onPartnerCursorChangeHandler(
  messageEvent: MessageEvent,
  editorInstance: monaco.editor.IStandaloneCodeEditor,
  cursorCollections: Record<string, monaco.editor.IEditorDecorationsCollection>
) {
  const data = JSON.parse(messageEvent.data);

  if (data.type === "cursor") {
    if (!cursorCollections[data.userId]) {
      cursorCollections[data.userId] =
        editorInstance.createDecorationsCollection([]);
    }
    const { startLineNumber, startColumn, endLineNumber, endColumn } =
      data.selection;

    cursorCollections[data.userId].set([
      {
        range: new monaco.Range(
          startLineNumber,
          startColumn,
          endLineNumber,
          endColumn
        ),
        options: {
          className: "remote-cursor",
          hoverMessage: { value: `User ${data.userId}` },
        },
      },
    ]);
  }
}

export default function socketCommunication(
  userId: string,
  sessionId: string,
  ydoc: Y.Doc,
  editorInstance: monaco.editor.IStandaloneCodeEditor
) {
  const clientWS: WebSocket = new WebSocket(
    `ws://localhost/collab-socket/${userId}/${sessionId}`
  );

  const cursorCollections: Record<
    string,
    monaco.editor.IEditorDecorationsCollection
  > = {};

  createInlineStyle(
    "remote-cursor",
    "border-left: 2px solid rgba(255, 64, 11, 1);"
  );

  createInlineStyle(
    "local-cursor",
    "border-left: 2px solid rgba(46, 216, 246, 1)"
  );

  clientWS.binaryType = "arraybuffer";

  clientWS.onopen = () =>
    initEditor(userId, cursorCollections, editorInstance, ydoc, clientWS);

  clientWS.onmessage = (messageEvent) => {
    if (typeof messageEvent.data === "string") {
      const payloadObject = JSON.parse(messageEvent.data);
      if (payloadObject.type === "cursor") {
        onPartnerCursorChangeHandler(
          messageEvent,
          editorInstance,
          cursorCollections
        );
        return;
      } else if (payloadObject.type === "sync") {
        const yUpdate = Buffer.from(payloadObject.ydocUpdate, "base64");
        Y.applyUpdate(ydoc, yUpdate, "remote");
        return;
      }
    }
    const yUpdate: Uint8Array = new Uint8Array(messageEvent.data);
    Y.applyUpdate(ydoc, yUpdate, "remote");
  };

  ydoc.on("update", (update: Uint8Array, origin: string) =>
    onEditorChangeHandler(update, origin, clientWS)
  );

  editorInstance.onDidChangeCursorSelection((event) =>
    onCursorChangeHandler(cursorCollections, event, clientWS, userId)
  );

  clientWS.onerror = (error) => {
    console.log(error);
  };
  return clientWS;
}
