import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ─── SVG ICONS ────────────────────────────────────────────────────────────────
const Icon = ({ name, size = 18, color = "currentColor", strokeWidth = 1.6 }) => {
  const s = { width: size, height: size, display: "block", flexShrink: 0 };
  const props = { fill: "none", stroke: color, strokeWidth, strokeLinecap: "round", strokeLinejoin: "round", viewBox: "0 0 24 24", style: s };
  switch (name) {
    case "zap":        return <svg {...props}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>;
    case "grid":       return <svg {...props}><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>;
    case "check-sq":   return <svg {...props}><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>;
    case "bar-chart":  return <svg {...props}><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>;
    case "settings":   return <svg {...props}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>;
    case "logout":     return <svg {...props}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>;
    case "plus":       return <svg {...props}><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>;
    case "edit":       return <svg {...props}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>;
    case "trash":      return <svg {...props}><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>;
    case "chevron-up": return <svg {...props}><polyline points="18 15 12 9 6 15"/></svg>;
    case "chevron-dn": return <svg {...props}><polyline points="6 9 12 15 18 9"/></svg>;
    case "chevron-l":  return <svg {...props}><polyline points="15 18 9 12 15 6"/></svg>;
    case "chevron-r":  return <svg {...props}><polyline points="9 18 15 12 9 6"/></svg>;
    case "flame":      return <svg {...props}><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 3z"/></svg>;
    case "calendar":   return <svg {...props}><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>;
    case "star":       return <svg {...props}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>;
    case "trophy":     return <svg {...props}><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2z"/></svg>;
    case "activity":   return <svg {...props}><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>;
    case "sun":        return <svg {...props}><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>;
    case "moon":       return <svg {...props}><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>;
    case "user":       return <svg {...props}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
    case "quote":      return <svg {...props}><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"/><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"/></svg>;
    case "seedling":   return <svg {...props}><path d="M12 22V12"/><path d="M12 12C12 7 8 4 3 3c0 5 3 9 9 9z"/><path d="M12 12c0-5 4-8 9-9 0 5-3 9-9 9z"/></svg>;
    case "layers":     return <svg {...props}><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>;
    case "target":     return <svg {...props}><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>;
    case "refresh":    return <svg {...props}><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-.68-8.24L23 10"/></svg>;
    case "check":      return <svg {...props}><polyline points="20 6 9 17 4 12"/></svg>;
    case "palette":    return <svg {...props}><circle cx="13.5" cy="6.5" r=".5" fill={color}/><circle cx="17.5" cy="10.5" r=".5" fill={color}/><circle cx="8.5" cy="7.5" r=".5" fill={color}/><circle cx="6.5" cy="12.5" r=".5" fill={color}/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></svg>;
    default:           return <svg {...props}><circle cx="12" cy="12" r="10"/></svg>;
  }
};

