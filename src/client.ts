// @ts-ignore
import RPC from "@hyperswarm/rpc";
// @ts-ignore
import DHT from "hyperdht";
import crypto from "crypto";

const serverPublicKeyHex =
  "1eb25a6f372ecb591de0c6bc45578ac5fa9444c1bfa9b172f59870054d0f4f6f";
const serverPublicKey = Buffer.from(serverPublicKeyHex, "hex");

// const serverPublicKey = crypto.createHash("sha256").update("shared-topic").digest();

(async () => {
  // Create a new RPC instance
  const dht = new DHT();
  const rpc = new RPC({ dht });

  // Connect to the server using its public key
  // const client = rpc.connect(serverPublicKey);
  const client = rpc.connect(serverPublicKey);

  client.on("open", () => {
    console.log("Client connected to server.");

    // Emit the 'greeting' event to the server
    client.event("test", Buffer.from("Hello, server!"));
  });

  client.on("error", (error: Error) => {
    console.error("Client error:", error);
  });

  // Wait for the connection to be established
  await new Promise((resolve) => client.once("open", resolve));

  console.log("Connected to server.");

  // Send a request to the 'echo' method
  const echoResponse = await client.request("echo", Buffer.from("Hello!"));
  console.log("Echo response from server:", echoResponse.toString());

  // Send a request to the 'multiply' method
  const multiplyResponse = await client.request(
    "multiply",
    Buffer.from(JSON.stringify([5, 7])),
  );
  console.log("Multiply response from server:", multiplyResponse.toString());

  // Emit an event to the server
  client.event("greeting", Buffer.from("Hello, server!"));

  // Close the client connection
  await client.end();
})();
