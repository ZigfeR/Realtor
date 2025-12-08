const fab = document.querySelector(".contact-fab-btn");
const list = document.querySelector(".contact-fab-list-container");
const callbackItem = document.querySelector(".contact-fab-list.callback");
const writeUsItem = document.querySelector(".contact-fab-list.writeUs");

const callbackPopup = document.querySelector(
  ".contact-fab-popup-overlay.callback"
);
const writeUsPopup = document.querySelector(
  ".contact-fab-popup-overlay.writeUs"
);

// === helpers ===

// открыт ли сейчас какой-либо попап
function getOpenPopup() {
  return document.querySelector(".contact-fab-popup-overlay.is-open");
}

function isAnyPopupOpen() {
  return !!getOpenPopup();
}

// плавное открытие попапа
function openPopup(popup) {
  // закрываем оба без скрытия (если вдруг открыт другой)
  closePopup(callbackPopup, false);
  closePopup(writeUsPopup, false);

  popup.classList.remove("hidden", "is-closing");
  void popup.offsetWidth; // форс-рефлоу
  popup.classList.add("is-open");

  // при открытом попапе скрываем список fab
  fab.classList.remove("active");
  list.classList.remove("active");
}

// плавное закрытие попапа БЕЗ очистки полей
function closePopup(popup, withHide = true) {
  if (!popup || !popup.classList.contains("is-open")) return;

  popup.classList.remove("is-open");
  popup.classList.add("is-closing");

  const duration = 250; // 0.25s как в CSS

  if (withHide) {
    setTimeout(() => {
      popup.classList.add("hidden");
      popup.classList.remove("is-closing");
    }, duration);
  }
}

// === FAB и список ===

fab.addEventListener("click", (event) => {
  event.stopPropagation();

  const open = getOpenPopup();

  if (open) {
    // если есть открытый попап — закрываем его и открываем список
    closePopup(open);
    fab.classList.add("active");
    list.classList.add("active");
  } else {
    // обычное поведение: открыть/закрыть список
    fab.classList.toggle("active");
    list.classList.toggle("active");
  }
});

// чтобы клик внутри списка не считался кликом "снаружи"
list.addEventListener("click", (event) => {
  event.stopPropagation();
});

// закрытие списка по клику вне fab и списка
document.addEventListener("click", (event) => {
  const clickedInsideFab = fab.contains(event.target);
  const clickedInsideList = list.contains(event.target);

  if (!clickedInsideFab && !clickedInsideList) {
    fab.classList.remove("active");
    list.classList.remove("active");
  }
});

// === открытие попапов из списка ===

callbackItem.addEventListener("click", () => {
  openPopup(callbackPopup);
});

writeUsItem.addEventListener("click", () => {
  openPopup(writeUsPopup);
});

// === закрытие попапов ===

// по крестику
document.querySelectorAll(".contact-fab-popup__close").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    const overlay = btn.closest(".contact-fab-popup-overlay");
    closePopup(overlay);
  });
});

// клик внутри самого окна попапа НЕ должен закрывать его
document.querySelectorAll(".contact-fab-popup").forEach((popupContent) => {
  popupContent.addEventListener("click", (e) => e.stopPropagation());
});

// по клику ВНЕ попапа — по документу
document.addEventListener("click", (e) => {
  const open = getOpenPopup();
  if (!open) return;

  const popupContent = open.querySelector(".contact-fab-popup");
  const clickedInsidePopup = popupContent.contains(e.target);
  const clickedFab = fab.contains(e.target);
  const clickedList = list.contains(e.target);

  // если клик не по окну, не по fab и не по списку — закрываем
  if (!clickedInsidePopup && !clickedFab && !clickedList) {
    closePopup(open);
  }
});
