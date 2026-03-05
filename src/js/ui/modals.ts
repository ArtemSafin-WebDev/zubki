export default function modals() {
  // Собираем все диалоги на странице
  const dialogs = document.querySelectorAll<HTMLDialogElement>("dialog");

  // Функция открытия с логом
  function openDialog(dialog: HTMLDialogElement) {
    dialog.showModal();
    console.log(dialog.id, "открыт через функцию");
  }

  // Кнопки открытия
  document.querySelectorAll<HTMLElement>("[data-open]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const selector = btn.dataset.open;
      if (!selector) return;
      const dialog = document.querySelector<HTMLDialogElement>(selector);
      if (dialog) openDialog(dialog);
    });
  });

  // Кнопки закрытия внутри диалогов
  document
    .querySelectorAll<HTMLButtonElement>("[data-close]")
    .forEach((btn) => {
      btn.addEventListener("click", (event) => {
        event.preventDefault();
        btn.closest("dialog")?.close();
      });
    });

  // MutationObserver для атрибута open
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === "attributes" && mutation.attributeName === "open") {
        const dialog = mutation.target as HTMLDialogElement;
        if (dialog.hasAttribute("open")) {
          document.body.classList.add("modal-open");
          console.log(dialog.id, "открыт через атрибут или show/showModal");
        } else {
          document.body.classList.remove("modal-open");
          console.log(dialog.id, "закрыт");
        }
      }
    });
  });

  // Навешиваем на все диалоги
  dialogs.forEach((dialog) => {
    observer.observe(dialog, { attributes: true });
  });

  // Для закрытия через Esc или .close() ловим событие close
  dialogs.forEach((dialog) => {
    dialog.addEventListener("close", () => {
      console.log(dialog.id, "закрыт через close/cancel/ESC");
    });

    dialog.addEventListener("click", (event) => {
      if (event.target === dialog) {
        dialog.close();
      }
    });
  });
}
