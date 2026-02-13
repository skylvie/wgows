import type { RemoteInfo } from "node:dgram";
import { WebSocket } from "ws";
import dgram from "node:dgram";

export async function client(port: number, endpoint: string): Promise<void> {
  const ws: WebSocket = new WebSocket(endpoint);
  const udp = dgram.createSocket("udp4");
  let remoteAddress: RemoteInfo | null = null;

  ws.on("open", () => {
    console.log("[INFO] Connected to WS server");
  });

  ws.on("close", () => {
    console.log("[INFO] Disconnected from WG server");
  });

  ws.on("error", (err) => {
    console.error("[ERROR] WS error:", err);
  });

  udp.on("error", (err) => {
    console.error("[ERROR] UDP socket error:", err);
  });

  udp.on("message", (msg, rinfo) => {
    remoteAddress = rinfo;

    if (ws.readyState === WebSocket.OPEN) {
      ws.send(msg);
    }
  });

  ws.on("message", (msg) => {
    const buffer = Buffer.isBuffer(msg) ? msg : Buffer.from(msg.toString());

    if (remoteAddress) {
      udp.send(buffer, remoteAddress.port, remoteAddress.address);
    }
  });

  udp.bind(port, () => {
    console.log(
      `[INFO] UDP socket listening on ${udp.address().address}:${udp.address().port}`,
    );
    console.log("[INFO] Waiting for WG client connection...");
  });
}
