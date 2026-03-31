import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import crypto from "crypto";
import { readStore, writeStore } from "./store.js";
import { createSession, getAdminPassword, isValidSession } from "./auth.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dist = path.join(__dirname, "../client/dist");

const app = express();
const port = Number(process.env.PORT) || 3000;

const corsOrigins = (process.env.CORS_ORIGIN || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);
app.use(
  cors({
    origin: corsOrigins.length ? corsOrigins : true,
    allowedHeaders: ["Authorization", "Content-Type", "Accept"],
  }),
);

app.use(express.json({ limit: "1mb" }));

function adminAuth(req, res, next) {
  const auth = req.headers.authorization || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7).trim() : "";
  if (!isValidSession(token)) {
    return res.status(401).json({ error: "Yetkisiz" });
  }
  next();
}

function normalizeQuestion(q) {
  if (!q || typeof q !== "object") return null;
  const id = String(q.id || "").trim();
  const type = String(q.type || "").trim();
  const label = String(q.label || "").trim();
  const required = q.required === true;

  const allowed = new Set(["text", "textarea", "select", "multiselect", "date", "number", "rules_ack"]);
  if (!id || !allowed.has(type) || !label) return null;

  const out = {
    id,
    type,
    label,
    required,
  };

  if (q.placeholder != null) out.placeholder = String(q.placeholder);
  if (q.helpText != null) out.helpText = String(q.helpText);

  if (type === "select" || type === "multiselect") {
    const optionsRaw = Array.isArray(q.options) ? q.options : [];
    const options = optionsRaw
      .map((o) => {
        if (!o || typeof o !== "object") return null;
        const value = String(o.value || "").trim();
        const optLabel = String(o.label || "").trim();
        if (!value || !optLabel) return null;
        return { value, label: optLabel };
      })
      .filter(Boolean);
    if (options.length === 0) return null;
    out.options = options;
  }

  if (type === "number") {
    if (q.min != null && Number.isFinite(Number(q.min))) out.min = Number(q.min);
    if (q.max != null && Number.isFinite(Number(q.max))) out.max = Number(q.max);
  }

  return out;
}

function validateAnswers(form, answers) {
  if (!form || typeof form !== "object" || !Array.isArray(form.questions)) {
    return { ok: false, error: "Etkinlik formu geçersiz" };
  }
  if (!answers || typeof answers !== "object" || Array.isArray(answers)) {
    return { ok: false, error: "Yanıtlar geçersiz" };
  }

  const ans = answers;
  for (const q of form.questions) {
    if (!q || typeof q !== "object") continue;
    const v = ans[q.id];

    const isEmpty =
      v == null ||
      (typeof v === "string" && v.trim() === "") ||
      (Array.isArray(v) && v.length === 0);

    if (q.required && isEmpty) {
      return { ok: false, error: `"${q.label}" zorunlu` };
    }

    if (isEmpty) continue;

    if (q.type === "text" || q.type === "textarea") {
      if (typeof v !== "string") return { ok: false, error: `"${q.label}" metin olmalı` };
    } else if (q.type === "date") {
      if (typeof v !== "string") return { ok: false, error: `"${q.label}" tarih olmalı` };
      const t = Date.parse(v);
      if (Number.isNaN(t)) return { ok: false, error: `"${q.label}" tarihi geçersiz` };
    } else if (q.type === "number") {
      const n = typeof v === "number" ? v : Number(v);
      if (!Number.isFinite(n)) return { ok: false, error: `"${q.label}" sayı olmalı` };
      if (q.min != null && n < q.min) return { ok: false, error: `"${q.label}" en az ${q.min}` };
      if (q.max != null && n > q.max) return { ok: false, error: `"${q.label}" en fazla ${q.max}` };
    } else if (q.type === "rules_ack") {
      if (v !== true) return { ok: false, error: `"${q.label}" onaylanmalı` };
    } else if (q.type === "select") {
      if (typeof v !== "string") return { ok: false, error: `"${q.label}" seçim olmalı` };
      const allowed = new Set((q.options || []).map((o) => o.value));
      if (!allowed.has(v)) return { ok: false, error: `"${q.label}" seçimi geçersiz` };
    } else if (q.type === "multiselect") {
      if (!Array.isArray(v)) return { ok: false, error: `"${q.label}" çoklu seçim olmalı` };
      const allowed = new Set((q.options || []).map((o) => o.value));
      for (const item of v) {
        if (typeof item !== "string" || !allowed.has(item)) {
          return { ok: false, error: `"${q.label}" seçimleri geçersiz` };
        }
      }
    } else {
      return { ok: false, error: `"${q.label}" soru tipi bilinmiyor` };
    }
  }

  return { ok: true };
}

