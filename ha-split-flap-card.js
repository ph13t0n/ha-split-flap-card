const SPLIT_FLAP_CARD_VERSION = "0.1.0-beta.3";
const SFC_REPO_URL = "https://github.com/ph13t0n/ha-split-flap-card";

const SFC_CARD_DEFAULTS = {
  card_background: "#030303",
  frame_background: "#050505"
};

const SFC_THEMES = {
  mechanical_gold: {
    label: "Default / Mechanical Gold",
    segment_background: "#101010",
    segment_background_top: "#252525",
    segment_background_bottom: "#080808",
    segment_separator_color: "#010101",
    segment_border_color: "#313131",
    text_color: "#ffc02e",
    font_family: "Roboto Condensed, Arial Narrow, sans-serif",
    font_weight: 900
  },
  kiosk_gold: {
    label: "Kiosk Gold",
    segment_background: "#101010",
    segment_background_top: "#252525",
    segment_background_bottom: "#080808",
    segment_separator_color: "#010101",
    segment_border_color: "#313131",
    text_color: "#ffc02e",
    font_family: "Roboto Condensed, Arial Narrow, sans-serif",
    font_weight: 900
  },
  classic_airport: {
    label: "Classic Airport",
    segment_background: "#1a2225",
    segment_background_top: "#243136",
    segment_background_bottom: "#0b1012",
    segment_separator_color: "#070909",
    segment_border_color: "#334247",
    text_color: "#f7d53b",
    font_family: "Barlow Condensed, Arial Narrow, sans-serif",
    font_weight: 900
  },
  terminal_amber: {
    label: "Terminal Amber",
    segment_background: "#f7d53b",
    segment_background_top: "#ffe56b",
    segment_background_bottom: "#d6b724",
    segment_separator_color: "#856f10",
    segment_border_color: "#a98d16",
    text_color: "#1a2225",
    font_family: "Roboto Mono, monospace",
    font_weight: 900
  },
  nordic_light: {
    label: "Nordic Light",
    segment_background: "#ffffff",
    segment_background_top: "#ffffff",
    segment_background_bottom: "#e9eaec",
    segment_separator_color: "#9b9da1",
    segment_border_color: "#c8cbd0",
    text_color: "#000000",
    font_family: "Inter, system-ui, sans-serif",
    font_weight: 900
  },
  monochrome: {
    label: "Monochrome",
    segment_background: "#080808",
    segment_background_top: "#151515",
    segment_background_bottom: "#000000",
    segment_separator_color: "#000000",
    segment_border_color: "#262626",
    text_color: "#ffffff",
    font_family: "Roboto Mono, monospace",
    font_weight: 900
  },
  home_assistant_blue: {
    label: "Home Assistant Blue",
    segment_background: "#0b1118",
    segment_background_top: "#172430",
    segment_background_bottom: "#05090d",
    segment_separator_color: "#020406",
    segment_border_color: "#1d3444",
    text_color: "#03a9f4",
    font_family: "Roboto Condensed, Arial Narrow, sans-serif",
    font_weight: 900
  },
  sweden_delight: {
    label: "Sweden Delight",
    segment_background: "#004d6b",
    segment_background_top: "#08617f",
    segment_background_bottom: "#00384f",
    segment_separator_color: "#002a3b",
    segment_border_color: "#0d6f92",
    text_color: "#fecb00",
    font_family: "Sweden Sans, Noto Sans, Arial, sans-serif",
    font_weight: 900
  }
};

const SFC_THEME_KEYS = [
  "segment_background",
  "segment_background_top",
  "segment_background_bottom",
  "segment_separator_color",
  "segment_border_color",
  "text_color"
];

const SFC_FONT_PRESETS = {
  theme_default: {
    label: "Theme default",
    family: null,
    weight: null
  },
  mechanical: {
    label: "Mechanical",
    family: "Roboto Condensed, Arial Narrow, sans-serif",
    weight: 900
  },
  transit: {
    label: "Transit",
    family: "Barlow Condensed, Arial Narrow, sans-serif",
    weight: 900
  },
  clean: {
    label: "Clean",
    family: "Inter, system-ui, sans-serif",
    weight: 800
  },
  mono: {
    label: "Mono",
    family: "Roboto Mono, monospace",
    weight: 800
  },
  custom: {
    label: "Custom",
    family: "system-ui, sans-serif",
    weight: 800
  }
};

