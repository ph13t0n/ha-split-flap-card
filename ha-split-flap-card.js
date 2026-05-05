const SPLIT_FLAP_CARD_VERSION = "0.1.0-beta.5";
const SFC_REPO_URL = "https://github.com/ph13t0n/ha-split-flap-card";
const SFC_MANUAL_URL = `${SFC_REPO_URL}/blob/main/docs/UI_EDITOR_MANUAL.md`;
const SFC_SUPPORT_URL = `${SFC_REPO_URL}/blob/main/SUPPORT.md`;
const SFC_ISSUE_URL = `${SFC_REPO_URL}/issues/new`;

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
  theme_default: { label: "Theme default", desc: { en: "Uses the selected theme typography.", sv: "Följer valt temas typografi." }, family: null, weight: null, sample: "SPLIT-FLAP ÅÄÖ 123" },
  mechanical: { label: "Mechanical", desc: { en: "Condensed, bold, mechanical display feeling.", sv: "Smal, kraftig och mekanisk displaykänsla." }, family: "Roboto Condensed, Arial Narrow, sans-serif", weight: 900, sample: "SPLIT-FLAP ÅÄÖ 123" },
  transit: { label: "Transit", desc: { en: "Wayfinding and airport signage inspired.", sv: "Inspirerad av wayfinding och flygplatsskyltar." }, family: "Barlow Condensed, Arial Narrow, sans-serif", weight: 900, sample: "SPLIT-FLAP ÅÄÖ 123" },
  clean: { label: "Clean", desc: { en: "Modern, neutral and easy to read.", sv: "Modern, neutral och lättläst." }, family: "Inter, system-ui, sans-serif", weight: 800, sample: "SPLIT-FLAP ÅÄÖ 123" },
  mono: { label: "Mono", desc: { en: "Technical, monospaced terminal style.", sv: "Teknisk monospaced terminalstil." }, family: "Roboto Mono, monospace", weight: 800, sample: "SPLIT-FLAP ÅÄÖ 123" },
  custom: { label: "Custom", desc: { en: "Use your own CSS font-family and optional stylesheet.", sv: "Använd egen CSS font-family och valfri stylesheet." }, family: "system-ui, sans-serif", weight: 800, sample: "CUSTOM FONT 123" }
};

const SFC_CHARSETS = {
  en: " ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-:.,/",
  sv: " ABCDEFGHIJKLMNOPQRSTUVWXYZÅÄÖ0123456789-:.,°/+",
  nordic: " ABCDEFGHIJKLMNOPQRSTUVWXYZÅÄÖÆØ0123456789-:.,°/+",
  western: " ABCDEFGHIJKLMNOPQRSTUVWXYZÅÄÖÆØÜÉÈÀÇÑ0123456789-:.,°/+",
  weather: " ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-:.,°/+%",
  weather_sv: " ABCDEFGHIJKLMNOPQRSTUVWXYZÅÄÖ0123456789-:.,°/+%",
  extended: " ABCDEFGHIJKLMNOPQRSTUVWXYZÅÄÖÆØÜÉÈÀÇÑabcdefghijklmnopqrstuvwxyzåäöæøüéèàçñ0123456789-:.,°/+%!?()[]"
};

class HASplitFlapCard extends HTMLElement {
  static getStubConfig() {
    return { source: "text", text: "SPLIT-FLAP TEST", segments: 16, theme: "mechanical_gold", font_preset: "theme_default", animation: true, initial_animation: true, animation_feel: "mechanical", letter_vertical_offset: -9 };
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
    if (!config || typeof config !== "object") throw new Error("Invalid configuration.");
    const raw = { ...config };
    const source = config.source || (config.entity ? "entity" : (config.clock || config.clock_format ? "clock" : "text"));
    if (!["text", "entity", "clock"].includes(source)) throw new Error("Content source must be text, entity or clock.");
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
    if (this._config?.source === "entity") this._updateFromSource(false);
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
      custom: { flip_duration: this._config?.flip_duration || 760, flip_stagger: this._config?.flip_stagger || 45, cycle_count: this._config?.cycle_count || 2 }
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
    this._clockTimer = window.setInterval(() => this._updateFromSource(false), this._num(this._config.clock_tick_interval, 1000, 250, 60000));
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
    const animate = this._config.animation !== false && this._num(this._config.flip_duration, 0, 0, 3000) > 0 && (!first || this._config.initial_animation !== false);
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
    return targetChars.map((char, index) => char === fromChars[index] ? char : (chars[(index * 17 + stepIndex * 11 + targetChars.length) % chars.length] || char)).join("");
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
    return String(format || "HH:mm").replaceAll("HH", values.HH).replaceAll("H", values.H).replaceAll("mm", values.mm).replaceAll("ss", values.ss);
  }

  _text() {
    let text = this._rawText();
    if (this._config.text_transform === "uppercase") text = text.toLocaleUpperCase("sv-SE");
    if (this._config.text_transform === "lowercase") text = text.toLocaleLowerCase("sv-SE");
    const count = this._num(this._config.segments, Math.max(Array.from(text).length, 1), 1, 160);
    const truncated = Array.from(text).slice(0, count).join("");
    const pad = this._first(this._config.pad_character, " ");
    return this._config.pad_mode === "start" ? truncated.padStart(count, pad) : truncated.padEnd(count, pad);
  }

