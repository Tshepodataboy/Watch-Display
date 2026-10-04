import React from 'react';
import { SimulatorSensors } from '../types/watchface';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Moon, 
  Eye, 
  Zap, 
  Heart, 
  Footprints, 
  Flame, 
  Sun, 
  CloudSun, 
  CloudRain, 
  Snowflake,
  BatteryCharging,
  Sliders,
  Sparkles
} from 'lucide-react';

interface SensorSimulatorProps {
  sensors: SimulatorSensors;
  onChange: (sensors: SimulatorSensors) => void;
  viewMode: 'case' | 'standalone_dial';
  onViewModeChange: (mode: 'case' | 'standalone_dial') => void;
}

export const SensorSimulator: React.FC<SensorSimulatorProps> = ({
  sensors,
  onChange,
  viewMode,
  onViewModeChange,
}) => {
  const handleToggleLive = () => {
    onChange({
      ...sensors,
      isLive: !sensors.isLive,
      // If turning live back on, sync to real now
      time: !sensors.isLive ? new Date() : sensors.time,
    });
  };

  const handleTimeChange = (hours: number, minutes: number) => {
    const newTime = new Date(sensors.time);
    newTime.setHours(hours);
    newTime.setMinutes(minutes);
    onChange({
      ...sensors,
      time: newTime,
      isLive: false,
    });
  };

  const handleResetToNow = () => {
    onChange({
      ...sensors,
      time: new Date(),
      isLive: true,
    });
  };

  return (
    <div className="bg-neutral-900/90 backdrop-blur-md border border-neutral-800 rounded-2xl p-4 text-xs shadow-xl">
      <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-amber-500" />
          <span className="font-semibold text-neutral-200">Hardware & Sensor Simulator</span>
        </div>

        {/* View Mode & AOD / Night Quick Toggles */}
        <div className="flex items-center gap-2">
          {/* AOD Ambient Toggle */}
          <button
            onClick={() => onChange({ ...sensors, isAodActive: !sensors.isAodActive })}
            className={`px-2.5 py-1 rounded-lg border font-medium transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              sensors.isAodActive
                ? 'bg-amber-500 text-neutral-950 border-amber-400 font-semibold'
                : 'bg-neutral-800 text-neutral-400 border-neutral-700 hover:text-neutral-200'
            }`}
            title="Toggle Always-On Display (Ambient OLED Mode)"
          >
            <Moon className="w-3.5 h-3.5" />
            <span>AOD Mode</span>
          </button>

          {/* Tactical Night Vision */}
          <button
            onClick={() => onChange({ ...sensors, isNightVisionActive: !sensors.isNightVisionActive })}
            className={`px-2.5 py-1 rounded-lg border font-medium transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              sensors.isNightVisionActive
                ? 'bg-rose-600 text-white border-rose-500 font-semibold'
                : 'bg-neutral-800 text-neutral-400 border-neutral-700 hover:text-neutral-200'
            }`}
            title="Tactical Crimson Night Vision Mode"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Night Vision</span>
          </button>

          {/* Case vs Standalone Dial */}
          <div className="flex items-center bg-neutral-950 p-0.5 rounded-lg border border-neutral-800">
            <button
              onClick={() => onViewModeChange('case')}
              className={`px-2 py-0.5 rounded-md font-medium transition-colors ${
                viewMode === 'case'
                  ? 'bg-neutral-800 text-neutral-100'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              Watch Case
            </button>
            <button
              onClick={() => onViewModeChange('standalone_dial')}
              className={`px-2 py-0.5 rounded-md font-medium transition-colors ${
                viewMode === 'standalone_dial'
                  ? 'bg-neutral-800 text-neutral-100'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              Dial Only
            </button>
          </div>
        </div>
      </div>

      {/* Simulator Controls Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-3">
        {/* Time Simulator */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="font-medium flex items-center gap-1.5">
              <span>Time Scrubber</span>
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={handleToggleLive}
                className={`p-1 rounded border transition-colors ${
                  sensors.isLive
                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                    : 'bg-neutral-800 text-neutral-400 border-neutral-700 hover:text-neutral-200'
                }`}
                title={sensors.isLive ? 'Pause live ticking' : 'Resume live ticking'}
              >
                {sensors.isLive ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
              </button>
              <button
                onClick={handleResetToNow}
                className="p-1 rounded bg-neutral-800 text-neutral-400 border border-neutral-700 hover:text-neutral-200"
                title="Reset to current local time"
              >
                <RotateCcw className="w-3 h-3" />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="range"
              min="0"
              max="23"
              value={sensors.time.getHours()}
              onChange={(e) =>
                handleTimeChange(parseInt(e.target.value), sensors.time.getMinutes())
              }
              className="w-full accent-amber-500 bg-neutral-800 h-1.5 rounded-lg appearance-none cursor-pointer"
            />
            <span className="font-mono text-neutral-200 w-12 text-right">
              {sensors.time.getHours().toString().padStart(2, '0')}:
              {sensors.time.getMinutes().toString().padStart(2, '0')}
            </span>
          </div>
          <div className="flex items-center justify-between text-[11px] text-neutral-500">
            <span>00:00</span>
            <span>10:10 (Photogenic)</span>
            <span>23:59</span>
          </div>
        </div>

        {/* Heart Rate Simulator */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="font-medium flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5 text-rose-500" />
              <span>Heart Rate (BPM)</span>
            </span>
            <span className="font-mono text-rose-400 font-semibold">{sensors.heartRate} bpm</span>
          </div>
          <input
            type="range"
            min="45"
            max="180"
            value={sensors.heartRate}
            onChange={(e) => onChange({ ...sensors, heartRate: parseInt(e.target.value) })}
            className="w-full accent-rose-500 bg-neutral-800 h-1.5 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex items-center justify-between text-[11px] text-neutral-500">
            <span>Rest (55)</span>
            <span>Cardio (125)</span>
            <span>Peak (170)</span>
          </div>
        </div>

        {/* Steps Simulator */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="font-medium flex items-center gap-1.5">
              <Footprints className="w-3.5 h-3.5 text-emerald-400" />
              <span>Pedometer Steps</span>
            </span>
            <span className="font-mono text-emerald-400 font-semibold">
              {sensors.steps.toLocaleString()}
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="18000"
            step="200"
            value={sensors.steps}
            onChange={(e) => onChange({ ...sensors, steps: parseInt(e.target.value) })}
            className="w-full accent-emerald-500 bg-neutral-800 h-1.5 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex items-center justify-between text-[11px] text-neutral-500">
            <span>0</span>
            <span>Goal (10k)</span>
            <span>18,000</span>
          </div>
        </div>

        {/* Battery & Weather Simulator */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="font-medium flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Battery Level</span>
            </span>
            <span className="font-mono text-amber-400 font-semibold">{sensors.battery}%</span>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="range"
              min="5"
              max="100"
              value={sensors.battery}
              onChange={(e) => onChange({ ...sensors, battery: parseInt(e.target.value) })}
              className="w-full accent-amber-500 bg-neutral-800 h-1.5 rounded-lg appearance-none cursor-pointer"
            />
            <button
              onClick={() => onChange({ ...sensors, isCharging: !sensors.isCharging })}
              className={`p-1 rounded border transition-colors ${
                sensors.isCharging
                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                  : 'bg-neutral-800 text-neutral-500 border-neutral-700 hover:text-neutral-300'
              }`}
              title="Toggle Charging Status"
            >
              <BatteryCharging className="w-3 h-3" />
            </button>
          </div>

          {/* Weather Quick Selector */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-1">
              {(['sunny', 'partly_cloudy', 'rain', 'snow'] as const).map((cond) => (
                <button
                  key={cond}
                  onClick={() =>
                    onChange({
                      ...sensors,
                      weather: { ...sensors.weather, condition: cond },
                    })
                  }
                  className={`p-1 rounded transition-colors ${
                    sensors.weather.condition === cond
                      ? 'bg-neutral-800 text-neutral-100'
                      : 'text-neutral-500 hover:text-neutral-300'
                  }`}
                >
                  {cond === 'sunny' && <Sun className="w-3 h-3 text-amber-400" />}
                  {cond === 'partly_cloudy' && <CloudSun className="w-3 h-3 text-amber-300" />}
                  {cond === 'rain' && <CloudRain className="w-3 h-3 text-cyan-400" />}
                  {cond === 'snow' && <Snowflake className="w-3 h-3 text-indigo-300" />}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-1">
              <span className="text-neutral-400">Temp:</span>
              <input
                type="number"
                value={sensors.weather.tempC}
                onChange={(e) =>
                  onChange({
                    ...sensors,
                    weather: {
                      ...sensors.weather,
                      tempC: parseInt(e.target.value) || 0,
                    },
                  })
                }
                className="w-10 bg-neutral-800 border border-neutral-700 rounded px-1 text-center font-mono text-neutral-200"
              />
              <span className="text-neutral-400">°C</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
