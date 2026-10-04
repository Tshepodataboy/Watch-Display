import { WatchFaceConfig } from '../types/watchface';

/**
 * Generates an official Wear OS Watch Face Format (WFF) XML document.
 * This conforms to Google's declarative Watch Face Format for Wear OS 4 and Wear OS 5.
 */
export function generateWatchFaceFormatXml(config: WatchFaceConfig): string {
  const isRound = config.shape === 'round';
  const width = 450;
  const height = 450;
  const centerX = width / 2;
  const centerY = height / 2;

  const complicationsXml = config.complications
    .map((comp, idx) => {
      // Map percentage x,y (-50 to 50) to absolute 450x450 coordinates
      const cx = centerX + (comp.x * width) / 100;
      const cy = centerY + (comp.y * height) / 100;
      const slotSize = Math.round(70 * comp.scale);
      const left = Math.round(cx - slotSize / 2);
      const top = Math.round(cy - slotSize / 2);

      let slotType = 'SHORT_TEXT';
      if (comp.type === 'battery' || comp.type === 'steps' || comp.type === 'heart_rate') {
        slotType = comp.style === 'ring_gauge' ? 'RANGED_VALUE' : 'SHORT_TEXT';
      } else if (comp.type === 'weather') {
        slotType = 'WEATHER';
      }

      return `      <!-- Complication Slot ${idx + 1}: ${comp.type} (${comp.style}) -->
      <ComplicationSlot
          slotId="${idx + 1}"
          supportedTypes="${slotType}"
          x="${left}"
          y="${top}"
          width="${slotSize}"
          height="${slotSize}">
          <BoundingBox x="${left}" y="${top}" width="${slotSize}" height="${slotSize}" outline="ROUND" />
          <DefaultProviderPolicy
              defaultSystemProviderType="${mapSystemProvider(comp.type)}"
              defaultSystemProvider="${mapSystemProviderName(comp.type)}" />
      </ComplicationSlot>`;
    })
    .join('\n');

  const analogXml =
    config.timeDisplay.type !== 'digital'
      ? `      <!-- Analog Clock Mechanism -->
      <AnalogClock x="0" y="0" width="${width}" height="${height}">
          <!-- Hour Hand: Style ${config.timeDisplay.analog.handStyle} -->
          <HourHand
              x="${centerX}"
              y="${centerY}"
              width="18"
              height="140"
              pivotX="0.5"
              pivotY="0.88"
              resource="@drawable/hand_hour_${config.timeDisplay.analog.handStyle}"
              tintColor="${config.timeDisplay.analog.hourHandColor}">
              <Variant mode="AMBIENT" outlineOnly="${config.aod.outlineHands ? 'true' : 'false'}" />
          </HourHand>

          <!-- Minute Hand -->
          <MinuteHand
              x="${centerX}"
              y="${centerY}"
              width="14"
              height="190"
              pivotX="0.5"
              pivotY="0.9"
              resource="@drawable/hand_minute_${config.timeDisplay.analog.handStyle}"
              tintColor="${config.timeDisplay.analog.minuteHandColor}">
              <Variant mode="AMBIENT" outlineOnly="${config.aod.outlineHands ? 'true' : 'false'}" />
          </MinuteHand>

          <!-- Second Hand ${config.timeDisplay.analog.sweepSeconds ? '(Sweeping)' : '(Ticking)'} -->
          <SecondHand
              x="${centerX}"
              y="${centerY}"
              width="6"
              height="210"
              pivotX="0.5"
              pivotY="0.85"
              movementFrequency="${config.timeDisplay.analog.sweepSeconds ? '60' : '1'}"
              resource="@drawable/hand_second_needle"
              tintColor="${config.timeDisplay.analog.secondHandColor}">
              <Variant mode="AMBIENT" target="HIDDEN" />
          </SecondHand>
      </AnalogClock>`
      : '';

  const digitalXml =
    config.timeDisplay.type !== 'analog'
      ? `      <!-- Digital Clock Display -->
      <DigitalClock x="${centerX + (config.timeDisplay.digital.x * width) / 100 - 100}" y="${
          centerY + (config.timeDisplay.digital.y * height) / 100 - 30
        }" width="200" height="60">
          <TimeText
              format="${config.timeDisplay.digital.format === '24h' ? 'HH:mm' : 'hh:mm'}${
          config.timeDisplay.digital.showSeconds ? ':ss' : ''
        }"
              fontFamily="${config.timeDisplay.digital.fontFamily}"
              color="${config.timeDisplay.digital.textColor}">
              <Variant mode="AMBIENT" dimRatio="${config.aod.dimLevel}" />
          </TimeText>
      </DigitalClock>`
      : '';

  return `<?xml version="1.0" encoding="utf-8"?>
<!--
  Wear OS Watch Face Format (WFF) Specification
  Project: ${config.name}
  Generated via Morokit Craft Watch Face Studio
-->
<WatchFace
    xmlns="http://schemas.android.com/apk/res/watchface"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    width="${width}"
    height="${height}"
    shape="${isRound ? 'CIRCLE' : 'RECTANGLE'}"
    clipShape="${isRound ? 'CIRCLE' : 'ROUNDED_RECT'}">

  <Metadata key="CLOCK_TYPE" value="${config.timeDisplay.type.toUpperCase()}" />
  <Metadata key="PREVIEW_NAME" value="${config.name}" />

  <Scene backgroundColor="${config.dial.primaryColor}">
      <!-- Dial Background -->
      <PartBackground
          x="0"
          y="0"
          width="${width}"
          height="${height}">
          <FilledRectangle
              color="${config.dial.primaryColor}"
              gradientType="${config.dial.backgroundType === 'radial_gradient' ? 'RADIAL' : 'NONE'}"
              gradientEndColor="${config.dial.secondaryColor}" />
      </PartBackground>

      <!-- Chapter Ring / Ticks: ${config.index.style} -->
      <PartDraw
          x="0"
          y="0"
          width="${width}"
          height="${height}">
          <Ticks
              count="60"
              color="${config.index.color}"
              subColor="${config.index.subMinuteColor}"
              style="${config.index.style}" />
      </PartDraw>

      <!-- Complication Containers -->
${complicationsXml}

${digitalXml}

${analogXml}
  </Scene>
</WatchFace>
`;
}

function mapSystemProvider(type: string): string {
  switch (type) {
    case 'battery':
      return 'BATTERY';
    case 'heart_rate':
      return 'HEART_RATE';
    case 'steps':
      return 'STEP_COUNT';
    case 'weather':
      return 'WEATHER';
    case 'date_window':
    case 'day_date':
      return 'DATE';
    default:
      return 'APP_SHORTCUT';
  }
}

function mapSystemProviderName(type: string): string {
  switch (type) {
    case 'battery':
      return 'com.google.android.wearable.watchface.provider.Battery';
    case 'heart_rate':
      return 'com.google.android.wearable.health.HeartRate';
    case 'steps':
      return 'com.google.android.wearable.health.Steps';
    case 'weather':
      return 'com.google.android.wearable.weather.CurrentWeather';
    default:
      return 'com.google.android.wearable.watchface.provider.Date';
  }
}
