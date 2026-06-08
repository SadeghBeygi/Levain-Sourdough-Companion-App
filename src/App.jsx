import { useState, useMemo, useEffect, useContext, createContext } from "react";

// ─── CONTEXT ───────────────────────────────────────────────────────────────
const AppCtx = createContext(null);
const useApp = () => useContext(AppCtx);

// ─── FONT INJECTION ────────────────────────────────────────────────────────
(() => {
  if (typeof document === "undefined") return;
  if (document.getElementById("levain-fonts")) return;
  const link = document.createElement("link");
  link.id = "levain-fonts";
  link.rel = "stylesheet";
  link.href = "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Lora:ital,wght@0,400;0,500;0,600;1,400&family=Vazirmatn:wght@300;400;600;700&display=swap";
  document.head.appendChild(link);
})();

// ─── GLOBAL STYLE UPDATER ──────────────────────────────────────────────────
function updateGlobalStyles(C) {
  let s = document.getElementById("levain-boot");
  if (!s) { s = document.createElement("style"); s.id = "levain-boot"; document.head.appendChild(s); }
  s.textContent = `
    body { background: ${C.bg} !important; transition: background 0.3s; }
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    input[type=range] { -webkit-appearance: none; width: 100%; height: 4px; background: ${C.border}; border-radius: 2px; outline: none; cursor: pointer; transition: background 0.3s; }
    input[type=range]::-webkit-slider-thumb { -webkit-appearance: none; width: 22px; height: 22px; border-radius: 50%; background: ${C.accent}; cursor: pointer; box-shadow: 0 0 0 4px ${C.accent}33; }
    .ls::-webkit-scrollbar { width: 3px; }
    .ls::-webkit-scrollbar-thumb { background: ${C.border}; border-radius: 2px; }
    @keyframes fadeUp { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
    .fade-up { animation: fadeUp 0.22s ease forwards; }
    .tab-btn:active { transform: scale(0.96); }
  `;
}

// ─── COLOR THEMES ──────────────────────────────────────────────────────────
const DARK = {
  bg:        "#1D1308",
  surf:      "#261A09",
  card:      "#33200C",
  card2:     "#3D2810",
  border:    "#513214",
  accent:    "#D4921E",
  accentDim: "rgba(212,146,30,0.13)",
  text:      "#F2E5CC",
  sub:       "#B09278",
  faint:     "#70543C",
  green:     "#6AA062",
  red:       "#B85040",
  blue:      "#5A7AA8",
  purple:    "#9060C0",
  resultBg:  "linear-gradient(145deg,#281808,#201205)",
};
const LIGHT = {
  bg:        "#FBF3E4",
  surf:      "#F3E6CA",
  card:      "#EDD9B8",
  card2:     "#E8D0AA",
  border:    "#C8A87A",
  accent:    "#9A6210",
  accentDim: "rgba(154,98,16,0.12)",
  text:      "#2C1A0A",
  sub:       "#6E4820",
  faint:     "#9A7050",
  green:     "#3A7832",
  red:       "#943020",
  blue:      "#2A5880",
  purple:    "#6030A0",
  resultBg:  "linear-gradient(145deg,#EDD9B8,#E8D0AA)",
};

const SERIF = "'Playfair Display', Georgia, serif";
const BODY  = "'Lora', Georgia, serif";
const FARSI = "'Vazirmatn', 'Tahoma', sans-serif";

// ─── FARSI NUMERAL UTILITY ─────────────────────────────────────────────────
const FA_DIGITS = ["۰","۱","۲","۳","۴","۵","۶","۷","۸","۹"];
function toFaNum(str) {
  return String(str).replace(/[0-9]/g, d => FA_DIGITS[+d]);
}

// ─── TRANSLATIONS ──────────────────────────────────────────────────────────
const T = {
  en: {
    appName:"Levain", appTagline:"Sourdough App",
    taglineSub:"Your complete sourdough companion — from starter to scoring.",
    toolsSections:"Tools & Sections",
    doughCalc:"Dough Calculator", doughCalcSub:"Baker's math & whole grain split",
    pizzaCalc:"Pizza Calculator", pizzaCalcSub:"Neapolitan, NY, wood-fired",
    recipes:"Recipes", recipesSub:"5 complete bread recipes",
    guide:"Process Guide", guideSub:"6-step mastery checklist",
    trouble:"Troubleshoot", troubleSub:"Diagnose any baking problem",
    starter:"Starter Planner", starterSub:"Feeding ratio calculator",
    diffOverview:"Difficulty Overview", bakerPrinciple:"Baker's Principle",
    home:"Home", calculator:"Calculator", fix:"Fix",
    breadCalc:"Bread Calculator",
    byFlour:"By Flour / Loaf", byTotal:"By Total Weight",
    flourPerLoaf:"Flour per loaf", totalDoughWeight:"Total dough weight (all loaves)",
    leavening:"Leavening",
    sourdoughOpt:"🧫 Sourdough", sourdoughSub:"Wild fermentation, great flavor",
    yeastOpt:"🍺 Yeast", yeastSub:"Always works, predictable",
    yeastType:"Yeast Type",
    freshYeast:"Fresh", dryYeast:"Active Dry", instantYeast:"Instant",
    hydration:"Hydration", starterLabel:"Starter", yeastLabel:"Yeast",
    salt:"Salt", wholeGrain:"Whole Grain", ofTotalFlour:"% of total flour",
    numLoaves:"Number of loaves", perLoaf:"Per Loaf", yourFormula:"Your Formula",
    total:"Total", flour:"Flour", water:"Water",
    breadFlour:"Bread flour", wgFlour:"Whole grain / rye",
    hydGuide:"Hydration Guide", presets:"Presets",
    rolls:"Rolls", standard:"Standard", large:"Large", mega:"Mega",
    pizzaCalcTitle:"Pizza Calculator",
    doughType:"Dough Type",
    yeastPizza:"🍺 Yeast", yeastPizzaSub:"Always works, beginner-friendly",
    sourdoughPizza:"🧫 Sourdough", sourdoughPizzaSub:"Great flavor, longer process",
    yourOven:"Your Oven", pizzas:"Pizzas", gramsPerPizza:"Grams / pizza",
    toppingsBtn:"🍅 Margherita Toppings",
    freshYeastLabel:"Fresh yeast", orDryYeast:"or dry yeast",
    activeStarter:"Active starter", totalDough:"Total dough",
    homeFor:"250–290g for home", proFor:"260–350g for pro",
    soloMode:"Solo!", dateNight:"Date night 🍷", pizzaParty:"Pizza party 🎉",
    bigGathering:"Big gathering!", fullBakery:"Full bakery mode!",
    starterTitle:"Starter Planner", starterSub2:"Calculate your levain feeding",
    howMuchStarter:"How much active starter do you need?",
    feedingRatio:"Feeding Ratio (seed : flour : water)",
    seedStarter:"🌱 Seed (existing starter)",
    freshFlour:"🌾 Fresh flour", freshWater:"💧 Fresh water",
    readyStarter:"✅ Ready starter",
    feedingFormula:"Feeding Formula", ratioRef:"Ratio Reference",
    recipesTitle:"Sourdough Recipes", recipesSub2:"From flatbread to freestanding loaves",
    allRecipes:"← All Recipes", scale:"Scale:",
    ingredients:"Ingredients", steps:"Steps", proTips:"Pro Tips",
    guideTitle:"Process Guide", guideSub2:"Master every step",
    checks:"Checklist", timerLabel:"Timers",
    troubleTitle:"Troubleshoot", troubleSub2:"Diagnose and fix your bake",
    likelyCauses:"Likely Causes", howToFix:"How to Fix",
    quickGlossary:"Quick Glossary",
    bakersPercent:"Baker's Percentages", understandMath:"Understanding the math",
    bakersMathBody:"Flour is always 100%. Every other ingredient is expressed as a % of flour weight.",
    copyList:"📋 Copy List", copiedLabel:"✓ Copied!",
    timerStart:"▶ Start", timerPause:"⏸ Pause", timerDone:"✓ Done!",
    footer:"Made by S.B and Claude did it.",
    activeDry:"Active dry", instant:"Instant",
    ratio111:"Daily maintenance — mild, 6–8 hr peak",
    ratio122:"Standard feeding — balanced, 8–12 hr peak",
    ratio133:"Moderate — slightly milder, 10–14 hr peak",
    ratio155:"Slower rise — complex flavor, 12–16 hr peak",
    ratio1010:"Very slow — plan ahead, 16–24 hr peak",
    starterRatioTip:"💡 Tip: A stiff starter (50–60% hydration) enhances yeast activity and is preferred by many bakers for wheat sourdough. Use half the water shown above.",
  },
  fa: {
    appName:"لِوان", appTagline:"اپ خمیرمایه",
    taglineSub:"راهنمای کامل خمیرمایه شما — از استارتر تا برش.",
    toolsSections:"ابزارها و بخش‌ها",
    doughCalc:"ماشین‌حساب خمیر", doughCalcSub:"ریاضیات نانوایی و تقسیم غلات کامل",
    pizzaCalc:"ماشین‌حساب پیتزا", pizzaCalcSub:"ناپلی، نیویورک، تنور هیزمی",
    recipes:"دستورها", recipesSub:"۵ دستور کامل نان",
    guide:"راهنمای مراحل", guideSub:"فهرست ۶ مرحله‌ای تسلط",
    trouble:"رفع مشکل", troubleSub:"تشخیص هر مشکل پخت",
    starter:"برنامه‌ریز استارتر", starterSub:"ماشین‌حساب نسبت تغذیه",
    diffOverview:"نمای کلی دشواری", bakerPrinciple:"اصل نانوایی",
    home:"خانه", calculator:"ماشین‌حساب", fix:"رفع اشکال",
    breadCalc:"ماشین‌حساب نان",
    byFlour:"بر اساس آرد / قرص", byTotal:"بر اساس وزن کل",
    flourPerLoaf:"آرد هر قرص نان", totalDoughWeight:"وزن کل خمیر (همه قرص‌ها)",
    leavening:"خمیرمایه",
    sourdoughOpt:"🧫 خمیر ترش", sourdoughSub:"تخمیر طبیعی، طعم عالی",
    yeastOpt:"🍺 مخمر", yeastSub:"همیشه کار می‌کند، قابل پیش‌بینی",
    yeastType:"نوع مخمر",
    freshYeast:"تازه", dryYeast:"خشک فعال", instantYeast:"فوری",
    hydration:"آبیاری", starterLabel:"استارتر", yeastLabel:"مخمر",
    salt:"نمک", wholeGrain:"غلات کامل", ofTotalFlour:"درصد از کل آرد",
    numLoaves:"تعداد قرص‌ها", perLoaf:"هر قرص", yourFormula:"فرمول شما",
    total:"مجموع", flour:"آرد", water:"آب",
    breadFlour:"آرد نان", wgFlour:"غلات کامل / چاودار",
    hydGuide:"راهنمای آبیاری", presets:"پیش‌تنظیمات",
    rolls:"نان کوچک", standard:"استاندارد", large:"بزرگ", mega:"مگا",
    pizzaCalcTitle:"ماشین‌حساب پیتزا",
    doughType:"نوع خمیر",
    yeastPizza:"🍺 مخمر", yeastPizzaSub:"همیشه کار می‌کند، مناسب مبتدی",
    sourdoughPizza:"🧫 خمیر ترش", sourdoughPizzaSub:"طعم عالی، فرآیند طولانی‌تر",
    yourOven:"فر شما", pizzas:"تعداد پیتزا", gramsPerPizza:"گرم / پیتزا",
    toppingsBtn:"🍅 مواد مارگاریتا",
    freshYeastLabel:"مخمر تازه", orDryYeast:"یا مخمر خشک",
    activeStarter:"استارتر فعال", totalDough:"کل خمیر",
    homeFor:"۲۵۰–۲۹۰ گرم برای فر خانگی", proFor:"۲۶۰–۳۵۰ گرم برای حرفه‌ای",
    soloMode:"تنها!", dateNight:"شب دو نفره 🍷", pizzaParty:"پارتی پیتزا 🎉",
    bigGathering:"جمع بزرگ!", fullBakery:"حالت نانوایی!",
    starterTitle:"برنامه‌ریز استارتر", starterSub2:"تغذیه بعدی لوون خود را محاسبه کنید",
    howMuchStarter:"چه مقدار استارتر فعال نیاز دارید؟",
    feedingRatio:"نسبت تغذیه (استارتر : آرد : آب)",
    seedStarter:"🌱 استارتر موجود",
    freshFlour:"🌾 آرد تازه", freshWater:"💧 آب تازه",
    readyStarter:"✅ استارتر آماده",
    feedingFormula:"فرمول تغذیه", ratioRef:"مرجع نسبت‌ها",
    recipesTitle:"دستورهای خمیرمایه", recipesSub2:"از نان تخت تا نان آزاد",
    allRecipes:"→ همه دستورها", scale:"مقیاس:",
    ingredients:"مواد", steps:"مراحل", proTips:"نکات حرفه‌ای",
    guideTitle:"راهنمای مراحل", guideSub2:"هر مرحله را تسلط بیاب",
    checks:"فهرست کنترل", timerLabel:"تایمرها",
    troubleTitle:"رفع مشکل", troubleSub2:"مشکل پخت خود را تشخیص و رفع کنید",
    likelyCauses:"دلایل احتمالی", howToFix:"چگونه رفع کنیم",
    quickGlossary:"واژه‌نامه سریع",
    bakersPercent:"درصدهای نانوایی", understandMath:"درک ریاضیات",
    bakersMathBody:"آرد همیشه ۱۰۰٪ است. هر ماده دیگری به عنوان درصدی از وزن آرد بیان می‌شود.",
    copyList:"📋 کپی", copiedLabel:"✓ کپی شد",
    timerStart:"▶ شروع", timerPause:"⏸ مکث", timerDone:"✓ تمام!",
    footer:"ساخته شده توسط S.B و Claude.",
    activeDry:"خشک فعال", instant:"فوری",
    ratio111:"نگهداری روزانه — ملایم، اوج ۶–۸ ساعت",
    ratio122:"تغذیه استاندارد — متعادل، اوج ۸–۱۲ ساعت",
    ratio133:"متوسط — کمی ملایم‌تر، اوج ۱۰–۱۴ ساعت",
    ratio155:"بالا آمدن کند — طعم پیچیده، اوج ۱۲–۱۶ ساعت",
    ratio1010:"خیلی کند — از قبل برنامه‌ریزی کنید، اوج ۱۶–۲۴ ساعت",
    starterRatioTip:"💡 نکته: استارتر سفت (۵۰–۶۰٪ آبیاری) فعالیت مخمر را تقویت می‌کند و بسیاری از نانوایان آن را برای خمیرترش گندم ترجیح می‌دهند. نصف آب نشان داده شده را استفاده کنید.",
  },
};

// ─── DATA ──────────────────────────────────────────────────────────────────
const PRESETS = [
  { id:"flatbread",    nameEn:"Flatbread",    nameFa:"نان تخت",    hydration:80,  starter:20, salt:2,   wholeGrain:0  },
  { id:"loafpan",      nameEn:"Loaf Pan",     nameFa:"قالب کشتی",  hydration:85,  starter:15, salt:2,   wholeGrain:20 },
  { id:"freestanding", nameEn:"Freestanding", nameFa:"آزاد",       hydration:75,  starter:10, salt:2,   wholeGrain:20 },
  { id:"rye",          nameEn:"Rye",          nameFa:"چاودار",     hydration:90,  starter:20, salt:2.2, wholeGrain:50 },
  { id:"custom",       nameEn:"Custom",       nameFa:"سفارشی",     hydration:75,  starter:15, salt:2,   wholeGrain:0  },
];

const HYDRATION_LEVELS = [
  { range:[55,62],  label:"Beginner",     labelFa:"مبتدی",    color:"#6AA062", desc:"Easy to handle. Dense, chewy crumb.",         descFa:"آسان برای کار. بافت متراکم و جونده."          },
  { range:[63,68],  label:"Intermediate", labelFa:"متوسط",    color:"#D4921E", desc:"Good balance. Nice open crumb.",               descFa:"تعادل خوب. بافت باز و زیبا."                  },
  { range:[69,76],  label:"Advanced",     labelFa:"پیشرفته",  color:"#C86020", desc:"Sticky. Big holes. Rewarding.",               descFa:"چسبنده. حفره‌های بزرگ. ارزشمند."              },
  { range:[77,88],  label:"Expert",       labelFa:"متخصص",    color:"#B85040", desc:"Use oiled hands. Very open crumb.",            descFa:"از دستان روغنی استفاده کنید. بافت بسیار باز." },
  { range:[89,110], label:"Master",       labelFa:"استاد",    color:"#9060C0", desc:"Nearly batter. Loaf pan only.",               descFa:"نزدیک به خمیر رقیق. فقط با قالب."             },
];

