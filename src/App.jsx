import { useState, useMemo, useEffect, useContext, createContext } from "react";
import InstallPrompt from "./InstallPrompt";

const AppCtx = createContext(null);
export const useApp = () => useContext(AppCtx);

function useBreakpoint() {
  const [bp, setBp] = useState(() => {
    if (typeof window === "undefined") return { mobile: true, tablet: false, desktop: false, wide: false };
    const w = window.innerWidth;
    return { mobile: w < 640, tablet: w >= 640 && w < 1024, desktop: w >= 1024 && w < 1440, wide: w >= 1440 };
  });
  useEffect(() => {
    let rafId;
    const update = () => {
      const w = window.innerWidth;
      setBp({ mobile: w < 640, tablet: w >= 640 && w < 1024, desktop: w >= 1024 && w < 1440, wide: w >= 1440 });
    };
    const onResize = () => { cancelAnimationFrame(rafId); rafId = requestAnimationFrame(update); };
    window.addEventListener("resize", onResize, { passive: true });
    return () => { window.removeEventListener("resize", onResize); cancelAnimationFrame(rafId); };
  }, []);
  return bp;
}

function useSystemTheme() {
  const [systemTheme, setSystemTheme] = useState(() => {
    if (typeof window === "undefined") return "dark";
    return window.matchMedia?.("(prefers-color-scheme: light)").matches ? "light" : "dark";
  });
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-color-scheme: light)");
    const handler = (e) => setSystemTheme(e.matches ? "light" : "dark");
    mq.addEventListener?.("change", handler);
    return () => mq.removeEventListener?.("change", handler);
  }, []);
  return systemTheme;
}

(() => {
  if (typeof document === "undefined") return;
  if (document.getElementById("levain-fonts-v10")) return;
  const link = document.createElement("link");
  link.id = "levain-fonts-v10"; link.rel = "stylesheet";
  link.href = "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300..900&family=Vazirmatn:wght@300..900&display=swap";
  document.head.appendChild(link);
})();

function updateGlobalStyles(C) {
  let s = document.getElementById("levain-boot-v10");
  if (!s) { s = document.createElement("style"); s.id = "levain-boot-v10"; document.head.appendChild(s); }
  s.textContent = `
    @keyframes fadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes drift { 0% { transform: translate(0, 0) scale(1); } 50% { transform: translate(-20px, 15px) scale(1.08); } 100% { transform: translate(0, 0) scale(1); } }
    html { font-size: 16px; scroll-behavior: smooth; }
    html, body { background: ${C.bg} !important; color: ${C.text}; transition: background 0.6s cubic-bezier(0.2, 0.8, 0.2, 1), color 0.6s ease; -webkit-font-smoothing: antialiased; overscroll-behavior-y: none; }
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    ::selection { background: ${C.accentSoft}; color: ${C.accent}; }
    input[type=range] { -webkit-appearance: none; width: 100%; height: 8px; background: ${C.divider}; border-radius: 999px; outline: none; cursor: pointer; }
    input[type=range]::-webkit-slider-thumb { -webkit-appearance: none; width: 28px; height: 28px; border-radius: 50%; background: #FFFFFF; cursor: pointer; box-shadow: 0 2px 6px rgba(0,0,0,0.15), 0 8px 24px rgba(0,0,0,0.12); margin-top: -10px; }
    .ls::-webkit-scrollbar { width: 12px; }
    .ls::-webkit-scrollbar-track { background: transparent; }
    .ls::-webkit-scrollbar-thumb { background: transparent; border-radius: 999px; border: 4px solid transparent; background-clip: padding-box; }
    .ls:hover::-webkit-scrollbar-thumb { background: ${C.scrollThumb}; background-clip: padding-box; border: 4px solid transparent; }
    button:focus-visible, input:focus-visible { outline: 2px solid ${C.accent}; outline-offset: 4px; border-radius: 12px; }
    button { font-family: inherit; border: none; background: none; cursor: pointer; -webkit-tap-highlight-color: transparent; }
    button:active:not(:disabled) { transform: scale(0.96); }
    .fade-up { animation: fadeUp 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
    .drift { animation: drift 30s ease-in-out infinite; }
    .emoji { font-family: "Apple Color Emoji", "Segoe UI Emoji", sans-serif; font-style: normal; line-height: 1; }
    @supports (padding: max(0px)) {
      .pwa-header { padding-top: max(16px, env(safe-area-inset-top)) !important; }
      .pwa-bottom-nav { padding-bottom: max(8px, env(safe-area-inset-bottom)) !important; }
    }
  `;
}

const LIGHT = { bg: "#F2F2F7", bgAlt: "#FFFFFF", glass: "rgba(255, 255, 255, 0.65)", glassBorder: "rgba(255, 255, 255, 0.5)", glassShadow: "0 8px 32px rgba(0, 0, 0, 0.04)", glassHighlight: "inset 0 1px 1px rgba(255, 255, 255, 0.8)", text: "#1C1C1E", textSub: "#48484A", textFaint: "#8E8E93", divider: "rgba(0, 0, 0, 0.06)", dividerSoft: "rgba(0, 0, 0, 0.03)", accent: "#FF6B35", accentSoft: "rgba(255, 107, 53, 0.12)", accentDim: "rgba(255, 107, 53, 0.06)", accentDeep: "#E85A2D", success: "#34C759", danger: "#FF3B30", scrollThumb: "rgba(0, 0, 0, 0.15)", scrollThumbHover: "rgba(0, 0, 0, 0.3)", decorGlow: "rgba(255, 107, 53, 0.15)" };
const DARK = { bg: "#0A0604", bgAlt: "#1A110A", glass: "rgba(26, 17, 10, 0.6)", glassBorder: "rgba(232, 166, 74, 0.12)", glassShadow: "0 8px 32px rgba(0, 0, 0, 0.4)", glassHighlight: "inset 0 1px 0 rgba(255, 255, 255, 0.08)", text: "#F5EBD4", textSub: "#C9B08A", textFaint: "#8B7355", divider: "rgba(232, 166, 74, 0.14)", dividerSoft: "rgba(232, 166, 74, 0.07)", accent: "#E8A64A", accentSoft: "rgba(232, 166, 74, 0.2)", accentDim: "rgba(232, 166, 74, 0.08)", accentDeep: "#B87A1E", success: "#30D158", danger: "#FF453A", scrollThumb: "rgba(232, 166, 74, 0.28)", scrollThumbHover: "rgba(232, 166, 74, 0.45)", decorGlow: "rgba(232, 166, 74, 0.14)" };
const DISPLAY = "'Fraunces', Georgia, serif";
const BODY = "-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif";
const FARSI = "'Vazirmatn', sans-serif";

const EMOJI_MAP = { home: "🏠", scale: "⚖️", book: "📖", compass: "🧭", wrench: "🔧", bread: "🍞", pizza: "🍕", flask: "🧪", wheat: "🌾", droplet: "💧", salt: "🧂", timer: "⏱️", sparkles: "✨", sun: "☀️", moon: "🌙", globe: "🌍", flame: "🔥", check: "✅", x: "❌", plus: "➕", minus: "➖", chevronRight: "›", arrowLeft: "←", copy: "📋", oven: "♨️", woodfire: "🪵", cheese: "🧀", tomato: "🍅", olive: "🫒", leaf: "🌿", flatbread: "🫓", loaf: "🍞", baguette: "🥖", pretzel: "🥨", bagel: "🥯", bun: "🥐", focaccia: "🫓", ciabatta: "🥖", rye: "🍞", artisan: "🥖", alert: "⚠️", flat: "📉", brick: "🧱", sticky: "🍯", hole: "⭕", sleepy: "😴", silent: "🤫" };
const Icon = ({ name, size = 24, color = "currentColor", style = {} }) => {
  const emoji = EMOJI_MAP[name] || "•";
  const isChevron = name === "chevronRight" || name === "arrowLeft";
  return <span className="emoji" aria-hidden="true" style={{ fontSize: isChevron ? size * 1.4 : size, lineHeight: 1, display: "inline-flex", alignItems: "center", justifyContent: "center", width: size, height: size, color: isChevron ? color : undefined, fontWeight: isChevron ? 300 : undefined, fontFamily: isChevron ? BODY : undefined, verticalAlign: "middle", flexShrink: 0, ...style }}>{emoji}</span>;
};

const FA_DIGITS = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
function toFaNum(str) { return String(str).replace(/[0-9]/g, (d) => FA_DIGITS[+d]); }

const T = {
  en: { appName: "Levain", appTagline: "Sourdough Companion", taglineSub: "Your complete sourdough companion — from starter to scoring.", toolsSections: "Tools", doughCalc: "Dough Calculator", doughCalcSub: "Baker's math", pizzaCalc: "Pizza Calculator", pizzaCalcSub: "Neapolitan to wood-fired", recipes: "Recipes", recipesSub: "Eleven breads, three families", guide: "Process Guide", guideSub: "Six steps to mastery", trouble: "Troubleshoot", troubleSub: "Diagnose any problem", starter: "Starter Planner", starterSub: "Feeding ratios", diffOverview: "Difficulty", bakerPrinciple: "Baker's Principle", home: "Home", calculator: "Calculator", fix: "Fix", breadCalc: "Bread", byFlour: "By Flour", byTotal: "By Total Weight", flourPerLoaf: "Flour per loaf", totalDoughWeight: "Total dough weight", leavening: "Leavening", sourdoughOpt: "Sourdough", sourdoughSub: "Wild fermentation", yeastOpt: "Yeast", yeastSub: "Predictable rise", yeastType: "Yeast Type", freshYeast: "Fresh", dryYeast: "Dry", hydration: "Hydration", starterLabel: "Starter", yeastLabel: "Yeast", salt: "Salt", wholeGrain: "Whole Grain", ofTotalFlour: "of total flour", yourFormula: "Your Formula", total: "Total", flour: "Flour", water: "Water", breadFlour: "Bread flour", wgFlour: "Whole grain", hydGuide: "Hydration Guide", pizzaCalcTitle: "Pizza", doughType: "Dough Type", yeastPizza: "Yeast", yeastPizzaSub: "Beginner-friendly", sourdoughPizza: "Sourdough", sourdoughPizzaSub: "Complex flavor", yourOven: "Your Oven", pizzas: "Pizzas", pizzaDoughWeight: "Dough per Pizza", toppingsBtn: "Margherita Toppings", freshYeastLabel: "Fresh yeast", orDryYeast: "or dry yeast", activeStarter: "Active starter", totalDough: "Total dough", homeFor: "250–290g for home", proFor: "260–350g for pro", soloMode: "Solo", dateNight: "Date night", pizzaParty: "Pizza party", bigGathering: "Big gathering", fullBakery: "Full bakery mode", starterTitle: "Starter", starterSub2: "Calculate your feeding", howMuchStarter: "How much active starter do you need?", feedingRatio: "Feeding Ratio", seedStarter: "Seed (existing)", freshFlour: "Fresh flour", freshWater: "Fresh water", readyStarter: "Ready starter", feedingFormula: "Feeding Formula", ratioRef: "Ratio Reference", recipesTitle: "Recipes", recipesSub2: "Three families of bread", allRecipes: "All Recipes", loaves: "Loaves", ingredients: "Ingredients", steps: "Method", proTips: "Pro Tips", lowHydration: "Low Hydration", mediumHydration: "Medium Hydration", highHydration: "High Hydration", guideTitle: "Process Guide", guideSub2: "Master every step", checks: "Checklist", timerLabel: "Timers", troubleTitle: "Troubleshoot", troubleSub2: "Diagnose and fix", likelyCauses: "Likely Causes", howToFix: "How to Fix", quickGlossary: "Glossary", bakersPercent: "Baker's Percentages", bakersMathBody: "Flour is always 100%. Every other ingredient is expressed as a percentage of the flour's weight.", copyList: "Copy List", copiedLabel: "Copied", timerStart: "Start", timerPause: "Pause", timerDone: "Done", timerRunning: "Running", timerReady: "Ready", footer: "Made by S.B. With Claude and Qwen", activeDry: "Dry", ratio111: "Daily maintenance — mild, 6–8 hr peak", ratio122: "Standard feeding — balanced, 8–12 hr peak", ratio133: "Moderate — milder, 10–14 hr peak", ratio155: "Slower rise — complex flavor, 12–16 hr peak", ratio1010: "Very slow — plan ahead, 16–24 hr peak", starterRatioTip: "A stiff starter (50–60% hydration) enhances yeast activity. Use half the water shown.", back: "Back", recipesCount: "recipes", decrease: "Decrease", increase: "Increase", reset: "Reset", lightMode: "Light mode", darkMode: "Dark mode", switchLang: "Switch language", starterAmount: "Starter Amount" },
  fa: { appName: "لِوان", appTagline: "همراهِ خمیرترش", taglineSub: "راهنمای جامع نان خمیرترش — از آماده‌سازی استارتر تا خط‌زدن و پخت.", toolsSections: "ابزارها", doughCalc: "ماشین‌حساب نان", doughCalcSub: "درصدهای نانوایی", pizzaCalc: "ماشین‌حساب پیتزا", pizzaCalcSub: "از ناپلی تا تنور هیزمی", recipes: "دستورهای پخت", recipesSub: "یازده نان در سه دسته", guide: "راهنمای مراحل پخت", guideSub: "شش گام تا تسلط", trouble: "عیب‌یابی", troubleSub: "راه‌حل هر مشکل", starter: "برنامه‌ریز استارتر", starterSub: "نسبت‌های تغذیه", diffOverview: "سطح دشواری", bakerPrinciple: "اصل نانوا", home: "خانه", calculator: "ماشین‌حساب", fix: "عیب‌یابی", breadCalc: " نان", byFlour: "بر اساس آرد", byTotal: "بر اساس وزن کل", flourPerLoaf: "آرد هر قرص", totalDoughWeight: "وزن کل خمیر", leavening: "مایهٔ تخمیر", sourdoughOpt: "خمیرترش", sourdoughSub: "تخمیر طبیعی", yeastOpt: "مخمر", yeastSub: "عملکرد قابل‌پیش‌بینی", yeastType: "نوع مخمر", freshYeast: "تازه", dryYeast: "خشک", hydration: "درصد آب", starterLabel: "استارتر", yeastLabel: "مخمر", salt: "نمک", wholeGrain: "آرد کامل", ofTotalFlour: "از کل آرد", yourFormula: "فرمول شما", total: "مجموع", flour: "آرد", water: "آب", breadFlour: "آرد نان", wgFlour: "آرد کامل", hydGuide: "راهنمای درصد آب", pizzaCalcTitle: "پیتزا", doughType: "نوع خمیر", yeastPizza: "مخمر", yeastPizzaSub: "مناسب مبتدی‌ها", sourdoughPizza: "خمیرترش", sourdoughPizzaSub: "طعمی عمیق‌تر", yourOven: "فر شما", pizzas: "تعداد پیتزا", pizzaDoughWeight: "وزن هر چانه", toppingsBtn: "مواد پیتزا مارگاریتا", freshYeastLabel: "مخمر تازه", orDryYeast: "یا مخمر خشک", activeStarter: "استارتر فعال", totalDough: "وزن کل خمیر", homeFor: "۲۵۰ تا ۲۹۰ گرم برای فر خانگی", proFor: "۲۶۰ تا ۳۵۰ گرم برای فر حرفه‌ای", soloMode: "برای یک نفر", dateNight: "شام دو نفره", pizzaParty: "مهمانی پیتزا", bigGathering: "دورهمی بزرگ", fullBakery: "حالت نانوایی", starterTitle: "استارتر", starterSub2: "محاسبهٔ وعدهٔ تغذیه", howMuchStarter: "چقدر استارتر فعال نیاز دارید؟", feedingRatio: "نسبت تغذیه", seedStarter: "استارتر مادر", freshFlour: "آرد تازه", freshWater: "آب تازه", readyStarter: "استارتر آماده", feedingFormula: "فرمول تغذیه", ratioRef: "راهنمای نسبت‌ها", recipesTitle: "دستورهای پخت", recipesSub2: "سه خانوادهٔ نان", allRecipes: "همهٔ دستورها", loaves: "تعداد قرص", ingredients: "مواد لازم", steps: "روش پخت", proTips: "نکات حرفه‌ای", lowHydration: "درصد آب پایین", mediumHydration: "درصد آب متوسط", highHydration: "درصد آب بالا", guideTitle: "راهنمای مراحل پخت", guideSub2: "تسلط بر هر مرحله", checks: "چک‌لیست", timerLabel: "زمان‌سنج‌ها", troubleTitle: "عیب‌یابی", troubleSub2: "تشخیص و راه‌حل", likelyCauses: "دلایل احتمالی", howToFix: "راه‌حل", quickGlossary: "واژه‌نامه", bakersPercent: "درصدهای نانوایی", bakersMathBody: "آرد همیشه ۱۰۰٪ است. وزن سایر مواد به‌صورت درصدی از وزن آرد بیان می‌شود.", copyList: "کپی کردن فهرست", copiedLabel: "کپی شد", timerStart: "شروع", timerPause: "توقف", timerDone: "پایان", timerRunning: "در حال شمارش", timerReady: "آماده", footer: "ساخته‌شده توسط S.B، با Claude و Qwen", activeDry: "خشک", ratio111: "نگهداری روزانه — ملایم، اوج در ۶ تا ۸ ساعت", ratio122: "تغذیهٔ استاندارد — متعادل، اوج در ۸ تا ۱۲ ساعت", ratio133: "متوسط — طعمی ملایم‌تر، اوج در ۱۰ تا ۱۴ ساعت", ratio155: "تخمیر آهسته — طعمی پیچیده، اوج در ۱۲ تا ۱۶ ساعت", ratio1010: "بسیار آهسته — نیاز به برنامه‌ریزی، اوج در ۱۶ تا ۲۴ ساعت", starterRatioTip: "استارتر سفت (۵۰ تا ۶۰ درصد آب) فعالیت مخمر را تقویت می‌کند. نصف آبِ نشان‌داده‌شده را استفاده کنید.", back: "بازگشت", recipesCount: "دستور", decrease: "کاهش", increase: "افزایش", reset: "بازنشانی", lightMode: "حالت روشن", darkMode: "حالت تیره", switchLang: "تغییر زبان", starterAmount: "مقدار استارتر" }
};

const HYDRATION_LEVELS = [
  { range: [55, 62], label: "Beginner", labelFa: "مبتدی", desc: "Easy to handle. Dense, chewy crumb.", descFa: "کار با آن آسان است. بافتی متراکم و جویدنی دارد." },
  { range: [63, 68], label: "Intermediate", labelFa: "متوسط", desc: "Good balance. Nice open crumb.", descFa: "تعادل خوبی دارد. بافت داخلی باز و مطلوب." },
  { range: [69, 76], label: "Advanced", labelFa: "پیشرفته", desc: "Sticky. Big holes. Rewarding.", descFa: "چسبنده است. حفره‌های بزرگ و نتیجه‌ای ارزشمند." },
  { range: [77, 88], label: "Expert", labelFa: "حرفه‌ای", desc: "Use oiled hands. Very open crumb.", descFa: "با دست چرب کار کنید. بافتی بسیار باز و هوادار." },
  { range: [89, 110], label: "Master", labelFa: "استادکار", desc: "Nearly batter. Loaf pan only.", descFa: "تقریباً مانند مایه. فقط در قالب قابل پخت." }
];

const WEIGHT_FUN = [
  [180, "About a large coffee", "هم‌وزن یک فنجان بزرگ قهوه"], [380, "About a smartphone", "هم‌وزن یک گوشی موبایل"],
  [550, "About a can of soup", "هم‌وزن یک قوطی سوپ"], [750, "About a broccoli", "هم‌وزن یک کلم بروکلی"],
  [950, "About a pineapple", "هم‌وزن یک آناناس"], [1300, "About a coconut", "هم‌وزن یک نارگیل"],
  [1700, "About a brick", "هم‌وزن یک آجر"], [2800, "A serious bake", "یک پخت حسابی"], [99999, "Baking for an army", "پخت برای یک لشکر"]
];

const FEED_RATIOS = [
  { label: "1:1:1", seed: 1, flour: 1, water: 1 }, { label: "1:2:2", seed: 1, flour: 2, water: 2 },
  { label: "1:3:3", seed: 1, flour: 3, water: 3 }, { label: "1:5:5", seed: 1, flour: 5, water: 5 }, { label: "1:10:10", seed: 1, flour: 10, water: 10 }
];
const FEED_RATIO_DESCS = ["ratio111", "ratio122", "ratio133", "ratio155", "ratio1010"];

