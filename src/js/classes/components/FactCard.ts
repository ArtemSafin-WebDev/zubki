import Component from "../Component";
import Swiper from "swiper";
import { Navigation, EffectFade, Pagination } from "swiper/modules";

class FactCard extends Component {
  private swiperInstance: Swiper | null = null;
  private abortController: AbortController;

  constructor(element: HTMLElement) {
    super(element);

    this.abortController = new AbortController();
    const initialSlideAttr = this.element.dataset.initialSlide;
    const initialSlide = Number(initialSlideAttr);
    const hasInitialSlide =
      initialSlideAttr !== undefined &&
      Number.isFinite(initialSlide) &&
      initialSlide >= 0;
    const container =
      this.element.querySelector<HTMLElement>(".fact-card__slider");
    const pagination = this.element.querySelector<HTMLElement>(
      ".fact-card__pagination"
    );
    if (!container) throw new Error("Fact card swiper container not found");

    this.swiperInstance = new Swiper(container, {
      modules: [Navigation, EffectFade, Pagination],
      autoHeight: true,
      effect: "fade",
      fadeEffect: {
        crossFade: true,
      },
      initialSlide: hasInitialSlide ? initialSlide : 0,
      pagination: {
        el: pagination,
        clickable: true,
        type: "bullets",
      },
      navigation: {
        prevEl: this.element.querySelector<HTMLButtonElement>(
          ".slider-arrows__btn--prev"
        ),
        nextEl: this.element.querySelector<HTMLButtonElement>(
          ".slider-arrows__btn--next"
        ),
      },
    });

    window.addEventListener(
      "load",
      () => {
        this.swiperInstance?.updateAutoHeight();
      },
      { signal: this.abortController.signal }
    );
  }

  public destroy() {
    this.swiperInstance?.destroy(true, true);
    this.swiperInstance = null;
    this.abortController.abort();
    this.unregister();
  }
}

export default FactCard;
