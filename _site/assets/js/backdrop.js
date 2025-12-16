/* ==========================
   Backdrop (blur overlay)
   Глобальные функции: window.backdropShow / window.backdropHide
   ========================== */

(function () {
  const BACKDROP_ID = "app-backdrop";
  const ACTIVE_CLASS = "is-active";

  let clickHandler = null;

  function ensureBackdrop() {
    let el = document.getElementById(BACKDROP_ID);
    if (el) return el;

    el = document.createElement("div");
    el.id = BACKDROP_ID;
    el.className = "app-backdrop";
    el.setAttribute("aria-hidden", "true");

    document.body.appendChild(el);
    return el;
  }

  function setOnClick(el, onClick) {
    if (clickHandler) {
      el.removeEventListener("click", clickHandler);
      clickHandler = null;
    }

    if (typeof onClick === "function") {
      clickHandler = (e) => {
        // кликаем именно по оверлею, не по меню
        if (e.target !== el) return;
        onClick(e);
      };
      el.addEventListener("click", clickHandler);
    }
  }

  window.backdropShow = function backdropShow(options = {}) {
    const el = ensureBackdrop();
    const { onClick } = options;

    setOnClick(el, onClick);

    // Включаем
    el.classList.add(ACTIVE_CLASS);
    return el;
  };

  window.backdropHide = function backdropHide() {
    const el = document.getElementById(BACKDROP_ID);
    if (!el) return;

    setOnClick(el, null);
    el.classList.remove(ACTIVE_CLASS);
  };
})();
