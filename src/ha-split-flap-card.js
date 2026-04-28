class HASplitFlapCard extends HTMLElement {
  static getStubConfig() {
    return {
      text: "NÄSSJÖ CENTRAL",
      language: "sv",
      charset: "sv",
      theme: "kiosk_gold",
      segments: 14,
      animation: true,
      cycle_chars: true
    };
  }

  static getConfigElement() {
    return document.createElement("split-flap-card-editor");
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    this._config = null;
    this._hass = null;
    this._targetText = "";
    this._displayChars = [];
    this._flipStates = new Map();
    this._timers = [];
    this._clockTimer = null;
    this._runId = 0;
    this._hasRenderedOnce = false;
  }

  setConfig(config) {
    if (!config || typeof config !== "object") {
      throw new Error("Invalid configuration.");
    }

    const source = config.source || this._inferSource(config);

    if (source === "text" && config.text === undefined) {
      throw new Error("Text source requires 'text'.");
    }

    if (source === "entity" && !config.entity) {
      throw new Error("Entity source requires 'entity'.");
    }

    if (!["text", "entity", "clock"].includes(source)) {
      throw new Error("Source must be one of: text, entity, clock.");
    }

    this._config = {
      source,

      language: "en",
      charset: undefined,
      locale: undefined,

      text_transform: "uppercase",
      fallback_character: " ",
      pad_character: " ",
      pad_mode: "end",

      theme: "classic",

      card_background: "#050505",
      card_border_radius: 16,
      card_padding: 16,

      segment_background: "#111111",
      segment_background_top: "#1b1b1b",
      segment_background_bottom: "#090909",
      segment_separator_color: "#000000",
      segment_border_color: "#2a2a2a",

      text_color: "#dcb215",
      font_family: "Roboto Mono, monospace",
      font_size: 44,
      font_weight: 800,

      segment_width: 48,
      segment_height: 72,
      segment_gap: 6,
      segment_radius: 6,

      max_chars: undefined,
      segments: undefined,
      max_segments: 96,
      align: "center",

      animation: true,
      initial_animation: true,
      cycle_chars: true,
      cycle_count: 2,

      flip_duration: 520,
      flip_stagger: 45,

      clock_format: "HH:mm",
      clock_tick_interval: 1000,

      ...config,
      source
    };

    this._restartClockIfNeeded();
    this._syncText(true);
  }

  set hass(hass) {
    this._hass = hass;
    this._syncText(false);
  }

  disconnectedCallback() {
    this._clearTimers();
    this._stopClock();
  }

  getCardSize() {
    return 2;
  }

  getGridOptions() {
    return {
      columns: 12,
      rows: 2,
      min_rows: 1
    };
  }

  _inferSource(config) {
    if (config.source) return config.source;
    if (config.entity) return "entity";
    if (config.clock || config.clock_format) return "clock";
    return "text";
  }

  _restartClockIfNeeded() {
    this._stopClock();

    if (!this._config || this._config.source !== "clock") {
      return;
    }

    const interval = this._safeNumber(
      this._config.clock_tick_interval,
      1000,
      250,
      60000
    );

    this._clockTimer = window.setInterval(() => {
      this._syncText(false);
    }, interval);
  }

  _stopClock() {
    if (this._clockTimer) {
      window.clearInterval(this._clockTimer);
      this._clockTimer = null;
    }
  }

  _getCharsets() {
    return {
      en: "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 -:.",
      sv: "ABCDEFGHIJKLMNOPQRSTUVWXYZÅÄÖ0123456789 -:.",
      nordic: "ABCDEFGHIJKLMNOPQRSTUVWXYZÅÄÖÆØ0123456789 -:.",
      western:
        "ABCDEFGHIJKLMNOPQRSTUVWXYZÅÄÖÆØÜÉÈÀÁÂÃÇÑÓÒÔÕÚÙÛÍÌÎÏÊËŒ0123456789 -:.",
      weather: "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 -:.,°/+",
      weather_sv: "ABCDEFGHIJKLMNOPQRSTUVWXYZÅÄÖ0123456789 -:.,°/+",
      extended:
        "ABCDEFGHIJKLMNOPQRSTUVWXYZÅÄÖÆØÜÉÈÀÁÂÃÇÑÓÒÔÕÚÙÛÍÌÎÏÊËŒ0123456789 -:.,°/+_()[]"
    };
  }

  _getCharset() {
    const config = this._config || {};
    const key = config.charset || config.language || "en";

    if (key === "custom") {
      return String(config.custom_charset || this._getCharsets().en);
    }

    return this._getCharsets()[key] || this._getCharsets().en;
  }

  _getRawText() {
    const config = this._config || {};

    if (config.source === "clock") {
      return this._formatClock(config.clock_format);
    }

    if (config.source === "text" || config.text !== undefined) {
      return String(config.text ?? "");
    }

    if (!this._hass || !config.entity) {
      return "";
    }

    const stateObj = this._hass.states[config.entity];

    if (!stateObj) {
      return "ENTITY NOT FOUND";
    }

    if (config.attribute) {
      const value = stateObj.attributes?.[config.attribute];
      return value === undefined || value === null ? "" : String(value);
    }

    return String(stateObj.state);
  }

  _formatClock(format) {
    const now = new Date();

    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();

    const values = {
      HH: String(hours).padStart(2, "0"),
      H: String(hours),
      mm: String(minutes).padStart(2, "0"),
      ss: String(seconds).padStart(2, "0")
    };

    return String(format || "HH:mm")
      .replaceAll("HH", values.HH)
      .replaceAll("H", values.H)
      .replaceAll("mm", values.mm)
      .replaceAll("ss", values.ss);
  }

  _normalizeText(text) {
    const config = this._config || {};
    let output = text || "";

    if (config.text_transform === "uppercase") {
      output = output.toLocaleUpperCase(config.locale || "sv-SE");
    } else if (config.text_transform === "lowercase") {
      output = output.toLocaleLowerCase(config.locale || "sv-SE");
    }

    const charset = this._getCharset();
    const fallback = this._getSafeFallbackCharacter();
    const padCharacter = this._getSafePadCharacter();

    output = Array.from(output)
      .map((char) => {
        if (charset.includes(char)) return char;

        const mapped = this._mapCharacter(char);
        if (mapped && charset.includes(mapped)) return mapped;

        return fallback;
      })
      .join("");

    const segmentCount = this._getSegmentCount(output.length);

    if (segmentCount > 0) {
      output = output.slice(0, segmentCount);

      if (config.pad_mode === "start") {
        output = output.padStart(segmentCount, padCharacter);
      } else {
        output = output.padEnd(segmentCount, padCharacter);
      }
    }

    return output;
  }

  _getSegmentCount(textLength) {
    const config = this._config || {};
    const configured = config.segments ?? config.max_chars;
    const maxSegments = this._safeNumber(config.max_segments, 96, 1, 160);

    if (configured === undefined || configured === null || configured === "") {
      return Math.min(Math.max(textLength, 1), maxSegments);
    }

    const count = Number(configured);

    if (!Number.isFinite(count) || count <= 0) {
      return Math.min(Math.max(textLength, 1), maxSegments);
    }

    return Math.min(Math.floor(count), maxSegments);
  }

  _getSafeFallbackCharacter() {
    const config = this._config || {};
    const value = String(config.fallback_character ?? " ");
    return Array.from(value)[0] || " ";
  }

  _getSafePadCharacter() {
    const config = this._config || {};
    const value = String(config.pad_character ?? " ");
    return Array.from(value)[0] || " ";
  }

  _mapCharacter(char) {
    const map = {
      é: "e",
      è: "e",
      ê: "e",
      ë: "e",
      É: "E",
      È: "E",
      Ê: "E",
      Ë: "E",

      á: "a",
      à: "a",
      â: "a",
      ã: "a",
      Á: "A",
      À: "A",
      Â: "A",
      Ã: "A",

      ó: "o",
      ò: "o",
      ô: "o",
      õ: "o",
      Ó: "O",
      Ò: "O",
      Ô: "O",
      Õ: "O",

      ú: "u",
      ù: "u",
      û: "u",
      Ú: "U",
      Ù: "U",
      Û: "U",

      í: "i",
      ì: "i",
      î: "i",
      ï: "i",
      Í: "I",
      Ì: "I",
      Î: "I",
      Ï: "I",

      ç: "c",
      Ç: "C",
      ñ: "n",
      Ñ: "N",

      æ: "ä",
      Æ: "Ä",
      ø: "ö",
      Ø: "Ö"
    };

    return map[char];
  }

  _syncText(force) {
    if (!this._config) return;

    const nextText = this._normalizeText(this._getRawText());

    if (!force && nextText === this._targetText) {
      return;
    }

    const previousText = this._targetText;
    this._targetText = nextText;

    if (!this._config.animation) {
      this._clearTimers();
      this._displayChars = Array.from(nextText);
      this._flipStates.clear();
      this._render();
      return;
    }

    if (!this._hasRenderedOnce) {
      this._hasRenderedOnce = true;

      const start = this._config.initial_animation
        ? " ".repeat(nextText.length)
        : nextText;

      this._displayChars = Array.from(start);
      this._render();

      if (this._config.initial_animation) {
        window.requestAnimationFrame(() => this._animateText(start, nextText));
      }

      return;
    }

    this._animateText(previousText, nextText);
  }

  _animateText(fromText, toText) {
    this._clearTimers();

    const runId = ++this._runId;
    const config = this._config;
    const toChars = Array.from(toText);
    const fromChars = Array.from(
      this._displayChars.join("").padEnd(toChars.length, " ")
    ).slice(0, toChars.length);

    this._displayChars = fromChars;
    this._flipStates.clear();
    this._render();

    const flipDuration = this._safeNumber(config.flip_duration, 520, 80, 2000);
    const flipStagger = this._safeNumber(config.flip_stagger, 45, 0, 500);
    const stepDelay = flipDuration + 70;
    const cycleCount = this._safeNumber(config.cycle_count, 2, 0, 5);

    let lastDelay = 0;

    toChars.forEach((targetChar, index) => {
      const startChar = fromChars[index] || " ";

      if (startChar === targetChar) return;

      const sequence = this._buildSequence(
        startChar,
        targetChar,
        index,
        cycleCount
      );

      sequence.forEach((char, stepIndex) => {
        const delay = index * flipStagger + stepIndex * stepDelay;
        lastDelay = Math.max(lastDelay, delay);

        const timer = window.setTimeout(() => {
          if (runId !== this._runId) return;
          this._flipOne(index, char);
        }, delay);

        this._timers.push(timer);
      });
    });

    const finalTimer = window.setTimeout(() => {
      if (runId !== this._runId) return;
      this._displayChars = toChars;
      this._flipStates.clear();
      this._render();
    }, lastDelay + flipDuration + 180);

    this._timers.push(finalTimer);
  }

  _buildSequence(fromChar, targetChar, index, cycleCount) {
    const config = this._config || {};

    if (!config.cycle_chars || cycleCount <= 0 || config.source === "clock") {
      return [targetChar];
    }

    const charset = Array.from(this._getCharset()).filter((char) => {
      return char !== " " && char !== "-" && char !== ":" && char !== ".";
    });

    if (!charset.length) {
      return [targetChar];
    }

    const sequence = [];

    for (let i = 0; i < cycleCount; i++) {
      const seed = (index + 1) * 13 + i * 17 + String(fromChar).charCodeAt(0);
      const char = charset[seed % charset.length];

      if (char !== fromChar && char !== targetChar && !sequence.includes(char)) {
        sequence.push(char);
      }
    }

    sequence.push(targetChar);

    return sequence;
  }

  _flipOne(index, nextChar) {
    const fromChar = this._displayChars[index] || " ";
    const toChar = nextChar || " ";

    if (fromChar === toChar) return;

    const key = `${Date.now()}-${index}-${fromChar}-${toChar}`;

    this._flipStates.set(index, {
      from: fromChar,
      to: toChar,
      key
    });

    this._render();

    const duration = this._safeNumber(this._config.flip_duration, 520, 80, 2000);

    const timer = window.setTimeout(() => {
      this._displayChars[index] = toChar;
      this._flipStates.delete(index);
      this._render();
    }, duration + 40);

    this._timers.push(timer);
  }

  _clearTimers() {
    this._timers.forEach((timer) => window.clearTimeout(timer));
    this._timers = [];
  }

  _render() {
    if (!this.shadowRoot || !this._config) return;

    const config = this._applyTheme(this._config);
    const chars = this._displayChars.length
      ? this._displayChars
      : Array.from(this._targetText || "");

    this.shadowRoot.innerHTML = "";

    const style = document.createElement("style");
    style.textContent = this._getStyles(config);

    const card = document.createElement("ha-card");
    const display = document.createElement("div");

    display.className = "display";
    display.style.justifyContent = this._alignToFlex(config.align);

    chars.forEach((char, index) => {
      const flip = this._flipStates.get(index);
      const tile = document.createElement("div");

      tile.className = `split-flap-tile${!flip && char === " " ? " space" : ""}${
        flip ? " flipping" : ""
      }`;

      if (flip) {
        tile.setAttribute("data-flip-key", flip.key);
        tile.innerHTML = this._renderFlippingTile(flip.from, flip.to);
      } else {
        tile.innerHTML = this._renderStableTile(char);
      }

      display.appendChild(tile);
    });

    card.appendChild(display);
    this.shadowRoot.appendChild(style);
    this.shadowRoot.appendChild(card);
  }

  _renderStableTile(char) {
    const safe = this._escapeHtml(char);

    return `
      <div class="static-half static-top">
        <span>${safe}</span>
      </div>
      <div class="static-half static-bottom">
        <span>${safe}</span>
      </div>
      <div class="tile-hinge"></div>
      <div class="tile-pin tile-pin-left"></div>
      <div class="tile-pin tile-pin-right"></div>
    `;
  }

  _renderFlippingTile(fromChar, toChar) {
    const from = this._escapeHtml(fromChar);
    const to = this._escapeHtml(toChar);

    return `
      <div class="static-half static-top next-top">
        <span>${to}</span>
      </div>

      <div class="static-half static-bottom next-bottom">
        <span>${to}</span>
      </div>

      <div class="static-half static-bottom previous-bottom">
        <span>${from}</span>
      </div>

      <div class="flip-leaf">
        <div class="leaf-face leaf-front">
          <span>${from}</span>
        </div>
        <div class="leaf-face leaf-back">
          <span>${to}</span>
        </div>
      </div>

      <div class="tile-hinge"></div>
      <div class="tile-pin tile-pin-left"></div>
      <div class="tile-pin tile-pin-right"></div>
    `;
  }

  _applyTheme(config) {
    const themes = {
      kiosk_gold: {
        card_background: "#050505",
        segment_background: "#111111",
        segment_background_top: "#1b1b1b",
        segment_background_bottom: "#090909",
        segment_separator_color: "#000000",
        segment_border_color: "#2a2a2a",
        text_color: "#dcb215"
      },
      classic_airport: {
        card_background: "#0a0a0a",
        segment_background: "#151515",
        segment_background_top: "#202020",
        segment_background_bottom: "#0c0c0c",
        segment_separator_color: "#000000",
        segment_border_color: "#2a2a2a",
        text_color: "#f5f5f5"
      },
      terminal_amber: {
        card_background: "#050300",
        segment_background: "#120c02",
        segment_background_top: "#1f1504",
        segment_background_bottom: "#090501",
        segment_separator_color: "#000000",
        segment_border_color: "#33240a",
        text_color: "#ffb000"
      },
      monochrome: {
        card_background: "#111111",
        segment_background: "#1a1a1a",
        segment_background_top: "#242424",
        segment_background_bottom: "#0d0d0d",
        segment_separator_color: "#000000",
        segment_border_color: "#333333",
        text_color: "#f2f2f2"
      }
    };

    const selectedTheme = themes[config.theme] || {};
    const themedConfig = { ...config };

    Object.entries(selectedTheme).forEach(([key, value]) => {
      if (
        themedConfig[key] === undefined ||
        themedConfig[key] === null ||
        themedConfig[key] === ""
      ) {
        themedConfig[key] = value;
      }
    });

    return themedConfig;
  }

  _getStyles(config) {
    const width = this._safeNumber(config.segment_width, 48, 8, 160);
    const height = this._safeNumber(config.segment_height, 72, 16, 220);
    const radius = this._safeNumber(config.segment_radius, 6, 0, 40);
    const fontSize = this._safeNumber(config.font_size, 44, 8, 140);
    const gap = this._safeNumber(config.segment_gap, 6, 0, 40);
    const flipDuration = this._safeNumber(config.flip_duration, 520, 80, 2000);

    const cardBackground = this._safeColor(config.card_background, "#050505");
    const segmentBackground = this._safeColor(config.segment_background, "#111111");
    const segmentBackgroundTop = this._safeColor(
      config.segment_background_top,
      "#1b1b1b"
    );
    const segmentBackgroundBottom = this._safeColor(
      config.segment_background_bottom,
      "#090909"
    );
    const separatorColor = this._safeColor(
      config.segment_separator_color,
      "#000000"
    );
    const borderColor = this._safeColor(config.segment_border_color, "#2a2a2a");
    const textColor = this._safeColor(config.text_color, "#dcb215");

    const cardBorderRadius = this._safeNumber(
      config.card_border_radius,
      16,
      0,
      60
    );
    const cardPadding = this._safeNumber(config.card_padding, 16, 0, 80);
    const fontFamily = this._safeFontFamily(
      config.font_family,
      "Roboto Mono, monospace"
    );
    const fontWeight = this._safeFontWeight(config.font_weight, 800);

    return `
      :host {
        display: block;
      }

      ha-card {
        background: ${cardBackground};
        border-radius: ${cardBorderRadius}px;
        padding: ${cardPadding}px;
        box-sizing: border-box;
        overflow: hidden;
      }

      .display {
        display: flex;
        align-items: center;
        gap: ${gap}px;
        width: 100%;
        box-sizing: border-box;
        overflow: hidden;
      }

      .split-flap-tile {
        --segment-width: ${width}px;
        --segment-height: ${height}px;
        --half-height: ${height / 2}px;
        --flip-duration: ${flipDuration}ms;

        position: relative;
        width: var(--segment-width);
        height: var(--segment-height);
        min-width: var(--segment-width);

        border-radius: ${radius}px;
        background: ${segmentBackground};
        border: 1px solid ${borderColor};

        color: ${textColor};
        font-family: ${fontFamily};
        font-size: ${fontSize}px;
        font-weight: ${fontWeight};
        line-height: var(--segment-height);
        text-align: center;

        overflow: visible;
        box-sizing: border-box;
        perspective: 900px;
        transform-style: preserve-3d;

        box-shadow:
          inset 0 1px 0 rgba(255,255,255,0.08),
          inset 0 -1px 0 rgba(0,0,0,0.75),
          0 7px 16px rgba(0,0,0,0.45);
      }

      .split-flap-tile::before {
        content: "";
        position: absolute;
        inset: 0;
        border-radius: ${radius}px;
        pointer-events: none;
        box-shadow:
          inset 0 0 0 1px rgba(255,255,255,0.025),
          inset 0 12px 18px rgba(255,255,255,0.03),
          inset 0 -18px 24px rgba(0,0,0,0.38);
        z-index: 30;
      }

      .static-half,
      .leaf-face {
        position: absolute;
        left: 0;
        width: 100%;
        height: 50%;
        overflow: hidden;
        backface-visibility: hidden;
        -webkit-backface-visibility: hidden;
      }

      .static-top,
      .leaf-front {
        top: 0;
        background: ${segmentBackgroundTop};
        border-radius: ${radius}px ${radius}px 0 0;
      }

      .static-bottom,
      .leaf-back {
        bottom: 0;
        background: ${segmentBackgroundBottom};
        border-radius: 0 0 ${radius}px ${radius}px;
      }

      .static-half span,
      .leaf-face span {
        position: absolute;
        left: 0;
        width: 100%;
        height: var(--segment-height);
        line-height: var(--segment-height);
        text-align: center;
        color: ${textColor};
        text-shadow:
          0 2px 0 rgba(0,0,0,0.9),
          0 0 8px rgba(220,178,21,0.12);
      }

      .static-top span,
      .leaf-front span {
        top: 0;
      }

      .static-bottom span,
      .leaf-back span {
        top: calc(var(--segment-height) * -0.5);
      }

      .static-top {
        z-index: 1;
      }

      .next-bottom {
        z-index: 1;
      }

      .previous-bottom {
        z-index: 6;
        animation: hidePreviousBottom var(--flip-duration) step-end forwards;
      }

      .flip-leaf {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 50%;
        z-index: 12;
        transform-origin: bottom center;
        transform-style: preserve-3d;
        animation: splitFlapLeaf var(--flip-duration) cubic-bezier(0.24, 0.72, 0.18, 1) forwards;
      }

      .leaf-front,
      .leaf-back {
        top: 0;
        bottom: auto;
        height: 100%;
        box-shadow: 0 9px 18px rgba(0,0,0,0.45);
      }

      .leaf-front {
        transform: rotateX(0deg);
      }

      .leaf-back {
        transform: rotateX(180deg);
      }

      .leaf-back span {
        top: calc(var(--segment-height) * -0.5);
      }

      .tile-hinge {
        position: absolute;
        left: 0;
        right: 0;
        top: calc(50% - 2px);
        height: 4px;
        background: ${separatorColor};
        z-index: 20;
        box-shadow:
          0 1px 0 rgba(255,255,255,0.08),
          0 -1px 0 rgba(0,0,0,0.8);
      }

      .tile-pin {
        position: absolute;
        top: calc(50% - 4px);
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: #050505;
        border: 1px solid #2c2c2c;
        z-index: 21;
      }

      .tile-pin-left {
        left: 7px;
      }

      .tile-pin-right {
        right: 7px;
      }

      .space .static-half span,
      .space .leaf-face span {
        opacity: 0;
      }

      .flipping {
        border-color: rgba(220,178,21,0.35);
      }

      @keyframes splitFlapLeaf {
        0% {
          transform: rotateX(0deg);
          filter: brightness(1);
        }

        38% {
          transform: rotateX(-88deg);
          filter: brightness(0.7);
        }

        50% {
          transform: rotateX(-104deg);
          filter: brightness(0.55);
        }

        76% {
          transform: rotateX(-176deg);
          filter: brightness(1.08);
        }

        100% {
          transform: rotateX(-180deg);
          filter: brightness(1);
        }
      }

      @keyframes hidePreviousBottom {
        0% {
          opacity: 1;
        }

        49% {
          opacity: 1;
        }

        50% {
          opacity: 0;
        }

        100% {
          opacity: 0;
        }
      }

      @media (prefers-reduced-motion: reduce) {
        .flip-leaf,
        .previous-bottom {
          animation: none !important;
        }
      }
    `;
  }

  _alignToFlex(align) {
    if (align === "left") return "flex-start";
    if (align === "right") return "flex-end";
    return "center";
  }

  _safeNumber(value, fallback, min, max) {
    const number = Number(value);

    if (!Number.isFinite(number)) {
      return fallback;
    }

    return Math.min(Math.max(number, min), max);
  }

  _safeColor(value, fallback) {
    const input = String(value ?? "").trim();

    if (
      /^#[0-9a-fA-F]{3,8}$/.test(input) ||
      /^rgb\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}\s*\)$/.test(input) ||
      /^rgba\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*(0|1|0?\.\d+)\s*\)$/.test(input) ||
      /^var\(--[a-zA-Z0-9_-]+\)$/.test(input)
    ) {
      return input;
    }

    return fallback;
  }

  _safeFontFamily(value, fallback) {
    const input = String(value ?? "").trim();

    if (!input) {
      return fallback;
    }

    if (/url\s*\(|expression\s*\(|javascript:/i.test(input)) {
      return fallback;
    }

    if (!/^[a-zA-Z0-9åäöÅÄÖæøÆØéÉèÈêÊëË\s'",._-]+$/.test(input)) {
      return fallback;
    }

    return input;
  }

  _safeFontWeight(value, fallback) {
    const input = String(value ?? "").trim();

    if (/^(normal|bold|lighter|bolder)$/.test(input)) {
      return input;
    }

    const number = Number(input);

    if (!Number.isFinite(number)) {
      return fallback;
    }

    return Math.min(Math.max(Math.round(number), 100), 1000);
  }

  _escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }
}

class HASplitFlapCardEditor extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._config = {};
    this._hass = null;
  }

  set hass(hass) {
    this._hass = hass;
  }

  setConfig(config) {
    this._config = { ...config };
    this._render();
  }

  _value(name, fallback = "") {
    return this._config[name] ?? fallback;
  }

  _checked(name, fallback = false) {
    const value = this._config[name];
    return value === undefined ? fallback : Boolean(value);
  }

  _updateValue(name, value) {
    const nextConfig = { ...this._config };

    if (value === "" || value === undefined || value === null) {
      delete nextConfig[name];
    } else {
      nextConfig[name] = value;
    }

    if (name === "source") {
      if (value === "text") {
        delete nextConfig.entity;
        delete nextConfig.attribute;
      } else if (value === "entity") {
        delete nextConfig.text;
      } else if (value === "clock") {
        delete nextConfig.text;
        delete nextConfig.entity;
        delete nextConfig.attribute;
      }
    }

    this._config = nextConfig;
    this._fireConfigChanged();
    this._render();
  }

  _updateNumber(name, value) {
    if (value === "") {
      this._updateValue(name, undefined);
      return;
    }

    const number = Number(value);

    if (Number.isFinite(number)) {
      this._updateValue(name, number);
    }
  }

  _updateBoolean(name, checked) {
    this._updateValue(name, checked);
  }

  _fireConfigChanged() {
    const event = new CustomEvent("config-changed", {
      bubbles: true,
      composed: true,
      detail: {
        config: this._config
      }
    });

    this.dispatchEvent(event);
  }

  _render() {
    const source = this._value("source", this._inferSource());
    const theme = this._value("theme", "kiosk_gold");
    const language = this._value("language", "sv");
    const charset = this._value("charset", language);

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
        }

        .editor {
          display: grid;
          gap: 14px;
          padding: 4px 0 12px;
        }

        .row {
          display: grid;
          gap: 6px;
        }

        .grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 12px;
        }

        label {
          color: var(--secondary-text-color);
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.02em;
        }

        input,
        select {
          box-sizing: border-box;
          width: 100%;
          min-height: 40px;
          border: 1px solid var(--divider-color, #333);
          border-radius: 8px;
          padding: 8px 10px;
          background: var(--card-background-color, #1c1c1c);
          color: var(--primary-text-color, #fff);
          font: inherit;
        }

        input[type="checkbox"] {
          width: auto;
          min-height: auto;
        }

        .check-row {
          display: flex;
          align-items: center;
          gap: 10px;
          min-height: 40px;
        }

        .hint {
          color: var(--secondary-text-color);
          font-size: 12px;
          line-height: 1.35;
        }

        @media (max-width: 560px) {
          .grid {
            grid-template-columns: 1fr;
          }
        }
      </style>

      <div class="editor">
        <div class="row">
          <label for="source">Source</label>
          <select id="source" data-field="source">
            <option value="text"${source === "text" ? " selected" : ""}>text</option>
            <option value="entity"${source === "entity" ? " selected" : ""}>entity</option>
            <option value="clock"${source === "clock" ? " selected" : ""}>clock</option>
          </select>
        </div>

        ${source === "text" ? this._renderTextFields() : ""}
        ${source === "entity" ? this._renderEntityFields() : ""}
        ${source === "clock" ? this._renderClockFields() : ""}

        <div class="grid">
          <div class="row">
            <label for="language">Language</label>
            <select id="language" data-field="language">
              ${this._option("en", language)}
              ${this._option("sv", language)}
              ${this._option("nordic", language)}
              ${this._option("western", language)}
            </select>
          </div>

          <div class="row">
            <label for="charset">Charset</label>
            <select id="charset" data-field="charset">
              ${this._option("", charset, "auto")}
              ${this._option("en", charset)}
              ${this._option("sv", charset)}
              ${this._option("nordic", charset)}
              ${this._option("western", charset)}
              ${this._option("weather", charset)}
              ${this._option("weather_sv", charset)}
              ${this._option("extended", charset)}
              ${this._option("custom", charset)}
            </select>
          </div>
        </div>

        ${
          charset === "custom"
            ? `<div class="row">
                <label for="custom_charset">Custom charset</label>
                <input id="custom_charset" data-field="custom_charset" value="${this._escapeAttribute(this._value("custom_charset", ""))}">
              </div>`
            : ""
        }

        <div class="grid">
          <div class="row">
            <label for="segments">Segments</label>
            <input id="segments" data-number="segments" type="number" min="1" max="160" value="${this._escapeAttribute(this._value("segments", ""))}">
          </div>

          <div class="row">
            <label for="theme">Theme</label>
            <select id="theme" data-field="theme">
              ${this._option("classic", theme)}
              ${this._option("kiosk_gold", theme)}
              ${this._option("classic_airport", theme)}
              ${this._option("terminal_amber", theme)}
              ${this._option("monochrome", theme)}
            </select>
          </div>
        </div>

        <div class="grid">
          <div class="row">
            <label for="align">Align</label>
            <select id="align" data-field="align">
              ${this._option("left", this._value("align", "center"))}
              ${this._option("center", this._value("align", "center"))}
              ${this._option("right", this._value("align", "center"))}
            </select>
          </div>

          <div class="row">
            <label for="text_transform">Text transform</label>
            <select id="text_transform" data-field="text_transform">
              ${this._option("uppercase", this._value("text_transform", "uppercase"))}
              ${this._option("lowercase", this._value("text_transform", "uppercase"))}
              ${this._option("none", this._value("text_transform", "uppercase"))}
            </select>
          </div>
        </div>

        <div class="grid">
          <div class="check-row">
            <input id="animation" data-boolean="animation" type="checkbox"${this._checked("animation", true) ? " checked" : ""}>
            <label for="animation">Animation</label>
          </div>

          <div class="check-row">
            <input id="cycle_chars" data-boolean="cycle_chars" type="checkbox"${this._checked("cycle_chars", true) ? " checked" : ""}>
            <label for="cycle_chars">Cycle chars</label>
          </div>
        </div>

        <div class="grid">
          <div class="row">
            <label for="flip_duration">Flip duration</label>
            <input id="flip_duration" data-number="flip_duration" type="number" min="80" max="2000" value="${this._escapeAttribute(this._value("flip_duration", ""))}">
          </div>

          <div class="row">
            <label for="flip_stagger">Flip stagger</label>
            <input id="flip_stagger" data-number="flip_stagger" type="number" min="0" max="500" value="${this._escapeAttribute(this._value("flip_stagger", ""))}">
          </div>
        </div>

        <div class="hint">
          Advanced styling options can still be edited directly in YAML.
        </div>
      </div>
    `;

    this._bindEvents();
  }

  _renderTextFields() {
    return `
      <div class="row">
        <label for="text">Text</label>
        <input id="text" data-field="text" value="${this._escapeAttribute(this._value("text", ""))}">
      </div>
    `;
  }

  _renderEntityFields() {
    return `
      <div class="row">
        <label for="entity">Entity</label>
        <input id="entity" data-field="entity" placeholder="input_text.split_flap_message" value="${this._escapeAttribute(this._value("entity", ""))}">
      </div>

      <div class="row">
        <label for="attribute">Attribute</label>
        <input id="attribute" data-field="attribute" placeholder="Optional" value="${this._escapeAttribute(this._value("attribute", ""))}">
      </div>
    `;
  }

  _renderClockFields() {
    return `
      <div class="grid">
        <div class="row">
          <label for="clock_format">Clock format</label>
          <input id="clock_format" data-field="clock_format" value="${this._escapeAttribute(this._value("clock_format", "HH:mm"))}">
        </div>

        <div class="row">
          <label for="clock_tick_interval">Clock tick interval</label>
          <input id="clock_tick_interval" data-number="clock_tick_interval" type="number" min="250" max="60000" value="${this._escapeAttribute(this._value("clock_tick_interval", 1000))}">
        </div>
      </div>
    `;
  }

  _bindEvents() {
    this.shadowRoot.querySelectorAll("[data-field]").forEach((element) => {
      element.addEventListener("change", () => {
        const field = element.getAttribute("data-field");
        this._updateValue(field, element.value);
      });

      if (element.tagName === "INPUT") {
        element.addEventListener("input", () => {
          const field = element.getAttribute("data-field");
          this._updateValue(field, element.value);
        });
      }
    });

    this.shadowRoot.querySelectorAll("[data-number]").forEach((element) => {
      element.addEventListener("change", () => {
        const field = element.getAttribute("data-number");
        this._updateNumber(field, element.value);
      });

      element.addEventListener("input", () => {
        const field = element.getAttribute("data-number");
        this._updateNumber(field, element.value);
      });
    });

    this.shadowRoot.querySelectorAll("[data-boolean]").forEach((element) => {
      element.addEventListener("change", () => {
        const field = element.getAttribute("data-boolean");
        this._updateBoolean(field, element.checked);
      });
    });
  }

  _inferSource() {
    if (this._config.source) return this._config.source;
    if (this._config.entity) return "entity";
    if (this._config.clock || this._config.clock_format) return "clock";
    return "text";
  }

  _option(value, selected, label = value) {
    return `<option value="${this._escapeAttribute(value)}"${
      value === selected ? " selected" : ""
    }>${this._escapeHtml(label)}</option>`;
  }

  _escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  _escapeAttribute(value) {
    return this._escapeHtml(value);
  }
}

if (!customElements.get("split-flap-card")) {
  customElements.define("split-flap-card", HASplitFlapCard);
}

if (!customElements.get("split-flap-card-editor")) {
  customElements.define("split-flap-card-editor", HASplitFlapCardEditor);
}

window.customCards = window.customCards || [];
window.customCards.push({
  type: "split-flap-card",
  name: "Split-Flap Card",
  preview: true,
  description: "Display text, entity states or a clock as a classic split-flap display.",
  documentationURL: "https://github.com/ph13t0n/ha-split-flap-card"
});
