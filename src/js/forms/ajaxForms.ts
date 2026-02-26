import FormValidator from "../classes/facades/FormValidator.ts";
import AJAXForm from "../classes/components/AJAXForm.ts";

export default function forms() {
  const elements = Array.from(
    document.querySelectorAll<HTMLFormElement>(".js-form")
  );

  elements.forEach((form) => {
    const formValidator = new FormValidator(form);
    new AJAXForm(form, formValidator);
  });
}
