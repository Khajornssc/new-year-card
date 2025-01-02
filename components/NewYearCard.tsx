import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Star,
  Sparkles,
  Gift,
  RotateCcw,
  Share2,
  Github,
  Heart,
  Facebook,
  Eye,
  Snowflake,
  Music,
  Music2,
  Sparkle,
  PartyPopper,
} from "lucide-react";
import { database } from "./firebase";
import { ref, onValue, get, set } from "firebase/database";
import Confetti from "./Confetti";
import InteractiveBackground from "./InteractiveBackground";
import styles from "./NewYearCard.module.css";
// Constants
const WISHES_LIST = [
  // คำอวยพรทั่วไป
  "ขอให้มีความสุขตลอดปี 2025",
  "สุขภาพแข็งแรง ร่ำรวยเงินทอง",
  "ประสบความสำเร็จในทุกด้าน",
  "พบเจอแต่สิ่งดีๆ ตลอดปีใหม่",
  "ขอให้โชคดีตลอดปี 2025",

  // การงาน
  "มีความก้าวหน้าในหน้าที่การงาน",
  "งานราบรื่น เงินทองไหลมาเทมา",
  "เจริญก้าวหน้าในอาชีพการงาน",
  "มีโอกาสดีๆ ในการทำงาน",
  "ประสบความสำเร็จในธุรกิจการงาน",

  // ครอบครัว
  "ครอบครัวอบอุ่น มีความสุข",
  "ขอให้ครอบครัวมีแต่ความสุข",
  "มีความรักที่อบอุ่นและมั่นคง",
  "ครอบครัวสุขสันต์ อยู่เย็นเป็นสุข",
  "มีความสุขกับคนที่คุณรัก",

  // โชคลาภ
  "โชคดีมีชัย รวยเงินรวยทอง",
  "เฮงๆ รวยๆ ตลอดปี 2025",
  "มีโชคลาภ เงินทองไหลมาเทมา",
  "ขอให้ร่ำรวย มีเงินทองใช้ไม่ขาดมือ",
  "โชคดี มีชัย ร่ำรวยเงินทอง",

  // สุขภาพ
  "สุขภาพแข็งแรง ปราศจากโรคภัย",
  "ขอให้สุขภาพดี ไม่มีโรคภัยมาเบียดเบียน",
  "แข็งแรงทั้งกายและใจ",
  "มีสุขภาพที่ดีตลอดทั้งปี",
  "สุขภาพแข็งแรง อายุยืนยาว",

  // ความสำเร็จ
  "สมหวังในทุกสิ่งที่ปรารถนา",
  "ขอให้สมหวังในทุกการตัดสินใจ",
  "ประสบความสำเร็จในทุกเป้าหมาย",
  "ทำอะไรก็สำเร็จสมความปรารถนา",
  "บรรลุเป้าหมายในทุกด้าน",

  // จิตใจและความสุข
  "มีความสุขกาย สบายใจ",
  "จิตใจสงบ มีความสุขตลอดปี",
  "มีรอยยิ้มและเสียงหัวเราะเสมอ",
  "มีความสุขในทุกๆ วัน",
  "จิตใจแจ่มใส มีความสุขตลอดไป",

  // การเรียน
  "เรียนเก่ง ประสบความสำเร็จ",
  "มีสติปัญญาที่เฉียบแหลม",
  "การเรียนก้าวหน้า สมหวังดังตั้งใจ",
  "เรียนจบตามที่ตั้งใจ",
  "ขอให้เรียนสำเร็จดังที่ตั้งใจ",

  // ความก้าวหน้า
  "ก้าวหน้าในทุกด้านของชีวิต",
  "พัฒนาตนเองอย่างต่อเนื่อง",
  "ประสบความสำเร็จในทุกก้าวย่าง",
  "มีความก้าวหน้าในทุกมิติของชีวิต",
  "เจริญรุ่งเรืองในทุกๆ ด้าน",

  // พลังใจ
  "มีกำลังใจที่เข้มแข็งตลอดไป",
  "มีพลังใจที่เข้มแข็งในการต่อสู้กับทุกอุปสรรค",
  "มีกำลังใจที่ดีในการทำทุกสิ่ง",
  "จิตใจเข้มแข็ง พร้อมรับมือทุกสถานการณ์",
  "มีพลังใจที่เข้มแข็งตลอดไป",
] as const;

