const app = require("./src/app");

const port = process.env.PORT || 5000;

const server = app.listen(port, () =>
  console.log(`Server started on port ${port}`)
);

process.on("SIGINT", () => {
  console.info("SIGINT signal received.");
  console.log("Closing http server.");
  server.close(() => {
    console.log("Http server closed.");
  });
});
