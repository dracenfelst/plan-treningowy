import React, { useState, useEffect } from "react";

export const COLORS = { chalk: "#EDEAE3", brass: "#C9A227", steel: "#2B3038" };

export const GROUP_COLORS = {
  push: "#D68A54",
  pull: "#5FA0C9",
  legs: "#4FAE9E",
  cardio: "#C9A227",
  mobility: "#9B84C9",
  other: "#C9A227",
};

const GROUP_BY_TYPE = {
  push: "push", fly: "push", raise: "push", triceps: "push", chestopenfront: "push",
  diamondpush: "push", lateralraise: "push", frontraise: "push", chestfly: "push", pressoverhead: "push",
  pushelevated: "push", presschest: "push",
  pullupfront: "pull", row: "pull", curl: "pull", hang: "pull", facepull: "pull", thoracic: "pull",
  squat: "legs", lunge: "legs", hip: "legs", plank: "legs", hamstring: "legs", hipflex: "legs",
  bike: "cardio", run: "cardio",
  catcow: "mobility", childpose: "mobility",
};

export function muscleGroupFor(type) {
  return GROUP_BY_TYPE[type] || "other";
}

// Authored exercises (library/pools) carry an explicit iconType so growing the
// library never adds more risk to the name-sniffing regex chain below. Only
// free-typed, ad-hoc exercises (no iconType) fall back to iconTypeFor(name).
export function resolveIconType(ex) {
  return ex.iconType || iconTypeFor(ex.name);
}

export function groupColorFor(type) {
  return GROUP_COLORS[muscleGroupFor(type)];
}