const WEIGHT_FUN = [
  [180,  "☕ About the weight of a large coffee",   "☕ تقریباً هم‌وزن یک قهوه بزرگ"    ],
  [380,  "📱 About the weight of a smartphone",     "📱 تقریباً هم‌وزن یک گوشی"         ],
  [550,  "🥫 About the weight of a can of soup",    "🥫 تقریباً هم‌وزن یک قوطی سوپ"    ],
  [750,  "🥦 About the weight of a broccoli",       "🥦 تقریباً هم‌وزن یک بروکلی"      ],
  [950,  "🍍 About the weight of a pineapple",      "🍍 تقریباً هم‌وزن یک آناناس"      ],
  [1300, "🥥 About the weight of a coconut",        "🥥 تقریباً هم‌وزن یک نارگیل"      ],
  [1700, "🧱 About the weight of a brick",          "🧱 تقریباً هم‌وزن یک آجر"         ],
  [2800, "💪 That's a serious bake!",               "💪 این یک پخت جدی است!"            ],
  [99999,"🏋️ Baking for an army!",                "🏋️ در حال پختن برای یک ارتش!"    ],
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
  { id:"home",  nameEn:"🏠 Home Oven",  nameFa:"🏠 فر خانگی",   temp:"250°C / 480°F", defaultWeight:270,
    tip:"Crank heat to max. Use a pizza stone or steel on the top rack.",
    tipFa:"حرارت را به حداکثر برسانید. از سنگ یا صفحه فولادی پیتزا روی طبقه بالایی استفاده کنید." },
  { id:"pizza", nameEn:"🔥 Pizza Oven", nameFa:"🔥 فر پیتزا",   temp:"400°C / 750°F", defaultWeight:280,
    tip:"Preheat 30+ min. Cook 90 seconds, turning halfway through.",
    tipFa:"بیش از ۳۰ دقیقه گرم کنید. ۹۰ ثانیه بپزید و در نیمه بچرخانید." },
  { id:"wood",  nameEn:"🪵 Wood-Fired", nameFa:"🪵 تنور هیزمی",  temp:"480°C / 900°F", defaultWeight:280,
    tip:"60–90 seconds. Look for leopard spotting on the crust.",
    tipFa:"۶۰–۹۰ ثانیه. به لکه‌های پلنگی روی پوسته توجه کنید." },
];

const RECIPES = [
  {
    id:"flatbread", emoji:"🫓",
    name:"Sourdough Flatbread",       nameFa:"نان تخت خمیرمایه",
    sub:"The gateway bread",          subFa:"نان مبدأ",
    difficulty:1, diffLabel:"Very Easy", diffLabelFa:"خیلی آسان",
    workTime:"3 min", workTimeFa:"۳ دقیقه",
    totalTime:"8–24 hrs", totalTimeFa:"۸–۲۴ ساعت",
    hydration:80,
    ingredients:[
      { amount:400, unit:"g", name:"Flour (any type — wheat, rye, corn)", nameFa:"آرد (هر نوع — گندم، چاودار، ذرت)" },
      { amount:320, unit:"g", name:"Water, room temperature",              nameFa:"آب، دمای محیط"                    },
      { amount:80,  unit:"g", name:"Active sourdough starter",             nameFa:"استارتر خمیرترش فعال"             },
      { amount:8,   unit:"g", name:"Salt",                                 nameFa:"نمک"                              },
    ],
    steps:[
      ["Mix dough",    "Combine flour and water until no dry spots remain. Add starter and salt, mix until smooth and homogenized.",
       "مخلوط کردن خمیر", "آرد و آب را مخلوط کنید تا هیچ نقطه خشکی باقی نماند. استارتر و نمک را اضافه کنید، تا صاف و یکنواخت مخلوط کنید."],
      ["Ferment",      "Cover bowl and rest until dough increases 50% in size — typically 8–24 hours. It should smell fruity, milky, or mildly sour.",
       "تخمیر",         "ظرف را بپوشانید و استراحت دهید تا خمیر ۵۰٪ بزرگ‌تر شود — معمولاً ۸–۲۴ ساعت. باید بوی میوه‌ای، شیری یا کمی ترش بدهد."],
      ["Heat the pan", "Set stove to medium heat. Lightly oil the surface and wipe away excess.",
       "گرم کردن تابه", "اجاق را روی حرارت متوسط تنظیم کنید. سطح را کمی روغن بمالید و اضافه را پاک کنید."],
      ["Cook",         "Scoop dough into pan, spread to ~1cm thick. Cover with a lid. Cook 5 min per side until golden-brown.",
       "پختن",          "خمیر را در تابه بریزید، به ضخامت حدود ۱ سانتی‌متر پهن کنید. درب بگذارید. هر طرف ۵ دقیقه تا طلایی‌قهوه‌ای بپزید."],
      ["Wrap & serve", "Wrap baked flatbreads in a kitchen towel to retain moisture. Serve warm with dips, as wraps, or plain with olive oil.",
       "پوشاندن و سرو", "نان‌های پخته را در یک حوله آشپزخانه بپیچید تا رطوبت حفظ شود. با دیپ، به عنوان رول، یا ساده با روغن زیتون سرو کنید."],
    ],
    tips:[
      "Works with ANY flour — wheat, rye, corn, spelt, or gluten-free blends",
      "Higher water ratio (>200%) = sourdough pancakes; lower (~70%) = thicker roti",
      "Store unbaked dough in the fridge for days — it keeps fermenting slowly for more complex flavor",
      "Slightly charring the bread at the end reduces excess sourness",
      "Keep a spoonful of raw dough to start your next batch — no feeding needed",
    ],
    tipsFa:[
      "با هر آردی کار می‌کند — گندم، چاودار، ذرت، اسپلت یا ترکیب‌های بدون گلوتن",
      "نسبت آب بیشتر (>۲۰۰٪) = پنکیک خمیرترش؛ کمتر (~۷۰٪) = روتی ضخیم‌تر",
      "خمیر نپخته را در یخچال نگه دارید — به آرامی به تخمیر ادامه می‌دهد برای طعم پیچیده‌تر",
      "کمی سوزاندن نان در آخر اضافه‌ترشی را کاهش می‌دهد",
      "یک قاشق از خمیر خام نگه دارید تا دسته بعدی را شروع کنید — نیاز به تغذیه ندارد",
    ],
  },
  {
    id:"pancakes", emoji:"🥞",
    name:"Sourdough Pancakes",        nameFa:"پنکیک خمیرمایه",
    sub:"Sweet or savory magic",      subFa:"جادوی شیرین یا شور",
    difficulty:1, diffLabel:"Very Easy", diffLabelFa:"خیلی آسان",
    workTime:"3 min", workTimeFa:"۳ دقیقه",
    totalTime:"8–12 hrs", totalTimeFa:"۸–۱۲ ساعت",
    hydration:300,
    ingredients:[
      { amount:100, unit:"g", name:"Flour (any type)",              nameFa:"آرد (هر نوع)"                          },
      { amount:300, unit:"g", name:"Water",                         nameFa:"آب"                                    },
      { amount:15,  unit:"g", name:"Sourdough starter",             nameFa:"استارتر خمیرترش"                      },
      { amount:2,   unit:"g", name:"Salt",                          nameFa:"نمک"                                   },
      { amount:1,   unit:"",  name:"Egg per 100g flour (optional)", nameFa:"یک تخم‌مرغ به ازای هر ۱۰۰ گرم آرد (اختیاری)" },
    ],
    steps:[
      ["Mix",            "Combine flour, water, starter, and salt. For sweet pancakes add sugar and eggs right before cooking — not before fermenting.",
       "مخلوط کردن",     "آرد، آب، استارتر و نمک را ترکیب کنید. برای پنکیک شیرین، شکر و تخم‌مرغ را درست قبل از پختن اضافه کنید — نه قبل از تخمیر."],
      ["Overnight rest", "Cover and ferment 8–12 hours until surface shows bubbles and smells pleasantly sour.",
       "استراحت شبانه",  "بپوشانید و ۸–۱۲ ساعت تخمیر کنید تا سطح حباب نشان دهد و بوی خوشایند ترشی بدهد."],
      ["Add-ins",        "Just before cooking, stir in optional egg or sugar. Adding them now preserves sweetness — microbes can't ferment it overnight.",
       "افزودنی‌ها",     "درست قبل از پختن، تخم‌مرغ یا شکر اختیاری را هم بزنید. اضافه کردن آنها الان شیرینی را حفظ می‌کند — میکروب‌ها نمی‌توانند شبانه آن را تخمیر کنند."],
      ["Cook thin",      "Cook in lightly oiled pan, 0.1–0.5cm thick. Flip when bubbles appear across the surface.",
       "پختن نازک",      "در تابه کمی روغن‌کاری شده، ۰.۱–۰.۵ سانتی‌متر ضخامت بپزید. وقتی حباب‌ها روی سطح ظاهر شدند برگردانید."],
      ["Serve",          "Enjoy immediately with your favorite toppings. Leftover batter keeps refrigerated for several days.",
       "سرو",             "فوری با توپینگ‌های مورد علاقه‌تان میل کنید. خمیر مانده را می‌توان چند روز در یخچال نگه داشت."],
    ],
    tips:[
      "One egg per 100g flour makes them fluffier and richer",
      "Add sugar just before baking so it isn't consumed during fermentation",
      "Save a spoonful of batter — it becomes your starter for the next batch",
      "Teff flour makes an authentic Ethiopian injera-style pancake",
    ],
    tipsFa:[
      "یک تخم‌مرغ به ازای هر ۱۰۰ گرم آرد آنها را پُف‌تر و غنی‌تر می‌کند",
      "شکر را درست قبل از پختن اضافه کنید تا در طول تخمیر مصرف نشود",
      "یک قاشق خمیر را نگه دارید — برای دسته بعدی استارتر شما می‌شود",
      "آرد تف یک پنکیک اتیوپیایی اینجرا واقعی می‌سازد",
    ],
  },
  {
    id:"loafpan", emoji:"🍞",
    name:"Loaf Pan Sourdough",        nameFa:"خمیرمایه قالبی",
    sub:"Effortless everyday bread",  subFa:"نان روزمره بی‌دردسر",
    difficulty:2, diffLabel:"Easy",   diffLabelFa:"آسان",
    workTime:"5 min", workTimeFa:"۵ دقیقه",
    totalTime:"12–24 hrs", totalTimeFa:"۱۲–۲۴ ساعت",
    hydration:85,
    ingredients:[
      { amount:500, unit:"g", name:"Flour (wheat, rye, or mixed)", nameFa:"آرد (گندم، چاودار یا مخلوط)" },
      { amount:425, unit:"g", name:"Water",                        nameFa:"آب"                            },
      { amount:75,  unit:"g", name:"Active sourdough starter",     nameFa:"استارتر خمیرترش فعال"         },
      { amount:10,  unit:"g", name:"Salt",                         nameFa:"نمک"                           },
    ],
    steps:[
      ["Mix",      "Combine all ingredients until fully homogenized. A very sticky, wet dough is normal and desirable — it produces a fluffier crumb.",
       "مخلوط",    "همه مواد را تا کاملاً یکنواخت مخلوط کنید. خمیر خیلی چسبنده و مرطوب طبیعی و مطلوب است — مغز نرم‌تری ایجاد می‌کند."],
      ["Into pan", "Generously grease loaf pan with oil. Scrape dough in — no shaping required. Smooth top with wet fingers.",
       "داخل قالب","قالب نان را با روغن خوب چرب کنید. خمیر را داخل بریزید — نیازی به شکل‌دهی نیست. روی آن را با انگشتان مرطوب صاف کنید."],
      ["Proof",    "Cover and wait until dough roughly doubles in size (6–12 hrs at room temp). Do not rush this step.",
       "تخمیر",    "بپوشانید و صبر کنید تا خمیر تقریباً دو برابر شود (۶–۱۲ ساعت در دمای محیط). این مرحله را عجله نکنید."],
      ["Bake",     "Place in cold oven, set to 200°C (390°F). Bake 30–50 min. Done when internal temperature reaches 92°C (197°F).",
       "پخت",      "در فر سرد قرار دهید، روی ۲۰۰ درجه سانتیگراد (۳۹۰ فارنهایت) تنظیم کنید. ۳۰–۵۰ دقیقه بپزید. وقتی دمای داخلی به ۹۲ درجه رسید آماده است."],
      ["Cool",     "Remove from pan and cool on a rack for at least 1 hour before slicing. The crumb needs to set.",
       "خنک کردن", "از قالب بیرون آورید و حداقل ۱ ساعت قبل از برش روی توری بگذارید. مغز نیاز دارد سفت شود."],
    ],
    tips:[
      "Never wash your loaf pan with soap — a seasoned patina prevents sticking with each bake",
      "Place another identical pan on top to simulate a Dutch oven and trap steam",
      "90–100% hydration creates a very soft, chewy crumb — especially beautiful with rye",
      "Mix 50% wheat into a rye dough to significantly improve structure",
      "You can bake 5 loaves at once in a home oven — perfect for batch baking",
    ],
    tipsFa:[
      "قالب نان را با صابون نشویید — یک پتینه چرب‌شده از چسبیدن در هر پخت جلوگیری می‌کند",
      "یک قالب مشابه روی آن قرار دهید تا مثل یک قابلمه هلندی عمل کند و بخار را نگه دارد",
      "۹۰–۱۰۰٪ آبیاری مغز بسیار نرم و جونده ایجاد می‌کند — مخصوصاً با چاودار زیباست",
      "۵۰٪ گندم به خمیر چاودار اضافه کنید تا ساختار بهتری داشته باشد",
      "می‌توانید ۵ قرص را یکباره در فر خانگی بپزید — عالی برای پخت انبوه",
    ],
  },
  {
    id:"wheat", emoji:"🥖",
    name:"Freestanding Wheat Sourdough",  nameFa:"خمیرمایه گندمی آزاد",
    sub:"The supreme discipline",          subFa:"بالاترین سطح مهارت",
    difficulty:4, diffLabel:"Advanced",   diffLabelFa:"پیشرفته",
    workTime:"60 min", workTimeFa:"۶۰ دقیقه",
    totalTime:"24–36 hrs", totalTimeFa:"۲۴–۳۶ ساعت",
    hydration:75,
    ingredients:[
      { amount:500, unit:"g", name:"Bread flour (>12% protein)",    nameFa:"آرد نان (پروتئین >۱۲٪)"     },
      { amount:375, unit:"g", name:"Water, 26–28°C (79–82°F)",      nameFa:"آب، ۲۶–۲۸ درجه سانتیگراد"   },
      { amount:100, unit:"g", name:"Active levain / starter",       nameFa:"لوون فعال / استارتر"         },
      { amount:10,  unit:"g", name:"Fine sea salt",                 nameFa:"نمک دریایی ریز"               },
    ],
    steps:[
      ["Prepare starter",   "Feed your starter 4–12 hrs before baking. It must be doubled, bubbly, domed at the top, and pass the float test.",
       "آماده‌سازی استارتر","استارتر را ۴–۱۲ ساعت قبل از پخت تغذیه کنید. باید دو برابر شده، حباب‌دار، بالای گنبدی داشته باشد و در آزمایش شناوری قبول شود."],
      ["Autolyse",          "Mix flour and water only. Cover and rest 30–60 minutes. This passively develops gluten without kneading.",
       "اتولیز",             "فقط آرد و آب را مخلوط کنید. بپوشانید و ۳۰–۶۰ دقیقه استراحت دهید. این به صورت منفعل گلوتن را بدون ورز دادن توسعه می‌دهد."],
      ["Incorporate",       "Add levain and salt. Mix thoroughly using pinch-and-fold until fully incorporated and uniform.",
       "ترکیب",              "لوون و نمک را اضافه کنید. با استفاده از تا کردن فشاری کاملاً مخلوط کنید تا کاملاً یکنواخت شود."],
      ["Bulk fermentation", "Ferment 4–8 hrs at 24–26°C. Perform stretch & folds every 30 min for the first 2 hrs. Wait for a 50–75% size increase.",
       "تخمیر حجمی",        "۴–۸ ساعت در ۲۴–۲۶ درجه تخمیر کنید. در ۲ ساعت اول هر ۳۰ دقیقه یک‌بار کشش و تا انجام دهید. منتظر بمانید تا ۵۰–۷۵٪ بزرگ شود."],
      ["Pre-shape",         "Tip dough onto counter. Use a bench scraper to shape into rough rounds. Rest uncovered 20–30 min.",
       "پیش‌شکل‌دهی",       "خمیر را روی پیشخوان بریزید. با کارد خمیر شکل دایره‌های تقریبی بدهید. ۲۰–۳۰ دقیقه بدون پوشش استراحت دهید."],
      ["Final shape",       "Shape into batard or boule using tension folds. Place seam-up in a well-floured banneton.",
       "شکل‌دهی نهایی",     "شکل باتارد یا بول با تاهای کشش بدهید. با درز رو به بالا در یک بانتون آرد پاشیده بگذارید."],
      ["Cold proof",        "Cover and refrigerate 8–16 hrs. Deep flavor develops here, and scoring becomes much easier.",
       "تخمیر سرد",         "بپوشانید و ۸–۱۶ ساعت در یخچال بگذارید. طعم عمیق اینجا توسعه می‌یابد و برش زدن بسیار آسان‌تر می‌شود."],
      ["Score & bake",      "Preheat Dutch oven at 250°C (480°F) for 45 min. Score cold dough at 30–45°. Bake covered 20 min, uncovered 20 min.",
       "برش و پخت",         "قابلمه هلندی را در ۲۵۰ درجه (۴۸۰ فارنهایت) ۴۵ دقیقه پیش‌گرم کنید. خمیر سرد را با زاویه ۳۰–۴۵ درجه برش بزنید. ۲۰ دقیقه با درب، ۲۰ دقیقه بدون درب بپزید."],
    ],
    tips:[
      "Bread flour with >12% protein is essential — all-purpose flour won't hold its shape",
      "Cold overnight proofing dramatically improves flavor and gives a more open crumb",
      "Score at 30–45° angle, 1cm deep for a proper ear to form",
      "Over-fermentation is the #1 mistake — dough should feel airy but NOT slack",
      "There is no recipe you can blindly follow. Learn to read your dough.",
    ],
    tipsFa:[
      "آرد نان با پروتئین >۱۲٪ ضروری است — آرد همه‌منظوره شکل خود را حفظ نمی‌کند",
      "تخمیر شبانه سرد به طور چشمگیری طعم را بهبود می‌دهد و مغز بازتری ایجاد می‌کند",
      "زاویه ۳۰–۴۵ درجه، عمق ۱ سانتی‌متر برای تشکیل گوش مناسب",
      "بیش از حد تخمیر کردن اشتباه شماره ۱ است — خمیر باید سبک اما شل نباشد",
      "هیچ دستوری نیست که بتوانی کورکورانه دنبال کنی. یاد بگیر خمیرت را بخوانی.",
    ],
  },
  {
    id:"rye", emoji:"🌾",
    name:"Dark Rye Sourdough",         nameFa:"خمیرمایه چاودار تیره",
    sub:"Hearty, robust, complex",     subFa:"محکم، قوی، پیچیده",
    difficulty:3, diffLabel:"Medium",  diffLabelFa:"متوسط",
    workTime:"10 min", workTimeFa:"۱۰ دقیقه",
    totalTime:"18–36 hrs", totalTimeFa:"۱۸–۳۶ ساعت",
    hydration:90,
    ingredients:[
      { amount:250, unit:"g", name:"Rye flour (whole or dark)",  nameFa:"آرد چاودار (کامل یا تیره)"  },
      { amount:250, unit:"g", name:"Bread flour",                nameFa:"آرد نان"                    },
      { amount:450, unit:"g", name:"Water",                      nameFa:"آب"                         },
      { amount:100, unit:"g", name:"Active rye starter",         nameFa:"استارتر چاودار فعال"        },
      { amount:10,  unit:"g", name:"Salt",                       nameFa:"نمک"                        },
    ],
    steps:[
      ["Mix",         "Combine all ingredients. Rye dough does NOT need kneading — its pentosans (not gluten) create structure. The dough will be paste-like.",
       "مخلوط",       "همه مواد را ترکیب کنید. خمیر چاودار نیاز به ورز دادن ندارد — پنتوزان‌هایش (نه گلوتن) ساختار ایجاد می‌کنند. خمیر شبیه خمیر رقیق می‌شود."],
      ["Into pan",    "Use wet hands to transfer to a well-greased loaf pan. Smooth the top. Optionally press seeds into the surface.",
       "داخل قالب",   "با دستان مرطوب به یک قالب نان خوب چرب‌شده منتقل کنید. روی آن را صاف کنید. اختیاری: دانه‌ها را روی سطح فشار دهید."],
      ["Proof",       "Cover and proof 4–8 hrs until dough reaches the top of the pan. Rye ferments faster than wheat — watch the dough, not the clock.",
       "تخمیر",       "بپوشانید و ۴–۸ ساعت تخمیر کنید تا خمیر به بالای قالب برسد. چاودار سریع‌تر از گندم تخمیر می‌کند — خمیر را نگاه کنید، نه ساعت را."],
      ["Bake",        "Bake at 220°C (428°F) for 45–55 min. Internal temp should reach 92°C (197°F).",
       "پخت",         "در ۲۲۰ درجه سانتیگراد (۴۲۸ فارنهایت) ۴۵–۵۵ دقیقه بپزید. دمای داخلی باید به ۹۲ درجه (۱۹۷ فارنهایت) برسد."],
      ["Wait 24 hrs", "Do not slice for at least 24 hours. The crumb needs time to set. Cutting too soon results in a gummy, collapsing interior.",
       "۲۴ ساعت صبر", "حداقل ۲۴ ساعت برش نزنید. مغز نیاز دارد سفت شود. برش زودهنگام منجر به داخل صمغی و فرو ریختن می‌شود."],
    ],
    tips:[
      "Rye's pentosans create structure — kneading actually damages the dough",
      "Traditional add-ins: caraway seeds, sunflower seeds, walnuts, or fennel",
      "Higher hydration (90–100%) is normal for rye — embrace the stickiness",
      "Rye bread improves with age — wrap in cloth and it stays excellent for a week",
    ],
    tipsFa:[
      "پنتوزان‌های چاودار ساختار ایجاد می‌کنند — ورز دادن در واقع خمیر را خراب می‌کند",
      "مواد سنتی: دانه کرفس، دانه آفتابگردان، گردو یا رازیانه",
      "آبیاری بالاتر (۹۰–۱۰۰٪) برای چاودار طبیعی است — چسبندگی را بپذیرید",
      "نان چاودار با گذر زمان بهتر می‌شود — در پارچه بپیچید و یک هفته عالی می‌ماند",
    ],
  },
];

