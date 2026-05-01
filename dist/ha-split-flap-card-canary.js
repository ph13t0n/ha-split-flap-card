const SPLIT_FLAP_CANARY_VERSION = "0.1.0-alpha.2-canary.1";

class HASplitFlapCardCanary extends HTMLElement {
  static getStubConfig() {
    return {
      source: "text",
      text: "SPLIT-FLAP TEST",
      segments: 16,
      theme: "mechanical_gold",
      font_preset: "mechanical",
      animation: true,
      initial_animation: true,
      animation_feel: "mechanical"
    };
  }

  static getConfigElement() {
    return document.createElement("split-flap-card-canary-editor");
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._config = {};
    this._hass = null;
    this._clockTimer = null;
  }

  setConfig(config) {
    if (!config || typeof config !== "object") {
      throw new Error("Invalid configuration.");
    }

    const source = config.source || this._inferSource(config);
    if (!["text", "entity", "clock"].includes(source)) {
      throw new Error("Content source must be text, entity or clock.");
    }

    const preset = this._animationPreset(config.animation_feel || "mechanical");
    const fontPreset = this._fontPreset(config.font_preset || "theme_default", config.theme || "mechanical_gold");

    this._config = {
      source,
      text: "",
      entity: "",
      attribute: "",
      theme: "mechanical_gold",
      font_preset: "theme_default",
      typography_style: "normal",
      font_family: fontPreset.font_family,
      font_size: 46,
      font_weight: fontPreset.font_weight,
      font_style: "normal",
      letter_spacing: -1,
      text_transform: "uppercase",
      text_glow: "low",
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
      cycle_count: preset.cycle_count,
      flip_duration: preset.flip_duration,
      flip_stagger: preset.flip_stagger,
      clock_format: "HH:mm",
      clock_tick_interval: 1000,
      segment_width: 46,
      segment_height: 76,
      segment_gap: 5,
      segment_radius: 7,
      card_background: "#030303",
      segment_background: "#101010",
      segment_background_top: "#222222",
      segment_background_bottom: "#0b0b0b",
      segment_separator_color: "#020202",
      segment_border_color: "#292929",
      text_color: "#f6b72a",
      ...config,
      source
    };

    this._applyThemeDefaults();
    this._restartClock();
    this._render();
  }

  set hass(hass) {
    this._hass = hass;
    this._render();
  }

  disconnectedCallback() {
    this._stopClock();
  }

  getCardSize() {
    return 2;
  }

  _inferSource(config) {
    if (config.entity) return "entity";
    if (config.clock || config.clock_format) return "clock";
    return "text";
  }

  _restartClock() {
    this._stopClock();
    if (this._config.source !== "clock") return;
    const interval = this._num(this._config.clock_tick_interval, 1000, 250, 60000);
    this._clockTimer = window.setInterval(() => this._render(), interval);
  }

  _stopClock() {
    if (this._clockTimer) {
      window.clearInterval(this._clockTimer);
      this._clockTimer = null;
    }
  }

  _animationPreset(value) {
    const presets = {
      calm: { flip_duration: 820, flip_stagger: 70, cycle_count: 2 },
      mechanical: { flip_duration: 640, flip_stagger: 35, cycle_count: 2 },
      fast: { flip_duration: 360, flip_stagger: 18, cycle_count: 1 },
      instant: { flip_duration: 120, flip_stagger: 0, cycle_count: 0 }
    };
    return presets[value] || presets.mechanical;
  }

  _fontPreset(value, theme) {
    const presets = {
      theme_default: theme === "mechanical_gold"
        ? { font_family: "Roboto Condensed, Arial Narrow, sans-serif", font_weight: 700 }
        : { font_family: "Roboto Mono, monospace", font_weight: 800 },
      mechanical: { font_family: "Roboto Condensed, Arial Narrow, sans-serif", font_weight: 700 },
      transit: { font_family: "Barlow Condensed, Arial Narrow, sans-serif", font_weight: 700 },
      clean: { font_family: "Inter, system-ui, sans-serif", font_weight: 700 },
      mono: { font_family: "Roboto Mono, monospace", font_weight: 800 },
      custom: { font_family: this._config?.font_family || "Roboto Condensed, Arial Narrow, sans-serif", font_weight: this._config?.font_weight || 700 }
    };
    return presets[value] || presets.theme_default;
  }

