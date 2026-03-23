import Dashboard from "../classes/components/Dashboard";
import EducationSection from "../classes/components/EducationSection";

export default function educationSection() {
  const elements = Array.from(
    document.querySelectorAll<HTMLElement>(".js-education-section"),
  );

  elements.forEach((element) => {
    if (!Dashboard.getInstanceFor(element)) {
      new Dashboard(element, {
        rootSelector: ".education-section__slider",
        trackSelector: ".swiper-wrapper",
        slideSelector: ".education-section__slide",
        paginationSelector: ".education-section__pagination",
        paginationBulletClass: "swiper-pagination-bullet",
        paginationBulletActiveClass: "swiper-pagination-bullet-active",
      });
    }

    if (!EducationSection.getInstanceFor(element)) {
      new EducationSection(element);
    }
  });
}
