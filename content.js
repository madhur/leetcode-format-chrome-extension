let s = document.createElement("script");
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

s.src = chrome.runtime.getURL("parser-typescript.mjs");
s.type = "module";
(document.head || document.documentElement).appendChild(s);
