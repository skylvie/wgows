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
wgows s -wsp 3000 -wgp 51820
# -wsp = Server port to bind to
# -wgp = WG port
```

## Usage
1. In your WG client config replace the endpoint with the client endpoint/port (e.g. `localhost:3000`)
2. Make sure you add `Table = off`
    1. Since the WG client is trying to route all traffic through the local server, you won't be able to access the WS server (infinite loop)
    2. `Table = off` means you need to specify what gets sent over WG (E.g. `curl --interface wg0 https://api.ipify.org`) 

## How?
TL;DR: WG Client <-> WS Client <-> WS Server <-> WG Server
1. The client binds to a local port
2. Receives UDP/WG traffic
3. Forwards to the server
4. Server forwards to the WG server
5. Server sends traffic back to the client
6. Client relays to the WG client
