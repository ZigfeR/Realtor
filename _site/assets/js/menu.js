/* ==========================
   Off-canvas меню (выезд справа налево)
   Требует global: window.backdropShow / window.backdropHide
   ========================== */

(function () {
  function getElements() {
    const toggle = document.getElementById("menu-toggle");
    const menu = document.getElementById("site-offcanvas-menu");

    return { toggle, menu };
  }

  function setAria(toggle, menu, isOpen) {
    if (toggle) toggle.setAttribute("aria-expanded", String(isOpen));
    if (menu) menu.setAttribute("aria-hidden", String(!isOpen));
  }

  function lockScroll(isLocked) {
    document.body.classList.toggle("is-scroll-locked", isLocked);
  }

  function openMenu(toggle, menu) {
    if (!toggle || !menu) return;

    toggle.classList.add("active");
    menu.classList.add("is-open");
    setAria(toggle, menu, true);
    lockScroll(true);

    if (typeof window.backdropShow === "function") {
      window.backdropShow({
        onClick: () => closeMenu(toggle, menu),
      });
    }

    // Фокус в меню
    const focusable = menu.querySelector(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (focusable) focusable.focus();
  }

  function closeMenu(toggle, menu) {
    if (!toggle || !menu) return;

    toggle.classList.remove("active");
    menu.classList.remove("is-open");
    setAria(toggle, menu, false);
    lockScroll(false);

    if (typeof window.backdropHide === "function") {
      window.backdropHide();
    }

    toggle.focus();
  }

  function bind() {
    const { toggle, menu } = getElements();
    if (!toggle || !menu) return;

    // Открыть/закрыть по кнопке
    toggle.addEventListener("click", () => {
      const isOpen = menu.classList.contains("is-open");
      if (isOpen) {
        closeMenu(toggle, menu);
      } else {
        openMenu(toggle, menu);
      }
    });

    // Закрыть по кнопкам/ссылкам внутри
    menu.addEventListener("click", (e) => {
      const target = e.target;
      if (!(target instanceof Element)) return;

      if (target.closest("[data-menu-close]")) {
        closeMenu(toggle, menu);
      }
    });

    // ESC закрывает
    document.addEventListener("keydown", (e) => {
      if (e.key !== "Escape") return;
      if (!menu.classList.contains("is-open")) return;
      closeMenu(toggle, menu);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bind);
  } else {
    bind();
  }
})();