const PIZZA_OVENS = [
  { id: "home", nameEn: "Home Oven", nameFa: "فر خانگی", icon: "oven", temp: "250°C", tip: "Crank heat to max. Use a pizza stone or steel on the top rack. Bake 8–12 min, rotating halfway.", tipFa: "فر را روی بیشترین دما بگذارید. از سنگ یا صفحهٔ فولادی پیتزا در بالاترین طبقه استفاده کنید. ۸ تا ۱۲ دقیقه بپزید و نیمهٔ پخت آن را بچرخانید." },
  { id: "pizza", nameEn: "Pizza Oven", nameFa: "فر پیتزا", icon: "flame", temp: "400°C", tip: "Preheat 30+ minutes. Cook 90 seconds, turning every 20 seconds for even char.", tipFa: "بیش از ۳۰ دقیقه فر را گرم کنید. حدود ۹۰ ثانیه بپزید و هر ۲۰ ثانیه آن را بچرخانید تا یکنواخت برشته شود." },
  { id: "wood", nameEn: "Wood-Fired", nameFa: "تنور هیزمی", icon: "woodfire", temp: "480°C", tip: "60–90 seconds total. Look for leopard spotting on the crust — the sign of a great pie.", tipFa: "در مجموع ۶۰ تا ۹۰ ثانیه. به دنبال خال‌های پلنگی روی پوسته باشید — نشانهٔ یک پیتزای عالی." }
];

// RECIPES, GUIDE, TROUBLE arrays remain exactly as you had them, just ensure no trailing backslashes! 
// (I am omitting them here to save space, but keep your exact data blocks for them, just delete any `\` at the end of lines).
const RECIPES = [
  {
    id: "bagels", icon: "bagel", family: "low", name: "Classic Bagels", nameFa: "بیگل کلاسیک",
    sub: "Chewy, malty, boiled", subFa: "جویدنی، با عطر مالت، آب‌پز",
    difficulty: 3, diffLabel: "Medium", diffLabelFa: "متوسط", totalTime: "12–24 hrs", totalTimeFa: "۱۲ تا ۲۴ ساعت", hydration: 57,
    ingredients: [
      { amount: 500, unit: "g", icon: "wheat", name: "Bread flour", nameFa: "آرد نان" },
      { amount: 285, unit: "g", icon: "droplet", name: "Water, lukewarm", nameFa: "آب ولرم" },
      { amount: 10, unit: "g", icon: "salt", name: "Fine salt", nameFa: "نمک ریز" },
      { amount: 20, unit: "g", icon: "sparkles", name: "Malt syrup or honey", nameFa: "شیرهٔ مالت یا عسل" },
      { amount: 100, unit: "g", icon: "flask", name: "Active starter (or 5g instant yeast)", nameFa: "استارتر فعال (یا ۵ گرم مخمر فوری)" },
    ],
    steps: [
      ["Mix & knead", "Combine all ingredients. Knead 10 minutes until very smooth and stiff. Bagel dough is dry by design.", "مخلوط و ورز دادن", "همهٔ مواد را مخلوط کنید. ۱۰ دقیقه ورز دهید تا خمیری کاملاً صاف و سفت به‌دست آید. خمیر بیگل ذاتاً خشک است."],
      ["Bulk rise", "Cover and rest 1 hour at room temperature, or refrigerate overnight for more flavor.", "تخمیر اولیه", "روی خمیر را بپوشانید و ۱ ساعت در دمای محیط استراحت دهید، یا برای طعمی عمیق‌تر یک شب در یخچال بگذارید."],
      ["Divide & shape", "Divide into 8 equal pieces. Roll each into a tight ball, poke a hole with your finger, stretch into a ring.", "تقسیم و شکل‌دهی", "خمیر را به ۸ قسمت مساوی تقسیم کنید. هر قسمت را به شکل توپی سفت درآورید، با انگشت سوراخی در وسط آن ایجاد و به شکل حلقه باز کنید."],
      ["Cold proof", "Place on floured tray, cover, refrigerate 8–16 hours for best flavor and chew.", "تخمیر سرد", "روی سینی آردپاشی‌شده بچینید، بپوشانید و ۸ تا ۱۶ ساعت در یخچال بگذارید تا بهترین طعم و بافت جویدنی ایجاد شود."],
      ["Boil", "Bring a large pot of water with 1 tbsp malt syrup to a boil. Boil each bagel 30 sec per side.", "آب‌پز کردن", "قابلمهٔ بزرگی آب را با ۱ قاشق غذاخوری شیرهٔ مالت به جوش بیاورید. هر بیگل را از هر طرف ۳۰ ثانیه در آب جوش بیندازید."],
      ["Bake", "Bake at 220°C (430°F) for 20–22 minutes until deep golden brown.", "پخت", "در دمای ۲۲۰ درجهٔ سانتی‌گراد به مدت ۲۰ تا ۲۲ دقیقه بپزید تا به رنگ قهوه‌ای طلایی تیره درآید."],
    ],
    tips: ["Stiff dough = chewy bagel. Don't add extra water.", "Boiling creates the signature shiny crust.", "Cold proof overnight for the best flavor depth.", "Top with sesame, poppy, or 'everything' seasoning before baking."],
    tipsFa: ["خمیر سفت = بیگل جویدنی. آب اضافه نکنید.", "آب‌پز کردن، همان پوستهٔ براق و معروف بیگل را ایجاد می‌کند.", "برای عمیق‌ترین طعم، خمیر را یک شب در یخچال تخمیر کنید.", "پیش از پخت با کنجد، خشخاش یا ادویهٔ ترکیبی تزیین کنید."],
  },
  {
    id: "pretzels", icon: "pretzel", family: "low", name: "Soft Pretzels", nameFa: "پرتزل نرم",
    sub: "Chewy, malty, lye-dipped", subFa: "جویدنی، مالتی، با پوستهٔ قلیایی",
    difficulty: 3, diffLabel: "Medium", diffLabelFa: "متوسط", totalTime: "3–4 hrs", totalTimeFa: "۳ تا ۴ ساعت", hydration: 52,
    ingredients: [
      { amount: 500, unit: "g", icon: "wheat", name: "Bread flour", nameFa: "آرد نان" },
      { amount: 260, unit: "g", icon: "droplet", name: "Warm water", nameFa: "آب گرم" },
      { amount: 10, unit: "g", icon: "salt", name: "Fine salt", nameFa: "نمک ریز" },
      { amount: 10, unit: "g", icon: "sparkles", name: "Brown sugar", nameFa: "شکر قهوه‌ای" },
      { amount: 20, unit: "g", icon: "olive", name: "Melted butter", nameFa: "کرهٔ ذوب‌شده" },
      { amount: 7, unit: "g", icon: "sparkles", name: "Instant yeast (or 80g starter)", nameFa: "مخمر فوری (یا ۸۰ گرم استارتر)" },
      { amount: 60, unit: "g", icon: "salt", name: "Baking soda (for bath)", nameFa: "جوش‌شیرین (برای حمام قلیایی)" },
    ],
    steps: [
      ["Mix & knead", "Combine flour, water, sugar, salt, butter, yeast. Knead 8 minutes until smooth and elastic.", "مخلوط و ورز دادن", "آرد، آب، شکر، نمک، کره و مخمر را مخلوط کنید. ۸ دقیقه ورز دهید تا صاف و کشسان شود."],
      ["Bulk rise", "Cover and rest 1 hour until doubled in size.", "تخمیر اولیه", "روی خمیر را بپوشانید و ۱ ساعت استراحت دهید تا حجمش دو برابر شود."],
      ["Shape", "Divide into 8 pieces. Roll each into a 50cm rope, form classic pretzel shape with twisted loop.", "شکل‌دهی", "به ۸ قسمت تقسیم کنید. هر قسمت را به رشته‌ای به طول ۵۰ سانتیمتر درآورید و به شکل کلاسیک پرتزل با حلقهٔ پیچ‌خورده بپیچید."],
      ["Baking soda bath", "Bring 1L water + 60g baking soda to a simmer. Dip each pretzel 30 seconds.", "حمام قلیایی", "۱ لیتر آب را با ۶۰ گرم جوش‌شیرین به جوش ملایم برسانید. هر پرتزل را ۳۰ ثانیه در آن فرو ببرید."],
      ["Salt & bake", "Place on tray, sprinkle coarse salt. Bake at 230°C (450°F) for 12–14 minutes.", "نمک و پخت", "روی سینی بچینید و نمک درشت بپاشید. در دمای ۲۳۰ درجه به مدت ۱۲ تا ۱۴ دقیقه بپزید."],
    ],
    tips: ["The baking soda bath creates the signature dark crust — don't skip it.", "For authentic lye pretzels, use food-grade lye (wear gloves).", "Eat same day — they stale quickly.", "Mustard and beer are the traditional accompaniments."],
    tipsFa: ["حمام جوش‌شیرین همان پوستهٔ تیرهٔ معروف را ایجاد می‌کند — هرگز از آن صرف‌نظر نکنید.", "برای پرتزل اصیل آلمانی از سود خوراکی استفاده کنید (حتماً دستکش بپوشید).", "همان روز میل کنید — خیلی زود بیات می‌شود.", "خردل و آبجو، همراهان سنتی پرتزل هستند."],
  },
  {
    id: "buns", icon: "bun", family: "low", name: "Soft Dinner Buns", nameFa: "نان‌های گرد نرم شام",
    sub: "Pillowy, enriched, tender", subFa: "پنبه‌ای، غنی‌شده، لطیف",
    difficulty: 2, diffLabel: "Easy", diffLabelFa: "آسان", totalTime: "3–4 hrs", totalTimeFa: "۳ تا ۴ ساعت", hydration: 60,
    ingredients: [
      { amount: 500, unit: "g", icon: "wheat", name: "All-purpose flour", nameFa: "آرد همه‌منظوره" },
      { amount: 240, unit: "g", icon: "droplet", name: "Whole milk, warm", nameFa: "شیر کامل گرم" },
      { amount: 1, unit: "", icon: "sparkles", name: "Egg", nameFa: "تخم‌مرغ" },
      { amount: 50, unit: "g", icon: "sparkles", name: "Sugar", nameFa: "شکر" },
      { amount: 10, unit: "g", icon: "salt", name: "Fine salt", nameFa: "نمک ریز" },
      { amount: 60, unit: "g", icon: "olive", name: "Softened butter", nameFa: "کرهٔ نرم‌شده" },
      { amount: 7, unit: "g", icon: "sparkles", name: "Instant yeast", nameFa: "مخمر فوری" },
    ],
    steps: [
      ["Mix", "Combine flour, milk, egg, sugar, salt, yeast. Mix until shaggy dough forms.", "مخلوط کردن", "آرد، شیر، تخم‌مرغ، شکر، نمک و مخمر را با هم مخلوط کنید تا خمیری ناهمگون شکل بگیرد."],
      ["Knead in butter", "Knead 5 minutes, then add softened butter a piece at a time. Knead 5 more minutes.", "افزودن کره و ورز دادن", "۵ دقیقه ورز دهید، سپس کرهٔ نرم‌شده را کم‌کم اضافه کنید. ۵ دقیقهٔ دیگر ورز دهید."],
      ["Bulk rise", "Cover and rise 1–1.5 hours until doubled.", "تخمیر اولیه", "روی خمیر را بپوشانید و ۱ تا ۱٫۵ ساعت استراحت دهید تا دو برابر شود."],
      ["Divide & shape", "Divide into 12 pieces. Roll each into tight balls. Place on baking tray.", "تقسیم و شکل‌دهی", "به ۱۲ قسمت تقسیم کنید. هر قسمت را به توپی سفت درآورید و روی سینی فر بچینید."],
      ["Proof", "Cover and proof 45 minutes until puffy.", "تخمیر نهایی", "بپوشانید و ۴۵ دقیقه استراحت دهید تا پف کنند."],
      ["Egg wash & bake", "Brush with egg wash. Bake at 190°C (375°F) for 15–18 minutes until golden.", "رومال تخم‌مرغ و پخت", "با رومال تخم‌مرغ برس بکشید. در ۱۹۰ درجه به مدت ۱۵ تا ۱۸ دقیقه بپزید تا طلایی شوند."],
    ],
    tips: ["Warm milk (not hot) activates yeast without killing it.", "Add butter gradually — adding it all at once makes greasy dough.", "Brush with melted butter right out of oven for extra softness.", "Great for burgers, sandwiches, or pulled pork."],
    tipsFa: ["شیر گرم (نه داغ) مخمر را فعال می‌کند بدون آنکه از بین ببرد.", "کره را کم‌کم اضافه کنید — افزودن یکباره خمیر را چرب و سست می‌کند.", "بلافاصله پس از خروج از فر، کرهٔ ذوب‌شده روی آن‌ها بمالید تا نرم‌تر شوند.", "برای برگر، ساندویچ و گوشت ریش‌ریش عالی هستند."],
  },
  {
    id: "sandwich", icon: "loaf", family: "medium", name: "Sandwich Loaf", nameFa: "نان تست ساندویچی",
    sub: "Soft, sliceable, everyday", subFa: "نرم، برش‌پذیر، روزمره",
    difficulty: 2, diffLabel: "Easy", diffLabelFa: "آسان", totalTime: "6–8 hrs", totalTimeFa: "۶ تا ۸ ساعت", hydration: 68,
    ingredients: [
      { amount: 500, unit: "g", icon: "wheat", name: "Bread flour", nameFa: "آرد نان" },
      { amount: 340, unit: "g", icon: "droplet", name: "Water", nameFa: "آب" },
      { amount: 10, unit: "g", icon: "salt", name: "Fine salt", nameFa: "نمک ریز" },
      { amount: 15, unit: "g", icon: "sparkles", name: "Honey or sugar", nameFa: "عسل یا شکر" },
      { amount: 100, unit: "g", icon: "flask", name: "Active starter (or 4g yeast)", nameFa: "استارتر فعال (یا ۴ گرم مخمر)" },
    ],
    steps: [
      ["Mix", "Combine all ingredients until no dry flour remains. Rest 30 minutes (autolyse).", "مخلوط کردن", "همهٔ مواد را تا جایی که آرد خشک نماند مخلوط کنید. ۳۰ دقیقه استراحت دهید (اتولیز)."],
      ["Knead", "Knead 5–7 minutes until smooth and elastic.", "ورز دادن", "۵ تا ۷ دقیقه ورز دهید تا خمیری صاف و کشسان شود."],
      ["Bulk ferment", "Cover and ferment 4–6 hours at room temperature until 50% larger.", "تخمیر اولیه", "بپوشانید و ۴ تا ۶ ساعت در دمای محیط تخمیر کنید تا ۵۰٪ حجمش افزایش یابد."],
      ["Shape", "Roll into rectangle, roll up tightly, place seam-down in greased loaf pan.", "شکل‌دهی", "خمیر را به شکل مستطیل باز کنید، محکم رول کنید و در قالب چرب‌شده با درز به سمت پایین بگذارید."],
      ["Proof", "Cover and proof 1.5–2 hours until cresting the pan.", "تخمیر نهایی", "بپوشانید و ۱٫۵ تا ۲ ساعت استراحت دهید تا از لبهٔ قالب بالا بیاید."],
      ["Bake", "Bake at 200°C (390°F) for 35–40 minutes. Internal temp should reach 92°C.", "پخت", "در دمای ۲۰۰ درجه به مدت ۳۵ تا ۴۰ دقیقه بپزید. دمای داخلی باید به ۹۲ درجه برسد."],
    ],
    tips: ["A soft sandwich loaf needs gentle handling after shaping.", "Brush with butter right after baking for a soft crust.", "Wait until fully cool before slicing — hot bread crushes.", "Perfect for toast, sandwiches, and French toast."],
    tipsFa: ["با نان تست نرم پس از شکل‌دهی باید به‌آرامی رفتار کرد.", "بلافاصله پس از پخت، کره روی آن بمالید تا پوسته‌ای نرم داشته باشید.", "پیش از برش، اجازه دهید کاملاً خنک شود — نان داغ له می‌شود.", "برای تست، ساندویچ و فرنچ تست عالی است."],
  },
  {
    id: "flatbread", icon: "flatbread", family: "medium", name: "Sourdough Flatbread", nameFa: "نان تخت خمیرترش",
    sub: "The gateway bread", subFa: "درآمدی بر دنیای نان",
    difficulty: 1, diffLabel: "Very Easy", diffLabelFa: "بسیار آسان", totalTime: "8–24 hrs", totalTimeFa: "۸ تا ۲۴ ساعت", hydration: 70,
    ingredients: [
      { amount: 400, unit: "g", icon: "wheat", name: "Flour (any type)", nameFa: "آرد (از هر نوع)" },
      { amount: 280, unit: "g", icon: "droplet", name: "Water", nameFa: "آب" },
      { amount: 80, unit: "g", icon: "flask", name: "Active starter", nameFa: "استارتر فعال" },
      { amount: 8, unit: "g", icon: "salt", name: "Salt", nameFa: "نمک" },
      { amount: 30, unit: "g", icon: "olive", name: "Olive oil", nameFa: "روغن زیتون" },
    ],
    steps: [
      ["Mix", "Combine flour, water, starter, salt, oil. Mix until smooth.", "مخلوط کردن", "آرد، آب، استارتر، نمک و روغن را مخلوط کنید تا یکدست شود."],
      ["Ferment", "Cover and rest 8–24 hours until puffy and slightly sour.", "تخمیر", "بپوشانید و ۸ تا ۲۴ ساعت استراحت دهید تا پف کند و کمی ترش شود."],
      ["Divide", "Divide into 6 balls. Rest 30 minutes to relax gluten.", "تقسیم", "به ۶ چانه تقسیم کنید. ۳۰ دقیقه استراحت دهید تا گلوتن آرام شود."],
      ["Roll thin", "Roll each ball into a thin disc on floured surface.", "نازک کردن", "هر چانه را روی سطح آردپاشی‌شده به صورت دیسکی نازک باز کنید."],
      ["Cook", "Cook in a very hot dry pan, 1–2 minutes per side until blistered.", "پخت", "در تابه‌ای بسیار داغ و بدون روغن، از هر طرف ۱ تا ۲ دقیقه بپزید تا حباب‌های سوخته ایجاد شود."],
    ],
    tips: ["Works with any flour — wheat, rye, spelt, or blends.", "The hotter the pan, the better the blister and char.", "Stack cooked flatbreads in a towel to stay soft.", "Brush with garlic butter and herbs for instant upgrade."],
    tipsFa: ["با هر نوع آردی کار می‌کند — گندم، چاودار، اسپلت یا ترکیبی.", "هر چه تابه داغ‌تر باشد، حباب‌ها و برشتگی بهتری خواهید داشت.", "نان‌های پخته‌شده را داخل پارچه روی هم بچینید تا نرم بمانند.", "با کرهٔ سیر و سبزیجات معطر، فوراً ارتقا می‌یابد."],
  },
  {
    id: "baguette", icon: "baguette", family: "medium", name: "Sourdough Baguette", nameFa: "باگت خمیرترش",
    sub: "Crisp crust, open crumb", subFa: "پوستهٔ ترد، بافت باز",
    difficulty: 4, diffLabel: "Advanced", diffLabelFa: "پیشرفته", totalTime: "18–24 hrs", totalTimeFa: "۱۸ تا ۲۴ ساعت", hydration: 72,
    ingredients: [
      { amount: 500, unit: "g", icon: "wheat", name: "Bread flour (>12% protein)", nameFa: "آرد نان (بیش از ۱۲٪ پروتئین)" },
      { amount: 360, unit: "g", icon: "droplet", name: "Water, 26°C", nameFa: "آب، ۲۶ درجه" },
      { amount: 10, unit: "g", icon: "salt", name: "Fine sea salt", nameFa: "نمک دریایی ریز" },
      { amount: 100, unit: "g", icon: "flask", name: "Active levain", nameFa: "لوون فعال" },
    ],
    steps: [
      ["Autolyse", "Mix flour and water only. Rest 45 minutes.", "اتولیز", "فقط آرد و آب را مخلوط کنید. ۴۵ دقیقه استراحت دهید."],
      ["Incorporate", "Add levain and salt. Mix thoroughly with pinch-and-fold.", "افزودن لوون", "لوون و نمک را اضافه کنید. با روش فشار و تا زدن کاملاً مخلوط کنید."],
      ["Bulk", "Ferment 4–5 hours. Perform stretch & folds every 30 min for first 2 hours.", "تخمیر اولیه", "۴ تا ۵ ساعت تخمیر کنید. در ۲ ساعت اول، هر ۳۰ دقیقه کشش و تا بزنید."],
      ["Divide & pre-shape", "Divide into 3 pieces. Pre-shape into short cylinders. Rest 20 min.", "تقسیم و پیش‌شکل", "به ۳ قسمت تقسیم کنید. به شکل استوانه‌های کوتاه پیش‌شکل دهید. ۲۰ دقیقه استراحت."],
      ["Final shape", "Shape into long baguettes with tight surface tension. Place on couche.", "شکل نهایی", "به شکل باگت بلند با کشش سطحی قوی درآورید. روی پارچهٔ آردپاشی‌شده (کوش) بگذارید."],
      ["Cold proof", "Refrigerate 12–16 hours on couche.", "تخمیر سرد", "۱۲ تا ۱۶ ساعت روی کوش در یخچال بگذارید."],
      ["Score & bake", "Score with 3–4 diagonal slashes. Bake at 250°C with steam for 22 min.", "خط‌زنی و پخت", "با ۳ تا ۴ برش مورب خط بزنید. در ۲۵۰ درجه با بخار به مدت ۲۲ دقیقه بپزید."],
    ],
    tips: ["Baguettes demand strong bread flour and confident shaping.", "Steam in the first 10 minutes is non-negotiable for crust.", "Score at 30° angle, overlapping slashes for classic look.", "Best eaten within 6 hours of baking."],
    tipsFa: ["باگت نیازمند آرد نان قوی و شکل‌دهی با اعتمادبه‌نفس است.", "بخار در ۱۰ دقیقهٔ اول برای تشکیل پوسته ضروری است.", "با زاویهٔ ۳۰ درجه و برش‌های هم‌پوشان خط بزنید تا ظاهر کلاسیک ایجاد شود.", "بهترین زمان مصرف تا ۶ ساعت پس از پخت است."],
  },
  {
    id: "focaccia", icon: "focaccia", family: "high", name: "Sourdough Focaccia", nameFa: "فوکاچیا خمیرترش",
    sub: "Dimpled, oily, glorious", subFa: "گودال‌دار، روغنی، باشکوه",
    difficulty: 2, diffLabel: "Easy", diffLabelFa: "آسان", totalTime: "12–24 hrs", totalTimeFa: "۱۲ تا ۲۴ ساعت", hydration: 80,
    ingredients: [
      { amount: 500, unit: "g", icon: "wheat", name: "Bread flour", nameFa: "آرد نان" },
      { amount: 400, unit: "g", icon: "droplet", name: "Water", nameFa: "آب" },
      { amount: 10, unit: "g", icon: "salt", name: "Fine salt", nameFa: "نمک ریز" },
      { amount: 100, unit: "g", icon: "flask", name: "Active starter", nameFa: "استارتر فعال" },
      { amount: 60, unit: "g", icon: "olive", name: "Extra virgin olive oil", nameFa: "روغن زیتون فرابکر" },
    ],
    steps: [
      ["Mix", "Combine flour, water, starter, salt. Mix until smooth and sticky.", "مخلوط کردن", "آرد، آب، استارتر و نمک را مخلوط کنید تا یکدست و چسبنده شود."],
      ["Bulk ferment", "Cover and ferment 4–6 hours. Perform 4 stretch & folds in first 2 hours.", "تخمیر اولیه", "بپوشانید و ۴ تا ۶ ساعت تخمیر کنید. در ۲ ساعت اول ۴ بار کشش و تا بزنید."],
      ["Pan & oil", "Pour generous olive oil into baking pan. Transfer dough, turn to coat.", "قالب و روغن", "روغن زیتون فراوان در قالب بریزید. خمیر را منتقل کنید و بچرخانید تا کاملاً آغشته شود."],
      ["Second proof", "Let dough spread and puff in pan 2–3 hours (or overnight in fridge).", "تخمیر دوم", "اجازه دهید خمیر در قالب ۲ تا ۳ ساعت پهن و پف کند (یا یک شب در یخچال)."],
      ["Dimple & top", "Oil fingers, poke deep dimples all over. Add rosemary, salt, olives.", "گودال و تزیین", "انگشتان را چرب کنید و گودال‌های عمیق در سرتاسر خمیر ایجاد کنید. رزماری، نمک و زیتون اضافه کنید."],
      ["Bake", "Bake at 220°C (430°F) for 25 minutes until deep golden and crisp.", "پخت", "در ۲۲۰ درجه به مدت ۲۵ دقیقه بپزید تا طلایی تیره و ترد شود."],
    ],
    tips: ["Don't skimp on olive oil — it IS the flavor.", "Cherry tomatoes, grapes, or caramelized onions make amazing toppings.", "Best warm from the oven, dipped in more olive oil.", "Cold ferment overnight for maximum flavor complexity."],
    tipsFa: ["در روغن زیتون صرفه‌جویی نکنید — طعم اصلی از آن می‌آید.", "گوجه گیلاسی، انگور یا پیاز کاراملی تزیینات فوق‌العاده‌ای می‌سازند.", "بهترین حالت، داغ از فر و با فرو بردن در روغن زیتون بیشتر است.", "تخمیر سرد شبانه برای بیشترین پیچیدگی طعم."],
  },
  {
    id: "ciabatta", icon: "ciabatta", family: "high", name: "Ciabatta", nameFa: "چاباتا",
    sub: "Slipper bread, wild crumb", subFa: "نان دمپایی، بافت وحشی",
    difficulty: 4, diffLabel: "Advanced", diffLabelFa: "پیشرفته", totalTime: "6–8 hrs", totalTimeFa: "۶ تا ۸ ساعت", hydration: 82,
    ingredients: [
      { amount: 500, unit: "g", icon: "wheat", name: "Bread flour (>12%)", nameFa: "آرد نان (بیش از ۱۲٪)" },
      { amount: 410, unit: "g", icon: "droplet", name: "Water", nameFa: "آب" },
      { amount: 10, unit: "g", icon: "salt", name: "Fine salt", nameFa: "نمک ریز" },
      { amount: 100, unit: "g", icon: "flask", name: "Active starter (or 3g yeast)", nameFa: "استارتر فعال (یا ۳ گرم مخمر)" },
      { amount: 20, unit: "g", icon: "olive", name: "Olive oil", nameFa: "روغن زیتون" },
    ],
    steps: [
      ["Mix", "Combine all ingredients. Dough will be very wet and slack — this is correct.", "مخلوط کردن", "همهٔ مواد را مخلوط کنید. خمیر بسیار شل و مرطوب خواهد بود — این درست است."],
      ["Bulk ferment", "Ferment 4 hours. Perform stretch & folds every 30 minutes (6 total).", "تخمیر اولیه", "۴ ساعت تخمیر کنید. هر ۳۰ دقیقه کشش و تا بزنید (جمعاً ۶ بار)."],
      ["Divide gently", "Turn dough onto heavily floured surface. Divide into 2 pieces with minimal handling.", "تقسیم آرام", "خمیر را روی سطح کاملاً آردپاشی‌شده برگردانید. با کمترین دستکاری به ۲ قسمت تقسیم کنید."],
      ["Proof", "Place on floured couche. Proof 1 hour until puffy and jiggly.", "تخمیر نهایی", "روی کوش آردپاشی‌شده بگذارید. ۱ ساعت استراحت دهید تا پف‌کرده و لرزان شود."],
      ["Bake with steam", "Bake at 240°C (465°F) with steam for 15 min, then 220°C for 15 min more.", "پخت با بخار", "در ۲۴۰ درجه با بخار ۱۵ دقیقه، سپس در ۲۲۰ درجه ۱۵ دقیقهٔ دیگر بپزید."],
    ],
    tips: ["Wet hands, not floured hands, when handling ciabatta dough.", "Minimal handling preserves the open crumb structure.", "Strong flour (>12% protein) is essential.", "Slice horizontally for the perfect sandwich bread."],
    tipsFa: ["هنگام کار با خمیر چاباتا دست‌ها را خیس کنید، نه آردی.", "دستکاری کم، ساختار باز بافت را حفظ می‌کند.", "آرد قوی (بیش از ۱۲٪ پروتئین) ضروری است.", "برای ساندویچ عالی، به صورت افقی برش بزنید."],
  },
  {
    id: "pizzadough", icon: "pizza", family: "high", name: "Sourdough Pizza Dough", nameFa: "خمیر پیتزای خمیرترش",
    sub: "72-hour cold ferment", subFa: "تخمیر سرد ۷۲ ساعته",
    difficulty: 2, diffLabel: "Easy", diffLabelFa: "آسان", totalTime: "24–72 hrs", totalTimeFa: "۲۴ تا ۷۲ ساعت", hydration: 68,
    ingredients: [
      { amount: 500, unit: "g", icon: "wheat", name: "Tipo 00 or bread flour", nameFa: "آرد تیپو ۰۰ یا آرد نان" },
      { amount: 340, unit: "g", icon: "droplet", name: "Cold water", nameFa: "آب سرد" },
      { amount: 10, unit: "g", icon: "salt", name: "Fine sea salt", nameFa: "نمک دریایی ریز" },
      { amount: 75, unit: "g", icon: "flask", name: "Active starter (or 1g yeast)", nameFa: "استارتر فعال (یا ۱ گرم مخمر)" },
      { amount: 15, unit: "g", icon: "olive", name: "Olive oil", nameFa: "روغن زیتون" },
    ],
    steps: [
      ["Mix", "Combine all ingredients until smooth. Rest 30 minutes.", "مخلوط کردن", "همهٔ مواد را تا یکدست شدن مخلوط کنید. ۳۰ دقیقه استراحت دهید."],
      ["Knead", "Knead 8–10 minutes until smooth and elastic.", "ورز دادن", "۸ تا ۱۰ دقیقه ورز دهید تا صاف و کشسان شود."],
      ["Cold ferment", "Place in oiled container, cover, refrigerate 24–72 hours. Longer = better.", "تخمیر سرد", "در ظرف چرب‌شده بگذارید، بپوشانید و ۲۴ تا ۷۲ ساعت در یخچال قرار دهید. هرچه طولانی‌تر، بهتر."],
      ["Ball", "Divide into 4 balls (220g each). Place in oiled tray, cover.", "چانه گرفتن", "به ۴ چانهٔ ۲۲۰ گرمی تقسیم کنید. در سینی چرب‌شده بچینید و بپوشانید."],
      ["Warm up", "Remove from fridge 2 hours before baking to warm up.", "هم‌دما کردن", "۲ ساعت پیش از پخت از یخچال بیرون بیاورید تا هم‌دمای محیط شود."],
      ["Stretch & bake", "Hand-stretch (never roll). Top and bake at maximum oven temp.", "پهن کردن و پخت", "با دست پهن کنید (هرگز با وردنه). مواد را بریزید و در بیشترین دمای فر بپزید."],
    ],
    tips: ["72-hour cold ferment = incredible flavor and digestibility.", "Never use a rolling pin — it kills the air bubbles.", "Semolina flour on the peel prevents sticking.", "Less is more with toppings."],
    tipsFa: ["تخمیر سرد ۷۲ ساعته = طعم و هضم فوق‌العاده.", "هرگز از وردنه استفاده نکنید — حباب‌های هوا را از بین می‌برد.", "آرد سمولینا روی بیل پیتزا از چسبیدن جلوگیری می‌کند.", "در مواد پیتزا، کمتر همیشه بیشتر است."],
  },
  {
    id: "ryebread", icon: "rye", family: "high", name: "Dark Rye Bread", nameFa: "نان چاودار تیره",
    sub: "Dense, hearty, complex", subFa: "متراکم، سیرکننده، پیچیده",
    difficulty: 3, diffLabel: "Medium", diffLabelFa: "متوسط", totalTime: "18–24 hrs", totalTimeFa: "۱۸ تا ۲۴ ساعت", hydration: 85,
    ingredients: [
      { amount: 300, unit: "g", icon: "wheat", name: "Dark rye flour", nameFa: "آرد چاودار تیره" },
      { amount: 200, unit: "g", icon: "wheat", name: "Bread flour", nameFa: "آرد نان" },
      { amount: 425, unit: "g", icon: "droplet", name: "Water", nameFa: "آب" },
      { amount: 100, unit: "g", icon: "flask", name: "Active rye starter", nameFa: "استارتر چاودار فعال" },
      { amount: 10, unit: "g", icon: "salt", name: "Fine salt", nameFa: "نمک ریز" },
      { amount: 15, unit: "g", icon: "sparkles", name: "Caraway seeds (optional)", nameFa: "دانهٔ زیره (اختیاری)" },
    ],
    steps: [
      ["Mix", "Combine all ingredients. Rye dough is paste-like — do not knead.", "مخلوط کردن", "همهٔ مواد را مخلوط کنید. خمیر چاودار مانند خمیر است — ورز ندهید."],
      ["Bulk", "Cover and ferment 3–4 hours. Rye ferments faster than wheat.", "تخمیر اولیه", "بپوشانید و ۳ تا ۴ ساعت تخمیر کنید. چاودار سریع‌تر از گندم تخمیر می‌شود."],
      ["Pan", "Transfer to greased loaf pan with wet hands. Smooth the top.", "قالب زدن", "با دست خیس به قالب چرب‌شده منتقل کنید. سطح آن را صاف کنید."],
      ["Proof", "Cover and proof 3–5 hours until small cracks appear on surface.", "تخمیر نهایی", "بپوشانید و ۳ تا ۵ ساعت استراحت دهید تا ترک‌های ریز روی سطح ظاهر شود."],
      ["Bake", "Bake at 220°C (428°F) for 50 minutes until 92°C internal.", "پخت", "در ۲۲۰ درجه به مدت ۵۰ دقیقه بپزید تا دمای داخلی به ۹۲ درجه برسد."],
      ["Wait 24 hrs", "Do NOT slice for 24 hours. The crumb needs to set.", "۲۴ ساعت صبر", "تا ۲۴ ساعت برش نزنید. بافت نان باید جا بیفتد."],
    ],
    tips: ["Rye's pentosans create structure — kneading actually damages the dough.", "Higher hydration is normal for rye; embrace the stickiness.", "Rye improves with age — a week-old loaf is better than day one.", "Traditional additions: caraway, sunflower seeds, walnuts."],
    tipsFa: ["پنتوزان‌های چاودار ساختار را می‌سازند — ورز دادن در واقع به خمیر آسیب می‌زند.", "درصد آب بالا برای چاودار طبیعی است؛ چسبندگی را بپذیرید.", "چاودار با گذشت زمان بهتر می‌شود — نانی یک هفته‌ای از روز اول بهتر است.", "افزودنی‌های سنتی: زیره، تخمه آفتابگردان، گردو."],
  },
  {
    id: "artisan", icon: "artisan", family: "high", name: "Sourdough Artisan Boule", nameFa: "بول هنری خمیرترش",
    sub: "The holy grail", subFa: "جام مقدس نانوا",
    difficulty: 4, diffLabel: "Advanced", diffLabelFa: "پیشرفته", totalTime: "24–36 hrs", totalTimeFa: "۲۴ تا ۳۶ ساعت", hydration: 78,
    ingredients: [
      { amount: 500, unit: "g", icon: "wheat", name: "Bread flour (>12%)", nameFa: "آرد نان (بیش از ۱۲٪)" },
      { amount: 390, unit: "g", icon: "droplet", name: "Water, 26°C", nameFa: "آب، ۲۶ درجه" },
      { amount: 10, unit: "g", icon: "salt", name: "Fine sea salt", nameFa: "نمک دریایی ریز" },
      { amount: 100, unit: "g", icon: "flask", name: "Active levain", nameFa: "لوون فعال" },
    ],
    steps: [
      ["Autolyse", "Mix flour and water. Rest 45 minutes for gluten development.", "اتولیز", "آرد و آب را مخلوط کنید. برای رشد گلوتن ۴۵ دقیقه استراحت دهید."],
      ["Incorporate", "Add levain and salt. Pinch and fold until fully combined.", "افزودن لوون", "لوون و نمک را اضافه کنید. با فشار و تا زدن کاملاً یکدست کنید."],
      ["Bulk ferment", "Ferment 4–6 hours at 24°C. Stretch & fold every 30 min for first 2 hours.", "تخمیر اولیه", "۴ تا ۶ ساعت در ۲۴ درجه تخمیر کنید. در ۲ ساعت اول هر ۳۰ دقیقه کشش و تا بزنید."],
      ["Pre-shape", "Gently shape into a round. Bench rest 25 minutes.", "پیش‌شکل", "به‌آرامی به شکل گرد درآورید. ۲۵ دقیقه روی میز استراحت دهید."],
      ["Final shape", "Build tension with envelope folds. Place seam-up in floured banneton.", "شکل نهایی", "با تاهای پاکتی کشش سطحی ایجاد کنید. با درز به بالا در سبد آردپاشی‌شده بگذارید."],
      ["Cold proof", "Refrigerate 12–16 hours. This is where magic flavor develops.", "تخمیر سرد", "۱۲ تا ۱۶ ساعت در یخچال بگذارید. اینجاست که طعم جادویی شکل می‌گیرد."],
      ["Score & bake", "Preheat Dutch oven 45 min at 250°C. Score cold dough. Bake 20 min covered + 20 uncovered.", "خط‌زنی و پخت", "قابلمهٔ چدنی را ۴۵ دقیقه در ۲۵۰ درجه گرم کنید. روی خمیر سرد خط بزنید. ۲۰ دقیقه با در و ۲۰ دقیقه بدون در بپزید."],
    ],
    tips: ["Cold overnight proofing gives the best flavor and open crumb.", "Score at 30–45° angle for a proper 'ear' to form.", "Steam from the covered Dutch oven is critical for oven spring.", "There is no recipe to follow blindly — learn to read your dough."],
    tipsFa: ["تخمیر سرد شبانه بهترین طعم و بازترین بافت را می‌دهد.", "با زاویهٔ ۳۰ تا ۴۵ درجه خط بزنید تا «گوش» مناسب تشکیل شود.", "بخار داخل قابلمهٔ دردار برای پف فر حیاتی است.", "هیچ دستوری را کورکورانه دنبال نکنید — خواندن خمیر را بیاموزید."],
  },
];

