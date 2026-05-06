const SPLIT_FLAP_CARD_VERSION = "0.1.0-beta.12-dev";
const SFC_REPO_URL = "https://github.com/ph13t0n/ha-split-flap-card";

const SFC_THEMES = {
  mechanical_gold: { label: "Default / Mechanical Gold", description: "Dark mechanical split-flap style with warm gold text.", bg: "#101010", top: "#252525", bottom: "#080808", line: "#010101", border: "#313131", text: "#ffc02e", font: "Roboto Condensed, Arial Narrow, sans-serif", weight: 900 },
  kiosk_gold: { label: "Kiosk Gold", description: "High-contrast kiosk display with gold lettering.", bg: "#101010", top: "#252525", bottom: "#080808", line: "#010101", border: "#313131", text: "#ffc02e", font: "Roboto Condensed, Arial Narrow, sans-serif", weight: 900 },
  classic_airport: { label: "Classic Airport", description: "Airport and station board style with yellow text.", bg: "#1a2225", top: "#243136", bottom: "#0b1012", line: "#070909", border: "#334247", text: "#f7d53b", font: "Barlow Condensed, Arial Narrow, sans-serif", weight: 900 },
  terminal_amber: { label: "Terminal Amber", description: "Amber terminal style with dark glyphs on bright flaps.", bg: "#f7d53b", top: "#ffe56b", bottom: "#d6b724", line: "#856f10", border: "#a98d16", text: "#1a2225", font: "Roboto Mono, monospace", weight: 900 },
  monochrome: { label: "Monochrome", description: "Minimal black-and-white display style.", bg: "#080808", top: "#151515", bottom: "#000000", line: "#000000", border: "#262626", text: "#ffffff", font: "Roboto Mono, monospace", weight: 900 },
  home_assistant_blue: { label: "Home Assistant Blue", description: "Dark display using Home Assistant blue as the main text color.", bg: "#0b1118", top: "#172430", bottom: "#05090d", line: "#020406", border: "#1d3444", text: "#03a9f4", font: "Roboto Condensed, Arial Narrow, sans-serif", weight: 900 },
  sweden_delight: { label: "Sweden Delight", description: "Swedish blue/yellow inspired high-contrast theme.", bg: "#004d6b", top: "#08617f", bottom: "#00384f", line: "#002a3b", border: "#0d6f92", text: "#fecb00", font: "Sweden Sans, Noto Sans, Arial, sans-serif", weight: 900 }
};

const SFC_FONT_PRESETS = {
  theme_default: { label: "Theme default", description: "Uses the selected card theme typography.", family: null, weight: null },
  mechanical: { label: "Mechanical", description: "Classic split-flap / mechanical display look.", family: "Roboto Condensed, Arial Narrow, sans-serif", weight: 900 },
  transit: { label: "Transit", description: "Airport, railway station and departure board style.", family: "Barlow Condensed, Arial Narrow, sans-serif", weight: 900 },
  clean: { label: "Clean", description: "Modern dashboard-friendly UI typography.", family: "Inter, system-ui, sans-serif", weight: 800 },
  mono: { label: "Mono", description: "Technical terminal / monospace display style.", family: "Roboto Mono, monospace", weight: 800 },
  custom: { label: "Custom", description: "Use your own CSS font-family in Advanced styling.", family: "system-ui, sans-serif", weight: 800 }
};

