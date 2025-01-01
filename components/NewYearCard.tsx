import React, { useState, useEffect, useCallback } from 'react';
import { Star, Sparkles, Gift, RotateCcw, Share2, Code, Heart, Github } from 'lucide-react';
import styles from './NewYearCard.module.css';

const NewYearCard = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [shareSupported, setShareSupported] = useState(false);
  const [randomWishes, setRandomWishes] = useState<string[]>([]);

  // รายการคำอวยพรทั้งหมด
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
    "ทำการใดขอให้สำเร็จสมใจ"
  ];

  const getRandomWishes = useCallback(() => {
    const wishes = [...allWishes];
    const selected = [];
    for (let i = 0; i < 4; i++) {
      const randomIndex = Math.floor(Math.random() * wishes.length);
      selected.push(wishes[randomIndex]);
      wishes.splice(randomIndex, 1);
    }
    return selected;
  }, [allWishes]);

  useEffect(() => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      setShareSupported(true);
    }
    
    if (isOpen) {
      const timer = setTimeout(() => {
        setRandomWishes(getRandomWishes());
        setShowMessage(true);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setShowMessage(false);
    }
  }, [isOpen, getRandomWishes]);

  const handleClose = () => {
    setIsOpen(false);
    setShowMessage(false);
  };

  const handleShare = async () => {
    try {
      if (typeof navigator !== 'undefined' && navigator.share) {
        await navigator.share({
          title: 'การ์ดอวยพรปีใหม่ 2025',
          text: 'ส่งความสุขและคำอวยพรปีใหม่ 2025 ให้คุณ 🎊✨',
          url: window.location.href
        });
      }
    } catch (error) {
      console.log('Error sharing:', error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-600 to-blue-500 p-4">
      <div className={`${styles.card_inner} relative w-96 bg-white rounded-xl shadow-2xl transform transition-all duration-700
          ${isOpen ? 'scale-100' : 'scale-90 hover:scale-95'} mb-4`}>
        {/* หน้าปก */}
        <div className={`${styles.card_front} absolute w-full h-full bg-gradient-to-br from-red-500 to-pink-500 rounded-xl p-8
            transform origin-left transition-all duration-700 flex flex-col items-center justify-center
            ${isOpen ? styles.rotate_y_180 : ''}`}
          onClick={() => !isOpen && setIsOpen(true)}>
          <Star className="w-16 h-16 text-yellow-300 animate-pulse" />
          <h1 className="text-3xl font-bold text-white mt-4 text-center">
            Happy New Year 2025
          </h1>
          <p className="text-white mt-2 text-center">
            ⭐ แตะเพื่อเปิดการ์ด ⭐
          </p>
        </div>

        {/* เนื้อหาด้านใน */}
        <div className="p-8">
          <div className={`transform transition-all duration-1000 ${showMessage ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="flex justify-between items-center mb-6">
              <Sparkles className={`w-12 h-12 text-yellow-500 ${styles.animate_spin_slow}`} />
              <div className="flex gap-2">
                {shareSupported && (
                  <button 
                    onClick={handleShare}
                    className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                    aria-label="แชร์การ์ด">
                    <Share2 className="w-6 h-6 text-gray-600" />
                  </button>
                )}
                <button 
                  onClick={handleClose}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                  aria-label="ปิดการ์ด">
                  <RotateCcw className="w-6 h-6 text-gray-600" />
                </button>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
              สวัสดีปีใหม่ 2025 🎊
            </h2>
            <div className="space-y-4">
              {randomWishes.map((wish, index) => (
                <div key={index} 
                  className={`flex items-center space-x-2 ${styles.animate_fade_in}`}
                  style={{ animationDelay: `${index * 0.3}s` }}>
                  <Gift className="w-5 h-5 text-red-500 flex-shrink-0" />
                  <p className="text-gray-700">{wish}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ข้อมูลด้านล่างการ์ด */}
      <div className="flex items-center justify-center space-x-6 mt-4 text-white/80">
        <div className="flex items-center space-x-1">
          <Code className="w-4 h-4" />
          <span className="text-sm">Developed with Next.js & React</span>
        </div>
        <div className="flex items-center space-x-1">
          <Heart className="w-4 h-4 text-red-400" />
          <span className="text-sm">Made with ❤️ by Khajornsak Chaipha</span>
        </div>
        <a 
          href="https://github.com/Khajornssc/new-year-card" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center space-x-1 hover:text-white transition-colors"
        >
          <Github className="w-4 h-4" />
          <span className="text-sm">GitHub</span>
        </a>
      </div>
    </div>
  );
};

export default NewYearCard;