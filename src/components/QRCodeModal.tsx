import React, { useEffect, useState, useRef } from 'react';
import QRCode from 'qrcode';
import { soundEngine } from '../utils/audio';
import { QrCode, Copy, Check, Download, X, ExternalLink, RefreshCw, FileCode, AlertCircle } from 'lucide-react';

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  sharedUrl: string;
}

export const QRCodeModal: React.FC<QRCodeModalProps> = ({
  isOpen,
  onClose,
  sharedUrl,
}) => {
  const [copied, setCopied] = useState(false);
  const [customUrl, setCustomUrl] = useState('');
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [qrGenerated, setQrGenerated] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Active target URL
  const currentWindowUrl = typeof window !== 'undefined' ? window.location.href : '';
  const defaultUrl = sharedUrl || currentWindowUrl;
  const activeUrl = isCustomMode && customUrl.trim() ? customUrl.trim() : defaultUrl;

  // External QR API as reliable fallback or download source
  const externalQrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&margin=8&data=${encodeURIComponent(
    activeUrl
  )}`;

  useEffect(() => {
    if (!isOpen) return;

    const generateQR = async () => {
      try {
        const qrLib = (QRCode as unknown as { default?: typeof QRCode }).default || QRCode;
        if (canvasRef.current && qrLib?.toCanvas) {
          await qrLib.toCanvas(canvasRef.current, activeUrl, {
            width: 250,
            margin: 2,
            errorCorrectionLevel: 'H', // High error correction for 100% scan rate
            color: {
              dark: '#000000', // Crisp black for instant scanning by all camera apps & Zalo
              light: '#ffffff',
            },
          });
          setQrGenerated(true);
        }
      } catch {
        setQrGenerated(false);
      }
    };

    generateQR();
  }, [isOpen, activeUrl]);

  if (!isOpen) return null;

  const handleCopy = () => {
    soundEngine.playChime(1.4);
    navigator.clipboard.writeText(activeUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadQR = () => {
    soundEngine.playChime(1.5);
    try {
      if (canvasRef.current) {
        const dataUrl = canvasRef.current.toDataURL('image/png');
        const a = document.createElement('a');
        a.href = dataUrl;
        a.download = 'ma-qr-buc-thu-tinh.png';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        return;
      }
    } catch {
      // fallback
    }
    window.open(externalQrUrl, '_blank');
  };

  const handleDownloadHtml = () => {
    soundEngine.playChime(1.5);
    const a = document.createElement('a');
    a.href = '/thu-tinh-gui-em.html';
    a.download = 'thu-tinh-gui-em.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div
      className="fixed inset-0 bg-[#07000d]/85 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-4 select-text overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-sm rounded-3xl bg-gradient-to-b from-[#fff6fb] via-[#ffeaf5] to-[#ffdcee] border-2 border-[#ff9bc9] p-5 sm:p-6 shadow-[0_0_40px_rgba(255,35,142,0.45)] text-center text-[#792247] animate-fade-in my-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3.5 right-3.5 p-1.5 rounded-full hover:bg-pink-200/60 text-[#c22165] transition-colors cursor-pointer"
          title="Đóng"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Header */}
        <div className="inline-flex items-center justify-center w-11 h-11 mb-2 rounded-full bg-gradient-to-tr from-pink-500 to-rose-600 text-white shadow-[0_0_15px_#ff238e]">
          <QrCode className="w-5 h-5" />
        </div>

        <h3 className="text-xl font-bold text-[#e92c7a] font-serif-romantic">
          Mã QR Bức Thư Tình ❤️
        </h3>
        <p className="text-xs text-[#8a3359] mt-0.5 mb-2.5">
          Quét bằng camera điện thoại, Zalo hoặc Google Lens
        </p>

        {/* Notice explaining AI Studio Share requirement */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-2.5 mb-3 text-left flex items-start gap-2 text-[11px] text-amber-900 leading-snug">
          <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <strong>Để người khác quét vào được:</strong> Nhìn lên <strong>góc trên bên phải</strong> giao diện AI Studio và bấm nút <strong>Share</strong> (hoặc <strong>Publish</strong>) để bật công khai nhé!
          </div>
        </div>

        {/* QR Code Container with High-Contrast White Background */}
        <div className="relative inline-flex items-center justify-center p-3 bg-white rounded-2xl shadow-lg border-2 border-pink-300 mx-auto mb-2.5">
          {/* Canvas QR Code (High precision black on white) */}
          <canvas
            ref={canvasRef}
            className="w-[200px] h-[200px] sm:w-[220px] sm:h-[220px] rounded-lg block"
            style={{ imageRendering: 'pixelated' }}
          />

          {/* Backup image if canvas is not yet ready */}
          {!qrGenerated && (
            <img
              src={externalQrUrl}
              alt="Mã QR dự phòng"
              className="absolute inset-3 w-[200px] h-[200px] sm:w-[220px] sm:h-[220px] rounded-lg bg-white"
            />
          )}
        </div>

        {/* URL Box */}
        <div className="bg-white/90 border border-pink-200 rounded-xl p-2.5 mb-2.5 text-left shadow-inner flex items-center justify-between gap-2">
          <div className="overflow-hidden flex-1">
            <div className="text-[10px] uppercase font-bold text-pink-500 tracking-wider">
              {isCustomMode ? 'Nhập link bạn muốn tạo QR' : 'Liên kết mở trang'}
            </div>
            {isCustomMode ? (
              <input
                type="url"
                value={customUrl}
                onChange={(e) => setCustomUrl(e.target.value)}
                placeholder="Dán link web của bạn vào đây..."
                className="w-full text-xs font-mono text-[#792247] bg-pink-50/50 px-1.5 py-1 rounded border border-pink-300 focus:outline-none focus:ring-1 focus:ring-pink-400 mt-0.5"
              />
            ) : (
              <div className="text-xs font-mono text-[#792247] truncate" title={activeUrl}>
                {activeUrl}
              </div>
            )}
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsCustomMode(!isCustomMode)}
              title={isCustomMode ? 'Dùng link mặc định' : 'Đổi sang link riêng của bạn'}
              className="p-1.5 rounded-lg bg-pink-100 hover:bg-pink-200 text-pink-700 text-xs transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleCopy}
              className="px-2.5 py-1.5 rounded-lg bg-pink-100 hover:bg-pink-200 text-[#e92c7a] text-xs font-bold transition-all flex items-center gap-1 cursor-pointer flex-shrink-0"
              title="Sao chép link"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Đã chép' : 'Chép'}</span>
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          <div className="flex gap-2">
            <button
              onClick={handleDownloadQR}
              className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white text-xs font-bold shadow-[0_0_12px_rgba(255,35,142,0.4)] flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-95"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Tải ảnh mã QR</span>
            </button>

            <a
              href={activeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2.5 rounded-xl bg-pink-100 hover:bg-pink-200 text-[#c22165] text-xs font-bold flex items-center justify-center gap-1 transition-all cursor-pointer"
              title="Thử mở liên kết"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Mở link</span>
            </a>
          </div>

          {/* Download Standalone HTML button */}
          <button
            onClick={handleDownloadHtml}
            className="w-full py-2.5 rounded-xl bg-white/80 hover:bg-white border border-pink-300 text-[#a31553] text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-95 shadow-sm"
          >
            <FileCode className="w-3.5 h-3.5 text-pink-500" />
            <span>Tải file Web (.html) gửi qua Zalo / Messenger</span>
          </button>
        </div>
      </div>
    </div>
  );
};
