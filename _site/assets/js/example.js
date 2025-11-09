console.log("I feel included!");
console.log("Hello from example.js!");

const BREAKPOINT = 1024;

const updateChooseUs = () => {
  const isMobileOrTablet = window.innerWidth <= BREAKPOINT;

  document.querySelectorAll(".chooseUs-box").forEach((box) => {
    const shadow = box.querySelector(".chooseUs-box-shadow");

    // Сброс
    box.classList.remove("active");
    shadow.onclick = null;

    // На десктопе — ничего не делаем
    if (!isMobileOrTablet) return;

    // Клик — переключаем класс на весь .chooseUs-box
    shadow.onclick = (e) => {
      e.preventDefault();
      box.classList.toggle("active");
    };
  });
};

// === Запуск ===
updateChooseUs();

// === Ресайз (без конфликтов) ===
let chooseUsResizeTimer;
window.addEventListener("resize", () => {
  clearTimeout(chooseUsResizeTimer);
  chooseUsResizeTimer = setTimeout(updateChooseUs, 100);
});
