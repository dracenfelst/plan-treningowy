import React, { useState, useMemo } from "react";
import { resolveIconType, groupColorFor, withAlpha, COLORS } from "./icons.jsx";
import { generatePlan, suggestSwaps } from "./planGenerator.js";

const EQUIPMENT_OPTIONS = [
  { value: "pullup_bar", label: "Drążek do podciągania" },
  { value: "band", label: "Gumy oporowe" },
  { value: "dumbbell", label: "Hantle" },
  { value: "gym", label: "Siłownia ze sprzętem" },
];

const CARDIO_OPTIONS = [
  { value: "jump_rope", label: "Skakanka" },
  { value: "running", label: "Bieganie" },
  { value: "bike", label: "Rower" },
];

const card = { background: "#1D2025", border: "1px solid #2B3038", borderRadius: 12, padding: 20 };
const optionBtn = (active) => ({
  width: "100%", textAlign: "left", display: "flex", alignItems: "center", gap: 10,
  background: active ? withAlpha(COLORS.brass, 0.16) : "#2B3038",
  border: `1px solid ${active ? COLORS.brass : "transparent"}`,
  borderRadius: 10, padding: "12px 14px", color: active ? COLORS.brass : "#EDEAE3",
  fontSize: 14, fontWeight: 600, cursor: "pointer", marginBottom: 8,
});
const primaryBtn = { width: "100%", background: COLORS.brass, color: "#1A1500", border: "none", borderRadius: 10, padding: "13px 0", fontWeight: 700, fontSize: 14, textTransform: "uppercase", letterSpacing: 0.5, cursor: "pointer" };
const secondaryBtn = { width: "100%", background: "none", border: "1px solid #2B3038", color: "#9A9EA6", borderRadius: 10, padding: "12px 0", fontWeight: 600, fontSize: 13, cursor: "pointer", marginTop: 10 };

function Checkbox({ label, checked, onToggle }) {
  return (
    <button type="button" onClick={onToggle} style={optionBtn(checked)}>
      <span style={{ width: 18, height: 18, borderRadius: 5, flexShrink: 0, border: `1.5px solid ${checked ? COLORS.brass : "#8A8E96"}`, background: checked ? COLORS.brass : "transparent", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: "#1A1500" }}>
        {checked ? "✓" : ""}
      </span>
      {label}
    </button>
  );
}

