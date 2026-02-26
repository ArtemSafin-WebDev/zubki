import Inputmask from "inputmask";

class InputMasks {
  private form: HTMLFormElement;
  private listenerPairs: Array<
    [HTMLInputElement, string, EventListenerOrEventListenerObject]
  > = [];

  constructor(form: HTMLFormElement) {
    this.form = form;

    const fields = Array.from(
      form.querySelectorAll<HTMLInputElement>(
        'input[type="tel"], input[inputmode="numeric"]'
      )
    );

    fields.forEach((field) => {
      if (field.matches('[type="tel"]')) {
        new Inputmask({ mask: "+7 (999) 999-99-99" }).mask(field);
      }

      if (field.matches('[inputmode="numeric"]')) {
        const handler = (event: Event) => {
          const inputEvent = event as InputEvent;
          const beforeValue = field.value;
          inputEvent.target?.addEventListener(
            "input",
            () => {
              if (field.validity.patternMismatch) {
                field.value = beforeValue;
              }
            },
            { once: true }
          );
        };
        field.addEventListener("beforeinput", handler);
        this.listenerPairs.push([field, "beforeinput", handler]);
      }
    });
  }

  destroy() {
    this.listenerPairs.forEach(([field, event, handler]) => {
      field.removeEventListener(event, handler);
    });

    const telFields =
      this.form.querySelectorAll<HTMLInputElement>('input[type="tel"]');
    telFields.forEach((field) => {
      if (field.inputmask) {
        field.inputmask.remove();
      }
    });
  }
}

export default InputMasks;
