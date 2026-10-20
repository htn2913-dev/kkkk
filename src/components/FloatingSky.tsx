import React, { useEffect, useRef } from 'react';
import { soundEngine } from '../utils/audio';

export const DEFAULT_MESSAGES = [
  "Anh yêu em ❤️",
  "I love you 💗",
  "Nhớ em nhiều lắm 💕",
  "Anh thương em",
  "Anh sẽ luôn quan tâm em 💖",
  "Em là điều tuyệt vời nhất",
  "Thương em thật nhiều",
  "You are my love 💘",
  "Trái tim anh thuộc về em",
  "Em là cả thế giới của anh",
  "Chỉ yêu mình em thôi 💓",
  "Mỗi ngày đều nhớ em",
  "Forever love 💞",
  "Em luôn ở trong trái tim anh",
  "Anh thích nụ cười của em ❤️",
  "My sweetheart 💝",
  "Muốn ở bên em",
  "Be mine 💌",
  "Mong em luôn hạnh phúc",
  "Mãi yêu em",
  "Em là ngoại lệ của anh",
  "Gặp em là may mắn",
  "Yêu em hơn hôm qua",
  "Anh nhớ em 💗",
  "Em thật đặc biệt",
  "Cảm ơn em đã đến",
  "💕", "💖", "💗", "❤️", "💘"
];

const HEART_ICONS = ["♡", "♥", "💕", "✨", "🌸", "💖"];

interface FloatingSkyProps {
  customMessages: string[];
  active?: boolean;
}

export const FloatingSky: React.FC<FloatingSkyProps> = ({ customMessages }) => {
  const skyRef = useRef<HTMLDivElement | null>(null);
  const customMessagesRef = useRef<string[]>(customMessages);

  // Keep ref up to date
  useEffect(() => {
    customMessagesRef.current = customMessages;
  }, [customMessages]);

  // When a new custom message is added, immediately spawn it with a special sparkle!
  useEffect(() => {
    if (customMessages.length > 0 && skyRef.current) {
      const latestMsg = customMessages[0];
      spawnItem(latestMsg, true);
    }
  }, [customMessages]);

  const spawnItem = (textToUse?: string, isHighlighted = false, initialDelaySec = 0) => {
    const sky = skyRef.current;
    if (!sky) return;

    const pool = [...DEFAULT_MESSAGES, ...customMessagesRef.current];
    const text = textToUse || pool[Math.floor(Math.random() * pool.length)];

    const item = document.createElement("div");
    item.className = "floating";
    item.textContent = text;
    item.style.left = (Math.random() * 85 + 2) + "%";
    item.style.fontSize = (14 + Math.random() * 11) + "px";

    const duration = 9 + Math.random() * 5;
    item.style.animationDuration = duration + "s";

    if (initialDelaySec !== 0) {
      item.style.animationDelay = `${initialDelaySec}s`;
    }

    if (isHighlighted) {
      item.style.color = "#ffffff";
      item.style.textShadow = "0 0 12px #ff007f, 0 0 25px #ff007f, 0 0 40px #ff007f";
      item.style.fontWeight = "bold";
      item.style.fontSize = "22px";
    }

    // Dragging support with pointer events
    item.addEventListener("pointerdown", function (event: PointerEvent) {
      event.preventDefault();
      event.stopPropagation();

      const rect = item.getBoundingClientRect();
      const offsetX = event.clientX - rect.left;
      const offsetY = event.clientY - rect.top;

      soundEngine.playPop();

      item.classList.add("dragging");
      item.style.left = rect.left + "px";
      item.style.top = rect.top + "px";
      item.style.bottom = "auto";

      try {
        item.setPointerCapture(event.pointerId);
      } catch {
        // ignore
      }

      function moveText(e: PointerEvent) {
        item.style.left = (e.clientX - offsetX) + "px";
        item.style.top = (e.clientY - offsetY) + "px";
      }

      function stopMoving(e: PointerEvent) {
        soundEngine.playChime(1.2);
        item.classList.remove("dragging");
        item.removeEventListener("pointermove", moveText as EventListener);
        item.removeEventListener("pointerup", stopMoving as EventListener);
        item.removeEventListener("pointercancel", stopMoving as EventListener);
        try {
          item.releasePointerCapture(e.pointerId);
        } catch {
          // ignore
        }
      }

      item.addEventListener("pointermove", moveText as EventListener);
      item.addEventListener("pointerup", stopMoving as EventListener);
      item.addEventListener("pointercancel", stopMoving as EventListener);
    });

    sky.appendChild(item);

    // Auto cleanup after animation ends
    const cleanupTimeMs = (duration - initialDelaySec) * 1000 + 400;
    setTimeout(() => {
      if (item.parentNode === sky) {
        item.remove();
      }
    }, Math.max(1000, cleanupTimeMs));
  };

  const spawnHeart = (initialDelaySec = 0) => {
    const sky = skyRef.current;
    if (!sky) return;

    const heart = document.createElement("div");
    heart.className = "heart";
    heart.textContent = HEART_ICONS[Math.floor(Math.random() * HEART_ICONS.length)];
    heart.style.left = (Math.random() * 95 + 2) + "%";
    heart.style.fontSize = (12 + Math.random() * 20) + "px";

    const duration = 7 + Math.random() * 6;
    heart.style.animationDuration = duration + "s";

    if (initialDelaySec !== 0) {
      heart.style.animationDelay = `${initialDelaySec}s`;
    }

    sky.appendChild(heart);

    const cleanupTimeMs = (duration - initialDelaySec) * 1000 + 300;
    setTimeout(() => {
      if (heart.parentNode === sky) {
        heart.remove();
      }
    }, Math.max(1000, cleanupTimeMs));
  };

  useEffect(() => {
    // 1. Instantly populate the entire sky with staggered negative delays
    // This ensures words are floating at all screen levels right upon opening!
    const initialBatchCount = 24;
    for (let i = 0; i < initialBatchCount; i++) {
      // Negative delays from -0.5s to -11s
      const negDelay = -((i * 0.5) % 11);
      spawnItem(undefined, false, negDelay);
      if (i % 2 === 0) {
        spawnHeart(negDelay);
      }
    }

    // 2. Set recurring intervals to spawn new floating messages and hearts continuously
    const msgInterval = setInterval(() => {
      spawnItem();
    }, 450);

    const heartInterval = setInterval(() => {
      spawnHeart();
    }, 600);

    return () => {
      clearInterval(msgInterval);
      clearInterval(heartInterval);
      if (skyRef.current) {
        skyRef.current.innerHTML = '';
      }
    };
  }, []);

  return (
    <div
      id="sky"
      ref={skyRef}
      className="fixed inset-0 overflow-hidden pointer-events-none z-10"
    />
  );
};
