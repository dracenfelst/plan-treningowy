import React, { useState, useEffect, useRef } from "react";
import { Icon, iconTypeFor, resolveIconType, dayIconType, COLORS, groupColorFor, muscleGroupFor, withAlpha } from "./icons.jsx";
import { uid, defaultDays } from "./defaultData.js";
import Calendar, { groupHistoryByDate } from "./Calendar.jsx";
import Timer from "./Timer.jsx";
import { applyRotation, detachFromPool } from "./rotation.js";
import { supabase, supabaseEnabled } from "./supabaseClient.js";
import { useAuth } from "./Auth.jsx";
import Onboarding from "./Onboarding.jsx";

const STORAGE_KEY = "plan-treningowy-state-v1";

// Anyone who already had local data before this feature existed (parsed.profile
// is undefined, not just falsy) gets grandfathered in as already-onboarded — only
// a truly fresh install/signup (no saved state at all) sees the onboarding wizard.
function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        days: applyRotation(parsed.days || defaultDays()),
        history: parsed.history || [],
        checked: parsed.checked || {},
        profile: parsed.profile !== undefined ? parsed.profile : { onboarded: true },
      };
    }
  } catch (e) {}
  return { days: applyRotation(defaultDays()), history: [], checked: {}, profile: null };
}

function computeStreak(history) {
  const dates = new Set(history.map((h) => h.date.slice(0, 10)));
  if (dates.size === 0) return 0;
  let d = new Date();
  const todayStr = d.toISOString().slice(0, 10);
  if (!dates.has(todayStr)) d.setDate(d.getDate() - 1);
  let streak = 0;
  while (dates.has(d.toISOString().slice(0, 10))) {
    streak++;
    d.setDate(d.getDate() - 1);
  }
  return streak;
}

const ACTIVITY_TYPES = ["Bieganie", "Rower", "Rozciąganie", "Siłowo (poza planem)", "Inne"];
const STRENGTH_GROUPS = ["push", "pull", "legs"];

