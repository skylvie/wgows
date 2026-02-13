import { WebSocketServer } from "ws";
import dgram from "node:dgram";

export async function server(wsport: number, wgport: number): Promise<void> {
  const wss = new WebSocketServer({ port: wsport });
  const wg = dgram.createSocket("udp4");

  wss.on("connection", (ws) => {
    console.debug("[DEBUG] WSS connection");

    ws.on("message", (msg) => {
      const buffer = Buffer.isBuffer(msg) ? msg : Buffer.from(msg.toString());
      wg.send(buffer, wgport, "127.0.0.1");
    });

    wg.on("message", (msg) => {
      ws.send(msg);
    });

    ws.on("close", () => {
      console.debug("[DEBUG] WS client disconnected");
    });

    ws.on("error", (err) => {
      console.error("[ERROR] WS error:", err);
    });
  });

  wss.on("close", () => {
    console.debug("[DEBUG] WSS disconnection");
  });

  wss.on("error", (err) => {
    console.error("[ERROR] WSS error:", err);
  });

  wss.on("listening", () => {
    console.info(`[INFO] WS server listening on port: ${wsport}`);
  });

  wg.bind(() => {
    console.info(`[INFO] Local server bound to port: ${wg.address().port}`);
  });

  wg.on("error", (err) => {
    console.error("[ERROR] UDP socket error:", err);
  });
}
