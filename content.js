const script = document.createElement("script");
script.src = chrome.runtime.getURL("thing.js");
document.body.appendChild(script);

const stylesheet = document.createElement("link");
stylesheet.rel = "stylesheet";
stylesheet.href = chrome.runtime.getURL("style.css");
document.head.appendChild(stylesheet);
