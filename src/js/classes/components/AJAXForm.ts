import Component from "../Component";
import FormValidator from "../facades/FormValidator";

interface AJAXFormOptions {
  successModalSelector?: string | null;
  errorModalSelector?: string | null;
}

class AJAXForm extends Component {
  private formValidator: FormValidator;
  private abortController: AbortController | null = null;
  private submitBtn: HTMLButtonElement | null;
  private isSubmitting = false;
  private successModal: HTMLElement | null = null;
  private errorModal: HTMLElement | null = null;

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

    if (successSelector)
      this.successModal = document.querySelector(successSelector);
    if (errorSelector) this.errorModal = document.querySelector(errorSelector);

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

    const data = new FormData(this.element as HTMLFormElement);
    this.element.classList.remove("form-sent");
    this.isSubmitting = true;
    if (this.submitBtn) this.submitBtn.disabled = true;

    try {
      const res = await fetch((this.element as HTMLFormElement).action, {
        method: "POST",
        body: data,
        signal: this.abortController.signal,
      });
      if (!res.ok) throw new Error(`Response is not ok: ${res.status}`);
      if (this.successModal) {
        this.successModal.classList.add("active");
        document.body.classList.add("modal-open");
      }
      this.element.classList.add("form-sent");
      (this.element as HTMLFormElement).reset();
    } catch (error) {
      if (this.errorModal) {
        this.errorModal.classList.add("active");
        document.body.classList.add("modal-open");
      }
      console.error(error);
    } finally {
      this.isSubmitting = false;
      if (this.submitBtn) this.submitBtn.disabled = false;
    }
  }

  destroy() {
    this.abortController?.abort();
    this.element.removeEventListener("submit", this.handleSubmit);
    this.formValidator.destroy();
    this.unregister();
  }
}

export default AJAXForm;
