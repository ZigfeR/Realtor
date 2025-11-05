class TabsToSelect {
  constructor() {
    this.containers = document.querySelectorAll(".top-cards-top-container");
    this.dropdowns = new Map(); // container → dropdown wrapper
    this.init();
  }

  init() {
    this.containers.forEach((container, index) => {
      container.dataset.selectIndex = index;
      this.createCustomDropdown(container);
      this.bindButtonEvents(container);
    });

    this.handleResize();
    window.addEventListener("resize", () => this.handleResize());
  }

  createCustomDropdown(container) {
    if (this.dropdowns.has(container)) return;

    const buttons = container.querySelectorAll(".btn-tabs");
    const activeText =
      [...buttons]
        .find((b) => b.classList.contains("active"))
        ?.textContent.trim() || buttons[0].textContent.trim();

    // === Создаём кастомный дропдаун ===
    const dropdown = document.createElement("div");
    dropdown.className = "custom-dropdown";
    dropdown.dataset.index = container.dataset.selectIndex;

    // Заголовок (капсула)
    const trigger = document.createElement("div");
    trigger.className = "dropdown-trigger";
    trigger.innerHTML = `
      <span class="dropdown-text">${activeText}</span>
      <svg xmlns="http://www.w3.org/2000/svg" width="8" height="5" viewBox="0 0 8 5" fill="none">
        <path d="M6.82725 0H1.0021C0.0723016 0 -0.354209 1.15797 0.353448 1.76108L3.46019 4.40888C3.85322 4.74385 4.43666 4.72446 4.80659 4.36414L7.52499 1.71635C8.16774 1.09029 7.72451 0 6.82725 0Z" fill="#14142D"/>
      </svg>
    `;

    // Список
    const list = document.createElement("ul");
    list.className = "dropdown-list";

    buttons.forEach((btn) => {
      const text = btn.textContent.trim();
      const li = document.createElement("li");
      li.className = "dropdown-item";
      li.textContent = text;
      li.dataset.value = text;
      if (text === activeText) li.classList.add("active");
      list.appendChild(li);
    });

    dropdown.appendChild(trigger);
    dropdown.appendChild(list);

    // Клик по капсуле
    trigger.addEventListener("click", () => {
      const isOpen = dropdown.classList.contains("open");
      this.closeAll();
      if (!isOpen) dropdown.classList.add("open");
    });

    // Клик по пункту
    list.addEventListener("click", (e) => {
      const item = e.target.closest(".dropdown-item");
      if (!item) return;
      const value = item.dataset.value;

      // Обновляем текст
      trigger.querySelector(".dropdown-text").textContent = value;
      list
        .querySelectorAll(".dropdown-item")
        .forEach((i) => i.classList.remove("active"));
      item.classList.add("active");

      // Синхронизация с кнопками
      this.syncButtons(container, value);

      dropdown.classList.remove("open");
    });

    // Закрытие при клике вне
    document.addEventListener("click", (e) => {
      if (!dropdown.contains(e.target)) {
        dropdown.classList.remove("open");
      }
    });

    this.dropdowns.set(container, dropdown);
  }

  closeAll() {
    this.dropdowns.forEach((d) => d.classList.remove("open"));
  }

  bindButtonEvents(container) {
    const buttons = container.querySelectorAll(".btn-tabs");
    buttons.forEach((btn) => {
      btn.addEventListener("click", () => {
        buttons.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");

        if (window.innerWidth <= 480) {
          const dropdown = this.dropdowns.get(container);
          if (dropdown) {
            dropdown.querySelector(".dropdown-text").textContent =
              btn.textContent.trim();
            dropdown.querySelectorAll(".dropdown-item").forEach((i) => {
              i.classList.toggle(
                "active",
                i.dataset.value === btn.textContent.trim()
              );
            });
          }
        }
      });
    });
  }

  syncButtons(container, selectedText) {
    const buttons = container.querySelectorAll(".btn-tabs");
    buttons.forEach((btn) => {
      btn.classList.toggle("active", btn.textContent.trim() === selectedText);
    });
  }

  handleResize() {
    const isMobile = window.innerWidth <= 480;

    this.containers.forEach((container) => {
      const dropdown = this.dropdowns.get(container);
      const buttons = container.querySelectorAll(".btn-tabs");

      if (isMobile) {
        if (!container.contains(dropdown)) {
          container.appendChild(dropdown);
        }
        buttons.forEach((btn) => (btn.style.display = "none"));
      } else {
        if (container.contains(dropdown)) {
          container.removeChild(dropdown);
        }
        buttons.forEach((btn) => (btn.style.display = ""));
      }
    });
  }
}

new TabsToSelect();
