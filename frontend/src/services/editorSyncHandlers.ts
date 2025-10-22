import * as Y from "yjs";
import * as monaco from "monaco-editor";
import ReconnectingWebSocket from "reconnecting-websocket";

interface BasePayload {
  type: string;
  userId: string;
}

interface CursorSelection {
  startLineNumber: number;
  startColumn: number;
  endLineNumber: number;
  endColumn: number;
}

interface CursorUpdatePayload extends BasePayload {
  type: "cursor";
  selection: CursorSelection;
}

interface EditorSyncPayload extends BasePayload {
  type: "sync";
  ydocState: string;
}

interface EditorDocUpdatePayload extends BasePayload {
  type: "doc_update";
  ydocUpdate: string;
  cursorUpdate: CursorUpdatePayload;
}

//Set up initial cursor position as a decoration.
function initEditor(
  userId: string,
  cursorCollections: Record<string, monaco.editor.IEditorDecorationsCollection>,
  editorInstance: monaco.editor.IStandaloneCodeEditor
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
}

//Send initial editor state to backend socket
function sendEditorState(
  userId: string,
  ydoc: Y.Doc,
  ws: ReconnectingWebSocket
) {
  const initialState: Uint8Array = Y.encodeStateVector(ydoc);
  const stateAsString: string = Buffer.from(initialState).toString("base64");

  const payload: EditorSyncPayload = {
    type: "sync",
    userId: userId,
    ydocState: stateAsString,
  };

  ws.send(JSON.stringify(payload));
}

//Send both doc and cursor changes made on local code editor to backend socket
function onEditorChangeHandler(
  update: Uint8Array,
  origin: string,
  clientWS: ReconnectingWebSocket,
  userId: string,
  editorInstance: monaco.editor.IStandaloneCodeEditor
) {
  const selection: monaco.Selection | null = editorInstance.getSelection();
  const cursorUpdate: CursorUpdatePayload = {
    type: "cursor",
    userId: userId,
    selection: selection
      ? {
          startLineNumber: selection.startLineNumber,
          startColumn: selection.startColumn,
          endLineNumber: selection.endLineNumber,
          endColumn: selection.endColumn,
        }
      : {
          startLineNumber: 0,
          startColumn: 0,
          endLineNumber: 0,
          endColumn: 0,
        },
  };

  if (origin != "remote" && clientWS.readyState === WebSocket.OPEN) {
    const updateAsString: string = Buffer.from(update).toString("base64");
    const payload: EditorDocUpdatePayload = {
      type: "doc_update",
      userId: userId,
      ydocUpdate: updateAsString,
      cursorUpdate: cursorUpdate,
    };
    clientWS.send(JSON.stringify(payload));
  }
}

//Send changes made to local cursor to backend socket and update local cursor decoration
function onCursorChangeHandler(
  cursorCollections: Record<string, monaco.editor.IEditorDecorationsCollection>,
  event: monaco.editor.ICursorSelectionChangedEvent,
  clientWS: ReconnectingWebSocket,
  userId: string
) {
  const { startLineNumber, startColumn, endLineNumber, endColumn } =
    event.selection;
  if (clientWS.readyState === WebSocket.OPEN) {
    const cursorUpdate: CursorUpdatePayload = {
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

//Receives partner cursor positions and set partner cursor decoration
function onPartnerCursorChangeHandler(
  data: CursorUpdatePayload,
  editorInstance: monaco.editor.IStandaloneCodeEditor,
  cursorCollections: Record<string, monaco.editor.IEditorDecorationsCollection>
) {
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

export {
  initEditor,
  sendEditorState,
  onCursorChangeHandler,
  onEditorChangeHandler,
  onPartnerCursorChangeHandler,
};
