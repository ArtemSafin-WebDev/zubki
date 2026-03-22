import EducationSection from "../classes/components/EducationSection";

export default function educationSection() {
  const elements = Array.from(
    document.querySelectorAll<HTMLElement>(".js-education-section"),
  );

  elements.forEach((element) => {
    if (EducationSection.getInstanceFor(element)) return;
    new EducationSection(element);
  });
}
