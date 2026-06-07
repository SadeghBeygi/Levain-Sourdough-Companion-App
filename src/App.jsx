import { useState, useMemo, useEffect } from "react";

// ─── BOOTSTRAP ─────────────────────────────────────────────────────────────
(() => {
  if (typeof document === "undefined") return;
  if (document.getElementById("levain-boot")) return;
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Lora:ital,wght@0,400;0,500;0,600;1,400&display=swap";
  document.head.appendChild(link);
  const s = document.createElement("style");
  s.id = "levain-boot";
  s.textContent = `
    body { background: #1D1308 !important; }
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    input[type=range] { -webkit-appearance: none; width: 100%; height: 4px; background: #4A2E14; border-radius: 2px; outline: none; cursor: pointer; }
    input[type=range]::-webkit-slider-thumb { -webkit-appearance: none; width: 22px; height: 22px; border-radius: 50%; background: #D4921E; cursor: pointer; box-shadow: 0 0 0 4px rgba(212,146,30,0.20); }
    .ls::-webkit-scrollbar { width: 3px; }
    .ls::-webkit-scrollbar-thumb { background: #4A2E14; border-radius: 2px; }
    @keyframes fadeUp { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
    .fade-up { animation: fadeUp 0.22s ease forwards; }
    .tab-btn:active { transform: scale(0.96); }
  `;
  document.head.appendChild(s);
})();

// ─── THEME ─────────────────────────────────────────────────────────────────
const C = {
  bg:     "#1D1308",
  surf:   "#261A09",
  card:   "#33200C",
  card2:  "#3D2810",
  border: "#513214",
  accent: "#D4921E",
  accentDim: "rgba(212,146,30,0.13)",
  text:   "#F2E5CC",
  sub:    "#B09278",
  faint:  "#70543C",
  green:  "#6AA062",
  red:    "#B85040",
  blue:   "#5A7AA8",
  purple: "#9060C0",
};
const SERIF = "'Playfair Display', Georgia, serif";
const BODY  = "'Lora', Georgia, serif";

// ─── DATA ──────────────────────────────────────────────────────────────────
const PRESETS = [
  { id:"flatbread",    name:"Flatbread",    hydration:80,  starter:20, salt:2,   wholeGrain:0  },
  { id:"loafpan",      name:"Loaf Pan",     hydration:85,  starter:15, salt:2,   wholeGrain:20 },
  { id:"freestanding", name:"Freestanding", hydration:75,  starter:10, salt:2,   wholeGrain:20 },
  { id:"rye",          name:"Rye",          hydration:90,  starter:20, salt:2.2, wholeGrain:50 },
  { id:"custom",       name:"Custom",       hydration:75,  starter:15, salt:2,   wholeGrain:0  },
];

const HYDRATION_LEVELS = [
  { range:[55,62],  label:"Beginner",     color:"#6AA062", desc:"Easy to handle. Dense, chewy crumb." },
  { range:[63,68],  label:"Intermediate", color:"#D4921E", desc:"Good balance. Nice open crumb." },
  { range:[69,76],  label:"Advanced",     color:"#C86020", desc:"Sticky. Big holes. Rewarding." },
  { range:[77,88],  label:"Expert",       color:"#B85040", desc:"Use oiled hands. Very open crumb." },
  { range:[89,110], label:"Master",       color:"#9060C0", desc:"Nearly batter. Loaf pan only." },
];

const WEIGHT_FUN = [
  [180,  "☕ About the weight of a large coffee"],
  [380,  "📱 About the weight of a smartphone"],
  [550,  "🥫 About the weight of a can of soup"],
  [750,  "🥦 About the weight of a broccoli"],
  [950,  "🍍 About the weight of a pineapple"],
  [1300, "🥥 About the weight of a coconut"],
  [1700, "🧱 About the weight of a brick"],
  [2800, "💪 That's a serious bake!"],
  [99999,"🏋️ Baking for an army!"],
];

const FEED_RATIOS = [
  { label:"1:1:1",   seed:1, flour:1,  water:1  },
  { label:"1:2:2",   seed:1, flour:2,  water:2  },
  { label:"1:3:3",   seed:1, flour:3,  water:3  },
  { label:"1:5:5",   seed:1, flour:5,  water:5  },
  { label:"1:10:10", seed:1, flour:10, water:10 },
];

const PIZZA_OVENS = [
  { id:"home",  name:"🏠 Home Oven",  temp:"250°C / 480°F", defaultWeight:270, tip:"Crank heat to max. Use a pizza stone or steel on the top rack." },
  { id:"pizza", name:"🔥 Pizza Oven", temp:"400°C / 750°F", defaultWeight:280, tip:"Preheat 30+ min. Cook 90 seconds, turning halfway through." },
  { id:"wood",  name:"🪵 Wood-Fired", temp:"480°C / 900°F", defaultWeight:280, tip:"60–90 seconds. Look for leopard spotting on the crust." },
];

