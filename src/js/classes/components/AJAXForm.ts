import Component from "../Component";
import FormValidator from "../facades/FormValidator";
import Modal from "./Modal";

interface AJAXFormOptions {
  successModalSelector?: string | null;
  errorModalSelector?: string | null;
}

class AJAXForm extends Component {
  private formValidator: FormValidator;
  private abortController: AbortController | null = null;
  private submitBtn: HTMLButtonElement | null;
  private isSubmitting = false;
  private successModal: HTMLDialogElement | null = null;
  private errorModal: HTMLDialogElement | null = null;

  constructor(
    form: HTMLFormElement,
    formValidator: FormValidator,
    options: AJAXFormOptions = {}
  ) {
    super(form);
    this.formValidator = formValidator;

    const successSelector =
      options.successModalSelector ??
      form.getAttribute("data-success-modal") ??
      null;
    const errorSelector =
      options.errorModalSelector ??
      form.getAttribute("data-error-modal") ??
      null;

    if (successSelector) {
      this.successModal =
        document.querySelector<HTMLDialogElement>(successSelector);
    }
    if (errorSelector) {
      this.errorModal = document.querySelector<HTMLDialogElement>(errorSelector);
    }

    this.submitBtn = form.querySelector<HTMLButtonElement>(
      'button[type="submit"]'
    );

    this.handleSubmit = this.handleSubmit.bind(this);
    form.addEventListener("submit", this.handleSubmit);
  }

  private async handleSubmit(event: SubmitEvent) {
    event.preventDefault();
    if (this.isSubmitting) return;
    if (!this.formValidator.validate()) return;

    this.abortController?.abort();
    this.abortController = new AbortController();

    const data = new FormData(this.form);
    this.element.classList.remove("form-sent");
    this.isSubmitting = true;
    if (this.submitBtn) this.submitBtn.disabled = true;

    try {
      const res = await fetch(this.form.action, {
        method: "POST",
        body: data,
        signal: this.abortController.signal,
      });
      if (!res.ok) throw new Error(`Response is not ok: ${res.status}`);
      this.openModal(this.successModal);
      this.element.classList.add("form-sent");
      this.form.reset();
    } catch (error) {
      this.openModal(this.errorModal);
      console.error(error);
    } finally {
      this.isSubmitting = false;
      if (this.submitBtn) this.submitBtn.disabled = false;
    }
  }

  private get form(): HTMLFormElement {
    return this.element as HTMLFormElement;
  }

  private openModal(modal: HTMLDialogElement | null) {
    if (!modal || modal.open) return;

    const activeModal = Modal.getActive();
    if (activeModal) activeModal.close();

    const modalInstance = Modal.getInstanceFor(modal);
    if (modalInstance) {
      modalInstance.open();
      return;
    }

    modal.showModal();
  }

  destroy() {
    this.abortController?.abort();
    this.element.removeEventListener("submit", this.handleSubmit);
    this.formValidator.destroy();
    this.unregister();
  }
}

export default AJAXForm;
