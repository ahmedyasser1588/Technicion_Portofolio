const $ = (s) => document.querySelector(s),
  $$ = (s) => [...document.querySelectorAll(s)],
  R = document.documentElement;
// ===== Split the name into letters for the intro animation =====
const h1 = $("#h1");
h1.setAttribute("aria-label", h1.textContent);
let letterNo = 0;
h1.innerHTML = h1.textContent
  .split(" ")
  .map((w) => `<b class="w">${[...w].map((c) => `<span aria-hidden="true" style="--i:${letterNo++}">${c}</span>`).join("")}</b>`)
  .join(" ");
// ===== Hero: flashlight effect follows the mouse =====
$(".hero .b").src = $(".hero .a").src;
const hero = $("#hero");
hero.addEventListener("pointermove", (e) => {
  const r = hero.getBoundingClientRect();
  hero.style.setProperty("--hx", e.clientX - r.left + "px");
  hero.style.setProperty("--hy", e.clientY - r.top + "px");
});
addEventListener(
  "pointermove",
  (e) => {
    R.style.setProperty("--mx", e.clientX + "px");
    R.style.setProperty("--my", e.clientY + "px");
  },
  { passive: true },
);
// ===== Rotating role text in the hero =====
const W = [
    "Panoramic",
    "Cephalometric",
    "CBCT",
    "Implant planning",
    "Endodontic reports",
  ],
  rw = $("#rw");
let wi = 0;
setInterval(() => {
  rw.classList.add("o");
  setTimeout(() => {
    rw.textContent = W[++wi % W.length];
    rw.classList.remove("o");
  }, 350);
}, 2200);
// ===== Scroll progress bar and hero parallax =====
const bar = $("#bar");
const sc = () => {
  const m = R.scrollHeight - innerHeight;
  bar.style.transform = `scaleX(${m ? scrollY / m : 0})`;
  if (scrollY < innerHeight) R.style.setProperty("--py", scrollY * 0.25 + "px");
};
addEventListener("scroll", sc, { passive: true });
sc();
// ===== Reveal elements on scroll and count up the numbers =====
const io = new IntersectionObserver(
  (es) =>
    es.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add("in");
      io.unobserve(e.target);
      const n = e.target.querySelector("[data-n]");
      if (n) {
        const t = +n.dataset.n;
        let v = 0;
        const k = setInterval(() => {
          n.textContent = ++v;
          if (v >= t) clearInterval(k);
        }, 260);
      }
    }),
  { threshold: 0.15 },
);
$$(".rv").forEach((e, i) => {
  e.style.setProperty(
    "--d",
    (e.classList.contains("card") ? (i % 3) * 0.12 : 0) + "s",
  );
  io.observe(e);
});
// ===== Image cards: 3D tilt, magnifier lens, open viewer =====
const cards = $$(".card");
cards.forEach((c, i) => {
  const im = c.querySelector("img"),
    l = c.querySelector(".lens");
  c.tabIndex = 0;
  c.addEventListener("pointermove", (e) => {
    const r = c.getBoundingClientRect(),
      x = e.clientX - r.left,
      y = e.clientY - r.top;
    c.style.transform = `perspective(900px) rotateY(${(x / r.width - 0.5) * 10}deg) rotateX(${(0.5 - y / r.height) * 10}deg) scale(1.02)`;
    l.style.left = x + "px";
    l.style.top = y + "px";
    const z = 2.6;
    l.style.backgroundImage = `url(${im.src})`;
    l.style.backgroundSize = `${r.width * z}px ${r.height * z}px`;
    l.style.backgroundPosition = `${75 - x * z}px ${75 - y * z}px`;
  });
  c.addEventListener("pointerleave", () => (c.style.transform = ""));
  c.onclick = () => open(i);
  c.onkeydown = (e) => {
    if (e.key == "Enter") open(i);
  };
});
// ===== Lightbox: next, previous, zoom, keyboard =====
const lb = $("#lb"),
  li = lb.querySelector("img"),
  lp = lb.querySelector("p");
let cur = 0;
function open(i) {
  cur = (i + cards.length) % cards.length;
  li.classList.remove("z");
  li.src = cards[cur].querySelector("img").src;
  lp.textContent =
    cards[cur].dataset.c + "  ·  " + (cur + 1) + "/" + cards.length;
  lb.classList.add("o");
}
const cl = () => lb.classList.remove("o");
lb.querySelector(".x").onclick = cl;
lb.querySelector(".p").onclick = () => open(cur - 1);
lb.querySelector(".n").onclick = () => open(cur + 1);
li.onclick = (e) => {
  const r = li.getBoundingClientRect();
  li.style.transformOrigin = `${((e.clientX - r.left) / r.width) * 100}% ${((e.clientY - r.top) / r.height) * 100}%`;
  li.classList.toggle("z");
};
addEventListener("keydown", (e) => {
  if (!lb.classList.contains("o")) return;
  if (e.key == "Escape") cl();
  if (e.key == "ArrowRight") open(cur + 1);
  if (e.key == "ArrowLeft") open(cur - 1);
});
// ===== Custom cursor (desktop only) =====
if (matchMedia("(pointer:fine)").matches) {
  const c = $("#cur");
  c.style.display = "block";
  let x = 0,
    y = 0,
    tx = 0,
    ty = 0;
  addEventListener("pointermove", (e) => {
    tx = e.clientX;
    ty = e.clientY;
  });
  (function f() {
    x += (tx - x) * 0.18;
    y += (ty - y) * 0.18;
    c.style.left = x + "px";
    c.style.top = y + "px";
    requestAnimationFrame(f);
  })();
  document.addEventListener("pointerover", (e) =>
    c.classList.toggle("h", !!e.target.closest("a,button,.card")),
  );
}
// ===== Contact cards glow and copy-phone button =====
$$(".way").forEach((w) =>
  w.addEventListener("pointermove", (e) => {
    const r = w.getBoundingClientRect();
    w.style.setProperty("--wx", e.clientX - r.left + "px");
    w.style.setProperty("--wy", e.clientY - r.top + "px");
  }),
);
const cp = $("#cp");
cp.onclick = async () => {
  try {
    await navigator.clipboard.writeText("01114697366");
    cp.textContent = "Copied";
  } catch (e) {
    cp.textContent = "01114697366";
  }
  setTimeout(() => (cp.textContent = "Copy phone number"), 1800);
};