const GUIDE = [
  {
    id: 1, icon: "flask", phase: "Before You Begin", phaseFa: "پیش از شروع", title: "Ready Your Starter", titleFa: "استارتر را آماده کنید",
    body: "Your starter must be active, bubbly, and at peak. Feed it 4–12 hours before mixing. A healthy starter doubles in size and passes the float test.",
    bodyFa: "استارتر باید فعال، پرحباب و در اوج قدرت باشد. ۴ تا ۱۲ ساعت پیش از مخلوط کردن آن را تغذیه کنید. استارتر سالم حجمش دو برابر می‌شود و آزمون شناور شدن را پشت سر می‌گذارد.",
    checks: ["Starter doubled", "Bubbly, domed top", "Float test passes", "Smells fruity-sour"],
    checksFa: ["حجمش دو برابر شده", "پرحباب با سطح گنبدی", "آزمون شناور شدن را رد می‌کند", "عطر میوه‌ای و ترش دارد"],
    tip: "If stored in fridge, give 2–3 consecutive feedings to reactivate.", tipFa: "اگر در یخچال نگهداری شده، ۲ تا ۳ وعدهٔ تغذیهٔ پی‌درپی برای فعال‌سازی مجدد لازم است.",
    timers: [], timersFa: [],
  },
  {
    id: 2, icon: "droplet", phase: "Day 1 · Morning", phaseFa: "روز ۱ — صبح", title: "Mix & Autolyse", titleFa: "مخلوط کردن و اتولیز",
    body: "Mix flour and water first, rest 30–60 minutes. Then add starter and salt and mix until fully incorporated.",
    bodyFa: "ابتدا آرد و آب را مخلوط کنید و ۳۰ تا ۶۰ دقیقه استراحت دهید. سپس استارتر و نمک را اضافه و تا یکدست شدن مخلوط کنید.",
    checks: ["No dry flour spots", "Starter and salt incorporated", "Smooth dough"],
    checksFa: ["هیچ نقطهٔ آرد خشکی باقی نمانده", "استارتر و نمک کاملاً جذب شده‌اند", "خمیر یکدست است"],
    tip: "Use water at 26–28°C for ideal fermentation speed.", tipFa: "برای سرعت تخمیر ایده‌آل، از آب ۲۶ تا ۲۸ درجه استفاده کنید.",
    timers: [{ label: "Autolyse rest", minutes: 30 }], timersFa: [{ label: "استراحت اتولیز", minutes: 30 }],
  },
  {
    id: 3, icon: "timer", phase: "Day 1 · Morning to Afternoon", phaseFa: "روز ۱ — صبح تا بعدازظهر", title: "Bulk Fermentation", titleFa: "تخمیر اولیه",
    body: "4–8 hours at room temperature. First 2 hours: stretch & folds every 30 minutes.",
    bodyFa: "۴ تا ۸ ساعت در دمای محیط. در ۲ ساعت اول هر ۳۰ دقیقه کشش و تا بزنید.",
    checks: ["Dough increased 50–75%", "Bubbles on sides", "Airy and jiggly", "Windowpane test passes"],
    checksFa: ["حجم خمیر ۵۰ تا ۷۵٪ افزایش یافته", "حباب‌هایی در کناره‌ها دیده می‌شود", "سبک و لرزان است", "آزمون پنجره را رد می‌کند"],
    tip: "Read your dough, not the clock.", tipFa: "به خمیر نگاه کنید، نه به ساعت.",
    timers: [{ label: "Stretch & fold", minutes: 30 }, { label: "Full bulk", minutes: 360 }],
    timersFa: [{ label: "کشش و تا", minutes: 30 }, { label: "کل تخمیر اولیه", minutes: 360 }],
  },
  {
    id: 4, icon: "scale", phase: "Day 1 · Afternoon", phaseFa: "روز ۱ — بعدازظهر", title: "Pre-shape & Shape", titleFa: "پیش‌شکل و شکل‌دهی",
    body: "Pre-shape into rough round, rest 20–30 minutes. Final shape into batard or boule.",
    bodyFa: "به شکل گرد تقریبی پیش‌شکل دهید و ۲۰ تا ۳۰ دقیقه استراحت دهید. سپس شکل نهایی باتار یا بول را ایجاد کنید.",
    checks: ["Surface smooth and taut", "Holds shape", "No tears", "Seam sealed"],
    checksFa: ["سطح صاف و کشیده است", "شکلش را حفظ می‌کند", "پارگی ندارد", "درز کاملاً بسته است"],
    tip: "Work on lightly unfloured surface for friction.", tipFa: "برای ایجاد اصطکاک، روی سطحی با آرد بسیار کم کار کنید.",
    timers: [{ label: "Pre-shape rest", minutes: 25 }], timersFa: [{ label: "استراحت پیش‌شکل", minutes: 25 }],
  },
  {
    id: 5, icon: "moon", phase: "Day 1 · Evening", phaseFa: "روز ۱ — عصر", title: "Proofing", titleFa: "تخمیر نهایی",
    body: "Place shaped dough in floured banneton. Room temp 1–2 hrs, or refrigerate overnight.",
    bodyFa: "خمیر شکل‌گرفته را در سبد آردپاشی‌شده بگذارید. ۱ تا ۲ ساعت در دمای محیط یا یک شب در یخچال.",
    checks: ["Banneton well-floured", "Poke test: springs back slowly", "Cold and firm"],
    checksFa: ["سبد به‌خوبی آردپاشی شده", "آزمون انگشت: به‌کندی برمی‌گردد", "سرد و سفت است"],
    tip: "Cold proofing 8–16 hrs gives better flavor.", tipFa: "تخمیر سرد ۸ تا ۱۶ ساعته طعم بهتری می‌دهد.",
    timers: [{ label: "Room temp proof", minutes: 90 }], timersFa: [{ label: "تخمیر در دمای محیط", minutes: 90 }],
  },
  {
    id: 6, icon: "flame", phase: "Day 2 · Baking", phaseFa: "روز ۲ — پخت", title: "Score & Bake", titleFa: "خط‌زنی و پخت",
    body: "Preheat Dutch oven 45 min at 230–250°C. Score at 30–45°. Bake covered 20 min, uncovered 20 min.",
    bodyFa: "قابلمهٔ چدنی را ۴۵ دقیقه در دمای ۲۳۰ تا ۲۵۰ درجه گرم کنید. با زاویهٔ ۳۰ تا ۴۵ درجه خط بزنید. ۲۰ دقیقه با در و ۲۰ دقیقه بدون در بپزید.",
    checks: ["Dutch oven preheated 45 min", "Blade at 30–45°", "Ear forms", "Hollow sound when tapped"],
    checksFa: ["قابلمه ۴۵ دقیقه گرم شده", "تیغه با زاویهٔ ۳۰ تا ۴۵ درجه", "«گوش» نان تشکیل شده", "با ضربه صدای توخالی می‌دهد"],
    tip: "Steam in first 20 minutes is critical for oven spring.", tipFa: "بخار در ۲۰ دقیقهٔ اول برای پف فر حیاتی است.",
    timers: [{ label: "Preheat", minutes: 45 }, { label: "Steam", minutes: 20 }, { label: "Crust", minutes: 20 }],
    timersFa: [{ label: "پیش‌گرم", minutes: 45 }, { label: "بخار", minutes: 20 }, { label: "پوسته", minutes: 20 }],
  },
];

