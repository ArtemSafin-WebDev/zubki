import Component from "../Component";
import Swiper from "swiper";
import { Navigation, Pagination } from "swiper/modules";

type RatingPalette = {
  track: string;
  thumb: string;
};

class EducationSection extends Component {
  private swiperInstance: Swiper | null = null;
  private abortController: AbortController;
  private ratingInput: HTMLInputElement | null = null;
  private ratingValue: HTMLOutputElement | null = null;
  private ratingRange: HTMLElement | null = null;

  constructor(element: HTMLElement) {
    super(element);
    this.abortController = new AbortController();

    this.initSlider();
    this.initRating();
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

  private initRating() {
    this.ratingInput = this.element.querySelector<HTMLInputElement>(
      ".js-education-rating-input"
    );
    this.ratingValue = this.element.querySelector<HTMLOutputElement>(
      ".js-education-rating-value"
    );
    this.ratingRange = this.element.querySelector<HTMLElement>(
      ".js-education-rating-range"
    );

    if (!this.ratingInput || !this.ratingValue || !this.ratingRange) {
      return;
    }

    const syncRating = () => {
      this.updateRatingState();
    };

    this.ratingInput.addEventListener("input", syncRating, {
      signal: this.abortController.signal,
    });
    this.ratingInput.addEventListener("change", syncRating, {
      signal: this.abortController.signal,
    });
    window.addEventListener("resize", syncRating, {
      signal: this.abortController.signal,
    });

    syncRating();
  }

  private updateRatingState() {
    if (!this.ratingInput || !this.ratingValue || !this.ratingRange) {
      return;
    }

    const min = Number(this.ratingInput.min) || 0;
    const max = Number(this.ratingInput.max) || 10;
    const rawValue = Number(this.ratingInput.value);
    const safeValue = Number.isFinite(rawValue)
      ? Math.min(max, Math.max(min, rawValue))
      : min;
    const percent = max === min ? 0 : ((safeValue - min) / (max - min)) * 100;
    const palette = this.getPalette(safeValue);

    this.ratingInput.value = String(safeValue);
    this.ratingValue.textContent = String(safeValue);
    this.ratingRange.style.setProperty(
      "--education-rating-color",
      palette.track
    );
    this.ratingRange.style.setProperty(
      "--education-rating-thumb",
      palette.thumb
    );
    this.ratingRange.style.setProperty(
      "--education-rating-percent",
      `${percent}%`
    );

    const thumbSize = 28;
    const trackWidth = this.ratingInput.clientWidth;
    const thumbCenter =
      ((trackWidth - thumbSize) * percent) / 100 + thumbSize / 2;

    this.ratingValue.style.left = `${thumbCenter}px`;
  }

  private getPalette(score: number): RatingPalette {
    if (score <= 2) {
      return {
        track: "#FF383C",
        thumb: "#AF1C1F",
      };
    }

    if (score <= 4) {
      return {
        track: "#FF8D28",
        thumb: "#A33600",
      };
    }

    if (score <= 7) {
      return {
        track: "#FFCC00",
        thumb: "#7A5200",
      };
    }

    return {
      track: "#36BF5A",
      thumb: "#207336",
    };
  }

  public destroy() {
    this.swiperInstance?.destroy(true, true);
    this.swiperInstance = null;
    this.abortController.abort();
    this.unregister();
  }
}

export default EducationSection;
