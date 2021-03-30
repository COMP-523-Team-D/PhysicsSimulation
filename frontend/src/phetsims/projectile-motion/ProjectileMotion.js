const ProjectileMotion = (props) => {
  function loader() {
    // Identify the brand (assume generated brand if not provided with query parameters)
    var brandMatch;
    var brand = brandMatch
      ? decodeURIComponent(brandMatch[1])
      : "adapted-from-phet";

    // Preloads, with more included for phet-io brand
    var preloads = [
      "../joist/js/splash.js",
      "../sherpa/lib/jquery-2.1.0.js",
      "../sherpa/lib/lodash-4.17.4.js",
      "../sherpa/lib/FileSaver-b8054a2.js",
      "../sherpa/lib/himalaya-0.2.7.js",
      "../assert/js/assert.js",
      "../query-string-machine/js/QueryStringMachine.js",
      "../chipper/js/initialize-globals.js",
      "../chipper/js/getVersionForBrand.js",
      "../sherpa/lib/seedrandom-2.4.2.js",
      "../sherpa/lib/game-up-camera-1.0.0.js",
      "../sherpa/lib/base64-js-1.2.0.js",
      "../sherpa/lib/TextEncoderLite-3c9f6f0.js",
      "../sherpa/lib/Tween-r12.js",
    ];

    if (brand === "phet-io") {
      preloads = preloads.concat([
        "../sherpa/lib/jsondiffpatch-0.1.31.js",
        "../phet-io/js/phet-io-query-parameters.js",
      ]);
    }

    // Loads a synchronously-executed asynchronously-downloaded script tag, with optional data-main parameter.
    // See http://www.html5rocks.com/en/tutorials/speed/script-loading/ for more about script loading. It helps to
    // load all of the scripts with this method, so they are treated the same (and placed in the correct execution
    // order).
    function loadURL(preloadURL, main) {
      var script = document.createElement("script");
      if (typeof main === "string") {
        script.setAttribute("data-main", main);
      }
      script.type = "text/javascript";
      script.src = preloadURL;
      script.async = false;
      document.head.appendChild(script);
    }

    // Queue all of the preloads to be loaded.
    preloads.forEach(loadURL);

    loadURL(
      "../sherpa/lib/require-2.1.11.js",
      "js/projectile-motion-config.js"
    );
  }

  return <div>{loader()}</div>;
};

export default ProjectileMotion;
