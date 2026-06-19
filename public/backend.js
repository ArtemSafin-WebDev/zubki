var TOOTHGUY_VIDEO_SELECTOR = ".js-toothguy-video";
var TOOTHGUY_BUBBLE_SELECTOR = ".js-toothguy-bubble";
var TOOTHGUY_TEXT_SELECTOR = ".toothguy__text";
var DEFAULT_PLAY_DELAY = 3000;
var DEFAULT_TEXT_ROTATE_INTERVAL = 3000;
var DEFAULT_ANIMATION_FALLBACK_DELAY = 1200;
var BUBBLE_TRANSITION_MS = 400;
var scheduledVideos = new WeakSet();
var toothguyTimers = new WeakMap();
var toothguyCycleTokens = new WeakMap();

function isSafari() {
  var userAgent = navigator.userAgent;

  return /safari/i.test(userAgent) && !/chrome|chromium|crios|fxios|edgios|android/i.test(userAgent);
}

function getPlayDelay(video) {
  var delay = Number(video.dataset.toothguyVideoDelay);

  return Number.isFinite(delay) && delay >= 0 ? delay : DEFAULT_PLAY_DELAY;
}

function getTextRotateInterval(bubble) {
  var interval = Number(bubble.dataset.toothguyTextInterval);

  return Number.isFinite(interval) && interval >= 0 ? interval : DEFAULT_TEXT_ROTATE_INTERVAL;
}

function getAnimationFallbackDelay(video) {
  var delay = Number(video.dataset.toothguyAnimationDelay);

  if (Number.isFinite(delay) && delay >= 0) {
    return delay;
  }

  return Number.isFinite(video.duration) && video.duration > 0
      ? video.duration * 1000 + 100
      : DEFAULT_ANIMATION_FALLBACK_DELAY;
}

function parseToothguyTexts(bubble, textEl) {
  var raw = bubble.dataset.text;

  if (!raw) return [textEl.innerHTML];

  try {
    var texts = JSON.parse(raw);

    return Array.isArray(texts) && texts.length > 0 ? texts : [textEl.innerHTML];
  } catch (error) {
    return [textEl.innerHTML];
  }
}

function scheduleToothguyTimer(toothguy, callback, delay) {
  var timerId = window.setTimeout(function () {
    var timers = toothguyTimers.get(toothguy);

    if (timers) {
      timers.delete(timerId);
    }

    callback();
  }, delay);

  var timers = toothguyTimers.get(toothguy);

  if (!timers) {
    timers = new Set();
    toothguyTimers.set(toothguy, timers);
  }

  timers.add(timerId);

  return timerId;
}

function stopToothguyCycle(toothguy) {
  var timers = toothguyTimers.get(toothguy);

  toothguyCycleTokens.delete(toothguy);

  if (!timers) return;

  timers.forEach(function (timerId) {
    window.clearTimeout(timerId);
  });
  toothguyTimers.delete(toothguy);
}

function isToothguyConnected(toothguy, video, bubble, textEl) {
  return toothguy.isConnected && video.isConnected && bubble.isConnected && textEl.isConnected;
}

function createToothguyCycleToken(toothguy) {
  var token = {};

  toothguyCycleTokens.set(toothguy, token);

  return token;
}

function isCurrentToothguyCycle(toothguy, token) {
  return toothguyCycleTokens.get(toothguy) === token;
}

function showToothguyBubble(toothguy, video, bubble, textEl, texts, index, token) {
  if (!isCurrentToothguyCycle(toothguy, token)) return;

  if (!isToothguyConnected(toothguy, video, bubble, textEl)) {
    stopToothguyCycle(toothguy);
    return;
  }

  textEl.innerHTML = texts[index];
  bubble.classList.add("is-visible");

  scheduleToothguyTimer(toothguy, function () {
    if (!isCurrentToothguyCycle(toothguy, token)) return;

    if (!isToothguyConnected(toothguy, video, bubble, textEl)) {
      stopToothguyCycle(toothguy);
      return;
    }

    bubble.classList.remove("is-visible");
    scheduleNextToothguyStep(toothguy, video, bubble, textEl, texts, index, token);
  }, getTextRotateInterval(bubble));
}

function scheduleNextToothguyStep(toothguy, video, bubble, textEl, texts, index, token) {
  scheduleToothguyTimer(toothguy, function () {
    if (!isCurrentToothguyCycle(toothguy, token)) return;

    var nextIndex = texts.length > 1 ? (index + 1) % texts.length : index;

    playToothguyStep(toothguy, video, bubble, textEl, texts, nextIndex, token);
  }, BUBBLE_TRANSITION_MS);
}

function playToothguyStep(toothguy, video, bubble, textEl, texts, index, token) {
  if (!isCurrentToothguyCycle(toothguy, token)) return;

  if (!isToothguyConnected(toothguy, video, bubble, textEl)) {
    stopToothguyCycle(toothguy);
    return;
  }

  var isFinished = false;
  var fallbackTimerId = null;

  function finishAnimation() {
    if (isFinished) return;

    isFinished = true;
    if (fallbackTimerId !== null) {
      window.clearTimeout(fallbackTimerId);
    }
    video.removeEventListener("ended", finishAnimation);
    video.removeEventListener("error", finishAnimation);
    showToothguyBubble(toothguy, video, bubble, textEl, texts, index, token);
  }

  bubble.classList.remove("is-visible");
  video.pause();
  video.addEventListener("ended", finishAnimation);
  video.addEventListener("error", finishAnimation);

  try {
    video.currentTime = 0;
  } catch (error) {}

  fallbackTimerId = scheduleToothguyTimer(toothguy, finishAnimation, getAnimationFallbackDelay(video));

  window.requestAnimationFrame(function () {
    if (!isCurrentToothguyCycle(toothguy, token) || isFinished) return;

    var playPromise;

    try {
      playPromise = video.play();
    } catch (error) {
      if (video.readyState === 0) {
        video.load();
      }
      return;
    }

    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch(function () {
        if (video.readyState === 0) {
          video.load();
        }
      });
    }
  });
}

function startToothguyCycle(toothguy, video) {
  var bubble = toothguy.querySelector(TOOTHGUY_BUBBLE_SELECTOR);

  if (!bubble) {
    playVideo(video);
    return;
  }

  var textEl = bubble.querySelector(TOOTHGUY_TEXT_SELECTOR);

  if (!textEl) {
    playVideo(video);
    return;
  }

  var texts = parseToothguyTexts(bubble, textEl);

  stopToothguyCycle(toothguy);
  var token = createToothguyCycleToken(toothguy);
  bubble.classList.remove("is-visible");
  playToothguyStep(toothguy, video, bubble, textEl, texts, 0, token);
}

function playVideo(video) {
  video.currentTime = 0;
  video.play().catch(function () {});
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

      var toothguy = video.closest(".toothguy");

      if (!toothguy) {
        playVideo(video);
        return;
      }

      startToothguyCycle(toothguy, video);
    }, getPlayDelay(video));
  });
}

document.addEventListener("DOMContentLoaded", function () {
  initToothguyVideos(document);
});
