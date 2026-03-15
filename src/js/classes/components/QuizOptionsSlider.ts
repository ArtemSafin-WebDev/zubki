import Component from "../Component";
import Swiper from "swiper";
import { Navigation, Pagination } from "swiper/modules";

class QuizOptionsSlider extends Component {
  private swiperInstance: Swiper | null = null;

  constructor(element: HTMLElement) {
    super(element);

    const container = this.element.querySelector<HTMLElement>(
      ".quiz-question__options-slider",
    );
    const pagination = this.element.querySelector<HTMLElement>(
      ".quiz-question__options-pagination",
    );
    const nextButton = this.element.querySelector<HTMLButtonElement>(
      ".quiz-question__options-nav--next",
    );
    const prevButton = this.element.querySelector<HTMLButtonElement>(
      ".quiz-question__options-nav--prev",
    );

    if (!container || !pagination || !nextButton || !prevButton) {
      throw new Error("Quiz options slider elements not found");
    }

    this.swiperInstance = new Swiper(container, {
      modules: [Navigation, Pagination],
      slidesPerView: "auto",
      spaceBetween: 8,
      speed: 260,
      centeredSlides: false,
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

export default QuizOptionsSlider;