app.post("/api/admin/login", (req, res) => {
  const { password } = req.body || {};
  if (password !== getAdminPassword()) {
    return res.status(401).json({ error: "Hatalı şifre" });
  }
  const token = createSession();
  res.json({ token });
});

app.get("/api/events", async (_req, res) => {
  try {
    const store = await readStore();
    res.json(store.events);
  } catch (e) {
    res.status(500).json({ error: String(e.message) });
  }
});

app.get("/api/events/:id/application-form", async (req, res) => {
  try {
    const store = await readStore();
    const ev = store.events.find((e) => e.id === req.params.id);
    if (!ev) return res.status(404).json({ error: "Bulunamadı" });
    res.json(ev.applicationForm || { version: 1, questions: [] });
  } catch (e) {
    res.status(500).json({ error: String(e.message) });
  }
});

app.put("/api/events/:id/application-form", adminAuth, async (req, res) => {
  try {
    const body = req.body || {};
    const version = body.version != null && Number.isFinite(Number(body.version)) ? Number(body.version) : 1;
    const questionsRaw = Array.isArray(body.questions) ? body.questions : null;
    if (!questionsRaw) return res.status(400).json({ error: "questions gerekli" });

    const questions = questionsRaw.map(normalizeQuestion).filter(Boolean);
    if (questions.length !== questionsRaw.length) {
      return res.status(400).json({ error: "Sorular geçersiz (id/type/label/options kontrol edin)" });
    }

    const ids = new Set();
    for (const q of questions) {
      if (ids.has(q.id)) return res.status(400).json({ error: "Soru id'leri benzersiz olmalı" });
      ids.add(q.id);
    }

    const store = await readStore();
    const i = store.events.findIndex((e) => e.id === req.params.id);
    if (i === -1) return res.status(404).json({ error: "Bulunamadı" });

    store.events[i].applicationForm = { version, questions };
    await writeStore(store);
    res.json(store.events[i].applicationForm);
  } catch (e) {
    res.status(500).json({ error: String(e.message) });
  }
});

app.get("/api/bracelets", async (_req, res) => {
  try {
    const store = await readStore();
    res.json(store.bracelets);
  } catch (e) {
    res.status(500).json({ error: String(e.message) });
  }
});

app.post("/api/events", adminAuth, async (req, res) => {
  try {
    const { title, description, image, status } = req.body || {};
    if (!title || !description || !image) {
      return res.status(400).json({ error: "title, description, image gerekli" });
    }
    const st = status === "past" ? "past" : "active";
    const store = await readStore();
    const id = `ev-${crypto.randomUUID()}`;
    const ev = { id, title: String(title), description: String(description), image: String(image), status: st };
    store.events.push(ev);
    await writeStore(store);
    res.status(201).json(ev);
  } catch (e) {
    res.status(500).json({ error: String(e.message) });
  }
});

app.put("/api/events/:id", adminAuth, async (req, res) => {
  try {
    const store = await readStore();
    const i = store.events.findIndex((e) => e.id === req.params.id);
    if (i === -1) return res.status(404).json({ error: "Bulunamadı" });
    const { title, description, image, status } = req.body || {};
    if (title != null) store.events[i].title = String(title);
    if (description != null) store.events[i].description = String(description);
    if (image != null) store.events[i].image = String(image);
    if (status === "past" || status === "active") store.events[i].status = status;
    await writeStore(store);
    res.json(store.events[i]);
  } catch (e) {
    res.status(500).json({ error: String(e.message) });
  }
});

app.delete("/api/events/:id", adminAuth, async (req, res) => {
  try {
    const store = await readStore();
    const before = store.events.length;
    store.events = store.events.filter((e) => e.id !== req.params.id);
    if (store.events.length === before) return res.status(404).json({ error: "Bulunamadı" });
    await writeStore(store);
    res.status(204).end();
  } catch (e) {
    res.status(500).json({ error: String(e.message) });
  }
});

