import crypto from "crypto";
import { getSupabase } from "./supabase.js";
import { defaultBraceletsSeed, defaultEventsSeed, defaultQuestionList } from "./defaultCatalog.js";

function rowToEvent(row) {
  if (!row) return null;
  let form = row.application_form;
  if (!form || typeof form !== "object") form = { version: 1, questions: [] };
  if (typeof form.version !== "number") form = { ...form, version: 1 };
  if (!Array.isArray(form.questions)) form = { ...form, questions: [] };
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    image: row.image,
    status: row.status,
    applicationForm: form,
  };
}

function rowToBracelet(row) {
  if (!row) return null;
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    image: row.image,
  };
}

function rowToApplication(row) {
  if (!row) return null;
  return {
    id: row.id,
    eventId: row.event_id,
    eventTitleSnapshot: row.event_title_snapshot,
    status: row.status,
    createdAt:
      row.created_at instanceof Date
        ? row.created_at.toISOString()
        : String(row.created_at),
    formVersion: row.form_version,
    answers: row.answers,
  };
}

async function nextEventSortOrder() {
  const sb = getSupabase();
  const { data, error } = await sb
    .from("events")
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return (data?.sort_order ?? -1) + 1;
}

async function nextBraceletSortOrder() {
  const sb = getSupabase();
  const { data, error } = await sb
    .from("bracelets")
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return (data?.sort_order ?? -1) + 1;
}

export async function ensureSeededAndBackfill() {
  const sb = getSupabase();
  const { count, error: cErr } = await sb.from("events").select("*", { count: "exact", head: true });
  if (cErr) throw new Error(cErr.message);

  if (!count) {
    const evRows = defaultEventsSeed().map((e, i) => ({
      id: e.id,
      title: e.title,
      description: e.description,
      image: e.image,
      status: e.status,
      application_form: { version: 1, questions: [] },
      sort_order: i,
    }));
    const { error: eErr } = await sb.from("events").insert(evRows);
    if (eErr) throw new Error(eErr.message);

    const brRows = defaultBraceletsSeed().map((b, i) => ({
      id: b.id,
      title: b.title,
      description: b.description,
      image: b.image,
      sort_order: i,
    }));
    const { error: bErr } = await sb.from("bracelets").insert(brRows);
    if (bErr) throw new Error(bErr.message);
  }

  await backfillEmptyEventForms();
}

async function backfillEmptyEventForms() {
  const sb = getSupabase();
  const { data: rows, error } = await sb.from("events").select("id, application_form");
  if (error) throw new Error(error.message);
  for (const row of rows || []) {
    const q = row.application_form?.questions;
    if (Array.isArray(q) && q.length > 0) continue;
    const form = { version: 1, questions: defaultQuestionList() };
    const { error: uErr } = await sb.from("events").update({ application_form: form }).eq("id", row.id);
    if (uErr) throw new Error(uErr.message);
  }
}

export async function listEvents() {
  const sb = getSupabase();
  const { data, error } = await sb.from("events").select("*").order("sort_order").order("created_at");
  if (error) throw new Error(error.message);
  return (data || []).map(rowToEvent);
}

export async function getEventById(id) {
  const sb = getSupabase();
  const { data, error } = await sb.from("events").select("*").eq("id", id).maybeSingle();
  if (error) throw new Error(error.message);
  return rowToEvent(data);
}

export async function setEventApplicationForm(id, form) {
  const sb = getSupabase();
  const { data, error } = await sb
    .from("events")
    .update({ application_form: form })
    .eq("id", id)
    .select("*")
    .maybeSingle();
  if (error) throw new Error(error.message);
  return rowToEvent(data);
}

export async function createEvent({ title, description, image, status }) {
  const sb = getSupabase();
  const id = `ev-${crypto.randomUUID()}`;
  const st = status === "past" ? "past" : "active";
  const sort_order = await nextEventSortOrder();
  const row = {
    id,
    title: String(title),
    description: String(description),
    image: String(image),
    status: st,
    application_form: { version: 1, questions: defaultQuestionList() },
    sort_order,
  };
  const { data, error } = await sb.from("events").insert(row).select("*").single();
  if (error) throw new Error(error.message);
  return rowToEvent(data);
}

export async function updateEvent(id, { title, description, image, status }) {
  const sb = getSupabase();
  const patch = {};
  if (title != null) patch.title = String(title);
  if (description != null) patch.description = String(description);
  if (image != null) patch.image = String(image);
  if (status === "past" || status === "active") patch.status = status;
  if (Object.keys(patch).length === 0) {
    const ev = await getEventById(id);
    if (!ev) return null;
    return ev;
  }
  const { data, error } = await sb.from("events").update(patch).eq("id", id).select("*").maybeSingle();
  if (error) throw new Error(error.message);
  return rowToEvent(data);
}

export async function deleteEvent(id) {
  const sb = getSupabase();
  const { data, error } = await sb.from("events").delete().eq("id", id).select("id");
  if (error) throw new Error(error.message);
  return Array.isArray(data) && data.length > 0;
}

export async function listBracelets() {
  const sb = getSupabase();
  const { data, error } = await sb.from("bracelets").select("*").order("sort_order");
  if (error) throw new Error(error.message);
  return (data || []).map(rowToBracelet);
}

export async function createBracelet({ title, description, image }) {
  const sb = getSupabase();
  const id = `br-${crypto.randomUUID()}`;
  const sort_order = await nextBraceletSortOrder();
  const row = {
    id,
    title: String(title),
    description: String(description),
    image: String(image),
    sort_order,
  };
  const { data, error } = await sb.from("bracelets").insert(row).select("*").single();
  if (error) throw new Error(error.message);
  return rowToBracelet(data);
}

export async function updateBracelet(id, { title, description, image }) {
  const sb = getSupabase();
  const patch = {};
  if (title != null) patch.title = String(title);
  if (description != null) patch.description = String(description);
  if (image != null) patch.image = String(image);
  if (Object.keys(patch).length === 0) {
    const { data, error } = await sb.from("bracelets").select("*").eq("id", id).maybeSingle();
    if (error) throw new Error(error.message);
    return rowToBracelet(data);
  }
  const { data, error } = await sb.from("bracelets").update(patch).eq("id", id).select("*").maybeSingle();
  if (error) throw new Error(error.message);
  return rowToBracelet(data);
}

export async function deleteBracelet(id) {
  const sb = getSupabase();
  const { data, error } = await sb.from("bracelets").delete().eq("id", id).select("id");
  if (error) throw new Error(error.message);
  return Array.isArray(data) && data.length > 0;
}

export async function listApplications() {
  const sb = getSupabase();
  const { data, error } = await sb.from("applications").select("*").order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data || []).map(rowToApplication);
}

export async function patchApplicationStatus(id, status) {
  const sb = getSupabase();
  const { data, error } = await sb
    .from("applications")
    .update({ status })
    .eq("id", id)
    .select("*")
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) return null;
  return rowToApplication(data);
}

export async function getApplicationById(id) {
  const sb = getSupabase();
  const { data, error } = await sb.from("applications").select("*").eq("id", id).maybeSingle();
  if (error) throw new Error(error.message);
  return rowToApplication(data);
}

export async function createApplication(row) {
  const sb = getSupabase();
  const dbRow = {
    id: row.id,
    event_id: row.eventId,
    event_title_snapshot: row.eventTitleSnapshot,
    status: row.status,
    created_at: row.createdAt,
    form_version: row.formVersion,
    answers: row.answers,
  };
  const { error } = await sb.from("applications").insert(dbRow);
  if (error) throw new Error(error.message);
}