const GUIDE = [
  { id:1, emoji:"🧫",
    phase:"Before You Begin",           phaseFa:"قبل از شروع",
    title:"Ready Your Starter",         titleFa:"استارتر را آماده کنید",
    color:"#5A8A50",
    body:"Your starter must be active, bubbly, and at peak before you bake. Feed it 4–12 hours before mixing. A healthy starter doubles in size, smells fruity-sour or milky, and passes the float test.",
    bodyFa:"استارتر شما باید قبل از پختن فعال، حباب‌دار و در اوج باشد. ۴–۱۲ ساعت قبل از مخلوط کردن به آن غذا دهید. یک استارتر سالم دو برابر می‌شود، بوی میوه‌ای-ترش یا شیری می‌دهد و در آزمایش شناوری قبول می‌شود.",
    checks:["Starter doubled since last feeding","Bubbly, domed top — not flat or collapsed","Float test: drop a small piece in water and it floats","Smells fruity, milky, or mildly sour"],
    checksFa:["استارتر از آخرین تغذیه دو برابر شده","بالای گنبدی و حباب‌دار — نه صاف یا فرو ریخته","آزمایش شناوری: یک تکه کوچک در آب بیندازید تا شناور بماند","بوی میوه‌ای، شیری یا کمی ترش می‌دهد"],
    tip:"If your starter has been stored in the fridge, give it 2–3 consecutive feedings over 1–2 days to fully reactivate.",
    tipFa:"اگر استارتر شما در یخچال نگه داشته شده، ۲–۳ بار متوالی در ۱–۲ روز به آن غذا دهید تا کاملاً دوباره فعال شود.",
    timers:[],
    timersFa:[],
  },
  { id:2, emoji:"🥣",
    phase:"Day 1 – Morning",            phaseFa:"روز ۱ — صبح",
    title:"Mix & Autolyse",             titleFa:"مخلوط و اتولیز",
    color:"#8A6830",
    body:"Mix flour and water first, then rest 30–60 minutes (autolyse). The dough develops gluten passively during rest without kneading. Then add starter and salt and mix until fully incorporated.",
    bodyFa:"ابتدا آرد و آب را مخلوط کنید، سپس ۳۰–۶۰ دقیقه استراحت دهید (اتولیز). خمیر در طول استراحت به صورت منفعل گلوتن توسعه می‌دهد بدون ورز دادن. سپس استارتر و نمک را اضافه کنید و تا کاملاً ترکیب شود مخلوط کنید.",
    checks:["No dry flour spots remain","Starter and salt fully incorporated","Dough is smooth and cohesive"],
    checksFa:["هیچ ذرات آردی باقی نمانده","استارتر و نمک کاملاً ترکیب شده","خمیر صاف و یکپارچه است"],
    tip:"Use water at 26–28°C (79–82°F). Warmer water speeds fermentation; too cold slows it down too much.",
    tipFa:"از آب در دمای ۲۶–۲۸ درجه سانتیگراد استفاده کنید. آب گرم‌تر تخمیر را سرعت می‌دهد؛ خیلی سرد آن را خیلی کند می‌کند.",
    timers:[{ label:"Autolyse rest", minutes:30 }],
    timersFa:[{ label:"استراحت اتولیز", minutes:30 }],
  },
  { id:3, emoji:"⏱️",
    phase:"Day 1 – Morning to Afternoon", phaseFa:"روز ۱ — صبح تا ظهر",
    title:"Bulk Fermentation",            titleFa:"تخمیر حجمی",
    color:"#7A5A30",
    body:"The main fermentation takes 4–8 hours at room temperature. During the first 2 hours, perform 4–6 sets of stretch & folds every 30 minutes. Then leave undisturbed until ready.",
    bodyFa:"تخمیر اصلی در دمای محیط ۴–۸ ساعت طول می‌کشد. در ۲ ساعت اول، هر ۳۰ دقیقه ۴–۶ دور کشش و تا انجام دهید. سپس تا آماده شدن بدون مزاحمت بگذارید.",
    checks:["Dough increased 50–75% in size","Bubbles visible on sides of container","Dough feels airy and jiggly when shaken","Passes windowpane test: stretches thin without tearing"],
    checksFa:["خمیر ۵۰–۷۵٪ بزرگ‌تر شده","حباب‌ها روی بدنه ظرف قابل رویت است","خمیر هنگام تکان خوردن سبک و لرزان است","آزمایش پنجره: کشش نازک بدون پاره شدن"],
    tip:"Warmer = faster. At 28°C expect ~4 hrs; at 22°C expect ~6–8 hrs. Always read your dough, not the clock.",
    tipFa:"گرم‌تر = سریع‌تر. در ۲۸ درجه حدود ۴ ساعت؛ در ۲۲ درجه حدود ۶–۸ ساعت. همیشه خمیرتان را بخوانید، نه ساعت را.",
    timers:[{ label:"Stretch & fold interval", minutes:30 }, { label:"Full bulk ferment (avg)", minutes:360 }],
    timersFa:[{ label:"فاصله کشش و تا", minutes:30 }, { label:"تخمیر حجمی کامل (میانگین)", minutes:360 }],
  },
  { id:4, emoji:"👐",
    phase:"Day 1 – Afternoon",          phaseFa:"روز ۱ — بعد از ظهر",
    title:"Pre-shape & Shape",          titleFa:"پیش‌شکل‌دهی و شکل‌دهی",
    color:"#6A4A28",
    body:"Tip dough out, pre-shape into a rough round, rest 20–30 minutes uncovered. Then final shape into a batard or boule using tension folds. Build surface tension by dragging the dough toward you.",
    bodyFa:"خمیر را بریزید، شکل دایره‌ای تقریبی بدهید، ۲۰–۳۰ دقیقه بدون پوشش استراحت دهید. سپس شکل نهایی باتارد یا بول با تاهای کشش بدهید. با کشیدن خمیر به سمت خودتان کشش سطحی ایجاد کنید.",
    checks:["Surface is smooth and taut","Dough holds shape without spreading flat","No tears on surface","Seam neatly sealed at the bottom"],
    checksFa:["سطح صاف و کشیده است","خمیر شکل خود را نگه می‌دارد و پخش نمی‌شود","هیچ پارگی روی سطح نیست","درز در پایین مرتب بسته شده"],
    tip:"Work on a lightly unfloured surface — you need friction for tension. A bench scraper is indispensable here.",
    tipFa:"روی سطح کم‌آردی کار کنید — به اصطکاک برای کشش نیاز دارید. یک کارد خمیر اینجا ضروری است.",
    timers:[{ label:"Pre-shape bench rest", minutes:25 }],
    timersFa:[{ label:"استراحت بانکو پیش‌شکل‌دهی", minutes:25 }],
  },
  { id:5, emoji:"🌙",
    phase:"Day 1 – Evening",            phaseFa:"روز ۱ — عصر",
    title:"Proofing",                   titleFa:"تخمیر ثانویه",
    color:"#3A4A68",
    body:"Place shaped dough seam-up in a well-floured banneton. Either proof at room temperature 1–2 hrs, or cover and refrigerate overnight. Cold proofing is strongly recommended.",
    bodyFa:"خمیر شکل داده شده را با درز رو به بالا در یک بانتون خوب آرد پاشیده شده قرار دهید. یا در دمای محیط ۱–۲ ساعت تخمیر کنید، یا بپوشانید و شبانه در یخچال بگذارید. تخمیر سرد اکیداً توصیه می‌شود.",
    checks:["Banneton well-floured (rice flour is best)","Poke test: dough springs back slowly when poked","If cold-proofing: dough is firm and cold before baking"],
    checksFa:["بانتون خوب آرد پاشیده شده (آرد برنج بهترین است)","آزمایش فشار: خمیر به آرامی به حالت اول برمی‌گردد","در صورت تخمیر سرد: خمیر قبل از پختن سفت و سرد است"],
    tip:"Cold proofing 8–16 hrs gives dramatically better flavor, a more open crumb, and makes scoring much easier.",
    tipFa:"تخمیر سرد ۸–۱۶ ساعت به طور چشمگیری طعم بهتر، مغز بازتر و برش زدن بسیار آسان‌تر می‌دهد.",
    timers:[{ label:"Room temp proof", minutes:90 }],
    timersFa:[{ label:"تخمیر در دمای محیط", minutes:90 }],
  },
  { id:6, emoji:"🔥",
    phase:"Day 2 – Baking",             phaseFa:"روز ۲ — پخت",
    title:"Score & Bake",               titleFa:"برش و پخت",
    color:"#8A3A20",
    body:"Preheat Dutch oven at 230–250°C (445–480°F) for at least 45 minutes. Score the cold dough with a lame or razor blade at a 30–45° angle. Bake covered 20 min (steam), then uncovered 20 min (crust).",
    bodyFa:"قابلمه هلندی را در ۲۳۰–۲۵۰ درجه سانتیگراد (۴۴۵–۴۸۰ فارنهایت) حداقل ۴۵ دقیقه پیش‌گرم کنید. خمیر سرد را با یک لاموس یا تیغ با زاویه ۳۰–۴۵ درجه برش بزنید. ۲۰ دقیقه با درب (بخار) و ۲۰ دقیقه بدون درب (پوسته) بپزید.",
    checks:["Dutch oven preheated minimum 45 min","Razor blade held at 30–45° angle","Ear formed during baking","Hollow sound when bottom is tapped"],
    checksFa:["قابلمه هلندی حداقل ۴۵ دقیقه پیش‌گرم شده","تیغ با زاویه ۳۰–۴۵ درجه نگه داشته شده","گوش در طول پخت تشکیل شده","صدای توخالی هنگام ضربه به کف"],
    tip:"The steam in the first 20 minutes (lid on) is absolutely critical for oven spring. Never skip it.",
    tipFa:"بخار در ۲۰ دقیقه اول (درب روی آن) برای پف فر کاملاً حیاتی است. هرگز آن را حذف نکنید.",
    timers:[{ label:"Preheat Dutch oven", minutes:45 }, { label:"Bake covered — steam", minutes:20 }, { label:"Bake uncovered — crust", minutes:20 }],
    timersFa:[{ label:"پیش‌گرم کردن قابلمه", minutes:45 }, { label:"پخت با درب — بخار", minutes:20 }, { label:"پخت بدون درب — پوسته", minutes:20 }],
  },
];

