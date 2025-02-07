const fullVideoURL = "https://aidenjohnson.dev/Images/BevoCrop.mp4";
const themedVideoURL = "https://aidenjohnson.dev/Images/ThemedBevo.mp4";
const blankVideoURL = "https://aidenjohnson.dev/Images/BlankBevo.mp4";

const debug = false;
let volume = 0.5;

function generateOverlayHTML() {
  return `
<div id="video-overlay">
  <h1 id="assignmentName" class="hidden"></h1>
  <video id="video" volume="${volume}" style="width: 100%">
    <source src="${fullVideoURL}" type="video/mp4">
    Your browser does not support the video tag.
  </video>
    <button class="skip-button" id="skip-button">
    SKIP
    </button>
</div>
`;
}

let videoDiv;
let videoOverlay;
let video;
let assignmentNameElement;
let skip;

let injected = false;
function injectVideo() {
  if (injected) return;

  const overlayElement = document.createElement("div");
  overlayElement.innerHTML = generateOverlayHTML();
  document.body.appendChild(overlayElement);

  videoDiv = document.getElementById("volumeDiv");
  videoOverlay = document.getElementById("video-overlay");
  video = document.getElementById("video");
  assignmentNameElement = document.getElementById("assignmentName");
  skip = document.getElementById("skip-button");

  video.addEventListener("ended", () => {
    videoOverlay.classList.remove("show-bevo");
    setPlaying(false);

    video.muted = false;
  });

  skip.addEventListener("click", () => {
    video.pause();
    video.currentTime = 0;
    videoOverlay.classList.remove("show-bevo");
    setPlaying(false);
  });

  injected = true;

  console.log("Injected video");
}

let eventButtons = [];
let blacklisted = ["confirm_unfavorite_course"];

let enabled = true;
let assignments = true;
let quizzes = false;
let discussions = true;
let other = true;
let classroom = true;
let gradescope = true;
let playing = false;
let themedAnims = true;
let assignmentName = true;

let stats = {
  total: 0,
  assignments: 0,
  quizzes: 0,
  discussions: 0,
  other: 0,
  classroom: 0,
  gradescope: 0,
};

/**
 * LOAD SETTINGS & STATS
 */

for (const key in stats) {
  load("stats-" + key, 0, function (value) {
    stats[key] = value;
  });
}

load("enabled", true, function (value) {
  enabled = value;
});
load("assignments", true, function (value) {
  assignments = value;
});
load("quizzes", false, function (value) {
  quizzes = value;
});
load("discussions", false, function (value) {
  discussions = value;
});
load("other", true, function (value) {
  other = value;
});
// Should load 0-1
load("volume", null, function (value) {
  if (value == null) {
    value = volume;
    save("volume", volume);
  }

  console.log(value);

  value = clamp(value, 0, 1);

  updateVolume([null, value]);
});
load("classroom", true, function (value) {
  classroom = value;
});
load("gradescope", true, function (value) {
  gradescope = value;
});
load("playing", null, function (value) {
  if (value == null) return;

  const time = value[0];
  const wasPlaying = value[1];
  const type = value[2];

  if (wasPlaying && Date.now() / 1000 - time < 4) {
    injectVideo();
    video.muted = true;
    displayBevo(type, true);
  } else if (wasPlaying) {
    save("playing", null);
  }
});
load("themedAnims", true, function (value) {
  themedAnims = value;
});
load("assignmentName", true, function (value) {
  assignmentName = value;
});

/**
 * EVENTS & LISTENERS
 */

const listenerFuncs = {
  play: displayBevo,
  print: log,
  updateVolume: updateVolume,
  toggle: toggle,
  addSubmit: addSubmit,
  changeValue: changeValue,
};

// If the user hasn't interacted with the page, videos are automatically muted
document.addEventListener("click", () => {
  if (!playing) return;

  video.muted = false;
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request == null) return;

  const action = request[0];
  if (listenerFuncs[action]) {
    listenerFuncs[action](request);
  } else {
    console.log(request);
  }
});

// Shortcut for skipping
document.addEventListener("keydown", (event) => {
  if (playing && (event.key === "Escape" || event.key === "Backspace")) {
    video.pause();
    video.currentTime = 0;
    videoOverlay.classList.remove("show-bevo");
    setPlaying(false);
  }
});

