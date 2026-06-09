import { useState, useMemo, useEffect, useContext, createContext } from "react";

// ─── CONTEXT ───────────────────────────────────────────────────────────────
const AppCtx = createContext(null);
const useApp = () => useContext(AppCtx);

// ─── RESPONSIVE BREAKPOINT HOOK ────────────────────────────────────────────
function useBreakpoint() {
  const [bp, setBp] = useState(() => {
    if (typeof window === "undefined") return { mobile: true, tablet: false, desktop: false, wide: false };
    const w = window.innerWidth;
    return {
      mobile:  w < 640,
      tablet:  w >= 640 && w < 1024,
      desktop: w >= 1024 && w < 1440,
      wide:    w >= 1440,
    };
  });
  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      setBp({
        mobile:  w < 640,
        tablet:  w >= 640 && w < 1024,
        desktop: w >= 1024 && w < 1440,
        wide:    w >= 1440,
      });
    };
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  return bp;
}

// ─── FONT INJECTION ────────────────────────────────────────────────────────
(() => {
  if (typeof document === "undefined") return;
  if (document.getElementById("levain-fonts-v6")) return;
  const link = document.createElement("link");
  link.id = "levain-fonts-v6";
  link.rel = "stylesheet";
  link.href = "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300..900&family=Vazirmatn:wght@300..900&display=swap";
  document.head.appendChild(link);
})();

// ─── GLOBAL STYLES ─────────────────────────────────────────────────────────
function updateGlobalStyles(C) {
  let s = document.getElementById("levain-boot-v6");
  if (!s) { s = document.createElement("style"); s.id = "levain-boot-v6"; document.head.appendChild(s); }
  s.textContent = `
    @keyframes fadeUp { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes float {
      0%, 100% { transform: translate(0,0) scale(1); opacity: 0.4; }
      33% { transform: translate(30px,-40px) scale(1.1); opacity: 0.6; }
      66% { transform: translate(-20px,30px) scale(0.9); opacity: 0.3; }
    }
    @keyframes drift {
      0%   { transform: translate(0, 0); }
      50%  { transform: translate(-15px, 10px); }
      100% { transform: translate(0, 0); }
    }
    
    html { font-size: 16px; }
    html, body {
      background: ${C.bg} !important;
      color: ${C.text};
      transition: background 0.4s ease, color 0.4s ease;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      text-rendering: optimizeLegibility;
    }
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    
    ::selection { background: ${C.accentSoft}; color: ${C.accent}; }
    
    input[type=range] {
      -webkit-appearance: none; appearance: none;
      width: 100%; height: 6px;
      background: ${C.divider};
      border-radius: 999px; outline: none; cursor: pointer;
    }
    input[type=range]::-webkit-slider-thumb {
      -webkit-appearance: none;
      width: 24px; height: 24px; border-radius: 50%;
      background: #FFFFFF; cursor: pointer;
      box-shadow: 0 1px 3px rgba(0,0,0,0.15), 0 0 0 1px ${C.divider}, 0 4px 12px rgba(0,0,0,0.12);
      transition: transform 0.2s cubic-bezier(0.32, 0.72, 0, 1);
    }
    input[type=range]::-webkit-slider-thumb:hover { transform: scale(1.1); }
    input[type=range]::-moz-range-thumb {
      width: 24px; height: 24px; border-radius: 50%;
      background: #FFFFFF; border: 1px solid ${C.divider}; cursor: pointer;
    }
    
    .ls::-webkit-scrollbar { width: 8px; }
    .ls::-webkit-scrollbar-track { background: transparent; }
    .ls::-webkit-scrollbar-thumb { background: ${C.scrollThumb}; border-radius: 999px; }
    
    button:focus-visible, input:focus-visible {
      outline: 2px solid ${C.accent}; outline-offset: 2px; border-radius: 8px;
    }
    
    button { font-family: inherit; border: none; background: none; cursor: pointer; -webkit-tap-highlight-color: transparent; }
    input, button { font-family: inherit; }
    
    .fade-up { animation: fadeUp 0.5s cubic-bezier(0.32, 0.72, 0, 1) forwards; }
    .drift { animation: drift 20s ease-in-out infinite; }
    
    @media (prefers-reduced-motion: reduce) {
      *, *::before, *::after {
        animation-duration: 0.01ms !important;
        transition-duration: 0.01ms !important;
      }
    }
  `;
}

// ─── 3-COLOR PALETTE ───────────────────────────────────────────────────────
const LIGHT = {
  bg:         "#F5F5F7",
  bgAlt:      "#FFFFFF",
  glass:      "rgba(255, 255, 255, 0.72)",
  glass2:     "rgba(255, 255, 255, 0.56)",
  glassBorder:"rgba(0, 0, 0, 0.06)",
  text:       "#1D1D1F",
  textSub:    "#48484A",
  textFaint:  "#636366",
  divider:    "rgba(0, 0, 0, 0.08)",
  dividerSoft:"rgba(0, 0, 0, 0.04)",
  accent:     "#C2410C",
  accentSoft: "rgba(194, 65, 12, 0.14)",
  accentDim:  "rgba(194, 65, 12, 0.06)",
  success:    "#16A34A",
  danger:     "#DC2626",
  scrollThumb: "rgba(0, 0, 0, 0.18)",
  shadowSm:   "0 1px 2px rgba(0, 0, 0, 0.04)",
  shadowMd:   "0 4px 12px rgba(0, 0, 0, 0.06)",
  shadowLg:   "0 8px 32px rgba(0, 0, 0, 0.08)",
  decorGlow:  "rgba(194, 65, 12, 0.08)",
};

const DARK = {
  bg:         "#1A110A",
  bgAlt:      "#2B1B10",
  glass:      "rgba(43, 27, 16, 0.72)",
  glass2:     "rgba(43, 27, 16, 0.56)",
  glassBorder:"rgba(232, 166, 74, 0.12)",
  text:       "#F5EBD4",
  textSub:    "#C9B08A",
  textFaint:  "#8B7355",
  divider:    "rgba(232, 166, 74, 0.14)",
  dividerSoft:"rgba(232, 166, 74, 0.07)",
  accent:     "#E8A64A",
  accentSoft: "rgba(232, 166, 74, 0.2)",
  accentDim:  "rgba(232, 166, 74, 0.08)",
  success:    "#8FB85A",
  danger:     "#D96B4A",
  scrollThumb: "rgba(232, 166, 74, 0.25)",
  shadowSm:   "0 1px 2px rgba(0, 0, 0, 0.4)",
  shadowMd:   "0 4px 12px rgba(0, 0, 0, 0.5)",
  shadowLg:   "0 8px 32px rgba(0, 0, 0, 0.6)",
  decorGlow:  "rgba(232, 166, 74, 0.12)",
};

const DISPLAY = "'Fraunces', Georgia, serif";
const BODY    = "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', sans-serif";
const FARSI   = "'Vazirmatn', sans-serif";

