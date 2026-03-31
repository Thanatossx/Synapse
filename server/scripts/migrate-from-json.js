/**
 * Eski server/data/store.json içeriğini Supabase'e aktarır.
 * Kullanım (server klasöründen, .env veya ortam değişkenleri yüklü iken):
 *   node scripts/migrate-from-json.js
 *
 * Önce server/supabase/schema.sql dosyasını Supabase SQL Editor'da çalıştırın.
 */
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { getSupabase } from "../db/supabase.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const jsonPath = path.join(__dirname, "..", "data", "store.json");

function toEventRow(ev, sort_order) {
  const form = ev.applicationForm || { version: 1, questions: [] };
  return {
    id: ev.id,
    title: ev.title,
    description: ev.description,
    image: ev.image,
    status: ev.status === "past" ? "past" : "active",
    application_form: form,
    sort_order,
  };
}

function toBraceletRow(b, sort_order) {
  return {
    id: b.id,
    title: b.title,
    description: b.description,
    image: b.image,
    sort_order,
  };
}

function toAppRow(a) {
  return {
    id: a.id,
    event_id: a.eventId,
    event_title_snapshot: a.eventTitleSnapshot,
    status: a.status,
    created_at: a.createdAt,
    form_version: a.formVersion ?? 1,
    answers: a.answers ?? {},
  };
}

async function main() {
  const raw = await fs.readFile(jsonPath, "utf8");
  const parsed = JSON.parse(raw);

  const sb = getSupabase();

  const events = Array.isArray(parsed.events) ? parsed.events : [];
  const bracelets = Array.isArray(parsed.bracelets) ? parsed.bracelets : [];
  const applications = Array.isArray(parsed.applications) ? parsed.applications : [];

  if (events.length) {
    const rows = events.map((ev, i) => toEventRow(ev, i));
    const { error } = await sb.from("events").upsert(rows, { onConflict: "id" });
    if (error) throw new Error(`events upsert: ${error.message}`);
    console.log(`events: ${rows.length} satır yazıldı.`);
  }

  if (bracelets.length) {
    const rows = bracelets.map((b, i) => toBraceletRow(b, i));
    const { error } = await sb.from("bracelets").upsert(rows, { onConflict: "id" });
    if (error) throw new Error(`bracelets upsert: ${error.message}`);
    console.log(`bracelets: ${rows.length} satır yazıldı.`);
  }

  if (applications.length) {
    const rows = applications.map(toAppRow);
    const { error } = await sb.from("applications").upsert(rows, { onConflict: "id" });
    if (error) throw new Error(`applications upsert: ${error.message}`);
    console.log(`applications: ${rows.length} satır yazıldı.`);
  }

  console.log("Tamam.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