export default function Onboarding({ onComplete }) {
  const [step, setStep] = useState("welcome");
  const [equipment, setEquipment] = useState([]);
  const [location, setLocation] = useState(null);
  const [cardio, setCardio] = useState([]);
  const [seed, setSeed] = useState(0);

  const profile = useMemo(() => ({
    equipment: equipment.filter((e) => e !== "gym"),
    location: location === "gym" || equipment.includes("gym") ? "gym" : "home",
    cardio,
  }), [equipment, location, cardio]);

  // eslint-disable-next-line react-hooks/exhaustive-deps -- `seed` is a deliberate cache-buster for "Wygeneruj ponownie"; profile is stable by the time step === "review" since equipment/location/cardio can't change once here.
  const plan = useMemo(() => (step === "review" ? generatePlan(profile) : null), [step, seed, profile]);
  const suggestions = useMemo(() => (plan ? suggestSwaps(plan, profile) : []), [plan, profile]);

  const toggle = (list, setList, value) => {
    setList(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#14161A", color: "#EDEAE3", fontFamily: "Inter, sans-serif", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ maxWidth: 420, width: "100%" }}>
        <div style={{ fontFamily: "Oswald, sans-serif", fontWeight: 700, fontSize: 22, letterSpacing: 1, textTransform: "uppercase", marginBottom: 16, textAlign: "center" }}>
          Przypakowany <span style={{ color: COLORS.brass }}>Tata</span>
        </div>

        {step === "welcome" && (
          <div style={card}>
            <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 8 }}>Zbudujmy Twój plan</div>
            <div style={{ fontSize: 13.5, color: "#8A8E96", lineHeight: 1.6, marginBottom: 16 }}>
              Kilka szybkich pytań o sprzęt i preferencje, a appka ułoży Ci od razu gotowy,
              14-dniowy plan treningowy. Wszystko będziesz mógł potem dowolnie zmienić.
            </div>
            <button style={primaryBtn} onClick={() => setStep("equipment")}>Zacznijmy</button>
          </div>
        )}

        {step === "equipment" && (
          <div style={card}>
            <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>Jaki masz sprzęt?</div>
            <div style={{ fontSize: 12.5, color: "#8A8E96", marginBottom: 14 }}>Zaznacz wszystko, co masz dostępne.</div>
            {EQUIPMENT_OPTIONS.map((opt) => (
              <Checkbox key={opt.value} label={opt.label} checked={equipment.includes(opt.value)} onToggle={() => toggle(equipment, setEquipment, opt.value)} />
            ))}
            <button style={primaryBtn} onClick={() => setStep("location")}>Dalej</button>
          </div>
        )}

        {step === "location" && (
          <div style={card}>
            <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>Gdzie będziesz trenować?</div>
            <div style={{ fontSize: 12.5, color: "#8A8E96", marginBottom: 14 }}>To decyduje, jak dobieramy ćwiczenia.</div>
            <Checkbox label="Trenuję w domu" checked={location === "home"} onToggle={() => setLocation("home")} />
            <Checkbox label="Trenuję na siłowni" checked={location === "gym"} onToggle={() => setLocation("gym")} />
            {(location === "gym" || equipment.includes("gym")) && (
              <div style={{ fontSize: 12, color: COLORS.brass, background: withAlpha(COLORS.brass, 0.1), border: `1px solid ${withAlpha(COLORS.brass, 0.3)}`, borderRadius: 8, padding: "10px 12px", marginTop: 4, marginBottom: 8 }}>
                Świetnie — pokażemy Ci pełną bibliotekę ćwiczeń, niezależnie od zaznaczonego sprzętu.
              </div>
            )}
            <button style={primaryBtn} disabled={!location} onClick={() => setStep("cardio")}>Dalej</button>
          </div>
        )}

        {step === "cardio" && (
          <div style={card}>
            <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>Jakie cardio lubisz?</div>
            <div style={{ fontSize: 12.5, color: "#8A8E96", marginBottom: 14 }}>Możesz zaznaczyć kilka albo żadne.</div>
            {CARDIO_OPTIONS.map((opt) => (
              <Checkbox key={opt.value} label={opt.label} checked={cardio.includes(opt.value)} onToggle={() => toggle(cardio, setCardio, opt.value)} />
            ))}
            <button style={primaryBtn} onClick={() => setStep("review")}>Wygeneruj plan</button>
          </div>
        )}

        {step === "review" && plan && (
          <div style={card}>
            <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>Twój plan na 2 tygodnie</div>
            <div style={{ fontSize: 12.5, color: "#8A8E96", marginBottom: 14 }}>14 dni, w pełni edytowalne — możesz je zmieniać w każdej chwili.</div>

            <div style={{ maxHeight: 320, overflowY: "auto", marginBottom: 14, display: "flex", flexDirection: "column", gap: 8 }}>
              {plan.map((day) => {
                const groupColor = groupColorFor(day.exercises[0] ? resolveIconType(day.exercises[0]) : "band");
                return (
                  <div key={day.id} style={{ background: "#14161A", border: "1px solid #2B3038", borderLeft: `3px solid ${groupColor}`, borderRadius: 8, padding: "10px 12px" }}>
                    <div style={{ fontSize: 12.5, fontWeight: 600 }}>{day.title}</div>
                    <div style={{ fontSize: 11, color: "#8A8E96", marginTop: 2 }}>
                      {day.exercises.length === 0 ? "Dzień wolny" : day.exercises.map((e) => e.name).join(" · ")}
                    </div>
                  </div>
                );
              })}
            </div>

            {suggestions.length > 0 && (
              <div style={{ fontSize: 12, color: "#8A8E96", marginBottom: 14 }}>
                <div style={{ textTransform: "uppercase", letterSpacing: 0.5, fontSize: 10.5, marginBottom: 6, color: COLORS.brass }}>Możesz też zamienić</div>
                {suggestions.map((s, i) => (
                  <div key={i} style={{ marginBottom: 3 }}>{s.from} <span style={{ color: COLORS.brass }}>→</span> {s.to}</div>
                ))}
              </div>
            )}

            <button style={primaryBtn} onClick={() => onComplete(profile, plan)}>Zatwierdź plan</button>
            <button style={secondaryBtn} onClick={() => setSeed((s) => s + 1)}>Wygeneruj ponownie</button>
          </div>
        )}
      </div>
    </div>
  );
}
