/* Click a screenshot (.shot img) to view it full size in an overlay. */
(function () {
  const dlg = document.createElement("dialog");
  dlg.className = "lb";
  dlg.innerHTML =
    '<button type="button" aria-label="Close image">×</button><img alt="">';
  document.body.appendChild(dlg);
  const big = dlg.querySelector("img");
  const close = () => dlg.close();

  function open(img) {
    big.src = img.currentSrc || img.src;
    big.alt = img.alt;
    document.documentElement.classList.add("lb-open");
    dlg.showModal();
  }
  dlg.addEventListener("close", () =>
    document.documentElement.classList.remove("lb-open"),
  );
  dlg.addEventListener("click", close); // click anywhere, including the backdrop, closes

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
