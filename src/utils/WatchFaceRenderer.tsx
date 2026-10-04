import React, { useMemo } from 'react';
import { 
  WatchFaceConfig, 
  SimulatorSensors, 
  ComplicationConfig 
} from '../types/watchface';
import { DIAL_TEXTURES } from '../utils/presets';
import { 
  Battery, 
  Heart, 
  Footprints, 
  Sun, 
  CloudSun, 
  CloudRain, 
  Snowflake, 
  Zap, 
  Flame, 
  Compass, 
  Globe 
} from 'lucide-react';

interface WatchFaceRendererProps {
  config: WatchFaceConfig;
  sensors: SimulatorSensors;
  size?: number; // pixel diameter
  interactive?: boolean;
  onComplicationClick?: (complication: ComplicationConfig) => void;
  svgRef?: React.RefObject<SVGSVGElement | null>;
  className?: string;
}

export const WatchFaceRenderer: React.FC<WatchFaceRendererProps> = ({
  config,
  sensors,
  size = 400,
  interactive = true,
  onComplicationClick,
  svgRef,
  className = '',
}) => {
  const isAod = sensors.isAodActive;
  const isNight = sensors.isNightVisionActive;

  // Active time calculations
  const time = sensors.time;
  const hours = time.getHours();
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();
  const milliseconds = time.getMilliseconds();

  const hourAngle = ((hours % 12) + minutes / 60 + seconds / 3600) * 30;
  const minuteAngle = (minutes + seconds / 60) * 6;
  const secondAngle = config.timeDisplay.analog.sweepSeconds
    ? (seconds + milliseconds / 1000) * 6
    : seconds * 6;

  // Center coordinate is 225, 225 in 450x450 coordinate system
  const CX = 225;
  const CY = 225;
  const DIAL_RADIUS = 210;

  // Color overrides for AOD or Night Vision
  const effectivePrimaryBg = useMemo(() => {
    if (isAod) return '#000000';
    if (isNight) return '#0a0303';
    return config.dial.primaryColor;
  }, [isAod, isNight, config.dial.primaryColor]);

  const effectiveAccent = useMemo(() => {
    if (isNight) return '#ef4444';
    return config.dial.accentColor;
  }, [isNight, config.dial.accentColor]);

  // Compute 60-minute tick geometry
  const ticks = useMemo(() => {
    return Array.from({ length: 60 }).map((_, i) => {
      const angle = (i * 6 * Math.PI) / 180;
      const isMajor = i % 5 === 0;
      const isCardinal = i % 15 === 0;

      const outerR = DIAL_RADIUS - 6;
      const innerR = isMajor
        ? outerR - (isCardinal ? 16 : 12)
        : outerR - 6;

      const x1 = CX + outerR * Math.sin(angle);
      const y1 = CY - outerR * Math.cos(angle);
      const x2 = CX + innerR * Math.sin(angle);
      const y2 = CY - innerR * Math.cos(angle);

      return {
        i,
        angle: i * 6,
        isMajor,
        isCardinal,
        x1,
        y1,
        x2,
        y2,
      };
    });
  }, [DIAL_RADIUS]);

  // Render Bezel markings
  const renderBezel = () => {
    const bezel = config.bezel;
    const style = bezel.style;
    if (style === 'clean') return null;

    const bezelR = 216;

    if (style === 'tachymeter') {
      const tachNumbers = [
        { label: '60', angle: 0 },
        { label: '65', angle: 30 },
        { label: '75', angle: 60 },
        { label: '90', angle: 90 },
        { label: '120', angle: 135 },
        { label: '150', angle: 170 },
        { label: '200', angle: 215 },
        { label: '300', angle: 260 },
        { label: '400', angle: 295 },
        { label: '500', angle: 330 },
      ];
      return (
        <g id="bezel-tachymeter" opacity={isAod ? 0.4 : 1}>
          <text
            x={CX}
            y={24}
            textAnchor="middle"
            fill={bezel.accentColor}
            fontSize="8"
            fontWeight="bold"
            letterSpacing="1"
            fontFamily="JetBrains Mono"
          >
            TACHYMÈTRE
          </text>
          {tachNumbers.map((item, idx) => {
            const rad = ((item.angle - 90) * Math.PI) / 180;
            const x = CX + (bezelR - 7) * Math.cos(rad);
            const y = CY + (bezelR - 7) * Math.sin(rad);
            return (
              <text
                key={idx}
                x={x}
                y={y}
                textAnchor="middle"
                dominantBaseline="central"
                fill={bezel.textColor}
                fontSize="7.5"
                fontWeight="600"
                fontFamily="JetBrains Mono"
                transform={`rotate(${item.angle} ${x} ${y})`}
              >
                {item.label}
              </text>
            );
          })}
        </g>
      );
    }

    if (style === 'diver60') {
      const markers = [10, 20, 30, 40, 50];
      return (
        <g id="bezel-diver" opacity={isAod ? 0.3 : 1}>
          {/* Lume pearl pip at 12 o'clock */}
          <polygon
            points={`${CX},${CY - bezelR + 1} ${CX - 7},${CY - bezelR + 12} ${CX + 7},${CY - bezelR + 12}`}
            fill={bezel.accentColor}
          />
          <circle cx={CX} cy={CY - bezelR + 8} r="3" fill="#ffffff" />
          {markers.map((num) => {
            const angle = num * 6;
            const rad = ((angle - 90) * Math.PI) / 180;
            const x = CX + (bezelR - 8) * Math.cos(rad);
            const y = CY + (bezelR - 8) * Math.sin(rad);
            return (
              <text
                key={num}
                x={x}
                y={y}
                textAnchor="middle"
                dominantBaseline="central"
                fill={bezel.textColor}
                fontSize="9"
                fontWeight="700"
                fontFamily="Plus Jakarta Sans"
                transform={`rotate(${angle} ${x} ${y})`}
              >
                {num}
              </text>
            );
          })}
        </g>
      );
    }

    if (style === 'compass') {
      const cardinals = [
        { label: 'N', angle: 0, color: bezel.accentColor },
        { label: 'E', angle: 90, color: bezel.textColor },
        { label: 'S', angle: 180, color: bezel.textColor },
        { label: 'W', angle: 270, color: bezel.textColor },
        { label: 'NE', angle: 45, color: bezel.textColor },
        { label: 'SE', angle: 135, color: bezel.textColor },
        { label: 'SW', angle: 225, color: bezel.textColor },
        { label: 'NW', angle: 315, color: bezel.textColor },
      ];
      return (
        <g id="bezel-compass" opacity={isAod ? 0.4 : 1}>
          {cardinals.map((item, idx) => {
            const rad = ((item.angle - 90) * Math.PI) / 180;
            const x = CX + (bezelR - 7) * Math.cos(rad);
            const y = CY + (bezelR - 7) * Math.sin(rad);
            return (
              <text
                key={idx}
                x={x}
                y={y}
                textAnchor="middle"
                dominantBaseline="central"
                fill={item.color}
                fontSize={item.label.length === 1 ? '9' : '7'}
                fontWeight="700"
                fontFamily="JetBrains Mono"
                transform={`rotate(${item.angle} ${x} ${y})`}
              >
                {item.label}
              </text>
            );
          })}
        </g>
      );
    }

    if (style === 'numbered_12') {
      return (
        <g id="bezel-numbered-12" opacity={isAod ? 0.4 : 1}>
          {Array.from({ length: 12 }).map((_, i) => {
            const num = i === 0 ? 12 : i;
            const angle = i * 30;
            const rad = ((angle - 90) * Math.PI) / 180;
            const x = CX + (bezelR - 7) * Math.cos(rad);
            const y = CY + (bezelR - 7) * Math.sin(rad);
            return (
              <text
                key={i}
                x={x}
                y={y}
                textAnchor="middle"
                dominantBaseline="central"
                fill={num === 12 ? bezel.accentColor : bezel.textColor}
                fontSize="9"
                fontWeight="700"
                fontFamily="Plus Jakarta Sans"
                transform={`rotate(${angle} ${x} ${y})`}
              >
                {num}
              </text>
            );
          })}
        </g>
      );
    }

    return null;
  };

  // Render Dial Numbers or Indices
  const renderIndices = () => {
    const indexConfig = config.index;
    if (indexConfig.style === 'none') return null;

    const indexR = DIAL_RADIUS - 30;
    const color = isNight ? '#ef4444' : indexConfig.color;
    const glow = isNight ? '#dc2626' : indexConfig.glowColor;

    if (indexConfig.style === 'arabic_sport' || indexConfig.style === 'roman_luxury') {
      const numbers =
        indexConfig.style === 'roman_luxury'
          ? ['XII', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI']
          : ['12', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11'];

      return (
        <g id="hour-numbers">
          {numbers.map((text, i) => {
            if (indexConfig.showCardinalsOnly && i % 3 !== 0) return null;
            const angle = i * 30;
            const rad = ((angle - 90) * Math.PI) / 180;
            const x = CX + indexR * Math.cos(rad);
            const y = CY + indexR * Math.sin(rad);
            const isCardinal = i % 3 === 0;

            return (
              <text
                key={i}
                x={x}
                y={y}
                textAnchor="middle"
                dominantBaseline="central"
                fill={color}
                fontSize={isCardinal ? 20 * indexConfig.numberScale : 15 * indexConfig.numberScale}
                fontWeight={indexConfig.style === 'roman_luxury' ? '600' : '700'}
                fontFamily={indexConfig.style === 'roman_luxury' ? 'Cinzel' : 'Plus Jakarta Sans'}
                style={{
                  filter: !isAod ? `drop-shadow(0 0 2px ${glow}40)` : undefined,
                }}
              >
                {text}
              </text>
            );
          })}
        </g>
      );
    }

    if (indexConfig.style === 'diver_dots') {
      return (
        <g id="diver-dots">
          {Array.from({ length: 12 }).map((_, i) => {
            const angle = i * 30;
            const rad = ((angle - 90) * Math.PI) / 180;
            const x = CX + indexR * Math.cos(rad);
            const y = CY + indexR * Math.sin(rad);

            if (i === 0) {
              // Inverted triangle at 12
              return (
                <polygon
                  key={i}
                  points={`${x},${y - 8} ${x - 7},${y + 8} ${x + 7},${y + 8}`}
                  fill={color}
                  stroke={glow}
                  strokeWidth="1.5"
                />
              );
            }
            if (i % 3 === 0) {
              // Rectangles at 3, 6, 9
              return (
                <rect
                  key={i}
                  x={x - 4}
                  y={y - 8}
                  width="8"
                  height="16"
                  rx="2"
                  fill={color}
                  stroke={glow}
                  strokeWidth="1"
                  transform={`rotate(${angle} ${x} ${y})`}
                />
              );
            }
            // Circular lume plots
            return (
              <circle
                key={i}
                cx={x}
                cy={y}
                r="5.5"
                fill={color}
                stroke={glow}
                strokeWidth="1"
              />
            );
          })}
        </g>
      );
    }

    if (indexConfig.style === 'military_24h') {
      return (
        <g id="military-indices">
          {Array.from({ length: 12 }).map((_, i) => {
            const num12 = i === 0 ? 12 : i;
            const num24 = i === 0 ? 24 : i + 12;
            const angle = i * 30;
            const rad = ((angle - 90) * Math.PI) / 180;
            const x1 = CX + indexR * Math.cos(rad);
            const y1 = CY + indexR * Math.sin(rad);
            const x2 = CX + (indexR - 18) * Math.cos(rad);
            const y2 = CY + (indexR - 18) * Math.sin(rad);

            return (
              <g key={i}>
                <text
                  x={x1}
                  y={y1}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill={color}
                  fontSize={14 * indexConfig.numberScale}
                  fontWeight="700"
                  fontFamily="Share Tech Mono"
                >
                  {num12}
                </text>
                {!isAod && (
                  <text
                    x={x2}
                    y={y2}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill={indexConfig.subMinuteColor}
                    fontSize={9 * indexConfig.numberScale}
                    fontWeight="600"
                    fontFamily="Share Tech Mono"
                  >
                    {num24}
                  </text>
                )}
              </g>
            );
          })}
        </g>
      );
    }

    // Default: classic_baton
    return (
      <g id="classic-baton">
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = i * 30;
          const rad = ((angle - 90) * Math.PI) / 180;
          const isCardinal = i % 3 === 0;
          const batonLen = isCardinal ? 18 : 12;
          const batonW = isCardinal ? 5 : 3.5;
          const x = CX + (indexR + 6) * Math.cos(rad);
          const y = CY + (indexR + 6) * Math.sin(rad);

          if (i === 0) {
            // Double baton at 12 o'clock
            return (
              <g key={i} transform={`rotate(${angle} ${CX} ${CY})`}>
                <rect
                  x={CX - 5}
                  y={CY - (indexR + 12)}
                  width="3"
                  height="16"
                  rx="1"
                  fill={color}
                />
                <rect
                  x={CX + 2}
                  y={CY - (indexR + 12)}
                  width="3"
                  height="16"
                  rx="1"
                  fill={color}
                />
              </g>
            );
          }

          return (
            <rect
              key={i}
              x={x - batonW / 2}
              y={y - batonLen / 2}
              width={batonW}
              height={batonLen}
              rx="1"
              fill={color}
              transform={`rotate(${angle} ${x} ${y})`}
            />
          );
        })}
      </g>
    );
  };

  // Render individual Complication
  const renderComplication = (comp: ComplicationConfig) => {
    // If in AOD and user configured to hide complications gauges
    if (isAod && config.aod.hideComplicationGauges && comp.style === 'ring_gauge') {
      return null;
    }

    // Map offset percentages to absolute coords
    const cx = CX + (comp.x * DIAL_RADIUS * 2) / 100;
    const cy = CY + (comp.y * DIAL_RADIUS * 2) / 100;
    const scale = comp.scale || 1.0;

    const compColor = isNight ? '#ef4444' : comp.color;
    const compAccent = isNight ? '#f87171' : comp.accentColor;

    let valueText = '';
    let percentage = 0;
    let iconElement: React.ReactNode = null;

    if (comp.type === 'battery') {
      valueText = `${Math.round(sensors.battery)}%`;
      percentage = sensors.battery / 100;
      iconElement = <Battery className="w-3.5 h-3.5" />;
    } else if (comp.type === 'heart_rate') {
      valueText = `${Math.round(sensors.heartRate)}`;
      percentage = Math.min(1, Math.max(0, (sensors.heartRate - 40) / 140));
      iconElement = (
        <Heart 
          className="w-3.5 h-3.5 fill-rose-500 text-rose-500 animate-pulse" 
          style={{ animationDuration: `${60 / sensors.heartRate}s` }} 
        />
      );
    } else if (comp.type === 'steps') {
      valueText = sensors.steps.toLocaleString();
      percentage = Math.min(1, sensors.steps / (sensors.stepGoal || 10000));
      iconElement = <Footprints className="w-3.5 h-3.5" />;
    } else if (comp.type === 'calories') {
      valueText = `${sensors.calories}`;
      percentage = Math.min(1, sensors.calories / (sensors.calorieGoal || 600));
      iconElement = <Flame className="w-3.5 h-3.5" />;
    } else if (comp.type === 'weather') {
      valueText = `${Math.round(sensors.weather.tempC)}°`;
      percentage = Math.min(1, Math.max(0, (sensors.weather.tempC + 10) / 50));
      if (sensors.weather.condition === 'sunny') iconElement = <Sun className="w-3.5 h-3.5 text-amber-400" />;
      else if (sensors.weather.condition === 'rain') iconElement = <CloudRain className="w-3.5 h-3.5 text-cyan-400" />;
      else if (sensors.weather.condition === 'snow') iconElement = <Snowflake className="w-3.5 h-3.5 text-indigo-200" />;
      else iconElement = <CloudSun className="w-3.5 h-3.5 text-amber-300" />;
    } else if (comp.type === 'date_window') {
      const day = time.getDate();
      return (
        <g
          key={comp.id}
          transform={`translate(${cx}, ${cy}) scale(${scale})`}
          className={interactive ? 'cursor-pointer hover:opacity-90 transition-opacity' : ''}
          onClick={() => onComplicationClick?.(comp)}
        >
          <rect
            x="-18"
            y="-12"
            width="36"
            height="24"
            rx="3"
            fill={isAod ? '#111' : '#ffffff'}
            stroke="#94a3b8"
            strokeWidth="1"
          />
          <text
            x="0"
            y="2"
            textAnchor="middle"
            dominantBaseline="central"
            fill={isAod ? '#ffffff' : '#0f172a'}
            fontSize="15"
            fontWeight="bold"
            fontFamily="JetBrains Mono"
          >
            {day < 10 ? `0${day}` : day}
          </text>
        </g>
      );
    } else if (comp.type === 'day_date') {
      const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
      const dayName = days[time.getDay()];
      const dayNum = time.getDate();
      return (
        <g
          key={comp.id}
          transform={`translate(${cx}, ${cy}) scale(${scale})`}
          className={interactive ? 'cursor-pointer hover:opacity-90 transition-opacity' : ''}
          onClick={() => onComplicationClick?.(comp)}
        >
          <rect
            x="-28"
            y="-11"
            width="56"
            height="22"
            rx="4"
            fill={isAod ? '#111' : '#1e293b'}
            stroke="#334155"
            strokeWidth="1"
          />
          <text
            x="-12"
            y="1"
            textAnchor="middle"
            dominantBaseline="central"
            fill={compAccent}
            fontSize="10"
            fontWeight="700"
            fontFamily="Plus Jakarta Sans"
          >
            {dayName}
          </text>
          <line x1="0" y1="-8" x2="0" y2="8" stroke="#475569" strokeWidth="1" />
          <text
            x="14"
            y="1"
            textAnchor="middle"
            dominantBaseline="central"
            fill={compColor}
            fontSize="12"
            fontWeight="bold"
            fontFamily="JetBrains Mono"
          >
            {dayNum}
          </text>
        </g>
      );
    } else if (comp.type === 'moon_phase') {
      return (
        <g
          key={comp.id}
          transform={`translate(${cx}, ${cy}) scale(${scale})`}
          className={interactive ? 'cursor-pointer hover:opacity-90 transition-opacity' : ''}
          onClick={() => onComplicationClick?.(comp)}
        >
          {/* Moon subdial frame */}
          <circle cx="0" cy="0" r="22" fill={isAod ? '#000000' : '#0c0f1d'} stroke={compColor} strokeWidth="1" />
          {/* Stars */}
          <circle cx="-10" cy="-8" r="0.8" fill="#ffffff" opacity="0.7" />
          <circle cx="12" cy="-6" r="0.6" fill="#ffffff" opacity="0.6" />
          <circle cx="-6" cy="11" r="0.7" fill="#ffffff" opacity="0.8" />
          {/* Moon Disc */}
          <circle cx="0" cy="0" r="11" fill="#1e2238" />
          <path
            d="M 0 -11 A 11 11 0 0 1 0 11 A 7 11 0 0 0 0 -11"
            fill={compAccent}
          />
          <text
            x="0"
            y="18"
            textAnchor="middle"
            fill={compColor}
            fontSize="7"
            fontFamily="Plus Jakarta Sans"
            fontWeight="600"
          >
            MOON
          </text>
        </g>
      );
    }

    // Gauge style: ring_gauge
    if (comp.style === 'ring_gauge') {
      const radius = 22;
      const circumference = 2 * Math.PI * radius;
      // 270 degree arc
      const arcLength = circumference * 0.75;
      const strokeDashoffset = arcLength * (1 - percentage);

      return (
        <g
          key={comp.id}
          transform={`translate(${cx}, ${cy}) scale(${scale})`}
          className={interactive ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''}
          onClick={() => onComplicationClick?.(comp)}
        >
          {/* Background sub-disc */}
          <circle cx="0" cy="0" r={radius + 4} fill={isAod ? '#000' : 'rgba(15, 23, 42, 0.45)'} />

          {/* Background track */}
          <circle
            cx="0"
            cy="0"
            r={radius}
            fill="none"
            stroke="rgba(255, 255, 255, 0.12)"
            strokeWidth="3.5"
            strokeDasharray={`${arcLength} ${circumference}`}
            strokeLinecap="round"
            transform="rotate(135)"
          />

          {/* Value Progress Arc */}
          <circle
            cx="0"
            cy="0"
            r={radius}
            fill="none"
            stroke={compAccent}
            strokeWidth="3.5"
            strokeDasharray={`${arcLength} ${circumference}`}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            transform="rotate(135)"
          />

          {/* Center value and label */}
          <text
            x="0"
            y="-2"
            textAnchor="middle"
            dominantBaseline="central"
            fill={compColor}
            fontSize="10"
            fontWeight="bold"
            fontFamily="JetBrains Mono"
          >
            {valueText}
          </text>
          {comp.label && (
            <text
              x="0"
              y="9"
              textAnchor="middle"
              dominantBaseline="central"
              fill={compAccent}
              fontSize="6.5"
              fontWeight="600"
              fontFamily="Plus Jakarta Sans"
              letterSpacing="0.5"
            >
              {comp.label}
            </text>
          )}
        </g>
      );
    }

    // Subdial style: analog miniature dial
    if (comp.style === 'subdial_analog') {
      const subdialAngle = percentage * 360;
      return (
        <g
          key={comp.id}
          transform={`translate(${cx}, ${cy}) scale(${scale})`}
          className={interactive ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''}
          onClick={() => onComplicationClick?.(comp)}
        >
          <circle
            cx="0"
            cy="0"
            r="24"
            fill={isAod ? '#000000' : 'rgba(15, 23, 42, 0.6)'}
            stroke="rgba(255, 255, 255, 0.15)"
            strokeWidth="1"
          />
          {/* Subdial radial ticks */}
          {Array.from({ length: 8 }).map((_, i) => (
            <line
              key={i}
              x1="0"
              y1="-22"
              x2="0"
              y2="-18"
              stroke="rgba(255, 255, 255, 0.3)"
              strokeWidth="1"
              transform={`rotate(${i * 45})`}
            />
          ))}
          {/* Mini needle */}
          <line
            x1="0"
            y1="5"
            x2="0"
            y2="-17"
            stroke={compAccent}
            strokeWidth="2"
            strokeLinecap="round"
            transform={`rotate(${subdialAngle})`}
          />
          <circle cx="0" cy="0" r="3" fill={compColor} />
          {comp.label && (
            <text
              x="0"
              y="13"
              textAnchor="middle"
              fill={compColor}
              fontSize="7"
              fontWeight="bold"
              fontFamily="Plus Jakarta Sans"
            >
              {comp.label}
            </text>
          )}
        </g>
      );
    }

    // Linear bar style
    if (comp.style === 'linear_bar') {
      const barW = 54;
      const barH = 5;
      return (
        <g
          key={comp.id}
          transform={`translate(${cx}, ${cy}) scale(${scale})`}
          className={interactive ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''}
          onClick={() => onComplicationClick?.(comp)}
        >
          <text
            x="-26"
            y="-6"
            fill={compColor}
            fontSize="8"
            fontWeight="bold"
            fontFamily="Plus Jakarta Sans"
          >
            {comp.label || comp.type.toUpperCase()}
          </text>
          <text
            x="26"
            y="-6"
            textAnchor="end"
            fill={compAccent}
            fontSize="8"
            fontWeight="bold"
            fontFamily="JetBrains Mono"
          >
            {valueText}
          </text>
          <rect
            x={-barW / 2}
            y="0"
            width={barW}
            height={barH}
            rx="2.5"
            fill="rgba(255, 255, 255, 0.12)"
          />
          <rect
            x={-barW / 2}
            y="0"
            width={Math.max(4, barW * percentage)}
            height={barH}
            rx="2.5"
            fill={compAccent}
          />
        </g>
      );
    }

    // Default: compact_badge
    return (
      <g
        key={comp.id}
        transform={`translate(${cx}, ${cy}) scale(${scale})`}
        className={interactive ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''}
        onClick={() => onComplicationClick?.(comp)}
      >
        <rect
          x="-30"
          y="-11"
          width="60"
          height="22"
          rx="5"
          fill={isAod ? '#09090b' : 'rgba(15, 23, 42, 0.7)'}
          stroke="rgba(255, 255, 255, 0.15)"
          strokeWidth="1"
        />
        <text
          x="0"
          y="1"
          textAnchor="middle"
          dominantBaseline="central"
          fill={compColor}
          fontSize="11"
          fontWeight="bold"
          fontFamily="JetBrains Mono"
        >
          {valueText}
        </text>
      </g>
    );
  };

  // Render Digital Clock Display
  const renderDigitalClock = () => {
    const digital = config.timeDisplay.digital;
    const format = digital.format;
    const font = digital.fontFamily;

    let displayHours = hours;
    let ampm = '';
    if (format === '12h') {
      ampm = hours >= 12 ? 'PM' : 'AM';
      displayHours = hours % 12 || 12;
    }

    const hh = displayHours < 10 ? `0${displayHours}` : `${displayHours}`;
    const mm = minutes < 10 ? `0${minutes}` : `${minutes}`;
    const ss = seconds < 10 ? `0${seconds}` : `${seconds}`;

    const colonVisible = !digital.blinkColon || seconds % 2 === 0;
    const colon = colonVisible ? ':' : ' ';

    let timeString = `${hh}${colon}${mm}`;
    if (digital.showSeconds && !isAod) {
      timeString += `${colon}${ss}`;
    }

    const cx = CX + (digital.x * DIAL_RADIUS * 2) / 100;
    const cy = CY + (digital.y * DIAL_RADIUS * 2) / 100;

    let fontClass = 'font-mono';
    if (font === 'orbitron') fontClass = 'font-[Orbitron]';
    else if (font === 'share_tech') fontClass = 'font-[Share_Tech_Mono]';
    else if (font === 'bebas') fontClass = 'font-[Bebas_Neue]';
    else if (font === 'cinzel') fontClass = 'font-[Cinzel]';
    else if (font === 'syne') fontClass = 'font-[Syne]';

    const textColor = isNight ? '#ef4444' : digital.textColor;
    const glowColor = isNight ? '#dc2626' : digital.glowColor;

    return (
      <g transform={`translate(${cx}, ${cy})`}>
        <text
          x="0"
          y="0"
          textAnchor="middle"
          dominantBaseline="central"
          fill={textColor}
          fontSize={digital.fontSize}
          fontWeight="700"
          letterSpacing={digital.letterSpacing}
          className={fontClass}
          style={{
            filter: !isAod ? `drop-shadow(0 0 6px ${glowColor}60)` : undefined,
          }}
        >
          {timeString}
        </text>
        {digital.showAmPm && ampm && (
          <text
            x={digital.fontSize * 1.3}
            y="-6"
            fill={glowColor}
            fontSize="9"
            fontWeight="bold"
            fontFamily="JetBrains Mono"
          >
            {ampm}
          </text>
        )}
      </g>
    );
  };

  // Render Analog Hands
  const renderAnalogHands = () => {
    const analog = config.timeDisplay.analog;
    const style = analog.handStyle;

    const hourColor = isNight ? '#ef4444' : analog.hourHandColor;
    const minColor = isNight ? '#ef4444' : analog.minuteHandColor;
    const secColor = isNight ? '#f59e0b' : analog.secondHandColor;
    const lume = isNight ? '#dc2626' : analog.lumeColor;

    const outlineOnly = isAod && config.aod.outlineHands;

    // Hand geometry lengths
    const hourLen = 95;
    const minLen = 145;
    const secLen = 160;

    const renderHandShape = (length: number, width: number, isHour: boolean) => {
      if (style === 'dauphine') {
        // Faceted 3D dauphine hand (half shaded, half highlighted)
        return (
          <g>
            {/* Left facet */}
            <polygon
              points={`0,0 -${width / 2},-${length * 0.3} 0,-${length} 0,0`}
              fill={outlineOnly ? 'none' : isHour ? hourColor : minColor}
              stroke={outlineOnly ? hourColor : '#1e293b'}
              strokeWidth={outlineOnly ? 2 : 0.5}
            />
            {/* Right facet (slight shadow/highlight) */}
            <polygon
              points={`0,0 ${width / 2},-${length * 0.3} 0,-${length} 0,0`}
              fill={outlineOnly ? 'none' : 'rgba(255,255,255,0.22)'}
            />
          </g>
        );
      }

      if (style === 'mercedes') {
        // Iconic diver hand
        return (
          <g>
            <line
              x1="0"
              y1="10"
              x2="0"
              y2={-length}
              stroke={isHour ? hourColor : minColor}
              strokeWidth={width}
              strokeLinecap="round"
            />
            {isHour && (
              <g transform={`translate(0, -${length * 0.65})`}>
                <circle cx="0" cy="0" r="10" fill={isHour ? hourColor : minColor} />
                <circle cx="0" cy="0" r="8" fill={lume} />
                <line x1="0" y1="-8" x2="0" y2="8" stroke={isHour ? hourColor : '#000'} strokeWidth="1.5" />
                <line x1="-7" y1="4" x2="7" y2="-4" stroke={isHour ? hourColor : '#000'} strokeWidth="1.5" />
                <line x1="-7" y1="-4" x2="7" y2="4" stroke={isHour ? hourColor : '#000'} strokeWidth="1.5" />
              </g>
            )}
          </g>
        );
      }

      if (style === 'skeleton') {
        // Hollowed-out skeleton luxury hand
        return (
          <path
            d={`M -${width / 2} 10 L -${width / 2} -${length * 0.3} L -${width / 3} -${length} L 0 -${length + 6} L ${width / 3} -${length} L ${width / 2} -${length * 0.3} L ${width / 2} 10 Z`}
            fill={outlineOnly ? 'none' : 'rgba(255,255,255,0.06)'}
            stroke={isHour ? hourColor : minColor}
            strokeWidth="2.5"
          />
        );
      }

      if (style === 'tactical_arrow') {
        return (
          <g>
            <line
              x1="0"
              y1="15"
              x2="0"
              y2={-length}
              stroke={isHour ? hourColor : minColor}
              strokeWidth={width}
              strokeLinecap="round"
            />
            {/* Arrowhead */}
            <polygon
              points={`0,-${length + 12} -${width * 1.5},-${length * 0.7} ${width * 1.5},-${length * 0.7}`}
              fill={lume}
              stroke={isHour ? hourColor : minColor}
              strokeWidth="1.5"
            />
          </g>
        );
      }

      if (style === 'minimal_needle') {
        return (
          <line
            x1="0"
            y1="20"
            x2="0"
            y2={-length}
            stroke={isHour ? hourColor : minColor}
            strokeWidth={isHour ? 3 : 2}
            strokeLinecap="round"
          />
        );
      }

      // Default: Baton with lume window
      return (
        <g>
          <rect
            x={-width / 2}
            y={-length}
            width={width}
            height={length + 15}
            rx="2"
            fill={outlineOnly ? 'none' : isHour ? hourColor : minColor}
            stroke={outlineOnly ? hourColor : 'none'}
            strokeWidth={outlineOnly ? 2 : 0}
          />
          {!outlineOnly && (
            <rect
              x={-width / 4}
              y={-length + 10}
              width={width / 2}
              height={length - 28}
              rx="1"
              fill={lume}
            />
          )}
        </g>
      );
    };

    return (
      <g id="analog-hands">
        {/* Subtle drop shadow for depth */}
        <defs>
          <filter id="handShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="2" dy="4" stdDeviation="3" floodOpacity="0.45" />
          </filter>
        </defs>

        {/* Hour Hand */}
        <g
          transform={`translate(${CX}, ${CY}) rotate(${hourAngle})`}
          filter={!isAod ? 'url(#handShadow)' : undefined}
        >
          {renderHandShape(hourLen, 9, true)}
        </g>

        {/* Minute Hand */}
        <g
          transform={`translate(${CX}, ${CY}) rotate(${minuteAngle})`}
          filter={!isAod ? 'url(#handShadow)' : undefined}
        >
          {renderHandShape(minLen, 6.5, false)}
        </g>

        {/* Second Hand (hidden in AOD if hideSeconds is true) */}
        {analog.showSeconds && !(isAod && config.aod.hideSeconds) && (
          <g transform={`translate(${CX}, ${CY}) rotate(${secondAngle})`}>
            {/* Counterbalance tail */}
            <line
              x1="0"
              y1="32"
              x2="0"
              y2={-secLen}
              stroke={secColor}
              strokeWidth="1.6"
              strokeLinecap="round"
            />
            {/* Lollipop balance circle */}
            <circle cx="0" cy="18" r="4.5" fill={secColor} />
            <circle cx="0" cy={-secLen * 0.72} r="4" fill={secColor} />
            <circle cx="0" cy={-secLen * 0.72} r="2" fill="#ffffff" />
          </g>
        )}

        {/* Center Pivot Pin */}
        <circle
          cx={CX}
          cy={CY}
          r={analog.centerCapSize}
          fill={isNight ? '#ef4444' : analog.centerCapColor}
          stroke="#0f172a"
          strokeWidth="1.5"
        />
        <circle cx={CX} cy={CY} r="2.5" fill="#ffffff" opacity="0.6" />
      </g>
    );
  };

  // Dial Texture URL or Gradient fill
  const backgroundType = config.dial.backgroundType;

  return (
    <div 
      className={`relative select-none flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        ref={svgRef}
        viewBox="0 0 450 450"
        width={size}
        height={size}
        className="w-full h-full transition-transform duration-200"
      >
        <defs>
          {/* Radial Dial Gradient */}
          <radialGradient id="dialRadial" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={config.dial.secondaryColor} />
            <stop offset="85%" stopColor={config.dial.primaryColor} />
            <stop offset="100%" stopColor="#050608" />
          </radialGradient>

          {/* Linear Gradient */}
          <linearGradient id="dialLinear" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={config.dial.secondaryColor} />
            <stop offset="100%" stopColor={config.dial.primaryColor} />
          </linearGradient>

          {/* Glass Glare Sheen */}
          <linearGradient id="glassGlare" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity={config.bezel.glareIntensity} />
            <stop offset="38%" stopColor="#ffffff" stopOpacity={config.bezel.glareIntensity * 0.4} />
            <stop offset="42%" stopColor="#ffffff" stopOpacity="0" />
            <stop offset="85%" stopColor="#ffffff" stopOpacity="0" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity={config.bezel.glareIntensity * 0.15} />
          </linearGradient>

          {/* Guilloche Pattern */}
          <pattern id="guillochePattern" width="20" height="20" patternUnits="userSpaceOnUse">
            <path
              d="M 0 10 Q 5 0, 10 10 T 20 10 M 0 0 Q 10 10, 20 0"
              fill="none"
              stroke="rgba(255, 255, 255, 0.04)"
              strokeWidth="0.8"
            />
          </pattern>

          {/* Minimal Grid Pattern */}
          <pattern id="tacticalGrid" width="25" height="25" patternUnits="userSpaceOnUse">
            <path
              d="M 25 0 L 0 0 0 25"
              fill="none"
              stroke="rgba(255, 255, 255, 0.05)"
              strokeWidth="0.8"
            />
          </pattern>

          {/* Circular Clip for Dial */}
          <clipPath id="dialClip">
            {config.shape === 'round' ? (
              <circle cx={CX} cy={CY} r={DIAL_RADIUS} />
            ) : config.shape === 'square' ? (
              <rect x="25" y="25" width="400" height="400" rx="90" />
            ) : (
              // Rugged octagonal clip
              <polygon
                points="110,25 340,25 425,110 425,340 340,425 110,425 25,340 25,110"
              />
            )}
          </clipPath>
        </defs>

        {/* Dial Base Container */}
        <g clipPath="url(#dialClip)">
          {/* Base Background Color */}
          <rect
            x="0"
            y="0"
            width="450"
            height="450"
            fill={effectivePrimaryBg}
          />

          {/* Texture Image Layer (if carbon_fiber, brushed_titanium, cosmic_nebula) */}
          {!isAod && backgroundType === 'carbon_fiber' && (
            <image
              href={DIAL_TEXTURES.carbon_fiber}
              x="0"
              y="0"
              width="450"
              height="450"
              preserveAspectRatio="xMidYMid slice"
              opacity={0.88}
            />
          )}

          {!isAod && backgroundType === 'brushed_titanium' && (
            <image
              href={DIAL_TEXTURES.brushed_titanium}
              x="0"
              y="0"
              width="450"
              height="450"
              preserveAspectRatio="xMidYMid slice"
              opacity={0.92}
            />
          )}

          {!isAod && backgroundType === 'cosmic_nebula' && (
            <image
              href={DIAL_TEXTURES.cosmic_nebula}
              x="0"
              y="0"
              width="450"
              height="450"
              preserveAspectRatio="xMidYMid slice"
              opacity={0.95}
            />
          )}

          {/* Procedural background patterns */}
          {!isAod && backgroundType === 'radial_gradient' && (
            <rect x="0" y="0" width="450" height="450" fill="url(#dialRadial)" />
          )}

          {!isAod && backgroundType === 'linear_gradient' && (
            <rect x="0" y="0" width="450" height="450" fill="url(#dialLinear)" />
          )}

          {!isAod && backgroundType === 'guilloche' && (
            <rect x="0" y="0" width="450" height="450" fill="url(#guillochePattern)" />
          )}

          {!isAod && backgroundType === 'minimal_grid' && (
            <rect x="0" y="0" width="450" height="450" fill="url(#tacticalGrid)" />
          )}

          {/* Sunburst radial lines */}
          {!isAod && backgroundType === 'sunburst' && (
            <g opacity="0.12">
              {Array.from({ length: 72 }).map((_, i) => (
                <line
                  key={i}
                  x1={CX}
                  y1={CY}
                  x2={CX + DIAL_RADIUS * Math.cos((i * 5 * Math.PI) / 180)}
                  y2={CY + DIAL_RADIUS * Math.sin((i * 5 * Math.PI) / 180)}
                  stroke="#ffffff"
                  strokeWidth="0.8"
                />
              ))}
            </g>
          )}

          {/* Inner Ring groove */}
          {config.dial.showInnerRing && (
            <circle
              cx={CX}
              cy={CY}
              r={(DIAL_RADIUS * config.dial.innerRingRadius) / 100}
              fill="none"
              stroke={config.dial.innerRingColor}
              strokeWidth="1.2"
              opacity={isAod ? 0.2 : 0.6}
            />
          )}

          {/* Vignette Shadow */}
          {!isAod && config.dial.vignette > 0 && (
            <radialGradient id="vignetteGrad" cx="50%" cy="50%" r="50%">
              <stop offset="60%" stopColor="#000000" stopOpacity="0" />
              <stop offset="100%" stopColor="#000000" stopOpacity={config.dial.vignette} />
            </radialGradient>
          )}
          {!isAod && config.dial.vignette > 0 && (
            <rect x="0" y="0" width="450" height="450" fill="url(#vignetteGrad)" />
          )}

          {/* Outer Bezel Markings */}
          {renderBezel()}

          {/* Minute Ticks */}
          <g id="minute-ticks" opacity={isAod ? 0.3 : 1}>
            {ticks.map((t) => {
              if (!config.index.showSubMinutes && !t.isMajor) return null;
              return (
                <line
                  key={t.i}
                  x1={t.x1}
                  y1={t.y1}
                  x2={t.x2}
                  y2={t.y2}
                  stroke={t.isMajor ? config.index.color : config.index.subMinuteColor}
                  strokeWidth={t.isMajor ? (t.isCardinal ? 2.5 : 2) : 1}
                  strokeLinecap="round"
                />
              );
            })}
          </g>

          {/* Hour Indices (Arabic, Roman, Batons, etc.) */}
          {renderIndices()}

          {/* Brand Logo & Horology Monogram */}
          {config.brandText.show && !isAod && (
            <g
              transform={`translate(${CX}, ${CY + (config.brandText.y * DIAL_RADIUS * 2) / 100})`}
            >
              <text
                x="0"
                y="0"
                textAnchor="middle"
                dominantBaseline="central"
                fill={config.brandText.color}
                fontSize="11"
                fontWeight="800"
                fontFamily="Syne"
                letterSpacing="3"
              >
                {config.brandText.text}
              </text>
              {config.brandText.subtext && (
                <text
                  x="0"
                  y="12"
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill={config.brandText.color}
                  opacity="0.65"
                  fontSize="6.5"
                  fontWeight="600"
                  fontFamily="Plus Jakarta Sans"
                  letterSpacing="1.5"
                >
                  {config.brandText.subtext}
                </text>
              )}
            </g>
          )}

          {/* Complications */}
          <g id="complications">
            {config.complications.map((comp) => renderComplication(comp))}
          </g>

          {/* Digital Time Display (if digital or hybrid) */}
          {(config.timeDisplay.type === 'digital' || config.timeDisplay.type === 'hybrid') &&
            renderDigitalClock()}

          {/* Analog Hands (if analog or hybrid) */}
          {(config.timeDisplay.type === 'analog' || config.timeDisplay.type === 'hybrid') &&
            renderAnalogHands()}

          {/* Crystal Glass Glare Reflection Sheen */}
          {config.bezel.showGlassGlare && !isAod && (
            <path
              d={`M 25,25 Q 225,50 425,120 L 425,25 Z`}
              fill="url(#glassGlare)"
              opacity="0.8"
              pointerEvents="none"
            />
          )}
        </g>
      </svg>
    </div>
  );
};
