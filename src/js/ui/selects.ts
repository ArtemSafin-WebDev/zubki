import Select from "../classes/components/Select";

export default function selects() {
  const elements = Array.from(document.querySelectorAll<HTMLElement>(".js-select"));

  elements.forEach((element) => {
    if (Select.getInstanceFor(element)) return;
    new Select(element);
  });
}