const RECIPES = [
  {
    id:"flatbread", emoji:"🫓",
    name:"Sourdough Flatbread", sub:"The gateway bread",
    difficulty:1, diffLabel:"Very Easy",
    workTime:"3 min", totalTime:"8–24 hrs", hydration:80,
    ingredients:[
      { amount:400, unit:"g", name:"Flour (any type — wheat, rye, corn)" },
      { amount:320, unit:"g", name:"Water, room temperature"              },
      { amount:80,  unit:"g", name:"Active sourdough starter"             },
      { amount:8,   unit:"g", name:"Salt"                                 },
    ],
    steps:[
      ["Mix dough",    "Combine flour and water until no dry spots remain. Add starter and salt, mix until smooth and homogenized."],
      ["Ferment",      "Cover bowl and rest until dough increases 50% in size — typically 8–24 hours. It should smell fruity, milky, or mildly sour."],
      ["Heat the pan", "Set stove to medium heat. Lightly oil the surface and wipe away excess."],
      ["Cook",         "Scoop dough into pan, spread to ~1cm thick. Cover with a lid. Cook 5 min per side until golden-brown."],
      ["Wrap & serve", "Wrap baked flatbreads in a kitchen towel to retain moisture. Serve warm with dips, as wraps, or plain with olive oil."],
    ],
    tips:[
      "Works with ANY flour — wheat, rye, corn, spelt, or gluten-free blends",
      "Higher water ratio (>200%) = sourdough pancakes; lower (~70%) = thicker roti",
      "Store unbaked dough in the fridge for days — it keeps fermenting slowly for more complex flavor",
      "Slightly charring the bread at the end reduces excess sourness",
      "Keep a spoonful of raw dough to start your next batch — no feeding needed",
    ],
  },
  {
    id:"pancakes", emoji:"🥞",
    name:"Sourdough Pancakes", sub:"Sweet or savory magic",
    difficulty:1, diffLabel:"Very Easy",
    workTime:"3 min", totalTime:"8–12 hrs", hydration:300,
    ingredients:[
      { amount:100, unit:"g", name:"Flour (any type)"              },
      { amount:300, unit:"g", name:"Water"                         },
      { amount:15,  unit:"g", name:"Sourdough starter"             },
      { amount:2,   unit:"g", name:"Salt"                          },
      { amount:1,   unit:"",  name:"Egg per 100g flour (optional)" },
    ],
    steps:[
      ["Mix",            "Combine flour, water, starter, and salt. For sweet pancakes add sugar and eggs right before cooking — not before fermenting."],
      ["Overnight rest", "Cover and ferment 8–12 hours until surface shows bubbles and smells pleasantly sour."],
      ["Add-ins",        "Just before cooking, stir in optional egg or sugar. Adding them now preserves sweetness — microbes can't ferment it overnight."],
      ["Cook thin",      "Cook in lightly oiled pan, 0.1–0.5cm thick. Flip when bubbles appear across the surface."],
      ["Serve",          "Enjoy immediately with your favorite toppings. Leftover batter keeps refrigerated for several days."],
    ],
    tips:[
      "One egg per 100g flour makes them fluffier and richer",
      "Add sugar just before baking so it isn't consumed during fermentation",
      "Save a spoonful of batter — it becomes your starter for the next batch",
      "Teff flour makes an authentic Ethiopian injera-style pancake",
    ],
  },
  {
    id:"loafpan", emoji:"🍞",
    name:"Loaf Pan Sourdough", sub:"Effortless everyday bread",
    difficulty:2, diffLabel:"Easy",
    workTime:"5 min", totalTime:"12–24 hrs", hydration:85,
    ingredients:[
      { amount:500, unit:"g", name:"Flour (wheat, rye, or mixed)" },
      { amount:425, unit:"g", name:"Water"                        },
      { amount:75,  unit:"g", name:"Active sourdough starter"     },
      { amount:10,  unit:"g", name:"Salt"                         },
    ],
    steps:[
      ["Mix",      "Combine all ingredients until fully homogenized. A very sticky, wet dough is normal and desirable — it produces a fluffier crumb."],
      ["Into pan", "Generously grease loaf pan with oil. Scrape dough in — no shaping required. Smooth top with wet fingers."],
      ["Proof",    "Cover and wait until dough roughly doubles in size (6–12 hrs at room temp). Do not rush this step."],
      ["Bake",     "Place in cold oven, set to 200°C (390°F). Bake 30–50 min. Done when internal temperature reaches 92°C (197°F)."],
      ["Cool",     "Remove from pan and cool on a rack for at least 1 hour before slicing. The crumb needs to set."],
    ],
    tips:[
      "Never wash your loaf pan with soap — a seasoned patina prevents sticking with each bake",
      "Place another identical pan on top to simulate a Dutch oven and trap steam",
      "90–100% hydration creates a very soft, chewy crumb — especially beautiful with rye",
      "Mix 50% wheat into a rye dough to significantly improve structure",
      "You can bake 5 loaves at once in a home oven — perfect for batch baking",
    ],
  },
  {
    id:"wheat", emoji:"🥖",
    name:"Freestanding Wheat Sourdough", sub:"The supreme discipline",
    difficulty:4, diffLabel:"Advanced",
    workTime:"60 min", totalTime:"24–36 hrs", hydration:75,
    ingredients:[
      { amount:500, unit:"g", name:"Bread flour (>12% protein)"    },
      { amount:375, unit:"g", name:"Water, 26–28°C (79–82°F)"      },
      { amount:100, unit:"g", name:"Active levain / starter"       },
      { amount:10,  unit:"g", name:"Fine sea salt"                 },
    ],
    steps:[
      ["Prepare starter",   "Feed your starter 4–12 hrs before baking. It must be doubled, bubbly, domed at the top, and pass the float test."],
      ["Autolyse",          "Mix flour and water only. Cover and rest 30–60 minutes. This passively develops gluten without kneading."],
      ["Incorporate",       "Add levain and salt. Mix thoroughly using pinch-and-fold until fully incorporated and uniform."],
      ["Bulk fermentation", "Ferment 4–8 hrs at 24–26°C. Perform stretch & folds every 30 min for the first 2 hrs. Wait for a 50–75% size increase."],
      ["Pre-shape",         "Tip dough onto counter. Use a bench scraper to shape into rough rounds. Rest uncovered 20–30 min."],
      ["Final shape",       "Shape into batard or boule using tension folds. Place seam-up in a well-floured banneton."],
      ["Cold proof",        "Cover and refrigerate 8–16 hrs. Deep flavor develops here, and scoring becomes much easier."],
      ["Score & bake",      "Preheat Dutch oven at 250°C (480°F) for 45 min. Score cold dough at 30–45°. Bake covered 20 min, uncovered 20 min."],
    ],
    tips:[
      "Bread flour with >12% protein is essential — all-purpose flour won't hold its shape",
      "Cold overnight proofing dramatically improves flavor and gives a more open crumb",
      "Score at 30–45° angle, 1cm deep for a proper ear to form",
      "Over-fermentation is the #1 mistake — dough should feel airy but NOT slack",
      "There is no recipe you can blindly follow. Learn to read your dough.",
    ],
  },
  {
    id:"focaccia", emoji:"🫙",
    name:"Sourdough Focaccia", sub:"Olive oil heaven",
    difficulty:2, diffLabel:"Easy",
    workTime:"10 min", totalTime:"12–20 hrs", hydration:80,
    ingredients:[
      { amount:500, unit:"g", name:"Bread flour"                },
      { amount:400, unit:"g", name:"Water, room temperature"    },
      { amount:75,  unit:"g", name:"Active sourdough starter"   },
      { amount:10,  unit:"g", name:"Fine sea salt"              },
      { amount:60,  unit:"ml",name:"Good olive oil (plus more)" },
    ],
    steps:[
      ["Mix",            "Combine flour, water, and starter. Add salt and 2 tbsp olive oil. Mix until fully incorporated — dough is very sticky, that's correct."],
      ["Bulk ferment",   "Cover and ferment 8–12 hrs at room temp, or overnight. Dough should nearly double and look bubbly."],
      ["Oil the pan",    "Pour 3–4 tbsp olive oil generously into a 30×20cm baking tray. Tip the dough in — no shaping needed."],
      ["Dimple & rest",  "With oiled hands, stretch dough to fill the tray. Cover and rest 30–60 min until puffy. Add toppings now: rosemary, olives, flaked salt."],
      ["Dimple again",   "Press your fingers deep into the dough to create the iconic dimples. Drizzle with more olive oil, making sure it pools in the holes."],
      ["Bake",           "Bake at 220°C (430°F) for 20–25 min until deep golden. The bottom should be crisp — lift a corner to check."],
      ["Rest & slice",   "Cool 10 min before slicing. Best eaten the day of baking. Stores well wrapped in cloth for 2 days."],
    ],
    tips:[
      "Use the best olive oil you have — it's the dominant flavor",
      "Rosemary + flaked salt is the classic; try halved cherry tomatoes or olives",
      "Oiling your hands prevents sticking far better than flouring them",
      "A dark, crisp bottom is a sign of success — don't pull it out too early",
      "Leftover focaccia makes extraordinary sandwich bread the next day",
    ],
  },
  {
    id:"ciabatta", emoji:"🥖",
    name:"Sourdough Ciabatta", sub:"The slipper bread — wild open crumb",
    difficulty:4, diffLabel:"Advanced",
    workTime:"30 min", totalTime:"18–28 hrs", hydration:85,
    ingredients:[
      { amount:500, unit:"g", name:"Strong bread flour (>12% protein)" },
      { amount:425, unit:"g", name:"Water, 26°C (79°F)"                },
      { amount:100, unit:"g", name:"Active sourdough starter"          },
      { amount:10,  unit:"g", name:"Salt"                              },
      { amount:20,  unit:"ml",name:"Olive oil"                         },
    ],
    steps:[
      ["Mix & autolyse",     "Combine flour and 380g water. Mix until no dry flour remains. Rest 40 min. This is the autolyse — gluten forms without effort."],
      ["Add starter & salt", "Dissolve starter and salt in the remaining 45g water. Pour over autolysed dough and mix thoroughly by squeezing through your fingers."],
      ["Coil folds",         "Every 30 min for 3 hrs, perform coil folds: slide hands under the dough, lift from the center, let the ends fold under. 4–6 sets total."],
      ["Bulk ferment",       "Leave dough undisturbed until 75–80% grown. It should be airy, jiggly, with bubbles visible throughout. Usually 5–8 hrs total."],
      ["Divide",             "Flour your surface generously. Gently tip dough out — do NOT degas it. Flour the top and divide into 2–3 long rectangles with a scraper."],
      ["Proof",              "Transfer loaves to a well-floured couche or baking paper. Flour the tops. Proof 1–2 hrs at room temp until puffed but not over-proofed."],
      ["Bake with steam",    "Bake at 240°C (465°F) on a preheated stone or tray. Create steam with a tray of boiling water below. Bake 22–26 min until dark golden."],
    ],
    tips:[
      "This is an extremely wet dough — wet hands and a scraper are your best tools",
      "Do NOT add flour when shaping. The stickiness is essential to the open crumb",
      "Coil folds are gentler than stretch & folds — preserve those gas bubbles",
      "The darker the crust, the better it keeps and the more flavor it has",
      "A proper ciabatta should feel hollow and nearly weightless for its size",
    ],
  },
  {
    id:"spelt", emoji:"🌿",
    name:"Spelt Sourdough", sub:"Ancient grain, nutty & complex",
    difficulty:3, diffLabel:"Medium",
    workTime:"20 min", totalTime:"16–24 hrs", hydration:70,
    ingredients:[
      { amount:350, unit:"g", name:"Whole spelt flour"         },
      { amount:150, unit:"g", name:"Bread flour (for strength)"},
      { amount:350, unit:"g", name:"Water, 26°C"               },
      { amount:100, unit:"g", name:"Active spelt starter"      },
      { amount:10,  unit:"g", name:"Salt"                      },
    ],
    steps:[
      ["Autolyse",          "Mix flours and water. No starter or salt yet. Rest 20–30 min. Spelt absorbs water quickly — don't skip this."],
      ["Incorporate",       "Add starter and salt. Use pinch-and-fold to fully incorporate. Spelt's gluten is more fragile than wheat — be gentle."],
      ["Gentle folds",      "Perform 3 sets of stretch & folds, 30 min apart. Spelt tears easily — go slow, handle with care."],
      ["Bulk ferment",      "Ferment 5–7 hrs at 24°C. Spelt ferments faster than wheat. Watch for a 50% size increase and visible bubbles."],
      ["Shape",             "Pre-shape into a round, rest 20 min. Final shape into a tight boule. Place seam-up in a floured banneton."],
      ["Cold proof",        "Refrigerate 10–16 hrs. Cold proofing is especially important for spelt — it firms up the fragile gluten."],
      ["Score & bake",      "Bake in a preheated Dutch oven at 230°C (445°F): 20 min covered, 18 min uncovered. The crust should be deep amber."],
    ],
    tips:[
      "Spelt has weaker gluten than wheat — reducing hydration by 5–10% makes it much easier to handle",
      "Ferments faster than wheat: watch the dough, not the clock",
      "Mixing spelt with 20–30% bread flour significantly improves structure",
      "The nutty, slightly sweet flavor pairs beautifully with butter and honey",
      "Spelt is not gluten-free — but many people with wheat sensitivity tolerate it better",
    ],
  },
  {
    id:"rye", emoji:"🌾",
    name:"Dark Rye Sourdough", sub:"Hearty, robust, complex",
    difficulty:3, diffLabel:"Medium",
    workTime:"10 min", totalTime:"18–36 hrs", hydration:90,
    ingredients:[
      { amount:250, unit:"g", name:"Rye flour (whole or dark)"  },
      { amount:250, unit:"g", name:"Bread flour"                },
      { amount:450, unit:"g", name:"Water"                      },
      { amount:100, unit:"g", name:"Active rye starter"         },
      { amount:10,  unit:"g", name:"Salt"                       },
    ],
    steps:[
      ["Mix",         "Combine all ingredients. Rye dough does NOT need kneading — its pentosans (not gluten) create structure. The dough will be paste-like."],
      ["Into pan",    "Use wet hands to transfer to a well-greased loaf pan. Smooth the top. Optionally press seeds into the surface."],
      ["Proof",       "Cover and proof 4–8 hrs until dough reaches the top of the pan. Rye ferments faster than wheat — watch the dough, not the clock."],
      ["Bake",        "Bake at 220°C (428°F) for 45–55 min. Internal temp should reach 92°C (197°F)."],
      ["Wait 24 hrs", "Do not slice for at least 24 hours. The crumb needs time to set. Cutting too soon results in a gummy, collapsing interior."],
    ],
    tips:[
      "Rye's pentosans create structure — kneading actually damages the dough",
      "Traditional add-ins: caraway seeds, sunflower seeds, walnuts, or fennel",
      "Higher hydration (90–100%) is normal for rye — embrace the stickiness",
      "Rye bread improves with age — wrap in cloth and it stays excellent for a week",
    ],
  },
];

const GUIDE = [
  {
    id:1, emoji:"🧫", phase:"Before You Begin",
    title:"Ready Your Starter", color:"#5A8A50",
    body:"Your starter must be active, bubbly, and at peak before you bake. Feed it 4–12 hours before mixing. A healthy starter doubles in size, smells fruity-sour or milky, and passes the float test.",
    checks:["Starter doubled since last feeding","Bubbly, domed top — not flat or collapsed","Float test: drop a small piece in water and it floats","Smells fruity, milky, or mildly sour"],
    tip:"If your starter has been stored in the fridge, give it 2–3 consecutive feedings over 1–2 days to fully reactivate.",
    timers:[],
  },
  {
    id:2, emoji:"🥣", phase:"Day 1 – Morning",
    title:"Mix & Autolyse", color:"#8A6830",
    body:"Mix flour and water first, then rest 30–60 minutes (autolyse). The dough develops gluten passively during rest without kneading. Then add starter and salt and mix until fully incorporated.",
    checks:["No dry flour spots remain","Starter and salt fully incorporated","Dough is smooth and cohesive"],
    tip:"Use water at 26–28°C (79–82°F). Warmer water speeds fermentation; too cold slows it down too much.",
    timers:[{ label:"Autolyse rest", minutes:30 }],
  },
  {
    id:3, emoji:"⏱️", phase:"Day 1 – Morning to Afternoon",
    title:"Bulk Fermentation", color:"#7A5A30",
    body:"The main fermentation takes 4–8 hours at room temperature. During the first 2 hours, perform 4–6 sets of stretch & folds every 30 minutes. Then leave undisturbed until ready.",
    checks:["Dough increased 50–75% in size","Bubbles visible on sides of container","Dough feels airy and jiggly when shaken","Passes windowpane test: stretches thin without tearing"],
    tip:"Warmer = faster. At 28°C expect ~4 hrs; at 22°C expect ~6–8 hrs. Always read your dough, not the clock.",
    timers:[{ label:"Stretch & fold interval", minutes:30 }, { label:"Full bulk ferment (avg)", minutes:360 }],
  },
  {
    id:4, emoji:"👐", phase:"Day 1 – Afternoon",
    title:"Pre-shape & Shape", color:"#6A4A28",
    body:"Tip dough out, pre-shape into a rough round, rest 20–30 minutes uncovered. Then final shape into a batard or boule using tension folds. Build surface tension by dragging the dough toward you.",
    checks:["Surface is smooth and taut","Dough holds shape without spreading flat","No tears on surface","Seam neatly sealed at the bottom"],
    tip:"Work on a lightly unfloured surface — you need friction for tension. A bench scraper is indispensable here.",
    timers:[{ label:"Pre-shape bench rest", minutes:25 }],
  },
  {
    id:5, emoji:"🌙", phase:"Day 1 – Evening",
    title:"Proofing", color:"#3A4A68",
    body:"Place shaped dough seam-up in a well-floured banneton. Either proof at room temperature 1–2 hrs, or cover and refrigerate overnight. Cold proofing is strongly recommended.",
    checks:["Banneton well-floured (rice flour is best)","Poke test: dough springs back slowly when poked","If cold-proofing: dough is firm and cold before baking"],
    tip:"Cold proofing 8–16 hrs gives dramatically better flavor, a more open crumb, and makes scoring much easier.",
    timers:[{ label:"Room temp proof", minutes:90 }],
  },
  {
    id:6, emoji:"🔥", phase:"Day 2 – Baking",
    title:"Score & Bake", color:"#8A3A20",
    body:"Preheat Dutch oven at 230–250°C (445–480°F) for at least 45 minutes. Score the cold dough with a lame or razor blade at a 30–45° angle. Bake covered 20 min (steam), then uncovered 20 min (crust).",
    checks:["Dutch oven preheated minimum 45 min","Razor blade held at 30–45° angle","Ear formed during baking","Hollow sound when bottom is tapped"],
    tip:"The steam in the first 20 minutes (lid on) is absolutely critical for oven spring. Never skip it.",
    timers:[{ label:"Preheat Dutch oven", minutes:45 }, { label:"Bake covered — steam", minutes:20 }, { label:"Bake uncovered — crust", minutes:20 }],
  },
];

