import React from 'react';
import { WatchFaceConfig, SimulatorSensors, ComplicationConfig } from '../types/watchface';
import { WatchFaceRenderer } from './WatchFaceRenderer';

interface WatchCaseFrameProps {
  config: WatchFaceConfig;
  sensors: SimulatorSensors;
  size?: number; // canvas size
  onComplicationClick?: (comp: ComplicationConfig) => void;
  svgRef?: React.RefObject<SVGSVGElement | null>;
}

export const WatchCaseFrame: React.FC<WatchCaseFrameProps> = ({
  config,
  sensors,
  size = 460,
  onComplicationClick,
  svgRef,
}) => {
  const shape = config.shape;
  const finish = config.caseFinish;
  const strap = config.strap;

  // Case finish styling
  const getCaseFinishClasses = () => {
    switch (finish) {
      case 'titanium':
        return 'bg-gradient-to-b from-slate-600 via-slate-700 to-slate-800 border-slate-500 shadow-[0_20px_50px_rgba(0,0,0,0.8),inset_0_2px_4px_rgba(255,255,255,0.4)]';
      case 'obsidian':
        return 'bg-gradient-to-b from-neutral-800 via-neutral-900 to-black border-neutral-700 shadow-[0_25px_60px_rgba(0,0,0,0.9),inset_0_1px_2px_rgba(255,255,255,0.2)]';
      case 'stainless':
        return 'bg-gradient-to-tr from-slate-300 via-slate-100 to-slate-400 border-slate-200 shadow-[0_25px_60px_rgba(0,0,0,0.7),inset_0_2px_6px_rgba(255,255,255,0.8)]';
      case 'rosegold':
        return 'bg-gradient-to-b from-amber-700 via-rose-700 to-rose-900 border-amber-500/50 shadow-[0_25px_60px_rgba(0,0,0,0.8),inset_0_2px_4px_rgba(255,220,180,0.5)]';
      case 'ceramic':
        return 'bg-gradient-to-b from-slate-100 via-white to-slate-200 border-slate-300 shadow-[0_25px_60px_rgba(0,0,0,0.6),inset_0_2px_4px_rgba(255,255,255,1)]';
      case 'stealth_black':
      default:
        return 'bg-neutral-950 border-neutral-800 shadow-[0_25px_60px_rgba(0,0,0,0.95)]';
    }
  };

  // Outer bezel ring finish
  const getInnerBezelClasses = () => {
    switch (finish) {
      case 'titanium':
        return 'bg-slate-800 border-slate-600';
      case 'obsidian':
        return 'bg-neutral-900 border-neutral-800';
      case 'stainless':
        return 'bg-slate-200 border-slate-400';
      case 'rosegold':
        return 'bg-amber-950 border-rose-800';
      case 'ceramic':
        return 'bg-slate-50 border-slate-200';
      case 'stealth_black':
      default:
        return 'bg-neutral-900 border-neutral-800';
    }
  };

  // Strap styling (top & bottom lugs)
  const renderStraps = () => {
    if (strap === 'none') return null;

    let strapBg = 'bg-neutral-900';
    let strapPattern: React.ReactNode = null;

    if (strap === 'silicone_black') {
      strapBg = 'bg-neutral-900 border-neutral-800';
      strapPattern = (
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:6px_6px]" />
      );
    } else if (strap === 'silicone_orange') {
      strapBg = 'bg-orange-600 border-orange-700';
      strapPattern = (
        <div className="absolute inset-0 opacity-25 bg-[repeating-linear-gradient(45deg,#000_0,#000_2px,transparent_2px,transparent_8px)]" />
      );
    } else if (strap === 'leather_brown') {
      strapBg = 'bg-amber-900 border-amber-950';
      strapPattern = (
        <div className="absolute inset-0 border-x-2 border-dashed border-amber-200/30" />
      );
    } else if (strap === 'leather_black') {
      strapBg = 'bg-neutral-900 border-neutral-800';
      strapPattern = (
        <div className="absolute inset-0 border-x-2 border-dashed border-neutral-500/30" />
      );
    } else if (strap === 'nato_olive') {
      strapBg = 'bg-emerald-950 border-emerald-900';
      strapPattern = (
        <div className="absolute inset-0 flex justify-center">
          <div className="w-4 h-full bg-neutral-900 border-x border-emerald-800/40" />
        </div>
      );
    } else if (strap === 'titanium_link') {
      strapBg = 'bg-gradient-to-r from-slate-700 via-slate-600 to-slate-800 border-slate-600';
      strapPattern = (
        <div className="absolute inset-0 flex flex-col justify-between py-1">
          <div className="h-0.5 bg-black/40" />
          <div className="h-0.5 bg-black/40" />
          <div className="h-0.5 bg-black/40" />
        </div>
      );
    } else if (strap === 'milanese_silver') {
      strapBg = 'bg-slate-300 border-slate-400';
      strapPattern = (
        <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:3px_3px]" />
      );
    }

    const strapWidth = shape === 'square' ? 'w-52' : 'w-48';

    return (
      <>
        {/* Top Strap */}
        <div
          className={`absolute -top-24 left-1/2 -translate-x-1/2 ${strapWidth} h-28 rounded-t-xl overflow-hidden border-t border-x shadow-2xl -z-10 ${strapBg}`}
        >
          {strapPattern}
          {/* Subtle 3D gradient shade */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60" />
        </div>

        {/* Bottom Strap */}
        <div
          className={`absolute -bottom-24 left-1/2 -translate-x-1/2 ${strapWidth} h-28 rounded-b-xl overflow-hidden border-b border-x shadow-2xl -z-10 ${strapBg}`}
        >
          {strapPattern}
          <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-black/60" />
        </div>
      </>
    );
  };

  // Case Shape & Hardware Pushers
  return (
    <div className="relative flex items-center justify-center p-6">
      {/* Straps behind the case */}
      {renderStraps()}

      {/* Main Physical Watch Case */}
      <div
        className={`relative transition-all duration-300 p-2.5 ${
          shape === 'round'
            ? 'rounded-full'
            : shape === 'square'
            ? 'rounded-[58px]'
            : 'rounded-[46px]'
        } border-[3px] ${getCaseFinishClasses()}`}
        style={{
          width: size,
          height: size,
        }}
      >
        {/* Physical Digital Crown (at 2 or 3 o'clock) */}
        <div
          className={`absolute -right-3.5 top-1/3 -translate-y-1/2 w-4 h-12 rounded-r-md border border-l-0 shadow-lg ${
            finish === 'rosegold'
              ? 'bg-amber-600 border-amber-800'
              : finish === 'stainless'
              ? 'bg-slate-200 border-slate-400'
              : 'bg-neutral-800 border-neutral-700'
          }`}
        >
          {/* Knurled Ridges on Crown */}
          <div className="flex flex-col justify-between h-full py-1">
            <div className="h-0.5 bg-black/40" />
            <div className="h-0.5 bg-black/40" />
            <div className="h-0.5 bg-black/40" />
            <div className="h-0.5 bg-black/40" />
          </div>
        </div>

        {/* Secondary Pusher Button (at 4 o'clock) */}
        <div
          className={`absolute -right-2.5 top-2/3 -translate-y-1/2 w-3 h-8 rounded-r border border-l-0 ${
            finish === 'rosegold'
              ? 'bg-amber-700 border-amber-900'
              : finish === 'stainless'
              ? 'bg-slate-300 border-slate-400'
              : 'bg-neutral-800 border-neutral-700'
          }`}
        />

        {/* Left Microphone / Sensor port */}
        <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-1.5 h-3 rounded-l-full bg-neutral-900" />

        {/* Rugged Bezel Corner Screws (if rugged) */}
        {shape === 'rugged' && (
          <>
            <div className="absolute top-4 left-4 w-2.5 h-2.5 rounded-full bg-neutral-400 shadow-inner flex items-center justify-center">
              <div className="w-1.5 h-0.5 bg-neutral-800" />
            </div>
            <div className="absolute top-4 right-4 w-2.5 h-2.5 rounded-full bg-neutral-400 shadow-inner flex items-center justify-center">
              <div className="w-1.5 h-0.5 bg-neutral-800" />
            </div>
            <div className="absolute bottom-4 left-4 w-2.5 h-2.5 rounded-full bg-neutral-400 shadow-inner flex items-center justify-center">
              <div className="w-1.5 h-0.5 bg-neutral-800" />
            </div>
            <div className="absolute bottom-4 right-4 w-2.5 h-2.5 rounded-full bg-neutral-400 shadow-inner flex items-center justify-center">
              <div className="w-1.5 h-0.5 bg-neutral-800" />
            </div>
          </>
        )}

        {/* Inner Bezel Ring Frame */}
        <div
          className={`w-full h-full p-1.5 border overflow-hidden transition-all duration-300 ${
            shape === 'round'
              ? 'rounded-full'
              : shape === 'square'
              ? 'rounded-[50px]'
              : 'rounded-[38px]'
          } ${getInnerBezelClasses()}`}
        >
          {/* Inner Display Screen / Watch Face */}
          <div
            className={`w-full h-full relative overflow-hidden bg-black flex items-center justify-center ${
              shape === 'round'
                ? 'rounded-full'
                : shape === 'square'
                ? 'rounded-[44px]'
                : 'rounded-[34px]'
            }`}
          >
            <WatchFaceRenderer
              config={config}
              sensors={sensors}
              size={size - 40}
              interactive={true}
              onComplicationClick={onComplicationClick}
              svgRef={svgRef}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