class HASplitFlapCard extends HTMLElement {
  static getStubConfig() {
    return {
      source: "text",
      text: "SPLIT-FLAP TEST",
      segments_mode: "auto",
      segments: 16,
      theme: "mechanical_gold",
      font_preset: "theme_default",
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
    this._timer = null;
  }

  setConfig(config) {
    if (!config || typeof config !== "object") throw new Error("Invalid configuration.");

    const source = this._inferSource(config);
    const theme = SFC_THEMES[config.theme] || SFC_THEMES.mechanical_gold;
    const preset = SFC_FONT_PRESETS[config.font_preset || "theme_default"] || SFC_FONT_PRESETS.theme_default;

    this._config = {
      source,
      text: "",
      entity: "",
      attribute: "",
      segments_mode: config.segments_mode || "manual",
      segments: 16,
      theme: "mechanical_gold",
      font_preset: "theme_default",
      font_family: preset.family || theme.font,
      font_size: 60,
      font_weight: preset.weight || theme.weight,
      font_style: "normal",
      letter_spacing: -1,
      letter_vertical_offset: -9,
      text_transform: "uppercase",
      text_glow: "off",
      align: "center",
      language: "sv",
      charset: "sv",
      pad_character: " ",
      pad_mode: "end",
      clock_format: "HH:mm",
      clock_tick_interval: 1000,
      segment_width: 48,
      segment_height: 78,
      segment_gap: 6,
      segment_radius: 7,
      card_background: "#030303",
      frame_background: "#050505",
      segment_background: theme.bg,
      segment_background_top: theme.top,
      segment_background_bottom: theme.bottom,
      segment_separator_color: theme.line,
      segment_border_color: theme.border,
      text_color: theme.text,
      ...config,
      source
    };

    if (this._config.font_preset === "theme_default" && !config.font_family) {
      this._config.font_family = theme.font;
      this._config.font_weight = theme.weight;
    }

    this._restartClock();
    this._render();
  }

  set hass(hass) {
    this._hass = hass;
    if (this._config.source === "entity") this._render();
  }

  disconnectedCallback() {
    if (this._timer) clearInterval(this._timer);
  }

  getCardSize() {
    return 2;
  }

  _inferSource(config) {
    return config.source || (config.entity ? "entity" : (config.clock || config.clock_format ? "clock" : "text"));
  }

  _restartClock() {
    if (this._timer) clearInterval(this._timer);
    this._timer = null;
    if (this._config.source === "clock") {
      this._timer = setInterval(() => this._render(), this._num(this._config.clock_tick_interval, 1000, 250, 60000));
    }
  }

  _raw() {
    const c = this._config;
    if (c.source === "clock") return this._clock(c.clock_format);
    if (c.source === "entity") {
      const s = c.entity ? this._hass?.states?.[c.entity] : null;
      if (!c.entity) return "";
      if (!s) return "ENTITY NOT FOUND";
      return c.attribute ? String(s.attributes?.[c.attribute] ?? "") : String(s.state);
    }
    return String(c.text ?? "");
  }

  _clock(format) {
    const now = new Date();
    const hours = now.getHours();
    const hours12 = hours % 12 || 12;
    const values = {
      HH: String(hours).padStart(2, "0"),
      H: String(hours),
      hh: String(hours12).padStart(2, "0"),
      h: String(hours12),
      mm: String(now.getMinutes()).padStart(2, "0"),
      ss: String(now.getSeconds()).padStart(2, "0"),
      A: hours >= 12 ? "PM" : "AM"
    };

    return String(format || "HH:mm")
      .replaceAll("HH", values.HH)
      .replaceAll("hh", values.hh)
      .replaceAll("H", values.H)
      .replaceAll("h", values.h)
      .replaceAll("mm", values.mm)
      .replaceAll("ss", values.ss)
      .replaceAll("A", values.A);
  }

  _displayText() {
    let text = this._raw();
    if (this._config.text_transform === "uppercase") text = text.toLocaleUpperCase("sv-SE");
    if (this._config.text_transform === "lowercase") text = text.toLocaleLowerCase("sv-SE");

    const chars = Array.from(text);
    const count = this._config.segments_mode === "auto"
      ? Math.max(chars.length, 1)
      : this._num(this._config.segments, Math.max(chars.length, 1), 1, 160);

    const cut = chars.slice(0, count).join("");
    const pad = this._first(this._config.pad_character, " ");
    return this._config.pad_mode === "start" ? cut.padStart(count, pad) : cut.padEnd(count, pad);
  }

  _render() {
    const tiles = Array.from(this._displayText()).map((ch) => this._tile(ch)).join("");
    this.shadowRoot.innerHTML = `${this._styles()}<ha-card><div class="display-shell"><div class="display" style="justify-content:${this._align(this._config.align)}">${tiles}</div></div></ha-card>`;
  }

  _tile(ch) {
    const escaped = this._e(ch);
    return `<div class="tile${ch === " " ? " space" : ""}"><div class="flap top"><span>${escaped}</span></div><div class="flap bottom"><span>${escaped}</span></div><div class="hinge"></div><div class="pin left"></div><div class="pin right"></div></div>`;
  }

  _styles() {
    const c = this._config;
    const width = this._num(c.segment_width, 48, 8, 180);
    const height = this._num(c.segment_height, 78, 16, 240);
    const radius = this._num(c.segment_radius, 7, 0, 40);
    const gap = this._num(c.segment_gap, 6, 0, 80);
    const fontSize = this._num(c.font_size, 60, 6, 220);
    const verticalOffset = this._num(c.letter_vertical_offset, -9, -80, 80);
    const letterSpacing = this._num(c.letter_spacing, -1, -20, 40);
    const glow = c.text_glow && c.text_glow !== "off" ? `text-shadow:0 0 8px ${this._css(c.text_color, "#ffc02e")};` : "";

    return `<style>
      :host{display:block}
      ha-card{overflow:hidden;border-radius:16px;background:${this._css(c.card_background, "#030303")};padding:16px}
      .display-shell{box-sizing:border-box;width:100%;border-radius:${Math.max(radius + 6, 10)}px;background:${this._css(c.frame_background, "#050505")};border:1px solid rgba(255,255,255,.08);padding:${Math.max(8, Math.round(gap * 2))}px;box-shadow:inset 0 0 0 1px rgba(0,0,0,.8),0 14px 30px rgba(0,0,0,.45)}
      .display{display:flex;align-items:center;gap:${gap}px;min-width:0;overflow:hidden}
      .tile{position:relative;flex:0 0 ${width}px;width:${width}px;height:${height}px;border-radius:${radius}px;overflow:hidden;background:${this._css(c.segment_background, "#101010")};border:1px solid ${this._css(c.segment_border_color, "#313131")};box-shadow:inset 0 1px 0 rgba(255,255,255,.07),inset 0 -12px 18px rgba(0,0,0,.38),0 4px 10px rgba(0,0,0,.6)}
      .space{opacity:.82}
      .flap{position:absolute;left:0;right:0;height:50%;overflow:hidden;display:flex;justify-content:center;color:${this._css(c.text_color, "#ffc02e")};font-family:${this._font(c.font_family)};font-size:${fontSize}px;font-weight:${this._weight(c.font_weight)};font-style:${c.font_style === "italic" ? "italic" : "normal"};letter-spacing:${letterSpacing}px;line-height:1;${glow}}
      .top{top:0;align-items:flex-end;background:linear-gradient(180deg,${this._css(c.segment_background_top, "#252525")},${this._css(c.segment_background, "#101010")})}
      .bottom{bottom:0;align-items:flex-start;background:linear-gradient(180deg,${this._css(c.segment_background, "#101010")},${this._css(c.segment_background_bottom, "#080808")})}
      .top span{transform:translateY(calc(50% + ${verticalOffset}px))}
      .bottom span{transform:translateY(calc(-50% + ${verticalOffset}px))}
      .hinge{position:absolute;left:0;right:0;top:calc(50% - 1px);height:2px;background:${this._css(c.segment_separator_color, "#010101")};z-index:8}
      .pin{position:absolute;z-index:9;top:calc(50% - 2px);width:4px;height:4px;border-radius:50%;background:rgba(255,255,255,.17)}
      .left{left:4px}.right{right:4px}
    </style>`;
  }

  _align(value) { return value === "left" ? "flex-start" : value === "right" ? "flex-end" : "center"; }
  _num(value, fallback, min, max) { const n = Number(value); return Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : fallback; }
  _first(value, fallback) { const chars = Array.from(String(value ?? "")); return chars.length ? chars[0] : fallback; }
  _css(value, fallback) { return String(value || fallback).replace(/[;{}<>]/g, ""); }
  _font(value) { return String(value || "Roboto Mono,monospace").replace(/[;{}<>]/g, ""); }
  _weight(value) { return /^[0-9a-zA-Z\s-]+$/.test(String(value || "800")) ? String(value || "800") : "800"; }
  _e(value) { return String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;"); }
}

class SplitFlapCardEditor extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._config = {};
    this._hass = null;
    this._advanced = false;
  }

