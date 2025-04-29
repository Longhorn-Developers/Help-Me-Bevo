import "../global.css";
import LHD from "../images/LHD.jpeg";
import { useEffect, useState } from "react";
import { get, write } from "../lib/storage";

type Settings = {
  enabled: boolean;
  assignmentName: boolean;
  assignments: boolean;
  classroom: boolean;
  discussions: boolean;
  gradescope: boolean;
  quizzes: boolean;
  other: boolean;
  themedAnims: boolean;
  volume: number;

  "stats-assignments": number;
  "stats-classroom": number;
  "stats-discussions": number;
  "stats-gradescope": number;
  "stats-other": number;
  "stats-quizzes": number;
  "stats-total": number;

  clientId: number;
};

const defaultSettings: Settings = {
  enabled: true,

  assignmentName: true,
  assignments: true,
  classroom: true,
  discussions: true,
  gradescope: true,
  quizzes: false,
  other: true,
  themedAnims: true,
  volume: 50,

  "stats-assignments": 0,
  "stats-classroom": 0,
  "stats-discussions": 0,
  "stats-gradescope": 0,
  "stats-other": 0,
  "stats-quizzes": 0,
  "stats-total": 0,

  clientId: 0,
};

export default function Popup() {
  const [showStats, setShowStats] = useState(false);
  const [showExtensions, setShowExtensions] = useState(false);
  const [resetConfirm, setResetConfirm] = useState(false);
  const [settings, setSettings] = useState<Settings>(defaultSettings);

  const [showWrapped, setShowWrapped] = useState(false);
  const [quote, setQuote] = useState("Hook 'em");
  let ogQuote = "Hook 'em";

  useEffect(() => {
    (async () => {
      const _quote = await chrome.runtime.sendMessage("quote");
      setQuote(_quote || "Hook 'em");
      ogQuote = _quote || "Hook 'em";

      const fflags = await chrome.runtime.sendMessage("fflags");
      setShowWrapped(fflags.Wrapped);
    })();
  }, []);

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
      } catch {
        // Optionally, handle the error here
      }
    })();
  }

  // Load settings from storage.ts on open
  useEffect(() => {
    const keys = Object.keys(defaultSettings) as (keyof Settings)[];
    const loadSettings = async () => {
      // fetch each setting by its key
      const entries = await Promise.all(
        keys.map(async (k) => {
          const v = await get(k);
          return v === undefined ? null : ([k, v] as [keyof Settings, any]);
        })
      );

      const stored = Object.fromEntries(
        entries.filter((e): e is [keyof Settings, any] => e !== null)
      ) as Partial<Settings>;

      // if volume is stored as a fraction < 1, convert to percentage
      if (stored.volume !== undefined && stored.volume < 1) {
        stored.volume = stored.volume * 100;
      }

      // merge into defaults
      setSettings((prev) => ({
        ...prev,
        ...stored,
      }));
    };
    loadSettings();
  }, []);

  // Save settings if settings state is changed using storage.ts
  useEffect(() => {
    const saveSettings = async () => {
      // write each setting as its own key/value pair
      await Promise.all(
        Object.entries(settings).map(([key, value]) => write(key, value))
      );
    };
    saveSettings();
  }, [settings]);

  function changeSetting(setting: string, value: any) {
    setSettings((prevSettings) => ({
      ...prevSettings,
      [setting]: value,
    }));

    // use switch case to handle different settings
    switch (setting) {
      case "enabled":
        sendMessage(["toggle", value]);
        break;
      case "volume":
        if (value < 0) value = 50;

        sendMessage(["updateVolume", Number(value)]);
        break;
      default:
        sendMessage(["changeValue", setting, value]);
    }
  }

  return (
    <div
      style={{ fontFamily: "'Poppins', sans-serif", background: "black" }}
      className="popper"
    >
      <main className="w-[31rem] flex flex-col bg-gradient-to-br from-orange-500/20 to-orange-500/5 text-white p-6 relative">
        <div className="flex justify-between pb-3">
          <div className="space-y-1 flex flex-col w-3/4">
            <h1 className="text-4xl font-black">
              Help Me <span className="text-[#BF5700]">Bevo</span>
            </h1>
            <p className="opacity-75 text-xs">
              Be more motivated to submit assignments with Bevo
            </p>
          </div>

          <div className="flex items-center justify-center">
            <button
              id="toggle"
              className={`
                vertical-center font-bold rounded-lg size-9
                ${settings.enabled ? "bg-green-400" : "bg-red-400"}
                transform transition-all duration-200 ease-in-out
                hover:scale-110 active:scale-95
                hover:shadow-lg hover:shadow-white/25 shadow-none
              `}
              onClick={() => changeSetting("enabled", !settings.enabled)}
            >
              {settings.enabled ? "ON" : "OFF"}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 grid-rows-3 gap-3">
          <div
            id="content"
            className="grid grid-rows-5 bg-black/40 place-items-center px-4 py-2 rounded-lg text-xs row-span-3 col-span-1"
          >
            <div className="size-full flex items-center">
              <h2 className="text-left font-extrabold text-lg">Canvas</h2>
            </div>
            {/* Canvas options toggles */}
            <div className="size-full flex items-center">
              <label className="switch">
                <input
                  id="assignments"
                  type="checkbox"
                  checked={settings.assignments}
                  onChange={(e) =>
                    changeSetting("assignments", e.target.checked)
                  }
                />
                <span className="toggleslider round"></span>
              </label>
              <h3 className="font-medium">Assignments</h3>
            </div>
            <div className="size-full flex items-center">
              <label className="switch">
                <input
                  id="quizzes"
                  type="checkbox"
                  checked={settings.quizzes}
                  onChange={(e) => changeSetting("quizzes", e.target.checked)}
                />
                <span className="toggleslider round"></span>
              </label>
              <h3 className="font-medium">Quizzes</h3>
            </div>
            <div className="size-full flex items-center">
              <label className="switch">
                <input
                  id="discussions"
                  type="checkbox"
                  checked={settings.discussions}
                  onChange={(e) =>
                    changeSetting("discussions", e.target.checked)
                  }
                />
                <span className="toggleslider round"></span>
              </label>
              <h3 className="font-medium">Discussions</h3>
            </div>
            <div className="size-full flex items-center">
              <label className="switch">
                <input
                  id="other"
                  type="checkbox"
                  checked={settings.other}
                  onChange={(e) => changeSetting("other", e.target.checked)}
                />
                <span className="toggleslider round"></span>
              </label>
              <h3 className="font-medium">Other</h3>
            </div>
          </div>

          <div
            id="content"
            className="grid grid-cols-1 grid-rows-3 text-xs bg-black/40 place-items-center px-4 py-3 gap-1.5 rounded-lg row-span-2 col-start-2 col-end-2"
          >
            <div className="size-full flex items-center">
              <h2 className="text-left font-extrabold text-lg">Integrations</h2>
            </div>

            <div className="size-full flex items-center">
              <label className="switch">
                <input
                  id="classroom"
                  type="checkbox"
                  checked={settings.classroom}
                  onChange={(e) => changeSetting("classroom", e.target.checked)}
                />
                <span className="toggleslider round"></span>
              </label>
              <h3 className="font-medium">Google Classroom</h3>
            </div>
            <div className="size-full flex items-center">
              <label className="switch">
                <input
                  id="gradescope"
                  type="checkbox"
                  checked={settings.gradescope}
                  onChange={(e) =>
                    changeSetting("gradescope", e.target.checked)
                  }
                />
                <span className="toggleslider round"></span>
              </label>
              <h3 className="font-medium">Gradescope</h3>
            </div>
          </div>

          <div
            id="content"
            className="grid grid-cols-1 grid-rows-4 text-xs bg-black/40 place-items-center p-4 rounded-lg row-span-2 col-start-2 col-end-2"
          >
            <div className="size-full flex">
              <h2 className="text-left font-extrabold text-lg">Display</h2>
            </div>

            {/* <!-- VOLUME --> */}
            <div className="size-full flex flex-col justify-start gap-y-2">
              <h3 className="w-full font-medium" id="volumeOutput">
                Volume: {settings.volume}%
              </h3>
              <div className="w-full" id="volumeDiv">
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={settings.volume}
                  onChange={(e) =>
                    changeSetting("volume", Number(e.target.value))
                  }
                  className="accent-[#bf5700] w-full bg-[#bf5700]"
                  id="volumeSlider"
                />
              </div>
            </div>

            <div className="size-full flex items-center">
              <label className="switch">
                <input
                  id="assignmentName"
                  type="checkbox"
                  checked={settings.assignmentName}
                  onChange={(e) =>
                    changeSetting("assignmentName", e.target.checked)
                  }
                />
                <span className="toggleslider round"></span>
              </label>
              <h3
                className="font-medium"
                style={{ cursor: "help" }}
                title="Display names of assignments over the animation. If disabled, the old YOUR ASSIGNMENT animation will play. We don't store your assignment names, don't worry!"
              >
                Assignment Names &#9432;
              </h3>
            </div>

            <div className="size-full flex items-center">
              <label className="switch">
                <input
                  id="themedAnims"
                  type="checkbox"
                  checked={settings.themedAnims}
                  onChange={(e) =>
                    changeSetting("themedAnims", e.target.checked)
                  }
                />
                <span className="toggleslider round"></span>
              </label>
              <h3
                className="font-medium"
                style={{ cursor: "help" }}
                title="If you have this enabled and the animation is normal, there is no themed animation at the moment"
              >
                Themed Anims &#9432;
              </h3>
            </div>
          </div>

          {/* <!-- SOCIALS --> */}
          <div className="grid text-xs bg-black/40 place-items-center p-4 rounded-lg row-span-3 col-start-1 col-end-1">
            <div className="size-full flex items-center flex-col gap-y-4">
              <div className="w-full">
                <div className="font-medium mb-0.5">Made by:</div>
                <a
                  className="text-[#bf5700] !underline font-medium"
                  href="https://www.instagram.com/aidenn.johnson/"
                  target="_blank"
                >
                  @aidenn.johnson
                </a>
              </div>

              <div className="w-full">
                <div className="font-medium mb-0.5">Designed by:</div>
                <a
                  className="text-[#bf5700] !underline font-medium"
                  href="https://www.instagram.com/ethan.lanting/"
                  target="_blank"
                >
                  @ethan.lanting
                </a>
              </div>

              <div className="w-full">
                <div className="italics text-xs">
                  DM us for any concerns or suggestions!
                </div>
              </div>

              <div className="grid grid-rows-1 grid-cols-3 gap-y-2 gap-x-1 w-full">
                <button
                  className="
                  font-bold w-full cursor-pointer px-2 py-1.5 bg-[#bf5700]
                  rounded-full transform transition-transform duration-200 ease-in-out
                  hover:scale-105 hover:shadow-lg hover:shadow-white/25
                  active:scale-95 active:shadow-sm
                  "
                  onClick={() => setShowStats(true)}
                >
                  Stats
                </button>
                <button
                  className="
                  font-bold cursor-pointer col-span-2 px-2 py-1 bg-[#bf5700]
                  rounded-full transform transition-transform duration-200 ease-in-out
                  hover:scale-105 hover:shadow-lg hover:shadow-white/25
                  active:scale-95 active:shadow-sm
                  "
                  onClick={() => setShowExtensions(true)}
                >
                  More Extensions
                </button>
              </div>

              {showWrapped && (
                <button
                  className="
                  font-bold cursor-pointer col-span-2 w-full px-2 py-1 bg-[#bf5700]
                  rounded-full transform transition-transform duration-200 ease-in-out
                  hover:scale-105 hover:shadow-lg hover:shadow-white/25
                  active:scale-95 active:shadow-sm
                "
                  onClick={() => {
                    window.open(
                      chrome.runtime.getURL("../src/html/wrapped.html"),
                      "_blank"
                    );
                  }}
                >
                  View Wrapped
                </button>
              )}
            </div>
          </div>

          <div className="row-span-2 flex items-center justify-center">
            <div className="flex h-full items-center justify-center text-center text-xs bg-black/40 p-2 rounded-lg w-full">
              <div
                className="text-center font-semibold text-[#bf5700] flex items-center justify-center"
                id="random-quote"
              >
                {quote}
              </div>
            </div>

            <a
              className="ml-2 w-[2.9rem] h-full"
              href="https://github.com/longhorn-Developers/"
              target="_blank"
              onMouseEnter={() => {
                setQuote("Longhorn Developers");
              }}
              onMouseLeave={() => {
                setQuote(ogQuote);
              }}
            >
              <img className="rounded-md" src={LHD} alt="Icon" id="lhd" />
            </a>
          </div>
        </div>
      </main>

      {showStats && (
        <div
          className="absolute"
          style={{
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <main
            style={{ zIndex: 4 }}
            id="stats"
            className="w-[30rem] bg-gradient-to-br from-[#361b00] to-slate-950 text-white p-6 items-center justify-center"
          >
            <div className="flex justify-between">
              <div className="space-y-1 flex flex-col w-3/4">
                <h1 className="text-4xl font-black">
                  Your <span className="text-[#BF5700]">Stats</span>
                </h1>
                <p className="opacity-75">See how productive you've been!</p>
                <br />
              </div>
            </div>

            <div className="grid grid-rows-14 grid-cols-1 gap-1 bg-black/40 place-items-center p-4 rounded-lg text-xs row-span-3 col-span-1">
              <div className="flex items-center justify-between w-full">
                <h3 className="font-bold">Total Assignments</h3>
                <p>{settings["stats-total"]}</p>
              </div>

              <br />
              <div className="flex items-center justify-between w-full">
                <h3 className="font-bold">Canvas</h3>
              </div>
              <div className="flex items-center justify-between w-full">
                <h3 className="font-normal">Assignments</h3>
                <p>{settings["stats-assignments"]}</p>
              </div>
              <div className="flex items-center justify-between w-full">
                <h3 className="font-normal">Quizzes</h3>
                <p>{settings["stats-quizzes"]}</p>
              </div>
              <div className="flex items-center justify-between w-full">
                <h3 className="font-normal">Discussions</h3>
                <p>{settings["stats-discussions"]}</p>
              </div>
              <div className="flex items-center justify-between w-full">
                <h3 className="font-normal">Other</h3>
                <p>{settings["stats-other"]}</p>
              </div>

              <br />
              <div className="flex items-center justify-between w-full">
                <h3 className="font-bold">Integrations</h3>
              </div>
              <div className="flex items-center justify-between w-full">
                <h3 className="font-normal">Gradescope</h3>
                <p>{settings["stats-gradescope"]}</p>
              </div>
              <div className="flex items-center justify-between w-full">
                <h3 className="font-normal">Google Classroom</h3>
                <p>{settings["stats-classroom"]}</p>
              </div>

              <br />
              <div className="flex items-center justify-between w-full">
                <h3 className="font-bold">Other</h3>
              </div>
              <div className="flex items-center justify-between w-full">
                <h3 className="font-normal">Version</h3>
                <p>{chrome.runtime.getManifest().version}</p>
              </div>
            </div>

            <br />
            <div className="w-full flex justify-between items-center">
              <button
                onClick={() => setShowStats(false)}
                className="text-left px-2 py-1 cursor-pointer bg-[#bf5700] rounded-full hover:shadow-lg hover:shadow-white/25 shadow-none transition-shadow ease-in-out"
              >
                Back
              </button>
              <button
                id="resetstats"
                onClick={() => {
                  const handleResetStats = () => {
                    if (!resetConfirm) {
                      setResetConfirm(true);
                      setTimeout(() => setResetConfirm(false), 3000);
                      return;
                    }

                    setSettings((prevSettings) => ({
                      ...prevSettings,
                      "stats-assignments": 0,
                      "stats-classroom": 0,
                      "stats-discussions": 0,
                      "stats-gradescope": 0,
                      "stats-other": 0,
                      "stats-quizzes": 0,
                      "stats-total": 0,
                    }));

                    setResetConfirm(false);
                  };

                  <button
                    id="resetstats"
                    onClick={handleResetStats}
                    className="text-right px-2 py-1 cursor-pointer bg-[#bf0000] rounded-full hover:shadow-lg hover:shadow-white/25 shadow-none transition-shadow ease-in-out"
                  >
                    {resetConfirm ? "Are you sure?" : "Reset Stats"}
                  </button>;
                }}
                className="text-right px-2 py-1 bg-[#bf0000] rounded-full hover:shadow-lg hover:shadow-white/25 shadow-none transition-shadow ease-in-out"
              >
                Reset Stats
              </button>
            </div>
          </main>
        </div>
      )}

      {showExtensions && (
        <div
          className="absolute"
          style={{
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <main
            style={{ zIndex: 3 }}
            id="extensions"
            className="w-[30rem] bg-gradient-to-br from-slate-900 to-slate-950 text-white p-6 items-center justify-center"
          >
            <div className="flex justify-between">
              <div className="space-y-1 flex flex-col w-3/4">
                <h1 className="text-4xl font-black">
                  More <span className="text-[#BF5700]">Extensions</span>
                </h1>
                <p className="opacity-75">Check out my other extensions!</p>
                <br />
              </div>
            </div>

            <div className="bg-black/40 place-items-center p-4 rounded-lg text-xs row-span-4 col-span-1">
              <div className="size-full flex items-center">
                <h2 className="text-left font-extrabold text-lg">Pet Bevo</h2>
              </div>
              <p className="opacity-75 text-left w-full">
                Let Bevo roam & jump around any website of your choice!
              </p>
              <br />
              <button className="px-2 py-1.5 bg-[rgb(203,115,43)] bg-opacity-0.25 rounded-full hover:shadow-lg hover:shadow-white/25 shadow-none transition-shadow ease-in-out">
                COMING SOON
              </button>
            </div>
            <br />
            <div className="bg-black/40 place-items-center p-4 rounded-lg text-xs row-span-4 col-span-1">
              <div className="size-full flex items-center">
                <h2 className="text-left font-extrabold text-lg">
                  Canvas Strikethrough
                </h2>
              </div>
              <p className="opacity-75 text-left w-full">
                Adds a strikethrough option on answers on Canvas quizzes
              </p>

              <br />
              <a
                href="https://chromewebstore.google.com/detail/canvas-quiz-strikethrough/fcjcfgejljnocnojlhemagncjnofdjnj"
                target="_blank"
              >
                <button className="px-2 py-1.5 bg-[#4287f5] bg-opacity-0.25 rounded-full hover:shadow-lg hover:shadow-white/25 shadow-none transition-shadow ease-in-out">
                  Store Link
                </button>
              </a>
            </div>

            <br />
            <button
              onClick={() => setShowExtensions(false)}
              className="px-2 py-1.5 cursor-pointer bg-[#bf5700] rounded-full hover:shadow-lg hover:shadow-white/25 shadow-none transition-shadow ease-in-out"
            >
              Back
            </button>
          </main>
        </div>
      )}
    </div>
  );
}