app.post("/api/bracelets", adminAuth, async (req, res) => {
  try {
    const { title, description, image } = req.body || {};
    if (!title || !description || !image) {
      return res.status(400).json({ error: "title, description, image gerekli" });
    }
    const store = await readStore();
    const id = `br-${crypto.randomUUID()}`;
    const b = {
      id,
      title: String(title),
      description: String(description),
      image: String(image),
    };
    store.bracelets.push(b);
    await writeStore(store);
    res.status(201).json(b);
  } catch (e) {
    res.status(500).json({ error: String(e.message) });
  }
});

app.put("/api/bracelets/:id", adminAuth, async (req, res) => {
  try {
    const store = await readStore();
    const i = store.bracelets.findIndex((b) => b.id === req.params.id);
    if (i === -1) return res.status(404).json({ error: "Bulunamadı" });
    const { title, description, image } = req.body || {};
    if (title != null) store.bracelets[i].title = String(title);
    if (description != null) store.bracelets[i].description = String(description);
    if (image != null) store.bracelets[i].image = String(image);
    await writeStore(store);
    res.json(store.bracelets[i]);
  } catch (e) {
    res.status(500).json({ error: String(e.message) });
  }
});

app.delete("/api/bracelets/:id", adminAuth, async (req, res) => {
  try {
    const store = await readStore();
    const before = store.bracelets.length;
    store.bracelets = store.bracelets.filter((b) => b.id !== req.params.id);
    if (store.bracelets.length === before) return res.status(404).json({ error: "Bulunamadı" });
    await writeStore(store);
    res.status(204).end();
  } catch (e) {
    res.status(500).json({ error: String(e.message) });
  }
});

const APP_STATUSES = new Set(["pending", "accepted", "issued", "rejected"]);

app.get("/api/applications", adminAuth, async (_req, res) => {
  try {
    const store = await readStore();
    const list = [...store.applications].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
    res.json(list);
  } catch (e) {
    res.status(500).json({ error: String(e.message) });
  }
});

app.patch("/api/applications/:id", adminAuth, async (req, res) => {
  try {
    const { status } = req.body || {};
    if (!APP_STATUSES.has(status)) {
      return res.status(400).json({ error: "Geçersiz durum" });
    }
    const store = await readStore();
    const appRow = store.applications.find((a) => a.id === req.params.id);
    if (!appRow) return res.status(404).json({ error: "Bulunamadı" });
    appRow.status = status;
    await writeStore(store);
    res.json(appRow);
  } catch (e) {
    res.status(500).json({ error: String(e.message) });
  }
});

app.post("/api/applications", async (req, res) => {
  try {
    const body = req.body || {};
    const { eventId, answers } = body;

    if (!eventId) {
      return res.status(400).json({ error: "Etkinlik seçin" });
    }

    const store = await readStore();
    const ev = store.events.find((e) => e.id === eventId);
    if (!ev) return res.status(400).json({ error: "Etkinlik bulunamadı" });
    if (ev.status !== "active") {
      return res.status(400).json({ error: "Bu etkinliğe başvuru kabul edilmiyor" });
    }

    const form = ev.applicationForm || { version: 1, questions: [] };
    const v = validateAnswers(form, answers);
    if (!v.ok) return res.status(400).json({ error: v.error });

    const row = {
      id: `app-${crypto.randomUUID()}`,
      eventId: ev.id,
      eventTitleSnapshot: ev.title,
      status: "pending",
      createdAt: new Date().toISOString(),
      formVersion: form.version,
      answers,
    };

    store.applications.push(row);
    await writeStore(store);
    res.status(201).json({ id: row.id });
  } catch (e) {
    res.status(500).json({ error: String(e.message) });
  }
});

app.use(express.static(dist));

app.use((_req, res) => {
  res.sendFile(path.join(dist, "index.html"));
});

// 0.0.0.0: IPv4 üzerinden bağlantı (Vite proxy 127.0.0.1:3000 ile uyumlu)
app.listen(port, "0.0.0.0", () => {
  console.log(`SYNAPSE server http://localhost:${port}`);
});
