import Component from "../Component";
import Swiper from "swiper";
import { Navigation, Pagination, EffectFade } from "swiper/modules";
import { MOBILE_BREAKPOINT } from "../../constants/breakpoints";

const MOBILE_BREAKPOINT_QUERY = `(max-width: ${MOBILE_BREAKPOINT}px)`;

class EducationSection extends Component {
  private swiperInstance: Swiper | null = null;
  private mediaQuery: MediaQueryList;
  private abortController: AbortController;

  constructor(element: HTMLElement) {
    super(element);
    this.mediaQuery = window.matchMedia(MOBILE_BREAKPOINT_QUERY);
    this.abortController = new AbortController();
    this.initSlider();

    this.mediaQuery.addEventListener("change", this.handleMediaQueryChange, {
      signal: this.abortController.signal,
    });
  }

  private initSlider() {
    const container = this.element.querySelector<HTMLElement>(
      ".education-section__slider"
    );
    const pagination = this.element.querySelector<HTMLElement>(
      ".education-section__pagination"
    );
    const nextButton = this.element.querySelector<HTMLButtonElement>(
      ".education-section__nav--next"
    );
    const prevButton = this.element.querySelector<HTMLButtonElement>(
      ".education-section__nav--prev"
    );

    if (!container || !pagination || !nextButton || !prevButton) {
      return;
    }

    if (this.mediaQuery.matches) {
      this.destroySlider();
      this.ungroupSlides(container);
      return;
    }

    this.groupSlidesForFade(container);

    if (!this.swiperInstance) {
      this.swiperInstance = new Swiper(container, {
        modules: [Navigation, Pagination, EffectFade],
        slidesPerView: 1,
        effect: "fade",
        fadeEffect: {
          crossFade: true,
        },
        speed: 600,
        watchOverflow: true,
        allowTouchMove: true,
        navigation: {
          prevEl: prevButton,
          nextEl: nextButton,
        },
        pagination: {
          el: pagination,
          clickable: true,
        },
      });
    }
  }

  private groupSlidesForFade(container: HTMLElement) {
    const wrapper = container.querySelector<HTMLElement>(".swiper-wrapper");

    if (!wrapper || wrapper.querySelector(".education-section__slide-group")) {
      return;
    }

    const sourceSlides = Array.from(wrapper.children).filter(
      (child): child is HTMLElement =>
        child instanceof HTMLElement &&
        child.classList.contains("education-section__slide") &&
        child.classList.contains("swiper-slide")
    );

    if (sourceSlides.length === 0) {
      return;
    }

    const groupedSlides: HTMLElement[] = [];

    for (let index = 0; index < sourceSlides.length; index += 2) {
      const slideGroup = document.createElement("div");
      slideGroup.className = "education-section__slide-group swiper-slide";

      const firstSlide = sourceSlides[index];
      firstSlide.classList.remove("swiper-slide");
      firstSlide.classList.add("education-section__slide-item");
      slideGroup.append(firstSlide);

      const secondSlide = sourceSlides[index + 1];
      if (secondSlide) {
        secondSlide.classList.remove("swiper-slide");
        secondSlide.classList.add("education-section__slide-item");
        slideGroup.append(secondSlide);
      }

      groupedSlides.push(slideGroup);
    }

    wrapper.replaceChildren(...groupedSlides);
  }

  private ungroupSlides(container: HTMLElement) {
    const wrapper = container.querySelector<HTMLElement>(".swiper-wrapper");

    if (!wrapper) {
      return;
    }

    const groupedSlides = Array.from(wrapper.children).filter(
      (child): child is HTMLElement =>
        child instanceof HTMLElement &&
        child.classList.contains("education-section__slide-group")
    );

    if (groupedSlides.length === 0) {
      return;
    }

    const flatSlides: HTMLElement[] = [];

    groupedSlides.forEach((group) => {
      Array.from(group.children).forEach((child) => {
        if (
          !(child instanceof HTMLElement) ||
          !child.classList.contains("education-section__slide")
        ) {
          return;
        }

        child.classList.remove("education-section__slide-item");
        child.classList.add("swiper-slide");
        flatSlides.push(child);
      });
    });

    wrapper.replaceChildren(...flatSlides);
  }

  private destroySlider() {
    this.swiperInstance?.destroy(true, true);
    this.swiperInstance = null;
  }

  private handleMediaQueryChange = () => {
    this.initSlider();
  };

  public destroy() {
    this.destroySlider();
    this.abortController.abort();
    this.unregister();
  }
}

export default EducationSection;
