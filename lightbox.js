/* Click a screenshot (.shot img) to view it full size, centered, in an overlay.
   Styles are set inline here on purpose so the overlay never depends on cached CSS. */
(function () {
  const ov = document.createElement("div");
  ov.setAttribute("role", "dialog");
  ov.setAttribute("aria-modal", "true");
  ov.setAttribute("aria-label", "Full size screenshot");
  ov.hidden = true;
  ov.style.cssText =
    "position:fixed;top:0;left:0;width:100vw;height:100vh;z-index:1000;display:none;align-items:center;justify-content:center;background:rgba(10,10,10,.94);cursor:zoom-out;margin:0;padding:0";

  const big = document.createElement("img");
  big.style.cssText =
    "display:block;position:static;margin:0 auto;width:auto;height:auto;max-width:94vw;max-height:88vh;object-fit:contain;border:1px solid #262626;transform:none";

  const btn = document.createElement("button");
  btn.type = "button";
  btn.setAttribute("aria-label", "Close image");
  btn.textContent = "\u00d7";
  btn.style.cssText =
    "position:fixed;top:16px;right:16px;width:48px;height:48px;font:28px/1 sans-serif;color:#F5F5F2;background:#0A0A0A;border:1px solid #262626;cursor:pointer";

  ov.append(big, btn);
  document.body.appendChild(ov);

  let opener = null;
  function open(img) {
    opener = img;
    big.src = img.currentSrc || img.src;
    big.alt = img.alt;
    if (typeof gtag === "function")
      gtag("event", "view_screenshot", { image: img.alt || img.src });
    ov.hidden = false;
    ov.style.display = "flex";
    document.documentElement.style.overflow = "hidden";
    btn.focus();
  }
  function close() {
    ov.hidden = true;
    ov.style.display = "none";
    document.documentElement.style.overflow = "";
    if (opener) opener.focus();
  }
  ov.addEventListener("click", close);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !ov.hidden) close();
  });

  document.querySelectorAll(".shot img").forEach((img) => {
    img.tabIndex = 0;
    img.setAttribute("role", "button");
    img.setAttribute("aria-label", "View full size: " + img.alt);
    img.addEventListener("click", () => open(img));
    img.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        open(img);
      }
    });
  });
})();
