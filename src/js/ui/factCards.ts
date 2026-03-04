import FactCard from "../classes/components/FactCard";

export default function factCards() {
  const elements = Array.from(
    document.querySelectorAll<HTMLElement>(".js-fact-card")
  );

  elements.forEach((element) => {
    if (FactCard.getInstanceFor(element)) return;
    new FactCard(element);
  });
}
