import React, { useEffect, useState } from 'react';
import { soundEngine } from '../utils/audio';
import { Heart, Sparkles, Copy, Check, Share2, Edit3, Calendar } from 'lucide-react';

interface LetterModalProps {
  isOpen: boolean;
  onClose: () => void;
  anniversaryDateStr?: string;
}

export const LetterModal: React.FC<LetterModalProps> = ({
  isOpen,
  onClose,
  anniversaryDateStr = '2026-09-06',
}) => {
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [daysCount, setDaysCount] = useState<number | null>(null);

  // Letter editable states (prefilled with original letter from user's code)
  const [recipientTitle, setRecipientTitle] = useState('Gửi em, người cô gái anh thương 💗');
  const [letterBody, setLetterBody] = useState(`Anh không biết từ bao giờ em đã trở thành một người đặc biệt đến thế trong lòng anh.

Mỗi ngày trôi qua, anh đều nhớ đến em. Đôi khi chỉ một tin nhắn nhỏ của em cũng đủ khiến cả ngày của anh trở nên thật tuyệt vời.

Anh muốn được ở bên em, quan tâm em, lắng nghe những câu chuyện của em, cùng em chia sẻ niềm vui và cả những lúc em buồn.

Anh biết mình không phải người hoàn hảo, nhưng anh sẽ luôn cố gắng yêu em bằng sự chân thành, dịu dàng và trân trọng nhất.

Nếu có những ngày em mệt mỏi với thế giới, anh mong mình có thể trở thành nơi bình yên để em tựa vào và được là chính mình.

Anh không biết tương lai sẽ có những gì, nhưng hiện tại, anh thật lòng muốn nắm tay em, cùng em đi qua thật nhiều ngày tháng phía trước.

ANH YÊU EM NHIỀU LẮM! ❤️

Vào ngày 6/9/2026 bánh xe số phận đã quay, từ bạn trong 1 tự game mà hai ta đã trở thành 1 phần không thể thiếu của nhau, đó là sự tình cờ hay do đó là sự sắp đặt của nhân duyên, tuy chúng ta cách xa nhau nhưng qua các đoạn tin nhắn yêu thương thì khoảng cách chỉ là 1 con số.

Nhân ngày 20/10 anh chúc em luôn xinh đẹp, luôn mạnh khoẻ, chăm ngoan học giỏi và nhớ nghe lời ba má. Anh sẽ luôn là nơi tạo niềm vui và là nơi an ủi những nỗi buồn sâu bên trong tim.

CẢM ƠN EM VÌ ĐÃ XUẤT HIỆN TRONG CUỘC ĐỜI ANH 💌`);

  // Calculate days together
  useEffect(() => {
    try {
      const targetDate = new Date(anniversaryDateStr);
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - targetDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setDaysCount(diffDays);
    } catch {
      setDaysCount(null);
    }
  }, [anniversaryDateStr]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleClose = () => {
    soundEngine.playPop();
    onClose();
  };

  const handleCopy = () => {
    soundEngine.playChime(1.5);
    const fullText = `${recipientTitle}\n\n${letterBody}`;
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    soundEngine.playChime(1.3);
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Gửi em, người anh yêu ❤️',
          text: recipientTitle,
          url: window.location.href,
        });
      } catch {
        handleCopy();
      }
    } else {
      handleCopy();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-[#05000a]/85 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-5 select-text animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div
        className="relative w-full max-w-[480px] max-h-[88vh] flex flex-col rounded-2xl sm:rounded-3xl border border-[#ff9bc9]/70 shadow-[0_0_35px_#ff3998,0_0_70px_rgba(255,22,139,0.35)] overflow-hidden bg-gradient-to-br from-[#fff7fb] via-[#ffe8f3] to-[#ffd8eb] text-[#792247] transition-all duration-300"
        style={{
          boxShadow: '0 0 30px #ff3998, 0 0 70px rgba(255, 22, 139, 0.35)',
        }}
      >
        {/* Decorative Top Accent Ribbon */}
        <div className="w-full h-2.5 bg-gradient-to-r from-[#ff7cb4] via-[#e91e75] to-[#ff4ba5]" />

        {/* Header Tools */}
        <div className="flex items-center justify-between px-5 pt-3.5 pb-1">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-[#e92c7a] bg-pink-100/90 px-3 py-1 rounded-full border border-pink-200">
            <Calendar className="w-3.5 h-3.5" />
            <span>Kỷ niệm: 06/09/2026 {daysCount !== null && `• ${daysCount} ngày`}</span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsEditing(!isEditing)}
              title={isEditing ? 'Lưu chỉnh sửa' : 'Chỉnh sửa lời chúc'}
              className="p-1.5 rounded-full hover:bg-pink-200/70 text-[#c22165] transition-colors"
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <button
              onClick={handleCopy}
              title="Sao chép nội dung"
              className="p-1.5 rounded-full hover:bg-pink-200/70 text-[#c22165] transition-colors relative"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            </button>
            <button
              onClick={handleShare}
              title="Chia sẻ"
              className="p-1.5 rounded-full hover:bg-pink-200/70 text-[#c22165] transition-colors"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Paper Body */}
        <div className="px-5 sm:px-7 py-3 overflow-y-auto custom-paper-scroll text-center flex-1">
          {/* Heart Emblem */}
          <div className="inline-flex items-center justify-center w-12 h-12 mb-2 rounded-full bg-gradient-to-br from-pink-200 to-pink-300 shadow-inner text-[#e92c7a]">
            <Heart className="w-6 h-6 fill-current animate-pulse" />
          </div>

          {isEditing ? (
            <div className="space-y-3 text-left">
              <label className="text-xs font-semibold text-pink-700">Tiêu đề bức thư:</label>
              <input
                type="text"
                value={recipientTitle}
                onChange={(e) => setRecipientTitle(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg border border-pink-300 text-sm font-bold text-[#e92c7a] bg-white/80 focus:outline-none focus:ring-2 focus:ring-pink-400"
              />
              <label className="text-xs font-semibold text-pink-700">Nội dung bức thư:</label>
              <textarea
                rows={12}
                value={letterBody}
                onChange={(e) => setLetterBody(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-pink-300 text-sm leading-relaxed text-[#792247] bg-white/80 focus:outline-none focus:ring-2 focus:ring-pink-400"
              />
              <div className="text-right">
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-1.5 text-xs font-bold rounded-lg bg-[#e92c7a] text-white hover:bg-[#d81966]"
                >
                  Xong chỉnh sửa
                </button>
              </div>
            </div>
          ) : (
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#e92c7a] drop-shadow-[0_0_8px_#ffb1d2] leading-snug mb-4 font-serif-romantic">
                {recipientTitle}
              </h2>

              <div className="text-[14.5px] sm:text-[15.5px] leading-[1.85] text-[#6b1e3e] font-normal text-justify sm:text-center space-y-4">
                <p>
                  Anh không biết từ bao giờ em đã trở thành một người đặc biệt đến thế trong lòng anh.
                </p>

                <p>
                  Mỗi ngày trôi qua, anh đều nhớ đến em. Đôi khi chỉ một tin nhắn nhỏ của em cũng đủ khiến cả ngày của anh trở nên thật tuyệt vời.
                </p>

                <p>
                  Anh muốn được ở bên em, quan tâm em, lắng nghe những câu chuyện của em, cùng em chia sẻ niềm vui và cả những lúc em buồn.
                </p>

                <p>
                  Anh biết mình không phải người hoàn hảo, nhưng anh sẽ luôn cố gắng yêu em bằng sự chân thành, dịu dàng và trân trọng nhất.
                </p>

                <p>
                  Nếu có những ngày em mệt mỏi với thế giới, anh mong mình có thể trở thành nơi bình yên để em tựa vào và được là chính mình.
                </p>

                <p>
                  Anh không biết tương lai sẽ có những gì, nhưng hiện tại, anh thật lòng muốn nắm tay em, cùng em đi qua thật nhiều ngày tháng phía trước.
                </p>

                <div className="py-2 text-center">
                  <span className="inline-block text-[#e21b70] font-bold text-lg sm:text-xl tracking-wider px-3 py-1 bg-pink-100/80 rounded-full border border-pink-200 shadow-sm animate-pulse">
                    ANH YÊU EM NHIỀU LẮM! ❤️
                  </span>
                </div>

                <p className="italic bg-pink-50/70 p-3 rounded-xl border border-pink-200/60">
                  Vào ngày <strong>6/9/2026</strong> bánh xe số phận đã quay, từ bạn trong 1 tự game mà hai ta đã trở thành 1 phần không thể thiếu của nhau, đó là sự tình cờ hay do đó là sự sắp đặt của nhân duyên, tuy chúng ta cách xa nhau nhưng qua các đoạn tin nhắn yêu thương thì khoảng cách chỉ là 1 con số.
                </p>

                <p>
                  Nhân ngày <strong>20/10</strong> anh chúc em luôn xinh đẹp, luôn mạnh khoẻ, chăm ngoan học giỏi và nhớ nghe lời ba má. Anh sẽ luôn là nơi tạo niềm vui và là nơi an ủi những nỗi buồn sâu bên trong tim.
                </p>

                <div className="pt-2 text-center font-bold text-[#d81b6c] tracking-wide text-[15px] sm:text-[16px]">
                  CẢM ƠN EM VÌ ĐÃ XUẤT HIỆN TRONG CUỘC ĐỜI ANH 💌
                </div>
              </div>
            </div>
          )}

          {/* Copy Toast feedback */}
          {copied && (
            <div className="mt-3 text-xs font-semibold text-emerald-700 bg-emerald-50 py-1 px-3 rounded-full inline-block border border-emerald-200">
              Đã sao chép bức thư vào khay nhớ tạm! 💖
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-gradient-to-t from-pink-100/90 to-transparent flex items-center justify-center gap-3">
          <button
            onClick={handleClose}
            className="px-6 py-2.5 rounded-full bg-gradient-to-r from-[#ff6eac] to-[#e91e75] hover:from-[#ff579f] hover:to-[#d81165] text-white text-sm sm:text-base font-bold shadow-[0_0_15px_#ff3998] active:scale-95 transition-all transform flex items-center gap-2 cursor-pointer"
          >
            <span>Gấp thư lại 💕</span>
            <Sparkles className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
