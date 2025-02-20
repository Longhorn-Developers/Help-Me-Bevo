const fullVideoURL = "https://aidenjohnson.dev/Images/BevoCrop.mp4";
const themedVideoURL = "https://aidenjohnson.dev/Images/ThemedBevo.mp4";
const blankVideoURL = "https://aidenjohnson.dev/Images/BlankBevo.mp4";

const debug = false;
let volume = 0.5;
const DEBUG_ASSIGNMENT_NAME = "";
function generateOverlayHTML() {
  return `
<div id="video-overlay">
  <h1 class="hidden" id="assignmentName" >${DEBUG_ASSIGNMENT_NAME}</h1>
  <video id="video" volume="${volume}" style="width: 100%">
    <source src="${fullVideoURL}" type="video/mp4">
    Your browser does not support the video tag.
  </video>
    <button class="skip-button" id="skip-button">
    SKIP (ESC)
    </button>
</div>
`;
}

let videoOverlay: HTMLElement | null;
let video: HTMLVideoElement | null;
let assignmentNameElement: HTMLElement | null;
let skip;

let injected = false;
function injectVideo() {
  if (injected) return;

  const overlayElement = document.createElement("div");
  overlayElement.innerHTML = generateOverlayHTML();
  document.body.appendChild(overlayElement);

  videoOverlay = document.getElementById("video-overlay");
  video = document.getElementById("video") as HTMLVideoElement;
  assignmentNameElement = document.getElementById("assignmentName");
  skip = document.getElementById("skip-button");

  video!.addEventListener("ended", () => {
    videoOverlay!.classList.remove("show-bevo");
    setPlaying(false, null);

    video!.muted = false;
  });

  skip!.addEventListener("click", () => {
    video!.pause();
    video!.currentTime = 0;
    videoOverlay!.classList.remove("show-bevo");
    setPlaying(false, null);
  });

  injected = true;

  console.log("Injected video");
}

let eventButtons: HTMLElement[] = [];
let blacklisted = ["confirm_unfavorite_course"];

let enabled: boolean = true;
let assignments: boolean = true;
let quizzes: boolean = false;
let discussions: boolean = true;
let other: boolean = true;
let classroom: boolean = true;
let gradescope: boolean = true;
let playing: boolean = false;
let themedAnims: boolean = true;
let assignmentName: boolean = true;
let watchTime: number = 0;

function getStatsFields() {
  return {
    busiestHour: {} as Record<number, number>,
    busiestDay: {} as Record<number, number>,
    weekendSubmissions: 0,
    weekdaySubmissions: 0,
    courses: {} as Record<string, number>,
    timeWatched: 0,
    lastMinuteSubmissions: 0,
    mostProcrastinatedAssignment: {
      name: "",
      timeLeft: -1,
    },
    earliestAssignment: {
      name: "",
      timeLeft: -1,
    },
  };
}

const SEMESTER = "SPRING_2025";
let personalStats = {
  [SEMESTER]: getStatsFields(),
};

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
  load("stats-" + key, 0, function (value: number) {
    stats[key as keyof typeof stats] = value;
  });
}

load("enabled", true, function (value: boolean) {
  enabled = value;
});
load("personalStats", personalStats, function (value: Object[]) {
  personalStats = JSON.parse(JSON.stringify(value));

  // Add keys/indexes that may have been added in newer versions
  const template = getStatsFields();
  for (const key in template) {
    if (personalStats[SEMESTER][key as keyof typeof template] == null) {
      // Deep copy the value
      personalStats[SEMESTER][key as keyof typeof template] = JSON.parse(
        JSON.stringify(template[key as keyof typeof template])
      );
    }
  }
});
load("assignments", true, function (value: boolean) {
  assignments = value;
});
load("quizzes", false, function (value: boolean) {
  quizzes = value;
});
load("discussions", false, function (value: boolean) {
  discussions = value;
});
load("other", true, function (value: boolean) {
  other = value;
});
// Should load 0-1
load("volume", null, function (value: number | null) {
  if (value == null) {
    value = volume;
    save("volume", volume);
  }

  console.log(value);

  value = clamp(value, 0, 1);

  updateVolume([null, value]);
});
load("classroom", true, function (value: boolean) {
  classroom = value;
});
load("gradescope", true, function (value: boolean) {
  gradescope = value;
});
load("playing", null, function (value: Object[] | null) {
  if (value == null) return;

  const time: number = value[0] as number;
  const wasPlaying: boolean = value[1] as boolean;
  const type: string = value[2] as string;

  if (wasPlaying && Date.now() / 1000 - time < 4) {
    injectVideo();
    video!.muted = true;
    displayBevo(type, true);
  } else if (wasPlaying) {
    save("playing", null);
  }
});
load("themedAnims", true, function (value: boolean) {
  themedAnims = value;
});
load("assignmentName", true, function (value: boolean) {
  assignmentName = value;
});

