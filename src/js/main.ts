import "virtual:svg-icons-register";
import "../scss/style.scss";
import ui from "./ui";
import sections from "./sections";
import initForms from "./forms";

import FormValidator from "./classes/facades/FormValidator";

declare global {
  interface Window {
    innoApi: {
      Validator: typeof FormValidator;
    };
  }
}

window.innoApi = { Validator: FormValidator };

ui();
sections();
initForms();