// ─── UTILS ────────────────────────────────────────────────────────────────────
const hashPassword = (pw) => btoa(encodeURIComponent(pw + "salt_habitflow_2025"));
const generateId = () => Math.random().toString(36).slice(2) + Date.now().toString(36);
const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();
const today = () => { const d = new Date(); return { y: d.getFullYear(), m: d.getMonth(), d: d.getDate() }; };
const dateKey = (y, m, d) => `${y}-${String(m+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
const monthNames = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
const dayNames = ["Dom","Lun","Mar","Mié","Jue","Vie","Sáb"];

const MOTIVATIONAL_QUOTES = [
  "La disciplina es elegir entre lo que quieres ahora y lo que más quieres.",
  "Un hábito no se rompe de golpe, se reemplaza poco a poco.",
  "El éxito es la suma de pequeños esfuerzos repetidos día tras día.",
  "No cuentes los días, haz que los días cuenten.",
  "Cada día es una nueva oportunidad de cambiar tu vida.",
  "La constancia convierte lo ordinario en extraordinario.",
  "Los grandes logros nacen de pequeños hábitos consistentes.",
  "Tu futuro es creado por lo que haces hoy, no mañana.",
  "La motivación te pone en marcha. El hábito te mantiene avanzando.",
  "Sé el arquitecto de tus propios hábitos y construirás tu destino.",
];

const NEON_COLORS = [
  { name: "Cian", value: "#00f5ff" },
  { name: "Verde", value: "#39ff14" },
  { name: "Rosa", value: "#ff2d78" },
  { name: "Naranja", value: "#ff6b00" },
  { name: "Violeta", value: "#bf5fff" },
  { name: "Amarillo", value: "#ffe600" },
  { name: "Azul", value: "#0070ff" },
  { name: "Coral", value: "#ff4d4d" },
];

// ─── DB (localStorage abstraction) ───────────────────────────────────────────
const DB = {
  getUsers: () => JSON.parse(localStorage.getItem("hf_users") || "{}"),
  saveUsers: (u) => localStorage.setItem("hf_users", JSON.stringify(u)),
  getSession: () => localStorage.getItem("hf_session"),
  setSession: (id) => localStorage.setItem("hf_session", id),
  clearSession: () => localStorage.removeItem("hf_session"),
  getUserData: (uid) => JSON.parse(localStorage.getItem(`hf_data_${uid}`) || "null"),
  saveUserData: (uid, data) => localStorage.setItem(`hf_data_${uid}`, JSON.stringify(data)),
};

const defaultUserData = (name) => ({
  habits: [],
  completions: {},
  preferences: {
    theme: "dark",
    accentColor: "#00f5ff",
    bgColor: "#050510",
    titleColor: "#ffffff",
    onboardingDone: false,
  },
  stats: { totalMinutes: 0 },
  createdAt: Date.now(),
  name,
});

// ─── CSS STYLES ───────────────────────────────────────────────────────────────
const GlobalStyles = ({ prefs }) => {
  const isDark = prefs?.theme !== "light";
  const accent = prefs?.accentColor || "#00f5ff";
  const bg = isDark ? (prefs?.bgColor || "#050510") : "#f0f4ff";
  const titleC = prefs?.titleColor || (isDark ? "#ffffff" : "#0a0a2e");
  const cardBg = isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)";
  const cardBorder = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.1)";
  const textMain = isDark ? "#e8eaff" : "#1a1a3e";
  const textMuted = isDark ? "#6b7280" : "#9ca3af";
  const inputBg = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)";
  const glowColor = accent;

  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap');
      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
      :root {
        --accent: ${accent};
        --bg: ${bg};
        --title-color: ${titleC};
        --card-bg: ${cardBg};
        --card-border: ${cardBorder};
        --text-main: ${textMain};
        --text-muted: ${textMuted};
        --input-bg: ${inputBg};
        --glow: ${glowColor};
        --font-display: 'Syne', sans-serif;
        --font-body: 'DM Sans', sans-serif;
      }
      body { background: var(--bg); color: var(--text-main); font-family: var(--font-body); transition: background 0.4s, color 0.4s; }
      ::-webkit-scrollbar { width: 4px; }
      ::-webkit-scrollbar-track { background: transparent; }
      ::-webkit-scrollbar-thumb { background: var(--accent); border-radius: 2px; }
      .app-wrap { min-height: 100vh; background: var(--bg); }
      
      /* BACKGROUND EFFECTS */
      .bg-fx { position:fixed; inset:0; pointer-events:none; z-index:0; overflow:hidden; }
      .bg-fx::before { content:''; position:absolute; top:-30%; left:-20%; width:60%; height:60%; background: radial-gradient(ellipse, ${accent}18 0%, transparent 70%); animation: bgPulse 8s ease-in-out infinite; }
      .bg-fx::after { content:''; position:absolute; bottom:-20%; right:-10%; width:50%; height:50%; background: radial-gradient(ellipse, ${accent}10 0%, transparent 70%); animation: bgPulse 10s ease-in-out infinite reverse; }
      @keyframes bgPulse { 0%,100%{transform:scale(1);opacity:0.6} 50%{transform:scale(1.1);opacity:1} }
      
      /* LAYOUT */
      .layout { display:flex; min-height:100vh; position:relative; z-index:1; }
      .sidebar { width:240px; min-height:100vh; border-right:1px solid var(--card-border); background: ${isDark ? 'rgba(5,5,20,0.8)' : 'rgba(240,244,255,0.8)'}; backdrop-filter:blur(20px); padding:24px 16px; display:flex; flex-direction:column; gap:8px; position:sticky; top:0; height:100vh; }
      .main-content { flex:1; padding:32px; max-width:calc(100vw - 240px); }
      
      /* SIDEBAR */
      .sidebar-logo { font-family:var(--font-display); font-size:22px; font-weight:800; color:var(--accent); padding:8px 12px 24px; letter-spacing:-0.5px; text-shadow: 0 0 20px var(--accent); }
      .sidebar-logo span { color:var(--title-color); }
      .nav-item { display:flex; align-items:center; gap:10px; padding:10px 12px; border-radius:10px; cursor:pointer; font-size:14px; font-weight:500; color:var(--text-muted); transition:all 0.2s; border:1px solid transparent; }
      .nav-item:hover { background:var(--card-bg); color:var(--text-main); border-color:var(--card-border); }
      .nav-item.active { background: ${accent}18; color:var(--accent); border-color:${accent}40; box-shadow: inset 0 0 20px ${accent}08; }
      .nav-icon { width:20px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
      .sidebar-bottom { margin-top:auto; padding-top:16px; border-top:1px solid var(--card-border); }
      .user-chip { display:flex; align-items:center; gap:10px; padding:10px 12px; border-radius:10px; background:var(--card-bg); }
      .user-avatar { width:32px; height:32px; border-radius:50%; background: linear-gradient(135deg, ${accent}, ${accent}88); display:flex; align-items:center; justify-content:center; font-weight:700; font-size:13px; color:#000; }
      .user-name { font-size:13px; font-weight:600; color:var(--text-main); }
      .user-role { font-size:11px; color:var(--text-muted); }
      
      /* CARDS */
      .card { background:var(--card-bg); border:1px solid var(--card-border); border-radius:16px; padding:24px; }
      .card-sm { background:var(--card-bg); border:1px solid var(--card-border); border-radius:12px; padding:16px; }
      .card-glow { box-shadow: 0 0 30px ${accent}15; border-color: ${accent}30; }
      
      /* TITLES */
      .page-title { font-family:var(--font-display); font-size:28px; font-weight:800; color:var(--title-color); margin-bottom:4px; }
      .page-subtitle { font-size:14px; color:var(--text-muted); margin-bottom:28px; }
      .section-title { font-family:var(--font-display); font-size:16px; font-weight:700; color:var(--title-color); margin-bottom:16px; }
      
      /* BUTTONS */
      .btn { display:inline-flex; align-items:center; gap:8px; padding:10px 20px; border-radius:10px; font-size:14px; font-weight:600; cursor:pointer; border:none; transition:all 0.2s; font-family:var(--font-body); }
      .btn-primary { background: linear-gradient(135deg, ${accent}, ${accent}cc); color:#000; box-shadow: 0 0 20px ${accent}40; }
      .btn-primary:hover { box-shadow: 0 0 30px ${accent}70; transform:translateY(-1px); }
      .btn-ghost { background:transparent; color:var(--text-muted); border:1px solid var(--card-border); }
      .btn-ghost:hover { background:var(--card-bg); color:var(--text-main); }
      .btn-danger { background:rgba(255,45,120,0.15); color:#ff2d78; border:1px solid rgba(255,45,120,0.3); }
      .btn-danger:hover { background:rgba(255,45,120,0.25); }
      .btn-sm { padding:6px 14px; font-size:13px; }
      .btn-icon { padding:8px; width:36px; height:36px; justify-content:center; border-radius:8px; }
      
      /* INPUTS */
      .input { width:100%; padding:10px 14px; border-radius:10px; border:1px solid var(--card-border); background:var(--input-bg); color:var(--text-main); font-size:14px; font-family:var(--font-body); outline:none; transition:all 0.2s; }
      .input:focus { border-color:${accent}80; box-shadow:0 0 0 3px ${accent}18; }
      .input::placeholder { color:var(--text-muted); }
      .label { font-size:13px; font-weight:500; color:var(--text-muted); margin-bottom:6px; display:block; }
      .form-group { margin-bottom:16px; }
      
      /* STAT CARDS */
      .stat-grid { display:grid; grid-template-columns:repeat(auto-fill, minmax(160px, 1fr)); gap:16px; margin-bottom:28px; }
      .stat-card { background:var(--card-bg); border:1px solid var(--card-border); border-radius:14px; padding:20px; position:relative; overflow:hidden; }
      .stat-card::before { content:''; position:absolute; top:-50%; right:-20%; width:80%; height:80%; background:radial-gradient(circle, ${accent}10, transparent 70%); }
      .stat-value { font-family:var(--font-display); font-size:32px; font-weight:800; color:var(--accent); line-height:1; }
      .stat-label { font-size:12px; color:var(--text-muted); margin-top:4px; font-weight:500; }
      .stat-trend { font-size:12px; color:#39ff14; margin-top:8px; }
      
      /* HABIT CARDS */
      .habit-grid { display:grid; gap:16px; }
      .habit-card { background:var(--card-bg); border:1px solid var(--card-border); border-radius:14px; padding:20px; }
      .habit-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:16px; }
      .habit-name { font-family:var(--font-display); font-size:16px; font-weight:700; }
      .habit-dot { width:10px; height:10px; border-radius:50%; display:inline-block; margin-right:8px; }
      .habit-actions { display:flex; gap:6px; opacity:0; transition:opacity 0.2s; }
      .habit-card:hover .habit-actions { opacity:1; }
      
      /* CALENDAR */
      .calendar-grid { display:grid; grid-template-columns:repeat(7, 1fr); gap:4px; }
      .cal-header { display:grid; grid-template-columns:repeat(7, 1fr); gap:4px; margin-bottom:8px; }
      .cal-day-name { text-align:center; font-size:11px; font-weight:600; color:var(--text-muted); padding:4px; }
      .cal-cell { aspect-ratio:1; border-radius:6px; border:1px solid var(--card-border); cursor:pointer; transition:all 0.15s; display:flex; align-items:center; justify-content:center; font-size:11px; font-weight:500; color:var(--text-muted); position:relative; }
      .cal-cell:hover { border-color:var(--accent); color:var(--text-main); }
      .cal-cell.completed { border-color:transparent; color:#000; font-weight:700; box-shadow: 0 0 8px currentColor; }
      .cal-cell.today-cell { border-color:var(--accent) !important; }
      .cal-cell.empty { cursor:default; border-color:transparent; background:transparent; }
      .cal-cell.future { opacity:0.3; cursor:not-allowed; }
      
      /* PROGRESS BAR */
      .progress-bar { height:6px; border-radius:3px; background:var(--card-border); overflow:hidden; }
      .progress-fill { height:100%; border-radius:3px; transition:width 0.6s ease; }
      
      /* STREAK BADGE */
      .streak-badge { display:inline-flex; align-items:center; gap:4px; padding:4px 10px; border-radius:20px; font-size:12px; font-weight:700; background:rgba(255,107,0,0.15); color:#ff6b00; border:1px solid rgba(255,107,0,0.3); }
      
      /* MODAL */
      .modal-overlay { position:fixed; inset:0; background:rgba(0,0,0,0.7); backdrop-filter:blur(8px); z-index:100; display:flex; align-items:center; justify-content:center; padding:20px; }
      .modal { background:${isDark ? '#0a0a1f' : '#ffffff'}; border:1px solid var(--card-border); border-radius:20px; padding:28px; width:100%; max-width:440px; }
      .modal-title { font-family:var(--font-display); font-size:20px; font-weight:800; color:var(--title-color); margin-bottom:20px; }
      
      /* QUOTE BANNER */
      .quote-banner { background: linear-gradient(135deg, ${accent}18, transparent); border:1px solid ${accent}30; border-radius:14px; padding:16px 20px; margin-bottom:28px; }
      .quote-text { font-size:14px; color:var(--text-main); font-style:italic; line-height:1.6; }
      .quote-author { font-size:12px; color:var(--accent); margin-top:6px; font-weight:600; }
      
      /* ONBOARDING TOOLTIP */
      .tooltip-wrap { position:fixed; z-index:200; max-width:280px; }
      .tooltip-box { background:${isDark ? '#0f0f2e' : '#1a1a3e'}; border:1px solid ${accent}50; border-radius:14px; padding:16px; box-shadow:0 0 40px ${accent}30; }
      .tooltip-title { font-family:var(--font-display); font-size:15px; font-weight:700; color:var(--accent); margin-bottom:6px; }
      .tooltip-body { font-size:13px; color:#e8eaff; line-height:1.5; }
      .tooltip-nav { display:flex; align-items:center; justify-content:space-between; margin-top:12px; }
      .tooltip-dots { display:flex; gap:4px; }
      .tooltip-dot { width:6px; height:6px; border-radius:50%; background:var(--card-border); transition:background 0.2s; }
      .tooltip-dot.active { background:var(--accent); }
      
      /* AUTH SCREEN */
      .auth-screen { min-height:100vh; display:flex; align-items:center; justify-content:center; padding:20px; position:relative; z-index:1; }
      .auth-card { background:${isDark ? 'rgba(10,10,31,0.9)' : 'rgba(255,255,255,0.9)'}; border:1px solid var(--card-border); border-radius:24px; padding:40px; width:100%; max-width:420px; backdrop-filter:blur(20px); }
      .auth-logo { font-family:var(--font-display); font-size:28px; font-weight:800; color:var(--accent); text-align:center; margin-bottom:4px; text-shadow: 0 0 30px ${accent}; }
      .auth-tagline { text-align:center; font-size:14px; color:var(--text-muted); margin-bottom:32px; }
      .auth-title { font-family:var(--font-display); font-size:20px; font-weight:700; color:var(--title-color); margin-bottom:20px; }
      .auth-switch { text-align:center; margin-top:20px; font-size:13px; color:var(--text-muted); }
      .auth-switch span { color:var(--accent); cursor:pointer; font-weight:600; }
      
      /* COLOR PICKER */
      .color-grid { display:flex; flex-wrap:wrap; gap:8px; }
      .color-swatch { width:28px; height:28px; border-radius:50%; cursor:pointer; border:2px solid transparent; transition:all 0.2s; }
      .color-swatch.selected { border-color:#fff; transform:scale(1.2); box-shadow:0 0 10px currentColor; }
      
      /* CHART CONTAINER */
      .chart-wrap { position:relative; width:100%; height:200px; }
      
      /* TABS */
      .tabs { display:flex; gap:4px; background:var(--card-bg); border:1px solid var(--card-border); border-radius:12px; padding:4px; margin-bottom:24px; }
      .tab { flex:1; padding:8px; border-radius:8px; cursor:pointer; font-size:13px; font-weight:600; text-align:center; color:var(--text-muted); transition:all 0.2s; }
      .tab.active { background: ${accent}25; color:var(--accent); }
      
      /* EMPTY STATE */
      .empty-state { text-align:center; padding:48px 24px; }
      .empty-icon { font-size:48px; margin-bottom:12px; opacity:0.5; }
      .empty-text { font-size:15px; color:var(--text-muted); }
      
      /* SCROLLABLE */
      .scroll-x { overflow-x:auto; }
      
      /* FLEX UTILS */
      .flex { display:flex; }
      .flex-col { flex-direction:column; }
      .items-center { align-items:center; }
      .justify-between { justify-content:space-between; }
      .gap-2 { gap:8px; }
      .gap-3 { gap:12px; }
      .gap-4 { gap:16px; }
      .mt-1 { margin-top:4px; }
      .mt-2 { margin-top:8px; }
      .mt-4 { margin-top:16px; }
      .mb-2 { margin-bottom:8px; }
      .mb-4 { margin-bottom:16px; }
      .w-full { width:100%; }
      .text-sm { font-size:13px; }
      .text-xs { font-size:11px; }
      .font-bold { font-weight:700; }
      .text-muted { color:var(--text-muted); }
      .text-accent { color:var(--accent); }

      @media (max-width: 768px) {
        .sidebar { display:none; }
        .main-content { max-width:100vw; padding:20px 16px; }
        .stat-grid { grid-template-columns: repeat(2, 1fr); }
      }
    `}</style>
  );
};