/**
 * ATTACHING TO BUTTONS
 */

// Regular Assignments
waitForElm("#submit-button").then((elm) => {
  initButton(elm, "assignments");
});

// Quizzes
waitForElm("#submit_quiz_button").then((elm) => {
  initButton(elm, "quizzes");
});

// Discussions
// ?

// Dynamically loaded Submit buttons
const bodyElement = document.body;
const config = { childList: true, subtree: true };

const callback = (mutationList, observer) => {
  for (const mutation of mutationList) {
    if (mutation.type === "childList") {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeName === "BUTTON") {
          if (node.id == "submit-button") {
            initButton(node, "assignments");
          } else {
            if (isSubmitButton(node, true, "other")) initButton(node, "other");
          }
        } else if (node.nodeType === 1) {
          // nodeType 1 is an Element

          const buttons = node.querySelectorAll("button");

          buttons.forEach((button) => {
            if (button.id == "submit-button") {
              initButton(button, "assignments");
            } else if (isSubmitButton(button, true, "other")) {
              initButton(button, "other");
            } else if (
              isSubmitButton(button, true, "gradescope") &&
              window.location.href.includes("gradescope")
            ) {
              initButton(button, "gradescope");
            } else if (
              button.parentElement.classList.contains(
                "discussions-editor-submit"
              )
            ) {
              initButton(button, "discussions");
            }
          });

          const buttonDivs = document.querySelectorAll('div[role="button"]');
          buttonDivs.forEach((button) => {
            if (isSubmitButton(button, "other")) {
              initButton(button, "other");
            }
          });
        }
      });
    }
  }
};

const observer = new MutationObserver(callback);
observer.observe(bodyElement, config);

/**
 * FUNCTIONS
 */

function changeValue(data) {
  variable = data[1];
  value = data[2];

  switch (variable) {
    case "assignments":
      assignments = value;
      break;
    case "quizzes":
      quizzes = value;
      break;
    case "discussions":
      discussions = value;
      break;
    case "other":
      other = value;
      break;
    case "classroom":
      classroom = value;
      break;
    case "gradescope":
      gradescope = value;
      break;
    case "themedAnims":
      themedAnims = value;
      break;
    case "assignmentName":
      assignmentName = value;
      break;
  }
}

const submitTexts = ["Submit", "Upload", "Submit & View Submission"];
const classroomText = ["Turn in", "Mark as done"];
const exceptions = [
  "Submit file using Canvas Files",
  "Submit PDF",
  "Submit Images",
];
function isSubmitButton(element, isButton, type) {
  if (element.textContent == null || element.id == "submit_quiz_button")
    return false;

  const textContent = element.textContent.trim();

  for (const text of exceptions) {
    if (textContent.includes(text)) return false;
  }

  // Check settings
  for (const text of submitTexts) {
    if (type != "gradescope" && text == "Upload") continue;

    if (textContent.includes(text) && !textContent.includes("Quiz"))
      return true;
  }

  if (!isButton && classroom) {
    for (const text of classroomText) {
      if (element.textContent.trim() == text) return true;
    }
  }

  return false;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(value, max));
}

