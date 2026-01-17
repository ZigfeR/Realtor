/**
 * UniversalSlider — универсальный слайдер для карточек
 * Работает с секциями top-cards и блога
 * Активен на планшете (481-1024px) и мобайле (≤480px)
 */
class UniversalSlider {
  constructor() {
    this.sliders = [];
    this.init();
  }

  init() {
    // Конфигурация слайдеров: селектор контейнера и настройки
    const sliderConfigs = [
      {
        containerSelector: ".top-cards-container__bottom",
        cardSelector: ".property-card",
        visibleMobile: 2,
        visibleTablet: 2
      },
      {
        containerSelector: ".container-blog-cards",
        cardSelector: ".blog-card",
        visibleMobile: 2,
        visibleTablet: 3
      }
    ];

    sliderConfigs.forEach((config) => {
      const containers = document.querySelectorAll(config.containerSelector);
      containers.forEach((container, index) => {
        this.createSlider(container, index, config);
      });
    });

    // Обработка ресайза
    window.addEventListener("resize", () => {
      clearTimeout(this.resizeTimeout);
      this.resizeTimeout = setTimeout(() => this.handleResize(), 100);
    });

    this.handleResize();
  }

  createSlider(container, index, config) {
    const cards = container.querySelectorAll(config.cardSelector);
    if (cards.length === 0) return;

    // Создаём обёртку для слайдера
    const sliderWrapper = document.createElement("div");
    sliderWrapper.className = "slider-wrapper";
    sliderWrapper.dataset.sliderIndex = index;

    // Создаём контейнер для карточек
    const sliderTrack = document.createElement("div");
    sliderTrack.className = "slider-track";

    // Перемещаем карточки в слайдер
    cards.forEach((card) => {
      const slide = document.createElement("div");
      slide.className = "slider-slide";
      slide.appendChild(card.cloneNode(true));
      sliderTrack.appendChild(slide);
    });

    // Создаём навигационные точки
    const dotsContainer = document.createElement("div");
    dotsContainer.className = "slider-dots";

    sliderWrapper.appendChild(sliderTrack);
    sliderWrapper.appendChild(dotsContainer);

    // Сохраняем данные слайдера
    const sliderData = {
      container,
      wrapper: sliderWrapper,
      track: sliderTrack,
      dotsContainer,
      cards: Array.from(cards),
      originalHTML: container.innerHTML,
      currentIndex: 0,
      visibleMobile: config.visibleMobile,
      visibleTablet: config.visibleTablet,
      isActive: false,
      startX: 0,
      currentX: 0,
      isDragging: false
    };

    this.sliders.push(sliderData);
    this.bindTouchEvents(sliderData);
  }

  bindTouchEvents(slider) {
    const { track } = slider;

    // Touch события
    track.addEventListener("touchstart", (e) => this.onDragStart(e, slider), { passive: true });
    track.addEventListener("touchmove", (e) => this.onDragMove(e, slider), { passive: false });
    track.addEventListener("touchend", () => this.onDragEnd(slider));

    // Mouse события для десктопа (тестирование)
    track.addEventListener("mousedown", (e) => this.onDragStart(e, slider));
    track.addEventListener("mousemove", (e) => this.onDragMove(e, slider));
    track.addEventListener("mouseup", () => this.onDragEnd(slider));
    track.addEventListener("mouseleave", () => this.onDragEnd(slider));
  }

  onDragStart(e, slider) {
    if (!slider.isActive) return;
    slider.isDragging = true;
    slider.startX = e.type.includes("mouse") ? e.pageX : e.touches[0].pageX;
    slider.track.style.transition = "none";
  }

  onDragMove(e, slider) {
    if (!slider.isDragging || !slider.isActive) return;

    const currentX = e.type.includes("mouse") ? e.pageX : e.touches[0].pageX;
    const diff = currentX - slider.startX;
    slider.currentX = diff;

    const offset = this.getOffset(slider) + diff;
    slider.track.style.transform = `translateX(${offset}px)`;

    // Предотвращаем скролл страницы при свайпе
    if (Math.abs(diff) > 10) {
      e.preventDefault();
    }
  }

