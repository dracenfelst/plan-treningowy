import React, { useState, useEffect } from "react";

export const COLORS = { chalk: "#EDEAE3", brass: "#C9A227", steel: "#2B3038" };

export const POSES = {
  push: {
    A: { head:{x:7,y:8}, shoulder:{x:7,y:11}, elbow:{x:7,y:16.5}, hand:{x:7,y:22}, hip:{x:17,y:12}, knee:{x:22,y:14}, foot:{x:27,y:22} },
    B: { head:{x:7,y:14}, shoulder:{x:7,y:17}, elbow:{x:3,y:19}, hand:{x:7,y:22}, hip:{x:17,y:15}, knee:{x:22,y:16}, foot:{x:27,y:22} },
  },
  pullup: {
    A: { head:{x:14,y:9}, shoulder:{x:14,y:11}, elbow:{x:14,y:7.5}, hand:{x:14,y:4}, hip:{x:14,y:15}, knee:{x:14,y:19}, foot:{x:14,y:23} },
    B: { head:{x:14,y:4.5}, shoulder:{x:14,y:7}, elbow:{x:9,y:6}, hand:{x:14,y:4}, hip:{x:14,y:11}, knee:{x:14,y:16}, foot:{x:14,y:21} },
  },
  row: {
    A: { head:{x:5,y:7.5}, shoulder:{x:6,y:10}, elbow:{x:7,y:15}, hand:{x:8,y:19}, hip:{x:14,y:14}, knee:{x:17,y:18}, foot:{x:19,y:22} },
    B: { head:{x:5,y:7.5}, shoulder:{x:6,y:10}, elbow:{x:3,y:11}, hand:{x:1,y:9}, hip:{x:14,y:14}, knee:{x:17,y:18}, foot:{x:19,y:22} },
  },
  squat: {
    A: { head:{x:14,y:4}, shoulder:{x:14,y:7}, elbow:{x:10,y:9}, hand:{x:8,y:11}, hip:{x:14,y:13}, knee:{x:14,y:18}, foot:{x:14,y:22} },
    B: { head:{x:14,y:10}, shoulder:{x:14,y:13}, elbow:{x:9,y:13}, hand:{x:6,y:13}, hip:{x:11,y:17}, knee:{x:18,y:17}, foot:{x:14,y:22} },
  },
  lunge: {
    A: { head:{x:10,y:4}, shoulder:{x:10,y:7}, elbow:{x:7,y:9}, hand:{x:6,y:12}, hip:{x:10,y:11}, knee:{x:13,y:16}, foot:{x:10,y:22} },
    B: { head:{x:10,y:8}, shoulder:{x:10,y:11}, elbow:{x:7,y:13}, hand:{x:6,y:16}, hip:{x:10,y:15}, knee:{x:13,y:17}, foot:{x:10,y:22} },
  },
  plank: {
    A: { head:{x:7,y:8}, shoulder:{x:7,y:10}, elbow:{x:7,y:13}, hand:{x:7,y:15}, hip:{x:15,y:11}, knee:{x:20,y:13}, foot:{x:25,y:15} },
    B: { head:{x:7,y:12}, shoulder:{x:7,y:14}, elbow:{x:7,y:17}, hand:{x:7,y:20}, hip:{x:15,y:14}, knee:{x:20,y:15.5}, foot:{x:25,y:17} },
  },
  hip: {
    A: { head:{x:4,y:16}, shoulder:{x:5,y:18}, elbow:{x:5,y:18}, hand:{x:5,y:18}, hip:{x:14,y:18}, knee:{x:19,y:15}, foot:{x:23,y:17} },
    B: { head:{x:4,y:16}, shoulder:{x:5,y:18}, elbow:{x:5,y:18}, hand:{x:5,y:18}, hip:{x:14,y:12}, knee:{x:19,y:14}, foot:{x:23,y:17} },
  },
  curl: {
    A: { head:{x:9,y:4}, shoulder:{x:9,y:7}, elbow:{x:9,y:12}, hand:{x:9,y:17}, hip:{x:9,y:13}, knee:{x:9,y:18}, foot:{x:9,y:22} },
    B: { head:{x:9,y:4}, shoulder:{x:9,y:7}, elbow:{x:9,y:12}, hand:{x:9,y:8}, hip:{x:9,y:13}, knee:{x:9,y:18}, foot:{x:9,y:22} },
  },
  hang: {
    A: { head:{x:14,y:7}, shoulder:{x:14,y:10}, elbow:{x:14,y:7}, hand:{x:14,y:4}, hip:{x:14,y:14}, knee:{x:14,y:19}, foot:{x:14,y:22} },
    B: { head:{x:14,y:9}, shoulder:{x:14,y:11.5}, elbow:{x:14,y:7.5}, hand:{x:14,y:4}, hip:{x:14,y:16}, knee:{x:14,y:20}, foot:{x:14,y:24} },
  },
  facepull: {
    A: { head:{x:14,y:4}, shoulder:{x:14,y:7}, elbow:{x:11,y:9}, hand:{x:8,y:10}, hip:{x:14,y:13}, knee:{x:14,y:18}, foot:{x:14,y:22} },
    B: { head:{x:14,y:4}, shoulder:{x:14,y:7}, elbow:{x:19,y:6}, hand:{x:22,y:5}, hip:{x:14,y:13}, knee:{x:14,y:18}, foot:{x:14,y:22} },
  },
  fly: {
    A: { head:{x:14,y:4}, shoulder:{x:14,y:7}, elbow:{x:8,y:8}, hand:{x:4,y:9}, hip:{x:14,y:13}, knee:{x:14,y:18}, foot:{x:14,y:22} },
    B: { head:{x:14,y:4}, shoulder:{x:14,y:7}, elbow:{x:12,y:9}, hand:{x:10,y:10}, hip:{x:14,y:13}, knee:{x:14,y:18}, foot:{x:14,y:22} },
  },
  raise: {
    A: { head:{x:14,y:4}, shoulder:{x:14,y:7}, elbow:{x:14,y:10}, hand:{x:14,y:13}, hip:{x:14,y:13}, knee:{x:14,y:18}, foot:{x:14,y:22} },
    B: { head:{x:14,y:4}, shoulder:{x:14,y:7}, elbow:{x:19,y:7}, hand:{x:23,y:7}, hip:{x:14,y:13}, knee:{x:14,y:18}, foot:{x:14,y:22} },
  },
  triceps: {
    A: { head:{x:14,y:5}, shoulder:{x:14,y:8}, elbow:{x:14,y:6}, hand:{x:11,y:8}, hip:{x:14,y:14}, knee:{x:14,y:19}, foot:{x:14,y:23} },
    B: { head:{x:14,y:5}, shoulder:{x:14,y:8}, elbow:{x:14,y:6}, hand:{x:14,y:2}, hip:{x:14,y:14}, knee:{x:14,y:19}, foot:{x:14,y:23} },
  },
  chestopen: {
    A: { head:{x:14,y:4}, shoulder:{x:14,y:7}, elbow:{x:19,y:7}, hand:{x:19,y:3}, hip:{x:14,y:13}, knee:{x:14,y:18}, foot:{x:14,y:22} },
    B: { head:{x:17,y:5}, shoulder:{x:17,y:8}, elbow:{x:19,y:7}, hand:{x:19,y:3}, hip:{x:15,y:13}, knee:{x:14,y:18}, foot:{x:14,y:22} },
  },
  thoracic: {
    A: { head:{x:5,y:9}, shoulder:{x:8,y:10}, elbow:{x:11,y:11}, hand:{x:14,y:12}, hip:{x:10,y:14}, knee:{x:13,y:17}, foot:{x:9,y:19} },
    B: { head:{x:5,y:9}, shoulder:{x:8,y:10}, elbow:{x:11,y:8}, hand:{x:16,y:5}, hip:{x:10,y:14}, knee:{x:13,y:17}, foot:{x:9,y:19} },
  },
  hipflex: {
    A: { head:{x:9,y:4}, shoulder:{x:9,y:7}, elbow:{x:10,y:9}, hand:{x:11,y:13}, hip:{x:9,y:12}, knee:{x:12,y:17}, foot:{x:9,y:21} },
    B: { head:{x:11,y:5}, shoulder:{x:11,y:8}, elbow:{x:10,y:9}, hand:{x:11,y:13}, hip:{x:12,y:13}, knee:{x:12,y:17}, foot:{x:9,y:21} },
  },
  hamstring: {
    A: { head:{x:9,y:4}, shoulder:{x:9,y:7}, elbow:{x:9,y:9}, hand:{x:9,y:11}, hip:{x:9,y:13}, knee:{x:9,y:18}, foot:{x:9,y:22} },
    B: { head:{x:9,y:17}, shoulder:{x:9,y:14}, elbow:{x:9,y:15}, hand:{x:9,y:20}, hip:{x:9,y:13}, knee:{x:9,y:18}, foot:{x:9,y:22} },
  },
  childpose: {
    A: { head:{x:20,y:10}, shoulder:{x:18,y:12}, elbow:{x:16,y:11}, hand:{x:14,y:10}, hip:{x:14,y:15}, knee:{x:10,y:17}, foot:{x:7,y:18} },
    B: { head:{x:6,y:17}, shoulder:{x:10,y:16}, elbow:{x:8,y:17}, hand:{x:4,y:18}, hip:{x:14,y:15}, knee:{x:10,y:17}, foot:{x:7,y:18} },
  },
  run: {
    A: { head:{x:15,y:5}, shoulder:{x:15,y:8}, elbow:{x:12,y:9}, hand:{x:10,y:7}, hip:{x:15,y:13}, knee:{x:19,y:15}, foot:{x:23,y:17} },
    B: { head:{x:15,y:5}, shoulder:{x:15,y:8}, elbow:{x:13,y:10}, hand:{x:11,y:12}, hip:{x:15,y:13}, knee:{x:11,y:15}, foot:{x:8,y:19} },
  },
};