const TROUBLE = [
  { emoji:"📉", problem:"Flat bread / No oven spring",
    causes:["Weak or inactive starter","Over-fermented dough","Weak shaping — not enough tension","Poor scoring technique"],
    fixes:["Feed starter until it reliably doubles within 8 hrs","Reduce bulk fermentation by 30–60 min","Focus on building surface tension during shaping","Score at 30–45° angle, at least 1cm deep"],
  },
  { emoji:"🧱", problem:"Dense or gummy crumb",
    causes:["Under-baked — taken out too soon","Sliced while still hot","Under-fermented","Insufficient gluten development"],
    fixes:["Bake to 92–96°C (197–205°F) internal temp","Rest at least 1 hr (rye: 24 hrs) before cutting","Extend bulk fermentation by 1 hr","Increase stretch & fold sets in first 2 hrs"],
  },
  { emoji:"😬", problem:"Too sour / harsh acidity",
    causes:["Over-fermented","Too high starter percentage","Long warm-temp proof","Starter not balanced"],
    fixes:["Shorten bulk fermentation by 30–60 min","Reduce starter % to 8–10%","Cold proof instead of room temp","Feed starter 2–3× to rebalance yeast/bacteria"],
  },
  { emoji:"😶", problem:"Not sour enough",
    causes:["Under-fermented","Fermentation too fast (too warm)","Yeast-dominant starter"],
    fixes:["Cold proof 24–48 hrs for more acid development","Reduce starter to 5–8% to slow fermentation","Use cooler water to slow yeast","Let bulk fermentation run 1–2 hrs longer"],
  },
  { emoji:"🫠", problem:"Dough too sticky / won't shape",
    causes:["Hydration too high","Under-developed gluten","Dough too warm"],
    fixes:["Reduce hydration by 5% next bake","Do more stretch & fold sets during bulk","Refrigerate dough 30 min before shaping","Lightly wet hands instead of using flour"],
  },
  { emoji:"🪨", problem:"Crust too thick or hard",
    causes:["Overbaked","Not enough steam during baking","Oven too hot"],
    fixes:["Reduce bake time by 5-min increments","Ensure Dutch oven lid seals tightly for first 20 min","Lower oven temp by 10°C (18°F)"],
  },
  { emoji:"😴", problem:"Starter not rising",
    causes:["Environment too cold","Flour lacks nutrients","Acid buildup killing yeast","Possible contamination"],
    fixes:["Keep starter at 24–28°C (75–82°F)","Switch to whole grain or rye flour for more nutrients","Discard all but 1–2g and restart feedings","Start a fresh starter if persistent"],
  },
  { emoji:"🫢", problem:"Big holes in crust / blowouts",
    causes:["Under-proofed","Inadequate shaping","Scored too deep or wrong angle"],
    fixes:["Extend proof by 30–60 min (poke test should spring back slowly)","Work on even, consistent tension when shaping","Score at 30–45° angle — shallower and longer"],
  },
];

// ─── UTILITIES ─────────────────────────────────────────────────────────────
const fmt  = n => Math.round(n * 10) / 10;
const fmt2 = n => Math.round(n * 100) / 100;

function getHydrationLevel(h) {
  return HYDRATION_LEVELS.find(l => h >= l.range[0] && h <= l.range[1]) || HYDRATION_LEVELS[1];
}
function getWeightFun(g) {
  return (WEIGHT_FUN.find(([max]) => g < max) || WEIGHT_FUN[WEIGHT_FUN.length-1])[1];
}
async function copyText(text) {
  try { await navigator.clipboard.writeText(text); return true; }
  catch { return false; }
}

// ─── SHARED UI ─────────────────────────────────────────────────────────────

function Pill({ children, color = C.accent, small }) {
  return (
    <span style={{
      background:`${color}20`, color, border:`1px solid ${color}40`,
      borderRadius:20, padding: small ? "2px 8px" : "4px 12px",
      fontSize: small ? 10 : 12, fontFamily:BODY, fontWeight:600,
      letterSpacing:0.3, whiteSpace:"nowrap",
    }}>{children}</span>
  );
}

function DiffDots({ level }) {
  return (
    <span style={{ display:"flex", gap:3, alignItems:"center" }}>
      {[1,2,3,4].map(i => (
        <span key={i} style={{ width: i<=level?7:6, height: i<=level?7:6, borderRadius:"50%", background: i<=level ? C.accent : C.border }} />
      ))}
    </span>
  );
}

function SectionTitle({ title, sub }) {
  return (
    <div style={{ marginBottom:22 }}>
      <h2 style={{ fontFamily:SERIF, fontSize:26, color:C.text, fontWeight:700, lineHeight:1.2 }}>{title}</h2>
      {sub && <p style={{ fontFamily:BODY, color:C.sub, fontSize:15, marginTop:4, fontStyle:"italic" }}>{sub}</p>}
    </div>
  );
}

// Fixed NumInput — uses text type to avoid browser number quirks
function NumInput({ value, onChange, step = 50, min = 1, unit = "g" }) {
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
        style={{ flex:1, textAlign:"center", background:"transparent", border:"none", fontFamily:SERIF, fontSize:28, color:C.text, outline:"none", minWidth:0 }}
      />
      <span style={{ fontFamily:BODY, fontSize:14, color:C.sub, flexShrink:0 }}>{unit}</span>
      <button onClick={inc} style={{ padding:"14px 20px", background:"transparent", border:"none", color:C.sub, fontSize:24, cursor:"pointer", lineHeight:1, userSelect:"none", flexShrink:0 }}>+</button>
    </div>
  );
}

function Slider({ label, value, onChange, min, max, step=1, unit="%", sublabel }) {
  const pct = ((value-min)/(max-min))*100;
  return (
    <div style={{ marginBottom:22 }}>
      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
        <div>
          <span style={{ fontFamily:BODY, fontSize:16, color:C.text }}>{label}</span>
          {sublabel && <span style={{ fontFamily:BODY, fontSize:12, color:C.faint, marginLeft:8 }}>{sublabel}</span>}
        </div>
        <span style={{ fontFamily:SERIF, fontSize:18, color:C.accent, fontWeight:700 }}>{value}{unit}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(parseFloat(e.target.value))}
        style={{ background:`linear-gradient(to right,${C.accent} 0%,${C.accent} ${pct}%,#4A2E14 ${pct}%,#4A2E14 100%)` }}
      />
      <div style={{ display:"flex", justifyContent:"space-between", marginTop:5 }}>
        <span style={{ fontFamily:BODY, fontSize:11, color:C.faint }}>{min}{unit}</span>
        <span style={{ fontFamily:BODY, fontSize:11, color:C.faint }}>{max}{unit}</span>
      </div>
    </div>
  );
}

function CopyButton({ getText }) {
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
      fontFamily:BODY, fontSize:13, cursor:"pointer", transition:"all 0.2s",
    }}>
      {state==="done" ? "✓ Copied!" : "📋 Copy List"}
    </button>
  );
}

function PageFooter() {
  return (
    <div style={{ textAlign:"center", padding:"20px 0 6px", fontFamily:BODY, fontSize:10, color:C.faint, letterSpacing:0.5, fontStyle:"italic" }}>
      Made by S.B and Claude did it.
    </div>
  );
}

