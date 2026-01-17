/**
 * CustomSelect — универсальный класс для кастомных выпадающих списков.
 * Каждый экземпляр работает независимо от других.
 * 
 * Использование:
 * new CustomSelect(element);
 * или автоматически через CustomSelectManager.
 */
class CustomSelect {
  constructor(element) {
    this.container = element;
    this.trigger = element.querySelector(".custom-select__trigger");
    this.dropdown = element.querySelector(".custom-select__dropdown");
    this.valueSpan = element.querySelector(".custom-select__value");
    this.currentLabel = element.querySelector(".custom-select__current");
    this.label = element.querySelector(".custom-select__label");
    this.optionsContainer = element.querySelector(".custom-select__options");
    this.options = element.querySelectorAll(".custom-select__option");
    this.isOpen = false;

    this.init();
  }

  init() {
    this.bindEvents();
  }

  bindEvents() {
    // Клик по триггеру
    this.trigger.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.toggle();
    });

    // Клик по опции
    this.options.forEach((option) => {
      option.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.selectOption(option);
      });

      // Клавиатурная навигация
      option.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          this.selectOption(option);
        }
      });
    });

    // Закрытие при клике вне
    document.addEventListener("click", (e) => {
      if (!this.container.contains(e.target) && this.isOpen) {
        this.close();
      }
    });

    // Закрытие по Escape
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this.isOpen) {
        this.close();
        this.trigger.focus();
      }
    });

    // Адаптация при ресайзе (если селект открыт)
    window.addEventListener("resize", () => {
      if (this.isOpen) {
        this.positionDropdown();
        this.updateOneColumnLayout();
      }
    });
  }

  toggle() {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  open() {
    // Закрываем другие открытые селекты
    document.querySelectorAll(".custom-select__dropdown.open").forEach((dd) => {
      if (dd !== this.dropdown) {
        dd.classList.remove("open");
        const otherTrigger = dd
          .closest(".custom-select")
          .querySelector(".custom-select__trigger");
        if (otherTrigger) {
          otherTrigger.setAttribute("aria-expanded", "false");
        }
      }
    });

    this.isOpen = true;
    this.trigger.setAttribute("aria-expanded", "true");
    this.dropdown.classList.add("open");
    this.positionDropdown();
    this.updateOneColumnLayout();

    // Фокус на первую опцию
    const firstOption = this.dropdown.querySelector(".custom-select__option");
    if (firstOption) {
      firstOption.focus();
    }
  }

  close() {
    this.isOpen = false;
    this.trigger.setAttribute("aria-expanded", "false");
    this.dropdown.classList.remove("open");
  }

  selectOption(option) {
    // Убираем selected со всех
    this.options.forEach((opt) => opt.classList.remove("selected"));
    option.classList.add("selected");

    // Обновляем отображаемое значение
    const text = option.textContent;
    const value = option.dataset.value;

    this.valueSpan.textContent = text;
    this.currentLabel.textContent = text;

    // Сохраняем значение в data-атрибут контейнера
    this.container.dataset.value = value;

    // Вызываем кастомное событие
    this.container.dispatchEvent(
      new CustomEvent("select:change", {
        detail: { value, text },
        bubbles: true,
      })
    );

    this.close();
  }

  positionDropdown() {
    const triggerRect = this.trigger.getBoundingClientRect();
    const containerRect = this.container.getBoundingClientRect();

    // Сброс позиции для корректного расчёта
    this.dropdown.style.top = "";
    this.dropdown.style.left = "";
    this.dropdown.style.minWidth = `${triggerRect.width}px`;

    // Позиционируем под триггером
    const top = this.trigger.offsetTop ;
    this.dropdown.style.top = `${top}px`;
    this.dropdown.style.left = "-30px";
  }

  /**
   * Делаем список строго в 1 колонку и задаём динамическую ширину:
   * ширина dropdown и ширина каждой option привязываются к ширине лейбла/триггера.
   * По духу похоже на updateColumnLayout в search-form.js, только фиксируем 1 колонку.
   */
  updateOneColumnLayout() {
    const triggerRect = this.trigger.getBoundingClientRect();
    const labelRect = this.label ? this.label.getBoundingClientRect() : null;

    const baseWidth = Math.max(
      triggerRect.width,
      labelRect ? labelRect.width : 0
    );

    // Padding в dropdown: слева/справа по 20px (см. SCSS), плюс небольшой запас
 /*    const horizontalPadding = 40; */
    const dropdownWidth = baseWidth + horizontalPadding;

    this.dropdown.style.width = `${dropdownWidth}px`;

    // Один столбец: просто задаём ширину каждой опции как baseWidth
    this.options.forEach((opt) => {
      opt.style.width = `${baseWidth}px`;
    });

    // На всякий — фиксируем направление колонки
    if (this.optionsContainer) {
      this.optionsContainer.style.flexDirection = "column";
    }
  }

  // Геттер для получения текущего значения
  get value() {
    return this.container.dataset.value || null;
  }
}

/**
 * CustomSelectManager — автоматически инициализирует все custom-select на странице.
 */
class CustomSelectManager {
  constructor() {
    this.selects = [];
    this.init();
  }

  init() {
    document.querySelectorAll(".custom-select").forEach((el) => {
      this.selects.push(new CustomSelect(el));
    });
  }

  // Получить экземпляр по ID
  getById(id) {
    const el = document.querySelector(`[data-select-id="${id}"]`);
    return this.selects.find((s) => s.container === el) || null;
  }
}

// === ЗАПУСК ===
document.addEventListener("DOMContentLoaded", () => {
  window.customSelectManager = new CustomSelectManager();
});