// ─── CHART COMPONENT (Canvas-based) ──────────────────────────────────────────
const MiniBarChart = ({ data, color, label }) => {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !data?.length) return;
    const ctx = canvas.getContext("2d");
    const W = canvas.width = canvas.offsetWidth * 2;
    const H = canvas.height = canvas.offsetHeight * 2;
    ctx.clearRect(0, 0, W, H);
    const max = Math.max(...data, 1);
    const barW = (W / data.length) * 0.6;
    const gap = (W / data.length) * 0.4;
    data.forEach((v, i) => {
      const x = i * (barW + gap) + gap / 2;
      const barH = (v / max) * (H * 0.8);
      const y = H - barH - H * 0.05;
      const grad = ctx.createLinearGradient(0, y, 0, H);
      grad.addColorStop(0, color);
      grad.addColorStop(1, color + "33");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.roundRect(x, y, barW, barH, 4);
      ctx.fill();
    });
  }, [data, color]);
  return (
    <div className="chart-wrap">
      <canvas ref={canvasRef} style={{ width: "100%", height: "100%" }} />
    </div>
  );
};

const RadialProgress = ({ pct, color, size = 80 }) => {
  const r = (size / 2) - 6;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth={5} />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={5}
        strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
        style={{ transition: "stroke-dasharray 0.8s ease", filter: `drop-shadow(0 0 6px ${color})` }} />
      <text x={size/2} y={size/2} textAnchor="middle" dominantBaseline="middle"
        style={{ transform: "rotate(90deg)", transformOrigin: `${size/2}px ${size/2}px`, fill: color, fontSize: 14, fontWeight: 700, fontFamily: "Syne, sans-serif" }}>
        {pct}%
      </text>
    </svg>
  );
};

