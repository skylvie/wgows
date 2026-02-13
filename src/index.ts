#!/usr/bin/env node

import { client } from "./client.js";
import { server } from "./server.js";
import { Command } from "commander";

const program = new Command();

program.name("wgows").description("WireGuard over WebSockets").version("1.0.1");

program
  .command("client")
  .alias("c")
  .description("Client")
  .requiredOption("-p, --port <number>", "Local port to bind to")
  .requiredOption("-e, --endpoint <url>", "Server endpoint")
  .action(async (opts) => {
    const port = parseInt(opts.port, 10);

    if (isNaN(port)) {
      console.error("[ERROR] Invalid port number");
      process.exit(1);
    }

    try {
      await client(port, opts.endpoint);
    } catch (err) {
      console.error("[ERROR] Client error:", err);
      process.exit(1);
    }
  });

program
  .command("server")
  .alias("s")
  .description("Server")
  .requiredOption("--wsp <number>", "Server port to bind to")
  .requiredOption("--wgp <number>", "WireGuard port")
  .action(async (opts) => {
    const wsPort = parseInt(opts.wsp, 10);
    const wgPort = parseInt(opts.wgp, 10);

    if (isNaN(wsPort) || isNaN(wgPort)) {
      console.error("[ERROR] Invalid port number");
      process.exit(1);
    }

    try {
      await server(wsPort, wgPort);
    } catch (err) {
      console.error("[ERROR] Server error:", err);
      process.exit(1);
    }
  });

program.parse(process.argv);
