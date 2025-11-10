const DEFAULT_MAX_CHARS = 120;

// Массив всех селекторов, к которым применяется обрезка
const TRUNCATED_SELECTORS = [
  ".text-truncated",
  ".review-header-p",
  ".company-achivements-header-p",
  ".valued-customers-header-p",
  ".container-achivements-header-p",
  ".blog-header-bottom",
];

const applyTruncation = () => {
  const isMobile = window.innerWidth <= 480;

  // Восстанавливаем оригинальный HTML для всех элементов
  document.querySelectorAll(TRUNCATED_SELECTORS.join(", ")).forEach((el) => {
    if (el.dataset.originalHtml) {
      el.innerHTML = el.dataset.originalHtml;
      el.classList.remove("expanded");
      delete el.dataset.originalHtml;
    }
  });

  if (!isMobile) return;

  // Применяем обрезку ко всем элементам из списка
  document.querySelectorAll(TRUNCATED_SELECTORS.join(", ")).forEach((el) => {
    const maxChars = el.dataset.maxChars
      ? parseInt(el.dataset.maxChars, 10)
      : DEFAULT_MAX_CHARS;
    truncateWithHtmlPreserve(el, maxChars);
  });
};

// === Основная функция обрезки с сохранением HTML ===
const truncateWithHtmlPreserve = (container, maxChars) => {
  // Сохраняем оригинальный HTML (только если ещё не сохранён)
  if (!container.dataset.originalHtml) {
    container.dataset.originalHtml = container.innerHTML;
  }

  const originalHtml = container.dataset.originalHtml;
  const textContent = container.textContent.trim();

  if (textContent.length <= maxChars) return;

  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = originalHtml;

  let charCount = 0;
  let truncatedHtml = "";
  let stop = false;

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

      // Открывающий тег с атрибутами
      const attrs = node.getAttributeNames().reduce((str, name) => {
        return `${str} ${name}="${node.getAttribute(name)}"`;
      }, "");
      truncatedHtml += `<${tag}${attrs}>`;

      // Рекурсивно обходим детей
      node.childNodes.forEach(walk);

      // Закрывающий тег (кроме <br>)
      if (!isBr) {
        truncatedHtml += `</${tag}>`;
      }

      // Останавливаемся после блочного элемента, если лимит достигнут
      if (isBlock && charCount >= maxChars) {
        stop = true;
      }
    }
  };

  tempDiv.childNodes.forEach(walk);

  // Обрезаем по последнему пробелу (не слишком рано)
  const lastSpace = truncatedHtml.lastIndexOf(" ");
  if (lastSpace > maxChars * 0.7) {
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

  // Вставляем обрезанный контент + ссылку
  container.innerHTML = "";
  container.appendChild(
    document.createRange().createContextualFragment(truncatedHtml)
  );
  container.appendChild(ellipsis);
  container.appendChild(readMore);

  // Обработчик "Read More"
  readMore.addEventListener("click", () => {
    container.innerHTML = container.dataset.originalHtml;
    container.classList.add("expanded");
  });
};

// === Инициализация ===
applyTruncation();

window.addEventListener("resize", () => {
  clearTimeout(window.truncateTimeout);
  window.truncateTimeout = setTimeout(applyTruncation, 100);
});