const TROUBLE = [
  { emoji:"📉",
    problem:"Flat bread / No oven spring",  problemFa:"نان پهن / بدون پف فر",
    causes:["Weak or inactive starter","Over-fermented dough","Weak shaping — not enough tension","Poor scoring technique"],
    causesFa:["استارتر ضعیف یا غیرفعال","خمیر بیش از حد تخمیر شده","شکل‌دهی ضعیف — کشش کافی نیست","تکنیک برش ضعیف"],
    fixes:["Feed starter until it reliably doubles within 8 hrs","Reduce bulk fermentation by 30–60 min","Focus on building surface tension during shaping","Score at 30–45° angle, at least 1cm deep"],
    fixesFa:["استارتر را تغذیه کنید تا در ۸ ساعت دو برابر شود","تخمیر حجمی را ۳۰–۶۰ دقیقه کاهش دهید","در شکل‌دهی بر ایجاد کشش سطحی تمرکز کنید","زاویه ۳۰–۴۵ درجه، حداقل ۱ سانتی‌متر عمق برش بزنید"],
  },
  { emoji:"🧱",
    problem:"Dense or gummy crumb",         problemFa:"مغز متراکم یا صمغی",
    causes:["Under-baked — taken out too soon","Sliced while still hot","Under-fermented","Insufficient gluten development"],
    causesFa:["کم‌پخته — خیلی زود بیرون آمده","در حالی که هنوز گرم است برش زده شده","کم‌تخمیر شده","توسعه ناکافی گلوتن"],
    fixes:["Bake to 92–96°C (197–205°F) internal temp","Rest at least 1 hr (rye: 24 hrs) before cutting","Extend bulk fermentation by 1 hr","Increase stretch & fold sets in first 2 hrs"],
    fixesFa:["تا دمای داخلی ۹۲–۹۶ درجه بپزید","حداقل ۱ ساعت (چاودار: ۲۴ ساعت) قبل از برش صبر کنید","تخمیر حجمی را ۱ ساعت طولانی‌تر کنید","دورهای کشش و تا را در ۲ ساعت اول افزایش دهید"],
  },
  { emoji:"😬",
    problem:"Too sour / harsh acidity",     problemFa:"خیلی ترش / اسیدیته تند",
    causes:["Over-fermented","Too high starter percentage","Long warm-temp proof","Starter not balanced"],
    causesFa:["بیش از حد تخمیر شده","درصد استارتر خیلی زیاد","تخمیر طولانی در دمای گرم","استارتر نامتعادل"],
    fixes:["Shorten bulk fermentation by 30–60 min","Reduce starter % to 8–10%","Cold proof instead of room temp","Feed starter 2–3× to rebalance yeast/bacteria"],
    fixesFa:["تخمیر حجمی را ۳۰–۶۰ دقیقه کوتاه کنید","درصد استارتر را به ۸–۱۰٪ کاهش دهید","به جای دمای محیط، تخمیر سرد انجام دهید","استارتر را ۲–۳ بار تغذیه کنید تا تعادل مخمر/باکتری برقرار شود"],
  },
  { emoji:"😶",
    problem:"Not sour enough",              problemFa:"به اندازه کافی ترش نیست",
    causes:["Under-fermented","Fermentation too fast (too warm)","Yeast-dominant starter"],
    causesFa:["کم‌تخمیر شده","تخمیر خیلی سریع (خیلی گرم)","استارتر غالب مخمر"],
    fixes:["Cold proof 24–48 hrs for more acid development","Reduce starter to 5–8% to slow fermentation","Use cooler water to slow yeast","Let bulk fermentation run 1–2 hrs longer"],
    fixesFa:["۲۴–۴۸ ساعت تخمیر سرد برای توسعه اسید بیشتر","استارتر را به ۵–۸٪ کاهش دهید تا تخمیر کند شود","از آب سردتر برای کند کردن مخمر استفاده کنید","تخمیر حجمی را ۱–۲ ساعت طولانی‌تر کنید"],
  },
  { emoji:"🫠",
    problem:"Dough too sticky / won't shape", problemFa:"خمیر خیلی چسبنده / شکل نمی‌گیرد",
    causes:["Hydration too high","Under-developed gluten","Dough too warm"],
    causesFa:["آبیاری خیلی زیاد","گلوتن کم‌توسعه یافته","خمیر خیلی گرم است"],
    fixes:["Reduce hydration by 5% next bake","Do more stretch & fold sets during bulk","Refrigerate dough 30 min before shaping","Lightly wet hands instead of using flour"],
    fixesFa:["آبیاری را در پخت بعدی ۵٪ کاهش دهید","دورهای بیشتری کشش و تا در طول حجمی انجام دهید","۳۰ دقیقه قبل از شکل‌دهی خمیر را در یخچال بگذارید","به جای آرد از دستان کمی مرطوب استفاده کنید"],
  },
  { emoji:"🪨",
    problem:"Crust too thick or hard",      problemFa:"پوسته خیلی ضخیم یا سخت",
    causes:["Overbaked","Not enough steam during baking","Oven too hot"],
    causesFa:["بیش از حد پخته شده","بخار ناکافی در طول پخت","فر خیلی داغ"],
    fixes:["Reduce bake time by 5-min increments","Ensure Dutch oven lid seals tightly for first 20 min","Lower oven temp by 10°C (18°F)"],
    fixesFa:["زمان پخت را ۵ دقیقه کاهش دهید","اطمینان حاصل کنید درب قابلمه هلندی در ۲۰ دقیقه اول محکم بسته است","دمای فر را ۱۰ درجه سانتیگراد کاهش دهید"],
  },
  { emoji:"😴",
    problem:"Starter not rising",           problemFa:"استارتر بالا نمی‌آید",
    causes:["Environment too cold","Flour lacks nutrients","Acid buildup killing yeast","Possible contamination"],
    causesFa:["محیط خیلی سرد است","آرد مواد مغذی کافی ندارد","تجمع اسید مخمر را می‌کشد","احتمال آلودگی"],
    fixes:["Keep starter at 24–28°C (75–82°F)","Switch to whole grain or rye flour for more nutrients","Discard all but 1–2g and restart feedings","Start a fresh starter if persistent"],
    fixesFa:["استارتر را در ۲۴–۲۸ درجه سانتیگراد نگه دارید","برای مواد مغذی بیشتر به آرد کامل یا چاودار تغییر دهید","همه را دور بریزید جز ۱–۲ گرم و تغذیه‌ها را دوباره شروع کنید","اگر ادامه داشت، استارتر جدید شروع کنید"],
  },
  { emoji:"🫢",
    problem:"Big holes in crust / blowouts", problemFa:"حفره‌های بزرگ در پوسته / ترکیدگی",
    causes:["Under-proofed","Inadequate shaping","Scored too deep or wrong angle"],
    causesFa:["کم‌تخمیر شده","شکل‌دهی ناکافی","برش خیلی عمیق یا زاویه اشتباه"],
    fixes:["Extend proof by 30–60 min (poke test should spring back slowly)","Work on even, consistent tension when shaping","Score at 30–45° angle — shallower and longer"],
    fixesFa:["تخمیر را ۳۰–۶۰ دقیقه طولانی‌تر کنید (آزمایش فشار باید به آرامی برگردد)","در شکل‌دهی بر کشش یکنواخت و ثابت کار کنید","زاویه ۳۰–۴۵ درجه برش بزنید — کوتاه‌تر و عریض‌تر"],
  },
];

// ─── UTILITIES ──────────────────────────────────────────────────────────────
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

// ─── SHARED UI ──────────────────────────────────────────────────────────────
function Pill({ children, color, small }) {
  const { C } = useApp();
  const c = color || C.accent;
  return (
    <span style={{
      background:`${c}20`, color:c, border:`1px solid ${c}40`,
      borderRadius:20, padding: small ? "2px 8px" : "4px 12px",
      fontSize:14, fontFamily:BODY, fontWeight:600,
      letterSpacing:0.3, whiteSpace:"nowrap",
    }}>{children}</span>
  );
}

function DiffDots({ level }) {
  const { C } = useApp();
  return (
    <span style={{ display:"flex", gap:3, alignItems:"center" }}>
      {[1,2,3,4].map(i => (
        <span key={i} style={{ width:i<=level?7:6, height:i<=level?7:6, borderRadius:"50%", background:i<=level?C.accent:C.border }} />
      ))}
    </span>
  );
}

function SectionTitle({ title, sub }) {
  const { C, getFont } = useApp();
  return (
    <div style={{ marginBottom:22 }}>
      <h2 style={{ fontFamily:getFont("serif"), fontSize:26, color:C.text, fontWeight:700, lineHeight:1.2 }}>{title}</h2>
      {sub && <p style={{ fontFamily:getFont("body"), color:C.sub, fontSize:15, marginTop:4, fontStyle:"italic" }}>{sub}</p>}
    </div>
  );
}

function NumInput({ value, onChange, step=50, min=1, unit="g" }) {
  const { C, getFont, num } = useApp();
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
    <div style={{ display:"flex", alignItems:"center", background:C.card, border:`1px solid ${C.border}`, borderRadius:14, overflow:"hidden" }}>
      <button onClick={dec} style={{ padding:"14px 20px", background:"transparent", border:"none", color:C.sub, fontSize:24, cursor:"pointer", lineHeight:1, userSelect:"none", flexShrink:0 }}>−</button>
      <input
        type="text" inputMode="decimal" value={display}
        onChange={e => { setDisplay(e.target.value); const n=parseFloat(e.target.value); if(!isNaN(n)&&n>=min) onChange(n); }}
        onBlur={e => commit(e.target.value)}
        style={{ flex:1, textAlign:"center", background:"transparent", border:"none", fontFamily:getFont("serif"), fontSize:28, color:C.text, outline:"none", minWidth:0 }}
      />
      <span style={{ fontFamily:getFont("body"), fontSize:14, color:C.sub, flexShrink:0 }}>{unit}</span>
      <button onClick={inc} style={{ padding:"14px 20px", background:"transparent", border:"none", color:C.sub, fontSize:24, cursor:"pointer", lineHeight:1, userSelect:"none", flexShrink:0 }}>+</button>
    </div>
  );
}

function Slider({ label, value, onChange, min, max, step=1, unit="%", sublabel }) {
  const { C, getFont, num } = useApp();
  const pct = ((value-min)/(max-min))*100;
  return (
    <div style={{ marginBottom:22 }}>
      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
        <div>
          <span style={{ fontFamily:getFont("body"), fontSize:16, color:C.text }}>{label}</span>
          {sublabel && <span style={{ fontFamily:getFont("body"), fontSize:14, color:C.faint, marginLeft:8 }}>{sublabel}</span>}
        </div>
        <span style={{ fontFamily:getFont("serif"), fontSize:18, color:C.accent, fontWeight:700 }}>{num(value)}{unit}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(parseFloat(e.target.value))}
        style={{ background:`linear-gradient(to right,${C.accent} 0%,${C.accent} ${pct}%,${C.border} ${pct}%,${C.border} 100%)` }}
      />
      <div style={{ display:"flex", justifyContent:"space-between", marginTop:5 }}>
        <span style={{ fontFamily:getFont("body"), fontSize:14, color:C.faint }}>{num(min)}{unit}</span>
        <span style={{ fontFamily:getFont("body"), fontSize:14, color:C.faint }}>{num(max)}{unit}</span>
      </div>
    </div>
  );
}

function CopyButton({ getText }) {
  const { C, t, getFont } = useApp();
  const [state, setState] = useState("idle");
  const handleCopy = async () => {
    const ok = await copyText(getText());
    setState(ok ? "done" : "fail");
    setTimeout(() => setState("idle"), 2000);
  };
  return (
    <button onClick={handleCopy} style={{
      display:"flex", alignItems:"center", gap:6, padding:"9px 16px",
      background: state==="done" ? `${C.green}22` : C.accentDim,
      border:`1px solid ${state==="done" ? C.green : C.accent}55`,
      borderRadius:10, color: state==="done" ? C.green : C.accent,
      fontFamily:getFont("body"), fontSize:14, cursor:"pointer", transition:"all 0.2s",
    }}>
      {state==="done" ? t("copiedLabel") : t("copyList")}
    </button>
  );
}

function PageFooter() {
  const { C, t, getFont } = useApp();
  return (
    <div style={{ textAlign:"center", padding:"20px 0 6px", fontFamily:getFont("body"), fontSize:14, color:C.faint, letterSpacing:0.5, fontStyle:"italic" }}>
      {t("footer")}
    </div>
  );
}

function StepTimer({ label, minutes }) {
  const { C, t, getFont, num } = useApp();
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
  return (
    <div style={{ background:C.card2, border:`1px solid ${done ? C.green : C.border}`, borderRadius:12, padding:"12px 14px", marginBottom:8, transition:"border-color 0.3s" }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:8 }}>
        <div>
          <div style={{ fontFamily:getFont("body"), fontSize:14, color:C.sub, marginBottom:3 }}>⏱ {label}</div>
          <div style={{ fontFamily:getFont("serif"), fontSize:24, color:done ? C.green : C.accent, fontWeight:700 }}>
            {done ? t("timerDone") : `${mm}:${ss}`}
          </div>
        </div>
        <div style={{ display:"flex", gap:6 }}>
          {!done && (
            <button onClick={() => setRunning(r => !r)} style={{
              padding:"9px 16px", borderRadius:8, cursor:"pointer",
              border:`1px solid ${C.accent}`,
              background: running ? `${C.accent}22` : C.accent,
              color: running ? C.accent : "#fff",
              fontFamily:getFont("body"), fontSize:14, fontWeight:600,
            }}>
              {running ? t("timerPause") : t("timerStart")}
            </button>
          )}
          <button onClick={reset} style={{
            padding:"9px 13px", borderRadius:8, cursor:"pointer",
            border:`1px solid ${C.border}`, background:"transparent",
            color:C.sub, fontFamily:getFont("body"), fontSize:15,
          }}>↺</button>
        </div>
      </div>
      {!done && (
        <div style={{ marginTop:10, height:3, background:C.border, borderRadius:2, overflow:"hidden" }}>
          <div style={{ height:"100%", borderRadius:2, background:C.accent, width:`${pct}%`, transition:"width 1s linear" }} />
        </div>
      )}
    </div>
  );
}