const SFC_CHARSETS = {
  en: " ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-:.,/",
  sv: " ABCDEFGHIJKLMNOPQRSTUVWXYZÅÄÖ0123456789-:.,°/+",
  nordic: " ABCDEFGHIJKLMNOPQRSTUVWXYZÅÄÖÆØ0123456789-:.,°/+",
  western: " ABCDEFGHIJKLMNOPQRSTUVWXYZÅÄÖÆØÜÉÈÀÇÑ0123456789-:.,°/+",
  weather: " ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-:.,°/+%",
  weather_sv: " ABCDEFGHIJKLMNOPQRSTUVWXYZÅÄÖ0123456789-:.,°/+%",
  extended: " ABCDEFGHIJKLMNOPQRSTUVWXYZÅÄÖÆØÜÉÈÀÇÑabcdefghijklmnopqrstuvwxyzåäöæøüéèàçñ0123456789-:.,°/+%!?()[]",
};

class HASplitFlapCard extends HTMLElement {
  static getStubConfig() {
    return {
      source: "text",
      text: "SPLIT-FLAP TEST",
      segments: 16,
      theme: "mechanical_gold",
      font_preset: "theme_default",
      animation: true,
      initial_animation: true,
      animation_feel: "mechanical",
      letter_vertical_offset: -9
    };
  }

  static getConfigElement() {
    return document.createElement("split-flap-card-editor");
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._config = {};
    this._hass = null;
    this._clockTimer = null;
    this._timers = [];
    this._visibleText = "";
    this._lastTargetText = "";
    this._hasRendered = false;
  }

  setConfig(config) {
    if (!config || typeof config !== "object") {
      throw new Error("Invalid configuration.");
    }

    const raw = { ...config };
    const source = config.source || (config.entity ? "entity" : (config.clock || config.clock_format ? "clock" : "text"));

    if (!["text", "entity", "clock"].includes(source)) {
      throw new Error("Content source must be text, entity or clock.");
    }

    const themeKey = config.theme || "mechanical_gold";
    const theme = SFC_THEMES[themeKey] || SFC_THEMES.mechanical_gold;
    const anim = this._animationPreset(config.animation_feel || "mechanical");
    const font = this._fontPreset(config.font_preset || "theme_default", themeKey);

    this._config = {
      source,
      text: "",
      entity: "",
      attribute: "",
      theme: "mechanical_gold",
      font_preset: "theme_default",
      font_family: font.font_family,
      font_stylesheet: "",
      font_size: 60,
      font_weight: font.font_weight,
      font_style: "normal",
      letter_spacing: -1,
      letter_vertical_offset: -9,
      text_transform: "uppercase",
      text_glow: "off",
      segments: 16,
      align: "center",
      charset: "sv",
      custom_charset: SFC_CHARSETS.sv,
      fallback_character: " ",
      pad_character: " ",
      pad_mode: "end",
      animation: true,
      initial_animation: true,
      animation_feel: "mechanical",
      cycle_chars: true,
      cycle_count: anim.cycle_count,
      flip_duration: anim.flip_duration,
      flip_stagger: anim.flip_stagger,
      clock_format: "HH:mm",
      clock_tick_interval: 1000,
      segment_width: 48,
      segment_height: 78,
      segment_gap: 6,
      segment_radius: 7,
      ...SFC_CARD_DEFAULTS,
      segment_background: theme.segment_background,
      segment_background_top: theme.segment_background_top,
      segment_background_bottom: theme.segment_background_bottom,
      segment_separator_color: theme.segment_separator_color,
      segment_border_color: theme.segment_border_color,
      text_color: theme.text_color,
      ...raw,
      source
    };

    this._applyTheme(theme, raw);
    this._restartClock();
    this._updateFromSource(true);
  }

  set hass(hass) {
    this._hass = hass;
    if (this._config?.source === "entity") {
      this._updateFromSource(false);
    }
  }

  disconnectedCallback() {
    this._stopClock();
    this._clearTimers();
  }

  getCardSize() {
    return 2;
  }

