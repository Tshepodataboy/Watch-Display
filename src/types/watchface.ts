export type WatchShape = 'round' | 'square' | 'rugged';

export type CaseFinish = 
  | 'titanium' 
  | 'obsidian' 
  | 'stainless' 
  | 'rosegold' 
  | 'ceramic' 
  | 'stealth_black';

export type StrapType = 
  | 'silicone_black' 
  | 'silicone_orange' 
  | 'leather_brown' 
  | 'leather_black'
  | 'nato_olive'
  | 'titanium_link' 
  | 'milanese_silver' 
  | 'none';

export type BezelStyle = 
  | 'clean' 
  | 'tachymeter' 
  | 'diver60' 
  | 'gmt24' 
  | 'compass' 
  | 'minimal_dots'
  | 'numbered_12';

export type DialBackgroundType = 
  | 'solid' 
  | 'radial_gradient' 
  | 'linear_gradient' 
  | 'carbon_fiber' 
  | 'brushed_titanium' 
  | 'cosmic_nebula' 
  | 'sunburst' 
  | 'guilloche' 
  | 'minimal_grid';

export type IndexStyle = 
  | 'classic_baton' 
  | 'arabic_sport' 
  | 'roman_luxury' 
  | 'diver_dots' 
  | 'minimal_ticks' 
  | 'military_24h' 
  | 'none';

export type HandStyle = 
  | 'dauphine' 
  | 'baton' 
  | 'skeleton' 
  | 'mercedes' 
  | 'tactical_arrow' 
  | 'minimal_needle' 
  | 'pilot_flieger';

export type DigitalFontFamily = 
  | 'orbitron' 
  | 'share_tech' 
  | 'bebas' 
  | 'jetbrains' 
  | 'syne' 
  | 'cinzel';

export type ComplicationType = 
  | 'battery' 
  | 'heart_rate' 
  | 'steps' 
  | 'weather' 
  | 'date_window' 
  | 'day_date' 
  | 'calories' 
  | 'moon_phase' 
  | 'chronograph_sec' 
  | 'world_clock' 
  | 'brand_logo';

export type ComplicationStyle = 
  | 'ring_gauge' 
  | 'compact_badge' 
  | 'subdial_analog' 
  | 'minimal_text' 
  | 'linear_bar';

export interface ComplicationConfig {
  id: string;
  type: ComplicationType;
  style: ComplicationStyle;
  x: number; // percentage offset from center: -45 to 45
  y: number; // percentage offset from center: -45 to 45
  scale: number; // 0.6 to 1.5
  color: string;
  accentColor: string;
  showIcon: boolean;
  showLabel: boolean;
  label?: string;
  customText?: string;
  maxValue?: number;
  minValue?: number;
}

export interface WatchFaceConfig {
  id: string;
  name: string;
  description?: string;
  category?: 'Luxury' | 'Digital' | 'Sport' | 'Minimal' | 'Vintage';
  shape: WatchShape;
  caseFinish: CaseFinish;
  strap: StrapType;
  
  bezel: {
    style: BezelStyle;
    bezelColor: string;
    textColor: string;
    accentColor: string;
    showGlassGlare: boolean;
    glareIntensity: number; // 0 to 1
  };
  
  dial: {
    backgroundType: DialBackgroundType;
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    vignette: number; // 0 to 1
    innerRingRadius: number; // 0 to 100
    innerRingColor: string;
    showInnerRing: boolean;
  };
  
  index: {
    style: IndexStyle;
    color: string;
    glowColor: string;
    showSubMinutes: boolean;
    subMinuteColor: string;
    numberScale: number; // 0.8 to 1.3
    showCardinalsOnly: boolean; // only 12, 3, 6, 9
  };
  
  timeDisplay: {
    type: 'analog' | 'digital' | 'hybrid';
    analog: {
      handStyle: HandStyle;
      hourHandColor: string;
      minuteHandColor: string;
      secondHandColor: string;
      lumeColor: string;
      sweepSeconds: boolean;
      showSeconds: boolean;
      centerCapColor: string;
      centerCapSize: number; // 4 to 16
    };
    digital: {
      fontFamily: DigitalFontFamily;
      format: '12h' | '24h';
      showSeconds: boolean;
      showAmPm: boolean;
      blinkColon: boolean;
      textColor: string;
      glowColor: string;
      x: number;
      y: number;
      fontSize: number;
      letterSpacing: number;
    };
  };
  
  brandText: {
    show: boolean;
    text: string;
    subtext: string;
    color: string;
    y: number;
  };
  
  complications: ComplicationConfig[];
  
  aod: {
    enabled: boolean;
    dimLevel: number; // 0.1 to 0.7
    hideSeconds: boolean;
    outlineHands: boolean;
    hideComplicationGauges: boolean;
  };
}

export interface SimulatorSensors {
  time: Date;
  isLive: boolean;
  heartRate: number; // bpm
  steps: number;
  stepGoal: number;
  battery: number; // 0 - 100
  isCharging: boolean;
  weather: {
    tempC: number;
    condition: 'sunny' | 'partly_cloudy' | 'rain' | 'snow' | 'thunder';
    location: string;
    high: number;
    low: number;
  };
  calories: number;
  calorieGoal: number;
  moonPhasePercent: number; // 0: new moon, 0.5: full moon, 1: new moon
  isAodActive: boolean;
  isNightVisionActive: boolean;
}
