/**
 * VOLUME
 */
let slider = document.getElementById("volumeSlider");
let output = document.getElementById("volumeOutput");

// Should load 0-1
// We clamp at various lines to assurance. There was a bug where it would be >1 and it was saved into local storage.
load("volume", function (value) {
  if (value == null) {
    value = 0.5;
    save("volume", value);
  } else if (value > 1) {
    value = clamp(value / 100, 0, 1);
  }

  output.innerHTML = `Volume: ${value * 100}`;
  slider.value = value * 100;

  sendMessage(["updateVolume", Number(value)]);
});

slider.oninput = function () {
  output.innerHTML = `Volume: ${this.value}`;

  sendMessage(["updateVolume", Number(this.value / 100)]);
};

slider.addEventListener("mouseup", function () {
  save("volume", this.value / 100);
});

/**
 * MAIN TOGGLER
 */
let toggleButton = document.getElementById("toggle");
let enabled = true;
load("enabled", function (value) {
  if (value == null) {
    value = true;
  }

  // sendMessage(["print", value]);

  enabled = value;

  updateToggle();
});

toggleButton.addEventListener("click", () => {
  enabled = !enabled;
  save("enabled", enabled);

  updateToggle();
});

/**
 * OTHER SETTINGS
 */

const contentDiv = document.querySelectorAll("#content");
const assignmentSlider = document.getElementById("assignments");
const quizzesSlider = document.getElementById("quizzes");
const discussionsSlider = document.getElementById("discussions");
const otherSlider = document.getElementById("other");
const fullScreenSlider = document.getElementById("fullScreen");
const classroomSlider = document.getElementById("classroom");
const gradescopeSlider = document.getElementById("gradescope");
const themedSlider = document.getElementById("themedAnims");

const sliderSaveKeys = {
  [assignmentSlider]: "assignments",
  [quizzesSlider]: "quizzes",
  [discussionsSlider]: "discussions",
  [otherSlider]: "other",
  [fullScreenSlider]: "fullScreen",
  [classroomSlider]: "classroom",
  [gradescopeSlider]: "gradescope",
  [themedSlider]: "themedAnims",
};

const sliders = [
  assignmentSlider,
  quizzesSlider,
  discussionsSlider,
  otherSlider,
  fullScreenSlider,
  classroomSlider,
  gradescopeSlider,
  themedSlider,
];

sliders.forEach((settingSlider) => {
  settingSlider.addEventListener("change", () => {
    const value = settingSlider.checked;
    const saveKey = settingSlider.id;

    if (saveKey) save(saveKey, value);

    sendMessage(["changeValue", saveKey, value]);
  });
});

initSetting("assignments", true, assignmentSlider);
initSetting("quizzes", false, quizzesSlider);
initSetting("discussions", true, discussionsSlider);
initSetting("other", true, otherSlider);
initSetting("fullScreen", true, fullScreenSlider);
initSetting("classroom", true, classroomSlider);
initSetting("gradescope", true, gradescopeSlider);
initSetting("themedAnims", true, themedSlider);

function initSetting(key, defaultValue, slider) {
  load(key, function (value) {
    if (value == null) {
      value = defaultValue;
      save(key, value);
    }

    updateSlider(slider, value);
  });
}

/**
 * STATS
 */

const validStats = [
  "total",
  "assignments",
  "quizzes",
  "discussions",
  "other",
  "classroom",
  "gradescope",
];

function loadStats(type, element) {
  load(type, function (value) {
    if (value == null || typeof value != "number") {
      value = 0;
      save(type, value);
    }

    element.innerHTML = value;
  });
}

for (const stat of validStats) {
  const element = document.getElementById("stats-" + stat);
  loadStats("stats-" + stat, element);
}

document.getElementById("version").innerHTML =
  chrome.runtime.getManifest().version;

let resetButton = document.getElementById("resetstats");
let resetConfirm;
resetButton.addEventListener("click", () => {
  if (!resetConfirm) {
    resetConfirm = true;
    resetButton.innerHTML = "Are you sure?";
    setTimeout(() => {
      resetConfirm = false;
      resetButton.innerHTML = "Reset Stats";
    }, 3000);
  } else {
    for (const stat of validStats) {
      save("stats-" + stat, 0);
      document.getElementById("stats-" + stat).innerHTML = 0;
    }

    resetConfirm = false;
    resetButton.innerHTML = "Reset Stats";
  }
});

