/* =====================================================================
   ✏️ EDIT EVERYTHING HERE — you shouldn't need to touch anything below
   ===================================================================== */

// 1️⃣ & 2️⃣ PHOTOS — just replace the files in /images/ (same names),
//    or change the file names here. Used on every screen automatically.
const IMAGES = {
  main:        "images/girlfriend.jpg", // password screen + question screen
  celebration: "images/couple.jpg",     // shown after she taps YES
  heart:       "images/heart.png"       // loading heart
};

const CONFIG = {
  girlfriendName: "My Love",            // 4️⃣ HER NAME (change this!)
  password: "031424",                   // 3️⃣ THE PASSWORD

  lockTitle:   "Hi {name} 💖",          // {name} is replaced with her name
  lockPrompt:  "Enter the secret password 💕",
  unlockText:  "Unlock ❤️",
  wrongText:   "Hmm… 🤨",               // shown on a wrong password

  question:    "Are you really my girlfriend? ❤️",
  yesText:     "YES ❤️",
  noText:      "NO 😭",

  // 6️⃣ NO-BUTTON MESSAGES — shown one by one each time she tries to tap NO
  noMessages: [
    "Are you sure? 🥺",
    "Think again! 😭",
    "Nope, you can't choose that 😭❤️",
    "Nice try 😭",
    "The button has escaped!",
    "You know the correct answer 😌❤️",
    "Just press YES already 🥹",
    "I can do this all day 😤💕"
  ],

  yesTitle:    "I KNEW IT! ❤️😭",
  // 5️⃣ THE FINAL ROMANTIC MESSAGE
  finalMessage: "I love you so much, and I'm really happy you're mine. ❤️",

  sound: true                           // little chime when she taps YES
};

/* =====================================================================
   Code below — no need to edit
   ===================================================================== */
const $ = s => document.querySelector(s);
const FALLBACK = "data:image/svg+xml;utf8," + encodeURIComponent(
  "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>💖</text></svg>");

// images
document.querySelectorAll("img[data-img]").forEach(img => {
  img.onerror = () => { img.onerror = null; img.src = FALLBACK; };
  img.src = IMAGES[img.dataset.img];
});

// texts
$("#lockTitle").textContent = CONFIG.lockTitle.replace("{name}", CONFIG.girlfriendName);
$("#lockPrompt").textContent = CONFIG.lockPrompt;
$("#unlock").textContent = CONFIG.unlockText;
$("#toast").textContent = CONFIG.wrongText;
$("#question").textContent = CONFIG.question;
$("#yesBtn").textContent = CONFIG.yesText;
$("#noBtn").textContent = CONFIG.noText;
$("#yesTitle").textContent = CONFIG.yesTitle;
$("#finalMsg").textContent = CONFIG.finalMessage;

function show(id) {
  document.querySelectorAll(".screen").forEach(s => s.classList.toggle("active", s.id === id));
}
setTimeout(() => show("lock"), 1600); // cute loading

// floating background hearts
const HEARTS = ["💗", "💖", "💕", "🌸", "🤍", "💞"];
function spawnHeart() {
  const h = document.createElement("span");
  h.className = "fh";
  h.textContent = HEARTS[Math.floor(Math.random() * HEARTS.length)];
  h.style.left = Math.random() * 100 + "vw";
  h.style.fontSize = 14 + Math.random() * 22 + "px";
  h.style.setProperty("--dx", (Math.random() * 80 - 40) + "px");
  h.style.setProperty("--rot", (Math.random() * 60 - 30) + "deg");
  h.style.animationDuration = 8 + Math.random() * 7 + "s";
  $("#hearts").appendChild(h);
  setTimeout(() => h.remove(), 16000);
}
setInterval(spawnHeart, 800);
for (let i = 0; i < 6; i++) setTimeout(spawnHeart, i * 150);

// sound (tiny chime, no audio files needed)
let audio;
function chime() {
  if (!CONFIG.sound) return;
  try {
    audio = audio || new (window.AudioContext || window.webkitAudioContext)();
    [523, 659, 784, 1047].forEach((f, i) => {
      const o = audio.createOscillator(), g = audio.createGain(), t = audio.currentTime + i * 0.13;
      o.type = "sine"; o.frequency.value = f;
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.18, t + 0.03);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.5);
      o.connect(g).connect(audio.destination); o.start(t); o.stop(t + 0.55);
    });
  } catch (e) {}
}

// ---------- password ----------
const pw = $("#pw");
function tryUnlock() {
  try { audio = audio || new (window.AudioContext || window.webkitAudioContext)(); } catch (e) {}
  if (pw.value.trim() === CONFIG.password) {
    pw.blur();
    show("ask");
    setTimeout(initAsk, 700);
  } else {
    const p = $("#lockPhoto"), t = $("#toast");
    p.classList.remove("react"); void p.offsetWidth; p.classList.add("react");
    pw.classList.remove("bad"); void pw.offsetWidth; pw.classList.add("bad");
    t.classList.add("show");
    setTimeout(() => { t.classList.remove("show"); p.classList.remove("react"); }, 1400);
    pw.value = "";
  }
}
$("#unlock").addEventListener("click", tryUnlock);
pw.addEventListener("keydown", e => { if (e.key === "Enter") tryUnlock(); });

