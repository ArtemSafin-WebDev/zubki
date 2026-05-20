const VIDEO_SELECTOR = "video";

function protectVideo(video: HTMLVideoElement) {
  video.setAttribute("controlsList", "nodownload");
  video.setAttribute("disablepictureinpicture", "");
  video.setAttribute("disableremoteplayback", "");
}

export function protectVideos(root: ParentNode | null = document) {
  root?.querySelectorAll<HTMLVideoElement>(VIDEO_SELECTOR).forEach(protectVideo);
}

export default function protectedVideos() {
  protectVideos();

  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (!(node instanceof Element)) return;

        if (node instanceof HTMLVideoElement) {
          protectVideo(node);
        }

        protectVideos(node);
      });
    });
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
  });

  document.addEventListener("contextmenu", (event) => {
    const target = event.target;

    if (!(target instanceof Element) || !target.closest(VIDEO_SELECTOR)) return;

    event.preventDefault();
  });
}
