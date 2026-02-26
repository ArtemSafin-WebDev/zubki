import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Validator from "../services/Validator";
import InputMasks from "../services/InputMasks";
import type { ValidationError, Localization } from "../services/Validator";

gsap.registerPlugin(ScrollTrigger);

class FormValidator {
  private validator: Validator;
  private masks: InputMasks;

  constructor(form: HTMLFormElement, localization?: Localization) {
    this.masks = new InputMasks(form);
    this.validator = new Validator(form, {
      localization,
      onLayoutChange: () => ScrollTrigger.refresh(),
    });
  }

  get valid(): boolean {
    return this.validator.valid;
  }

  get errors(): ValidationError[] {
    return this.validator.errors;
  }

  validate(): boolean {
    return this.validator.validate();
  }

  reset(): void {
    this.validator.reset();
  }

  destroy(): void {
    this.validator.destroy();
    this.masks.destroy();
  }
}

export default FormValidator;
