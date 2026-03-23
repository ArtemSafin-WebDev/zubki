import Component from "../Component";
import { gsap } from "gsap";
import { MOBILE_BREAKPOINT } from "../../constants/breakpoints";

const MOBILE_BREAKPOINT_QUERY = `(max-width: ${MOBILE_BREAKPOINT}px)`;
const DRAG_START_THRESHOLD_PX = 6;
const MOBILE_SLIDE_GAP_PX = 20;

export type DashboardOptions = {
  rootSelector?: string;
  trackSelector?: string;
  slideSelector?: string;
  paginationSelector?: string;
  paginationBulletClass?: string;
  paginationBulletActiveClass?: string;
  paginationBulletAriaLabel?: (index: number) => string;
  mobileSlideGapPx?: number;
  nestedSliderSelector?: string;
};

type ResolvedDashboardOptions = {
  rootSelector: string;
  trackSelector: string;
  slideSelector: string;
  paginationSelector: string;
  paginationBulletClass: string;
  paginationBulletActiveClass: string;
  paginationBulletAriaLabel: (index: number) => string;
  mobileSlideGapPx: number;
  nestedSliderSelector: string;
};

const DEFAULT_OPTIONS: ResolvedDashboardOptions = {
  rootSelector: ".dashboard-slider",
  trackSelector: ".dashboard-slider__track",
  slideSelector: ".dashboard-slider__slide",
  paginationSelector: ".dashboard-pagination",
  paginationBulletClass: "dashboard-pagination__bullet",
  paginationBulletActiveClass: "dashboard-pagination__bullet--active",
  paginationBulletAriaLabel: (index) => `Перейти к слайду ${index + 1}`,
  mobileSlideGapPx: MOBILE_SLIDE_GAP_PX,
  nestedSliderSelector: ".swiper",
};

class Dashboard extends Component {
  private options: ResolvedDashboardOptions;
  private sliderRoot: HTMLElement;
  private sliderWrapper: HTMLElement;
  private pagination: HTMLElement | null;
  private slides: HTMLElement[];
  private matchMedia: ReturnType<typeof gsap.matchMedia>;
  private abortController: AbortController | null = null;
  private resizeObserver: ResizeObserver | null = null;

  private currentIndex = 0;
  private slideWidth = 0;
  private slideGap = 0;
  private touchStartX = 0;
  private touchStartY = 0;
  private touchLastX = 0;
  private dragStartTranslate = 0;
  private isDragging = false;
  private isHorizontalGesture: boolean | null = null;
  private shouldHandleTouch = false;
  private paginationBullets: HTMLButtonElement[] = [];

  constructor(element: HTMLElement, options: DashboardOptions = {}) {
    super(element);
    this.options = {
      ...DEFAULT_OPTIONS,
      ...options,
      paginationBulletAriaLabel:
        options.paginationBulletAriaLabel ??
        DEFAULT_OPTIONS.paginationBulletAriaLabel,
    };

    const root = this.element.querySelector<HTMLElement>(
      this.options.rootSelector
    );
    const wrapper = root?.querySelector<HTMLElement>(
      this.options.trackSelector
    );

    if (!root || !wrapper) {
      throw new Error("Dashboard slider elements not found");
    }

    this.sliderRoot = root;
    this.sliderWrapper = wrapper;
    this.pagination = this.element.querySelector<HTMLElement>(
      this.options.paginationSelector
    );
    this.slides = this.collectSlides();

    if (!this.slides.length) {
      throw new Error("Dashboard slider has no slides");
    }

    this.matchMedia = gsap.matchMedia();
    this.matchMedia.add(MOBILE_BREAKPOINT_QUERY, () => {
      this.initMobileSlider();

      return () => {
        this.destroyMobileSlider();
      };
    });
  }

  public destroy() {
    this.matchMedia.kill();
    this.destroyMobileSlider();
    this.unregister();
  }