function StepTimer({ label, minutes }) {
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
  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");
  const pct = ((total - seconds) / total) * 100;

  return (
    <div style={{ background:C.card2, border:`1px solid ${done ? C.green : C.border}`, borderRadius:12, padding:"12px 14px", marginBottom:8, transition:"border-color 0.3s" }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:8 }}>
        <div>
          <div style={{ fontFamily:BODY, fontSize:11, color:C.sub, marginBottom:3 }}>⏱ {label}</div>
          <div style={{ fontFamily:SERIF, fontSize:24, color:done ? C.green : C.accent, fontWeight:700 }}>
            {done ? "✓ Done!" : `${mm}:${ss}`}
          </div>
        </div>
        <div style={{ display:"flex", gap:6 }}>
          {!done && (
            <button onClick={() => setRunning(r => !r)} style={{
              padding:"9px 16px", borderRadius:8, cursor:"pointer",
              border:`1px solid ${C.accent}`,
              background: running ? `${C.accent}22` : C.accent,
              color: running ? C.accent : "#fff",
              fontFamily:BODY, fontSize:13, fontWeight:600,
            }}>
              {running ? "⏸ Pause" : "▶ Start"}
            </button>
          )}
          <button onClick={reset} style={{
            padding:"9px 13px", borderRadius:8, cursor:"pointer",
            border:`1px solid ${C.border}`, background:"transparent",
            color:C.sub, fontFamily:BODY, fontSize:15,
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

// ─── HOME ──────────────────────────────────────────────────────────────────
function HomeTab({ setTab }) {
  const cards = [
    { icon:"⚖️", label:"Dough Calculator",  sub:"Baker's math & whole grain split", tab:"calc"    },
    { icon:"🍕", label:"Pizza Calculator",   sub:"Neapolitan, NY, wood-fired",       tab:"pizza"   },
    { icon:"📖", label:"Recipes",            sub:"5 complete bread recipes",          tab:"recipes" },
    { icon:"🎓", label:"Process Guide",      sub:"6-step mastery checklist",          tab:"guide"   },
    { icon:"🔧", label:"Troubleshoot",       sub:"Diagnose any baking problem",       tab:"trouble" },
    { icon:"🧫", label:"Starter Planner",    sub:"Feeding ratio calculator",          tab:"starter" },
  ];

  return (
    <div style={{ padding:"0 16px 28px" }} className="fade-up">
      {/* Subtitle */}
      <p style={{ fontFamily:BODY, fontSize:15, color:C.sub, fontStyle:"italic", marginBottom:24, lineHeight:1.6 }}>
        Your complete sourdough companion — from starter to scoring.
      </p>

      {/* Grid */}
      <div style={{ fontFamily:BODY, fontSize:11, color:C.faint, letterSpacing:1.8, textTransform:"uppercase", marginBottom:12 }}>Tools & Sections</div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:28 }}>
        {cards.map(card => (
          <button key={card.tab} onClick={() => setTab(card.tab)} className="tab-btn"
            style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:16, padding:"16px 14px", textAlign:"left", cursor:"pointer", transition:"border-color 0.15s" }}
            onMouseEnter={e => e.currentTarget.style.borderColor = `${C.accent}66`}
            onMouseLeave={e => e.currentTarget.style.borderColor = C.border}
          >
            <div style={{ fontSize:28, marginBottom:8 }}>{card.icon}</div>
            <div style={{ fontFamily:SERIF, fontSize:14, color:C.text, fontWeight:700, marginBottom:3 }}>{card.label}</div>
            <div style={{ fontFamily:BODY, fontSize:12, color:C.sub, lineHeight:1.4 }}>{card.sub}</div>
          </button>
        ))}
      </div>

      {/* Difficulty guide */}
      <div style={{ fontFamily:BODY, fontSize:11, color:C.faint, letterSpacing:1.8, textTransform:"uppercase", marginBottom:12 }}>Difficulty Overview</div>
      <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:16, overflow:"hidden", marginBottom:24 }}>
        {[
          ["🫓","Flatbread","Any flour. Pan only. 3 min active work.",1],
          ["🍞","Loaf Pan","Uses oven. Sticky dough is correct. 5 min.",2],
          ["🌾","Rye Sourdough","Dense, hearty. Needs patience. 10 min.",3],
          ["🥖","Freestanding Wheat","The supreme discipline. Requires technique.",4],
        ].map(([em,name,desc,d],i,arr) => (
          <div key={name} style={{ display:"flex", alignItems:"center", gap:12, padding:"13px 16px", borderBottom: i<arr.length-1 ? `1px solid ${C.border}` : "none" }}>
            <span style={{ fontSize:22 }}>{em}</span>
            <div style={{ flex:1 }}>
              <div style={{ fontFamily:SERIF, fontSize:14, color:C.text, fontWeight:600 }}>{name}</div>
              <div style={{ fontFamily:BODY, fontSize:12, color:C.sub, marginTop:2 }}>{desc}</div>
            </div>
            <DiffDots level={d} />
          </div>
        ))}
      </div>

      {/* Quote */}
      <div style={{ background:`${C.accent}0D`, border:`1px solid ${C.accent}28`, borderRadius:16, padding:"18px 20px" }}>
        <div style={{ fontFamily:BODY, fontSize:11, color:C.accent, letterSpacing:1.8, textTransform:"uppercase", marginBottom:10 }}>Baker's Principle</div>
        <p style={{ fontFamily:SERIF, fontSize:16, color:C.text, fontStyle:"italic", lineHeight:1.75 }}>
          "There is no recipe you can blindly follow. You will always have to adapt to your locally available tools and environment."
        </p>
        <p style={{ fontFamily:BODY, fontSize:12, color:C.faint, marginTop:8 }}>— The Sourdough Framework</p>
      </div>
      <PageFooter />
    </div>
  );
}