const TROUBLE = [
  {
    icon: "flat", problem: "Flat bread / No oven spring", problemFa: "نان تخت / بدون پف در فر",
    causes: ["Weak starter", "Over-fermented", "Weak shaping", "Poor scoring"],
    causesFa: ["استارتر ضعیف", "بیش‌تخمیر شدن", "شکل‌دهی سست", "خط‌زنی نامناسب"],
    fixes: ["Feed starter reliably", "Reduce bulk by 30–60 min", "Build surface tension", "Score 30–45° angle"],
    fixesFa: ["استارتر را منظم تغذیه کنید", "تخمیر اولیه را ۳۰ تا ۶۰ دقیقه کوتاه‌تر کنید", "کشش سطحی ایجاد کنید", "با زاویهٔ ۳۰ تا ۴۵ درجه خط بزنید"],
  },
  {
    icon: "brick", problem: "Dense or gummy crumb", problemFa: "بافت متراکم یا صمغی",
    causes: ["Under-baked", "Sliced while hot", "Under-fermented", "Insufficient gluten"],
    causesFa: ["کم پخته شده", "داغ برش خورده", "کم‌تخمیر بوده", "گلوتن کافی شکل نگرفته"],
    fixes: ["Bake to 92–96°C", "Rest 1 hr (rye 24)", "Extend bulk", "More stretch & folds"],
    fixesFa: ["تا رسیدن به دمای داخلی ۹۲ تا ۹۶ درجه بپزید", "۱ ساعت استراحت (چاودار ۲۴ ساعت)", "تخمیر اولیه را طولانی‌تر کنید", "کشش و تا را بیشتر کنید"],
  },
  {
    icon: "flame", problem: "Too sour / harsh acidity", problemFa: "ترشی بیش‌ازحد / اسیدیتهٔ تند",
    causes: ["Over-fermented", "High starter %", "Long warm proof", "Unbalanced starter"],
    causesFa: ["بیش‌تخمیر شدن", "درصد استارتر بالا", "تخمیر نهایی طولانی در گرما", "استارتر نامتعادل"],
    fixes: ["Shorten bulk", "Reduce starter to 8–10%", "Cold proof", "Rebalance starter"],
    fixesFa: ["تخمیر اولیه را کوتاه کنید", "استارتر را به ۸ تا ۱۰٪ کاهش دهید", "تخمیر سرد انجام دهید", "استارتر را دوباره متعادل کنید"],
  },
  {
    icon: "alert", problem: "Not sour enough", problemFa: "ترشی کافی ندارد",
    causes: ["Under-fermented", "Too fast", "Yeast-dominant starter"],
    causesFa: ["کم‌تخمیر بوده", "تخمیر خیلی سریع", "استارتر غلبهٔ مخمری دارد"],
    fixes: ["Cold proof 24–48 hrs", "Reduce starter to 5–8%", "Cooler water", "Extend bulk"],
    fixesFa: ["۲۴ تا ۴۸ ساعت تخمیر سرد", "استارتر را به ۵ تا ۸٪ برسانید", "از آب خنک‌تر استفاده کنید", "تخمیر اولیه را طولانی‌تر کنید"],
  },
  {
    icon: "droplet", problem: "Dough too sticky", problemFa: "خمیر بیش‌ازحد چسبنده",
    causes: ["Hydration too high", "Under-developed gluten", "Dough too warm"],
    causesFa: ["درصد آب خیلی بالا", "گلوتن کافی رشد نکرده", "خمیر خیلی گرم است"],
    fixes: ["Reduce hydration by 5%", "More stretch & folds", "Refrigerate 30 min", "Wet hands"],
    fixesFa: ["درصد آب را ۵٪ کم کنید", "کشش و تا را بیشتر کنید", "۳۰ دقیقه در یخچال بگذارید", "با دست خیس کار کنید"],
  },
  {
    icon: "brick", problem: "Crust too thick or hard", problemFa: "پوسته خیلی ضخیم یا سفت",
    causes: ["Overbaked", "Not enough steam", "Oven too hot"],
    causesFa: ["بیش‌ازحد پخته", "بخار کافی نبوده", "دمای فر خیلی بالا"],
    fixes: ["Reduce time", "Seal lid tight first 20 min", "Lower temp 10°C"],
    fixesFa: ["زمان پخت را کم کنید", "در ۲۰ دقیقهٔ اول در را محکم ببندید", "دما را ۱۰ درجه کاهش دهید"],
  },
  {
    icon: "timer", problem: "Starter not rising", problemFa: "استارتر بالا نمی‌آید",
    causes: ["Environment cold", "Flour lacks nutrients", "Acid buildup", "Contamination"],
    causesFa: ["محیط سرد است", "آرد مواد مغذی کافی ندارد", "تجمع اسید", "آلودگی"],
    fixes: ["Keep at 24–28°C", "Switch to whole grain", "Discard and restart", "Fresh starter"],
    fixesFa: ["در دمای ۲۴ تا ۲۸ درجه نگهداری کنید", "به آرد کامل تغییر دهید", "دور بریزید و دوباره شروع کنید", "استارتر تازه تهیه کنید"],
  },
  {
    icon: "hole", problem: "Big holes / blowouts", problemFa: "حفره‌های بزرگ / ترکیدگی",
    causes: ["Under-proofed", "Inadequate shaping", "Wrong scoring"],
    causesFa: ["کم‌تخمیر نهایی", "شکل‌دهی ناکافی", "خط‌زنی اشتباه"],
    fixes: ["Extend proof", "Even tension", "Shallower scoring"],
    fixesFa: ["تخمیر نهایی را طولانی‌تر کنید", "کشش یکنواخت ایجاد کنید", "کم‌عمق‌تر خط بزنید"],
  },
];

const QUOTES = [
  { titleEn: "Baker's Principle", titleFa: "اصل نانوا", quoteEn: "There is no recipe you can blindly follow. You will always have to adapt to your locally available tools and environment.", quoteFa: "هیچ دستوری را نمی‌توان کورکورانه دنبال کرد. هر نانوا باید با ابزار و محیط آشپزخانهٔ خود هماهنگ شود.", sourceEn: "The Sourdough Framework", sourceFa: "چارچوب خمیرترش" },
  { titleEn: "The Principle of Water", titleFa: "اصل آب", quoteEn: "The wise adapt themselves to circumstances, as water moulds itself to the pitcher.", quoteFa: "خردمندان خود را با شرایط سازگار می‌کنند، همچون آب که شکل ظرف را به خود می‌گیرد.", sourceEn: "Chinese Proverb", sourceFa: "ضرب‌المثل چینی" },
  { titleEn: "Organic Order", titleFa: "نظم ارگانیک", quoteEn: "Master plans fail because they create totalitarian order, not organic order.", quoteFa: "طرح‌های کلان شکست می‌خورند زیرا نظمی خشک و دیکته‌شده می‌آفرینند، نه نظمی ارگانیک.", sourceEn: "Christopher Alexander", sourceFa: "کریستوفر الکساندر" },
  { titleEn: "The Nature of Progress", titleFa: "سرشت پیشرفت", quoteEn: "Nature does not hurry, yet everything is accomplished.", quoteFa: "طبیعت عجله نمی‌کند، با این حال همه چیز به انجام می‌رسد.", sourceEn: "Lao Tzu", sourceFa: "لائوتسه" },
  { titleEn: "The Craft of Failure", titleFa: "هنر شکست", quoteEn: "Commit as many mistakes as possible, remembering only one thing: don't commit the same mistake again.", quoteFa: "تا می‌توانید اشتباه کنید، اما تنها یک چیز را به خاطر بسپارید: یک اشتباه را هرگز دو بار تکرار نکنید.", sourceEn: "Osho", sourceFa: "اوشو" },
  { titleEn: "The Art of Patience", titleFa: "هنر صبر", quoteEn: "Patience is bitter, but its fruit is sweet.", quoteFa: "صبر تلخ است، اما میوهٔ شیرینی دارد.", sourceEn: "Aristotle", sourceFa: "ارسطو" }
];

const fmt = (n) => Math.round(n * 10) / 10;
const fmt2 = (n) => Math.round(n * 100) / 100;
function getHydrationLevel(h, lang) { const lv = HYDRATION_LEVELS.find((l) => h >= l.range[0] && h <= l.range[1]) || HYDRATION_LEVELS[1]; return { ...lv, label: lang === "fa" ? lv.labelFa : lv.label, desc: lang === "fa" ? lv.descFa : lv.desc }; }
function getWeightFun(g, lang) { const row = WEIGHT_FUN.find(([max]) => g < max) || WEIGHT_FUN[WEIGHT_FUN.length - 1]; return lang === "fa" ? row[2] : row[1]; }
async function copyText(text) { try { await navigator.clipboard.writeText(text); return true; } catch { return false; } }

function BackgroundDecor() {
  const { C, bp } = useApp();
  if (!bp.desktop && !bp.wide) return null;
  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }} aria-hidden="true">
      <div style={{ position: "absolute", top: "-20%", right: "-10%", width: "60vw", height: "60vw", maxWidth: "900px", maxHeight: "900px", borderRadius: "50%", background: `radial-gradient(circle, ${C.decorGlow} 0%, transparent 70%)`, filter: "blur(100px)" }} className="drift" />
    </div>
  );
}

function GlassPanel({ children, style, onClick, hoverable, as: Tag = "div", ...rest }) {
  const { C } = useApp();
  const [hovered, setHovered] = useState(false);
  return (
    <Tag onClick={onClick} onMouseEnter={hoverable ? () => setHovered(true) : undefined} onMouseLeave={hoverable ? () => setHovered(false) : undefined}
      style={{ background: hovered && hoverable ? C.glass.replace(/[\d.]+\)$/, "0.75)") : C.glass, backdropFilter: "blur(40px) saturate(180%)", WebkitBackdropFilter: "blur(40px) saturate(180%)", border: `1px solid ${C.glassBorder}`, boxShadow: `${C.glassShadow}, ${C.glassHighlight}`, borderRadius: 24, transition: "all 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)", cursor: onClick ? "pointer" : "default", ...style }} {...rest}>
      {children}
    </Tag>
  );
}

// ... (Keep all your UI components: Pill, DiffDots, SectionTitle, Label, NumInput, Slider, CopyButton, PageFooter, StepTimer, SegmentedControl, ResultRow exactly as they are, just ensure no trailing backslashes!) ...
// ─── SHARED UI ─────────────────────────────────────────────────────────────
function Pill({ children, color, small }) {
  const { C } = useApp();
  const c = color || C.accent;
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, background: `${c}18`, color: c, padding: small ? "4px 10px" : "6px 14px", borderRadius: 999, fontSize: 14, fontFamily: BODY, fontWeight: 600, letterSpacing: "-0.005em", whiteSpace: "nowrap", border: `1px solid ${c}10` }}>
      {children}
    </span>
  );
}

function DiffDots({ level }) {
  const { C } = useApp();
  return (
    <span style={{ display: "flex", gap: 4, alignItems: "center" }} role="img" aria-label={`Difficulty ${level} of 4`}>
      {[1, 2, 3, 4].map((i) => (
        <span key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: i <= level ? C.accent : C.divider, transition: "background 0.3s ease", boxShadow: i <= level ? `0 0 8px ${C.accent}66` : "none" }} />
      ))}
    </span>
  );
}

function SectionTitle({ title, sub, label }) {
  const { C, getFont, bp } = useApp();
  return (
    <div style={{ marginBottom: bp.mobile ? 32 : 48 }}>
      {label && (
        <div style={{ fontFamily: BODY, fontSize: 13, color: C.accent, fontWeight: 700, letterSpacing: "0.08em", marginBottom: 12, textTransform: "uppercase" }}>
          {label}
        </div>
      )}
      <h2 style={{ fontFamily: getFont("display"), fontSize: bp.mobile ? 40 : bp.tablet ? 48 : 56, fontWeight: 500, color: C.text, lineHeight: 1.05, letterSpacing: "-0.025em", marginBottom: sub ? 16 : 0 }}>
        {title}
      </h2>
      {sub && (
        <p style={{ fontFamily: BODY, color: C.textSub, fontSize: bp.mobile ? 17 : 19, lineHeight: 1.5, maxWidth: 600, letterSpacing: "-0.008em" }}>
          {sub}
        </p>
      )}
    </div>
  );
}

function Label({ children, htmlFor }) {
  const { C } = useApp();
  return (
    <label htmlFor={htmlFor} style={{ display: "block", fontFamily: BODY, fontSize: 13, color: C.textFaint, fontWeight: 600, letterSpacing: "0.02em", marginBottom: 10, textTransform: "uppercase" }}>
      {children}
    </label>
  );
}

