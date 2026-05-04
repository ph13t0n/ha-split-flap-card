const SPLIT_FLAP_CANARY_VERSION = "0.1.0-alpha.2-canary.8";

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
    desc: { en: "Uses the selected theme typography.", sv: "Följer valt temas typografi." },
    sample: "SPLIT-FLAP ÅÄÖ 123"
  },
  mechanical: {
    label: "Mechanical",
    desc: { en: "Condensed, bold, mechanical display feeling.", sv: "Smal, kraftig och mekanisk displaykänsla." },
    family: "Roboto Condensed, Arial Narrow, sans-serif",
    weight: 900,
    sample: "SPLIT-FLAP ÅÄÖ 123"
  },
  transit: {
    label: "Transit",
    desc: { en: "Wayfinding and airport signage inspired.", sv: "Inspirerad av wayfinding och flygplatsskyltar." },
    family: "Barlow Condensed, Arial Narrow, sans-serif",
    weight: 900,
    sample: "SPLIT-FLAP ÅÄÖ 123"
  },
  clean: {
    label: "Clean",
    desc: { en: "Modern, neutral and easy to read.", sv: "Modern, neutral och lättläst." },
    family: "Inter, system-ui, sans-serif",
    weight: 800,
    sample: "SPLIT-FLAP ÅÄÖ 123"
  },
  mono: {
    label: "Mono",
    desc: { en: "Technical, monospaced terminal style.", sv: "Teknisk monospaced terminalstil." },
    family: "Roboto Mono, monospace",
    weight: 800,
    sample: "SPLIT-FLAP ÅÄÖ 123"
  },
  custom: {
    label: "Custom",
    desc: { en: "Use your own CSS font-family.", sv: "Använd egen CSS font-family." },
    family: "system-ui, sans-serif",
    weight: 800,
    sample: "CUSTOM FONT 123"
  }
};

