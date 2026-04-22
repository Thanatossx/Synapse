import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiGet, apiSend } from "../lib/api";
import { fallbackEvents } from "../lib/fallbackData";
import type { ApplicationForm, PublicEvent, Question } from "../types/data";

function FieldCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-white/15 bg-white/[0.04] p-4 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)] md:p-5">
      {children}
    </div>
  );
}

export function TicketApply() {
  const [step, setStep] = useState<1 | 2>(1);
  const [events, setEvents] = useState<PublicEvent[]>([]);
  const [loadErr, setLoadErr] = useState<string | null>(null);
  const [eventId, setEventId] = useState("");

  const [form, setForm] = useState<ApplicationForm | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [answers, setAnswers] = useState<Record<string, unknown>>({});

  const [submitting, setSubmitting] = useState(false);
  const [doneId, setDoneId] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    apiGet<PublicEvent[]>("/api/events")
      .then((list) => {
        setEvents(list.filter((e) => e.status === "active"));
        setLoadErr(null);
      })
      .catch(() => {
        setEvents(fallbackEvents().filter((e) => e.status === "active"));
        setLoadErr("Sunucuya ulaşılamadı; örnek aktif etkinlikler gösteriliyor. Gönderim için sunucuyu çalıştırın.");
      });
  }, []);

  useEffect(() => {
    if (!eventId) {
      setForm(null);
      setAnswers({});
      return;
    }
    setFormLoading(true);
    setFormError(null);
    apiGet<ApplicationForm>(`/api/events/${eventId}/application-form`)
      .then((f) => {
        setForm(f);
        setAnswers({});
      })
      .catch(() => {
        setFormError("Form yüklenemedi. Sunucu çalışıyor mu?");
        setForm(null);
        setAnswers({});
      })
      .finally(() => setFormLoading(false));
  }, [eventId]);

  function resetAll() {
    setStep(1);
    setEventId("");
    setForm(null);
    setAnswers({});
    setDoneId(null);
    setFormError(null);
  }

  function setAnswer(id: string, value: unknown) {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  }

  function toggleMulti(id: string, value: string) {
    setAnswers((prev) => {
      const cur = prev[id];
      const arr = Array.isArray(cur) ? cur.filter((x) => typeof x === "string") : [];
      return { ...prev, [id]: arr.includes(value) ? arr.filter((x) => x !== value) : [...arr, value] };
    });
  }

  function validateClient(f: ApplicationForm | null, ans: Record<string, unknown>): string | null {
    if (!eventId) return "Etkinlik seçin.";
    if (!f) return "Form yüklenemedi.";
    for (const q of f.questions || []) {
      const v = ans[q.id];
      const empty =
        v == null ||
        (typeof v === "string" && v.trim() === "") ||
        (Array.isArray(v) && v.length === 0);
      if (q.required && empty) return `"${q.label}" zorunlu.`;
      if (q.type === "rules_ack" && q.required && v !== true) return `"${q.label}" onaylanmalı.`;
    }
    return null;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    const clientErr = validateClient(form, answers);
    if (clientErr) {
      setFormError(clientErr);
      return;
    }
    setSubmitting(true);
    try {
      const res = await apiSend<{ id: string }>("/api/applications", {
        method: "POST",
        body: {
          eventId,
          answers,
        },
      });
      setDoneId(res.id);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Gönderilemedi");
    } finally {
      setSubmitting(false);
    }
  }

  const activeEvents = events;

  function renderQuestion(q: Question) {
    const value = answers[q.id];

    const label = (
      <span className="block text-[15px] font-bold text-white">
        {q.label}{" "}
        {q.required && (
          <span className="text-red-400" aria-hidden>
            *
          </span>
        )}
      </span>
    );

    const help = q.helpText ? <p className="mt-2 text-sm text-white/60">{q.helpText}</p> : null;

    if (q.type === "text") {
      return (
        <FieldCard key={q.id}>
          {label}
          {help}
          <input
            className="mt-3 w-full border-b border-white/20 bg-transparent py-2 text-[15px] text-white outline-none placeholder:text-white/35 focus:border-white/50"
            placeholder={q.placeholder || "Yanıtınız"}
            value={typeof value === "string" ? value : ""}
            onChange={(e) => setAnswer(q.id, e.target.value)}
          />
        </FieldCard>
      );
    }

    if (q.type === "textarea") {
      return (
        <FieldCard key={q.id}>
          {label}
          {help}
          <textarea
            className="mt-3 w-full rounded border border-white/15 bg-black/40 px-3 py-3 text-[15px] text-white outline-none placeholder:text-white/35 focus:border-white/35"
            placeholder={q.placeholder || "Yanıtınız"}
            rows={4}
            value={typeof value === "string" ? value : ""}
            onChange={(e) => setAnswer(q.id, e.target.value)}
          />
        </FieldCard>
      );
    }

    if (q.type === "date") {
      return (
        <FieldCard key={q.id}>
          {label}
          {help}
          <input
            type="date"
            className="mt-3 w-full rounded border border-white/15 bg-black/50 px-3 py-2 text-[15px] text-white outline-none focus:border-white/35"
            value={typeof value === "string" ? value : ""}
            onChange={(e) => setAnswer(q.id, e.target.value)}
          />
        </FieldCard>
      );
    }

    if (q.type === "number") {
      const v = typeof value === "number" || typeof value === "string" ? String(value) : "";
      return (
        <FieldCard key={q.id}>
          {label}
          {help}
          <input
            type="number"
            min={q.min}
            max={q.max}
            className="mt-3 w-full rounded border border-white/15 bg-black/50 px-3 py-2 text-[15px] text-white outline-none focus:border-white/35"
            value={v}
            onChange={(e) => setAnswer(q.id, e.target.value)}
          />
        </FieldCard>
      );
    }

    if (q.type === "select") {
      const v = typeof value === "string" ? value : "";
      return (
        <FieldCard key={q.id}>
          {label}
          {help}
          <select
            className="mt-3 w-full rounded border border-white/15 bg-black/50 px-3 py-3 text-[15px] text-white outline-none focus:border-white/35"
            value={v}
            onChange={(e) => setAnswer(q.id, e.target.value)}
          >
            <option value="">Seçin</option>
            {(q.options || []).map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </FieldCard>
      );
    }

    if (q.type === "multiselect") {
      const arr = Array.isArray(value) ? value.filter((x) => typeof x === "string") : [];
      return (
        <FieldCard key={q.id}>
          {label}
          {help}
          <div className="mt-4 space-y-3">
            {(q.options || []).map((o) => (
              <label key={o.value} className="flex cursor-pointer items-start gap-3 text-[15px] text-white/90">
                <input
                  type="checkbox"
                  className="mt-1 rounded border-white/30"
                  checked={arr.includes(o.value)}
                  onChange={() => toggleMulti(q.id, o.value)}
                />
                <span>{o.label}</span>
              </label>
            ))}
          </div>
        </FieldCard>
      );
    }

    // rules_ack
    return (
      <FieldCard key={q.id}>
        {label}
        {help}
        <label className="mt-4 flex cursor-pointer items-start gap-3 text-[15px] text-white/90">
          <input
            type="checkbox"
            className="mt-1 rounded border-white/30"
            checked={value === true}
            onChange={(e) => setAnswer(q.id, e.target.checked)}
          />
          <span>Onaylıyorum.</span>
        </label>
      </FieldCard>
    );
  }

  return (
    <div className="w-full">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-black" />
        <div className="relative z-10 mx-auto max-w-[720px] px-6 py-16 md:py-24">
          <div className="mb-10">
            <Link to="/tickets" className="text-sm text-white/60 underline-offset-4 hover:text-white hover:underline">
              ← Bilet ve kurallar
            </Link>
            <h1
              className="mt-6 font-bold uppercase tracking-tight text-white"
              style={{ fontSize: "clamp(1.5rem, 3cqi + 1rem, 2rem)" }}
            >
              Bilet başvurusu
            </h1>
            <p className="mt-3 text-[15px] leading-relaxed text-white/75">
              Aktif bir etkinlik seçin, formu doldurun ve gönderin.
            </p>
          </div>

          {loadErr && (
            <p className="mb-6 rounded border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-100/90">
              {loadErr}
            </p>
          )}

          {doneId ? (
            <div className="rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-5 py-8 text-center">
              <p className="text-lg font-semibold text-white">Başvurun alındı</p>
              <p className="mt-2 text-sm text-white/75">Referans: {doneId}</p>
              <button
                type="button"
                className="mt-6 inline-flex rounded-none bg-[#353b57] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#434964]"
                onClick={resetAll}
              >
                Yeni başvuru
              </button>
            </div>
          ) : (
            <>
              {step === 1 && (
                <div className="space-y-6">
                  <FieldCard>
                    <label className="block text-[15px] font-bold text-white">
                      Biletini almak istediğin etkinliği seç{" "}
                      <span className="text-red-400" aria-hidden>
                        *
                      </span>
                    </label>
                    <select
                      className="mt-3 w-full rounded border border-white/15 bg-black/50 px-3 py-3 text-[15px] text-white outline-none focus:border-white/35"
                      value={eventId}
                      onChange={(e) => setEventId(e.target.value)}
                      required
                    >
                      <option value="">Etkinlik seçin</option>
                      {activeEvents.map((ev) => (
                        <option key={ev.id} value={ev.id}>
                          {ev.title}
                        </option>
                      ))}
                    </select>
                    {activeEvents.length === 0 && (
                      <p className="mt-3 text-sm text-white/55">Şu an listelenecek aktif etkinlik yok.</p>
                    )}
                  </FieldCard>
                  <button
                    type="button"
                    disabled={!eventId}
                    className="inline-flex rounded-none bg-[#6d28d9] px-6 py-3 text-sm font-semibold text-white hover:bg-[#5b21b6] disabled:cursor-not-allowed disabled:opacity-40"
                    onClick={() => setStep(2)}
                  >
                    Devam et
                  </button>
                </div>
              )}

              {step === 2 && (
                <form className="space-y-5" onSubmit={onSubmit}>
                  <p className="text-sm text-white/55">
                    Seçilen etkinlik:{" "}
                    <span className="text-white/90">
                      {activeEvents.find((e) => e.id === eventId)?.title ?? "—"}
                    </span>
                    <button
                      type="button"
                      className="ml-3 text-white/80 underline-offset-2 hover:underline"
                      onClick={() => setStep(1)}
                    >
                      Değiştir
                    </button>
                  </p>

                  {formLoading && (
                    <p className="rounded border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white/75">
                      Form yükleniyor…
                    </p>
                  )}

                  {form && !formLoading && form.questions.length === 0 && (
                    <p className="rounded border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-100/90">
                      Bu etkinlik için henüz form tanımlanmamış.
                    </p>
                  )}

                  {form?.questions.map(renderQuestion)}

                  {formError && (
                    <p className="rounded border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-100">
                      {formError}
                    </p>
                  )}

                  <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="inline-flex rounded-none bg-[#6d28d9] px-8 py-3 text-sm font-semibold text-white hover:bg-[#5b21b6] disabled:opacity-50"
                    >
                      {submitting ? "Gönderiliyor…" : "Gönder"}
                    </button>
                    <button
                      type="button"
                      className="text-sm font-medium text-white/80 hover:underline"
                      onClick={resetAll}
                    >
                      Formu temizle
                    </button>
                  </div>
                </form>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
}