  _animationPreset(value) {
    const presets = {
      calm: { flip_duration: 980, flip_stagger: 75, cycle_count: 2 },
      mechanical: { flip_duration: 760, flip_stagger: 45, cycle_count: 2 },
      fast: { flip_duration: 420, flip_stagger: 22, cycle_count: 1 },
      instant: { flip_duration: 0, flip_stagger: 0, cycle_count: 0 },
      custom: {
        flip_duration: this._config?.flip_duration || 760,
        flip_stagger: this._config?.flip_stagger || 45,
        cycle_count: this._config?.cycle_count || 2
      }
    };

    return presets[value] || presets.mechanical;
  }

  _fontPreset(value, themeKey) {
    const theme = SFC_THEMES[themeKey] || SFC_THEMES.mechanical_gold;
    const preset = SFC_FONT_PRESETS[value] || SFC_FONT_PRESETS.theme_default;

    return {
      font_family: value === "theme_default" ? theme.font_family : (preset.family || theme.font_family),
      font_weight: value === "theme_default" ? theme.font_weight : (preset.weight || theme.font_weight)
    };
  }

  _applyTheme(theme, raw = {}) {
    SFC_THEME_KEYS.forEach((key) => {
      if (raw[key] === undefined || raw[key] === null || raw[key] === "") {
        this._config[key] = theme[key];
      }
    });

    if (!this._config.card_background) this._config.card_background = SFC_CARD_DEFAULTS.card_background;
    if (!this._config.frame_background) this._config.frame_background = SFC_CARD_DEFAULTS.frame_background;
    if (!this._config.text_glow) this._config.text_glow = "off";

    if (this._config.font_preset !== "custom" && !raw.font_family) {
      const font = this._fontPreset(this._config.font_preset, this._config.theme);
      this._config.font_family = font.font_family;
      this._config.font_weight = raw.font_weight ?? font.font_weight;
    }

    if (this._config.animation_feel && this._config.animation_feel !== "custom") {
      const animation = this._animationPreset(this._config.animation_feel);
      this._config.flip_duration = animation.flip_duration;
      this._config.flip_stagger = animation.flip_stagger;
      this._config.cycle_count = animation.cycle_count;
      this._config.animation = this._config.animation_feel !== "instant";
    }
  }

  _restartClock() {
    this._stopClock();
    if (this._config.source !== "clock") return;

    this._clockTimer = window.setInterval(
      () => this._updateFromSource(false),
      this._num(this._config.clock_tick_interval, 1000, 250, 60000)
    );
  }

  _stopClock() {
    if (this._clockTimer) {
      window.clearInterval(this._clockTimer);
      this._clockTimer = null;
    }
  }

  _clearTimers() {
    this._timers.forEach((id) => window.clearTimeout(id));
    this._timers = [];
  }

  _updateFromSource(force = false) {
    const target = this._text();
    if (!force && target === this._lastTargetText) return;

    this._lastTargetText = target;
    const first = !this._hasRendered;
    const animate = this._config.animation !== false &&
      this._num(this._config.flip_duration, 0, 0, 3000) > 0 &&
      (!first || this._config.initial_animation !== false);

    if (!animate) {
      this._renderText(target, this._visibleText || target, false);
      this._visibleText = target;
      this._hasRendered = true;
      return;
    }

    this._animateTo(target, first);
  }

  _animateTo(target, first) {
    this._clearTimers();

    const from = first
      ? "".padEnd(Array.from(target).length, " ")
      : (this._visibleText || "".padEnd(Array.from(target).length, " "));

    const cycles = this._config.cycle_chars === false ? 0 : this._num(this._config.cycle_count, 2, 0, 8);
    const duration = this._num(this._config.flip_duration, 760, 0, 3000);
    const stepDelay = Math.max(90, Math.min(260, Math.round(duration * 0.42)));
    const steps = [];

    for (let i = 0; i < cycles; i += 1) {
      steps.push(this._shuffleText(target, from, i));
    }
    steps.push(target);

    let previous = from;

    steps.forEach((stepText, index) => {
      const timer = window.setTimeout(() => {
        this._renderText(stepText, previous, true);
        previous = stepText;
        if (index === steps.length - 1) {
          this._visibleText = target;
          this._hasRendered = true;
        }
      }, index * stepDelay);
      this._timers.push(timer);
    });
  }

  _shuffleText(target, from, stepIndex) {
    const chars = Array.from(this._charset());
    const targetChars = Array.from(target);
    const fromChars = Array.from(from.padEnd(targetChars.length, " "));

    return targetChars.map((char, index) => {
      if (char === fromChars[index]) return char;
      return chars[(index * 17 + stepIndex * 11 + targetChars.length) % chars.length] || char;
    }).join("");
  }

