import { app, initOnce } from "../server/app.js";

export default async function handler(req, res) {
  try {
    await initOnce();
  } catch (e) {
    res.status(500).json({ error: String(e.message) });
    return;
  }
  app(req, res);
}