export default function App() {
  const { session, signOut } = useAuth();
  const initial = useRef(loadState()).current;
  const [days, setDays] = useState(initial.days);
  const [history, setHistory] = useState(initial.history);
  const [checked, setChecked] = useState(initial.checked);
  const [profile, setProfile] = useState(initial.profile);
  const [cloudReady, setCloudReady] = useState(!supabaseEnabled);

  const [openDay, setOpenDay] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editDraft, setEditDraft] = useState(null);
  const [addingTo, setAddingTo] = useState(null);
  const [newEx, setNewEx] = useState({ name: "", sets: "3", reps: "10" });
  const [editingDayId, setEditingDayId] = useState(null);
  const [dayTitleDraft, setDayTitleDraft] = useState("");
  const [logOpen, setLogOpen] = useState(false);
  const [logDraft, setLogDraft] = useState({ type: "Bieganie", duration: "30", note: "", date: new Date().toISOString().slice(0, 10) });
  const [historyView, setHistoryView] = useState("calendar");
  const [calMonth, setCalMonth] = useState(new Date(new Date().getFullYear(), new Date().getMonth(), 1));
  const [selectedDate, setSelectedDate] = useState(null);
  const [zoomedIcon, setZoomedIcon] = useState(null);
  const [tab, setTab] = useState("plan");

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ days, history, checked, profile })); } catch (e) {}
  }, [days, history, checked, profile]);

  useEffect(() => {
    if (!supabaseEnabled || !session) return;
    let cancelled = false;
    setCloudReady(false);
    (async () => {
      const { data, error } = await supabase.from("plans").select("data").eq("user_id", session.user.id).maybeSingle();
      if (cancelled) return;
      if (error) { console.error("Nie udało się wczytać planu z chmury:", error.message); }
      const cloud = data && data.data;
      if (cloud && Object.keys(cloud).length) {
        setDays(applyRotation(cloud.days || defaultDays()));
        setHistory(cloud.history || []);
        setChecked(cloud.checked || {});
        // Same grandfather rule as loadState(): an existing cloud row predating
        // this feature (no profile key) means "already using the app", not "new".
        setProfile(cloud.profile !== undefined ? cloud.profile : { onboarded: true });
      }
      setCloudReady(true);
    })();
    return () => { cancelled = true; };
  }, [session?.user?.id]);

  useEffect(() => {
    if (!supabaseEnabled || !session || !cloudReady) return;
    supabase.from("plans")
      .upsert({ user_id: session.user.id, data: { days, history, checked, profile }, updated_at: new Date().toISOString() })
      .then(({ error }) => { if (error) console.error("Nie udało się zapisać planu w chmurze:", error.message); });
  }, [days, history, checked, profile, cloudReady, session]);

  const completeOnboarding = (answers, generatedDays) => {
    setDays(applyRotation(generatedDays));
    setChecked({});
    setProfile({ ...answers, onboarded: true, createdAt: new Date().toISOString() });
  };

  const streak = computeStreak(history);

  const toggleCheck = (dayId, exId) => {
    setChecked((prev) => {
      const set = new Set(prev[dayId] || []);
      set.has(exId) ? set.delete(exId) : set.add(exId);
      return { ...prev, [dayId]: Array.from(set) };
    });
  };

  const finishSession = (day) => {
    const doneCount = (checked[day.id] || []).length;
    setHistory((h) => [
      { id: uid(), type: "plan", dayTitle: day.title, date: new Date().toISOString(), exercisesDone: doneCount, exercisesTotal: day.exercises.length },
      ...h,
    ].slice(0, 60));
    setChecked((prev) => ({ ...prev, [day.id]: [] }));
  };

  const updateExercise = (dayId, exId, patch) => {
    setDays((ds) => ds.map((d) => d.id !== dayId ? d : { ...d, exercises: d.exercises.map((e) => e.id === exId ? detachFromPool({ ...e, ...patch }) : e) }));
  };
  const deleteExercise = (dayId, exId) => {
    if (!confirm("Usunąć to ćwiczenie?")) return;
    setDays((ds) => ds.map((d) => d.id !== dayId ? d : { ...d, exercises: d.exercises.filter((e) => e.id !== exId) }));
  };
  const addExercise = (dayId) => {
    const name = newEx.name.trim();
    if (!name) return;
    const day = days.find((d) => d.id === dayId);
    const dayGroup = muscleGroupFor(dayIconType(day.title));
    const exGroup = muscleGroupFor(iconTypeFor(name));
    if (STRENGTH_GROUPS.includes(dayGroup) && STRENGTH_GROUPS.includes(exGroup) && dayGroup !== exGroup) {
      const ok = confirm(`To ćwiczenie wygląda jak trening innej partii niż "${day.title}". Dodać mimo to?`);
      if (!ok) return;
    }
    setDays((ds) => ds.map((d) => d.id !== dayId ? d : { ...d, exercises: [...d.exercises, { id: uid(), name, sets: Number(newEx.sets) || 1, reps: newEx.reps || "-", note: "" }] }));
    setNewEx({ name: "", sets: "3", reps: "10" });
    setAddingTo(null);
  };
  const saveDayTitle = (dayId) => {
    setDays((ds) => ds.map((d) => d.id !== dayId ? d : { ...d, title: dayTitleDraft.trim() || d.title }));
    setEditingDayId(null);
  };
  const deleteDay = (dayId) => {
    if (!confirm("Usunąć cały ten dzień treningowy?")) return;
    setDays((ds) => ds.filter((d) => d.id !== dayId));
  };
  const addDay = () => {
    const nd = { id: uid(), title: "Nowy dzień", tag: "WŁASNY", exercises: [] };
    setDays((ds) => [...ds, nd]);
    setEditingDayId(nd.id);
    setDayTitleDraft(nd.title);
    setOpenDay(nd.id);
  };
  const resetPlan = () => {
    if (!confirm("Przywrócić domyślny plan? Twoje zmiany w ćwiczeniach zostaną nadpisane (historia zostanie).")) return;
    setDays(applyRotation(defaultDays()));
    setChecked({});
  };
  const submitLog = () => {
    setHistory((h) => [
      { id: uid(), type: "activity", activityType: logDraft.type, duration: logDraft.duration, note: logDraft.note.trim(), date: new Date(logDraft.date + "T12:00:00").toISOString() },
      ...h,
    ].slice(0, 60));
    setLogOpen(false);
  };
  const deleteHistory = (id) => {
    if (!confirm("Usunąć ten wpis z historii?")) return;
    setHistory((h) => h.filter((x) => x.id !== id));
  };
  const openLog = (dateStr) => {
    setLogDraft({ type: "Bieganie", duration: "30", note: "", date: dateStr || new Date().toISOString().slice(0, 10) });
    setLogOpen(true);
  };

  if (supabaseEnabled && session && !cloudReady) {
    return <div style={{ minHeight: "100vh", background: "#14161A", color: "#8A8E96", fontFamily: "Inter, sans-serif", fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center" }}>Wczytywanie…</div>;
  }
  if (!profile || !profile.onboarded) {
    return <Onboarding onComplete={completeOnboarding} />;
  }

  return (
    <div style={{ background: "#14161A", minHeight: "100vh", fontFamily: "Inter, sans-serif", color: "#EDEAE3", paddingBottom: 88 }}>
      <style>{`
        @keyframes spinCrank { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes bandPulse { 0%,100% { transform: scaleX(1); } 50% { transform: scaleX(0.7); } }
      `}</style>

      {/* Header */}
      <div style={{ padding: "28px 20px 18px", borderBottom: "1px solid #2B3038" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
          <div>
            <div style={{ fontFamily: "Oswald, sans-serif", fontWeight: 700, fontSize: 26, letterSpacing: 1, textTransform: "uppercase" }}>
              Przypakowany <span style={{ color: COLORS.brass }}>Tata</span>
            </div>
            <div style={{ color: "#8A8E96", fontSize: 13, marginTop: 4 }}>Plan 5 / tydzień · drążek · gumy · rower · bieganie</div>
          </div>
          {supabaseEnabled && session && (
            <div style={{ textAlign: "right", flexShrink: 0 }}>
              <div style={{ fontSize: 11, color: "#8A8E96", marginBottom: 4, wordBreak: "break-all" }}>{session.user.email}</div>
              <button onClick={signOut} style={{ background: "none", border: "1px solid #2B3038", borderRadius: 6, padding: "4px 10px", color: "#8A8E96", fontSize: 11, cursor: "pointer" }}>Wyloguj</button>
            </div>
          )}
        </div>
      </div>

      {/* Timer - always visible regardless of tab */}
      <div style={{ margin: "16px 20px 0" }}>
        <Timer />
      </div>

      {tab === "plan" && (
      <>
      {/* Log activity */}
      <div style={{ margin: "12px 20px 0" }}>
        <button onClick={() => openLog()}
          style={{ width: "100%", background: COLORS.brass, color: "#1A1500", border: "none", borderRadius: 10, padding: "12px 0", fontWeight: 700, fontSize: 13.5, textTransform: "uppercase", letterSpacing: 0.5, cursor: "pointer" }}>
          + Zaloguj aktywność
        </button>
      </div>

      {/* Streak */}
      {streak > 0 && (
        <div style={{ margin: "12px 20px 0", background: "#1D2025", border: "1px solid #2B3038", borderRadius: 12, padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontFamily: "Oswald, sans-serif", fontSize: 22, color: COLORS.brass }}>{streak} {streak === 1 ? "dzień" : "dni"}</div>
            <div style={{ fontSize: 11.5, color: "#8A8E96", textTransform: "uppercase", letterSpacing: 0.5 }}>seria z rzędu</div>
          </div>
          <div style={{ fontSize: 22 }}>🔥</div>
        </div>
      )}

      {/* Days */}
      <div style={{ padding: "18px 20px 0", display: "flex", flexDirection: "column", gap: 12 }}>
        {days.map((day, idx) => {
          const isOpen = openDay === day.id;
          const doneN = (checked[day.id] || []).length;
          const total = day.exercises.length;
          const groupColor = groupColorFor(dayIconType(day.title));
          return (
            <div key={day.id} style={{ background: `linear-gradient(135deg, ${withAlpha(groupColor, 0.16)} 0%, #1D2025 55%)`, border: "1px solid #2B3038", borderLeft: `3px solid ${groupColor}`, borderRadius: 14, overflow: "hidden" }}>
              <div onClick={() => setOpenDay(isOpen ? null : day.id)} style={{ padding: 16, cursor: "pointer", display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ fontFamily: "Oswald, sans-serif", fontSize: 13, color: groupColor, width: 20, flexShrink: 0 }}>{String(idx + 1).padStart(2, "0")}</div>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: `linear-gradient(135deg, ${withAlpha(groupColor, 0.32)}, ${withAlpha(groupColor, 0.1)})`, border: `1px solid ${withAlpha(groupColor, 0.4)}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Icon type={dayIconType(day.title)} color={groupColor} size={26} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  {editingDayId === day.id ? (
                    <input autoFocus onClick={(e) => e.stopPropagation()} value={dayTitleDraft} onChange={(e) => setDayTitleDraft(e.target.value)}
                      style={{ background: "#2B3038", border: "none", borderRadius: 6, padding: "4px 6px", color: "#EDEAE3", fontSize: 14, width: "100%" }} />
                  ) : (
                    <div style={{ fontWeight: 600, fontSize: 15 }}>{day.title}</div>
                  )}
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 4 }}>
                    <span style={{ fontSize: 10, color: groupColor, textTransform: "uppercase", letterSpacing: 0.5, background: withAlpha(groupColor, 0.16), border: `1px solid ${withAlpha(groupColor, 0.35)}`, borderRadius: 4, padding: "2px 6px" }}>{day.tag}</span>
                    <span style={{ fontSize: 11.5, color: "#8A8E96" }}>{total} ćwiczeń {doneN > 0 ? `· ${doneN}/${total} zaznaczone` : ""}</span>
                  </div>
                </div>
                {editingDayId === day.id ? (
                  <button onClick={(e) => { e.stopPropagation(); saveDayTitle(day.id); }} style={{ background: "none", border: "none", color: COLORS.brass, cursor: "pointer", fontSize: 12 }}>OK</button>
                ) : (
                  <button onClick={(e) => { e.stopPropagation(); setEditingDayId(day.id); setDayTitleDraft(day.title); }} style={{ background: "none", border: "none", color: "#8A8E96", cursor: "pointer", fontSize: 13 }}>✎</button>
                )}
                <button onClick={(e) => { e.stopPropagation(); deleteDay(day.id); }} style={{ background: "none", border: "none", color: "#B3502E", cursor: "pointer", fontSize: 16 }}>×</button>
                <div style={{ color: "#8A8E96", fontSize: 18, transform: isOpen ? "rotate(180deg)" : "none", transition: "transform .15s" }}>⌄</div>
              </div>

              {isOpen && (
                <div style={{ padding: "0 16px 16px" }}>
                  {day.exercises.map((ex) => {
                    const isEditing = editingId === ex.id;
                    const isDone = (checked[day.id] || []).includes(ex.id);
                    const exIconType = resolveIconType(ex);
                    const exColor = groupColorFor(exIconType);
                    return (
                      <div key={ex.id} style={{ borderTop: "1px solid #2B3038", padding: "12px 0", display: "flex", alignItems: "flex-start", gap: 10 }}>
                        <button onClick={() => toggleCheck(day.id, ex.id)}
                          style={{ width: 22, height: 22, borderRadius: 6, flexShrink: 0, cursor: "pointer", marginTop: 9, border: `1.5px solid ${isDone ? "#5C8A5C" : "#2B3038"}`, background: isDone ? "#5C8A5C" : "transparent", color: "#EDEAE3", fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center" }}>
                          {isDone ? "✓" : ""}
                        </button>
                        {!isEditing && (
                          <button onClick={() => setZoomedIcon({ name: ex.name, type: exIconType, color: exColor, equipment: ex.equipment })}
                            style={{ width: 46, height: 46, borderRadius: 10, background: withAlpha(exColor, isDone ? 0.08 : 0.18), border: `1px solid ${withAlpha(exColor, isDone ? 0.15 : 0.35)}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, opacity: isDone ? 0.45 : 1, cursor: "pointer", padding: 0 }}>
                            <Icon type={exIconType} color={exColor} size={28} equipment={ex.equipment} />
                          </button>
                        )}
                        {isEditing ? (
                          <div style={{ flex: 1, display: "flex", gap: 6, flexWrap: "wrap" }}>
                            <input value={editDraft.name} onChange={(e) => setEditDraft({ ...editDraft, name: e.target.value })}
                              style={{ flex: "1 1 140px", background: "#2B3038", border: "none", borderRadius: 6, padding: "6px 8px", color: "#EDEAE3", fontSize: 13 }} />
                            <input value={editDraft.sets} onChange={(e) => setEditDraft({ ...editDraft, sets: e.target.value })}
                              style={{ width: 40, background: "#2B3038", border: "none", borderRadius: 6, padding: "6px 8px", color: "#EDEAE3", fontSize: 13 }} />
                            <input value={editDraft.reps} onChange={(e) => setEditDraft({ ...editDraft, reps: e.target.value })}
                              style={{ width: 64, background: "#2B3038", border: "none", borderRadius: 6, padding: "6px 8px", color: "#EDEAE3", fontSize: 13 }} />
                            <input value={editDraft.note} placeholder="wskazówka techniki" onChange={(e) => setEditDraft({ ...editDraft, note: e.target.value })}
                              style={{ flex: "1 1 100%", background: "#2B3038", border: "none", borderRadius: 6, padding: "6px 8px", color: "#EDEAE3", fontSize: 12.5 }} />
                            <button onClick={() => { updateExercise(day.id, ex.id, editDraft); setEditingId(null); }}
                              style={{ background: COLORS.brass, border: "none", borderRadius: 6, padding: "6px 10px", color: "#1A1500", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>OK</button>
                          </div>
                        ) : (
                          <>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ fontSize: 13.5, color: isDone ? "#8A8E96" : "#EDEAE3", textDecoration: isDone ? "line-through" : "none" }}>
                                {ex.name}
                              </div>
                              <div style={{ fontSize: 11.5, color: "#8A8E96", marginTop: 1 }}>{ex.sets} × {ex.reps}</div>
                              {ex.note && <div style={{ fontSize: 11, color: COLORS.brass, marginTop: 3, opacity: isDone ? 0.5 : 0.9 }}>{ex.note}</div>}
                            </div>
                            <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                              <button onClick={() => { setEditingId(ex.id); setEditDraft({ name: ex.name, sets: ex.sets, reps: ex.reps, note: ex.note || "" }); }}
                                style={{ background: "none", border: "none", color: "#8A8E96", cursor: "pointer", fontSize: 11.5 }}>edytuj</button>
                              <button onClick={() => deleteExercise(day.id, ex.id)} style={{ background: "none", border: "none", color: "#B3502E", cursor: "pointer", fontSize: 15 }}>×</button>
                            </div>
                          </>
                        )}
                      </div>
                    );
                  })}

                  {addingTo === day.id ? (
                    <div style={{ marginTop: 10, display: "flex", gap: 6, flexWrap: "wrap" }}>
                      <input placeholder="nazwa ćwiczenia" value={newEx.name} onChange={(e) => setNewEx({ ...newEx, name: e.target.value })}
                        style={{ flex: "1 1 140px", background: "#2B3038", border: "none", borderRadius: 6, padding: "6px 8px", color: "#EDEAE3", fontSize: 13 }} />
                      <input placeholder="serie" value={newEx.sets} onChange={(e) => setNewEx({ ...newEx, sets: e.target.value })}
                        style={{ width: 50, background: "#2B3038", border: "none", borderRadius: 6, padding: "6px 8px", color: "#EDEAE3", fontSize: 13 }} />
                      <input placeholder="powt." value={newEx.reps} onChange={(e) => setNewEx({ ...newEx, reps: e.target.value })}
                        style={{ width: 60, background: "#2B3038", border: "none", borderRadius: 6, padding: "6px 8px", color: "#EDEAE3", fontSize: 13 }} />
                      <button onClick={() => addExercise(day.id)} style={{ background: COLORS.brass, border: "none", borderRadius: 6, padding: "6px 12px", color: "#1A1500", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Dodaj</button>
                      <button onClick={() => setAddingTo(null)} style={{ background: "none", border: "1px solid #2B3038", borderRadius: 6, padding: "6px 12px", color: "#8A8E96", fontSize: 12, cursor: "pointer" }}>Anuluj</button>
                    </div>
                  ) : (
                    <button onClick={() => setAddingTo(day.id)} style={{ marginTop: 10, background: "none", border: "1px dashed #2B3038", borderRadius: 8, padding: "8px 12px", color: "#8A8E96", fontSize: 12.5, cursor: "pointer", width: "100%", textAlign: "left" }}>+ dodaj ćwiczenie</button>
                  )}

                  <button onClick={() => finishSession(day)} style={{ marginTop: 14, width: "100%", background: "#5C8A5C", border: "none", borderRadius: 10, padding: "11px 0", color: "#0F1A0F", fontWeight: 700, fontSize: 13.5, letterSpacing: 0.5, cursor: "pointer", textTransform: "uppercase" }}>
                    Zakończ trening
                  </button>
                </div>
              )}
            </div>
          );
        })}

        <button onClick={addDay} style={{ background: "none", border: "1px dashed #2B3038", borderRadius: 12, padding: 14, color: "#8A8E96", fontSize: 13, cursor: "pointer", textAlign: "center" }}>
          + dodaj nowy dzień
        </button>
      </div>

      <div style={{ padding: "24px 20px 0", display: "flex", justifyContent: "center" }}>
        <button onClick={resetPlan} style={{ background: "none", border: "none", color: "#8A8E96", fontSize: 11.5, cursor: "pointer", textDecoration: "underline" }}>przywróć domyślny plan</button>
      </div>
      </>
      )}

      {tab === "historia" && (
      <>
      {/* History */}
      <div style={{ padding: "22px 20px 0" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
          <div style={{ fontFamily: "Oswald, sans-serif", fontSize: 15, letterSpacing: 0.5, textTransform: "uppercase", color: "#9A9EA6" }}>Historia</div>
          <div style={{ display: "flex", gap: 4, background: "#1D2025", border: "1px solid #2B3038", borderRadius: 8, padding: 2 }}>
            <button onClick={() => setHistoryView("calendar")} style={{ background: historyView === "calendar" ? "#2B3038" : "none", border: "none", color: historyView === "calendar" ? "#EDEAE3" : "#8A8E96", fontSize: 11.5, padding: "5px 10px", borderRadius: 6, cursor: "pointer" }}>Kalendarz</button>
            <button onClick={() => setHistoryView("list")} style={{ background: historyView === "list" ? "#2B3038" : "none", border: "none", color: historyView === "list" ? "#EDEAE3" : "#8A8E96", fontSize: 11.5, padding: "5px 10px", borderRadius: 6, cursor: "pointer" }}>Lista</button>
          </div>
        </div>

        {historyView === "calendar" ? (
          <>
            <Calendar month={calMonth} onMonthChange={setCalMonth} history={history} selectedDate={selectedDate} onSelectDate={(d) => setSelectedDate(d === selectedDate ? null : d)} />
            {selectedDate && (() => {
              const byDate = groupHistoryByDate(history);
              const entries = byDate[selectedDate] || [];
              const label = new Date(selectedDate + "T12:00:00").toLocaleDateString("pl-PL", { weekday: "long", day: "2-digit", month: "long" });
              return (
                <div style={{ marginTop: 10, background: "#1D2025", border: "1px solid #2B3038", borderRadius: 12, padding: 14 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, marginBottom: entries.length ? 8 : 10, textTransform: "capitalize" }}>{label}</div>
                  {entries.length === 0 ? (
                    <div style={{ fontSize: 12.5, color: "#8A8E96", marginBottom: 10 }}>Brak wpisów tego dnia.</div>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 10 }}>
                      {entries.map((h) => (
                        <div key={h.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 12.5, color: "#9A9EA6", background: "#14161A", borderRadius: 8, padding: "8px 12px", border: "1px solid #2B3038" }}>
                          <span>
                            <span style={{ fontSize: 9.5, textTransform: "uppercase", letterSpacing: 0.5, padding: "2px 6px", borderRadius: 4, marginRight: 6, background: h.type === "activity" ? "rgba(201,162,39,0.2)" : "rgba(92,138,92,0.2)", color: h.type === "activity" ? COLORS.brass : "#5C8A5C" }}>
                              {h.type === "activity" ? "aktywność" : "plan"}
                            </span>
                            {h.type === "activity" ? `${h.activityType}${h.note ? " — " + h.note : ""}` : h.dayTitle}
                          </span>
                          <span style={{ display: "flex", alignItems: "center" }}>
                            <span style={{ color: "#8A8E96" }}>{h.type === "activity" ? (h.duration ? `${h.duration} min` : "") : `${h.exercisesDone}/${h.exercisesTotal}`}</span>
                            <button onClick={() => deleteHistory(h.id)} style={{ background: "none", border: "none", color: "#8A8E96", cursor: "pointer", fontSize: 13, marginLeft: 6 }}>×</button>
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                  <button onClick={() => openLog(selectedDate)} style={{ width: "100%", background: "none", border: "1px dashed #2B3038", borderRadius: 8, padding: "8px 12px", color: "#8A8E96", fontSize: 12, cursor: "pointer" }}>+ dodaj wpis dla tego dnia</button>
                </div>
              );
            })()}
          </>
        ) : (
          history.length === 0 ? (
            <div style={{ color: "#8A8E96", fontSize: 13 }}>Brak wpisów — zakończ trening albo zaloguj aktywność.</div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {history.slice(0, 30).map((h) => {
                const dateStr = new Date(h.date).toLocaleDateString("pl-PL", { day: "2-digit", month: "2-digit" });
                return (
                  <div key={h.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 12.5, color: "#9A9EA6", background: "#1D2025", borderRadius: 8, padding: "8px 12px", border: "1px solid #2B3038" }}>
                    <span>
                      <span style={{ fontSize: 9.5, textTransform: "uppercase", letterSpacing: 0.5, padding: "2px 6px", borderRadius: 4, marginRight: 6, background: h.type === "activity" ? "rgba(201,162,39,0.2)" : "rgba(92,138,92,0.2)", color: h.type === "activity" ? COLORS.brass : "#5C8A5C" }}>
                        {h.type === "activity" ? "aktywność" : "plan"}
                      </span>
                      {h.type === "activity" ? `${h.activityType}${h.note ? " — " + h.note : ""}` : h.dayTitle}
                    </span>
                    <span style={{ display: "flex", alignItems: "center" }}>
                      <span style={{ color: "#8A8E96" }}>{dateStr}{h.type === "activity" ? (h.duration ? ` · ${h.duration} min` : "") : ` · ${h.exercisesDone}/${h.exercisesTotal}`}</span>
                      <button onClick={() => deleteHistory(h.id)} style={{ background: "none", border: "none", color: "#8A8E96", cursor: "pointer", fontSize: 13, marginLeft: 6 }}>×</button>
                    </span>
                  </div>
                );
              })}
            </div>
          )
        )}
      </div>
      </>
      )}

      {/* Bottom tab bar */}
      <div style={{ position: "fixed", left: 0, right: 0, bottom: 0, zIndex: 45, display: "flex", background: "#1A1C21", borderTop: "1px solid #2B3038", paddingBottom: "env(safe-area-inset-bottom, 0px)" }}>
        <button onClick={() => setTab("plan")}
          style={{ flex: 1, background: "none", border: "none", padding: "12px 0 10px", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
          <span style={{ fontSize: 18, opacity: tab === "plan" ? 1 : 0.55 }}>🏋️</span>
          <span style={{ fontSize: 11, fontWeight: 600, color: tab === "plan" ? COLORS.brass : "#8A8E96", textTransform: "uppercase", letterSpacing: 0.5 }}>Plan</span>
        </button>
        <button onClick={() => setTab("historia")}
          style={{ flex: 1, background: "none", border: "none", padding: "12px 0 10px", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
          <span style={{ fontSize: 18, opacity: tab === "historia" ? 1 : 0.55 }}>📅</span>
          <span style={{ fontSize: 11, fontWeight: 600, color: tab === "historia" ? COLORS.brass : "#8A8E96", textTransform: "uppercase", letterSpacing: 0.5 }}>Historia</span>
        </button>
      </div>

      {/* Log activity modal */}
      {logOpen && (
        <div onClick={() => setLogOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "flex-end", justifyContent: "center", zIndex: 50 }}>
          <div onClick={(e) => e.stopPropagation()} style={{ background: "#1D2025", border: "1px solid #2B3038", borderRadius: "16px 16px 0 0", padding: 20, width: "100%", maxWidth: 480 }}>
            <h3 style={{ fontFamily: "Oswald, sans-serif", textTransform: "uppercase", fontSize: 16, margin: "0 0 14px" }}>Zaloguj aktywność</h3>
            <label style={{ display: "block", fontSize: 11.5, color: "#8A8E96", margin: "10px 0 4px", textTransform: "uppercase", letterSpacing: 0.5 }}>Rodzaj</label>
            <select value={logDraft.type} onChange={(e) => setLogDraft({ ...logDraft, type: e.target.value })}
              style={{ width: "100%", background: "#2B3038", border: "none", borderRadius: 8, padding: 10, color: "#EDEAE3", fontSize: 14 }}>
              {ACTIVITY_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
            <label style={{ display: "block", fontSize: 11.5, color: "#8A8E96", margin: "10px 0 4px", textTransform: "uppercase", letterSpacing: 0.5 }}>Czas trwania (min)</label>
            <input type="number" value={logDraft.duration} onChange={(e) => setLogDraft({ ...logDraft, duration: e.target.value })}
              style={{ width: "100%", background: "#2B3038", border: "none", borderRadius: 8, padding: 10, color: "#EDEAE3", fontSize: 14 }} />
            <label style={{ display: "block", fontSize: 11.5, color: "#8A8E96", margin: "10px 0 4px", textTransform: "uppercase", letterSpacing: 0.5 }}>Notatka (opcjonalnie)</label>
            <textarea rows={2} placeholder="np. zamiast dzisiejszego planu" value={logDraft.note} onChange={(e) => setLogDraft({ ...logDraft, note: e.target.value })}
              style={{ width: "100%", background: "#2B3038", border: "none", borderRadius: 8, padding: 10, color: "#EDEAE3", fontSize: 14, fontFamily: "inherit" }} />
            <label style={{ display: "block", fontSize: 11.5, color: "#8A8E96", margin: "10px 0 4px", textTransform: "uppercase", letterSpacing: 0.5 }}>Data</label>
            <input type="date" value={logDraft.date} onChange={(e) => setLogDraft({ ...logDraft, date: e.target.value })}
              style={{ width: "100%", background: "#2B3038", border: "none", borderRadius: 8, padding: 10, color: "#EDEAE3", fontSize: 14 }} />
            <div style={{ display: "flex", gap: 8, marginTop: 18 }}>
              <button onClick={() => setLogOpen(false)} style={{ flex: 1, padding: "12px 0", borderRadius: 10, border: "1px solid #2B3038", background: "none", color: "#9A9EA6", fontWeight: 600, fontSize: 13.5, cursor: "pointer" }}>Anuluj</button>
              <button onClick={submitLog} style={{ flex: 1, padding: "12px 0", borderRadius: 10, border: "none", background: COLORS.brass, color: "#1A1500", fontWeight: 600, fontSize: 13.5, cursor: "pointer" }}>Zapisz</button>
            </div>
          </div>
        </div>
      )}

      {/* Icon zoom modal */}
      {zoomedIcon && (
        <div onClick={() => setZoomedIcon(null)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 60, padding: 24 }}>
          <div onClick={(e) => e.stopPropagation()} style={{ background: "#1D2025", border: "1px solid #2B3038", borderRadius: 16, padding: 24, maxWidth: 320, width: "100%", display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
            <div style={{ width: 180, height: 180, borderRadius: 16, background: withAlpha(zoomedIcon.color, 0.14), border: `1px solid ${withAlpha(zoomedIcon.color, 0.35)}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icon type={zoomedIcon.type} color={zoomedIcon.color} size={140} equipment={zoomedIcon.equipment} />
            </div>
            <div style={{ fontSize: 15, fontWeight: 600, textAlign: "center" }}>{zoomedIcon.name}</div>
            <button onClick={() => setZoomedIcon(null)} style={{ marginTop: 4, padding: "10px 24px", borderRadius: 10, border: "none", background: COLORS.brass, color: "#1A1500", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>Zamknij</button>
          </div>
        </div>
      )}
    </div>
  );
}
