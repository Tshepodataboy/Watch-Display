import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  WatchFaceConfig, 
  SimulatorSensors, 
  ComplicationConfig 
} from './types/watchface';
import { PRESET_WATCH_FACES } from './utils/presets';
import { WatchCaseFrame } from './components/WatchCaseFrame';
import { StudioControls } from './components/StudioControls';
import { ExportModal } from './components/ExportModal';
import { InteractiveWidgetModal } from './components/InteractiveWidgetModal';
import { 
  Download, 
  Save, 
  Undo2, 
  Redo2, 
  Sparkles, 
  FolderOpen, 
  Trash2, 
  RotateCcw,
  Sliders,
  Watch,
  Info
} from 'lucide-react';

const STORAGE_KEY = 'morokit_craft_saved_faces_v1';

export default function App() {
  // Current Watch Face Configuration
  const [config, setConfig] = useState<WatchFaceConfig>(PRESET_WATCH_FACES[0]);

  // Undo / Redo history
  const [history, setHistory] = useState<WatchFaceConfig[]>([PRESET_WATCH_FACES[0]]);
  const [historyIndex, setHistoryIndex] = useState<number>(0);

  // Hardware and Sensor Simulator state
  const [sensors, setSensors] = useState<SimulatorSensors>({
    time: new Date(),
    isLive: true,
    heartRate: 72,
    steps: 8420,
    stepGoal: 10000,
    battery: 86,
    isCharging: false,
    weather: {
      tempC: 22,
      condition: 'partly_cloudy',
      location: 'Geneva, CH',
      high: 25,
      low: 16,
    },
    calories: 420,
    calorieGoal: 600,
    moonPhasePercent: 0.65,
    isAodActive: false,
    isNightVisionActive: false,
  });

  // UI state
  const [selectedComplicationId, setSelectedComplicationId] = useState<string | null>(null);
  const [tappedComplication, setTappedComplication] = useState<ComplicationConfig | null>(null);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [savedFaces, setSavedFaces] = useState<WatchFaceConfig[]>([]);

  // Ref to SVG element for PNG and SVG exports
  const svgRef = useRef<SVGSVGElement | null>(null);

  // Load saved watch faces from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setSavedFaces(JSON.parse(stored));
      }
    } catch {
      // ignore
    }
  }, []);

  // Live ticking timer
  useEffect(() => {
    if (!sensors.isLive) return;

    const interval = setInterval(() => {
      setSensors((prev) => {
        if (!prev.isLive) return prev;
        return {
          ...prev,
          time: new Date(),
        };
      });
    }, config.timeDisplay.analog.sweepSeconds ? 40 : 1000);

    return () => clearInterval(interval);
  }, [sensors.isLive, config.timeDisplay.analog.sweepSeconds]);

  // Push to history on config change
  const handleConfigChange = useCallback((newConfig: WatchFaceConfig) => {
    setConfig(newConfig);
    setHistory((prev) => {
      const sliced = prev.slice(0, historyIndex + 1);
      return [...sliced, newConfig];
    });
    setHistoryIndex((prev) => prev + 1);
  }, [historyIndex]);

  // Undo / Redo handlers
  const handleUndo = () => {
    if (historyIndex > 0) {
      const newIdx = historyIndex - 1;
      setHistoryIndex(newIdx);
      setConfig(history[newIdx]);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const newIdx = historyIndex + 1;
      setHistoryIndex(newIdx);
      setConfig(history[newIdx]);
    }
  };

  // Save current design to local gallery
  const handleSaveToGallery = () => {
    const updated = [
      ...savedFaces.filter((f) => f.id !== config.id),
      { ...config, id: `custom-${Date.now()}` },
    ];
    setSavedFaces(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    alert(`"${config.name}" saved to your personal library!`);
  };

  // Delete from gallery
  const handleDeleteSaved = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = savedFaces.filter((f) => f.id !== id);
    setSavedFaces(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  return (
    <div className="h-screen w-screen max-h-screen overflow-hidden bg-neutral-950 text-neutral-100 flex flex-col font-sans selection:bg-amber-500/30 selection:text-amber-200">
      {/* 3-Zone Top Navigation Bar Contract */}
      <header className="h-14 px-6 flex items-center justify-between border-b border-neutral-800/80 bg-neutral-950/80 backdrop-blur-md shrink-0 z-40">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3">
          <a
            href="/"
            className="text-lg font-bold tracking-tight text-neutral-100 font-[Syne] flex items-center gap-2"
          >
            <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center text-neutral-950 shadow-md">
              <Watch className="w-3.5 h-3.5" />
            </div>
            <span>Morokit Craft</span>
          </a>
          <span className="hidden sm:inline-block text-neutral-600">·</span>
          <span className="hidden sm:inline-block text-xs text-neutral-400 font-mono">
            Smartwatch UI Studio
          </span>
        </div>

        {/* Zone 2: Clean library link */}
        <nav className="hidden sm:flex items-center gap-6 text-xs font-medium text-neutral-400">
          <button
            onClick={() => setIsGalleryOpen(!isGalleryOpen)}
            className="transition-colors hover:text-neutral-200 flex items-center gap-1.5"
          >
            <FolderOpen className="w-3.5 h-3.5 text-amber-500" />
            <span>Saved Library ({savedFaces.length})</span>
          </button>
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-2.5">
          {/* Undo / Redo */}
          <div className="flex items-center bg-neutral-900 border border-neutral-800 rounded-lg p-0.5 mr-1">
            <button
              onClick={handleUndo}
              disabled={historyIndex <= 0}
              className="p-1.5 text-neutral-400 hover:text-neutral-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              title="Undo (Ctrl+Z)"
            >
              <Undo2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleRedo}
              disabled={historyIndex >= history.length - 1}
              className="p-1.5 text-neutral-400 hover:text-neutral-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              title="Redo (Ctrl+Y)"
            >
              <Redo2 className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={handleSaveToGallery}
            className="px-3 py-1.5 text-xs font-medium text-neutral-300 bg-neutral-900 border border-neutral-800 rounded-lg hover:bg-neutral-800 hover:text-white transition-colors flex items-center gap-1.5 whitespace-nowrap"
          >
            <Save className="w-3.5 h-3.5 text-neutral-400" />
            <span>Save</span>
          </button>

          <button
            onClick={() => setIsExportOpen(true)}
            className="px-3.5 py-1.5 text-xs font-semibold text-neutral-950 bg-amber-500 rounded-lg hover:bg-amber-400 transition-colors flex items-center gap-1.5 whitespace-nowrap shadow-md shadow-amber-500/20"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export & Build</span>
          </button>
        </div>
      </header>

      {/* Main Studio Viewport - Exactly fits remaining viewport height */}
      <main className="flex-1 min-h-0 w-full max-w-[1700px] mx-auto p-3 lg:p-4 grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch overflow-hidden">
        {/* Left Column: Watch Stage (7 cols) */}
        <div className="lg:col-span-7 h-full min-h-0 flex flex-col overflow-hidden">
          {/* Watch Face Stage */}
          <div className="relative bg-neutral-900/60 border border-neutral-800/80 rounded-3xl p-4 h-full min-h-0 flex flex-col items-center justify-center overflow-hidden shadow-2xl backdrop-blur-sm">
            {/* Subtle background stage pattern */}
            <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

            {/* Stage Info Header */}
            <div className="absolute top-4 left-5 right-5 flex items-center justify-between text-xs text-neutral-500 pointer-events-none">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-neutral-300 font-[Syne] text-sm">
                  {config.name}
                </span>
                <span>·</span>
                <span className="capitalize">{config.shape} 45mm</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-neutral-500">
                  {config.timeDisplay.analog.sweepSeconds ? 'Sweep 60Hz' : 'Tick 1Hz'}
                </span>
              </div>
            </div>

            {/* Watch Centerpiece */}
            <div className="my-auto py-2 flex items-center justify-center">
              <WatchCaseFrame
                config={config}
                sensors={sensors}
                size={390}
                onComplicationClick={(comp) => setTappedComplication(comp)}
                svgRef={svgRef}
              />
            </div>

            {/* Click-to-interact banner reminder */}
            <div className="absolute bottom-3 text-center text-[11px] text-neutral-500 flex items-center gap-1.5 pointer-events-none">
              <Sparkles className="w-3 h-3 text-amber-500" />
              <span>Interactive preview: tap widgets to test simulated smartwatch apps</span>
            </div>
          </div>
        </div>

        {/* Right Column: Studio Controls & Configuration Inspector (5 cols) */}
        <div className="lg:col-span-5 h-full min-h-0 flex flex-col overflow-hidden">
          <StudioControls
            config={config}
            onChange={handleConfigChange}
            selectedComplicationId={selectedComplicationId}
            onSelectComplication={setSelectedComplicationId}
          />
        </div>
      </main>

      {/* Library / Saved Faces Drawer Modal */}
      {isGalleryOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-lg bg-neutral-900 border border-neutral-800 rounded-3xl p-6 shadow-2xl text-neutral-100">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <div className="flex items-center gap-2">
                <FolderOpen className="w-4 h-4 text-amber-400" />
                <h3 className="font-semibold text-sm">Your Saved Watch Face Library</h3>
              </div>
              <button
                onClick={() => setIsGalleryOpen(false)}
                className="text-neutral-400 hover:text-neutral-100"
              >
                ✕
              </button>
            </div>

            <div className="py-4 max-h-96 overflow-y-auto space-y-2">
              {savedFaces.length === 0 ? (
                <div className="text-center py-8 text-neutral-500 text-xs">
                  No saved custom watch faces yet. Click &quot;Save&quot; in the header to save your design!
                </div>
              ) : (
                savedFaces.map((face) => (
                  <div
                    key={face.id}
                    onClick={() => {
                      setConfig(face);
                      setIsGalleryOpen(false);
                    }}
                    className="p-3 bg-neutral-950 border border-neutral-800 rounded-xl hover:border-amber-500/50 cursor-pointer flex items-center justify-between transition-colors group"
                  >
                    <div>
                      <h4 className="font-semibold text-sm text-neutral-200 group-hover:text-amber-400 transition-colors">
                        {face.name}
                      </h4>
                      <p className="text-[11px] text-neutral-500 mt-0.5">
                        {face.shape} · {face.caseFinish} · {face.timeDisplay.type}
                      </p>
                    </div>
                    <button
                      onClick={(e) => handleDeleteSaved(face.id, e)}
                      className="p-1.5 text-neutral-500 hover:text-rose-400 hover:bg-neutral-800 rounded-lg transition-colors"
                      title="Delete design"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>

            <div className="pt-3 border-t border-neutral-800 flex justify-end">
              <button
                onClick={() => setIsGalleryOpen(false)}
                className="px-4 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs font-medium text-neutral-300"
              >
                Close Library
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Export & Build Modal */}
      {isExportOpen && (
        <ExportModal
          config={config}
          svgRef={svgRef}
          onClose={() => setIsExportOpen(false)}
        />
      )}

      {/* Interactive Tap Complication Modal */}
      {tappedComplication && (
        <InteractiveWidgetModal
          complication={tappedComplication}
          sensors={sensors}
          onClose={() => setTappedComplication(null)}
        />
      )}
    </div>
  );
}
