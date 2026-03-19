// @ts-ignore
import RPC from "@hyperswarm/rpc";

(async () => {
  // Create a new RPC instance
  const rpc = new RPC();

  // Create a server
  const server = rpc.createServer();

  // Define the 'echo' method
  server.respond('echo', (req: any) => {
    console.log('Received request:', req.toString());
    return req; // Echo back the received message
  });

  // Listen on the server's public key
  await server.listen();
  console.log('Server is listening...');

  // Output the server's public key for the client to connect
  console.log('Server public key:', server.publicKey.toString('hex'));

  // console.log(server.publicKey);
  //
  // const client = rpc.connect(server.publicKey);
  // await client.request("echo", Buffer.from("hello world"));
  //
  // await rpc.destroy()
})();