export function withAlpha(hex, alpha) {
  const h = hex.replace("#", "");
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export const POSES = {
  push: {
    A: { head:{x:7,y:8}, shoulder:{x:7,y:11}, elbow:{x:7,y:16.5}, hand:{x:7,y:22}, hip:{x:17,y:12}, knee:{x:22,y:14}, foot:{x:27,y:22} },
    B: { head:{x:7,y:14}, shoulder:{x:7,y:17}, elbow:{x:3,y:19}, hand:{x:7,y:22}, hip:{x:17,y:15}, knee:{x:22,y:16}, foot:{x:27,y:22} },
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
    A: { head:{x:11,y:4}, shoulder:{x:11,y:7}, elbow:{x:8,y:9}, hand:{x:7,y:12}, hip:{x:11,y:11}, knee:{x:17,y:15}, foot:{x:20,y:22}, kneeBack:{x:6,y:16}, footBack:{x:3,y:22} },
    B: { head:{x:11,y:7}, shoulder:{x:11,y:10}, elbow:{x:8,y:12}, hand:{x:7,y:15}, hip:{x:11,y:14}, knee:{x:17,y:16}, foot:{x:20,y:22}, kneeBack:{x:6,y:19}, footBack:{x:3,y:22} },
  },
  plank: {
    A: { head:{x:7,y:8}, shoulder:{x:7,y:10}, elbow:{x:7,y:13}, hand:{x:7,y:15}, hip:{x:15,y:11}, knee:{x:20,y:13}, foot:{x:25,y:15} },
    B: { head:{x:7,y:9}, shoulder:{x:7,y:11}, elbow:{x:7,y:14}, hand:{x:7,y:16}, hip:{x:15,y:12}, knee:{x:20,y:13.5}, foot:{x:25,y:15.5} },
  },
  hip: {
    A: { head:{x:4,y:16}, shoulder:{x:5,y:18}, elbow:{x:4,y:19.5}, hand:{x:2,y:20}, hip:{x:14,y:18}, knee:{x:19,y:15}, foot:{x:23,y:17} },
    B: { head:{x:4,y:16}, shoulder:{x:5,y:18}, elbow:{x:4,y:19.5}, hand:{x:2,y:20}, hip:{x:14,y:12}, knee:{x:19,y:14}, foot:{x:23,y:17} },
  },
  curl: {
    A: { head:{x:14,y:4}, shoulder:{x:14,y:7}, elbow:{x:14,y:12}, hand:{x:12,y:17}, hip:{x:14,y:13}, knee:{x:14,y:18}, foot:{x:14,y:22} },
    B: { head:{x:14,y:4}, shoulder:{x:14,y:7}, elbow:{x:14,y:12}, hand:{x:10,y:8}, hip:{x:14,y:13}, knee:{x:14,y:18}, foot:{x:14,y:22} },
  },
  hang: {
    A: { head:{x:14,y:7}, shoulder:{x:14,y:10}, elbow:{x:14,y:7}, hand:{x:14,y:4}, hip:{x:14,y:14}, knee:{x:14,y:19}, foot:{x:14,y:22} },
    B: { head:{x:14,y:9}, shoulder:{x:14,y:11.5}, elbow:{x:14,y:7.5}, hand:{x:14,y:4}, hip:{x:14,y:16}, knee:{x:14,y:20}, foot:{x:14,y:24} },
  },
  facepull: {
    A: { head:{x:14,y:4}, shoulder:{x:14,y:7}, elbow:{x:19,y:9}, hand:{x:23,y:9}, hip:{x:14,y:13}, knee:{x:14,y:18}, foot:{x:14,y:22} },
    B: { head:{x:14,y:4}, shoulder:{x:14,y:7}, elbow:{x:10,y:6}, hand:{x:7,y:5}, hip:{x:14,y:13}, knee:{x:14,y:18}, foot:{x:14,y:22} },
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
    A: { head:{x:14,y:5}, shoulder:{x:14,y:8}, elbow:{x:14,y:5}, hand:{x:11,y:7}, hip:{x:14,y:14}, knee:{x:14,y:19}, foot:{x:14,y:23} },
    B: { head:{x:14,y:5}, shoulder:{x:14,y:8}, elbow:{x:14,y:5}, hand:{x:14,y:1}, hip:{x:14,y:14}, knee:{x:14,y:19}, foot:{x:14,y:23} },
  },
  presschest: {
    A: { head:{x:14,y:5}, shoulder:{x:14,y:8}, elbow:{x:11,y:9}, hand:{x:9,y:9}, hip:{x:14,y:14}, knee:{x:14,y:19}, foot:{x:14,y:23} },
    B: { head:{x:14,y:5}, shoulder:{x:14,y:8}, elbow:{x:18,y:8}, hand:{x:22,y:8}, hip:{x:14,y:14}, knee:{x:14,y:19}, foot:{x:14,y:23} },
  },
  thoracic: {
    A: { head:{x:5,y:9}, shoulder:{x:8,y:10}, elbow:{x:11,y:11}, hand:{x:14,y:12}, hip:{x:10,y:14}, knee:{x:13,y:17}, foot:{x:9,y:19} },
    B: { head:{x:5,y:9}, shoulder:{x:8,y:10}, elbow:{x:11,y:8}, hand:{x:16,y:5}, hip:{x:10,y:14}, knee:{x:13,y:17}, foot:{x:9,y:19} },
  },
  hipflex: {
    A: { head:{x:9,y:4}, shoulder:{x:9,y:7}, elbow:{x:10,y:9}, hand:{x:11,y:13}, hip:{x:9,y:12}, knee:{x:12,y:17}, foot:{x:9,y:21}, kneeBack:{x:5,y:18}, footBack:{x:4,y:22} },
    B: { head:{x:11,y:5}, shoulder:{x:11,y:8}, elbow:{x:10,y:9}, hand:{x:11,y:13}, hip:{x:12,y:13}, knee:{x:12,y:17}, foot:{x:9,y:21}, kneeBack:{x:5,y:19}, footBack:{x:4,y:22} },
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

POSES.diamondpush = POSES.push;
POSES.pushelevated = POSES.push;

export const FRONT_POSES = {
  lateralraise: {
    A: { elbowL:{x:13,y:11}, handL:{x:12,y:15}, elbowR:{x:19,y:11}, handR:{x:20,y:15} },
    B: { elbowL:{x:8,y:8}, handL:{x:3,y:8}, elbowR:{x:24,y:8}, handR:{x:29,y:8} },
  },
  frontraise: {
    A: { elbowL:{x:13,y:11}, handL:{x:12,y:15}, elbowR:{x:19,y:11}, handR:{x:20,y:15} },
    B: { elbowL:{x:14,y:6}, handL:{x:14,y:2}, elbowR:{x:18,y:6}, handR:{x:18,y:2} },
  },
  chestfly: {
    A: { elbowL:{x:8,y:8}, handL:{x:3,y:8}, elbowR:{x:24,y:8}, handR:{x:29,y:8} },
    B: { elbowL:{x:13,y:9}, handL:{x:16,y:10}, elbowR:{x:19,y:9}, handR:{x:16,y:10} },
  },
  pressoverhead: {
    A: { elbowL:{x:11,y:9}, handL:{x:13,y:8}, elbowR:{x:21,y:9}, handR:{x:19,y:8} },
    B: { elbowL:{x:14,y:4}, handL:{x:14,y:1}, elbowR:{x:18,y:4}, handR:{x:18,y:1} },
  },
  chestopenfront: {
    A: { elbowL:{x:11,y:8}, handL:{x:9,y:11}, elbowR:{x:21,y:8}, handR:{x:23,y:11} },
    B: { elbowL:{x:9,y:7}, handL:{x:6,y:8}, elbowR:{x:23,y:7}, handR:{x:26,y:8} },
  },
};

export const PULLUP_POSES = {
  pullupfront: {
    A: { head:{x:16,y:16}, shoulder:{x:16,y:18}, hip:{x:16,y:22}, elbowL:{x:13,y:10}, elbowR:{x:19,y:10} },
    B: { head:{x:16,y:6}, shoulder:{x:16,y:8}, hip:{x:16,y:13}, elbowL:{x:9,y:9}, elbowR:{x:23,y:9} },
  },
};

const FRONT_TYPES = new Set(["lateralraise", "frontraise", "chestfly", "pressoverhead", "chestopenfront"]);
const PULLUP_TYPES = new Set(["pullupfront"]);

const FLOOR_TYPES = new Set(["push","row","squat","lunge","plank","curl","facepull","fly","raise","triceps","thoracic","hipflex","hamstring","childpose","run","diamondpush","pushelevated","presschest","lateralraise","frontraise","chestfly","pressoverhead","chestopenfront"]);
const BAR_TYPES = new Set(["pullupfront","hang"]);
const BAR_COLOR = "#9AA0AA";
const SLOW_TYPES = new Set(["catcow","childpose","thoracic","hipflex","hamstring","chestopenfront","plank"]);
const BAND_COLOR = "#E8546E";
const BAND_TYPES = new Set(["curl","triceps","facepull","presschest","row","squat"]);
const BAND_FRONT_TYPES = new Set(["pressoverhead","chestfly","lateralraise","frontraise"]);

function lerp(a, b, t) { return a + (b - a) * t; }
function easeInOut(t) { return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t; }
function interpolatePose(a, b, t) {
  const te = easeInOut(t);
  const out = {};
  for (const k in a) out[k] = { x: lerp(a[k].x, b[k].x, te), y: lerp(a[k].y, b[k].y, te) };
  return out;
}

const POSES_ALL = { ...POSES, ...FRONT_POSES, ...PULLUP_POSES };

function useSkeletonAnim(type) {
  const poses = POSES_ALL[type];
  const [pose, setPose] = useState(poses ? poses.A : null);
  useEffect(() => {
    if (!poses) return;
    let raf, cancelled = false, phase = "holdA", phaseStart = null, lastSet = 0;
    const slow = SLOW_TYPES.has(type);
    const HOLD = slow ? 1300 : 550, MOVE = slow ? 1000 : 700;
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

const LIMB_WIDTH = 3.6;
const HEAD_R = 3;

function Skeleton({ pose, color }) {
  if (!pose) return null;
  const { head, shoulder, elbow, hand, hip, knee, foot, kneeBack, footBack } = pose;
  const ln = { stroke: color, strokeWidth: LIMB_WIDTH, strokeLinecap: "round" };
  return (
    <>
      <line x1={shoulder.x} y1={shoulder.y} x2={hip.x} y2={hip.y} {...ln} />
      <line x1={shoulder.x} y1={shoulder.y} x2={elbow.x} y2={elbow.y} {...ln} />
      <line x1={elbow.x} y1={elbow.y} x2={hand.x} y2={hand.y} {...ln} />
      <line x1={hip.x} y1={hip.y} x2={knee.x} y2={knee.y} {...ln} />
      <line x1={knee.x} y1={knee.y} x2={foot.x} y2={foot.y} {...ln} />
      {kneeBack && <line x1={hip.x} y1={hip.y} x2={kneeBack.x} y2={kneeBack.y} {...ln} />}
      {kneeBack && footBack && <line x1={kneeBack.x} y1={kneeBack.y} x2={footBack.x} y2={footBack.y} {...ln} />}
      <circle cx={head.x} cy={head.y} r={HEAD_R} fill={color} />
    </>
  );
}

function PullupFigure({ pose, color }) {
  if (!pose) return null;
  const { head, shoulder, hip, elbowL, elbowR } = pose;
  const handL = { x: 11, y: 3 }, handR = { x: 21, y: 3 };
  const ln = { stroke: color, strokeWidth: LIMB_WIDTH, strokeLinecap: "round" };
  return (
    <>
      <line x1={handL.x} y1={handL.y} x2={elbowL.x} y2={elbowL.y} {...ln} />
      <line x1={elbowL.x} y1={elbowL.y} x2={shoulder.x} y2={shoulder.y} {...ln} />
      <line x1={handR.x} y1={handR.y} x2={elbowR.x} y2={elbowR.y} {...ln} />
      <line x1={elbowR.x} y1={elbowR.y} x2={shoulder.x} y2={shoulder.y} {...ln} />
      <line x1={shoulder.x} y1={shoulder.y} x2={hip.x} y2={hip.y} {...ln} />
      <line x1={hip.x} y1={hip.y} x2={hip.x} y2="25" {...ln} />
      <circle cx={head.x} cy={head.y} r={HEAD_R} fill={color} />
    </>
  );
}

function FrontFigure({ pose, color }) {
  if (!pose) return null;
  const { elbowL, handL, elbowR, handR } = pose;
  const ln = { stroke: color, strokeWidth: LIMB_WIDTH, strokeLinecap: "round" };
  return (
    <>
      <line x1="16" y1="6.3" x2="16" y2="13" {...ln} />
      <line x1="12" y1="7" x2="20" y2="7" {...ln} />
      <line x1="14" y1="13" x2="12" y2="22" {...ln} />
      <line x1="18" y1="13" x2="20" y2="22" {...ln} />
      <line x1="12" y1="7" x2={elbowL.x} y2={elbowL.y} {...ln} />
      <line x1={elbowL.x} y1={elbowL.y} x2={handL.x} y2={handL.y} {...ln} />
      <line x1="20" y1="7" x2={elbowR.x} y2={elbowR.y} {...ln} />
      <line x1={elbowR.x} y1={elbowR.y} x2={handR.x} y2={handR.y} {...ln} />
      <circle cx="16" cy="4" r={HEAD_R} fill={color} />
    </>
  );
}

function BikeIcon({ color, size }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 26" style={{ overflow: "visible" }}>
      <circle cx="6" cy="20" r="3.4" fill="none" stroke={color} strokeWidth="2" />
      <circle cx="22" cy="20" r="3.4" fill="none" stroke={color} strokeWidth="2" />
      <path d="M6 20l5-10h5l6 10M11 10h4M15 10l4 10" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <g style={{ transformOrigin: "14px 20px", animation: "spinCrank 1.1s linear infinite" }}>
        <line x1="14" y1="20" x2="17" y2="20" stroke={color} strokeWidth="2" strokeLinecap="round" />
        <circle cx="17" cy="20" r="1.2" fill={color} />
      </g>
      <path d="M16 10l-3-5" fill="none" stroke={color} strokeWidth={LIMB_WIDTH} strokeLinecap="round" />
      <circle cx="12.3" cy="3.3" r={HEAD_R - 0.5} fill={color} />
      <path d="M13 5.5l3 5M16 10l4-1" fill="none" stroke={color} strokeWidth={LIMB_WIDTH} strokeLinecap="round" strokeLinejoin="round" />
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
  const ln = { stroke: color, strokeWidth: LIMB_WIDTH, strokeLinecap: "round" };
  return (
    <svg width={size} height={size} viewBox="0 0 32 26" style={{ overflow: "visible" }}>
      <line x1="1" y1="22" x2="31" y2="22" stroke={COLORS.steel} strokeWidth="1.4" />
      <line x1="9" y1={shoulderTiltY} x2="9" y2="18" {...ln} />
      <line x1="9" y1="18" x2="9" y2="22" {...ln} />
      <line x1="23" y1={hipTiltY} x2="23" y2="18" {...ln} />
      <line x1="23" y1="18" x2="23" y2="22" {...ln} />
      <path d={`M9 ${shoulderTiltY} Q16 ${spineMidY} 23 ${hipTiltY}`} fill="none" stroke={color} strokeWidth={LIMB_WIDTH} strokeLinecap="round" />
      <circle cx={headX} cy={headY} r={HEAD_R} fill={color} />
      <line x1={headX} y1={headY + 2.1} x2="9" y2={shoulderTiltY} stroke={color} strokeWidth={LIMB_WIDTH} strokeLinecap="round" />
    </svg>
  );
}

const FLOOR = FLOOR_TYPES, BAR = BAR_TYPES;

function hasBandLine(type, equipment) {
  return equipment ? equipment.includes("band") : BAND_TYPES.has(type);
}
function hasBandFrontLine(type, equipment) {
  return equipment ? equipment.includes("band") : BAND_FRONT_TYPES.has(type);
}

export function Icon({ type, size = 24, color = COLORS.chalk, equipment }) {
  const pose = useSkeletonAnim(POSES_ALL[type] ? type : null);
  if (type === "bike") return <BikeIcon color={color} size={size} />;
  if (type === "catcow") return <CatCowIcon color={color} size={size} />;
  if (!pose) return <BandIcon color={color} size={size} />;
  return (
    <svg width={size} height={size} viewBox="0 0 32 26" style={{ overflow: "visible" }}>
      {FLOOR.has(type) && <line x1="1" y1="22" x2="31" y2="22" stroke={COLORS.steel} strokeWidth="1.4" />}
      {BAR.has(type) && <line x1="8" y1="3" x2="24" y2="3" stroke={BAR_COLOR} strokeWidth="2.2" strokeLinecap="round" />}
      {hasBandLine(type, equipment) && pose.foot && (
        <line x1={pose.foot.x} y1="22" x2={pose.hand.x} y2={pose.hand.y} stroke={BAND_COLOR} strokeWidth="1.4" strokeDasharray="1 2.2" strokeLinecap="round" />
      )}
      {hasBandFrontLine(type, equipment) && pose.handL && (
        <>
          <line x1="14" y1="22" x2={pose.handL.x} y2={pose.handL.y} stroke={BAND_COLOR} strokeWidth="1.4" strokeDasharray="1 2.2" strokeLinecap="round" />
          <line x1="18" y1="22" x2={pose.handR.x} y2={pose.handR.y} stroke={BAND_COLOR} strokeWidth="1.4" strokeDasharray="1 2.2" strokeLinecap="round" />
        </>
      )}
      {PULLUP_TYPES.has(type) ? <PullupFigure pose={pose} color={color} /> : FRONT_TYPES.has(type) ? <FrontFigure pose={pose} color={color} /> : <Skeleton pose={pose} color={color} />}
      {type === "diamondpush" && (
        <rect x={pose.hand.x - 1.4} y={pose.hand.y - 1.4} width="2.8" height="2.8" fill="none" stroke={color} strokeWidth="1.2" transform={`rotate(45 ${pose.hand.x} ${pose.hand.y})`} />
      )}
      {type === "pushelevated" && (
        <rect x={pose.foot.x - 3} y="20.5" width="6" height="2.2" rx="0.6" fill="none" stroke={color} strokeWidth="1.3" />
      )}
    </svg>
  );
}

export function iconTypeFor(name) {
  const n = name.toLowerCase();
  if (/diament/.test(n)) return "diamondpush";
  if (/podwyższeni/.test(n)) return "pushelevated";
  if (/pompk/.test(n)) return "push";
  if (/zwis/.test(n)) return "hang";
  if (/podciąg/.test(n)) return "pullupfront";
  if (/wiosłow/.test(n)) return "row";
  if (/rower/.test(n)) return "bike";
  if (/biega/.test(n)) return "run";
  if (/zginacz.*biodra/.test(n)) return "hipflex";
  if (/przysiad/.test(n)) return "squat";
  if (/wykrok/.test(n)) return "lunge";
  if (/plank/.test(n)) return "plank";
  if (/hip thrust|unoszenie bioder/.test(n)) return "hip";
  if (/uginanie|curl|bicep|młotkow/.test(n)) return "curl";
  if (/face pull/.test(n)) return "facepull";
  if (/rozpięt/.test(n)) return "chestfly";
  if (/wznos.*bocz|bocz.*wznos/.test(n)) return "lateralraise";
  if (/wznos.*przod|przod.*wznos/.test(n)) return "frontraise";
  if (/wznos/.test(n)) return "frontraise";
  if (/francusk|triceps/.test(n)) return "triceps";
  if (/wycisk.*głow|głow.*wycisk/.test(n)) return "pressoverhead";
  if (/przed sobą/.test(n)) return "presschest";
  if (/wycisk/.test(n)) return "push";
  if (/kocia|krowa/.test(n)) return "catcow";
  if (/klatk.*prog|prog.*klatk/.test(n)) return "chestopenfront";
  if (/rotacj|piersiow.*odcin/.test(n)) return "thoracic";
  if (/tył.{0,2}ud|skłon/.test(n)) return "hamstring";
  if (/dziecka/.test(n)) return "childpose";
  return "band";
}

export function dayIconType(title) {
  const t = title.toLowerCase();
  if (t.includes("push")) return "push";
  if (t.includes("pull")) return "pullupfront";
  if (t.includes("nogi")) return "squat";
  if (t.includes("rozciąg")) return "catcow";
  return "band";
}
