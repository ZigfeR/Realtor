// Анимация чисел в блоке Average Selling Price
// Запуск: только когда секция появляется на экране

function formatCountValue(value, decimals) {
  const d = Number.isFinite(decimals) ? decimals : 0;
  return d > 0 ? value.toFixed(d) : String(Math.round(value));
}

function setCountText(el, value) {
  const prefix = el.dataset.prefix ?? "";
  const suffix = el.dataset.suffix ?? "";
  const decimals = Number(el.dataset.decimals ?? 0);
  el.textContent = `${prefix}${formatCountValue(value, decimals)}${suffix}`;
}

function animateCount(el, options = {}) {
  const to = Number(el.dataset.countTo);
  if (!Number.isFinite(to)) return;

  const from = Number.isFinite(Number(el.dataset.countFrom))
    ? Number(el.dataset.countFrom)
    : 0;

  const duration = Number.isFinite(options.duration) ? options.duration : 900;

  const start = performance.now();
  setCountText(el, from);

  const tick = (now) => {
    const t = Math.min(1, (now - start) / duration);

    // Небольшой ease-out, чтобы выглядело как "вычисление"
    const eased = 1 - Math.pow(1 - t, 3);
    const current = from + (to - from) * eased;

    setCountText(el, current);

    if (t < 1) {
      requestAnimationFrame(tick);
    } else {
      // Финальная фиксация
      setCountText(el, to);
    }
  };

  requestAnimationFrame(tick);
}

function initCatalogStatsCounters(section) {
  if (!section || section.dataset.animated === "true") return;

  const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")
    ?.matches;

  const counters = Array.from(section.querySelectorAll("[data-count-to]"));
  if (counters.length === 0) return;

  if (reduceMotion) {
    section.dataset.animated = "true";
    return;
  }

  counters.forEach((el) => animateCount(el, { duration: 900 }));
  section.dataset.animated = "true";
}

document.addEventListener("DOMContentLoaded", () => {
  const section = document.querySelector(".catalog-stats-section");
  if (!section) return;

  if (!("IntersectionObserver" in window)) {
    initCatalogStatsCounters(section);
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        initCatalogStatsCounters(section);
        observer.disconnect();
      });
    },
    { threshold: 0.3 }
  );

  observer.observe(section);
});
