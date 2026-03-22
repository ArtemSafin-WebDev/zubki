import Component from "../Component";
import Swiper from "swiper";
import { Navigation, Pagination } from "swiper/modules";

class EducationSection extends Component {
  private swiperInstance: Swiper | null = null;

  constructor(element: HTMLElement) {
    super(element);
    this.initSlider();
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

    this.swiperInstance = new Swiper(container, {
      modules: [Navigation, Pagination],
      slidesPerView: "auto",
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

  public destroy() {
    this.swiperInstance?.destroy(true, true);
    this.swiperInstance = null;
    this.unregister();
  }
}

export default EducationSection;