// ─── ONBOARDING ───────────────────────────────────────────────────────────────
const ONBOARDING_STEPS = [
  { icon: "zap",       title: "Bienvenido a HabitFlow", body: "Esta es tu plataforma de hábitos. Te guiaré por las secciones principales." },
  { icon: "grid",      title: "Dashboard", body: "Aquí verás un resumen de tu progreso diario, rachas y estadísticas clave." },
  { icon: "check-sq",  title: "Mis Hábitos", body: "Crea y gestiona tus hábitos. Cada uno tiene un calendario mensual para marcar completados." },
  { icon: "bar-chart", title: "Estadísticas", body: "Analiza tu progreso con gráficos, porcentajes de cumplimiento y rachas." },
  { icon: "settings",  title: "Ajustes", body: "Personaliza colores, tema claro/oscuro y tus preferencias de interfaz." },
  { icon: "target",    title: "¡Listo para empezar!", body: "Crea tu primer hábito y construye una rutina poderosa." },
];

const OnboardingTooltip = ({ step, total, onNext, onSkip }) => {
  const s = ONBOARDING_STEPS[step];
  return (
    <div className="modal-overlay" onClick={onSkip}>
      <motion.div className="tooltip-wrap" style={{ position: "relative", maxWidth: 320 }} onClick={e => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
        <div className="tooltip-box">
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <div style={{ padding: 6, borderRadius: 8, background: "rgba(255,255,255,0.08)", display: "flex", alignItems: "center" }}>
              <Icon name={s.icon} size={16} color="var(--accent)" strokeWidth={2} />
            </div>
            <div className="tooltip-title" style={{ marginBottom: 0 }}>{s.title}</div>
          </div>
          <div className="tooltip-body">{s.body}</div>
          <div className="tooltip-nav">
            <div className="tooltip-dots">
              {Array.from({ length: total }).map((_, i) => (
                <div key={i} className={`tooltip-dot ${i === step ? "active" : ""}`} />
              ))}
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button className="btn btn-ghost btn-sm" onClick={onSkip}>Saltar</button>
              <button className="btn btn-primary btn-sm" onClick={onNext}>
                {step === total - 1 ? "¡Empezar!" : "Siguiente"}
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// ─── AUTH ─────────────────────────────────────────────────────────────────────
const AuthScreen = ({ onLogin }) => {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handle = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }));

  const submit = () => {
    setError("");
    setLoading(true);
    setTimeout(() => {
      const users = DB.getUsers();
      if (mode === "register") {
        if (!form.name || !form.email || !form.password) return setError("Completa todos los campos.") || setLoading(false);
        if (Object.values(users).find(u => u.email === form.email)) return setError("Email ya registrado.") || setLoading(false);
        const id = generateId();
        users[id] = { id, name: form.name, email: form.email, password: hashPassword(form.password) };
        DB.saveUsers(users);
        DB.saveUserData(id, defaultUserData(form.name));
        DB.setSession(id);
        onLogin(id);
      } else {
        const user = Object.values(users).find(u => u.email === form.email && u.password === hashPassword(form.password));
        if (!user) return setError("Credenciales incorrectas.") || setLoading(false);
        DB.setSession(user.id);
        onLogin(user.id);
      }
      setLoading(false);
    }, 600);
  };

  return (
    <div className="app-wrap">
      <div className="bg-fx" />
      <GlobalStyles prefs={null} />
      <div className="auth-screen">
        <motion.div className="auth-card" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
          <div className="auth-logo">
            <span style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
              <Icon name="zap" size={26} color="var(--accent)" strokeWidth={2} />
              HabitFlow
            </span>
          </div>
          <div className="auth-tagline">Construye el mejor tú, un día a la vez</div>
          <div className="auth-title">{mode === "login" ? "Iniciar Sesión" : "Crear Cuenta"}</div>
          {mode === "register" && (
            <div className="form-group">
              <label className="label">Nombre</label>
              <input className="input" placeholder="Tu nombre" value={form.name} onChange={handle("name")} onKeyDown={e => e.key === "Enter" && submit()} />
            </div>
          )}
          <div className="form-group">
            <label className="label">Email</label>
            <input className="input" type="email" placeholder="hola@ejemplo.com" value={form.email} onChange={handle("email")} onKeyDown={e => e.key === "Enter" && submit()} />
          </div>
          <div className="form-group">
            <label className="label">Contraseña</label>
            <input className="input" type="password" placeholder="••••••••" value={form.password} onChange={handle("password")} onKeyDown={e => e.key === "Enter" && submit()} />
          </div>
          {error && <div style={{ color: "#ff2d78", fontSize: 13, marginBottom: 12 }}>{error}</div>}
          <button className="btn btn-primary w-full" style={{ justifyContent: "center" }} onClick={submit} disabled={loading}>
            {loading ? "Procesando..." : mode === "login" ? "Entrar" : "Registrarme"}
          </button>
          <div className="auth-switch">
            {mode === "login" ? <>¿No tienes cuenta? <span onClick={() => setMode("register")}>Regístrate</span></> : <>¿Ya tienes cuenta? <span onClick={() => setMode("login")}>Inicia sesión</span></>}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

// ─── HABIT MODAL ──────────────────────────────────────────────────────────────
const HabitModal = ({ habit, onSave, onClose }) => {
  const [form, setForm] = useState({ name: habit?.name || "", color: habit?.color || "#00f5ff" });
  return (
    <div className="modal-overlay" onClick={onClose}>
      <motion.div className="modal" onClick={e => e.stopPropagation()} initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }}>
        <div className="modal-title">{habit ? "Editar Hábito" : "Nuevo Hábito"}</div>
        <div className="form-group">
          <label className="label">Nombre del hábito</label>
          <input className="input" placeholder="Ej: Leer 30 minutos" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} autoFocus onKeyDown={e => e.key === "Enter" && form.name && onSave(form)} />
        </div>
        <div className="form-group">
          <label className="label">Color</label>
          <div className="color-grid">
            {NEON_COLORS.map(c => (
              <div key={c.value} className={`color-swatch ${form.color === c.value ? "selected" : ""}`}
                style={{ background: c.value, boxShadow: form.color === c.value ? `0 0 12px ${c.value}` : "none" }}
                onClick={() => setForm(f => ({ ...f, color: c.value }))} title={c.name} />
            ))}
          </div>
        </div>
        <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
          <button className="btn btn-ghost" style={{ flex: 1, justifyContent: "center" }} onClick={onClose}>Cancelar</button>
          <button className="btn btn-primary" style={{ flex: 1, justifyContent: "center" }} onClick={() => form.name && onSave(form)} disabled={!form.name}>
            {habit ? "Guardar" : "Crear"}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

// ─── HABIT CALENDAR ───────────────────────────────────────────────────────────
const HabitCalendar = ({ habit, completions, onToggle }) => {
  const now = new Date();
  const [viewYear, setViewYear] = useState(now.getFullYear());
  const [viewMonth, setViewMonth] = useState(now.getMonth());
  const days = getDaysInMonth(viewYear, viewMonth);
  const firstDay = getFirstDayOfMonth(viewYear, viewMonth);
  const t = today();

  const prevMonth = () => { if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); } else setViewMonth(m => m - 1); };
  const nextMonth = () => { if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); } else setViewMonth(m => m + 1); };

  const completed = new Set(
    Object.keys(completions || {}).filter(k => completions[k]?.includes(habit.id) &&
      k.startsWith(`${viewYear}-${String(viewMonth+1).padStart(2,'0')}`))
      .map(k => parseInt(k.split("-")[2]))
  );

  const completedCount = completed.size;
  const totalDays = viewYear === t.y && viewMonth === t.m ? t.d : days;
  const pct = totalDays > 0 ? Math.round((completedCount / totalDays) * 100) : 0;

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <button className="btn btn-ghost btn-icon btn-sm" onClick={prevMonth}>
          <Icon name="chevron-l" size={14} strokeWidth={2.2} />
        </button>
        <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-main)" }}>{monthNames[viewMonth]} {viewYear}</span>
        <button className="btn btn-ghost btn-icon btn-sm" onClick={nextMonth}>
          <Icon name="chevron-r" size={14} strokeWidth={2.2} />
        </button>
      </div>
      <div className="cal-header">
        {dayNames.map(d => <div key={d} className="cal-day-name">{d}</div>)}
      </div>
      <div className="calendar-grid">
        {Array.from({ length: firstDay }).map((_, i) => <div key={`e${i}`} className="cal-cell empty" />)}
        {Array.from({ length: days }).map((_, i) => {
          const day = i + 1;
          const key = dateKey(viewYear, viewMonth, day);
          const isDone = completed.has(day);
          const isToday = viewYear === t.y && viewMonth === t.m && day === t.d;
          const isFuture = viewYear === t.y && viewMonth === t.m && day > t.d;
          return (
            <motion.div key={day} className={`cal-cell ${isDone ? "completed" : ""} ${isToday ? "today-cell" : ""} ${isFuture ? "future" : ""}`}
              style={isDone ? { background: habit.color, color: "#000", boxShadow: `0 0 8px ${habit.color}` } : {}}
              whileHover={!isFuture ? { scale: 1.1 } : {}} whileTap={!isFuture ? { scale: 0.95 } : {}}
              onClick={() => !isFuture && onToggle(habit.id, key)}>
              {day}
            </motion.div>
          );
        })}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 12 }}>
        <div style={{ flex: 1 }}>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${pct}%`, background: habit.color }} />
          </div>
        </div>
        <span style={{ fontSize: 12, fontWeight: 700, color: habit.color }}>{pct}%</span>
        <span style={{ fontSize: 11, color: "var(--text-muted)" }}>{completedCount}/{totalDays} días</span>
      </div>
    </div>
  );
};

// ─── STATS PANEL ──────────────────────────────────────────────────────────────
const StatsPanel = ({ habits, completions, prefs }) => {
  const accent = prefs?.accentColor || "#00f5ff";
  const t = today();

  const getHabitStats = (habit) => {
    const keys = Object.keys(completions || {}).filter(k => completions[k]?.includes(habit.id));
    const sorted = keys.sort();
    let streak = 0, maxStreak = 0, cur = 0;
    // current streak
    let d = new Date(t.y, t.m, t.d);
    while (true) {
      const k = dateKey(d.getFullYear(), d.getMonth(), d.getDate());
      if (completions[k]?.includes(habit.id)) { streak++; d.setDate(d.getDate() - 1); } else break;
    }
    // max streak
    const dates = sorted.map(k => new Date(k));
    for (let i = 0; i < dates.length; i++) {
      cur++;
      if (i + 1 < dates.length) {
        const diff = (dates[i+1] - dates[i]) / 86400000;
        if (diff !== 1) { maxStreak = Math.max(maxStreak, cur); cur = 0; }
      }
    }
    maxStreak = Math.max(maxStreak, cur);
    const thisMonthDone = keys.filter(k => k.startsWith(`${t.y}-${String(t.m+1).padStart(2,'0')}`)).length;
    const daysElapsed = t.d;
    const pct = daysElapsed > 0 ? Math.round((thisMonthDone / daysElapsed) * 100) : 0;
    const last7 = Array.from({ length: 7 }, (_, i) => {
      const dd = new Date(t.y, t.m, t.d - 6 + i);
      const k = dateKey(dd.getFullYear(), dd.getMonth(), dd.getDate());
      return completions[k]?.includes(habit.id) ? 1 : 0;
    });
    return { streak, maxStreak, thisMonthDone, pct, total: keys.length, last7 };
  };

  const totalCompletions = Object.values(completions || {}).reduce((a, v) => a + (v?.length || 0), 0);
  const allStreaks = habits.map(h => getHabitStats(h).streak);
  const bestStreak = Math.max(0, ...allStreaks);
  const todayDone = habits.filter(h => completions[dateKey(t.y, t.m, t.d)]?.includes(h.id)).length;
  const todayPct = habits.length > 0 ? Math.round((todayDone / habits.length) * 100) : 0;
  const last7days = Array.from({ length: 7 }, (_, i) => {
    const dd = new Date(t.y, t.m, t.d - 6 + i);
    const k = dateKey(dd.getFullYear(), dd.getMonth(), dd.getDate());
    return completions[k]?.length || 0;
  });

  return (
    <div>
      <div className="page-title">Estadísticas</div>
      <div className="page-subtitle">Tu progreso en tiempo real</div>

      <div className="stat-grid">
        {[
          { value: totalCompletions, label: "Total completados", icon: "check-sq" },
          { value: bestStreak,       label: "Mejor racha",       icon: "flame"    },
          { value: `${todayPct}%`,   label: "Cumplimiento hoy",  icon: "activity" },
          { value: habits.length,    label: "Hábitos activos",   icon: "layers"   },
        ].map((s, i) => (
          <motion.div key={i} className="stat-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
              <div style={{ padding: 7, borderRadius: 8, background: "rgba(255,255,255,0.06)", display: "flex" }}>
                <Icon name={s.icon} size={15} color="var(--accent)" strokeWidth={1.8} />
              </div>
            </div>
            <div className="stat-value">{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </motion.div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 28 }}>
        <div className="card">
          <div className="section-title">Últimos 7 días</div>
          <MiniBarChart data={last7days} color={accent} label="completados" />
        </div>
        <div className="card">
          <div className="section-title">Cumplimiento hoy</div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 160 }}>
            <div style={{ textAlign: "center" }}>
              <RadialProgress pct={todayPct} color={accent} size={120} />
              <div style={{ marginTop: 8, fontSize: 13, color: "var(--text-muted)" }}>{todayDone} de {habits.length} hábitos</div>
            </div>
          </div>
        </div>
      </div>

      <div className="section-title">Por hábito</div>
      {habits.length === 0 ? (
        <div className="empty-state">
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 14, opacity: 0.35 }}>
            <Icon name="bar-chart" size={48} color="var(--accent)" strokeWidth={1} />
          </div>
          <div className="empty-text">Crea hábitos para ver estadísticas</div>
        </div>
      ) : (
        <div style={{ display: "grid", gap: 12 }}>
          {habits.map(habit => {
            const st = getHabitStats(habit);
            return (
              <motion.div key={habit.id} className="card" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span className="habit-dot" style={{ background: habit.color, boxShadow: `0 0 6px ${habit.color}` }} />
                    <span style={{ fontWeight: 700, color: "var(--text-main)" }}>{habit.name}</span>
                  </div>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <div className="streak-badge">
                    <Icon name="flame" size={11} color="#ff6b00" strokeWidth={2} /> {st.streak}
                  </div>
                    <RadialProgress pct={st.pct} color={habit.color} size={52} />
                  </div>
                </div>
                <div style={{ display: "flex", gap: 4, marginBottom: 8 }}>
                  {st.last7.map((v, i) => (
                    <div key={i} style={{ flex: 1, height: 6, borderRadius: 3, background: v ? habit.color : "var(--card-border)", boxShadow: v ? `0 0 4px ${habit.color}` : "none" }} />
                  ))}
                </div>
                <div style={{ display: "flex", gap: 16 }}>
                  {[
                    { label: "Racha máx", val: `${st.maxStreak} días` },
                    { label: "Este mes", val: `${st.thisMonthDone} días` },
                    { label: "Total", val: `${st.total} veces` },
                  ].map(s => (
                    <div key={s.label}>
                      <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{s.label}</div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: habit.color }}>{s.val}</div>
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// ─── SETTINGS PANEL ───────────────────────────────────────────────────────────
const SettingsPanel = ({ prefs, onUpdate, user }) => {
  const [localPrefs, setLocalPrefs] = useState(prefs);
  const update = (key, val) => {
    const np = { ...localPrefs, [key]: val };
    setLocalPrefs(np);
    onUpdate(np);
  };
  return (
    <div>
      <div className="page-title">Configuración</div>
      <div className="page-subtitle">Personaliza tu experiencia</div>

      <div style={{ display: "grid", gap: 20 }}>
        <div className="card">
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <Icon name="user" size={15} color="var(--accent)" strokeWidth={1.8} />
            <div className="section-title" style={{ marginBottom: 0 }}>Cuenta</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 48, height: 48, borderRadius: "50%", background: `linear-gradient(135deg, ${localPrefs.accentColor}, ${localPrefs.accentColor}88)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: 800, color: "#000" }}>
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <div>
              <div style={{ fontWeight: 700, color: "var(--text-main)" }}>{user?.name}</div>
              <div style={{ fontSize: 13, color: "var(--text-muted)" }}>{user?.email}</div>
            </div>
          </div>
        </div>

        <div className="card">
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <Icon name="palette" size={15} color="var(--accent)" strokeWidth={1.8} />
            <div className="section-title" style={{ marginBottom: 0 }}>Apariencia</div>
          </div>
          <div className="form-group">
            <label className="label">Tema</label>
            <div className="tabs" style={{ marginBottom: 0 }}>
              <div className={`tab ${localPrefs.theme === "dark" ? "active" : ""}`} onClick={() => update("theme", "dark")} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                <Icon name="moon" size={13} strokeWidth={2} /> Oscuro
              </div>
              <div className={`tab ${localPrefs.theme === "light" ? "active" : ""}`} onClick={() => update("theme", "light")} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                <Icon name="sun" size={13} strokeWidth={2} /> Claro
              </div>
            </div>
          </div>
          <div className="form-group">
            <label className="label">Color de acento</label>
            <div className="color-grid">
              {NEON_COLORS.map(c => (
                <div key={c.value} className={`color-swatch ${localPrefs.accentColor === c.value ? "selected" : ""}`}
                  style={{ background: c.value, boxShadow: localPrefs.accentColor === c.value ? `0 0 12px ${c.value}` : "none" }}
                  onClick={() => update("accentColor", c.value)} title={c.name} />
              ))}
            </div>
          </div>
          <div className="form-group">
            <label className="label">Color del fondo</label>
            <input type="color" value={localPrefs.bgColor || "#050510"} className="input" style={{ height: 44, padding: "4px 8px", cursor: "pointer" }}
              onChange={e => update("bgColor", e.target.value)} />
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="label">Color de títulos</label>
            <input type="color" value={localPrefs.titleColor || "#ffffff"} className="input" style={{ height: 44, padding: "4px 8px", cursor: "pointer" }}
              onChange={e => update("titleColor", e.target.value)} />
          </div>
        </div>

        <div className="card">
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <Icon name="layers" size={15} color="var(--accent)" strokeWidth={1.8} />
            <div className="section-title" style={{ marginBottom: 0 }}>Onboarding</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text-main)" }}>Tutorial de bienvenida</div>
              <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>Mostrar el tour guiado de la aplicación</div>
            </div>
            <button className="btn btn-ghost btn-sm" style={{ display: "flex", alignItems: "center", gap: 6 }} onClick={() => update("onboardingDone", false)}>
              <Icon name="refresh" size={13} strokeWidth={2} /> Reiniciar tour
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── DASHBOARD ────────────────────────────────────────────────────────────────
const Dashboard = ({ userData, user, onNavigate }) => {
  const { habits, completions, preferences: prefs } = userData;
  const accent = prefs?.accentColor || "#00f5ff";
  const t = today();
  const quote = MOTIVATIONAL_QUOTES[new Date().getDate() % MOTIVATIONAL_QUOTES.length];

  const todayKey = dateKey(t.y, t.m, t.d);
  const todayDone = habits.filter(h => completions[todayKey]?.includes(h.id)).length;
  const totalAllTime = Object.values(completions).reduce((a, v) => a + (v?.length || 0), 0);
  const bestStreak = Math.max(0, ...habits.map(h => {
    let streak = 0;
    let d = new Date(t.y, t.m, t.d);
    while (true) {
      const k = dateKey(d.getFullYear(), d.getMonth(), d.getDate());
      if (completions[k]?.includes(h.id)) { streak++; d.setDate(d.getDate() - 1); } else break;
    }
    return streak;
  }));
  const monthDays = t.d;
  const monthCompletions = Object.keys(completions).filter(k => k.startsWith(`${t.y}-${String(t.m+1).padStart(2,'0')}`)).reduce((a, k) => a + (completions[k]?.length || 0), 0);
  const monthPossible = habits.length * monthDays;
  const monthPct = monthPossible > 0 ? Math.round((monthCompletions / monthPossible) * 100) : 0;

  const last7 = Array.from({ length: 7 }, (_, i) => {
    const dd = new Date(t.y, t.m, t.d - 6 + i);
    const k = dateKey(dd.getFullYear(), dd.getMonth(), dd.getDate());
    const total = completions[k]?.length || 0;
    return total;
  });

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <div className="page-title">Hola, {user?.name?.split(" ")[0]} 👋</div>
        <div className="page-subtitle">{new Date().toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long" })}</div>
      </div>

      <div className="quote-banner">
        <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
          <div style={{ paddingTop: 2, opacity: 0.6, flexShrink: 0 }}>
            <Icon name="quote" size={16} color="var(--accent)" strokeWidth={1.8} />
          </div>
          <div>
            <div className="quote-text">"{quote}"</div>
            <div className="quote-author">— HabitFlow Daily</div>
          </div>
        </div>
      </div>

      <div className="stat-grid">
        {[
          { val: `${todayDone}/${habits.length}`, label: "Hábitos hoy",      icon: "zap"       },
          { val: `${monthPct}%`,                  label: "Mes actual",        icon: "calendar"  },
          { val: bestStreak,                      label: "Mejor racha",       icon: "flame"     },
          { val: totalAllTime,                    label: "Total completados", icon: "trophy"    },
        ].map((s, i) => (
          <motion.div key={i} className="stat-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
              <div style={{ padding: 7, borderRadius: 8, background: "rgba(255,255,255,0.06)", display: "flex" }}>
                <Icon name={s.icon} size={15} color="var(--accent)" strokeWidth={1.8} />
              </div>
            </div>
            <div className="stat-value" style={{ fontSize: 26 }}>{s.val}</div>
            <div className="stat-label">{s.label}</div>
          </motion.div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 28 }}>
        <div className="card">
          <div className="section-title">Actividad — últimos 7 días</div>
          <MiniBarChart data={last7} color={accent} />
        </div>
        <div className="card">
          <div className="section-title">Progreso del mes</div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", paddingTop: 16 }}>
            <div style={{ textAlign: "center" }}>
              <RadialProgress pct={monthPct} color={accent} size={110} />
              <div style={{ marginTop: 8, fontSize: 12, color: "var(--text-muted)" }}>{monthCompletions}/{monthPossible} completados</div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <div className="section-title" style={{ marginBottom: 0 }}>Hábitos de hoy</div>
          <button className="btn btn-ghost btn-sm" style={{ display: "flex", alignItems: "center", gap: 6 }} onClick={() => onNavigate("habits")}>
            Ver todos <Icon name="chevron-r" size={13} strokeWidth={2.2} />
          </button>
        </div>
        {habits.length === 0 ? (
          <div className="card" style={{ textAlign: "center", padding: "32px 24px" }}>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 12, opacity: 0.4 }}>
              <Icon name="seedling" size={44} color="var(--accent)" strokeWidth={1.2} />
            </div>
            <div style={{ fontSize: 15, fontWeight: 600, color: "var(--text-main)", marginBottom: 6 }}>Empieza tu viaje</div>
            <div style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 16 }}>Crea tu primer hábito y comienza a construir rutinas poderosas</div>
            <button className="btn btn-primary" onClick={() => onNavigate("habits")}>
              <Icon name="plus" size={15} strokeWidth={2.5} /> Crear hábito
            </button>
          </div>
        ) : (
          <div style={{ display: "grid", gap: 10 }}>
            {habits.map(habit => {
              const done = completions[todayKey]?.includes(habit.id);
              return (
                <motion.div key={habit.id} className="card-sm" style={{ display: "flex", alignItems: "center", gap: 12, borderColor: done ? habit.color + "40" : undefined }}
                  initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
                  <div style={{ width: 12, height: 12, borderRadius: "50%", background: done ? habit.color : "var(--card-border)", boxShadow: done ? `0 0 8px ${habit.color}` : "none", transition: "all 0.3s" }} />
                  <span style={{ flex: 1, fontWeight: 600, color: done ? habit.color : "var(--text-main)", textDecoration: done ? "line-through" : "none", opacity: done ? 0.7 : 1 }}>{habit.name}</span>
                  {done && <span style={{ fontSize: 11, color: habit.color, fontWeight: 700, display: "flex", alignItems: "center", gap: 4 }}>
                    <Icon name="check" size={12} color={habit.color} strokeWidth={2.5} /> Hecho
                  </span>}
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

// ─── HABITS PANEL ─────────────────────────────────────────────────────────────
const HabitsPanel = ({ userData, onUpdate }) => {
  const { habits, completions } = userData;
  const [showModal, setShowModal] = useState(false);
  const [editHabit, setEditHabit] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  const saveHabit = (form) => {
    let newHabits;
    if (editHabit) {
      newHabits = habits.map(h => h.id === editHabit.id ? { ...h, ...form } : h);
    } else {
      newHabits = [...habits, { id: generateId(), ...form, createdAt: Date.now() }];
    }
    onUpdate({ habits: newHabits });
    setShowModal(false);
    setEditHabit(null);
  };

  const deleteHabit = (id) => {
    onUpdate({ habits: habits.filter(h => h.id !== id) });
  };

  const toggleCompletion = (habitId, dateK) => {
    const current = completions[dateK] || [];
    const updated = current.includes(habitId) ? current.filter(id => id !== habitId) : [...current, habitId];
    onUpdate({ completions: { ...completions, [dateK]: updated } });
  };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 28 }}>
        <div>
          <div className="page-title">Mis Hábitos</div>
          <div className="page-subtitle">{habits.length} hábito{habits.length !== 1 ? "s" : ""} activo{habits.length !== 1 ? "s" : ""}</div>
        </div>
        <button className="btn btn-primary" onClick={() => { setEditHabit(null); setShowModal(true); }}>
          <Icon name="plus" size={15} strokeWidth={2.5} /> Nuevo hábito
        </button>
      </div>

      {habits.length === 0 ? (
        <div className="empty-state">
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 14, opacity: 0.35 }}>
            <Icon name="target" size={52} color="var(--accent)" strokeWidth={1} />
          </div>
          <div style={{ fontSize: 18, fontWeight: 700, color: "var(--text-main)", marginBottom: 8 }}>Sin hábitos todavía</div>
          <div className="empty-text" style={{ marginBottom: 20 }}>Crea tu primer hábito para empezar a trackear tu progreso</div>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            <Icon name="plus" size={15} strokeWidth={2.5} /> Crear primer hábito
          </button>
        </div>
      ) : (
        <div className="habit-grid">
          {habits.map((habit, idx) => {
            const t = today();
            const todayKey = dateKey(t.y, t.m, t.d);
            const doneTodayCheck = completions[todayKey]?.includes(habit.id);
            const isExpanded = expandedId === habit.id;
            let streak = 0;
            let d = new Date(t.y, t.m, t.d);
            while (true) {
              const k = dateKey(d.getFullYear(), d.getMonth(), d.getDate());
              if (completions[k]?.includes(habit.id)) { streak++; d.setDate(d.getDate() - 1); } else break;
            }

            return (
              <motion.div key={habit.id} className="habit-card"
                style={{ borderColor: doneTodayCheck ? habit.color + "50" : undefined, boxShadow: doneTodayCheck ? `0 0 20px ${habit.color}15` : undefined }}
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}>
                <div className="habit-header">
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <motion.div style={{ width: 14, height: 14, borderRadius: "50%", background: habit.color, boxShadow: `0 0 10px ${habit.color}`, cursor: "pointer" }}
                      whileHover={{ scale: 1.3 }} whileTap={{ scale: 0.9 }}
                      onClick={() => toggleCompletion(habit.id, dateKey(t.y, t.m, t.d))} />
                    <div>
                      <div className="habit-name" style={{ color: habit.color }}>{habit.name}</div>
                      <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
                        {doneTodayCheck ? "Completado hoy" : "Pendiente hoy"}
                        {streak > 0 && <span className="streak-badge" style={{ marginLeft: 8 }}>
                          <Icon name="flame" size={11} color="#ff6b00" strokeWidth={2} /> {streak}
                        </span>}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                    <div className="habit-actions">
                      <button className="btn btn-ghost btn-icon btn-sm" onClick={() => { setEditHabit(habit); setShowModal(true); }} title="Editar">
                        <Icon name="edit" size={14} strokeWidth={1.8} />
                      </button>
                      <button className="btn btn-danger btn-icon btn-sm" onClick={() => deleteHabit(habit.id)} title="Eliminar">
                        <Icon name="trash" size={14} strokeWidth={1.8} />
                      </button>
                    </div>
                    <button className="btn btn-ghost btn-icon btn-sm" onClick={() => setExpandedId(isExpanded ? null : habit.id)}>
                      <Icon name={isExpanded ? "chevron-up" : "chevron-dn"} size={14} strokeWidth={2} />
                    </button>
                  </div>
                </div>
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} style={{ overflow: "hidden" }}>
                      <div style={{ borderTop: "1px solid var(--card-border)", paddingTop: 16 }}>
                        <HabitCalendar habit={habit} completions={completions} onToggle={toggleCompletion} />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      )}

      <AnimatePresence>
        {showModal && <HabitModal habit={editHabit} onSave={saveHabit} onClose={() => { setShowModal(false); setEditHabit(null); }} />}
      </AnimatePresence>
    </div>
  );
};

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [userId, setUserId] = useState(() => DB.getSession());
  const [userData, setUserData] = useState(null);
  const [user, setUser] = useState(null);
  const [page, setPage] = useState("dashboard");
  const [onboardingStep, setOnboardingStep] = useState(-1);

  useEffect(() => {
    if (userId) {
      const data = DB.getUserData(userId);
      const users = DB.getUsers();
      if (data) {
        setUserData(data);
        setUser(users[userId]);
        if (!data.preferences?.onboardingDone) setOnboardingStep(0);
      } else {
        DB.clearSession();
        setUserId(null);
      }
    }
  }, [userId]);

  const updateUserData = useCallback((patch) => {
    setUserData(prev => {
      const updated = { ...prev, ...patch };
      DB.saveUserData(userId, updated);
      return updated;
    });
  }, [userId]);

  const updatePrefs = useCallback((prefs) => {
    setUserData(prev => {
      const updated = { ...prev, preferences: prefs };
      DB.saveUserData(userId, updated);
      return updated;
    });
  }, [userId]);

  const logout = () => {
    DB.clearSession();
    setUserId(null);
    setUserData(null);
    setUser(null);
    setPage("dashboard");
  };

  const nextOnboarding = () => {
    if (onboardingStep >= ONBOARDING_STEPS.length - 1) {
      setOnboardingStep(-1);
      updatePrefs({ ...userData.preferences, onboardingDone: true });
    } else {
      setOnboardingStep(s => s + 1);
    }
  };
  const skipOnboarding = () => {
    setOnboardingStep(-1);
    updatePrefs({ ...userData.preferences, onboardingDone: true });
  };

  if (!userId) return <AuthScreen onLogin={setUserId} />;
  if (!userData) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#050510", color: "#00f5ff", fontFamily: "Syne, sans-serif", fontSize: 18 }}>
      Cargando...
    </div>
  );

  const prefs = userData.preferences || {};
  const accent = prefs.accentColor || "#00f5ff";

  const NAV = [
    { id: "dashboard", label: "Dashboard",      icon: "grid"      },
    { id: "habits",    label: "Mis Hábitos",    icon: "check-sq"  },
    { id: "stats",     label: "Estadísticas",   icon: "bar-chart" },
    { id: "settings",  label: "Ajustes",        icon: "settings"  },
  ];

  return (
    <div className="app-wrap">
      <GlobalStyles prefs={prefs} />
      <div className="bg-fx" />

      <div className="layout">
        {/* SIDEBAR */}
        <div className="sidebar">
          <div className="sidebar-logo">
            <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Icon name="zap" size={20} color="var(--accent)" strokeWidth={2.2} />
              Habit<span>Flow</span>
            </span>
          </div>
          {NAV.map(n => (
            <motion.div key={n.id} className={`nav-item ${page === n.id ? "active" : ""}`}
              onClick={() => setPage(n.id)} whileHover={{ x: 2 }} whileTap={{ scale: 0.98 }}>
              <span className="nav-icon"><Icon name={n.icon} size={17} strokeWidth={page === n.id ? 2 : 1.6} /></span>
              {n.label}
            </motion.div>
          ))}
          <div className="sidebar-bottom">
            <div className="user-chip">
              <div className="user-avatar" style={{ background: `linear-gradient(135deg, ${accent}, ${accent}88)` }}>
                {user?.name?.[0]?.toUpperCase()}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="user-name" style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user?.name}</div>
                <div className="user-role">Pro</div>
              </div>
              <button className="btn btn-ghost btn-icon" style={{ padding: 4, width: 28, height: 28 }} onClick={logout} title="Cerrar sesión">
                <Icon name="logout" size={14} strokeWidth={2} />
              </button>
            </div>
          </div>
        </div>

        {/* MAIN */}
        <div className="main-content">
          <AnimatePresence mode="wait">
            <motion.div key={page} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
              {page === "dashboard" && <Dashboard userData={userData} user={user} onNavigate={setPage} />}
              {page === "habits" && <HabitsPanel userData={userData} onUpdate={updateUserData} />}
              {page === "stats" && <StatsPanel habits={userData.habits} completions={userData.completions} prefs={prefs} />}
              {page === "settings" && <SettingsPanel prefs={prefs} onUpdate={updatePrefs} user={user} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* ONBOARDING */}
      <AnimatePresence>
        {onboardingStep >= 0 && (
          <OnboardingTooltip step={onboardingStep} total={ONBOARDING_STEPS.length} onNext={nextOnboarding} onSkip={skipOnboarding} />
        )}
      </AnimatePresence>
    </div>
  );
}