// ─── HOME TAB ───────────────────────────────────────────────────────────────
function HomeTab({ setTab }) {
  const { C, t, lang, getFont } = useApp();
  const cards = [
    { icon:"⚖️", labelKey:"doughCalc",  subKey:"doughCalcSub",  tab:"calc"    },
    { icon:"🍕", labelKey:"pizzaCalc",  subKey:"pizzaCalcSub",  tab:"pizza"   },
    { icon:"📖", labelKey:"recipes",    subKey:"recipesSub",    tab:"recipes" },
    { icon:"🎓", labelKey:"guide",      subKey:"guideSub",      tab:"guide"   },
    { icon:"🔧", labelKey:"trouble",    subKey:"troubleSub",    tab:"trouble" },
    { icon:"🧫", labelKey:"starter",    subKey:"starterSub",    tab:"starter" },
  ];

  const diffRows = lang === "fa" ? [
    ["🫓","نان تخت",    "هر آردی. فقط تابه. ۳ دقیقه کار فعال.", 1],
    ["🍞","قالب کشتی",  "از فر استفاده می‌کند. خمیر چسبنده طبیعی است. ۵ دقیقه.", 2],
    ["🌾","چاودار",     "سنگین، محکم. نیاز به صبر دارد. ۱۰ دقیقه.", 3],
    ["🥖","گندم آزاد",  "بالاترین سطح مهارت. نیاز به تکنیک دارد.", 4],
  ] : [
    ["🫓","Flatbread","Any flour. Pan only. 3 min active work.",1],
    ["🍞","Loaf Pan","Uses oven. Sticky dough is correct. 5 min.",2],
    ["🌾","Rye Sourdough","Dense, hearty. Needs patience. 10 min.",3],
    ["🥖","Freestanding Wheat","The supreme discipline. Requires technique.",4],
  ];

  const bakerQuote = lang === "fa"
    ? "هیچ دستوری نیست که بتوانی کورکورانه دنبال کنی. همیشه باید با ابزارها و محیط محلی‌ات سازگار شوی."
    : "There is no recipe you can blindly follow. You will always have to adapt to your locally available tools and environment.";
  const bakerSource = lang === "fa" ? "— چارچوب خمیرترش" : "— The Sourdough Framework";

  return (
    <div style={{ padding:"0 16px 28px" }} className="fade-up">
      <p style={{ fontFamily:getFont("body"), fontSize:15, color:C.sub, fontStyle:"italic", marginBottom:24, lineHeight:1.6 }}>
        {t("taglineSub")}
      </p>
      <div style={{ fontFamily:getFont("body"), fontSize:14, color:C.faint, letterSpacing:1.8, textTransform:"uppercase", marginBottom:12 }}>{t("toolsSections")}</div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:28 }}>
        {cards.map(card => (
          <button key={card.tab} onClick={() => setTab(card.tab)} className="tab-btn"
            style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:16, padding:"16px 14px", textAlign:"left", cursor:"pointer", transition:"border-color 0.15s" }}
            onMouseEnter={e => e.currentTarget.style.borderColor = `${C.accent}66`}
            onMouseLeave={e => e.currentTarget.style.borderColor = C.border}
          >
            <div style={{ fontSize:28, marginBottom:8 }}>{card.icon}</div>
            <div style={{ fontFamily:getFont("serif"), fontSize:14, color:C.text, fontWeight:700, marginBottom:3 }}>{t(card.labelKey)}</div>
            <div style={{ fontFamily:getFont("body"), fontSize:14, color:C.sub, lineHeight:1.4 }}>{t(card.subKey)}</div>
          </button>
        ))}
      </div>
      <div style={{ fontFamily:getFont("body"), fontSize:14, color:C.faint, letterSpacing:1.8, textTransform:"uppercase", marginBottom:12 }}>{t("diffOverview")}</div>
      <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:16, overflow:"hidden", marginBottom:24 }}>
        {diffRows.map(([em,name,desc,d],i,arr) => (
          <div key={name} style={{ display:"flex", alignItems:"center", gap:12, padding:"13px 16px", borderBottom: i<arr.length-1 ? `1px solid ${C.border}` : "none" }}>
            <span style={{ fontSize:22 }}>{em}</span>
            <div style={{ flex:1 }}>
              <div style={{ fontFamily:getFont("serif"), fontSize:14, color:C.text, fontWeight:600 }}>{name}</div>
              <div style={{ fontFamily:getFont("body"), fontSize:14, color:C.sub, marginTop:2 }}>{desc}</div>
            </div>
            <DiffDots level={d} />
          </div>
        ))}
      </div>
      <div style={{ background:`${C.accent}0D`, border:`1px solid ${C.accent}28`, borderRadius:16, padding:"18px 20px" }}>
        <div style={{ fontFamily:getFont("body"), fontSize:14, color:C.accent, letterSpacing:1.8, textTransform:"uppercase", marginBottom:10 }}>{t("bakerPrinciple")}</div>
        <p style={{ fontFamily:getFont("serif"), fontSize:16, color:C.text, fontStyle:"italic", lineHeight:1.75 }}>
          "{bakerQuote}"
        </p>
        <p style={{ fontFamily:getFont("body"), fontSize:14, color:C.faint, marginTop:8 }}>{bakerSource}</p>
      </div>
      <PageFooter />
    </div>
  );
}

