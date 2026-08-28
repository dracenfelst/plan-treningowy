import { EXERCISE_LIBRARY } from "./exerciseLibrary.js";
import { uid } from "./defaultData.js";

// Two real weeks, 7 days each — a training split plus a mobility day and a rest
// day, so the 14 generated day-cards stay a recognizable week rather than a
// forced 7-hard-days-in-a-row grind. These become the user's real, permanent
// `days` (same shape/behavior as any hand-built day already in the app) — no
// calendar cursor, no locking; the user opens/edits/reorders them like today.
const WEEK_TEMPLATE = [
  { title: "Push A", tag: "SIŁA", group: "push", slots: 5 },
  { title: "Pull A", tag: "SIŁA", group: "pull", slots: 5 },
  { title: "Nogi / Core", tag: "NOGI", group: "legs", slots: 4, cardioSlot: true },
  { title: "Push B", tag: "WYGLĄD", group: "push", slots: 5 },
  { title: "Pull B", tag: "WYGLĄD", group: "pull", slots: 4, cardioSlot: true },
  { title: "Rozciąganie", tag: "MOBILNOŚĆ", group: "mobility", slots: 6 },
  { title: "Odpoczynek", tag: "REGENERACJA", group: null, slots: 0 },
];

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// A home user only sees exercises whose equipment overlaps what they picked
// (plus anything bodyweight-only). A gym user sees the entire library
// unfiltered — "if gym, don't restrict exercise choice", per spec.
function eligible(ex, profile) {
  if (profile.location === "gym") return true;
  return ex.equipment.some((e) => e === "bodyweight" || profile.equipment.includes(e));
}

// Picks `n` unique-by-name exercises from `pool`, preferring names not already
// used elsewhere in the plan so the two weeks actually feel different. Falls
// back to allowing repeats if the filtered pool is too small (e.g. a
// bodyweight-only user with few eligible exercises for some slot).
function sampleUnique(pool, n, usedNames) {
  const fresh = shuffle(pool.filter((ex) => !usedNames.has(ex.name)));
  const picked = fresh.slice(0, n);
  if (picked.length < n) {
    const fillers = shuffle(pool.filter((ex) => !picked.includes(ex))).slice(0, n - picked.length);
    picked.push(...fillers);
  }
  picked.forEach((ex) => usedNames.add(ex.name));
  return picked;
}

function pickCardioExercise(cardioPrefs, usedNames) {
  if (!cardioPrefs || cardioPrefs.length === 0) return null;
  const pool = EXERCISE_LIBRARY.cardio.filter((ex) => ex.equipment.some((e) => cardioPrefs.includes(e)));
  if (pool.length === 0) return null;
  const fresh = pool.filter((ex) => !usedNames.has(ex.name));
  const ex = (fresh.length ? fresh : pool)[Math.floor(Math.random() * (fresh.length ? fresh.length : pool.length))];
  usedNames.add(ex.name);
  return { id: uid(), ...ex };
}

export function generatePlan(profile) {
  const usedNames = new Set();
  const days = [];
  for (let week = 1; week <= 2; week++) {
    for (const tmpl of WEEK_TEMPLATE) {
      const pool = tmpl.group ? EXERCISE_LIBRARY[tmpl.group].filter((ex) => eligible(ex, profile)) : [];
      const picked = sampleUnique(pool, tmpl.slots, usedNames);
      const exercises = picked.map((ex) => ({ id: uid(), ...ex }));
      if (tmpl.cardioSlot) {
        const cardio = pickCardioExercise(profile.cardio, usedNames);
        if (cardio) exercises.push(cardio);
      }
      days.push({
        id: uid(),
        title: `Dzień ${days.length + 1} — ${tmpl.title} (tydz. ${week})`,
        tag: tmpl.tag,
        exercises,
      });
    }
  }
  return days;
}

// Cheap "you could swap this" suggestions for the onboarding review screen —
// reuses whatever other library entries exist in the same movement group and
// are eligible for this profile, no separate suggestion engine needed.
export function suggestSwaps(days, profile, count = 3) {
  const suggestions = [];
  for (const day of days) {
    const group = Object.keys(EXERCISE_LIBRARY).find((g) =>
      EXERCISE_LIBRARY[g].some((ex) => day.exercises.some((d) => d.name === ex.name))
    );
    if (!group) continue;
    for (const ex of day.exercises) {
      const alt = EXERCISE_LIBRARY[group].find((cand) => cand.name !== ex.name && eligible(cand, profile) && !day.exercises.some((d) => d.name === cand.name));
      if (alt) {
        suggestions.push({ from: ex.name, to: alt.name });
        if (suggestions.length >= count) return suggestions;
      }
    }
  }
  return suggestions;
}
