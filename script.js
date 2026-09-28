/* Jeffrey Austin portfolio: behavior only. Content lives in index.html. */
const HINTS = {
  hire: "Client work, what I can build, and how I work come first.",
  work: "My own products first. Open any project for the full case study.",
  dev: "The stack and how things are built come first.",
  curious: "Take the full tour, top to bottom.",
};
const root = document.body;
const buttons = document.querySelectorAll(".ask button");
const hint = document.getElementById("hint");

function setIntent(intent, { scroll = false } = {}) {
  root.dataset.intent = intent;
  buttons.forEach((b) =>
    b.setAttribute("aria-pressed", String(b.dataset.intent === intent)),
  );
  hint.textContent = HINTS[intent];
  try {
    sessionStorage.setItem("intent", intent);
  } catch (e) {}
  if (scroll && intent !== "curious") {
    // Wait a frame so reordered sections are laid out.
    requestAnimationFrame(() =>
      document
        .querySelector("main .sec")
        .scrollIntoView({ behavior: "smooth" }),
    );
  }
}
buttons.forEach((b) =>
  b.addEventListener("click", () => {
    setIntent(b.dataset.intent, { scroll: true });
    if (typeof gtag === "function")
      gtag("event", "select_intent", { intent: b.dataset.intent });
  }),
);
try {
  const s = sessionStorage.getItem("intent");
  if (s && HINTS[s]) setIntent(s);
} catch (e) {}

/* Mobile menu */
const menuBtn = document.querySelector(".menu-btn");
const links = document.getElementById("links");
menuBtn.addEventListener("click", () => {
  const open = links.classList.toggle("open");
  menuBtn.setAttribute("aria-expanded", String(open));
});
links.addEventListener("click", (e) => {
  if (e.target.tagName === "A") {
    links.classList.remove("open");
    menuBtn.setAttribute("aria-expanded", "false");
  }
});

/* One quiet reveal per project / client */
if (
  "IntersectionObserver" in window &&
  !matchMedia("(prefers-reduced-motion: reduce)").matches
) {
  root.classList.add("js");
  const io = new IntersectionObserver(
    (es) =>
      es.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      }),
    { threshold: 0.1 },
  );
  document.querySelectorAll(".proj, .client").forEach((el) => {
    el.classList.add("rv");
    io.observe(el);
  });
}

/* click_live_site: any link to a product's or client's live URL */
document.querySelectorAll("a.live, a.visit").forEach((a) => {
  a.addEventListener("click", () => {
    if (typeof gtag === "function")
      gtag("event", "click_live_site", {
        link_url: a.href,
        link_text: a.textContent.trim(),
      });
  });
});

/* contact_click: email / whatsapp / github / tiktok / youtube / linkedin icons */
document.querySelectorAll(".contact a").forEach((a) => {
  a.addEventListener("click", () => {
    if (typeof gtag === "function")
      gtag("event", "contact_click", {
        method: a.getAttribute("aria-label") || a.href,
      });
  });
});
