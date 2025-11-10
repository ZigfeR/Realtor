const DEFAULT_MAX_CHARS = 120;
const ACHIEVEMENTS_MAX_CHARS = 80;

const SELECTOR_TRUNCATED =
  ".text-truncated, .review-header-p, .company-achivements-header-p";
const SELECTOR_ACHIEVEMENTS = ".container-achivements-header-p";

const applyTruncation = () => {
  const isMobile = window.innerWidth <= 480;

  // Восстанавливаем оригинальный HTML для всех элементов
  document
    .querySelectorAll(`${SELECTOR_TRUNCATED}, ${SELECTOR_ACHIEVEMENTS}`)
    .forEach((el) => {
      if (el.dataset.originalHtml) {
        el.innerHTML = el.dataset.originalHtml;
        el.classList.remove("expanded");
        delete el.dataset.originalHtml;
      }
    });

  if (!isMobile) return;

  // === Общие элементы ===
  document.querySelectorAll(SELECTOR_TRUNCATED).forEach((el) => {
    const maxChars = el.dataset.maxChars
      ? parseInt(el.dataset.maxChars, 10)
      : DEFAULT_MAX_CHARS;
    truncateWithHtmlPreserve(el, maxChars);
  });

  // === .container-achivements-header-p с отдельным лимитом ===
  document.querySelectorAll(SELECTOR_ACHIEVEMENTS).forEach((el) => {
    const maxChars = el.dataset.maxChars
      ? parseInt(el.dataset.maxChars, 10)
      : ACHIEVEMENTS_MAX_CHARS;
    truncateWithHtmlPreserve(el, maxChars);
  });
};

// === Основная функция обрезки с сохранением HTML ===
const truncateWithHtmlPreserve = (container, maxChars) => {
  // Сохраняем оригинальный HTML
  if (!container.dataset.originalHtml) {
    container.dataset.originalHtml = container.innerHTML;
  }

  const originalHtml = container.dataset.originalHtml;
  const textContent = container.textContent.trim();

  if (textContent.length <= maxChars) return;

  // Создаём временный контейнер для парсинга HTML
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = originalHtml;

  let charCount = 0;
  let truncatedHtml = "";
  let stop = false;

  // Рекурсивно обходим все узлы
  const walk = (node) => {
    if (stop) return;

    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent;
      const remaining = maxChars - charCount;

      if (text.length <= remaining) {
        truncatedHtml += text;
        charCount += text.length;
      } else {
        truncatedHtml += text.slice(0, remaining);
        charCount += remaining;
        stop = true;
      }
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      const tag = node.tagName.toLowerCase();
      const isBr = tag === "br";
      const isBlock = [
        "p",
        "div",
        "li",
        "h1",
        "h2",
        "h3",
        "h4",
        "h5",
        "h6",
      ].includes(tag);

      // Открывающий тег
      const attrs = node.getAttributeNames().reduce((str, name) => {
        return `${str} ${name}="${node.getAttribute(name)}"`;
      }, "");
      truncatedHtml += `<${tag}${attrs}>`;

      // Обходим детей
      node.childNodes.forEach(walk);

      // Закрывающий тег (кроме <br>)
      if (!isBr) {
        truncatedHtml += `</${tag}>`;
      }

      // Если это блочный элемент и мы уже набрали лимит — можно остановиться
      if (isBlock && charCount >= maxChars) {
        stop = true;
      }
    }
  };

  tempDiv.childNodes.forEach(walk);

  // Обрезаем по последнему пробелу
  const lastSpace = truncatedHtml.lastIndexOf(" ");
  if (lastSpace > maxChars * 0.7) {
    // не слишком близко к началу
    truncatedHtml = truncatedHtml.slice(0, lastSpace);
  }

  // Добавляем "… Read More"
  const ellipsis = document.createElement("span");
  ellipsis.className = "dots";
  ellipsis.textContent = "… ";

  const readMore = document.createElement("span");
  readMore.className = "read-more";
  readMore.textContent = "Read More";
  readMore.style.cursor = "pointer";

  // Очищаем и вставляем
  container.innerHTML = "";
  container.appendChild(
    document.createRange().createContextualFragment(truncatedHtml)
  );
  container.appendChild(ellipsis);
  container.appendChild(readMore);

  // Обработчик раскрытия
  readMore.addEventListener("click", () => {
    container.innerHTML = container.dataset.originalHtml;
    container.classList.add("expanded");
  });
};

// Инициализация
applyTruncation();
window.addEventListener("resize", () => {
  clearTimeout(window.truncateTimeout);
  window.truncateTimeout = setTimeout(applyTruncation, 100);
});
