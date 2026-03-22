import { useState } from "react";

const WHITE_KEYS = [
  { note: "C", label: "C" },
  { note: "D", label: "D" },
  { note: "E", label: "E" },
  { note: "F", label: "F" },
  { note: "G", label: "G" },
  { note: "A", label: "A" },
  { note: "B", label: "B" },
];

const BLACK_KEYS = [
  { note: "C#", position: 1 },
  { note: "D#", position: 2 },
  { note: "F#", position: 4 },
  { note: "G#", position: 5 },
  { note: "A#", position: 6 },
];

interface PianoProps {
  className?: string;
}

export function Piano({ className = "" }: PianoProps) {
  const [activeKeys, setActiveKeys] = useState<Set<string>>(new Set());

  const handleKeyClick = (note: string) => {
    setActiveKeys((prev) => {
      const next = new Set(prev);
      next.add(note);
      return next;
    });
    setTimeout(() => {
      setActiveKeys((prev) => {
        const next = new Set(prev);
        next.delete(note);
        return next;
      });
    }, 600);
  };

  const whiteKeyWidth = 40;
  const totalWidth = WHITE_KEYS.length * whiteKeyWidth;

  return (
    <div className={`relative select-none ${className}`}>
      {/* 五線譜の線 */}
      <div className="mb-4 flex flex-col gap-1">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="h-px w-full"
            style={{ backgroundColor: "#2a2520" }}
          />
        ))}
      </div>

      {/* ピアノ */}
      <div
        className="relative mx-auto overflow-hidden rounded-b-lg"
        style={{ width: totalWidth, height: 120 }}
      >
        {/* 白鍵 */}
        {WHITE_KEYS.map((key, i) => (
          <button
            key={key.note}
            type="button"
            onClick={() => handleKeyClick(key.note)}
            className="absolute top-0 cursor-pointer rounded-b-sm border border-[#2a2520] transition-colors duration-100"
            style={{
              left: i * whiteKeyWidth,
              width: whiteKeyWidth - 2,
              height: 120,
              backgroundColor: activeKeys.has(key.note) ? "#c9a84c" : "#f5f0e8",
              zIndex: 1,
            }}
          >
            <span
              className="absolute bottom-2 left-0 right-0 text-center text-xs font-medium"
              style={{ color: activeKeys.has(key.note) ? "#0e0d0c" : "#6b6356" }}
            >
              {key.label}
            </span>
          </button>
        ))}

        {/* 黒鍵 */}
        {BLACK_KEYS.map((key) => (
          <button
            key={key.note}
            type="button"
            onClick={() => handleKeyClick(key.note)}
            className="absolute top-0 cursor-pointer rounded-b-sm transition-colors duration-100"
            style={{
              left: key.position * whiteKeyWidth - 14,
              width: 26,
              height: 72,
              backgroundColor: activeKeys.has(key.note) ? "#c9a84c" : "#0e0d0c",
              zIndex: 2,
            }}
          />
        ))}
      </div>

      {/* 浮遊する音符アニメーション */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {["♩", "♪", "♫", "♬"].map((note, i) => (
          <span
            key={note}
            className="absolute animate-bounce text-[#c9a84c] opacity-60"
            style={{
              left: `${20 + i * 20}%`,
              top: `${10 + (i % 2) * 15}%`,
              fontSize: "1.2rem",
              animationDelay: `${i * 0.75}s`,
              animationDuration: "3s",
            }}
          >
            {note}
          </span>
        ))}
      </div>
    </div>
  );
}
