import { createServer } from "./server";

const PORT = process.env.PORT || 8080;
const HOST = '0.0.0.0';

const server = createServer().listen(PORT, HOST, () => {
  console.log(`🚀 Server ready at: http://0.0.0.0:${PORT}`);
});

const exitHandler = () => {
  if (server) {
    server.close(() => {
      console.log("Server closed");
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error: Error) => {
  console.error(error);
  exitHandler();
};

process.on("uncaughtException", unexpectedErrorHandler);
process.on("unhandledRejection", unexpectedErrorHandler);

process.on("SIGTERM", () => {
  console.info("SIGTERM received");
  if (server) {
    server.close();
  }
});