  private initMobileSlider() {
    this.slides = this.collectSlides();

    if (!this.slides.length) {
      return;
    }

    this.abortController?.abort();
    this.abortController = new AbortController();
    const signal = this.abortController.signal;

    this.sliderRoot.style.overflow = "visible";
    this.sliderRoot.style.touchAction = "pan-y";

    this.sliderWrapper.style.display = "flex";
    this.sliderWrapper.style.gap = `${this.options.mobileSlideGapPx}px`;
    this.sliderWrapper.style.willChange = "transform";

    this.slides.forEach((slide) => {
      slide.style.flex = "0 0 100%";
      slide.style.width = "100%";
      slide.style.minWidth = "0";
      slide.style.marginRight = "0";
    });

    this.updateMetrics();
    this.initPagination(signal);
    this.goToSlide(this.currentIndex, false);

    this.sliderRoot.addEventListener("touchstart", this.handleTouchStart, {
      signal,
      passive: true,
    });
    this.sliderRoot.addEventListener("touchmove", this.handleTouchMove, {
      signal,
      passive: false,
    });
    this.sliderRoot.addEventListener("touchend", this.handleTouchEnd, {
      signal,
      passive: true,
    });
    this.sliderRoot.addEventListener("touchcancel", this.handleTouchEnd, {
      signal,
      passive: true,
    });
    window.addEventListener("resize", this.handleResize, { signal });
    window.addEventListener("orientationchange", this.handleResize, { signal });
    window.visualViewport?.addEventListener("resize", this.handleResize, {
      signal,
    });
    this.initResizeObserver();
  }

  private destroyMobileSlider() {
    this.abortController?.abort();
    this.abortController = null;
    this.resizeObserver?.disconnect();
    this.resizeObserver = null;

    this.isDragging = false;
    this.shouldHandleTouch = false;
    this.isHorizontalGesture = null;
    this.paginationBullets = [];

    if (this.pagination) {
      this.pagination.innerHTML = "";
    }

    this.sliderRoot.style.overflow = "";
    this.sliderRoot.style.touchAction = "";

    this.sliderWrapper.style.display = "";
    this.sliderWrapper.style.gap = "";
    this.sliderWrapper.style.willChange = "";
    this.sliderWrapper.style.transition = "";
    this.sliderWrapper.style.transform = "";

    this.slides.forEach((slide) => {
      slide.style.flex = "";
      slide.style.width = "";
      slide.style.minWidth = "";
      slide.style.marginRight = "";
    });
    this.slides = this.collectSlides();
  }

  private handleTouchStart = (event: TouchEvent) => {
    if (event.touches.length !== 1) return;

    const touch = event.touches[0];
    const target = event.target as Element | null;
    const startedOnPagination = target?.closest(this.options.paginationSelector);

    if (startedOnPagination) {
      this.shouldHandleTouch = false;
      this.isDragging = false;
      return;
    }

    const nestedSwiper = target?.closest(this.options.nestedSliderSelector);

    if (nestedSwiper && nestedSwiper !== this.sliderRoot) {
      this.shouldHandleTouch = false;
      this.isDragging = false;
      return;
    }

    this.shouldHandleTouch = true;
    this.isDragging = true;
    this.isHorizontalGesture = null;
    this.touchStartX = touch.clientX;
    this.touchStartY = touch.clientY;
    this.touchLastX = touch.clientX;
    this.dragStartTranslate = this.getTranslateForIndex(this.currentIndex);
    this.sliderWrapper.style.transition = "none";
  };

  private handleTouchMove = (event: TouchEvent) => {
    if (!this.isDragging || !this.shouldHandleTouch || event.touches.length !== 1)
      return;

    const touch = event.touches[0];
    const deltaX = touch.clientX - this.touchStartX;
    const deltaY = touch.clientY - this.touchStartY;
    this.touchLastX = touch.clientX;

    if (this.isHorizontalGesture === null) {
      if (
        Math.abs(deltaX) < DRAG_START_THRESHOLD_PX &&
        Math.abs(deltaY) < DRAG_START_THRESHOLD_PX
      ) {
        return;
      }

      this.isHorizontalGesture = Math.abs(deltaX) > Math.abs(deltaY);

      if (!this.isHorizontalGesture) {
        this.isDragging = false;
        return;
      }
    }

    event.preventDefault();

    const minTranslate = this.getTranslateForIndex(this.slides.length - 1);
    const rawTranslate = this.dragStartTranslate + deltaX;
    const nextTranslate = this.applyEdgeResistance(rawTranslate, minTranslate);

    this.setWrapperTranslate(nextTranslate, false);
  };

