/**
 * Инициализация состояния выпадающих списков при загрузке страницы
 */
function initializeDropdowns() {
  const dropdowns = document.querySelectorAll(".form-dropdown");
  const allDropdowns = Array.from(dropdowns).sort(
    (a, b) => a.dataset.step - b.dataset.step
  );

  dropdowns.forEach((dropdown) => {
    const currentStep = parseInt(dropdown.dataset.step);
    const prevDropdowns = allDropdowns.filter(
      (d) => parseInt(d.dataset.step) < currentStep
    );
    const allPrevSelected = prevDropdowns.every(
      (d) => d.querySelector(".selected-value").textContent !== "Select"
    );

    if (!allPrevSelected && currentStep !== 1) {
      dropdown.classList.add("disabled");
    } else {
      dropdown.classList.remove("disabled");
    }
  });
}

/**
 * Обновление стилей колонок для выпадающего списка
 * @param {HTMLElement} options - Элемент ul.dropdown-search-form-options
 */
function updateColumnLayout(options) {
  const container = options.querySelector(".dropdown-li-container");
  const items = container.querySelectorAll('li[role="option"]');
  const itemCount = items.length;
  const dropdown = options.closest(".form-dropdown");
  const label = dropdown.querySelector(".dropdown-label");

  // Сброс инлайн-стилей перед вычислением
  options.style.width = "";
  container.style.columnCount = "";

  // Извлечение ширины .dropdown-label
  const labelStyle = getComputedStyle(label);
  const liWidth = parseFloat(labelStyle.width); // Ширина равна ширине метки
  console.log("liWidth (from label):", liWidth); // Отладка

  // Извлечение стилей из .dropdown-search-form-options
  const style = getComputedStyle(options);
  const paddingLeft = parseFloat(style.paddingLeft);
  const paddingRight = parseFloat(style.paddingRight);

  // Извлечение column-gap из .dropdown-li-container
  const containerStyle = getComputedStyle(container);
  const gap = parseFloat(containerStyle.columnGap) || 12; // Значение по умолчанию 12px, если не задано

  // Определяем количество колонок
  let columnCount = Math.ceil(itemCount / 11);

  // Вычисляем новую ширину с учетом условия для 1 столбца
  let totalWidth =
    liWidth * columnCount +
    paddingLeft +
    paddingRight +
    gap * (columnCount - 1);
  if (columnCount === 1) {
    totalWidth -= 3 + 10; // Вычитаем 3px для одного столбца
  }
  options.style.width = `${totalWidth}px`; // Применяем новую ширину

  // Устанавливаем column-count для .dropdown-li-container
  container.style.columnCount = columnCount;

  // Добавляем или убираем класс multi-column
  if (columnCount > 1) {
    options.classList.add("multi-column");
  } else {
    options.classList.remove("multi-column");
  }

  // Устанавливаем ширину li равной ширине label
  items.forEach((item) => {
    item.style.width = `${liWidth}px`;
  });
}

/**
 * Обработчик событий кликов на документе для управления различными элементами формы
 * @param {Event} e - Объект события клика
 */
document.addEventListener("click", function (e) {
  const dropdowns = document.querySelectorAll(".form-dropdown");
  const allDropdowns = Array.from(dropdowns).sort(
    (a, b) => a.dataset.step - b.dataset.step
  );

  // Управление выпадающими списками
  dropdowns.forEach((dropdown) => {
    const btn = dropdown.querySelector(".dropdown-search-form-btn");
    const options = dropdown.querySelector(".dropdown-search-form-options");
    const selectedValue = btn.querySelector(".selected-value");

    if (!options || !btn) return; // Пропускаем, если элементы не найдены

    // Проверяем, можно ли открыть список (предыдущие шаги выбраны)
    const currentStep = parseInt(dropdown.dataset.step);
    const prevDropdowns = allDropdowns.filter(
      (d) => parseInt(d.dataset.step) < currentStep
    );
    const allPrevSelected = prevDropdowns.every(
      (d) => d.querySelector(".selected-value").textContent !== "Select"
    );

    if (!allPrevSelected && currentStep !== 1) {
      dropdown.classList.add("disabled");
    } else {
      dropdown.classList.remove("disabled");
    }

    if (btn.contains(e.target)) {
      e.preventDefault();
      if (allPrevSelected || currentStep === 1) {
        const expanded = btn.getAttribute("aria-expanded") === "true";
        btn.setAttribute("aria-expanded", !expanded);
        options.style.display = expanded ? "none" : "flex";

        if (!expanded) {
          // Обновляем макет колонок после открытия
          setTimeout(() => updateColumnLayout(options), 0); // Таймаут для корректного расчета высоты
        } else {
          // Сбрасываем инлайн-ширину при закрытии
          options.style.width = "";
        }
      }
    } else if (!dropdown.contains(e.target)) {
      btn.setAttribute("aria-expanded", "false");
      options.style.display = "none";
      // Сбрасываем инлайн-ширину при закрытии вне элемента
      options.style.width = "";
    }
  });

  // Управление кнопками формы
  const formButtons = document.querySelectorAll(".filter-btn, .form-find-btn");
  formButtons.forEach((button) => {
    if (button.contains(e.target)) {
      e.preventDefault();
    }
  });

  // Переключение вкладок
  const tabs = document.querySelectorAll(".form-tabs .tab");
  if (e.target.classList.contains("tab")) {
    e.preventDefault();
    tabs.forEach((tab) => tab.classList.remove("active"));
    e.target.classList.add("active");
  }
});

/**
 * Обработчик выбора опций в выпадающих списках
 */
document
  .querySelectorAll('.dropdown-search-form-options li[role="option"]')
  .forEach((option) => {
    option.addEventListener("click", function (e) {
      const dropdown = this.closest(".form-dropdown");
      const btn = dropdown.querySelector(".dropdown-search-form-btn");
      const selectedValue = btn.querySelector(".selected-value");
      const options = dropdown.querySelector(".dropdown-search-form-options");
      const allDropdowns = Array.from(
        document.querySelectorAll(".form-dropdown")
      ).sort((a, b) => a.dataset.step - b.dataset.step);
      const allOptions = options.querySelectorAll('li[role="option"]');

      // Удаляем класс selected у всех опций в текущем списке
      allOptions.forEach((opt) => opt.classList.remove("selected"));
      // Добавляем класс selected к выбранной опции
      this.classList.add("selected");

      // Обновляем выбранное значение
      selectedValue.textContent = this.textContent;
      btn.setAttribute("aria-expanded", "false");
      options.style.display = "none";

      // Очищаем все последующие списки
      const currentStep = parseInt(dropdown.dataset.step);
      const nextDropdowns = allDropdowns.filter(
        (d) => parseInt(d.dataset.step) > currentStep
      );
      nextDropdowns.forEach((d) => {
        const nextBtn = d.querySelector(".dropdown-search-form-btn");
        const nextSelectedValue = nextBtn.querySelector(".selected-value");
        nextSelectedValue.textContent = "Select";
        // Сбрасываем selected у опций в следующих списках
        d.querySelectorAll('li[role="option"]').forEach((opt) =>
          opt.classList.remove("selected")
        );
      });

      // Переинициализируем состояние после выбора
      initializeDropdowns();
    });
  });
