import Plyr from "plyr";
import Component from "../Component";

const PLYR_CONTROLS = [
  "play-large",
  "play",
  "progress",
  "current-time",
  "duration",
  "mute",
  "volume",
  "settings",
  "fullscreen",
] as const;

class ArticleVideoPlayer extends Component {
  private readonly abortController = new AbortController();
  private readonly video: HTMLVideoElement | null;
  private readonly player: Plyr | null = null;

  constructor(element: HTMLElement) {
    super(element);

    this.video = element.querySelector<HTMLVideoElement>("video");

    if (!this.video) return;

    this.protectVideo();
    this.player = new Plyr(this.video, {
      controls: [...PLYR_CONTROLS],
      settings: ["speed"],
      speed: {
        selected: 1,
        options: [0.75, 1, 1.25, 1.5],
      },
      fullscreen: {
        enabled: true,
        fallback: true,
        iosNative: true,
      },
      hideControls: false,
      keyboard: {
        focused: true,
        global: false,
      },
      tooltips: {
        controls: true,
        seek: true,
      },
    });

    this.element.addEventListener(
      "contextmenu",
      (event) => {
        event.preventDefault();
      },
      { signal: this.abortController.signal }
    );
  }

  private protectVideo() {
    if (!this.video) return;

    this.video.setAttribute("controlsList", "nodownload");
    this.video.setAttribute("disablepictureinpicture", "");
    this.video.setAttribute("disableremoteplayback", "");
    this.video.addEventListener(
      "contextmenu",
      (event) => {
        event.preventDefault();
      },
      { signal: this.abortController.signal }
    );
  }

  public destroy() {
    this.abortController.abort();
    this.player?.destroy();
    this.unregister();
  }
}

export default ArticleVideoPlayer;
