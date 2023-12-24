

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

function checkUpdate() {
    // Send message to Chrome extension
    chrome.runtime.sendMessage({ message: 'checkUpdate' }, function (response) {
        // Handle response from Chrome extension
        console.debug("Response from checkUpdate: ", response);
    });
}

function loadDOMStorage() {
    chrome.runtime.sendMessage({ message: 'loadDOMStorage' }, function (response) {
        // Handle response from Chrome extension
        console.debug("Response from loadDOMStorage: ", response);
        if (response && response.v1_button && response.v2_button) {
            refreshPageDomVariables(response)
            console.debug('Updated data:', response);
        }
    });
}

function refreshPageDomVariables(response) {
    var event = new CustomEvent("refreshPageDomVariables", {detail: response});
    window.dispatchEvent(event);
    console.debug("dispatched event", event);

}

window.addEventListener ("load", checkUpdate, false);
window.addEventListener ("load", loadDOMStorage, false);