  _renderText(text, oldText, animate) {
    const chars = Array.from(text);
    const old = Array.from(String(oldText || "").padEnd(chars.length, " "));
    const tiles = chars.map((char, index) => this._tile(char, old[index] || " ", index, animate && (old[index] || " ") !== char)).join("");
    this.shadowRoot.innerHTML = `${this._stylesheetLink()}${this._styles(this._config)}<ha-card><div class="display-shell"><div class="display" style="justify-content:${this._align(this._config.align)}">${tiles}</div></div></ha-card>`;
  }

  _stylesheetLink() {
    const url = this._safeStylesheetUrl(this._config.font_stylesheet);
    return url ? `<link rel="stylesheet" href="${this._escape(url)}">` : "";
  }

  _tile(char, oldChar, index, animate) {
    const safe = this._escape(char);
    const old = this._escape(oldChar);
    const delay = this._num(this._config.flip_stagger, 45, 0, 1000) * index;
    return `<div class="split-flap-tile${char === " " ? " space" : ""}${animate ? " animate" : ""}" style="--delay:${delay}ms"><div class="flap top current"><span>${safe}</span></div><div class="flap bottom current"><span>${safe}</span></div>${animate ? `<div class="flap top flip-old"><span>${old}</span></div><div class="flap bottom flip-new"><span>${safe}</span></div>` : ""}<div class="hinge"></div><div class="pin pin-left"></div><div class="pin pin-right"></div></div>`;
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
    const glow = config.text_glow && config.text_glow !== "off" ? `text-shadow: 0 0 8px ${this._css(config.text_color, "#ffc02e")};` : "";
    return `<style>:host{display:block}ha-card{overflow:hidden;border-radius:${this._num(config.card_border_radius,16,0,60)}px;background:${this._css(config.card_background,"#030303")};padding:${this._num(config.card_padding,16,0,80)}px}.display-shell{box-sizing:border-box;width:100%;border-radius:${Math.max(radius+6,10)}px;background:${this._css(config.frame_background,"#050505")};border:1px solid rgba(255,255,255,.08);padding:${Math.max(8,Math.round(gap*2))}px;box-shadow:inset 0 0 0 1px rgba(0,0,0,.8),0 14px 30px rgba(0,0,0,.45)}.display{display:flex;align-items:center;gap:${gap}px;min-width:0;overflow:hidden}.split-flap-tile{position:relative;flex:0 0 ${width}px;width:${width}px;height:${height}px;border-radius:${radius}px;overflow:hidden;background:${this._css(config.segment_background,"#101010")};border:1px solid ${this._css(config.segment_border_color,"#313131")};box-shadow:inset 0 1px 0 rgba(255,255,255,.07),inset 0 -12px 18px rgba(0,0,0,.38),0 4px 10px rgba(0,0,0,.6);perspective:900px}.split-flap-tile.space{opacity:.82}.flap{position:absolute;left:0;right:0;height:50%;overflow:hidden;display:flex;align-items:center;justify-content:center;color:${this._css(config.text_color,"#ffc02e")};font-family:${this._font(config.font_family)};font-size:${fontSize}px;font-weight:${this._fontWeight(config.font_weight)};font-style:${config.font_style==="italic"?"italic":"normal"};letter-spacing:${letterSpacing}px;line-height:1;${glow}backface-visibility:hidden}.flap span{display:block;transform:translateY(${verticalOffset}px)}.top{top:0;align-items:flex-end;background:linear-gradient(180deg,${this._css(config.segment_background_top,"#252525")},${this._css(config.segment_background,"#101010")})}.top span{transform:translateY(calc(50% + ${verticalOffset}px))}.bottom{bottom:0;align-items:flex-start;background:linear-gradient(180deg,${this._css(config.segment_background,"#101010")},${this._css(config.segment_background_bottom,"#080808")})}.bottom span{transform:translateY(calc(-50% + ${verticalOffset}px))}.hinge{position:absolute;left:0;right:0;top:calc(50% - 1px);height:2px;background:${this._css(config.segment_separator_color,"#010101")};box-shadow:0 -1px 0 rgba(255,255,255,.05),0 1px 0 rgba(0,0,0,.8);z-index:8}.pin{position:absolute;z-index:9;top:calc(50% - 2px);width:4px;height:4px;border-radius:50%;background:rgba(255,255,255,.17);box-shadow:0 0 0 1px rgba(0,0,0,.7)}.pin-left{left:4px}.pin-right{right:4px}.flip-old,.flip-new{z-index:7;animation-duration:${duration}ms;animation-delay:var(--delay);animation-timing-function:cubic-bezier(.2,.72,.18,1);animation-fill-mode:both}.flip-old{transform-origin:bottom;animation-name:sfc-flip-old}.flip-new{transform-origin:top;animation-name:sfc-flip-new}@keyframes sfc-flip-old{0%{transform:rotateX(0deg);filter:brightness(1)}100%{transform:rotateX(-90deg);filter:brightness(.45)}}@keyframes sfc-flip-new{0%{transform:rotateX(90deg);filter:brightness(.45)}100%{transform:rotateX(0deg);filter:brightness(1)}}</style>`;
  }