/**
 * OTHER
 */

const quote = document.getElementById("random-quote");
const staticUrl = "https://aidenjohnson.dev/Hosts/help-me-bevo-quotes.json";
let originalQuote = "";
fetch(staticUrl)
  .then((response) => {
    if (!response.ok) {
      throw new Error("Network response was not ok " + response.statusText);
    }
    return response.json();
  })
  .then((data) => {
    const quotes = data.quotes;
    quote.textContent = quotes[Math.floor(Math.random() * quotes.length)];
    originalQuote = quote.textContent;
  })
  .catch((error) => {
    console.error("There was a problem with the fetch operation:", error);
  });

// Hover over LHD logo
const lhdImage = document.getElementById("lhd");

lhdImage.addEventListener("mouseover", () => {
  quote.textContent = "Longhorn Developers";
});

lhdImage.addEventListener("mouseout", () => {
  quote.textContent = originalQuote;
});

/**
 * WINDOWS
 */

let menuOpen = false;

function animate(window, div, fadeIn) {
  menuOpen = fadeIn;

  if (fadeIn) {
    main.classList.add("animate-in");
    main.classList.remove("animate-out");
    window.classList.remove("animate-out");
    window.classList.add("animate-in");
    div.classList.remove("pointer-events-none");
  } else {
    main.classList.add("animate-out");
    main.classList.remove("animate-in");
    window.classList.remove("animate-in");
    window.classList.add("animate-out");
    div.classList.add("pointer-events-none");
  }
}

/**
 * EXTENSION WINDOW
 */

const extensionButton = document.getElementById("extensionbutton");
const extensionMain = document.getElementById("extensions");
const extensionDiv = document.getElementById("extensionsdiv");
const extensionBack = document.getElementById("extensionback");

const main = document.getElementById("main");

extensionButton.addEventListener("click", () => {
  if (menuOpen) return;

  animate(extensionMain, extensionDiv, true);
});

extensionBack.addEventListener("click", () => {
  animate(extensionMain, extensionDiv, false);
});

/**
 * STATS WINDOW
 */

const statsButton = document.getElementById("statsbutton");
const statsMain = document.getElementById("stats");
const statsDiv = document.getElementById("statsdiv");
const statsBack = document.getElementById("statsback");

statsButton.addEventListener("click", () => {
  if (menuOpen) return;

  animate(statsMain, statsDiv, true);
});

statsBack.addEventListener("click", () => {
  animate(statsMain, statsDiv, false);
});

/**
 * FUNCTIONS
 */

function updateSlider(element, value) {
  element.checked = value;
  element.dispatchEvent(new Event("change"));

  sendMessage(["changeValue", element, value]);
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(value, max));
}

// Enables/disables the extension, updating the button and content.js script
function updateToggle() {
  toggleButton.innerHTML = enabled ? "ON" : "OFF";
  toggleButton.style.backgroundColor = enabled ? "#22c55e" : "#f87171";

  for (const element of contentDiv) {
    element.style.opacity = enabled ? 1 : 0.5;
    element.style.pointerEvents = enabled ? "auto" : "none";
  }

  sendMessage(["toggle", enabled]);
}

// Sends a message to content.js to update the video element live
function sendMessage(message) {
  (async () => {
    try {
      const [tab] = await chrome.tabs.query({
        active: true,
        lastFocusedWindow: true,
      });

      await chrome.tabs.sendMessage(tab.id, message);
    } catch (e) {
      // sendMessage(["print", "script.js sendMessage error: " + e]);
    }
  })();
}

function save(key, value) {
  if (key == "volume" && value > 1) {
    value = clamp(value / 100, 0, 1);
  }

  chrome.storage.local.set({ [key]: value }).then(() => {
    // sendMessage(["print", "Saved " + key + ": " + value]);
  });
}

function load(key, callback) {
  chrome.storage.local.get([key]).then((result) => {
    // sendMessage(["print", "Value of " + key + " is " + result[key]]);

    value = result[key];

    callback(value);
  });
}
