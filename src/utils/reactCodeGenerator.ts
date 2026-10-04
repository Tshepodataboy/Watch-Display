import { WatchFaceConfig } from '../types/watchface';

export function generateReactComponentCode(config: WatchFaceConfig): string {
  const componentName = config.name.replace(/[^a-zA-Z0-9]/g, '') + 'WatchFace';
  
  return `import React, { useState, useEffect } from 'react';

// Auto-generated Watch Face Component: ${config.name}
// Created with Morokit Craft Watch Face Studio

export interface ${componentName}Props {
  size?: number;
  time?: Date;
  ambientMode?: boolean;
  batteryLevel?: number; // 0 - 100
  heartRate?: number; // bpm
  steps?: number;
  weatherTemp?: number;
}

export const ${componentName}: React.FC<${componentName}Props> = ({
  size = 400,
  time: propTime,
  ambientMode = false,
  batteryLevel = 84,
  heartRate = 72,
  steps = 8420,
  weatherTemp = 21,
}) => {
  const [internalTime, setInternalTime] = useState<Date>(new Date());

  useEffect(() => {
    if (propTime) return;
    const interval = setInterval(() => {
      setInternalTime(new Date());
    }, ${config.timeDisplay.analog.sweepSeconds ? 50 : 1000});
    return () => clearInterval(interval);
  }, [propTime]);

  const activeTime = propTime || internalTime;
  const hours = activeTime.getHours();
  const minutes = activeTime.getMinutes();
  const seconds = activeTime.getSeconds();
  const milliseconds = activeTime.getMilliseconds();

  const hourAngle = ((hours % 12) + minutes / 60) * 30;
  const minuteAngle = (minutes + seconds / 60) * 6;
  const secondAngle = seconds * 6 + (milliseconds * 0.006);

  return (
    <div style={{ width: size, height: size, position: 'relative' }}>
      <svg
        viewBox="0 0 450 450"
        width={size}
        height={size}
        style={{
          display: 'block',
          borderRadius: '${config.shape === 'round' ? '50%' : '24%'}',
          background: ambientMode ? '#000000' : '${config.dial.primaryColor}',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        }}
      >
        <defs>
          <radialGradient id="dialGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="${config.dial.secondaryColor}" />
            <stop offset="100%" stopColor="${config.dial.primaryColor}" />
          </radialGradient>
        </defs>

        {/* Dial Base */}
        <circle cx="225" cy="225" r="215" fill="url(#dialGrad)" />

        {/* Hour Indices */}
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = i * 30;
          return (
            <line
              key={i}
              x1="225"
              y1="25"
              x2="225"
              y2={i % 3 === 0 ? "45" : "35"}
              stroke="${config.index.color}"
              strokeWidth={i % 3 === 0 ? "4" : "2"}
              transform={\`rotate(\${angle} 225 225)\`}
            />
          );
        })}

        {/* Analog Hands */}
        {/* Hour Hand */}
        <line
          x1="225"
          y1="225"
          x2="225"
          y2="120"
          stroke="${config.timeDisplay.analog.hourHandColor}"
          strokeWidth="8"
          strokeLinecap="round"
          transform={\`rotate(\${hourAngle} 225 225)\`}
        />

        {/* Minute Hand */}
        <line
          x1="225"
          y1="225"
          x2="225"
          y2="60"
          stroke="${config.timeDisplay.analog.minuteHandColor}"
          strokeWidth="5"
          strokeLinecap="round"
          transform={\`rotate(\${minuteAngle} 225 225)\`}
        />

        {/* Second Hand */}
        {!ambientMode && (
          <line
            x1="225"
            y1="255"
            x2="225"
            y2="45"
            stroke="${config.timeDisplay.analog.secondHandColor}"
            strokeWidth="2"
            transform={\`rotate(\${secondAngle} 225 225)\`}
          />
        )}

        {/* Center Pivot Pin */}
        <circle
          cx="225"
          cy="225"
          r="${config.timeDisplay.analog.centerCapSize}"
          fill="${config.timeDisplay.analog.centerCapColor}"
        />
      </svg>
    </div>
  );
};

export default ${componentName};
`;
}
