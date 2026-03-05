import Component from "../Component";

class Modal extends Component {
  private observer: MutationObserver;
  private abortController: AbortController;

  constructor(element: HTMLDialogElement) {
    super(element);

    this.abortController = new AbortController();
    this.observer = new MutationObserver(this.handleMutations);

    const signal = this.abortController.signal;

    this.dialog.addEventListener("click", this.handleDialogClick, { signal });
    this.dialog.addEventListener("close", this.handleDialogClose, { signal });

    this.observer.observe(this.dialog, {
      attributes: true,
      attributeFilter: ["open"],
    });

    this.syncBodyLock();
  }

  public open() {
    if (this.dialog.open) return;
    this.dialog.showModal();
    this.syncBodyLock();
  }

  public close() {
    if (!this.dialog.open) return;
    this.dialog.close();
    this.syncBodyLock();
  }

  public destroy() {
    this.abortController.abort();
    this.observer.disconnect();
    this.unregister();
    this.syncBodyLock();
  }

  private get dialog(): HTMLDialogElement {
    return this.element as HTMLDialogElement;
  }

  private syncBodyLock() {
    const hasOpenedModals = Boolean(document.querySelector("dialog[open]"));

    document.body.classList.toggle("modal-open", hasOpenedModals);
  }

  private handleDialogClick = (event: MouseEvent) => {
    const target = event.target as Element | null;
    if (!target) return;

    if (target === this.dialog) {
      this.close();
      return;
    }

    const closeButton = target.closest<HTMLElement>("[data-close]");
    if (!closeButton) return;

    event.preventDefault();
    this.close();
  };

  private handleDialogClose = () => {
    this.syncBodyLock();
  };

  private handleMutations = (mutations: MutationRecord[]) => {
    const hasOpenMutation = mutations.some(
      (mutation) =>
        mutation.type === "attributes" && mutation.attributeName === "open"
    );

    if (hasOpenMutation) this.syncBodyLock();
  };
}

export default Modal;