// ─── BREAD CALCULATOR ───────────────────────────────────────────────────────
function BreadCalc() {
  const { C, t, lang, getFont, num } = useApp();
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
  const [loaves,       setLoaves]       = useState(1);
  const [preset,       setPreset]       = useState("freestanding");

  const YEAST_DEFAULTS = { fresh:2.0, dry:0.5, instant:0.4 };
  const YEAST_RANGES   = { fresh:[0.5,5], dry:[0.2,2], instant:[0.1,1.5] };
  useEffect(() => { setYeastPct(YEAST_DEFAULTS[yeastType]); }, [yeastType]);

  const leavenPct = leavenType === "sourdough" ? starterPct : yeastPct;

  const dough = useMemo(() => {
    let flour;
    if (inputMode === "flour") {
      flour = flourPerLoaf * loaves;
    } else {
      flour = (totalWeight * loaves) / (1 + hydration/100 + leavenPct/100 + saltPct/100);
    }
    const water  = flour * hydration / 100;
    const leaven = flour * leavenPct / 100;
    const salt   = flour * saltPct / 100;
    const total  = flour + water + leaven + salt;
    const breadFlour = flour * (1 - wholeGrain/100);
    const wgFlour    = flour * wholeGrain / 100;
    return { flour, water, leaven, salt, total, breadFlour, wgFlour };
  }, [inputMode, flourPerLoaf, totalWeight, hydration, leavenPct, saltPct, wholeGrain, loaves]);

  const perLoaf = { flour:dough.flour/loaves, water:dough.water/loaves, leaven:dough.leaven/loaves, salt:dough.salt/loaves, total:dough.total/loaves, breadFlour:dough.breadFlour/loaves, wgFlour:dough.wgFlour/loaves };
  const show = loaves > 1 ? perLoaf : dough;
  const hLevel = getHydrationLevel(hydration, lang);

  const applyPreset = (id) => {
    setPreset(id);
    const p = PRESETS.find(x => x.id===id);
    if (p) { setHydration(p.hydration); setStarterPct(p.starter); setSaltPct(p.salt); setWholeGrain(p.wholeGrain); }
  };

  const leavenLabel = leavenType === "sourdough"
    ? `🧫 ${t("starterLabel")}: ${num(fmt(show.leaven))}g`
    : `🍺 ${yeastType==="fresh"?t("freshYeast"):yeastType==="dry"?t("dryYeast"):t("instantYeast")} ${t("yeastLabel")}: ${num(fmt(show.leaven))}g`;

  const getShoppingList = () => {
    const d = show;
    const lines = [
      `🍞 ${t("breadCalc")}${loaves>1 ? ` (×${loaves})` : ""}`,
      ``,
      wholeGrain>0 ? `🌾 ${t("breadFlour")}: ${num(fmt(d.breadFlour))}g` : `🌾 ${t("flour")}: ${num(fmt(d.flour))}g`,
      wholeGrain>0 ? `🌾 ${t("wgFlour")}: ${num(fmt(d.wgFlour))}g` : null,
      `💧 ${t("water")}: ${num(fmt(d.water))}g`,
      leavenLabel,
      `🧂 ${t("salt")}: ${num(fmt(d.salt))}g`,
      ``,
      `${t("total")}: ${num(fmt(d.total))}g`,
      `${t("hydration")}: ${num(hydration)}%`,
    ].filter(Boolean);
    return lines.join("\n");
  };

  return (
    <div>
      {/* Leavening type */}
      <div style={{ fontFamily:getFont("body"), fontSize:14, color:C.faint, letterSpacing:1.6, textTransform:"uppercase", marginBottom:10 }}>{t("leavening")}</div>
      <div style={{ display:"flex", background:C.card, borderRadius:12, padding:4, marginBottom:16, border:`1px solid ${C.border}` }}>
        {[["sourdough","sourdoughOpt","sourdoughSub"],["yeast","yeastOpt","yeastSub"]].map(([id,lKey,sKey]) => (
          <button key={id} onClick={() => setLeavenType(id)} style={{
            flex:1, padding:"10px 6px", borderRadius:9, border:"none", cursor:"pointer",
            background: leavenType===id ? C.accent : "transparent",
            color: leavenType===id ? "#fff" : C.sub,
            fontFamily:getFont("body"), fontSize:14, fontWeight:600, transition:"all 0.18s",
          }}>
            <div>{t(lKey)}</div>
            <div style={{ fontSize:14, fontWeight:400, marginTop:2, opacity:0.8 }}>{t(sKey)}</div>
          </button>
        ))}
      </div>

      {/* Yeast type sub-toggle */}
      {leavenType === "yeast" && (
        <div style={{ display:"flex", gap:8, marginBottom:16 }}>
          {[["fresh","freshYeast"],["dry","dryYeast"],["instant","instantYeast"]].map(([id,lKey]) => (
            <button key={id} onClick={() => setYeastType(id)} style={{
              flex:1, padding:"8px 4px", borderRadius:10, cursor:"pointer",
              border:`1px solid ${yeastType===id ? C.accent : C.border}`,
              background: yeastType===id ? `${C.accent}18` : "transparent",
              color: yeastType===id ? C.accent : C.sub,
              fontFamily:getFont("body"), fontSize:14, fontWeight:600,
            }}>{t(lKey)}</button>
          ))}
        </div>
      )}

      {/* Input mode */}
      <div style={{ display:"flex", gap:8, marginBottom:20 }}>
        {[["flour","byFlour"],["total","byTotal"]].map(([id,lKey]) => (
          <button key={id} onClick={() => setInputMode(id)} style={{
            flex:1, padding:"10px 6px", borderRadius:10, cursor:"pointer",
            border:`1px solid ${inputMode===id ? C.accent : C.border}`,
            background: inputMode===id ? `${C.accent}15` : "transparent",
            color: inputMode===id ? C.accent : C.sub, fontFamily:getFont("body"), fontSize:14,
          }}>{t(lKey)}</button>
        ))}
      </div>

      {/* Weight input */}
      <div style={{ marginBottom:20 }}>
        <div style={{ fontFamily:getFont("body"), fontSize:14, color:C.sub, marginBottom:8 }}>
          {inputMode==="flour" ? t("flourPerLoaf") : t("totalDoughWeight")}
        </div>
        <NumInput
          value={inputMode==="flour" ? flourPerLoaf : totalWeight}
          onChange={v => inputMode==="flour" ? setFlourPerLoaf(v) : setTotalWeight(v)}
          step={50} min={50}
        />
        {inputMode==="flour" && (
          <div style={{ display:"flex", gap:4, marginTop:8 }}>
            {[[100,"rolls"],[500,"standard"],[1000,"large"],[2000,"mega"]].map(([n,lKey]) => (
              <button key={n} onClick={() => setFlourPerLoaf(n)} style={{
                flex:1, padding:"6px 4px", borderRadius:8, border:`1px solid ${flourPerLoaf===n?C.accent:C.border}`,
                background: flourPerLoaf===n ? `${C.accent}20` : "transparent",
                color: flourPerLoaf===n ? C.accent : C.faint, fontFamily:getFont("body"), fontSize:14, cursor:"pointer", textAlign:"center",
              }}>{num(n)}g<br/><span style={{fontSize:14}}>{t(lKey)}</span></button>
            ))}
          </div>
        )}
      </div>

      {/* Presets */}
      <div style={{ fontFamily:getFont("body"), fontSize:14, color:C.faint, letterSpacing:1.6, textTransform:"uppercase", marginBottom:8 }}>{t("presets")}</div>
      <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:20 }}>
        {PRESETS.map(p => (
          <button key={p.id} onClick={() => applyPreset(p.id)} style={{
            padding:"7px 12px", borderRadius:20, cursor:"pointer",
            border:`1px solid ${preset===p.id ? C.accent : C.border}`,
            background: preset===p.id ? `${C.accent}20` : "transparent",
            color: preset===p.id ? C.accent : C.sub, fontFamily:getFont("body"), fontSize:14,
          }}>{lang==="fa" ? p.nameFa : p.nameEn}</button>
        ))}
      </div>

      {/* Sliders */}
      <div style={{ background:C.card, borderRadius:16, padding:"20px 18px", border:`1px solid ${C.border}`, marginBottom:16 }}>
        <Slider label={t("hydration")} value={hydration} onChange={setHydration} min={55} max={110}
          sublabel={`— ${hLevel.label}`}
        />
        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:18, marginTop:-8, padding:"8px 12px", background:`${hLevel.color}15`, borderRadius:8, border:`1px solid ${hLevel.color}30` }}>
          <span style={{ fontFamily:getFont("body"), fontSize:14, color:hLevel.color, fontWeight:600 }}>{hLevel.label}</span>
          <span style={{ fontFamily:getFont("body"), fontSize:14, color:C.sub }}>{hLevel.desc}</span>
        </div>
        {leavenType === "sourdough" ? (
          <Slider label={t("starterLabel")} value={starterPct} onChange={setStarterPct} min={5} max={30} />
        ) : (
          <Slider
            label={`${t("yeastLabel")} (${yeastType==="fresh"?t("freshYeast"):yeastType==="dry"?t("dryYeast"):t("instantYeast")})`}
            value={yeastPct} onChange={setYeastPct}
            min={YEAST_RANGES[yeastType][0]} max={YEAST_RANGES[yeastType][1]} step={0.05}
          />
        )}
        <Slider label={t("salt")} value={saltPct} onChange={setSaltPct} min={1.5} max={3} step={0.1} />
        <Slider label={t("wholeGrain")} value={wholeGrain} onChange={setWholeGrain} min={0} max={100}
          sublabel={t("ofTotalFlour")}
        />
      </div>

      {/* Loaves */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", background:C.card, border:`1px solid ${C.border}`, borderRadius:12, padding:"10px 16px", marginBottom:20 }}>
        <span style={{ fontFamily:getFont("body"), fontSize:15, color:C.text }}>{t("numLoaves")}</span>
        <div style={{ display:"flex", alignItems:"center", gap:16 }}>
          <button onClick={() => setLoaves(Math.max(1,loaves-1))} style={{ width:34,height:34,borderRadius:"50%",border:`1px solid ${C.border}`,background:"transparent",color:C.text,fontSize:20,cursor:"pointer",userSelect:"none" }}>−</button>
          <span style={{ fontFamily:getFont("serif"), fontSize:24, color:C.accent, fontWeight:700, minWidth:28, textAlign:"center" }}>{num(loaves)}</span>
          <button onClick={() => setLoaves(loaves+1)} style={{ width:34,height:34,borderRadius:"50%",border:`1px solid ${C.border}`,background:"transparent",color:C.text,fontSize:20,cursor:"pointer",userSelect:"none" }}>+</button>
        </div>
      </div>

      {/* Results */}
      <div style={{ background:C.resultBg, border:`1px solid ${C.accent}35`, borderRadius:20, padding:"20px 20px" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
          <span style={{ fontFamily:getFont("body"), fontSize:14, color:C.accent, textTransform:"uppercase", letterSpacing:1.5 }}>
            {loaves>1 ? `${t("perLoaf")} (×${num(loaves)})` : t("yourFormula")}
          </span>
          <div style={{ display:"flex", gap:8, alignItems:"center" }}>
            {loaves>1 && <span style={{ fontFamily:getFont("body"), fontSize:14, color:C.sub }}>{t("total")}: {num(fmt(dough.total))}g</span>}
            <CopyButton getText={getShoppingList} />
          </div>
        </div>

        {/* Flour rows */}
        {wholeGrain > 0 ? (
          <>
            <div style={{ display:"flex", justifyContent:"space-between", padding:"12px 0", borderBottom:`1px solid ${C.border}` }}>
              <div>
                <span style={{ fontFamily:getFont("body"), fontSize:15, color:C.text }}>🌾 {t("breadFlour")}</span>
                <span style={{ fontFamily:getFont("body"), fontSize:14, color:C.faint, marginLeft:8 }}>{num(100-wholeGrain)}%</span>
              </div>
              <span style={{ fontFamily:getFont("serif"), fontSize:17, color:C.text }}>{num(fmt(show.breadFlour))}g</span>
            </div>
            <div style={{ display:"flex", justifyContent:"space-between", padding:"12px 0", borderBottom:`1px solid ${C.border}` }}>
              <div>
                <span style={{ fontFamily:getFont("body"), fontSize:15, color:C.text }}>🌾 {t("wgFlour")}</span>
                <span style={{ fontFamily:getFont("body"), fontSize:14, color:C.faint, marginLeft:8 }}>{num(wholeGrain)}%</span>
              </div>
              <span style={{ fontFamily:getFont("serif"), fontSize:17, color:C.text }}>{num(fmt(show.wgFlour))}g</span>
            </div>
          </>
        ) : (
          <div style={{ display:"flex", justifyContent:"space-between", padding:"12px 0", borderBottom:`1px solid ${C.border}` }}>
            <div>
              <span style={{ fontFamily:getFont("body"), fontSize:15, color:C.text }}>🌾 {t("flour")}</span>
              <span style={{ fontFamily:getFont("body"), fontSize:14, color:C.faint, marginLeft:8 }}>100%</span>
            </div>
            <span style={{ fontFamily:getFont("serif"), fontSize:17, color:C.text }}>{num(fmt(show.flour))}g</span>
          </div>
        )}

        <div style={{ display:"flex", justifyContent:"space-between", padding:"12px 0", borderBottom:`1px solid ${C.border}` }}>
          <div>
            <span style={{ fontFamily:getFont("body"), fontSize:15, color:C.text }}>💧 {t("water")}</span>
            <span style={{ fontFamily:getFont("body"), fontSize:14, color:C.faint, marginLeft:8 }}>{num(hydration)}%</span>
          </div>
          <span style={{ fontFamily:getFont("serif"), fontSize:17, color:C.text }}>{num(fmt(show.water))}g</span>
        </div>

        {/* Leavening row */}
        <div style={{ padding:"12px 0", borderBottom:`1px solid ${C.border}` }}>
          {leavenType === "sourdough" ? (
            <div style={{ display:"flex", justifyContent:"space-between" }}>
              <div>
                <span style={{ fontFamily:getFont("body"), fontSize:15, color:C.text }}>🧫 {t("starterLabel")}</span>
                <span style={{ fontFamily:getFont("body"), fontSize:14, color:C.faint, marginLeft:8 }}>{num(starterPct)}%</span>
              </div>
              <span style={{ fontFamily:getFont("serif"), fontSize:17, color:C.text }}>{num(fmt(show.leaven))}g</span>
            </div>
          ) : (
            <>
              <div style={{ display:"flex", justifyContent:"space-between" }}>
                <div>
                  <span style={{ fontFamily:getFont("body"), fontSize:15, color:C.text }}>🍺 {yeastType==="fresh"?t("freshYeast"):yeastType==="dry"?t("dryYeast"):t("instantYeast")} {t("yeastLabel")}</span>
                  <span style={{ fontFamily:getFont("body"), fontSize:14, color:C.faint, marginLeft:8 }}>{num(yeastPct)}%</span>
                </div>
                <span style={{ fontFamily:getFont("serif"), fontSize:17, color:C.text }}>{num(fmt(show.leaven))}g</span>
              </div>
              {yeastType==="fresh" && (
                <div style={{ display:"flex", justifyContent:"space-between", marginTop:4 }}>
                  <span style={{ fontFamily:getFont("body"), fontSize:14, color:C.faint, marginLeft:4 }}>
                    ≈ {t("activeDry")}: {num(fmt2(show.flour * 0.0050 * (yeastPct/2)))}g  /  {t("instant")}: {num(fmt2(show.flour * 0.0040 * (yeastPct/2)))}g
                  </span>
                </div>
              )}
            </>
          )}
        </div>

        <div style={{ display:"flex", justifyContent:"space-between", padding:"12px 0", borderBottom:`1px solid ${C.border}` }}>
          <div>
            <span style={{ fontFamily:getFont("body"), fontSize:15, color:C.text }}>🧂 {t("salt")}</span>
            <span style={{ fontFamily:getFont("body"), fontSize:14, color:C.faint, marginLeft:8 }}>{num(saltPct)}%</span>
          </div>
          <span style={{ fontFamily:getFont("serif"), fontSize:17, color:C.text }}>{num(fmt(show.salt))}g</span>
        </div>

        <div style={{ paddingTop:16, marginTop:4, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <span style={{ fontFamily:getFont("body"), fontSize:15, color:C.accent }}>{t("total")}</span>
          <span style={{ fontFamily:getFont("serif"), fontSize:24, color:C.accent, fontWeight:700 }}>{num(fmt(show.total))}g</span>
        </div>
        <div style={{ marginTop:8, fontFamily:getFont("body"), fontSize:14, color:C.faint, fontStyle:"italic", textAlign:"right" }}>
          {getWeightFun(loaves>1 ? dough.total : show.total, lang)}
        </div>
      </div>

      {/* Hydration reference */}
      <div style={{ marginTop:18, background:C.card, border:`1px solid ${C.border}`, borderRadius:14, overflow:"hidden" }}>
        <div style={{ padding:"12px 16px", borderBottom:`1px solid ${C.border}` }}>
          <span style={{ fontFamily:getFont("body"), fontSize:14, color:C.faint, letterSpacing:1.5, textTransform:"uppercase" }}>{t("hydGuide")}</span>
        </div>
        {HYDRATION_LEVELS.map(l => {
          const label = lang==="fa" ? l.labelFa : l.label;
          const desc  = lang==="fa" ? l.descFa  : l.desc;
          return (
            <div key={l.label} style={{ display:"flex", gap:12, alignItems:"center", padding:"10px 16px", borderBottom:`1px solid ${C.border}`, background: hydration>=l.range[0]&&hydration<=l.range[1] ? `${l.color}12` : "transparent" }}>
              <span style={{ fontFamily:getFont("body"), fontSize:14, color:l.color, fontWeight:600, minWidth:100 }}>{num(l.range[0])}–{num(l.range[1])}%  {label}</span>
              <span style={{ fontFamily:getFont("body"), fontSize:14, color:C.sub }}>{desc}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── PIZZA CALCULATOR ───────────────────────────────────────────────────────
function PizzaCalc() {
  const { C, t, lang, getFont, num } = useApp();
  const [doughType,    setDoughType]    = useState("yeast");
  const [ovenType,     setOvenType]     = useState("home");
  const [pizzaCount,   setPizzaCount]   = useState(4);
  const [ballWeight,   setBallWeight]   = useState(270);
  const [hydration,    setHydration]    = useState(60);
  const [showToppings, setShowToppings] = useState(false);

  const oven = PIZZA_OVENS.find(o => o.id === ovenType);
  useEffect(() => { setBallWeight(PIZZA_OVENS.find(o=>o.id===ovenType)?.defaultWeight||270); }, [ovenType]);

  const pizza = useMemo(() => {
    const totalDough = pizzaCount * ballWeight;
    const yeastPct   = doughType==="yeast" ? 0.15 : 5;
    const saltPct    = 2;
    const starterOrYeast = yeastPct / 100;
    const flour  = totalDough / (1 + hydration/100 + saltPct/100 + starterOrYeast);
    const water  = flour * hydration / 100;
    const salt   = flour * saltPct  / 100;
    const yeast    = flour * 0.0015;
    const yeastDry = flour * 0.0005;
    const starter  = flour * 0.05;
    const mozzarella   = 80 * pizzaCount;
    const tomatoSauce  = 60 * pizzaCount;
    const oliveOil     = 6  * pizzaCount;
    const basil        = 10 * pizzaCount;
    const basilPots    = Math.ceil(basil / 80);
    return { totalDough, flour, water, salt, yeast, yeastDry, starter, mozzarella, tomatoSauce, oliveOil, basil, basilPots };
  }, [pizzaCount, ballWeight, hydration, doughType]);

  const hLevel = getHydrationLevel(hydration, lang);

  const getShoppingList = () => {
    const lines = [
      `🍕 ${t("pizzaCalcTitle")} — ${num(pizzaCount)} ${lang==="fa"?"پیتزا":"pizza"}${pizzaCount>1&&lang!=="fa"?"s":""}`,
      ``,
      `🌾 ${lang==="fa"?"آرد (نان یا ۰۰)":"Flour (bread or 00)"}: ${num(fmt(pizza.flour))}g`,
      `💧 ${t("water")}: ${num(fmt(pizza.water))}g`,
      `🧂 ${t("salt")}: ${num(fmt(pizza.salt))}g`,
      doughType==="yeast"
        ? `🍺 ${t("freshYeastLabel")}: ${num(fmt2(pizza.yeast))}g  (${t("orDryYeast")}: ${num(fmt2(pizza.yeastDry))}g)`
        : `🧫 ${t("activeStarter")}: ${num(fmt(pizza.starter))}g`,
    ].filter(Boolean);
    return lines.join("\n");
  };

  const partyMsg = pizzaCount===1?t("soloMode"):pizzaCount===2?t("dateNight"):pizzaCount<=4?t("pizzaParty"):pizzaCount<=8?t("bigGathering"):t("fullBakery");

  const pizzaTips = lang === "fa" ? [
    ["🕐","تخمیر آهسته سلاح مخفی شماست","مخمر کم یا خمیرترش + تخمیر طولانی و سرد طعم و کشسانی را به طور چشمگیری بهبود می‌دهد."],
    ["🌡️","حرارت بالا ضروری است","تا حد امکان داغ پیش‌گرم کنید. سنگ یا صفحه فولادی پیتزا روی طبقه بالایی ایده‌آل است."],
    ["🤌","با توپینگ‌ها کمتر بیشتر است","چند ماده باکیفیت همیشه از انبوهی از توپینگ‌ها بهتر است."],
  ] : [
    ["🕐","Slow fermentation is your secret weapon","Low yeast or sourdough + long, cold rise dramatically improves flavor and stretch."],
    ["🌡️","High heat is essential","Preheat as hot as possible. A pizza stone or steel baking on top rack is ideal."],
    ["🤌","Less is more with toppings","A few quality ingredients beat a mountain of toppings every time."],
  ];

  return (
    <div>
      <div style={{ fontFamily:getFont("body"), fontSize:14, color:C.faint, letterSpacing:1.6, textTransform:"uppercase", marginBottom:10 }}>{t("doughType")}</div>
      <div style={{ display:"flex", background:C.card, borderRadius:12, padding:4, marginBottom:20, border:`1px solid ${C.border}` }}>
        {[["yeast","yeastPizza","yeastPizzaSub"],["sourdough","sourdoughPizza","sourdoughPizzaSub"]].map(([id,lKey,sKey]) => (
          <button key={id} onClick={() => setDoughType(id)} style={{
            flex:1, padding:"10px 6px", borderRadius:9, border:"none", cursor:"pointer",
            background: doughType===id ? C.accent : "transparent",
            color: doughType===id ? "#fff" : C.sub,
            fontFamily:getFont("body"), fontSize:14, fontWeight:600, transition:"all 0.18s",
          }}>
            <div>{t(lKey)}</div>
            <div style={{ fontSize:14, fontWeight:400, marginTop:2, opacity:0.8 }}>{t(sKey)}</div>
          </button>
        ))}
      </div>

      <div style={{ fontFamily:getFont("body"), fontSize:14, color:C.faint, letterSpacing:1.6, textTransform:"uppercase", marginBottom:10 }}>{t("yourOven")}</div>
      <div style={{ display:"flex", gap:8, marginBottom:12 }}>
        {PIZZA_OVENS.map(o => (
          <button key={o.id} onClick={() => setOvenType(o.id)} style={{
            flex:1, padding:"10px 6px", borderRadius:12, cursor:"pointer", textAlign:"center",
            border:`1px solid ${ovenType===o.id ? C.accent : C.border}`,
            background: ovenType===o.id ? `${C.accent}18` : C.card,
            color: ovenType===o.id ? C.accent : C.sub, fontFamily:getFont("body"), fontSize:14, lineHeight:1.4,
          }}>{lang==="fa"?o.nameFa:o.nameEn}<br/><span style={{ fontSize:14, color:C.faint }}>{o.temp}</span></button>
        ))}
      </div>
      <div style={{ fontFamily:getFont("body"), fontSize:14, color:C.sub, fontStyle:"italic", marginBottom:20, padding:"10px 14px", background:`${C.accent}0A`, borderRadius:10, border:`1px solid ${C.accent}20` }}>
        💡 {lang==="fa" ? oven?.tipFa : oven?.tip}
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 2fr", gap:25, marginBottom:20 }}>
        <div>
          <div style={{ fontFamily:getFont("body"), fontSize:14, color:C.sub, marginBottom:8 }}>{t("pizzas")}</div>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", background:C.card, border:`1px solid ${C.border}`, borderRadius:12, padding:"10px 12px" }}>
            <button onClick={() => setPizzaCount(Math.max(1,pizzaCount-1))} style={{ background:"transparent", border:"none", color:C.sub, fontSize:22, cursor:"pointer", userSelect:"none" }}>−</button>
            <span style={{ fontFamily:getFont("serif"), fontSize:26, color:C.accent, fontWeight:700 }}>{num(pizzaCount)}</span>
            <button onClick={() => setPizzaCount(Math.min(20,pizzaCount+1))} style={{ background:"transparent", border:"none", color:C.sub, fontSize:22, cursor:"pointer", userSelect:"none" }}>+</button>
          </div>
          <div style={{ fontFamily:getFont("body"), fontSize:14, color:C.faint, marginTop:5, textAlign:"center" }}>{partyMsg}</div>
        </div>
        <div style={{ minWidth:0 }}>
          <div style={{ fontFamily:getFont("body"), fontSize:14, color:C.sub, marginBottom:8 }}>{t("gramsPerPizza")}</div>
          <NumInput value={ballWeight} onChange={setBallWeight} step={10} min={150} unit="g" />
          <div style={{ fontFamily:getFont("body"), fontSize:14, color:C.faint, marginTop:5, textAlign:"center" }}>
            {ovenType==="home" ? t("homeFor") : t("proFor")}
          </div>
        </div>
      </div>

      <div style={{ background:C.card, borderRadius:16, padding:"20px 18px", border:`1px solid ${C.border}`, marginBottom:20 }}>
        <Slider label={t("hydration")} value={hydration} onChange={setHydration} min={55} max={75} sublabel={`— ${hLevel.label}`} />
        <div style={{ display:"flex", alignItems:"center", gap:10, marginTop:-8, padding:"8px 12px", background:`${hLevel.color}15`, borderRadius:8, border:`1px solid ${hLevel.color}30` }}>
          <span style={{ fontFamily:getFont("body"), fontSize:14, color:hLevel.color, fontWeight:600 }}>{hLevel.label}</span>
          <span style={{ fontFamily:getFont("body"), fontSize:14, color:C.sub }}>{hLevel.desc}</span>
        </div>
      </div>

      <div style={{ background:C.resultBg, border:`1px solid ${C.accent}35`, borderRadius:20, padding:"20px" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
          <span style={{ fontFamily:getFont("body"), fontSize:14, color:C.accent, textTransform:"uppercase", letterSpacing:1.5 }}>
            {num(pizzaCount)} {lang==="fa"?"پیتزا":"Pizza"}{pizzaCount>1&&lang!=="fa"?"s":""} — {num(fmt(pizza.totalDough))}g {t("totalDough")}
          </span>
          <CopyButton getText={getShoppingList} />
        </div>
        {[
          [`🌾 ${lang==="fa"?"آرد (نان یا ۰۰)":"Flour (bread or 00)"}`, `${num(fmt(pizza.flour))}g`],
          [`💧 ${t("water")}`,  `${num(fmt(pizza.water))}g`],
          [`🧂 ${t("salt")}`,   `${num(fmt(pizza.salt))}g`],
        ].map(([lbl,val]) => (
          <div key={lbl} style={{ display:"flex", justifyContent:"space-between", padding:"11px 0", borderBottom:`1px solid ${C.border}` }}>
            <span style={{ fontFamily:getFont("body"), fontSize:15, color:C.text }}>{lbl}</span>
            <span style={{ fontFamily:getFont("serif"), fontSize:17, color:C.text }}>{val}</span>
          </div>
        ))}
        {doughType==="yeast" ? (
          <div style={{ padding:"11px 0", borderBottom:`1px solid ${C.border}` }}>
            <div style={{ display:"flex", justifyContent:"space-between" }}>
              <span style={{ fontFamily:getFont("body"), fontSize:15, color:C.text }}>🍺 {t("freshYeastLabel")}</span>
              <span style={{ fontFamily:getFont("serif"), fontSize:17, color:C.text }}>{num(fmt2(pizza.yeast))}g</span>
            </div>
            <div style={{ display:"flex", justifyContent:"space-between", marginTop:4 }}>
              <span style={{ fontFamily:getFont("body"), fontSize:14, color:C.faint }}>  {t("orDryYeast")}</span>
              <span style={{ fontFamily:getFont("body"), fontSize:14, color:C.faint }}>{num(fmt2(pizza.yeastDry))}g</span>
            </div>
          </div>
        ) : (
          <div style={{ display:"flex", justifyContent:"space-between", padding:"11px 0", borderBottom:`1px solid ${C.border}` }}>
            <span style={{ fontFamily:getFont("body"), fontSize:15, color:C.text }}>🧫 {t("activeStarter")}</span>
            <span style={{ fontFamily:getFont("serif"), fontSize:17, color:C.text }}>{num(fmt(pizza.starter))}g</span>
          </div>
        )}
        <div style={{ paddingTop:14, display:"flex", justifyContent:"space-between" }}>
          <span style={{ fontFamily:getFont("body"), fontSize:15, color:C.accent }}>{t("totalDough")}</span>
          <span style={{ fontFamily:getFont("serif"), fontSize:22, color:C.accent, fontWeight:700 }}>{num(fmt(pizza.totalDough))}g</span>
        </div>
      </div>

      {/* Toppings */}
      <div style={{ marginTop:16, background:C.card, border:`1px solid ${C.border}`, borderRadius:16, overflow:"hidden" }}>
        <button onClick={() => setShowToppings(!showToppings)} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", width:"100%", padding:"14px 16px", background:"transparent", border:"none", cursor:"pointer" }}>
          <span style={{ fontFamily:getFont("serif"), fontSize:16, color:C.text, fontWeight:600 }}>{t("toppingsBtn")}</span>
          <span style={{ color:C.faint, fontSize:18, transform: showToppings?"rotate(90deg)":"none", transition:"transform 0.2s" }}>›</span>
        </button>
        {showToppings && (
          <div style={{ borderTop:`1px solid ${C.border}`, padding:"14px 16px" }}>
            {[
              [`🧀 ${lang==="fa"?"موتزارلا":"Mozzarella"}`,    `${num(pizza.mozzarella)}g`],
              [`🍅 ${lang==="fa"?"سس گوجه":"Tomato sauce"}`,   `${num(pizza.tomatoSauce)}g`],
              [`🫒 ${lang==="fa"?"روغن زیتون":"Olive oil"}`,   `${num(pizza.oliveOil)}ml`],
              [`🌿 ${lang==="fa"?"ریحان":"Basil leaves"}`,     `${num(pizza.basil)}g  (≈ ${num(pizza.basilPots)} ${lang==="fa"?"گلدان":"pot"}${pizza.basilPots>1&&lang!=="fa"?"s":""})`],
            ].map(([lbl,val]) => (
              <div key={lbl} style={{ display:"flex", justifyContent:"space-between", marginBottom:10 }}>
                <span style={{ fontFamily:getFont("body"), fontSize:15, color:C.text }}>{lbl}</span>
                <span style={{ fontFamily:getFont("serif"), fontSize:15, color:C.text }}>{val}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pizza tips */}
      <div style={{ marginTop:16, background:`${C.accent}0D`, border:`1px solid ${C.accent}28`, borderRadius:16, padding:"16px" }}>
        <div style={{ fontFamily:getFont("body"), fontSize:14, color:C.accent, textTransform:"uppercase", letterSpacing:1.5, marginBottom:12 }}>{t("proTips")}</div>
        {pizzaTips.map(([icon,title,body]) => (
          <div key={title} style={{ display:"flex", gap:12, marginBottom:12 }}>
            <span style={{ fontSize:20, flexShrink:0 }}>{icon}</span>
            <div>
              <div style={{ fontFamily:getFont("body"), fontSize:14, color:C.text, fontWeight:600, marginBottom:3 }}>{title}</div>
              <div style={{ fontFamily:getFont("body"), fontSize:14, color:C.sub, lineHeight:1.55 }}>{body}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── STARTER CALCULATOR ─────────────────────────────────────────────────────
function StarterCalc() {
  const { C, t, lang, getFont, num } = useApp();
  const [targetStarter, setTargetStarter] = useState(200);
  const [feedRatio,     setFeedRatio]     = useState(1);

  const starterCalc = useMemo(() => {
    const r = FEED_RATIOS[feedRatio];
    const parts = r.seed + r.flour + r.water;
    return { seed: targetStarter*r.seed/parts, flour: targetStarter*r.flour/parts, water: targetStarter*r.water/parts };
  }, [targetStarter, feedRatio]);

  const getShoppingList = () => [
    `🧫 ${t("starterTitle")}`,
    ``,
    `${t("seedStarter")}: ${num(fmt(starterCalc.seed))}g`,
    `${t("freshFlour")}: ${num(fmt(starterCalc.flour))}g`,
    `${t("freshWater")}: ${num(fmt(starterCalc.water))}g`,
    ``,
    `${lang==="fa"?"نسبت":"Ratio"}: ${FEED_RATIOS[feedRatio].label}`,
    `${t("readyStarter")}: ${num(fmt(targetStarter))}g`,
  ].join("\n");

  const ratioDescs = FEED_RATIO_DESCS.map(k => t(k));

  return (
    <div>
      <SectionTitle title={t("starterTitle")} sub={t("starterSub2")} />
      <div style={{ fontFamily:getFont("body"), fontSize:14, color:C.sub, marginBottom:8 }}>{t("howMuchStarter")}</div>
      <div style={{ marginBottom:24 }}>
        <NumInput value={targetStarter} onChange={setTargetStarter} step={10} min={10} />
      </div>
      <div style={{ fontFamily:getFont("body"), fontSize:14, color:C.faint, letterSpacing:1.6, textTransform:"uppercase", marginBottom:10 }}>{t("feedingRatio")}</div>
      <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:24 }}>
        {FEED_RATIOS.map((r,i) => (
          <button key={r.label} onClick={() => setFeedRatio(i)} style={{
            padding:"8px 14px", borderRadius:20, cursor:"pointer",
            border:`1px solid ${feedRatio===i ? C.accent : C.border}`,
            background: feedRatio===i ? `${C.accent}20` : "transparent",
            color: feedRatio===i ? C.accent : C.sub, fontFamily:getFont("body"), fontSize:14,
          }}>{r.label}</button>
        ))}
      </div>

      <div style={{ background:C.resultBg, border:`1px solid ${C.accent}35`, borderRadius:20, padding:"20px", marginBottom:20 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
          <span style={{ fontFamily:getFont("body"), fontSize:14, color:C.accent, textTransform:"uppercase", letterSpacing:1.5 }}>{t("feedingFormula")}</span>
          <CopyButton getText={getShoppingList} />
        </div>
        {[
          [t("seedStarter"), starterCalc.seed],
          [t("freshFlour"),  starterCalc.flour],
          [t("freshWater"),  starterCalc.water],
        ].map(([label,val], i, arr) => (
          <div key={label} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"12px 0", borderBottom: i<arr.length-1 ? `1px solid ${C.border}` : "none" }}>
            <span style={{ fontFamily:getFont("body"), fontSize:16, color:C.text }}>{label}</span>
            <span style={{ fontFamily:getFont("serif"), fontSize:18, color:C.text }}>{num(fmt(val))}g</span>
          </div>
        ))}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", paddingTop:16, marginTop:8, borderTop:`1px solid ${C.accent}30` }}>
          <span style={{ fontFamily:getFont("body"), fontSize:16, color:C.accent }}>{t("readyStarter")}</span>
          <span style={{ fontFamily:getFont("serif"), fontSize:24, color:C.accent, fontWeight:700 }}>{num(fmt(targetStarter))}g</span>
        </div>
      </div>

      <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:16, padding:"16px 18px" }}>
        <div style={{ fontFamily:getFont("body"), fontSize:14, color:C.faint, letterSpacing:1.5, textTransform:"uppercase", marginBottom:14 }}>{t("ratioRef")}</div>
        {FEED_RATIOS.map((r,i) => (
          <div key={r.label} style={{ display:"flex", gap:12, marginBottom:10 }}>
            <span style={{ fontFamily:getFont("body"), fontSize:14, color:C.accent, minWidth:56, fontWeight:600 }}>{r.label}</span>
            <span style={{ fontFamily:getFont("body"), fontSize:14, color:C.sub }}>{ratioDescs[i]}</span>
          </div>
        ))}
        <div style={{ marginTop:14, paddingTop:14, borderTop:`1px solid ${C.border}`, fontFamily:getFont("body"), fontSize:14, color:C.sub, lineHeight:1.6, fontStyle:"italic" }}>
          {t("starterRatioTip")}
        </div>
      </div>
    </div>
  );
}

// ─── CALC TAB ────────────────────────────────────────────────────────────────
function CalcTab({ initialMode }) {
  const { C, t, getFont } = useApp();
  const [mode, setMode] = useState(initialMode || "bread");
  const modes = [["bread",`⚖️ ${t("breadCalc")}`],["pizza",`🍕 ${t("pizzaCalcTitle")}`],["starter",`🧫 ${t("starterTitle")}`]];
  return (
    <div style={{ padding:"0 16px 24px" }} className="fade-up">
      <div style={{ display:"flex", background:C.card, borderRadius:14, padding:4, marginBottom:24, border:`1px solid ${C.border}` }}>
        {modes.map(([id,lbl]) => (
          <button key={id} onClick={() => setMode(id)} style={{
            flex:1, padding:"10px 4px", borderRadius:11, border:"none", cursor:"pointer",
            fontFamily:getFont("body"), fontSize:14, fontWeight:600,
            background: mode===id ? C.accent : "transparent",
            color: mode===id ? "#fff" : C.sub, transition:"all 0.18s",
          }}>{lbl}</button>
        ))}
      </div>
      {mode==="bread"   && <BreadCalc />}
      {mode==="pizza"   && <PizzaCalc />}
      {mode==="starter" && <StarterCalc />}
      <PageFooter />
    </div>
  );
}

// ─── RECIPES TAB ─────────────────────────────────────────────────────────────
function RecipesTab() {
  const { C, t, lang, getFont, num } = useApp();
  const [selected, setSelected] = useState(null);
  const [scale,    setScale]    = useState(1);

  if (selected) {
    const r = RECIPES.find(x => x.id===selected);
    const isFa = lang === "fa";
    const s = g => num(fmt(g * scale));
    const rName     = isFa ? r.nameFa     : r.name;
    const rSub      = isFa ? r.subFa      : r.sub;
    const rDiffLbl  = isFa ? r.diffLabelFa: r.diffLabel;
    const rWorkTime = isFa ? r.workTimeFa : r.workTime;
    const rTotalTime= isFa ? r.totalTimeFa: r.totalTime;
    const rTips     = isFa ? r.tipsFa     : r.tips;

    return (
      <div style={{ padding:"0 16px 32px" }} className="fade-up">
        <button onClick={() => { setSelected(null); setScale(1); }} style={{ display:"flex", alignItems:"center", gap:6, background:"transparent", border:"none", color:C.sub, fontFamily:getFont("body"), fontSize:15, cursor:"pointer", marginBottom:20, padding:0 }}>
          {t("allRecipes")}
        </button>
        <div style={{ marginBottom:22 }}>
          <div style={{ fontSize:50, marginBottom:10 }}>{r.emoji}</div>
          <h2 style={{ fontFamily:getFont("serif"), fontSize:26, fontWeight:700, color:C.text, lineHeight:1.2 }}>{rName}</h2>
          <p style={{ fontFamily:getFont("body"), fontSize:15, color:C.sub, fontStyle:"italic", marginTop:4 }}>{rSub}</p>
          <div style={{ display:"flex", gap:8, marginTop:12, flexWrap:"wrap" }}>
            <DiffDots level={r.difficulty} />
            <Pill>{rDiffLbl}</Pill>
            <Pill color={C.sub}>⏱ {rTotalTime}</Pill>
            <Pill color={C.blue}>💧 {num(r.hydration)}%</Pill>
          </div>
        </div>
        <div style={{ background:C.card, borderRadius:12, padding:"10px 14px", marginBottom:22, border:`1px solid ${C.border}`, display:"flex", alignItems:"center", gap:10, flexWrap:"wrap" }}>
          <span style={{ fontFamily:getFont("body"), fontSize:14, color:C.sub }}>{t("scale")}</span>
          <div style={{ display:"flex", gap:6 }}>
            {[0.5,1,1.5,2,3].map(sv => (
              <button key={sv} onClick={() => setScale(sv)} style={{ padding:"6px 11px", borderRadius:8, cursor:"pointer", border:`1px solid ${scale===sv?C.accent:C.border}`, background: scale===sv?`${C.accent}22`:"transparent", color: scale===sv?C.accent:C.sub, fontFamily:getFont("body"), fontSize:14 }}>{num(sv)}×</button>
            ))}
          </div>
        </div>
        <div style={{ fontFamily:getFont("body"), fontSize:14, color:C.faint, letterSpacing:1.5, textTransform:"uppercase", marginBottom:10 }}>{t("ingredients")}</div>
        <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:16, overflow:"hidden", marginBottom:24 }}>
          {r.ingredients.map((ing, i) => (
            <div key={i} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"12px 16px", borderBottom: i<r.ingredients.length-1?`1px solid ${C.border}`:"none" }}>
              <span style={{ fontFamily:getFont("body"), fontSize:15, color:C.text }}>{isFa ? ing.nameFa : ing.name}</span>
              <span style={{ fontFamily:getFont("serif"), fontSize:15, color:C.accent, fontWeight:600, whiteSpace:"nowrap", marginLeft:12 }}>
                {ing.unit ? `${s(ing.amount)}${ing.unit}` : num(ing.amount)}
              </span>
            </div>
          ))}
        </div>
        <div style={{ fontFamily:getFont("body"), fontSize:14, color:C.faint, letterSpacing:1.5, textTransform:"uppercase", marginBottom:10 }}>{t("steps")}</div>
        {r.steps.map((step, i) => {
          const stepTitle = isFa ? step[2] : step[0];
          const stepBody  = isFa ? step[3] : step[1];
          return (
            <div key={i} style={{ display:"flex", gap:14, marginBottom:20 }}>
              <div style={{ width:28, height:28, borderRadius:"50%", background:C.accent, color:"#fff", fontSize:14, fontWeight:700, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, marginTop:1 }}>{num(i+1)}</div>
              <div>
                <div style={{ fontFamily:getFont("serif"), fontSize:16, color:C.text, fontWeight:700, marginBottom:4 }}>{stepTitle}</div>
                <div style={{ fontFamily:getFont("body"), fontSize:14, color:C.sub, lineHeight:1.65 }}>{stepBody}</div>
              </div>
            </div>
          );
        })}
        <div style={{ fontFamily:getFont("body"), fontSize:14, color:C.faint, letterSpacing:1.5, textTransform:"uppercase", marginBottom:10 }}>{t("proTips")}</div>
        <div style={{ background:`${C.accent}0D`, border:`1px solid ${C.accent}28`, borderRadius:16, padding:"16px 18px" }}>
          {rTips.map((tip, i) => (
            <div key={i} style={{ display:"flex", gap:10, marginBottom: i<rTips.length-1?12:0 }}>
              <span style={{ color:C.accent, fontSize:16, flexShrink:0 }}>✦</span>
              <span style={{ fontFamily:getFont("body"), fontSize:14, color:C.sub, lineHeight:1.6 }}>{tip}</span>
            </div>
          ))}
        </div>
        <PageFooter />
      </div>
    );
  }

  return (
    <div style={{ padding:"0 16px 28px" }} className="fade-up">
      <SectionTitle title={t("recipesTitle")} sub={t("recipesSub2")} />
      {RECIPES.map(r => {
        const isFa = lang === "fa";
        const rName     = isFa ? r.nameFa      : r.name;
        const rSub      = isFa ? r.subFa       : r.sub;
        const rDiffLbl  = isFa ? r.diffLabelFa : r.diffLabel;
        const rTotalTime= isFa ? r.totalTimeFa : r.totalTime;
        return (
          <button key={r.id} onClick={() => setSelected(r.id)} style={{ display:"block", width:"100%", textAlign:"left", cursor:"pointer", background:C.card, border:`1px solid ${C.border}`, borderRadius:18, padding:"16px 18px", marginBottom:12 }}
            onMouseEnter={e => e.currentTarget.style.borderColor=`${C.accent}55`}
            onMouseLeave={e => e.currentTarget.style.borderColor=C.border}
          >
            <div style={{ display:"flex", gap:14, alignItems:"center" }}>
              <span style={{ fontSize:36 }}>{r.emoji}</span>
              <div style={{ flex:1 }}>
                <div style={{ fontFamily:getFont("serif"), fontSize:17, color:C.text, fontWeight:700 }}>{rName}</div>
                <div style={{ fontFamily:getFont("body"), fontSize:14, color:C.sub, fontStyle:"italic", marginTop:2 }}>{rSub}</div>
                <div style={{ display:"flex", gap:8, marginTop:8, flexWrap:"wrap" }}>
                  <DiffDots level={r.difficulty} />
                  <Pill small>{rDiffLbl}</Pill>
                  <Pill small color={C.sub}>⏱ {rTotalTime}</Pill>
                  <Pill small color={C.blue}>💧 {num(r.hydration)}%</Pill>
                </div>
              </div>
              <span style={{ color:C.faint, fontSize:22 }}>›</span>
            </div>
          </button>
        );
      })}
      <PageFooter />
    </div>
  );
}

// ─── GUIDE TAB ───────────────────────────────────────────────────────────────
function GuideTab() {
  const { C, t, lang, getFont, num } = useApp();
  const [open, setOpen] = useState(1);
  const isFa = lang === "fa";

  const bakersRows = isFa ? [
    ["آبیاری",   "آب ÷ آرد × ۱۰۰",     "معمولاً ۶۵–۸۵٪"],
    ["استارتر",  "استارتر ÷ آرد × ۱۰۰", "معمولاً ۱۰–۲۰٪"],
    ["نمک",      "نمک ÷ آرد × ۱۰۰",     "معمولاً ۱٫۸–۲٫۲٪"],
  ] : [
    ["Hydration",   "Water ÷ Flour × 100",     "Typically 65–85%"],
    ["Starter",     "Starter ÷ Flour × 100",   "Typically 10–20%"],
    ["Salt",        "Salt ÷ Flour × 100",      "Typically 1.8–2.2%"],
  ];

  return (
    <div style={{ padding:"0 16px 28px" }} className="fade-up">
      <SectionTitle title={t("guideTitle")} sub={t("guideSub2")} />
      {GUIDE.map((step) => {
        const phase  = isFa ? step.phaseFa  : step.phase;
        const title  = isFa ? step.titleFa  : step.title;
        const body   = isFa ? step.bodyFa   : step.body;
        const checks = isFa ? step.checksFa : step.checks;
        const tip    = isFa ? step.tipFa    : step.tip;
        const timers = isFa ? step.timersFa : step.timers;
        return (
          <div key={step.id} style={{ marginBottom:10 }}>
            <button onClick={() => setOpen(open===step.id?null:step.id)} style={{ display:"block", width:"100%", textAlign:"left", cursor:"pointer", background:C.card, border:`1px solid ${open===step.id?step.color:C.border}`, borderRadius: open===step.id?"16px 16px 0 0":16, padding:"14px 16px" }}>
              <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                <div style={{ width:32, height:32, borderRadius:"50%", background:`${step.color}30`, border:`1px solid ${step.color}60`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:16 }}>{step.emoji}</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontFamily:getFont("body"), fontSize:14, color:step.color, textTransform:"uppercase", letterSpacing:1.2, marginBottom:2 }}>{phase}</div>
                  <div style={{ fontFamily:getFont("serif"), fontSize:15, color:C.text, fontWeight:700 }}>{title}</div>
                </div>
                <span style={{ color:C.faint, fontSize:18, transform:open===step.id?"rotate(90deg)":"none", transition:"transform 0.2s" }}>›</span>
              </div>
            </button>
            {open===step.id && (
              <div style={{ background:`${step.color}0A`, border:`1px solid ${step.color}40`, borderTop:"none", borderRadius:"0 0 16px 16px", padding:"16px" }}>
                <p style={{ fontFamily:getFont("body"), fontSize:14, color:C.sub, lineHeight:1.7, marginBottom:16 }}>{body}</p>
                {checks.length > 0 && (
                  <>
                    <div style={{ fontFamily:getFont("body"), fontSize:14, color:step.color, textTransform:"uppercase", letterSpacing:1.2, marginBottom:10 }}>{t("checks")}</div>
                    {checks.map((c,i) => (
                      <div key={i} style={{ display:"flex", gap:10, marginBottom:8 }}>
                        <span style={{ color:step.color, fontSize:16 }}>☐</span>
                        <span style={{ fontFamily:getFont("body"), fontSize:14, color:C.sub }}>{c}</span>
                      </div>
                    ))}
                  </>
                )}
                {timers.length > 0 && (
                  <div style={{ marginTop:16 }}>
                    <div style={{ fontFamily:getFont("body"), fontSize:14, color:step.color, textTransform:"uppercase", letterSpacing:1.2, marginBottom:10 }}>{t("timerLabel")}</div>
                    {timers.map(timer => <StepTimer key={timer.label} label={timer.label} minutes={timer.minutes} />)}
                  </div>
                )}
                <div style={{ marginTop:14, padding:"10px 14px", background:`${step.color}15`, borderRadius:10, fontFamily:getFont("body"), fontSize:14, color:C.sub, fontStyle:"italic", lineHeight:1.6 }}>
                  💡 {tip}
                </div>
              </div>
            )}
          </div>
        );
      })}

      {/* Baker's % */}
      <div style={{ marginTop:24, background:C.card, border:`1px solid ${C.border}`, borderRadius:16, padding:"18px" }}>
        <div style={{ fontFamily:getFont("serif"), fontSize:18, color:C.text, fontWeight:700, marginBottom:14 }}>{t("bakersPercent")}</div>
        <p style={{ fontFamily:getFont("body"), fontSize:14, color:C.sub, marginBottom:14, lineHeight:1.65 }}>
          {t("bakersMathBody")}
        </p>
        {bakersRows.map(([n,f,ex]) => (
          <div key={n} style={{ borderTop:`1px solid ${C.border}`, paddingTop:12, marginBottom:12 }}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:3 }}>
              <span style={{ fontFamily:getFont("body"), fontSize:14, color:C.text, fontWeight:600 }}>{n}</span>
              <span style={{ fontFamily:getFont("body"), fontSize:14, color:C.accent }}>{f}</span>
            </div>
            <div style={{ fontFamily:getFont("body"), fontSize:14, color:C.faint, fontStyle:"italic" }}>{ex}</div>
          </div>
        ))}
      </div>
      <PageFooter />
    </div>
  );
}

// ─── TROUBLESHOOT TAB ─────────────────────────────────────────────────────────
function TroubleTab() {
  const { C, t, lang, getFont } = useApp();
  const [open, setOpen] = useState(null);
  const isFa = lang === "fa";

  const glossary = isFa ? [
    ["لوون / استارتر","کشت زنده مخمر وحشی و باکتری. عامل تخمیر برای تمام پخت‌های خمیرترش."],
    ["تخمیر حجمی","مرحله اصلی تخمیر که در آن کل توده خمیر با هم تخمیر می‌کند، معمولاً ۴–۸ ساعت."],
    ["اتولیز","استراحت آرد و آب بدون استارتر برای توسعه منفعل گلوتن."],
    ["آبیاری","آب به عنوان درصدی از وزن آرد. بیشتر = خمیر مرطوب‌تر، مغز بازتر."],
    ["بانتون","سبد تخمیر (چوب بامبو یا خمیر چوب) که شکل خمیر را در طول تخمیر ثانویه حفظ می‌کند."],
    ["پف فر","بالا آمدن سریع در دقایق اول پخت با گسترش گازها از گرما."],
    ["برش زدن","بریدن سطح خمیر با تیغ/لاموس قبل از پختن برای کنترل نحوه باز شدن آن."],
    ["آزمایش پنجره","کشش خمیر تا آنجا که نور از آن دیده شود — توسعه خوب گلوتن را تأیید می‌کند."],
  ] : [
    ["Levain / Starter","A live culture of wild yeast and bacteria. The leavening agent for all sourdough baking."],
    ["Bulk fermentation","The main fermentation phase where the whole dough mass ferments together, typically 4–8 hours."],
    ["Autolyse","Resting flour and water without starter for passive gluten development."],
    ["Hydration","Water as a percentage of flour weight. Higher = wetter dough, more open crumb."],
    ["Banneton","A proofing basket (cane or wood pulp) that supports the dough's shape while proofing."],
    ["Oven spring","The rapid rise in the first minutes of baking as gases expand from heat."],
    ["Scoring","Cutting dough surface with a razor/lame before baking to control how it opens."],
    ["Windowpane test","Stretching dough thin enough to see light through — confirms good gluten development."],
  ];

  return (
    <div style={{ padding:"0 16px 24px" }} className="fade-up">
      <SectionTitle title={t("troubleTitle")} sub={t("troubleSub2")} />
      {TROUBLE.map((tr,i) => {
        const problem = isFa ? tr.problemFa : tr.problem;
        const causes  = isFa ? tr.causesFa  : tr.causes;
        const fixes   = isFa ? tr.fixesFa   : tr.fixes;
        return (
          <div key={i} style={{ marginBottom:10 }}>
            <button onClick={() => setOpen(open===i?null:i)} style={{ display:"block", width:"100%", textAlign:"left", cursor:"pointer", background:C.card, border:`1px solid ${open===i?C.red:C.border}`, borderRadius: open===i?"14px 14px 0 0":14, padding:"13px 16px" }}>
              <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                <span style={{ fontSize:24 }}>{tr.emoji}</span>
                <span style={{ fontFamily:getFont("serif"), fontSize:15, color:C.text, fontWeight:700, flex:1 }}>{problem}</span>
                <span style={{ color:C.faint, fontSize:18, transform:open===i?"rotate(90deg)":"none", transition:"transform 0.2s" }}>›</span>
              </div>
            </button>
            {open===i && (
              <div style={{ background:`${C.red}08`, border:`1px solid ${C.red}40`, borderTop:"none", borderRadius:"0 0 14px 14px", padding:"14px 16px" }}>
                <div style={{ fontFamily:getFont("body"), fontSize:14, color:C.red, textTransform:"uppercase", letterSpacing:1.3, marginBottom:10 }}>{t("likelyCauses")}</div>
                {causes.map((c,j) => (
                  <div key={j} style={{ display:"flex", gap:10, marginBottom:8 }}>
                    <span style={{ color:C.red, fontSize:14, marginTop:1 }}>•</span>
                    <span style={{ fontFamily:getFont("body"), fontSize:14, color:C.sub }}>{c}</span>
                  </div>
                ))}
                <div style={{ fontFamily:getFont("body"), fontSize:14, color:C.green, textTransform:"uppercase", letterSpacing:1.3, margin:"14px 0 10px" }}>{t("howToFix")}</div>
                {fixes.map((f,j) => (
                  <div key={j} style={{ display:"flex", gap:10, marginBottom:8 }}>
                    <span style={{ color:C.green, fontSize:14, marginTop:1 }}>✓</span>
                    <span style={{ fontFamily:getFont("body"), fontSize:14, color:C.sub }}>{f}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}

      {/* Glossary */}
      <div style={{ marginTop:22, background:C.card, border:`1px solid ${C.border}`, borderRadius:16, padding:"18px" }}>
        <div style={{ fontFamily:getFont("serif"), fontSize:18, color:C.text, fontWeight:700, marginBottom:14 }}>{t("quickGlossary")}</div>
        {glossary.map(([term,def]) => (
          <div key={term} style={{ borderTop:`1px solid ${C.border}`, paddingTop:11, marginBottom:11 }}>
            <div style={{ fontFamily:getFont("body"), fontSize:14, color:C.accent, fontWeight:600, marginBottom:3 }}>{term}</div>
            <div style={{ fontFamily:getFont("body"), fontSize:14, color:C.sub, lineHeight:1.65 }}>{def}</div>
          </div>
        ))}
      </div>
      <PageFooter />
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
const TABS = [
  { id:"home",    icon:"🏠", labelKey:"home"       },
  { id:"calc",    icon:"⚖️", labelKey:"calculator" },
  { id:"recipes", icon:"📖", labelKey:"recipes"    },
  { id:"guide",   icon:"🎓", labelKey:"guide"      },
  { id:"trouble", icon:"🔧", labelKey:"fix"        },
];

export default function App() {
  const [tab,   setTab]   = useState("home");
  const [theme, setTheme] = useState("dark");
  const [lang,  setLang]  = useState("en");

  const C       = theme === "dark" ? DARK : LIGHT;
  const isRTL   = lang === "fa";
  const t       = (key) => T[lang]?.[key] ?? T.en?.[key] ?? key;
  const getFont = (type) => {
    if (isRTL) return FARSI;
    return type === "serif" ? SERIF : BODY;
  };
  const num = (v) => isRTL ? toFaNum(v) : String(v);

  useEffect(() => {
    updateGlobalStyles(C);
    document.documentElement.dir  = isRTL ? "rtl" : "ltr";
    document.documentElement.lang = lang;
  }, [theme, lang, C, isRTL]);

  const ctxValue = { C, t, lang, theme, isRTL, getFont, setTheme, setLang, num };

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

  return (
    <AppCtx.Provider value={ctxValue}>
      <div style={{ minHeight:"100vh", background:C.bg, display:"flex", justifyContent:"center", fontFamily:getFont("body"), transition:"background 0.3s" }}>
        <div style={{ width:"100%", maxWidth:430, display:"flex", flexDirection:"column", minHeight:"100vh" }}>

          {/* Header */}
          <div style={{ padding:"12px 16px", borderBottom:`1px solid ${C.border}`, background:`${C.bg}F2`, backdropFilter:"blur(12px)", position:"sticky", top:0, zIndex:20, display:"flex", alignItems:"center", justifyContent:"space-between", transition:"background 0.3s, border-color 0.3s" }}>
            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              <span style={{ fontSize:22 }}>🍞</span>
              <span style={{ fontFamily:getFont("serif"), fontSize:20, color:C.text, fontWeight:700, letterSpacing:-0.3 }}>{t("appName")}</span>
            </div>
            <div style={{ display:"flex", gap:8, alignItems:"center" }}>
              <button
                onClick={() => setLang(l => l === "en" ? "fa" : "en")}
                style={{
                  padding:"5px 12px", borderRadius:20, cursor:"pointer",
                  border:`1px solid ${C.border}`,
                  background: lang==="fa" ? `${C.accent}20` : "transparent",
                  color: C.sub,
                  fontFamily: lang==="fa" ? FARSI : BODY,
                  fontSize:14, fontWeight:600, transition:"all 0.2s",
                  display:"flex", alignItems:"center", gap:4,
                }}
                title={lang==="en" ? "Switch to Farsi / فارسی" : "Switch to English"}
              >
                <span>{lang==="en" ? "FA" : "EN"}</span>
              </button>
              <button
                onClick={() => setTheme(th => th === "dark" ? "light" : "dark")}
                style={{
                  width:36, height:36, borderRadius:"50%", cursor:"pointer",
                  border:`1px solid ${C.border}`,
                  background: "transparent",
                  color: C.sub, fontSize:16,
                  display:"flex", alignItems:"center", justifyContent:"center",
                  transition:"all 0.2s",
                }}
                title={theme==="dark" ? (lang==="fa" ? "حالت روشن" : "Light mode") : (lang==="fa" ? "حالت تاریک" : "Dark mode")}
              >
                {theme==="dark" ? "☀️" : "🌙"}
              </button>
            </div>
          </div>

          {/* Content */}
          <div style={{ flex:1, overflowY:"auto", paddingTop:20 }} className="ls">
            {renderContent()}
          </div>

          {/* Bottom nav */}
          <div style={{ display:"flex", borderTop:`1px solid ${C.border}`, background:`${C.surf}F5`, backdropFilter:"blur(12px)", position:"sticky", bottom:0, paddingBottom:"max(env(safe-area-inset-bottom,0px),6px)", transition:"background 0.3s, border-color 0.3s" }}>
            {TABS.map(tItem => {
              const active = tItem.id === tab || (tItem.id === "calc" && (tab === "calc" || tab === "pizza"));
              return (
                <button key={tItem.id} onClick={() => setTab(tItem.id)} style={{ flex:1, paddingTop:10, paddingBottom:6, background:"transparent", border:"none", cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", gap:2 }}>
                  <span style={{ fontSize:18, filter: active?"none":"grayscale(80%) opacity(55%)", transition:"filter 0.18s" }}>{tItem.icon}</span>
                  <span style={{ fontFamily:getFont("body"), fontSize:14, letterSpacing:0.3, color: active?C.accent:C.faint, fontWeight: active?700:400 }}>{t(tItem.labelKey)}</span>
                  {active && <div style={{ width:16, height:2, borderRadius:1, background:C.accent }} />}
                </button>
              );
            })}
          </div>

        </div>
      </div>
    </AppCtx.Provider>
  );
}
