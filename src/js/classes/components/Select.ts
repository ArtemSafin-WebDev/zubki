import Component from "../Component";

class Select extends Component {
  private isOpen = false;
  private btn: HTMLButtonElement | null;
  private btnTextElement: HTMLSpanElement | null = null;
  private choices: HTMLInputElement[];
  private placeholderText: string = "";
  private resetBtns: HTMLButtonElement[] = [];
  private multiSelect = false;
  private form: HTMLFormElement | null = null;
  private handler: () => void;
  private initiallyCheckedValues: string[] = [];
  private handleResetBtnClick: (event: MouseEvent) => void;
  private handleFormReset: () => void;

  constructor(element: HTMLElement) {
    super(element);
    this.btn = this.element.querySelector<HTMLButtonElement>(
      'button[type="button"]:not(.js-select-accordion-btn)'
    );

    if (!this.btn) {
      console.warn("Select: button not found in", this.element);
    }

    this.form = this.element.closest("form");
    this.resetBtns = Array.from(this.element.querySelectorAll(".js-reset-btn"));
    if (this.btn) {
      this.btnTextElement =
        this.btn.querySelector<HTMLSpanElement>(".js-btn-text");
    }
    this.choices = Array.from(
      this.element.querySelectorAll<HTMLInputElement>(
        'input[type="radio"], input[type="checkbox"]'
      )
    );

    this.initiallyCheckedValues = this.choices
      .filter((input) => input.checked)
      .map((input) => input.value);

    if (this.choices.find((choice) => choice.matches('input[type="checkbox"]')))
      this.multiSelect = true;

    document.documentElement.addEventListener("click", this.handleOutsideClick);
    this.btn?.addEventListener("click", this.handleBtnClick);

    this.handler = this.multiSelect
      ? this.handleMultipleSelection
      : this.handleSingleSelection;
    this.choices.forEach((choice) =>
      choice.addEventListener("change", this.handler)
    );

    const dataPlaceholder = this.element.getAttribute("data-placeholder");

    if (dataPlaceholder) {
      this.placeholderText = dataPlaceholder;
    }

    this.handleResetBtnClick = (event: MouseEvent) => {
      event.preventDefault();
      this.reset();
    };
    this.resetBtns.forEach((btn) => {
      btn.addEventListener("click", this.handleResetBtnClick);
    });

    this.handleFormReset = () => {
      this.reset();
    };
    this.form?.addEventListener("reset", this.handleFormReset);

    this.refreshSelectionText();

    document.addEventListener("select:update", this.update);
  }

  public update = () => {
    this.choices.forEach((choice) =>
      choice.removeEventListener("change", this.handler)
    );
    this.choices = Array.from(
      this.element.querySelectorAll<HTMLInputElement>(
        'input[type="radio"], input[type="checkbox"]'
      )
    );
    this.choices.forEach((choice) =>
      choice.addEventListener("change", this.handler)
    );
    this.refreshSelectionText();
  };

  public open = () => {
    if (this.isOpen) return;
    this.element.classList.add("active");
    this.isOpen = true;
  };

  public close = () => {
    if (!this.isOpen) return;
    this.element.classList.remove("active");
    this.isOpen = false;
  };

  public destroy() {
    document.documentElement.removeEventListener(
      "click",
      this.handleOutsideClick
    );
    this.choices.forEach((choice) =>
      choice.removeEventListener("change", this.handler)
    );
    this.btn?.removeEventListener("click", this.handleBtnClick);
    document.removeEventListener("select:update", this.update);
    this.resetBtns.forEach((btn) => {
      btn.removeEventListener("click", this.handleResetBtnClick);
    });
    this.form?.removeEventListener("reset", this.handleFormReset);
    this.unregister();
  }

  private handleBtnClick = (event: MouseEvent) => {
    event.preventDefault();
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  };

  private refreshSelectionText = () => {
    if (this.multiSelect) {
      this.updateMultipleSelectionText();
    } else {
      this.updateSingleSelectionText();
    }
  };

  private updateMultipleSelectionText = () => {
    if (!this.choices.length) return;
    const activeChoices = this.choices.filter((choice) => choice.checked);
    if (activeChoices.length) {
      this.element.classList.add("choice-selected");
      const choicesText = activeChoices.map((choice) => {
        const textElement =
          choice.parentElement?.querySelector("span:last-of-type");
        return textElement?.textContent?.trim();
      });
      if (this.btnTextElement) {
        this.btnTextElement.textContent = choicesText.join(", ");
      }
    } else {
      this.element.classList.remove("choice-selected");
      if (this.btnTextElement) {
        this.btnTextElement.textContent = this.placeholderText;
      }
    }
  };

  private updateSingleSelectionText = () => {
    if (!this.choices.length) return;
    let activeChoice = this.choices.find((choice) => choice.checked);

    if (activeChoice) {
      if (activeChoice.value.trim()) {
        this.element.classList.add("choice-selected");
        const textElement =
          activeChoice.parentElement?.querySelector("span:last-of-type");

        if (textElement && this.btnTextElement) {
          this.btnTextElement.textContent = textElement.textContent;
        }
      } else {
        if (this.btnTextElement)
          this.btnTextElement.textContent = this.placeholderText;
        this.element.classList.remove("choice-selected");
      }
    } else {
      this.element.classList.remove("choice-selected");
      if (this.btnTextElement) {
        this.btnTextElement.textContent = this.placeholderText;
      }
    }
  };

  private handleMultipleSelection = () => {
    this.updateMultipleSelectionText();
  };

  private handleSingleSelection = () => {
    this.updateSingleSelectionText();
    this.close();
  };

  private handleOutsideClick = (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    if (this.element.contains(target)) return;
    this.close();
  };

  private reset = () => {
    this.choices.forEach((choice) => {
      choice.checked = false;
    });

    if (this.initiallyCheckedValues.length) {
      this.choices.forEach((choice) => {
        if (this.initiallyCheckedValues.includes(choice.value)) {
          choice.checked = true;
        }
      });
    }

    this.refreshSelectionText();
    this.close();
  };
}

export default Select;