  _applyThemeDefaults() {
    const themes = {
      mechanical_gold: {
        card_background: "#030303",
        segment_background: "#101010",
        segment_background_top: "#222222",
        segment_background_bottom: "#0b0b0b",
        segment_separator_color: "#020202",
        segment_border_color: "#292929",
        text_color: "#f6b72a",
        segment_width: 46,
        segment_height: 76,
        segment_gap: 5,
        segment_radius: 7
      },
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

    const theme = themes[this._config.theme] || themes.mechanical_gold;
    Object.entries(theme).forEach(([key, value]) => {
      if (this._config[key] === undefined || this._config[key] === null || this._config[key] === "") {
        this._config[key] = value;
      }
    });

    if (this._config.font_preset && this._config.font_preset !== "custom") {
      const font = this._fontPreset(this._config.font_preset, this._config.theme);
      this._config.font_family = font.font_family;
      this._config.font_weight = font.font_weight;
    }

    const animation = this._animationPreset(this._config.animation_feel);
    if (this._config.animation_feel && this._config.animation_feel !== "custom") {
      this._config.flip_duration = animation.flip_duration;
      this._config.flip_stagger = animation.flip_stagger;
      this._config.cycle_count = animation.cycle_count;
      this._config.animation = this._config.animation_feel !== "instant";
    }
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
    const count = this._num(this._config.segments, Math.max(text.length, 1), 1, 160);
    return Array.from(text).slice(0, count).join("").padEnd(count, this._first(this._config.pad_character, " "));
  }

  _render() {
    if (!this.shadowRoot) return;
    const config = this._config || {};
    const text = this._text();
    const chars = Array.from(text);
    const style = this._styles(config);
    const tiles = chars.map((char) => this._tile(char)).join("");
    this.shadowRoot.innerHTML = `${style}<ha-card><div class="display-shell"><div class="display" style="justify-content:${this._align(config.align)}">${tiles}</div></div></ha-card>`;
  }

  _tile(char) {
    const safe = this._escape(char);
    const space = char === " " ? " space" : "";
    return `<div class="split-flap-tile${space}"><div class="half top"><span>${safe}</span></div><div class="half bottom"><span>${safe}</span></div><div class="hinge"></div><div class="pin pin-left"></div><div class="pin pin-right"></div></div>`;
  }

  _styles(config) {
    const width = this._num(config.segment_width, 46, 8, 180);
    const height = this._num(config.segment_height, 76, 16, 240);
    const radius = this._num(config.segment_radius, 7, 0, 40);
    const gap = this._num(config.segment_gap, 5, 0, 40);
    const fontSize = this._num(config.font_size, 46, 8, 160);
    const letterSpacing = this._num(config.letter_spacing, -1, -8, 12);
    const weight = this._fontWeight(config.font_weight, 700);
    const fontStyle = config.font_style === "italic" ? "italic" : "normal";
    const glow = config.text_glow === "off" ? "none" : config.text_glow === "medium" ? `0 1px 0 rgba(0,0,0,.95), 0 0 8px ${this._rgba(config.text_color, .32)}` : `0 1px 0 rgba(0,0,0,.95), 0 0 5px ${this._rgba(config.text_color, .18)}`;

    return `<style>
      :host{display:block;--sfc-accent:#f6b72a;--sfc-muted:#86754d}
      ha-card{background:radial-gradient(circle at 50% 0%,rgba(255,255,255,.055),transparent 44%),linear-gradient(180deg,rgba(255,255,255,.035),rgba(0,0,0,.48)),${this._color(config.card_background,"#030303")};border-radius:18px;padding:18px;box-sizing:border-box;overflow:hidden;border:1px solid rgba(255,255,255,.07);box-shadow:inset 0 1px 0 rgba(255,255,255,.08),inset 0 -22px 34px rgba(0,0,0,.58),0 18px 38px rgba(0,0,0,.46)}
      .display-shell{border-radius:12px;padding:10px;background:linear-gradient(180deg,#181818 0%,#050505 56%,#000 100%);box-shadow:inset 0 1px 0 rgba(255,255,255,.07),inset 0 0 0 1px rgba(255,255,255,.045),inset 0 -18px 28px rgba(0,0,0,.62)}
      .display{display:flex;align-items:center;gap:${gap}px;width:100%;box-sizing:border-box;overflow:hidden;padding:2px}
      .split-flap-tile{position:relative;width:${width}px;height:${height}px;min-width:${width}px;border-radius:${radius}px;background:${this._color(config.segment_background,"#101010")};border:1px solid ${this._color(config.segment_border_color,"#292929")};color:${this._color(config.text_color,"#f6b72a")};font-family:${this._fontFamily(config.font_family,"Roboto Condensed, Arial Narrow, sans-serif")};font-size:${fontSize}px;font-weight:${weight};font-style:${fontStyle};letter-spacing:${letterSpacing}px;line-height:${height}px;text-align:center;overflow:visible;box-sizing:border-box;box-shadow:inset 0 1px 0 rgba(255,255,255,.115),inset 0 -1px 0 rgba(0,0,0,.9),0 9px 16px rgba(0,0,0,.62)}
      .half{position:absolute;left:0;width:100%;height:50%;overflow:hidden}.top{top:0;border-radius:${radius}px ${radius}px 0 0;background:linear-gradient(180deg,rgba(255,255,255,.075),transparent 54%),${this._color(config.segment_background_top,"#222")}}.bottom{bottom:0;border-radius:0 0 ${radius}px ${radius}px;background:linear-gradient(180deg,rgba(255,255,255,.025),rgba(0,0,0,.34)),${this._color(config.segment_background_bottom,"#0b0b0b")}}
      .half span{position:absolute;left:0;width:100%;height:${height}px;line-height:${height}px;text-align:center;transform:scaleX(.84);transform-origin:center;color:${this._color(config.text_color,"#f6b72a")};text-shadow:${glow}}
      .top span{top:0}.bottom span{top:${height/-2}px}.hinge{position:absolute;left:-1px;right:-1px;top:calc(50% - 2.5px);height:5px;background:linear-gradient(180deg,rgba(255,255,255,.11),transparent 34%),${this._color(config.segment_separator_color,"#020202")};z-index:2;box-shadow:0 1px 0 rgba(255,255,255,.075),0 -1px 0 rgba(0,0,0,.88),0 2px 5px rgba(0,0,0,.55)}
      .pin{position:absolute;top:calc(50% - 3px);width:6px;height:6px;border-radius:50%;background:radial-gradient(circle at 35% 25%,#323232,#050505 58%,#000 100%);border:1px solid #2c2c2c;z-index:3}.pin-left{left:5px}.pin-right{right:5px}.space span{opacity:0}
      @media(max-width:560px){ha-card{padding:12px}.display-shell{padding:7px}.display{gap:${Math.max(2, gap-2)}px}.split-flap-tile{width:${Math.max(24, Math.floor(width*.78))}px;min-width:${Math.max(24, Math.floor(width*.78))}px;height:${Math.max(38, Math.floor(height*.78))}px;font-size:${Math.max(20, Math.floor(fontSize*.72))}px;line-height:${Math.max(38, Math.floor(height*.78))}px}.half span{height:${Math.max(38, Math.floor(height*.78))}px;line-height:${Math.max(38, Math.floor(height*.78))}px}.bottom span{top:${Math.max(38, Math.floor(height*.78))/-2}px}}
    </style>`;
  }

  _align(value) {
    if (value === "left") return "flex-start";
    if (value === "right") return "flex-end";
    return "center";
  }

  _num(value, fallback, min, max) {
    const number = Number(value);
    return Number.isFinite(number) ? Math.min(Math.max(number, min), max) : fallback;
  }

  _first(value, fallback) {
    return Array.from(String(value ?? fallback))[0] || fallback;
  }

  _color(value, fallback) {
    const input = String(value ?? "").trim();
    return /^#[0-9a-fA-F]{3,8}$/.test(input) || /^rgba?\(/.test(input) || /^var\(--[a-zA-Z0-9_-]+\)$/.test(input) ? input : fallback;
  }

  _rgba(hex, alpha) {
    const input = this._color(hex, "#f6b72a");
    if (!input.startsWith("#")) return "rgba(246,183,42," + alpha + ")";
    const full = input.length === 4 ? "#" + input[1] + input[1] + input[2] + input[2] + input[3] + input[3] : input;
    const value = parseInt(full.slice(1, 7), 16);
    const r = (value >> 16) & 255;
    const g = (value >> 8) & 255;
    const b = value & 255;
    return `rgba(${r},${g},${b},${alpha})`;
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
    return String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
  }
}

class SplitFlapCardCanaryEditor extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._config = {};
    this._hass = null;
  }

  setConfig(config) {
    this._config = { ...(config || {}) };
    this._render();
  }

  set hass(hass) {
    this._hass = hass;
    this._render();
  }

  _lang() {
    const lang = String(this._hass?.locale?.language || this._hass?.language || "en").toLowerCase();
    return lang.startsWith("sv") ? "sv" : "en";
  }

  _t(key) {
    const sv = {
      preview: "Förhandsvisning",
      content: "Innehåll",
      show: "Vad ska kortet visa?",
      text: "Text",
      entity: "Entitet / sensor",
      clock: "Klocka",
      text_to_show: "Text att visa",
      entity_id: "Entitet eller sensor",
      attribute: "Attribut, valfritt",
      clock_format: "Klockformat",
      update_interval: "Uppdateringsintervall",
      display: "Display",
      alignment: "Justering",
      flap_slots: "Teckenrutor",
      theme: "Tema",
      typography_style: "Typografistil",
      typography: "Typografi",
      animation: "Animation",
      animation_on: "Aktivera animation",
      initial_animation: "Startanimation",
      animation_feel: "Animationskänsla",
      advanced: "Avancerat läge",
      advanced_typography: "Avancerad typografi",
      custom_font: "Egen font-family",
      font_size: "Textstorlek",
      font_weight: "Tjocklek",
      italic: "Kursiv",
      letter_spacing: "Teckenavstånd",
      text_transform: "Textomvandling",
      text_glow: "Textglöd",
      flap_design: "Teckenrutornas form",
      segment_width: "Rutbredd",
      segment_height: "Ruthöjd",
      segment_gap: "Avstånd mellan rutor",
      segment_radius: "Hörnradie",
      animation_fine: "Finjustering av animation",
      flip_speed: "Bläddringshastighet",
      delay_between: "Fördröjning mellan teckenrutor",
      shuffle_steps: "Mellansteg före slutbokstav",
      colors: "Färger",
      card_background: "Kortbakgrund",
      text_color: "Textfärg",
      advanced_data: "Avancerad textdata",
      charset: "Teckenuppsättning",
      custom_charset: "Egen teckenuppsättning",
      fallback_character: "Ersättningstecken",
      pad_character: "Utfyllnadstecken",
      manual: "Manual & hjälp",
      repo: "GitHub-repository",
      support: "Stöd projektet på Ko-fi",
      manual_link: "Öppna manual",
      help: "Hjälp",
      standard_hint: "Vanliga inställningar visas först. Avancerade val ligger längre ned.",
      responsive_hint: "Editorn anpassar sig efter panelens bredd."
    };
    const en = {
      preview: "Preview",
      content: "Content",
      show: "What should the card show?",
      text: "Text",
      entity: "Entity / Sensor",
      clock: "Clock",
      text_to_show: "Text to display",
      entity_id: "Entity or sensor",
      attribute: "Attribute, optional",
      clock_format: "Clock format",
      update_interval: "Update interval",
      display: "Display",
      alignment: "Alignment",
      flap_slots: "Flap slots",
      theme: "Theme",
      typography_style: "Typography style",
      typography: "Typography",
      animation: "Animation",
      animation_on: "Enable animation",
      initial_animation: "Initial animation",
      animation_feel: "Animation feel",
      advanced: "Advanced mode",
      advanced_typography: "Advanced typography",
      custom_font: "Custom font-family",
      font_size: "Font size",
      font_weight: "Font weight",
      italic: "Italic",
      letter_spacing: "Letter spacing",
      text_transform: "Text transform",
      text_glow: "Text glow",
      flap_design: "Flap slot design",
      segment_width: "Slot width",
      segment_height: "Slot height",
      segment_gap: "Gap between slots",
      segment_radius: "Corner radius",
      animation_fine: "Animation fine-tuning",
      flip_speed: "Flip speed",
      delay_between: "Delay between flaps",
      shuffle_steps: "Shuffle steps before final letter",
      colors: "Colors",
      card_background: "Card background",
      text_color: "Text color",
      advanced_data: "Advanced text data",
      charset: "Charset",
      custom_charset: "Custom charset",
      fallback_character: "Fallback character",
      pad_character: "Pad character",
      manual: "Manual & Help",
      repo: "GitHub repository",
      support: "Support on Ko-fi",
      manual_link: "Open manual",
      help: "Help",
      standard_hint: "Common settings are shown first. Advanced controls are grouped below.",
      responsive_hint: "The editor adapts to the panel width."
    };
    const dict = this._lang() === "sv" ? sv : en;
    return dict[key] || en[key] || key;
  }

  _value(key, fallback = "") {
    return this._config[key] ?? fallback;
  }

  _set(key, value, type = "string") {
    const config = { ...this._config };
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

    if (key === "animation_feel") {
      const preset = this._animationPreset(value);
      config.flip_duration = preset.flip_duration;
      config.flip_stagger = preset.flip_stagger;
      config.cycle_count = preset.cycle_count;
      config.animation = value !== "instant";
    }

    if (key === "font_preset" && value !== "custom") {
      const font = this._fontPreset(value, config.theme || "mechanical_gold");
      config.font_family = font.font_family;
      config.font_weight = font.font_weight;
    }

    this._config = config;
    this.dispatchEvent(new CustomEvent("config-changed", { detail: { config }, bubbles: true, composed: true }));
    this._render();
  }

  _animationPreset(value) {
    return {
      calm: { flip_duration: 820, flip_stagger: 70, cycle_count: 2 },
      mechanical: { flip_duration: 640, flip_stagger: 35, cycle_count: 2 },
      fast: { flip_duration: 360, flip_stagger: 18, cycle_count: 1 },
      instant: { flip_duration: 120, flip_stagger: 0, cycle_count: 0 },
      custom: {
        flip_duration: this._value("flip_duration", 640),
        flip_stagger: this._value("flip_stagger", 35),
        cycle_count: this._value("cycle_count", 2)
      }
    }[value] || { flip_duration: 640, flip_stagger: 35, cycle_count: 2 };
  }

  _fontPreset(value, theme) {
    return {
      theme_default: theme === "mechanical_gold"
        ? { font_family: "Roboto Condensed, Arial Narrow, sans-serif", font_weight: 700 }
        : { font_family: "Roboto Mono, monospace", font_weight: 800 },
      mechanical: { font_family: "Roboto Condensed, Arial Narrow, sans-serif", font_weight: 700 },
      transit: { font_family: "Barlow Condensed, Arial Narrow, sans-serif", font_weight: 700 },
      clean: { font_family: "Inter, system-ui, sans-serif", font_weight: 700 },
      mono: { font_family: "Roboto Mono, monospace", font_weight: 800 }
    }[value] || { font_family: "Roboto Condensed, Arial Narrow, sans-serif", font_weight: 700 };
  }

  _option(key, value, label) {
    return `<option value="${this._escape(value)}"${String(this._value(key, "")) === value ? " selected" : ""}>${this._escape(label)}</option>`;
  }

  _render() {
    if (!this.shadowRoot) return;
    const source = this._value("source", this._value("entity") ? "entity" : "text");
    const advanced = this._value("editor_advanced", false) === true;
    const customCharset = this._value("charset", "sv") === "custom";
    const animationOn = this._value("animation", true) !== false;
    const customFont = this._value("font_preset", "theme_default") === "custom";

    this.shadowRoot.innerHTML = `${this._styles()}
      <div class="editor" data-lang="${this._lang()}">
        ${this._section(this._t("preview"), `<div class="preview-card"><span>${this._escape(this._value("text", "SPLIT-FLAP TEST"))}</span></div><p>${this._t("responsive_hint")}</p>`)}
        ${this._section(this._t("content"), `
          <p>${this._t("standard_hint")}</p>
          ${this._select("source", this._t("show"), [["text", this._t("text")], ["entity", this._t("entity")], ["clock", this._t("clock")]])}
          ${source === "text" ? this._input("text", this._t("text_to_show"), "text", "SPLIT-FLAP TEST") : ""}
          ${source === "entity" ? this._input("entity", this._t("entity_id"), "text", "input_text.split_flap_message") + this._input("attribute", this._t("attribute"), "text", "friendly_name") : ""}
          ${source === "clock" ? this._input("clock_format", this._t("clock_format"), "text", "HH:mm:ss") + this._input("clock_tick_interval", this._t("update_interval"), "number", "1000") : ""}
        `)}
        ${this._section(this._t("display"), `
          <div class="grid two">
            ${this._select("align", this._t("alignment"), [["left", "Left"], ["center", "Center"], ["right", "Right"]])}
            ${this._input("segments", this._t("flap_slots"), "number", "16")}
          </div>
        `)}
        ${this._section(this._t("theme"), `
          <div class="grid two">
            ${this._select("theme", this._t("theme"), [["mechanical_gold", "Mechanical Gold"], ["kiosk_gold", "Kiosk Gold"], ["classic_airport", "Classic Airport"], ["terminal_amber", "Terminal Amber"], ["monochrome", "Monochrome"]])}
            ${this._select("font_preset", this._t("typography_style"), [["theme_default", "Theme default"], ["mechanical", "Mechanical"], ["transit", "Transit"], ["clean", "Clean"], ["mono", "Mono"], ["custom", "Custom"]])}
          </div>
        `)}
        ${this._section(this._t("animation"), `
          <div class="grid two">
            ${this._checkbox("animation", this._t("animation_on"), true)}
            ${this._checkbox("initial_animation", this._t("initial_animation"), true)}
          </div>
          ${animationOn ? this._select("animation_feel", this._t("animation_feel"), [["calm", "Calm"], ["mechanical", "Mechanical"], ["fast", "Fast"], ["instant", "Instant"], ["custom", "Custom"]]) : ""}
        `)}
        ${this._section(this._t("advanced"), `${this._checkbox("editor_advanced", this._t("advanced"), false)}`, "section-toggle")}
        ${advanced ? this._advanced(customFont, customCharset, animationOn) : ""}
        ${this._section(this._t("manual"), `
          <div class="link-row"><a href="https://github.com/ph13t0n/ha-split-flap-card#readme" target="_blank" rel="noopener">? ${this._t("manual_link")}</a></div>
          <div class="link-row"><a href="https://github.com/ph13t0n/ha-split-flap-card" target="_blank" rel="noopener">${this._t("repo")}</a></div>
          <div class="link-row"><a href="https://ko-fi.com/lifarvidsson" target="_blank" rel="noopener">${this._t("support")}</a></div>
        `)}
      </div>`;

    this._bind();
  }

  _advanced(customFont, customCharset, animationOn) {
    return `
      ${this._section(this._t("advanced_typography"), `
        <div class="grid two">
          ${customFont ? this._input("font_family", this._t("custom_font"), "text", "Roboto Condensed, Arial Narrow, sans-serif") : ""}
          ${this._input("font_size", this._t("font_size"), "number", "46")}
          ${this._select("font_weight", this._t("font_weight"), [["400", "Normal"], ["500", "Medium"], ["600", "Semi-bold"], ["700", "Bold"], ["800", "Extra-bold"]])}
          ${this._checkbox("font_style_italic", this._t("italic"), false)}
          ${this._input("letter_spacing", this._t("letter_spacing"), "number", "-1")}
          ${this._select("text_transform", this._t("text_transform"), [["uppercase", "Uppercase"], ["lowercase", "Lowercase"], ["none", "None"]])}
          ${this._select("text_glow", this._t("text_glow"), [["off", "Off"], ["low", "Low"], ["medium", "Medium"]])}
        </div>
      `)}
      ${this._section(this._t("flap_design"), `
        <div class="grid two">
          ${this._input("segment_width", this._t("segment_width"), "number", "46")}
          ${this._input("segment_height", this._t("segment_height"), "number", "76")}
          ${this._input("segment_gap", this._t("segment_gap"), "number", "5")}
          ${this._input("segment_radius", this._t("segment_radius"), "number", "7")}
        </div>
      `)}
      ${animationOn ? this._section(this._t("animation_fine"), `
        <div class="grid two">
          ${this._input("flip_duration", this._t("flip_speed"), "number", "640")}
          ${this._input("flip_stagger", this._t("delay_between"), "number", "35")}
          ${this._input("cycle_count", this._t("shuffle_steps"), "number", "2")}
        </div>
      `) : ""}
      ${this._section(this._t("colors"), `
        <div class="grid two">
          ${this._input("card_background", this._t("card_background"), "text", "#030303")}
          ${this._input("text_color", this._t("text_color"), "text", "#f6b72a")}
        </div>
      `)}
      ${this._section(this._t("advanced_data"), `
        <div class="grid two">
          ${this._select("charset", this._t("charset"), [["en", "English"], ["sv", "Swedish"], ["nordic", "Nordic"], ["western", "Western"], ["weather", "Weather"], ["weather_sv", "Weather Swedish"], ["extended", "Extended"], ["custom", "Custom"]])}
          ${customCharset ? this._input("custom_charset", this._t("custom_charset"), "text", "ABCDEFGHIJKLMNOPQRSTUVWXYZÅÄÖ0123456789 -:.,°/+") : ""}
          ${this._input("fallback_character", this._t("fallback_character"), "text", " ")}
          ${this._input("pad_character", this._t("pad_character"), "text", " ")}
        </div>
      `)}
    `;
  }

  _section(title, body, extraClass = "") {
    return `<section class="panel ${extraClass}"><div class="panel-title"><h3>${this._escape(title)}</h3><a class="help" href="https://github.com/ph13t0n/ha-split-flap-card#readme" target="_blank" rel="noopener" aria-label="${this._escape(this._t("help"))}">?</a></div><div class="panel-body">${body}</div></section>`;
  }

  _input(key, label, type, placeholder) {
    return `<label class="field"><span>${this._escape(label)}</span><input data-key="${this._escape(key)}" data-type="${type === "number" ? "number" : "string"}" type="${type}" value="${this._escape(this._value(key, ""))}" placeholder="${this._escape(placeholder || "")}"></label>`;
  }

  _select(key, label, options) {
    return `<label class="field"><span>${this._escape(label)}</span><select data-key="${this._escape(key)}">${options.map(([value, optionLabel]) => this._option(key, value, optionLabel)).join("")}</select></label>`;
  }

  _checkbox(key, label, fallback) {
    const checked = this._value(key, fallback) === true;
    return `<label class="check"><input data-key="${this._escape(key)}" data-type="boolean" type="checkbox"${checked ? " checked" : ""}><span>${this._escape(label)}</span></label>`;
  }

  _bind() {
    this.shadowRoot.querySelectorAll("input, select").forEach((element) => {
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
  }

  _styles() {
    return `<style>
      :host{display:block;color:#f4f0e6;--accent:#f6b72a;--surface:#111;--surface-2:#171717;--border:#3a3325;--muted:#b8aa82;font-family:var(--primary-font-family, system-ui, sans-serif)}
      .editor{display:grid;gap:12px;background:linear-gradient(180deg,#111,#070707);border:1px solid #2c271b;border-radius:18px;padding:14px;box-sizing:border-box}
      .panel{background:linear-gradient(180deg,var(--surface-2),var(--surface));border:1px solid var(--border);border-radius:14px;overflow:hidden;box-shadow:0 8px 20px rgba(0,0,0,.24)}
      .panel-title{display:flex;align-items:center;justify-content:space-between;gap:8px;background:linear-gradient(90deg,rgba(246,183,42,.22),rgba(134,117,77,.08));border-bottom:1px solid rgba(246,183,42,.18);padding:9px 11px}.panel-title h3{font-size:13px;line-height:1.2;margin:0;text-transform:uppercase;letter-spacing:.06em;color:#ffe3a0}.help{display:inline-grid;place-items:center;min-width:28px;height:28px;border-radius:999px;color:#060606;background:var(--accent);text-decoration:none;font-weight:800}.help:focus-visible,input:focus-visible,select:focus-visible,a:focus-visible{outline:3px solid #fff;outline-offset:2px}.panel-body{padding:12px;display:grid;gap:11px}.panel-body p{margin:0;color:var(--muted);font-size:12px;line-height:1.35}
      .grid{display:grid;gap:11px}.grid.two{grid-template-columns:repeat(2,minmax(0,1fr))}.field{display:grid;gap:5px}.field span,.check span{font-size:12px;color:#f0e6ca}.field input,.field select{width:100%;min-height:42px;box-sizing:border-box;border-radius:10px;border:1px solid #4c4129;background:#070707;color:#fff;padding:9px 10px;font:inherit}.check{display:flex;align-items:center;gap:10px;min-height:42px}.check input{inline-size:20px;block-size:20px;accent-color:var(--accent)}.preview-card{display:flex;align-items:center;justify-content:center;min-height:74px;border-radius:12px;background:#030303;border:1px solid #312817;box-shadow:inset 0 0 0 1px rgba(255,255,255,.04)}.preview-card span{font-weight:800;color:var(--accent);letter-spacing:.08em}.link-row a{color:#ffe3a0;text-decoration:none}.link-row a:hover{text-decoration:underline}
      @media(max-width:620px){.editor{padding:10px;border-radius:14px}.grid.two{grid-template-columns:1fr}.panel-title{padding:8px 9px}.panel-body{padding:10px}.field input,.field select{min-height:44px}.preview-card{min-height:56px}}
    </style>`;
  }

  _escape(value) {
    return String(value ?? "").replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
  }
}

if (!customElements.get("split-flap-card-canary")) {
  customElements.define("split-flap-card-canary", HASplitFlapCardCanary);
}

if (!customElements.get("split-flap-card-canary-editor")) {
  customElements.define("split-flap-card-canary-editor", SplitFlapCardCanaryEditor);
}

window.customCards = window.customCards || [];
window.customCards.push({
  type: "split-flap-card-canary",
  name: "Split-Flap Card Canary",
  description: `Experimental responsive editor canary (${SPLIT_FLAP_CANARY_VERSION})`
});
