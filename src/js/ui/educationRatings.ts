import EducationRating from "../classes/components/EducationRating";

export default function educationRatings() {
  const elements = Array.from(
    document.querySelectorAll<HTMLElement>(".js-education-rating")
  );

  elements.forEach((element) => {
    if (EducationRating.getInstanceFor(element)) return;
    new EducationRating(element);
  });
}