function NumInput({ value, onChange, step = 50, min = 1, unit = "g", label, id }) {
  const { C, t, num } = useApp();
  const [display, setDisplay] = useState(num(value));

  useEffect(() => {
    setDisplay(num(value));
  }, [value, num]);

  const parseLocalized = (str) => {
    const normalized = String(str).replace(/[۰-۹]/g, (d) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d)));
    return parseFloat(normalized);
  };

  const commit = (raw) => {
    const n = parseLocalized(raw);
    if (!isNaN(n) && n >= min) {
      onChange(n);
      setDisplay(num(n));
    } else setDisplay(num(value));
  };

  const dec = () => {
    const v = Math.max(min, value - step);
    onChange(v);
    setDisplay(num(v));
  };
  const inc = () => {
    const v = value + step;
    onChange(v);
    setDisplay(num(v));
  };

  return (
    <div style={{ minWidth: 0 }}>
      {label && <Label htmlFor={id}>{label}</Label>}
      <GlassPanel style={{ display: "flex", alignItems: "center", padding: 0, overflow: "hidden", borderRadius: 18 }}>
        <button onClick={dec} aria-label={t("decrease")} type="button" style={{ width: 52, height: 56, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", color: C.textFaint, background: "transparent", borderRight: `1px solid ${C.dividerSoft}`, transition: "color 0.15s, background 0.15s" }}
          onMouseEnter={(e) => { e.currentTarget.style.color = C.accent; e.currentTarget.style.background = C.accentDim; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = C.textFaint; e.currentTarget.style.background = "transparent"; }}>
          <Icon name="minus" size={20} />
        </button>
        <input id={id} type="text" inputMode="decimal" value={display} aria-label={label || "Value"}
          onChange={(e) => {
            setDisplay(e.target.value);
            const n = parseLocalized(e.target.value);
            if (!isNaN(n) && n >= min) onChange(n);
          }}
          onBlur={(e) => commit(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") e.target.blur(); }}
          style={{ flex: 1, minWidth: 0, width: "100%", textAlign: "center", background: "transparent", border: "none", fontFamily: DISPLAY, fontSize: 26, fontWeight: 500, color: C.text, outline: "none", letterSpacing: "-0.02em", padding: "10px 4px" }} />
        <span style={{ fontFamily: BODY, fontSize: 14, color: C.textFaint, padding: "0 10px", fontWeight: 600, flexShrink: 0 }}>{unit}</span>
        <button onClick={inc} aria-label={t("increase")} type="button" style={{ width: 52, height: 56, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", color: C.textFaint, background: "transparent", borderLeft: `1px solid ${C.dividerSoft}`, transition: "color 0.15s, background 0.15s" }}
          onMouseEnter={(e) => { e.currentTarget.style.color = C.accent; e.currentTarget.style.background = C.accentDim; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = C.textFaint; e.currentTarget.style.background = "transparent"; }}>
          <Icon name="plus" size={20} />
        </button>
      </GlassPanel>
    </div>
  );
}

function Slider({ label, value, onChange, min, max, step = 1, unit = "%", sublabel, id }) {
  const { C, num } = useApp();
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div style={{ marginBottom: 28 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 16 }}>
        <label htmlFor={id} style={{ fontFamily: BODY, fontSize: 15, color: C.text, fontWeight: 600, letterSpacing: "-0.005em" }}>
          {label}
          {sublabel && <span style={{ fontFamily: BODY, fontSize: 14, color: C.textFaint, fontWeight: 400, marginLeft: 8 }}>{sublabel}</span>}
        </label>
        <span style={{ fontFamily: DISPLAY, fontSize: 24, color: C.accent, fontWeight: 600, letterSpacing: "-0.01em", fontVariantNumeric: "tabular-nums", transition: "color 0.2s" }}>
          {num(value)}<span style={{ fontSize: 14, color: C.textFaint, fontWeight: 500, marginLeft: 2 }}>{unit}</span>
        </span>
      </div>
      <div style={{ position: "relative", height: 32, display: "flex", alignItems: "center" }}>
        <div style={{ position: "absolute", left: 0, right: 0, height: 8, borderRadius: 999, background: C.divider, overflow: "hidden" }}>
          <div style={{ width: `${pct}%`, height: "100%", background: `linear-gradient(90deg, ${C.accentDeep || C.accent}, ${C.accent})`, borderRadius: 999, transition: "width 0.15s ease-out" }} />
        </div>
        <input id={id} type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(parseFloat(e.target.value))} aria-valuemin={min} aria-valuemax={max} aria-valuenow={value} style={{ position: "relative", background: "transparent", width: "100%" }} />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10 }}>
        <span style={{ fontFamily: BODY, fontSize: 13, color: C.textFaint, fontVariantNumeric: "tabular-nums" }}>{num(min)}{unit}</span>
        <span style={{ fontFamily: BODY, fontSize: 13, color: C.textFaint, fontVariantNumeric: "tabular-nums" }}>{num(max)}{unit}</span>
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
    <button onClick={handleCopy} type="button" aria-live="polite" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 20px", background: state === "done" ? C.success : `linear-gradient(135deg, ${C.accent}, ${C.accentDeep || C.accent})`, color: "#FFFFFF", borderRadius: 999, fontFamily: BODY, fontSize: 14, fontWeight: 600, minHeight: 44, boxShadow: state === "done" ? `0 4px 14px ${C.success}44` : `0 4px 14px ${C.accent}44`, transition: "all 0.25s cubic-bezier(0.22, 1, 0.36, 1)" }}>
      <Icon name={state === "done" ? "check" : "copy"} size={16} color="#FFFFFF" />
      {state === "done" ? t("copiedLabel") : t("copyList")}
    </button>
  );
}

function PageFooter() {
  const { C, t } = useApp();
  return (
    <div style={{ textAlign: "center", padding: "48px 0 24px", marginTop: 24 }}>
      <div style={{ width: 40, height: 1, background: C.divider, margin: "0 auto 20px" }} />
      <div style={{ fontFamily: BODY, fontSize: 14, color: C.textFaint, letterSpacing: "-0.005em" }}>{t("footer")}</div>
    </div>
  );
}

function StepTimer({ label, minutes }) {
  const { C, t, num, bp } = useApp();
  const total = minutes * 60;
  const [seconds, setSeconds] = useState(total);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  useEffect(() => {
    if (!running) return;
    if (seconds <= 0) { setRunning(false); setDone(true); return; }
    const id = setInterval(() => setSeconds((s) => s - 1), 1000);
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
  const stack = bp.mobile;
  const statusText = done ? t("timerDone") : running ? t("timerRunning") : t("timerReady");
  return (
    <GlassPanel role="timer" aria-live="polite" aria-atomic="true" style={{ display: "flex", flexDirection: stack ? "column" : "row", alignItems: stack ? "stretch" : "center", gap: stack ? 14 : 16, padding: "14px 16px", marginBottom: 10, border: `1px solid ${done ? C.success : C.glassBorder}` }}>
      <div style={{ position: "relative", width: 72, height: 72, flexShrink: 0, margin: stack ? "0 auto" : 0 }} aria-hidden="true">
        <svg width="72" height="72" viewBox="0 0 72 72" style={{ transform: "rotate(-90deg)" }}>
          <circle cx="36" cy="36" r="32" stroke={C.divider} strokeWidth="4" fill="none" />
          <circle cx="36" cy="36" r="32" stroke={done ? C.success : C.accent} strokeWidth="4" fill="none" strokeDasharray={circ} strokeDashoffset={strokeOffset} strokeLinecap="round" style={{ transition: "stroke-dashoffset 1s linear, stroke 0.3s" }} />
        </svg>
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: DISPLAY, fontSize: 17, fontWeight: 600, color: done ? C.success : C.text, fontVariantNumeric: "tabular-nums" }}>
          {done ? <Icon name="check" size={20} color={C.success} /> : `${mm}:${ss}`}
        </div>
      </div>
      <div style={{ flex: 1, minWidth: 0, textAlign: stack ? "center" : "left" }}>
        <div style={{ fontFamily: BODY, fontSize: 14, color: C.textFaint, fontWeight: 500, marginBottom: 2, display: "flex", alignItems: "center", gap: 6, justifyContent: stack ? "center" : "flex-start" }}>
          <Icon name="timer" size={14} color={C.textFaint} />{label}
        </div>
        <div style={{ fontFamily: DISPLAY, fontSize: 17, fontWeight: 600, color: done ? C.success : C.text }}>{statusText}</div>
      </div>
      <div style={{ display: "flex", gap: 8, justifyContent: stack ? "center" : "flex-start" }}>
        {!done && (
          <button onClick={() => setRunning((r) => !r)} type="button" style={{ padding: "10px 20px", borderRadius: 999, background: running ? C.accentSoft : `linear-gradient(135deg, ${C.accent}, ${C.accentDeep || C.accent})`, color: running ? C.accent : "#FFFFFF", fontFamily: BODY, fontSize: 14, fontWeight: 600, minWidth: 84, minHeight: 44, boxShadow: running ? "none" : `0 4px 12px ${C.accent}44` }}>
            {running ? t("timerPause") : t("timerStart")}
          </button>
        )}
        <button onClick={reset} aria-label={t("reset")} type="button" style={{ width: 44, height: 44, borderRadius: "50%", background: C.dividerSoft, color: C.textSub, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon name="minus" size={16} color={C.textSub} />
        </button>
      </div>
    </GlassPanel>
  );
}

function SegmentedControl({ options, value, onChange }) {
  const { C } = useApp();
  return (
    <GlassPanel role="tablist" style={{ display: "flex", padding: 4, borderRadius: 18 }}>
      {options.map((opt) => {
        const active = value === opt.value;
        return (
          <button key={opt.value} role="tab" aria-selected={active} type="button" onClick={() => onChange(opt.value)} style={{ flex: 1, padding: "12px 10px", borderRadius: 14, background: active ? `linear-gradient(135deg, ${C.accent}, ${C.accentDeep || C.accent})` : "transparent", color: active ? "#FFFFFF" : C.textSub, fontFamily: BODY, fontSize: 15, fontWeight: 600, transition: "all 0.3s cubic-bezier(0.22, 1, 0.36, 1)", minHeight: 48, display: "flex", flexDirection: "column", alignItems: "center", gap: 3, boxShadow: active ? `0 4px 12px ${C.accent}33` : "none" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              {opt.icon && <Icon name={opt.icon} size={16} />}{opt.label}
            </div>
            {opt.sub && <div style={{ fontSize: 13, fontWeight: 400, opacity: active ? 0.9 : 0.75 }}>{opt.sub}</div>}
          </button>
        );
      })}
    </GlassPanel>
  );
}

function ResultRow({ icon, label, sub, value }) {
  const { C, num } = useApp();
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 0", borderBottom: `1px solid ${C.dividerSoft}`, gap: 12 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0, flex: 1 }}>
        {icon && (
          <div style={{ width: 36, height: 36, borderRadius: 10, background: C.accentSoft, display: "flex", alignItems: "center", justifyContent: "center", color: C.accent, flexShrink: 0 }} aria-hidden="true">
            <Icon name={icon} size={20} />
          </div>
        )}
        <div style={{ minWidth: 0 }}>
          <div style={{ fontFamily: BODY, fontSize: 15, color: C.text, fontWeight: 500, letterSpacing: "-0.005em" }}>{label}</div>
          {sub && <div style={{ fontFamily: BODY, fontSize: 13, color: C.textFaint, marginTop: 2 }}>{sub}</div>}
        </div>
      </div>
      <span style={{ fontFamily: DISPLAY, fontSize: 22, color: C.text, fontWeight: 600, fontVariantNumeric: "tabular-nums", letterSpacing: "-0.01em", flexShrink: 0 }}>
        {num(fmt(value))}<span style={{ fontSize: 14, marginLeft: 2, color: C.textFaint }}>g</span>
      </span>
    </div>
  );
}

// ─── QUOTE CAROUSEL ────────────────────────────────────────────────────────
function QuoteCarousel({ style }) {
  const { C, lang, getFont, bp, theme } = useApp();
  const [activeIndex, setActiveIndex] = useState(0);
  const isDark = theme === "dark";
  useEffect(() => { const timer = setInterval(() => { setActiveIndex((prev) => (prev + 1) % QUOTES.length); }, 5000); return () => clearInterval(timer); }, []);

  return (
    <div style={{ position: "relative", width: "100%", height: bp.mobile ? 340 : 400, display: "flex", alignItems: "center", justifyContent: "center", perspective: "1000px", marginBottom: 40, ...style }}>
      {QUOTES.map((q, i) => {
        let offset = i - activeIndex;
        if (offset > QUOTES.length / 2) offset -= QUOTES.length;
        if (offset < -QUOTES.length / 2) offset += QUOTES.length;
        let transform = "scale(0.5) translateZ(-200px)"; let opacity = 0; let filter = "blur(10px)"; let zIndex = 0; let overlayOpacity = 0;
        const overlayColor = isDark ? "0,0,0" : "255,255,255";
        if (offset === 0) { transform = "scale(1) translateX(0) translateZ(0)"; opacity = 1; filter = "blur(0)"; zIndex = 3; overlayOpacity = 0; } 
        else if (offset === -1 || offset === 1) { transform = `scale(0.8) translateX(${offset === -1 ? '-65%' : '65%'}) translateZ(-100px)`; opacity = 0.9; filter = isDark ? "blur(2px) brightness(0.6)" : "blur(2px) brightness(0.98)"; zIndex = 2; overlayOpacity = isDark ? 0.35 : 0.15; }
        const title = lang === "fa" ? q.titleFa : q.titleEn; const quote = lang === "fa" ? q.quoteFa : q.quoteEn; const source = lang === "fa" ? q.sourceFa : q.sourceEn;
        return (
          <div key={i} style={{ position: "absolute", width: bp.mobile ? "85%" : "60%", maxWidth: 700, height: "100%", transition: "all 0.8s cubic-bezier(0.22, 1, 0.36, 1)", transform, opacity, filter, zIndex, pointerEvents: offset === 0 ? "auto" : "none" }}>
            <GlassPanel style={{ padding: bp.mobile ? "28px 24px" : "40px 48px", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", inset: 0, background: `rgba(${overlayColor},${overlayOpacity})`, transition: "background 0.8s ease", pointerEvents: "none", borderRadius: 24, zIndex: 1 }} />
              <div style={{ position: "relative", zIndex: 2 }}>
                <div style={{ fontFamily: BODY, fontSize: 13, color: C.accent, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 20 }}>{title}</div>
                <p style={{ fontFamily: getFont("display"), fontSize: bp.mobile ? 20 : 26, color: C.text, fontStyle: "italic", lineHeight: 1.5, letterSpacing: "-0.01em", fontWeight: 400, marginBottom: 24, maxWidth: 600 }}>"{quote}"</p>
                <div style={{ fontFamily: BODY, fontSize: 15, color: C.textFaint, letterSpacing: "-0.005em" }}>— {source}</div>
              </div>
            </GlassPanel>
          </div>
        );
      })}
    </div>
  );
}

// ... (Keep HomeTab, BreadCalc, PizzaCalc, StarterCalc, CalcTab, RecipesTab, GuideTab, TroubleTab exactly as they are. Just make sure anywhere you have `lines.join("n")` you change it to `lines.join("\n")`!) ...

// ─── HOME TAB ──────────────────────────────────────────────────────────────
function HomeTab({ setTab }) {
  const { C, t, lang, getFont, bp } = useApp();
  const cards = [
    { icon: "scale", labelKey: "doughCalc", subKey: "doughCalcSub", tab: "calc" },
    { icon: "pizza", labelKey: "pizzaCalc", subKey: "pizzaCalcSub", tab: "pizza" },
    { icon: "book", labelKey: "recipes", subKey: "recipesSub", tab: "recipes" },
    { icon: "compass", labelKey: "guide", subKey: "guideSub", tab: "guide" },
    { icon: "wrench", labelKey: "trouble", subKey: "troubleSub", tab: "trouble" },
    { icon: "flask", labelKey: "starter", subKey: "starterSub", tab: "starter" },
  ];
  
  const gridCols = bp.mobile ? 2 : bp.tablet ? 3 : bp.desktop ? 3 : 6;
  const isWideLayout = bp.desktop || bp.wide;

  return (
    <div style={{ padding: bp.mobile ? "0 24px 32px" : bp.tablet ? "0 40px 40px" : "0 48px 48px", width: "100%", margin: "0 auto" }} className="fade-up">
      <div style={{ marginBottom: isWideLayout ? 56 : 40, paddingTop: isWideLayout ? 32 : 20, maxWidth: isWideLayout ? 900 : "none" }}>
        <div style={{ fontFamily: BODY, fontSize: 13, color: C.accent, fontWeight: 700, letterSpacing: "0.08em", marginBottom: 12, textTransform: "uppercase" }}>
          {t("appTagline").toUpperCase()}
        </div>
        <h1 style={{ fontFamily: getFont("display"), fontSize: bp.mobile ? 56 : bp.tablet ? 72 : bp.desktop ? 88 : 108, fontWeight: 500, color: C.text, lineHeight: 0.95, letterSpacing: "-0.035em", marginBottom: 20, fontVariationSettings: "'opsz' 144" }}>
          {t("appName")}
        </h1>
        <p style={{ fontFamily: BODY, fontSize: bp.mobile ? 18 : bp.tablet ? 20 : 22, color: C.textSub, lineHeight: 1.5, letterSpacing: "-0.01em", maxWidth: isWideLayout ? 640 : 480 }}>
          {t("taglineSub")}
        </p>
      </div>


      <div style={{ fontFamily: BODY, fontSize: 13, color: C.textFaint, fontWeight: 700, letterSpacing: "0.08em", marginBottom: 16, textTransform: "uppercase" }}>
        {t("toolsSections")}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${gridCols}, 1fr)`, gap: bp.mobile ? 12 : bp.tablet ? 16 : 20, marginBottom: isWideLayout ? 56 : 40 }}>
        {cards.map((card, i) => (
          <GlassPanel key={card.tab} hoverable onClick={() => setTab(card.tab)} style={{ padding: bp.mobile ? "24px 20px" : "28px 24px", animation: `fadeUp 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) ${i * 0.05}s backwards` }}>
            <div style={{ width: isWideLayout ? 56 : 48, height: isWideLayout ? 56 : 48, borderRadius: isWideLayout ? 16 : 14, background: C.accentSoft, display: "flex", alignItems: "center", justifyContent: "center", color: C.accent, marginBottom: isWideLayout ? 20 : 16 }}>
              <Icon name={card.icon} size={isWideLayout ? 30 : 26} />
            </div>
            <div style={{ fontFamily: DISPLAY, fontSize: bp.mobile ? 19 : bp.tablet ? 20 : 22, color: C.text, fontWeight: 600, marginBottom: 6, letterSpacing: "-0.015em", lineHeight: 1.2 }}>
              {t(card.labelKey)}
            </div>
            <div style={{ fontFamily: BODY, fontSize: 14, color: C.textFaint, lineHeight: 1.4, letterSpacing: "-0.005em" }}>
              {t(card.subKey)}
            </div>
          </GlassPanel>
        ))}
      </div>

      <QuoteCarousel />

      <PageFooter />
    </div>
  );
}

// ─── BREAD CALCULATOR ──────────────────────────────────────────────────────
function BreadCalc() {
  const { C, t, lang, num, bp } = useApp();
  const [leavenType, setLeavenType] = useState("sourdough");
  const [yeastType, setYeastType] = useState("dry");
  const [inputMode, setInputMode] = useState("flour");
  const [flourPerLoaf, setFlourPerLoaf] = useState(500);
  const [totalWeight, setTotalWeight] = useState(900);
  const [hydration, setHydration] = useState(75);
  const [starterPct, setStarterPct] = useState(10);
  const [yeastPct, setYeastPct] = useState(0.5);
  const [saltPct, setSaltPct] = useState(2);
  const [wholeGrain, setWholeGrain] = useState(20);

  const YEAST_DEFAULTS = { fresh: 2.0, dry: 0.5 };
  const YEAST_RANGES = { fresh: [0.5, 5], dry: [0.1, 2] };
  useEffect(() => { setYeastPct(YEAST_DEFAULTS[yeastType]); }, [yeastType]);

  const leavenPct = leavenType === "sourdough" ? starterPct : yeastPct;

  const dough = useMemo(() => {
    let flour;
    if (inputMode === "flour") {
      flour = flourPerLoaf;
    } else {
      flour = totalWeight / (1 + hydration / 100 + leavenPct / 100 + saltPct / 100);
    }
    const water = (flour * hydration) / 100;
    const leaven = (flour * leavenPct) / 100;
    const salt = (flour * saltPct) / 100;
    const total = flour + water + leaven + salt;
    const breadFlour = flour * (1 - wholeGrain / 100);
    const wgFlour = (flour * wholeGrain) / 100;
    return { flour, water, leaven, salt, total, breadFlour, wgFlour };
  }, [inputMode, flourPerLoaf, totalWeight, hydration, leavenPct, saltPct, wholeGrain]);

  const hLevel = getHydrationLevel(hydration, lang);
  const leavenLabel = leavenType === "sourdough"
    ? `${t("starterLabel")}: ${num(fmt(dough.leaven))}g`
    : `${t("yeastLabel")} (${yeastType === "fresh" ? t("freshYeast") : t("dryYeast")}): ${num(fmt(dough.leaven))}g`;

  const getShoppingList = () => {
    const d = dough;
    const lines = [
      t("breadCalc"),
      wholeGrain > 0 ? `${t("breadFlour")}: ${num(fmt(d.breadFlour))}g` : `${t("flour")}: ${num(fmt(d.flour))}g`,
      wholeGrain > 0 ? `${t("wgFlour")}: ${num(fmt(d.wgFlour))}g` : null,
      `${t("water")}: ${num(fmt(d.water))}g`,
      leavenLabel,
      `${t("salt")}: ${num(fmt(d.salt))}g`,
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
        <SegmentedControl value={leavenType} onChange={setLeavenType} options={[
          { value: "sourdough", label: t("sourdoughOpt"), sub: t("sourdoughSub"), icon: "flask" },
          { value: "yeast", label: t("yeastOpt"), sub: t("yeastSub"), icon: "sparkles" },
        ]} />
      </div>

      {leavenType === "yeast" && (
        <div style={{ marginBottom: 24 }}>
          <Label>{t("yeastType")}</Label>
          <div style={{ display: "flex", gap: 8 }}>
            {[["fresh", "freshYeast"], ["dry", "dryYeast"]].map(([id, lKey]) => (
              <button key={id} onClick={() => setYeastType(id)} type="button" style={{ flex: 1, padding: "12px 8px", borderRadius: 14, border: `1.5px solid ${yeastType === id ? C.accent : C.divider}`, background: yeastType === id ? C.accentSoft : "transparent", color: yeastType === id ? C.accent : C.textSub, fontFamily: BODY, fontSize: 15, fontWeight: 600, minHeight: 48 }}>
                {t(lKey)}
              </button>
            ))}
          </div>
        </div>
      )}

      <div style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
          {[["flour", "byFlour"], ["total", "byTotal"]].map(([id, lKey]) => (
            <button key={id} onClick={() => setInputMode(id)} type="button" style={{ flex: 1, padding: "12px 8px", borderRadius: 14, border: `1.5px solid ${inputMode === id ? C.accent : C.divider}`, background: inputMode === id ? C.accentSoft : "transparent", color: inputMode === id ? C.accent : C.textSub, fontFamily: BODY, fontSize: 14, fontWeight: 600, minHeight: 48 }}>
              {t(lKey)}
            </button>
          ))}
        </div>
        <NumInput id="weight-input" value={inputMode === "flour" ? flourPerLoaf : totalWeight} onChange={(v) => (inputMode === "flour" ? setFlourPerLoaf(v) : setTotalWeight(v))} step={50} min={50} label={inputMode === "flour" ? t("flourPerLoaf") : t("totalDoughWeight")} />
      </div>

      <GlassPanel style={{ padding: "26px 22px 16px", marginBottom: 24 }}>
        <Slider id="hydration" label={t("hydration")} value={hydration} onChange={setHydration} min={55} max={110} />
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: -4, marginBottom: 22, padding: "14px 16px", background: C.accentDim, borderRadius: 14, border: `1px solid ${C.accentSoft}` }}>
          <Pill color={C.accent} small>{hLevel.label}</Pill>
          <span style={{ fontFamily: BODY, fontSize: 14, color: C.textSub, letterSpacing: "-0.005em" }}>{hLevel.desc}</span>
        </div>
        {leavenType === "sourdough" ? (
          <Slider id="starter" label={t("starterLabel")} value={starterPct} onChange={setStarterPct} min={5} max={30} />
        ) : (
          <Slider id="yeast" label={`${t("yeastLabel")} · ${yeastType === "fresh" ? t("freshYeast") : t("dryYeast")}`} value={yeastPct} onChange={setYeastPct} min={YEAST_RANGES[yeastType][0]} max={YEAST_RANGES[yeastType][1]} step={0.05} />
        )}
        <Slider id="salt" label={t("salt")} value={saltPct} onChange={setSaltPct} min={1.5} max={3} step={0.1} />
        <Slider id="wholegrain" label={t("wholeGrain")} value={wholeGrain} onChange={setWholeGrain} min={0} max={100} sublabel={t("ofTotalFlour")} />
      </GlassPanel>
    </div>
  );

  const resultsPanel = (
    <div style={{ position: isDesktop ? "sticky" : "static", top: 100 }}>
      <GlassPanel style={{ padding: "24px 24px 22px", background: `linear-gradient(135deg, ${C.glass}, ${C.accentDim})`, marginBottom: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18, paddingBottom: 14, borderBottom: `1px solid ${C.divider}`, flexWrap: "wrap", gap: 12 }}>
          <span style={{ fontFamily: BODY, fontSize: 13, color: C.accent, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>{t("yourFormula")}</span>
          <CopyButton getText={getShoppingList} />
        </div>
        {wholeGrain > 0 ? (
          <>
            <ResultRow icon="wheat" label={t("breadFlour")} sub={`${num(100 - wholeGrain)}%`} value={dough.breadFlour} />
            <ResultRow icon="rye" label={t("wgFlour")} sub={`${num(wholeGrain)}%`} value={dough.wgFlour} />
          </>
        ) : (
          <ResultRow icon="wheat" label={t("flour")} sub="100%" value={dough.flour} />
        )}
        <ResultRow icon="droplet" label={t("water")} sub={`${num(hydration)}%`} value={dough.water} />
        <ResultRow icon={leavenType === "sourdough" ? "flask" : "sparkles"} label={leavenType === "sourdough" ? t("starterLabel") : `${yeastType === "fresh" ? t("freshYeast") : t("dryYeast")} ${t("yeastLabel")}`} sub={`${num(leavenPct)}%`} value={dough.leaven} />
        <ResultRow icon="salt" label={t("salt")} sub={`${num(saltPct)}%`} value={dough.salt} />

        <div style={{ paddingTop: 18, marginTop: 14, display: "flex", justifyContent: "space-between", alignItems: "baseline", borderTop: `2px solid ${C.divider}` }}>
          <span style={{ fontFamily: BODY, fontSize: 13, color: C.accent, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>{t("total")}</span>
          <span style={{ fontFamily: DISPLAY, fontSize: isDesktop ? 42 : 36, color: C.accent, fontWeight: 600, letterSpacing: "-0.02em", fontVariantNumeric: "tabular-nums" }}>
            {num(fmt(dough.total))} <span style={{ fontSize: 15, marginLeft: 4, color: C.textFaint }}>g</span>
          </span>
        </div>
        <div style={{ marginTop: 12, fontFamily: BODY, fontSize: 14, color: C.textFaint, fontStyle: "italic", textAlign: "right", letterSpacing: "-0.005em" }}>
          {getWeightFun(dough.total, lang)}
        </div>
      </GlassPanel>

      <GlassPanel style={{ overflow: "hidden" }}>
        <div style={{ padding: "16px 22px", borderBottom: `1px solid ${C.divider}` }}>
          <span style={{ fontFamily: BODY, fontSize: 13, color: C.textFaint, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>{t("hydGuide")}</span>
        </div>
        {HYDRATION_LEVELS.map((l, i, arr) => {
          const label = lang === "fa" ? l.labelFa : l.label;
          const desc = lang === "fa" ? l.descFa : l.desc;
          const active = hydration >= l.range[0] && hydration <= l.range[1];
          return (
            <div key={l.label} style={{ display: "flex", gap: 14, alignItems: "center", padding: "14px 22px", borderBottom: i < arr.length - 1 ? `1px solid ${C.divider}` : "none", background: active ? C.accentDim : "transparent", transition: "background 0.3s" }}>
              <span style={{ fontFamily: DISPLAY, fontSize: 15, color: active ? C.accent : C.textSub, fontWeight: 600, minWidth: 90, fontVariantNumeric: "tabular-nums" }}>
                {num(l.range[0])}–{num(l.range[1])}%
              </span>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: BODY, fontSize: 15, color: active ? C.accent : C.text, fontWeight: 600, marginBottom: 2 }}>{label}</div>
                <div style={{ fontFamily: BODY, fontSize: 14, color: C.textFaint }}>{desc}</div>
              </div>
            </div>
          );
        })}
      </GlassPanel>
    </div>
  );

  if (isDesktop) {
    return (
      <div style={{ display: "grid", gridTemplateColumns: bp.wide ? "1.2fr 1fr" : "1fr 1fr", gap: 32, alignItems: "start" }}>
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
  const [doughType, setDoughType] = useState("yeast");
  const [ovenType, setOvenType] = useState("home");
  const [pizzaCount, setPizzaCount] = useState(4);
  const [ballWeight, setBallWeight] = useState(270);
  const [hydration, setHydration] = useState(60);
  const [starterPct, setStarterPct] = useState(10);
  const [showToppings, setShowToppings] = useState(false);
  const [yeastType, setYeastType] = useState("dry");

  const oven = PIZZA_OVENS.find((o) => o.id === ovenType);

  const pizza = useMemo(() => {
    const totalDough = pizzaCount * ballWeight;
    const starterPctValue = doughType === "sourdough" ? starterPct : 5;
    const saltPct = 2;
    const starterOrYeast = starterPctValue / 100;
    const flour = totalDough / (1 + hydration / 100 + saltPct / 100 + starterOrYeast);
    const water = (flour * hydration) / 100;
    const salt = (flour * saltPct) / 100;
    const dryYeastAmt = flour * 0.001;
    const freshYeastAmt = flour * 0.003;
    const starter = flour * (starterPctValue / 100);
    const mozzarella = 80 * pizzaCount;
    const tomatoSauce = 60 * pizzaCount;
    const oliveOil = 6 * pizzaCount;
    const basil = 10 * pizzaCount;
    const basilPots = Math.ceil(basil / 80);
    return { totalDough, flour, water, salt, freshYeastAmt, dryYeastAmt, starter, mozzarella, tomatoSauce, oliveOil, basil, basilPots };
  }, [pizzaCount, ballWeight, hydration, doughType, yeastType, starterPct]);

  const hLevel = getHydrationLevel(hydration, lang);

  const getShoppingList = () => {
    const lines = [
      `${t("pizzaCalcTitle")} — ${num(pizzaCount)} ${lang === "fa" ? "پیتزا" : "pizza"}${pizzaCount > 1 && lang !== "fa" ? "s" : ""}`,
      `${lang === "fa" ? "آرد" : "Flour"}: ${num(fmt(pizza.flour))}g`,
      `${t("water")}: ${num(fmt(pizza.water))}g`,
      `${t("salt")}: ${num(fmt(pizza.salt))}g`,
      doughType === "yeast"
        ? `${t("freshYeastLabel")}: ${num(fmt2(pizza.freshYeastAmt))}g (${t("dryYeast")}: ${num(fmt2(pizza.dryYeastAmt))}g)`
        : `${t("activeStarter")}: ${num(fmt(pizza.starter))}g`,
    ].filter(Boolean);
    return lines.join("\n");
  };

  const partyMsg = pizzaCount === 1 ? t("soloMode") : pizzaCount === 2 ? t("dateNight") : pizzaCount <= 4 ? t("pizzaParty") : pizzaCount <= 8 ? t("bigGathering") : t("fullBakery");

  const pizzaTips = lang === "fa" ? [
    { icon: "timer", title: "تخمیر آهسته، سلاح پنهان شماست", body: "مخمر کم همراه با تخمیر طولانی و سرد، طعم را دگرگون می‌کند." },
    { icon: "flame", title: "حرارت بالا ضروری است", body: "فر را تا بیشترین دما گرم کنید. سنگ یا صفحهٔ فولادی در بالاترین طبقه ایده‌آل است." },
    { icon: "sparkles", title: "در تزیین، کمتر یعنی بیشتر", body: "چند مادهٔ باکیفیت همیشه بهتر از انبوهی از مواد است." },
  ] : [
    { icon: "timer", title: "Slow fermentation is your secret weapon", body: "Low yeast + long, cold rise improves flavor dramatically." },
    { icon: "flame", title: "High heat is essential", body: "Preheat as hot as possible. Stone or steel on top rack is ideal." },
    { icon: "sparkles", title: "Less is more with toppings", body: "A few quality ingredients beat a mountain every time." },
  ];

  const isDesktop = bp.desktop || bp.wide;

  const controlsPanel = (
    <div>
      <div style={{ marginBottom: 24 }}>
        <Label>{t("doughType")}</Label>
        <SegmentedControl value={doughType} onChange={setDoughType} options={[
          { value: "yeast", label: t("yeastPizza"), sub: t("yeastPizzaSub"), icon: "sparkles" },
          { value: "sourdough", label: t("sourdoughPizza"), sub: t("sourdoughPizzaSub"), icon: "flask" },
        ]} />
      </div>

      {doughType === "yeast" && (
        <div style={{ marginBottom: 24 }}>
          <Label>{t("yeastType")}</Label>
          <div style={{ display: "flex", gap: 8 }}>
            {[["fresh", "freshYeast"], ["dry", "dryYeast"]].map(([id, lKey]) => (
              <button key={id} onClick={() => setYeastType(id)} type="button" style={{ flex: 1, padding: "12px 8px", borderRadius: 14, border: `1.5px solid ${yeastType === id ? C.accent : C.divider}`, background: yeastType === id ? C.accentSoft : "transparent", color: yeastType === id ? C.accent : C.textSub, fontFamily: BODY, fontSize: 15, fontWeight: 600, minHeight: 48 }}>
                {t(lKey)}
              </button>
            ))}
          </div>
        </div>
      )}

      <GlassPanel style={{ padding: "24px", marginBottom: 24 }}>
        <Label>{t("pizzas")}</Label>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: C.bgAlt, border: `1px solid ${C.divider}`, borderRadius: 16, padding: "8px 10px", boxShadow: C.glassShadow, marginBottom: 12 }}>
          <button onClick={() => setPizzaCount(Math.max(1, pizzaCount - 1))} aria-label={t("decrease")} type="button" style={{ background: "transparent", color: C.textFaint, width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 12 }}>
            <Icon name="minus" size={20} />
          </button>
          <span style={{ fontFamily: DISPLAY, fontSize: 36, color: C.accent, fontWeight: 600, fontVariantNumeric: "tabular-nums", letterSpacing: "-0.02em" }}>{num(pizzaCount)}</span>
          <button onClick={() => setPizzaCount(Math.min(20, pizzaCount + 1))} aria-label={t("increase")} type="button" style={{ background: "transparent", color: C.textFaint, width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 12 }}>
            <Icon name="plus" size={20} />
          </button>
        </div>
        <div style={{ fontFamily: BODY, fontSize: 14, color: C.textFaint, textAlign: "center", letterSpacing: "-0.005em", fontStyle: "italic", marginBottom: 24 }}>{partyMsg}</div>

        <NumInput id="ball-weight" value={ballWeight} onChange={setBallWeight} step={10} min={150} unit="g" label={t("pizzaDoughWeight")} />
        <div style={{ fontFamily: BODY, fontSize: 13, color: C.textFaint, marginTop: 10, marginBottom: 24, textAlign: "center", letterSpacing: "-0.005em" }}>
          {ovenType === "home" ? t("homeFor") : t("proFor")}
        </div>

        <div style={{ borderTop: `1px solid ${C.dividerSoft}`, paddingTop: 20 }}>
          <Slider id="pizza-hyd" label={t("hydration")} value={hydration} onChange={setHydration} min={55} max={75} />
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: -4, marginBottom: doughType === "sourdough" ? 24 : 0, padding: "14px 16px", background: C.accentDim, borderRadius: 14, border: `1px solid ${C.accentSoft}` }}>
            <Pill color={C.accent} small>{hLevel.label}</Pill>
            <span style={{ fontFamily: BODY, fontSize: 14, color: C.textSub, letterSpacing: "-0.005em" }}>{hLevel.desc}</span>
          </div>
          
          {doughType === "sourdough" && (
            <Slider id="pizza-starter" label={t("starterAmount")} value={starterPct} onChange={setStarterPct} min={5} max={30} />
          )}
        </div>
      </GlassPanel>
    </div>
  );

  const resultsPanel = (
    <div style={{ position: isDesktop ? "sticky" : "static", top: 100 }}>
      <GlassPanel style={{ padding: "24px 24px 22px", background: `linear-gradient(135deg, ${C.glass}, ${C.accentDim})`, marginBottom: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18, paddingBottom: 14, borderBottom: `1px solid ${C.divider}`, flexWrap: "wrap", gap: 12 }}>
          <span style={{ fontFamily: BODY, fontSize: 13, color: C.accent, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>
            {num(pizzaCount)} {lang === "fa" ? "پیتزا" : "pizza"}{pizzaCount > 1 && lang !== "fa" ? "s" : ""} · {num(fmt(pizza.totalDough))}g
          </span>
          <CopyButton getText={getShoppingList} />
        </div>
        <ResultRow icon="wheat" label={lang === "fa" ? "آرد" : "Flour"} value={pizza.flour} />
        <ResultRow icon="droplet" label={t("water")} value={pizza.water} />
        <ResultRow icon="salt" label={t("salt")} value={pizza.salt} />
        {doughType === "yeast" ? (
          <>
            <ResultRow icon="sparkles" label={`${yeastType === "fresh" ? t("freshYeast") : t("dryYeast")} ${t("yeastLabel")}`} value={yeastType === "fresh" ? pizza.freshYeastAmt : pizza.dryYeastAmt} />
            <div style={{ padding: "6px 0 12px", borderBottom: `1px solid ${C.dividerSoft}`, paddingLeft: 48 }}>
              <span style={{ fontFamily: BODY, fontSize: 13, color: C.textFaint }}>
                {yeastType === "fresh" ? `${t("dryYeast")}: ${num(fmt2(pizza.dryYeastAmt))}g` : `${t("freshYeastLabel")}: ${num(fmt2(pizza.freshYeastAmt))}g`}
              </span>
            </div>
          </>
        ) : (
          <ResultRow icon="flask" label={t("activeStarter")} value={pizza.starter} />
        )}
        <div style={{ paddingTop: 18, display: "flex", justifyContent: "space-between", alignItems: "baseline", marginTop: 12, borderTop: `2px solid ${C.divider}` }}>
          <span style={{ fontFamily: BODY, fontSize: 13, color: C.accent, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>{t("totalDough")}</span>
          <span style={{ fontFamily: DISPLAY, fontSize: 30, color: C.accent, fontWeight: 600, fontVariantNumeric: "tabular-nums", letterSpacing: "-0.02em" }}>
            {num(fmt(pizza.totalDough))} <span style={{ fontSize: 14, marginLeft: 3, color: C.textFaint }}>g</span>
          </span>
        </div>
      </GlassPanel>

      <GlassPanel style={{ overflow: "hidden", height: "fit-content", marginBottom: 20 }}>
        <button onClick={() => setShowToppings(!showToppings)} type="button" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", padding: "18px 22px", background: "transparent", minHeight: 60 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: C.accentSoft, display: "flex", alignItems: "center", justifyContent: "center", color: C.accent }}>
              <Icon name="tomato" size={22} />
            </div>
            <span style={{ fontFamily: DISPLAY, fontSize: 18, color: C.text, fontWeight: 600, letterSpacing: "-0.01em" }}>{t("toppingsBtn")}</span>
          </div>
          <div style={{ color: C.textFaint, transform: showToppings ? "rotate(90deg)" : "none", transition: "transform 0.3s cubic-bezier(0.32, 0.72, 0, 1)" }}>
            <Icon name="chevronRight" size={22} />
          </div>
        </button>
        {showToppings && (
          <div style={{ borderTop: `1px solid ${C.divider}`, padding: "16px 22px 18px", background: C.accentDim }}>
            <ResultRow icon="cheese" label={lang === "fa" ? "موتزارلا" : "Mozzarella"} value={pizza.mozzarella} />
            <ResultRow icon="tomato" label={lang === "fa" ? "سس گوجه" : "Tomato sauce"} value={pizza.tomatoSauce} />
            <ResultRow icon="olive" label={lang === "fa" ? "روغن زیتون" : "Olive oil"} value={pizza.oliveOil} />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", gap: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: C.accentSoft, display: "flex", alignItems: "center", justifyContent: "center", color: C.accent }}>
                  <Icon name="leaf" size={18} />
                </div>
                <span style={{ fontFamily: BODY, fontSize: 15, color: C.text, fontWeight: 500 }}>{lang === "fa" ? "ریحان" : "Basil leaves"}</span>
              </div>
              <span style={{ fontFamily: DISPLAY, fontSize: 17, color: C.text, fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>
                {num(pizza.basil)}g
                <span style={{ fontSize: 13, color: C.textFaint, marginLeft: 6, fontFamily: BODY }}>
                  (≈ {num(pizza.basilPots)} {lang === "fa" ? "گلدان" : "pot"}{pizza.basilPots > 1 && lang !== "fa" ? "s" : ""})
                </span>
              </span>
            </div>
          </div>
        )}
      </GlassPanel>
    </div>
  );

  const ovenSection = (
    <div style={{ marginTop: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
        <Icon name="flame" size={18} color={C.accent} />
        <span style={{ fontFamily: BODY, fontSize: 13, color: C.accent, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>{t("yourOven")}</span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: isDesktop ? 16 : 10, marginBottom: 16 }}>
        {PIZZA_OVENS.map((o) => {
          const active = ovenType === o.id;
          return (
            <GlassPanel key={o.id} hoverable onClick={() => setOvenType(o.id)} style={{ padding: isDesktop ? "28px 16px" : "20px 12px", textAlign: "center", border: active ? `2px solid ${C.accent}` : `1px solid ${C.glassBorder}`, background: active ? `linear-gradient(135deg, ${C.accentSoft}, ${C.glass})` : C.glass, minHeight: isDesktop ? 160 : 120, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: isDesktop ? 12 : 10 }}>
              <div style={{ width: isDesktop ? 60 : 48, height: isDesktop ? 60 : 48, borderRadius: isDesktop ? 18 : 14, background: active ? `linear-gradient(135deg, ${C.accent}, ${C.accentDeep || C.accent})` : C.accentSoft, color: active ? "#FFFFFF" : C.accent, display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.3s", boxShadow: active ? `0 4px 16px ${C.accent}44` : "none" }}>
                <Icon name={o.icon} size={isDesktop ? 32 : 26} color={active ? "#FFFFFF" : C.accent} />
              </div>
              <div style={{ fontFamily: DISPLAY, fontSize: isDesktop ? 19 : 17, fontWeight: 600, color: active ? C.accent : C.text, letterSpacing: "-0.01em", lineHeight: 1.2 }}>{lang === "fa" ? o.nameFa : o.nameEn}</div>
              <div style={{ fontFamily: BODY, fontSize: isDesktop ? 15 : 14, color: C.textFaint, fontVariantNumeric: "tabular-nums", fontWeight: 500 }}>{o.temp}</div>
            </GlassPanel>
          );
        })}
      </div>

      {oven && (
        <GlassPanel style={{ padding: "20px 22px", background: `linear-gradient(135deg, ${C.accentDim}, ${C.glass})`, border: `1px solid ${C.accentSoft}` }}>
          <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
            <div style={{ width: 48, height: 48, borderRadius: 14, background: C.accentSoft, display: "flex", alignItems: "center", justifyContent: "center", color: C.accent, flexShrink: 0 }}>
              <Icon name={oven.icon} size={26} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: DISPLAY, fontSize: isDesktop ? 20 : 18, color: C.accent, fontWeight: 600, marginBottom: 6, letterSpacing: "-0.01em" }}>{lang === "fa" ? oven.nameFa : oven.nameEn}</div>
              <div style={{ fontFamily: BODY, fontSize: isDesktop ? 16 : 15, color: C.textSub, lineHeight: 1.55, letterSpacing: "-0.005em" }}>{lang === "fa" ? oven.tipFa : oven.tip}</div>
            </div>
          </div>
        </GlassPanel>
      )}
    </div>
  );

  const tipsSection = (
    <GlassPanel style={{ marginTop: 24, padding: isDesktop ? "28px 26px" : "24px 22px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
        <Icon name="sparkles" size={18} color={C.accent} />
        <span style={{ fontFamily: BODY, fontSize: 13, color: C.accent, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>{t("proTips")}</span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 20 }}>
        {pizzaTips.map((tip) => (
          <div key={tip.title} style={{ display: "flex", gap: 14, flexDirection: isDesktop ? "column" : "row" }}>
            <div style={{ width: isDesktop ? 48 : 44, height: isDesktop ? 48 : 44, borderRadius: isDesktop ? 14 : 12, background: C.accentSoft, display: "flex", alignItems: "center", justifyContent: "center", color: C.accent, flexShrink: 0 }}>
              <Icon name={tip.icon} size={isDesktop ? 24 : 22} />
            </div>
            <div>
              <div style={{ fontFamily: DISPLAY, fontSize: isDesktop ? 17 : 16, color: C.text, fontWeight: 600, marginBottom: 4, letterSpacing: "-0.01em" }}>{tip.title}</div>
              <div style={{ fontFamily: BODY, fontSize: 15, color: C.textSub, lineHeight: 1.55, letterSpacing: "-0.005em" }}>{tip.body}</div>
            </div>
          </div>
        ))}
      </div>
    </GlassPanel>
  );

  if (isDesktop) {
    return (
      <div>
        <div style={{ display: "grid", gridTemplateColumns: bp.wide ? "1.2fr 1fr" : "1fr 1fr", gap: 32, alignItems: "start" }}>
          {controlsPanel}
          {resultsPanel}
        </div>
        {ovenSection}
        {tipsSection}
      </div>
    );
  }
  return (
    <div>
      {controlsPanel}
      {resultsPanel}
      {ovenSection}
      {tipsSection}
    </div>
  );
}

// ─── STARTER CALCULATOR ────────────────────────────────────────────────────
function StarterCalc() {
  const { C, t, lang, num, bp } = useApp();
  const [targetStarter, setTargetStarter] = useState(200);
  const [feedRatio, setFeedRatio] = useState(1);

  const starterCalc = useMemo(() => {
    const r = FEED_RATIOS[feedRatio];
    const parts = r.seed + r.flour + r.water;
    return { seed: (targetStarter * r.seed) / parts, flour: (targetStarter * r.flour) / parts, water: (targetStarter * r.water) / parts };
  }, [targetStarter, feedRatio]);

  const getShoppingList = () => [
    t("starterTitle"),
    `${t("seedStarter")}: ${num(fmt(starterCalc.seed))}g`,
    `${t("freshFlour")}: ${num(fmt(starterCalc.flour))}g`,
    `${t("freshWater")}: ${num(fmt(starterCalc.water))}g`,
    `${lang === "fa" ? "نسبت" : "Ratio"}: ${FEED_RATIOS[feedRatio].label}`,
    `${t("readyStarter")}: ${num(fmt(targetStarter))}g`,
  ].join("\n");

  const ratioDescs = FEED_RATIO_DESCS.map((k) => t(k));
  const isDesktop = bp.desktop || bp.wide;

  return (
    <div>
      <SectionTitle title={t("starterTitle")} sub={t("starterSub2")} />
      <div style={{ display: isDesktop ? "grid" : "block", gridTemplateColumns: "1fr 1fr", gap: 28 }}>
        <div>
          <div style={{ marginBottom: 28 }}>
            <NumInput id="target-starter" value={targetStarter} onChange={setTargetStarter} step={10} min={10} label={t("howMuchStarter")} />
          </div>
          <div style={{ marginBottom: isDesktop ? 0 : 28 }}>
            <Label>{t("feedingRatio")}</Label>
            <div style={{ display: "flex", background: C.bgAlt, borderRadius: 18, padding: 4, border: `1px solid ${C.divider}`, boxShadow: C.glassShadow }}>
              {FEED_RATIOS.map((r, i) => (
                <button key={r.label} onClick={() => setFeedRatio(i)} type="button" style={{ flex: 1, padding: "14px 4px", borderRadius: 14, background: feedRatio === i ? `linear-gradient(135deg, ${C.accent}, ${C.accentDeep || C.accent})` : "transparent", color: feedRatio === i ? "#FFFFFF" : C.textSub, fontFamily: DISPLAY, fontSize: 15, fontWeight: 600, fontVariantNumeric: "tabular-nums", minHeight: 48, boxShadow: feedRatio === i ? `0 4px 12px ${C.accent}33` : "none" }}>
                  {r.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <GlassPanel style={{ padding: "24px 24px 22px", background: `linear-gradient(135deg, ${C.glass}, ${C.accentDim})` }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18, paddingBottom: 14, borderBottom: `1px solid ${C.divider}`, flexWrap: "wrap", gap: 12 }}>
            <span style={{ fontFamily: BODY, fontSize: 13, color: C.accent, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>{t("feedingFormula")}</span>
            <CopyButton getText={getShoppingList} />
          </div>
          <ResultRow icon="flask" label={t("seedStarter")} value={starterCalc.seed} />
          <ResultRow icon="wheat" label={t("freshFlour")} value={starterCalc.flour} />
          <ResultRow icon="droplet" label={t("freshWater")} value={starterCalc.water} />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", paddingTop: 18, marginTop: 12, borderTop: `2px solid ${C.divider}` }}>
            <span style={{ fontFamily: BODY, fontSize: 13, color: C.accent, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>{t("readyStarter")}</span>
            <span style={{ fontFamily: DISPLAY, fontSize: 36, color: C.accent, fontWeight: 600, fontVariantNumeric: "tabular-nums", letterSpacing: "-0.02em" }}>
              {num(fmt(targetStarter))} <span style={{ fontSize: 15, marginLeft: 4, color: C.textFaint }}>g</span>
            </span>
          </div>
        </GlassPanel>
      </div>

      <GlassPanel style={{ marginTop: 24, padding: "24px 22px 8px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18 }}>
          <Icon name="compass" size={18} color={C.accent} />
          <span style={{ fontFamily: BODY, fontSize: 13, color: C.accent, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>{t("ratioRef")}</span>
        </div>
        <div style={{ display: isDesktop ? "grid" : "block", gridTemplateColumns: "repeat(5, 1fr)", gap: isDesktop ? 12 : 0 }}>
          {FEED_RATIOS.map((r, i) => (
            <div key={r.label} style={{ display: "flex", flexDirection: isDesktop ? "column" : "row", gap: isDesktop ? 8 : 16, alignItems: isDesktop ? "flex-start" : "baseline", padding: isDesktop ? "16px 14px" : "13px 12px", borderBottom: isDesktop ? "none" : i < FEED_RATIOS.length - 1 ? `1px solid ${C.dividerSoft}` : "none", background: feedRatio === i ? C.accentDim : "transparent", borderRadius: 10, transition: "background 0.3s" }}>
              <span style={{ fontFamily: DISPLAY, fontSize: isDesktop ? 20 : 17, color: feedRatio === i ? C.accent : C.text, fontWeight: 600, minWidth: isDesktop ? "auto" : 70, fontVariantNumeric: "tabular-nums" }}>{r.label}</span>
              <span style={{ fontFamily: BODY, fontSize: isDesktop ? 14 : 15, color: C.textSub, lineHeight: 1.55, letterSpacing: "-0.005em" }}>{ratioDescs[i]}</span>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 18, padding: "16px 18px", background: C.accentDim, borderRadius: 16, border: `1px solid ${C.accentSoft}`, display: "flex", gap: 12, alignItems: "flex-start" }}>
          <Icon name="sparkles" size={20} color={C.accent} style={{ marginTop: 2, flexShrink: 0 }} />
          <span style={{ fontFamily: BODY, fontSize: 14, color: C.textSub, lineHeight: 1.6, letterSpacing: "-0.005em" }}>{t("starterRatioTip")}</span>
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
    <div style={{ padding: bp.mobile ? "0 24px 32px" : bp.tablet ? "0 40px 40px" : "0 48px 48px" }} className="fade-up">
      <div style={{ marginBottom: 28, width: "100%" }}>
        <div style={{ display: "flex", background: C.bgAlt, borderRadius: 18, padding: 4, border: `1px solid ${C.divider}`, boxShadow: C.glassShadow, width: "100%" }}>
          {modes.map((m) => (
            <button key={m.value} onClick={() => setMode(m.value)} type="button" role="tab" aria-selected={mode === m.value} style={{ flex: 1, padding: "12px 6px", borderRadius: 14, fontFamily: BODY, fontSize: 14, fontWeight: 600, background: mode === m.value ? `linear-gradient(135deg, ${C.accent}, ${C.accentDeep || C.accent})` : "transparent", color: mode === m.value ? "#FFFFFF" : C.textSub, minHeight: 48, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, boxShadow: mode === m.value ? `0 4px 12px ${C.accent}33` : "none" }}>
              <Icon name={m.icon} size={16} color={mode === m.value ? "#FFFFFF" : C.textSub} />
              {m.label}
            </button>
          ))}
        </div>
      </div>
      {mode === "bread" && <BreadCalc />}
      {mode === "pizza" && <PizzaCalc />}
      {mode === "starter" && <StarterCalc />}
      <PageFooter />
    </div>
  );
}

// ─── RECIPES TAB ───────────────────────────────────────────────────────────
function RecipesTab() {
  const { C, t, lang, getFont, num, bp } = useApp();
  const [selected, setSelected] = useState(null);
  const [loaves, setLoaves] = useState(1);
  const lowRecipes = RECIPES.filter((r) => r.family === "low");
  const mediumRecipes = RECIPES.filter((r) => r.family === "medium");
  const highRecipes = RECIPES.filter((r) => r.family === "high");
  const isDesktop = bp.desktop || bp.wide;

  if (selected) {
    const r = RECIPES.find((x) => x.id === selected);
    const isFa = lang === "fa";
    const s = (g) => num(fmt(g * loaves));
    const rName = isFa ? r.nameFa : r.name;
    const rSub = isFa ? r.subFa : r.sub;
    const rDiffLbl = isFa ? r.diffLabelFa : r.diffLabel;
    const rTotalTime = isFa ? r.totalTimeFa : r.totalTime;
    const rTips = isFa ? r.tipsFa : r.tips;

    return (
      <div style={{ padding: bp.mobile ? "0 24px 32px" : bp.tablet ? "0 40px 40px" : "0 48px 48px" }} className="fade-up">
        <button onClick={() => { setSelected(null); setLoaves(1); }} type="button" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "transparent", color: C.accent, fontFamily: BODY, fontSize: 15, fontWeight: 600, marginBottom: 24, padding: "8px 0", minHeight: 44 }}>
          <Icon name="arrowLeft" size={20} />{t("back")}
        </button>

        <div style={{ display: isDesktop ? "grid" : "block", gridTemplateColumns: "auto 1fr", gap: 32, marginBottom: isDesktop ? 40 : 32, alignItems: isDesktop ? "center" : "flex-start" }}>
          <div style={{ width: isDesktop ? 100 : 80, height: isDesktop ? 100 : 80, borderRadius: isDesktop ? 28 : 22, background: `linear-gradient(135deg, ${C.accentSoft}, ${C.accentDim})`, display: "flex", alignItems: "center", justifyContent: "center", color: C.accent, marginBottom: isDesktop ? 0 : 20, boxShadow: `0 8px 24px ${C.accent}22` }}>
            <Icon name={r.icon} size={isDesktop ? 56 : 42} />
          </div>
          <div>
            <h2 style={{ fontFamily: getFont("display"), fontSize: bp.mobile ? 40 : bp.tablet ? 48 : 56, fontWeight: 500, color: C.text, lineHeight: 1.05, letterSpacing: "-0.025em", marginBottom: 10 }}>{rName}</h2>
            <p style={{ fontFamily: BODY, fontSize: 17, color: C.textSub, letterSpacing: "-0.005em", lineHeight: 1.5, marginBottom: 18 }}>{rSub}</p>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
              <DiffDots level={r.difficulty} />
              <Pill>{rDiffLbl}</Pill>
              <Pill color={C.textSub}><Icon name="timer" size={14} /> {rTotalTime}</Pill>
              <Pill><Icon name="droplet" size={14} /> {num(r.hydration)}%</Pill>
            </div>
          </div>
        </div>

        <GlassPanel style={{ padding: "16px 18px", marginBottom: 32, display: "flex", alignItems: "center", justifyContent: "space-between", maxWidth: isDesktop ? 480 : "none" }}>
          <div>
            <div style={{ fontFamily: BODY, fontSize: 13, color: C.textFaint, fontWeight: 600, marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.02em" }}>{t("loaves")}</div>
            <div style={{ fontFamily: DISPLAY, fontSize: 28, color: C.accent, fontWeight: 600, letterSpacing: "-0.02em", fontVariantNumeric: "tabular-nums" }}>{num(loaves)}</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button onClick={() => setLoaves(Math.max(1, loaves - 1))} aria-label={t("decrease")} type="button" style={{ width: 44, height: 44, borderRadius: "50%", border: `1px solid ${C.divider}`, background: C.bg, color: C.text, display: "flex", alignItems: "center", justifyContent: "center" }}><Icon name="minus" size={18} /></button>
            <button onClick={() => setLoaves(loaves + 1)} aria-label={t("increase")} type="button" style={{ width: 44, height: 44, borderRadius: "50%", border: `1px solid ${C.divider}`, background: C.bg, color: C.text, display: "flex", alignItems: "center", justifyContent: "center" }}><Icon name="plus" size={18} /></button>
          </div>
        </GlassPanel>

        {isDesktop ? (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 32, alignItems: "start" }}>
            <div style={{ position: "sticky", top: 100 }}>
              <div style={{ fontFamily: BODY, fontSize: 13, color: C.textFaint, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 12 }}>{t("ingredients")}</div>
              <GlassPanel style={{ overflow: "hidden" }}>
                {r.ingredients.map((ing, i, arr) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 20px", borderBottom: i < arr.length - 1 ? `1px solid ${C.divider}` : "none", gap: 12 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ width: 36, height: 36, borderRadius: 10, background: C.accentSoft, display: "flex", alignItems: "center", justifyContent: "center", color: C.accent, flexShrink: 0 }}><Icon name={ing.icon} size={18} /></div>
                      <span style={{ fontFamily: BODY, fontSize: 15, color: C.text, fontWeight: 500, letterSpacing: "-0.005em" }}>{isFa ? ing.nameFa : ing.name}</span>
                    </div>
                    <span style={{ fontFamily: DISPLAY, fontSize: 17, color: C.accent, fontWeight: 600, fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap", letterSpacing: "-0.01em" }}>{ing.unit ? `${s(ing.amount)}${ing.unit}` : num(ing.amount * loaves)}</span>
                  </div>
                ))}
              </GlassPanel>
            </div>

            <div>
              <div style={{ fontFamily: BODY, fontSize: 13, color: C.textFaint, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 18 }}>{t("steps")}</div>
              {r.steps.map((step, i) => {
                const stepTitle = isFa ? step[2] : step[0];
                const stepBody = isFa ? step[3] : step[1];
                return (
                  <div key={i} style={{ display: "flex", gap: 18, marginBottom: 26 }}>
                    <div style={{ width: 48, height: 48, borderRadius: "50%", background: `linear-gradient(135deg, ${C.accent}, ${C.accentDeep || C.accent})`, color: "#FFFFFF", fontSize: 16, fontWeight: 700, fontFamily: DISPLAY, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2, boxShadow: `0 4px 12px ${C.accent}55` }}>{num(i + 1)}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: DISPLAY, fontSize: 20, color: C.text, fontWeight: 600, marginBottom: 6, letterSpacing: "-0.01em" }}>{stepTitle}</div>
                      <div style={{ fontFamily: BODY, fontSize: 15, color: C.textSub, lineHeight: 1.6, letterSpacing: "-0.005em" }}>{stepBody}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <>
            <div style={{ fontFamily: BODY, fontSize: 13, color: C.textFaint, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 12 }}>{t("ingredients")}</div>
            <GlassPanel style={{ marginBottom: 32, overflow: "hidden" }}>
              {r.ingredients.map((ing, i, arr) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 20px", borderBottom: i < arr.length - 1 ? `1px solid ${C.divider}` : "none", gap: 12 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: C.accentSoft, display: "flex", alignItems: "center", justifyContent: "center", color: C.accent, flexShrink: 0 }}><Icon name={ing.icon} size={18} /></div>
                    <span style={{ fontFamily: BODY, fontSize: 15, color: C.text, fontWeight: 500, letterSpacing: "-0.005em" }}>{isFa ? ing.nameFa : ing.name}</span>
                  </div>
                  <span style={{ fontFamily: DISPLAY, fontSize: 17, color: C.accent, fontWeight: 600, fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap", letterSpacing: "-0.01em" }}>{ing.unit ? `${s(ing.amount)}${ing.unit}` : num(ing.amount * loaves)}</span>
                </div>
              ))}
            </GlassPanel>

            <div style={{ fontFamily: BODY, fontSize: 13, color: C.textFaint, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 18 }}>{t("steps")}</div>
            {r.steps.map((step, i) => {
              const stepTitle = isFa ? step[2] : step[0];
              const stepBody = isFa ? step[3] : step[1];
              return (
                <div key={i} style={{ display: "flex", gap: 18, marginBottom: 26 }}>
                  <div style={{ width: 44, height: 44, borderRadius: "50%", background: `linear-gradient(135deg, ${C.accent}, ${C.accentDeep || C.accent})`, color: "#FFFFFF", fontSize: 16, fontWeight: 700, fontFamily: DISPLAY, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2, boxShadow: `0 4px 12px ${C.accent}55` }}>{num(i + 1)}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: DISPLAY, fontSize: 19, color: C.text, fontWeight: 600, marginBottom: 6, letterSpacing: "-0.01em" }}>{stepTitle}</div>
                    <div style={{ fontFamily: BODY, fontSize: 15, color: C.textSub, lineHeight: 1.6, letterSpacing: "-0.005em" }}>{stepBody}</div>
                  </div>
                </div>
              );
            })}
          </>
        )}

        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: isDesktop ? 40 : 0, marginBottom: 14 }}>
          <Icon name="sparkles" size={18} color={C.accent} />
          <span style={{ fontFamily: BODY, fontSize: 13, color: C.accent, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>{t("proTips")}</span>
        </div>
        <GlassPanel style={{ padding: "22px", background: `linear-gradient(135deg, ${C.accentDim}, ${C.glass})` }}>
          <div style={{ display: isDesktop ? "grid" : "block", gridTemplateColumns: isDesktop ? "1fr 1fr" : "none", gap: isDesktop ? 16 : 0 }}>
            {rTips.map((tip, i) => (
              <div key={i} style={{ display: "flex", gap: 14, marginBottom: i < rTips.length - 1 && !isDesktop ? 16 : 0 }}>
                <div style={{ width: 32, height: 32, borderRadius: 10, background: C.accentSoft, display: "flex", alignItems: "center", justifyContent: "center", color: C.accent, flexShrink: 0 }}><Icon name="sparkles" size={16} /></div>
                <span style={{ fontFamily: BODY, fontSize: 15, color: C.textSub, lineHeight: 1.6, letterSpacing: "-0.005em", paddingTop: 2 }}>{tip}</span>
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
    const rName = isFa ? r.nameFa : r.name;
    const rSub = isFa ? r.subFa : r.sub;
    const rTotalTime = isFa ? r.totalTimeFa : r.totalTime;
    return (
      <GlassPanel hoverable onClick={() => setSelected(r.id)} style={{ padding: "20px", marginBottom: 12 }}>
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <div style={{ width: 60, height: 60, borderRadius: 16, background: C.accentSoft, display: "flex", alignItems: "center", justifyContent: "center", color: C.accent, flexShrink: 0 }}><Icon name={r.icon} size={32} /></div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: DISPLAY, fontSize: 20, color: C.text, fontWeight: 600, letterSpacing: "-0.015em", marginBottom: 4, lineHeight: 1.2 }}>{rName}</div>
            <div style={{ fontFamily: BODY, fontSize: 15, color: C.textSub, letterSpacing: "-0.005em", marginBottom: 10 }}>{rSub}</div>
            <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
              <DiffDots level={r.difficulty} />
              <span style={{ color: C.divider, fontSize: 16 }}>·</span>
              <span style={{ fontFamily: BODY, fontSize: 14, color: C.textFaint, fontWeight: 500, display: "inline-flex", alignItems: "center", gap: 4 }}><Icon name="timer" size={14} /> {rTotalTime}</span>
              <span style={{ color: C.divider, fontSize: 16 }}>·</span>
              <span style={{ fontFamily: BODY, fontSize: 14, color: C.textFaint, fontWeight: 500, display: "inline-flex", alignItems: "center", gap: 4 }}><Icon name="droplet" size={14} /> {num(r.hydration)}%</span>
            </div>
          </div>
          <div style={{ color: C.textFaint }}><Icon name="chevronRight" size={24} /></div>
        </div>
      </GlassPanel>
    );
  };

  const FamilySection = ({ title, color, recipes, family }) => (
    <div style={{ marginBottom: isDesktop ? 48 : 36 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20, paddingBottom: 14, borderBottom: `1px solid ${C.divider}` }}>
        <div style={{ width: 48, height: 48, borderRadius: 14, background: `${color}18`, display: "flex", alignItems: "center", justifyContent: "center", color: color }}><Icon name="droplet" size={24} /></div>
        <div>
          <div style={{ fontFamily: DISPLAY, fontSize: isDesktop ? 26 : 22, color: C.text, fontWeight: 600, letterSpacing: "-0.015em", lineHeight: 1.1 }}>{title}</div>
          <div style={{ fontFamily: BODY, fontSize: 14, color: C.textFaint, marginTop: 2 }}>{family === "low" ? "50–60%" : family === "medium" ? "65–72%" : "78–85%"} · {num(recipes.length)} {t("recipesCount")}</div>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: bp.mobile ? "1fr" : "1fr 1fr", gap: bp.mobile ? 0 : 16 }}>
        {recipes.map((r) => <RecipeCard key={r.id} r={r} />)}
      </div>
    </div>
  );

  return (
    <div style={{ padding: bp.mobile ? "0 24px 32px" : bp.tablet ? "0 40px 40px" : "0 48px 48px" }} className="fade-up">
      <SectionTitle title={t("recipesTitle")} sub={t("recipesSub2")} />
      <FamilySection title={t("lowHydration")} color={C.success} recipes={lowRecipes} family="low" />
      <FamilySection title={t("mediumHydration")} color={C.accent} recipes={mediumRecipes} family="medium" />
      <FamilySection title={t("highHydration")} color={C.danger} recipes={highRecipes} family="high" />
      <PageFooter />
    </div>
  );
}

// ─── GUIDE TAB ─────────────────────────────────────────────────────────────
function GuideTab() {
  const { C, t, lang, bp } = useApp();
  const [open, setOpen] = useState(1);
  const isFa = lang === "fa";
  const isDesktop = bp.desktop || bp.wide;

  const bakersRows = isFa ? [
    ["درصد آب", "آب ÷ آرد × ۱۰۰", "۶۵–۸۵٪"],
    ["استارتر", "استارتر ÷ آرد × ۱۰۰", "۱۰–۲۰٪"],
    ["نمک", "نمک ÷ آرد × ۱۰۰", "۱٫۸–۲٫۲٪"],
  ] : [
    ["Hydration", "Water ÷ Flour × 100", "65–85%"],
    ["Starter", "Starter ÷ Flour × 100", "10–20%"],
    ["Salt", "Salt ÷ Flour × 100", "1.8–2.2%"],
  ];

  const stepsPanel = (
    <div>
      {GUIDE.map((step) => {
        const phase = isFa ? step.phaseFa : step.phase;
        const title = isFa ? step.titleFa : step.title;
        const body = isFa ? step.bodyFa : step.body;
        const checks = isFa ? step.checksFa : step.checks;
        const tip = isFa ? step.tipFa : step.tip;
        const timers = isFa ? step.timersFa : step.timers;
        const isOpen = open === step.id;
        return (
          <GlassPanel key={step.id} style={{ marginBottom: 12, overflow: "hidden" }}>
            <button onClick={() => setOpen(isOpen ? null : step.id)} type="button" aria-expanded={isOpen} style={{ display: "flex", alignItems: "center", gap: 16, width: "100%", textAlign: "left", padding: "18px 20px", background: "transparent", minHeight: 76 }}>
              <div style={{ width: 52, height: 52, borderRadius: "50%", background: C.accentSoft, display: "flex", alignItems: "center", justifyContent: "center", color: C.accent, flexShrink: 0 }}><Icon name={step.icon} size={26} /></div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: BODY, fontSize: 13, color: C.accent, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 4 }}>{phase}</div>
                <div style={{ fontFamily: DISPLAY, fontSize: 19, color: C.text, fontWeight: 600, letterSpacing: "-0.015em", lineHeight: 1.2 }}>{title}</div>
              </div>
              <div style={{ color: C.textFaint, transform: isOpen ? "rotate(90deg)" : "none", transition: "transform 0.3s cubic-bezier(0.32, 0.72, 0, 1)" }}><Icon name="chevronRight" size={24} /></div>
            </button>
            {isOpen && (
              <div style={{ background: C.accentDim, padding: "22px 22px 24px", borderTop: `1px solid ${C.divider}`, animation: "fadeUp 0.4s cubic-bezier(0.22, 1, 0.36, 1)" }}>
                <p style={{ fontFamily: BODY, fontSize: 15, color: C.textSub, lineHeight: 1.65, marginBottom: 20 }}>{body}</p>
                {checks.length > 0 && (
                  <>
                    <div style={{ fontFamily: BODY, fontSize: 13, color: C.accent, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 12 }}>{t("checks")}</div>
                    {checks.map((c, i) => (
                      <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 10 }}>
                        <div style={{ width: 22, height: 22, borderRadius: 7, border: `1.5px solid ${C.accent}`, flexShrink: 0, marginTop: 1 }} aria-hidden="true" />
                        <span style={{ fontFamily: BODY, fontSize: 15, color: C.textSub, lineHeight: 1.5 }}>{c}</span>
                      </div>
                    ))}
                  </>
                )}
                {timers.length > 0 && (
                  <div style={{ marginTop: 22 }}>
                    <div style={{ fontFamily: BODY, fontSize: 13, color: C.accent, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 12 }}>{t("timerLabel")}</div>
                    {timers.map((timer) => <StepTimer key={timer.label} label={timer.label} minutes={timer.minutes} />)}
                  </div>
                )}
                <div style={{ marginTop: 22, padding: "16px 18px", background: C.bgAlt, borderRadius: 16, border: `1px solid ${C.divider}`, display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <Icon name="sparkles" size={20} color={C.accent} style={{ marginTop: 2, flexShrink: 0 }} />
                  <span style={{ fontFamily: BODY, fontSize: 14, color: C.textSub, lineHeight: 1.6 }}>{tip}</span>
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
      <div style={{ fontFamily: DISPLAY, fontSize: 24, color: C.text, fontWeight: 600, marginBottom: 12, letterSpacing: "-0.015em" }}>{t("bakersPercent")}</div>
      <p style={{ fontFamily: BODY, fontSize: 15, color: C.textSub, marginBottom: 20, lineHeight: 1.6 }}>{t("bakersMathBody")}</p>
      {bakersRows.map(([n, f, ex], i) => (
        <div key={n} style={{ borderTop: i > 0 ? `1px solid ${C.divider}` : "none", paddingTop: i > 0 ? 14 : 0, marginTop: i > 0 ? 14 : 0, display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12 }}>
          <span style={{ fontFamily: DISPLAY, fontSize: 17, color: C.text, fontWeight: 600, letterSpacing: "-0.01em" }}>{n}</span>
          <span style={{ fontFamily: BODY, fontSize: 14, color: C.accent, fontVariantNumeric: "tabular-nums", fontWeight: 500 }}>{f}</span>
          <span style={{ fontFamily: BODY, fontSize: 14, color: C.textFaint, fontStyle: "italic", minWidth: 70, textAlign: "right" }}>{ex}</span>
        </div>
      ))}
    </GlassPanel>
  );

  return (
    <div style={{ padding: bp.mobile ? "0 24px 32px" : bp.tablet ? "0 40px 40px" : "0 48px 48px" }} className="fade-up">
      <SectionTitle title={t("guideTitle")} sub={t("guideSub2")} />
      {isDesktop ? (
        <div style={{ display: "grid", gridTemplateColumns: bp.wide ? "1.4fr 1fr" : "1.2fr 1fr", gap: 32, alignItems: "start" }}>
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
    ["لوون / استارتر", "کشت زنده‌ای از مخمرهای وحشی و باکتری‌ها؛ مایهٔ تخمیر تمام نان‌های خمیرترش."],
    ["تخمیر اولیه", "مرحلهٔ اصلی که کل تودهٔ خمیر با هم تخمیر می‌شود، معمولاً ۴ تا ۸ ساعت."],
    ["اتولیز", "استراحت دادن مخلوط آرد و آب بدون استارتر، برای رشد طبیعی گلوتن."],
    ["درصد آب", "وزن آب به‌صورت درصدی از وزن آرد. درصد بالاتر = خمیر مرطوب‌تر و بافت بازتر."],
    ["بانتون", "سبد تخمیر که هنگام ور آمدن، شکل خمیر را حفظ می‌کند."],
    ["پف فر", "جهش سریع حجم نان در دقایق اول پخت، ناشی از انبساط گازها بر اثر گرما."],
    ["خط‌زنی", "برش سطح خمیر با تیغ پیش از پخت، برای کنترل جهت باز شدن نان."],
    ["آزمون پنجره", "کشیدن خمیر تا حدی که نازک و شفاف شود — نشانهٔ رشد کافی گلوتن."],
  ] : [
    ["Levain / Starter", "A live culture of wild yeast and bacteria. The leavening agent for all sourdough."],
    ["Bulk fermentation", "The main phase where the whole dough mass ferments together, typically 4–8 hours."],
    ["Autolyse", "Resting flour and water without starter for passive gluten development."],
    ["Hydration", "Water as a percentage of flour weight. Higher = wetter dough, more open crumb."],
    ["Banneton", "A proofing basket that supports the dough's shape while proofing."],
    ["Oven spring", "The rapid rise in the first minutes of baking as gases expand from heat."],
    ["Scoring", "Cutting dough surface with a razor before baking to control how it opens."],
    ["Windowpane test", "Stretching dough thin enough to see light through — confirms good gluten development."],
  ];
  const isDesktop = bp.desktop || bp.wide;

  const TroubleItem = ({ tr, i }) => {
    const problem = isFa ? tr.problemFa : tr.problem;
    const causes = isFa ? tr.causesFa : tr.causes;
    const fixes = isFa ? tr.fixesFa : tr.fixes;
    const isOpen = open === i;
    return (
      <GlassPanel style={{ overflow: "hidden", height: "fit-content", marginBottom: isDesktop ? 12 : 12 }}>
        <button onClick={() => setOpen(isOpen ? null : i)} type="button" aria-expanded={isOpen} style={{ display: "flex", alignItems: "center", gap: 16, width: "100%", textAlign: "left", padding: "18px 20px", background: "transparent", minHeight: 72 }}>
          <div style={{ width: 48, height: 48, borderRadius: 14, background: `${C.danger}20`, display: "flex", alignItems: "center", justifyContent: "center", color: C.danger, flexShrink: 0 }}><Icon name={tr.icon} size={26} /></div>
          <span style={{ fontFamily: DISPLAY, fontSize: 17, color: C.text, fontWeight: 600, flex: 1, letterSpacing: "-0.01em", lineHeight: 1.3 }}>{problem}</span>
          <div style={{ color: C.textFaint, transform: isOpen ? "rotate(90deg)" : "none", transition: "transform 0.3s cubic-bezier(0.32, 0.72, 0, 1)" }}><Icon name="chevronRight" size={22} /></div>
        </button>
        {isOpen && (
          <div style={{ background: C.accentDim, padding: "22px 22px 24px", borderTop: `1px solid ${C.divider}`, animation: "fadeUp 0.4s cubic-bezier(0.22, 1, 0.36, 1)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
              <Icon name="alert" size={16} color={C.danger} />
              <span style={{ fontFamily: BODY, fontSize: 13, color: C.danger, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>{t("likelyCauses")}</span>
            </div>
            {causes.map((c, j) => (
              <div key={j} style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 10 }}>
                <div style={{ width: 22, height: 22, borderRadius: 7, background: `${C.danger}20`, display: "flex", alignItems: "center", justifyContent: "center", color: C.danger, flexShrink: 0, marginTop: 1 }}><Icon name="x" size={12} /></div>
                <span style={{ fontFamily: BODY, fontSize: 15, color: C.textSub, lineHeight: 1.5 }}>{c}</span>
              </div>
            ))}
            <div style={{ display: "flex", alignItems: "center", gap: 8, margin: "22px 0 14px", paddingTop: 20, borderTop: `1px solid ${C.divider}` }}>
              <Icon name="check" size={16} color={C.success} />
              <span style={{ fontFamily: BODY, fontSize: 13, color: C.success, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>{t("howToFix")}</span>
            </div>
            {fixes.map((f, j) => (
              <div key={j} style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 10 }}>
                <div style={{ width: 22, height: 22, borderRadius: 7, background: `${C.success}20`, display: "flex", alignItems: "center", justifyContent: "center", color: C.success, flexShrink: 0, marginTop: 1 }}><Icon name="check" size={12} /></div>
                <span style={{ fontFamily: BODY, fontSize: 15, color: C.textSub, lineHeight: 1.5 }}>{f}</span>
              </div>
            ))}
          </div>
        )}
      </GlassPanel>
    );
  };

  return (
    <div style={{ padding: bp.mobile ? "0 24px 32px" : bp.tablet ? "0 40px 40px" : "0 48px 48px" }} className="fade-up">
      <SectionTitle title={t("troubleTitle")} sub={t("troubleSub2")} />
      {isDesktop ? (
        <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 32, alignItems: "start" }}>
          <div>
            {TROUBLE.map((tr, i) => <TroubleItem key={i} tr={tr} i={i} />)}
          </div>
          <GlassPanel style={{ padding: "26px 24px", position: "sticky", top: 100 }}>
            <div style={{ fontFamily: DISPLAY, fontSize: 24, color: C.text, fontWeight: 600, marginBottom: 18, letterSpacing: "-0.015em" }}>{t("quickGlossary")}</div>
            <div style={{ display: "block" }}>
              {glossary.map(([term, def], i) => (
                <div key={term} style={{ borderTop: i > 0 ? `1px solid ${C.divider}` : "none", paddingTop: i > 0 ? 18 : 0, marginTop: i > 0 ? 18 : 0, paddingBottom: 18, display: "grid", gridTemplateColumns: "minmax(130px, 0.7fr) 1fr", gap: 20, alignItems: "baseline" }}>
                  <div style={{ fontFamily: DISPLAY, fontSize: 16, color: C.accent, fontWeight: 600, letterSpacing: "-0.01em" }}>{term}</div>
                  <div style={{ fontFamily: BODY, fontSize: 15, color: C.textSub, lineHeight: 1.6 }}>{def}</div>
                </div>
              ))}
            </div>
          </GlassPanel>
        </div>
      ) : (
        <>
          {TROUBLE.map((tr, i) => <TroubleItem key={i} tr={tr} i={i} />)}
          <GlassPanel style={{ marginTop: 28, padding: "26px 24px" }}>
            <div style={{ fontFamily: DISPLAY, fontSize: 24, color: C.text, fontWeight: 600, marginBottom: 18, letterSpacing: "-0.015em" }}>{t("quickGlossary")}</div>
            <div style={{ display: "block" }}>
              {glossary.map(([term, def], i) => (
                <div key={term} style={{ borderTop: i > 0 ? `1px solid ${C.divider}` : "none", paddingTop: i > 0 ? 18 : 0, marginTop: i > 0 ? 18 : 0, paddingBottom: 18, display: "grid", gridTemplateColumns: "minmax(130px, 0.7fr) 1fr", gap: 20, alignItems: "baseline" }}>
                  <div style={{ fontFamily: DISPLAY, fontSize: 16, color: C.accent, fontWeight: 600, letterSpacing: "-0.01em" }}>{term}</div>
                  <div style={{ fontFamily: BODY, fontSize: 15, color: C.textSub, lineHeight: 1.6 }}>{def}</div>
                </div>
              ))}
            </div>
          </GlassPanel>
        </>
      )}
      <PageFooter />
    </div>
  );
}

const NAV_TABS = [
  { id: "trouble", icon: "wrench", labelKey: "fix" }, { id: "guide", icon: "compass", labelKey: "guide" },
  { id: "recipes", icon: "book", labelKey: "recipes" }, { id: "calc", icon: "scale", labelKey: "calculator" }, { id: "home", icon: "home", labelKey: "home" }
];

export default function App() {
  const systemTheme = useSystemTheme();
  const [tab, setTab] = useState("home");
  const [theme, setTheme] = useState("dark");
  const [lang, setLang] = useState("en");
  const bp = useBreakpoint();
  const C = theme === "dark" ? DARK : LIGHT;
  const isRTL = lang === "fa";
  const t = (key) => T[lang]?.[key] ?? T.en?.[key] ?? key;
  const getFont = (type) => { if (isRTL) return FARSI; return type === "display" ? DISPLAY : BODY; };
  const num = (v) => (isRTL ? toFaNum(v) : String(v));

  useEffect(() => { let meta = document.querySelector('meta[name="theme-color"]'); if (!meta) { meta = document.createElement('meta'); meta.name = "theme-color"; document.head.appendChild(meta); } meta.content = C.bg; }, [C.bg]);
  useEffect(() => { updateGlobalStyles(C); document.documentElement.dir = isRTL ? "rtl" : "ltr"; document.documentElement.lang = lang; }, [theme, lang, C, isRTL]);

  const ctxValue = { C, t, lang, theme, isRTL, getFont, setTheme, setLang, num, bp };
  const setTabProxy = (target) => { if (target === "starter") setTab("calc"); else if (target === "pizza") setTab("pizza"); else setTab(target); };
  
  const renderContent = () => {
    switch (tab) {
      case "home": return <HomeTab setTab={setTabProxy} />;
      case "calc": return <CalcTab initialMode="bread" />;
      case "pizza": return <CalcTab initialMode="pizza" />;
      case "recipes": return <RecipesTab />;
      case "guide": return <GuideTab />;
      case "trouble": return <TroubleTab />;
      default: return <HomeTab setTab={setTabProxy} />;
    }
  };

  const maxWidth = bp.mobile ? 600 : bp.tablet ? 960 : bp.desktop ? 1400 : 1680;
  const contentPadding = bp.mobile ? 20 : bp.tablet ? 40 : 48;

  return (
    <AppCtx.Provider value={ctxValue}>
      <div style={{ minHeight: "100vh", background: C.bg, display: "flex", justifyContent: "center", fontFamily: BODY, transition: "background 0.6s cubic-bezier(0.2, 0.8, 0.2, 1)", position: "relative" }}>
        <BackgroundDecor />
        <div style={{ width: "100%", maxWidth: maxWidth, display: "flex", flexDirection: "column", minHeight: "100vh", position: "relative", zIndex: 1 }}>
          <header dir="ltr" className="pwa-header" style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 20, borderBottom: `1px solid ${C.divider}`, background: C.glass, backdropFilter: "blur(40px) saturate(180%)", WebkitBackdropFilter: "blur(40px) saturate(180%)" }}>

            <div style={{ maxWidth: maxWidth, margin: "0 auto", padding: bp.mobile ? "12px 20px" : bp.tablet ? "14px 40px" : "16px 48px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: bp.mobile ? 12 : 16, flex: 1, minWidth: 0 }}>
                <div style={{ width: bp.mobile ? 44 : 52, height: bp.mobile ? 44 : 52, borderRadius: bp.mobile ? 14 : 16, background: `linear-gradient(135deg, ${C.accent}, ${C.accentDeep || C.accent})`, display: "flex", alignItems: "center", justifyContent: "center", color: "#FFFFFF", boxShadow: `0 4px 14px ${C.accent}55`, flexShrink: 0 }}>
                  <Icon name="bread" size={bp.mobile ? 24 : 28} color="#FFFFFF" />
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontFamily: DISPLAY, fontSize: bp.mobile ? 18 : bp.tablet ? 20 : 22, color: C.text, fontWeight: 600, letterSpacing: "-0.015em", lineHeight: 1 }}>{t("appName")}</div>
                  <div style={{ fontFamily: BODY, fontSize: bp.mobile ? 13 : 14, color: C.textFaint, marginTop: 2, letterSpacing: "-0.005em", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t("appTagline")}</div>
                </div>
              </div>

              {!bp.mobile && (
                <nav style={{ display: bp.tablet ? "none" : "flex", gap: 4, background: C.bgAlt, padding: 4, borderRadius: 999, border: `1px solid ${C.divider}`, boxShadow: C.glassShadow }} aria-label="Main navigation">
                  {NAV_TABS.map((tItem) => {
                    const active = tItem.id === tab || (tItem.id === "calc" && isCalcTabActive);
                    return (
                      <button key={tItem.id} onClick={() => setTab(tItem.id)} type="button" aria-current={active ? "page" : undefined} style={{ padding: "8px 16px", borderRadius: 999, background: active ? `linear-gradient(135deg, ${C.accent}, ${C.accentDeep || C.accent})` : "transparent", color: active ? "#FFFFFF" : C.textSub, fontFamily: BODY, fontSize: 14, fontWeight: 600, display: "flex", alignItems: "center", gap: 8, minHeight: 36, boxShadow: active ? `0 2px 8px ${C.accent}33` : "none" }}>
                        <Icon name={tItem.icon} size={16} color={active ? "#FFFFFF" : C.textSub} />
                        {t(tItem.labelKey)}
                      </button>
                    );
                  })}
                </nav>
              )}

              <div style={{ display: "flex", gap: 8, alignItems: "center", flexShrink: 0 }}>
                <button onClick={() => setLang((l) => (l === "en" ? "fa" : "en"))} aria-label={t("switchLang")} type="button" title={t("switchLang")} style={{ width: 80, height: 44, borderRadius: 999, border: `1px solid ${C.divider}`, background: C.bgAlt, color: C.text, fontFamily: BODY, fontSize: 14, fontWeight: 600, boxShadow: C.glassShadow, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                  <Icon name="globe" size={16} />
                  {lang === "en" ? "فارسی" : "EN"}
                </button>
                <button onClick={() => setTheme((th) => (th === "dark" ? "light" : "dark"))} aria-label={theme === "dark" ? t("lightMode") : t("darkMode")} type="button" title={theme === "dark" ? t("lightMode") : t("darkMode")} style={{ width: 44, height: 44, borderRadius: "50%", border: `1px solid ${C.divider}`, background: C.bgAlt, color: C.text, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: C.glassShadow }}>
                  <Icon name={theme === "dark" ? "sun" : "moon"} size={20} />
                </button>
              </div>
            </div>

          </header>

          <main style={{ flex: 1, overflowY: "auto", paddingTop: contentPadding + 80, paddingBottom: bp.mobile ? 100 : contentPadding }} className="ls">
            {renderContent()}
          </main>

          <InstallPrompt />

          {(bp.mobile || bp.tablet) && (
            <nav dir="ltr" className="pwa-bottom-nav" aria-label="Main navigation" style={{ display: "flex", borderTop: `1px solid ${C.divider}`, background: C.glass, backdropFilter: "blur(40px) saturate(180%)", WebkitBackdropFilter: "blur(40px) saturate(180%)", position: "fixed", bottom: 0, left: 0, right: 0, paddingBottom: "max(env(safe-area-inset-bottom,0px),8px)", paddingTop: 6, zIndex: 15 }}>


              <div style={{ maxWidth: maxWidth, margin: "0 auto", width: "100%", display: "flex" }}>
                {NAV_TABS.map((tItem) => {
                  const active = tItem.id === tab || (tItem.id === "calc" && isCalcTabActive);
                  return (
                    <button key={tItem.id} onClick={() => setTab(tItem.id)} aria-label={t(tItem.labelKey)} aria-current={active ? "page" : undefined} type="button" style={{ flex: 1, paddingTop: 10, paddingBottom: 8, background: "transparent", border: "none", display: "flex", flexDirection: "column", alignItems: "center", gap: 4, position: "relative", minHeight: 60 }}>
                      <div style={{ color: active ? C.accent : C.textFaint, transition: "all 0.25s cubic-bezier(0.22, 1, 0.36, 1)", transform: active ? "translateY(-2px) scale(1.05)" : "none" }}>
                        <Icon name={tItem.icon} size={24} />
                      </div>
                      <span style={{ fontFamily: BODY, fontSize: 13, color: active ? C.accent : C.textFaint, fontWeight: active ? 600 : 500, letterSpacing: "-0.005em", transition: "color 0.2s" }}>{t(tItem.labelKey)}</span>
                      {active && <div style={{ position: "absolute", top: 0, left: "25%", right: "25%", height: 2, borderRadius: 1, background: C.accent }} />}
                    </button>
                  );
                })}
              </div>

            </nav>
          )}
        </div>
      </div>
    </AppCtx.Provider>
  );
}