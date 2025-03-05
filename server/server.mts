// import { insertChat } from "../db/index";
import { createServer } from "http";
import next from "next";
import { Server } from "socket.io";

const dev = process.env.NODE_ENV !== "production";
const hostname = process.env.HOST_NAME || "localhost";
const port = +process.env.PORT! || 8000;

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

// Record<string, string>- means that obj can keys with string signature and values must also be string
const users: Record<string, string> = {};

app.prepare().then(() => {
  const server = createServer(handle);
  const io = new Server(server);

  io.on("connection", (socket) => {
    console.log(`${socket.id} Socket connected`);

    socket.on("join", ({ name }: { name: string }) => {
      console.log(name, "joined");
      users[name] = socket.id;
    });

    socket.on("privateMessage", async ({ sender, receiver, message }) => {
      // Insert Chat to Database
      // const [insertedChat] =
      //   (await insertChat(sender, receiver, message)) || [];

      // Get Receiver
      const recipientSocketId = users[receiver];

      // Send  to receiver
      socket.to(recipientSocketId).emit("privateMessage", { type: "received" });
    });
  });

  server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
});
