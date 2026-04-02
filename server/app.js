import express from "express";
import cors from "cors";
import crypto from "node:crypto";
import * as repo from "./db/repository.js";
import { createSession, getAdminPassword, isValidSession } from "./auth.js";

let initPromise;

/** İlk istekte seed (serverless’ta her instance bir kez) */
export function initOnce() {
  if (!initPromise) initPromise = repo.ensureSeededAndBackfill();
  return initPromise;
}

const app = express();

app.use(
  cors({
    origin: true,
    allowedHeaders: ["Authorization", "Content-Type", "Accept"],
    methods: ["GET", "HEAD", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  }),
);

app.use(express.json({ limit: "1mb" }));

/** Supabase'e gitmeden ortam kontrolü (Vercel log / Network'te teşhis) */
app.get("/api/health", (_req, res) => {
  res.json({
    ok: true,
    env: {
      supabaseUrl: !!process.env.SUPABASE_URL,
      supabaseServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      adminPassword: !!process.env.ADMIN_PASSWORD,
    },
  });
});

app.use(async (req, res, next) => {
  try {
    await initOnce();
  } catch (e) {
    console.error("[synax] ensureSeededAndBackfill:", e);
    return res.status(500).json({ error: String(e?.message || e) });
  }
  next();
});

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
    const events = await repo.listEvents();
    res.json(events);
  } catch (e) {
    res.status(500).json({ error: String(e.message) });
  }
});

app.get("/api/events/:id/application-form", async (req, res) => {
  try {
    const ev = await repo.getEventById(req.params.id);
    if (!ev) return res.status(404).json({ error: "Bulunamadı" });
    res.json(ev.applicationForm || { version: 1, questions: [] });
  } catch (e) {
    res.status(500).json({ error: String(e.message) });
  }
});

app.put("/api/events/:id/application-form", adminAuth, async (req, res) => {
  try {
    const body = req.body || {};
    const version =
      body.version != null && Number.isFinite(Number(body.version)) ? Number(body.version) : 1;
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

    const updated = await repo.setEventApplicationForm(req.params.id, { version, questions });
    if (!updated) return res.status(404).json({ error: "Bulunamadı" });
    res.json(updated.applicationForm);
  } catch (e) {
    res.status(500).json({ error: String(e.message) });
  }
});

app.get("/api/bracelets", async (_req, res) => {
  try {
    const list = await repo.listBracelets();
    res.json(list);
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
    const ev = await repo.createEvent({ title, description, image, status });
    res.status(201).json(ev);
  } catch (e) {
    res.status(500).json({ error: String(e.message) });
  }
});

app.put("/api/events/:id", adminAuth, async (req, res) => {
  try {
    const { title, description, image, status } = req.body || {};
    const updated = await repo.updateEvent(req.params.id, { title, description, image, status });
    if (!updated) return res.status(404).json({ error: "Bulunamadı" });
    res.json(updated);
  } catch (e) {
    res.status(500).json({ error: String(e.message) });
  }
});

app.delete("/api/events/:id", adminAuth, async (req, res) => {
  try {
    const ok = await repo.deleteEvent(req.params.id);
    if (!ok) return res.status(404).json({ error: "Bulunamadı" });
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
    const b = await repo.createBracelet({ title, description, image });
    res.status(201).json(b);
  } catch (e) {
    res.status(500).json({ error: String(e.message) });
  }
});

app.put("/api/bracelets/:id", adminAuth, async (req, res) => {
  try {
    const { title, description, image } = req.body || {};
    const updated = await repo.updateBracelet(req.params.id, { title, description, image });
    if (!updated) return res.status(404).json({ error: "Bulunamadı" });
    res.json(updated);
  } catch (e) {
    res.status(500).json({ error: String(e.message) });
  }
});

app.delete("/api/bracelets/:id", adminAuth, async (req, res) => {
  try {
    const ok = await repo.deleteBracelet(req.params.id);
    if (!ok) return res.status(404).json({ error: "Bulunamadı" });
    res.status(204).end();
  } catch (e) {
    res.status(500).json({ error: String(e.message) });
  }
});

const APP_STATUSES = new Set(["pending", "accepted", "issued", "rejected"]);

app.get("/api/applications", adminAuth, async (_req, res) => {
  try {
    const list = await repo.listApplications();
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
    const updated = await repo.patchApplicationStatus(req.params.id, status);
    if (!updated) return res.status(404).json({ error: "Bulunamadı" });
    res.json(updated);
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

    const ev = await repo.getEventById(eventId);
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

    await repo.createApplication(row);
    res.status(201).json({ id: row.id });
  } catch (e) {
    res.status(500).json({ error: String(e.message) });
  }
});

export { app };