  _rawText() {
    const config = this._config;

    if (config.source === "clock") return this._clock(config.clock_format);

    if (config.source === "entity") {
      if (!this._hass || !config.entity) return "";
      const state = this._hass.states[config.entity];
      if (!state) return "ENTITY NOT FOUND";
      if (config.attribute) {
        const value = state.attributes?.[config.attribute];
        return value === undefined || value === null ? "" : String(value);
      }
      return String(state.state);
    }

    return String(config.text ?? "");
  }

  _clock(format) {
    const now = new Date();
    const values = {
      HH: String(now.getHours()).padStart(2, "0"),
      H: String(now.getHours()),
      mm: String(now.getMinutes()).padStart(2, "0"),
      ss: String(now.getSeconds()).padStart(2, "0")
    };

    return String(format || "HH:mm")
      .replaceAll("HH", values.HH)
      .replaceAll("H", values.H)
      .replaceAll("mm", values.mm)
      .replaceAll("ss", values.ss);
  }

  _text() {
    let text = this._rawText();

    if (this._config.text_transform === "uppercase") text = text.toLocaleUpperCase("sv-SE");
    if (this._config.text_transform === "lowercase") text = text.toLocaleLowerCase("sv-SE");

    const count = this._num(this._config.segments, Math.max(Array.from(text).length, 1), 1, 160);
    const truncated = Array.from(text).slice(0, count).join("");
    const pad = this._first(this._config.pad_character, " ");

    return this._config.pad_mode === "start"
      ? truncated.padStart(count, pad)
      : truncated.padEnd(count, pad);
  }

  _renderText(text, oldText, animate) {
    const chars = Array.from(text);
    const old = Array.from(String(oldText || "").padEnd(chars.length, " "));
    const tiles = chars.map((char, index) => this._tile(char, old[index] || " ", index, animate && (old[index] || " ") !== char)).join("");

    this.shadowRoot.innerHTML = `
      ${this._stylesheetLink()}
      ${this._styles(this._config)}
      <ha-card>
        <div class="display-shell">
          <div class="display" style="justify-content:${this._align(this._config.align)}">
            ${tiles}
          </div>
        </div>
      </ha-card>
    `;
  }

  _stylesheetLink() {
    const url = this._safeStylesheetUrl(this._config.font_stylesheet);
    return url ? `<link rel="stylesheet" href="${this._escape(url)}">` : "";
  }

  _tile(char, oldChar, index, animate) {
    const safe = this._escape(char);
    const old = this._escape(oldChar);
    const delay = this._num(this._config.flip_stagger, 45, 0, 1000) * index;

    return `
      <div class="split-flap-tile${char === " " ? " space" : ""}${animate ? " animate" : ""}" style="--delay:${delay}ms">
        <div class="flap top current"><span>${safe}</span></div>
        <div class="flap bottom current"><span>${safe}</span></div>
        ${animate ? `<div class="flap top flip-old"><span>${old}</span></div><div class="flap bottom flip-new"><span>${safe}</span></div>` : ""}
        <div class="hinge"></div>
        <div class="pin pin-left"></div>
        <div class="pin pin-right"></div>
      </div>
    `;
  }