  private handleTouchEnd = () => {
    if (!this.isDragging || !this.shouldHandleTouch) {
      this.isDragging = false;
      return;
    }

    const deltaX = this.touchLastX - this.touchStartX;
    const threshold = Math.max(this.slideWidth * 0.2, 40);

    if (Math.abs(deltaX) > threshold) {
      if (deltaX < 0) {
        this.goToSlide(this.currentIndex + 1, true);
      } else {
        this.goToSlide(this.currentIndex - 1, true);
      }
    } else {
      this.goToSlide(this.currentIndex, true);
    }

    this.isDragging = false;
    this.shouldHandleTouch = false;
    this.isHorizontalGesture = null;
  };

  private handleResize = () => {
    this.updateMetrics();
    this.goToSlide(this.currentIndex, false);
  };

  private updateMetrics() {
    const measuredWidth = this.sliderRoot.getBoundingClientRect().width;
    this.slideWidth = measuredWidth || this.sliderRoot.clientWidth;

    const computedStyles = window.getComputedStyle(this.sliderWrapper);
    const computedGap = Number.parseFloat(
      computedStyles.gap || computedStyles.columnGap
    );
    this.slideGap = Number.isFinite(computedGap)
      ? computedGap
      : this.options.mobileSlideGapPx;
  }

  private initResizeObserver() {
    if (!("ResizeObserver" in window)) return;

    this.resizeObserver?.disconnect();
    this.resizeObserver = new ResizeObserver(() => {
      this.handleResize();
    });
    this.resizeObserver.observe(this.sliderRoot);
  }

  private collectSlides() {
    return Array.from(this.sliderWrapper.children).filter(
      (child): child is HTMLElement =>
        child instanceof HTMLElement &&
        child.matches(this.options.slideSelector)
    );
  }

  private goToSlide(index: number, animate: boolean) {
    const nextIndex = this.clamp(index, 0, this.slides.length - 1);
    this.currentIndex = nextIndex;
    const translate = this.getTranslateForIndex(nextIndex);

    this.setWrapperTranslate(translate, animate);
    this.updatePagination();
  }

  private initPagination(signal: AbortSignal) {
    if (!this.pagination) return;

    this.pagination.innerHTML = "";
    this.paginationBullets = this.slides.map((_, index) => {
      const bullet = document.createElement("button");

      bullet.type = "button";
      bullet.className = this.options.paginationBulletClass;
      bullet.setAttribute(
        "aria-label",
        this.options.paginationBulletAriaLabel(index)
      );
      bullet.addEventListener(
        "click",
        () => {
          this.goToSlide(index, true);
        },
        { signal }
      );

      this.pagination?.append(bullet);
      return bullet;
    });

    this.updatePagination();
  }

  private updatePagination() {
    this.paginationBullets.forEach((bullet, index) => {
      bullet.classList.toggle(
        this.options.paginationBulletActiveClass,
        index === this.currentIndex
      );
    });
  }

  private setWrapperTranslate(translate: number, animate: boolean) {
    this.sliderWrapper.style.transition = animate
      ? "transform 260ms ease"
      : "none";
    this.sliderWrapper.style.transform = `translate3d(${translate}px, 0, 0)`;
  }

  private getTranslateForIndex(index: number) {
    return -index * (this.slideWidth + this.slideGap);
  }

  private applyEdgeResistance(translate: number, minTranslate: number) {
    if (translate > 0) {
      return translate * 0.35;
    }
    if (translate < minTranslate) {
      return minTranslate + (translate - minTranslate) * 0.35;
    }
    return translate;
  }

  private clamp(value: number, min: number, max: number) {
    if (value < min) return min;
    if (value > max) return max;
    return value;
  }
}

export default Dashboard;
