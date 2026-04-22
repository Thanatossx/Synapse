import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiGet, apiSend } from "../lib/api";
import type {
  ApplicationForm,
  ApplicationStatus,
  EventStatus,
  PublicEvent,
  Question,
  QuestionType,
  TicketApplication,
} from "../types/data";

const TOKEN_KEY = "synax-admin-token";

type Tab = "events" | "applications";

const STATUS_LABELS: Record<ApplicationStatus, string> = {
  pending: "Beklemede",
  accepted: "Kabul et",
  issued: "Bilet verildi",
  rejected: "Reddet",
};

function statusStyle(s: ApplicationStatus): string {
  switch (s) {
    case "accepted":
      return "bg-amber-400 text-black hover:bg-amber-300";
    case "issued":
      return "bg-emerald-600 text-white hover:bg-emerald-500";
    case "rejected":
      return "bg-red-600 text-white hover:bg-red-500";
    default:
      return "bg-white/10 text-white hover:bg-white/20";
  }
}

export function Admin() {
  const [token, setToken] = useState<string | null>(() => sessionStorage.getItem(TOKEN_KEY));
  const [password, setPassword] = useState("");
  const [loginErr, setLoginErr] = useState<string | null>(null);
  const [tab, setTab] = useState<Tab>("events");

  async function login(e: React.FormEvent) {
    e.preventDefault();
    setLoginErr(null);
    try {
      const res = await apiSend<{ token: string }>("/api/admin/login", {
        method: "POST",
        body: { password },
      });
      sessionStorage.setItem(TOKEN_KEY, res.token);
      setToken(res.token);
      setPassword("");
    } catch (err) {
      setLoginErr(err instanceof Error ? err.message : "Giriş başarısız");
    }
  }

  function logout() {
    sessionStorage.removeItem(TOKEN_KEY);
    setToken(null);
  }

  function onUnauthorized() {
    sessionStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setLoginErr("Oturum süresi doldu. Lütfen tekrar giriş yapın.");
  }

  if (!token) {
    return (
      <div className="w-full">
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-black" />
          <div className="relative z-10 mx-auto max-w-md px-6 py-24">
            <Link to="/" className="text-sm text-white/55 hover:text-white hover:underline">
              ← Siteye dön
            </Link>
            <h1 className="mt-8 text-2xl font-bold text-white">Admin</h1>
            <form className="mt-8 space-y-4" onSubmit={login}>
              <input
                type="password"
                className="w-full rounded border border-white/15 bg-black/50 px-4 py-3 text-white outline-none focus:border-white/35"
                placeholder="Şifre"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {loginErr && <p className="text-sm text-red-300">{loginErr}</p>}
              <button
                type="submit"
                className="w-full rounded-none bg-[#6d28d9] py-3 text-sm font-semibold text-white hover:bg-[#5b21b6]"
              >
                Giriş
              </button>
            </form>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="w-full">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-black" />
        <div className="relative z-10 mx-auto max-w-[1100px] px-6 py-10 md:py-14">
          <div className="flex flex-col gap-4 border-b border-white/10 pb-6 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Yönetim paneli</h1>
              <p className="mt-1 text-sm text-white/55">Etkinlikler ve bilet başvuruları</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/"
                className="inline-flex items-center justify-center rounded border border-white/20 px-4 py-2 text-sm text-white/85 hover:bg-white/10"
              >
                Site
              </Link>
              <button
                type="button"
                className="inline-flex items-center justify-center rounded border border-red-500/40 px-4 py-2 text-sm text-red-200 hover:bg-red-500/10"
                onClick={logout}
              >
                Çıkış
              </button>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-2">
            {(
              [
                ["events", "Etkinlikler"],
                ["applications", "Başvurular"],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                className={`rounded px-4 py-2 text-sm font-medium transition ${
                  tab === id ? "bg-white text-black" : "bg-white/5 text-white/75 hover:bg-white/10"
                }`}
                onClick={() => setTab(id)}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="mt-10">
            {tab === "events" && <EventsPanel token={token} onUnauthorized={onUnauthorized} />}
            {tab === "applications" && <ApplicationsPanel token={token} onUnauthorized={onUnauthorized} />}
          </div>
        </div>
      </section>
    </div>
  );
}

function EventsPanel({ token, onUnauthorized }: { token: string; onUnauthorized: () => void }) {
  const [list, setList] = useState<PublicEvent[]>([]);
  const [mode, setMode] = useState<"add" | "edit">("add");
  const [editId, setEditId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [status, setStatus] = useState<EventStatus>("active");
  const [msg, setMsg] = useState<string | null>(null);
  const [formEditId, setFormEditId] = useState<string | null>(null);
  const [formDraft, setFormDraft] = useState<ApplicationForm | null>(null);
  const [formBusy, setFormBusy] = useState(false);

  const load = useCallback(async () => {
    const data = await apiGet<PublicEvent[]>("/api/events");
    setList(data);
  }, []);

  useEffect(() => {
    load().catch(() => setMsg("Liste yüklenemedi (sunucu çalışıyor mu?)"));
  }, [load]);

  function resetForm() {
    setMode("add");
    setEditId(null);
    setTitle("");
    setDescription("");
    setImage("");
    setStatus("active");
  }

  function startEdit(ev: PublicEvent) {
    setMode("edit");
    setEditId(ev.id);
    setTitle(ev.title);
    setDescription(ev.description);
    setImage(ev.image);
    setStatus(ev.status);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    try {
      if (mode === "add") {
        await apiSend("/api/events", {
          method: "POST",
          token,
          body: { title, description, image, status },
        });
        setMsg("Etkinlik eklendi.");
      } else if (editId) {
        await apiSend(`/api/events/${editId}`, {
          method: "PUT",
          token,
          body: { title, description, image, status },
        });
        setMsg("Etkinlik güncellendi.");
      }
      resetForm();
      await load();
    } catch (err) {
      if (err instanceof Error && err.message === "Yetkisiz") onUnauthorized();
      setMsg(err instanceof Error ? err.message : "İşlem başarısız");
    }
  }

  async function onDelete(id: string) {
    if (!confirm("Bu etkinliği silmek istediğinize emin misiniz?")) return;
    setMsg(null);
    try {
      await apiSend(`/api/events/${id}`, { method: "DELETE", token });
      if (editId === id) resetForm();
      setMsg("Silindi.");
      await load();
    } catch (err) {
      if (err instanceof Error && err.message === "Yetkisiz") onUnauthorized();
      setMsg(err instanceof Error ? err.message : "Silinemedi");
    }
  }

  function uuid() {
    if (typeof crypto !== "undefined" && "randomUUID" in crypto) return `q-${crypto.randomUUID()}`;
    return `q-${Math.random().toString(16).slice(2)}${Date.now().toString(16)}`;
  }

  function openFormEditor(ev: PublicEvent) {
    const existing = ev.applicationForm || { version: 1, questions: [] };
    setFormDraft({
      version: existing.version || 1,
      questions: (existing.questions || []).map((q) => ({
        ...q,
        options: q.options ? q.options.map((o) => ({ ...o })) : undefined,
      })),
    });
    setFormEditId(ev.id);
    setMsg(null);
  }

  function closeFormEditor() {
    setFormEditId(null);
    setFormDraft(null);
  }

  function updateQuestion(idx: number, patch: Partial<Question>) {
    setFormDraft((prev) => {
      if (!prev) return prev;
      const next = prev.questions.slice();
      const cur = next[idx];
      if (!cur) return prev;
      next[idx] = { ...cur, ...patch };
      return { ...prev, questions: next };
    });
  }

  function moveQuestion(idx: number, dir: -1 | 1) {
    setFormDraft((prev) => {
      if (!prev) return prev;
      const next = prev.questions.slice();
      const j = idx + dir;
      if (j < 0 || j >= next.length) return prev;
      const tmp = next[idx];
      next[idx] = next[j];
      next[j] = tmp;
      return { ...prev, questions: next };
    });
  }

  function removeQuestion(idx: number) {
    setFormDraft((prev) => {
      if (!prev) return prev;
      const next = prev.questions.slice();
      next.splice(idx, 1);
      return { ...prev, questions: next };
    });
  }

  function addQuestion() {
    const q: Question = {
      id: uuid(),
      type: "text",
      label: "Yeni soru",
      required: false,
      placeholder: "Yanıtınız",
    };
    setFormDraft((prev) => (prev ? { ...prev, questions: [...prev.questions, q] } : { version: 1, questions: [q] }));
  }

  function updateOption(qIdx: number, optIdx: number, patch: { value?: string; label?: string }) {
    setFormDraft((prev) => {
      if (!prev) return prev;
      const nextQ = prev.questions.slice();
      const q = nextQ[qIdx];
      if (!q) return prev;
      const options = (q.options || []).slice();
      const cur = options[optIdx];
      if (!cur) return prev;
      options[optIdx] = { ...cur, ...patch };
      nextQ[qIdx] = { ...q, options };
      return { ...prev, questions: nextQ };
    });
  }

  function addOption(qIdx: number) {
    setFormDraft((prev) => {
      if (!prev) return prev;
      const nextQ = prev.questions.slice();
      const q = nextQ[qIdx];
      if (!q) return prev;
      const options = (q.options || []).slice();
      const n = options.length + 1;
      options.push({ value: `opt-${n}`, label: `Seçenek ${n}` });
      nextQ[qIdx] = { ...q, options };
      return { ...prev, questions: nextQ };
    });
  }

  function removeOption(qIdx: number, optIdx: number) {
    setFormDraft((prev) => {
      if (!prev) return prev;
      const nextQ = prev.questions.slice();
      const q = nextQ[qIdx];
      if (!q) return prev;
      const options = (q.options || []).slice();
      options.splice(optIdx, 1);
      nextQ[qIdx] = { ...q, options };
      return { ...prev, questions: nextQ };
    });
  }

  async function saveFormSchema() {
    if (!formEditId || !formDraft) return;
    setFormBusy(true);
    setMsg(null);
    try {
      await apiSend(`/api/events/${formEditId}/application-form`, {
        method: "PUT",
        token,
        body: {
          version: (formDraft.version || 1) + 1,
          questions: formDraft.questions,
        },
      });
      setMsg("Başvuru formu kaydedildi.");
      closeFormEditor();
      await load();
    } catch (err) {
      if (err instanceof Error && err.message === "Yetkisiz") onUnauthorized();
      setMsg(err instanceof Error ? err.message : "Form kaydedilemedi");
    } finally {
      setFormBusy(false);
    }
  }

  return (
    <div className="space-y-8">
      {msg && <p className="rounded border border-white/15 bg-white/5 px-4 py-3 text-sm text-white/85">{msg}</p>}

      <form className="space-y-4 rounded-lg border border-white/10 bg-white/[0.04] p-5" onSubmit={onSubmit}>
        <h2 className="text-lg font-semibold text-white">{mode === "add" ? "Yeni etkinlik" : "Etkinliği düzenle"}</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="block md:col-span-2">
            <span className="text-sm text-white/70">Başlık</span>
            <input
              className="mt-1 w-full rounded border border-white/15 bg-black/40 px-3 py-2 text-white outline-none focus:border-white/35"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </label>
          <label className="block md:col-span-2">
            <span className="text-sm text-white/70">Açıklama</span>
            <textarea
              className="mt-1 min-h-[80px] w-full rounded border border-white/15 bg-black/40 px-3 py-2 text-white outline-none focus:border-white/35"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </label>
          <label className="block md:col-span-2">
            <span className="text-sm text-white/70">Görsel URL</span>
            <input
              className="mt-1 w-full rounded border border-white/15 bg-black/40 px-3 py-2 text-sm text-white outline-none focus:border-white/35"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              required
            />
          </label>
          <label className="block">
            <span className="text-sm text-white/70">Sınıf</span>
            <select
              className="mt-1 w-full rounded border border-white/15 bg-black/40 px-3 py-2 text-white outline-none focus:border-white/35"
              value={status}
              onChange={(e) => setStatus(e.target.value as EventStatus)}
            >
              <option value="active">Aktif Etkinlik</option>
              <option value="past">Geçmiş Etkinlik</option>
            </select>
          </label>
        </div>
        <div className="flex flex-wrap gap-3">
          <button type="submit" className="rounded bg-white px-4 py-2 text-sm font-medium text-black hover:bg-white/90">
            {mode === "add" ? "Ekle" : "Kaydet"}
          </button>
          {mode === "edit" && (
            <button
              type="button"
              className="rounded border border-white/20 px-4 py-2 text-sm text-white/80 hover:bg-white/10"
              onClick={resetForm}
            >
              İptal
            </button>
          )}
        </div>
      </form>

      {formEditId && formDraft && (
        <div className="rounded-lg border border-white/12 bg-white/[0.04] p-5">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold text-white">Başvuru formu</p>
              <p className="mt-1 text-xs text-white/55">
                Etkinlik:{" "}
                <span className="text-white/80">{list.find((e) => e.id === formEditId)?.title || formEditId}</span>
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                className="rounded bg-white px-4 py-2 text-sm font-medium text-black hover:bg-white/90 disabled:opacity-50"
                disabled={formBusy}
                onClick={saveFormSchema}
              >
                {formBusy ? "Kaydediliyor…" : "Kaydet"}
              </button>
              <button
                type="button"
                className="rounded border border-white/20 px-4 py-2 text-sm text-white/80 hover:bg-white/10"
                disabled={formBusy}
                onClick={closeFormEditor}
              >
                Kapat
              </button>
              <button
                type="button"
                className="rounded border border-white/15 bg-black/30 px-4 py-2 text-sm text-white/80 hover:bg-black/40"
                disabled={formBusy}
                onClick={addQuestion}
              >
                + Soru ekle
              </button>
            </div>
          </div>

          <div className="mt-5 space-y-4">
            {formDraft.questions.length === 0 && (
              <p className="rounded border border-white/10 bg-black/20 px-4 py-3 text-sm text-white/60">
                Henüz soru yok. “Soru ekle” ile başlayın.
              </p>
            )}

            {formDraft.questions.map((q, idx) => (
              <div key={q.id} className="rounded border border-white/10 bg-black/20 p-4">
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="grid gap-3 md:grid-cols-2">
                      <label className="block md:col-span-2">
                        <span className="text-xs font-semibold uppercase tracking-wide text-white/55">Soru</span>
                        <input
                          className="mt-1 w-full rounded border border-white/15 bg-black/40 px-3 py-2 text-sm text-white outline-none focus:border-white/35"
                          value={q.label}
                          onChange={(e) => updateQuestion(idx, { label: e.target.value })}
                        />
                      </label>

                      <label className="block">
                        <span className="text-xs font-semibold uppercase tracking-wide text-white/55">Tip</span>
                        <select
                          className="mt-1 w-full rounded border border-white/15 bg-black/40 px-3 py-2 text-sm text-white outline-none focus:border-white/35"
                          value={q.type}
                          onChange={(e) => {
                            const t = e.target.value as QuestionType;
                            const patch: Partial<Question> = { type: t };
                            if (t === "select" || t === "multiselect") {
                              patch.options =
                                q.options && q.options.length > 0 ? q.options : [{ value: "opt-1", label: "Seçenek 1" }];
                            } else {
                              patch.options = undefined;
                            }
                            if (t !== "text" && t !== "textarea") {
                              patch.placeholder = undefined;
                            }
                            updateQuestion(idx, patch);
                          }}
                        >
                          <option value="text">Kısa metin</option>
                          <option value="textarea">Uzun metin</option>
                          <option value="select">Tek seçim</option>
                          <option value="multiselect">Çoklu seçim</option>
                          <option value="date">Tarih</option>
                          <option value="number">Sayı</option>
                          <option value="rules_ack">Onay kutusu</option>
                        </select>
                      </label>

                      <label className="flex items-center gap-2 pt-5">
                        <input
                          type="checkbox"
                          className="rounded border-white/30"
                          checked={q.required}
                          onChange={(e) => updateQuestion(idx, { required: e.target.checked })}
                        />
                        <span className="text-sm text-white/80">Zorunlu</span>
                      </label>

                      {(q.type === "text" || q.type === "textarea") && (
                        <label className="block md:col-span-2">
                          <span className="text-xs font-semibold uppercase tracking-wide text-white/55">Placeholder</span>
                          <input
                            className="mt-1 w-full rounded border border-white/15 bg-black/40 px-3 py-2 text-sm text-white outline-none focus:border-white/35"
                            value={q.placeholder || ""}
                            onChange={(e) => updateQuestion(idx, { placeholder: e.target.value })}
                          />
                        </label>
                      )}

                      <label className="block md:col-span-2">
                        <span className="text-xs font-semibold uppercase tracking-wide text-white/55">Yardım metni</span>
                        <input
                          className="mt-1 w-full rounded border border-white/15 bg-black/40 px-3 py-2 text-sm text-white outline-none focus:border-white/35"
                          value={q.helpText || ""}
                          onChange={(e) => updateQuestion(idx, { helpText: e.target.value })}
                        />
                      </label>

                      {q.type === "number" && (
                        <>
                          <label className="block">
                            <span className="text-xs font-semibold uppercase tracking-wide text-white/55">Min</span>
                            <input
                              type="number"
                              className="mt-1 w-full rounded border border-white/15 bg-black/40 px-3 py-2 text-sm text-white outline-none focus:border-white/35"
                              value={q.min ?? ""}
                              onChange={(e) => updateQuestion(idx, { min: e.target.value === "" ? undefined : Number(e.target.value) })}
                            />
                          </label>
                          <label className="block">
                            <span className="text-xs font-semibold uppercase tracking-wide text-white/55">Max</span>
                            <input
                              type="number"
                              className="mt-1 w-full rounded border border-white/15 bg-black/40 px-3 py-2 text-sm text-white outline-none focus:border-white/35"
                              value={q.max ?? ""}
                              onChange={(e) => updateQuestion(idx, { max: e.target.value === "" ? undefined : Number(e.target.value) })}
                            />
                          </label>
                        </>
                      )}
                    </div>

                    {(q.type === "select" || q.type === "multiselect") && (
                      <div className="mt-4 space-y-2">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <p className="text-xs font-semibold uppercase tracking-wide text-white/55">Seçenekler</p>
                          <button
                            type="button"
                            className="rounded bg-white/5 px-3 py-2 text-xs font-semibold text-white/75 hover:bg-white/10"
                            onClick={() => addOption(idx)}
                          >
                            + Seçenek
                          </button>
                        </div>
                        <div className="space-y-2">
                          {(q.options || []).map((opt, oi) => (
                            <div key={`${q.id}-${oi}`} className="flex flex-col gap-2 md:flex-row">
                              <input
                                className="w-full rounded border border-white/15 bg-black/40 px-3 py-2 text-xs text-white outline-none focus:border-white/35 md:w-44"
                                value={opt.value}
                                onChange={(e) => updateOption(idx, oi, { value: e.target.value })}
                                placeholder="value"
                              />
                              <input
                                className="w-full rounded border border-white/15 bg-black/40 px-3 py-2 text-xs text-white outline-none focus:border-white/35"
                                value={opt.label}
                                onChange={(e) => updateOption(idx, oi, { label: e.target.value })}
                                placeholder="label"
                              />
                              <button
                                type="button"
                                className="rounded border border-red-500/40 px-3 py-2 text-xs font-semibold text-red-200 hover:bg-red-500/10 md:self-start"
                                onClick={() => removeOption(idx, oi)}
                              >
                                Sil
                              </button>
                            </div>
                          ))}
                          {(q.options || []).length === 0 && (
                            <p className="text-xs text-white/55">En az 1 seçenek olmalı.</p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex shrink-0 flex-row gap-2 md:flex-col md:items-end">
                    <button
                      type="button"
                      className="rounded bg-white/5 px-3 py-2 text-xs font-semibold text-white/75 hover:bg-white/10 disabled:opacity-40"
                      disabled={idx === 0}
                      onClick={() => moveQuestion(idx, -1)}
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      className="rounded bg-white/5 px-3 py-2 text-xs font-semibold text-white/75 hover:bg-white/10 disabled:opacity-40"
                      disabled={idx === formDraft.questions.length - 1}
                      onClick={() => moveQuestion(idx, 1)}
                    >
                      ↓
                    </button>
                    <button
                      type="button"
                      className="rounded border border-red-500/40 px-3 py-2 text-xs font-semibold text-red-200 hover:bg-red-500/10"
                      onClick={() => removeQuestion(idx)}
                    >
                      Sil
                    </button>
                  </div>
                </div>

                <p className="mt-3 text-[11px] text-white/40">
                  id: <span className="font-mono">{q.id}</span>
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="overflow-x-auto rounded-lg border border-white/10">
        <table className="w-full min-w-[640px] text-left text-sm text-white/90">
          <thead className="border-b border-white/10 bg-white/[0.06] text-white/70">
            <tr>
              <th className="px-4 py-3 font-medium">Başlık</th>
              <th className="px-4 py-3 font-medium">Durum</th>
              <th className="px-4 py-3 font-medium text-right">İşlem</th>
            </tr>
          </thead>
          <tbody>
            {list.map((ev) => (
              <tr key={ev.id} className="border-b border-white/5 hover:bg-white/[0.03]">
                <td className="px-4 py-3">{ev.title}</td>
                <td className="px-4 py-3">{ev.status === "active" ? "Aktif" : "Geçmiş"}</td>
                <td className="px-4 py-3 text-right">
                  <button
                    type="button"
                    className="mr-2 text-white/80 hover:underline"
                    onClick={() => openFormEditor(ev)}
                  >
                    Form
                  </button>
                  <button type="button" className="mr-2 text-white/80 hover:underline" onClick={() => startEdit(ev)}>
                    Düzenle
                  </button>
                  <button type="button" className="text-red-300 hover:underline" onClick={() => onDelete(ev.id)}>
                    Sil
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {list.length === 0 && <p className="px-4 py-8 text-center text-white/50">Kayıt yok.</p>}
      </div>
    </div>
  );
}

function hearLabels(h: ("social" | "friend" | "other")[]): string {
  const map: Record<string, string> = {
    social: "Sosyal Medya",
    friend: "Arkadaş",
    other: "Diğer",
  };
  return h.map((x) => map[x] || x).join(", ");
}

function ApplicationsPanel({ token, onUnauthorized }: { token: string; onUnauthorized: () => void }) {
  const [list, setList] = useState<TicketApplication[]>([]);
  const [events, setEvents] = useState<PublicEvent[]>([]);
  const [msg, setMsg] = useState<string | null>(null);
  const [scope, setScope] = useState<"active" | "past" | "all">("active");
  const [selectedEventId, setSelectedEventId] = useState<string>("__all__");
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const load = useCallback(async () => {
    const data = await apiGet<TicketApplication[]>("/api/applications", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setList(data);
  }, [token]);

  useEffect(() => {
    load().catch((err) => {
      if (err instanceof Error && err.message === "Yetkisiz") onUnauthorized();
      setMsg("Başvurular yüklenemedi.");
    });
  }, [load]);

  const loadEvents = useCallback(async () => {
    const data = await apiGet<PublicEvent[]>("/api/events");
    setEvents(data);
  }, []);

  useEffect(() => {
    loadEvents().catch(() => setMsg("Etkinlik listesi yüklenemedi."));
  }, [loadEvents]);

  async function setStatus(id: string, status: ApplicationStatus) {
    setMsg(null);
    try {
      await apiSend(`/api/applications/${id}`, {
        method: "PATCH",
        token,
        body: { status },
      });
      setMsg("Durum güncellendi.");
      await load();
    } catch (err) {
      if (err instanceof Error && err.message === "Yetkisiz") onUnauthorized();
      setMsg(err instanceof Error ? err.message : "Güncellenemedi");
    }
  }

  const qtyLabel = (q: string) =>
    q === "one" ? "Bir" : q === "two" ? "İki" : q === "more" ? "İki+" : q;

  const eventById = new Map(events.map((e) => [e.id, e] as const));

  const scopedEvents =
    scope === "all" ? events : events.filter((e) => e.status === scope);

  const eventOptions = [
    { id: "__all__", title: "Tümü (etkinliğe göre gruplu)" },
    ...scopedEvents
      .slice()
      .sort((a, b) => a.title.localeCompare(b.title, "tr"))
      .map((e) => ({
        id: e.id,
        title: e.title,
      })),
  ];

  const selectedEventExists =
    selectedEventId === "__all__" || scopedEvents.some((e) => e.id === selectedEventId);

  const effectiveSelectedEventId = selectedEventExists ? selectedEventId : "__all__";

  const filtered =
    effectiveSelectedEventId === "__all__"
      ? list.filter((a) => {
          const ev = eventById.get(a.eventId);
          if (scope === "all") return true;
          if (!ev) return true; // etkinlik silinmiş/unknown ise yine göster
          return ev.status === scope;
        })
      : list.filter((a) => a.eventId === effectiveSelectedEventId);

  const grouped = filtered.reduce<Record<string, TicketApplication[]>>((acc, a) => {
    (acc[a.eventId] ||= []).push(a);
    return acc;
  }, {});

  const groupOrder = Object.keys(grouped).sort((aId, bId) => {
    const aTitle = eventById.get(aId)?.title || grouped[aId]?.[0]?.eventTitleSnapshot || aId;
    const bTitle = eventById.get(bId)?.title || grouped[bId]?.[0]?.eventTitleSnapshot || bId;
    return aTitle.localeCompare(bTitle, "tr");
  });

  function formatAnswerValue(
    eventId: string,
    questionId: string,
    value: unknown,
  ): string {
    const form = eventById.get(eventId)?.applicationForm;
    const q = form?.questions?.find((x) => x.id === questionId);

    if (q?.type === "multiselect" && Array.isArray(value)) {
      const vals = value.filter((x): x is string => typeof x === "string");
      const map = new Map((q.options || []).map((o) => [o.value, o.label] as const));
      return vals.map((v) => map.get(v) || v).join(", ");
    }

    if (q?.type === "select" && typeof value === "string") {
      const map = new Map((q.options || []).map((o) => [o.value, o.label] as const));
      return map.get(value) || value;
    }

    if (typeof value === "string") return value;
    if (typeof value === "number") return String(value);
    if (typeof value === "boolean") return value ? "Evet" : "Hayır";
    if (Array.isArray(value)) return value.map((v) => String(v)).join(", ");
    if (value == null) return "—";
    return String(value);
  }

  function deriveDisplayName(a: TicketApplication): string {
    if (a.name && a.name.trim()) return a.name.trim();
    const ans = a.answers;
    if (!ans || typeof ans !== "object") return "Başvuru";
    const form = eventById.get(a.eventId)?.applicationForm;
    if (!form?.questions?.length) return "Başvuru";

    const preferred = form.questions.find((q) => /(^|\\b)(ad|isim|name)(\\b|$)/i.test(q.label));
    if (preferred) {
      const v = (ans as Record<string, unknown>)[preferred.id];
      if (typeof v === "string" && v.trim()) return v.trim();
    }

    const firstString = form.questions.find((q) => {
      const v = (ans as Record<string, unknown>)[q.id];
      return typeof v === "string" && v.trim();
    });
    if (firstString) return String((ans as Record<string, unknown>)[firstString.id]).trim();

    return "Başvuru";
  }

  function renderApplication(a: TicketApplication) {
    const displayName = deriveDisplayName(a);
    const isDynamic = !!a.answers && typeof a.answers === "object";
    const legacyQty = a.ticketQuantity ? qtyLabel(a.ticketQuantity) : "—";
    const ans = isDynamic ? (a.answers as Record<string, unknown>) : null;
    const form = eventById.get(a.eventId)?.applicationForm;

    const orderedAnswerRows: Array<{ key: string; label: string; value: unknown }> = [];
    if (ans) {
      const seen = new Set<string>();
      if (form?.questions?.length) {
        for (const q of form.questions) {
          orderedAnswerRows.push({ key: q.id, label: q.label, value: ans[q.id] });
          seen.add(q.id);
        }
      }
      for (const [qid, v] of Object.entries(ans)) {
        if (seen.has(qid)) continue;
        orderedAnswerRows.push({ key: qid, label: qid, value: v });
      }
    }

    const isExpanded = expanded[a.id] === true;
    const rowsToShow = isExpanded ? orderedAnswerRows : orderedAnswerRows.slice(0, 6);

    return (
      <div key={a.id} className="rounded-lg border border-white/10 bg-white/[0.04] p-4 md:p-5">
        <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="font-semibold text-white">{displayName}</p>
            <p className="text-sm text-white/55">
              {a.eventTitleSnapshot} · {new Date(a.createdAt).toLocaleString("tr-TR")}
            </p>
            {!isDynamic ? (
              <>
                <p className="mt-2 text-sm text-white/75">
                  Tel: {a.phone || "—"} · Doğum: {a.dateOfBirth || "—"} · Bilet: {legacyQty}
                </p>
                <p className="mt-1 text-sm text-white/75">Katılımcılar: {a.attendeesInfo || "—"}</p>
                <p className="mt-1 text-sm text-white/75">Haberdar: {hearLabels(a.hearAbout || [])}</p>
              </>
            ) : (
              <div className="mt-3 space-y-1">
                {rowsToShow.map((row) => (
                  <p key={row.key} className="text-sm text-white/75">
                    <span className="text-white/55">{row.label}: </span>
                    {formatAnswerValue(a.eventId, row.key, row.value) || "—"}
                  </p>
                ))}

                {orderedAnswerRows.length > 6 && (
                  <button
                    type="button"
                    className="mt-2 text-xs font-semibold text-white/70 underline-offset-2 hover:underline"
                    onClick={() => setExpanded((prev) => ({ ...prev, [a.id]: !isExpanded }))}
                  >
                    {isExpanded ? "Yanıtları gizle" : `Tüm yanıtları göster (${orderedAnswerRows.length})`}
                  </button>
                )}
              </div>
            )}
          </div>
          <span
            className={`inline-flex shrink-0 self-start rounded px-2 py-1 text-xs font-medium ${
              a.status === "accepted"
                ? "bg-amber-400/90 text-black"
                : a.status === "issued"
                  ? "bg-emerald-600 text-white"
                  : a.status === "rejected"
                    ? "bg-red-600 text-white"
                    : "bg-white/15 text-white"
            }`}
          >
            {STATUS_LABELS[a.status]}
          </span>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            className={`rounded px-3 py-1.5 text-xs font-semibold ${statusStyle("accepted")}`}
            onClick={() => setStatus(a.id, "accepted")}
          >
            Kabul et (sarı)
          </button>
          <button
            type="button"
            className={`rounded px-3 py-1.5 text-xs font-semibold ${statusStyle("issued")}`}
            onClick={() => setStatus(a.id, "issued")}
          >
            Bilet verildi (yeşil)
          </button>
          <button
            type="button"
            className={`rounded px-3 py-1.5 text-xs font-semibold ${statusStyle("rejected")}`}
            onClick={() => setStatus(a.id, "rejected")}
          >
            Reddet (kırmızı)
          </button>
          <button
            type="button"
            className={`rounded px-3 py-1.5 text-xs font-semibold ${statusStyle("pending")}`}
            onClick={() => setStatus(a.id, "pending")}
          >
            Beklemede
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {msg && <p className="rounded border border-white/15 bg-white/5 px-4 py-3 text-sm text-white/85">{msg}</p>}
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
          <label className="flex flex-col gap-1">
            <span className="text-xs font-semibold uppercase tracking-wide text-white/55">Kapsam</span>
            <div className="flex flex-wrap gap-2">
              {(
                [
                  ["active", "Aktif etkinlikler"],
                  ["past", "Geçmiş etkinlikler"],
                  ["all", "Hepsi"],
                ] as const
              ).map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  className={`rounded px-3 py-2 text-sm font-medium transition ${
                    scope === id ? "bg-white text-black" : "bg-white/5 text-white/75 hover:bg-white/10"
                  }`}
                  onClick={() => {
                    setScope(id);
                    setSelectedEventId("__all__");
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-xs font-semibold uppercase tracking-wide text-white/55">Etkinlik</span>
            <select
              className="h-10 min-w-[260px] rounded border border-white/15 bg-black/40 px-3 text-sm text-white outline-none focus:border-white/35"
              value={effectiveSelectedEventId}
              onChange={(e) => setSelectedEventId(e.target.value)}
            >
              {eventOptions.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.title}
                </option>
              ))}
            </select>
          </label>
        </div>

        <button
          type="button"
          className="h-10 rounded border border-white/20 px-4 text-sm text-white/85 hover:bg-white/10"
          onClick={() => {
            setMsg(null);
            Promise.all([load(), loadEvents()]).catch(() => {});
          }}
        >
          Yenile
        </button>
      </div>

      <div className="space-y-4">
        {groupOrder.map((eventId) => {
          const ev = eventById.get(eventId);
          const title = ev?.title || grouped[eventId]?.[0]?.eventTitleSnapshot || eventId;
          const badge =
            scope === "all"
              ? ev?.status === "active"
                ? "Aktif"
                : ev?.status === "past"
                  ? "Geçmiş"
                  : null
              : null;

          return (
            <div key={eventId} className="space-y-3">
              {effectiveSelectedEventId === "__all__" && (
                <div className="flex flex-wrap items-center justify-between gap-2 rounded border border-white/10 bg-white/[0.03] px-4 py-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-white">{title}</p>
                    <p className="mt-0.5 text-xs text-white/55">{grouped[eventId].length} başvuru</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {badge && (
                      <span className="rounded bg-white/10 px-2 py-1 text-xs font-medium text-white/75">{badge}</span>
                    )}
                    <button
                      type="button"
                      className="rounded bg-white/5 px-3 py-2 text-xs font-semibold text-white/80 hover:bg-white/10"
                      onClick={() => setSelectedEventId(eventId)}
                    >
                      Bu etkinliği seç
                    </button>
                  </div>
                </div>
              )}

              <div className="space-y-4">{grouped[eventId].map(renderApplication)}</div>
            </div>
          );
        })}

        {filtered.length === 0 && <p className="text-center text-white/50">Bu filtrede başvuru yok.</p>}
      </div>
    </div>
  );
}