// ---------- the escaping NO button ----------
const noBtn = $("#noBtn"), yesBtn = $("#yesBtn"), noSlot = $("#noSlot"), noMsg = $("#noMsg");
let attempts = 0, lastMove = 0, done = false, askReady = false;

function initAsk() { askReady = true; }

function moveNo() {
  const now = Date.now();
  if (done || now - lastMove < 220) return;
  lastMove = now;

  if (!noBtn.classList.contains("escaped")) {      // first escape: keep layout slot, then go fixed
    const r = noBtn.getBoundingClientRect();
    noSlot.style.width = r.width + "px"; noSlot.style.height = r.height + "px";
    noBtn.style.left = r.left + "px"; noBtn.style.top = r.top + "px";
    noBtn.classList.add("escaped");
    void noBtn.offsetWidth;
  }

  noMsg.textContent = CONFIG.noMessages[Math.min(attempts, CONFIG.noMessages.length - 1)];
  attempts++;

  const scale = Math.max(0.4, 1 - attempts * 0.07);
  const w = noBtn.offsetWidth, h = noBtn.offsetHeight;
  const vw = window.innerWidth, vh = window.innerHeight, m = 16;
  const sw = w * scale, sh = h * scale;                       // visible size
  const y = yesBtn.getBoundingClientRect(), pad = 22;
  const cur = noBtn.getBoundingClientRect();
  const ccx = cur.left + cur.width / 2, ccy = cur.top + cur.height / 2;
  const minDist = Math.min(vw, vh) * (0.25 + Math.min(attempts, 8) * 0.03);

  let best = null, bestD = -1;
  for (let i = 0; i < 80; i++) {
    const cx = m + sw / 2 + Math.random() * (vw - 2 * m - sw);
    const cy = m + sh / 2 + Math.random() * (vh - 2 * m - sh);
    const overlapsYes = cx + sw / 2 > y.left - pad && cx - sw / 2 < y.right + pad &&
                        cy + sh / 2 > y.top - pad && cy - sh / 2 < y.bottom + pad;
    if (overlapsYes) continue;
    const d = Math.hypot(cx - ccx, cy - ccy);
    if (d > bestD) { bestD = d; best = [cx, cy]; }
    if (d >= minDist) break;
  }
  if (!best) best = [vw - m - sw / 2, vh - m - sh / 2];       // safe fallback corner

  noBtn.style.left = best[0] - w / 2 + "px";
  noBtn.style.top = best[1] - h / 2 + "px";
  noBtn.style.transform = `scale(${scale}) rotate(${Math.random() * 50 - 25}deg)`;
}

// react on touch/mouse BEFORE the tap can complete
["touchstart", "pointerdown", "mouseenter", "click"].forEach(ev =>
  noBtn.addEventListener(ev, e => { e.preventDefault(); moveNo(); }, { passive: false }));

// also dodge fingers/cursors that get close (fat-finger proof)
function nearNo(e) {
  if (done || !askReady || attempts === 0) return;
  const p = e.touches ? e.touches[0] : e;
  const r = noBtn.getBoundingClientRect();
  const d = Math.hypot(p.clientX - (r.left + r.width / 2), p.clientY - (r.top + r.height / 2));
  if (d < 50 + Math.min(attempts, 8) * 6) moveNo();
}
document.addEventListener("pointermove", nearNo);
document.addEventListener("touchstart", nearNo, { passive: true });

window.addEventListener("resize", () => {            // keep it on-screen after rotate/resize
  if (!noBtn.classList.contains("escaped") || done) return;
  const r = noBtn.getBoundingClientRect();
  noBtn.style.left = Math.max(8, Math.min(r.left, window.innerWidth - r.width - 8)) + "px";
  noBtn.style.top = Math.max(8, Math.min(r.top, window.innerHeight - r.height - 8)) + "px";
});

// ---------- YES ----------
const CONF = ["❤️", "💖", "💕", "💗", "✨", "🌸", "💘"];
function burst(n) {
  const layer = document.createElement("div"); layer.className = "conf-layer"; document.body.appendChild(layer);
  for (let i = 0; i < n; i++) {
    const c = document.createElement("span"); c.className = "conf";
    c.textContent = CONF[Math.floor(Math.random() * CONF.length)];
    c.style.left = Math.random() * 100 + "vw";
    c.style.fontSize = 16 + Math.random() * 26 + "px";
    c.style.setProperty("--dx", (Math.random() * 160 - 80) + "px");
    c.style.setProperty("--rot", (Math.random() * 720 - 360) + "deg");
    c.style.animationDuration = 2.4 + Math.random() * 2.2 + "s";
    c.style.animationDelay = Math.random() * 0.8 + "s";
    layer.appendChild(c);
  }
  setTimeout(() => layer.remove(), 6000);
}
yesBtn.addEventListener("click", () => {
  done = true;
  noBtn.style.visibility = "hidden";
  document.body.classList.add("celebrate");
  show("yes");
  chime(); burst(70);
  setTimeout(() => burst(50), 1500);
  setTimeout(() => burst(40), 3200);
  setInterval(spawnHeart, 350);
});
