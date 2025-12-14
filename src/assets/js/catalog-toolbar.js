class CatalogToolbarSort {
  constructor(toolbarEl) {
    this.toolbar = toolbarEl;
    this.sortBtn = this.toolbar.querySelector(".catalog-toolbar__sort");
    this.sortValue = this.toolbar.querySelector(".catalog-toolbar__sort-value");
    this.portal = this.toolbar.querySelector(".catalog-toolbar__dropdowns-portal");
    this.dropdown = this.toolbar.querySelector(".catalog-toolbar__sort-dropdown");
    this.options = Array.from(
      this.toolbar.querySelectorAll(".catalog-toolbar__sort-option")
    );

    if (!this.sortBtn || !this.portal || !this.dropdown) return;

    this.isOpen = false;
    this.bindEvents();
  }

  bindEvents() {
    this.sortBtn.addEventListener("click", (e) => {
      e.preventDefault();
      this.toggle();
    });

    this.options.forEach((link) => {
      link.addEventListener("click", (e) => {
        // Ссылки оставляем ссылками, но пока без навигации — только выбор UI.
        e.preventDefault();
        this.select(link);
        this.close();
      });
    });

    document.addEventListener("click", (e) => {
      if (!this.isOpen) return;
      const inside =
        this.sortBtn.contains(e.target) || this.dropdown.contains(e.target);
      if (!inside) this.close();
    });

    window.addEventListener("resize", () => {
      if (!this.isOpen) return;
      this.position();
    });
  }

  toggle() {
    if (this.isOpen) {
      this.close();
      return;
    }
    this.open();
  }

  open() {
    this.isOpen = true;
    this.sortBtn.setAttribute("aria-expanded", "true");
    this.sortBtn.classList.add("is-open");
    this.dropdown.classList.add("open");
    this.position();
  }

  close() {
    this.isOpen = false;
    this.sortBtn.setAttribute("aria-expanded", "false");
    this.sortBtn.classList.remove("is-open");
    this.dropdown.classList.remove("open");
  }

  position() {
    const btnRect = this.sortBtn.getBoundingClientRect();
    const toolbarRect = this.toolbar.getBoundingClientRect();

    // Дропдаун визуально "приклеен" к кнопке без зазора
    const top = btnRect.bottom - toolbarRect.top;
    const left = btnRect.left - toolbarRect.left;

    this.dropdown.style.top = `${top}px`;
    this.dropdown.style.left = `${left}px`;
    this.dropdown.style.minWidth = `${btnRect.width}px`;
  }

  select(link) {
    this.options.forEach((a) => a.classList.remove("active"));
    link.classList.add("active");

    if (this.sortValue) {
      this.sortValue.textContent = link.textContent.trim();
    }
  }
}

class CatalogToolbarView {
  constructor(toolbarEl) {
    this.toolbar = toolbarEl;
    this.viewBtns = Array.from(
      this.toolbar.querySelectorAll(".catalog-toolbar__view-btn.btn.btn-tabs")
    );

    if (!this.viewBtns.length) return;

    this.grids = Array.from(document.querySelectorAll(".catalog-grid"));
    this.activeView = this.getInitialView();
    this.bindEvents();
    this.enforceMobileRule();
  }

  getInitialView() {
    const activeBtn = this.viewBtns.find((btn) => btn.classList.contains("active"));
    const view = activeBtn?.dataset?.view;
    return view || "tile";
  }

  bindEvents() {
    this.viewBtns.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        const view = btn.dataset.view || "tile";
        this.setView(view);
      });
    });

    window.addEventListener("resize", () => {
      this.enforceMobileRule();
    });
  }

  isMobile() {
    return window.matchMedia("(max-width: 480px)").matches;
  }

  enforceMobileRule() {
    // На мобайле дополнительных видов не должно быть
    if (this.isMobile() && this.activeView !== "tile") {
      this.setView("tile");
    }
  }

  setView(view) {
    // Табличный вид пока не трогаем
    if (view === "table") return;

    this.activeView = view;
    this.syncButtons(view);
    this.syncGrids(view);
  }

  syncButtons(view) {
    this.viewBtns.forEach((btn) => {
      const btnView = btn.dataset.view || "tile";
      const isActive = btnView === view;
      btn.classList.toggle("active", isActive);
      btn.setAttribute("aria-pressed", isActive ? "true" : "false");
    });
  }

  syncGrids(view) {
    const isList = view === "list";
    this.grids.forEach((grid) => {
      grid.classList.toggle("catalog-grid--list", isList);
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document
    .querySelectorAll(".catalog-toolbar")
    .forEach((toolbar) => {
      new CatalogToolbarSort(toolbar);
      new CatalogToolbarView(toolbar);
    });
});


