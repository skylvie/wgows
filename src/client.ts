import { WebSocket } from "ws";
import dgram from "node:dgram";

export async function client(port: number, endpoint: string): Promise<void> {
    const ws: WebSocket = new WebSocket(endpoint);
    const server = dgram.createSocket("udp4");

    ws.on("open", () => {
        console.debug("[DEBUG] Connected to server");
    });

    ws.on("close", () => {
        console.debug("[DEBUG] Disconnected from server");
    });

    ws.on("error", (err) => {
        console.error("[ERROR] WS error: ", err);
    });

    server.on("connect", () => {
        console.debug("[DEBUG] Connection to local server");
    });

    server.on("close", () => {
        console.debug("[DEBUG] Disconnection from local server");
    });

    server.on("error", (err) => {
        console.error("[ERROR] Local server error: ", err);
    });

    server.on("message", (msg) => {
        ws.send(msg);
    });

    ws.on("message", (msg) => {
        const buffer = Buffer.isBuffer(msg) ? msg : Buffer.from(msg.toString());
        server.send(buffer, port, "127.0.0.1");
    });

    server.bind(port, () => {
        console.log(
            `[INFO] Local server binded to: ${server.address().address}:${server.address().port}`,
        );
    });
}
