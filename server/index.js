import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import { app, initOnce } from "./app.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dist = path.join(__dirname, "../client/dist");
const port = Number(process.env.PORT) || 3000;

app.use(express.static(dist));
app.use((_req, res) => {
  res.sendFile(path.join(dist, "index.html"));
});

async function start() {
  await initOnce();
  app.listen(port, "0.0.0.0", () => {
    console.log(`SYNAX server http://localhost:${port}`);
  });
}

start().catch((err) => {
  console.error(err);
  process.exit(1);
});
