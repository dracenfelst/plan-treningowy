import { EXERCISE_POOLS } from "./exercisePools.js";

const ROTATION_KEY = "plan-treningowy-rotation-v1";

function isoWeekKey(date) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = (d.getUTCDay() + 6) % 7;
  d.setUTCDate(d.getUTCDate() - dayNum + 3);
  const firstThursday = new Date(Date.UTC(d.getUTCFullYear(), 0, 4));
  const week = 1 + Math.round(((d - firstThursday) / 86400000 - 3 + ((firstThursday.getUTCDay() + 6) % 7)) / 7);
  return `${d.getUTCFullYear()}-W${String(week).padStart(2, "0")}`;
}

function loadRotationState() {
  try {
    const raw = localStorage.getItem(ROTATION_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return {};
}

function saveRotationState(state) {
  try { localStorage.setItem(ROTATION_KEY, JSON.stringify(state)); } catch (e) {}
}

// Resolves any exercise tagged with a poolId to this week's pick from its
// pool. Stable within an ISO week, re-rolled (excluding immediate repeat)
// once a new week starts. Exercises without a poolId pass through untouched.
export function applyRotation(days) {
  const weekKey = isoWeekKey(new Date());
  const state = loadRotationState();
  let changed = false;
  const nextDays = days.map((day) => ({
    ...day,
    exercises: day.exercises.map((ex) => {
      if (!ex.poolId || !EXERCISE_POOLS[ex.poolId]) return ex;
      const pool = EXERCISE_POOLS[ex.poolId];
      let entry = state[ex.id];
      if (!entry || entry.weekKey !== weekKey) {
        const prevIndex = entry ? entry.index : -1;
        let index = Math.floor(Math.random() * pool.length);
        if (pool.length > 1 && index === prevIndex) index = (index + 1) % pool.length;
        entry = { weekKey, index };
        state[ex.id] = entry;
        changed = true;
      }
      const variant = pool[entry.index];
      const next = { ...ex, name: variant.name, sets: variant.sets, reps: variant.reps, note: variant.note };
      if (variant.iconType) next.iconType = variant.iconType; else delete next.iconType;
      if (variant.equipment) next.equipment = variant.equipment; else delete next.equipment;
      return next;
    }),
  }));
  if (changed) saveRotationState(state);
  return nextDays;
}

// Called when the user manually edits a pooled exercise — from then on it's
// a normal fixed exercise and rotation stops touching it.
export function detachFromPool(ex) {
  if (!ex.poolId) return ex;
  const { poolId, ...rest } = ex;
  return rest;
}
