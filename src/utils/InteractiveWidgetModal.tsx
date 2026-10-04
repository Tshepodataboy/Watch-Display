import React from 'react';
import { ComplicationConfig, SimulatorSensors } from '../types/watchface';
import { 
  X, 
  Heart, 
  Battery, 
  Footprints, 
  Sun, 
  Calendar, 
  Flame, 
  Moon, 
  Activity,
  CheckCircle2,
  Clock,
  Zap
} from 'lucide-react';

interface InteractiveWidgetModalProps {
  complication: ComplicationConfig | null;
  sensors: SimulatorSensors;
  onClose: () => void;
}

export const InteractiveWidgetModal: React.FC<InteractiveWidgetModalProps> = ({
  complication,
  sensors,
  onClose,
}) => {
  if (!complication) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm bg-neutral-900 border border-neutral-800 rounded-3xl p-6 shadow-2xl text-neutral-100 overflow-hidden">
        {/* Top bar with close button */}
        <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-xs uppercase tracking-wider text-neutral-400 font-semibold font-mono">
              Smartwatch OS Simulator
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal content based on complication type */}
        <div className="py-4 space-y-4">
          {complication.type === 'heart_rate' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold font-mono text-rose-500 flex items-baseline gap-1">
                    <span>{sensors.heartRate}</span>
                    <span className="text-sm font-normal text-neutral-400">BPM</span>
                  </div>
                  <p className="text-xs text-neutral-400 mt-0.5">Measured 2 seconds ago</p>
                </div>
                <div className="p-3 bg-rose-500/10 rounded-2xl border border-rose-500/20 text-rose-500">
                  <Heart className="w-8 h-8 animate-pulse" />
                </div>
              </div>

              {/* Simulated ECG pulse wave */}
              <div className="bg-neutral-950 p-3 rounded-2xl border border-neutral-800">
                <div className="text-[11px] text-neutral-400 mb-1 flex justify-between">
                  <span>Live Photoplethysmography (PPG)</span>
                  <span className="text-emerald-400">Normal Sinus</span>
                </div>
                <svg viewBox="0 0 300 60" className="w-full h-12 stroke-rose-500 fill-none stroke-[2]">
                  <path d="M 0,30 L 50,30 L 60,10 L 70,50 L 80,30 L 130,30 L 140,10 L 150,50 L 160,30 L 210,30 L 220,10 L 230,50 L 240,30 L 300,30" />
                </svg>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-neutral-950 p-2.5 rounded-xl border border-neutral-800">
                  <span className="text-neutral-400 block">Resting Rate</span>
                  <span className="text-base font-semibold font-mono text-neutral-200">58 BPM</span>
                </div>
                <div className="bg-neutral-950 p-2.5 rounded-xl border border-neutral-800">
                  <span className="text-neutral-400 block">Heart Rate Zone</span>
                  <span className="text-base font-semibold font-mono text-amber-400">Aerobic (Zone 2)</span>
                </div>
              </div>
            </div>
          )}

          {complication.type === 'battery' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold font-mono text-amber-400 flex items-baseline gap-1">
                    <span>{sensors.battery}%</span>
                    {sensors.isCharging && <span className="text-xs text-emerald-400 font-sans">Charging</span>}
                  </div>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    Est. {Math.round((sensors.battery / 100) * 36)} hours remaining
                  </p>
                </div>
                <div className="p-3 bg-amber-500/10 rounded-2xl border border-amber-500/20 text-amber-400">
                  <Battery className="w-8 h-8" />
                </div>
              </div>

              {/* Battery level progress bar */}
              <div className="w-full bg-neutral-950 h-3 rounded-full border border-neutral-800 overflow-hidden p-0.5">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 rounded-full transition-all duration-300"
                  style={{ width: `${sensors.battery}%` }}
                />
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between p-2.5 bg-neutral-950 rounded-xl border border-neutral-800">
                  <span className="text-neutral-300">Ultra Battery Saver Mode</span>
                  <span className="px-2 py-0.5 rounded bg-neutral-800 text-neutral-400 font-mono">STANDBY</span>
                </div>
                <div className="flex items-center justify-between p-2.5 bg-neutral-950 rounded-xl border border-neutral-800">
                  <span className="text-neutral-300">Fast Wireless Qi Charge</span>
                  <span className="text-emerald-400 font-medium">Ready (15W)</span>
                </div>
              </div>
            </div>
          )}

          {complication.type === 'steps' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold font-mono text-emerald-400 flex items-baseline gap-1">
                    <span>{sensors.steps.toLocaleString()}</span>
                    <span className="text-sm font-normal text-neutral-400">/ 10,000</span>
                  </div>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    {Math.round((sensors.steps / sensors.stepGoal) * 100)}% of daily goal completed
                  </p>
                </div>
                <div className="p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 text-emerald-400">
                  <Footprints className="w-8 h-8" />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="bg-neutral-950 p-2.5 rounded-xl border border-neutral-800">
                  <span className="text-neutral-500 block">Distance</span>
                  <span className="font-semibold text-neutral-200 font-mono mt-0.5">
                    {((sensors.steps * 0.75) / 1000).toFixed(2)} km
                  </span>
                </div>
                <div className="bg-neutral-950 p-2.5 rounded-xl border border-neutral-800">
                  <span className="text-neutral-500 block">Active Time</span>
                  <span className="font-semibold text-neutral-200 font-mono mt-0.5">48 min</span>
                </div>
                <div className="bg-neutral-950 p-2.5 rounded-xl border border-neutral-800">
                  <span className="text-neutral-500 block">Floors</span>
                  <span className="font-semibold text-neutral-200 font-mono mt-0.5">14 fl</span>
                </div>
              </div>
            </div>
          )}

          {complication.type === 'weather' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold font-mono text-cyan-400 flex items-baseline gap-1">
                    <span>{sensors.weather.tempC}°C</span>
                    <span className="text-xs text-neutral-400 font-sans capitalize">{sensors.weather.condition}</span>
                  </div>
                  <p className="text-xs text-neutral-400 mt-0.5">{sensors.weather.location}</p>
                </div>
                <div className="p-3 bg-cyan-500/10 rounded-2xl border border-cyan-500/20 text-cyan-400">
                  <Sun className="w-8 h-8" />
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2 text-center text-xs">
                {['12:00', '14:00', '16:00', '18:00'].map((time, idx) => (
                  <div key={time} className="bg-neutral-950 p-2 rounded-xl border border-neutral-800">
                    <span className="text-[10px] text-neutral-500 block">{time}</span>
                    <span className="font-mono text-neutral-200 font-semibold mt-1 block">
                      {sensors.weather.tempC + idx - 1}°
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {(complication.type === 'date_window' || complication.type === 'day_date') && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-neutral-100">
                    {sensors.time.toLocaleDateString(undefined, {
                      weekday: 'long',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </div>
                  <p className="text-xs text-neutral-400 mt-0.5">Calendar & Reminders</p>
                </div>
                <div className="p-3 bg-neutral-800 rounded-2xl text-amber-400">
                  <Calendar className="w-7 h-7" />
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <div className="p-2.5 bg-neutral-950 rounded-xl border border-neutral-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-6 rounded bg-amber-500" />
                    <div>
                      <span className="font-semibold text-neutral-200 block">Design Review Meeting</span>
                      <span className="text-neutral-500">14:00 · Conference Room A</span>
                    </div>
                  </div>
                  <span className="font-mono text-neutral-400">In 45m</span>
                </div>
                <div className="p-2.5 bg-neutral-950 rounded-xl border border-neutral-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-6 rounded bg-emerald-500" />
                    <div>
                      <span className="font-semibold text-neutral-200 block">Daily 10k Steps Walk</span>
                      <span className="text-neutral-500">17:30 · Outdoor</span>
                    </div>
                  </div>
                  <span className="font-mono text-neutral-400">Scheduled</span>
                </div>
              </div>
            </div>
          )}

          {complication.type === 'moon_phase' && (
            <div className="space-y-3 text-center">
              <div className="w-20 h-20 mx-auto rounded-full bg-indigo-950/60 border border-indigo-500/30 flex items-center justify-center p-3">
                <Moon className="w-12 h-12 text-amber-300" />
              </div>
              <div>
                <h4 className="font-semibold text-base text-neutral-100">Waxing Gibbous</h4>
                <p className="text-xs text-neutral-400">Illumination: 84% · Next Full Moon: in 3 days</p>
              </div>
            </div>
          )}

          {complication.type === 'calories' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold font-mono text-orange-400 flex items-baseline gap-1">
                    <span>{sensors.calories}</span>
                    <span className="text-sm font-normal text-neutral-400">/ 600 kcal</span>
                  </div>
                  <p className="text-xs text-neutral-400 mt-0.5">Active energy burned today</p>
                </div>
                <div className="p-3 bg-orange-500/10 rounded-2xl border border-orange-500/20 text-orange-400">
                  <Flame className="w-8 h-8" />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bottom simulated button */}
        <button
          onClick={onClose}
          className="w-full mt-2 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-medium text-xs transition-colors"
        >
          Dismiss & Return to Watch Face
        </button>
      </div>
    </div>
  );
};
