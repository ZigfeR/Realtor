const DEFAULT_MAX_CHARS = 120; // для всех, у кого не указан data-max-chars
const SELECTOR =
  ".text-truncated, .review-header-p, .company-achivements-header-p";

const applyTruncation = () => {
  const isMobile = window.innerWidth <= 480;

  document.querySelectorAll(SELECTOR).forEach((el) => {
    // Восстанавливаем оригинал
    if (el.dataset.originalText) {
      el.innerHTML = el.dataset.originalText;
      el.classList.remove("expanded");
      delete el.dataset.originalText;
    }

    if (!isMobile) return;

    const fullText = el.textContent.trim();
    const maxChars = el.dataset.maxChars
      ? parseInt(el.dataset.maxChars, 10)
      : DEFAULT_MAX_CHARS;

    if (fullText.length <= maxChars) return;

    el.dataset.originalText = fullText;

    let visibleText = fullText.slice(0, maxChars);
    const lastSpace = visibleText.lastIndexOf(" ");
    if (lastSpace > 0) {
      visibleText = visibleText.slice(0, lastSpace);
    }

    const ellipsis = document.createElement("span");
    ellipsis.textContent = "… ";

    const readMore = document.createElement("span");
    readMore.className = "read-more";
    readMore.textContent = "Read More";
    readMore.style.cursor = "pointer";

    el.innerHTML = "";
    el.appendChild(document.createTextNode(visibleText));
    el.appendChild(ellipsis);
    el.appendChild(readMore);

    readMore.addEventListener("click", () => {
      el.innerHTML = fullText;
      el.classList.add("expanded");
    });
  });
};

applyTruncation();
window.addEventListener("resize", () => {
  clearTimeout(window.truncateTimeout);
  window.truncateTimeout = setTimeout(applyTruncation, 100);
});
