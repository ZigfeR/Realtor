function handlePropertyClick() {
  alert("Открываем детали!");
}

// Анимация счётчиков
const counters = document.querySelectorAll(".container-box-value");

const startCounter = (counter) => {
  const target = +counter.getAttribute("data-target");
  const isPercent = counter.hasAttribute("data-is-percent");
  const duration = 2000; // 2 секунды
  const startTime = performance.now();

  const updateCounter = (currentTime) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    const current = Math.floor(progress * target);
    counter.textContent = isPercent ? `${current}%` : current.toLocaleString();

    if (progress < 1) {
      requestAnimationFrame(updateCounter);
    } else {
      counter.textContent = isPercent ? `${target}%` : target.toLocaleString();
    }
  };

  requestAnimationFrame(updateCounter);
};

// Intersection Observer
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const counter = entry.target;
        if (!counter.classList.contains("animated")) {
          startCounter(counter);
          counter.classList.add("animated");
        }
        observer.unobserve(counter);
      }
    });
  },
  { threshold: 0.5 } // 50% видимости
);

counters.forEach((counter) => {
  counter.textContent = "0";
  if (counter.hasAttribute("data-is-percent")) {
    counter.textContent = "0%";
  }
  observer.observe(counter);
});
