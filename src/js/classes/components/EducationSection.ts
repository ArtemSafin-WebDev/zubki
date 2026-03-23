import Component from "../Component";
import Swiper from "swiper";
import { Navigation, Pagination } from "swiper/modules";
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
    this.syncDesktopSlider();

    this.mediaQuery.addEventListener("change", this.handleMediaQueryChange, {
      signal: this.abortController.signal,
    });
  }

  private syncDesktopSlider = () => {
    if (this.mediaQuery.matches) {
      this.destroySlider(false);
      return;
    }

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

    if (this.swiperInstance) {
      this.swiperInstance.update();
      return;
    }

    this.swiperInstance = new Swiper(container, {
      modules: [Navigation, Pagination],
      slidesPerView: 2,
      slidesPerGroup: 2,
      spaceBetween: 32,
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
  };

  private handleMediaQueryChange = () => {
    queueMicrotask(() => {
      if (this.abortController.signal.aborted) {
        return;
      }

      this.syncDesktopSlider();
    });
  };

  private destroySlider(cleanStyles = true) {
    this.swiperInstance?.destroy(true, cleanStyles);
    this.swiperInstance = null;
  }

  public destroy() {
    this.destroySlider();
    this.abortController.abort();
    this.unregister();
  }
}

export default EducationSection;
