import { WebSocketServer } from "ws";
import dgram from "node:dgram";

export async function server(wsport: number, wgport: number): Promise<void> {
    const wss = new WebSocketServer({ port: wsport });
    const wg = dgram.createSocket("udp4");

    wss.on("connection", (ws) => {
        console.debug("[DEBUG] WSS connection");

        ws.on("message", (msg) => {
            const buffer = Buffer.isBuffer(msg)
                ? msg
                : Buffer.from(msg.toString());
            wg.send(buffer, wgport, "0.0.0.0");
        });
    });

    wss.on("close", () => {
        console.debug("[DEBUG] WSS disconnection");
    });

    wss.on("error", (err) => {
        console.error("[ERROR] WSS error:", err);
    });

    wss.on("listening", () => {
        console.info(`[INFO] WSS listening on port: ${wsport}`);
    });
}
