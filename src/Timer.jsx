import React, { useState, useEffect, useRef } from "react";
import { COLORS, withAlpha } from "./icons.jsx";

const TIMER_KEY = "plan-treningowy-timer-v1";
const PRESETS = [
  { label: "Rozgrzewka 30 min", seconds: 30 * 60 },
  { label: "Przerwa 10s", seconds: 10 },
  { label: "Przerwa 20s", seconds: 20 },
  { label: "Przerwa 30s", seconds: 30 },
  { label: "Przerwa 60s", seconds: 60 },
  { label: "Przerwa 120s", seconds: 120 },
];

function loadTimer() {
  try {
    const raw = localStorage.getItem(TIMER_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return null;
}

function fmt(sec) {
  const s = Math.max(0, Math.round(sec));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${String(m).padStart(2, "0")}:${String(r).padStart(2, "0")}`;
}

function beep() {
  try {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    const ctx = new Ctx();
    let t = ctx.currentTime;
    const freqs = [880, 1046.5, 880];
    for (let i = 0; i < 3; i++) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.value = freqs[i];
      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.exponentialRampToValueAtTime(0.8, t + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.22);
      osc.connect(gain).connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.24);
      t += 0.3;
    }
    setTimeout(() => ctx.close(), 1200);
  } catch (e) {}
}

function beepStart() {
  try {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    const ctx = new Ctx();
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.value = 660;
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(0.3, t + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.15);
    osc.connect(gain).connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.17);
    setTimeout(() => ctx.close(), 400);
  } catch (e) {}
}

export default function Timer() {
  const init = useRef(loadTimer()).current;
  const [durationSec, setDurationSec] = useState(init?.durationSec ?? 30 * 60);
  const [endAt, setEndAt] = useState(init?.endAt ?? null);
  const [pausedRemaining, setPausedRemaining] = useState(init?.pausedRemaining ?? null);
  const [running, setRunning] = useState(init?.running ?? false);
  const [finished, setFinished] = useState(false);
  const [open, setOpen] = useState(false);
  const [customMin, setCustomMin] = useState("5");
  const [, forceTick] = useState(0);
  const firedRef = useRef(false);
  const wakeLockRef = useRef(null);
  const alarmRef = useRef(null);

  function stopAlarm() {
    if (alarmRef.current) { clearInterval(alarmRef.current); alarmRef.current = null; }
  }

  useEffect(() => {
    try {
      localStorage.setItem(TIMER_KEY, JSON.stringify({ durationSec, endAt, pausedRemaining, running }));
    } catch (e) {}
  }, [durationSec, endAt, pausedRemaining, running]);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => forceTick((n) => n + 1), 250);
    return () => clearInterval(id);
  }, [running]);

  const remaining = running && endAt != null
    ? Math.max(0, Math.ceil((endAt - Date.now()) / 1000))
    : (pausedRemaining ?? durationSec);

  useEffect(() => {
    if (running && remaining <= 0 && !firedRef.current) {
      firedRef.current = true;
      setRunning(false);
      setEndAt(null);
      setPausedRemaining(0);
      setFinished(true);
      setOpen(true);
      beep();
      if (navigator.vibrate) navigator.vibrate([300, 100, 300, 100, 300]);
      stopAlarm();
      let repeats = 0;
      alarmRef.current = setInterval(() => {
        repeats++;
        beep();
        if (navigator.vibrate) navigator.vibrate([300, 100, 300]);
        if (repeats >= 10) stopAlarm();
      }, 2200);
    }
  }, [running, remaining]);

  useEffect(() => stopAlarm, []);

  async function acquireWakeLock() {
    try {
      if ("wakeLock" in navigator) wakeLockRef.current = await navigator.wakeLock.request("screen");
    } catch (e) {}
  }
  function releaseWakeLock() {
    try { wakeLockRef.current?.release(); } catch (e) {}
    wakeLockRef.current = null;
  }

  useEffect(() => {
    function onVis() {
      if (document.visibilityState === "visible" && running) acquireWakeLock();
    }
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, [running]);

  const start = (sec) => {
    stopAlarm();
    firedRef.current = false;
    setFinished(false);
    setDurationSec(sec);
    setEndAt(Date.now() + sec * 1000);
    setPausedRemaining(null);
    setRunning(true);
    acquireWakeLock();
    beepStart();
  };
  const pause = () => {
    setPausedRemaining(remaining);
    setEndAt(null);
    setRunning(false);
    releaseWakeLock();
  };
  const resume = () => {
    firedRef.current = false;
    setFinished(false);
    setEndAt(Date.now() + (pausedRemaining ?? durationSec) * 1000);
    setPausedRemaining(null);
    setRunning(true);
    acquireWakeLock();
  };
  const reset = () => {
    stopAlarm();
    firedRef.current = false;
    setRunning(false);
    setEndAt(null);
    setPausedRemaining(null);
    setFinished(false);
    releaseWakeLock();
  };

  const isActive = running || (pausedRemaining != null && pausedRemaining > 0);

  const presetBtnStyle = { flex: "1 1 45%", background: "#2B3038", border: "none", borderRadius: 8, padding: "10px 6px", color: "#EDEAE3", fontSize: 12.5, cursor: "pointer" };

  return (
    <>
      <button onClick={() => setOpen(true)}
        style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, background: isActive ? withAlpha(COLORS.brass, 0.14) : "#1D2025", border: `1.5px solid ${isActive ? COLORS.brass : "#2B3038"}`, color: isActive ? COLORS.brass : "#EDEAE3", borderRadius: 10, padding: "14px 0", fontWeight: 700, fontSize: 16, cursor: "pointer" }}>
        <span style={{ fontSize: 19 }}>⏱</span> {isActive ? fmt(remaining) : "Stoper"}
      </button>

      {isActive && !open && (
        <div onClick={() => setOpen(true)}
          style={{ position: "fixed", bottom: "calc(74px + env(safe-area-inset-bottom, 0px))", left: "50%", transform: "translateX(-50%)", zIndex: 40, background: "#1D2025", border: `1px solid ${COLORS.brass}`, borderRadius: 999, padding: "10px 20px", display: "flex", alignItems: "center", gap: 8, cursor: "pointer", boxShadow: "0 4px 16px rgba(0,0,0,0.4)" }}>
          <span style={{ fontFamily: "Oswald, sans-serif", fontSize: 18, color: COLORS.brass }}>{fmt(remaining)}</span>
          {!running && <span style={{ fontSize: 11, color: "#8A8E96", textTransform: "uppercase" }}>pauza</span>}
        </div>
      )}

      {open && (
        <div onClick={() => setOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "flex-end", justifyContent: "center", zIndex: 50 }}>
          <div onClick={(e) => e.stopPropagation()} style={{ background: "#1D2025", border: "1px solid #2B3038", borderRadius: "16px 16px 0 0", padding: 20, width: "100%", maxWidth: 480 }}>
            <h3 style={{ fontFamily: "Oswald, sans-serif", textTransform: "uppercase", fontSize: 16, margin: "0 0 14px" }}>Stoper</h3>

            <div style={{ textAlign: "center", fontFamily: "Oswald, sans-serif", fontSize: 52, letterSpacing: 1, color: finished ? "#B3502E" : COLORS.brass, margin: "8px 0" }}>
              {fmt(remaining)}
            </div>
            {finished && <div style={{ textAlign: "center", color: "#B3502E", fontSize: 13, fontWeight: 600, marginBottom: 10 }}>Koniec!</div>}

            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 12 }}>
              {PRESETS.map((p) => (
                <button key={p.label} onClick={() => start(p.seconds)}
                  style={{ ...presetBtnStyle, ...(p.seconds === durationSec ? { background: withAlpha(COLORS.brass, 0.18), border: `1px solid ${COLORS.brass}`, color: COLORS.brass } : {}) }}>
                  {p.label}
                </button>
              ))}
            </div>
            <div style={{ fontSize: 11, color: "#8A8E96", marginTop: 6 }}>Podświetlona opcja to Twój ostatnio używany czas</div>

            <div style={{ display: "flex", gap: 6, marginTop: 10, alignItems: "center" }}>
              <input type="number" min="1" value={customMin} onChange={(e) => setCustomMin(e.target.value)}
                style={{ width: 60, background: "#2B3038", border: "none", borderRadius: 6, padding: "8px 8px", color: "#EDEAE3", fontSize: 13 }} />
              <span style={{ fontSize: 12, color: "#8A8E96" }}>min</span>
              <button onClick={() => start(Math.max(1, Number(customMin) || 1) * 60)}
                style={{ flex: 1, background: COLORS.brass, border: "none", borderRadius: 8, padding: "9px 0", color: "#1A1500", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>Start</button>
            </div>

            <div style={{ display: "flex", gap: 8, marginTop: 18 }}>
              {running ? (
                <button onClick={pause} style={{ flex: 1, padding: "12px 0", borderRadius: 10, border: "1px solid #2B3038", background: "none", color: "#9A9EA6", fontWeight: 600, fontSize: 13.5, cursor: "pointer" }}>Pauza</button>
              ) : isActive && !finished ? (
                <button onClick={resume} style={{ flex: 1, padding: "12px 0", borderRadius: 10, border: "none", background: "#5C8A5C", color: "#0F1A0F", fontWeight: 700, fontSize: 13.5, cursor: "pointer" }}>Wznów</button>
              ) : null}
              <button onClick={reset} style={{ flex: 1, padding: "12px 0", borderRadius: 10, border: "1px solid #2B3038", background: "none", color: "#9A9EA6", fontWeight: 600, fontSize: 13.5, cursor: "pointer" }}>Reset</button>
              <button onClick={() => { if (finished) stopAlarm(); setOpen(false); }} style={{ flex: 1, padding: "12px 0", borderRadius: 10, border: "none", background: COLORS.brass, color: "#1A1500", fontWeight: 700, fontSize: 13.5, cursor: "pointer" }}>Zamknij</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