async function displayBevo(type, skipAnalytics) {
  if (!enabled || playing) return;
  if (type == "assignments" && !assignments) return;
  if (type == "quizzes" && !quizzes) return;
  if (type == "discussions" && !discussions) return;
  if (type == "other" && !other) return;

  let curAssignmentName;
  let titleElement;
  let titleText;
  switch (type) {
    case "assignments":
      titleElement = document.querySelector('[data-testid="title"]');
      titleText = titleElement ? titleElement.textContent : null;

      curAssignmentName = titleText;
      break;
    case "quizzes":
      // First element is an active open quiz, the seocnd one is after the submission when page refreshes
      titleElement =
        document.querySelector(".quiz-header h1") ||
        document.getElementById("quiz_title");
      titleText = titleElement ? titleElement.textContent : null;

      curAssignmentName = titleText;
      break;
    case "discussions":
      const breadcrumbs = document.querySelector("#breadcrumbs ul");
      const lastSpan = breadcrumbs.querySelector("li:last-child span");

      titleText = lastSpan.textContent.trim();

      curAssignmentName = text;
      break;
    case "gradescope":
      const h1Element = document.querySelector(
        "h1.submissionOutlineHeader--assignmentTitle"
      );

      titleText = h1Element.innerHTML.trim();

      curAssignmentName = titleText;
      break;
    default:
      break;
  }

  let URL = fullVideoURL;
  if (themedAnims) {
    const isValid = await isValidVideo(themedVideoURL);

    if (isValid) {
      URL = themedVideoURL;
    } else {
      if (curAssignmentName != null) {
        URL = blankVideoURL;
        assignmentNameElement.textContent = curAssignmentName.toUpperCase();
      }
    }

    console.log("Themed video " + (isValid ? "exists" : "doesn't exist"));
  }

  video.src = URL;

  video.pause();

  setPlaying(true, type);
  video.volume = volume; // Have to set it like this instead of loading it into the HTML so it works

  if (curAssignmentName != null) {
    assignmentNameElement.classList.remove("hidden");
    setTimeout(() => {
      assignmentNameElement.classList.remove("shake");
      assignmentNameElement.classList.add("hidden");
    }, 1250);
  }

  setTimeout(() => {
    videoOverlay.classList.add("show-bevo");
    video.play();

    if (!skipAnalytics) {
      analyticSend("bevo");
      analyticSend(type);

      stats["total"]++;
      stats[type]++;
      save("stats-total", stats["total"]);
      save("stats-" + type, stats[type]);
    }
  }, 100);
}

function setPlaying(value, type) {
  playing = value;
  if (playing) {
    assignmentNameElement.classList.add("shake");
  } else {
    assignmentNameElement.classList.remove("shake");
    assignmentNameElement.classList.add("hidden");
  }

  save("playing", [Date.now() / 1000, value, type]);
}

function log(message) {
  console.log(message[1]);
}

function updateVolume(value) {
  value = value[1];
  volume = clamp(value, 0, 1);

  if (video != null) video.volume = volume;
}

function toggle(value) {
  value = value[1];

  enabled = value;
}

function isValidVideo(url) {
  // First, check if the URL ends with .mp4
  if (!url.toLowerCase().endsWith(".mp4")) {
    return false;
  }

  // Create a video element to check if the video can be loaded
  const video = document.createElement("video");
  video.src = url;

  return new Promise((resolve) => {
    // Add an event listener for video load success
    video.onloadeddata = () => {
      resolve(true); // Valid video
    };

    // Add an event listener for video load failure
    video.onerror = () => {
      resolve(false); // Invalid video
    };
  });
}

function initButton(button, type) {
  if (
    button != null &&
    !eventButtons.includes(button) &&
    !blacklisted.includes(button.id)
  ) {
    injectVideo();

    eventButtons.push(button);
    button.addEventListener("click", () => {
      displayBevo(type);
    });
  }

  if (debug) console.log(`Initiated ${type}`);
}

// Credits to this post for this function: https://stackoverflow.com/a/61511955
function waitForElm(selector) {
  return new Promise((resolve) => {
    if (document.querySelector(selector)) {
      return resolve(document.querySelector(selector));
    }

    const observer = new MutationObserver((mutations) => {
      if (document.querySelector(selector)) {
        observer.disconnect();
        resolve(document.querySelector(selector));
      }
    });

    // If you get "parameter 1 is not of type 'Node'" error, see https://stackoverflow.com/a/77855838/492336
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  });
}

function save(key, value) {
  if (key == "volume" && value > 1) {
    value = clamp(value / 100, 0, 1);
  }

  chrome.storage.local.set({ [key]: value }).then(() => {
    if (debug) console.log("Saved " + key + ": " + value);
  });
}

function load(key, defaultValue, callback) {
  chrome.storage.local.get([key]).then((result) => {
    value = result[key];

    if (value == null) {
      value = defaultValue;
    }

    callback(value);
  });
}

function analyticSend(data) {
  chrome.runtime.sendMessage(data);
}

function addSubmit() {
  // For debugging
  addDiv(`<button
    id="submit_quiz_button"
    style="z-index:99999; padding: 10px 10px 10px 10px; position: absolute"
  >
    Submit
  </button>`);
}

function addDiv(overlayHTML) {
  // For debugging
  const innerHTML = overlayHTML;

  const overlayElement = document.createElement("div");
  overlayElement.innerHTML = innerHTML;
  document.body.appendChild(overlayElement);
}

console.log("content.js loaded");