  set hass(hass) {
    this._hass = hass;
    this._updatePreview();
  }

  setConfig(config) {
    this._config = { ...(config || {}) };
    this._render();
  }

  _v(key, fallback = "") { return this._config[key] ?? fallback; }
  _source() { return this._v("source", this._config.entity ? "entity" : (this._config.clock || this._config.clock_format ? "clock" : "text")); }
  _segmentsMode() { return this._v("segments_mode", this._config.segments_mode || "manual"); }

  _set(key, value, render = true) {
    const next = { ...this._config, [key]: value };
    if (value === "" && !["text", "entity", "attribute", "font_family", "font_stylesheet"].includes(key)) delete next[key];

    if (key === "source") {
      if (value === "text") { delete next.entity; delete next.attribute; }
      if (value === "entity") delete next.text;
      if (value === "clock") { delete next.text; delete next.entity; delete next.attribute; }
    }

    if (key === "segments_mode" && value === "auto") {
      delete next.segments;
    }

    this._config = next;
    this._fire();
    if (render) this._render();
    else this._updatePreview();
  }

  _num(key, value, render = false) {
    const next = { ...this._config };
    if (value === "") delete next[key];
    else {
      const n = Number(value);
      if (Number.isFinite(n)) next[key] = n;
    }
    this._config = next;
    this._fire();
    if (render) this._render();
    else this._updatePreview();
  }