  onDragEnd(slider) {
    if (!slider.isDragging || !slider.isActive) return;
    slider.isDragging = false;
    slider.track.style.transition = "transform 0.3s ease";

    const threshold = 50; // Минимальное расстояние для свайпа

    if (slider.currentX > threshold) {
      // Свайп вправо — предыдущий слайд
      this.prevSlide(slider);
    } else if (slider.currentX < -threshold) {
      // Свайп влево — следующий слайд
      this.nextSlide(slider);
    } else {
      // Возврат на место
      this.updateSliderPosition(slider);
    }

    slider.currentX = 0;
  }

  getOffset(slider) {
    const slideWidth = this.getSlideWidth(slider);
    return -slider.currentIndex * slideWidth;
  }

  getSlideWidth(slider) {
    const slide = slider.track.querySelector(".slider-slide");
    if (!slide) return 0;
    const gap = parseInt(getComputedStyle(slider.track).gap) || 0;
    return slide.offsetWidth + gap;
  }

  getVisibleCards(slider) {
    const width = window.innerWidth;
    if (width <= 480) return slider.visibleMobile;
    if (width <= 1024) return slider.visibleTablet;
    return slider.cards.length; // Десктоп — все карточки
  }

  getMaxIndex(slider) {
    const totalCards = slider.cards.length;
    const visibleCards = this.getVisibleCards(slider);
    return Math.max(0, totalCards - visibleCards);
  }

  prevSlide(slider) {
    if (slider.currentIndex > 0) {
      slider.currentIndex--;
      this.updateSliderPosition(slider);
      this.updateDots(slider);
    } else {
      this.updateSliderPosition(slider);
    }
  }

  nextSlide(slider) {
    const maxIndex = this.getMaxIndex(slider);
    if (slider.currentIndex < maxIndex) {
      slider.currentIndex++;
      this.updateSliderPosition(slider);
      this.updateDots(slider);
    } else {
      this.updateSliderPosition(slider);
    }
  }

  goToSlide(slider, index) {
    const maxIndex = this.getMaxIndex(slider);
    slider.currentIndex = Math.min(Math.max(0, index), maxIndex);
    this.updateSliderPosition(slider);
    this.updateDots(slider);
  }

  updateSliderPosition(slider) {
    const offset = this.getOffset(slider);
    slider.track.style.transform = `translateX(${offset}px)`;
  }

  createDots(slider) {
    const { dotsContainer, cards } = slider;
    dotsContainer.innerHTML = "";

    const totalCards = cards.length;
    const visibleCards = this.getVisibleCards(slider);
    const dotsCount = Math.max(1, totalCards - visibleCards + 1);

    for (let i = 0; i < dotsCount; i++) {
      const dot = document.createElement("button");
      dot.className = "slider-dot";
      dot.setAttribute("aria-label", `Перейти к слайду ${i + 1}`);
      if (i === slider.currentIndex) {
        dot.classList.add("active");
      }
      dot.addEventListener("click", () => this.goToSlide(slider, i));
      dotsContainer.appendChild(dot);
    }
  }

  updateDots(slider) {
    const dots = slider.dotsContainer.querySelectorAll(".slider-dot");
    dots.forEach((dot, i) => {
      dot.classList.toggle("active", i === slider.currentIndex);
    });
  }

  activateSlider(slider) {
    if (slider.isActive) return;

    slider.isActive = true;
    slider.container.innerHTML = "";
    slider.container.appendChild(slider.wrapper);
    slider.currentIndex = 0;
    
    this.createDots(slider);
    this.updateSliderPosition(slider);
  }

  deactivateSlider(slider) {
    if (!slider.isActive) return;

    slider.isActive = false;
    slider.container.innerHTML = slider.originalHTML;
    slider.currentIndex = 0;
  }

  handleResize() {
    const isMobileOrTablet = window.innerWidth <= 1024;

    this.sliders.forEach((slider) => {
      if (isMobileOrTablet) {
        this.activateSlider(slider);
        this.createDots(slider); // Пересоздаём точки при ресайзе
        this.updateSliderPosition(slider);
      } else {
        this.deactivateSlider(slider);
      }
    });
  }
}

// Инициализация
document.addEventListener("DOMContentLoaded", () => {
  new UniversalSlider();
});
