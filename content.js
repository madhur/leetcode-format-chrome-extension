

let s = document.createElement("script");

// Install beautify
s.type = "module";
s.src = chrome.runtime.getURL("beautify.js");
(document.head || document.documentElement).appendChild(s);

// install script.js
s = document.createElement("script");
s.type = "module";
s.src = chrome.runtime.getURL("script.js");
(document.head || document.documentElement).appendChild(s);

s = document.createElement("script");
s.src = chrome.runtime.getURL("standalone.js");
(document.head || document.documentElement).appendChild(s);

s = document.createElement("script");
s.src = chrome.runtime.getURL("parser-babel.mjs");
s.type = "module";
(document.head || document.documentElement).appendChild(s);

s = document.createElement("script");
s.src = chrome.runtime.getURL("parser-typescript.mjs");
s.type = "module";
(document.head || document.documentElement).appendChild(s);

s = document.createElement("script");
s.src = chrome.runtime.getURL("parser-java.js");
s.type = "module";
(document.head || document.documentElement).appendChild(s);
