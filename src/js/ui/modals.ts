import Modal from "../classes/components/Modal";

export default function modals() {
  const dialogs = Array.from(document.querySelectorAll<HTMLDialogElement>("dialog"));

  dialogs.forEach((dialog) => {
    if (Modal.getInstanceFor(dialog)) return;
    new Modal(dialog);
  });

  document.querySelectorAll<HTMLElement>("[data-open]").forEach((trigger) => {
    trigger.addEventListener("click", (event) => {
      event.preventDefault();

      const selector = trigger.dataset.open;
      if (!selector) return;

      const dialog = document.querySelector<HTMLDialogElement>(selector);
      if (!dialog) return;

      const modalInstance = Modal.getInstanceFor(dialog);
      if (modalInstance) {
        modalInstance.open();
        return;
      }

      if (!dialog.open) dialog.showModal();
    });
  });
}
