import "../global.css";
import LHD from "../../public/images/LHD.jpeg";
import script from "../scripts/script";
import { useEffect } from "react";

export default function Popup() {
  useEffect(() => {
    script();
  }, []);

  return (
    <div
      style={{ fontFamily: "'Poppins', sans-serif", background: "black" }}
      className="popper"
    >
      <main
        id="main"
        className="w-[31rem] flex flex-col bg-gradient-to-br from-orange-500/20 to-orange-500/5 text-white p-6 relative"
      >
        <div className="flex justify-between">
          <div className="space-y-1 flex flex-col w-3/4">
            <h1 className="text-4xl font-black">
              Help Me <span className="text-[#BF5700]">Bevo</span>
            </h1>
            <p className="opacity-75">
              Be more motivated to submit assignments with Bevo
            </p>
            <br />
          </div>

          {/* <!-- Enable/Disable --> */}
          <div className="flex items-center justify-center">
            <button
              id="toggle"
              className="vertical-center font-bold rounded-lg size-9 hover:shadow-lg hover:shadow-white/25 shadow-none transition-shadow ease-in-out"
            >
              ON
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
            <div className="size-full flex items-center">
              <label className="switch">
                <input id="assignments" type="checkbox" />
                <span className="toggleslider round"></span>
              </label>
              <h3 className="font-medium">Assignments</h3>
            </div>
            <div className="size-full flex items-center">
              <label className="switch">
                <input id="quizzes" type="checkbox" />
                <span className="toggleslider round"></span>
              </label>
              <h3 className="font-medium">Quizzes</h3>
            </div>
            <div className="size-full flex items-center">
              <label className="switch">
                <input id="discussions" type="checkbox" />
                <span className="toggleslider round"></span>
              </label>
              <h3 className="font-medium">Discussions</h3>
            </div>
            <div className="size-full flex items-center">
              <label className="switch">
                <input id="other" type="checkbox" />
                <span className="toggleslider round"></span>
              </label>
              <h3 className="font-medium">Other "Submit"</h3>
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
                <input id="classroom" type="checkbox" />
                <span className="toggleslider round"></span>
              </label>
              <h3 className="font-medium">Google Classroom</h3>
            </div>
            <div className="size-full flex items-center">
              <label className="switch">
                <input id="gradescope" type="checkbox" />
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
                Volume: 50%
              </h3>
              <div className="w-full" id="volumeDiv">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value="50"
                  className="accent-[#bf5700] w-full bg-[#bf5700]"
                  id="volumeSlider"
                />
              </div>
            </div>

            <div className="size-full flex items-center">
              <label className="switch">
                <input id="assignmentName" type="checkbox" />
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
                <input id="themedAnims" type="checkbox" />
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
                  className="text-[#bf5700] font-medium"
                  href="https://www.instagram.com/aidenn.johnson/"
                  target="_blank"
                >
                  @aidenn.johnson
                </a>
              </div>

              <div className="w-full">
                <div className="font-medium mb-0.5">Designed by:</div>
                <a
                  className="text-[#bf5700] font-medium"
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
                  id="statsbutton"
                  className="font-bold w-full px-2 py-1.5 bg-[#bf5700] rounded-full hover:shadow-lg hover:shadow-white/25 shadow-none transition-shadow ease-in-out"
                >
                  Stats
                </button>
                <button
                  id="extensionbutton"
                  className="font-bold col-span-2 px-2 py-1 bg-[#bf5700] rounded-full hover:shadow-lg hover:shadow-white/25 shadow-none transition-shadow ease-in-out"
                >
                  More Extensions
                </button>
              </div>
            </div>
          </div>

          <div className="row-span-2 flex items-center justify-center">
            <div className="flex h-full items-center justify-center text-center text-xs bg-black/40 p-2 rounded-lg w-full">
              <div
                className="text-center font-semibold text-[#bf5700] flex items-center justify-center"
                id="random-quote"
              >
                Hook 'Em!
              </div>
            </div>

            <a
              className="ml-2 w-[2.9rem] h-full"
              href="https://github.com/longhorn-Developers/"
              target="_blank"
            >
              <img className="rounded-md" src={LHD} alt="Icon" id="lhd" />
            </a>
          </div>
        </div>
      </main>

      <div
        className="pointer-events-none absolute"
        id="statsdiv"
        style={{ top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}
      >
        <main
          style={{ zIndex: 4 }}
          id="stats"
          className="w-[30rem] animate-out bg-gradient-to-br from-[#361b00] to-slate-950 text-white p-6 items-center justify-center"
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
              <p id="stats-total">N/A</p>
            </div>

            <br />
            <div className="flex items-center justify-between w-full">
              <h3 className="font-bold">Canvas</h3>
            </div>
            <div className="flex items-center justify-between w-full">
              <h3 className="font-normal">Assignments</h3>
              <p id="stats-assignments">N/A</p>
            </div>
            <div className="flex items-center justify-between w-full">
              <h3 className="font-normal">Quizzes</h3>
              <p id="stats-quizzes">N/A</p>
            </div>
            <div className="flex items-center justify-between w-full">
              <h3 className="font-normal">Discussions</h3>
              <p id="stats-discussions">N/A</p>
            </div>
            <div className="flex items-center justify-between w-full">
              <h3 className="font-normal">Other</h3>
              <p id="stats-other">N/A</p>
            </div>

            <br />
            <div className="flex items-center justify-between w-full">
              <h3 className="font-bold">Integrations</h3>
            </div>
            <div className="flex items-center justify-between w-full">
              <h3 className="font-normal">Gradescope</h3>
              <p id="stats-gradescope">N/A</p>
            </div>
            <div className="flex items-center justify-between w-full">
              <h3 className="font-normal">Google Classroom</h3>
              <p id="stats-classroom">N/A</p>
            </div>

            <br />
            <div className="flex items-center justify-between w-full">
              <h3 className="font-bold">Other</h3>
            </div>
            <div className="flex items-center justify-between w-full">
              <h3 className="font-normal">Version</h3>
              <p id="version">N/A</p>
            </div>
          </div>

          <br />
          <div className="w-full flex justify-between items-center">
            <button
              id="statsback"
              className="text-left px-2 py-1 bg-[#bf5700] rounded-full hover:shadow-lg hover:shadow-white/25 shadow-none transition-shadow ease-in-out"
            >
              Back
            </button>
            <button
              id="resetstats"
              className="text-right px-2 py-1 bg-[#bf0000] rounded-full hover:shadow-lg hover:shadow-white/25 shadow-none transition-shadow ease-in-out"
            >
              Reset Stats
            </button>
          </div>
        </main>
      </div>

      <div
        className="pointer-events-none absolute"
        id="extensionsdiv"
        style={{ top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}
      >
        <main
          style={{ zIndex: 3 }}
          id="extensions"
          className="w-[30rem] animate-out bg-gradient-to-br from-slate-900 to-slate-950 text-white p-6 items-center justify-center"
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
            id="extensionback"
            className="px-2 py-1.5 bg-[#bf5700] rounded-full hover:shadow-lg hover:shadow-white/25 shadow-none transition-shadow ease-in-out"
          >
            Back
          </button>
        </main>
      </div>
    </div>
  );
}
