import CategoryVideoCard from "../classes/components/CategoryVideoCard";

export default function categoryVideoCards() {
  const elements = Array.from(
    document.querySelectorAll<HTMLElement>(".js-category-video-card")
  );

  elements.forEach((element) => {
    if (CategoryVideoCard.getInstanceFor(element)) return;
    new CategoryVideoCard(element);
  });
}
