import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Star,
  Sparkles,
  Gift,
  RotateCcw,
  Share2,
  Volume2,
  VolumeX,
  Code,
  Heart,
  Github,
  Facebook,
} from "lucide-react";
import styles from "./NewYearCard.module.css";

const NewYearCard = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [shareSupported, setShareSupported] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedWishes, setSelectedWishes] = useState<string[]>([]);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [hasGeneratedWishes, setHasGeneratedWishes] = useState(false);

  const allWishes = [
    "ขอให้มีความสุขตลอดปี 2025",
    "สุขภาพแข็งแรง ร่ำรวยเงินทอง",
    "ประสบความสำเร็จในทุกด้าน",
    "พบเจอแต่สิ่งดีๆ ตลอดปีใหม่",
    "ขอให้โชคดีตลอดปี 2025",
    "มีความก้าวหน้าในหน้าที่การงาน",
    "ครอบครัวอบอุ่น มีความสุข",
    "สมหวังในทุกสิ่งที่ปรารถนา",
    "ขอให้มีแต่เรื่องดีๆ เข้ามา",
    "มีกำลังใจที่เข้มแข็งตลอดไป",
    "เจริญรุ่งเรืองในทุกๆ ด้าน",
    "มีความรักที่สดใสและอบอุ่น",
    "ขอให้พบเจอโอกาสดีๆ",
    "มีสติปัญญาที่เฉียบแหลม",
    "ทำการใดขอให้สำเร็จสมใจ",
  ];

  const getRandomWishes = useCallback(() => {
    const availableWishes = [...allWishes];
    const selectedWishes: string[] = [];

    while (selectedWishes.length < 4) {
      const randomIndex = Math.floor(Math.random() * availableWishes.length);
      selectedWishes.push(availableWishes[randomIndex]);
      availableWishes.splice(randomIndex, 1);
    }

    return selectedWishes;
  }, [allWishes]);

  useEffect(() => {
    if (typeof navigator !== "undefined" && "share" in navigator) {
      setShareSupported(true);
    }

    if (isOpen && !hasGeneratedWishes) {
      const timer = setTimeout(() => {
        setSelectedWishes(getRandomWishes());
        setShowMessage(true);
        setHasGeneratedWishes(true);

        // แก้ไขการเล่นเพลง
        if (audioRef.current) {
          // พยายามเล่นเพลงและจัดการกับ error
          const playPromise = audioRef.current.play();
          if (playPromise !== undefined) {
            playPromise
              .then(() => {
                console.log("Audio playing successfully");
              })
              .catch((error) => {
                console.log("Audio play failed:", error);
                // ถ้าเล่นไม่ได้ ลองเล่นอีกครั้งเมื่อผู้ใช้มีปฏิสัมพันธ์
                const handleUserInteraction = () => {
                  audioRef.current?.play();
                  document.removeEventListener("click", handleUserInteraction);
                };
                document.addEventListener("click", handleUserInteraction);
              });
          }
        }
      }, 1000);
      return () => clearTimeout(timer);
    } else if (!isOpen) {
      setShowMessage(false);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    }
  }, [isOpen, getRandomWishes, hasGeneratedWishes]);

  const toggleSound = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(console.log);
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setShowMessage(false);
  };

  const handleShare = async () => {
    try {
      if (typeof navigator !== "undefined" && "share" in navigator) {
        await navigator.share({
          title: "การ์ดอวยพรปีใหม่ 2025",
          text: "ส่งความสุขและคำอวยพรปีใหม่ 2025 ให้คุณ 🎊✨",
          url: window.location.href,
        });
      }
    } catch (error) {
      console.log("Error sharing:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-600 to-blue-500 p-4">
      <div
        className={`${
          styles.card_inner
        } relative w-96 bg-white rounded-xl shadow-2xl transform transition-all duration-700
         ${isOpen ? "scale-100" : "scale-90 hover:scale-95"} mb-4`}
      >
        {/* Audio Element */}
        <audio
          ref={audioRef}
          src="/happy-new-year.mp3"
          loop
          preload="auto"
          playsInline
          muted={false}
          crossOrigin="anonymous"
        />

        {/* Sound Control Button */}
        {/* <button
          onClick={toggleSound}
          className="fixed top-4 right-4 z-50 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
          aria-label={isPlaying ? "ปิดเสียง" : "เปิดเสียง"}
        >
          {isPlaying ? (
            <Volume2 className="w-6 h-6 text-white" />
          ) : (
            <VolumeX className="w-6 h-6 text-white" />
          )}
        </button> */}

        {/* Card Front */}
        <div
          className={`${
            styles.card_front
          } absolute w-full h-full bg-gradient-to-br from-red-500 to-pink-500 rounded-xl p-8
           transform origin-left transition-all duration-700 flex flex-col items-center justify-center
           ${isOpen ? styles.rotate_y_180 : ""}`}
          onClick={() => !isOpen && setIsOpen(true)}
        >
          <Star className="w-16 h-16 text-yellow-300 animate-pulse" />
          <h1 className="text-3xl font-bold text-white mt-4 text-center">
            Happy New Year 2025
          </h1>
          <p className="text-white mt-2 text-center">⭐ แตะเพื่อเปิดการ์ด ⭐</p>
        </div>

        {/* Card Inside */}
        <div className="p-8">
          <div
            className={`transform transition-all duration-1000 ${
              showMessage
                ? "translate-y-0 opacity-100"
                : "translate-y-10 opacity-0"
            }`}
          >
            <div className="flex justify-between items-center mb-6">
              <Sparkles
                className={`w-12 h-12 text-yellow-500 ${styles.animate_spin_slow}`}
              />
              <div className="flex gap-2">
                {shareSupported && (
                  <button
                    onClick={handleShare}
                    className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                    aria-label="แชร์การ์ด"
                  >
                    <Share2 className="w-6 h-6 text-gray-600" />
                  </button>
                )}
                <button
                  onClick={handleClose}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                  aria-label="ปิดการ์ด"
                >
                  <RotateCcw className="w-6 h-6 text-gray-600" />
                </button>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
              สวัสดีปีใหม่ 2025 🎊
            </h2>
            <div className="space-y-4">
              {selectedWishes.map((wish, index) => (
                <div
                  key={index}
                  className={`flex items-center space-x-2 ${styles.animate_fade_in}`}
                  style={{ animationDelay: `${index * 0.3}s` }}
                >
                  <Gift className="w-5 h-5 text-red-500 flex-shrink-0" />
                  <p className="text-gray-700">{wish}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer Information */}
      <div className="flex items-center justify-center space-x-6 mt-4 text-white/80">
        <div className="flex items-center space-x-1">
          <Star className="w-4 h-4 text-yellow-300" />
          <span className="text-sm">New Year Card 2025</span>
        </div>
        <div className="flex items-center space-x-1">
          <Heart className="w-4 h-4 text-red-400" />
          <span className="text-sm">Created by Khajornsak Chaipha</span>
        </div>
        <div className="flex items-center space-x-4">
          <a
            href="https://github.com/Khajornssc/new-year-card"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1 hover:text-white transition-colors"
          >
            <Github className="w-4 h-4" />
            <span className="text-sm">GitHub</span>
          </a>
          <a
            href="https://www.facebook.com/wartdiy"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1 hover:text-blue-400 transition-colors"
          >
            <Facebook className="w-4 h-4" />
            <span className="text-sm">Facebook</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default NewYearCard;
