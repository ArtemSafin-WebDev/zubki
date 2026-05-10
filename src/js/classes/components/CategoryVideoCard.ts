import Component from "../Component";

class CategoryVideoCard extends Component {
  private abortController: AbortController;
  private video: HTMLVideoElement | null = null;
  private readonly shouldReduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  constructor(element: HTMLElement) {
    super(element);
    this.abortController = new AbortController();
    this.initVideo();
  }

  private initVideo() {
    this.video = this.element.querySelector<HTMLVideoElement>(
      ".categories__card-video"
    );

    if (!this.video) return;

    this.video.loop = false;

    const playVideo = () => {
      this.play();
    };
    const pauseVideo = () => {
      this.pause();
    };

    this.element.addEventListener("pointerenter", playVideo, {
      signal: this.abortController.signal,
    });
    this.element.addEventListener("focusin", playVideo, {
      signal: this.abortController.signal,
    });
    this.element.addEventListener("pointerleave", pauseVideo, {
      signal: this.abortController.signal,
    });
    this.element.addEventListener("focusout", pauseVideo, {
      signal: this.abortController.signal,
    });
    this.video.addEventListener(
      "ended",
      () => {
        this.element.classList.remove("is-video-playing");
      },
      { signal: this.abortController.signal }
    );
    document.addEventListener(
      "visibilitychange",
      () => {
        if (document.hidden) {
          this.pause();
        }
      },
      { signal: this.abortController.signal }
    );
  }

  private play() {
    if (!this.video || this.shouldReduceMotion) return;

    this.loadVideo();
    this.rewind();
    this.element.classList.add("is-video-playing");
    void this.video.play().catch(() => {
      this.element.classList.remove("is-video-playing");
    });
  }

  private pause() {
    if (!this.video) return;

    this.video.pause();
    this.element.classList.remove("is-video-playing");
    this.rewind();
  }

  private loadVideo() {
    if (!this.video || this.video.src) return;

    const src = this.video.dataset.src;
    if (!src) return;

    this.video.src = src;
    this.video.load();
  }

  private rewind() {
    if (!this.video || this.video.readyState === 0) return;

    this.video.currentTime = 0;
  }

  public destroy() {
    this.pause();
    this.abortController.abort();
    this.unregister();
  }
}

export default CategoryVideoCard;