  _styles(config) {
    const width = this._num(config.segment_width, 48, 8, 180);
    const height = this._num(config.segment_height, 78, 16, 240);
    const radius = this._num(config.segment_radius, 7, 0, 40);
    const gap = this._num(config.segment_gap, 6, 0, 80);
    const fontSize = this._num(config.font_size, Math.round(height * 0.78), 6, 220);
    const verticalOffset = this._num(config.letter_vertical_offset, -4, -80, 80);
    const letterSpacing = this._num(config.letter_spacing, 0, -20, 40);
    const duration = this._num(config.flip_duration, 760, 0, 3000);
    const glow = config.text_glow && config.text_glow !== "off"
      ? `text-shadow: 0 0 8px ${this._css(config.text_color, "#ffc02e")};`
      : "";

    return `
      <style>
        :host {
          display: block;
        }

        ha-card {
          overflow: hidden;
          border-radius: ${this._num(config.card_border_radius, 16, 0, 60)}px;
          background: ${this._css(config.card_background, "#030303")};
          padding: ${this._num(config.card_padding, 16, 0, 80)}px;
        }

        .display-shell {
          box-sizing: border-box;
          width: 100%;
          border-radius: ${Math.max(radius + 6, 10)}px;
          background: ${this._css(config.frame_background, "#050505")};
          border: 1px solid rgba(255, 255, 255, 0.08);
          padding: ${Math.max(8, Math.round(gap * 2))}px;
          box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.8), 0 14px 30px rgba(0, 0, 0, 0.45);
        }

        .display {
          display: flex;
          align-items: center;
          gap: ${gap}px;
          min-width: 0;
          overflow: hidden;
        }

        .split-flap-tile {
          position: relative;
          flex: 0 0 ${width}px;
          width: ${width}px;
          height: ${height}px;
          border-radius: ${radius}px;
          overflow: hidden;
          background: ${this._css(config.segment_background, "#101010")};
          border: 1px solid ${this._css(config.segment_border_color, "#313131")};
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.07), inset 0 -12px 18px rgba(0,0,0,0.38), 0 4px 10px rgba(0,0,0,0.6);
          perspective: 900px;
        }

        .split-flap-tile.space {
          opacity: 0.82;
        }

        .flap {
          position: absolute;
          left: 0;
          right: 0;
          height: 50%;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          color: ${this._css(config.text_color, "#ffc02e")};
          font-family: ${this._font(config.font_family)};
          font-size: ${fontSize}px;
          font-weight: ${this._fontWeight(config.font_weight)};
          font-style: ${config.font_style === "italic" ? "italic" : "normal"};
          letter-spacing: ${letterSpacing}px;
          line-height: 1;
          ${glow}
          backface-visibility: hidden;
        }

        .flap span {
          display: block;
          transform: translateY(${verticalOffset}px);
        }

        .top {
          top: 0;
          align-items: flex-end;
          background: linear-gradient(180deg, ${this._css(config.segment_background_top, "#252525")}, ${this._css(config.segment_background, "#101010")});
        }

        .top span {
          transform: translateY(calc(50% + ${verticalOffset}px));
        }

        .bottom {
          bottom: 0;
          align-items: flex-start;
          background: linear-gradient(180deg, ${this._css(config.segment_background, "#101010")}, ${this._css(config.segment_background_bottom, "#080808")});
        }

        .bottom span {
          transform: translateY(calc(-50% + ${verticalOffset}px));
        }

        .hinge {
          position: absolute;
          left: 0;
          right: 0;
          top: calc(50% - 1px);
          height: 2px;
          background: ${this._css(config.segment_separator_color, "#010101")};
          box-shadow: 0 -1px 0 rgba(255,255,255,0.05), 0 1px 0 rgba(0,0,0,0.8);
          z-index: 8;
        }

        .pin {
          position: absolute;
          z-index: 9;
          top: calc(50% - 2px);
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: rgba(255,255,255,0.17);
          box-shadow: 0 0 0 1px rgba(0,0,0,0.7);
        }

        .pin-left {
          left: 4px;
        }

        .pin-right {
          right: 4px;
        }

        .flip-old,
        .flip-new {
          z-index: 7;
          animation-duration: ${duration}ms;
          animation-delay: var(--delay);
          animation-timing-function: cubic-bezier(.2,.72,.18,1);
          animation-fill-mode: both;
        }

        .flip-old {
          transform-origin: bottom;
          animation-name: sfc-flip-old;
        }

        .flip-new {
          transform-origin: top;
          animation-name: sfc-flip-new;
        }

        @keyframes sfc-flip-old {
          0% { transform: rotateX(0deg); filter: brightness(1); }
          100% { transform: rotateX(-90deg); filter: brightness(0.45); }
        }

        @keyframes sfc-flip-new {
          0% { transform: rotateX(90deg); filter: brightness(0.45); }
          100% { transform: rotateX(0deg); filter: brightness(1); }
        }
      </style>
    `;
  }

  _charset() {
    if (this._config.charset === "custom") {
      return this._config.custom_charset || SFC_CHARSETS.sv;
    }

    return SFC_CHARSETS[this._config.charset] || SFC_CHARSETS[this._config.language] || SFC_CHARSETS.sv;
  }

  _align(value) {
    if (value === "left") return "flex-start";
    if (value === "right") return "flex-end";
    return "center";
  }