interface Snowflake {
  id: number;
  left: number;
  duration: number;
  delay: number;
}
const NewYearCard = () => {
  // State
  const [isOpen, setIsOpen] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [shareSupported, setShareSupported] = useState(false);
  const [selectedWishes, setSelectedWishes] = useState<string[]>([]);
  const [hasGeneratedWishes, setHasGeneratedWishes] = useState(false);
  const [viewCount, setViewCount] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [snowflakes, setSnowflakes] = useState<Snowflake[]>([]);

  // Functions
  const getRandomWishes = useCallback(() => {
    const availableWishes = [...WISHES_LIST];
    const selected: string[] = [];
    while (selected.length < 4) {
      const randomIndex = Math.floor(Math.random() * availableWishes.length);
      selected.push(availableWishes[randomIndex]);
      availableWishes.splice(randomIndex, 1);
    }
    return selected;
  }, []);

  const updateViewCount = useCallback(async () => {
    try {
      const viewsRef = ref(database, "cardViews");
      const snapshot = await get(viewsRef);
      const currentViews = snapshot.exists() ? snapshot.val() : 0;
      await set(viewsRef, currentViews + 1);
    } catch (error) {
      console.error("Error updating view count:", error);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    setShowMessage(false);
    setHasGeneratedWishes(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: "การ์ดอวยพรปีใหม่ 2025",
        text: "ส่งความสุขและคำอวยพรปีใหม่ 2025 ให้คุณ 🎊✨",
        url: window.location.href,
      });
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  const toggleAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Effects
  useEffect(() => {
    setShareSupported("share" in navigator);
  }, []);

  useEffect(() => {
    if (isOpen && !sessionStorage.getItem("viewUpdated")) {
      updateViewCount().then(() => {
        sessionStorage.setItem("viewUpdated", "true");
      });
    }
  }, [isOpen, updateViewCount]);

  useEffect(() => {
    const viewsRef = ref(database, "cardViews");
    const unsubscribe = onValue(viewsRef, (snapshot) => {
      setViewCount(snapshot.exists() ? snapshot.val() : 0);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (isOpen && !hasGeneratedWishes) {
      const timer = setTimeout(() => {
        setSelectedWishes(getRandomWishes());
        setShowMessage(true);
        setHasGeneratedWishes(true);
        setShowConfetti(true);

        // ซ่อน confetti หลัง 5 วินาที
        setTimeout(() => setShowConfetti(false), 5000);

        audioRef.current?.play().catch(() => {
          document.addEventListener("click", () => audioRef.current?.play(), {
            once: true,
          });
        });
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, hasGeneratedWishes, getRandomWishes]);
  // snowflakes ใน useEffect
  useEffect(() => {
    const flakes: Snowflake[] = [...Array(20)].map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      duration: Math.random() * 3 + 2,
      delay: Math.random() * 3
    }));
    setSnowflakes(flakes);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-800 via-blue-600 to-purple-800 p-4 relative overflow-hidden">
      {/* Aurora Background */}
      <div className={styles.aurora_bg} />
      {/* Interactive Background */}
      <InteractiveBackground />
      {/* Snow Effect */}
      <div className="absolute inset-0 pointer-events-none">
        {snowflakes.map((flake) => (
          <Snowflake
            key={flake.id}
            className={`absolute text-white/30 ${styles.snowflake}`}
            style={{
              left: `${flake.left}%`,
              animationDuration: `${flake.duration}s`,
              animationDelay: `${flake.delay}s`,
            }}
          />
        ))}
      </div>
      {/* Confetti Effect */}
      <Confetti isActive={showConfetti} />

      {/* Main Card */}
      <div
        className={`${styles.card_inner} 
        relative w-full max-w-[90vw] md:max-w-md bg-white/95 
        backdrop-blur-sm rounded-xl shadow-2xl 
        transform transition-all duration-700
        ${isOpen ? "scale-100" : "scale-90 hover:scale-95"} 
        mb-4 ${styles.glow_border}`}
      >
        {/* Audio Controls */}
        <button
          onClick={toggleAudio}
          className="absolute top-2 right-2 sm:top-4 sm:right-4 z-10 p-2 
            rounded-full bg-white/80 hover:bg-white transition-colors"
          aria-label={isPlaying ? "Pause Music" : "Play Music"}
        >
          {isPlaying ? (
            <Music2 className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
          ) : (
            <Music className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
          )}
        </button>

        <audio
          ref={audioRef}
          src="/happy-new-year.mp3"
          loop
          preload="auto"
          playsInline
        />

        {/* Card Front */}
        <div
          className={`${styles.card_front} 
          absolute w-full h-full bg-gradient-to-br 
          from-purple-600 via-pink-500 to-orange-500 
          rounded-xl p-4 sm:p-8
          transform origin-left transition-all duration-700 
          ${isOpen ? styles.rotate_y_180 : ""}`}
          onClick={() => !isOpen && setIsOpen(true)}
        >
          <div className="relative h-full flex flex-col items-center justify-center">
            <div className="absolute inset-0 flex items-center justify-center opacity-20">
              <div className="w-48 h-48 sm:w-64 sm:h-64 rounded-full bg-white blur-2xl"></div>
            </div>

            <Star
              className={`w-16 h-16 sm:w-20 sm:h-20 text-yellow-300 ${styles.float}`}
            />

            <h1
              className={`text-3xl sm:text-4xl font-bold text-white mt-4 sm:mt-6 
              text-center tracking-wider ${styles.glow_text}`}
            >
              Happy New Year
              <br />
              <span className="text-yellow-300">2025</span>
            </h1>

            <p className="text-white/90 mt-3 sm:mt-4 text-center text-base sm:text-lg animate-pulse">
              ⭐ แตะเพื่อเปิดการ์ด ⭐
            </p>
          </div>
        </div>

        {/* Card Inside */}
        <div className="p-4 sm:p-8">
          <div
            className={`transform transition-all duration-1000 
            ${
              showMessage
                ? "translate-y-0 opacity-100"
                : "translate-y-10 opacity-0"
            }`}
          >
            <div className="flex justify-between items-center mb-4 sm:mb-6">
              <div className="relative">
                <Sparkles
                  className={`w-10 h-10 sm:w-12 sm:h-12 
                  text-yellow-500 ${styles.animate_spin_slow}`}
                />
                <div className="absolute inset-0 bg-yellow-300/30 blur-xl rounded-full"></div>
              </div>

              <div className="flex gap-2">
                {shareSupported && (
                  <button
                    onClick={handleShare}
                    className="p-2 rounded-full hover:bg-purple-100 transition-colors"
                    aria-label="แชร์การ์ด"
                  >
                    <Share2 className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
                  </button>
                )}
                <button
                  onClick={handleClose}
                  className="p-2 rounded-full hover:bg-purple-100 transition-colors"
                  aria-label="ปิดการ์ด"
                >
                  <RotateCcw className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
                </button>
              </div>
            </div>

            <h2
              className={`text-2xl sm:text-3xl font-bold text-center 
              text-purple-800 mb-6 sm:mb-8 ${styles.glow_text}`}
            >
              สวัสดีปีใหม่ 2025
              <span className="inline-block ml-2">
                <PartyPopper className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-500" />
              </span>
            </h2>

            <div className="space-y-4 sm:space-y-6">
              {selectedWishes.map((wish, index) => (
                <div
                  key={index}
                  className={`flex items-center space-x-3 
                    bg-gradient-to-r from-purple-50 to-transparent 
                    p-3 sm:p-4 rounded-lg transform hover:scale-102 
                    transition-transform ${styles.animate_fade_in}`}
                  style={{ animationDelay: `${index * 0.3}s` }}
                >
                  <div className="relative">
                    <Gift className="w-5 h-5 sm:w-6 sm:h-6 text-pink-500 flex-shrink-0" />
                    <div className="absolute inset-0 bg-pink-300/30 blur-md rounded-full"></div>
                  </div>
                  <p className="text-gray-700 text-base sm:text-lg">{wish}</p>
                </div>
              ))}
            </div>

            {/* Decorative elements */}
            <div className="absolute bottom-2 right-2 sm:bottom-4 sm:right-4">
              <Sparkle
                className={`w-6 h-6 sm:w-8 sm:h-8 
                text-purple-400 ${styles.pulse_glow}`}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Footer Information */}
      <div
        className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 
        mt-4 sm:mt-6 text-white/90 backdrop-blur-sm bg-white/10 
        p-3 sm:p-4 rounded-xl text-sm sm:text-base"
      >
        <div className="flex items-center space-x-1 sm:space-x-2">
          <Star className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-300" />
          <span>New Year Card 2025</span>
        </div>

        <div className="flex items-center space-x-1 sm:space-x-2">
          <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-pink-400" />
          <span className="hidden sm:inline">Created by</span>
          <span>Khajornsak Chaipha</span>
        </div>

        <div className="flex items-center space-x-4 sm:space-x-6">
          <a
            href="https://github.com/Khajornssc/new-year-card"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1 sm:space-x-2 
              hover:text-yellow-300 transition-colors"
          >
            <Github className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>GitHub</span>
          </a>
          <a
            href="https://www.facebook.com/wartdiy"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1 sm:space-x-2 
              hover:text-blue-400 transition-colors"
          >
            <Facebook className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>Facebook</span>
          </a>
        </div>

        <div className="flex items-center space-x-1 sm:space-x-2">
          <Eye className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
          <span>
            {viewCount !== null && viewCount >= 0
              ? `${viewCount.toLocaleString()} views`
              : "Loading..."}
          </span>
        </div>
      </div>
    </div>
  );
};

export default NewYearCard;
