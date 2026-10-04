import React, { useState } from 'react';
import { WatchFaceConfig } from '../types/watchface';
import { generateWatchFaceFormatXml } from '../utils/wffGenerator';
import { generateReactComponentCode } from '../utils/reactCodeGenerator';
import { exportPngFromFile, exportSvgToFile } from '../utils/canvasExport';
import { 
  X, 
  Download, 
  Copy, 
  Check, 
  FileCode, 
  Image, 
  Code, 
  FileJson,
  Sparkles,
  Smartphone
} from 'lucide-react';

interface ExportModalProps {
  config: WatchFaceConfig;
  svgRef: React.RefObject<SVGSVGElement | null>;
  onClose: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  config,
  svgRef,
  onClose,
}) => {
  const [exportType, setExportType] = useState<'wff' | 'png' | 'svg' | 'react' | 'json'>('wff');
  const [copied, setCopied] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const wffXml = generateWatchFaceFormatXml(config);
  const reactCode = generateReactComponentCode(config);
  const jsonString = JSON.stringify(config, null, 2);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadFile = async () => {
    const filename = config.name.toLowerCase().replace(/[^a-z0-9]/g, '_');

    if (exportType === 'wff') {
      const blob = new Blob([wffXml], { type: 'application/xml' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `watchface_${filename}.xml`;
      a.click();
      URL.revokeObjectURL(url);
    } else if (exportType === 'react') {
      const blob = new Blob([reactCode], { type: 'text/typescript' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${config.name.replace(/[^a-zA-Z0-9]/g, '')}WatchFace.tsx`;
      a.click();
      URL.revokeObjectURL(url);
    } else if (exportType === 'json') {
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${filename}_config.json`;
      a.click();
      URL.revokeObjectURL(url);
    } else if (exportType === 'svg') {
      if (svgRef.current) {
        exportSvgToFile(svgRef.current, `watchface_${filename}`);
      }
    } else if (exportType === 'png') {
      if (svgRef.current) {
        setIsExporting(true);
        try {
          await exportPngFromFile(svgRef.current, `watchface_${filename}`, 1200, 1200);
        } finally {
          setIsExporting(false);
        }
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-neutral-900 border border-neutral-800 rounded-3xl p-6 shadow-2xl text-neutral-100 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-neutral-100">Export & Build Suite</h2>
              <p className="text-xs text-neutral-400">
                Generate production files for Google Wear OS, high-res graphic assets, or React code.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Export Type Selector Tabs */}
        <div className="grid grid-cols-5 gap-2 my-4">
          <button
            onClick={() => setExportType('wff')}
            className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-colors ${
              exportType === 'wff'
                ? 'bg-amber-500/20 text-amber-400 border-amber-500/50 shadow-md'
                : 'bg-neutral-950/60 text-neutral-400 border-neutral-800 hover:text-neutral-200'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span className="font-semibold text-xs">Wear OS (WFF)</span>
            <span className="text-[10px] text-neutral-500">Android 14+ XML</span>
          </button>

          <button
            onClick={() => setExportType('png')}
            className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-colors ${
              exportType === 'png'
                ? 'bg-amber-500/20 text-amber-400 border-amber-500/50 shadow-md'
                : 'bg-neutral-950/60 text-neutral-400 border-neutral-800 hover:text-neutral-200'
            }`}
          >
            <Image className="w-4 h-4" />
            <span className="font-semibold text-xs">High-Res PNG</span>
            <span className="text-[10px] text-neutral-500">1200x1200px</span>
          </button>

          <button
            onClick={() => setExportType('svg')}
            className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-colors ${
              exportType === 'svg'
                ? 'bg-amber-500/20 text-amber-400 border-amber-500/50 shadow-md'
                : 'bg-neutral-950/60 text-neutral-400 border-neutral-800 hover:text-neutral-200'
            }`}
          >
            <FileCode className="w-4 h-4" />
            <span className="font-semibold text-xs">Scalable SVG</span>
            <span className="text-[10px] text-neutral-500">Vector graphics</span>
          </button>

          <button
            onClick={() => setExportType('react')}
            className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-colors ${
              exportType === 'react'
                ? 'bg-amber-500/20 text-amber-400 border-amber-500/50 shadow-md'
                : 'bg-neutral-950/60 text-neutral-400 border-neutral-800 hover:text-neutral-200'
            }`}
          >
            <Code className="w-4 h-4" />
            <span className="font-semibold text-xs">React Component</span>
            <span className="text-[10px] text-neutral-500">TSX + SVG</span>
          </button>

          <button
            onClick={() => setExportType('json')}
            className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-colors ${
              exportType === 'json'
                ? 'bg-amber-500/20 text-amber-400 border-amber-500/50 shadow-md'
                : 'bg-neutral-950/60 text-neutral-400 border-neutral-800 hover:text-neutral-200'
            }`}
          >
            <FileJson className="w-4 h-4" />
            <span className="font-semibold text-xs">Studio Project</span>
            <span className="text-[10px] text-neutral-500">JSON Schema</span>
          </button>
        </div>

        {/* Content Viewer / Preview */}
        <div className="flex-1 overflow-hidden flex flex-col bg-neutral-950 rounded-2xl border border-neutral-800 p-3 min-h-[260px]">
          {exportType === 'wff' && (
            <div className="flex-1 flex flex-col overflow-hidden">
              <div className="flex items-center justify-between pb-2 text-xs text-neutral-400">
                <span className="font-mono">watchface.xml (Wear OS Watch Face Format)</span>
                <button
                  onClick={() => handleCopy(wffXml)}
                  className="flex items-center gap-1 text-amber-400 hover:text-amber-300"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied!' : 'Copy XML'}</span>
                </button>
              </div>
              <pre className="flex-1 overflow-auto p-3 font-mono text-[11px] text-neutral-300 bg-neutral-900/60 rounded-xl leading-relaxed">
                {wffXml}
              </pre>
            </div>
          )}

          {exportType === 'react' && (
            <div className="flex-1 flex flex-col overflow-hidden">
              <div className="flex items-center justify-between pb-2 text-xs text-neutral-400">
                <span className="font-mono">{config.name.replace(/[^a-zA-Z0-9]/g, '')}WatchFace.tsx</span>
                <button
                  onClick={() => handleCopy(reactCode)}
                  className="flex items-center gap-1 text-amber-400 hover:text-amber-300"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied!' : 'Copy Code'}</span>
                </button>
              </div>
              <pre className="flex-1 overflow-auto p-3 font-mono text-[11px] text-neutral-300 bg-neutral-900/60 rounded-xl leading-relaxed">
                {reactCode}
              </pre>
            </div>
          )}

          {exportType === 'json' && (
            <div className="flex-1 flex flex-col overflow-hidden">
              <div className="flex items-center justify-between pb-2 text-xs text-neutral-400">
                <span className="font-mono">watchface_schema.json</span>
                <button
                  onClick={() => handleCopy(jsonString)}
                  className="flex items-center gap-1 text-amber-400 hover:text-amber-300"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied!' : 'Copy JSON'}</span>
                </button>
              </div>
              <pre className="flex-1 overflow-auto p-3 font-mono text-[11px] text-neutral-300 bg-neutral-900/60 rounded-xl leading-relaxed">
                {jsonString}
              </pre>
            </div>
          )}

          {exportType === 'png' && (
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-3">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
                <Image className="w-8 h-8" />
              </div>
              <div>
                <h4 className="font-semibold text-neutral-100">Ready to Render 1200x1200px PNG</h4>
                <p className="text-xs text-neutral-400 max-w-sm mx-auto mt-1">
                  High-fidelity raster image with anti-aliasing, transparent background support, and specular reflections.
                </p>
              </div>
            </div>
          )}

          {exportType === 'svg' && (
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-3">
              <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center">
                <FileCode className="w-8 h-8" />
              </div>
              <div>
                <h4 className="font-semibold text-neutral-100">Scalable Vector Graphics (SVG)</h4>
                <p className="text-xs text-neutral-400 max-w-sm mx-auto mt-1">
                  Infinite resolution vector file. Import directly into Figma, Adobe Illustrator, or native vector asset pipelines.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-neutral-800 mt-4">
          <span className="text-xs text-neutral-400">
            {exportType === 'wff' && 'Conforms to Android Wear OS 4+ Watch Face Format standard'}
            {exportType === 'png' && 'Export formatted at 300 DPI for retina displays'}
            {exportType === 'svg' && 'Clean SVG XML markup ready for design tools'}
            {exportType === 'react' && 'Zero extra runtime dependencies required'}
            {exportType === 'json' && 'Complete declarative specification'}
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-medium text-xs transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleDownloadFile}
              disabled={isExporting}
              className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-semibold text-xs transition-colors flex items-center gap-1.5 shadow-lg shadow-amber-500/20"
            >
              <Download className="w-4 h-4" />
              <span>{isExporting ? 'Generating...' : 'Download File'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