/**
 * EVENTS & LISTENERS
 */

const listenerFuncs = {
  play: displayBevo,
  updateVolume: updateVolume,
  toggle: toggle,
  addSubmit: addSubmit,
  changeValue: changeValue,
};

// If the user hasn't interacted with the page, videos are automatically muted
document.addEventListener("click", () => {
  if (!playing) return;

  video!.muted = false;
});

chrome.runtime.onMessage.addListener(function (request: any) {
  if (request == null) return;

  const action = request[0] as keyof typeof listenerFuncs;
  if (listenerFuncs[action]) {
    listenerFuncs[action](request, false);
  } else {
    console.log(request);
  }
});

// Shortcut for skipping
document.addEventListener("keydown", (event) => {
  if (playing && (event.key === "Escape" || event.key === "Backspace")) {
    video!.pause();
    video!.currentTime = 0;
    videoOverlay!.classList.remove("show-bevo");
    setPlaying(false, null);
  }
});

/**
 * ATTACHING TO BUTTONS
 */

// Regular Assignments
waitForElm("#submit-button").then((elm: HTMLElement) => {
  initButton(elm, "assignments");
});

// Quizzes
waitForElm("#submit_quiz_button").then((elm) => {
  initButton(elm, "quizzes");
});

// Dynamically loaded Submit buttons
const bodyElement = document.body;
const config = { childList: true, subtree: true };

