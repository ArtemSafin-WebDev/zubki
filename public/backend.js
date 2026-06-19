var TOOTHGUY_VIDEO_SELECTOR = ".js-toothguy-video";
var TOOTHGUY_BUBBLE_SELECTOR = ".js-toothguy-bubble";
var DEFAULT_PLAY_DELAY = 3000;
var DEFAULT_BUBBLE_DELAY = 1200;
var scheduledVideos = new WeakSet();

function isSafari() {
  var userAgent = navigator.userAgent;

  return /safari/i.test(userAgent) && !/chrome|chromium|crios|fxios|edgios|android/i.test(userAgent);
}

function getPlayDelay(video) {
  var delay = Number(video.dataset.toothguyVideoDelay);

  return Number.isFinite(delay) && delay >= 0 ? delay : DEFAULT_PLAY_DELAY;
}

function getBubbleDelay(bubble) {
  var delay = Number(bubble.dataset.toothguyBubbleDelay);

  return Number.isFinite(delay) && delay >= 0 ? delay : DEFAULT_BUBBLE_DELAY;
}

function showToothguyBubble(toothguy) {
  if (!toothguy) return;

  var bubble = toothguy.querySelector(TOOTHGUY_BUBBLE_SELECTOR);

  if (!bubble) return;

  window.setTimeout(function () {
    if (!bubble.isConnected) return;

    bubble.classList.add("is-visible");
  }, getBubbleDelay(bubble));
}

function playVideo(video) {
  video.currentTime = 0;
  video.play().then(function () {
    showToothguyBubble(video.closest(".toothguy"));
  }).catch(function () {});
}

function initSafariAnimation(video) {
  var src = video.dataset.toothguySafariSrc;

  if (!src) {
    window.setTimeout(function () {
      if (!video.isConnected) return;

      playVideo(video);
    }, getPlayDelay(video));

    return;
  }

  var toothguy = video.closest(".toothguy");
  var image = document.createElement("img");

  image.className = video.className.replace(/\bjs-toothguy-video\b/g, "").trim();
  image.alt = "";
  image.width = video.width;
  image.height = video.height;
  image.loading = "eager";
  image.decoding = "async";
  image.src = video.poster;

  video.replaceWith(image);

  window.setTimeout(function () {
    if (!image.isConnected) return;

    image.addEventListener(
      "load",
      function () {
        showToothguyBubble(toothguy);
      },
      { once: true }
    );
    image.addEventListener(
      "error",
      function () {
        showToothguyBubble(toothguy);
      },
      { once: true }
    );
    image.src = src;
  }, getPlayDelay(video));
}

function initToothguyVideos(root) {
  (root || document).querySelectorAll(TOOTHGUY_VIDEO_SELECTOR).forEach(function (video) {
    if (scheduledVideos.has(video)) return;

    scheduledVideos.add(video);

    if (isSafari()) {
      initSafariAnimation(video);

      return;
    }

    window.setTimeout(function () {
      if (!video.isConnected) return;

      playVideo(video);
    }, getPlayDelay(video));
  });
}

document.addEventListener("DOMContentLoaded", function () {
  initToothguyVideos(document);
});
