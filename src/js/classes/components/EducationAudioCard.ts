import Component from "../Component";

const ACTIVE_CLASS = "is-playing";
const START_LABEL = "Слушать";

class EducationAudioCard extends Component {
  private readonly abortController = new AbortController();
  private readonly audio: HTMLAudioElement | null;
  private readonly label: HTMLElement | null;
  private readonly fallbackDuration: number | null;
  private hasStarted = false;

  constructor(element: HTMLElement) {
    super(element);

    this.audio = element.querySelector<HTMLAudioElement>("audio");
    this.label = element.querySelector<HTMLElement>(
      ".js-education-audio-card-label"
    );
    this.fallbackDuration = this.parseDuration(element.dataset.audioDuration);

    if (!this.audio) return;

    this.bindEvents();
    this.updateLabel();
  }

  private bindEvents() {
    this.element.addEventListener("click", this.handleClick, {
      signal: this.abortController.signal,
    });
    this.audio?.addEventListener("play", this.handlePlay, {
      signal: this.abortController.signal,
    });
    this.audio?.addEventListener("pause", this.handlePause, {
      signal: this.abortController.signal,
    });
    this.audio?.addEventListener("ended", this.handleEnded, {
      signal: this.abortController.signal,
    });
    this.audio?.addEventListener("timeupdate", this.updateLabel, {
      signal: this.abortController.signal,
    });
    this.audio?.addEventListener("loadedmetadata", this.updateLabel, {
      signal: this.abortController.signal,
    });
    this.audio?.addEventListener("error", this.handleError, {
      signal: this.abortController.signal,
    });
    document.addEventListener("visibilitychange", this.handleVisibilityChange, {
      signal: this.abortController.signal,
    });
  }

  private handleClick = () => {
    if (!this.audio) return;

    if (this.audio.paused) {
      this.play();
      return;
    }

    this.pause();
  };

  private play() {
    if (!this.audio) return;

    this.pauseOtherCards();
    void this.audio.play().catch(() => {
      this.hasStarted = false;
      this.handlePause();
    });
  }

  private pause() {
    this.audio?.pause();
  }

  private pauseOtherCards() {
    const cards = document.querySelectorAll<HTMLElement>(
      ".js-education-audio-card"
    );

    cards.forEach((card) => {
      if (card === this.element) return;

      EducationAudioCard.getInstanceFor(card)?.pause();
    });
  }

  private handlePlay = () => {
    this.hasStarted = true;
    this.element.classList.add(ACTIVE_CLASS);
    this.element.setAttribute("aria-pressed", "true");
    this.updateAriaLabel(true);
    this.updateLabel();
  };

  private handlePause = () => {
    this.element.classList.remove(ACTIVE_CLASS);
    this.element.setAttribute("aria-pressed", "false");
    this.updateAriaLabel(false);
    this.updateLabel();
  };

  private handleEnded = () => {
    if (!this.audio) return;

    this.audio.currentTime = 0;
    this.hasStarted = false;
    this.handlePause();
  };

  private handleError = () => {
    this.hasStarted = false;
    this.handlePause();
  };

  private handleVisibilityChange = () => {
    if (document.hidden) {
      this.pause();
    }
  };

  private updateAriaLabel(isPlaying: boolean) {
    const label = isPlaying
      ? this.element.dataset.pauseLabel
      : this.element.dataset.playLabel;

    if (label) {
      this.element.setAttribute("aria-label", label);
    }
  }

  private updateLabel = () => {
    if (!this.label || !this.audio) return;

    if (!this.hasStarted) {
      this.label.textContent = START_LABEL;
      return;
    }

    const currentTime = this.formatTime(this.audio.currentTime);
    const duration = this.formatTime(this.getDuration());
    this.label.textContent = `${currentTime} / ${duration}`;
  };

  private getDuration() {
    if (this.audio && Number.isFinite(this.audio.duration)) {
      return this.audio.duration;
    }

    return this.fallbackDuration ?? 0;
  }

  private formatTime(value: number) {
    const totalSeconds = Math.max(0, Math.floor(value));
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    return `${this.padTime(minutes)}:${this.padTime(seconds)}`;
  }

  private padTime(value: number) {
    return String(value).padStart(2, "0");
  }

  private parseDuration(value: string | undefined) {
    if (!value) return null;

    const parts = value.split(":").map((part) => Number(part));
    if (parts.length === 0 || parts.some((part) => !Number.isFinite(part))) {
      return null;
    }

    return parts.reduce((total, part) => total * 60 + part, 0);
  }

  public destroy() {
    this.pause();
    this.abortController.abort();
    this.unregister();
  }
}

export default EducationAudioCard;
