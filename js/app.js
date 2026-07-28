(function () {
  "use strict";

  var SITE_ORIGIN = "https://higoon.art";
  var FB_PIXEL_ID = "1305891871690133";
  var FBC_COOKIE = "_fbc";
  var FBP_COOKIE = "_fbp";
  var CRAWLER_UA =
    /facebookexternalhit|Facebot|facebookcatalog|meta-externalagent|Twitterbot|LinkedInBot|Slackbot|WhatsApp|TelegramBot/i;

  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  function withOrigin(path) {
    return SITE_ORIGIN.replace(/\/+$/, "") + path;
  }

  ["terms-link", "footer-terms"].forEach(function (id) {
    var el = document.getElementById(id);
    if (el) el.href = withOrigin("/terms-of-service");
  });
  ["privacy-link", "footer-privacy"].forEach(function (id) {
    var el = document.getElementById(id);
    if (el) el.href = withOrigin("/privacy-policy");
  });
  var shellCta = document.getElementById("shell-cta");
  if (shellCta) shellCta.href = withOrigin("/create");

  function getCookie(name) {
    var match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
    return match ? decodeURIComponent(match[2]) : null;
  }

  function getBaseDomain() {
    var parts = window.location.hostname.split(".");
    return parts.length >= 2 ? "." + parts.slice(-2).join(".") : window.location.hostname;
  }

  function setFbcFromUrlIfNeeded() {
    var params = new URLSearchParams(window.location.search);
    var fbclid = params.get("fbclid");
    if (!fbclid || getCookie(FBC_COOKIE)) return;
    var fbc = "fb.1." + Date.now() + "." + fbclid;
    document.cookie =
      FBC_COOKIE +
      "=" +
      fbc +
      "; path=/; domain=" +
      getBaseDomain() +
      "; max-age=7776000; samesite=Lax";
  }

  function ensureFbp() {
    if (getCookie(FBP_COOKIE)) return;
    var fbp = "fb.1." + Date.now() + "." + Math.floor(Math.random() * 1e10);
    document.cookie =
      FBP_COOKIE +
      "=" +
      fbp +
      "; path=/; domain=" +
      getBaseDomain() +
      "; max-age=7776000; samesite=Lax";
  }

  function injectPixel() {
    if (!FB_PIXEL_ID) return;
    !(function (f, b, e, v, n, t, s) {
      if (f.fbq) return;
      n = f.fbq = function () {
        n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
      };
      if (!f._fbq) f._fbq = n;
      n.push = n;
      n.loaded = !0;
      n.version = "2.0";
      n.queue = [];
      t = b.createElement(e);
      t.async = !0;
      t.src = v;
      s = b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t, s);
    })(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");
    window.fbq("init", FB_PIXEL_ID);
    window.fbq("track", "PageView");
  }

  function buildTargetUrl() {
    var currentUrl = window.location.href;
    var currentSearch = window.location.search;
    var searchParams = new URLSearchParams(currentSearch);
    var hasPlaylistId = searchParams.has("playlistId");
    var baseUrl = hasPlaylistId
      ? withOrigin("/template-create")
      : withOrigin("/create");
    var targetUrl = new URL(baseUrl);
    if (currentSearch) targetUrl.search = searchParams.toString();
    targetUrl.searchParams.set("source", currentUrl);
    return { targetUrl: targetUrl, currentUrl: currentUrl };
  }

  function goToApp(trigger) {
    var built = buildTargetUrl();
    if (window.fbq) {
      window.fbq("trackCustom", "AgeGateEnter", {
        source: built.currentUrl,
        trigger: trigger,
      });
    }
    window.location.href = built.targetUrl.toString();
  }

  function revealShell() {
    var gate = document.getElementById("gate");
    var shell = document.getElementById("shell");
    if (gate) gate.classList.add("is-gone");
    if (shell) shell.classList.remove("is-blurred");
  }

  setFbcFromUrlIfNeeded();
  ensureFbp();
  injectPixel();

  var enterBtn = document.getElementById("enter-btn");
  if (enterBtn) {
    enterBtn.addEventListener("click", function () {
      goToApp("click");
    });
  }

  if (!CRAWLER_UA.test(navigator.userAgent || "")) {
    window.setTimeout(function () {
      goToApp("auto");
    }, 1500);
  } else {
    // Keep stable HTML for social crawlers; no redirect.
    revealShell();
  }
})();