  _num(value, fallback, min, max) {
    const number = Number(value);
    if (!Number.isFinite(number)) return fallback;
    return Math.min(max, Math.max(min, number));
  }

  _first(value, fallback) {
    const chars = Array.from(String(value ?? ""));
    return chars.length ? chars[0] : fallback;
  }

  _css(value, fallback) {
    const text = String(value || fallback);
    return /^[#a-zA-Z0-9(),.%\s-]+$/.test(text) ? text : fallback;
  }

  _font(value) {
    return String(value || "Roboto Mono, monospace").replace(/[;{}<>]/g, "");
  }

  _fontWeight(value) {
    const text = String(value || "800");
    return /^[0-9a-zA-Z\s-]+$/.test(text) ? text : "800";
  }

  _safeStylesheetUrl(value) {
    const url = String(value || "").trim();
    if (!url) return "";
    if (url.startsWith("/local/")) return url;
    if (/^https:\/\/[a-zA-Z0-9._~:/?#\[\]@!$&'()*+,;=%-]+$/.test(url)) return url;
    return "";
  }

  _escape(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }
}

class SplitFlapCardEditor extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._config = {};
  }

  setConfig(config) {
    this._config = { ...(config || {}) };
    this._render();
  }

  _value(key, fallback = "") {
    return this._config[key] ?? fallback;
  }

  _checked(key, fallback = false) {
    return this._config[key] ?? fallback;
  }

  _updateValue(key, value) {
    const nextConfig = { ...this._config, [key]: value };

    if (key === "source") {
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

  _updateNumber(key, value) {
    if (value === "") {
      const nextConfig = { ...this._config };
      delete nextConfig[key];
      this._config = nextConfig;
      this._fireConfigChanged();
      this._render();
      return;
    }

    const number = Number(value);
    if (Number.isFinite(number)) {
      this._updateValue(key, number);
    }
  }

  _updateBoolean(key, checked) {
    this._updateValue(key, checked);
  }

  _fireConfigChanged() {
    this.dispatchEvent(new CustomEvent("config-changed", {
      bubbles: true,
      composed: true,
      detail: { config: this._config }
    }));
  }

  _render() {
    const source = this._value("source", this._inferSource());
    const theme = this._value("theme", "mechanical_gold");
    const language = this._value("language", "sv");
    const charset = this._value("charset", language);

    this.shadowRoot.innerHTML = `
      <style>
        .editor { display: grid; gap: 14px; padding: 4px 0 12px; }
        .row { display: grid; gap: 6px; }
        .grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; }
        label { color: var(--secondary-text-color); font-size: 12px; font-weight: 600; letter-spacing: 0.02em; }
        input, select {
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
        input[type="checkbox"] { width: auto; min-height: auto; }
        .check-row { display: flex; align-items: center; gap: 10px; min-height: 40px; }
        .hint { color: var(--secondary-text-color); font-size: 12px; line-height: 1.35; }
        @media (max-width: 560px) { .grid { grid-template-columns: 1fr; } }
      </style>

      <div class="editor">
        <div class="row">
          <label for="source">Source</label>
          <select id="source" data-field="source">
            ${this._option("text", source)}
            ${this._option("entity", source)}
            ${this._option("clock", source)}
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

        ${charset === "custom" ? `<div class="row"><label for="custom_charset">Custom charset</label><input id="custom_charset" data-field="custom_charset" value="${this._escape(this._value("custom_charset", ""))}"></div>` : ""}

        <div class="grid">
          <div class="row">
            <label for="segments">Segments</label>
            <input id="segments" data-number="segments" type="number" min="1" max="160" value="${this._escape(this._value("segments", ""))}">
          </div>

          <div class="row">
            <label for="theme">Theme</label>
            <select id="theme" data-field="theme">
              ${this._option("mechanical_gold", theme)}
              ${this._option("kiosk_gold", theme)}
              ${this._option("classic_airport", theme)}
              ${this._option("terminal_amber", theme)}
              ${this._option("nordic_light", theme)}
              ${this._option("monochrome", theme)}
              ${this._option("home_assistant_blue", theme)}
              ${this._option("sweden_delight", theme)}
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
            <label for="font_preset">Font preset</label>
            <select id="font_preset" data-field="font_preset">
              ${this._option("theme_default", this._value("font_preset", "theme_default"))}
              ${this._option("mechanical", this._value("font_preset", "theme_default"))}
              ${this._option("transit", this._value("font_preset", "theme_default"))}
              ${this._option("clean", this._value("font_preset", "theme_default"))}
              ${this._option("mono", this._value("font_preset", "theme_default"))}
              ${this._option("custom", this._value("font_preset", "theme_default"))}
            </select>
          </div>
        </div>

        <div class="grid">
          <div class="row">
            <label for="text_transform">Text transform</label>
            <select id="text_transform" data-field="text_transform">
              ${this._option("uppercase", this._value("text_transform", "uppercase"))}
              ${this._option("lowercase", this._value("text_transform", "uppercase"))}
              ${this._option("none", this._value("text_transform", "uppercase"))}
            </select>
          </div>

          <div class="row">
            <label for="font_size">Font size</label>
            <input id="font_size" data-number="font_size" type="number" min="6" max="220" value="${this._escape(this._value("font_size", ""))}">
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
            <input id="flip_duration" data-number="flip_duration" type="number" min="0" max="3000" value="${this._escape(this._value("flip_duration", ""))}">
          </div>

          <div class="row">
            <label for="flip_stagger">Flip stagger</label>
            <input id="flip_stagger" data-number="flip_stagger" type="number" min="0" max="1000" value="${this._escape(this._value("flip_stagger", ""))}">
          </div>
        </div>

        <div class="hint">Advanced styling options can still be edited directly in YAML.</div>
      </div>
    `;

    this._bindEvents();
  }

  _renderTextFields() {
    return `<div class="row"><label for="text">Text</label><input id="text" data-field="text" value="${this._escape(this._value("text", ""))}"></div>`;
  }

  _renderEntityFields() {
    return `
      <div class="row"><label for="entity">Entity</label><input id="entity" data-field="entity" placeholder="input_text.split_flap_message" value="${this._escape(this._value("entity", ""))}"></div>
      <div class="row"><label for="attribute">Attribute</label><input id="attribute" data-field="attribute" placeholder="Optional" value="${this._escape(this._value("attribute", ""))}"></div>
    `;
  }

  _renderClockFields() {
    return `
      <div class="grid">
        <div class="row"><label for="clock_format">Clock format</label><input id="clock_format" data-field="clock_format" value="${this._escape(this._value("clock_format", "HH:mm"))}"></div>
        <div class="row"><label for="clock_tick_interval">Clock tick interval</label><input id="clock_tick_interval" data-number="clock_tick_interval" type="number" min="250" max="60000" value="${this._escape(this._value("clock_tick_interval", 1000))}"></div>
      </div>
    `;
  }

  _bindEvents() {
    this.shadowRoot.querySelectorAll("[data-field]").forEach((element) => {
      element.addEventListener("change", () => this._updateValue(element.getAttribute("data-field"), element.value));
      if (element.tagName === "INPUT") {
        element.addEventListener("input", () => this._updateValue(element.getAttribute("data-field"), element.value));
      }
    });

    this.shadowRoot.querySelectorAll("[data-number]").forEach((element) => {
      element.addEventListener("change", () => this._updateNumber(element.getAttribute("data-number"), element.value));
      element.addEventListener("input", () => this._updateNumber(element.getAttribute("data-number"), element.value));
    });

    this.shadowRoot.querySelectorAll("[data-boolean]").forEach((element) => {
      element.addEventListener("change", () => this._updateBoolean(element.getAttribute("data-boolean"), element.checked));
    });
  }

  _inferSource() {
    if (this._config.source) return this._config.source;
    if (this._config.entity) return "entity";
    if (this._config.clock || this._config.clock_format) return "clock";
    return "text";
  }

  _option(value, selected, label = value) {
    return `<option value="${this._escape(value)}"${value === selected ? " selected" : ""}>${this._escape(label)}</option>`;
  }

  _escape(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }
}

if (!customElements.get("split-flap-card")) {
  customElements.define("split-flap-card", HASplitFlapCard);
}

if (!customElements.get("split-flap-card-editor")) {
  customElements.define("split-flap-card-editor", SplitFlapCardEditor);
}

window.customCards = window.customCards || [];
window.customCards.push({
  type: "split-flap-card",
  name: "Split-Flap Card",
  preview: true,
  description: `Beta release ${SPLIT_FLAP_CARD_VERSION}`,
  documentationURL: SFC_REPO_URL
});
