/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { StarSky } from './components/StarSky';
import { FloatingSky } from './components/FloatingSky';
import { Envelope } from './components/Envelope';
import { LetterModal } from './components/LetterModal';
import { CustomMessageModal } from './components/CustomMessageModal';
import { QRCodeModal } from './components/QRCodeModal';
import { soundEngine } from './utils/audio';
import { Music, VolumeX, MessageSquarePlus, QrCode, FileDown, Maximize2, Minimize2 } from 'lucide-react';

export default function App() {
  const [isLetterOpen, setIsLetterOpen] = useState(false);
  const [isAddMessageOpen, setIsAddMessageOpen] = useState(false);
  const [isQROpen, setIsQROpen] = useState(false);
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [customMessages, setCustomMessages] = useState<string[]>([]);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // The permanent public share URL for this application
  const sharedUrl = "https://ais-pre-uuaq2fifgzle2dtqyngi7m-741360478785.asia-northeast1.run.app";

  const toggleMusic = () => {
    const playing = soundEngine.toggleMusic();
    setIsPlayingMusic(playing);
  };

  const handleAddCustomMessage = (msg: string) => {
    setCustomMessages((prev) => [msg, ...prev]);
  };

  const handleDownloadStandalone = () => {
    soundEngine.playChime(1.5);
    const a = document.createElement('a');
    a.href = '/thu-tinh-gui-em.html';
    a.download = 'thu-tinh-gui-em.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
      }
    }
  };

  const handleCanvasClick = () => {
    // Soft interaction chime on click
    soundEngine.playChime(1.1);
  };

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-[radial-gradient(ellipse_at_center,#20051d_0%,#09000d_50%,#030006_100%)]">
      {/* Interactive Twinkling Stars & Heart Click Burst Canvas */}
      <StarSky onCanvasClick={handleCanvasClick} />

      {/* Floating upward draggable messages and hearts */}
      <FloatingSky customMessages={customMessages} active={true} />

      {/* Main Romantic Titles */}
      <header className="fixed top-[6%] sm:top-[7%] left-0 w-full px-3 text-center pointer-events-none z-20">
        <h1 className="text-[#ffacd4] font-bold text-[clamp(24px,5vw,42px)] tracking-wide animate-title-glow drop-shadow-[0_0_12px_#ff168b]">
          Gửi em, người anh yêu ❤️
        </h1>
        <p className="mt-2 text-[#ffd2e8] text-[clamp(13px,2.4vw,17px)] font-medium tracking-wide animate-fade-pulse drop-shadow-[0_0_10px_#ff4ba5]">
          Em là điều dịu dàng nhất đến bên cuộc đời anh 💗
        </p>
      </header>

      {/* Top Action Toolbar */}
      <nav aria-label="Điều khiển" className="fixed top-3 right-3 sm:top-5 sm:right-5 flex items-center gap-1.5 sm:gap-2 z-30 pointer-events-auto">
        {/* QR Code button */}
        <button
          onClick={() => {
            soundEngine.playChime(1.2);
            setIsQROpen(true);
          }}
          title="Xem và tải mã QR"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-pink-900/40 hover:bg-pink-800/60 border border-pink-500/40 text-pink-200 text-xs font-medium backdrop-blur-md shadow-[0_0_12px_rgba(255,22,139,0.3)] transition-all cursor-pointer active:scale-95"
        >
          <QrCode className="w-3.5 h-3.5 text-pink-300" />
          <span>Mã QR</span>
        </button>

        {/* Download Standalone HTML file */}
        <button
          onClick={handleDownloadStandalone}
          title="Tải file web độc lập để gửi qua Zalo / Messenger"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-pink-900/40 hover:bg-pink-800/60 border border-pink-500/40 text-pink-200 text-xs font-medium backdrop-blur-md shadow-[0_0_12px_rgba(255,22,139,0.3)] transition-all cursor-pointer active:scale-95"
        >
          <FileDown className="w-3.5 h-3.5 text-pink-300" />
          <span className="hidden sm:inline">Tải file Web</span>
        </button>

        {/* Add custom love message */}
        <button
          onClick={() => setIsAddMessageOpen(true)}
          title="Thả thêm tin nhắn ngọt ngào"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-pink-900/40 hover:bg-pink-800/60 border border-pink-500/40 text-pink-200 text-xs font-medium backdrop-blur-md shadow-[0_0_12px_rgba(255,22,139,0.3)] transition-all cursor-pointer active:scale-95"
        >
          <MessageSquarePlus className="w-3.5 h-3.5 text-pink-300" />
          <span className="hidden sm:inline">Thêm lời nhắn</span>
        </button>

        {/* Music Player Toggle */}
        <button
          onClick={toggleMusic}
          title={isPlayingMusic ? 'Tắt nhạc du dương' : 'Bật giai điệu lãng mạn'}
          className={`p-2 rounded-full border text-xs font-semibold backdrop-blur-md shadow-[0_0_15px_rgba(255,22,139,0.35)] transition-all cursor-pointer active:scale-95 ${
            isPlayingMusic
              ? 'bg-gradient-to-r from-pink-600 to-rose-600 border-pink-400 text-white animate-pulse'
              : 'bg-pink-950/40 hover:bg-pink-900/60 border-pink-500/40 text-pink-300'
          }`}
        >
          {isPlayingMusic ? <Music className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>

        {/* Fullscreen Toggle */}
        <button
          onClick={toggleFullscreen}
          title="Toàn màn hình"
          className="p-2 rounded-full bg-pink-950/40 hover:bg-pink-900/60 border border-pink-500/40 text-pink-300 text-xs backdrop-blur-md shadow-[0_0_12px_rgba(255,22,139,0.3)] transition-all cursor-pointer active:scale-95 hidden sm:flex"
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>
      </nav>

      {/* Gentle Floating Hint at bottom left */}
      <footer className="fixed bottom-4 left-4 z-20 text-[11px] sm:text-xs text-pink-300/60 pointer-events-none drop-shadow">
        ✨ Chạm màn hình để nở hoa tim • Kéo thả các dòng chữ
      </footer>

      {/* Floating Interactive Envelope with Heart Seal */}
      <Envelope onOpen={() => setIsLetterOpen(true)} isOpen={isLetterOpen} />

      {/* Romantic Full Letter Modal */}
      <LetterModal
        isOpen={isLetterOpen}
        onClose={() => setIsLetterOpen(false)}
        anniversaryDateStr="2026-09-06"
      />

      {/* Custom Message Creator Modal */}
      <CustomMessageModal
        isOpen={isAddMessageOpen}
        onClose={() => setIsAddMessageOpen(false)}
        onAddMessage={handleAddCustomMessage}
      />

      {/* QR Code Viewer & Download Modal */}
      <QRCodeModal
        isOpen={isQROpen}
        onClose={() => setIsQROpen(false)}
        sharedUrl={sharedUrl}
      />
    </main>
  );
}
