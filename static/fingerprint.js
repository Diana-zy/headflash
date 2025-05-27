const script = document.createElement("script");
script.type = "text/javascript";
script.src = "https://wc.bunchthings.com/youknowwho.js";
document.head.appendChild(script);

const script1 = document.createElement("script");
script1.type = "text/javascript";
script1.src = "https://cdn.jsdelivr.net/npm/@fingerprintjs/fingerprintjs@3.3.2/dist/fp.min.js";
document.head.appendChild(script1);

window.addEventListener("load", function () {
  (async function () {
    const result = await window.FingerprintJS.load();
    const visitorId = await result.get();
    window.hi_Info = {
      hi_fingerprint: visitorId.visitorId || "unknown",
      hi_ip: window.youknowwho_ip || "unknown"
    };
  })();
});

