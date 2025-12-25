/* ==========================
    Кастомный селект
   ========================== */
const customSelect = document.querySelector(".lang-select");
const selectHeader = customSelect.querySelector(".lang-select-header");
const optionsList = customSelect.querySelector(".lang-options");
const options = customSelect.querySelectorAll(
  '.lang-options li[role="option"]'
);
const selectedValue = selectHeader.querySelector(".lang-selected-value");
const currentValue = optionsList.querySelector(".lang-current-value");

// === Функция открытия/закрытия списка ===
const toggleSelect = () => {
  const expanded = selectHeader.getAttribute("aria-expanded") === "true";
  selectHeader.setAttribute("aria-expanded", !expanded);
  optionsList.style.display = expanded ? "none" : "block";
};

// === Открытие/закрытие при клике на заголовок ===
selectHeader.addEventListener("click", toggleSelect);

// === 💡 Добавляем: имитация клика при нажатии на lang-current-value ===
if (currentValue) {
  currentValue.addEventListener("click", (e) => {
    e.stopPropagation();
    toggleSelect();
  });
}

// === Выбор опции ===
options.forEach((option) => {
  option.addEventListener("click", () => {
    selectedValue.textContent = option.textContent;
    currentValue.textContent = option.textContent; // синхронизация
    options.forEach((opt) => opt.classList.remove("selected"));
    option.classList.add("selected");

    optionsList.style.display = "none";
    selectHeader.setAttribute("aria-expanded", "false");

    customSelect.dataset.selectedValue = option.dataset.value;
    customSelect.dispatchEvent(
      new CustomEvent("change", { detail: option.dataset.value })
    );
  });
});

// === Закрытие при клике вне области ===
document.addEventListener("click", (e) => {
  if (!customSelect.contains(e.target)) {
    optionsList.style.display = "none";
    selectHeader.setAttribute("aria-expanded", "false");
  }
});

/* ==========================
    Конец кастомного селекта
   ========================== */

/* ==========================
    Поиск по ID
   ========================== */
const searchId = document.querySelector(".search-id");
const searchInput = searchId.querySelector(".search-input");
const visuallyHidden = searchId.querySelector(".search-visually-hidden");

// Фильтрация ввода: только цифры

searchInput.addEventListener("input", (e) => {
  e.target.value = e.target.value.replace(/[^0-9]/g, "").slice(0, 8);
});

searchId.addEventListener("click", (e) => {
  e.preventDefault();
  const isActive = searchInput.classList.contains("active");

  if (!isActive) {
    searchInput.classList.remove("closing");
    searchInput.classList.add("active");
    visuallyHidden.classList.add("hidden");
    setTimeout(() => searchInput.focus(), 400); // Фокус после анимации (0.4s)
  } else {
    searchInput.classList.remove("active");
    searchInput.classList.add("closing");
    visuallyHidden.classList.remove("hidden");
    setTimeout(() => searchInput.classList.remove("closing"), 400); // Удаляем closing после анимации
  }
});

document.addEventListener("click", (e) => {
  if (!searchId.contains(e.target)) {
    searchInput.classList.remove("active");
    searchInput.classList.add("closing");
    visuallyHidden.classList.remove("hidden");
    setTimeout(() => searchInput.classList.remove("closing"), 400);
  }
});
/* ==========================
    Конец поиска по ID
   ========================== */
/* ==========================
    Бургер-меню
   ========================== */
const toggle = document.getElementById("menu-toggle");
const hamburger = document.querySelector(".hamburger");
const topLine = hamburger.querySelector(".menu-line-top");
const middleLine = hamburger.querySelector(".menu-line-middle");
const bottomLine = hamburger.querySelector(".menu-line-bottom");

/* toggle.addEventListener("click", function () {
  this.classList.toggle("active");
  if (this.classList.contains("active")) {
    // Верхняя линия исчезает
    topLine.style.opacity = "0";
    topLine.style.transform = "translateX(25px)";
    // Средняя и нижняя линии трансформируются в крестик
    middleLine.style.transform = "rotate(45deg) translate(3px, -14px)";
    bottomLine.style.transform = "rotate(-45deg) translate(-15px, -5px)";
  } else {
    // Возвращаем в исходное состояние
    topLine.style.opacity = "1";
    topLine.style.removeProperty("transform");
    middleLine.style.transform = "none";
    bottomLine.style.transform = "none";
  }
}); */
/* ==========================
    Конец бургер-меню
   ========================== */
