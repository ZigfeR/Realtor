/* ==========================
    Fullscreen Menu Functionality
   ========================== */

// Global backdrop management functions
window.BackdropManager = {
  show: function() {
    const backdrop = document.getElementById('menu-overlay');
    if (backdrop) {
      backdrop.classList.add('active');
      // Блокируем скролл страницы (скролл остаётся только внутри меню)
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
      document.documentElement.style.height = '100%';
      document.body.style.height = '100%';
    }
  },

  hide: function() {
    const backdrop = document.getElementById('menu-overlay');
    if (backdrop) {
      backdrop.classList.remove('active');
      // Возвращаем скролл страницы
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
      document.documentElement.style.height = '';
      document.body.style.height = '';
    }
  }
};

// Menu functionality
document.addEventListener('DOMContentLoaded', function() {
  const menuToggle = document.getElementById('menu-toggle');
  const menuCloseBtn = document.getElementById('menu-close-btn');
  const menuOverlay = document.getElementById('menu-overlay');
  const menuContainer = document.querySelector('.menu-container');

  // Open menu
  if (menuToggle) {
    menuToggle.addEventListener('click', function(e) {
      e.preventDefault();
      BackdropManager.show();
    });
  }

  // Close menu
  if (menuCloseBtn) {
    menuCloseBtn.addEventListener('click', function(e) {
      e.preventDefault();
      BackdropManager.hide();
    });
  }

  // Close menu when clicking on overlay (outside menu container)
  if (menuOverlay) {
    menuOverlay.addEventListener('click', function(e) {
      if (e.target === menuOverlay) {
        BackdropManager.hide();
      }
    });
  }

  // Close menu on Escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && menuOverlay && menuOverlay.classList.contains('active')) {
      BackdropManager.hide();
    }
  });

  // Language switcher functionality
  const langSwitcher = document.querySelector('.menu-lang-switcher');
  const langCurrent = document.querySelector('.lang-current');
  const langDropdown = document.querySelector('.lang-dropdown');

  if (langSwitcher && langCurrent) {
    langCurrent.addEventListener('click', function(e) {
      e.stopPropagation();
      langDropdown.classList.toggle('active');
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
      if (!langSwitcher.contains(e.target)) {
        langDropdown.classList.remove('active');
      }
    });

    // Handle language selection
    const langOptions = document.querySelectorAll('.lang-option');
    langOptions.forEach(option => {
      option.addEventListener('click', function() {
        // Remove active class from all options
        langOptions.forEach(opt => opt.classList.remove('active'));
        // Add active class to clicked option
        this.classList.add('active');
        // Update current language display
        langCurrent.querySelector('span').textContent = this.textContent;
        // Close dropdown
        langDropdown.classList.remove('active');
      });
    });
  }

  // Smooth scroll for menu navigation items
  const menuNavItems = document.querySelectorAll('.menu-nav-item');
  menuNavItems.forEach(item => {
    item.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href && href.startsWith('#') && href.length > 1) {
        e.preventDefault();
        BackdropManager.hide();

        // Smooth scroll to section after menu closes
        setTimeout(() => {
          const targetElement = document.querySelector(href);
          if (targetElement) {
            targetElement.scrollIntoView({
              behavior: 'smooth',
              block: 'start'
            });
          }
        }, 400); // Wait for menu animation to complete
      }
    });
  });

  // Prevent menu container clicks from closing menu
  if (menuContainer) {
    menuContainer.addEventListener('click', function(e) {
      e.stopPropagation();
    });
  }

  // Accordion (mobile-first behavior inside menu)
  const accordionSections = Array.from(document.querySelectorAll('.menu-section'));
  const accordionToggles = Array.from(document.querySelectorAll('.menu-accordion-toggle'));

  function closeAllExcept(sectionToKeep) {
    accordionSections.forEach(section => {
      if (section === sectionToKeep) return;
      section.classList.remove('is-open');
      const btn = section.querySelector('.menu-accordion-toggle');
      const panelId = btn && btn.getAttribute('aria-controls');
      if (btn) btn.setAttribute('aria-expanded', 'false');
      if (panelId) {
        const panel = document.getElementById(panelId);
        if (panel) panel.style.maxHeight = '';
      }
    });
  }

  function openSection(section) {
    section.classList.add('is-open');
    const btn = section.querySelector('.menu-accordion-toggle');
    const panelId = btn && btn.getAttribute('aria-controls');
    if (btn) btn.setAttribute('aria-expanded', 'true');
    if (panelId) {
      const panel = document.getElementById(panelId);
      if (panel) panel.style.maxHeight = panel.scrollHeight + 'px';
    }
  }

  function syncOpenPanels() {
    accordionSections.forEach(section => {
      const btn = section.querySelector('.menu-accordion-toggle');
      const panelId = btn && btn.getAttribute('aria-controls');
      const panel = panelId ? document.getElementById(panelId) : null;
      if (!btn || !panel) return;

      if (section.classList.contains('is-open')) {
        btn.setAttribute('aria-expanded', 'true');
        panel.style.maxHeight = panel.scrollHeight + 'px';
      } else {
        btn.setAttribute('aria-expanded', 'false');
        panel.style.maxHeight = '';
      }
    });
  }

  function isMobileMenu() {
    return window.matchMedia && window.matchMedia('(max-width: 480px)').matches;
  }

  accordionToggles.forEach(btn => {
    btn.addEventListener('click', function() {
      if (!isMobileMenu()) return;

      const section = btn.closest('.menu-section');
      if (!section) return;

      const willOpen = !section.classList.contains('is-open');
      if (willOpen) {
        closeAllExcept(section);
        openSection(section);
      } else {
        section.classList.remove('is-open');
        btn.setAttribute('aria-expanded', 'false');
        const panelId = btn.getAttribute('aria-controls');
        const panel = panelId ? document.getElementById(panelId) : null;
        if (panel) panel.style.maxHeight = '';
      }
    });
  });

  // Пересчет высот при ресайзе / смене ориентации
  window.addEventListener('resize', function() {
    if (isMobileMenu()) {
      syncOpenPanels();
    } else {
      // На desktop/tablet аккордеон не нужен — показываем все панели
      accordionSections.forEach(section => section.classList.add('is-open'));
      accordionToggles.forEach(btn => btn.setAttribute('aria-expanded', 'true'));
      document.querySelectorAll('.menu-accordion-panel').forEach(panel => {
        panel.style.maxHeight = '';
      });
    }
  });

  // Init state
  if (!isMobileMenu()) {
    accordionSections.forEach(section => section.classList.add('is-open'));
    accordionToggles.forEach(btn => btn.setAttribute('aria-expanded', 'true'));
  } else {
    syncOpenPanels();
  }
});

/* ==========================
    End Fullscreen Menu
   ========================== */
