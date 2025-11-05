const containers = document.querySelectorAll(".property-card__details");

const applyVisibility = () => {
  const isMobile = window.innerWidth <= 480;

  containers.forEach((container) => {
    const blocks = container.querySelectorAll(".details__block");

    blocks.forEach((block, index) => {
      if (isMobile) {
        // На мобильных: показываем только первые 3
        block.style.display = index < 3 ? "" : "none";
      } else {
        // На десктопе: показываем все
        block.style.display = "";
      }
    });
  });
};

// Запуск при загрузке и при ресайзе
applyVisibility();
window.addEventListener("resize", () => {
  clearTimeout(window.detailsTimeout);
  window.detailsTimeout = setTimeout(applyVisibility, 100);
});