const FLOOR_TYPES = new Set(["push","row","squat","lunge","plank","curl","facepull","fly","raise","triceps","chestopen","thoracic","hipflex","hamstring","childpose","run"]);
const BAR_TYPES = new Set(["pullup","hang"]);

function lerp(a, b, t) { return a + (b - a) * t; }
function easeInOut(t) { return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t; }
function interpolatePose(a, b, t) {
  const te = easeInOut(t);
  const out = {};
  for (const k in a) out[k] = { x: lerp(a[k].x, b[k].x, te), y: lerp(a[k].y, b[k].y, te) };
  return out;
}

function useSkeletonAnim(type) {
  const poses = POSES[type];
  const [pose, setPose] = useState(poses ? poses.A : null);
  useEffect(() => {
    if (!poses) return;
    let raf, cancelled = false, phase = "holdA", phaseStart = null, lastSet = 0;
    const HOLD = 550, MOVE = 700;
    function step(ts) {
      if (cancelled) return;
      if (phaseStart === null) phaseStart = ts;
      const elapsed = ts - phaseStart;
      if (ts - lastSet > 33) {
        lastSet = ts;
        if (phase === "holdA") setPose(poses.A);
        else if (phase === "holdB") setPose(poses.B);
        else if (phase === "toB") setPose(interpolatePose(poses.A, poses.B, Math.min(elapsed / MOVE, 1)));
        else if (phase === "toA") setPose(interpolatePose(poses.B, poses.A, Math.min(elapsed / MOVE, 1)));
      }
      const dur = phase === "holdA" || phase === "holdB" ? HOLD : MOVE;
      if (elapsed > dur) {
        phase = phase === "holdA" ? "toB" : phase === "toB" ? "holdB" : phase === "holdB" ? "toA" : "holdA";
        phaseStart = ts;
      }
      raf = requestAnimationFrame(step);
    }
    raf = requestAnimationFrame(step);
    return () => { cancelled = true; cancelAnimationFrame(raf); };
  }, [type]);
  return pose;
}

