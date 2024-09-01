[
    { src: "beautify.js", type: "module" },
    { src: "script.js", type: "module" },
    { src: "standalone.js", type: "text/javascript" },
    { src: "parser-babel.mjs", type: "module" },
    { src: "parser-typescript.mjs", type: "module" },
    { src: "parser-java.js", type: "module" }
].forEach(({ src, type }) => {
    const scriptElement = document.createElement("script");
    scriptElement.src = chrome.runtime.getURL(src);
    scriptElement.type = type;
    document.head.append(scriptElement);
});
