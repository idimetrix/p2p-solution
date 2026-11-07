// @ts-ignore
import RPC from "@hyperswarm/rpc";
// @ts-ignore
import DHT from "hyperdht";
import crypto from "crypto";

const defaultKeyPair = crypto
  .createHash("sha256")
  .update("shared-topic")
  .digest();

(async () => {
  // Create a new RPC instance
  const dht = new DHT();
  const rpc = new RPC({ dht });

  // Create a server
  const server = rpc.createServer();

  // Handle events on the server side
  server.on("connection", (connection: any) => {
    console.log("Server received a connection.");

    // Respond to client-emitted events
    connection.on("test", (msg: Buffer) => {
      console.log("Received on.test event:", msg.toString());
    });
  });

  server.on("error", (error: Error) => {
    console.error("Client error:", error);
  });

  server.on("listening", () => {
    console.log("Server is listening...");
  });

  server.on("close", () => {
    console.log("Server is closed!");
  });

  // Define the 'echo' method
  server.respond("echo", (req: Buffer) => {
    console.log("Received request:", req.toString());
    return req; // Echo back the received message
  });

  // Define additional methods on the server
  server.respond("multiply", (req: Buffer) => {
    const [a, b] = JSON.parse(req.toString());
    console.log(`Multiplying: ${a} * ${b}`);
    return Buffer.from(JSON.stringify(a * b)); // Return the multiplication result
  });

  server.respond("test", (req: Buffer) => {
    console.log("Received respond.test event:", req.toString());

    return req;
  });

  // Listen on the server's public key
  await server.listen();

  // Output the server's public key for the client to connect
  console.log("Server public key:", server.publicKey.toString("hex"));
})();
