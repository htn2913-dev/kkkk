import React, { useState } from 'react';
import { soundEngine } from '../utils/audio';
import { PlusCircle, Send, X } from 'lucide-react';

interface CustomMessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddMessage: (msg: string) => void;
}

export const CustomMessageModal: React.FC<CustomMessageModalProps> = ({
  isOpen,
  onClose,
  onAddMessage,
}) => {
  const [inputText, setInputText] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = inputText.trim();
    if (!trimmed) return;

    soundEngine.playChime(1.4);
    onAddMessage(trimmed);
    setInputText('');
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-[#07000d]/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-sm rounded-2xl bg-gradient-to-b from-[#250821] to-[#120013] border border-pink-500/40 p-5 shadow-[0_0_25px_#ff238e55] text-white">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-pink-300 font-semibold text-sm">
            <PlusCircle className="w-4 h-4 text-[#ff5ea8]" />
            <span>Thả tin nhắn tình yêu lên bầu trời</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-pink-300/70 hover:text-white hover:bg-white/10"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            autoFocus
            maxLength={60}
            placeholder="Ví dụ: Yêu em đến suốt đời 💖"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-white/10 border border-pink-400/40 text-sm text-pink-100 placeholder-pink-300/40 focus:outline-none focus:border-pink-400 focus:ring-1 focus:ring-pink-400"
          />

          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-pink-200 text-xs font-semibold"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="flex-1 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-400 hover:to-rose-500 disabled:opacity-50 text-white text-xs font-bold shadow-[0_0_12px_#ff238e] flex items-center justify-center gap-1.5"
            >
              <span>Thả bay</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
