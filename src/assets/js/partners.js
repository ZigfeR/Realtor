// === Настройки (можно менять) ===
const MAX_VISIBLE_SVG = 2;
const MOBILE_BREAKPOINT = 480;

// === Функция логики ===
const updatePartners = () => {
  const isMobile = window.innerWidth <= MOBILE_BREAKPOINT;

  document.querySelectorAll(".partners-header-bottom").forEach((container) => {
    const svgs = container.querySelectorAll(".partners__image");
    const btn = container.parentElement?.querySelector(
      ".property__view-all-btn"
    );

    // Сброс стилей
    svgs.forEach((svg) => (svg.style.display = ""));
    if (btn) btn.style.display = "";

    // Десктоп — всё видно, кнопка скрыта
    if (!isMobile) {
      if (btn) btn.style.display = "none";
      return;
    }

    // Мобильные: ≤2 — кнопка не нужна
    if (svgs.length <= MAX_VISIBLE_SVG) {
      if (btn) btn.style.display = "none";
      return;
    }

    // Скрываем лишние
    svgs.forEach((svg, i) => {
      if (i >= MAX_VISIBLE_SVG) {
        svg.style.display = "none";
      }
    });

    // Клик — раскрываем
    if (btn) {
      btn.onclick = () => {
        svgs.forEach((svg) => (svg.style.display = ""));
        btn.style.display = "none";
      };
    }
  });
};

// === Запуск ===
updatePartners();

// Адаптивность при ресайзе
let resizeTimer;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(updatePartners, 100);
});
