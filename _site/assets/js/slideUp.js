const slideDown = (target, duration = 400) => {
  const content = target.querySelector(".faq-answer-content");
  target.style.transition = `max-height ${duration}ms ease`;
  target.style.maxHeight = content.scrollHeight + 60 + "px"; // +60 на padding
  content.style.opacity = "1";
};

const slideUp = (target, duration = 400) => {
  target.style.transition = `max-height ${duration}ms ease`;
  target.style.maxHeight = "0";
  const content = target.querySelector(".faq-answer-content");
  setTimeout(() => {
    content.style.opacity = "0";
  }, 50); // небольшая задержка, чтобы opacity сработал после начала закрытия
};

const labels = document.querySelectorAll(".faq-label");

labels.forEach((label) => {
  label.addEventListener("click", () => {
    const parent = label.parentElement;
    const content = parent.querySelector(".faq-answer-list");
    const isOpen = parent.classList.contains("is-open");

    // Закрываем все остальные
    document.querySelectorAll(".faq-item.is-open").forEach((openItem) => {
      if (openItem !== parent) {
        const openContent = openItem.querySelector(".faq-answer-list");
        slideUp(openContent);
        openItem.classList.remove("is-open");
      }
    });

    // Открываем/закрываем текущий
    if (isOpen) {
      slideUp(content);
      parent.classList.remove("is-open");
    } else {
      slideDown(content);
      parent.classList.add("is-open");
    }
  });
});

// Инициализация открытых
document.querySelectorAll(".faq-item.is-open").forEach((item) => {
  const content = item.querySelector(".faq-answer-list");
  const inner = content.querySelector(".faq-answer-content");
  content.style.maxHeight = inner.scrollHeight + 60 + "px";
  inner.style.opacity = "1";
});
