import Accordion from "../classes/components/Accordion";

export default function accordions() {
  const elements = Array.from(
    document.querySelectorAll<HTMLElement>(".js-accordion")
  );
  const group: Accordion[] = [];
  elements.forEach((element) => {
    group.push(
      new Accordion(element, group, {
        btnSelector: ".js-accordion-btn",
        dropdownSelector: ".js-accordion-dropdown",
      })
    );
  });
}
