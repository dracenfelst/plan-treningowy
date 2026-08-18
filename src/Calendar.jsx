import React from "react";
import { COLORS } from "./icons.jsx";

const MONTHS_PL = ["Styczeń","Luty","Marzec","Kwiecień","Maj","Czerwiec","Lipiec","Sierpień","Wrzesień","Październik","Listopad","Grudzień"];
const DOW_PL = ["Pn","Wt","Śr","Cz","Pt","So","Nd"];

export function groupHistoryByDate(history) {
  const map = {};
  for (const h of history) {
    const key = h.date.slice(0, 10);
    if (!map[key]) map[key] = [];
    map[key].push(h);
  }
  return map;
}

export default function Calendar({ month, onMonthChange, history, selectedDate, onSelectDate }) {
  const byDate = groupHistoryByDate(history);
  const year = month.getFullYear();
  const mon = month.getMonth();
  const firstOfMonth = new Date(year, mon, 1);
  const startOffset = (firstOfMonth.getDay() + 6) % 7; // Monday = 0
  const daysInMonth = new Date(year, mon + 1, 0).getDate();
  const todayStr = new Date().toISOString().slice(0, 10);

  const cells = [];
  for (let i = 0; i < startOffset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const dateStrFor = (d) => `${year}-${String(mon + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

  return (
    <div style={{ background: "#1D2025", border: "1px solid #2B3038", borderRadius: 12, padding: 14 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
        <button onClick={() => onMonthChange(new Date(year, mon - 1, 1))} style={{ background: "none", border: "none", color: "#8A8E96", fontSize: 16, cursor: "pointer", padding: "4px 8px" }}>‹</button>
        <div style={{ fontFamily: "Oswald, sans-serif", fontSize: 14, letterSpacing: 0.5, textTransform: "uppercase" }}>{MONTHS_PL[mon]} {year}</div>
        <button onClick={() => onMonthChange(new Date(year, mon + 1, 1))} style={{ background: "none", border: "none", color: "#8A8E96", fontSize: 16, cursor: "pointer", padding: "4px 8px" }}>›</button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 4, marginBottom: 4 }}>
        {DOW_PL.map((d) => <div key={d} style={{ textAlign: "center", fontSize: 10, color: "#8A8E96", textTransform: "uppercase" }}>{d}</div>)}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 4 }}>
        {cells.map((d, i) => {
          if (d === null) return <div key={"e" + i} />;
          const dateStr = dateStrFor(d);
          const entries = byDate[dateStr] || [];
          const hasPlan = entries.some((e) => e.type === "plan");
          const hasActivity = entries.some((e) => e.type === "activity");
          const isToday = dateStr === todayStr;
          const isSelected = dateStr === selectedDate;
          return (
            <button key={dateStr} onClick={() => onSelectDate(dateStr)}
              style={{
                aspectRatio: "1", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                background: isSelected ? "#2B3038" : "transparent",
                border: isToday ? `1px solid ${COLORS.brass}` : "1px solid transparent",
                borderRadius: 8, cursor: "pointer", padding: 2, gap: 2,
              }}>
              <span style={{ fontSize: 12, color: isToday ? COLORS.brass : "#EDEAE3" }}>{d}</span>
              <span style={{ display: "flex", gap: 2, height: 5 }}>
                {hasPlan && <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#5C8A5C", display: "inline-block" }} />}
                {hasActivity && <span style={{ width: 5, height: 5, borderRadius: "50%", background: COLORS.brass, display: "inline-block" }} />}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
