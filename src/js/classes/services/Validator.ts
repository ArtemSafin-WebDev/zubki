import isAlphanumeric from "validator/es/lib/isAlphanumeric";
import isNumeric from "validator/es/lib/isNumeric";

interface ValidationError {
  element: HTMLInputElement | HTMLElement;
  message: string;
}

type Locale = {
  requiredField: string;
  emailField: string;
  alphanumericField: string;
  phoneField: string;
};

type Localization = {
  ru: Locale;
  en: Locale;
};

interface ValidatorOptions {
  localization?: Localization;
  onLayoutChange?: () => void;
  invalidClass?: string;
  errorClass?: string;
}

const defaultLocalization: Localization = {
  ru: {
    requiredField: "Обязательное поле",
    emailField: "Введите корректный E-mail",
    alphanumericField: "Разрешены только цифры и буквы",
    phoneField: "Введите правильный номер телефона",
  },
  en: {
    requiredField: "Field is required",
    emailField: "Enter correct E-mail",
    alphanumericField: "Only digits and numbers allowed",
    phoneField: "Enter correct phone number",
  },
};

class Validator {
  public errors: ValidationError[] = [];
  private form: HTMLFormElement;
  private textFields: HTMLInputElement[];
  private selects: HTMLElement[];
  private checkboxes: HTMLInputElement[];
  private hasBeenValidated: boolean = false;
  private readonly emailRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  private readonly phoneRegex =
    /^(\+7|7|8)?[\s\-]?\(?[489][0-9]{2}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/;
  private localization: Localization;
  private locale: keyof Localization;
  private onLayoutChange: () => void;
  private invalidClass: string;
  private errorClass: string;
  private listenerPairs: Array<[HTMLElement, string, () => void]> = [];

  constructor(form: HTMLFormElement, options: ValidatorOptions = {}) {
    this.form = form;
    this.form.noValidate = true;
    this.localization = options.localization ?? defaultLocalization;
    this.onLayoutChange = options.onLayoutChange ?? (() => {});
    this.invalidClass = options.invalidClass ?? "not-valid";
    this.errorClass = options.errorClass ?? "validation-error";

    const lang = document.documentElement.lang.toLowerCase().replace("_", "-");
    this.locale = lang.startsWith("ru") ? "ru" : "en";

    this.textFields = Array.from(
      form.querySelectorAll(
        'input[type="text"], input[type="email"], input[type="tel"]'
      )
    );
    this.selects = Array.from(form.querySelectorAll("[data-required-select]"));
    this.checkboxes = Array.from(
      form.querySelectorAll('input[type="checkbox"]')
    );

    this.textFields.forEach((field) => {
      const handler = () => {
        if (this.hasBeenValidated) {
          const result = this.validateTextField(field);
          this.showFieldMessage(field, result);
        }
      };
      field.addEventListener("input", handler);
      this.listenerPairs.push([field, "input", handler]);
    });

    this.checkboxes.forEach((checkbox) => {
      const handler = () => {
        if (this.hasBeenValidated) {
          const result = this.validateCheckbox(checkbox);
          this.showFieldMessage(checkbox, result);
        }
      };
      checkbox.addEventListener("change", handler);
      this.listenerPairs.push([checkbox, "change", handler]);
    });

    this.selects.forEach((select) => {
      const selectInputs = Array.from(
        select.querySelectorAll<HTMLInputElement>(
          'input[type="radio"], input[type="checkbox"]'
        )
      );

      selectInputs.forEach((input) => {
        const handler = () => {
          if (this.hasBeenValidated) {
            const result = this.validateSelect(select);
            this.placeErrorMessage(select, result);
          }
        };
        input.addEventListener("change", handler);
        this.listenerPairs.push([input, "change", handler]);
      });
    });

    this.form.addEventListener("reset", this.reset);
  }

  get valid(): boolean {
    return this.errors.length === 0;
  }

  public validate(): boolean {
    this.hasBeenValidated = true;
    this.errors = [];

    this.textFields.forEach((field) => {
      const result = this.validateTextField(field);
      this.showFieldMessage(field, result);
    });

    this.selects.forEach((select) => {
      const result = this.validateSelect(select);
      this.placeErrorMessage(select, result);
    });

    this.checkboxes.forEach((checkbox) => {
      const result = this.validateCheckbox(checkbox);
      this.showFieldMessage(checkbox, result);
    });

    return this.errors.length === 0;
  }

  public reset = () => {
    this.errors = [];
    this.hasBeenValidated = false;
    this.form
      .querySelectorAll(`.${this.errorClass}`)
      .forEach((message) => message.remove());
    this.onLayoutChange();
  };

  public destroy() {
    this.form
      .querySelectorAll(`.${this.errorClass}`)
      .forEach((message) => message.remove());

    this.listenerPairs.forEach(([element, event, handler]) => {
      element.removeEventListener(event, handler);
    });

    this.form.removeEventListener("reset", this.reset);
  }

  private clearErrorsFor(element: HTMLElement) {
    this.errors = this.errors.filter((e) => e.element !== element);
  }

  private validateSelect(select: HTMLElement): ValidationError | null {
    this.clearErrorsFor(select);

    const selectInputs = Array.from(
      select.querySelectorAll<HTMLInputElement>(
        'input[type="radio"], input[type="checkbox"]'
      )
    );
    const checked = selectInputs.find((input) => input.checked);

    if (!checked) {
      const error: ValidationError = {
        element: select,
        message: this.localization[this.locale].requiredField,
      };
      this.errors.push(error);
      return error;
    }

    return null;
  }

  private validateCheckbox(checkbox: HTMLInputElement): ValidationError | null {
    this.clearErrorsFor(checkbox);

    if (!checkbox.checked && checkbox.hasAttribute("required")) {
      const error: ValidationError = {
        element: checkbox,
        message: this.localization[this.locale].requiredField,
      };
      this.errors.push(error);
      checkbox.classList.add(this.invalidClass);
      return error;
    }

    checkbox.classList.remove(this.invalidClass);
    return null;
  }

  private validateTextField(field: HTMLInputElement): ValidationError | null {
    const value = field.value.trim();
    this.clearErrorsFor(field);

    const error = this.getTextFieldError(field, value);
    if (error) {
      this.errors.push(error);
      field.classList.add(this.invalidClass);
    } else {
      field.classList.remove(this.invalidClass);
    }
    return error;
  }

  private getTextFieldError(
    field: HTMLInputElement,
    value: string
  ): ValidationError | null {
    const msg = this.localization[this.locale];

    if (field.hasAttribute("required") && !value) {
      return { element: field, message: msg.requiredField };
    }
    if (
      field.matches('[type="email"]') &&
      value &&
      !this.emailRegex.test(value)
    ) {
      return { element: field, message: msg.emailField };
    }
    if (
      field.matches('[type="tel"]') &&
      value &&
      !this.phoneRegex.test(value)
    ) {
      return { element: field, message: msg.phoneField };
    }
    if (field.matches('[data-alphanumeric=""]') && value) {
      const cleaned = value.replace(/\s/g, "");
      if (!isAlphanumeric(cleaned) || isNumeric(cleaned)) {
        return { element: field, message: msg.alphanumericField };
      }
    }

    return null;
  }

  private placeErrorMessage(
    container: HTMLElement,
    error: ValidationError | null
  ) {
    const currentMessage = container.querySelector(`.${this.errorClass}`);
    if (currentMessage && error === null) {
      currentMessage.remove();
    } else if (currentMessage && error !== null) {
      currentMessage.textContent = error.message;
    } else if (!currentMessage && error !== null) {
      const newMessage = document.createElement("div");
      newMessage.className = this.errorClass;
      newMessage.textContent = error.message;
      container.appendChild(newMessage);
    }

    this.onLayoutChange();
  }

  private showFieldMessage(
    field: HTMLInputElement,
    error: ValidationError | null
  ): void {
    const parent = field.parentElement?.parentElement;
    if (!parent) return;
    this.placeErrorMessage(parent, error);
  }
}

export type { ValidationError, ValidatorOptions, Locale, Localization };

export default Validator;
