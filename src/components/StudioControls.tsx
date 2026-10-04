import React, { useState } from 'react';
import { 
  WatchFaceConfig, 
  WatchShape, 
  CaseFinish, 
  StrapType, 
  BezelStyle,
  DialBackgroundType
} from '../types/watchface';
import { PRESET_WATCH_FACES } from '../utils/presets';
import { COLOR_PALETTES, ColorPalette } from '../utils/colorPalettes';
import { 
  Sparkles, 
  Watch, 
  Palette, 
  Check,
  Shield,
  Layers,
  Circle,
  Square,
  Octagon,
  Clock
} from 'lucide-react';

interface StudioControlsProps {
  config: WatchFaceConfig;
  onChange: (config: WatchFaceConfig) => void;
  selectedComplicationId: string | null;
  onSelectComplication: (id: string | null) => void;
}

export const StudioControls: React.FC<StudioControlsProps> = ({
  config,
  onChange,
}) => {
  const [activeTab, setActiveTab] = useState<'faces' | 'hardware' | 'style'>('faces');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const update = (partial: Partial<WatchFaceConfig>) => {
    onChange({ ...config, ...partial });
  };

  const applyPalette = (palette: ColorPalette) => {
    onChange({
      ...config,
      bezel: {
        ...config.bezel,
        bezelColor: palette.bezel,
        accentColor: palette.accent,
      },
      dial: {
        ...config.dial,
        primaryColor: palette.primary,
        secondaryColor: palette.secondary,
        accentColor: palette.accent,
      },
      index: {
        ...config.index,
        color: '#f8fafc',
        glowColor: palette.lume,
      },
      timeDisplay: {
        ...config.timeDisplay,
        analog: {
          ...config.timeDisplay.analog,
          hourHandColor: '#f8fafc',
          minuteHandColor: '#e2e8f0',
          secondHandColor: palette.accent,
          lumeColor: palette.lume,
          centerCapColor: palette.accent,
        },
        digital: {
          ...config.timeDisplay.digital,
          textColor: palette.accent,
          glowColor: palette.lume,
        },
      },
    });
  };

  // Filtered watch faces
  const filteredFaces = PRESET_WATCH_FACES.filter((face) => {
    return selectedCategory === 'All' || face.category === selectedCategory;
  });

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-3xl flex flex-col h-full max-h-full shadow-2xl overflow-hidden text-xs">
      {/* Streamlined Tab Navigation - 3 High-Impact Tabs */}
      <div className="grid grid-cols-3 p-2 bg-neutral-950/80 border-b border-neutral-800 gap-1.5 shrink-0">
        <button
          onClick={() => setActiveTab('faces')}
          className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl font-semibold transition-all ${
            activeTab === 'faces'
              ? 'bg-amber-500 text-neutral-950 shadow-md shadow-amber-500/20'
              : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/60'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span className="text-xs">Watch Faces</span>
        </button>

        <button
          onClick={() => setActiveTab('hardware')}
          className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl font-semibold transition-all ${
            activeTab === 'hardware'
              ? 'bg-amber-500 text-neutral-950 shadow-md shadow-amber-500/20'
              : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/60'
          }`}
        >
          <Watch className="w-4 h-4" />
          <span className="text-xs">Shape & Bands</span>
        </button>

        <button
          onClick={() => setActiveTab('style')}
          className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl font-semibold transition-all ${
            activeTab === 'style'
              ? 'bg-amber-500 text-neutral-950 shadow-md shadow-amber-500/20'
              : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/60'
          }`}
        >
          <Palette className="w-4 h-4" />
          <span className="text-xs">Color & Dial</span>
        </button>
      </div>

      {/* Main Tab Panels */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* ===================== TAB 1: WATCH FACES GALLERY ===================== */}
        {activeTab === 'faces' && (
          <div className="space-y-4">
            {/* Category Filter Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {['All', 'Luxury', 'Sport', 'Digital', 'Minimal', 'Vintage'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl font-medium whitespace-nowrap transition-colors ${
                    selectedCategory === cat
                      ? 'bg-neutral-100 text-neutral-950 font-semibold'
                      : 'bg-neutral-950 text-neutral-400 hover:text-neutral-200 border border-neutral-800/80'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Watch Face Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {filteredFaces.map((face) => {
                const isSelected = face.name === config.name;
                return (
                  <button
                    key={face.id}
                    onClick={() => {
                      // Preserve user's current hardware case, shape, and strap when switching face dials!
                      onChange({
                        ...face,
                        id: `face-${Date.now()}`,
                        shape: config.shape,
                        caseFinish: config.caseFinish,
                        strap: config.strap,
                      });
                    }}
                    className={`relative text-left p-3.5 rounded-2xl border transition-all flex flex-col justify-between group ${
                      isSelected
                        ? 'bg-amber-500/10 border-amber-500/80 ring-1 ring-amber-500/50 shadow-xl'
                        : 'bg-neutral-950/60 border-neutral-800/80 hover:border-neutral-700 hover:bg-neutral-800/40'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-bold text-neutral-100 text-sm group-hover:text-amber-400 transition-colors">
                          {face.name}
                        </span>
                        {isSelected && (
                          <div className="w-5 h-5 rounded-full bg-amber-500 text-neutral-950 flex items-center justify-center shrink-0">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                        )}
                      </div>

                      <p className="text-neutral-400 text-xs line-clamp-2 leading-relaxed">
                        {face.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 mt-3 pt-2.5 border-t border-neutral-800/60 text-[11px]">
                      <span className="px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800 font-mono text-neutral-300">
                        {face.timeDisplay.type.toUpperCase()}
                      </span>
                      <span className="text-neutral-500 capitalize">{face.category}</span>
                      <span className="text-neutral-600">·</span>
                      <span className="text-neutral-500 capitalize">{face.dial.backgroundType.replace('_', ' ')}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ===================== TAB 2: SHAPE, BANDS & MATERIALS ===================== */}
        {activeTab === 'hardware' && (
          <div className="space-y-6">
            {/* 1. Watch Shape */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-neutral-200 text-sm flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-amber-500" />
                  <span>Case Form Factor / Shape</span>
                </span>
                <span className="text-neutral-500 capitalize font-mono">{config.shape} 45mm</span>
              </div>

              <div className="grid grid-cols-3 gap-2.5">
                {[
                  { id: 'round', label: 'Classic Round', icon: Circle, desc: 'Galaxy / Pixel 45mm' },
                  { id: 'square', label: 'Curved Square', icon: Square, desc: 'Apple Watch Ultra' },
                  { id: 'rugged', label: 'Rugged Octagon', icon: Octagon, desc: 'Garmin / G-Shock' },
                ].map((item) => {
                  const Icon = item.icon;
                  const isSelected = config.shape === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => update({ shape: item.id as WatchShape })}
                      className={`p-3.5 rounded-2xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                        isSelected
                          ? 'bg-amber-500/15 text-amber-400 border-amber-500 ring-1 ring-amber-500/40 shadow-lg'
                          : 'bg-neutral-950/70 text-neutral-400 border-neutral-800 hover:text-neutral-200 hover:border-neutral-700'
                      }`}
                    >
                      <Icon className={`w-6 h-6 ${isSelected ? 'text-amber-400' : 'text-neutral-400'}`} />
                      <span className="font-semibold text-xs text-neutral-100">{item.label}</span>
                      <span className="text-[10px] text-neutral-500">{item.desc}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Case Materials & Finishes */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-neutral-200 text-sm flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-amber-500" />
                  <span>Case Metal & Finish</span>
                </span>
                <span className="text-neutral-500 capitalize font-mono">{config.caseFinish.replace('_', ' ')}</span>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {[
                  {
                    id: 'titanium',
                    label: 'Titanium',
                    swatch: 'from-slate-500 to-slate-700 border-slate-400',
                  },
                  {
                    id: 'obsidian',
                    label: 'Obsidian DLC',
                    swatch: 'from-neutral-800 to-black border-neutral-700',
                  },
                  {
                    id: 'stainless',
                    label: 'Mirror Steel',
                    swatch: 'from-slate-200 to-slate-400 border-slate-100',
                  },
                  {
                    id: 'rosegold',
                    label: 'Rose Gold',
                    swatch: 'from-amber-600 to-rose-700 border-rose-400',
                  },
                  {
                    id: 'ceramic',
                    label: 'Ceramic',
                    swatch: 'from-white to-slate-200 border-slate-300',
                  },
                  {
                    id: 'stealth_black',
                    label: 'Stealth Black',
                    swatch: 'from-neutral-900 to-neutral-950 border-neutral-800',
                  },
                ].map((item) => {
                  const isSelected = config.caseFinish === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => update({ caseFinish: item.id as CaseFinish })}
                      className={`p-2.5 rounded-2xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                        isSelected
                          ? 'bg-amber-500/10 border-amber-500 ring-1 ring-amber-500/40 shadow-lg'
                          : 'bg-neutral-950/70 border-neutral-800 hover:border-neutral-700'
                      }`}
                    >
                      <div
                        className={`w-7 h-7 rounded-full bg-gradient-to-tr ${item.swatch} border shadow-inner flex items-center justify-center`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5 text-amber-300 drop-shadow stroke-[3]" />}
                      </div>
                      <span className="font-medium text-[11px] text-neutral-300 line-clamp-1">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Watch Bands & Straps */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-neutral-200 text-sm flex items-center gap-1.5">
                  <Watch className="w-4 h-4 text-amber-500" />
                  <span>Watch Band / Strap</span>
                </span>
                <span className="text-neutral-500 capitalize font-mono">{config.strap.replace('_', ' ')}</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  {
                    id: 'silicone_black',
                    label: 'Black Silicone',
                    color: 'bg-neutral-900 border-neutral-700',
                    tag: 'Sports',
                  },
                  {
                    id: 'silicone_orange',
                    label: 'Orange Action',
                    color: 'bg-orange-600 border-orange-500',
                    tag: 'Adventure',
                  },
                  {
                    id: 'leather_brown',
                    label: 'Vintage Leather',
                    color: 'bg-amber-900 border-amber-800',
                    tag: 'Saddle',
                  },
                  {
                    id: 'leather_black',
                    label: 'Stitched Black',
                    color: 'bg-neutral-900 border-neutral-600',
                    tag: 'Formal',
                  },
                  {
                    id: 'nato_olive',
                    label: 'Tactical NATO',
                    color: 'bg-emerald-950 border-emerald-800',
                    tag: 'Military',
                  },
                  {
                    id: 'titanium_link',
                    label: 'Titanium Link',
                    color: 'bg-slate-700 border-slate-500',
                    tag: '3-Link',
                  },
                  {
                    id: 'milanese_silver',
                    label: 'Milanese Mesh',
                    color: 'bg-slate-300 border-slate-400',
                    tag: 'Steel Loop',
                  },
                  {
                    id: 'none',
                    label: 'Case Only',
                    color: 'bg-neutral-950 border-neutral-800',
                    tag: 'Naked',
                  },
                ].map((item) => {
                  const isSelected = config.strap === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => update({ strap: item.id as StrapType })}
                      className={`p-2.5 rounded-xl border text-left transition-all flex items-center gap-2.5 ${
                        isSelected
                          ? 'bg-amber-500/10 border-amber-500 ring-1 ring-amber-500/40 shadow-md'
                          : 'bg-neutral-950/70 border-neutral-800 hover:border-neutral-700'
                      }`}
                    >
                      <div className={`w-5 h-7 rounded ${item.color} border shrink-0`} />
                      <div className="overflow-hidden">
                        <span className="font-semibold text-xs text-neutral-200 block truncate">
                          {item.label}
                        </span>
                        <span className="text-[10px] text-neutral-500">{item.tag}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ===================== TAB 3: DIAL, COLOR & BEZEL ===================== */}
        {activeTab === 'style' && (
          <div className="space-y-6">
            {/* 1. Quick Color Palette Harmonies */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-neutral-200 text-sm flex items-center gap-1.5">
                  <Palette className="w-4 h-4 text-amber-500" />
                  <span>1-Click Color & Lume Schemes</span>
                </span>
                <span className="text-neutral-500 text-[11px]">Instant restyling</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {COLOR_PALETTES.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => applyPalette(p)}
                    className="p-2.5 bg-neutral-950/70 border border-neutral-800 rounded-xl hover:border-amber-500/60 transition-all text-left group"
                  >
                    <div className="flex items-center gap-1 h-3.5 mb-2">
                      <div className="h-full flex-1 rounded-sm" style={{ backgroundColor: p.primary }} />
                      <div className="h-full flex-1 rounded-sm" style={{ backgroundColor: p.secondary }} />
                      <div className="h-full flex-1 rounded-sm" style={{ backgroundColor: p.accent }} />
                      <div className="h-full flex-1 rounded-sm" style={{ backgroundColor: p.lume }} />
                    </div>
                    <span className="font-semibold text-neutral-200 text-[11px] block truncate group-hover:text-amber-400">
                      {p.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Clock Display Mode */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-neutral-200 text-sm flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-amber-500" />
                  <span>Display Engine Mechanism</span>
                </span>
                <span className="text-neutral-500 font-mono capitalize">{config.timeDisplay.type}</span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'analog', label: 'Analog Hands', desc: 'Mechanical Horology' },
                  { id: 'digital', label: 'Pure Digital', desc: 'Futuristic HUD / LCD' },
                  { id: 'hybrid', label: 'Hybrid Dial', desc: 'Hands + Digital Subdial' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() =>
                      update({
                        timeDisplay: {
                          ...config.timeDisplay,
                          type: item.id as 'analog' | 'digital' | 'hybrid',
                        },
                      })
                    }
                    className={`p-3 rounded-xl border text-center transition-all ${
                      config.timeDisplay.type === item.id
                        ? 'bg-amber-500/15 text-amber-400 border-amber-500 ring-1 ring-amber-500/40 shadow-md font-semibold'
                        : 'bg-neutral-950/70 text-neutral-400 border-neutral-800 hover:text-neutral-200'
                    }`}
                  >
                    <span className="font-semibold text-xs block text-neutral-100">{item.label}</span>
                    <span className="text-[10px] text-neutral-500">{item.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Outer Bezel Scale */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-neutral-200 text-sm flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-amber-500" />
                  <span>Outer Bezel Scale</span>
                </span>
                <span className="text-neutral-500 font-mono capitalize">{config.bezel.style}</span>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {[
                  { id: 'clean', label: 'Clean' },
                  { id: 'tachymeter', label: 'Tachymeter' },
                  { id: 'diver60', label: 'Diver 60' },
                  { id: 'compass', label: 'Compass' },
                  { id: 'numbered_12', label: '1-12 Scale' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() =>
                      update({
                        bezel: { ...config.bezel, style: item.id as BezelStyle },
                      })
                    }
                    className={`py-2 px-2.5 rounded-xl border text-center font-medium transition-all ${
                      config.bezel.style === item.id
                        ? 'bg-amber-500/15 text-amber-400 border-amber-500 ring-1 ring-amber-500/40 font-semibold'
                        : 'bg-neutral-950/70 text-neutral-400 border-neutral-800 hover:text-neutral-200'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 4. Sapphire Crystal Glare & Seconds Motion */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3 bg-neutral-950/70 rounded-2xl border border-neutral-800 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-neutral-200 block text-xs">Sapphire Glare</span>
                  <span className="text-[10px] text-neutral-500">Optical reflection sheen</span>
                </div>
                <input
                  type="checkbox"
                  checked={config.bezel.showGlassGlare}
                  onChange={(e) =>
                    update({
                      bezel: { ...config.bezel, showGlassGlare: e.target.checked },
                    })
                  }
                  className="accent-amber-500 w-4 h-4 cursor-pointer"
                />
              </div>

              <div className="p-3 bg-neutral-950/70 rounded-2xl border border-neutral-800 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-neutral-200 block text-xs">Smooth Sweep</span>
                  <span className="text-[10px] text-neutral-500">60Hz mechanical glide</span>
                </div>
                <input
                  type="checkbox"
                  checked={config.timeDisplay.analog.sweepSeconds}
                  onChange={(e) =>
                    update({
                      timeDisplay: {
                        ...config.timeDisplay,
                        analog: {
                          ...config.timeDisplay.analog,
                          sweepSeconds: e.target.checked,
                        },
                      },
                    })
                  }
                  className="accent-amber-500 w-4 h-4 cursor-pointer"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
