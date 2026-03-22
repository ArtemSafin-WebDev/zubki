import Component from "../Component";

type RatingPalette = {
  track: string;
  thumb: string;
};

class EducationRating extends Component {
  private abortController: AbortController;
  private ratingInput: HTMLInputElement | null = null;
  private ratingValue: HTMLOutputElement | null = null;
  private ratingRange: HTMLElement | null = null;

  constructor(element: HTMLElement) {
    super(element);
    this.abortController = new AbortController();
    this.initRating();
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

    const thumbSize = 28;
    const trackWidth = this.ratingInput.clientWidth;
    const thumbCenter =
      ((trackWidth - thumbSize) * percent) / 100 + thumbSize / 2;
    const markerWidth = this.ratingValue.offsetWidth || thumbSize;
    const markerHalo = 2;
    const minCenter = markerWidth / 2 + markerHalo;
    const maxCenter = trackWidth - markerWidth / 2 - markerHalo;
    const markerCenter = Math.min(maxCenter, Math.max(minCenter, thumbCenter));
    const fillPercent =
      trackWidth > 0
        ? Math.min(
            100,
            ((markerCenter + markerWidth / 2 + markerHalo) / trackWidth) * 100
          )
        : percent;

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
      `${fillPercent}%`
    );

    this.ratingValue.style.left = `${markerCenter}px`;
  }

  private getPalette(score: number): RatingPalette {
    if (score <= 2) {
      return {
        track: "#FF383C",
        thumb: "#A30003",
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
        thumb: "#A33600",
      };
    }

    return {
      track: "#36BF5A",
      thumb: "#207336",
    };
  }

  public destroy() {
    this.abortController.abort();
    this.unregister();
  }
}

export default EducationRating;