  _fire() {
    this.dispatchEvent(new CustomEvent("config-changed", { bubbles: true, composed: true, detail: { config: this._config } }));
  }

  _render() {
    const source = this._source();
    const theme = this._v("theme", "mechanical_gold");
    const preset = this._v("font_preset", "theme_default");
    const segmentsMode = this._segmentsMode();

    this.shadowRoot.innerHTML = `${this._styles()}
      <div class="editor">
        <div class="hero">
          <div class="hero-title"><strong>Split-Flap Card</strong><span>${SPLIT_FLAP_CARD_VERSION}</span></div>
          <div class="hint">Editor stability branch. Preview follows selected source. Auto/manual segments are explicit.</div>
        </div>

        <section class="section">
          <div class="section-title">Content</div>
          <div class="body">
            <div class="grid">
              ${this._select("source", "Source", source, { text: "Text", entity: "Entity / Sensor", clock: "Clock" })}
              ${this._select("segments_mode", "Segments mode", segmentsMode, { auto: "Auto — follows output length", manual: "Manual — fixed segment count" })}
            </div>
            ${segmentsMode === "manual" ? this._number("segments", "Segments", this._v("segments", 16), 1, 160, "Default: 16") : this._info("Auto segments", `Current preview length: ${this._effectivePreviewLength()}`)}
            ${source === "text" ? this._input("text", "Text", this._v("text", ""), "Text to show on the split-flap display") : ""}
            ${source === "entity" ? this._input("entity", "Entity", this._v("entity", ""), "input_text.split_flap_message") + this._input("attribute", "Attribute", this._v("attribute", ""), "Optional attribute") : ""}
            ${source === "clock" ? `<div class="grid">${this._input("clock_format", "Clock format", this._v("clock_format", "HH:mm"), "HH:mm, HH:mm:ss, h:mm A")}${this._number("clock_tick_interval", "Clock tick interval", this._v("clock_tick_interval", 1000), 250, 60000, "Default: 1000")}</div>` : ""}
            <div class="grid">
              ${this._select("language", "Language", this._v("language", "sv"), { en: "English", sv: "Swedish", nordic: "Nordic", western: "Western" })}
              ${this._select("charset", "Charset", this._v("charset", this._v("language", "sv")), { en: "English", sv: "Swedish", nordic: "Nordic", western: "Western", weather: "Weather", weather_sv: "Weather Swedish", extended: "Extended", custom: "Custom" })}
            </div>
          </div>
        </section>

        <section class="section">
          <div class="section-title">Appearance</div>
          <div class="body">
            <div class="grid">
              ${this._select("theme", "Theme", theme, Object.fromEntries(Object.entries(SFC_THEMES).map(([key, value]) => [key, value.label])))}
              ${this._select("align", "Align", this._v("align", "center"), { left: "Left", center: "Center", right: "Right" })}
            </div>
            ${this._themeInfo(theme)}
            <div class="grid">
              ${this._select("text_transform", "Text transform", this._v("text_transform", "uppercase"), { uppercase: "Uppercase", lowercase: "Lowercase", none: "None" })}
              ${this._number("font_size", "Font size", this._v("font_size", ""), 6, 220, "Default: 60")}
            </div>
            <div class="preset-grid">${Object.entries(SFC_FONT_PRESETS).map(([key, item]) => this._preset(key, item, preset)).join("")}</div>
          </div>
        </section>

        <section class="section">
          <div class="section-title">Motion</div>
          <div class="body">
            <div class="checks">
              ${this._check("animation", "Animation", this._v("animation", true))}
              ${this._check("initial_animation", "Initial animation", this._v("initial_animation", true))}
              ${this._check("cycle_chars", "Cycle characters", this._v("cycle_chars", true))}
            </div>
          </div>
        </section>

        <details ${this._advanced ? "open" : ""}>
          <summary>Advanced styling</summary>
          <div class="body">
            <div class="grid">
              ${this._number("segment_width", "Segment width", this._v("segment_width", ""), 8, 180, "Default: 48")}
              ${this._number("segment_height", "Segment height", this._v("segment_height", ""), 16, 240, "Default: 78")}
            </div>
            <div class="grid">
              ${this._number("segment_gap", "Segment gap", this._v("segment_gap", ""), 0, 80, "Default: 6")}
              ${this._number("segment_radius", "Segment radius", this._v("segment_radius", ""), 0, 40, "Default: 7")}
            </div>
            <div class="grid">
              ${this._number("letter_spacing", "Letter spacing", this._v("letter_spacing", ""), -20, 40, "Default: -1")}
              ${this._number("letter_vertical_offset", "Letter vertical offset", this._v("letter_vertical_offset", ""), -80, 80, "Default: -9")}
            </div>
            <div class="grid">
              ${this._input("font_family", "Font family", this._v("font_family", ""), "Theme or font preset")}
              ${this._input("text_color", "Text color", this._v("text_color", ""), "Theme default")}
            </div>
          </div>
        </details>

        <section class="section preview-section">
          <div class="section-title">Preview</div>
          <div class="body">
            <div class="preview-meta">Source: <b>${source}</b> · Segments: <b>${segmentsMode === "auto" ? "auto" : this._v("segments", 16)}</b></div>
            <div class="preview"><split-flap-card></split-flap-card></div>
          </div>
        </section>

        <div class="links">
          <button type="button" data-url="${SFC_REPO_URL}/blob/main/docs/UI_EDITOR_MANUAL.md">Manual</button>
          <button type="button" data-url="${SFC_REPO_URL}/blob/main/SUPPORT.md">Support</button>
          <button type="button" data-url="${SFC_REPO_URL}/issues/new">Report issue</button>
        </div>
      </div>`;

    this._bind();
    this._updatePreview();
  }

