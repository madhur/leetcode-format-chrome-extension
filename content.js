let s = document.createElement("script");

s.src = chrome.runtime.getURL("script.js");
(document.head || document.documentElement).appendChild(s);

s = document.createElement("script");

s.src = chrome.runtime.getURL("standalone.js");
(document.head || document.documentElement).appendChild(s);

s = document.createElement("script");

s.src = chrome.runtime.getURL("parser-babel.js");
(document.head || document.documentElement).appendChild(s);

s.src = chrome.runtime.getURL("parser-typescript.js");
(document.head || document.documentElement).appendChild(s);
