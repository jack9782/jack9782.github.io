$(function () {
  const config = window.APP_CONFIG || {};
  let cameraStream = null;
  let html5QrCode = null;
  let activeUrl = config.externalDemoUrl || "https://example.com";

  function setLog($el, message, isError) {
    $el.text(message).toggleClass("error", Boolean(isError));
  }

  function formatError(err) {
    if (!err) return "Unknown error";
    return [err.name, err.message].filter(Boolean).join(": ");
  }

  function showThumb($img, file) {
    if (!file) {
      $img.prop("hidden", true).removeAttr("src");
      return;
    }
    const url = URL.createObjectURL(file);
    $img
      .one("load", function () {
        URL.revokeObjectURL(url);
      })
      .attr("src", url)
      .prop("hidden", false);
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

  function isAbsoluteUrl(text) {
    try {
      var u = new URL(text);
      return u.protocol === "http:" || u.protocol === "https:";
    } catch (e) {
      return false;
    }
  }

  function setActiveUrl(url) {
    activeUrl = url;
    $("#link-blank").attr("href", url);
    $("#link-same").attr("href", url);
    $("#qr-result-link").attr("href", url).text(url);
    $("#qr-result").prop("hidden", false);
  }

  // --- 1. getUserMedia ---
  const $cameraLog = $("#camera-log");
  const video = $("#camera-preview")[0];
  const $btnStop = $("#btn-camera-stop");

  async function startCamera() {
    setLog($cameraLog, "Requesting getUserMedia…");
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setLog($cameraLog, "getUserMedia is not supported in this WebView.", true);
      return;
    }
    try {
      if (cameraStream) stopCamera();
      cameraStream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: { facingMode: { ideal: "environment" } },
      });
      video.srcObject = cameraStream;
      $(video).addClass("is-on");
      await video.play();
      $btnStop.prop("disabled", false);
      setLog(
        $cameraLog,
        "Camera started. Tracks: " +
          cameraStream
            .getTracks()
            .map(function (t) {
              return t.kind + "/" + t.label + "/" + t.readyState;
            })
            .join(", ")
      );
    } catch (err) {
      setLog($cameraLog, "Failed — " + formatError(err), true);
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
    $(video).removeClass("is-on");
    $btnStop.prop("disabled", true);
    setLog($cameraLog, "Camera stopped.");
  }

  $("#btn-camera-start").on("click", startCamera);
  $btnStop.on("click", stopCamera);

  // --- 2. capture=environment ---
  const inputCapture = $("#input-capture")[0];
  const $captureLog = $("#capture-log");
  const $capturePreview = $("#capture-preview");

  function openFileInput(input, timeoutMs) {
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

  $("#btn-capture").on("click", async function () {
    setLog($captureLog, "Opening capture input…");
    try {
      var file = await openFileInput(inputCapture);
      showThumb($capturePreview, file);
      setLog($captureLog, describeFile(file), !file);
    } catch (err) {
      showThumb($capturePreview, null);
      if (err && err.message === "FILE_CHOOSER_UNAVAILABLE") {
        setLog(
          $captureLog,
          "Chooser did not open. Host WebView may be missing onShowFileChooser / camera support.",
          true
        );
      } else {
        setLog($captureLog, formatError(err), true);
      }
    }
  });

  // --- 3. gallery / files ---
  const inputGallery = $("#input-gallery")[0];
  const $galleryLog = $("#gallery-log");
  const $galleryPreview = $("#gallery-preview");

  $("#btn-gallery").on("click", async function () {
    setLog($galleryLog, "Opening gallery / files input…");
    try {
      var file = await openFileInput(inputGallery);
      showThumb($galleryPreview, file);
      setLog($galleryLog, describeFile(file), !file);
    } catch (err) {
      showThumb($galleryPreview, null);
      if (err && err.message === "FILE_CHOOSER_UNAVAILABLE") {
        setLog(
          $galleryLog,
          "Chooser did not open. Host WebView may be missing onShowFileChooser.",
          true
        );
      } else {
        setLog($galleryLog, formatError(err), true);
      }
    }
  });

  // --- 4. QR scan + external links ---
  const $linksLog = $("#links-log");
  const $qrReader = $("#qr-reader");
  const $btnQrStart = $("#btn-qr-start");
  const $btnQrStop = $("#btn-qr-stop");
  const $linkBlank = $("#link-blank");

  $linkBlank.attr("href", activeUrl);
  $("#link-same").attr("href", activeUrl);

  async function stopQrScan(silent) {
    if (html5QrCode) {
      try {
        var state = html5QrCode.getState && html5QrCode.getState();
        // 2 = SCANNING, 3 = PAUSED (Html5QrcodeScannerState)
        if (state === 2 || state === 3) {
          await html5QrCode.stop();
        }
      } catch (err) {
        // ignore stop errors when already stopped
      }
      try {
        html5QrCode.clear();
      } catch (err) {
        // ignore
      }
      html5QrCode = null;
    }
    $qrReader.prop("hidden", true).removeClass("is-on");
    $btnQrStop.prop("disabled", true);
    $btnQrStart.prop("disabled", false);
    if (!silent) {
      setLog($linksLog, "QR scan stopped.");
    }
  }

  async function startQrScan() {
    if (typeof Html5Qrcode === "undefined") {
      setLog($linksLog, "html5-qrcode library failed to load.", true);
      return;
    }
    setLog($linksLog, "Starting QR scanner…");
    await stopQrScan(true);
    $qrReader.prop("hidden", false).addClass("is-on");
    $btnQrStart.prop("disabled", true);
    $btnQrStop.prop("disabled", false);

    html5QrCode = new Html5Qrcode("qr-reader");
    try {
      await html5QrCode.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 220, height: 220 } },
        async function onScanSuccess(decodedText) {
          var text = (decodedText || "").trim();
          await stopQrScan(true);
          if (!isAbsoluteUrl(text)) {
            setLog(
              $linksLog,
              "QR detected but not an http(s) URL: " + text,
              true
            );
            return;
          }
          setActiveUrl(text);
          setLog($linksLog, "QR URL detected — camera closed. Use open actions below.");
        },
        function onScanFailure() {
          // continuous scan; ignore frame misses
        }
      );
      setLog($linksLog, "Point the camera at a QR code containing a URL.");
    } catch (err) {
      await stopQrScan(true);
      setLog($linksLog, "QR scan failed — " + formatError(err), true);
    }
  }

  $btnQrStart.on("click", startQrScan);
  $btnQrStop.on("click", function () {
    stopQrScan(false);
  });

  $("#btn-window-open").on("click", function () {
    setLog($linksLog, "Calling window.open(" + activeUrl + ")");
    var w = window.open(activeUrl, "_blank");
    if (!w) {
      setLog(
        $linksLog,
        "window.open returned null/blocked. Host must handle _blank / external URLs.",
        true
      );
    } else {
      setLog($linksLog, "window.open accepted (may still be in-app depending on host).");
    }
  });

  $linkBlank.on("click", function () {
    setLog($linksLog, "Clicked target=_blank → " + activeUrl);
  });

  $("#link-same").on("click", function (e) {
    e.preventDefault();
    setLog($linksLog, "Same-page navigation → " + activeUrl);
    window.location.assign(activeUrl);
  });

  $("#qr-result-link").on("click", function () {
    setLog($linksLog, "Clicked scanned result link → " + activeUrl);
  });

  // --- 5. File QR → open links ---
  let fileQrActiveUrl = config.externalDemoUrl || "https://example.com";
  const inputFileQr = $("#input-file-qr")[0];
  const $fileQrLog = $("#file-qr-log");
  const $fileQrPreview = $("#file-qr-preview");
  const $fileLinkBlank = $("#file-link-blank");

  function setFileQrActiveUrl(url) {
    fileQrActiveUrl = url;
    $fileLinkBlank.attr("href", url);
    $("#file-link-same").attr("href", url);
    $("#file-qr-result-link").attr("href", url).text(url);
    $("#file-qr-result").prop("hidden", false);
  }

  $fileLinkBlank.attr("href", fileQrActiveUrl);
  $("#file-link-same").attr("href", fileQrActiveUrl);

  $("#btn-file-qr").on("click", async function () {
    setLog($fileQrLog, "Opening gallery / files for QR image…");
    try {
      var file = await openFileInput(inputFileQr);
      showThumb($fileQrPreview, file);
      if (!file) {
        setLog($fileQrLog, describeFile(file), true);
        return;
      }
      if (typeof Html5Qrcode === "undefined") {
        setLog($fileQrLog, "html5-qrcode library failed to load.", true);
        return;
      }
      setLog($fileQrLog, describeFile(file) + "\nDecoding QR…");
      var scanner = new Html5Qrcode("file-qr-reader");
      try {
        var decodedText = await scanner.scanFile(file, false);
        var text = (decodedText || "").trim();
        if (!isAbsoluteUrl(text)) {
          setLog(
            $fileQrLog,
            "QR detected but not an http(s) URL: " + text,
            true
          );
          return;
        }
        setFileQrActiveUrl(text);
        setLog(
          $fileQrLog,
          "QR URL decoded from file. Use open actions below.\n" + text
        );
      } finally {
        try {
          scanner.clear();
        } catch (clearErr) {
          // ignore
        }
      }
    } catch (err) {
      showThumb($fileQrPreview, null);
      if (err && err.message === "FILE_CHOOSER_UNAVAILABLE") {
        setLog(
          $fileQrLog,
          "Chooser did not open. Host WebView may be missing onShowFileChooser.",
          true
        );
      } else {
        setLog(
          $fileQrLog,
          "QR decode failed — " + (typeof err === "string" ? err : formatError(err)),
          true
        );
      }
    }
  });

  $("#btn-file-window-open").on("click", function () {
    setLog($fileQrLog, "Calling window.open(" + fileQrActiveUrl + ")");
    var w = window.open(fileQrActiveUrl, "_blank");
    if (!w) {
      setLog(
        $fileQrLog,
        "window.open returned null/blocked. Host must handle _blank / external URLs.",
        true
      );
    } else {
      setLog(
        $fileQrLog,
        "window.open accepted (may still be in-app depending on host)."
      );
    }
  });

  $fileLinkBlank.on("click", function () {
    setLog($fileQrLog, "Clicked target=_blank → " + fileQrActiveUrl);
  });

  $("#file-link-same").on("click", function (e) {
    e.preventDefault();
    setLog($fileQrLog, "Same-page navigation → " + fileQrActiveUrl);
    window.location.assign(fileQrActiveUrl);
  });

  $("#file-qr-result-link").on("click", function () {
    setLog($fileQrLog, "Clicked decoded result link → " + fileQrActiveUrl);
  });

  // Env banner
  $("#env-info").text(
    "UA: " +
      navigator.userAgent +
      " | secureContext=" +
      window.isSecureContext +
      " | basePath=" +
      JSON.stringify(config.basePath || "")
  );
});
