import Dashboard from "../classes/components/Dashboard";
import EducationSection from "../classes/components/EducationSection";

function mountAsideSlide(element: HTMLElement) {
  const aside = element.querySelector<HTMLElement>(".education-section__aside");
  const wrapper = element.querySelector<HTMLElement>(
    ".education-section__slider .swiper-wrapper"
  );

  if (!aside || !wrapper || aside.parentElement === wrapper) {
    return;
  }

  aside.classList.add("education-section__slide", "education-section__slide--aside");
  aside.classList.add("swiper-slide");
  wrapper.prepend(aside);
}

function restoreAsideSlide(element: HTMLElement) {
  const grid = element.querySelector<HTMLElement>(".education-section__grid");
  const main = element.querySelector<HTMLElement>(".education-section__main");
  const aside = element.querySelector<HTMLElement>(".education-section__aside");

  if (!aside) {
    return;
  }

  aside.classList.remove(
    "education-section__slide",
    "education-section__slide--aside",
    "swiper-slide"
  );

  if (!grid || !main || aside.parentElement === grid) {
    return;
  }

  grid.insertBefore(aside, main);
}

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
        onBeforeMobileInit: () => {
          mountAsideSlide(element);
        },
        onAfterMobileDestroy: () => {
          restoreAsideSlide(element);
        },
      });
    }

    if (!EducationSection.getInstanceFor(element)) {
      new EducationSection(element);
    }
  });
}
