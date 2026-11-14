// Visit statistics for PostHog Web Analytics, without cookies or storage.
// Events go to /ingest on this origin (next.config.ts forwards them to PostHog),
// in PostHog's cookieless mode: its server derives a daily-rotating visitor hash,
// so nothing identifying is kept in the browser.
(function () {
  var script = document.currentScript;
  var key = script && script.getAttribute("data-key");
  if (!key) return;
  var ua = navigator.userAgent;
  if (navigator.webdriver || /bot|crawl|spider|slurp|lighthouse|headless/i.test(ua)) return;

  var endpoint = "/ingest/i/v0/e";
  var start = Date.now();
  var pageviewId = Date.now().toString(36) + Math.random().toString(36).slice(2);
  var maxScroll = 0;

  function referringDomain() {
    if (!document.referrer) return "$direct";
    try {
      return new URL(document.referrer).host;
    } catch {
      return "$direct";
    }
  }

  function browser() {
    if (/Edg\//.test(ua)) return "Microsoft Edge";
    if (/OPR\/|Opera/.test(ua)) return "Opera";
    if (/SamsungBrowser/.test(ua)) return "Samsung Internet";
    if (/Firefox|FxiOS/.test(ua)) return "Firefox";
    if (/Chrome|CriOS/.test(ua)) return "Chrome";
    if (/Safari/.test(ua)) return "Safari";
    return "Other";
  }

  function os() {
    if (/Windows/.test(ua)) return "Windows";
    if (/Android/.test(ua)) return "Android";
    if (/iPhone|iPad|iPod/.test(ua)) return "iOS";
    if (/Mac OS X/.test(ua)) return "Mac OS X";
    if (/Linux/.test(ua)) return "Linux";
    return "Other";
  }

  function deviceType() {
    if (/iPad|Tablet/.test(ua) || (/Android/.test(ua) && !/Mobile/.test(ua))) return "Tablet";
    if (/Mobi|iPhone|Android/.test(ua)) return "Mobile";
    return "Desktop";
  }

  function properties(extra) {
    var props = {
      token: key,
      distinct_id: "$posthog_cookieless",
      $cookieless_mode: true,
      $process_person_profile: false,
      $current_url: location.href,
      $host: location.host,
      $pathname: location.pathname,
      $referrer: document.referrer || "$direct",
      $referring_domain: referringDomain(),
      $raw_user_agent: ua,
      $browser: browser(),
      $os: os(),
      $device_type: deviceType(),
      $screen_width: screen.width,
      $screen_height: screen.height,
      $viewport_width: innerWidth,
      $viewport_height: innerHeight,
      $lib: "web",
      $pageview_id: pageviewId,
      locale: document.documentElement.lang,
    };
    try {
      props.$timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    } catch {}
    for (var name in extra) props[name] = extra[name];
    return props;
  }

  function send(event, extra, leaving) {
    var body = JSON.stringify({
      event: event,
      properties: properties(extra || {}),
      timestamp: new Date().toISOString(),
    });
    // sendBeacon survives the page closing or navigating to WhatsApp, tel: or mailto:.
    if (leaving && navigator.sendBeacon) {
      navigator.sendBeacon(endpoint, new Blob([body], { type: "application/json" }));
      return;
    }
    fetch(endpoint, {
      method: "POST",
      body: body,
      headers: { "Content-Type": "application/json" },
      keepalive: true,
    }).catch(function () {});
  }

  addEventListener(
    "scroll",
    function () {
      var height = document.documentElement.scrollHeight - innerHeight;
      if (height > 0) maxScroll = Math.max(maxScroll, Math.min(1, scrollY / height));
    },
    { passive: true },
  );

  var left = false;
  function leave() {
    if (left) return;
    left = true;
    send(
      "$pageleave",
      {
        $prev_pageview_id: pageviewId,
        $prev_pageview_pathname: location.pathname,
        $prev_pageview_duration: (Date.now() - start) / 1000,
        $prev_pageview_max_scroll_percentage: maxScroll,
      },
      true,
    );
  }
  document.addEventListener("visibilitychange", function () {
    if (document.visibilityState === "hidden") leave();
  });
  addEventListener("pagehide", leave);

  document.addEventListener("click", function (event) {
    var target = event.target;
    var link = target && target.closest ? target.closest("a[href]") : null;
    if (!link) return;
    var href = link.getAttribute("href") || "";
    var section = link.closest("section[id], header, footer, dialog");
    var where = section ? section.id || section.tagName.toLowerCase() : "";
    var channel = /^https:\/\/wa\.me\//.test(href)
      ? "whatsapp"
      : href.indexOf("tel:") === 0
        ? "phone"
        : href.indexOf("mailto:") === 0
          ? "email"
          : null;
    if (channel) {
      send("contact_click", { channel: channel, section: where }, true);
    } else if (link.hasAttribute("data-keep-hash")) {
      send("language_switch", { to: link.getAttribute("hreflang") || "" }, true);
    }
  });

  send("$pageview");
})();