  _charset() {
    if (this._config.charset === "custom") return this._config.custom_charset || SFC_CHARSETS.sv;
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
    return String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
  }
}

class SplitFlapCardEditor extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._config = {};
    this._hass = null;
    this._expandedAdvanced = false;
    this._supportOpen = false;
    this._copyStatus = "";
    this._issueForm = {
      description: "",
      expected: "",
      actual: "",
      install_method: "",
      resource_url: "",
      console_errors: "",
      reviewed: false
    };
  }

  set hass(hass) {
    this._hass = hass;
    if (this._supportOpen) this._updateGeneratedIssueText();
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

  _setConfigValue(key, value) {
    const nextConfig = { ...this._config, [key]: value };
    if (value === "" && !["text", "custom_charset", "font_family", "font_stylesheet", "entity", "attribute"].includes(key)) delete nextConfig[key];
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
  }

  _updateValue(key, value, options = {}) {
    const { notify = true, render = true } = options;
    this._setConfigValue(key, value);
    if (notify) this._fireConfigChanged();
    if (render) this._render();
  }

  _updateNumber(key, value, options = {}) {
    const { notify = true, render = true } = options;
    if (value === "") {
      const nextConfig = { ...this._config };
      delete nextConfig[key];
      this._config = nextConfig;
      if (notify) this._fireConfigChanged();
      if (render) this._render();
      return;
    }
    const number = Number(value);
    if (Number.isFinite(number)) {
      this._setConfigValue(key, number);
      if (notify) this._fireConfigChanged();
      if (render) this._render();
    }
  }

  _updateBoolean(key, checked) {
    this._updateValue(key, checked, { notify: true, render: false });
  }

  _fireConfigChanged() {
    this.dispatchEvent(new CustomEvent("config-changed", { bubbles: true, composed: true, detail: { config: this._config } }));
  }

  _render() {
    const source = this._value("source", this._inferSource());
    const theme = this._value("theme", "mechanical_gold");
    const language = this._value("language", "sv");
    const charset = this._value("charset", language);
    const fontPreset = this._value("font_preset", "theme_default");
    const animationFeel = this._value("animation_feel", "mechanical");

    this.shadowRoot.innerHTML = `${this._editorStyles()}<div class="editor"><div class="hero"><div class="hero-title"><strong>Split-Flap Card</strong><span class="version">${SPLIT_FLAP_CARD_VERSION}</span></div><div class="hint">Terminal-inspired Lovelace display card. HACS single-file build with full visual editor.</div><div class="mini-preview" data-mini-preview>${this._previewTiles(this._value("text", "BETA READY"))}</div></div><div class="section"><div class="section-title"><span>01</span>Content</div><div class="section-body"><div class="grid">${this._selectRow("source", "Source", source, { text: "Text", entity: "Entity / Sensor", clock: "Clock" })}${this._numberRow("segments", "Segments", this._value("segments", 16), 1, 160)}</div>${source === "text" ? this._textRow("text", "Text", this._value("text", "")) : ""}${source === "entity" ? this._entityRows() : ""}${source === "clock" ? this._clockRows() : ""}<div class="grid">${this._selectRow("language", "Language", language, { en: "English", sv: "Swedish", nordic: "Nordic", western: "Western" })}${this._selectRow("charset", "Charset", charset, { "": "Auto", en: "English", sv: "Swedish", nordic: "Nordic", western: "Western", weather: "Weather", weather_sv: "Weather Swedish", extended: "Extended", custom: "Custom" })}</div>${charset === "custom" ? this._textareaRow("custom_charset", "Custom charset", this._value("custom_charset", "")) : ""}</div></div><div class="section"><div class="section-title"><span>02</span>Appearance</div><div class="section-body"><div class="grid">${this._selectRow("theme", "Theme", theme, this._themeOptions())}${this._selectRow("align", "Align", this._value("align", "center"), { left: "Left", center: "Center", right: "Right" })}</div>${this._activeThemeInfo()}<div class="grid">${this._selectRow("text_transform", "Text transform", this._value("text_transform", "uppercase"), { uppercase: "Uppercase", lowercase: "Lowercase", none: "None" })}${this._numberRow("font_size", "Font size", this._value("font_size", ""), 6, 220, "Default: 60")}</div><div class="preset-grid">${this._fontPresetCards(fontPreset)}</div></div></div><div class="section"><div class="section-title"><span>03</span>Motion</div><div class="section-body"><div class="grid">${this._selectRow("animation_feel", "Animation feel", animationFeel, { calm: "Calm", mechanical: "Mechanical", fast: "Fast", instant: "Instant", custom: "Custom" })}${this._numberRow("cycle_count", "Shuffle steps", this._value("cycle_count", ""), 0, 8, "Theme/preset default")}</div><div class="grid">${this._numberRow("flip_duration", "Flip duration ms", this._value("flip_duration", ""), 0, 3000, "Preset default")}${this._numberRow("flip_stagger", "Delay between flaps ms", this._value("flip_stagger", ""), 0, 1000, "Preset default")}</div><div class="check-grid">${this._checkRow("animation", "Animation", this._checked("animation", true))}${this._checkRow("initial_animation", "Initial animation", this._checked("initial_animation", true))}${this._checkRow("cycle_chars", "Cycle characters", this._checked("cycle_chars", true))}</div></div></div><details ${this._expandedAdvanced ? "open" : ""}><summary>Advanced styling</summary><div class="section-body"><div class="grid">${this._numberRow("segment_width", "Segment width", this._value("segment_width", ""), 8, 180, "Default: 48")}${this._numberRow("segment_height", "Segment height", this._value("segment_height", ""), 16, 240, "Default: 78")}</div><div class="grid">${this._numberRow("segment_gap", "Segment gap", this._value("segment_gap", ""), 0, 80, "Default: 6")}${this._numberRow("segment_radius", "Segment radius", this._value("segment_radius", ""), 0, 40, "Default: 7")}</div><div class="grid">${this._numberRow("letter_spacing", "Letter spacing", this._value("letter_spacing", ""), -20, 40, "Default: -1")}${this._numberRow("letter_vertical_offset", "Letter vertical offset", this._value("letter_vertical_offset", ""), -80, 80, "Default: -9")}</div><div class="grid">${this._textRow("font_family", "Font family", this._value("font_family", ""), "Theme or font preset")}${this._textRow("font_stylesheet", "Font stylesheet URL", this._value("font_stylesheet", ""), "https:// or /local/")}</div><div class="grid">${this._textRow("text_color", "Text color", this._value("text_color", ""), "Theme default")}${this._selectRow("text_glow", "Text glow", this._value("text_glow", "off"), { off: "Off", soft: "Soft" })}</div><div class="grid">${this._textRow("segment_background_top", "Top flap color", this._value("segment_background_top", ""), "Theme default")}${this._textRow("segment_background_bottom", "Bottom flap color", this._value("segment_background_bottom", ""), "Theme default")}</div></div></details><div class="links"><button type="button" data-open-url="${this._escape(SFC_MANUAL_URL)}">Manual</button><button type="button" data-support-open>Support</button><button type="button" data-support-open>Report issue</button></div></div>${this._supportOpen ? this._supportModal() : ""}`;
    this._bindEvents();
    if (this._supportOpen) this._updateGeneratedIssueText();
  }

  _bindEvents() {
    this.shadowRoot.querySelectorAll("[data-field]").forEach((element) => {
      const key = element.getAttribute("data-field");
      const isSelect = element.tagName === "SELECT";
      if (isSelect) {
        element.addEventListener("change", () => this._updateValue(key, element.value, { notify: true, render: this._fieldNeedsRender(key) }));
        return;
      }
      element.addEventListener("input", () => {
        this._setConfigValue(key, element.value);
        if (key === "text") this._updateMiniPreview(element.value);
      });
      element.addEventListener("change", () => {
        this._setConfigValue(key, element.value);
        this._fireConfigChanged();
      });
    });

    this.shadowRoot.querySelectorAll("[data-number]").forEach((element) => {
      const key = element.getAttribute("data-number");
      element.addEventListener("input", () => this._updateNumber(key, element.value, { notify: false, render: false }));
      element.addEventListener("change", () => this._updateNumber(key, element.value, { notify: true, render: false }));
    });

    this.shadowRoot.querySelectorAll("[data-boolean]").forEach((element) => {
      element.addEventListener("change", () => this._updateBoolean(element.getAttribute("data-boolean"), element.checked));
    });

    this.shadowRoot.querySelectorAll("[data-font-preset]").forEach((element) => {
      element.addEventListener("click", () => this._updateValue("font_preset", element.getAttribute("data-font-preset"), { notify: true, render: true }));
    });

    this.shadowRoot.querySelectorAll("[data-open-url]").forEach((element) => {
      element.addEventListener("click", () => this._openExternal(element.getAttribute("data-open-url")));
    });

    this.shadowRoot.querySelectorAll("[data-support-open]").forEach((element) => {
      element.addEventListener("click", () => this._openSupportModal());
    });

    const details = this.shadowRoot.querySelector("details");
    if (details) details.addEventListener("toggle", () => { this._expandedAdvanced = details.open; });

    this._bindSupportEvents();
  }

  _bindSupportEvents() {
    const close = this.shadowRoot.querySelector("[data-support-close]");
    if (close) close.addEventListener("click", () => this._closeSupportModal());

    this.shadowRoot.querySelectorAll("[data-issue-field]").forEach((element) => {
      const key = element.getAttribute("data-issue-field");
      element.addEventListener("input", () => {
        this._issueForm[key] = element.value;
        this._updateGeneratedIssueText();
      });
      element.addEventListener("change", () => {
        this._issueForm[key] = element.value;
        this._updateGeneratedIssueText();
      });
    });

    const reviewed = this.shadowRoot.querySelector("[data-issue-reviewed]");
    if (reviewed) reviewed.addEventListener("change", () => {
      this._issueForm.reviewed = reviewed.checked;
      this._updateIssueActions();
    });

    const copy = this.shadowRoot.querySelector("[data-copy-issue]");
    if (copy) copy.addEventListener("click", () => this._copyIssueText());

    const open = this.shadowRoot.querySelector("[data-open-issue]");
    if (open) open.addEventListener("click", () => this._openIssue());

    const support = this.shadowRoot.querySelector("[data-support-md]");
    if (support) support.addEventListener("click", () => this._openExternal(SFC_SUPPORT_URL));
  }

  _fieldNeedsRender(key) {
    return ["source", "charset", "language", "theme", "font_preset", "animation_feel"].includes(key);
  }

  _themeOptions() {
    return Object.fromEntries(Object.entries(SFC_THEMES).map(([key, value]) => [key, value.label]));
  }

  _activeThemeInfo() {
    const diagnostics = this._diagnostics();
    return `<div class="theme-info"><div><strong>Card theme</strong><span>${this._escape(diagnostics.cardThemeLabel)} <code>${this._escape(diagnostics.cardThemeKey)}</code></span></div><div><strong>HA theme</strong><span>${this._escape(diagnostics.haTheme)} / ${this._escape(diagnostics.colorMode)}</span></div></div>`;
  }

  _fontPresetCards(selected) {
    return Object.entries(SFC_FONT_PRESETS).map(([key, preset]) => {
      const family = preset.family || "Roboto Condensed, Arial Narrow, sans-serif";
      const weight = preset.weight || 900;
      const desc = preset.desc?.sv || preset.desc?.en || "";
      return `<button type="button" class="preset${key === selected ? " active" : ""}" data-font-preset="${this._escape(key)}"><div class="preset-title">${this._escape(preset.label)}</div><div class="preset-sample" style="font-family:${this._escape(family)};font-weight:${this._escape(weight)}">${this._escape(preset.sample || preset.label)}</div><div class="preset-desc">${this._escape(desc)}</div></button>`;
    }).join("");
  }

  _entityRows() {
    return `${this._textRow("entity", "Entity", this._value("entity", ""), "input_text.split_flap_message")}${this._textRow("attribute", "Attribute", this._value("attribute", ""), "Optional")}`;
  }

  _clockRows() {
    return `<div class="grid">${this._textRow("clock_format", "Clock format", this._value("clock_format", "HH:mm"))}${this._numberRow("clock_tick_interval", "Clock tick interval", this._value("clock_tick_interval", 1000), 250, 60000)}</div>`;
  }

  _selectRow(key, label, selected, options) {
    return `<div class="row"><label for="${this._escape(key)}">${this._escape(label)}</label><select id="${this._escape(key)}" data-field="${this._escape(key)}">${Object.entries(options).map(([value, text]) => this._option(value, selected, text)).join("")}</select></div>`;
  }

  _textRow(key, label, value, placeholder = "") {
    return `<div class="row"><label for="${this._escape(key)}">${this._escape(label)}</label><input id="${this._escape(key)}" data-field="${this._escape(key)}" placeholder="${this._escape(placeholder)}" value="${this._escape(value)}"></div>`;
  }

  _textareaRow(key, label, value) {
    return `<div class="row"><label for="${this._escape(key)}">${this._escape(label)}</label><textarea id="${this._escape(key)}" data-field="${this._escape(key)}">${this._escape(value)}</textarea></div>`;
  }

  _numberRow(key, label, value, min, max, placeholder = "") {
    return `<div class="row"><label for="${this._escape(key)}">${this._escape(label)}</label><input id="${this._escape(key)}" data-number="${this._escape(key)}" type="number" min="${this._escape(min)}" max="${this._escape(max)}" placeholder="${this._escape(placeholder)}" value="${this._escape(value)}"></div>`;
  }

  _checkRow(key, label, checked) {
    return `<label class="check-row"><input data-boolean="${this._escape(key)}" type="checkbox"${checked ? " checked" : ""}>${this._escape(label)}</label>`;
  }

  _option(value, selected, label = value) {
    return `<option value="${this._escape(value)}"${value === selected ? " selected" : ""}>${this._escape(label)}</option>`;
  }

  _previewTiles(text) {
    const preview = Array.from(String(text || "BETA READY").toLocaleUpperCase("sv-SE")).slice(0, 10);
    return preview.map((char) => `<span class="mini-tile">${this._escape(char === " " ? "" : char)}</span>`).join("");
  }

  _updateMiniPreview(text) {
    const target = this.shadowRoot.querySelector("[data-mini-preview]");
    if (target) target.innerHTML = this._previewTiles(text);
  }

  _inferSource() {
    if (this._config.source) return this._config.source;
    if (this._config.entity) return "entity";
    if (this._config.clock || this._config.clock_format) return "clock";
    return "text";
  }

  _openSupportModal() {
    const diagnostics = this._diagnostics();
    if (!this._issueForm.resource_url) this._issueForm.resource_url = diagnostics.resourceUrl;
    if (!this._issueForm.install_method) this._issueForm.install_method = diagnostics.installationMethod;
    this._copyStatus = "";
    this._supportOpen = true;
    this._render();
  }

  _closeSupportModal() {
    this._supportOpen = false;
    this._copyStatus = "";
    this._render();
  }

  _supportModal() {
    const issueText = this._generateIssueText();
    const diagnostics = this._diagnostics();
    return `<div class="support-backdrop" role="dialog" aria-modal="true" aria-label="Report issue"><div class="support-modal"><div class="support-header"><h2>Report issue</h2><button type="button" class="close-btn" data-support-close>Close</button></div><div class="support-warning">Diagnostic information is generated locally. Nothing is sent automatically. Review the content before opening GitHub. GitHub issues may be public.</div><div class="diagnostic-grid"><div><strong>Card version</strong><span>${this._escape(SPLIT_FLAP_CARD_VERSION)}</span></div><div><strong>Card theme</strong><span>${this._escape(diagnostics.cardThemeLabel)}</span></div><div><strong>HA theme</strong><span>${this._escape(diagnostics.haTheme)} / ${this._escape(diagnostics.colorMode)}</span></div><div><strong>HA version</strong><span>${this._escape(diagnostics.haVersion)}</span></div></div><div class="support-form"><div class="row"><label>Description</label><textarea data-issue-field="description">${this._escape(this._issueForm.description)}</textarea></div><div class="row"><label>Expected behavior</label><textarea data-issue-field="expected">${this._escape(this._issueForm.expected)}</textarea></div><div class="row"><label>Actual behavior</label><textarea data-issue-field="actual">${this._escape(this._issueForm.actual)}</textarea></div><div class="row"><label>Installation method</label><select data-issue-field="install_method">${this._option("Unknown", this._issueForm.install_method || "Unknown", "Unknown")}${this._option("HACS", this._issueForm.install_method, "HACS")}${this._option("Manual / local", this._issueForm.install_method, "Manual / local")}${this._option("Custom resource URL", this._issueForm.install_method, "Custom resource URL")}</select></div><div class="row"><label>Card version or resource URL</label><input data-issue-field="resource_url" value="${this._escape(this._issueForm.resource_url || diagnostics.resourceUrl)}"></div><div class="row"><label>Browser console errors</label><textarea data-issue-field="console_errors">${this._escape(this._issueForm.console_errors)}</textarea></div><div class="row"><label>Generated issue text</label><textarea data-generated-issue readonly>${this._escape(issueText)}</textarea></div><label class="review-row"><input type="checkbox" data-issue-reviewed${this._issueForm.reviewed ? " checked" : ""}>I have reviewed the generated issue text and removed private information. I understand that GitHub Issues may be public.</label><div class="support-actions"><span class="copy-status" data-copy-status>${this._escape(this._copyStatus)}</span><button type="button" class="action-btn" data-copy-issue>Copy issue text</button><button type="button" class="action-btn secondary" data-open-issue${this._issueForm.reviewed ? "" : " disabled"}>Open GitHub issue</button></div><button type="button" class="support-md" data-support-md>SUPPORT.md</button></div></div></div>`;
  }

  _diagnostics() {
    const resourceUrl = this._resourceUrl();
    const themeKey = this._value("theme", "mechanical_gold");
    const theme = SFC_THEMES[themeKey] || SFC_THEMES.mechanical_gold;
    const haTheme = this._hass?.selectedTheme?.theme || this._hass?.themes?.theme || this._hass?.themes?.default_theme || "Unknown";
    const darkValue = this._hass?.selectedTheme?.dark ?? this._hass?.themes?.darkMode;
    const colorMode = darkValue === true ? "dark" : darkValue === false ? "light" : (window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "unknown");
    return {
      cardVersion: SPLIT_FLAP_CARD_VERSION,
      resourceUrl,
      installationMethod: this._inferInstallationMethod(resourceUrl),
      cardThemeKey: themeKey,
      cardThemeLabel: theme.label || themeKey,
      haTheme,
      colorMode,
      haVersion: this._hass?.config?.version || "Unknown",
      haLanguage: this._hass?.language || this._hass?.locale?.language || "Unknown",
      browserLanguage: navigator.language || "Unknown",
      userAgent: navigator.userAgent || "Unknown",
      source: this._value("source", this._inferSource()),
      segments: this._value("segments", "Default"),
      charset: this._value("charset", this._value("language", "sv")),
      fontPreset: this._value("font_preset", "theme_default"),
      animationFeel: this._value("animation_feel", "mechanical")
    };
  }

  _resourceUrl() {
    const script = Array.from(document.querySelectorAll("script[src]")).find((item) => String(item.getAttribute("src") || item.src || "").includes("ha-split-flap-card"));
    const url = script?.getAttribute("src") || script?.src || this._issueForm.resource_url || "";
    return url || "/hacsfiles/ha-split-flap-card/ha-split-flap-card.js";
  }

  _inferInstallationMethod(resourceUrl) {
    const url = String(resourceUrl || "");
    if (url.includes("/hacsfiles/")) return "HACS";
    if (url.includes("/local/")) return "Manual / local";
    return "Unknown";
  }

  _generateIssueText() {
    const diagnostics = this._diagnostics();
    const installMethod = this._issueForm.install_method || diagnostics.installationMethod || "Unknown";
    const resourceUrl = this._issueForm.resource_url || diagnostics.resourceUrl;
    const description = this._issueForm.description || "Describe the issue clearly.";
    const expected = this._issueForm.expected || "What did you expect to happen?";
    const actual = this._issueForm.actual || "What actually happened?";
    const consoleErrors = this._issueForm.console_errors || "No console errors pasted.";
    return `## Description\n\n${description}\n\n## Expected behavior\n\n${expected}\n\n## Actual behavior\n\n${actual}\n\n## Diagnostics\n\n- Card version: ${diagnostics.cardVersion}\n- Installation method: ${installMethod}\n- Card/resource URL: ${resourceUrl}\n- Split-Flap theme: ${diagnostics.cardThemeKey} (${diagnostics.cardThemeLabel})\n- Home Assistant frontend theme: ${diagnostics.haTheme}\n- Color mode: ${diagnostics.colorMode}\n- Home Assistant version: ${diagnostics.haVersion}\n- Home Assistant language: ${diagnostics.haLanguage}\n- Browser language: ${diagnostics.browserLanguage}\n- Browser/device: ${diagnostics.userAgent}\n- Source: ${diagnostics.source}\n- Segments: ${diagnostics.segments}\n- Charset: ${diagnostics.charset}\n- Font preset: ${diagnostics.fontPreset}\n- Animation feel: ${diagnostics.animationFeel}\n\n## YAML configuration\n\n\`\`\`yaml\n${this._yamlConfig()}\n\`\`\`\n\n## Browser console errors\n\n\`\`\`text\n${consoleErrors}\n\`\`\``;
  }

  _yamlConfig() {
    const config = { type: "custom:split-flap-card", ...this._config };
    return Object.entries(config).map(([key, value]) => {
      if (typeof value === "number" || typeof value === "boolean") return `${key}: ${value}`;
      if (value === null || value === undefined) return `${key}:`;
      const text = String(value);
      if (/^[A-Za-z0-9_./:-]+$/.test(text)) return `${key}: ${text}`;
      return `${key}: ${JSON.stringify(text)}`;
    }).join("\n");
  }

  _updateGeneratedIssueText() {
    const target = this.shadowRoot.querySelector("[data-generated-issue]");
    if (target) target.value = this._generateIssueText();
  }

  _updateIssueActions() {
    const open = this.shadowRoot.querySelector("[data-open-issue]");
    if (open) open.disabled = !this._issueForm.reviewed;
  }

  async _copyIssueText() {
    const text = this._generateIssueText();
    let copied = false;
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
        copied = true;
      }
    } catch (_error) {
      copied = false;
    }
    if (!copied) copied = this._fallbackCopy(text);
    this._copyStatus = copied ? "Copied" : "Copy failed";
    const target = this.shadowRoot.querySelector("[data-copy-status]");
    if (target) target.textContent = this._copyStatus;
  }

  _fallbackCopy(text) {
    try {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.setAttribute("readonly", "");
      textarea.style.position = "fixed";
      textarea.style.left = "-9999px";
      document.body.appendChild(textarea);
      textarea.select();
      const result = document.execCommand("copy");
      document.body.removeChild(textarea);
      return result;
    } catch (_error) {
      return false;
    }
  }

  _openIssue() {
    if (!this._issueForm.reviewed) return;
    const params = new URLSearchParams({ title: "Split-Flap Card issue", body: this._generateIssueText() });
    this._openExternal(`${SFC_ISSUE_URL}?${params.toString()}`);
  }

  _openExternal(url) {
    if (!url) return;
    const opened = window.open(url, "_blank", "noopener,noreferrer");
    if (!opened) window.location.href = url;
  }

  _editorStyles() {
    return `<style>:host{display:block;color:var(--primary-text-color)}.editor{display:grid;gap:16px;padding:6px 2px 14px}.hero{border:1px solid rgba(255,255,255,.1);border-radius:16px;padding:14px;background:linear-gradient(145deg,rgba(4,18,22,.95),rgba(4,4,4,.98));box-shadow:inset 0 0 0 1px rgba(0,0,0,.5)}.hero-title{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:8px}.hero-title strong{font-size:15px;letter-spacing:.06em;text-transform:uppercase}.version{font-family:Roboto Mono,monospace;font-size:11px;color:#f7d53b}.mini-preview{display:flex;gap:5px;overflow:hidden;margin-top:8px;padding:10px;border-radius:12px;background:#020202;border:1px solid rgba(255,255,255,.08)}.mini-tile{width:28px;height:42px;border-radius:6px;border:1px solid #2d2d2d;background:linear-gradient(180deg,#252525,#080808);color:#ffc02e;font-family:Roboto Condensed,Arial Narrow,sans-serif;font-weight:900;font-size:25px;line-height:42px;text-align:center;box-shadow:inset 0 -1px 0 #000}.section{border:1px solid rgba(255,255,255,.10);border-radius:14px;background:rgba(255,255,255,.025);overflow:hidden}.section-title{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:12px 14px;background:rgba(255,255,255,.035);border-bottom:1px solid rgba(255,255,255,.08);font-weight:700}.section-title span{color:#f7d53b;font-family:Roboto Mono,monospace;font-size:12px;letter-spacing:.08em;text-transform:uppercase}.section-body{display:grid;gap:13px;padding:14px}.grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}.row{display:grid;gap:6px}label{color:var(--secondary-text-color);font-size:12px;font-weight:700;letter-spacing:.02em}input,select,textarea{box-sizing:border-box;width:100%;min-height:42px;border:1px solid rgba(255,255,255,.12);border-radius:10px;padding:9px 11px;background:rgba(0,0,0,.35);color:var(--primary-text-color,#fff);font:inherit;outline:none}textarea{min-height:82px;resize:vertical}input:focus,select:focus,textarea:focus{border-color:#f7d53b;box-shadow:0 0 0 1px rgba(247,213,59,.25)}.check-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}.check-row{display:flex;align-items:center;gap:10px;min-height:42px;padding:0 10px;border:1px solid rgba(255,255,255,.10);border-radius:10px;background:rgba(0,0,0,.24)}.check-row input{width:auto;min-height:auto;accent-color:#f7d53b}.preset-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}.preset{padding:10px;border-radius:12px;border:1px solid rgba(255,255,255,.10);background:rgba(0,0,0,.22);cursor:pointer;color:var(--primary-text-color);text-align:left}.preset.active{border-color:#f7d53b;box-shadow:0 0 0 1px rgba(247,213,59,.22)}.preset-title{font-weight:800;margin-bottom:4px}.preset-sample{font-size:18px;color:#ffc02e;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.preset-desc{margin-top:3px;color:var(--secondary-text-color);font-size:11px;line-height:1.3}.theme-info{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}.theme-info>div{border:1px solid rgba(255,255,255,.10);border-radius:12px;background:rgba(0,0,0,.22);padding:10px;display:grid;gap:4px}.theme-info strong{font-size:12px}.theme-info span{color:var(--secondary-text-color);font-size:12px;line-height:1.35}.theme-info code{color:#f7d53b}details{border:1px solid rgba(255,255,255,.10);border-radius:14px;overflow:hidden;background:rgba(255,255,255,.025)}summary{cursor:pointer;padding:12px 14px;font-weight:700;color:#f7d53b}details[open] summary{border-bottom:1px solid rgba(255,255,255,.08)}.links{display:flex;flex-wrap:wrap;gap:8px}.links button,.support-md{color:#f7d53b;background:transparent;text-decoration:none;border:1px solid rgba(247,213,59,.35);border-radius:999px;padding:7px 10px;font-size:12px;cursor:pointer}.hint{color:var(--secondary-text-color);font-size:12px;line-height:1.45}.support-backdrop{position:fixed;inset:0;z-index:9999;display:flex;align-items:flex-start;justify-content:center;overflow:auto;background:rgba(0,0,0,.58);padding:18px}.support-modal{box-sizing:border-box;width:min(720px,100%);margin:4px auto 28px;border:1px solid rgba(255,255,255,.12);border-radius:22px;background:#071015;color:var(--primary-text-color,#fff);box-shadow:0 20px 70px rgba(0,0,0,.65);padding:22px}.support-header{display:flex;align-items:center;justify-content:space-between;gap:16px;margin-bottom:18px}.support-header h2{font-size:18px;margin:0}.close-btn{border:0;border-radius:999px;background:#ffdf3f;color:#111;font-weight:800;padding:10px 18px;cursor:pointer}.support-warning{background:rgba(247,213,59,.10);border:1px solid rgba(247,213,59,.12);padding:13px 15px;line-height:1.45;margin-bottom:18px}.diagnostic-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;margin-bottom:16px}.diagnostic-grid>div{border:1px solid rgba(255,255,255,.10);border-radius:12px;background:rgba(0,0,0,.22);padding:10px;display:grid;gap:4px}.diagnostic-grid strong{font-size:12px}.diagnostic-grid span{font-size:12px;color:var(--secondary-text-color,#c4cbd1);overflow-wrap:anywhere}.support-form{display:grid;gap:13px}.support-form textarea[data-generated-issue]{min-height:150px;font-family:Roboto Mono,monospace;font-size:12px}.review-row{display:flex;align-items:flex-start;gap:10px;font-size:13px;line-height:1.3}.review-row input{width:auto;min-height:auto;margin-top:2px;accent-color:#f7d53b}.support-actions{display:grid;grid-template-columns:1fr auto auto;align-items:center;gap:10px;margin-top:8px}.copy-status{color:#f7d53b;font-size:12px}.action-btn{border:0;border-radius:999px;background:#ffdf3f;color:#111;font-weight:800;padding:11px 17px;cursor:pointer}.action-btn.secondary{background:#d6bd36}.action-btn:disabled{opacity:.45;cursor:not-allowed}.support-md{justify-self:start;margin-top:8px;border-color:transparent;padding-left:0}.support-md:hover{text-decoration:underline}@media(max-width:560px){.grid,.preset-grid,.check-grid,.theme-info,.diagnostic-grid{grid-template-columns:1fr}.support-backdrop{padding:10px}.support-modal{padding:20px}.support-actions{grid-template-columns:1fr}.action-btn{width:100%}}</style>`;
  }

  _escape(value) {
    return String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
  }
}

if (!customElements.get("split-flap-card")) customElements.define("split-flap-card", HASplitFlapCard);
if (!customElements.get("split-flap-card-editor")) customElements.define("split-flap-card-editor", SplitFlapCardEditor);

window.customCards = window.customCards || [];
window.customCards.push({ type: "split-flap-card", name: "Split-Flap Card", preview: true, description: `Beta release ${SPLIT_FLAP_CARD_VERSION}`, documentationURL: SFC_REPO_URL });
