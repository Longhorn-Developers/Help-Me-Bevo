import "../global.css";
import Bevo from "../../public/images/Bevo.png";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "../global.css";

function Landing() {
  return (
    <div style={{ fontFamily: "'Poppins', sans-serif", background: "black" }}>
      <main className="h-screen w-screen flex flex-col items-center bg-gradient-to-br from-orange-500/20 to-black text-white p-6">
        <img className="mt-[7vh] max-w-[24rem] shadow-2xl" src={Bevo} />

        <h1 className="text-center font-light text-[1.5rem] pt-[5vh] shadow-2xl">
          Thanks for downloading
        </h1>
        <b className="text-center text-[3.2rem] leading-[2.8rem] text-[#BF5700] shadow-2xl">
          Help Me Bevo!
        </b>

        <div className="space-y-6 pt-[70px] w-[90%] text-center flex flex-col justify-center items-center">
          <h3 className="font-extralight text-center text-lg">
            It's about time you reward yourself for submitting assignments, and
            it starts with seeing Bevo.
          </h3>
          <h3 className="font-extralight text-center text-lg">
            <span className="font-bold">NOTE: </span>Canvas quizzes are{" "}
            <span className="font-bold"> OFF</span> by default, just in case
            you're taking an exam haha. You can toggle it back on, along with
            other settings, in the extension menu in the top right.
          </h3>
        </div>

        <h3 className="fixed bottom-[60px] text-center text-base">
          DM me on IG:{" "}
          <a
            className="text-blue-500"
            href="https://www.instagram.com/aidenn.johnson/"
            target="_blank"
          >
            @aidenn.johnson
          </a>{" "}
          for any suggestions or concerns!
        </h3>
        <h3 className="fixed bottom-[20px] text-center font-bold text-lg">
          Enjoy!
          <span className="text-xs font-light pl-1">
            and remember OU sucks (34-3)
          </span>
        </h3>
      </main>
    </div>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Landing />
  </StrictMode>
);