// ─── EMOJI-STYLE ICON SYSTEM ───────────────────────────────────────────────
const Icon = ({ name, size = 20, color = "currentColor", style = {} }) => {
  const s = { width: size, height: size, display: "inline-block", flexShrink: 0, ...style };
  const fill = "currentColor";
  const paths = {
    home: (<><path d="M3 11.5L12 3l9 8.5V20a1 1 0 01-1 1h-5v-6a1 1 0 00-1-1h-2a1 1 0 00-1 1v6H5a1 1 0 01-1-1v-8.5z" fill={fill}/><rect x="15" y="9" width="2.5" height="2.5" rx="0.5" fill={fill} opacity="0.35"/></>),
    scale: (<><rect x="11" y="3" width="2" height="16" rx="1" fill={fill}/><rect x="7" y="19" width="10" height="2" rx="1" fill={fill}/><rect x="4" y="5" width="16" height="2" rx="1" fill={fill}/><path d="M4 7l-2 6a4 4 0 008 0l-2-6H4z" fill={fill}/><path d="M14 7l-2 6a4 4 0 008 0l-2-6h-4z" fill={fill}/></>),
    book: (<><path d="M3 5c0-1 .8-2 2-2h4c1.7 0 3 1 3 2v14c0-.8-1-1.5-2.5-1.5H5c-1.1 0-2-.5-2-1.5V5z" fill={fill}/><path d="M21 5c0-1-.8-2-2-2h-4c-1.7 0-3 1-3 2v14c0-.8 1-1.5 2.5-1.5H19c1.1 0 2-.5 2-1.5V5z" fill={fill} opacity="0.75"/><line x1="12" y1="5" x2="12" y2="19" stroke={fill} strokeWidth="0.5" opacity="0.4"/></>),
    compass: (<><circle cx="12" cy="12" r="10" fill={fill}/><circle cx="12" cy="12" r="7.5" fill={fill} opacity="0.25"/><path d="M12 5l2.5 7-7 2.5 7 2.5L12 24" fill={fill} opacity="0.9"/><circle cx="12" cy="12" r="1.8" fill={fill}/></>),
    wrench: (<path d="M14.7 3.3a5 5 0 00-6.4 6.4L3 15l3 3 5.3-5.3a5 5 0 006.4-6.4l-3 3-2.8-2.8 3-3z" fill={fill}/>),
    bread: (<><path d="M3 14c0-4 4-7 9-7s9 3 9 7v2a2 2 0 01-2 2H5a2 2 0 01-2-2v-2z" fill={fill}/><path d="M7 10c1-1 2-1 3 0M11 9.5c1-1 2-1 3 0M15 10c1-1 2-1 3 0" stroke={fill} strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.4"/></>),
    pizza: (<><path d="M12 2L3 21h18L12 2z" fill={fill}/><circle cx="10" cy="12" r="1.4" fill={fill} opacity="0.35"/><circle cx="14" cy="14" r="1.4" fill={fill} opacity="0.35"/><circle cx="11" cy="17" r="1.4" fill={fill} opacity="0.35"/></>),
    flask: (<><path d="M8 3h8v5l4 9a2 2 0 01-2 3H6a2 2 0 01-2-3l4-9V3z" fill={fill}/><rect x="7" y="14" width="10" height="1.5" fill={fill} opacity="0.3"/><circle cx="10" cy="17" r="0.8" fill={fill} opacity="0.5"/><circle cx="13" cy="16" r="0.6" fill={fill} opacity="0.5"/></>),
    wheat: (<><path d="M12 3v18" stroke={fill} strokeWidth="2" strokeLinecap="round"/><ellipse cx="9" cy="6" rx="2.5" ry="1.5" fill={fill} transform="rotate(-30 9 6)"/><ellipse cx="15" cy="8" rx="2.5" ry="1.5" fill={fill} transform="rotate(30 15 8)"/><ellipse cx="9" cy="11" rx="2.5" ry="1.5" fill={fill} transform="rotate(-30 9 11)"/><ellipse cx="15" cy="13" rx="2.5" ry="1.5" fill={fill} transform="rotate(30 15 13)"/><ellipse cx="12" cy="4" rx="1.5" ry="2.5" fill={fill}/></>),
    droplet: (<path d="M12 2c-4 5-7 9-7 13a7 7 0 0014 0c0-4-3-8-7-13z" fill={fill}/>),
    salt: (<><path d="M8 3h8l1 4H7l1-4z" fill={fill}/><path d="M6 7h12l-1 14H7L6 7z" fill={fill}/><circle cx="10" cy="12" r="0.6" fill={fill} opacity="0.35"/><circle cx="14" cy="12" r="0.6" fill={fill} opacity="0.35"/><circle cx="12" cy="15" r="0.6" fill={fill} opacity="0.35"/></>),
    timer: (<><circle cx="12" cy="13" r="8" fill={fill}/><rect x="11" y="2" width="2" height="3" fill={fill}/><path d="M12 9v4l3 2" stroke={fill} strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.4"/></>),
    sparkles: (<><path d="M12 2l2 5 5 2-5 2-2 5-2-5-5-2 5-2 2-5z" fill={fill}/><path d="M19 13l1 2.5 2.5 1-2.5 1-1 2.5-1-2.5-2.5-1 2.5-1 1-2.5z" fill={fill} opacity="0.7"/></>),
    sun: (<><circle cx="12" cy="12" r="4.5" fill={fill}/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M5 19l2-2M17 7l2-2" stroke={fill} strokeWidth="2" strokeLinecap="round"/></>),
    moon: (<path d="M21 12.8A9 9 0 1111.2 3 7 7 0 0021 12.8z" fill={fill}/>),
    globe: (<><circle cx="12" cy="12" r="9" fill={fill}/><path d="M3 12h18M12 3a14 14 0 010 18M12 3a14 14 0 000 18" stroke={fill} strokeWidth="1.5" fill="none" opacity="0.35"/></>),
    flame: (<path d="M12 2c1 4 5 6 5 11a7 7 0 11-14 0c0-2 1-3 2-4 0 2 1 3 2 3 0-4 3-6 5-10z" fill={fill}/>),
    check: (<path d="M20 6L9 17l-5-5" stroke={fill} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none"/>),
    x: (<path d="M18 6L6 18M6 6l12 12" stroke={fill} strokeWidth="3" strokeLinecap="round" fill="none"/>),
    plus: (<path d="M12 5v14M5 12h14" stroke={fill} strokeWidth="3" strokeLinecap="round" fill="none"/>),
    minus: (<path d="M5 12h14" stroke={fill} strokeWidth="3" strokeLinecap="round" fill="none"/>),
    chevronRight: (<path d="M9 18l6-6-6-6" stroke={fill} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none"/>),
    copy: (<><rect x="8" y="8" width="13" height="13" rx="2" fill={fill}/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" stroke={fill} strokeWidth="1.5" fill="none" opacity="0.5"/></>),
    oven: (<><rect x="3" y="4" width="18" height="17" rx="2" fill={fill}/><rect x="6" y="10" width="12" height="8" rx="1" fill={fill} opacity="0.3"/><circle cx="7" cy="7" r="0.9" fill={fill} opacity="0.5"/><circle cx="10" cy="7" r="0.9" fill={fill} opacity="0.5"/><circle cx="13" cy="7" r="0.9" fill={fill} opacity="0.5"/></>),
    woodfire: (<><path d="M6 21h12l-2-8H8l-2 8z" fill={fill}/><path d="M12 2c1 3 4 4 4 8a4 4 0 11-8 0c0-1.5.5-2.5 1.5-3 0 1.5.5 2 1.5 2 0-2.5 1-4 2-7z" fill={fill}/></>),
    cheese: (<><path d="M2 19l10-14 10 14H2z" fill={fill}/><circle cx="8" cy="15" r="1.2" fill={fill} opacity="0.3"/><circle cx="15" cy="16" r="1" fill={fill} opacity="0.3"/></>),
    tomato: (<><circle cx="12" cy="14" r="8" fill={fill}/><path d="M10 6c-1 0-2 1-2 2M14 6c1 0 2 1 2 2" stroke={fill} strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.4"/><path d="M12 6V4" stroke={fill} strokeWidth="1.5" strokeLinecap="round"/></>),
    olive: (<><path d="M9 3h6v3h-6z" fill={fill}/><path d="M8 6h8l1 15H7L8 6z" fill={fill}/><rect x="9" y="12" width="6" height="4" fill={fill} opacity="0.3"/></>),
    leaf: (<path d="M11 21A8 8 0 014 14c0-6 4-10 11-10 2 0 3 1 3 3 0 7-4 14-7 14z" fill={fill}/>),
    flatbread: (<><ellipse cx="12" cy="12" rx="10" ry="5" fill={fill}/><circle cx="8" cy="11" r="0.7" fill={fill} opacity="0.35"/><circle cx="12" cy="10" r="0.7" fill={fill} opacity="0.35"/><circle cx="16" cy="12" r="0.7" fill={fill} opacity="0.35"/><circle cx="10" cy="13" r="0.7" fill={fill} opacity="0.35"/></>),
    loaf: (<><path d="M5 8c0-2 2-4 7-4s7 2 7 4v11a2 2 0 01-2 2H7a2 2 0 01-2-2V8z" fill={fill}/><path d="M8 10c1-1 2-1 3 0M12 9c1-1 2-1 3 0" stroke={fill} strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.4"/></>),
    baguette: (<><path d="M3 19l14-14a2.5 2.5 0 013.5 3.5l-14 14a2.5 2.5 0 01-3.5-3.5z" fill={fill}/><path d="M8 14l3-3M11 11l3-3M14 8l3-3" stroke={fill} strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.35"/></>),
    pretzel: (<path d="M12 3a6 6 0 016 6c0 2-1 3.5-2.5 4.5L17 15c2 1.5 3 3.5 3 5a4 4 0 01-8 0 4 4 0 01-8 0c0-1.5 1-3.5 3-5l1.5-1.5C7 12.5 6 11 6 9a6 6 0 016-6zm0 3a3 3 0 00-3 3c0 1 .5 2 1.5 2.5l3-3 3 3c1-.5 1.5-1.5 1.5-2.5a3 3 0 00-3-3z" fill={fill}/>),
    bagel: (<><circle cx="12" cy="12" r="9" fill={fill}/><circle cx="12" cy="12" r="3.5" fill={fill} opacity="0.25"/><circle cx="8" cy="8" r="0.6" fill={fill} opacity="0.45"/><circle cx="16" cy="9" r="0.6" fill={fill} opacity="0.45"/><circle cx="14" cy="16" r="0.6" fill={fill} opacity="0.45"/><circle cx="9" cy="15" r="0.6" fill={fill} opacity="0.45"/></>),
    bun: (<><circle cx="12" cy="13" r="9" fill={fill}/><path d="M6 11c3-2 9-2 12 0M7 15c3 2 7 2 10 0" stroke={fill} strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.35"/></>),
    focaccia: (<><rect x="3" y="7" width="18" height="10" rx="2" fill={fill}/><circle cx="7" cy="10" r="0.8" fill={fill} opacity="0.35"/><circle cx="11" cy="11" r="0.8" fill={fill} opacity="0.35"/><circle cx="15" cy="10" r="0.8" fill={fill} opacity="0.35"/><circle cx="9" cy="14" r="0.8" fill={fill} opacity="0.35"/><circle cx="13" cy="14" r="0.8" fill={fill} opacity="0.35"/><circle cx="17" cy="14" r="0.8" fill={fill} opacity="0.35"/></>),
    ciabatta: (<><ellipse cx="12" cy="13" rx="10" ry="5" fill={fill}/><ellipse cx="12" cy="12" rx="7" ry="2.5" fill={fill} opacity="0.3"/></>),
    rye: (<><circle cx="12" cy="13" r="9" fill={fill}/><path d="M7 10l10 6M17 10L7 16" stroke={fill} strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.35"/></>),
    artisan: (<><path d="M3 14c0-5 4-9 9-9s9 4 9 9v2a2 2 0 01-2 2H5a2 2 0 01-2-2v-2z" fill={fill}/><path d="M6 10c3-3 9-3 12 0" stroke={fill} strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.35"/><path d="M8 8c2 2 6 2 8 0" stroke={fill} strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.35"/></>),
    alert: (<><circle cx="12" cy="12" r="10" fill={fill}/><rect x="11" y="7" width="2" height="6" rx="1" fill={fill} opacity="0.35"/><circle cx="12" cy="16" r="1.2" fill={fill} opacity="0.35"/></>),
    flat: (<><path d="M4 18L20 6" stroke={fill} strokeWidth="2" strokeLinecap="round" fill="none"/><path d="M4 10l6 2 4-4 6 2" stroke={fill} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/></>),
    brick: (<><rect x="3" y="8" width="18" height="10" rx="1" fill={fill}/><path d="M3 13h18M9 8v5M15 13v5" stroke={fill} strokeWidth="1.5" fill="none" opacity="0.35"/></>),
    sticky: (<><circle cx="12" cy="12" r="9" fill={fill}/><path d="M8 14s1.5 2 4 2 4-2 4-2" stroke={fill} strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.4"/><circle cx="9" cy="10" r="0.8" fill={fill} opacity="0.45"/><circle cx="15" cy="10" r="0.8" fill={fill} opacity="0.45"/></>),
    hole: (<><circle cx="12" cy="12" r="9" fill={fill}/><circle cx="12" cy="12" r="3" fill={fill} opacity="0.3"/></>),
    sleepy: (<><circle cx="12" cy="12" r="9" fill={fill}/><path d="M8 10h2M14 10h2M9 15c1 1 4 1 6 0" stroke={fill} strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.45"/></>),
    silent: (<><circle cx="12" cy="12" r="9" fill={fill}/><path d="M8 14h8M9 9h.01M15 9h.01" stroke={fill} strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.45"/></>),
    menu: (<><path d="M3 6h18M3 12h18M3 18h18" stroke={fill} strokeWidth="2" strokeLinecap="round"/></>),
  };
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} style={s} fill="none" color={color} aria-hidden="true">
      {paths[name] || null}
    </svg>
  );
};

// ─── FARSI NUMERALS ────────────────────────────────────────────────────────
const FA_DIGITS = ["۰","۱","۲","۳","۴","۵","۶","۷","۸","۹"];
function toFaNum(str) { return String(str).replace(/[0-9]/g, d => FA_DIGITS[+d]); }

// ─── TRANSLATIONS ──────────────────────────────────────────────────────────
const T = {
  en: {
    appName:"Levain", appTagline:"Sourdough Companion",
    taglineSub:"Your complete sourdough companion — from starter to scoring.",
    toolsSections:"Tools",
    doughCalc:"Dough Calculator", doughCalcSub:"Baker's math",
    pizzaCalc:"Pizza Calculator", pizzaCalcSub:"Neapolitan to wood-fired",
    recipes:"Recipes", recipesSub:"Eleven breads, three families",
    guide:"Process Guide", guideSub:"Six steps to mastery",
    trouble:"Troubleshoot", troubleSub:"Diagnose any problem",
    starter:"Starter Planner", starterSub:"Feeding ratios",
    diffOverview:"Difficulty", bakerPrinciple:"Baker's Principle",
    home:"Home", calculator:"Calculator", fix:"Fix",
    breadCalc:"Bread Calculator",
    byFlour:"By Flour", byTotal:"By Total Weight",
    flourPerLoaf:"Flour per loaf", totalDoughWeight:"Total dough weight",
    leavening:"Leavening",
    sourdoughOpt:"Sourdough", sourdoughSub:"Wild fermentation",
    yeastOpt:"Yeast", yeastSub:"Predictable rise",
    yeastType:"Yeast Type",
    freshYeast:"Fresh", dryYeast:"Dry",
    hydration:"Hydration", starterLabel:"Starter", yeastLabel:"Yeast",
    salt:"Salt", wholeGrain:"Whole Grain", ofTotalFlour:"of total flour",
    yourFormula:"Your Formula",
    total:"Total", flour:"Flour", water:"Water",
    breadFlour:"Bread flour", wgFlour:"Whole grain",
    hydGuide:"Hydration Guide",
    pizzaCalcTitle:"Pizza Calculator",
    doughType:"Dough Type",
    yeastPizza:"Yeast", yeastPizzaSub:"Beginner-friendly",
    sourdoughPizza:"Sourdough", sourdoughPizzaSub:"Complex flavor",
    yourOven:"Your Oven", pizzas:"Pizzas", pizzaDoughWeight:"Pizza Dough Weight",
    toppingsBtn:"Margherita Toppings",
    freshYeastLabel:"Fresh yeast", orDryYeast:"or dry yeast",
    activeStarter:"Active starter", totalDough:"Total dough",
    homeFor:"250–290g for home", proFor:"260–350g for pro",
    soloMode:"Solo", dateNight:"Date night",
    pizzaParty:"Pizza party", bigGathering:"Big gathering",
    fullBakery:"Full bakery mode",
    starterTitle:"Starter Planner", starterSub2:"Calculate your feeding",
    howMuchStarter:"How much active starter do you need?",
    feedingRatio:"Feeding Ratio",
    seedStarter:"Seed (existing)",
    freshFlour:"Fresh flour", freshWater:"Fresh water",
    readyStarter:"Ready starter",
    feedingFormula:"Feeding Formula", ratioRef:"Ratio Reference",
    recipesTitle:"Recipes", recipesSub2:"Three families of bread",
    allRecipes:"All Recipes", loaves:"Loaves",
    ingredients:"Ingredients", steps:"Method", proTips:"Pro Tips",
    lowHydration:"Low Hydration", mediumHydration:"Medium Hydration", highHydration:"High Hydration",
    guideTitle:"Process Guide", guideSub2:"Master every step",
    checks:"Checklist", timerLabel:"Timers",
    troubleTitle:"Troubleshoot", troubleSub2:"Diagnose and fix",
    likelyCauses:"Likely Causes", howToFix:"How to Fix",
    quickGlossary:"Glossary",
    bakersPercent:"Baker's Percentages",
    bakersMathBody:"Flour is always 100%. Every other ingredient is expressed as a percentage of the flour's weight.",
    copyList:"Copy List", copiedLabel:"Copied",
    timerStart:"Start", timerPause:"Pause", timerDone:"Done",
    footer:"Made by S.B and Claude",
    activeDry:"Dry",
    ratio111:"Daily maintenance — mild, 6–8 hr peak",
    ratio122:"Standard feeding — balanced, 8–12 hr peak",
    ratio133:"Moderate — milder, 10–14 hr peak",
    ratio155:"Slower rise — complex flavor, 12–16 hr peak",
    ratio1010:"Very slow — plan ahead, 16–24 hr peak",
    starterRatioTip:"A stiff starter (50–60% hydration) enhances yeast activity. Use half the water shown.",
    back:"Back",
    recipesCount:"recipes",
  },
  fa: {
    appName:"لِوان", appTagline:"همراه خمیرمایه",
    taglineSub:"راهنمای کامل خمیرمایه شما — از استارتر تا برش.",
    toolsSections:"ابزارها",
    doughCalc:"ماشین‌حساب خمیر", doughCalcSub:"ریاضیات نانوایی",
    pizzaCalc:"ماشین‌حساب پیتزا", pizzaCalcSub:"ناپلی، نیویورک، تنور هیزمی",
    recipes:"دستورها", recipesSub:"یازده نان، سه خانواده",
    guide:"راهنمای مراحل", guideSub:"شش مرحله تسلط",
    trouble:"رفع مشکل", troubleSub:"تشخیص هر مشکل",
    starter:"برنامه‌ریز استارتر", starterSub:"نسبت تغذیه",
    diffOverview:"دشواری", bakerPrinciple:"اصل نانوایی",
    home:"خانه", calculator:"ماشین‌حساب", fix:"رفع اشکال",
    breadCalc:"ماشین‌حساب نان",
    byFlour:"بر اساس آرد", byTotal:"بر اساس وزن کل",
    flourPerLoaf:"آرد هر قرص", totalDoughWeight:"وزن کل خمیر",
    leavening:"خمیرمایه",
    sourdoughOpt:"خمیر ترش", sourdoughSub:"تخمیر طبیعی",
    yeastOpt:"مخمر", yeastSub:"قابل پیش‌بینی",
    yeastType:"نوع مخمر",
    freshYeast:"تازه", dryYeast:"خشک",
    hydration:"آبیاری", starterLabel:"استارتر", yeastLabel:"مخمر",
    salt:"نمک", wholeGrain:"غلات کامل", ofTotalFlour:"درصد از کل آرد",
    yourFormula:"فرمول شما",
    total:"مجموع", flour:"آرد", water:"آب",
    breadFlour:"آرد نان", wgFlour:"غلات کامل",
    hydGuide:"راهنمای آبیاری",
    pizzaCalcTitle:"ماشین‌حساب پیتزا",
    doughType:"نوع خمیر",
    yeastPizza:"مخمر", yeastPizzaSub:"مناسب مبتدی",
    sourdoughPizza:"خمیر ترش", sourdoughPizzaSub:"طعم پیچیده",
    yourOven:"فر شما", pizzas:"تعداد پیتزا", pizzaDoughWeight:"وزن خمیر پیتزا",
    toppingsBtn:"مواد مارگاریتا",
    freshYeastLabel:"مخمر تازه", orDryYeast:"یا مخمر خشک",
    activeStarter:"استارتر فعال", totalDough:"کل خمیر",
    homeFor:"۲۵۰–۲۹۰ گرم خانگی", proFor:"۲۶۰–۳۵۰ گرم حرفه‌ای",
    soloMode:"تنها", dateNight:"شب دو نفره",
    pizzaParty:"پارتی پیتزا", bigGathering:"جمع بزرگ",
    fullBakery:"حالت نانوایی",
    starterTitle:"برنامه‌ریز استارتر", starterSub2:"تغذیه بعدی لوون",
    howMuchStarter:"چه مقدار استارتر نیاز دارید؟",
    feedingRatio:"نسبت تغذیه",
    seedStarter:"استارتر موجود",
    freshFlour:"آرد تازه", freshWater:"آب تازه",
    readyStarter:"استارتر آماده",
    feedingFormula:"فرمول تغذیه", ratioRef:"مرجع نسبت‌ها",
    recipesTitle:"دستورها", recipesSub2:"سه خانواده نان",
    allRecipes:"همه دستورها", loaves:"تعداد قرص",
    ingredients:"مواد", steps:"مراحل", proTips:"نکات حرفه‌ای",
    lowHydration:"آبیاری کم", mediumHydration:"آبیاری متوسط", highHydration:"آبیاری زیاد",
    guideTitle:"راهنمای مراحل", guideSub2:"هر مرحله را تسلط بیاب",
    checks:"فهرست کنترل", timerLabel:"تایمرها",
    troubleTitle:"رفع مشکل", troubleSub2:"تشخیص و رفع مشکل",
    likelyCauses:"دلایل احتمالی", howToFix:"چگونه رفع کنیم",
    quickGlossary:"واژه‌نامه",
    bakersPercent:"درصدهای نانوایی",
    bakersMathBody:"آرد همیشه ۱۰۰٪ است. هر ماده دیگر به عنوان درصدی از وزن آرد بیان می‌شود.",
    copyList:"کپی", copiedLabel:"کپی شد",
    timerStart:"شروع", timerPause:"مکث", timerDone:"تمام",
    footer:"ساخته شده توسط S.B و Claude",
    activeDry:"خشک",
    ratio111:"نگهداری روزانه — ملایم، اوج ۶–۸ ساعت",
    ratio122:"تغذیه استاندارد — متعادل، اوج ۸–۱۲ ساعت",
    ratio133:"متوسط — کمی ملایم‌تر، اوج ۱۰–۱۴ ساعت",
    ratio155:"بالا آمدن کند — طعم پیچیده، اوج ۱۲–۱۶ ساعت",
    ratio1010:"خیلی کند — از قبل برنامه‌ریزی، اوج ۱۶–۲۴ ساعت",
    starterRatioTip:"استارتر سفت (۵۰–۶۰٪ آبیاری) فعالیت مخمر را تقویت می‌کند. نصف آب نشان داده شده را استفاده کنید.",
    back:"بازگشت",
    recipesCount:"دستور",
  },
};

// ─── DATA ──────────────────────────────────────────────────────────────────
const HYDRATION_LEVELS = [
  { range:[55,62],  label:"Beginner",     labelFa:"مبتدی",    desc:"Easy to handle. Dense, chewy crumb.",         descFa:"آسان. بافت متراکم." },
  { range:[63,68],  label:"Intermediate", labelFa:"متوسط",    desc:"Good balance. Nice open crumb.",              descFa:"تعادل خوب. بافت باز." },
  { range:[69,76],  label:"Advanced",     labelFa:"پیشرفته",  desc:"Sticky. Big holes. Rewarding.",              descFa:"چسبنده. حفره‌های بزرگ." },
  { range:[77,88],  label:"Expert",       labelFa:"متخصص",    desc:"Use oiled hands. Very open crumb.",           descFa:"از دستان روغنی استفاده کنید." },
  { range:[89,110], label:"Master",       labelFa:"استاد",    desc:"Nearly batter. Loaf pan only.",               descFa:"نزدیک به خمیر رقیق." },
];

const WEIGHT_FUN = [
  [180,  "About a large coffee",   "هم‌وزن قهوه بزرگ"    ],
  [380,  "About a smartphone",     "هم‌وزن گوشی"         ],
  [550,  "About a can of soup",    "هم‌وزن قوطی سوپ"    ],
  [750,  "About a broccoli",       "هم‌وزن بروکلی"      ],
  [950,  "About a pineapple",      "هم‌وزن آناناس"      ],
  [1300, "About a coconut",        "هم‌وزن نارگیل"      ],
  [1700, "About a brick",          "هم‌وزن آجر"         ],
  [2800, "A serious bake",         "پختی جدی"            ],
  [99999,"Baking for an army",     "پخت برای ارتش"       ],
];

const FEED_RATIOS = [
  { label:"1:1:1",   seed:1, flour:1,  water:1  },
  { label:"1:2:2",   seed:1, flour:2,  water:2  },
  { label:"1:3:3",   seed:1, flour:3,  water:3  },
  { label:"1:5:5",   seed:1, flour:5,  water:5  },
  { label:"1:10:10", seed:1, flour:10, water:10 },
];
const FEED_RATIO_DESCS = ["ratio111","ratio122","ratio133","ratio155","ratio1010"];

const PIZZA_OVENS = [
  { id:"home",  nameEn:"Home Oven",  nameFa:"فر خانگی",   icon:"oven",     temp:"250°C",
    tip:"Crank heat to max. Use a pizza stone or steel on the top rack. Bake 8–12 min, rotating halfway.",
    tipFa:"حرارت را به حداکثر برسانید. از سنگ یا صفحه فولادی استفاده کنید. ۸–۱۲ دقیقه بپزید." },
  { id:"pizza", nameEn:"Pizza Oven", nameFa:"فر پیتزا",   icon:"flame",    temp:"400°C",
    tip:"Preheat 30+ minutes. Cook 90 seconds, turning every 20 seconds for even char.",
    tipFa:"بیش از ۳۰ دقیقه گرم کنید. ۹۰ ثانیه بپزید، هر ۲۰ ثانیه بچرخانید." },
  { id:"wood",  nameEn:"Wood-Fired", nameFa:"تنور هیزمی",  icon:"woodfire", temp:"480°C",
    tip:"60–90 seconds total. Look for leopard spotting on the crust — the sign of a great pie.",
    tipFa:"۶۰–۹۰ ثانیه. به لکه‌های پلنگی روی پوسته توجه کنید." },
];

const RECIPES = [
  {
    id:"bagels", icon:"bagel", family:"low",
    name:"Classic Bagels",            nameFa:"بیگل کلاسیک",
    sub:"Chewy, malty, boiled",       subFa:"جونده، مالتی، آب‌پز",
    difficulty:3, diffLabel:"Medium",  diffLabelFa:"متوسط",
    totalTime:"12–24 hrs",            totalTimeFa:"۱۲–۲۴ ساعت",
    hydration:57,
    ingredients:[
      { amount:500, unit:"g", icon:"wheat", name:"Bread flour",        nameFa:"آرد نان" },
      { amount:285, unit:"g", icon:"droplet", name:"Water, lukewarm",  nameFa:"آب ولرم" },
      { amount:10,  unit:"g", icon:"salt",  name:"Fine salt",          nameFa:"نمک ریز" },
      { amount:20,  unit:"g", icon:"sparkles", name:"Malt syrup or honey", nameFa:"شیره مالت یا عسل" },
      { amount:100, unit:"g", icon:"flask", name:"Active starter (or 5g instant yeast)", nameFa:"استارتر فعال (یا ۵ گرم مخمر)" },
    ],
    steps:[
      ["Mix & knead", "Combine all ingredients. Knead 10 minutes until very smooth and stiff. Bagel dough is dry by design.",
       "مخلوط و ورز", "همه را ترکیب کنید. ۱۰ دقیقه ورز دهید تا صاف و سفت شود."],
      ["Bulk rise", "Cover and rest 1 hour at room temperature, or refrigerate overnight for more flavor.",
       "تخمیر حجمی", "۱ ساعت بپوشانید یا شب در یخچال بگذارید."],
      ["Divide & shape", "Divide into 8 equal pieces. Roll each into a tight ball, poke a hole with your finger, stretch into a ring.",
       "تقسیم و شکل", "به ۸ قسمت تقسیم کنید. هر کدام را گرد کنید و حفره ایجاد کنید."],
      ["Cold proof", "Place on floured tray, cover, refrigerate 8–16 hours for best flavor and chew.",
       "تخمیر سرد", "روی سینی آردپاشی بگذارید، ۸–۱۶ ساعت در یخچال."],
      ["Boil", "Bring a large pot of water with 1 tbsp malt syrup to a boil. Boil each bagel 30 sec per side.",
       "آب‌پز", "در آب جوش با شیره مالت، هر بیگل ۳۰ ثانیه از هر طرف."],
      ["Bake", "Bake at 220°C (430°F) for 20–22 minutes until deep golden brown.",
       "پخت", "در ۲۲۰ درجه ۲۰–۲۲ دقیقه تا طلایی تیره."],
    ],
    tips:[
      "Stiff dough = chewy bagel. Don't add extra water.",
      "Boiling creates the signature shiny crust.",
      "Cold proof overnight for the best flavor depth.",
      "Top with sesame, poppy, or 'everything' seasoning before baking.",
    ],
    tipsFa:[
      "خمیر سفت = بیگل جونده. آب اضافه نکنید.",
      "آب‌پز کردن پوسته براق ایجاد می‌کند.",
      "تخمیر شبانه سرد برای طعم بهتر.",
      "قبل از پخت با کنجد یا خشخاش تزیین کنید.",
    ],
  },
  {
    id:"pretzels", icon:"pretzel", family:"low",
    name:"Soft Pretzels",             nameFa:"پرتزل نرم",
    sub:"Chewy, malty, lye-dipped",   subFa:"جونده، مالتی، قلیایی",
    difficulty:3, diffLabel:"Medium",  diffLabelFa:"متوسط",
    totalTime:"3–4 hrs",              totalTimeFa:"۳–۴ ساعت",
    hydration:52,
    ingredients:[
      { amount:500, unit:"g", icon:"wheat", name:"Bread flour",          nameFa:"آرد نان" },
      { amount:260, unit:"g", icon:"droplet", name:"Warm water",         nameFa:"آب گرم" },
      { amount:10,  unit:"g", icon:"salt",  name:"Fine salt",            nameFa:"نمک ریز" },
      { amount:10,  unit:"g", icon:"sparkles", name:"Brown sugar",       nameFa:"شکر قهوه‌ای" },
      { amount:20,  unit:"g", icon:"olive", name:"Melted butter",        nameFa:"کره ذوب شده" },
      { amount:7,   unit:"g", icon:"sparkles", name:"Instant yeast (or 80g starter)", nameFa:"مخمر فوری (یا ۸۰ گرم استارتر)" },
      { amount:60,  unit:"g", icon:"salt",  name:"Baking soda (for bath)", nameFa:"جوش شیرین (برای حمام)" },
    ],
    steps:[
      ["Mix & knead", "Combine flour, water, sugar, salt, butter, yeast. Knead 8 minutes until smooth and elastic.", "مخلوط و ورز", "همه را ترکیب و ۸ دقیقه ورز دهید."],
      ["Bulk rise", "Cover and rest 1 hour until doubled in size.", "تخمیر حجمی", "۱ ساعت بپوشانید تا دو برابر شود."],
      ["Shape", "Divide into 8 pieces. Roll each into a 50cm rope, form classic pretzel shape with twisted loop.", "شکل‌دهی", "به ۸ قسمت تقسیم و به شکل پرتزل بپیچید."],
      ["Baking soda bath", "Bring 1L water + 60g baking soda to a simmer. Dip each pretzel 30 seconds.", "حمام قلیایی", "۱ لیتر آب + ۶۰ گرم جوش شیرین. هر پرتزل ۳۰ ثانیه."],
      ["Salt & bake", "Place on tray, sprinkle coarse salt. Bake at 230°C (450°F) for 12–14 minutes.", "نمک و پخت", "نمک بپاشید. در ۲۳۰ درجه ۱۲–۱۴ دقیقه بپزید."],
    ],
    tips:[
      "The baking soda bath creates the signature dark crust — don't skip it.",
      "For authentic lye pretzels, use food-grade lye (wear gloves).",
      "Eat same day — they stale quickly.",
      "Mustard and beer are the traditional accompaniments.",
    ],
    tipsFa:[
      "حمام جوش شیرین پوسته تیره را ایجاد می‌کند.",
      "برای پرتزل اصیل از محلول قلیایی استفاده کنید.",
      "همان روز مصرف کنید.",
      "با خردل و آبجو سرو کنید.",
    ],
  },
  {
    id:"buns", icon:"bun", family:"low",
    name:"Soft Dinner Buns",          nameFa:"نان گرد نرم",
    sub:"Pillowy, enriched, tender",  subFa:"نرم، غنی، لطیف",
    difficulty:2, diffLabel:"Easy",    diffLabelFa:"آسان",
    totalTime:"3–4 hrs",              totalTimeFa:"۳–۴ ساعت",
    hydration:60,
    ingredients:[
      { amount:500, unit:"g", icon:"wheat", name:"All-purpose flour",   nameFa:"آرد همه‌منظوره" },
      { amount:240, unit:"g", icon:"droplet", name:"Whole milk, warm",  nameFa:"شیر گرم" },
      { amount:1,   unit:"",  icon:"sparkles", name:"Egg",              nameFa:"تخم‌مرغ" },
      { amount:50,  unit:"g", icon:"sparkles", name:"Sugar",            nameFa:"شکر" },
      { amount:10,  unit:"g", icon:"salt",  name:"Fine salt",           nameFa:"نمک ریز" },
      { amount:60,  unit:"g", icon:"olive", name:"Softened butter",     nameFa:"کره نرم شده" },
      { amount:7,   unit:"g", icon:"sparkles", name:"Instant yeast",    nameFa:"مخمر فوری" },
    ],
    steps:[
      ["Mix", "Combine flour, milk, egg, sugar, salt, yeast. Mix until shaggy dough forms.", "مخلوط", "همه را ترکیب کنید."],
      ["Knead in butter", "Knead 5 minutes, then add softened butter a piece at a time. Knead 5 more minutes.", "کره را اضافه کنید", "۵ دقیقه ورز دهید، سپس کره را اضافه کنید."],
      ["Bulk rise", "Cover and rise 1–1.5 hours until doubled.", "تخمیر حجمی", "۱–۱٫۵ ساعت تا دو برابر شود."],
      ["Divide & shape", "Divide into 12 pieces. Roll each into tight balls. Place on baking tray.", "تقسیم و شکل", "به ۱۲ قسمت تقسیم و گرد کنید."],
      ["Proof", "Cover and proof 45 minutes until puffy.", "تخمیر", "۴۵ دقیقه بپوشانید."],
      ["Egg wash & bake", "Brush with egg wash. Bake at 190°C (375°F) for 15–18 minutes until golden.", "تخم‌مرغ و پخت", "تخم‌مرغ بمالید. در ۱۹۰ درجه ۱۵–۱۸ دقیقه."],
    ],
    tips:[
      "Warm milk (not hot) activates yeast without killing it.",
      "Add butter gradually — adding it all at once makes greasy dough.",
      "Brush with melted butter right out of oven for extra softness.",
      "Great for burgers, sandwiches, or pulled pork.",
    ],
    tipsFa:[
      "شیر گرم (نه داغ) مخمر را فعال می‌کند.",
      "کره را کم‌کم اضافه کنید.",
      "بلافاصله بعد از پخت کره بمالید.",
      "برای برگر و ساندویچ عالی است.",
    ],
  },
  {
    id:"sandwich", icon:"loaf", family:"medium",
    name:"Sandwich Loaf",             nameFa:"نان ساندویچی",
    sub:"Soft, sliceable, everyday",  subFa:"نرم، قابل برش، روزمره",
    difficulty:2, diffLabel:"Easy",    diffLabelFa:"آسان",
    totalTime:"6–8 hrs",              totalTimeFa:"۶–۸ ساعت",
    hydration:68,
    ingredients:[
      { amount:500, unit:"g", icon:"wheat", name:"Bread flour",         nameFa:"آرد نان" },
      { amount:340, unit:"g", icon:"droplet", name:"Water",             nameFa:"آب" },
      { amount:10,  unit:"g", icon:"salt",  name:"Fine salt",           nameFa:"نمک ریز" },
      { amount:15,  unit:"g", icon:"sparkles", name:"Honey or sugar",   nameFa:"عسل یا شکر" },
      { amount:100, unit:"g", icon:"flask", name:"Active starter (or 4g yeast)", nameFa:"استارتر فعال (یا ۴ گرم مخمر)" },
    ],
    steps:[
      ["Mix", "Combine all ingredients until no dry flour remains. Rest 30 minutes (autolyse).", "مخلوط", "ترکیب کنید. ۳۰ دقیقه استراحت."],
      ["Knead", "Knead 5–7 minutes until smooth and elastic.", "ورز", "۵–۷ دقیقه ورز دهید."],
      ["Bulk ferment", "Cover and ferment 4–6 hours at room temperature until 50% larger.", "تخمیر حجمی", "۴–۶ ساعت تا ۵۰٪ بزرگ‌تر شود."],
      ["Shape", "Roll into rectangle, roll up tightly, place seam-down in greased loaf pan.", "شکل", "به مستطیل پهن کنید و در قالب بگذارید."],
      ["Proof", "Cover and proof 1.5–2 hours until cresting the pan.", "تخمیر", "۱٫۵–۲ ساعت."],
      ["Bake", "Bake at 200°C (390°F) for 35–40 minutes. Internal temp should reach 92°C.", "پخت", "در ۲۰۰ درجه ۳۵–۴۰ دقیقه."],
    ],
    tips:[
      "A soft sandwich loaf needs gentle handling after shaping.",
      "Brush with butter right after baking for a soft crust.",
      "Wait until fully cool before slicing — hot bread crushes.",
      "Perfect for toast, sandwiches, and French toast.",
    ],
    tipsFa:[
      "با نان ساندویچی به آرامی رفتار کنید.",
      "بعد از پخت کره بمالید.",
      "قبل از برش کاملاً خنک شود.",
      "برای تست و ساندویچ عالی است.",
    ],
  },
  {
    id:"flatbread", icon:"flatbread", family:"medium",
    name:"Sourdough Flatbread",       nameFa:"نان تخت خمیرمایه",
    sub:"The gateway bread",          subFa:"نان مبدأ",
    difficulty:1, diffLabel:"Very Easy", diffLabelFa:"خیلی آسان",
    totalTime:"8–24 hrs",             totalTimeFa:"۸–۲۴ ساعت",
    hydration:70,
    ingredients:[
      { amount:400, unit:"g", icon:"wheat", name:"Flour (any type)",    nameFa:"آرد (هر نوع)" },
      { amount:280, unit:"g", icon:"droplet", name:"Water",             nameFa:"آب" },
      { amount:80,  unit:"g", icon:"flask", name:"Active starter",      nameFa:"استارتر فعال" },
      { amount:8,   unit:"g", icon:"salt",  name:"Salt",                nameFa:"نمک" },
      { amount:30,  unit:"g", icon:"olive", name:"Olive oil",           nameFa:"روغن زیتون" },
    ],
    steps:[
      ["Mix", "Combine flour, water, starter, salt, oil. Mix until smooth.", "مخلوط", "همه را ترکیب کنید."],
      ["Ferment", "Cover and rest 8–24 hours until puffy and slightly sour.", "تخمیر", "۸–۲۴ ساعت بپوشانید."],
      ["Divide", "Divide into 6 balls. Rest 30 minutes to relax gluten.", "تقسیم", "به ۶ قسمت تقسیم. ۳۰ دقیقه استراحت."],
      ["Roll thin", "Roll each ball into a thin disc on floured surface.", "پهن کردن", "هر قسمت را نازک پهن کنید."],
      ["Cook", "Cook in a very hot dry pan, 1–2 minutes per side until blistered.", "پخت", "در تابه داغ، ۱–۲ دقیقه از هر طرف."],
    ],
    tips:[
      "Works with any flour — wheat, rye, spelt, or blends.",
      "The hotter the pan, the better the blister and char.",
      "Stack cooked flatbreads in a towel to stay soft.",
      "Brush with garlic butter and herbs for instant upgrade.",
    ],
    tipsFa:[
      "با هر آردی کار می‌کند.",
      "تابه داغ‌تر = تاول بهتر.",
      "نان‌های پخته را در حوله بچینید.",
      "با کره سیر و سبزی سرو کنید.",
    ],
  },
  {
    id:"baguette", icon:"baguette", family:"medium",
    name:"Sourdough Baguette",        nameFa:"باگت خمیر ترش",
    sub:"Crisp crust, open crumb",    subFa:"پوسته ترد، مغز باز",
    difficulty:4, diffLabel:"Advanced", diffLabelFa:"پیشرفته",
    totalTime:"18–24 hrs",            totalTimeFa:"۱۸–۲۴ ساعت",
    hydration:72,
    ingredients:[
      { amount:500, unit:"g", icon:"wheat", name:"Bread flour (>12% protein)", nameFa:"آرد نان" },
      { amount:360, unit:"g", icon:"droplet", name:"Water, 26°C",         nameFa:"آب ۲۶ درجه" },
      { amount:10,  unit:"g", icon:"salt",  name:"Fine sea salt",         nameFa:"نمک دریایی" },
      { amount:100, unit:"g", icon:"flask", name:"Active levain",         nameFa:"لوون فعال" },
    ],
    steps:[
      ["Autolyse", "Mix flour and water only. Rest 45 minutes.", "اتولیز", "فقط آرد و آب. ۴۵ دقیقه."],
      ["Incorporate", "Add levain and salt. Mix thoroughly with pinch-and-fold.", "ترکیب", "لوون و نمک اضافه کنید."],
      ["Bulk", "Ferment 4–5 hours. Perform stretch & folds every 30 min for first 2 hours.", "تخمیر حجمی", "۴–۵ ساعت. کشش و تا هر ۳۰ دقیقه."],
      ["Divide & pre-shape", "Divide into 3 pieces. Pre-shape into short cylinders. Rest 20 min.", "تقسیم", "به ۳ قسمت. ۲۰ دقیقه استراحت."],
      ["Final shape", "Shape into long baguettes with tight surface tension. Place on couche.", "شکل نهایی", "به شکل باگت درآورید."],
      ["Cold proof", "Refrigerate 12–16 hours on couche.", "تخمیر سرد", "۱۲–۱۶ ساعت در یخچال."],
      ["Score & bake", "Score with 3–4 diagonal slashes. Bake at 250°C with steam for 22 min.", "برش و پخت", "برش مورب. در ۲۵۰ درجه با بخار ۲۲ دقیقه."],
    ],
    tips:[
      "Baguettes demand strong bread flour and confident shaping.",
      "Steam in the first 10 minutes is non-negotiable for crust.",
      "Score at 30° angle, overlapping slashes for classic look.",
      "Best eaten within 6 hours of baking.",
    ],
    tipsFa:[
      "باگت نیاز به آرد قوی و شکل‌دهی مطمئن دارد.",
      "بخار در ۱۰ دقیقه اول ضروری است.",
      "زاویه ۳۰ درجه برش بزنید.",
      "بهترین مصرف تا ۶ ساعت بعد از پخت.",
    ],
  },
  {
    id:"focaccia", icon:"focaccia", family:"high",
    name:"Sourdough Focaccia",        nameFa:"فوکاچیا خمیر ترش",
    sub:"Dimpled, oily, glorious",    subFa:"گودال‌دار، روغنی، باشکوه",
    difficulty:2, diffLabel:"Easy",    diffLabelFa:"آسان",
    totalTime:"12–24 hrs",            totalTimeFa:"۱۲–۲۴ ساعت",
    hydration:80,
    ingredients:[
      { amount:500, unit:"g", icon:"wheat", name:"Bread flour",         nameFa:"آرد نان" },
      { amount:400, unit:"g", icon:"droplet", name:"Water",             nameFa:"آب" },
      { amount:10,  unit:"g", icon:"salt",  name:"Fine salt",           nameFa:"نمک ریز" },
      { amount:100, unit:"g", icon:"flask", name:"Active starter",      nameFa:"استارتر فعال" },
      { amount:60,  unit:"g", icon:"olive", name:"Extra virgin olive oil", nameFa:"روغن زیتون" },
    ],
    steps:[
      ["Mix", "Combine flour, water, starter, salt. Mix until smooth and sticky.", "مخلوط", "همه را ترکیب کنید."],
      ["Bulk ferment", "Cover and ferment 4–6 hours. Perform 4 stretch & folds in first 2 hours.", "تخمیر حجمی", "۴–۶ ساعت. ۴ کشش و تا."],
      ["Pan & oil", "Pour generous olive oil into baking pan. Transfer dough, turn to coat.", "قالب و روغن", "روغن در قالب بریزید. خمیر را منتقل کنید."],
      ["Second proof", "Let dough spread and puff in pan 2–3 hours (or overnight in fridge).", "تخمیر دوم", "۲–۳ ساعت یا شب در یخچال."],
      ["Dimple & top", "Oil fingers, poke deep dimples all over. Add rosemary, salt, olives.", "گودال و تزیین", "با انگشتان روغنی گودال ایجاد کنید."],
      ["Bake", "Bake at 220°C (430°F) for 25 minutes until deep golden and crisp.", "پخت", "در ۲۲۰ درجه ۲۵ دقیقه."],
    ],
    tips:[
      "Don't skimp on olive oil — it IS the flavor.",
      "Cherry tomatoes, grapes, or caramelized onions make amazing toppings.",
      "Best warm from the oven, dipped in more olive oil.",
      "Cold ferment overnight for maximum flavor complexity.",
    ],
    tipsFa:[
      "در روغن زیتون صرفه‌جویی نکنید.",
      "گوجه گیلاسی و پیاز کاراملی عالی است.",
      "گرم با روغن زیتون سرو کنید.",
      "تخمیر شبانه سرد برای طعم عمیق‌تر.",
    ],
  },
  {
    id:"ciabatta", icon:"ciabatta", family:"high",
    name:"Ciabatta",                  nameFa:"چاباتا",
    sub:"Slipper bread, wild crumb",  subFa:"نان دمپایی، مغز وحشی",
    difficulty:4, diffLabel:"Advanced", diffLabelFa:"پیشرفته",
    totalTime:"6–8 hrs",              totalTimeFa:"۶–۸ ساعت",
    hydration:82,
    ingredients:[
      { amount:500, unit:"g", icon:"wheat", name:"Bread flour (>12%)",  nameFa:"آرد نان" },
      { amount:410, unit:"g", icon:"droplet", name:"Water",             nameFa:"آب" },
      { amount:10,  unit:"g", icon:"salt",  name:"Fine salt",           nameFa:"نمک ریز" },
      { amount:100, unit:"g", icon:"flask", name:"Active starter (or 3g yeast)", nameFa:"استارتر فعال" },
      { amount:20,  unit:"g", icon:"olive", name:"Olive oil",           nameFa:"روغن زیتون" },
    ],
    steps:[
      ["Mix", "Combine all ingredients. Dough will be very wet and slack — this is correct.", "مخلوط", "همه را ترکیب کنید. خمیر بسیار مرطوب خواهد بود."],
      ["Bulk ferment", "Ferment 4 hours. Perform stretch & folds every 30 minutes (6 total).", "تخمیر حجمی", "۴ ساعت. هر ۳۰ دقیقه کشش و تا."],
      ["Divide gently", "Turn dough onto heavily floured surface. Divide into 2 pieces with minimal handling.", "تقسیم", "روی سطح آردپاشی به ۲ قسمت تقسیم."],
      ["Proof", "Place on floured couche. Proof 1 hour until puffy and jiggly.", "تخمیر", "۱ ساعت روی پارچه آردپاشی."],
      ["Bake with steam", "Bake at 240°C (465°F) with steam for 15 min, then 220°C for 15 min more.", "پخت با بخار", "در ۲۴۰ درجه با بخار ۱۵ دقیقه، سپس ۲۲۰ درجه ۱۵ دقیقه."],
    ],
    tips:[
      "Wet hands, not floured hands, when handling ciabatta dough.",
      "Minimal handling preserves the open crumb structure.",
      "Strong flour (>12% protein) is essential.",
      "Slice horizontally for the perfect sandwich bread.",
    ],
    tipsFa:[
      "از دستان مرطوب استفاده کنید نه آردپاشی.",
      "دستکاری حداقل برای حفظ ساختار باز.",
      "آرد قوی ضروری است.",
      "برای ساندویچ افقی برش بزنید.",
    ],
  },
  {
    id:"pizzadough", icon:"pizza", family:"high",
    name:"Sourdough Pizza Dough",     nameFa:"خمیر پیتزا خمیر ترش",
    sub:"72-hour cold ferment",       subFa:"تخمیر سرد ۷۲ ساعته",
    difficulty:2, diffLabel:"Easy",    diffLabelFa:"آسان",
    totalTime:"24–72 hrs",            totalTimeFa:"۲۴–۷۲ ساعت",
    hydration:68,
    ingredients:[
      { amount:500, unit:"g", icon:"wheat", name:"Tipo 00 or bread flour", nameFa:"آرد ۰۰ یا نان" },
      { amount:340, unit:"g", icon:"droplet", name:"Cold water",          nameFa:"آب سرد" },
      { amount:10,  unit:"g", icon:"salt",  name:"Fine sea salt",        nameFa:"نمک دریایی" },
      { amount:75,  unit:"g", icon:"flask", name:"Active starter (or 1g yeast)", nameFa:"استارتر فعال" },
      { amount:15,  unit:"g", icon:"olive", name:"Olive oil",            nameFa:"روغن زیتون" },
    ],
    steps:[
      ["Mix", "Combine all ingredients until smooth. Rest 30 minutes.", "مخلوط", "ترکیب و ۳۰ دقیقه استراحت."],
      ["Knead", "Knead 8–10 minutes until smooth and elastic.", "ورز", "۸–۱۰ دقیقه ورز."],
      ["Cold ferment", "Place in oiled container, cover, refrigerate 24–72 hours. Longer = better.", "تخمیر سرد", "۲۴–۷۲ ساعت در یخچال."],
      ["Ball", "Divide into 4 balls (220g each). Place in oiled tray, cover.", "توپ کردن", "به ۴ توپ ۲۲۰ گرمی تقسیم."],
      ["Warm up", "Remove from fridge 2 hours before baking to warm up.", "گرم شدن", "۲ ساعت قبل از پخت از یخچال بیرون بگذارید."],
      ["Stretch & bake", "Hand-stretch (never roll). Top and bake at maximum oven temp.", "پهن و پخت", "با دست پهن کنید. در داغ‌ترین حالت فر بپزید."],
    ],
    tips:[
      "72-hour cold ferment = incredible flavor and digestibility.",
      "Never use a rolling pin — it kills the air bubbles.",
      "Semolina flour on the peel prevents sticking.",
      "Less is more with toppings.",
    ],
    tipsFa:[
      "تخمیر سرد ۷۲ ساعته = طعم فوق‌العاده.",
      "هرگز از وردنه استفاده نکنید.",
      "آرد سمولینا از چسبیدن جلوگیری می‌کند.",
      "توپینگ کمتر بهتر است.",
    ],
  },
  {
    id:"ryebread", icon:"rye", family:"high",
    name:"Dark Rye Bread",            nameFa:"نان چاودار تیره",
    sub:"Dense, hearty, complex",     subFa:"متراکم، قوی، پیچیده",
    difficulty:3, diffLabel:"Medium",  diffLabelFa:"متوسط",
    totalTime:"18–24 hrs",            totalTimeFa:"۱۸–۲۴ ساعت",
    hydration:85,
    ingredients:[
      { amount:300, unit:"g", icon:"wheat", name:"Dark rye flour",      nameFa:"آرد چاودار تیره" },
      { amount:200, unit:"g", icon:"wheat", name:"Bread flour",         nameFa:"آرد نان" },
      { amount:425, unit:"g", icon:"droplet", name:"Water",             nameFa:"آب" },
      { amount:100, unit:"g", icon:"flask", name:"Active rye starter",  nameFa:"استارتر چاودار فعال" },
      { amount:10,  unit:"g", icon:"salt",  name:"Fine salt",           nameFa:"نمک ریز" },
      { amount:15,  unit:"g", icon:"sparkles", name:"Caraway seeds (optional)", nameFa:"دانه زیره (اختیاری)" },
    ],
    steps:[
      ["Mix", "Combine all ingredients. Rye dough is paste-like — do not knead.", "مخلوط", "همه را ترکیب کنید. ورز ندهید."],
      ["Bulk", "Cover and ferment 3–4 hours. Rye ferments faster than wheat.", "تخمیر حجمی", "۳–۴ ساعت."],
      ["Pan", "Transfer to greased loaf pan with wet hands. Smooth the top.", "داخل قالب", "با دستان مرطوب به قالب منتقل کنید."],
      ["Proof", "Cover and proof 3–5 hours until small cracks appear on surface.", "تخمیر", "۳–۵ ساعت تا ترک‌های کوچک ظاهر شود."],
      ["Bake", "Bake at 220°C (428°F) for 50 minutes until 92°C internal.", "پخت", "در ۲۲۰ درجه ۵۰ دقیقه."],
      ["Wait 24 hrs", "Do NOT slice for 24 hours. The crumb needs to set.", "۲۴ ساعت صبر", "۲۴ ساعت برش نزنید."],
    ],
    tips:[
      "Rye's pentosans create structure — kneading actually damages the dough.",
      "Higher hydration is normal for rye; embrace the stickiness.",
      "Rye improves with age — a week-old loaf is better than day one.",
      "Traditional additions: caraway, sunflower seeds, walnuts.",
    ],
    tipsFa:[
      "پنتوزان‌های چاودار ساختار ایجاد می‌کنند — ورز ندهید.",
      "آبیاری بالا طبیعی است.",
      "چاودار با زمان بهتر می‌شود.",
      "افزودنی‌های سنتی: زیره، گردو.",
    ],
  },
  {
    id:"artisan", icon:"artisan", family:"high",
    name:"Sourdough Artisan Boule",   nameFa:"بول هنری خمیر ترش",
    sub:"The holy grail",             subFa:"آرزوی نانوایان",
    difficulty:4, diffLabel:"Advanced", diffLabelFa:"پیشرفته",
    totalTime:"24–36 hrs",            totalTimeFa:"۲۴–۳۶ ساعت",
    hydration:78,
    ingredients:[
      { amount:500, unit:"g", icon:"wheat", name:"Bread flour (>12%)",  nameFa:"آرد نان" },
      { amount:390, unit:"g", icon:"droplet", name:"Water, 26°C",       nameFa:"آب ۲۶ درجه" },
      { amount:10,  unit:"g", icon:"salt",  name:"Fine sea salt",       nameFa:"نمک دریایی" },
      { amount:100, unit:"g", icon:"flask", name:"Active levain",       nameFa:"لوون فعال" },
    ],
    steps:[
      ["Autolyse", "Mix flour and water. Rest 45 minutes for gluten development.", "اتولیز", "آرد و آب. ۴۵ دقیقه."],
      ["Incorporate", "Add levain and salt. Pinch and fold until fully combined.", "ترکیب", "لوون و نمک اضافه کنید."],
      ["Bulk ferment", "Ferment 4–6 hours at 24°C. Stretch & fold every 30 min for first 2 hours.", "تخمیر حجمی", "۴–۶ ساعت. کشش و تا هر ۳۰ دقیقه."],
      ["Pre-shape", "Gently shape into a round. Bench rest 25 minutes.", "پیش‌شکل", "شکل دایره‌ای. ۲۵ دقیقه استراحت."],
      ["Final shape", "Build tension with envelope folds. Place seam-up in floured banneton.", "شکل نهایی", "با تاهای پاکت کشش ایجاد کنید."],
      ["Cold proof", "Refrigerate 12–16 hours. This is where magic flavor develops.", "تخمیر سرد", "۱۲–۱۶ ساعت در یخچال."],
      ["Score & bake", "Preheat Dutch oven 45 min at 250°C. Score cold dough. Bake 20 min covered + 20 uncovered.", "برش و پخت", "قابلمه را ۴۵ دقیقه گرم کنید. ۲۰+۲۰ دقیقه."],
    ],
    tips:[
      "Cold overnight proofing gives the best flavor and open crumb.",
      "Score at 30–45° angle for a proper 'ear' to form.",
      "Steam from the covered Dutch oven is critical for oven spring.",
      "There is no recipe to follow blindly — learn to read your dough.",
    ],
    tipsFa:[
      "تخمیر شبانه سرد بهترین طعم را می‌دهد.",
      "زاویه ۳۰–۴۵ درجه برش بزنید.",
      "بخار برای پف فر حیاتی است.",
      "خمیر خود را بخوانید، نه ساعت را.",
    ],
  },
];

const GUIDE = [
  { id:1, icon:"flask", phase:"Before You Begin", phaseFa:"قبل از شروع", title:"Ready Your Starter", titleFa:"استارتر را آماده کنید",
    body:"Your starter must be active, bubbly, and at peak. Feed it 4–12 hours before mixing. A healthy starter doubles in size and passes the float test.",
    bodyFa:"استارتر باید فعال و در اوج باشد. ۴–۱۲ ساعت قبل تغذیه کنید.",
    checks:["Starter doubled","Bubbly, domed top","Float test passes","Smells fruity-sour"],
    checksFa:["دو برابر شده","حباب‌دار","آزمایش شناوری","بوی میوه‌ای-ترش"],
    tip:"If stored in fridge, give 2–3 consecutive feedings to reactivate.", tipFa:"اگر در یخچال بوده، ۲–۳ بار تغذیه کنید.",
    timers:[], timersFa:[] },
  { id:2, icon:"droplet", phase:"Day 1 · Morning", phaseFa:"روز ۱ — صبح", title:"Mix & Autolyse", titleFa:"مخلوط و اتولیز",
    body:"Mix flour and water first, rest 30–60 minutes. Then add starter and salt and mix until fully incorporated.",
    bodyFa:"آرد و آب را مخلوط، ۳۰–۶۰ دقیقه استراحت. سپس استارتر و نمک.",
    checks:["No dry flour spots","Starter and salt incorporated","Smooth dough"],
    checksFa:["آرد خشک نمانده","ترکیب شده","خمیر صاف"],
    tip:"Use water at 26–28°C for ideal fermentation speed.", tipFa:"از آب ۲۶–۲۸ درجه استفاده کنید.",
    timers:[{ label:"Autolyse rest", minutes:30 }], timersFa:[{ label:"استراحت اتولیز", minutes:30 }] },
  { id:3, icon:"timer", phase:"Day 1 · Morning to Afternoon", phaseFa:"روز ۱ — صبح تا ظهر", title:"Bulk Fermentation", titleFa:"تخمیر حجمی",
    body:"4–8 hours at room temperature. First 2 hours: stretch & folds every 30 minutes.",
    bodyFa:"۴–۸ ساعت در دمای محیط. ۲ ساعت اول: کشش و تا هر ۳۰ دقیقه.",
    checks:["Dough increased 50–75%","Bubbles on sides","Airy and jiggly","Windowpane test passes"],
    checksFa:["۵۰–۷۵٪ بزرگ‌تر","حباب‌ها","سبک و لرزان","آزمایش پنجره"],
    tip:"Read your dough, not the clock.", tipFa:"خمیر را بخوانید، نه ساعت.",
    timers:[{ label:"Stretch & fold", minutes:30 }, { label:"Full bulk", minutes:360 }],
    timersFa:[{ label:"کشش و تا", minutes:30 }, { label:"تخمیر کامل", minutes:360 }] },
  { id:4, icon:"scale", phase:"Day 1 · Afternoon", phaseFa:"روز ۱ — بعد از ظهر", title:"Pre-shape & Shape", titleFa:"پیش‌شکل و شکل‌دهی",
    body:"Pre-shape into rough round, rest 20–30 minutes. Final shape into batard or boule.",
    bodyFa:"پیش‌شکل دایره‌ای، ۲۰–۳۰ دقیقه استراحت. شکل نهایی.",
    checks:["Surface smooth and taut","Holds shape","No tears","Seam sealed"],
    checksFa:["سطح صاف","شکل نگه می‌دارد","پارگی نیست","درز بسته"],
    tip:"Work on lightly unfloured surface for friction.", tipFa:"روی سطح کم‌آرد کار کنید.",
    timers:[{ label:"Pre-shape rest", minutes:25 }], timersFa:[{ label:"استراحت پیش‌شکل", minutes:25 }] },
  { id:5, icon:"moon", phase:"Day 1 · Evening", phaseFa:"روز ۱ — عصر", title:"Proofing", titleFa:"تخمیر ثانویه",
    body:"Place shaped dough in floured banneton. Room temp 1–2 hrs, or refrigerate overnight.",
    bodyFa:"خمیر را در بانتون آرد پاشیده بگذارید. ۱–۲ ساعت یا شب در یخچال.",
    checks:["Banneton well-floured","Poke test: springs back slowly","Cold and firm"],
    checksFa:["بانتون آرد پاشیده","آزمایش فشار","سفت و سرد"],
    tip:"Cold proofing 8–16 hrs gives better flavor.", tipFa:"تخمیر سرد ۸–۱۶ ساعت طعم بهتر می‌دهد.",
    timers:[{ label:"Room temp proof", minutes:90 }], timersFa:[{ label:"تخمیر دمای محیط", minutes:90 }] },
  { id:6, icon:"flame", phase:"Day 2 · Baking", phaseFa:"روز ۲ — پخت", title:"Score & Bake", titleFa:"برش و پخت",
    body:"Preheat Dutch oven 45 min at 230–250°C. Score at 30–45°. Bake covered 20 min, uncovered 20 min.",
    bodyFa:"قابلمه را ۴۵ دقیقه گرم کنید. برش بزنید. ۲۰+۲۰ دقیقه بپزید.",
    checks:["Dutch oven preheated 45 min","Blade at 30–45°","Ear forms","Hollow sound when tapped"],
    checksFa:["قابلمه گرم شده","تیغ با زاویه","گوش تشکیل","صدای توخالی"],
    tip:"Steam in first 20 minutes is critical for oven spring.", tipFa:"بخار در ۲۰ دقیقه اول حیاتی است.",
    timers:[{ label:"Preheat", minutes:45 }, { label:"Steam", minutes:20 }, { label:"Crust", minutes:20 }],
    timersFa:[{ label:"پیش‌گرم", minutes:45 }, { label:"بخار", minutes:20 }, { label:"پوسته", minutes:20 }] },
];

const TROUBLE = [
  { icon:"flat", problem:"Flat bread / No oven spring", problemFa:"نان پخم / بدون پف",
    causes:["Weak starter","Over-fermented","Weak shaping","Poor scoring"],
    causesFa:["استارتر ضعیف","بیش‌تخمیر","شکل‌دهی ضعیف","برش ضعیف"],
    fixes:["Feed starter reliably","Reduce bulk by 30–60 min","Build surface tension","Score 30–45° angle"],
    fixesFa:["استارتر تغذیه","کاهش حجمی","ایجاد کشش","برش ۳۰–۴۵ درجه"] },
  { icon:"brick", problem:"Dense or gummy crumb", problemFa:"مغز متراکم یا صمغی",
    causes:["Under-baked","Sliced while hot","Under-fermented","Insufficient gluten"],
    causesFa:["کم‌پخته","برش گرم","کم‌تخمیر","گلوتن کم"],
    fixes:["Bake to 92–96°C","Rest 1 hr (rye 24)","Extend bulk","More stretch & folds"],
    fixesFa:["تا ۹۲–۹۶ درجه","۱ ساعت صبر","حجمی بیشتر","کشش بیشتر"] },
  { icon:"flame", problem:"Too sour / harsh acidity", problemFa:"خیلی ترش",
    causes:["Over-fermented","High starter %","Long warm proof","Unbalanced starter"],
    causesFa:["بیش‌تخمیر","درصد بالا","تخمیر گرم","نامتعادل"],
    fixes:["Shorten bulk","Reduce starter to 8–10%","Cold proof","Rebalance starter"],
    fixesFa:["کوتاه کردن حجمی","کاهش به ۸–۱۰٪","تخمیر سرد","تعادل استارتر"] },
  { icon:"alert", problem:"Not sour enough", problemFa:"به اندازه کافی ترش نیست",
    causes:["Under-fermented","Too fast","Yeast-dominant starter"],
    causesFa:["کم‌تخمیر","خیلی سریع","غالب مخمر"],
    fixes:["Cold proof 24–48 hrs","Reduce starter to 5–8%","Cooler water","Extend bulk"],
    fixesFa:["۲۴–۴۸ ساعت سرد","کاهش به ۵–۸٪","آب سرد","حجمی بیشتر"] },
  { icon:"droplet", problem:"Dough too sticky", problemFa:"خمیر خیلی چسبنده",
    causes:["Hydration too high","Under-developed gluten","Dough too warm"],
    causesFa:["آبیاری زیاد","گلوتن کم","خمیر گرم"],
    fixes:["Reduce hydration by 5%","More stretch & folds","Refrigerate 30 min","Wet hands"],
    fixesFa:["کاهش ۵٪","کشش بیشتر","۳۰ دقیقه یخچال","دستان مرطوب"] },
  { icon:"brick", problem:"Crust too thick or hard", problemFa:"پوسته خیلی ضخیم",
    causes:["Overbaked","Not enough steam","Oven too hot"],
    causesFa:["بیش‌پخت","بخار کم","فر داغ"],
    fixes:["Reduce time","Seal lid tight first 20 min","Lower temp 10°C"],
    fixesFa:["کاهش زمان","درب محکم","کاهش ۱۰ درجه"] },
  { icon:"timer", problem:"Starter not rising", problemFa:"استارتر بالا نمی‌آید",
    causes:["Environment cold","Flour lacks nutrients","Acid buildup","Contamination"],
    causesFa:["سرد","مواد مغذی کم","تجمع اسید","آلودگی"],
    fixes:["Keep at 24–28°C","Switch to whole grain","Discard and restart","Fresh starter"],
    fixesFa:["۲۴–۲۸ درجه","آرد کامل","دور ریختن و شروع","استارتر جدید"] },
  { icon:"hole", problem:"Big holes / blowouts", problemFa:"حفره‌های بزرگ",
    causes:["Under-proofed","Inadequate shaping","Wrong scoring"],
    causesFa:["کم‌تخمیر","شکل‌دهی","برش"],
    fixes:["Extend proof","Even tension","Shallower scoring"],
    fixesFa:["تخمیر بیشتر","کشش یکنواخت","برش کوتاه‌تر"] },
];

// ─── UTILITIES ─────────────────────────────────────────────────────────────
const fmt  = n => Math.round(n * 10) / 10;
const fmt2 = n => Math.round(n * 100) / 100;

function getHydrationLevel(h, lang) {
  const lv = HYDRATION_LEVELS.find(l => h >= l.range[0] && h <= l.range[1]) || HYDRATION_LEVELS[1];
  return { ...lv, label: lang==="fa" ? lv.labelFa : lv.label, desc: lang==="fa" ? lv.descFa : lv.desc };
}
function getWeightFun(g, lang) {
  const row = WEIGHT_FUN.find(([max]) => g < max) || WEIGHT_FUN[WEIGHT_FUN.length-1];
  return lang === "fa" ? row[2] : row[1];
}
async function copyText(text) {
  try { await navigator.clipboard.writeText(text); return true; }
  catch { return false; }
}

// ─── DECORATIVE BACKGROUND (desktop) ───────────────────────────────────────
function BackgroundDecor() {
  const { C, bp } = useApp();
  if (!bp.desktop && !bp.wide) return null;
  return (
    <div style={{ position:"fixed", inset:0, pointerEvents:"none", zIndex:0, overflow:"hidden" }}>
      <div style={{
        position:"absolute",
        top: "-20%", right: "-10%",
        width: bp.wide ? "50vw" : "60vw",
        height: bp.wide ? "50vw" : "60vw",
        borderRadius: "50%",
        background: `radial-gradient(circle, ${C.decorGlow} 0%, transparent 70%)`,
        filter: "blur(80px)",
      }} className="drift" />
      <div style={{
        position:"absolute",
        bottom: "-15%", left: "-15%",
        width: bp.wide ? "40vw" : "50vw",
        height: bp.wide ? "40vw" : "50vw",
        borderRadius: "50%",
        background: `radial-gradient(circle, ${C.decorGlow} 0%, transparent 70%)`,
        filter: "blur(80px)",
        animation: "drift 25s ease-in-out infinite reverse",
      }} />
    </div>
  );
}

// ─── GLASS PANEL ───────────────────────────────────────────────────────────
function GlassPanel({ children, style, onClick, hoverable, as: Tag = "div", ...rest }) {
  const { C } = useApp();
  const [hovered, setHovered] = useState(false);
  return (
    <Tag
      onClick={onClick}
      onMouseEnter={hoverable ? () => setHovered(true) : undefined}
      onMouseLeave={hoverable ? () => setHovered(false) : undefined}
      style={{
        background: hovered && hoverable ? C.glass2 : C.glass,
        backdropFilter: "blur(24px) saturate(180%)",
        WebkitBackdropFilter: "blur(24px) saturate(180%)",
        border: `1px solid ${C.glassBorder}`,
        borderRadius: 20,
        boxShadow: hovered && hoverable ? C.shadowLg : C.shadowMd,
        transition: "all 0.25s cubic-bezier(0.32, 0.72, 0, 1)",
        cursor: onClick ? "pointer" : "default",
        ...style,
      }}
      {...rest}
    >
      {children}
    </Tag>
  );
}

// ─── SHARED UI ─────────────────────────────────────────────────────────────
function Pill({ children, color, small }) {
  const { C } = useApp();
  const c = color || C.accent;
  return (
    <span style={{
      display:"inline-flex", alignItems:"center", gap: 4,
      background: `${c}20`, color: c,
      padding: small ? "4px 10px" : "6px 12px",
      borderRadius: 999, fontSize: 14,
      fontFamily: BODY, fontWeight: 600,
      letterSpacing: "-0.005em", whiteSpace:"nowrap",
    }}>{children}</span>
  );
}

function DiffDots({ level }) {
  const { C } = useApp();
  return (
    <span style={{ display:"flex", gap:4, alignItems:"center" }} aria-label={`Difficulty ${level} of 4`}>
      {[1,2,3,4].map(i => (
        <span key={i} style={{
          width: 7, height: 7, borderRadius:"50%",
          background: i<=level ? C.accent : C.divider,
        }} />
      ))}
    </span>
  );
}

function SectionTitle({ title, sub, label }) {
  const { C, getFont, bp } = useApp();
  return (
    <div style={{ marginBottom: bp.mobile ? 32 : 40 }}>
      {label && (
        <div style={{
          fontFamily: BODY, fontSize: 14, color: C.accent,
          fontWeight: 600, letterSpacing: "0.02em", marginBottom: 10,
        }}>{label}</div>
      )}
      <h2 style={{
        fontFamily: getFont("display"),
        fontSize: bp.mobile ? 40 : bp.tablet ? 48 : 56,
        fontWeight: 500, color: C.text, lineHeight: 1.05,
        letterSpacing: "-0.025em",
        marginBottom: sub ? 12 : 0,
      }}>{title}</h2>
      {sub && <p style={{
        fontFamily: BODY, color: C.textSub,
        fontSize: bp.mobile ? 17 : 18,
        lineHeight: 1.5, maxWidth: 600, letterSpacing: "-0.008em",
      }}>{sub}</p>}
    </div>
  );
}

function Label({ children, htmlFor }) {
  const { C } = useApp();
  return (
    <label htmlFor={htmlFor} style={{
      display: "block", fontFamily: BODY, fontSize: 14,
      color: C.textSub, fontWeight: 500, letterSpacing: "-0.005em", marginBottom: 8,
    }}>{children}</label>
  );
}

function NumInput({ value, onChange, step=50, min=1, unit="g", label, id }) {
  const { C } = useApp();
  const [display, setDisplay] = useState(String(value));
  useEffect(() => { setDisplay(String(value)); }, [value]);
  const commit = (raw) => {
    const n = parseFloat(raw);
    if (!isNaN(n) && n >= min) { onChange(n); setDisplay(String(n)); }
    else setDisplay(String(value));
  };
  const dec = () => { const v = Math.max(min, value - step); onChange(v); setDisplay(String(v)); };
  const inc = () => { const v = value + step; onChange(v); setDisplay(String(v)); };
  return (
    <div style={{ minWidth: 0 }}>
      {label && <Label htmlFor={id}>{label}</Label>}
      <div style={{
        display:"flex", alignItems:"center",
        background: C.bgAlt,
        border: `1px solid ${C.divider}`,
        borderRadius: 14, overflow:"hidden",
        boxShadow: C.shadowSm,
      }}>
        <button onClick={dec} aria-label="Decrease" style={{
          width: 48, height: 52, flexShrink: 0,
          display: "flex", alignItems: "center", justifyContent: "center",
          color: C.textFaint, background: "transparent",
          borderRight: `1px solid ${C.dividerSoft}`,
        }}
        onMouseEnter={e => { e.currentTarget.style.color = C.accent; e.currentTarget.style.background = C.accentDim; }}
        onMouseLeave={e => { e.currentTarget.style.color = C.textFaint; e.currentTarget.style.background = "transparent"; }}
        >
          <Icon name="minus" size={18} />
        </button>
        <input id={id} type="text" inputMode="decimal" value={display} aria-label={label || "Value"}
          onChange={e => { setDisplay(e.target.value); const n=parseFloat(e.target.value); if(!isNaN(n)&&n>=min) onChange(n); }}
          onBlur={e => commit(e.target.value)}
          style={{
            flex:1, minWidth: 0, width: "100%",
            textAlign:"center", background:"transparent", border:"none",
            fontFamily: DISPLAY, fontSize: 24, fontWeight: 500,
            color: C.text, outline:"none",
            letterSpacing: "-0.02em", padding: "10px 4px",
          }}
        />
        <span style={{
          fontFamily: BODY, fontSize: 14,
          color: C.textFaint, padding: "0 8px",
          fontWeight: 500, flexShrink: 0,
        }}>{unit}</span>
        <button onClick={inc} aria-label="Increase" style={{
          width: 48, height: 52, flexShrink: 0,
          display: "flex", alignItems: "center", justifyContent: "center",
          color: C.textFaint, background: "transparent",
          borderLeft: `1px solid ${C.dividerSoft}`,
        }}
        onMouseEnter={e => { e.currentTarget.style.color = C.accent; e.currentTarget.style.background = C.accentDim; }}
        onMouseLeave={e => { e.currentTarget.style.color = C.textFaint; e.currentTarget.style.background = "transparent"; }}
        >
          <Icon name="plus" size={18} />
        </button>
      </div>
    </div>
  );
}

function Slider({ label, value, onChange, min, max, step=1, unit="%", sublabel, id }) {
  const { C, num } = useApp();
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div style={{ marginBottom: 26 }}>
      <div style={{
        display:"flex", justifyContent:"space-between",
        alignItems:"baseline", marginBottom: 14,
      }}>
        <label htmlFor={id} style={{
          fontFamily: BODY, fontSize: 15, color: C.text,
          fontWeight: 600, letterSpacing: "-0.005em",
        }}>
          {label}
          {sublabel && <span style={{
            fontFamily: BODY, fontSize: 14, color: C.textFaint,
            fontWeight: 400, marginLeft: 8,
          }}>{sublabel}</span>}
        </label>
        <span style={{
          fontFamily: DISPLAY, fontSize: 22, color: C.accent,
          fontWeight: 600, letterSpacing: "-0.01em",
          fontVariantNumeric:"tabular-nums",
        }}>
          {num(value)}
          <span style={{fontSize: 14, color: C.textFaint, fontWeight: 500, marginLeft: 2}}>{unit}</span>
        </span>
      </div>
      <div style={{ position:"relative", height: 28, display:"flex", alignItems:"center" }}>
        <div style={{
          position:"absolute", left:0, right:0,
          height: 6, borderRadius: 999,
          background: C.divider, overflow:"hidden",
        }}>
          <div style={{
            width: `${pct}%`, height: "100%",
            background: C.accent, borderRadius: 999,
            transition:"width 0.1s",
          }} />
        </div>
        <input id={id} type="range" min={min} max={max} step={step} value={value}
          onChange={e => onChange(parseFloat(e.target.value))}
          style={{ position:"relative", background:"transparent", width:"100%" }}
        />
      </div>
      <div style={{
        display:"flex", justifyContent:"space-between", marginTop: 8,
      }}>
        <span style={{ fontFamily: BODY, fontSize: 14, color: C.textFaint, fontVariantNumeric:"tabular-nums" }}>{num(min)}{unit}</span>
        <span style={{ fontFamily: BODY, fontSize: 14, color: C.textFaint, fontVariantNumeric:"tabular-nums" }}>{num(max)}{unit}</span>
      </div>
    </div>
  );
}

function CopyButton({ getText }) {
  const { C, t } = useApp();
  const [state, setState] = useState("idle");
  const handleCopy = async () => {
    const ok = await copyText(getText());
    setState(ok ? "done" : "fail");
    setTimeout(() => setState("idle"), 2200);
  };
  return (
    <button onClick={handleCopy} style={{
      display:"inline-flex", alignItems:"center", gap:8,
      padding:"10px 18px",
      background: state==="done" ? C.success : C.accent,
      color: "#FFFFFF", borderRadius: 999,
      fontFamily: BODY, fontSize: 14, fontWeight: 600,
      minHeight: 44,
    }}>
      <Icon name={state === "done" ? "check" : "copy"} size={16} color="#FFFFFF" />
      {state==="done" ? t("copiedLabel") : t("copyList")}
    </button>
  );
}

function PageFooter() {
  const { C, t } = useApp();
  return (
    <div style={{ textAlign:"center", padding:"40px 0 24px", marginTop: 24 }}>
      <div style={{
        fontFamily: BODY, fontSize: 14, color: C.textFaint, letterSpacing: "-0.005em",
      }}>{t("footer")}</div>
    </div>
  );
}

function StepTimer({ label, minutes }) {
  const { C, t, num, bp } = useApp();
  const total = minutes * 60;
  const [seconds, setSeconds] = useState(total);
  const [running, setRunning] = useState(false);
  const [done, setDone]       = useState(false);
  useEffect(() => {
    if (!running) return;
    if (seconds <= 0) { setRunning(false); setDone(true); return; }
    const id = setInterval(() => setSeconds(s => s - 1), 1000);
    return () => clearInterval(id);
  }, [running, seconds]);
  const reset = () => { setSeconds(total); setRunning(false); setDone(false); };
  const rawMm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const rawSs = String(seconds % 60).padStart(2, "0");
  const mm = num(rawMm);
  const ss = num(rawSs);
  const pct = ((total - seconds) / total) * 100;
  const circ = 2 * Math.PI * 32;
  const strokeOffset = circ - (pct / 100) * circ;

  // Stack vertically on very narrow widths
  const stack = bp.mobile;

  return (
    <div style={{
      display:"flex",
      flexDirection: stack ? "column" : "row",
      alignItems: stack ? "stretch" : "center",
      gap: stack ? 14 : 16,
      padding:"14px 16px", background: C.bgAlt,
      border: `1px solid ${done ? C.success : C.divider}`,
      borderRadius: 14, marginBottom: 10,
    }}>
      <div style={{ position:"relative", width:72, height:72, flexShrink:0, margin: stack ? "0 auto" : 0 }}>
        <svg width="72" height="72" viewBox="0 0 72 72" style={{ transform:"rotate(-90deg)" }}>
          <circle cx="36" cy="36" r="32" stroke={C.divider} strokeWidth="3" fill="none" />
          <circle cx="36" cy="36" r="32" stroke={done ? C.success : C.accent} strokeWidth="3" fill="none"
            strokeDasharray={circ} strokeDashoffset={strokeOffset} strokeLinecap="round"
            style={{ transition:"stroke-dashoffset 1s linear, stroke 0.3s" }}
          />
        </svg>
        <div style={{
          position:"absolute", inset:0,
          display:"flex", alignItems:"center", justifyContent:"center",
          fontFamily: DISPLAY, fontSize: 17, fontWeight: 600,
          color: done ? C.success : C.text,
          fontVariantNumeric:"tabular-nums",
        }}>
          {done ? <Icon name="check" size={20} color={C.success} /> : `${mm}:${ss}`}
        </div>
      </div>
      <div style={{ flex:1, minWidth:0, textAlign: stack ? "center" : "left" }}>
        <div style={{
          fontFamily: BODY, fontSize: 14, color: C.textFaint,
          fontWeight: 500, marginBottom: 2,
          display:"flex", alignItems:"center", gap: 6,
          justifyContent: stack ? "center" : "flex-start",
        }}>
          <Icon name="timer" size={14} color={C.textFaint} />
          {label}
        </div>
        <div style={{
          fontFamily: DISPLAY, fontSize: 17, fontWeight: 600,
          color: done ? C.success : C.text,
        }}>
          {done ? t("timerDone") : running ? "Running" : "Ready"}
        </div>
      </div>
      <div style={{ display:"flex", gap:8, justifyContent: stack ? "center" : "flex-start" }}>
        {!done && (
          <button onClick={() => setRunning(r => !r)} style={{
            padding:"10px 18px", borderRadius: 999,
            background: running ? C.accentSoft : C.accent,
            color: running ? C.accent : "#FFFFFF",
            fontFamily: BODY, fontSize: 14, fontWeight: 600,
            minWidth: 84, minHeight: 44,
          }}>
            {running ? t("timerPause") : t("timerStart")}
          </button>
        )}
        <button onClick={reset} aria-label="Reset" style={{
          width: 44, height: 44, borderRadius: "50%",
          background: C.dividerSoft, color: C.textSub,
          display:"flex", alignItems:"center", justifyContent:"center",
        }}>
          <Icon name="minus" size={16} color={C.textSub} />
        </button>
      </div>
    </div>
  );
}

function SegmentedControl({ options, value, onChange }) {
  const { C } = useApp();
  return (
    <div role="tablist" style={{
      display:"flex", background: C.bgAlt,
      borderRadius: 14, padding: 4,
      border: `1px solid ${C.divider}`, boxShadow: C.shadowSm,
    }}>
      {options.map(opt => {
        const active = value === opt.value;
        return (
          <button key={opt.value} role="tab" aria-selected={active}
            onClick={() => onChange(opt.value)}
            style={{
              flex:1, padding:"12px 10px", borderRadius: 10,
              background: active ? C.accent : "transparent",
              color: active ? "#FFFFFF" : C.textSub,
              fontFamily: BODY, fontSize: 15, fontWeight: 600,
              transition:"all 0.25s cubic-bezier(0.32, 0.72, 0, 1)",
              minHeight: 48,
              display:"flex", flexDirection:"column",
              alignItems:"center", gap: 3,
            }}>
            <div style={{ display:"flex", alignItems:"center", gap: 6 }}>
              {opt.icon && <Icon name={opt.icon} size={16} />}
              {opt.label}
            </div>
            {opt.sub && (
              <div style={{
                fontSize: 14, fontWeight: 400,
                opacity: active ? 0.9 : 0.75,
              }}>{opt.sub}</div>
            )}
          </button>
        );
      })}
    </div>
  );
}

function ResultRow({ icon, label, sub, value }) {
  const { C, num } = useApp();
  return (
    <div style={{
      display:"flex", alignItems:"center",
      justifyContent:"space-between",
      padding:"13px 0",
      borderBottom:`1px solid ${C.dividerSoft}`,
      gap: 12,
    }}>
      <div style={{ display:"flex", alignItems:"center", gap: 12, minWidth: 0, flex: 1 }}>
        {icon && (
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: C.accentSoft,
            display:"flex", alignItems:"center", justifyContent:"center",
            color: C.accent, flexShrink: 0,
          }}>
            <Icon name={icon} size={18} />
          </div>
        )}
        <div style={{ minWidth: 0 }}>
          <div style={{
            fontFamily: BODY, fontSize: 15, color: C.text,
            fontWeight: 500, letterSpacing: "-0.005em",
          }}>{label}</div>
          {sub && <div style={{
            fontFamily: BODY, fontSize: 14, color: C.textFaint, marginTop: 2,
          }}>{sub}</div>}
        </div>
      </div>
      <span style={{
        fontFamily: DISPLAY, fontSize: 20, color: C.text,
        fontWeight: 600, fontVariantNumeric:"tabular-nums",
        letterSpacing: "-0.01em", flexShrink: 0,
      }}>
        {num(fmt(value))}
        <span style={{fontSize: 14, marginLeft: 2, color: C.textFaint}}>g</span>
      </span>
    </div>
  );
}

// ─── HOME TAB ──────────────────────────────────────────────────────────────
function HomeTab({ setTab }) {
  const { C, t, lang, getFont, bp } = useApp();
  const cards = [
    { icon:"scale",    labelKey:"doughCalc",  subKey:"doughCalcSub",  tab:"calc" },
    { icon:"pizza",    labelKey:"pizzaCalc",  subKey:"pizzaCalcSub",  tab:"pizza" },
    { icon:"book",     labelKey:"recipes",    subKey:"recipesSub",    tab:"recipes" },
    { icon:"compass",  labelKey:"guide",      subKey:"guideSub",      tab:"guide" },
    { icon:"wrench",   labelKey:"trouble",    subKey:"troubleSub",    tab:"trouble" },
    { icon:"flask",    labelKey:"starter",    subKey:"starterSub",    tab:"starter" },
  ];

  const diffRows = lang === "fa" ? [
    { icon:"flatbread", name:"نان تخت",    desc:"هر آردی. ۳ دقیقه.", level:1 },
    { icon:"loaf",      name:"قالب کشتی",  desc:"از فر. ۵ دقیقه.", level:2 },
    { icon:"rye",       name:"چاودار",     desc:"نیاز به صبر.", level:3 },
    { icon:"artisan",   name:"گندم آزاد",  desc:"بالاترین مهارت.", level:4 },
  ] : [
    { icon:"flatbread", name:"Flatbread", desc:"Any flour. 3 min.", level:1 },
    { icon:"loaf",      name:"Loaf Pan",  desc:"Uses oven. 5 min.", level:2 },
    { icon:"rye",       name:"Rye",       desc:"Patience required.", level:3 },
    { icon:"artisan",   name:"Artisan",   desc:"The supreme discipline.", level:4 },
  ];

  const bakerQuote = lang === "fa"
    ? "هیچ دستوری نیست که بتوانی کورکورانه دنبال کنی. همیشه باید با ابزارها و محیط محلی‌ات سازگار شوی."
    : "There is no recipe you can blindly follow. You will always have to adapt to your locally available tools and environment.";
  const bakerSource = lang === "fa" ? "— چارچوب خمیرترش" : "— The Sourdough Framework";

  // Responsive grid columns
  const gridCols = bp.mobile ? 2 : bp.tablet ? 3 : bp.desktop ? 3 : 6;
  const isWideLayout = bp.desktop || bp.wide;

  return (
    <div style={{ padding: bp.mobile ? "0 24px 32px" : bp.tablet ? "0 40px 40px" : "0 48px 48px" }} className="fade-up">
      {/* Hero */}
      <div style={{
        marginBottom: isWideLayout ? 56 : 40,
        paddingTop: isWideLayout ? 32 : 20,
        maxWidth: isWideLayout ? 900 : "none",
      }}>
        <div style={{
          fontFamily: BODY, fontSize: 14, color: C.accent,
          fontWeight: 600, letterSpacing: "0.02em", marginBottom: 12,
        }}>{t("appTagline").toUpperCase()}</div>
        <h1 style={{
          fontFamily: getFont("display"),
          fontSize: bp.mobile ? 56 : bp.tablet ? 72 : bp.desktop ? 88 : 108,
          fontWeight: 500, color: C.text,
          lineHeight: 0.95, letterSpacing: "-0.035em",
          marginBottom: 20,
        }}>
          {t("appName")}
        </h1>
        <p style={{
          fontFamily: BODY,
          fontSize: bp.mobile ? 18 : bp.tablet ? 20 : 22,
          color: C.textSub, lineHeight: 1.5,
          letterSpacing: "-0.008em",
          maxWidth: isWideLayout ? 640 : 480,
        }}>{t("taglineSub")}</p>
      </div>

      {/* Tools Grid */}
      <div style={{
        fontFamily: BODY, fontSize: 14, color: C.textFaint,
        fontWeight: 600, letterSpacing: "0.02em",
        marginBottom: 16, textTransform: "uppercase",
      }}>{t("toolsSections")}</div>
      <div style={{
        display:"grid",
        gridTemplateColumns: `repeat(${gridCols}, 1fr)`,
        gap: bp.mobile ? 12 : bp.tablet ? 16 : 20,
        marginBottom: isWideLayout ? 56 : 40,
      }}>
        {cards.map(card => (
          <GlassPanel key={card.tab} hoverable onClick={() => setTab(card.tab)}
            style={{ padding: bp.mobile ? "24px 20px" : "28px 24px" }}>
            <div style={{
              width: isWideLayout ? 52 : 44,
              height: isWideLayout ? 52 : 44,
              borderRadius: isWideLayout ? 14 : 12,
              background: C.accentSoft,
              display:"flex", alignItems:"center", justifyContent:"center",
              color: C.accent,
              marginBottom: isWideLayout ? 20 : 16,
            }}>
              <Icon name={card.icon} size={isWideLayout ? 28 : 24} />
            </div>
            <div style={{
              fontFamily: DISPLAY,
              fontSize: bp.mobile ? 19 : bp.tablet ? 20 : 22,
              color: C.text, fontWeight: 600,
              marginBottom: 6, letterSpacing: "-0.015em", lineHeight: 1.2,
            }}>{t(card.labelKey)}</div>
            <div style={{
              fontFamily: BODY, fontSize: 14, color: C.textFaint,
              lineHeight: 1.4, letterSpacing: "-0.005em",
            }}>{t(card.subKey)}</div>
          </GlassPanel>
        ))}
      </div>

      {/* Two-column on desktop: difficulty + quote */}
      {isWideLayout ? (
        <div style={{
          display:"grid",
          gridTemplateColumns: bp.wide ? "1.2fr 1fr" : "1fr 1fr",
          gap: 24,
          alignItems: "stretch",
        }}>
          {/* Difficulty */}
          <GlassPanel style={{ padding: "28px 28px 16px" }}>
            <div style={{
              fontFamily: BODY, fontSize: 14, color: C.textFaint,
              fontWeight: 600, letterSpacing: "0.02em",
              textTransform: "uppercase", marginBottom: 18,
            }}>{t("diffOverview")}</div>
            {diffRows.map((row, i) => (
              <div key={row.name} style={{
                display:"flex", alignItems:"center", gap:16,
                padding:"14px 0",
                borderBottom: i < diffRows.length - 1 ? `1px solid ${C.divider}` : "none",
              }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 12,
                  background: C.accentSoft,
                  display:"flex", alignItems:"center", justifyContent:"center",
                  color: C.accent, flexShrink: 0,
                }}>
                  <Icon name={row.icon} size={24} />
                </div>
                <div style={{ flex:1 }}>
                  <div style={{
                    fontFamily: DISPLAY, fontSize: 18, color: C.text,
                    fontWeight: 600, letterSpacing: "-0.01em", marginBottom: 2,
                  }}>{row.name}</div>
                  <div style={{
                    fontFamily: BODY, fontSize: 14, color: C.textFaint,
                    letterSpacing: "-0.005em",
                  }}>{row.desc}</div>
                </div>
                <DiffDots level={row.level} />
              </div>
            ))}
          </GlassPanel>

          {/* Quote */}
          <GlassPanel style={{
            padding: "32px",
            background: `linear-gradient(135deg, ${C.accentDim}, ${C.glass})`,
            display: "flex", flexDirection: "column", justifyContent: "center",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
              <Icon name="sparkles" size={20} color={C.accent} />
              <span style={{
                fontFamily: BODY, fontSize: 14, color: C.accent,
                fontWeight: 600, letterSpacing: "0.02em", textTransform: "uppercase",
              }}>{t("bakerPrinciple")}</span>
            </div>
            <p style={{
              fontFamily: getFont("display"),
              fontSize: bp.wide ? 26 : 22,
              color: C.text, fontStyle:"italic",
              lineHeight: 1.55, letterSpacing: "-0.01em", fontWeight: 400,
            }}>
              "{bakerQuote}"
            </p>
            <div style={{
              fontFamily: BODY, fontSize: 15, color: C.textFaint,
              marginTop: 20, letterSpacing: "-0.005em",
            }}>{bakerSource}</div>
          </GlassPanel>
        </div>
      ) : (
        <>
          {/* Stacked on mobile/tablet */}
          <GlassPanel style={{ padding: "24px 24px 12px", marginBottom: 24 }}>
            <div style={{
              fontFamily: BODY, fontSize: 14, color: C.textFaint,
              fontWeight: 600, letterSpacing: "0.02em",
              textTransform: "uppercase", marginBottom: 18,
            }}>{t("diffOverview")}</div>
            {diffRows.map((row, i) => (
              <div key={row.name} style={{
                display:"flex", alignItems:"center", gap:16,
                padding:"14px 0",
                borderBottom: i < diffRows.length - 1 ? `1px solid ${C.divider}` : "none",
              }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 10,
                  background: C.accentSoft,
                  display:"flex", alignItems:"center", justifyContent:"center",
                  color: C.accent, flexShrink: 0,
                }}>
                  <Icon name={row.icon} size={22} />
                </div>
                <div style={{ flex:1 }}>
                  <div style={{
                    fontFamily: DISPLAY, fontSize: 17, color: C.text,
                    fontWeight: 600, letterSpacing: "-0.01em", marginBottom: 2,
                  }}>{row.name}</div>
                  <div style={{
                    fontFamily: BODY, fontSize: 14, color: C.textFaint,
                    letterSpacing: "-0.005em",
                  }}>{row.desc}</div>
                </div>
                <DiffDots level={row.level} />
              </div>
            ))}
          </GlassPanel>

          <GlassPanel style={{
            padding: "28px",
            background: `linear-gradient(135deg, ${C.accentDim}, ${C.glass})`,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
              <Icon name="sparkles" size={18} color={C.accent} />
              <span style={{
                fontFamily: BODY, fontSize: 14, color: C.accent,
                fontWeight: 600, letterSpacing: "0.02em", textTransform: "uppercase",
              }}>{t("bakerPrinciple")}</span>
            </div>
            <p style={{
              fontFamily: getFont("display"), fontSize: 20, color: C.text,
              fontStyle:"italic", lineHeight: 1.55,
              letterSpacing: "-0.01em", fontWeight: 400,
            }}>
              "{bakerQuote}"
            </p>
            <div style={{
              fontFamily: BODY, fontSize: 14, color: C.textFaint,
              marginTop: 16, letterSpacing: "-0.005em",
            }}>{bakerSource}</div>
          </GlassPanel>
        </>
      )}

      <PageFooter />
    </div>
  );
}

// ─── BREAD CALCULATOR (responsive split view on desktop) ───────────────────
function BreadCalc() {
  const { C, t, lang, num, bp } = useApp();
  const [leavenType,   setLeavenType]   = useState("sourdough");
  const [yeastType,    setYeastType]    = useState("dry");
  const [inputMode,    setInputMode]    = useState("flour");
  const [flourPerLoaf, setFlourPerLoaf] = useState(500);
  const [totalWeight,  setTotalWeight]  = useState(900);
  const [hydration,    setHydration]    = useState(75);
  const [starterPct,   setStarterPct]   = useState(10);
  const [yeastPct,     setYeastPct]     = useState(0.5);
  const [saltPct,      setSaltPct]      = useState(2);
  const [wholeGrain,   setWholeGrain]   = useState(20);

  const YEAST_DEFAULTS = { fresh: 2.0, dry: 0.5 };
  const YEAST_RANGES   = { fresh: [0.5, 5], dry: [0.1, 2] };
  useEffect(() => { setYeastPct(YEAST_DEFAULTS[yeastType]); }, [yeastType]);

  const leavenPct = leavenType === "sourdough" ? starterPct : yeastPct;

  const dough = useMemo(() => {
    let flour;
    if (inputMode === "flour") {
      flour = flourPerLoaf;
    } else {
      flour = totalWeight / (1 + hydration/100 + leavenPct/100 + saltPct/100);
    }
    const water  = flour * hydration / 100;
    const leaven = flour * leavenPct / 100;
    const salt   = flour * saltPct / 100;
    const total  = flour + water + leaven + salt;
    const breadFlour = flour * (1 - wholeGrain/100);
    const wgFlour    = flour * wholeGrain / 100;
    return { flour, water, leaven, salt, total, breadFlour, wgFlour };
  }, [inputMode, flourPerLoaf, totalWeight, hydration, leavenPct, saltPct, wholeGrain]);

  const hLevel = getHydrationLevel(hydration, lang);

  const leavenLabel = leavenType === "sourdough"
    ? `${t("starterLabel")}: ${num(fmt(dough.leaven))}g`
    : `${t("yeastLabel")} (${yeastType === "fresh" ? t("freshYeast") : t("dryYeast")}): ${num(fmt(dough.leaven))}g`;

  const getShoppingList = () => {
    const d = dough;
    const lines = [
      `${t("breadCalc")}`, ``,
      wholeGrain>0 ? `${t("breadFlour")}: ${num(fmt(d.breadFlour))}g` : `${t("flour")}: ${num(fmt(d.flour))}g`,
      wholeGrain>0 ? `${t("wgFlour")}: ${num(fmt(d.wgFlour))}g` : null,
      `${t("water")}: ${num(fmt(d.water))}g`,
      leavenLabel,
      `${t("salt")}: ${num(fmt(d.salt))}g`, ``,
      `${t("total")}: ${num(fmt(d.total))}g`,
      `${t("hydration")}: ${num(hydration)}%`,
    ].filter(Boolean);
    return lines.join("\n");
  };

  const isDesktop = bp.desktop || bp.wide;

  const controlsPanel = (
    <div>
      <div style={{ marginBottom: 24 }}>
        <Label>{t("leavening")}</Label>
        <SegmentedControl
          value={leavenType}
          onChange={setLeavenType}
          options={[
            { value:"sourdough", label:t("sourdoughOpt"), sub:t("sourdoughSub"), icon:"flask" },
            { value:"yeast", label:t("yeastOpt"), sub:t("yeastSub"), icon:"sparkles" },
          ]}
        />
      </div>

      {leavenType === "yeast" && (
        <div style={{ marginBottom: 24 }}>
          <Label>{t("yeastType")}</Label>
          <div style={{ display:"flex", gap:8 }}>
            {[["fresh","freshYeast"],["dry","dryYeast"]].map(([id,lKey]) => (
              <button key={id} onClick={() => setYeastType(id)} style={{
                flex:1, padding:"12px 8px", borderRadius: 12,
                border: `1.5px solid ${yeastType===id ? C.accent : C.divider}`,
                background: yeastType===id ? C.accentSoft : "transparent",
                color: yeastType===id ? C.accent : C.textSub,
                fontFamily: BODY, fontSize: 15, fontWeight: 600,
                minHeight: 48,
              }}>{t(lKey)}</button>
            ))}
          </div>
        </div>
      )}

      <div style={{ marginBottom: 24 }}>
        <div style={{ display:"flex", gap:8, marginBottom: 12 }}>
          {[["flour","byFlour"],["total","byTotal"]].map(([id,lKey]) => (
            <button key={id} onClick={() => setInputMode(id)} style={{
              flex:1, padding:"12px 8px", borderRadius: 12,
              border: `1.5px solid ${inputMode===id ? C.accent : C.divider}`,
              background: inputMode===id ? C.accentSoft : "transparent",
              color: inputMode===id ? C.accent : C.textSub,
              fontFamily: BODY, fontSize: 14, fontWeight: 600,
              minHeight: 48,
            }}>{t(lKey)}</button>
          ))}
        </div>
        <NumInput
          id="weight-input"
          value={inputMode==="flour" ? flourPerLoaf : totalWeight}
          onChange={v => inputMode==="flour" ? setFlourPerLoaf(v) : setTotalWeight(v)}
          step={50} min={50}
          label={inputMode==="flour" ? t("flourPerLoaf") : t("totalDoughWeight")}
        />
        {inputMode==="flour" && (
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4, 1fr)", gap:8, marginTop:12 }}>
            {[[100,"rolls"],[500,"standard"],[1000,"large"],[2000,"mega"]].map(([n,lKey]) => (
              <button key={n} onClick={() => setFlourPerLoaf(n)} style={{
                padding:"12px 4px", borderRadius: 10,
                border: `1.5px solid ${flourPerLoaf===n ? C.accent : C.divider}`,
                background: flourPerLoaf===n ? C.accentSoft : "transparent",
                color: flourPerLoaf===n ? C.accent : C.textSub,
                fontFamily: BODY, fontSize: 14, fontWeight: 600,
                textAlign:"center", minHeight: 56,
                display:"flex", flexDirection:"column",
                alignItems:"center", justifyContent:"center", gap: 4,
              }}>
                <span style={{ fontVariantNumeric:"tabular-nums" }}>{num(n)}g</span>
                <span style={{fontSize:14, opacity:0.8 }}>{t(lKey)}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <GlassPanel style={{ padding: "26px 22px 16px", marginBottom: 24 }}>
        <Slider id="hydration" label={t("hydration")} value={hydration} onChange={setHydration} min={55} max={110} />
        <div style={{
          display:"flex", alignItems:"center", gap:12,
          marginTop:-4, marginBottom:22,
          padding:"14px 16px", background: C.accentDim,
          borderRadius: 12, border: `1px solid ${C.accentSoft}`,
        }}>
          <Pill color={C.accent} small>{hLevel.label}</Pill>
          <span style={{
            fontFamily: BODY, fontSize: 14, color: C.textSub,
            letterSpacing: "-0.005em",
          }}>{hLevel.desc}</span>
        </div>
        {leavenType === "sourdough" ? (
          <Slider id="starter" label={t("starterLabel")} value={starterPct} onChange={setStarterPct} min={5} max={30} />
        ) : (
          <Slider
            id="yeast"
            label={`${t("yeastLabel")} · ${yeastType === "fresh" ? t("freshYeast") : t("dryYeast")}`}
            value={yeastPct} onChange={setYeastPct}
            min={YEAST_RANGES[yeastType][0]} max={YEAST_RANGES[yeastType][1]} step={0.05}
          />
        )}
        <Slider id="salt" label={t("salt")} value={saltPct} onChange={setSaltPct} min={1.5} max={3} step={0.1} />
        <Slider id="wholegrain" label={t("wholeGrain")} value={wholeGrain} onChange={setWholeGrain} min={0} max={100}
          sublabel={t("ofTotalFlour")}
        />
      </GlassPanel>
    </div>
  );

  const resultsPanel = (
    <div style={{ position: isDesktop ? "sticky" : "static", top: 100 }}>
      <GlassPanel style={{
        padding: "24px 24px 22px",
        background: `linear-gradient(135deg, ${C.glass}, ${C.accentDim})`,
        marginBottom: 20,
      }}>
        <div style={{
          display:"flex", justifyContent:"space-between",
          alignItems:"center", marginBottom: 18, paddingBottom: 14,
          borderBottom: `1px solid ${C.divider}`,
          flexWrap: "wrap", gap: 12,
        }}>
          <span style={{
            fontFamily: BODY, fontSize: 14, color: C.accent,
            fontWeight: 600, letterSpacing: "0.02em", textTransform: "uppercase",
          }}>
            {t("yourFormula")}
          </span>
          <CopyButton getText={getShoppingList} />
        </div>

        {wholeGrain > 0 ? (
          <>
            <ResultRow icon="wheat" label={t("breadFlour")} sub={`${num(100-wholeGrain)}%`} value={dough.breadFlour} />
            <ResultRow icon="rye" label={t("wgFlour")} sub={`${num(wholeGrain)}%`} value={dough.wgFlour} />
          </>
        ) : (
          <ResultRow icon="wheat" label={t("flour")} sub="100%" value={dough.flour} />
        )}
        <ResultRow icon="droplet" label={t("water")} sub={`${num(hydration)}%`} value={dough.water} />
        <ResultRow
          icon={leavenType === "sourdough" ? "flask" : "sparkles"}
          label={leavenType === "sourdough" ? t("starterLabel") : `${yeastType==="fresh"?t("freshYeast"):t("dryYeast")} ${t("yeastLabel")}`}
          sub={`${num(leavenPct)}%`}
          value={dough.leaven}
        />
        <ResultRow icon="salt" label={t("salt")} sub={`${num(saltPct)}%`} value={dough.salt} />

        <div style={{
          paddingTop: 18, marginTop: 14,
          display:"flex", justifyContent:"space-between", alignItems:"baseline",
          borderTop: `2px solid ${C.divider}`,
        }}>
          <span style={{
            fontFamily: BODY, fontSize: 14, color: C.accent,
            fontWeight: 600, letterSpacing: "0.02em", textTransform: "uppercase",
          }}>{t("total")}</span>
          <span style={{
            fontFamily: DISPLAY, fontSize: isDesktop ? 42 : 36, color: C.accent,
            fontWeight: 600, letterSpacing: "-0.02em",
            fontVariantNumeric:"tabular-nums",
          }}>
            {num(fmt(dough.total))}<span style={{fontSize: 15, marginLeft: 4, color: C.textFaint}}>g</span>
          </span>
        </div>
        <div style={{
          marginTop: 12, fontFamily: BODY, fontSize: 14,
          color: C.textFaint, fontStyle:"italic",
          textAlign:"right", letterSpacing: "-0.005em",
        }}>
          {getWeightFun(dough.total, lang)}
        </div>
      </GlassPanel>

      <GlassPanel style={{ overflow:"hidden" }}>
        <div style={{ padding:"16px 22px", borderBottom:`1px solid ${C.divider}` }}>
          <span style={{
            fontFamily: BODY, fontSize: 14, color: C.textFaint,
            fontWeight: 600, letterSpacing: "0.02em", textTransform: "uppercase",
          }}>{t("hydGuide")}</span>
        </div>
        {HYDRATION_LEVELS.map((l, i, arr) => {
          const label = lang==="fa" ? l.labelFa : l.label;
          const desc  = lang==="fa" ? l.descFa  : l.desc;
          const active = hydration>=l.range[0]&&hydration<=l.range[1];
          return (
            <div key={l.label} style={{
              display:"flex", gap:14, alignItems:"center",
              padding:"14px 22px",
              borderBottom: i<arr.length-1 ? `1px solid ${C.divider}` : "none",
              background: active ? C.accentDim : "transparent",
            }}>
              <span style={{
                fontFamily: DISPLAY, fontSize: 15,
                color: active ? C.accent : C.textSub,
                fontWeight: 600, minWidth: 90,
                fontVariantNumeric:"tabular-nums",
              }}>{num(l.range[0])}–{num(l.range[1])}%</span>
              <div style={{ flex:1 }}>
                <div style={{
                  fontFamily: BODY, fontSize: 15,
                  color: active ? C.accent : C.text,
                  fontWeight: 600, marginBottom: 2,
                }}>{label}</div>
                <div style={{
                  fontFamily: BODY, fontSize: 14, color: C.textFaint,
                }}>{desc}</div>
              </div>
            </div>
          );
        })}
      </GlassPanel>
    </div>
  );

  if (isDesktop) {
    return (
      <div style={{
        display:"grid",
        gridTemplateColumns: bp.wide ? "1.2fr 1fr" : "1fr 1fr",
        gap: 32,
        alignItems: "start",
      }}>
        {controlsPanel}
        {resultsPanel}
      </div>
    );
  }

  return (
    <div>
      {controlsPanel}
      {resultsPanel}
    </div>
  );
}

// ─── PIZZA CALCULATOR ──────────────────────────────────────────────────────
function PizzaCalc() {
  const { C, t, lang, num, bp } = useApp();
  const [doughType,    setDoughType]    = useState("yeast");
  const [ovenType,     setOvenType]     = useState("home");
  const [pizzaCount,   setPizzaCount]   = useState(4);
  const [ballWeight,   setBallWeight]   = useState(270);
  const [hydration,    setHydration]    = useState(60);
  const [showToppings, setShowToppings] = useState(false);
  const [yeastType,    setYeastType]    = useState("dry");

  const oven = PIZZA_OVENS.find(o => o.id === ovenType);
  useEffect(() => { setBallWeight(PIZZA_OVENS.find(o=>o.id===ovenType)?.defaultWeight||270); }, [ovenType]);

  const pizza = useMemo(() => {
    const totalDough = pizzaCount * ballWeight;
    const yeastPct = doughType === "yeast" ? (yeastType === "fresh" ? 0.3 : 0.1) : 5;
    const saltPct = 2;
    const starterOrYeast = yeastPct / 100;
    const flour  = totalDough / (1 + hydration/100 + saltPct/100 + starterOrYeast);
    const water  = flour * hydration / 100;
    const salt   = flour * saltPct  / 100;
    const dryYeastAmt = flour * 0.001;
    const freshYeastAmt = flour * 0.003;
    const starter  = flour * 0.05;
    const mozzarella   = 80 * pizzaCount;
    const tomatoSauce  = 60 * pizzaCount;
    const oliveOil     = 6  * pizzaCount;
    const basil        = 10 * pizzaCount;
    const basilPots    = Math.ceil(basil / 80);
    return { totalDough, flour, water, salt, freshYeastAmt, dryYeastAmt, starter, mozzarella, tomatoSauce, oliveOil, basil, basilPots };
  }, [pizzaCount, ballWeight, hydration, doughType, yeastType]);

  const hLevel = getHydrationLevel(hydration, lang);

  const getShoppingList = () => {
    const lines = [
      `${t("pizzaCalcTitle")} — ${num(pizzaCount)} ${lang==="fa"?"پیتزا":"pizza"}${pizzaCount>1&&lang!=="fa"?"s":""}`, ``,
      `${lang==="fa"?"آرد":"Flour"}: ${num(fmt(pizza.flour))}g`,
      `${t("water")}: ${num(fmt(pizza.water))}g`,
      `${t("salt")}: ${num(fmt(pizza.salt))}g`,
      doughType==="yeast"
        ? `${t("freshYeastLabel")}: ${num(fmt2(pizza.freshYeastAmt))}g  (${t("dryYeast")}: ${num(fmt2(pizza.dryYeastAmt))}g)`
        : `${t("activeStarter")}: ${num(fmt(pizza.starter))}g`,
    ].filter(Boolean);
    return lines.join("\n");
  };

  const partyMsg = pizzaCount===1?t("soloMode"):pizzaCount===2?t("dateNight"):pizzaCount<=4?t("pizzaParty"):pizzaCount<=8?t("bigGathering"):t("fullBakery");

  const pizzaTips = lang === "fa" ? [
    { icon:"timer", title:"تخمیر آهسته سلاح شماست", body:"مخمر کم + تخمیر طولانی طعم را بهبود می‌دهد." },
    { icon:"flame", title:"حرارت بالا ضروری", body:"سنگ یا صفحه فولادی روی طبقه بالایی." },
    { icon:"sparkles", title:"کمتر، بیشتر است", body:"مواد باکیفیت بهتر از انبوه توپینگ‌ها." },
  ] : [
    { icon:"timer", title:"Slow fermentation is your secret weapon", body:"Low yeast + long, cold rise improves flavor dramatically." },
    { icon:"flame", title:"High heat is essential", body:"Preheat as hot as possible. Stone or steel on top rack is ideal." },
    { icon:"sparkles", title:"Less is more with toppings", body:"A few quality ingredients beat a mountain every time." },
  ];

  const isDesktop = bp.desktop || bp.wide;

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <Label>{t("doughType")}</Label>
        <SegmentedControl
          value={doughType}
          onChange={setDoughType}
          options={[
            { value:"yeast", label:t("yeastPizza"), sub:t("yeastPizzaSub"), icon:"sparkles" },
            { value:"sourdough", label:t("sourdoughPizza"), sub:t("sourdoughPizzaSub"), icon:"flask" },
          ]}
        />
      </div>

      {doughType === "yeast" && (
        <div style={{ marginBottom: 24 }}>
          <Label>{t("yeastType")}</Label>
          <div style={{ display:"flex", gap:8 }}>
            {[["fresh","freshYeast"],["dry","dryYeast"]].map(([id,lKey]) => (
              <button key={id} onClick={() => setYeastType(id)} style={{
                flex:1, padding:"12px 8px", borderRadius: 12,
                border: `1.5px solid ${yeastType===id ? C.accent : C.divider}`,
                background: yeastType===id ? C.accentSoft : "transparent",
                color: yeastType===id ? C.accent : C.textSub,
                fontFamily: BODY, fontSize: 15, fontWeight: 600,
                minHeight: 48,
              }}>{t(lKey)}</button>
            ))}
          </div>
        </div>
      )}

      <div style={{
        display: isDesktop ? "grid" : "grid",
        gridTemplateColumns: isDesktop ? "1fr 1.4fr" : "1fr 1.6fr",
        gap: isDesktop ? 24 : 16,
        marginBottom: isDesktop ? 32 : 28,
      }}>
        <div style={{ minWidth: 0 }}>
          <Label>{t("pizzas")}</Label>
          <div style={{
            display:"flex", alignItems:"center", justifyContent:"space-between",
            background: C.bgAlt, border: `1px solid ${C.divider}`,
            borderRadius: 14, padding:"8px 10px", boxShadow: C.shadowSm,
          }}>
            <button onClick={() => setPizzaCount(Math.max(1,pizzaCount-1))} aria-label="Decrease" style={{
              background:"transparent", color: C.textFaint,
              width: 40, height: 40,
              display:"flex", alignItems:"center", justifyContent:"center",
            }}>
              <Icon name="minus" size={18} />
            </button>
            <span style={{
              fontFamily: DISPLAY, fontSize: 32, color: C.accent,
              fontWeight: 600, fontVariantNumeric:"tabular-nums",
              letterSpacing: "-0.02em",
            }}>{num(pizzaCount)}</span>
            <button onClick={() => setPizzaCount(Math.min(20,pizzaCount+1))} aria-label="Increase" style={{
              background:"transparent", color: C.textFaint,
              width: 40, height: 40,
              display:"flex", alignItems:"center", justifyContent:"center",
            }}>
              <Icon name="plus" size={18} />
            </button>
          </div>
          <div style={{
            fontFamily: BODY, fontSize: 14, color: C.textFaint,
            marginTop: 10, textAlign:"center", letterSpacing: "-0.005em",
          }}>{partyMsg}</div>
        </div>
        <div style={{ minWidth: 0, overflow: "hidden" }}>
          <NumInput
            id="ball-weight"
            value={ballWeight}
            onChange={setBallWeight}
            step={10} min={150} unit="g"
            label={t("pizzaDoughWeight")}
          />
          <div style={{
            fontFamily: BODY, fontSize: 14, color: C.textFaint,
            marginTop: 8, textAlign:"center", letterSpacing: "-0.005em",
          }}>
            {ovenType==="home" ? t("homeFor") : t("proFor")}
          </div>
        </div>
      </div>

      <GlassPanel style={{ padding: "26px 22px 12px", marginBottom: 28 }}>
        <Slider id="pizza-hyd" label={t("hydration")} value={hydration} onChange={setHydration} min={55} max={75} />
        <div style={{
          display:"flex", alignItems:"center", gap:12,
          marginTop:-4, marginBottom:16,
          padding:"14px 16px", background: C.accentDim,
          borderRadius: 12, border: `1px solid ${C.accentSoft}`,
        }}>
          <Pill color={C.accent} small>{hLevel.label}</Pill>
          <span style={{
            fontFamily: BODY, fontSize: 14, color: C.textSub,
            letterSpacing: "-0.005em",
          }}>{hLevel.desc}</span>
        </div>
      </GlassPanel>

      {/* Results + Toppings row on desktop */}
      <div style={{
        display: isDesktop ? "grid" : "block",
        gridTemplateColumns: "1fr 1fr",
        gap: 20,
      }}>
        <GlassPanel style={{
          padding: "24px 24px 22px",
          background: `linear-gradient(135deg, ${C.glass}, ${C.accentDim})`,
          marginBottom: isDesktop ? 0 : 20,
        }}>
          <div style={{
            display:"flex", justifyContent:"space-between",
            alignItems:"center", marginBottom: 18, paddingBottom: 14,
            borderBottom: `1px solid ${C.divider}`,
            flexWrap: "wrap", gap: 12,
          }}>
            <span style={{
              fontFamily: BODY, fontSize: 14, color: C.accent,
              fontWeight: 600, letterSpacing: "0.02em", textTransform: "uppercase",
            }}>
              {num(pizzaCount)} {lang==="fa"?"پیتزا":"Pizza"}{pizzaCount>1&&lang!=="fa"?"s":""} · {num(fmt(pizza.totalDough))}g
            </span>
            <CopyButton getText={getShoppingList} />
          </div>
          <ResultRow icon="wheat" label={lang==="fa"?"آرد":"Flour"} value={pizza.flour} />
          <ResultRow icon="droplet" label={t("water")} value={pizza.water} />
          <ResultRow icon="salt" label={t("salt")} value={pizza.salt} />
          {doughType==="yeast" ? (
            <>
              <ResultRow icon="sparkles" label={`${yeastType==="fresh"?t("freshYeast"):t("dryYeast")} ${t("yeastLabel")}`} value={yeastType==="fresh"?pizza.freshYeastAmt:pizza.dryYeastAmt} />
              <div style={{
                padding:"6px 0 12px",
                borderBottom:`1px solid ${C.dividerSoft}`,
                paddingLeft: 44,
              }}>
                <span style={{ fontFamily: BODY, fontSize: 14, color: C.textFaint }}>
                  {yeastType==="fresh" ? `${t("dryYeast")}: ${num(fmt2(pizza.dryYeastAmt))}g` : `${t("freshYeastLabel")}: ${num(fmt2(pizza.freshYeastAmt))}g`}
                </span>
              </div>
            </>
          ) : (
            <ResultRow icon="flask" label={t("activeStarter")} value={pizza.starter} />
          )}
          <div style={{
            paddingTop: 18,
            display:"flex", justifyContent:"space-between", alignItems:"baseline",
            marginTop: 12, borderTop: `2px solid ${C.divider}`,
          }}>
            <span style={{
              fontFamily: BODY, fontSize: 14, color: C.accent,
              fontWeight: 600, letterSpacing: "0.02em", textTransform: "uppercase",
            }}>{t("totalDough")}</span>
            <span style={{
              fontFamily: DISPLAY, fontSize: 30, color: C.accent,
              fontWeight: 600, fontVariantNumeric:"tabular-nums",
              letterSpacing: "-0.02em",
            }}>
              {num(fmt(pizza.totalDough))}<span style={{fontSize: 14, marginLeft: 3, color: C.textFaint}}>g</span>
            </span>
          </div>
        </GlassPanel>

        <GlassPanel style={{ overflow:"hidden", height: "fit-content" }}>
          <button onClick={() => setShowToppings(!showToppings)} style={{
            display:"flex", alignItems:"center", justifyContent:"space-between",
            width:"100%", padding:"18px 22px",
            background:"transparent", minHeight: 60,
          }}>
            <div style={{ display:"flex", alignItems:"center", gap: 12 }}>
              <div style={{
                width: 40, height: 40, borderRadius: 10,
                background: C.accentSoft,
                display:"flex", alignItems:"center", justifyContent:"center",
                color: C.accent,
              }}>
                <Icon name="tomato" size={20} />
              </div>
              <span style={{
                fontFamily: DISPLAY, fontSize: 18, color: C.text,
                fontWeight: 600, letterSpacing: "-0.01em",
              }}>{t("toppingsBtn")}</span>
            </div>
            <div style={{
              color: C.textFaint,
              transform: showToppings ? "rotate(90deg)" : "none",
              transition:"transform 0.3s cubic-bezier(0.32, 0.72, 0, 1)",
            }}>
              <Icon name="chevronRight" size={22} />
            </div>
          </button>
          {showToppings && (
            <div style={{
              borderTop:`1px solid ${C.divider}`,
              padding:"16px 22px 18px", background: C.accentDim,
            }}>
              <ResultRow icon="cheese" label={lang==="fa"?"موتزارلا":"Mozzarella"} value={pizza.mozzarella} />
              <ResultRow icon="tomato" label={lang==="fa"?"سس گوجه":"Tomato sauce"} value={pizza.tomatoSauce} />
              <ResultRow icon="olive" label={lang==="fa"?"روغن زیتون":"Olive oil"} value={pizza.oliveOil} />
              <div style={{
                display:"flex", justifyContent:"space-between",
                alignItems:"center", padding:"12px 0", gap: 12,
              }}>
                <div style={{ display:"flex", alignItems:"center", gap: 12 }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: 8,
                    background: C.accentSoft,
                    display:"flex", alignItems:"center", justifyContent:"center",
                    color: C.accent,
                  }}>
                    <Icon name="leaf" size={18} />
                  </div>
                  <span style={{
                    fontFamily: BODY, fontSize: 15, color: C.text, fontWeight: 500,
                  }}>{lang==="fa"?"ریحان":"Basil leaves"}</span>
                </div>
                <span style={{
                  fontFamily: DISPLAY, fontSize: 17, color: C.text,
                  fontWeight: 600, fontVariantNumeric:"tabular-nums",
                }}>
                  {num(pizza.basil)}g
                  <span style={{fontSize: 14, color: C.textFaint, marginLeft: 6, fontFamily: BODY }}>
                    (≈ {num(pizza.basilPots)} {lang==="fa"?"گلدان":"pot"}{pizza.basilPots>1&&lang!=="fa"?"s":""})
                  </span>
                </span>
              </div>
            </div>
          )}
        </GlassPanel>
      </div>

      {/* Your Oven — big attention-grabbing */}
      <div style={{ marginTop: 28 }}>
        <div style={{
          display:"flex", alignItems:"center", gap: 8, marginBottom: 16,
        }}>
          <Icon name="flame" size={18} color={C.accent} />
          <span style={{
            fontFamily: BODY, fontSize: 14, color: C.accent,
            fontWeight: 600, letterSpacing: "0.02em", textTransform: "uppercase",
          }}>{t("yourOven")}</span>
        </div>
        <div style={{
          display:"grid",
          gridTemplateColumns: isDesktop ? "repeat(3, 1fr)" : "repeat(3, 1fr)",
          gap: isDesktop ? 16 : 10,
          marginBottom: 16,
        }}>
          {PIZZA_OVENS.map(o => {
            const active = ovenType === o.id;
            return (
              <GlassPanel key={o.id} hoverable
                onClick={() => setOvenType(o.id)}
                style={{
                  padding: isDesktop ? "28px 16px" : "20px 12px",
                  textAlign:"center",
                  border: active ? `2px solid ${C.accent}` : `1px solid ${C.glassBorder}`,
                  background: active
                    ? `linear-gradient(135deg, ${C.accentSoft}, ${C.glass})`
                    : C.glass,
                  minHeight: isDesktop ? 160 : 120,
                  display: "flex", flexDirection: "column",
                  alignItems: "center", justifyContent: "center",
                  gap: isDesktop ? 12 : 10,
                }}>
                <div style={{
                  width: isDesktop ? 60 : 48,
                  height: isDesktop ? 60 : 48,
                  borderRadius: isDesktop ? 16 : 12,
                  background: active ? C.accent : C.accentSoft,
                  color: active ? "#FFFFFF" : C.accent,
                  display:"flex", alignItems:"center", justifyContent:"center",
                  transition: "all 0.25s",
                }}>
                  <Icon name={o.icon} size={isDesktop ? 32 : 26} color={active ? "#FFFFFF" : C.accent} />
                </div>
                <div style={{
                  fontFamily: DISPLAY,
                  fontSize: isDesktop ? 19 : 17,
                  fontWeight: 600,
                  color: active ? C.accent : C.text,
                  letterSpacing: "-0.01em", lineHeight: 1.2,
                }}>{lang==="fa"?o.nameFa:o.nameEn}</div>
                <div style={{
                  fontFamily: BODY,
                  fontSize: isDesktop ? 15 : 14,
                  color: C.textFaint,
                  fontVariantNumeric:"tabular-nums",
                  fontWeight: 500,
                }}>{o.temp}</div>
              </GlassPanel>
            );
          })}
        </div>

        {oven && (
          <GlassPanel style={{
            padding:"20px 22px",
            background: `linear-gradient(135deg, ${C.accentDim}, ${C.glass})`,
            border: `1px solid ${C.accentSoft}`,
          }}>
            <div style={{ display:"flex", gap: 14, alignItems:"flex-start" }}>
              <div style={{
                width: 44, height: 44, borderRadius: 12,
                background: C.accentSoft,
                display:"flex", alignItems:"center", justifyContent:"center",
                color: C.accent, flexShrink: 0,
              }}>
                <Icon name={oven.icon} size={24} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontFamily: DISPLAY,
                  fontSize: isDesktop ? 20 : 18,
                  color: C.accent, fontWeight: 600,
                  marginBottom: 6, letterSpacing: "-0.01em",
                }}>{lang==="fa"?oven.nameFa:oven.nameEn}</div>
                <div style={{
                  fontFamily: BODY,
                  fontSize: isDesktop ? 16 : 15,
                  color: C.textSub, lineHeight: 1.55,
                  letterSpacing: "-0.005em",
                }}>
                  {lang==="fa" ? oven.tipFa : oven.tip}
                </div>
              </div>
            </div>
          </GlassPanel>
        )}
      </div>

      <GlassPanel style={{ marginTop: 24, padding: isDesktop ? "28px 26px" : "24px 22px" }}>
        <div style={{ display:"flex", alignItems:"center", gap: 8, marginBottom: 20 }}>
          <Icon name="sparkles" size={18} color={C.accent} />
          <span style={{
            fontFamily: BODY, fontSize: 14, color: C.accent,
            fontWeight: 600, letterSpacing: "0.02em", textTransform: "uppercase",
          }}>{t("proTips")}</span>
        </div>
        <div style={{
          display: isDesktop ? "grid" : "block",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 20,
        }}>
          {pizzaTips.map(tip => (
            <div key={tip.title} style={{
              display:"flex", gap:14,
              flexDirection: isDesktop ? "column" : "row",
              alignItems: isDesktop ? "flex-start" : "flex-start",
            }}>
              <div style={{
                width: isDesktop ? 48 : 40,
                height: isDesktop ? 48 : 40,
                borderRadius: isDesktop ? 12 : 10,
                background: C.accentSoft,
                display:"flex", alignItems:"center", justifyContent:"center",
                color: C.accent, flexShrink:0,
              }}>
                <Icon name={tip.icon} size={isDesktop ? 24 : 20} />
              </div>
              <div>
                <div style={{
                  fontFamily: DISPLAY,
                  fontSize: isDesktop ? 17 : 16,
                  color: C.text, fontWeight: 600,
                  marginBottom: 4, letterSpacing: "-0.01em",
                }}>{tip.title}</div>
                <div style={{
                  fontFamily: BODY,
                  fontSize: isDesktop ? 15 : 15,
                  color: C.textSub, lineHeight: 1.55,
                  letterSpacing: "-0.005em",
                }}>{tip.body}</div>
              </div>
            </div>
          ))}
        </div>
      </GlassPanel>
    </div>
  );
}

// ─── STARTER CALCULATOR ────────────────────────────────────────────────────
function StarterCalc() {
  const { C, t, lang, num, bp } = useApp();
  const [targetStarter, setTargetStarter] = useState(200);
  const [feedRatio,     setFeedRatio]     = useState(1);

  const starterCalc = useMemo(() => {
    const r = FEED_RATIOS[feedRatio];
    const parts = r.seed + r.flour + r.water;
    return { seed: targetStarter*r.seed/parts, flour: targetStarter*r.flour/parts, water: targetStarter*r.water/parts };
  }, [targetStarter, feedRatio]);

  const getShoppingList = () => [
    `${t("starterTitle")}`, ``,
    `${t("seedStarter")}: ${num(fmt(starterCalc.seed))}g`,
    `${t("freshFlour")}: ${num(fmt(starterCalc.flour))}g`,
    `${t("freshWater")}: ${num(fmt(starterCalc.water))}g`, ``,
    `${lang==="fa"?"نسبت":"Ratio"}: ${FEED_RATIOS[feedRatio].label}`,
    `${t("readyStarter")}: ${num(fmt(targetStarter))}g`,
  ].join("\n");

  const ratioDescs = FEED_RATIO_DESCS.map(k => t(k));
  const isDesktop = bp.desktop || bp.wide;

  return (
    <div>
      <SectionTitle title={t("starterTitle")} sub={t("starterSub2")} />

      <div style={{
        display: isDesktop ? "grid" : "block",
        gridTemplateColumns: "1fr 1fr",
        gap: 28,
      }}>
        <div>
          <div style={{ marginBottom: 28 }}>
            <NumInput
              id="target-starter"
              value={targetStarter}
              onChange={setTargetStarter}
              step={10} min={10}
              label={t("howMuchStarter")}
            />
          </div>

          <div style={{ marginBottom: isDesktop ? 0 : 28 }}>
            <Label>{t("feedingRatio")}</Label>
            <div style={{
              display:"flex", background: C.bgAlt,
              borderRadius: 14, padding: 4,
              border: `1px solid ${C.divider}`, boxShadow: C.shadowSm,
            }}>
              {FEED_RATIOS.map((r,i) => (
                <button key={r.label} onClick={() => setFeedRatio(i)} style={{
                  flex:1, padding:"14px 4px", borderRadius: 10,
                  background: feedRatio===i ? C.accent : "transparent",
                  color: feedRatio===i ? "#FFFFFF" : C.textSub,
                  fontFamily: DISPLAY, fontSize: 15, fontWeight: 600,
                  fontVariantNumeric:"tabular-nums",
                  minHeight: 48,
                }}>{r.label}</button>
              ))}
            </div>
          </div>
        </div>

        <GlassPanel style={{
          padding: "24px 24px 22px",
          background: `linear-gradient(135deg, ${C.glass}, ${C.accentDim})`,
        }}>
          <div style={{
            display:"flex", justifyContent:"space-between",
            alignItems:"center", marginBottom: 18, paddingBottom: 14,
            borderBottom: `1px solid ${C.divider}`,
            flexWrap: "wrap", gap: 12,
          }}>
            <span style={{
              fontFamily: BODY, fontSize: 14, color: C.accent,
              fontWeight: 600, letterSpacing: "0.02em", textTransform: "uppercase",
            }}>{t("feedingFormula")}</span>
            <CopyButton getText={getShoppingList} />
          </div>
          <ResultRow icon="flask" label={t("seedStarter")} value={starterCalc.seed} />
          <ResultRow icon="wheat" label={t("freshFlour")} value={starterCalc.flour} />
          <ResultRow icon="droplet" label={t("freshWater")} value={starterCalc.water} />
          <div style={{
            display:"flex", justifyContent:"space-between", alignItems:"baseline",
            paddingTop: 18, marginTop: 12, borderTop: `2px solid ${C.divider}`,
          }}>
            <span style={{
              fontFamily: BODY, fontSize: 14, color: C.accent,
              fontWeight: 600, letterSpacing: "0.02em", textTransform: "uppercase",
            }}>{t("readyStarter")}</span>
            <span style={{
              fontFamily: DISPLAY, fontSize: 36, color: C.accent,
              fontWeight: 600, fontVariantNumeric:"tabular-nums",
              letterSpacing: "-0.02em",
            }}>
              {num(fmt(targetStarter))}<span style={{fontSize: 15, marginLeft: 4, color: C.textFaint}}>g</span>
            </span>
          </div>
        </GlassPanel>
      </div>

      <GlassPanel style={{ marginTop: 24, padding: "24px 22px 8px" }}>
        <div style={{ display:"flex", alignItems:"center", gap: 8, marginBottom: 18 }}>
          <Icon name="compass" size={18} color={C.accent} />
          <span style={{
            fontFamily: BODY, fontSize: 14, color: C.accent,
            fontWeight: 600, letterSpacing: "0.02em", textTransform: "uppercase",
          }}>{t("ratioRef")}</span>
        </div>
        <div style={{
          display: isDesktop ? "grid" : "block",
          gridTemplateColumns: "repeat(5, 1fr)",
          gap: isDesktop ? 12 : 0,
        }}>
          {FEED_RATIOS.map((r,i) => (
            <div key={r.label} style={{
              display:"flex",
              flexDirection: isDesktop ? "column" : "row",
              gap: isDesktop ? 8 : 16,
              alignItems: isDesktop ? "flex-start" : "baseline",
              padding: isDesktop ? "16px 14px" : "13px 12px",
              borderBottom: isDesktop ? "none" : (i<FEED_RATIOS.length-1 ? `1px solid ${C.dividerSoft}` : "none"),
              background: feedRatio === i ? C.accentDim : "transparent",
              borderRadius: 8,
            }}>
              <span style={{
                fontFamily: DISPLAY,
                fontSize: isDesktop ? 20 : 17,
                color: feedRatio === i ? C.accent : C.text,
                fontWeight: 600,
                minWidth: isDesktop ? "auto" : 70,
                fontVariantNumeric:"tabular-nums",
              }}>{r.label}</span>
              <span style={{
                fontFamily: BODY,
                fontSize: isDesktop ? 14 : 15,
                color: C.textSub, lineHeight: 1.55,
                letterSpacing: "-0.005em",
              }}>{ratioDescs[i]}</span>
            </div>
          ))}
        </div>
        <div style={{
          marginTop: 18, padding:"16px 18px",
          background: C.accentDim, borderRadius: 14,
          border: `1px solid ${C.accentSoft}`,
          display: "flex", gap: 12, alignItems: "flex-start",
        }}>
          <Icon name="sparkles" size={20} color={C.accent} style={{ marginTop: 2, flexShrink: 0 }} />
          <span style={{
            fontFamily: BODY, fontSize: 14, color: C.textSub,
            lineHeight: 1.6, letterSpacing: "-0.005em",
          }}>
            {t("starterRatioTip")}
          </span>
        </div>
      </GlassPanel>
    </div>
  );
}

// ─── CALC TAB ──────────────────────────────────────────────────────────────
function CalcTab({ initialMode }) {
  const { C, t, bp } = useApp();
  const [mode, setMode] = useState(initialMode || "bread");
  const modes = [
    { value: "bread", label: t("breadCalc"), icon: "scale" },
    { value: "pizza", label: t("pizzaCalcTitle"), icon: "pizza" },
    { value: "starter", label: t("starterTitle"), icon: "flask" },
  ];
  return (
    <div style={{
      padding: bp.mobile ? "0 24px 32px" : bp.tablet ? "0 40px 40px" : "0 48px 48px",
    }} className="fade-up">
      <div style={{ marginBottom: 28 }}>
        <div style={{
          display:"flex", background: C.bgAlt,
          borderRadius: 14, padding: 4,
          border: `1px solid ${C.divider}`, boxShadow: C.shadowSm,
          maxWidth: bp.mobile ? "none" : 720,
        }}>
          {modes.map(m => (
            <button key={m.value} onClick={() => setMode(m.value)} style={{
              flex:1, padding:"12px 6px", borderRadius: 10,
              fontFamily: BODY, fontSize: 14, fontWeight: 600,
              background: mode===m.value ? C.accent : "transparent",
              color: mode===m.value ? "#FFFFFF" : C.textSub,
              minHeight: 48,
              display:"flex", alignItems:"center", justifyContent:"center", gap: 6,
            }}>
              <Icon name={m.icon} size={16} color={mode===m.value ? "#FFFFFF" : C.textSub} />
              {m.label}
            </button>
          ))}
        </div>
      </div>
      {mode==="bread"   && <BreadCalc />}
      {mode==="pizza"   && <PizzaCalc />}
      {mode==="starter" && <StarterCalc />}
      <PageFooter />
    </div>
  );
}

// ─── RECIPES TAB (responsive grid) ─────────────────────────────────────────
function RecipesTab() {
  const { C, t, lang, getFont, num, bp } = useApp();
  const [selected, setSelected] = useState(null);
  const [loaves, setLoaves] = useState(1);

  const lowRecipes    = RECIPES.filter(r => r.family === "low");
  const mediumRecipes = RECIPES.filter(r => r.family === "medium");
  const highRecipes   = RECIPES.filter(r => r.family === "high");

  const isDesktop = bp.desktop || bp.wide;
  const isTablet  = bp.tablet;

  if (selected) {
    const r = RECIPES.find(x => x.id===selected);
    const isFa = lang === "fa";
    const s = g => num(fmt(g * loaves));
    const rName     = isFa ? r.nameFa     : r.name;
    const rSub      = isFa ? r.subFa      : r.sub;
    const rDiffLbl  = isFa ? r.diffLabelFa: r.diffLabel;
    const rTotalTime= isFa ? r.totalTimeFa: r.totalTime;
    const rTips     = isFa ? r.tipsFa     : r.tips;

    return (
      <div style={{
        padding: bp.mobile ? "0 24px 32px" : bp.tablet ? "0 40px 40px" : "0 48px 48px",
      }} className="fade-up">
        <button onClick={() => { setSelected(null); setLoaves(1); }} style={{
          display:"inline-flex", alignItems:"center", gap:6,
          background:"transparent", color: C.accent,
          fontFamily: BODY, fontSize: 15, fontWeight: 600,
          marginBottom: 24, padding: "8px 0", minHeight: 44,
        }}>
          <Icon name="chevronRight" size={18} style={{ transform: "rotate(180deg)" }} />
          {t("back")}
        </button>

        {/* Hero section — two-column on desktop */}
        <div style={{
          display: isDesktop ? "grid" : "block",
          gridTemplateColumns: "auto 1fr",
          gap: 32,
          marginBottom: isDesktop ? 40 : 32,
          alignItems: isDesktop ? "center" : "flex-start",
        }}>
          <div style={{
            width: isDesktop ? 100 : 80,
            height: isDesktop ? 100 : 80,
            borderRadius: isDesktop ? 24 : 20,
            background: C.accentSoft,
            display:"flex", alignItems:"center", justifyContent:"center",
            color: C.accent,
            marginBottom: isDesktop ? 0 : 20,
          }}>
            <Icon name={r.icon} size={isDesktop ? 56 : 42} />
          </div>
          <div>
            <h2 style={{
              fontFamily: getFont("display"),
              fontSize: bp.mobile ? 40 : bp.tablet ? 48 : 56,
              fontWeight: 500, color: C.text,
              lineHeight: 1.05, letterSpacing: "-0.025em",
              marginBottom: 10,
            }}>{rName}</h2>
            <p style={{
              fontFamily: BODY, fontSize: 17, color: C.textSub,
              letterSpacing: "-0.005em", lineHeight: 1.5, marginBottom: 18,
            }}>{rSub}</p>
            <div style={{ display:"flex", gap:8, flexWrap:"wrap", alignItems:"center" }}>
              <DiffDots level={r.difficulty} />
              <Pill>{rDiffLbl}</Pill>
              <Pill color={C.textSub}>
                <Icon name="timer" size={14} /> {rTotalTime}
              </Pill>
              <Pill>
                <Icon name="droplet" size={14} /> {num(r.hydration)}%
              </Pill>
            </div>
          </div>
        </div>

        {/* Loaf Multiplier */}
        <div style={{
          background: C.bgAlt, border: `1px solid ${C.divider}`,
          borderRadius: 14, padding:"16px 18px", marginBottom: 32,
          boxShadow: C.shadowSm,
          display:"flex", alignItems:"center", justifyContent:"space-between",
          maxWidth: isDesktop ? 480 : "none",
        }}>
          <div>
            <div style={{
              fontFamily: BODY, fontSize: 14, color: C.textFaint,
              fontWeight: 500, marginBottom: 4,
            }}>{t("loaves")}</div>
            <div style={{
              fontFamily: DISPLAY, fontSize: 28, color: C.accent,
              fontWeight: 600, letterSpacing: "-0.02em",
              fontVariantNumeric:"tabular-nums",
            }}>
              {num(loaves)}
            </div>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <button onClick={() => setLoaves(Math.max(1,loaves-1))} aria-label="Decrease" style={{
              width:44, height:44, borderRadius:"50%",
              border:`1px solid ${C.divider}`, background: C.bg,
              color: C.text, display:"flex",
              alignItems:"center", justifyContent:"center",
            }}>
              <Icon name="minus" size={18} />
            </button>
            <button onClick={() => setLoaves(loaves+1)} aria-label="Increase" style={{
              width:44, height:44, borderRadius:"50%",
              border:`1px solid ${C.divider}`, background: C.bg,
              color: C.text, display:"flex",
              alignItems:"center", justifyContent:"center",
            }}>
              <Icon name="plus" size={18} />
            </button>
          </div>
        </div>

        {/* Ingredients + Steps — two-column on desktop */}
        {isDesktop ? (
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1.4fr",
            gap: 32,
            alignItems: "start",
          }}>
            <div style={{ position: "sticky", top: 100 }}>
              <div style={{
                fontFamily: BODY, fontSize: 14, color: C.textFaint,
                fontWeight: 600, letterSpacing: "0.02em", textTransform: "uppercase",
                marginBottom: 12,
              }}>{t("ingredients")}</div>
              <GlassPanel style={{ overflow:"hidden" }}>
                {r.ingredients.map((ing, i, arr) => (
                  <div key={i} style={{
                    display:"flex", justifyContent:"space-between",
                    alignItems:"center", padding:"14px 20px",
                    borderBottom: i<arr.length-1 ? `1px solid ${C.divider}` : "none",
                    gap: 12,
                  }}>
                    <div style={{ display:"flex", alignItems:"center", gap: 12 }}>
                      <div style={{
                        width: 32, height: 32, borderRadius: 8,
                        background: C.accentSoft,
                        display:"flex", alignItems:"center", justifyContent:"center",
                        color: C.accent, flexShrink: 0,
                      }}>
                        <Icon name={ing.icon} size={16} />
                      </div>
                      <span style={{
                        fontFamily: BODY, fontSize: 15, color: C.text,
                        fontWeight: 500, letterSpacing: "-0.005em",
                      }}>{isFa ? ing.nameFa : ing.name}</span>
                    </div>
                    <span style={{
                      fontFamily: DISPLAY, fontSize: 17, color: C.accent,
                      fontWeight: 600, fontVariantNumeric:"tabular-nums",
                      whiteSpace:"nowrap", letterSpacing: "-0.01em",
                    }}>
                      {ing.unit ? `${s(ing.amount)}${ing.unit}` : num(ing.amount * loaves)}
                    </span>
                  </div>
                ))}
              </GlassPanel>
            </div>

            <div>
              <div style={{
                fontFamily: BODY, fontSize: 14, color: C.textFaint,
                fontWeight: 600, letterSpacing: "0.02em", textTransform: "uppercase",
                marginBottom: 18,
              }}>{t("steps")}</div>
              {r.steps.map((step, i) => {
                const stepTitle = isFa ? step[2] : step[0];
                const stepBody  = isFa ? step[3] : step[1];
                return (
                  <div key={i} style={{ display:"flex", gap:18, marginBottom: 26 }}>
                    <div style={{
                      width: 44, height: 44, borderRadius:"50%",
                      background: C.accent, color:"#FFFFFF",
                      fontSize: 16, fontWeight: 700, fontFamily: DISPLAY,
                      display:"flex", alignItems:"center", justifyContent:"center",
                      flexShrink:0, marginTop: 2,
                      boxShadow: `0 4px 12px ${C.accent}55`,
                    }}>{num(i+1)}</div>
                    <div style={{ flex:1 }}>
                      <div style={{
                        fontFamily: DISPLAY, fontSize: 20, color: C.text,
                        fontWeight: 600, marginBottom: 6, letterSpacing: "-0.01em",
                      }}>{stepTitle}</div>
                      <div style={{
                        fontFamily: BODY, fontSize: 15, color: C.textSub,
                        lineHeight: 1.6, letterSpacing: "-0.005em",
                      }}>{stepBody}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <>
            <div style={{
              fontFamily: BODY, fontSize: 14, color: C.textFaint,
              fontWeight: 600, letterSpacing: "0.02em", textTransform: "uppercase",
              marginBottom: 12,
            }}>{t("ingredients")}</div>
            <GlassPanel style={{ marginBottom: 32, overflow:"hidden" }}>
              {r.ingredients.map((ing, i, arr) => (
                <div key={i} style={{
                  display:"flex", justifyContent:"space-between",
                  alignItems:"center", padding:"14px 20px",
                  borderBottom: i<arr.length-1 ? `1px solid ${C.divider}` : "none",
                  gap: 12,
                }}>
                  <div style={{ display:"flex", alignItems:"center", gap: 12 }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: 8,
                      background: C.accentSoft,
                      display:"flex", alignItems:"center", justifyContent:"center",
                      color: C.accent, flexShrink: 0,
                    }}>
                      <Icon name={ing.icon} size={16} />
                    </div>
                    <span style={{
                      fontFamily: BODY, fontSize: 15, color: C.text,
                      fontWeight: 500, letterSpacing: "-0.005em",
                    }}>{isFa ? ing.nameFa : ing.name}</span>
                  </div>
                  <span style={{
                    fontFamily: DISPLAY, fontSize: 17, color: C.accent,
                    fontWeight: 600, fontVariantNumeric:"tabular-nums",
                    whiteSpace:"nowrap", letterSpacing: "-0.01em",
                  }}>
                    {ing.unit ? `${s(ing.amount)}${ing.unit}` : num(ing.amount * loaves)}
                  </span>
                </div>
              ))}
            </GlassPanel>

            <div style={{
              fontFamily: BODY, fontSize: 14, color: C.textFaint,
              fontWeight: 600, letterSpacing: "0.02em", textTransform: "uppercase",
              marginBottom: 18,
            }}>{t("steps")}</div>
            {r.steps.map((step, i) => {
              const stepTitle = isFa ? step[2] : step[0];
              const stepBody  = isFa ? step[3] : step[1];
              return (
                <div key={i} style={{ display:"flex", gap:18, marginBottom: 26 }}>
                  <div style={{
                    width: 40, height: 40, borderRadius:"50%",
                    background: C.accent, color:"#FFFFFF",
                    fontSize: 16, fontWeight: 700, fontFamily: DISPLAY,
                    display:"flex", alignItems:"center", justifyContent:"center",
                    flexShrink:0, marginTop: 2,
                    boxShadow: `0 4px 12px ${C.accent}55`,
                  }}>{num(i+1)}</div>
                  <div style={{ flex:1 }}>
                    <div style={{
                      fontFamily: DISPLAY, fontSize: 19, color: C.text,
                      fontWeight: 600, marginBottom: 6, letterSpacing: "-0.01em",
                    }}>{stepTitle}</div>
                    <div style={{
                      fontFamily: BODY, fontSize: 15, color: C.textSub,
                      lineHeight: 1.6, letterSpacing: "-0.005em",
                    }}>{stepBody}</div>
                  </div>
                </div>
              );
            })}
          </>
        )}

        <div style={{
          display:"flex", alignItems:"center", gap: 8,
          marginTop: isDesktop ? 40 : 0,
          marginBottom: 14,
        }}>
          <Icon name="sparkles" size={18} color={C.accent} />
          <span style={{
            fontFamily: BODY, fontSize: 14, color: C.accent,
            fontWeight: 600, letterSpacing: "0.02em", textTransform: "uppercase",
          }}>{t("proTips")}</span>
        </div>
        <GlassPanel style={{
          padding: "22px",
          background: `linear-gradient(135deg, ${C.accentDim}, ${C.glass})`,
        }}>
          <div style={{
            display: isDesktop ? "grid" : "block",
            gridTemplateColumns: isDesktop ? "1fr 1fr" : "none",
            gap: isDesktop ? 16 : 0,
          }}>
            {rTips.map((tip, i) => (
              <div key={i} style={{
                display:"flex", gap:14,
                marginBottom: i<rTips.length-1 && !isDesktop ? 16 : 0,
              }}>
                <div style={{
                  width: 28, height: 28, borderRadius: 8,
                  background: C.accentSoft,
                  display:"flex", alignItems:"center", justifyContent:"center",
                  color: C.accent, flexShrink:0,
                }}>
                  <Icon name="sparkles" size={14} />
                </div>
                <span style={{
                  fontFamily: BODY, fontSize: 15, color: C.textSub,
                  lineHeight: 1.6, letterSpacing: "-0.005em", paddingTop: 2,
                }}>{tip}</span>
              </div>
            ))}
          </div>
        </GlassPanel>
        <PageFooter />
      </div>
    );
  }

  const RecipeCard = ({ r }) => {
    const isFa = lang === "fa";
    const rName     = isFa ? r.nameFa      : r.name;
    const rSub      = isFa ? r.subFa       : r.sub;
    const rTotalTime= isFa ? r.totalTimeFa : r.totalTime;
    return (
      <GlassPanel hoverable onClick={() => setSelected(r.id)}
        style={{ padding:"20px", marginBottom: 12 }}>
        <div style={{ display:"flex", gap:16, alignItems:"center" }}>
          <div style={{
            width: 56, height: 56, borderRadius: 14,
            background: C.accentSoft,
            display:"flex", alignItems:"center", justifyContent:"center",
            color: C.accent, flexShrink: 0,
          }}>
            <Icon name={r.icon} size={30} />
          </div>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{
              fontFamily: DISPLAY, fontSize: 20, color: C.text,
              fontWeight: 600, letterSpacing: "-0.015em",
              marginBottom: 4, lineHeight: 1.2,
            }}>{rName}</div>
            <div style={{
              fontFamily: BODY, fontSize: 15, color: C.textSub,
              letterSpacing: "-0.005em", marginBottom: 10,
            }}>{rSub}</div>
            <div style={{ display:"flex", gap:8, alignItems:"center", flexWrap:"wrap" }}>
              <DiffDots level={r.difficulty} />
              <span style={{ color: C.divider, fontSize: 16 }}>·</span>
              <span style={{
                fontFamily: BODY, fontSize: 14, color: C.textFaint,
                fontWeight: 500, display:"inline-flex", alignItems:"center", gap: 4,
              }}>
                <Icon name="timer" size={14} /> {rTotalTime}
              </span>
              <span style={{ color: C.divider, fontSize: 16 }}>·</span>
              <span style={{
                fontFamily: BODY, fontSize: 14, color: C.textFaint,
                fontWeight: 500, display:"inline-flex", alignItems:"center", gap: 4,
              }}>
                <Icon name="droplet" size={14} /> {num(r.hydration)}%
              </span>
            </div>
          </div>
          <div style={{ color: C.textFaint }}>
            <Icon name="chevronRight" size={24} />
          </div>
        </div>
      </GlassPanel>
    );
  };

  const FamilySection = ({ title, color, recipes, family }) => (
    <div style={{ marginBottom: isDesktop ? 48 : 36 }}>
      <div style={{
        display: "flex", alignItems: "center", gap: 12,
        marginBottom: 20, paddingBottom: 14,
        borderBottom: `1px solid ${C.divider}`,
      }}>
        <div style={{
          width: 44, height: 44, borderRadius: 12,
          background: `${color}18`,
          display:"flex", alignItems:"center", justifyContent:"center",
          color: color,
        }}>
          <Icon name="droplet" size={22} />
        </div>
        <div>
          <div style={{
            fontFamily: DISPLAY,
            fontSize: isDesktop ? 26 : 22,
            color: C.text, fontWeight: 600,
            letterSpacing: "-0.015em", lineHeight: 1.1,
          }}>{title}</div>
          <div style={{
            fontFamily: BODY, fontSize: 14, color: C.textFaint,
            marginTop: 2,
          }}>
            {family === "low" ? "50–60%" : family === "medium" ? "65–72%" : "78–85%"} · {num(recipes.length)} {t("recipesCount")}
          </div>
        </div>
      </div>
      <div style={{
        display: "grid",
        gridTemplateColumns: bp.mobile ? "1fr" : bp.tablet ? "1fr 1fr" : "1fr 1fr",
        gap: bp.mobile ? 0 : 16,
      }}>
        {recipes.map(r => <RecipeCard key={r.id} r={r} />)}
      </div>
    </div>
  );

  return (
    <div style={{
      padding: bp.mobile ? "0 24px 32px" : bp.tablet ? "0 40px 40px" : "0 48px 48px",
    }} className="fade-up">
      <SectionTitle title={t("recipesTitle")} sub={t("recipesSub2")} />
      <FamilySection title={t("lowHydration")} color={C.success} recipes={lowRecipes} family="low" />
      <FamilySection title={t("mediumHydration")} color={C.accent} recipes={mediumRecipes} family="medium" />
      <FamilySection title={t("highHydration")} color={C.danger} recipes={highRecipes} family="high" />
      <PageFooter />
    </div>
  );
}

// ─── GUIDE TAB (with sticky sidebar on desktop) ────────────────────────────
function GuideTab() {
  const { C, t, lang, getFont, bp } = useApp();
  const [open, setOpen] = useState(1);
  const isFa = lang === "fa";
  const isDesktop = bp.desktop || bp.wide;

  const bakersRows = isFa ? [
    ["آبیاری",   "آب ÷ آرد × ۱۰۰",     "۶۵–۸۵٪"],
    ["استارتر",  "استارتر ÷ آرد × ۱۰۰", "۱۰–۲۰٪"],
    ["نمک",      "نمک ÷ آرد × ۱۰۰",     "۱٫۸–۲٫۲٪"],
  ] : [
    ["Hydration", "Water ÷ Flour × 100",     "65–85%"],
    ["Starter",   "Starter ÷ Flour × 100",   "10–20%"],
    ["Salt",      "Salt ÷ Flour × 100",      "1.8–2.2%"],
  ];

  const stepsPanel = (
    <div>
      {GUIDE.map((step) => {
        const phase  = isFa ? step.phaseFa  : step.phase;
        const title  = isFa ? step.titleFa  : step.title;
        const body   = isFa ? step.bodyFa   : step.body;
        const checks = isFa ? step.checksFa : step.checks;
        const tip    = isFa ? step.tipFa    : step.tip;
        const timers = isFa ? step.timersFa : step.timers;
        const isOpen = open === step.id;
        return (
          <GlassPanel key={step.id} style={{ marginBottom: 12, overflow:"hidden" }}>
            <button onClick={() => setOpen(isOpen ? null : step.id)} style={{
              display:"flex", alignItems:"center", gap:16,
              width:"100%", textAlign:"left",
              padding:"18px 20px", background: "transparent", minHeight: 76,
            }}>
              <div style={{
                width: 48, height: 48, borderRadius:"50%",
                background: C.accentSoft,
                display:"flex", alignItems:"center", justifyContent:"center",
                color: C.accent, flexShrink:0,
              }}>
                <Icon name={step.icon} size={24} />
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{
                  fontFamily: BODY, fontSize: 14, color: C.accent,
                  fontWeight: 600, letterSpacing: "0.02em",
                  textTransform: "uppercase", marginBottom: 4,
                }}>{phase}</div>
                <div style={{
                  fontFamily: DISPLAY, fontSize: 19, color: C.text,
                  fontWeight: 600, letterSpacing: "-0.015em", lineHeight: 1.2,
                }}>{title}</div>
              </div>
              <div style={{
                color: C.textFaint,
                transform: isOpen ? "rotate(90deg)" : "none",
                transition:"transform 0.3s cubic-bezier(0.32, 0.72, 0, 1)",
              }}>
                <Icon name="chevronRight" size={24} />
              </div>
            </button>
            {isOpen && (
              <div style={{
                background: C.accentDim,
                padding:"22px 22px 24px",
                borderTop: `1px solid ${C.divider}`,
                animation:"fadeUp 0.4s cubic-bezier(0.32, 0.72, 0, 1)",
              }}>
                <p style={{
                  fontFamily: BODY, fontSize: 15, color: C.textSub,
                  lineHeight: 1.65, marginBottom: 20,
                }}>{body}</p>
                {checks.length > 0 && (
                  <>
                    <div style={{
                      fontFamily: BODY, fontSize: 14, color: C.accent,
                      fontWeight: 600, letterSpacing: "0.02em",
                      textTransform: "uppercase", marginBottom: 12,
                    }}>{t("checks")}</div>
                    {checks.map((c,i) => (
                      <div key={i} style={{
                        display:"flex", gap:12, alignItems:"flex-start", marginBottom: 10,
                      }}>
                        <div style={{
                          width: 20, height: 20, borderRadius: 6,
                          border: `1.5px solid ${C.accent}`, flexShrink:0, marginTop: 1,
                        }} />
                        <span style={{
                          fontFamily: BODY, fontSize: 15, color: C.textSub,
                          lineHeight: 1.5,
                        }}>{c}</span>
                      </div>
                    ))}
                  </>
                )}
                {timers.length > 0 && (
                  <div style={{ marginTop: 22 }}>
                    <div style={{
                      fontFamily: BODY, fontSize: 14, color: C.accent,
                      fontWeight: 600, letterSpacing: "0.02em",
                      textTransform: "uppercase", marginBottom: 12,
                    }}>{t("timerLabel")}</div>
                    {timers.map(timer => <StepTimer key={timer.label} label={timer.label} minutes={timer.minutes} />)}
                  </div>
                )}
                <div style={{
                  marginTop: 22, padding:"16px 18px",
                  background: C.bgAlt, borderRadius: 14,
                  border: `1px solid ${C.divider}`,
                  display:"flex", gap: 12, alignItems: "flex-start",
                }}>
                  <Icon name="sparkles" size={20} color={C.accent} style={{ marginTop: 2, flexShrink: 0 }} />
                  <span style={{
                    fontFamily: BODY, fontSize: 14, color: C.textSub,
                    lineHeight: 1.6,
                  }}>
                    {tip}
                  </span>
                </div>
              </div>
            )}
          </GlassPanel>
        );
      })}
    </div>
  );

  const bakersPanel = (
    <GlassPanel style={{ padding: "26px 24px", position: isDesktop ? "sticky" : "static", top: 100 }}>
      <div style={{
        fontFamily: DISPLAY, fontSize: 24, color: C.text,
        fontWeight: 600, marginBottom: 12, letterSpacing: "-0.015em",
      }}>{t("bakersPercent")}</div>
      <p style={{
        fontFamily: BODY, fontSize: 15, color: C.textSub,
        marginBottom: 20, lineHeight: 1.6,
      }}>
        {t("bakersMathBody")}
      </p>
      {bakersRows.map(([n,f,ex], i) => (
        <div key={n} style={{
          borderTop: i > 0 ? `1px solid ${C.divider}` : "none",
          paddingTop: i > 0 ? 14 : 0,
          marginTop: i > 0 ? 14 : 0,
          display:"flex", justifyContent:"space-between",
          alignItems:"baseline", gap: 12,
        }}>
          <span style={{
            fontFamily: DISPLAY, fontSize: 17, color: C.text,
            fontWeight: 600, letterSpacing: "-0.01em",
          }}>{n}</span>
          <span style={{
            fontFamily: BODY, fontSize: 14, color: C.accent,
            fontVariantNumeric:"tabular-nums", fontWeight: 500,
          }}>{f}</span>
          <span style={{
            fontFamily: BODY, fontSize: 14, color: C.textFaint,
            fontStyle:"italic", minWidth: 70, textAlign:"right",
          }}>{ex}</span>
        </div>
      ))}
    </GlassPanel>
  );

  return (
    <div style={{
      padding: bp.mobile ? "0 24px 32px" : bp.tablet ? "0 40px 40px" : "0 48px 48px",
    }} className="fade-up">
      <SectionTitle title={t("guideTitle")} sub={t("guideSub2")} />

      {isDesktop ? (
        <div style={{
          display: "grid",
          gridTemplateColumns: bp.wide ? "1.4fr 1fr" : "1.2fr 1fr",
          gap: 32,
          alignItems: "start",
        }}>
          {stepsPanel}
          {bakersPanel}
        </div>
      ) : (
        <>
          {stepsPanel}
          <div style={{ marginTop: 28 }}>{bakersPanel}</div>
        </>
      )}
      <PageFooter />
    </div>
  );
}

// ─── TROUBLESHOOT TAB ──────────────────────────────────────────────────────
function TroubleTab() {
  const { C, t, lang, bp } = useApp();
  const [open, setOpen] = useState(null);
  const isFa = lang === "fa";

  const glossary = isFa ? [
    ["لوون / استارتر","کشت زنده مخمر وحشی و باکتری."],
    ["تخمیر حجمی","مرحله اصلی تخمیر که کل توده خمیر با هم تخمیر می‌کند."],
    ["اتولیز","استراحت آرد و آب بدون استارتر."],
    ["آبیاری","آب به عنوان درصدی از وزن آرد."],
    ["بانتون","سبد تخمیر که شکل خمیر را حفظ می‌کند."],
    ["پف فر","بالا آمدن سریع در دقایق اول پخت."],
    ["برش زدن","بریدن سطح خمیر قبل از پختن."],
    ["آزمایش پنجره","کشش خمیر تا نازک شود."],
  ] : [
    ["Levain / Starter","A live culture of wild yeast and bacteria. The leavening agent for all sourdough."],
    ["Bulk fermentation","The main phase where the whole dough mass ferments together, typically 4–8 hours."],
    ["Autolyse","Resting flour and water without starter for passive gluten development."],
    ["Hydration","Water as a percentage of flour weight. Higher = wetter dough, more open crumb."],
    ["Banneton","A proofing basket that supports the dough's shape while proofing."],
    ["Oven spring","The rapid rise in the first minutes of baking as gases expand from heat."],
    ["Scoring","Cutting dough surface with a razor before baking to control how it opens."],
    ["Windowpane test","Stretching dough thin enough to see light through — confirms good gluten development."],
  ];

  const isDesktop = bp.desktop || bp.wide;

  return (
    <div style={{
      padding: bp.mobile ? "0 24px 32px" : bp.tablet ? "0 40px 40px" : "0 48px 48px",
    }} className="fade-up">
      <SectionTitle title={t("troubleTitle")} sub={t("troubleSub2")} />

      {isDesktop ? (
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 16,
        }}>
          {TROUBLE.map((tr,i) => {
            const problem = isFa ? tr.problemFa : tr.problem;
            const causes  = isFa ? tr.causesFa  : tr.causes;
            const fixes   = isFa ? tr.fixesFa   : tr.fixes;
            const isOpen = open === i;
            return (
              <GlassPanel key={i} style={{ overflow:"hidden", height: "fit-content" }}>
                <button onClick={() => setOpen(isOpen ? null : i)} style={{
                  display:"flex", alignItems:"center", gap:16,
                  width:"100%", textAlign:"left",
                  padding:"18px 20px", background: "transparent", minHeight: 72,
                }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: 12,
                    background: `${C.danger}20`,
                    display:"flex", alignItems:"center", justifyContent:"center",
                    color: C.danger, flexShrink: 0,
                  }}>
                    <Icon name={tr.icon} size={24} />
                  </div>
                  <span style={{
                    fontFamily: DISPLAY, fontSize: 17, color: C.text,
                    fontWeight: 600, flex:1,
                    letterSpacing: "-0.01em", lineHeight: 1.3,
                  }}>{problem}</span>
                  <div style={{
                    color: C.textFaint,
                    transform: isOpen ? "rotate(90deg)" : "none",
                    transition:"transform 0.3s cubic-bezier(0.32, 0.72, 0, 1)",
                  }}>
                    <Icon name="chevronRight" size={22} />
                  </div>
                </button>
                {isOpen && (
                  <div style={{
                    background: C.accentDim,
                    padding:"22px 22px 24px",
                    borderTop: `1px solid ${C.divider}`,
                    animation:"fadeUp 0.4s cubic-bezier(0.32, 0.72, 0, 1)",
                  }}>
                    <div style={{ display:"flex", alignItems:"center", gap: 8, marginBottom: 14 }}>
                      <Icon name="alert" size={16} color={C.danger} />
                      <span style={{
                        fontFamily: BODY, fontSize: 14, color: C.danger,
                        fontWeight: 600, letterSpacing: "0.02em", textTransform: "uppercase",
                      }}>{t("likelyCauses")}</span>
                    </div>
                    {causes.map((c,j) => (
                      <div key={j} style={{
                        display:"flex", gap:12, alignItems:"flex-start", marginBottom: 10,
                      }}>
                        <div style={{
                          width: 20, height: 20, borderRadius: 6,
                          background: `${C.danger}20`,
                          display:"flex", alignItems:"center", justifyContent:"center",
                          color: C.danger, flexShrink:0, marginTop: 1,
                        }}>
                          <Icon name="x" size={12} />
                        </div>
                        <span style={{
                          fontFamily: BODY, fontSize: 15, color: C.textSub, lineHeight: 1.5,
                        }}>{c}</span>
                      </div>
                    ))}
                    <div style={{
                      display:"flex", alignItems:"center", gap: 8,
                      margin:"22px 0 14px", paddingTop: 20,
                      borderTop: `1px solid ${C.divider}`,
                    }}>
                      <Icon name="check" size={16} color={C.success} />
                      <span style={{
                        fontFamily: BODY, fontSize: 14, color: C.success,
                        fontWeight: 600, letterSpacing: "0.02em", textTransform: "uppercase",
                      }}>{t("howToFix")}</span>
                    </div>
                    {fixes.map((f,j) => (
                      <div key={j} style={{
                        display:"flex", gap:12, alignItems:"flex-start", marginBottom: 10,
                      }}>
                        <div style={{
                          width: 20, height: 20, borderRadius: 6,
                          background: `${C.success}20`,
                          display:"flex", alignItems:"center", justifyContent:"center",
                          color: C.success, flexShrink:0, marginTop: 1,
                        }}>
                          <Icon name="check" size={12} />
                        </div>
                        <span style={{
                          fontFamily: BODY, fontSize: 15, color: C.textSub, lineHeight: 1.5,
                        }}>{f}</span>
                      </div>
                    ))}
                  </div>
                )}
              </GlassPanel>
            );
          })}
        </div>
      ) : (
        TROUBLE.map((tr,i) => {
          const problem = isFa ? tr.problemFa : tr.problem;
          const causes  = isFa ? tr.causesFa  : tr.causes;
          const fixes   = isFa ? tr.fixesFa   : tr.fixes;
          const isOpen = open === i;
          return (
            <GlassPanel key={i} style={{ marginBottom: 12, overflow:"hidden" }}>
              <button onClick={() => setOpen(isOpen ? null : i)} style={{
                display:"flex", alignItems:"center", gap:16,
                width:"100%", textAlign:"left",
                padding:"18px 20px", background: "transparent", minHeight: 72,
              }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 12,
                  background: `${C.danger}20`,
                  display:"flex", alignItems:"center", justifyContent:"center",
                  color: C.danger, flexShrink: 0,
                }}>
                  <Icon name={tr.icon} size={24} />
                </div>
                <span style={{
                  fontFamily: DISPLAY, fontSize: 17, color: C.text,
                  fontWeight: 600, flex:1,
                  letterSpacing: "-0.01em", lineHeight: 1.3,
                }}>{problem}</span>
                <div style={{
                  color: C.textFaint,
                  transform: isOpen ? "rotate(90deg)" : "none",
                  transition:"transform 0.3s cubic-bezier(0.32, 0.72, 0, 1)",
                }}>
                  <Icon name="chevronRight" size={22} />
                </div>
              </button>
              {isOpen && (
                <div style={{
                  background: C.accentDim,
                  padding:"22px 22px 24px",
                  borderTop: `1px solid ${C.divider}`,
                  animation:"fadeUp 0.4s cubic-bezier(0.32, 0.72, 0, 1)",
                }}>
                  <div style={{ display:"flex", alignItems:"center", gap: 8, marginBottom: 14 }}>
                    <Icon name="alert" size={16} color={C.danger} />
                    <span style={{
                      fontFamily: BODY, fontSize: 14, color: C.danger,
                      fontWeight: 600, letterSpacing: "0.02em", textTransform: "uppercase",
                    }}>{t("likelyCauses")}</span>
                  </div>
                  {causes.map((c,j) => (
                    <div key={j} style={{
                      display:"flex", gap:12, alignItems:"flex-start", marginBottom: 10,
                    }}>
                      <div style={{
                        width: 20, height: 20, borderRadius: 6,
                        background: `${C.danger}20`,
                        display:"flex", alignItems:"center", justifyContent:"center",
                        color: C.danger, flexShrink:0, marginTop: 1,
                      }}>
                        <Icon name="x" size={12} />
                      </div>
                      <span style={{
                        fontFamily: BODY, fontSize: 15, color: C.textSub, lineHeight: 1.5,
                      }}>{c}</span>
                    </div>
                  ))}
                  <div style={{
                    display:"flex", alignItems:"center", gap: 8,
                    margin:"22px 0 14px", paddingTop: 20,
                    borderTop: `1px solid ${C.divider}`,
                  }}>
                    <Icon name="check" size={16} color={C.success} />
                    <span style={{
                      fontFamily: BODY, fontSize: 14, color: C.success,
                      fontWeight: 600, letterSpacing: "0.02em", textTransform: "uppercase",
                    }}>{t("howToFix")}</span>
                  </div>
                  {fixes.map((f,j) => (
                    <div key={j} style={{
                      display:"flex", gap:12, alignItems:"flex-start", marginBottom: 10,
                    }}>
                      <div style={{
                        width: 20, height: 20, borderRadius: 6,
                        background: `${C.success}20`,
                        display:"flex", alignItems:"center", justifyContent:"center",
                        color: C.success, flexShrink:0, marginTop: 1,
                      }}>
                        <Icon name="check" size={12} />
                      </div>
                      <span style={{
                        fontFamily: BODY, fontSize: 15, color: C.textSub, lineHeight: 1.5,
                      }}>{f}</span>
                    </div>
                  ))}
                </div>
              )}
            </GlassPanel>
          );
        })
      )}

      <GlassPanel style={{ marginTop: 28, padding: "26px 24px" }}>
        <div style={{
          fontFamily: DISPLAY, fontSize: 24, color: C.text,
          fontWeight: 600, marginBottom: 18, letterSpacing: "-0.015em",
        }}>{t("quickGlossary")}</div>
        <div style={{
          display: isDesktop ? "grid" : "block",
          gridTemplateColumns: "1fr 1fr",
          gap: isDesktop ? "0 32px" : 0,
        }}>
          {glossary.map(([term,def], i) => (
            <div key={term} style={{
              borderTop: i > 0 && !isDesktop ? `1px solid ${C.divider}` : (isDesktop && i >= 2 ? `1px solid ${C.divider}` : "none"),
              paddingTop: (isDesktop && i >= 2) ? 18 : (i > 0 && !isDesktop ? 18 : 0),
              marginTop: (isDesktop && i >= 2) ? 18 : (i > 0 && !isDesktop ? 18 : 0),
              paddingBottom: isDesktop ? 18 : 0,
              display:"grid",
              gridTemplateColumns: "minmax(130px, 0.7fr) 1fr",
              gap: 20, alignItems:"baseline",
            }}>
              <div style={{
                fontFamily: DISPLAY, fontSize: 16, color: C.accent,
                fontWeight: 600, letterSpacing: "-0.01em",
              }}>{term}</div>
              <div style={{
                fontFamily: BODY, fontSize: 15, color: C.textSub, lineHeight: 1.6,
              }}>{def}</div>
            </div>
          ))}
        </div>
      </GlassPanel>
      <PageFooter />
    </div>
  );
}

// ─── MAIN APP ──────────────────────────────────────────────────────────────
const TABS = [
  { id:"home",    icon:"home",    labelKey:"home"       },
  { id:"calc",    icon:"scale",   labelKey:"calculator" },
  { id:"recipes", icon:"book",    labelKey:"recipes"    },
  { id:"guide",   icon:"compass", labelKey:"guide"      },
  { id:"trouble", icon:"wrench",  labelKey:"fix"        },
];

export default function App() {
  const [tab,   setTab]   = useState("home");
  const [theme, setTheme] = useState("light");
  const [lang,  setLang]  = useState("en");
  const bp = useBreakpoint();

  const C       = theme === "dark" ? DARK : LIGHT;
  const isRTL   = lang === "fa";
  const t       = (key) => T[lang]?.[key] ?? T.en?.[key] ?? key;
  const getFont = (type) => {
    if (isRTL) return FARSI;
    return type === "display" ? DISPLAY : BODY;
  };
  const num = (v) => isRTL ? toFaNum(v) : String(v);

  useEffect(() => {
    updateGlobalStyles(C);
    document.documentElement.dir  = isRTL ? "rtl" : "ltr";
    document.documentElement.lang = lang;
  }, [theme, lang, C, isRTL]);

  const ctxValue = { C, t, lang, theme, isRTL, getFont, setTheme, setLang, num, bp };

  const setTabProxy = (target) => {
    if (target === "starter") { setTab("calc"); }
    else if (target === "pizza") { setTab("pizza"); }
    else setTab(target);
  };

  const renderContent = () => {
    switch(tab) {
      case "home":    return <HomeTab setTab={setTabProxy} />;
      case "calc":    return <CalcTab initialMode="bread" />;
      case "pizza":   return <CalcTab initialMode="pizza" />;
      case "recipes": return <RecipesTab />;
      case "guide":   return <GuideTab />;
      case "trouble": return <TroubleTab />;
      default:        return <HomeTab setTab={setTabProxy} />;
    }
  };

  const isCalcTabActive = tab === "calc" || tab === "pizza";

  // Responsive max-width
  const maxWidth = bp.mobile ? 520 : bp.tablet ? 820 : bp.desktop ? 1280 : 1600;
  // Responsive padding in main content
  const contentPadding = bp.mobile ? 20 : bp.tablet ? 40 : 48;

  return (
    <AppCtx.Provider value={ctxValue}>
      <div style={{
        minHeight:"100vh", background: C.bg,
        display:"flex", justifyContent:"center",
        fontFamily: BODY, transition:"background 0.4s ease",
        position: "relative",
      }}>
        <BackgroundDecor />

        <div style={{
          width:"100%",
          maxWidth: maxWidth,
          display:"flex", flexDirection:"column",
          minHeight:"100vh", position: "relative",
          zIndex: 1,
        }}>

          {/* Header */}
          <header style={{
            padding: bp.mobile ? "12px 20px" : bp.tablet ? "14px 40px" : "16px 48px",
            borderBottom: `1px solid ${C.divider}`,
            background: C.glass,
            backdropFilter: "blur(24px) saturate(180%)",
            WebkitBackdropFilter: "blur(24px) saturate(180%)",
            position:"sticky", top:0, zIndex: 20,
            display:"flex", alignItems:"center",
            justifyContent:"space-between",
            gap: 16,
          }}>
            <div style={{
              display:"flex", alignItems:"center",
              gap: bp.mobile ? 12 : 16, flex: 1, minWidth: 0,
            }}>
              <div style={{
                width: bp.mobile ? 44 : 52,
                height: bp.mobile ? 44 : 52,
                borderRadius: bp.mobile ? 12 : 14,
                background: `linear-gradient(135deg, ${C.accent}, ${C.accent}CC)`,
                display:"flex", alignItems:"center", justifyContent:"center",
                color: "#FFFFFF",
                boxShadow: `0 4px 12px ${C.accent}55`,
                flexShrink: 0,
              }}>
                <Icon name="bread" size={bp.mobile ? 24 : 28} color="#FFFFFF" />
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{
                  fontFamily: DISPLAY,
                  fontSize: bp.mobile ? 18 : bp.tablet ? 20 : 22,
                  color: C.text, fontWeight: 600,
                  letterSpacing: "-0.015em", lineHeight: 1,
                }}>{t("appName")}</div>
                <div style={{
                  fontFamily: BODY,
                  fontSize: bp.mobile ? 14 : 15,
                  color: C.textFaint, marginTop: 2,
                  letterSpacing: "-0.005em",
                  overflow: "hidden", textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}>{t("appTagline")}</div>
              </div>
            </div>

            {/* Desktop-only navigation hint */}
            {!bp.mobile && (
              <nav style={{
                display: bp.tablet ? "none" : "flex",
                gap: 4,
                background: C.bgAlt,
                padding: 4,
                borderRadius: 999,
                border: `1px solid ${C.divider}`,
                boxShadow: C.shadowSm,
              }}>
                {TABS.map(tItem => {
                  const active = tItem.id === tab || (tItem.id === "calc" && isCalcTabActive);
                  return (
                    <button key={tItem.id} onClick={() => setTab(tItem.id)} style={{
                      padding: "8px 16px",
                      borderRadius: 999,
                      background: active ? C.accent : "transparent",
                      color: active ? "#FFFFFF" : C.textSub,
                      fontFamily: BODY, fontSize: 14, fontWeight: 600,
                      display: "flex", alignItems: "center", gap: 8,
                      minHeight: 36,
                    }}>
                      <Icon name={tItem.icon} size={16} color={active ? "#FFFFFF" : C.textSub} />
                      {t(tItem.labelKey)}
                    </button>
                  );
                })}
              </nav>
            )}

            <div style={{ display:"flex", gap:8, alignItems:"center", flexShrink: 0 }}>
              <button
                onClick={() => setLang(l => l === "en" ? "fa" : "en")}
                aria-label={lang==="en" ? "Switch to Farsi" : "Switch to English"}
                style={{
                  width: 80, height: 44, borderRadius: 999,
                  border: `1px solid ${C.divider}`,
                  background: C.bgAlt, color: C.text,
                  fontFamily: BODY, fontSize: 14, fontWeight: 600,
                  boxShadow: C.shadowSm,
                  display: "flex", alignItems:"center",
                  justifyContent:"center", gap: 6,
                }}
              >
                <Icon name="globe" size={16} />
                {lang==="en" ? "فارسی" : "EN"}
              </button>
              <button
                onClick={() => setTheme(th => th === "dark" ? "light" : "dark")}
                aria-label={theme==="dark" ? "Light mode" : "Dark mode"}
                style={{
                  width: 44, height: 44, borderRadius: "50%",
                  border: `1px solid ${C.divider}`,
                  background: C.bgAlt, color: C.text,
                  display:"flex", alignItems:"center",
                  justifyContent:"center",
                  boxShadow: C.shadowSm,
                }}
              >
                <Icon name={theme==="dark" ? "sun" : "moon"} size={20} />
              </button>
            </div>
          </header>

          {/* Main content */}
          <main style={{
            flex:1, overflowY:"auto",
            paddingTop: contentPadding,
            paddingBottom: bp.mobile ? 100 : contentPadding,
          }} className="ls">
            {renderContent()}
          </main>

          {/* Bottom nav - mobile & tablet only */}
          {(bp.mobile || bp.tablet) && (
            <nav aria-label="Main navigation" style={{
              display:"flex",
              borderTop: `1px solid ${C.divider}`,
              background: C.glass,
              backdropFilter: "blur(24px) saturate(180%)",
              WebkitBackdropFilter: "blur(24px) saturate(180%)",
              position:"sticky", bottom:0,
              paddingBottom:"max(env(safe-area-inset-bottom,0px),8px)",
              paddingTop: 6,
              zIndex: 15,
            }}>
              {TABS.map(tItem => {
                const active = tItem.id === tab || (tItem.id === "calc" && isCalcTabActive);
                return (
                  <button
                    key={tItem.id}
                    onClick={() => setTab(tItem.id)}
                    aria-label={t(tItem.labelKey)}
                    aria-current={active ? "page" : undefined}
                    style={{
                      flex:1, paddingTop: 10, paddingBottom: 8,
                      background:"transparent", border:"none",
                      display:"flex", flexDirection:"column",
                      alignItems:"center", gap: 4,
                      position:"relative", minHeight: 60,
                    }}
                  >
                    <div style={{
                      color: active ? C.accent : C.textFaint,
                      transition:"all 0.2s",
                      transform: active ? "translateY(-2px)" : "none",
                    }}>
                      <Icon name={tItem.icon} size={24} />
                    </div>
                    <span style={{
                      fontFamily: BODY, fontSize: 14,
                      color: active ? C.accent : C.textFaint,
                      fontWeight: active ? 600 : 500,
                      letterSpacing: "-0.005em",
                    }}>{t(tItem.labelKey)}</span>
                    {active && <div style={{
                      position:"absolute", top: 0,
                      left: "25%", right: "25%",
                      height: 2, borderRadius: 1,
                      background: C.accent,
                    }} />}
                  </button>
                );
              })}
            </nav>
          )}

        </div>
      </div>
    </AppCtx.Provider>
  );
}
