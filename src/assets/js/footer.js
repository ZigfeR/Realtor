document.addEventListener("DOMContentLoaded", function () {
  function initAccordion() {
    // Проверяем ширину экрана
    if (window.innerWidth >= 480) {
      // Удаляем все стили и обработчики при ширине >= 480px
      var headers = document.querySelectorAll(".footer__row-container h3");
      headers.forEach(function (header) {
        var container = header.parentElement;
        var targetBox = container.querySelector(".footer__row-box");
        var arrow = header.querySelector(".arrow-list-mobile-svg");

        // Сбрасываем стили
        if (targetBox) {
          targetBox.style.maxHeight = "";
          targetBox.style.overflow = "";
          targetBox.style.transition = "";
        }
        if (arrow) {
          arrow.style.transform = "";
          arrow.style.transition = "";
        }
        header.style.cursor = "";
        header.style.userSelect = "";
        header.removeEventListener("click", header._toggleHandler);
      });
      return;
    }

    // Инициализация аккордеона только для < 480px
    var headers = document.querySelectorAll(".footer__row-container h3");

    headers.forEach(function (header) {
      var container = header.parentElement;
      var targetBox = container.querySelector(".footer__row-box");
      var arrow = header.querySelector(".arrow-list-mobile-svg");

      if (targetBox) {
        // Скрываем блок изначально
        targetBox.style.maxHeight = "0";
        targetBox.style.overflow = "hidden";
        targetBox.style.transition = "max-height 0.3s ease-out";

        // Делаем заголовок кликабельным
        header.style.cursor = "pointer";
        header.style.userSelect = "none";

        // Сохраняем высоту для анимации
        const openHeight = targetBox.scrollHeight + "px";

        // Сохраняем обработчик для удаления
        const toggleHandler = function () {
          if (
            targetBox.style.maxHeight === "0px" ||
            targetBox.style.maxHeight === ""
          ) {
            targetBox.style.maxHeight = openHeight;
            if (arrow) arrow.style.transform = "rotate(180deg)";
          } else {
            targetBox.style.maxHeight = "0px";
            if (arrow) arrow.style.transform = "rotate(0deg)";
          }
        };
        header._toggleHandler = toggleHandler;

        header.addEventListener("click", toggleHandler);

        if (arrow) {
          arrow.style.transition = "transform 0.3s ease-out";
          arrow.style.display = "inline-block";
        }
      }
    });
  }

  // Запускаем при загрузке
  initAccordion();

  // Перезапускаем при изменении размера окна
  window.addEventListener("resize", initAccordion);
});
