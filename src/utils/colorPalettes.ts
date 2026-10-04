export interface ColorPalette {
  id: string;
  name: string;
  primary: string;
  secondary: string;
  accent: string;
  lume: string;
  bezel: string;
}

export const COLOR_PALETTES: ColorPalette[] = [
  {
    id: 'swiss-gold',
    name: 'Champagne & Gold',
    primary: '#121316',
    secondary: '#1f2229',
    accent: '#d4af37',
    lume: '#fde68a',
    bezel: '#181b22',
  },
  {
    id: 'cyber-cyan',
    name: 'Cyberpunk Neon',
    primary: '#090d16',
    secondary: '#0e1726',
    accent: '#06b6d4',
    lume: '#22d3ee',
    bezel: '#0b111e',
  },
  {
    id: 'stealth-night',
    name: 'Obsidian Stealth',
    primary: '#09090b',
    secondary: '#18181b',
    accent: '#ef4444',
    lume: '#f87171',
    bezel: '#121215',
  },
  {
    id: 'arctic-titanium',
    name: 'Arctic Silver',
    primary: '#0f172a',
    secondary: '#1e293b',
    accent: '#38bdf8',
    lume: '#7dd3fc',
    bezel: '#334155',
  },
  {
    id: 'emerald-luxury',
    name: 'British Racing Green',
    primary: '#061a12',
    secondary: '#0b2e20',
    accent: '#10b981',
    lume: '#34d399',
    bezel: '#062016',
  },
  {
    id: 'tactical-amber',
    name: 'Tactical Amber',
    primary: '#141410',
    secondary: '#23211a',
    accent: '#f59e0b',
    lume: '#fbbf24',
    bezel: '#1b1a15',
  },
  {
    id: 'rose-sunset',
    name: 'Rose Gold & Plum',
    primary: '#1c1018',
    secondary: '#2e1927',
    accent: '#f43f5e',
    lume: '#fb7185',
    bezel: '#281321',
  },
  {
    id: 'pure-white',
    name: 'Bauhaus Stark',
    primary: '#fafafa',
    secondary: '#f4f4f5',
    accent: '#ef4444',
    lume: '#ef4444',
    bezel: '#18181b',
  },
];
