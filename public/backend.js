var TOOTHGUY_VIDEO_SELECTOR = ".js-toothguy-video";
var DEFAULT_PLAY_DELAY = 3000;
var scheduledVideos = new WeakSet();

function getPlayDelay(video) {
  var delay = Number(video.dataset.toothguyVideoDelay);

  return Number.isFinite(delay) && delay >= 0 ? delay : DEFAULT_PLAY_DELAY;
}

function playVideo(video) {
  video.currentTime = 0;
  video.play().catch(function () {});
}

function initToothguyVideos(root) {
  (root || document).querySelectorAll(TOOTHGUY_VIDEO_SELECTOR).forEach(function (video) {
    if (scheduledVideos.has(video)) return;

    scheduledVideos.add(video);

    window.setTimeout(function () {
      if (!video.isConnected) return;

      playVideo(video);
    }, getPlayDelay(video));
  });
}

document.addEventListener("DOMContentLoaded", function () {
  initToothguyVideos(document);
});