  _bind() {
    this.shadowRoot.querySelectorAll("select[data-k]").forEach((element) => {
      element.onchange = () => this._set(element.dataset.k, element.value, true);
    });

    this.shadowRoot.querySelectorAll("input[data-k]").forEach((element) => {
      element.oninput = () => {
        this._config = { ...this._config, [element.dataset.k]: element.value };
        this._fire();
        this._updatePreview();
      };
      element.onchange = () => this._set(element.dataset.k, element.value, false);
    });

    this.shadowRoot.querySelectorAll("input[data-n]").forEach((element) => {
      element.oninput = () => this._num(element.dataset.n, element.value, false);
      element.onchange = () => this._num(element.dataset.n, element.value, false);
    });

    this.shadowRoot.querySelectorAll("input[data-b]").forEach((element) => {
      element.onchange = () => this._set(element.dataset.b, element.checked, false);
    });

    this.shadowRoot.querySelectorAll("[data-preset]").forEach((element) => {
      element.onclick = () => this._set("font_preset", element.dataset.preset, true);
    });

    this.shadowRoot.querySelectorAll("[data-url]").forEach((element) => {
      element.onclick = () => {
        const win = window.open(element.dataset.url, "_blank", "noopener,noreferrer");
        if (!win) location.href = element.dataset.url;
      };
    });

    const details = this.shadowRoot.querySelector("details");
    if (details) details.ontoggle = () => { this._advanced = details.open; };
  }

