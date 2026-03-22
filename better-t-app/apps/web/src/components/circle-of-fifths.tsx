import { useState } from "react";

const MAJOR_KEYS = ["C", "G", "D", "A", "E", "B", "F#", "Db", "Ab", "Eb", "Bb", "F"];
const MINOR_KEYS = ["Am", "Em", "Bm", "F#m", "C#m", "G#m", "D#m", "Bbm", "Fm", "Cm", "Gm", "Dm"];

interface CircleOfFifthsProps {
  className?: string;
}

export function CircleOfFifths({ className = "" }: CircleOfFifthsProps) {
  const [hoveredSegment, setHoveredSegment] = useState<string | null>(null);

  const size = 280;
  const cx = size / 2;
  const cy = size / 2;
  const outerR = 120;
  const innerR = 75;
  const labelOuterR = 108;
  const labelInnerR = 60;
  const centerR = 40;

  const segments = 12;
  const angleStep = (2 * Math.PI) / segments;
  const startOffset = -Math.PI / 2;

  const getPath = (index: number, outerRadius: number, innerRadius: number) => {
    const startAngle = startOffset + index * angleStep;
    const endAngle = startAngle + angleStep;

    const x1 = cx + outerRadius * Math.cos(startAngle);
    const y1 = cy + outerRadius * Math.sin(startAngle);
    const x2 = cx + outerRadius * Math.cos(endAngle);
    const y2 = cy + outerRadius * Math.sin(endAngle);
    const x3 = cx + innerRadius * Math.cos(endAngle);
    const y3 = cy + innerRadius * Math.sin(endAngle);
    const x4 = cx + innerRadius * Math.cos(startAngle);
    const y4 = cy + innerRadius * Math.sin(startAngle);

    return `M ${x1} ${y1} A ${outerRadius} ${outerRadius} 0 0 1 ${x2} ${y2} L ${x3} ${y3} A ${innerRadius} ${innerRadius} 0 0 0 ${x4} ${y4} Z`;
  };

  const getLabelPos = (index: number, radius: number) => {
    const angle = startOffset + (index + 0.5) * angleStep;
    return {
      x: cx + radius * Math.cos(angle),
      y: cy + radius * Math.sin(angle),
    };
  };

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="drop-shadow-lg"
      >
        {/* 外周（長調） */}
        {MAJOR_KEYS.map((key, i) => {
          const isHovered = hoveredSegment === `major-${i}`;
          return (
            <g key={`major-${key}`}>
              <path
                d={getPath(i, outerR, innerR)}
                fill={isHovered ? "#c9a84c" : "#1a1714"}
                stroke="#2a2520"
                strokeWidth={1.5}
                style={{ cursor: "pointer", transition: "fill 0.15s" }}
                onMouseEnter={() => setHoveredSegment(`major-${i}`)}
                onMouseLeave={() => setHoveredSegment(null)}
              />
              <text
                {...getLabelPos(i, labelOuterR)}
                textAnchor="middle"
                dominantBaseline="middle"
                fill={isHovered ? "#0e0d0c" : "#f5f0e8"}
                fontSize={key.length > 1 ? 11 : 13}
                fontFamily="Playfair Display, serif"
                fontWeight="700"
                style={{ pointerEvents: "none" }}
              >
                {key}
              </text>
            </g>
          );
        })}

        {/* 内周（短調） */}
        {MINOR_KEYS.map((key, i) => {
          const isHovered = hoveredSegment === `minor-${i}`;
          return (
            <g key={`minor-${key}`}>
              <path
                d={getPath(i, innerR, centerR)}
                fill={isHovered ? "#e8cc87" : "#0e0d0c"}
                stroke="#2a2520"
                strokeWidth={1.5}
                style={{ cursor: "pointer", transition: "fill 0.15s" }}
                onMouseEnter={() => setHoveredSegment(`minor-${i}`)}
                onMouseLeave={() => setHoveredSegment(null)}
              />
              <text
                {...getLabelPos(i, labelInnerR)}
                textAnchor="middle"
                dominantBaseline="middle"
                fill={isHovered ? "#0e0d0c" : "#c9a84c"}
                fontSize={key.length > 2 ? 9 : 10}
                fontFamily="DM Sans, sans-serif"
                style={{ pointerEvents: "none" }}
              >
                {key}
              </text>
            </g>
          );
        })}

        {/* 中心ラベル */}
        <circle cx={cx} cy={cy} r={centerR - 2} fill="#0e0d0c" stroke="#2a2520" strokeWidth={1} />
        <text
          x={cx}
          y={cy - 6}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="#c9a84c"
          fontSize={8}
          fontFamily="Playfair Display, serif"
          fontStyle="italic"
        >
          五度圏
        </text>
        <text
          x={cx}
          y={cy + 8}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="#6b6356"
          fontSize={6}
          fontFamily="DM Sans, sans-serif"
        >
          Circle of Fifths
        </text>
      </svg>
    </div>
  );
}
