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
} from "lucide-react";
import styles from "./NewYearCard.module.css";
import { database } from "./firebase";
import { ref, onValue, get, set } from "firebase/database";

const NewYearCard = () => {
  // State declarations
  const [isOpen, setIsOpen] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [shareSupported, setShareSupported] = useState(false);
  const [selectedWishes, setSelectedWishes] = useState<string[]>([]);
  const [hasGeneratedWishes, setHasGeneratedWishes] = useState(false);
  const [viewCount, setViewCount] = useState<number | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  // ย้าย getRandomWishes มาไว้ก่อนการใช้งาน
  const getRandomWishes = useCallback(() => {
    const availableWishes = [...WISHES_LIST];
    const selectedWishes: string[] = [];
    while (selectedWishes.length < 4) {
      const randomIndex = Math.floor(Math.random() * availableWishes.length);
      selectedWishes.push(availableWishes[randomIndex]);
      availableWishes.splice(randomIndex, 1);
    }
    return selectedWishes;
  }, []);
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
  // Firebase update function
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

  // Effects
  // แก้ไขใน useEffect
  useEffect(() => {
    if (typeof navigator !== "undefined" && "share" in navigator) {
      setShareSupported(true);
    } else {
      setShareSupported(false); // เพิ่มการใช้งาน setShareSupported
    }
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
    const unsubscribe = onValue(
      viewsRef,
      (snapshot) => {
        const views = snapshot.exists() ? snapshot.val() : 0;
        setViewCount(views);
      },
      (error) => {
        console.error("Error reading view count:", error);
      }
    );
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (isOpen && !hasGeneratedWishes) {
      const timer = setTimeout(() => {
        setSelectedWishes(getRandomWishes());
        setShowMessage(true);
        setHasGeneratedWishes(true);

        audioRef.current?.play().catch(() => {
          document.addEventListener("click", () => audioRef.current?.play(), {
            once: true,
          });
        });
      }, 1000);

      return () => clearTimeout(timer);
    } else if (!isOpen) {
      setShowMessage(false);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    }
  }, [isOpen, hasGeneratedWishes, getRandomWishes]);

  // Event handlers
  const handleClose = () => {
    setIsOpen(false);
    setShowMessage(false);
    setHasGeneratedWishes(false); // เพิ่มบรรทัดนี้เพื่อ reset state
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
      console.error("Error sharing:", error);
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
        />
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
        <div className="flex items-center space-x-1">
          <Eye className="w-4 h-4 text-blue-400" />
          <span className="text-sm">
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