  _updatePreview() {
    const preview = this.shadowRoot?.querySelector(".preview split-flap-card");
    if (!preview) return;

    const config = this._previewConfig();
    preview.setConfig(config);
    if (this._hass) preview.hass = this._hass;

    const meta = this.shadowRoot.querySelector(".preview-meta");
    if (meta) {
      const source = this._source();
      const count = config.segments_mode === "auto" ? this._effectivePreviewLength() : this._v("segments", 16);
      meta.innerHTML = `Source: <b>${this._e(source)}</b> · Segments: <b>${this._e(config.segments_mode === "auto" ? `auto (${count})` : String(count))}</b>`;
    }
  }

  _previewConfig() {
    const source = this._source();
    const config = { ...this._config, source };
    if (!config.theme) config.theme = "mechanical_gold";
    if (!config.segments_mode) config.segments_mode = this._segmentsMode();
    if (source === "clock" && !config.clock_format) config.clock_format = "HH:mm";
    return config;
  }

  _effectivePreviewText() {
    const source = this._source();
    if (source === "clock") return this._clockPreview(this._v("clock_format", "HH:mm"));
    if (source === "entity") {
      const entity = this._v("entity", "");
      const attribute = this._v("attribute", "");
      const state = entity ? this._hass?.states?.[entity] : null;
      if (!entity) return "";
      if (!state) return "ENTITY NOT FOUND";
      return attribute ? String(state.attributes?.[attribute] ?? "") : String(state.state);
    }
    return String(this._v("text", ""));
  }

  _effectivePreviewLength() {
    return Math.max(1, Array.from(this._effectivePreviewText()).length);
  }

  _clockPreview(format) {
    const now = new Date();
    const hours = now.getHours();
    const hours12 = hours % 12 || 12;
    const values = {
      HH: String(hours).padStart(2, "0"),
      H: String(hours),
      hh: String(hours12).padStart(2, "0"),
      h: String(hours12),
      mm: String(now.getMinutes()).padStart(2, "0"),
      ss: String(now.getSeconds()).padStart(2, "0"),
      A: hours >= 12 ? "PM" : "AM"
    };
    return String(format || "HH:mm").replaceAll("HH", values.HH).replaceAll("hh", values.hh).replaceAll("H", values.H).replaceAll("h", values.h).replaceAll("mm", values.mm).replaceAll("ss", values.ss).replaceAll("A", values.A);
  }

  _themeInfo(themeKey) {
    const theme = SFC_THEMES[themeKey] || SFC_THEMES.mechanical_gold;
    return `<div class="info"><b>${this._e(theme.label)}</b><span>${this._e(theme.description)}</span></div>`;
  }

  _preset(key, item, active) {
    return `<button type="button" class="preset${key === active ? " active" : ""}" data-preset="${this._e(key)}"><b>${this._e(item.label)}</b><small>${this._e(item.description)}</small></button>`;
  }

  _select(key, label, value, options) {
    return `<div class="row"><label>${this._e(label)}</label><select data-k="${this._e(key)}">${Object.entries(options).map(([optionValue, optionLabel]) => `<option value="${this._e(optionValue)}"${optionValue === value ? " selected" : ""}>${this._e(optionLabel)}</option>`).join("")}</select></div>`;
  }

  _input(key, label, value, placeholder = "") {
    return `<div class="row"><label>${this._e(label)}</label><input data-k="${this._e(key)}" placeholder="${this._e(placeholder)}" value="${this._e(value)}"></div>`;
  }

  _number(key, label, value, min, max, placeholder = "") {
    return `<div class="row"><label>${this._e(label)}</label><input data-n="${this._e(key)}" type="number" min="${min}" max="${max}" placeholder="${this._e(placeholder)}" value="${this._e(value)}"></div>`;
  }

