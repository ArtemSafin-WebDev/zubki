import HeaderMenu from "../classes/components/HeaderMenu";

export default function headerMenu() {
  const elements = Array.from(
    document.querySelectorAll<HTMLElement>(".page-header")
  );

  elements.forEach((element) => {
    if (HeaderMenu.getInstanceFor(element)) return;
    new HeaderMenu(element);
  });
}
