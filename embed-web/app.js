(function () {
  const config = window.APP_CONFIG || {};
  let cameraStream = null;

  function $(id) {
    return document.getElementById(id);
  }

  function setLog(el, message, isError) {
    el.textContent = message;
    el.classList.toggle("error", Boolean(isError));
  }

  function formatError(err) {
    if (!err) return "Unknown error";
    return [err.name, err.message].filter(Boolean).join(": ");
  }

  function showThumb(img, file) {
    if (!file) {
      img.hidden = true;
      img.removeAttribute("src");
      return;
    }
    const url = URL.createObjectURL(file);
    img.onload = function () {
      URL.revokeObjectURL(url);
    };
    img.src = url;
    img.hidden = false;
  }

  function describeFile(file) {
    if (!file) return "No file (cancelled or blocked).";
    return (
      "Selected: " +
      file.name +
      " (" +
      file.type +
      ", " +
      Math.round(file.size / 1024) +
      " KB)"
    );
  }

  // --- 1. getUserMedia ---
  const cameraLog = $("camera-log");
  const video = $("camera-preview");
  const btnStart = $("btn-camera-start");
  const btnStop = $("btn-camera-stop");

  async function startCamera() {
    setLog(cameraLog, "Requesting getUserMedia…");
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setLog(cameraLog, "getUserMedia is not supported in this WebView.", true);
      return;
    }
    try {
      if (cameraStream) stopCamera();
      cameraStream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: { facingMode: { ideal: "environment" } },
      });
      video.srcObject = cameraStream;
      video.classList.add("is-on");
      await video.play();
      btnStop.disabled = false;
      setLog(
        cameraLog,
        "Camera started. Tracks: " +
          cameraStream
            .getTracks()
            .map(function (t) {
              return t.kind + "/" + t.label + "/" + t.readyState;
            })
            .join(", ")
      );
    } catch (err) {
      setLog(cameraLog, "Failed — " + formatError(err), true);
    }
  }

  function stopCamera() {
    if (cameraStream) {
      cameraStream.getTracks().forEach(function (t) {
        t.stop();
      });
      cameraStream = null;
    }
    video.srcObject = null;
    video.classList.remove("is-on");
    btnStop.disabled = true;
    setLog(cameraLog, "Camera stopped.");
  }

  btnStart.addEventListener("click", startCamera);
  btnStop.addEventListener("click", stopCamera);

  // --- 2. capture=environment ---
  const inputCapture = $("input-capture");
  const captureLog = $("capture-log");
  const capturePreview = $("capture-preview");

  function openFileInput(input, logEl, timeoutMs) {
    return new Promise(function (resolve, reject) {
      var settled = false;
      var timer = setTimeout(function () {
        if (!settled && document.hasFocus() && !(input.files && input.files.length)) {
          settled = true;
          cleanup();
          reject(new Error("FILE_CHOOSER_UNAVAILABLE"));
        }
      }, timeoutMs || 1800);

      function onChange() {
        if (settled) return;
        settled = true;
        cleanup();
        resolve((input.files && input.files[0]) || null);
      }

      function cleanup() {
        clearTimeout(timer);
        input.removeEventListener("change", onChange);
      }

      input.addEventListener("change", onChange, { once: true });
      input.value = "";
      input.click();
    });
  }

  $("btn-capture").addEventListener("click", async function () {
    setLog(captureLog, "Opening capture input…");
    try {
      var file = await openFileInput(inputCapture, captureLog);
      showThumb(capturePreview, file);
      setLog(captureLog, describeFile(file), !file);
    } catch (err) {
      showThumb(capturePreview, null);
      if (err && err.message === "FILE_CHOOSER_UNAVAILABLE") {
        setLog(
          captureLog,
          "Chooser did not open. Host WebView may be missing onShowFileChooser / camera support.",
          true
        );
      } else {
        setLog(captureLog, formatError(err), true);
      }
    }
  });

  // --- 3. gallery / files ---
  const inputGallery = $("input-gallery");
  const galleryLog = $("gallery-log");
  const galleryPreview = $("gallery-preview");

  $("btn-gallery").addEventListener("click", async function () {
    setLog(galleryLog, "Opening gallery / files input…");
    try {
      var file = await openFileInput(inputGallery, galleryLog);
      showThumb(galleryPreview, file);
      setLog(galleryLog, describeFile(file), !file);
    } catch (err) {
      showThumb(galleryPreview, null);
      if (err && err.message === "FILE_CHOOSER_UNAVAILABLE") {
        setLog(
          galleryLog,
          "Chooser did not open. Host WebView may be missing onShowFileChooser.",
          true
        );
      } else {
        setLog(galleryLog, formatError(err), true);
      }
    }
  });

  // --- 4. external links ---
  const linksLog = $("links-log");
  const demoUrl = config.externalDemoUrl || "https://example.com";
  const linkBlank = $("link-blank");
  linkBlank.href = demoUrl;

  $("btn-window-open").addEventListener("click", function () {
    setLog(linksLog, "Calling window.open(" + demoUrl + ")");
    var w = window.open(demoUrl, "_blank");
    if (!w) {
      setLog(
        linksLog,
        "window.open returned null/blocked. Host must handle _blank / external URLs.",
        true
      );
    } else {
      setLog(linksLog, "window.open accepted (may still be in-app depending on host).");
    }
  });

  linkBlank.addEventListener("click", function () {
    setLog(linksLog, "Clicked target=_blank → " + demoUrl);
  });

  $("link-same").addEventListener("click", function () {
    setLog(linksLog, "Same-origin navigation (should stay in WebView).");
  });

  // Env banner
  $("env-info").textContent =
    "UA: " +
    navigator.userAgent +
    " | secureContext=" +
    window.isSecureContext +
    " | basePath=" +
    JSON.stringify(config.basePath || "");
})();