  _check(key, label, value) {
    return `<label class="check"><input data-b="${this._e(key)}" type="checkbox"${value ? " checked" : ""}>${this._e(label)}</label>`;
  }

  _info(label, value) {
    return `<div class="info"><b>${this._e(label)}</b><span>${this._e(value)}</span></div>`;
  }

  _styles() {
    return `<style>
      :host{display:block;color:var(--primary-text-color)}
      .editor{display:grid;gap:16px;padding:6px 2px 14px}
      .hero,.section,details{border:1px solid rgba(255,255,255,.10);border-radius:16px;background:rgba(255,255,255,.025);overflow:hidden}
      .hero{padding:14px;background:linear-gradient(145deg,rgba(4,18,22,.95),rgba(4,4,4,.98))}
      .hero-title,.section-title{display:flex;justify-content:space-between;gap:10px}
      .hero-title strong{font-size:15px;text-transform:uppercase;letter-spacing:.06em}
      .hero-title span,summary{color:#f7d53b}
      .hint{color:var(--secondary-text-color);font-size:12px;margin-top:6px;line-height:1.45}
      .section-title{padding:12px 14px;background:rgba(255,255,255,.035);font-weight:800;letter-spacing:.02em}
      .body{display:grid;gap:13px;padding:14px}
      .grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}
      .row{display:grid;gap:6px}
      label{color:var(--secondary-text-color);font-size:12px;font-weight:700}
      input,select{box-sizing:border-box;width:100%;min-height:42px;border:1px solid rgba(255,255,255,.12);border-radius:10px;padding:9px 11px;background:rgba(0,0,0,.35);color:var(--primary-text-color,#fff);font:inherit;outline:none}
      input:focus,select:focus{border-color:#f7d53b;box-shadow:0 0 0 1px rgba(247,213,59,.25)}
      .preset-grid,.checks{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}
      .preset,.check{display:grid;gap:4px;padding:10px;border-radius:12px;border:1px solid rgba(255,255,255,.10);background:rgba(0,0,0,.22);color:var(--primary-text-color);text-align:left}
      .preset.active{border-color:#f7d53b;box-shadow:0 0 0 1px rgba(247,213,59,.18)}
      .preset small{color:var(--secondary-text-color);line-height:1.3}
      .check{display:flex;align-items:center;gap:10px;min-height:42px}
      .check input{width:auto;min-height:auto;accent-color:#f7d53b}
      summary{cursor:pointer;padding:12px 14px;font-weight:800;letter-spacing:.02em}
      .links{display:flex;flex-wrap:wrap;gap:8px}
      .links button{color:#f7d53b;background:transparent;border:1px solid rgba(247,213,59,.35);border-radius:999px;padding:7px 10px;font-size:12px;cursor:pointer}
      .preview{border-radius:14px;overflow:hidden;background:#020202;padding:8px}
      .preview-meta{font-size:12px;color:var(--secondary-text-color);line-height:1.4}
      .info{display:grid;gap:3px;border:1px solid rgba(255,255,255,.10);border-radius:12px;padding:10px;background:rgba(0,0,0,.18)}
      .info b{font-size:12px;color:var(--primary-text-color)}
      .info span{font-size:12px;color:var(--secondary-text-color);line-height:1.35}
      @media(max-width:560px){.grid,.preset-grid,.checks{grid-template-columns:1fr}.hero,.section,details{border-radius:14px}.body{padding:12px}.preview{padding:6px}}
    </style>`;
  }

  _e(value) {
    return String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
  }
}

if (!customElements.get("split-flap-card")) customElements.define("split-flap-card", HASplitFlapCard);
if (!customElements.get("split-flap-card-editor")) customElements.define("split-flap-card-editor", SplitFlapCardEditor);
window.customCards = window.customCards || [];
window.customCards.push({ type: "split-flap-card", name: "Split-Flap Card", preview: true, description: `Beta release ${SPLIT_FLAP_CARD_VERSION}`, documentationURL: SFC_REPO_URL });