class HASplitFlapCardCanaryV8 extends HTMLElement {
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
    return document.createElement("split-flap-card-canary-v8-editor");
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
    if (!config || typeof config !== "object") throw new Error("Invalid configuration.");

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
      custom_charset: "ABCDEFGHIJKLMNOPQRSTUVWXYZÅÄÖ0123456789 -:.,°/+",
      fallback_character: " ",
      pad_character: " ",
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
    if (this._config?.source === "entity") this._updateFromSource(false);
  }

  disconnectedCallback() {
    this._stopClock();
    this._clearTimers();
  }

  getCardSize() { return 2; }

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
      if (raw[key] === undefined || raw[key] === null || raw[key] === "") this._config[key] = theme[key];
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
    const interval = this._num(this._config.clock_tick_interval, 1000, 250, 60000);
    this._clockTimer = window.setInterval(() => this._updateFromSource(false), interval);
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
    if (!this.shadowRoot) return;
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
    const from = first ? "".padEnd(Array.from(target).length, " ") : (this._visibleText || "".padEnd(Array.from(target).length, " "));
    const cycles = this._config.cycle_chars === false ? 0 : this._num(this._config.cycle_count, 2, 0, 8);
    const duration = this._num(this._config.flip_duration, 760, 0, 3000);
    const stepDelay = Math.max(90, Math.min(260, Math.round(duration * 0.42)));
    const steps = [];

    for (let i = 0; i < cycles; i += 1) steps.push(this._shuffleText(target, from, i));
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
      const seed = (index * 17 + stepIndex * 11 + targetChars.length) % chars.length;
      return chars[seed] || char;
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
    return Array.from(text).slice(0, count).join("").padEnd(count, this._first(this._config.pad_character, " "));
  }

  _renderText(text, oldText, animate) {
    const chars = Array.from(text);
    const oldChars = Array.from(String(oldText || "").padEnd(chars.length, " "));
    const tiles = chars.map((char, index) => this._tile(char, oldChars[index] || " ", index, animate && (oldChars[index] || " ") !== char)).join("");
    this.shadowRoot.innerHTML = `${this._styles(this._config)}<ha-card><div class="display-shell"><div class="display" style="justify-content:${this._align(this._config.align)}">${tiles}</div></div></ha-card>`;
  }

  _tile(char, oldChar, index, animate) {
    const safe = this._escape(char);
    const old = this._escape(oldChar);
    const space = char === " " ? " space" : "";
    const state = animate ? " animate" : "";
    const delay = this._num(this._config.flip_stagger, 45, 0, 1000) * index;
    return `<div class="split-flap-tile${space}${state}" style="--delay:${delay}ms"><div class="flap top current"><span>${safe}</span></div><div class="flap bottom current"><span>${safe}</span></div>${animate ? `<div class="flap top flip-old"><span>${old}</span></div><div class="flap bottom flip-new"><span>${safe}</span></div>` : ""}<div class="hinge"></div><div class="pin pin-left"></div><div class="pin pin-right"></div></div>`;
  }

  _styles(config) {
    const width = this._num(config.segment_width, 48, 8, 180);
    const height = this._num(config.segment_height, 78, 16, 240);
    const radius = this._num(config.segment_radius, 7, 0, 40);
    const gap = this._num(config.segment_gap, 6, 0, 40);
    const fontSize = this._num(config.font_size, 60, 8, 180);
    const letterSpacing = this._num(config.letter_spacing, -1, -8, 12);
    const letterOffset = this._num(config.letter_vertical_offset, -9, -40, 40);
    const duration = this._num(config.flip_duration, 760, 0, 3000);
    const weight = this._fontWeight(config.font_weight, 900);
    const fontStyle = config.font_style === "italic" ? "italic" : "normal";
    const textColor = this._color(config.text_color, "#ffc02e");
    const shadow = config.text_glow === "medium"
      ? `0 1px 0 rgba(0,0,0,.95), 0 0 8px ${this._rgba(textColor, .26)}`
      : config.text_glow === "low"
        ? `0 1px 0 rgba(0,0,0,.95), 0 0 4px ${this._rgba(textColor, .16)}`
        : "0 1px 0 rgba(0,0,0,.95)";
    const mobileWidth = Math.max(25, Math.floor(width * .76));
    const mobileHeight = Math.max(40, Math.floor(height * .76));
    const mobileFont = Math.max(25, Math.floor(fontSize * .76));
    const mobileGap = Math.max(2, gap - 2);
    const mobileOffset = Math.round(letterOffset * .76);

    return `<style>
      :host{display:block;--sfc-accent:${textColor}}
      ha-card{background:${this._color(config.card_background,"#030303")};border-radius:18px;padding:18px;box-sizing:border-box;overflow:hidden;border:1px solid rgba(255,255,255,.075);box-shadow:inset 0 1px 0 rgba(255,255,255,.08),0 18px 38px rgba(0,0,0,.26)}
      .display-shell{border-radius:13px;padding:12px;background:${this._color(config.frame_background,"#050505")};box-shadow:inset 0 1px 0 rgba(255,255,255,.07),inset 0 0 0 1px rgba(255,255,255,.05),inset 0 -18px 28px rgba(0,0,0,.22);overflow-x:auto;overflow-y:hidden;-webkit-overflow-scrolling:touch;scrollbar-width:thin}
      .display{display:flex;align-items:center;gap:${gap}px;width:max-content;min-width:100%;box-sizing:border-box;padding:2px;perspective:950px}
      .split-flap-tile{--h:${height}px;--half:${height / 2}px;--letter-offset:${letterOffset}px;position:relative;width:${width}px;height:${height}px;min-width:${width}px;border-radius:${radius}px;background:${this._color(config.segment_background,"#101010")};border:1px solid ${this._color(config.segment_border_color,"#313131")};color:${textColor};font-family:${this._fontFamily(config.font_family,"Roboto Condensed, Arial Narrow, sans-serif")};font-size:${fontSize}px;font-weight:${weight};font-style:${fontStyle};letter-spacing:${letterSpacing}px;text-align:center;overflow:hidden;box-sizing:border-box;box-shadow:inset 0 1px 0 rgba(255,255,255,.13),inset 0 -1px 0 rgba(0,0,0,.35),0 9px 16px rgba(0,0,0,.22);transform-style:preserve-3d;contain:layout paint}
      .flap{position:absolute;left:0;width:100%;height:50%;overflow:hidden;backface-visibility:hidden;-webkit-backface-visibility:hidden}.top{top:0;border-radius:${radius}px ${radius}px 0 0;transform-origin:bottom center;background:${this._color(config.segment_background_top,"#252525")}}.bottom{bottom:0;border-radius:0 0 ${radius}px ${radius}px;transform-origin:top center;background:${this._color(config.segment_background_bottom,"#080808")}}
      .flap span{position:absolute;left:0;top:0;width:100%;height:var(--h);display:flex;align-items:center;justify-content:center;font-family:inherit;font-size:inherit;font-weight:inherit;font-style:inherit;letter-spacing:inherit;line-height:1;color:${textColor};text-shadow:${shadow};transform:scaleX(.94) translateY(var(--letter-offset));transform-origin:center}.bottom span{top:calc(var(--half) * -1)}
      .current{z-index:1}.flip-old{z-index:5}.flip-new{z-index:4;transform:rotateX(90deg);filter:brightness(.55)}.animate .flip-old{animation:sfc-v8-top ${duration}ms cubic-bezier(.2,.75,.16,1) var(--delay) both}.animate .flip-new{animation:sfc-v8-bottom ${duration}ms cubic-bezier(.2,.75,.16,1) var(--delay) both}
      .hinge{position:absolute;left:-1px;right:-1px;top:calc(50% - 1px);height:2px;background:${this._color(config.segment_separator_color,"#010101")};z-index:7;box-shadow:0 1px 0 rgba(255,255,255,.06),0 -1px 0 rgba(0,0,0,.3)}
      .pin{position:absolute;top:calc(50% - 3px);width:6px;height:6px;border-radius:50%;background:radial-gradient(circle at 35% 25%,#383838,#050505 58%,#000);border:1px solid #2c2c2c;z-index:8;opacity:.52}.pin-left{left:5px}.pin-right{right:5px}.space span{opacity:0}
      @keyframes sfc-v8-top{0%{transform:rotateX(0);filter:brightness(1)}42%{transform:rotateX(-84deg);filter:brightness(.42)}43%,100%{transform:rotateX(-90deg);filter:brightness(.18)}}
      @keyframes sfc-v8-bottom{0%,42%{transform:rotateX(90deg);filter:brightness(.28)}55%{transform:rotateX(72deg);filter:brightness(.55)}100%{transform:rotateX(0);filter:brightness(1)}}
      @media(max-width:560px){ha-card{padding:12px}.display-shell{padding:8px}.display{gap:${mobileGap}px}.split-flap-tile{--h:${mobileHeight}px;--half:${mobileHeight / 2}px;--letter-offset:${mobileOffset}px;width:${mobileWidth}px;min-width:${mobileWidth}px;height:${mobileHeight}px;font-size:${mobileFont}px}.pin{width:5px;height:5px}.pin-left{left:4px}.pin-right{right:4px}}
    </style>`;
  }

  _align(value) { return value === "left" ? "flex-start" : value === "right" ? "flex-end" : "center"; }

  _charset() {
    if (this._config.charset === "custom") return this._config.custom_charset || " ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    if (this._config.charset === "sv") return " ABCDEFGHIJKLMNOPQRSTUVWXYZÅÄÖ0123456789-:.,°/+";
    if (this._config.charset === "nordic") return " ABCDEFGHIJKLMNOPQRSTUVWXYZÅÄÖÆØ0123456789-:.,°/+";
    return " ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-:.,°/+";
  }

  _num(value, fallback, min, max) {
    const number = Number(value);
    return Number.isFinite(number) ? Math.min(Math.max(number, min), max) : fallback;
  }

  _first(value, fallback) { return Array.from(String(value ?? fallback))[0] || fallback; }

  _color(value, fallback) {
    const input = String(value ?? "").trim();
    return input === "transparent" || /^#[0-9a-fA-F]{3,8}$/.test(input) || /^rgba?\(/.test(input) || /^var\(--[a-zA-Z0-9_-]+\)$/.test(input) ? input : fallback;
  }

  _rgba(hex, alpha) {
    const input = this._color(hex, "#ffc02e");
    if (!input.startsWith("#")) return `rgba(255,192,46,${alpha})`;
    const full = input.length === 4 ? `#${input[1]}${input[1]}${input[2]}${input[2]}${input[3]}${input[3]}` : input;
    const value = parseInt(full.slice(1, 7), 16);
    return `rgba(${(value >> 16) & 255},${(value >> 8) & 255},${value & 255},${alpha})`;
  }

  _fontFamily(value, fallback) {
    const input = String(value ?? "").trim();
    if (!input || /url\s*\(|expression\s*\(|javascript:/i.test(input)) return fallback;
    return /^[a-zA-Z0-9åäöÅÄÖæøÆØéÉèÈêÊëË\s'",._-]+$/.test(input) ? input : fallback;
  }

  _fontWeight(value, fallback) {
    const input = String(value ?? "").trim();
    if (/^(normal|bold|lighter|bolder)$/.test(input)) return input;
    const number = Number(input);
    return Number.isFinite(number) ? Math.min(Math.max(Math.round(number), 100), 1000) : fallback;
  }

  _escape(value) {
    return String(value ?? "").replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
  }
}

class SplitFlapCardCanaryV8Editor extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._config = {};
    this._hass = null;
    this._language = "en";
    this._rendered = false;
    this._openHelp = "";
    this._typographyOpen = false;
  }

  setConfig(config) {
    this._config = { ...(config || {}) };
    this._render();
  }

  set hass(hass) {
    const language = String(hass?.locale?.language || hass?.language || "en").toLowerCase();
    const shouldRender = !this._rendered || language !== this._language;
    this._hass = hass;
    this._language = language;
    if (shouldRender) this._render();
  }

  _lang() { return this._language.startsWith("sv") ? "sv" : "en"; }

  _t(key) {
    const sv = {
      content: "1. Innehåll", appearance: "2. Utseende", motion: "3. Rörelse", advanced: "4. Avancerat", manual: "Manual & hjälp",
      show: "Vad ska kortet visa?", text: "Text", entity: "Entitet / sensor", clock: "Klocka", text_to_show: "Text att visa", entity_id: "Entitet eller sensor", attribute: "Attribut, valfritt", clock_format: "Klockformat", update_interval: "Uppdateringsintervall",
      theme: "Tema", typography_style: "Typografi", alignment: "Justering", flap_slots: "Teckenrutor",
      animation_on: "Aktivera animation", initial_animation: "Startanimation", animation_feel: "Animationskänsla", advanced_mode: "Avancerat läge",
      advanced_typography: "Avancerad typografi", custom_font: "Egen font-family", font_size: "Textstorlek", font_weight: "Tjocklek", italic: "Kursiv", letter_spacing: "Teckenavstånd", letter_vertical_offset: "Bokstavsposition upp/ned", text_transform: "Textomvandling", text_glow: "Textglöd",
      flap_design: "Teckenrutornas form", segment_width: "Rutbredd", segment_height: "Ruthöjd", segment_gap: "Avstånd mellan rutor", segment_radius: "Hörnradie",
      animation_fine: "Finjustering av animation", flip_speed: "Bläddringstid (ms)", delay_between: "Fördröjning mellan teckenrutor (ms)", shuffle_steps: "Mellansteg före slutbokstav",
      colors: "Färger", card_background: "Kortbakgrund", frame_background: "Ram / housing", flap_top: "Övre flap-färg", flap_bottom: "Nedre flap-färg", flap_border: "Flap-kant", split_line: "Delningslinje", text_color: "Textfärg",
      advanced_data: "Avancerad textdata", charset: "Teckenuppsättning", custom_charset: "Egen teckenuppsättning", fallback_character: "Ersättningstecken", pad_character: "Utfyllnadstecken",
      manual_link: "Öppna manual", repo: "GitHub-repository", support: "Stöd projektet på Ko-fi", standard_hint: "Följ stegen uppifrån och ned. Vanliga val visas först.", custom_hint: "Custom använder värdena under finjustering i avancerat läge.", help: "Hjälp"
    };
    const en = {
      content: "1. Content", appearance: "2. Appearance", motion: "3. Motion", advanced: "4. Advanced", manual: "Manual & Help",
      show: "What should the card show?", text: "Text", entity: "Entity / Sensor", clock: "Clock", text_to_show: "Text to display", entity_id: "Entity or sensor", attribute: "Attribute, optional", clock_format: "Clock format", update_interval: "Update interval",
      theme: "Theme", typography_style: "Typography", alignment: "Alignment", flap_slots: "Flap slots",
      animation_on: "Enable animation", initial_animation: "Initial animation", animation_feel: "Animation feel", advanced_mode: "Advanced mode",
      advanced_typography: "Advanced typography", custom_font: "Custom font-family", font_size: "Font size", font_weight: "Font weight", italic: "Italic", letter_spacing: "Letter spacing", letter_vertical_offset: "Letter position up/down", text_transform: "Text transform", text_glow: "Text glow",
      flap_design: "Flap slot design", segment_width: "Slot width", segment_height: "Slot height", segment_gap: "Gap between slots", segment_radius: "Corner radius",
      animation_fine: "Animation fine-tuning", flip_speed: "Flip duration (ms)", delay_between: "Delay between flaps (ms)", shuffle_steps: "Shuffle steps before final letter",
      colors: "Colors", card_background: "Card background", frame_background: "Frame / housing", flap_top: "Top flap color", flap_bottom: "Bottom flap color", flap_border: "Flap border", split_line: "Split line", text_color: "Text color",
      advanced_data: "Advanced text data", charset: "Charset", custom_charset: "Custom charset", fallback_character: "Fallback character", pad_character: "Pad character",
      manual_link: "Open manual", repo: "GitHub repository", support: "Support on Ko-fi", standard_hint: "Work from top to bottom. Common settings are shown first.", custom_hint: "Custom uses values under advanced fine-tuning.", help: "Help"
    };
    const dict = this._lang() === "sv" ? sv : en;
    return dict[key] || en[key] || key;
  }

  _help(key) {
    const sv = {
      content: "Välj fast text, entitet/sensor eller klocka.",
      appearance: "Välj tema, typografi, justering och antal teckenrutor. Tema färgar segment och text, inte hela kortbakgrunden.",
      motion: "Välj hur mekaniskt kortet ska bläddra.",
      advanced: "Finjustera typografi, färger, segment och data.",
      manual: "Dokumentation, GitHub och frivilligt stöd."
    };
    const en = {
      content: "Choose fixed text, entity/sensor or clock.",
      appearance: "Choose theme, typography, alignment and slots. Theme colors flaps and text, not the whole card background.",
      motion: "Choose how the mechanical flipping should behave.",
      advanced: "Fine-tune typography, colors, slots and data.",
      manual: "Documentation, GitHub and optional support."
    };
    const dict = this._lang() === "sv" ? sv : en;
    return dict[key] || en[key] || "";
  }

  _value(key, fallback = "") { return this._config[key] ?? fallback; }
  _themeOptions() { return Object.entries(SFC_THEMES).map(([key, value]) => [key, value.label]); }

  _set(key, value, type = "string") {
    const config = { ...this._config };
    const wasAutoAdvanced = config.editor_advanced_auto === true;

    if (type === "number") {
      const number = Number(value);
      if (value === "" || !Number.isFinite(number)) delete config[key];
      else config[key] = number;
    } else if (type === "boolean") {
      config[key] = Boolean(value);
    } else if (value === "") {
      delete config[key];
    } else {
      config[key] = value;
    }

    if (key === "editor_advanced") config.editor_advanced_auto = false;

    if (key === "theme") this._applyThemeToConfig(config, value);

    if (key === "animation_feel") {
      const preset = this._animationPreset(value);
      config.flip_duration = preset.flip_duration;
      config.flip_stagger = preset.flip_stagger;
      config.cycle_count = preset.cycle_count;
      config.animation = value !== "instant";
      if (value === "custom") {
        config.editor_advanced = true;
        config.editor_advanced_auto = true;
      } else if (wasAutoAdvanced) {
        config.editor_advanced = false;
        config.editor_advanced_auto = false;
      }
    }

    if (key === "font_preset" && value !== "custom") this._applyFontToConfig(config, value, config.theme || "mechanical_gold");
    if (key === "font_preset") this._typographyOpen = false;

    this._config = config;
    this.dispatchEvent(new CustomEvent("config-changed", { detail: { config }, bubbles: true, composed: true }));
    this._render();
  }

  _applyThemeToConfig(config, themeKey) {
    const theme = SFC_THEMES[themeKey] || SFC_THEMES.mechanical_gold;
    SFC_THEME_KEYS.forEach((key) => config[key] = theme[key]);
    if ((config.font_preset || "theme_default") === "theme_default") {
      config.font_family = theme.font_family;
      config.font_weight = theme.font_weight;
    }
    config.text_glow = "off";
    config.card_background = config.card_background || SFC_CARD_DEFAULTS.card_background;
    config.frame_background = config.frame_background || SFC_CARD_DEFAULTS.frame_background;
  }

  _applyFontToConfig(config, presetKey, themeKey) {
    const theme = SFC_THEMES[themeKey] || SFC_THEMES.mechanical_gold;
    const preset = SFC_FONT_PRESETS[presetKey] || SFC_FONT_PRESETS.theme_default;
    config.font_family = presetKey === "theme_default" ? theme.font_family : (preset.family || theme.font_family);
    config.font_weight = presetKey === "theme_default" ? theme.font_weight : (preset.weight || theme.font_weight);
  }

  _animationPreset(value) {
    return {
      calm: { flip_duration: 980, flip_stagger: 75, cycle_count: 2 },
      mechanical: { flip_duration: 760, flip_stagger: 45, cycle_count: 2 },
      fast: { flip_duration: 420, flip_stagger: 22, cycle_count: 1 },
      instant: { flip_duration: 0, flip_stagger: 0, cycle_count: 0 },
      custom: {
        flip_duration: this._value("flip_duration", 760),
        flip_stagger: this._value("flip_stagger", 45),
        cycle_count: this._value("cycle_count", 2)
      }
    }[value] || { flip_duration: 760, flip_stagger: 45, cycle_count: 2 };
  }

  _render() {
    if (!this.shadowRoot) return;
    const source = this._value("source", this._value("entity") ? "entity" : "text");
    const advanced = this._value("editor_advanced", false) === true;
    const customCharset = this._value("charset", "sv") === "custom";
    const animationOn = this._value("animation", true) !== false;
    const customFont = this._value("font_preset", "theme_default") === "custom";

    this.shadowRoot.innerHTML = `${this._styles()}<div class="editor">
      <section class="intro"><p>${this._t("standard_hint")}</p></section>
      ${this._section("content", this._t("content"), `
        ${this._select("source", this._t("show"), [["text", this._t("text")], ["entity", this._t("entity")], ["clock", this._t("clock")]])}
        ${source === "text" ? this._input("text", this._t("text_to_show"), "text", "SPLIT-FLAP TEST") : ""}
        ${source === "entity" ? this._input("entity", this._t("entity_id"), "text", "input_text.split_flap_message") + this._input("attribute", this._t("attribute"), "text", "friendly_name") : ""}
        ${source === "clock" ? this._input("clock_format", this._t("clock_format"), "text", "HH:mm:ss") + this._input("clock_tick_interval", this._t("update_interval"), "number", "1000") : ""}
      `)}
      ${this._section("appearance", this._t("appearance"), `
        ${this._select("theme", this._t("theme"), this._themeOptions())}
        ${this._typographyPicker()}
        <div class="grid two">
          ${this._select("align", this._t("alignment"), [["left", "Left"], ["center", "Center"], ["right", "Right"]])}
          ${this._input("segments", this._t("flap_slots"), "number", "16")}
        </div>
      `)}
      ${this._section("motion", this._t("motion"), `
        <div class="grid two">
          ${this._checkbox("animation", this._t("animation_on"), true)}
          ${this._checkbox("initial_animation", this._t("initial_animation"), true)}
        </div>
        ${animationOn ? this._select("animation_feel", this._t("animation_feel"), [["calm", "Calm"], ["mechanical", "Mechanical"], ["fast", "Fast"], ["instant", "Instant"], ["custom", "Custom"]]) : ""}
        ${this._value("animation_feel", "mechanical") === "custom" ? `<p>${this._t("custom_hint")}</p>` : ""}
      `)}
      ${this._section("advanced", this._t("advanced"), `${this._checkbox("editor_advanced", this._t("advanced_mode"), false)}`)}
      ${advanced ? this._advanced(customFont, customCharset, animationOn) : ""}
      ${this._section("manual", this._t("manual"), `
        <div class="link-row"><a href="https://github.com/ph13t0n/ha-split-flap-card/blob/feature/ui-editor-and-mechanical-gold/docs/UI_EDITOR_MANUAL.md" target="_blank" rel="noopener">${this._t("manual_link")}</a></div>
        <div class="link-row"><a href="https://github.com/ph13t0n/ha-split-flap-card" target="_blank" rel="noopener">${this._t("repo")}</a></div>
        <div class="link-row"><a href="https://ko-fi.com/lifarvidsson" target="_blank" rel="noopener">${this._t("support")}</a></div>
      `)}
    </div>`;

    this._rendered = true;
    this._bind();
  }

  _typographyPicker() {
    const currentKey = this._value("font_preset", "theme_default");
    const current = SFC_FONT_PRESETS[currentKey] || SFC_FONT_PRESETS.theme_default;
    const currentStyle = this._fontStyleFor(currentKey);
    const menu = this._typographyOpen ? `<div class="type-menu" role="listbox">${Object.entries(SFC_FONT_PRESETS).map(([key, preset]) => {
      const style = this._fontStyleFor(key);
      const selected = currentKey === key;
      return `<button type="button" class="type-option ${selected ? "selected" : ""}" data-font-preset="${this._escape(key)}" role="option" aria-selected="${selected ? "true" : "false"}">
        <span class="type-name">${this._escape(preset.label)}</span>
        <span class="type-desc">${this._escape(preset.desc[this._lang()] || preset.desc.en)}</span>
        <span class="type-sample" style="font-family:${this._escape(style.family)};font-weight:${style.weight}">${this._escape(preset.sample)}</span>
      </button>`;
    }).join("")}</div>` : "";

    return `<div class="field type-field">
      <span>${this._t("typography_style")}</span>
      <button type="button" class="type-select" data-toggle-typography aria-expanded="${this._typographyOpen ? "true" : "false"}">
        <span class="type-name">${this._escape(current.label)}</span>
        <span class="type-desc">${this._escape(current.desc[this._lang()] || current.desc.en)}</span>
        <span class="type-sample" style="font-family:${this._escape(currentStyle.family)};font-weight:${currentStyle.weight}">${this._escape(current.sample)}</span>
        <span class="type-arrow">⌄</span>
      </button>
      ${menu}
    </div>`;
  }

  _fontStyleFor(presetKey) {
    const theme = SFC_THEMES[this._value("theme", "mechanical_gold")] || SFC_THEMES.mechanical_gold;
    const preset = SFC_FONT_PRESETS[presetKey] || SFC_FONT_PRESETS.theme_default;
    return {
      family: presetKey === "theme_default" ? theme.font_family : (preset.family || theme.font_family),
      weight: presetKey === "theme_default" ? theme.font_weight : (preset.weight || theme.font_weight)
    };
  }

  _advanced(customFont, customCharset, animationOn) {
    return `
      ${this._section("typography", this._t("advanced_typography"), `<div class="grid two">
        ${customFont ? this._input("font_family", this._t("custom_font"), "text", "Roboto Condensed, Arial Narrow, sans-serif") : ""}
        ${this._input("font_size", this._t("font_size"), "number", "60")}
        ${this._select("font_weight", this._t("font_weight"), [["400", "Normal"], ["500", "Medium"], ["600", "Semi-bold"], ["700", "Bold"], ["800", "Extra-bold"], ["900", "Black"]])}
        ${this._checkbox("font_style_italic", this._t("italic"), false)}
        ${this._input("letter_spacing", this._t("letter_spacing"), "number", "-1")}
        ${this._input("letter_vertical_offset", this._t("letter_vertical_offset"), "number", "-9")}
        ${this._select("text_transform", this._t("text_transform"), [["uppercase", "Uppercase"], ["lowercase", "Lowercase"], ["none", "None"]])}
        ${this._select("text_glow", this._t("text_glow"), [["off", "Off"], ["low", "Low"], ["medium", "Medium"]])}
      </div>`)}
      ${this._section("flap", this._t("flap_design"), `<div class="grid two">
        ${this._input("segment_width", this._t("segment_width"), "number", "48")}
        ${this._input("segment_height", this._t("segment_height"), "number", "78")}
        ${this._input("segment_gap", this._t("segment_gap"), "number", "6")}
        ${this._input("segment_radius", this._t("segment_radius"), "number", "7")}
      </div>`)}
      ${animationOn ? this._section("animation", this._t("animation_fine"), `<div class="grid two">
        ${this._input("flip_duration", this._t("flip_speed"), "number", "760")}
        ${this._input("flip_stagger", this._t("delay_between"), "number", "45")}
        ${this._input("cycle_count", this._t("shuffle_steps"), "number", "2")}
      </div>`) : ""}
      ${this._section("colors", this._t("colors"), `<div class="grid two">
        ${this._input("card_background", this._t("card_background"), "text", "#030303")}
        ${this._input("frame_background", this._t("frame_background"), "text", "#050505")}
        ${this._input("segment_background_top", this._t("flap_top"), "text", "#252525")}
        ${this._input("segment_background_bottom", this._t("flap_bottom"), "text", "#080808")}
        ${this._input("segment_border_color", this._t("flap_border"), "text", "#313131")}
        ${this._input("segment_separator_color", this._t("split_line"), "text", "#010101")}
        ${this._input("text_color", this._t("text_color"), "text", "#ffc02e")}
      </div>`)}
      ${this._section("data", this._t("advanced_data"), `<div class="grid two">
        ${this._select("charset", this._t("charset"), [["en", "English"], ["sv", "Swedish"], ["nordic", "Nordic"], ["western", "Western"], ["weather", "Weather"], ["weather_sv", "Weather Swedish"], ["extended", "Extended"], ["custom", "Custom"]])}
        ${customCharset ? this._input("custom_charset", this._t("custom_charset"), "text", "ABCDEFGHIJKLMNOPQRSTUVWXYZÅÄÖ0123456789 -:.,°/+") : ""}
        ${this._input("fallback_character", this._t("fallback_character"), "text", " ")}
        ${this._input("pad_character", this._t("pad_character"), "text", " ")}
      </div>`)}
    `;
  }

  _section(key, title, body) {
    const open = this._openHelp === key;
    return `<section class="panel"><div class="panel-title"><h3>${this._escape(title)}</h3><button class="help" type="button" data-help="${this._escape(key)}" aria-expanded="${open ? "true" : "false"}" aria-label="${this._escape(this._t("help"))}">?</button></div>${open ? `<div class="help-text">${this._escape(this._help(key))}</div>` : ""}<div class="panel-body">${body}</div></section>`;
  }

  _input(key, label, type, placeholder) {
    return `<label class="field"><span>${this._escape(label)}</span><input data-key="${this._escape(key)}" data-type="${type === "number" ? "number" : "string"}" type="${type}" value="${this._escape(this._value(key, ""))}" placeholder="${this._escape(placeholder || "")}"></label>`;
  }

  _select(key, label, options) {
    return `<label class="field"><span>${this._escape(label)}</span><select data-key="${this._escape(key)}">${options.map(([value, title]) => `<option value="${this._escape(value)}"${String(this._value(key, "")) === value ? " selected" : ""}>${this._escape(title)}</option>`).join("")}</select></label>`;
  }

  _checkbox(key, label, fallback) {
    const checked = this._value(key, fallback) === true;
    return `<label class="check"><input data-key="${this._escape(key)}" data-type="boolean" type="checkbox"${checked ? " checked" : ""}><span>${this._escape(label)}</span></label>`;
  }

  _bind() {
    this.shadowRoot.querySelectorAll("input,select").forEach((element) => {
      element.addEventListener("change", () => {
        const key = element.dataset.key;
        const type = element.dataset.type || "string";
        if (key === "font_style_italic") {
          this._set("font_style", element.checked ? "italic" : "normal", "string");
          return;
        }
        this._set(key, element.type === "checkbox" ? element.checked : element.value, type);
      });
    });

    this.shadowRoot.querySelectorAll("button[data-help]").forEach((button) => {
      button.addEventListener("click", () => {
        const key = button.dataset.help;
        this._openHelp = this._openHelp === key ? "" : key;
        this._render();
      });
    });

    const toggle = this.shadowRoot.querySelector("button[data-toggle-typography]");
    if (toggle) {
      toggle.addEventListener("click", () => {
        this._typographyOpen = !this._typographyOpen;
        this._render();
      });
    }

    this.shadowRoot.querySelectorAll("button[data-font-preset]").forEach((button) => {
      button.addEventListener("click", () => this._set("font_preset", button.dataset.fontPreset, "string"));
    });
  }

  _styles() {
    return `<style>
      :host{display:block;color:var(--sfc-editor-text,#f5f7f9);--editor-bg:#0b1216;--surface:#111d23;--surface-2:#1a2a31;--field:#071014;--border:#2b414a;--muted:#b9c6cf;--interactive:#f7d53b;--interactive-text:#111719;--terminal-blue:#1a2225;font-family:var(--primary-font-family,system-ui,sans-serif)}
      @media(prefers-color-scheme:light){:host{--editor-bg:#e7eef2;--surface:#ffffff;--surface-2:#dbe7ed;--field:#ffffff;--border:#6e828d;--muted:#3f535e;--interactive:#b88700;--interactive-text:#101820;--terminal-blue:#dbe7ed;color:#101820}}
      .editor{display:grid;gap:12px;background:linear-gradient(180deg,var(--editor-bg),#05090c);border:1px solid var(--border);border-radius:18px;padding:14px;box-sizing:border-box}.intro{padding:6px 4px}.intro p{margin:0;color:var(--muted);font-size:12px}
      .panel{background:linear-gradient(180deg,var(--surface-2),var(--surface));border:1px solid var(--border);border-radius:14px;overflow:visible;box-shadow:0 8px 20px rgba(0,0,0,.22)}
      .panel-title{display:flex;align-items:center;justify-content:space-between;gap:8px;background:linear-gradient(90deg,#1a2a31,#142128);border-bottom:1px solid rgba(247,213,59,.36);padding:9px 11px}.panel-title h3{font-size:13px;line-height:1.2;margin:0;text-transform:uppercase;letter-spacing:.08em;color:var(--sfc-editor-text,#f5f7f9)}
      .help{display:inline-grid;place-items:center;min-width:28px;height:28px;border:0;border-radius:999px;color:var(--interactive-text);background:var(--interactive);font:inherit;font-weight:900}.help-text{padding:10px 12px;border-bottom:1px solid rgba(247,213,59,.24);background:rgba(247,213,59,.08);color:var(--sfc-editor-text,#f5f7f9);font-size:12px;line-height:1.4}.panel-body{padding:12px;display:grid;gap:11px}.panel-body p{margin:0;color:var(--muted);font-size:12px;line-height:1.35}
      .grid{display:grid;gap:11px}.grid.two{grid-template-columns:repeat(2,minmax(0,1fr))}.field{display:grid;gap:5px;position:relative}.field span,.check span{font-size:12px;color:var(--sfc-editor-text,#f5f7f9)}.field input,.field select{width:100%;min-height:44px;box-sizing:border-box;border-radius:10px;border:1px solid var(--border);background:var(--field);color:var(--sfc-editor-text,#fff);padding:9px 10px;font:inherit}.check{display:flex;align-items:center;gap:10px;min-height:42px}.check input{inline-size:20px;block-size:20px;accent-color:var(--interactive)}
      .type-field{z-index:2}.type-select,.type-option{display:grid;grid-template-columns:1fr auto;gap:3px;text-align:left;border:1px solid var(--border);background:var(--field);color:var(--sfc-editor-text,#fff);border-radius:12px;padding:10px;font:inherit;width:100%}.type-select{position:relative}.type-option{margin:0;border-radius:10px}.type-select[aria-expanded=true],.type-option.selected{border-color:var(--interactive);box-shadow:0 0 0 2px rgba(247,213,59,.28)}.type-name{font-weight:800;grid-column:1}.type-desc{font-size:12px;color:var(--muted);grid-column:1}.type-sample{font-size:16px;letter-spacing:.04em;color:var(--interactive);grid-column:1}.type-arrow{grid-column:2;grid-row:1 / span 3;align-self:center;color:var(--interactive);font-size:20px}.type-menu{display:grid;gap:8px;margin-top:8px;padding:8px;border:1px solid var(--border);border-radius:14px;background:rgba(7,16,20,.98);box-shadow:0 18px 32px rgba(0,0,0,.34);z-index:4}.link-row a{color:var(--interactive);text-decoration:none}.link-row a:hover{text-decoration:underline}
      .help:focus-visible,input:focus-visible,select:focus-visible,a:focus-visible,.type-select:focus-visible,.type-option:focus-visible{outline:3px solid var(--interactive);outline-offset:2px}
      @media(max-width:620px){.editor{padding:10px;border-radius:14px}.grid.two{grid-template-columns:1fr}.panel-title{padding:8px 9px}.panel-body{padding:10px}}
    </style>`;
  }

  _escape(value) {
    return String(value ?? "").replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
  }
}

if (!customElements.get("split-flap-card-canary-v8")) {
  customElements.define("split-flap-card-canary-v8", HASplitFlapCardCanaryV8);
}

if (!customElements.get("split-flap-card-canary-v8-editor")) {
  customElements.define("split-flap-card-canary-v8-editor", SplitFlapCardCanaryV8Editor);
}

window.customCards = window.customCards || [];
window.customCards.push({
  type: "split-flap-card-canary-v8",
  name: "Split-Flap Card Canary V8",
  description: `Standalone final validation candidate (${SPLIT_FLAP_CANARY_VERSION})`
});