function Skeleton({ pose, color }) {
  if (!pose) return null;
  const { head, shoulder, elbow, hand, hip, knee, foot } = pose;
  const ln = { stroke: color, strokeWidth: 2, strokeLinecap: "round" };
  return (
    <>
      <line x1={shoulder.x} y1={shoulder.y} x2={hip.x} y2={hip.y} {...ln} />
      <line x1={shoulder.x} y1={shoulder.y} x2={elbow.x} y2={elbow.y} {...ln} />
      <line x1={elbow.x} y1={elbow.y} x2={hand.x} y2={hand.y} {...ln} />
      <line x1={hip.x} y1={hip.y} x2={knee.x} y2={knee.y} {...ln} />
      <line x1={knee.x} y1={knee.y} x2={foot.x} y2={foot.y} {...ln} />
      <circle cx={head.x} cy={head.y} r="2.3" fill="none" stroke={color} strokeWidth="2" />
    </>
  );
}

function BikeIcon({ color, size }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 26">
      <circle cx="6" cy="20" r="3.4" fill="none" stroke={color} strokeWidth="2" />
      <circle cx="22" cy="20" r="3.4" fill="none" stroke={color} strokeWidth="2" />
      <path d="M6 20l5-10h5l6 10M11 10h4M15 10l4 10" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <g style={{ transformOrigin: "14px 20px", animation: "spinCrank 1.1s linear infinite" }}>
        <line x1="14" y1="20" x2="17" y2="20" stroke={color} strokeWidth="2" strokeLinecap="round" />
        <circle cx="17" cy="20" r="1.2" fill={color} />
      </g>
    </svg>
  );
}

