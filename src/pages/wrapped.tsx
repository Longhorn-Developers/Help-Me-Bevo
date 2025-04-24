import "../global.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

("use client");

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Volume2,
  VolumeOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { get } from "@/lib/storage";
import Aurora from "@/components/Aurora";

type Slide = {
  id: number;
  videoSrc: string;
  text?: string;
  subtitle?: string;
  textAnimation: "fadeIn" | "slideUp" | "zoomIn";
  audioStartTime: number;
};

function Wrapped() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const currentSlideRef = useRef<number>(currentSlide);
  useEffect(() => {
    currentSlideRef.current = currentSlide;
  }, [currentSlide]);

  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [_audioTime, setAudioTime] = useState(0);
  const [_audioDuration, setAudioDuration] = useState(0);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([null, null, null]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [slides, setSlides] = useState<Slide[]>([
    {
      id: 1,
      videoSrc: "/wrapped/Intro.mp4",
      textAnimation: "fadeIn",
      audioStartTime: 0,
    },
    {
      id: 2,
      videoSrc: "/wrapped/DiamondBlack.mp4",
      textAnimation: "slideUp",
      audioStartTime: 15,
    },
    {
      id: 3,
      videoSrc: "/wrapped/DiamondOrange.mp4",
      textAnimation: "slideUp",
      audioStartTime: 23,
    },
  ]);

  useEffect(() => {
    const loadStats = async () => {
      const personalStats = (await get("personalStats")) as any;
      const semester = personalStats.SPRING_2025;

      // get busiest day
      const busiestDay = semester.busiestDay;
      const busiestDayEntries = Object.entries(busiestDay) as [
        string,
        number
      ][];
      const [busiestDayKey] = busiestDayEntries.reduce((prev, curr) =>
        curr[1] > prev[1] ? curr : prev
      );
      const dayNames = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ];
      const busiestDayIndex = parseInt(busiestDayKey, 10);
      const busiestDayName = dayNames[busiestDayIndex] ?? busiestDayKey;

      // get busiest hour
      const busiestHour = semester.busiestHour;
      const busiestHourEntries = Object.entries(busiestHour) as [
        string,
        number
      ][];
      const [busiestHourKey] = busiestHourEntries.reduce((prev, curr) =>
        curr[1] > prev[1] ? curr : prev
      );
      const hourNum = parseInt(busiestHourKey, 10);
      const period = hourNum >= 12 ? "PM" : "AM";
      const hour12 = hourNum % 12 === 0 ? 12 : hourNum % 12;
      const busiestHourLabel = `${hour12} ${period}`;

      setSlides((prev) => {
        const updated = [...prev];
        updated[1] = {
          ...updated[1],
          text: `Every day was a fight this semester. You submitted the most assignments on <b>${busiestDayName}!</b>`,
        };
        updated[2] = {
          ...updated[2],
          text: `Most of your assignments were submitted within the hour of <b>${busiestHourLabel}!</b>`,
        };
        return updated;
      });
    };
    loadStats();
  }, []);

  const audioSrc = "/wrapped/Song.mp3";

  // Animation variants
  const textAnimations = {
    fadeIn: {
      initial: { opacity: 0 },
      animate: { opacity: 1, transition: { duration: 1 } },
    },
    slideUp: {
      initial: { opacity: 0, y: 50 },
      animate: { opacity: 1, y: 0, transition: { duration: 0.8 } },
    },
    zoomIn: {
      initial: { opacity: 0, scale: 0.8 },
      animate: { opacity: 1, scale: 1, transition: { duration: 0.7 } },
    },
  };

  // Subtitle animation variants - always fade in but with delay
  const subtitleAnimation = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.8, delay: 0.7 } }, // Delay after main text
  };

  // Reset audio to the current slide's start time
  const resetAudioToSlideStart = () => {
    if (audioRef.current && isPlaying) {
      audioRef.current.currentTime = slides[currentSlide].audioStartTime;
      audioRef.current
        .play()
        .catch((e) => console.error("Audio play error:", e));
    }
  };

  // Handle slide navigation
  const goToSlide = (index: number) => {
    if (index >= 0 && index < slides.length) {
      setCurrentSlide(index);

      // Reset all videos
      videoRefs.current.forEach((video, i) => {
        if (video) {
          video.currentTime = 0;
          if (i === index) {
            video.play().catch((e) => console.error("Video play error:", e));
          } else {
            video.pause();
          }
        }
      });

      // Set audio to the appropriate time for this slide and autoplay
      if (audioRef.current) {
        audioRef.current.currentTime = slides[index].audioStartTime;
        audioRef.current
          .play()
          .catch((e) => console.error("Audio play error:", e));
        setIsPlaying(true);
      }
    }
  };

  const nextSlide = () => goToSlide(currentSlideRef.current + 1);
  const prevSlide = () => goToSlide(currentSlideRef.current - 1);

  // Toggle play/pause for both video and audio
  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);

    const currentVideo = videoRefs.current[currentSlide];
    if (currentVideo) {
      if (isPlaying) {
        currentVideo.pause();
      } else {
        currentVideo.play().catch((e) => console.error("Video play error:", e));
      }
    }

    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current
          .play()
          .catch((e) => console.error("Audio play error:", e));
      }
    }
  };

  // Update audio time
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setAudioTime(audioRef.current.currentTime);
    }
  };

  // Toggle mute/unmute
  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
    }
  };

  // Initialize when component mounts
  useEffect(() => {
    // Initialize the first slide with autoplay
    const initializeAudio = async () => {
      if (audioRef.current) {
        try {
          audioRef.current.currentTime = slides[0].audioStartTime;
          await audioRef.current.play();
          setIsPlaying(true);
        } catch (e) {
          console.error("Audio autoplay error:", e);
          setIsPlaying(false);
        }
      }
    };

    goToSlide(0);
    initializeAudio();

    // Set up audio duration
    if (audioRef.current) {
      audioRef.current.onloadedmetadata = () => {
        if (audioRef.current) {
          setAudioDuration(audioRef.current.duration);
        }
      };
    }

    // Add keyboard event listener
    window.addEventListener("keydown", handleKeyDown);

    // Cleanup
    return () => {
      videoRefs.current.forEach((video) => {
        if (video) video.pause();
      });
      if (audioRef.current) audioRef.current.pause();
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Update event listeners when currentSlide changes
  useEffect(() => {
    const currentVideo = videoRefs.current[currentSlide];
    if (currentVideo) {
      // Add loop event listener to current video
      currentVideo.addEventListener("timeupdate", () => {
        // Check if the video is about to loop (within 0.1 seconds of its duration)
        if (currentVideo.currentTime > currentVideo.duration - 0.1) {
          resetAudioToSlideStart();
        }
      });
    }

    return () => {
      // Clean up event listener when slide changes
      if (currentVideo) {
        currentVideo.removeEventListener("timeupdate", () => {});
      }
    };
  }, [currentSlide]);

  // Handle keyboard events
  const handleKeyDown = (event: KeyboardEvent) => {
    console.log(event);
    if (
      event.code === "Space" ||
      event.key === " " ||
      event.key === "Spacebar"
    ) {
      event.preventDefault(); // Prevent page scrolling
      // Toggle audio playback
      if (audioRef.current) {
        if (audioRef.current.paused) {
          audioRef.current
            .play()
            .catch((e) => console.error("Audio play error:", e));
          setIsPlaying(true);
        } else {
          audioRef.current.pause();
          setIsPlaying(false);
        }
      }
      // Toggle video playback for current slide
      const currentVideo = videoRefs.current[currentSlide];
      if (currentVideo) {
        if (currentVideo.paused) {
          currentVideo
            .play()
            .catch((e) => console.error("Video play error:", e));
        } else {
          currentVideo.pause();
        }
      }
    }
    // Left arrow for previous slide
    else if (event.code === "ArrowLeft") {
      prevSlide();
    }
    // Right arrow for next slide
    else if (event.code === "ArrowRight") {
      nextSlide();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black p-4">
      {/* Hidden audio element */}

      <Aurora
        colorStops={["#BF5700", "#5B2F0B", "#5E3F1C"]}
        blend={0.5}
        amplitude={1.0}
        speed={0.5}
      />

      <audio
        ref={audioRef}
        src={audioSrc}
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => setIsPlaying(false)}
        className="hidden"
      />

      <div
        ref={containerRef}
        className="relative w-full max-w-sm mx-auto overflow-hidden rounded-lg aspect-[9/16] bg-black filter drop-shadow-[0_0_20px_rgba(0,0,0,0.85)]"
      >
        {/* Videos */}
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={cn(
              "absolute inset-0 w-full h-full transition-opacity duration-300 flex items-center justify-center ",
              currentSlide === index ? "opacity-100 z-10" : "opacity-0 z-0"
            )}
          >
            <video
              ref={(el) => {
                videoRefs.current[index] = el;
              }}
              src={slide.videoSrc}
              className="object-cover w-full h-full"
              muted
              playsInline
              onEnded={() => {
                const video = videoRefs.current[index];
                if (video) {
                  video.currentTime = 0;
                  video
                    .play()
                    .catch((e) => console.error("Video replay error:", e));
                }
                if (isPlaying) {
                  resetAudioToSlideStart();
                }
              }}
            />

            {/* Text Overlay - Centered vertically and horizontally */}
            {currentSlide === index && (
              <AnimatePresence>
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-white text-center">
                  {/* Main Text */}
                  <motion.h2
                    className="text-2xl font-medium drop-shadow-lg mb-3"
                    initial={
                      textAnimations[
                        slide.textAnimation as keyof typeof textAnimations
                      ].initial
                    }
                    animate={
                      textAnimations[
                        slide.textAnimation as keyof typeof textAnimations
                      ].animate
                    }
                    key={`text-${slide.id}`}
                    dangerouslySetInnerHTML={{ __html: slide.text || "" }}
                  />

                  {slide.subtitle && (
                    <motion.p
                      className="text-base font-medium text-white/90 max-w-xs drop-shadow-lg"
                      initial={subtitleAnimation.initial}
                      animate={subtitleAnimation.animate}
                      key={`subtitle-${slide.id}`}
                      dangerouslySetInnerHTML={{ __html: slide.subtitle || "" }}
                    />
                  )}
                </div>
              </AnimatePresence>
            )}
          </div>
        ))}

        {/* Play/Pause Button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute bottom-4 right-4 h-10 w-10 rounded-full bg-black/50 text-white hover:bg-black/70 z-30"
          onClick={togglePlayPause}
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? (
            <Pause className="h-5 w-5" />
          ) : (
            <Play className="h-5 w-5" />
          )}
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="absolute bottom-4 right-16 h-10 w-10 rounded-full bg-black/50 text-white hover:bg-black/70 z-30"
          onClick={toggleMute}
          aria-label={isPlaying ? "Mute" : "Unmute"}
        >
          {isMuted ? (
            <VolumeOff className="h-5 w-5" />
          ) : (
            <Volume2 className="h-5 w-5" />
          )}
        </Button>

        {/* Navigation Controls */}
        <div className="absolute inset-y-0 left-2 flex items-center z-20">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full bg-black/30 text-white hover:bg-black/50"
            onClick={prevSlide}
            disabled={currentSlide === 0}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
        </div>

        <div className="absolute inset-y-0 right-2 flex items-center z-20">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full bg-black/30 text-white hover:bg-black/50"
            onClick={nextSlide}
            disabled={currentSlide === slides.length - 1}
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </div>

        {/* Progress Indicators */}
        <div className="absolute top-4 inset-x-4 flex gap-1 z-20">
          {slides.map((_, index) => (
            <div
              key={index}
              className={cn(
                "h-1 flex-1 rounded-full transition-all duration-300",
                currentSlide === index
                  ? "bg-white"
                  : currentSlide > index
                  ? "bg-white/70"
                  : "bg-white/30"
              )}
              onClick={() => goToSlide(index)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Wrapped />
  </StrictMode>
);
