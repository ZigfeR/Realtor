const title = document.querySelector(".container-achivements-right h5");
const leftContainer = document.querySelector(".container-achivements-left");
const rightContainer = document.querySelector(".container-achivements-right");

// создаём фиктивный якорь, чтобы знать место возврата
const placeholder = document.createComment("h5 placeholder");
rightContainer.insertBefore(placeholder, rightContainer.firstChild);

function moveTitle() {
  if (window.innerWidth < 480) {
    if (!leftContainer.contains(title)) {
      leftContainer.appendChild(title);
    }
  } else {
    if (!rightContainer.contains(title)) {
      rightContainer.insertBefore(title, placeholder.nextSibling);
    }
  }
}

moveTitle(); // запуск при загрузке
window.addEventListener("resize", moveTitle); // обработка при изменении ширины
