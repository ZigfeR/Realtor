const MAX_CHARS = 120; // ← сколько символов показывать на мобильных

const applyTruncation = () => {
  const isMobile = window.innerWidth <= 480;

  document.querySelectorAll(".text-truncated").forEach((p) => {
    // Убираем предыдущие изменения (если были)
    if (p.dataset.originalText) {
      p.innerHTML = p.dataset.originalText;
      p.classList.remove("expanded");
      delete p.dataset.originalText;
    }

    if (!isMobile) return; // На десктопе — ничего не делаем

    const fullText = p.textContent.trim();

    // Сохраняем оригинал
    p.dataset.originalText = fullText;

    if (fullText.length <= MAX_CHARS) return;

    // Обрезаем по слову
    let visibleText = fullText.slice(0, MAX_CHARS);
    const lastSpace = visibleText.lastIndexOf(" ");
    if (lastSpace > 0) {
      visibleText = visibleText.slice(0, lastSpace);
    }

    // Создаём элементы
    const ellipsis = document.createElement("span");
    ellipsis.textContent = "… ";

    const readMore = document.createElement("span");
    readMore.className = "read-more";
    readMore.textContent = "Read More";
    readMore.style.cursor = "pointer";

    // Вставляем
    p.innerHTML = "";
    p.appendChild(document.createTextNode(visibleText));
    p.appendChild(ellipsis);
    p.appendChild(readMore);

    // Клик — раскрываем
    readMore.addEventListener("click", () => {
      p.innerHTML = fullText;
      p.classList.add("expanded");
    });
  });
};
// Запуск при загрузке и при ресайзе
applyTruncation();
window.addEventListener("resize", () => {
  // Небольшая задержка, чтобы избежать частых вызовов
  clearTimeout(window.truncateTimeout);
  window.truncateTimeout = setTimeout(applyTruncation, 100);
});
