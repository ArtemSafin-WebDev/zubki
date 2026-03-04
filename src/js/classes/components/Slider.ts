import Swiper from "swiper";
import { Navigation, EffectFade } from "swiper/modules";
import { SwiperOptions } from "swiper/types";
import { MOBILE_BREAKPOINT } from "../../constants/breakpoints";
import Component from "../Component";

type SliderAutoHeightOptions =
  | { autoHeight: true; onHeightChange?: () => void }
  | { autoHeight?: false; onHeightChange?: never };

type SliderFadeEffectOptions =
  | { effect: "fade"; crossFade?: boolean }
  | { effect?: "slide"; crossFade?: never };

type SliderResponsiveOptions =
  | { onlyMobile: true; onlyDesktop?: never }
  | { onlyMobile?: never; onlyDesktop: true }
  | { onlyMobile?: never; onlyDesktop?: never };

type SliderOptions = {
  speed?: number;
  slidesPerView?: "auto" | number;
  longSwipesRatio?: number;
  spaceBetween?: number;
  nested?: boolean;
  containerSelector?: string;
  prevArrow?: string | HTMLButtonElement;
  nextArrow?: string | HTMLButtonElement;
  onSlideChange?: (swiper: Swiper) => void;
} & SliderAutoHeightOptions &
  SliderFadeEffectOptions &
  SliderResponsiveOptions;

const DEFAULT_OPTIONS: SliderOptions = {
  autoHeight: false,
  speed: 600,
  spaceBetween: 0,
  slidesPerView: 1,
  longSwipesRatio: 0.5,
  prevArrow: ".slider-arrows__btn--prev",
  nextArrow: ".slider-arrows__btn--next",
  effect: "slide",
};

export default class Slider extends Component {
  private swiperInstance: Swiper | null = null;
  private swiperOptions: SwiperOptions = {};
  private abortController: AbortController | null = null;
  private mediaQuery: MediaQueryList | null = null;
  private handleMediaChange: ((e: MediaQueryListEvent) => void) | null = null;
  private options?: SliderOptions;

  constructor(element: HTMLElement, options?: SliderOptions) {
    super(element);
    this.options = options;
    this.abortController = new AbortController();
    const mergedOptions = {
      ...DEFAULT_OPTIONS,
      ...this.options,
    } as SliderOptions;
    this.swiperOptions = {
      modules: [Navigation, EffectFade],
      effect: mergedOptions.effect,
      fadeEffect: {
        crossFade: mergedOptions.crossFade,
      },
      autoHeight: mergedOptions.autoHeight,
      slidesPerView: mergedOptions.slidesPerView,
      speed: mergedOptions.speed,
      spaceBetween: mergedOptions.spaceBetween,
      nested: mergedOptions.nested,
      longSwipesRatio: mergedOptions.longSwipesRatio,
      navigation: {
        prevEl:
          typeof mergedOptions.prevArrow === "string"
            ? element.querySelector<HTMLButtonElement>(mergedOptions.prevArrow)
            : mergedOptions.prevArrow,
        nextEl:
          typeof mergedOptions.nextArrow === "string"
            ? element.querySelector<HTMLButtonElement>(mergedOptions.nextArrow)
            : mergedOptions.nextArrow,
      },
      on: {
        slideChange: (swiper) => {
          if (mergedOptions.onSlideChange) mergedOptions.onSlideChange(swiper);
        },
        slideChangeTransitionEnd: () => {
          if (mergedOptions.onHeightChange && mergedOptions.autoHeight)
            mergedOptions.onHeightChange();
        },
      },
    };

    if (mergedOptions.onlyMobile || mergedOptions.onlyDesktop) {
      const query = mergedOptions.onlyMobile
        ? `(max-width: ${MOBILE_BREAKPOINT}px)`
        : `(min-width: ${MOBILE_BREAKPOINT + 1}px)`;
      this.mediaQuery = window.matchMedia(query);

      if (this.mediaQuery.matches) {
        this.init();
      }

      this.handleMediaChange = (e) => {
        if (e.matches) {
          this.init();
        } else {
          this.destroySwiper();
        }
      };
      this.mediaQuery.addEventListener("change", this.handleMediaChange);
    } else {
      this.init();
    }

    if (mergedOptions.autoHeight) {
      window.addEventListener(
        "load",
        () => {
          this.swiperInstance?.updateAutoHeight();
        },
        {
          signal: this.abortController.signal,
        }
      );
    }
  }

  private init() {
    if (this.swiperInstance) return;
    const selector = this.options?.containerSelector ?? ".swiper";
    const container = this.element.querySelector<HTMLElement>(selector);
    if (!container) throw new Error("Swiper container not found");
    this.swiperInstance = new Swiper(container, this.swiperOptions);
  }

  private destroySwiper() {
    this.swiperInstance?.destroy(true, true);
    this.swiperInstance = null;
  }

  public destroy(): void {
    this.destroySwiper();
    if (this.mediaQuery && this.handleMediaChange) {
      this.mediaQuery.removeEventListener("change", this.handleMediaChange);
    }
    this.abortController?.abort();
    this.unregister();
  }
}
