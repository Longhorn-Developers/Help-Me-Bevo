export default async function script() {
  /**
   * VOLUME
   */
  const slider = document.getElementById("volumeSlider") as HTMLInputElement;
  const output = document.getElementById("volumeOutput") as HTMLElement;

  console.log("Script loaded");

  // Should load 0-1
  // We clamp at various lines to assurance. There was a bug where it would be >1 and it was saved into local storage.
  load("volume", (value: number | null) => {
    if (value == null) {
      value = 0.5;
      save("volume", value);
    } else if (value > 1) {
      value = clamp(value / 100, 0, 1);
    }

    output.innerHTML = `Volume: ${value * 100}`;
    slider.value = (value * 100).toString();

    sendMessage(["updateVolume", Number(value)]);
  });

  slider.oninput = function (event: Event) {
    const target = event.currentTarget as HTMLInputElement;
    output.innerHTML = `Volume: ${target.value}`;
    sendMessage(["updateVolume", Number(target.value) / 100]);
  };

  slider.addEventListener("mouseup", function (this: HTMLInputElement) {
    save("volume", Number(this.value) / 100);
  });

  /**
   * MAIN TOGGLER
   */
  const toggleButton = document.getElementById("toggle") as HTMLButtonElement;
  let enabled = true;
  load("enabled", (value: boolean | null) => {
    if (value == null) {
      value = true;
    }
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

  const assignmentSlider = document.getElementById(
    "assignments"
  ) as HTMLInputElement;
  const quizzesSlider = document.getElementById("quizzes") as HTMLInputElement;
  const discussionsSlider = document.getElementById(
    "discussions"
  ) as HTMLInputElement;
  const otherSlider = document.getElementById("other") as HTMLInputElement;
  const classroomSlider = document.getElementById(
    "classroom"
  ) as HTMLInputElement;
  const gradescopeSlider = document.getElementById(
    "gradescope"
  ) as HTMLInputElement;
  const themedSlider = document.getElementById(
    "themedAnims"
  ) as HTMLInputElement;
  const assignmentNameSlider = document.getElementById(
    "assignmentName"
  ) as HTMLInputElement;

  const sliders: HTMLInputElement[] = [
    assignmentSlider,
    quizzesSlider,
    discussionsSlider,
    otherSlider,
    classroomSlider,
    gradescopeSlider,
    themedSlider,
    assignmentNameSlider,
  ];

  sliders.forEach((settingSlider) => {
    settingSlider.addEventListener("change", () => {
      const value = settingSlider.checked;
      const saveKey = settingSlider.id;

      if (saveKey) {
        save(saveKey, value);
      }

      sendMessage(["changeValue", saveKey, value]);
    });
  });

  initSetting("assignments", true, assignmentSlider);
  initSetting("quizzes", false, quizzesSlider);
  initSetting("discussions", true, discussionsSlider);
  initSetting("other", true, otherSlider);
  initSetting("classroom", true, classroomSlider);
  initSetting("gradescope", true, gradescopeSlider);
  initSetting("themedAnims", true, themedSlider);
  initSetting("assignmentName", true, assignmentNameSlider);

  function initSetting(
    key: string,
    defaultValue: boolean,
    slider: HTMLInputElement
  ): void {
    load(key, (value: boolean | null) => {
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
  const validStats: string[] = [
    "total",
    "assignments",
    "quizzes",
    "discussions",
    "other",
    "classroom",
    "gradescope",
  ];

  function loadStats(type: string, element: HTMLElement): void {
    load(type, (value: number | null) => {
      if (value == null || typeof value !== "number") {
        value = 0;
        save(type, value);
      }
      element.innerHTML = value.toString();
    });
  }

  for (const stat of validStats) {
    const element = document.getElementById("stats-" + stat) as HTMLElement;
    loadStats("stats-" + stat, element);
  }

  (document.getElementById("version") as HTMLElement).innerHTML =
    chrome.runtime.getManifest().version;

  const resetButton = document.getElementById(
    "resetstats"
  ) as HTMLButtonElement;
  let resetConfirm: boolean = false;
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
        (document.getElementById("stats-" + stat) as HTMLElement).innerHTML =
          "0";
      }
      resetConfirm = false;
      resetButton.innerHTML = "Reset Stats";
    }
  });

  /**
   * OTHER
   */
  const quote = document.getElementById("random-quote") as HTMLElement;
  const originalQuote: string = await chrome.runtime.sendMessage("quote");

  quote.textContent = originalQuote;

  // Hover over LHD logo
  const lhdImage = document.getElementById("lhd") as HTMLElement;

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

  function animate(
    windowEl: HTMLElement,
    div: HTMLElement,
    fadeIn: boolean
  ): void {
    menuOpen = fadeIn;

    if (fadeIn) {
      main.classList.add("animate-in");
      main.classList.remove("animate-out");
      windowEl.classList.remove("animate-out");
      windowEl.classList.add("animate-in");
      div.classList.remove("pointer-events-none");
    } else {
      main.classList.add("animate-out");
      main.classList.remove("animate-in");
      windowEl.classList.remove("animate-in");
      windowEl.classList.add("animate-out");
      div.classList.add("pointer-events-none");
    }
  }

  /**
   * EXTENSION WINDOW
   */
  const extensionButton = document.getElementById(
    "extensionbutton"
  ) as HTMLElement;
  const extensionMain = document.getElementById("extensions") as HTMLElement;
  const extensionDiv = document.getElementById("extensionsdiv") as HTMLElement;
  const extensionBack = document.getElementById("extensionback") as HTMLElement;

  const main = document.getElementById("main") as HTMLElement;

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
  const statsButton = document.getElementById("statsbutton") as HTMLElement;
  const statsMain = document.getElementById("stats") as HTMLElement;
  const statsDiv = document.getElementById("statsdiv") as HTMLElement;
  const statsBack = document.getElementById("statsback") as HTMLElement;

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
  function updateSlider(element: HTMLInputElement, value: boolean): void {
    element.checked = value;
    element.dispatchEvent(new Event("change"));
    sendMessage(["changeValue", element.id, value]);
  }

  function clamp(value: number, min: number, max: number): number {
    return Math.max(min, Math.min(value, max));
  }

  // Enables/disables the extension, updating the button and content.js script
  function updateToggle(): void {
    toggleButton.innerHTML = enabled ? "ON" : "OFF";
    toggleButton.style.backgroundColor = enabled ? "#22c55e" : "#f87171";

    contentDiv.forEach((element) => {
      const el = element as HTMLElement;
      el.style.opacity = enabled ? "1" : "0.5";
      el.style.pointerEvents = enabled ? "auto" : "none";
    });

    sendMessage(["toggle", enabled]);
  }

  // Sends a message to content.js to update the video element live
  function sendMessage(message: any): void {
    (async () => {
      try {
        const [tab] = await chrome.tabs.query({
          active: true,
          lastFocusedWindow: true,
        });
        if (tab && tab.id !== undefined) {
          await chrome.tabs.sendMessage(tab.id, message);
        }
      } catch (e) {
        // Optionally, handle the error here
      }
    })();
  }

  function save(key: string, value: any): void {
    if (key === "volume" && value > 1) {
      value = clamp(value / 100, 0, 1);
    }
    chrome.storage.local.set({ [key]: value }).then(() => {
      // Optionally, log the save action
    });
  }

  function load(key: string, callback: (value: any) => void): void {
    chrome.storage.local.get([key]).then((result: { [key: string]: any }) => {
      const value = result[key];
      callback(value);
    });
  }
}