const callback = (mutationList: MutationRecord[]) => {
  for (const mutation of mutationList) {
    if (mutation.type === "childList") {
      mutation.addedNodes.forEach((node: Node | HTMLElement) => {
        if (node instanceof HTMLElement && node.nodeName === "BUTTON") {
          if (node.id == "submit-button") {
            initButton(node, "assignments");
          } else {
            if (isSubmitButton(node, true, "other")) initButton(node, "other");
          }
        } else if (node.nodeType === 1) {
          // nodeType 1 is an Element
          const element = node as HTMLElement;
          const buttons = element.querySelectorAll("button");

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
              button.parentElement &&
              button.parentElement.classList.contains(
                "discussions-editor-submit"
              )
            ) {
              initButton(button, "discussions");
            }
          });

          const buttonDivs = document.querySelectorAll('div[role="button"]');
          buttonDivs.forEach((button) => {
            if (isSubmitButton(button as HTMLElement, null, "other")) {
              initButton(button as HTMLElement, "other");
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

function changeValue(data: [string, string, boolean]) {
  let variable = data[1];
  let value = data[2];

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
function isSubmitButton(
  element: HTMLElement,
  isButton: boolean | null,
  type: string | null
) {
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

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(value, max));
}

async function displayBevo(type: string, skipAnalytics: boolean | null) {
  if (!enabled || playing) return;
  if (type == "assignments" && !assignments) return;
  if (type == "quizzes" && !quizzes) return;
  if (type == "discussions" && !discussions) return;
  if (type == "gradescope" && !gradescope) return;
  if (type == "classroom" && !classroom) return;
  if (type == "other" && !other) return;

  const curAssignmentName = getAssignmentName(type);

  let URL = fullVideoURL;
  if (themedAnims) {
    const isValid = await isValidVideo(themedVideoURL);

    if (isValid) {
      URL = themedVideoURL;
    } else {
      if (curAssignmentName != null && assignmentName) {
        URL = blankVideoURL;
        assignmentNameElement!.textContent = curAssignmentName.toUpperCase();

        let fontSizeRem: number;
        if (curAssignmentName.length > 70) {
          fontSizeRem = 5;
        } else if (curAssignmentName.length > 50) {
          fontSizeRem = 6;
        } else if (curAssignmentName.length > 30) {
          fontSizeRem = 7;
        }

        if (window.innerWidth < 850) {
          fontSizeRem! /= 2.25;
        } else if (window.innerWidth < 1300) {
          fontSizeRem! /= 1.5;
        }

        assignmentNameElement!.style.fontSize = `${fontSizeRem!}rem`;
      }
    }

    console.log("Themed video " + (isValid ? "exists" : "doesn't exist"));
  }

  video!.src = URL;

  video!.pause();

  setPlaying(true, type);
  video!.volume = volume; // Have to set it like this instead of loading it into the HTML so it works

  if (!skipAnalytics) {
    logStatistics(type);
  }

  if (curAssignmentName != null) {
    assignmentNameElement!.classList.remove("hidden");
    setTimeout(() => {
      assignmentNameElement!.classList.remove("shake");
      assignmentNameElement!.classList.add("hidden");
    }, 1250);
  }

  setTimeout(() => {
    videoOverlay!.classList.add("show-bevo");
    video!.play();

    if (!skipAnalytics) {
      analyticSend("bevo");
      analyticSend(type);

      stats["total"]++;
      stats[type as keyof typeof stats]++;
      save("stats-total", stats["total"]);
      save("stats-" + type, stats[type as keyof typeof stats]);
    }
  }, 100);
}

function setPlaying(value: boolean | null, type: string | null) {
  playing = value === true;
  if (playing) {
    assignmentNameElement!.classList.add("shake");
    watchTime = Date.now() / 1000;
  } else {
    assignmentNameElement!.classList.remove("shake");
    assignmentNameElement!.classList.add("hidden");

    watchTime = Date.now() / 1000 - watchTime;
    personalStats[SEMESTER].timeWatched += Math.floor(watchTime + 0.5); // In seconds
    watchTime = 0;
    save("personalStats", personalStats);
    console.log(personalStats);
  }

  save("playing", [Date.now() / 1000, value, type]);
}

// This is for Help Me Bevo wrapped at the end of every semester
function logStatistics(type: string) {
  // Busiest Day
  const dayOfWeek = new Date().getDay();
  personalStats[SEMESTER].busiestDay[dayOfWeek] =
    (personalStats[SEMESTER].busiestDay[dayOfWeek] ?? 0) + 1;

  // Busiest Hour
  const hour = new Date().getHours();
  personalStats[SEMESTER].busiestHour[hour] =
    (personalStats[SEMESTER].busiestHour[hour] ?? 0) + 1;

  // Weekend & Weekday Submissions
  const day = new Date().getDay();
  if (day == 0 || day == 6) {
    personalStats[SEMESTER].weekendSubmissions++;
  } else {
    personalStats[SEMESTER].weekdaySubmissions++;
  }

  // Courses
  const courseName: string = getCourseName(type) as string;
  personalStats[SEMESTER].courses[courseName] =
    (personalStats[SEMESTER].courses[courseName] ?? 0) + 1;

  // Last Minute Submissions
  const unixTimestampSeconds = getDueDate(type);
  if (unixTimestampSeconds) {
    const timeLeft = unixTimestampSeconds - Math.floor(Date.now() / 1000);
    if (timeLeft < 30 * 60) {
      // 30 minutes til due
      personalStats[SEMESTER].lastMinuteSubmissions++;
    }

    // Most Procrastinated Assignment
    const closestTilDue =
      personalStats[SEMESTER].mostProcrastinatedAssignment.timeLeft;
    if (
      closestTilDue == -1 ||
      timeLeft < personalStats[SEMESTER].mostProcrastinatedAssignment.timeLeft
    ) {
      personalStats[SEMESTER].mostProcrastinatedAssignment = {
        name: getAssignmentName(type) ?? "",
        timeLeft: timeLeft,
      };
    }

    // Earliest Assignment
    const earliestTilDue = personalStats[SEMESTER].earliestAssignment.timeLeft;
    if (
      earliestTilDue == -1 ||
      timeLeft > personalStats[SEMESTER].earliestAssignment.timeLeft
    ) {
      personalStats[SEMESTER].earliestAssignment = {
        name: getAssignmentName(type) ?? "",
        timeLeft: timeLeft,
      };
    }
  }

  save("personalStats", personalStats);
  console.log(personalStats);
}

function getAssignmentName(type: string) {
  let titleElement;
  let titleText;

  switch (type) {
    case "assignments":
      titleElement = document.querySelector('[data-testid="title"]');
      titleText = titleElement ? titleElement.textContent : null;

      return titleText;
    case "quizzes":
      // First element is an active open quiz, the seocnd one is after the submission when page refreshes
      titleElement =
        document.querySelector(".quiz-header h1") ||
        document.getElementById("quiz_title");
      titleText = titleElement ? titleElement.textContent : null;

      return titleText;
    case "discussions":
      const breadcrumbs = document.querySelector("#breadcrumbs ul");
      const lastSpan = breadcrumbs!.querySelector("li:last-child span");

      titleText = lastSpan!.textContent!.trim();

      return titleText;
    case "gradescope":
      const h1Element = document.querySelector(
        "h1.submissionOutlineHeader--assignmentTitle"
      );

      titleText = h1Element!.innerHTML.trim();

      return titleText;
    default:
      break;
  }
}

function getCourseName(type: string) {
  switch (type) {
    case "quizzes":
    case "discussions":
    case "assignments":
      const courseElement = document.querySelector(
        'a[href^="/courses/"] span.ellipsible'
      );
      const courseText = courseElement?.textContent!.trim();

      return courseText;
    case "gradescope":
      const courseTitleElement = document.querySelector(
        "h1.courseHeader--title"
      );
      const courseTitle = courseTitleElement?.textContent!.trim();

      return courseTitle;
    default:
      return;
  }
}

function getDueDate(type: string) {
  let dueDateElement: HTMLElement;
  let dateTime: number;
  let unixTimestampSeconds: number;

  switch (type) {
    case "assignments":
      dueDateElement = document.querySelector(
        '[data-testid="due-date"]'
      ) as HTMLElement;

      if (!dueDateElement) return;

      const dateAttr = dueDateElement.getAttribute("datetime");
      dateTime = dateAttr ? Number(dateAttr) : 0;
      unixTimestampSeconds = Math.floor(new Date(dateTime).getTime() / 1000);

      return unixTimestampSeconds;
    case "quizzes":
      dueDateElement = document.querySelector("span.due_at") as HTMLElement;
      const dueDateText: string = dueDateElement?.textContent!.trim() as string;

      if (!dueDateText) return;

      unixTimestampSeconds = Math.floor(new Date(dueDateText).getTime() / 1000);

      return unixTimestampSeconds;
    case "gradescope":
      dueDateElement = document.querySelector(
        "div[data-react-class='AssignmentSubmissionViewer']"
      ) as HTMLElement;
      if (!dueDateElement) return;

      const dataProps = JSON.parse(
        dueDateElement.getAttribute("data-react-props")!
      );
      if (!dataProps) return;

      dateTime = dataProps.assignment.due_date;

      unixTimestampSeconds = Math.floor(new Date(dateTime).getTime() / 1000);

      return unixTimestampSeconds;
  }
}

function updateVolume(value: [null, number]) {
  volume = clamp(value[1], 0, 1);

  if (video != null) video.volume = volume;
}

function toggle(value: [null, boolean]) {
  const boolValue = value[1];

  enabled = boolValue;
}

function isValidVideo(url: string) {
  // First, check if the URL ends with .mp4
  if (!url.toLowerCase().endsWith(".mp4")) {
    return false;
  }

  const video = document.createElement("video");
  video.src = url;

  return new Promise((resolve) => {
    video.onloadeddata = () => {
      resolve(true); // Valid video
    };

    video.onerror = () => {
      resolve(false); // Invalid video
    };
  });
}

function initButton(button: HTMLElement, type: string) {
  if (
    button != null &&
    !eventButtons.includes(button) &&
    !blacklisted.includes(button.id)
  ) {
    injectVideo();

    eventButtons.push(button);
    button.addEventListener("click", () => {
      displayBevo(type, false);
    });
  }

  if (debug) console.log(`Initiated ${type}`);
}

// Credits to this post for this function: https://stackoverflow.com/a/61511955
function waitForElm<T extends Element = HTMLElement>(
  selector: string
): Promise<T> {
  return new Promise((resolve) => {
    const element = document.querySelector(selector) as T | null;
    if (element) {
      return resolve(element);
    }
    const observer = new MutationObserver((_mutations) => {
      const elm = document.querySelector(selector) as T | null;
      if (elm) {
        observer.disconnect();
        resolve(elm);
      }
    });

    // If you get "parameter 1 is not of type 'Node'" error, see https://stackoverflow.com/a/77855838/492336
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  });
}

function save(key: string, value: any) {
  if (key == "volume" && value > 1) {
    value = clamp(value / 100, 0, 1);
  }

  chrome.storage.local.set({ [key]: value }).then(() => {
    if (debug) console.log("Saved " + key + ": " + value);
  });
}

function load(key: string, defaultValue: any, callback: Function) {
  chrome.storage.local.get([key]).then((result: { [key: string]: any }) => {
    let value = result[key];

    if (value == null) {
      value = defaultValue;
    }

    callback(value);
  });
}

function analyticSend(data: string) {
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

function addDiv(overlayHTML: string) {
  // For debugging
  const innerHTML = overlayHTML;

  const overlayElement = document.createElement("div");
  overlayElement.innerHTML = innerHTML;
  document.body.appendChild(overlayElement);
}

console.log("content.js loaded");