// ─── BREAD CALCULATOR ──────────────────────────────────────────────────────
function BreadCalc() {
  const [inputMode, setInputMode] = useState("flour");
  const [flourPerLoaf, setFlourPerLoaf] = useState(500);
  const [totalWeight,  setTotalWeight]  = useState(900);
  const [hydration,    setHydration]    = useState(75);
  const [starterPct,   setStarterPct]   = useState(10);
  const [saltPct,      setSaltPct]      = useState(2);
  const [wholeGrain,   setWholeGrain]   = useState(20);
  const [loaves,       setLoaves]       = useState(1);
  const [preset,       setPreset]       = useState("freestanding");

  const dough = useMemo(() => {
    let flour;
    if (inputMode === "flour") {
      flour = flourPerLoaf * loaves;
    } else {
      flour = (totalWeight * loaves) / (1 + hydration/100 + starterPct/100 + saltPct/100);
    }
    const water   = flour * hydration / 100;
    const starter = flour * starterPct / 100;
    const salt    = flour * saltPct / 100;
    const total   = flour + water + starter + salt;
    const breadFlour  = flour * (1 - wholeGrain/100);
    const wgFlour     = flour * wholeGrain / 100;
    return { flour, water, starter, salt, total, breadFlour, wgFlour };
  }, [inputMode, flourPerLoaf, totalWeight, hydration, starterPct, saltPct, wholeGrain, loaves]);

  const perLoaf = { flour: dough.flour/loaves, water: dough.water/loaves, starter: dough.starter/loaves, salt: dough.salt/loaves, total: dough.total/loaves, breadFlour: dough.breadFlour/loaves, wgFlour: dough.wgFlour/loaves };
  const show = loaves > 1 ? perLoaf : dough;
  const hLevel = getHydrationLevel(hydration);

  const applyPreset = (id) => {
    setPreset(id);
    const p = PRESETS.find(x => x.id===id);
    if (p) { setHydration(p.hydration); setStarterPct(p.starter); setSaltPct(p.salt); setWholeGrain(p.wholeGrain); }
  };

  const getShoppingList = () => {
    const d = show;
    const lines = [
      `🍞 Sourdough Recipe${loaves>1 ? ` (×${loaves} loaves)` : ""}`,
      ``,
      wholeGrain>0 ? `🌾 Bread flour: ${fmt(d.breadFlour)}g` : `🌾 Flour: ${fmt(d.flour)}g`,
      wholeGrain>0 ? `🌾 Whole grain/rye flour: ${fmt(d.wgFlour)}g` : null,
      `💧 Water: ${fmt(d.water)}g`,
      `🧫 Starter: ${fmt(d.starter)}g`,
      `🧂 Salt: ${fmt(d.salt)}g`,
      ``,
      `Total: ${fmt(d.total)}g`,
      `Hydration: ${hydration}%`,
    ].filter(Boolean);
    return lines.join("\n");
  };

  return (
    <div>
      {/* Input mode */}
      <div style={{ display:"flex", gap:8, marginBottom:20 }}>
        {[["flour","By Flour / Loaf"],["total","By Total Weight"]].map(([id,lbl]) => (
          <button key={id} onClick={() => setInputMode(id)} style={{
            flex:1, padding:"10px 6px", borderRadius:10, cursor:"pointer",
            border:`1px solid ${inputMode===id ? C.accent : C.border}`,
            background: inputMode===id ? `${C.accent}15` : "transparent",
            color: inputMode===id ? C.accent : C.sub, fontFamily:BODY, fontSize:13,
          }}>{lbl}</button>
        ))}
      </div>

      {/* Weight input */}
      <div style={{ marginBottom:20 }}>
        <div style={{ fontFamily:BODY, fontSize:13, color:C.sub, marginBottom:8 }}>
          {inputMode==="flour" ? "Flour per loaf" : "Total dough weight (all loaves)"}
        </div>
        <NumInput
          value={inputMode==="flour" ? flourPerLoaf : totalWeight}
          onChange={v => inputMode==="flour" ? setFlourPerLoaf(v) : setTotalWeight(v)}
          step={50} min={50}
        />
        {inputMode==="flour" && (
          <div style={{ display:"flex", gap:4, marginTop:8 }}>
            {["100g\nRolls","500g\nStandard","1000g\nLarge","2000g\nMega"].map(s => {
              const [val,lbl] = s.split("\n");
              const n = parseInt(val);
              return (
                <button key={val} onClick={() => setFlourPerLoaf(n)} style={{
                  flex:1, padding:"6px 4px", borderRadius:8, border:`1px solid ${flourPerLoaf===n?C.accent:C.border}`,
                  background: flourPerLoaf===n ? `${C.accent}20` : "transparent",
                  color: flourPerLoaf===n ? C.accent : C.faint, fontFamily:BODY, fontSize:11, cursor:"pointer", textAlign:"center",
                }}>{val}<br/><span style={{fontSize:10}}>{lbl}</span></button>
              );
            })}
          </div>
        )}
      </div>

      {/* Sliders */}
      <div style={{ background:C.card, borderRadius:16, padding:"20px 18px", border:`1px solid ${C.border}`, marginBottom:16 }}>
        <Slider label="Hydration" value={hydration} onChange={setHydration} min={55} max={110}
          sublabel={`— ${getHydrationLevel(hydration).label}`}
        />
        {/* Hydration level badge */}
        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:18, marginTop:-8, padding:"8px 12px", background:`${hLevel.color}15`, borderRadius:8, border:`1px solid ${hLevel.color}30` }}>
          <span style={{ fontFamily:BODY, fontSize:13, color:hLevel.color, fontWeight:600 }}>{hLevel.label}</span>
          <span style={{ fontFamily:BODY, fontSize:13, color:C.sub }}>{hLevel.desc}</span>
        </div>
        <Slider label="Starter" value={starterPct} onChange={setStarterPct} min={5} max={30} />
        <Slider label="Salt" value={saltPct} onChange={setSaltPct} min={1.5} max={3} step={0.1} />
        <Slider label="Whole Grain" value={wholeGrain} onChange={setWholeGrain} min={0} max={100}
          sublabel="% of total flour"
        />
      </div>

      {/* Loaves */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", background:C.card, border:`1px solid ${C.border}`, borderRadius:12, padding:"10px 16px", marginBottom:20 }}>
        <span style={{ fontFamily:BODY, fontSize:15, color:C.text }}>Number of loaves</span>
        <div style={{ display:"flex", alignItems:"center", gap:16 }}>
          <button onClick={() => setLoaves(Math.max(1,loaves-1))} style={{ width:34,height:34,borderRadius:"50%",border:`1px solid ${C.border}`,background:"transparent",color:C.text,fontSize:20,cursor:"pointer",userSelect:"none" }}>−</button>
          <span style={{ fontFamily:SERIF, fontSize:24, color:C.accent, fontWeight:700, minWidth:28, textAlign:"center" }}>{loaves}</span>
          <button onClick={() => setLoaves(loaves+1)} style={{ width:34,height:34,borderRadius:"50%",border:`1px solid ${C.border}`,background:"transparent",color:C.text,fontSize:20,cursor:"pointer",userSelect:"none" }}>+</button>
        </div>
      </div>

      {/* Results */}
      <div style={{ background:`linear-gradient(145deg,#281808,#201205)`, border:`1px solid ${C.accent}35`, borderRadius:20, padding:"20px 20px" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
          <span style={{ fontFamily:BODY, fontSize:11, color:C.accent, textTransform:"uppercase", letterSpacing:1.5 }}>
            {loaves>1 ? `Per Loaf  (×${loaves})` : "Your Formula"}
          </span>
          <div style={{ display:"flex", gap:8, alignItems:"center" }}>
            {loaves>1 && <span style={{ fontFamily:BODY, fontSize:12, color:C.sub }}>Total: {fmt(dough.total)}g</span>}
            <CopyButton getText={getShoppingList} />
          </div>
        </div>

        {/* Flour rows */}
        {wholeGrain > 0 ? (
          <>
            <div style={{ display:"flex", justifyContent:"space-between", padding:"12px 0", borderBottom:`1px solid ${C.border}` }}>
              <div>
                <span style={{ fontFamily:BODY, fontSize:15, color:C.text }}>🌾 Bread flour</span>
                <span style={{ fontFamily:BODY, fontSize:12, color:C.faint, marginLeft:8 }}>{100-wholeGrain}%</span>
              </div>
              <span style={{ fontFamily:SERIF, fontSize:17, color:C.text }}>{fmt(show.breadFlour)}g</span>
            </div>
            <div style={{ display:"flex", justifyContent:"space-between", padding:"12px 0", borderBottom:`1px solid ${C.border}` }}>
              <div>
                <span style={{ fontFamily:BODY, fontSize:15, color:C.text }}>🌾 Whole grain / rye</span>
                <span style={{ fontFamily:BODY, fontSize:12, color:C.faint, marginLeft:8 }}>{wholeGrain}%</span>
              </div>
              <span style={{ fontFamily:SERIF, fontSize:17, color:C.text }}>{fmt(show.wgFlour)}g</span>
            </div>
          </>
        ) : (
          <div style={{ display:"flex", justifyContent:"space-between", padding:"12px 0", borderBottom:`1px solid ${C.border}` }}>
            <div><span style={{ fontFamily:BODY, fontSize:15, color:C.text }}>🌾 Flour</span><span style={{ fontFamily:BODY, fontSize:12, color:C.faint, marginLeft:8 }}>100%</span></div>
            <span style={{ fontFamily:SERIF, fontSize:17, color:C.text }}>{fmt(show.flour)}g</span>
          </div>
        )}
        {[
          ["💧 Water",   `${hydration}%`,    show.water],
          ["🧫 Starter", `${starterPct}%`,   show.starter],
          ["🧂 Salt",    `${saltPct}%`,      show.salt],
        ].map(([lbl,pct,val]) => (
          <div key={lbl} style={{ display:"flex", justifyContent:"space-between", padding:"12px 0", borderBottom:`1px solid ${C.border}` }}>
            <div><span style={{ fontFamily:BODY, fontSize:15, color:C.text }}>{lbl}</span><span style={{ fontFamily:BODY, fontSize:12, color:C.faint, marginLeft:8 }}>{pct}</span></div>
            <span style={{ fontFamily:SERIF, fontSize:17, color:C.text }}>{fmt(val)}g</span>
          </div>
        ))}
        <div style={{ paddingTop:16, marginTop:4, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <span style={{ fontFamily:BODY, fontSize:15, color:C.accent }}>Total</span>
          <span style={{ fontFamily:SERIF, fontSize:24, color:C.accent, fontWeight:700 }}>{fmt(show.total)}g</span>
        </div>
        <div style={{ marginTop:8, fontFamily:BODY, fontSize:13, color:C.faint, fontStyle:"italic", textAlign:"right" }}>
          {getWeightFun(loaves>1 ? dough.total : show.total)}
        </div>
      </div>

      {/* Hydration reference */}
      <div style={{ marginTop:18, background:C.card, border:`1px solid ${C.border}`, borderRadius:14, overflow:"hidden" }}>
        <div style={{ padding:"12px 16px", borderBottom:`1px solid ${C.border}` }}>
          <span style={{ fontFamily:BODY, fontSize:11, color:C.faint, letterSpacing:1.5, textTransform:"uppercase" }}>Hydration Guide</span>
        </div>
        {HYDRATION_LEVELS.map(l => (
          <div key={l.label} style={{ display:"flex", gap:12, alignItems:"center", padding:"10px 16px", borderBottom:`1px solid ${C.border}`, background: hydration>=l.range[0]&&hydration<=l.range[1] ? `${l.color}12` : "transparent" }}>
            <span style={{ fontFamily:BODY, fontSize:13, color:l.color, fontWeight:600, minWidth:92 }}>{l.range[0]}–{l.range[1]}%  {l.label}</span>
            <span style={{ fontFamily:BODY, fontSize:13, color:C.sub }}>{l.desc}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── PIZZA CALCULATOR ──────────────────────────────────────────────────────
function PizzaCalc() {
  const [doughType,    setDoughType]    = useState("yeast");
  const [ovenType,     setOvenType]     = useState("home");
  const [pizzaCount,   setPizzaCount]   = useState(4);
  const [ballWeight,   setBallWeight]   = useState(270);
  const [hydration,    setHydration]    = useState(60);
  const [showToppings, setShowToppings] = useState(false);
  const [copied,       setCopied]       = useState(false);

  const oven = PIZZA_OVENS.find(o => o.id === ovenType);

  // When oven changes, update default ball weight
  useEffect(() => {
    setBallWeight(PIZZA_OVENS.find(o => o.id===ovenType)?.defaultWeight || 270);
  }, [ovenType]);

  const pizza = useMemo(() => {
    const totalDough   = pizzaCount * ballWeight;
    const yeastPct     = doughType==="yeast" ? 0.15 : 5;    // % of flour
    const saltPct      = 2;
    const starterOrYeast = yeastPct / 100;
    const flour = totalDough / (1 + hydration/100 + saltPct/100 + starterOrYeast);
    const water = flour * hydration / 100;
    const salt  = flour * saltPct  / 100;
    const yeast         = flour * 0.0015;   // fresh yeast
    const yeastDry      = flour * 0.0005;   // dry yeast
    const starter       = flour * 0.05;     // sourdough 5%
    // Toppings per pizza (Margherita)
    const mozzarella    = 80 * pizzaCount;
    const tomatoSauce   = 60 * pizzaCount;
    const oliveOil      = 6  * pizzaCount;
    const basil         = 10 * pizzaCount;
    const basilPots     = Math.ceil(basil / 80);
    return { totalDough, flour, water, salt, yeast, yeastDry, starter, mozzarella, tomatoSauce, oliveOil, basil, basilPots };
  }, [pizzaCount, ballWeight, hydration, doughType]);

  const hLevel = getHydrationLevel(hydration);

  const getShoppingList = () => {
    const lines = [
      `🍕 Pizza Dough — ${pizzaCount} pizza${pizzaCount>1?"s":""}`,
      ``,
      `🌾 Flour (bread flour or 00): ${fmt(pizza.flour)}g`,
      `💧 Water: ${fmt(pizza.water)}g`,
      `🧂 Salt: ${fmt(pizza.salt)}g`,
      doughType==="yeast"
        ? `🍺 Fresh yeast: ${fmt2(pizza.yeast)}g  (or dry: ${fmt2(pizza.yeastDry)}g)`
        : `🧫 Sourdough starter: ${fmt(pizza.starter)}g`,
      ``,
      showToppings ? `🍅 Tomato sauce: ${pizza.tomatoSauce}g` : null,
      showToppings ? `🧀 Mozzarella: ${pizza.mozzarella}g` : null,
      showToppings ? `🫒 Olive oil: ${pizza.oliveOil}ml` : null,
      showToppings ? `🌿 Basil leaves: ${pizza.basil} (≈ ${pizza.basilPots} pot${pizza.basilPots>1?"s":""})` : null,
    ].filter(Boolean);
    return lines.join("\n");
  };

  return (
    <div>
      {/* Dough type */}
      <div style={{ fontFamily:BODY, fontSize:11, color:C.faint, letterSpacing:1.6, textTransform:"uppercase", marginBottom:10 }}>Dough Type</div>
      <div style={{ display:"flex", background:C.card, borderRadius:12, padding:4, marginBottom:20, border:`1px solid ${C.border}` }}>
        {[["yeast","🍺 Yeast","Always works, beginner-friendly"],["sourdough","🧫 Sourdough","Great flavor, longer process"]].map(([id,lbl,sub]) => (
          <button key={id} onClick={() => setDoughType(id)} style={{
            flex:1, padding:"10px 6px", borderRadius:9, border:"none", cursor:"pointer",
            background: doughType===id ? C.accent : "transparent",
            color: doughType===id ? "#fff" : C.sub,
            fontFamily:BODY, fontSize:13, fontWeight:600, transition:"all 0.18s",
          }}>
            <div>{lbl}</div>
            <div style={{ fontSize:10, fontWeight:400, marginTop:2, opacity:0.8 }}>{sub}</div>
          </button>
        ))}
      </div>

      {/* Oven type */}
      <div style={{ fontFamily:BODY, fontSize:11, color:C.faint, letterSpacing:1.6, textTransform:"uppercase", marginBottom:10 }}>Your Oven</div>
      <div style={{ display:"flex", gap:8, marginBottom:12 }}>
        {PIZZA_OVENS.map(o => (
          <button key={o.id} onClick={() => setOvenType(o.id)} style={{
            flex:1, padding:"10px 6px", borderRadius:12, cursor:"pointer", textAlign:"center",
            border:`1px solid ${ovenType===o.id ? C.accent : C.border}`,
            background: ovenType===o.id ? `${C.accent}18` : C.card,
            color: ovenType===o.id ? C.accent : C.sub, fontFamily:BODY, fontSize:12, lineHeight:1.4,
          }}>{o.name}<br/><span style={{ fontSize:10, color:C.faint }}>{o.temp}</span></button>
        ))}
      </div>
      <div style={{ fontFamily:BODY, fontSize:13, color:C.sub, fontStyle:"italic", marginBottom:20, padding:"10px 14px", background:`${C.accent}0A`, borderRadius:10, border:`1px solid ${C.accent}20` }}>
        💡 {oven?.tip}
      </div>

      {/* Count + weight */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:20 }}>
        <div>
          <div style={{ fontFamily:BODY, fontSize:13, color:C.sub, marginBottom:8 }}>Pizzas</div>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", background:C.card, border:`1px solid ${C.border}`, borderRadius:12, padding:"10px 12px" }}>
            <button onClick={() => setPizzaCount(Math.max(1,pizzaCount-1))} style={{ background:"transparent", border:"none", color:C.sub, fontSize:22, cursor:"pointer", userSelect:"none" }}>−</button>
            <span style={{ fontFamily:SERIF, fontSize:26, color:C.accent, fontWeight:700 }}>{pizzaCount}</span>
            <button onClick={() => setPizzaCount(Math.min(20,pizzaCount+1))} style={{ background:"transparent", border:"none", color:C.sub, fontSize:22, cursor:"pointer", userSelect:"none" }}>+</button>
          </div>
          <div style={{ fontFamily:BODY, fontSize:11, color:C.faint, marginTop:5, textAlign:"center" }}>
            {pizzaCount===1?"Solo!":pizzaCount===2?"Date night 🍷":pizzaCount<=4?"Pizza party 🎉":pizzaCount<=8?"Big gathering!":"Full bakery mode!"}
          </div>
        </div>
<div style={{ minWidth: 5 }}>
  <div style={{ fontFamily:BODY, fontSize:13, color:C.sub, marginBottom:8 }}>Grams / pizza</div>
  <NumInput value={ballWeight} onChange={setBallWeight} step={10} min={150} unit="g" />
          <div style={{ fontFamily:BODY, fontSize:11, color:C.faint, marginTop:5, textAlign:"center" }}>
            {ovenType==="home" ? "250–290g for home" : "260–350g for pro"}
          </div>
        </div>
      </div>

      {/* Hydration */}
      <div style={{ background:C.card, borderRadius:16, padding:"20px 18px", border:`1px solid ${C.border}`, marginBottom:20 }}>
        <Slider label="Hydration" value={hydration} onChange={setHydration} min={55} max={75} sublabel={`— ${hLevel.label}`} />
        <div style={{ display:"flex", alignItems:"center", gap:10, marginTop:-8, padding:"8px 12px", background:`${hLevel.color}15`, borderRadius:8, border:`1px solid ${hLevel.color}30` }}>
          <span style={{ fontFamily:BODY, fontSize:13, color:hLevel.color, fontWeight:600 }}>{hLevel.label}</span>
          <span style={{ fontFamily:BODY, fontSize:13, color:C.sub }}>{hLevel.desc}</span>
        </div>
      </div>

      {/* Results */}
      <div style={{ background:`linear-gradient(145deg,#28180A,#201205)`, border:`1px solid ${C.accent}35`, borderRadius:20, padding:"20px" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
          <span style={{ fontFamily:BODY, fontSize:11, color:C.accent, textTransform:"uppercase", letterSpacing:1.5 }}>
            {pizzaCount} Pizza{pizzaCount>1?"s":""} — {fmt(pizza.totalDough)}g total
          </span>
          <CopyButton getText={getShoppingList} />
        </div>
        {[
          ["🌾 Flour (bread or 00)", `${fmt(pizza.flour)}g`],
          ["💧 Water",               `${fmt(pizza.water)}g`],
          ["🧂 Salt",                `${fmt(pizza.salt)}g`],
        ].map(([lbl,val]) => (
          <div key={lbl} style={{ display:"flex", justifyContent:"space-between", padding:"11px 0", borderBottom:`1px solid ${C.border}` }}>
            <span style={{ fontFamily:BODY, fontSize:15, color:C.text }}>{lbl}</span>
            <span style={{ fontFamily:SERIF, fontSize:17, color:C.text }}>{val}</span>
          </div>
        ))}
        {doughType==="yeast" ? (
          <div style={{ padding:"11px 0", borderBottom:`1px solid ${C.border}` }}>
            <div style={{ display:"flex", justifyContent:"space-between" }}>
              <span style={{ fontFamily:BODY, fontSize:15, color:C.text }}>🍺 Fresh yeast</span>
              <span style={{ fontFamily:SERIF, fontSize:17, color:C.text }}>{fmt2(pizza.yeast)}g</span>
            </div>
            <div style={{ display:"flex", justifyContent:"space-between", marginTop:4 }}>
              <span style={{ fontFamily:BODY, fontSize:13, color:C.faint }}>  or dry yeast</span>
              <span style={{ fontFamily:BODY, fontSize:13, color:C.faint }}>{fmt2(pizza.yeastDry)}g</span>
            </div>
          </div>
        ) : (
          <div style={{ display:"flex", justifyContent:"space-between", padding:"11px 0", borderBottom:`1px solid ${C.border}` }}>
            <span style={{ fontFamily:BODY, fontSize:15, color:C.text }}>🧫 Active starter</span>
            <span style={{ fontFamily:SERIF, fontSize:17, color:C.text }}>{fmt(pizza.starter)}g</span>
          </div>
        )}
        <div style={{ paddingTop:14, display:"flex", justifyContent:"space-between" }}>
          <span style={{ fontFamily:BODY, fontSize:15, color:C.accent }}>Total dough</span>
          <span style={{ fontFamily:SERIF, fontSize:22, color:C.accent, fontWeight:700 }}>{fmt(pizza.totalDough)}g</span>
        </div>
      </div>

      {/* Margherita toppings */}
      <div style={{ marginTop:16, background:C.card, border:`1px solid ${C.border}`, borderRadius:16, overflow:"hidden" }}>
        <button onClick={() => setShowToppings(!showToppings)} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", width:"100%", padding:"14px 16px", background:"transparent", border:"none", cursor:"pointer" }}>
          <span style={{ fontFamily:SERIF, fontSize:16, color:C.text, fontWeight:600 }}>🍅 Margherita Toppings</span>
          <span style={{ color:C.faint, fontSize:18, transform: showToppings?"rotate(90deg)":"none", transition:"transform 0.2s" }}>›</span>
        </button>
        {showToppings && (
          <div style={{ borderTop:`1px solid ${C.border}`, padding:"14px 16px" }}>
            {[
              ["🧀 Mozzarella",   `${pizza.mozzarella}g`],
              ["🍅 Tomato sauce", `${pizza.tomatoSauce}g`],
              ["🫒 Olive oil",    `${pizza.oliveOil}ml`],
              ["🌿 Basil leaves", `${pizza.basil}  (≈ ${pizza.basilPots} pot${pizza.basilPots>1?"s":""})`],
            ].map(([lbl,val]) => (
              <div key={lbl} style={{ display:"flex", justifyContent:"space-between", marginBottom:10 }}>
                <span style={{ fontFamily:BODY, fontSize:15, color:C.text }}>{lbl}</span>
                <span style={{ fontFamily:SERIF, fontSize:15, color:C.text }}>{val}</span>
              </div>
            ))}
            <p style={{ fontFamily:BODY, fontSize:13, color:C.sub, fontStyle:"italic", marginTop:4 }}>
              80g mozzarella · 60g sauce · 6ml oil · 10 basil leaves per pizza
            </p>
          </div>
        )}
      </div>

      {/* Pro tips */}
      <div style={{ marginTop:16, background:`${C.accent}0D`, border:`1px solid ${C.accent}28`, borderRadius:16, padding:"16px" }}>
        <div style={{ fontFamily:BODY, fontSize:11, color:C.accent, textTransform:"uppercase", letterSpacing:1.5, marginBottom:12 }}>Pro Tips</div>
        {[
          ["🕐","Slow fermentation is your secret weapon","Low yeast or sourdough + long, cold rise dramatically improves flavor and stretch."],
          ["🌡️","High heat is essential","Preheat as hot as possible. A pizza stone or steel baking on top rack is ideal."],
          ["🤌","Less is more with toppings","A few quality ingredients beat a mountain of toppings every time."],
        ].map(([icon,title,body]) => (
          <div key={title} style={{ display:"flex", gap:12, marginBottom:12 }}>
            <span style={{ fontSize:20, flexShrink:0 }}>{icon}</span>
            <div>
              <div style={{ fontFamily:BODY, fontSize:14, color:C.text, fontWeight:600, marginBottom:3 }}>{title}</div>
              <div style={{ fontFamily:BODY, fontSize:13, color:C.sub, lineHeight:1.55 }}>{body}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── STARTER CALCULATOR ────────────────────────────────────────────────────
function StarterCalc() {
  const [targetStarter, setTargetStarter] = useState(200);
  const [feedRatio,     setFeedRatio]     = useState(1);

  const starterCalc = useMemo(() => {
    const r = FEED_RATIOS[feedRatio];
    const parts = r.seed + r.flour + r.water;
    return { seed: targetStarter*r.seed/parts, flour: targetStarter*r.flour/parts, water: targetStarter*r.water/parts };
  }, [targetStarter, feedRatio]);

  const getShoppingList = () => [
    `🧫 Starter Feeding`,
    ``,
    `🌱 Seed (existing starter): ${fmt(starterCalc.seed)}g`,
    `🌾 Fresh flour: ${fmt(starterCalc.flour)}g`,
    `💧 Fresh water: ${fmt(starterCalc.water)}g`,
    ``,
    `Ratio: ${FEED_RATIOS[feedRatio].label}`,
    `Result: ${fmt(targetStarter)}g active starter`,
  ].join("\n");

  return (
    <div>
      <SectionTitle title="Starter Planner" sub="Calculate your levain feeding" />

      <div style={{ fontFamily:BODY, fontSize:13, color:C.sub, marginBottom:8 }}>How much active starter do you need?</div>
      <div style={{ marginBottom:24 }}>
        <NumInput value={targetStarter} onChange={setTargetStarter} step={10} min={10} />
      </div>

      <div style={{ fontFamily:BODY, fontSize:11, color:C.faint, letterSpacing:1.6, textTransform:"uppercase", marginBottom:10 }}>Feeding Ratio (seed : flour : water)</div>
      <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:24 }}>
        {FEED_RATIOS.map((r,i) => (
          <button key={r.label} onClick={() => setFeedRatio(i)} style={{
            padding:"8px 14px", borderRadius:20, cursor:"pointer",
            border:`1px solid ${feedRatio===i ? C.accent : C.border}`,
            background: feedRatio===i ? `${C.accent}20` : "transparent",
            color: feedRatio===i ? C.accent : C.sub, fontFamily:BODY, fontSize:13,
          }}>{r.label}</button>
        ))}
      </div>

      <div style={{ background:`linear-gradient(145deg,#281808,#201205)`, border:`1px solid ${C.accent}35`, borderRadius:20, padding:"20px", marginBottom:20 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
          <span style={{ fontFamily:BODY, fontSize:11, color:C.accent, textTransform:"uppercase", letterSpacing:1.5 }}>Feeding Formula</span>
          <CopyButton getText={getShoppingList} />
        </div>
        {[
          ["🌱 Seed (existing starter)", starterCalc.seed],
          ["🌾 Fresh flour",              starterCalc.flour],
          ["💧 Fresh water",              starterCalc.water],
        ].map(([label,val], i, arr) => (
          <div key={label} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"12px 0", borderBottom: i<arr.length-1 ? `1px solid ${C.border}` : "none" }}>
            <span style={{ fontFamily:BODY, fontSize:16, color:C.text }}>{label}</span>
            <span style={{ fontFamily:SERIF, fontSize:18, color:C.text }}>{fmt(val)}g</span>
          </div>
        ))}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", paddingTop:16, marginTop:8, borderTop:`1px solid ${C.accent}30` }}>
          <span style={{ fontFamily:BODY, fontSize:16, color:C.accent }}>✅ Ready starter</span>
          <span style={{ fontFamily:SERIF, fontSize:24, color:C.accent, fontWeight:700 }}>{fmt(targetStarter)}g</span>
        </div>
      </div>

      <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:16, padding:"16px 18px" }}>
        <div style={{ fontFamily:BODY, fontSize:11, color:C.faint, letterSpacing:1.5, textTransform:"uppercase", marginBottom:14 }}>Ratio Reference</div>
        {[
          ["1:1:1",   "Daily maintenance — mild, 6–8 hr peak"],
          ["1:2:2",   "Standard feeding — balanced, 8–12 hr peak"],
          ["1:3:3",   "Moderate — slightly milder, 10–14 hr peak"],
          ["1:5:5",   "Slower rise — complex flavor, 12–16 hr peak"],
          ["1:10:10", "Very slow — plan ahead, 16–24 hr peak"],
        ].map(([ratio,desc]) => (
          <div key={ratio} style={{ display:"flex", gap:12, marginBottom:10 }}>
            <span style={{ fontFamily:BODY, fontSize:13, color:C.accent, minWidth:56, fontWeight:600 }}>{ratio}</span>
            <span style={{ fontFamily:BODY, fontSize:13, color:C.sub }}>{desc}</span>
          </div>
        ))}
        <div style={{ marginTop:14, paddingTop:14, borderTop:`1px solid ${C.border}`, fontFamily:BODY, fontSize:13, color:C.sub, lineHeight:1.6, fontStyle:"italic" }}>
          💡 Tip: A stiff starter (50–60% hydration) enhances yeast activity and is preferred by many bakers for wheat sourdough. Use half the water shown above.
        </div>
      </div>
    </div>
  );
}

// ─── CALC TAB (wrapper) ────────────────────────────────────────────────────
function CalcTab({ initialMode }) {
  const [mode, setMode] = useState(initialMode || "bread");
  const modes = [["bread","⚖️ Bread"],["pizza","🍕 Pizza"],["starter","🧫 Starter"]];

  return (
    <div style={{ padding:"0 16px 24px" }} className="fade-up">
      {/* Mode toggle */}
      <div style={{ display:"flex", background:C.card, borderRadius:14, padding:4, marginBottom:24, border:`1px solid ${C.border}` }}>
        {modes.map(([id,lbl]) => (
          <button key={id} onClick={() => setMode(id)} style={{
            flex:1, padding:"10px 4px", borderRadius:11, border:"none", cursor:"pointer",
            fontFamily:BODY, fontSize:13, fontWeight:600,
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

// ─── RECIPES TAB ───────────────────────────────────────────────────────────
function RecipesTab() {
  const [selected, setSelected] = useState(null);
  const [scale,    setScale]    = useState(1);

  if (selected) {
    const r = RECIPES.find(x => x.id===selected);
    const s = g => fmt(g * scale);
    return (
      <div style={{ padding:"0 16px 32px" }} className="fade-up">
        <button onClick={() => { setSelected(null); setScale(1); }} style={{ display:"flex", alignItems:"center", gap:6, background:"transparent", border:"none", color:C.sub, fontFamily:BODY, fontSize:15, cursor:"pointer", marginBottom:20, padding:0 }}>
          ← All Recipes
        </button>
        <div style={{ marginBottom:22 }}>
          <div style={{ fontSize:50, marginBottom:10 }}>{r.emoji}</div>
          <h2 style={{ fontFamily:SERIF, fontSize:26, fontWeight:700, color:C.text, lineHeight:1.2 }}>{r.name}</h2>
          <p style={{ fontFamily:BODY, fontSize:15, color:C.sub, fontStyle:"italic", marginTop:4 }}>{r.sub}</p>
          <div style={{ display:"flex", gap:8, marginTop:12, flexWrap:"wrap" }}>
            <DiffDots level={r.difficulty} />
            <Pill>{r.diffLabel}</Pill>
            <Pill color={C.sub}>⏱ {r.totalTime}</Pill>
            <Pill color={C.blue}>💧 {r.hydration}%</Pill>
          </div>
        </div>
        {/* Scale */}
        <div style={{ background:C.card, borderRadius:12, padding:"10px 14px", marginBottom:22, border:`1px solid ${C.border}`, display:"flex", alignItems:"center", gap:10, flexWrap:"wrap" }}>
          <span style={{ fontFamily:BODY, fontSize:13, color:C.sub }}>Scale:</span>
          <div style={{ display:"flex", gap:6 }}>
            {[0.5,1,1.5,2,3].map(sv => (
              <button key={sv} onClick={() => setScale(sv)} style={{ padding:"6px 11px", borderRadius:8, cursor:"pointer", border:`1px solid ${scale===sv?C.accent:C.border}`, background: scale===sv?`${C.accent}22`:"transparent", color: scale===sv?C.accent:C.sub, fontFamily:BODY, fontSize:13 }}>{sv}×</button>
            ))}
          </div>
        </div>
        {/* Ingredients */}
        <div style={{ fontFamily:BODY, fontSize:11, color:C.faint, letterSpacing:1.5, textTransform:"uppercase", marginBottom:10 }}>Ingredients</div>
        <div style={{ background:C.card, borderRadius:16, border:`1px solid ${C.border}`, overflow:"hidden", marginBottom:22 }}>
          {r.ingredients.map((ing,i) => (
            <div key={i} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"13px 16px", borderBottom: i<r.ingredients.length-1?`1px solid ${C.border}`:"none" }}>
              <span style={{ fontFamily:BODY, fontSize:15, color:C.text }}>{ing.name}</span>
              <span style={{ fontFamily:SERIF, fontSize:15, color:C.accent, fontWeight:600, marginLeft:8, whiteSpace:"nowrap" }}>
                {ing.unit ? `${s(ing.amount)}${ing.unit}` : `×${ing.amount}`}
              </span>
            </div>
          ))}
        </div>
        {/* Steps */}
        <div style={{ fontFamily:BODY, fontSize:11, color:C.faint, letterSpacing:1.5, textTransform:"uppercase", marginBottom:12 }}>Instructions</div>
        {r.steps.map(([title,desc],i) => (
          <div key={i} style={{ display:"flex", gap:14, marginBottom:16 }}>
            <div style={{ width:32,height:32,borderRadius:"50%",background:`${C.accent}20`,border:`1px solid ${C.accent}45`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:2 }}>
              <span style={{ fontFamily:SERIF, fontSize:13, color:C.accent, fontWeight:700 }}>{i+1}</span>
            </div>
            <div style={{ flex:1, paddingTop:4 }}>
              <div style={{ fontFamily:SERIF, fontSize:16, color:C.text, fontWeight:700, marginBottom:5 }}>{title}</div>
              <p style={{ fontFamily:BODY, fontSize:14, color:C.sub, lineHeight:1.7 }}>{desc}</p>
            </div>
          </div>
        ))}
        {/* Tips */}
        <div style={{ background:`${C.accent}0D`, border:`1px solid ${C.accent}25`, borderRadius:16, padding:"16px 18px", marginTop:4 }}>
          <div style={{ fontFamily:BODY, fontSize:11, color:C.accent, textTransform:"uppercase", letterSpacing:1.5, marginBottom:12 }}>Baker's Tips</div>
          {r.tips.map((tip,i) => (
            <div key={i} style={{ display:"flex", gap:10, marginBottom:11 }}>
              <span style={{ color:C.accent, fontSize:15, flexShrink:0 }}>✦</span>
              <p style={{ fontFamily:BODY, fontSize:14, color:C.sub, lineHeight:1.65 }}>{tip}</p>
            </div>
          ))}
        </div>
        <PageFooter />
      </div>
    );
  }

  return (
    <div style={{ padding:"0 16px 24px" }} className="fade-up">
      <SectionTitle title="Recipes" sub="From beginner to artisan" />
      {RECIPES.map(r => (
        <button key={r.id} onClick={() => setSelected(r.id)}
          style={{ display:"block", width:"100%", textAlign:"left", background:C.card, border:`1px solid ${C.border}`, borderRadius:16, padding:"16px", marginBottom:10, cursor:"pointer", transition:"border-color 0.18s" }}
          onMouseEnter={e => e.currentTarget.style.borderColor = `${C.accent}60`}
          onMouseLeave={e => e.currentTarget.style.borderColor = C.border}
        >
          <div style={{ display:"flex", alignItems:"flex-start", gap:12 }}>
            <span style={{ fontSize:38, lineHeight:1 }}>{r.emoji}</span>
            <div style={{ flex:1 }}>
              <div style={{ display:"flex", justifyContent:"space-between" }}>
                <div>
                  <h3 style={{ fontFamily:SERIF, fontSize:16, color:C.text, fontWeight:700 }}>{r.name}</h3>
                  <p style={{ fontFamily:BODY, fontSize:13, color:C.sub, fontStyle:"italic", marginTop:2 }}>{r.sub}</p>
                </div>
                <span style={{ color:C.faint, fontSize:18 }}>›</span>
              </div>
              <div style={{ display:"flex", gap:8, marginTop:10, flexWrap:"wrap", alignItems:"center" }}>
                <DiffDots level={r.difficulty} />
                <Pill small>{r.diffLabel}</Pill>
                <Pill small color={C.sub}>⏱ {r.totalTime}</Pill>
                <Pill small color={C.blue}>💧 {r.hydration}%</Pill>
              </div>
            </div>
          </div>
        </button>
      ))}
      <PageFooter />
    </div>
  );
}

// ─── GUIDE TAB ─────────────────────────────────────────────────────────────
function GuideTab() {
  const [open,   setOpen]   = useState(null);
  const [checks, setChecks] = useState({});
  const toggleCheck = (sid,idx) => { const k=`${sid}-${idx}`; setChecks(p=>({...p,[k]:!p[k]})); };

  return (
    <div style={{ padding:"0 16px 24px" }} className="fade-up">
      <SectionTitle title="Process Guide" sub="6 steps from starter to loaf" />
      {/* Progress strip */}
      <div style={{ display:"flex", alignItems:"center", marginBottom:24, overflowX:"auto", paddingBottom:4 }}>
        {GUIDE.map((step,i) => (
          <div key={step.id} style={{ display:"flex", alignItems:"center", flexShrink:0 }}>
            <div onClick={() => setOpen(open===step.id ? null : step.id)} style={{ width:38,height:38,borderRadius:"50%",background:`${step.color}28`,border:`2px solid ${open===step.id?step.color:step.color+"50"}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,cursor:"pointer",transition:"border-color 0.2s" }}>
              {step.emoji}
            </div>
            {i<GUIDE.length-1 && <div style={{ width:22, height:2, background:C.border, margin:"0 2px" }} />}
          </div>
        ))}
      </div>
      {GUIDE.map(step => (
        <div key={step.id} style={{ marginBottom:10 }}>
          <button onClick={() => setOpen(open===step.id ? null : step.id)} style={{ display:"block", width:"100%", textAlign:"left", cursor:"pointer", background:C.card, border:`1px solid ${open===step.id?step.color:C.border}`, borderRadius: open===step.id?"16px 16px 0 0":16, padding:"14px 16px", transition:"border-color 0.2s" }}>
            <div style={{ display:"flex", alignItems:"center", gap:12 }}>
              <div style={{ width:44,height:44,borderRadius:12,background:`${step.color}20`,border:`1px solid ${step.color}40`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0 }}>{step.emoji}</div>
              <div style={{ flex:1 }}>
                <div style={{ fontFamily:BODY, fontSize:11, color:C.faint, marginBottom:2 }}>{step.phase}</div>
                <div style={{ fontFamily:SERIF, fontSize:16, color:C.text, fontWeight:700 }}>{step.title}</div>
              </div>
              <span style={{ color:C.faint, fontSize:18, transform:open===step.id?"rotate(90deg)":"none", transition:"transform 0.2s" }}>›</span>
            </div>
          </button>
          {open===step.id && (
            <div style={{ background:`${step.color}08`, border:`1px solid ${step.color}`, borderTop:"none", borderRadius:"0 0 16px 16px", padding:"16px 18px 20px" }}>
              <p style={{ fontFamily:BODY, fontSize:14, color:C.text, lineHeight:1.75, marginBottom:18 }}>{step.body}</p>
              <div style={{ fontFamily:BODY, fontSize:11, color:step.color, textTransform:"uppercase", letterSpacing:1.3, marginBottom:12 }}>Checklist</div>
              {step.checks.map((c,i) => {
                const done = !!checks[`${step.id}-${i}`];
                return (
                  <div key={i} onClick={() => toggleCheck(step.id,i)} style={{ display:"flex", gap:12, marginBottom:10, cursor:"pointer", alignItems:"flex-start" }}>
                    <div style={{ width:20,height:20,borderRadius:5,border:`1px solid ${done?step.color:C.border}`,background:done?`${step.color}28`:"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:1 }}>
                      {done && <span style={{ fontSize:12, color:step.color }}>✓</span>}
                    </div>
                    <span style={{ fontFamily:BODY, fontSize:14, color:done?C.faint:C.text, lineHeight:1.5, textDecoration:done?"line-through":"none" }}>{c}</span>
                  </div>
                );
              })}
              <div style={{ marginTop:16, padding:"12px 14px", borderRadius:12, background:`${C.accent}10`, border:`1px solid ${C.accent}22` }}>
                <span style={{ fontFamily:BODY, fontSize:14, color:C.sub, fontStyle:"italic", lineHeight:1.6 }}>💡 {step.tip}</span>
              </div>
              {step.timers && step.timers.length > 0 && (
                <div style={{ marginTop:16 }}>
                  <div style={{ fontFamily:BODY, fontSize:11, color:step.color, textTransform:"uppercase", letterSpacing:1.3, marginBottom:10 }}>Step Timers</div>
                  {step.timers.map((t, i) => (
                    <StepTimer key={i} label={t.label} minutes={t.minutes} />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      ))}
      {/* Baker's math */}
      <div style={{ marginTop:22, background:C.card, border:`1px solid ${C.border}`, borderRadius:16, padding:"18px" }}>
        <div style={{ fontFamily:SERIF, fontSize:18, color:C.text, fontWeight:700, marginBottom:12 }}>Baker's Math</div>
        <p style={{ fontFamily:BODY, fontSize:14, color:C.sub, lineHeight:1.75, marginBottom:14 }}>All ingredient quantities are expressed as percentages of the flour weight. Flour is always 100%. This makes scaling any recipe effortless.</p>
        {[
          ["Flour", "100%",                    "Always the base"],
          ["Water", "Water ÷ Flour × 100",     "e.g. 375g ÷ 500g = 75%"],
          ["Starter","Starter ÷ Flour × 100",  "e.g. 100g ÷ 500g = 20%"],
          ["Salt",  "Salt ÷ Flour × 100",      "Typically 1.8–2.2%"],
        ].map(([n,f,ex]) => (
          <div key={n} style={{ borderTop:`1px solid ${C.border}`, paddingTop:12, marginBottom:12 }}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:3 }}>
              <span style={{ fontFamily:BODY, fontSize:14, color:C.text, fontWeight:600 }}>{n}</span>
              <span style={{ fontFamily:BODY, fontSize:12, color:C.accent }}>{f}</span>
            </div>
            <div style={{ fontFamily:BODY, fontSize:12, color:C.faint, fontStyle:"italic" }}>{ex}</div>
          </div>
        ))}
      </div>
      <PageFooter />
    </div>
  );
}

// ─── TROUBLESHOOT TAB ──────────────────────────────────────────────────────
function TroubleTab() {
  const [open, setOpen] = useState(null);
  return (
    <div style={{ padding:"0 16px 24px" }} className="fade-up">
      <SectionTitle title="Troubleshoot" sub="Diagnose and fix your bake" />
      {TROUBLE.map((t,i) => (
        <div key={i} style={{ marginBottom:10 }}>
          <button onClick={() => setOpen(open===i?null:i)} style={{ display:"block", width:"100%", textAlign:"left", cursor:"pointer", background:C.card, border:`1px solid ${open===i?C.red:C.border}`, borderRadius: open===i?"14px 14px 0 0":14, padding:"13px 16px" }}>
            <div style={{ display:"flex", alignItems:"center", gap:12 }}>
              <span style={{ fontSize:24 }}>{t.emoji}</span>
              <span style={{ fontFamily:SERIF, fontSize:15, color:C.text, fontWeight:700, flex:1 }}>{t.problem}</span>
              <span style={{ color:C.faint, fontSize:18, transform:open===i?"rotate(90deg)":"none", transition:"transform 0.2s" }}>›</span>
            </div>
          </button>
          {open===i && (
            <div style={{ background:`${C.red}08`, border:`1px solid ${C.red}40`, borderTop:"none", borderRadius:"0 0 14px 14px", padding:"14px 16px" }}>
              <div style={{ fontFamily:BODY, fontSize:11, color:C.red, textTransform:"uppercase", letterSpacing:1.3, marginBottom:10 }}>Likely Causes</div>
              {t.causes.map((c,j) => (
                <div key={j} style={{ display:"flex", gap:10, marginBottom:8 }}>
                  <span style={{ color:C.red, fontSize:14, marginTop:1 }}>•</span>
                  <span style={{ fontFamily:BODY, fontSize:14, color:C.sub }}>{c}</span>
                </div>
              ))}
              <div style={{ fontFamily:BODY, fontSize:11, color:C.green, textTransform:"uppercase", letterSpacing:1.3, margin:"14px 0 10px" }}>How to Fix</div>
              {t.fixes.map((f,j) => (
                <div key={j} style={{ display:"flex", gap:10, marginBottom:8 }}>
                  <span style={{ color:C.green, fontSize:14, marginTop:1 }}>✓</span>
                  <span style={{ fontFamily:BODY, fontSize:14, color:C.sub }}>{f}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
      {/* Glossary */}
      <div style={{ marginTop:22, background:C.card, border:`1px solid ${C.border}`, borderRadius:16, padding:"18px" }}>
        <div style={{ fontFamily:SERIF, fontSize:18, color:C.text, fontWeight:700, marginBottom:14 }}>Quick Glossary</div>
        {[
          ["Levain / Starter","A live culture of wild yeast and bacteria. The leavening agent for all sourdough baking."],
          ["Bulk fermentation","The main fermentation phase where the whole dough mass ferments together, typically 4–8 hours."],
          ["Autolyse","Resting flour and water without starter for passive gluten development."],
          ["Hydration","Water as a percentage of flour weight. Higher = wetter dough, more open crumb."],
          ["Banneton","A proofing basket (cane or wood pulp) that supports the dough's shape while proofing."],
          ["Oven spring","The rapid rise in the first minutes of baking as gases expand from heat."],
          ["Scoring","Cutting dough surface with a razor/lame before baking to control how it opens."],
          ["Windowpane test","Stretching dough thin enough to see light through — confirms good gluten development."],
        ].map(([term,def]) => (
          <div key={term} style={{ borderTop:`1px solid ${C.border}`, paddingTop:11, marginBottom:11 }}>
            <div style={{ fontFamily:BODY, fontSize:14, color:C.accent, fontWeight:600, marginBottom:3 }}>{term}</div>
            <div style={{ fontFamily:BODY, fontSize:13, color:C.sub, lineHeight:1.65 }}>{def}</div>
          </div>
        ))}
      </div>
      <PageFooter />
    </div>
  );
}

// ─── MAIN APP ──────────────────────────────────────────────────────────────
const TABS = [
  { id:"home",    icon:"🏠", label:"Home"       },
  { id:"calc",    icon:"⚖️", label:"Calculator" },
  { id:"recipes", icon:"📖", label:"Recipes"    },
  { id:"guide",   icon:"🎓", label:"Guide"      },
  { id:"trouble", icon:"🔧", label:"Fix"        },
];

// Pizza and Starter get their own tabs from home nav but are rendered inside CalcTab
export default function App() {
  const [tab, setTab] = useState("home");

  const setTabProxy = (t) => {
    // "starter" → open calc in starter mode via a param
    if (t === "starter") { setTab("calc"); setPizzaMode("starter"); }
    else if (t === "pizza") { setTab("pizza"); }
    else setTab(t);
  };

  const [pizzaMode, setPizzaMode] = useState("bread");

  // When tab changes to calc, reset mode to bread unless explicitly set
  const calcMode = tab === "pizza" ? "pizza" : pizzaMode;

  const renderContent = () => {
    switch(tab) {
      case "home":    return <HomeTab setTab={setTabProxy} />;
      case "calc":    return <CalcTab initialMode={calcMode} />;
      case "pizza":   return <CalcTab initialMode="pizza" />;
      case "recipes": return <RecipesTab />;
      case "guide":   return <GuideTab />;
      case "trouble": return <TroubleTab />;
      default:        return <HomeTab setTab={setTabProxy} />;
    }
  };

  return (
    <div style={{ minHeight:"100vh", background:C.bg, display:"flex", justifyContent:"center", fontFamily:BODY }}>
      <div style={{ width:"100%", maxWidth:430, display:"flex", flexDirection:"column", minHeight:"100vh" }}>

        {/* Header */}
        <div style={{ padding:"14px 18px 12px", borderBottom:`1px solid ${C.border}`, background:`${C.bg}F2`, backdropFilter:"blur(12px)", position:"sticky", top:0, zIndex:20, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <span style={{ fontSize:24 }}>🍞</span>
            <span style={{ fontFamily:SERIF, fontSize:22, color:C.text, fontWeight:700, letterSpacing:-0.3 }}>Levain</span>
          </div>
          <span style={{ fontFamily:BODY, fontSize:11, color:C.faint, letterSpacing:1.3, textTransform:"uppercase" }}>Sourdough App</span>
        </div>

        {/* Content */}
        <div style={{ flex:1, overflowY:"auto", paddingTop:20 }} className="ls">
          {renderContent()}
        </div>

        {/* Bottom nav */}
        <div style={{ display:"flex", borderTop:`1px solid ${C.border}`, background:`${C.surf}F5`, backdropFilter:"blur(12px)", position:"sticky", bottom:0, paddingBottom:"max(env(safe-area-inset-bottom,0px),6px)" }}>
          {TABS.map(t => {
            const active = t.id === tab || (t.id === "calc" && (tab === "calc" || tab === "pizza"));
            return (
              <button key={t.id} onClick={() => { setTab(t.id); if(t.id==="calc") setPizzaMode("bread"); }} style={{ flex:1, paddingTop:10, paddingBottom:6, background:"transparent", border:"none", cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", gap:2 }}>
                <span style={{ fontSize:18, filter: active?"none":"grayscale(80%) opacity(55%)", transition:"filter 0.18s" }}>{t.icon}</span>
                <span style={{ fontFamily:BODY, fontSize:9, letterSpacing:0.3, color: active?C.accent:C.faint, fontWeight: active?700:400 }}>{t.label}</span>
                {active && <div style={{ width:16, height:2, borderRadius:1, background:C.accent }} />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}