# wgows
WireGuard over WebSockets

## Installation
```sh
pnpm i -g wgows
```

## Usage
### Client
```sh
wgows c -p 3000 -e wss://wgows.example.com
# -p = Local port to bind to
# -e = Server endpoint
```
### Server
```sh
wgows s --wsp 3000 --wgp 51820
# --wsp = Server port to bind to
# --wgp = WireGuard port
```

## Usage
In your WireGuard config replace the endpoint with the client endpoint/port

## How?
TL;DR: WG Client <-> WS Client <-> WS Server <-> WG Server
1. The client binds to a local port
2. Receives UDP/WG traffic
3. Forwards to the server
4. Server forwards to the WG server
5. Server sends traffic back to the client
6. Client relays to the WG client