function BandIcon({ color, size }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 26">
      <g style={{ transformOrigin: "16px 13px", animation: "bandPulse 1.3s ease-in-out infinite" }}>
        <path d="M5 6c4 5 4 13 0 18M23 6c-4 5-4 13 0 18" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" />
        <line x1="5" y1="13" x2="23" y2="13" stroke={color} strokeWidth="2" strokeLinecap="round" strokeDasharray="1 3.2" />
      </g>
    </svg>
  );
}

function CatCowIcon({ color, size }) {
  const [t, setT] = useState(0);
  useEffect(() => {
    let raf, cancelled = false, phase = "holdCow", phaseStart = null, lastSet = 0;
    const HOLD = 600, MOVE = 750;
    function step(ts) {
      if (cancelled) return;
      if (phaseStart === null) phaseStart = ts;
      const elapsed = ts - phaseStart;
      if (ts - lastSet > 33) {
        lastSet = ts;
        if (phase === "holdCow") setT(0);
        else if (phase === "holdCat") setT(1);
        else if (phase === "toCat") setT(easeInOut(Math.min(elapsed / MOVE, 1)));
        else if (phase === "toCow") setT(1 - easeInOut(Math.min(elapsed / MOVE, 1)));
      }
      const dur = phase === "holdCow" || phase === "holdCat" ? HOLD : MOVE;
      if (elapsed > dur) {
        phase = phase === "holdCow" ? "toCat" : phase === "toCat" ? "holdCat" : phase === "holdCat" ? "toCow" : "holdCow";
        phaseStart = ts;
      }
      raf = requestAnimationFrame(step);
    }
    raf = requestAnimationFrame(step);
    return () => { cancelled = true; cancelAnimationFrame(raf); };
  }, []);
  const spineMidY = lerp(17, 9, t);
  const headX = lerp(5, 10, t);
  const headY = lerp(8, 15, t);
  const hipTiltY = lerp(13, 15.5, t);
  const shoulderTiltY = lerp(13, 15.5, t);
  const ln = { stroke: color, strokeWidth: 2, strokeLinecap: "round" };
  return (
    <svg width={size} height={size} viewBox="0 0 32 26" style={{ overflow: "visible" }}>
      <line x1="1" y1="22" x2="31" y2="22" stroke={COLORS.steel} strokeWidth="1.4" />
      <line x1="9" y1={shoulderTiltY} x2="9" y2="18" {...ln} />
      <line x1="9" y1="18" x2="9" y2="22" {...ln} />
      <line x1="23" y1={hipTiltY} x2="23" y2="18" {...ln} />
      <line x1="23" y1="18" x2="23" y2="22" {...ln} />
      <path d={`M9 ${shoulderTiltY} Q16 ${spineMidY} 23 ${hipTiltY}`} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <circle cx={headX} cy={headY} r="2.3" fill="none" stroke={color} strokeWidth="2" />
      <line x1={headX} y1={headY + 2.1} x2="9" y2={shoulderTiltY} stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

const FLOOR = FLOOR_TYPES, BAR = BAR_TYPES;

export function Icon({ type, size = 24, color = COLORS.chalk }) {
  const pose = useSkeletonAnim(POSES[type] ? type : null);
  if (type === "bike") return <BikeIcon color={color} size={size} />;
  if (type === "catcow") return <CatCowIcon color={color} size={size} />;
  if (!pose) return <BandIcon color={color} size={size} />;
  return (
    <svg width={size} height={size} viewBox="0 0 32 26" style={{ overflow: "visible" }}>
      {FLOOR.has(type) && <line x1="1" y1="22" x2="31" y2="22" stroke={COLORS.steel} strokeWidth="1.4" />}
      {BAR.has(type) && <line x1="6" y1="4" x2="22" y2="4" stroke={COLORS.steel} strokeWidth="2" strokeLinecap="round" />}
      <Skeleton pose={pose} color={color} />
    </svg>
  );
}

export function iconTypeFor(name) {
  const n = name.toLowerCase();
  if (/pompk/.test(n)) return "push";
  if (/podciąg/.test(n)) return "pullup";
  if (/wiosłow/.test(n)) return "row";
  if (/rower/.test(n)) return "bike";
  if (/biega/.test(n)) return "run";
  if (/przysiad/.test(n)) return "squat";
  if (/wykrok/.test(n)) return "lunge";
  if (/plank/.test(n)) return "plank";
  if (/hip thrust|biod/.test(n)) return "hip";
  if (/uginanie|curl|bicep|młotkow/.test(n)) return "curl";
  if (/zwis/.test(n)) return "hang";
  if (/face pull/.test(n)) return "facepull";
  if (/rozpięt/.test(n)) return "fly";
  if (/wznos/.test(n)) return "raise";
  if (/francusk|triceps/.test(n)) return "triceps";
  if (/wycisk/.test(n)) return "push";
  if (/kocia|krowa/.test(n)) return "catcow";
  if (/klatk.*prog|prog.*klatk/.test(n)) return "chestopen";
  if (/rotacj|piersiow.*odcin/.test(n)) return "thoracic";
  if (/zginacz.*biodra|klęk/.test(n)) return "hipflex";
  if (/tył ud|skłon/.test(n)) return "hamstring";
  if (/dziecka/.test(n)) return "childpose";
  return "band";
}

export function dayIconType(title) {
  const t = title.toLowerCase();
  if (t.includes("push")) return "push";
  if (t.includes("pull")) return "pullup";
  if (t.includes("nogi")) return "squat";
  if (t.includes("rozciąg")) return "catcow";
  return "band";
}
