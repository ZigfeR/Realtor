class DropdownManager {
  constructor() {
    this.portal = document.querySelector(".dropdowns-portal");
    this.dropdowns = document.querySelectorAll(".form-dropdown");
    this.allDropdowns = Array.from(this.dropdowns).sort(
      (a, b) => a.dataset.step - b.dataset.step
    );
    this.currentOpen = null;

    this.init();
  }

  init() {
    this.createDropdownOptions();
    this.bindEvents();
    this.initializeDropdowns();
  }

  createDropdownOptions() {
    this.dropdowns.forEach((dropdown) => {
      const btn = dropdown.querySelector(".dropdown-search-form-btn");
      const label = dropdown.querySelector(".dropdown-label");
      const step = dropdown.dataset.step;

      const options = document.createElement("ul");
      options.className = "dropdown-search-form-options";
      options.setAttribute("role", "listbox");
      options.dataset.target = btn.id;

      const currentValue = document.createElement("li");
      currentValue.role = "presentation";
      currentValue.className = "current-value";
      currentValue.textContent = "Select";
      options.appendChild(currentValue);

      const container = document.createElement("div");
      container.className = "dropdown-li-container";

      const items = this.getItemsForStep(step);
      items.forEach((item) => {
        const li = document.createElement("li");
        li.role = "option";
        li.dataset.value = item.value;
        li.textContent = item.text;
        container.appendChild(li);
      });

      options.appendChild(container);
      this.portal.appendChild(options);
    });
  }

  getItemsForStep(step) {
    const data = {
      1: [
        { value: "apartment", text: "Apartment" },
        { value: "house", text: "House" },
        { value: "commercial", text: "Commercial" },
      ],
      2: [
        { value: "ivano-frankivsk", text: "Ivano-Frankivsk reg." },
        { value: "zaporizhzhia", text: "Zaporizhzhia reg." },
        { value: "ternopil", text: "Ternopil reg." },
        { value: "kirovograd", text: "Kirovograd reg." },
        { value: "kyiv", text: "Kyiv reg." },
        { value: "poltava", text: "Poltava reg." },
        { value: "lviv", text: "Lviv reg." },
        { value: "rivne", text: "Rivne reg." },
        { value: "chernivtsi", text: "Chernivtsi reg." },
        { value: "sumy", text: "Sumy reg." },
        { value: "mykolaiv", text: "Mykolaiv reg." },
        { value: "kharkiv", text: "Kharkiv reg." },
        { value: "odesa", text: "Odesa reg." },
        { value: "kherson", text: "Kherson reg." },
        { value: "volyn", text: "Volyn reg." },
        { value: "khmelnytskyi", text: "Khmelnytskyi reg." },
        { value: "dnipropetrovsk", text: "Dnipropetrovsk reg." },
        { value: "cherkasy", text: "Cherkasy reg." },
        { value: "zhytomyr", text: "Zhytomyr reg." },
        { value: "chernihiv", text: "Chernihiv reg." },
        { value: "zakarpattia", text: "Zakarpattia reg." },
      ],
      3: [
        { value: "newyork", text: "New York" },
        { value: "london", text: "London" },
        { value: "paris", text: "Paris" },
      ],
      4: [
        { value: "center", text: "Center" },
        { value: "suburbs", text: "Suburbs" },
        { value: "downtown", text: "Downtown" },
      ],
    };
    return data[step] || [];
  }

  bindEvents() {
    // Блокируем ВСЁ, что может отправить форму
    document.querySelector(".search-form").addEventListener("submit", (e) => {
      e.preventDefault();
      return false;
    });

    // Все клики — один обработчик
    document.addEventListener("click", (e) => {
      // Блокируем submit для всех кнопок в форме
      if (e.target.closest("button") && e.target.closest(".search-form")) {
        e.preventDefault();
      }

      const btn = e.target.closest(".dropdown-search-form-btn");
      const option = e.target.closest(
        '.dropdown-search-form-options li[role="option"]'
      );

      if (btn) {
        this.toggleDropdown(btn);
      } else if (option) {
        this.selectOption(option);
      } else if (this.currentOpen) {
        const inDropdown =
          this.currentOpen.btn.contains(e.target) ||
          this.currentOpen.options.contains(e.target);
        if (!inDropdown) {
          this.closeCurrent();
        }
      }
    });

    // Переключение вкладок
    document.addEventListener("click", (e) => {
      if (e.target.classList.contains("tab")) {
        document.querySelectorAll(".form-tabs .tab").forEach((tab) => {
          tab.classList.remove("active");
        });
        e.target.classList.add("active");
      }
    });

    // Адаптация при ресайзе
    window.addEventListener("resize", () => {
      if (this.currentOpen) {
        this.positionDropdown(this.currentOpen.btn, this.currentOpen.options);
      }
    });
  }

  toggleDropdown(btn) {
    const isOpen = btn.getAttribute("aria-expanded") === "true";
    this.closeCurrent();

    if (!isOpen && this.canOpen(btn)) {
      btn.setAttribute("aria-expanded", "true");
      const options = this.portal.querySelector(
        `.dropdown-search-form-options[data-target="${btn.id}"]`
      );
      options.classList.add("open");
      this.currentOpen = { btn, options };
      this.positionDropdown(btn, options);
      this.updateColumnLayout(options, btn);
    }
  }

  canOpen(btn) {
    const dropdown = btn.closest(".form-dropdown");
    const step = parseInt(dropdown.dataset.step);
    if (step === 1) return true;

    const prev = this.allDropdowns.filter(
      (d) => parseInt(d.dataset.step) < step
    );
    return prev.every(
      (d) => d.querySelector(".selected-value").textContent !== "Select"
    );
  }

  positionDropdown(btn, options) {
    const btnRect = btn.getBoundingClientRect();
    const containerRect = document
      .querySelector(".form-fields")
      .getBoundingClientRect();

    const top = btnRect.bottom - containerRect.top + 16; // +8px отступ снизу
    const left = btnRect.left - containerRect.left - 30;

    options.style.top = `${top}px`;
    options.style.left = `${left}px`;
    options.style.minWidth = `${btnRect.width}px`;
  }

  updateColumnLayout(options, btn) {
    const container = options.querySelector(".dropdown-li-container");
    const items = container.querySelectorAll('li[role="option"]');
    const label = btn
      .closest(".form-dropdown")
      .querySelector(".dropdown-label");
    const labelWidth = label.getBoundingClientRect().width;

    let columnCount = Math.ceil(items.length / 11);
    columnCount = Math.max(1, columnCount);

    const gap = 12;
    const padding = 40;
    let totalWidth =
      labelWidth * columnCount + padding + gap * (columnCount - 1);
    if (columnCount === 1) totalWidth -= 13;

    options.style.width = `${totalWidth}px`;
    container.style.columnCount = columnCount;
    items.forEach((item) => (item.style.width = `${labelWidth}px`));
    options.classList.toggle("multi-column", columnCount > 1);
  }

  selectOption(option) {
    const options = option.closest(".dropdown-search-form-options");
    const btn = document.getElementById(options.dataset.target);
    const selectedValue = btn.querySelector(".selected-value");

    options
      .querySelectorAll('li[role="option"]')
      .forEach((li) => li.classList.remove("selected"));
    option.classList.add("selected");
    selectedValue.textContent = option.textContent;

    this.closeCurrent();
    this.resetNextSteps(btn.closest(".form-dropdown"));
    this.initializeDropdowns();
  }

  resetNextSteps(currentDropdown) {
    const step = parseInt(currentDropdown.dataset.step);
    const next = this.allDropdowns.filter(
      (d) => parseInt(d.dataset.step) > step
    );
    next.forEach((d) => {
      const btn = d.querySelector(".dropdown-search-form-btn");
      const span = btn.querySelector(".selected-value");
      span.textContent = "Select";
      const targetId = btn.id;
      const opts = this.portal.querySelector(
        `.dropdown-search-form-options[data-target="${targetId}"]`
      );
      if (opts) {
        opts
          .querySelectorAll('li[role="option"]')
          .forEach((li) => li.classList.remove("selected"));
      }
    });
  }

  closeCurrent() {
    if (this.currentOpen) {
      this.currentOpen.btn.setAttribute("aria-expanded", "false");
      this.currentOpen.options.classList.remove("open");
      this.currentOpen.options.style.width = "";
      this.currentOpen.options.style.minWidth = "";
      this.currentOpen = null;
    }
  }

  initializeDropdowns() {
    this.dropdowns.forEach((dropdown) => {
      const step = parseInt(dropdown.dataset.step);
      const prev = this.allDropdowns.filter(
        (d) => parseInt(d.dataset.step) < step
      );
      const allPrevSelected = prev.every(
        (d) => d.querySelector(".selected-value").textContent !== "Select"
      );
      dropdown.classList.toggle("disabled", !allPrevSelected && step !== 1);
    });
  }
}

// === ЗАПУСК ===
document.addEventListener("DOMContentLoaded", () => {
  new DropdownManager();
});
