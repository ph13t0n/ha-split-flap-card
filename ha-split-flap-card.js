const SPLIT_FLAP_CARD_VERSION = "0.1.0-beta.12-dev";
const SFC_REPO_URL = "https://github.com/ph13t0n/ha-split-flap-card";
const SFC_ISSUE_URL = `${SFC_REPO_URL}/issues/new`;

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

const SFC_DEFAULTS = {
  source: "text",
  text: "",
  entity: "",
  attribute: "",
  segments_mode: "auto",
  segments: 16,
  theme: "mechanical_gold",
  font_preset: "theme_default",
  font_size: 60,
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
  animation: true,
  initial_animation: true,
  cycle_chars: true,
  segment_width: 48,
  segment_height: 78,
  segment_gap: 6,
  segment_radius: 7,
  card_background: "#030303",
  frame_background: "#050505"
};

class HASplitFlapCard extends HTMLElement {
  static getStubConfig() {
    return {
      source: "text",
      text: "SPLIT-FLAP TEST",
      segments_mode: "auto",
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
    this._lastDisplayText = null;
    this._hasRendered = false;
  }

  setConfig(config) {
    if (!config || typeof config !== "object") throw new Error("Invalid configuration.");

    const source = this._inferSource(config);
    const theme = SFC_THEMES[config.theme] || SFC_THEMES.mechanical_gold;
    const preset = SFC_FONT_PRESETS[config.font_preset || "theme_default"] || SFC_FONT_PRESETS.theme_default;
    const previousSignature = this._config ? this._renderSignature(this._config) : "";

    this._config = {
      ...SFC_DEFAULTS,
      segment_background: theme.bg,
      segment_background_top: theme.top,
      segment_background_bottom: theme.bottom,
      segment_separator_color: theme.line,
      segment_border_color: theme.border,
      text_color: theme.text,
      font_family: preset.family || theme.font,
      font_weight: preset.weight || theme.weight,
      ...config,
      source,
      segments_mode: config.segments_mode || "auto"
    };

    if (this._config.font_preset === "theme_default" && !config.font_family) {
      this._config.font_family = theme.font;
      this._config.font_weight = theme.weight;
    }

    const nextSignature = this._renderSignature(this._config);
    if (previousSignature && previousSignature !== nextSignature) {
      this._lastDisplayText = null;
      this._hasRendered = false;
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

  _renderSignature(config) {
    return [
      config.theme,
      config.font_preset,
      config.font_family,
      config.font_size,
      config.font_weight,
      config.segment_width,
      config.segment_height,
      config.segment_gap,
      config.segment_radius,
      config.letter_spacing,
      config.letter_vertical_offset,
      config.text_color,
      config.segments_mode,
      config.segments,
      config.source
    ].join("|");
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
    const displayText = this._displayText();
    const previous = this._lastDisplayText;
    const animationEnabled = this._config.animation !== false;
    const initialEnabled = this._config.initial_animation !== false;

    const tiles = Array.from(displayText).map((ch, index) => {
      const previousChar = previous ? Array.from(previous)[index] : undefined;
      const changed = animationEnabled && (
        (previous == null && initialEnabled && ch !== " ") ||
        (previous != null && previousChar !== ch)
      );
      return this._tile(ch, changed);
    }).join("");

    this._lastDisplayText = displayText;
    this._hasRendered = true;

    this.shadowRoot.innerHTML = `${this._styles()}<ha-card><div class="display-shell"><div class="display" style="justify-content:${this._align(this._config.align)}">${tiles}</div></div></ha-card>`;
  }

  _tile(ch, changed = false) {
    const escaped = this._e(ch);
    const classes = ["tile", ch === " " ? "space" : "", changed ? "flip" : ""].filter(Boolean).join(" ");
    return `<div class="${classes}"><div class="flap top"><span>${escaped}</span></div><div class="flap bottom"><span>${escaped}</span></div><div class="hinge"></div><div class="pin left"></div><div class="pin right"></div></div>`;
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
      .display{display:flex;align-items:center;gap:${gap}px;min-width:0;overflow:hidden;perspective:900px}
      .tile{position:relative;flex:0 0 ${width}px;width:${width}px;height:${height}px;border-radius:${radius}px;overflow:hidden;background:${this._css(c.segment_background, "#101010")};border:1px solid ${this._css(c.segment_border_color, "#313131")};box-shadow:inset 0 1px 0 rgba(255,255,255,.07),inset 0 -12px 18px rgba(0,0,0,.38),0 4px 10px rgba(0,0,0,.6);transform-style:preserve-3d}
      .space{opacity:.82}
      .flap{position:absolute;left:0;right:0;height:50%;overflow:hidden;display:flex;justify-content:center;color:${this._css(c.text_color, "#ffc02e")};font-family:${this._font(c.font_family)};font-size:${fontSize}px;font-weight:${this._weight(c.font_weight)};font-style:${c.font_style === "italic" ? "italic" : "normal"};letter-spacing:${letterSpacing}px;line-height:1;backface-visibility:hidden;transform-style:preserve-3d;${glow}}
      .top{top:0;align-items:flex-end;transform-origin:bottom center;background:linear-gradient(180deg,${this._css(c.segment_background_top, "#252525")},${this._css(c.segment_background, "#101010")})}
      .bottom{bottom:0;align-items:flex-start;transform-origin:top center;background:linear-gradient(180deg,${this._css(c.segment_background, "#101010")},${this._css(c.segment_background_bottom, "#080808")})}
      .top span{transform:translateY(calc(50% + ${verticalOffset}px))}
      .bottom span{transform:translateY(calc(-50% + ${verticalOffset}px))}
      .hinge{position:absolute;left:0;right:0;top:calc(50% - 1px);height:2px;background:${this._css(c.segment_separator_color, "#010101")};z-index:8}
      .pin{position:absolute;z-index:9;top:calc(50% - 2px);width:4px;height:4px;border-radius:50%;background:rgba(255,255,255,.17)}
      .left{left:4px}.right{right:4px}
      .tile.flip .top{animation:sfcFlipTop .30s cubic-bezier(.38,.02,.22,1)}
      .tile.flip .bottom{animation:sfcFlipBottom .30s cubic-bezier(.38,.02,.22,1) .07s both}
      .tile.flip .hinge{animation:sfcHingePulse .36s ease-out}
      @keyframes sfcFlipTop{0%{transform:rotateX(0deg);filter:brightness(1.08)}55%{transform:rotateX(-74deg);filter:brightness(.84)}100%{transform:rotateX(0deg);filter:brightness(1)}}
      @keyframes sfcFlipBottom{0%{transform:rotateX(54deg);filter:brightness(.82)}100%{transform:rotateX(0deg);filter:brightness(1)}}
      @keyframes sfcHingePulse{0%,100%{opacity:1}50%{opacity:.70}}
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
    this._supportOpen = false;
    this._issueFields = {
      description: "",
      expected: "",
      actual: "",
      console_errors: ""
    };
  }

  set hass(hass) {
    this._hass = hass;
    this._updateSummary();
    this._updateDiagnostics();
  }

  setConfig(config) {
    this._config = { ...(config || {}) };
    this._render();
  }

  _v(key, fallback = "") { return this._config[key] ?? fallback; }
  _source() { return this._v("source", this._config.entity ? "entity" : (this._config.clock || this._config.clock_format ? "clock" : "text")); }
  _segmentsMode() { return this._v("segments_mode", "auto"); }

  _set(key, value, render = true) {
    const next = { ...this._config, [key]: value };

    if (value === "" && !["text", "entity", "attribute", "font_family", "font_stylesheet", "clock_format"].includes(key)) {
      delete next[key];
    }

    if (key === "source") {
      if (value === "text") {
        delete next.entity;
        delete next.attribute;
      }
      if (value === "entity") delete next.text;
      if (value === "clock") {
        delete next.text;
        delete next.entity;
        delete next.attribute;
        if (!next.segments_mode) next.segments_mode = "auto";
      }
    }

    if (key === "segments_mode" && value === "auto") delete next.segments;

    this._config = next;
    this._fire();

    if (render) this._render();
    else {
      this._updateSummary();
      this._updateDiagnostics();
    }
  }

  _setDraft(key, value) {
    this._config = { ...this._config, [key]: value };
    this._updateSummary();
    this._updateDiagnostics();
  }

  _numDraft(key, value) {
    const next = { ...this._config };
    if (value === "") delete next[key];
    else {
      const n = Number(value);
      if (Number.isFinite(n)) next[key] = n;
      else next[key] = value;
    }
    this._config = next;
    this._updateSummary();
    this._updateDiagnostics();
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
    else {
      this._updateSummary();
      this._updateDiagnostics();
    }
  }

  _fire() {
    this.dispatchEvent(new CustomEvent("config-changed", {
      bubbles: true,
      composed: true,
      detail: { config: this._config }
    }));
  }

  _render() {
    const source = this._source();
    const theme = this._v("theme", "mechanical_gold");
    const preset = this._v("font_preset", "theme_default");
    const segmentsMode = this._segmentsMode();

    this.shadowRoot.innerHTML = `${this._styles()}
      <div class="editor">
        <div class="hero">
          <div class="hero-title">
            <strong>Split-Flap Card</strong>
            <span>${SPLIT_FLAP_CARD_VERSION}</span>
          </div>
          <div class="hint">Beta 12 stability branch. Text fields commit after leaving the field to prevent mobile focus loss.</div>
        </div>

        <section class="section">
          <div class="section-title">Content</div>
          <div class="body">
            <div class="grid">
              ${this._select("source", "Source", source, { text: "Text", entity: "Entity / Sensor", clock: "Clock" })}
              ${this._select("segments_mode", "Segments mode", segmentsMode, { auto: "Auto — follows output length", manual: "Manual — fixed segment count" })}
            </div>
            ${segmentsMode === "manual" ? this._number("segments", "Segments", this._v("segments", 16), 1, 160, "Default: 16") : this._info("Auto segments", `Current output length: ${this._effectivePreviewLength()}`)}
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
            <div class="grid">
              ${this._select("text_transform", "Text transform", this._v("text_transform", "uppercase"), { uppercase: "Uppercase", lowercase: "Lowercase", none: "None" })}
              ${this._number("font_size", "Font size", this._v("font_size", ""), 6, 220, "Default: 60")}
            </div>
            ${this._select("font_preset", "Font preset", preset, Object.fromEntries(Object.entries(SFC_FONT_PRESETS).map(([key, value]) => [key, value.label])))}
            <div class="compact-hint" data-preset-description>${this._presetDescription(preset)}</div>
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

        <section class="section summary-section">
          <div class="section-title">Preview status</div>
          <div class="body">
            <div class="compact-hint" data-preview-summary>${this._previewSummary()}</div>
          </div>
        </section>

        <section class="section support-section">
          <div class="section-title">Support</div>
          <div class="body">
            <div class="diagnostics" data-diagnostics>${this._diagnosticsHtml()}</div>
            <div class="links">
              <button type="button" data-url="${SFC_REPO_URL}/blob/main/docs/UI_EDITOR_MANUAL.md">Manual</button>
              <button type="button" data-url="${SFC_REPO_URL}/blob/main/SUPPORT.md">Support docs</button>
              <button type="button" data-report>Report issue</button>
            </div>
          </div>
        </section>
      </div>
      ${this._supportOpen ? this._reportModal() : ""}`;

    this._bind();
    this._updateSummary();
    this._updateDiagnostics();
  }

  _bind() {
    this.shadowRoot.querySelectorAll("select[data-k]").forEach((element) => {
      element.onchange = () => this._set(element.dataset.k, element.value, true);
    });

    this.shadowRoot.querySelectorAll("input[data-k]").forEach((element) => {
      element.oninput = () => this._setDraft(element.dataset.k, element.value);
      element.onchange = () => this._set(element.dataset.k, element.value, false);
      element.onblur = () => this._set(element.dataset.k, element.value, false);
    });

    this.shadowRoot.querySelectorAll("input[data-n]").forEach((element) => {
      element.oninput = () => this._numDraft(element.dataset.n, element.value);
      element.onchange = () => this._num(element.dataset.n, element.value, false);
      element.onblur = () => this._num(element.dataset.n, element.value, false);
    });

    this.shadowRoot.querySelectorAll("input[data-b]").forEach((element) => {
      element.onchange = () => this._set(element.dataset.b, element.checked, false);
    });

    this.shadowRoot.querySelectorAll("[data-url]").forEach((element) => {
      element.onclick = () => this._openUrl(element.dataset.url);
    });

    this.shadowRoot.querySelector("[data-report]")?.addEventListener("click", () => {
      this._supportOpen = true;
      this._render();
    });

    this.shadowRoot.querySelector("[data-close-report]")?.addEventListener("click", () => {
      this._supportOpen = false;
      this._render();
    });

    this.shadowRoot.querySelector("[data-clear-issue]")?.addEventListener("click", () => {
      this._issueFields = { description: "", expected: "", actual: "", console_errors: "" };
      this._render();
    });

    this.shadowRoot.querySelector("[data-copy-issue]")?.addEventListener("click", async () => {
      const text = this._issueText();
      const button = this.shadowRoot.querySelector("[data-copy-issue]");
      try {
        await navigator.clipboard?.writeText(text);
        if (button) button.textContent = "Copied";
      } catch (error) {
        const output = this.shadowRoot.querySelector("[data-issue-output]");
        if (output) output.value = text;
        if (button) button.textContent = "Select and copy";
      }
    });

    this.shadowRoot.querySelector("[data-open-issue]")?.addEventListener("click", () => {
      const body = encodeURIComponent(this._issueText());
      const title = encodeURIComponent(`Split-Flap Card issue: ${this._source()} editor/report`);
      this._openUrl(`${SFC_ISSUE_URL}?title=${title}&body=${body}`);
    });

    this.shadowRoot.querySelectorAll("[data-issue-field]").forEach((element) => {
      element.oninput = () => {
        this._issueFields[element.dataset.issueField] = element.value;
        const output = this.shadowRoot.querySelector("[data-issue-output]");
        if (output) output.value = this._issueText();
      };
    });

    const details = this.shadowRoot.querySelector("details");
    if (details) details.ontoggle = () => { this._advanced = details.open; };
  }

  _updateSummary() {
    const summary = this.shadowRoot?.querySelector("[data-preview-summary]");
    if (summary) summary.textContent = this._previewSummary();

    const presetDescription = this.shadowRoot?.querySelector("[data-preset-description]");
    if (presetDescription) presetDescription.textContent = this._presetDescription(this._v("font_preset", "theme_default"));
  }

  _updateDiagnostics() {
    const diagnostics = this.shadowRoot?.querySelector("[data-diagnostics]");
    if (diagnostics) diagnostics.innerHTML = this._diagnosticsHtml();

    const output = this.shadowRoot?.querySelector("[data-issue-output]");
    if (output) output.value = this._issueText();
  }

  _previewSummary() {
    const mode = this._segmentsMode();
    const segments = mode === "auto" ? `auto (${this._effectivePreviewLength()})` : String(this._v("segments", 16));
    return `Source: ${this._source()} · Segments: ${segments} · Native Home Assistant preview updates after the edited field is committed.`;
  }

  _presetDescription(presetKey) {
    const preset = SFC_FONT_PRESETS[presetKey] || SFC_FONT_PRESETS.theme_default;
    return preset.description;
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
    return String(format || "HH:mm")
      .replaceAll("HH", values.HH)
      .replaceAll("hh", values.hh)
      .replaceAll("H", values.H)
      .replaceAll("h", values.h)
      .replaceAll("mm", values.mm)
      .replaceAll("ss", values.ss)
      .replaceAll("A", values.A);
  }

  _diagnostics() {
    const themeKey = this._v("theme", "mechanical_gold");
    const cardTheme = SFC_THEMES[themeKey] || SFC_THEMES.mechanical_gold;
    const resource = this._resourceUrl();
    const haTheme = this._hass?.themes?.theme || this._hass?.selectedTheme || "unknown";
    const isDark = this._hass?.themes?.darkMode ?? document.documentElement.classList.contains("dark") ?? null;

    return {
      card_version: SPLIT_FLAP_CARD_VERSION,
      card_type: "custom:split-flap-card",
      source: this._source(),
      segments_mode: this._segmentsMode(),
      segments: this._segmentsMode() === "auto" ? `auto (${this._effectivePreviewLength()})` : String(this._v("segments", 16)),
      card_theme_key: themeKey,
      card_theme_label: cardTheme.label,
      ha_theme: String(haTheme || "unknown"),
      color_mode: isDark === true ? "dark" : isDark === false ? "light" : "unknown mode",
      ha_version: this._hass?.config?.version || "unknown",
      resource_url: resource,
      browser: navigator.userAgent || "unknown"
    };
  }

  _diagnosticsHtml() {
    const d = this._diagnostics();
    return `<div class="diag-grid">
      <span>Card</span><b>${this._e(d.card_version)}</b>
      <span>Source</span><b>${this._e(d.source)}</b>
      <span>Segments</span><b>${this._e(d.segments)}</b>
      <span>Card theme</span><b>${this._e(d.card_theme_label)}</b>
      <span>HA theme</span><b>${this._e(d.ha_theme)} · ${this._e(d.color_mode)}</b>
    </div>`;
  }

  _resourceUrl() {
    try {
      const scripts = Array.from(document.querySelectorAll("script[src]")).map((script) => script.src);
      return scripts.find((src) => src.includes("ha-split-flap-card.js")) || "unknown";
    } catch (error) {
      return "unknown";
    }
  }

  _issueText() {
    const d = this._diagnostics();
    const yaml = this._safeYaml();

    return `## Description

${this._issueFields.description || "_Describe the issue here._"}

## Expected behavior

${this._issueFields.expected || "_What did you expect to happen?_"}

## Actual behavior

${this._issueFields.actual || "_What actually happened?_"}

## Browser console errors

${this._issueFields.console_errors || "_Paste console errors here, if any._"}

## Diagnostics

- Card version: ${d.card_version}
- Card type: ${d.card_type}
- Source: ${d.source}
- Segments mode: ${d.segments_mode}
- Segments: ${d.segments}
- Card theme: ${d.card_theme_label} (${d.card_theme_key})
- Home Assistant theme: ${d.ha_theme}
- Color mode: ${d.color_mode}
- Home Assistant version: ${d.ha_version}
- Resource URL: ${d.resource_url}
- Browser: ${d.browser}

## Card YAML

\`\`\`yaml
${yaml}
\`\`\`
`;
  }

  _safeYaml() {
    const lines = ["type: custom:split-flap-card"];
    Object.entries(this._config || {}).forEach(([key, value]) => {
      if (value === undefined || value === null || value === "") return;
      if (typeof value === "object") return;
      lines.push(`${key}: ${JSON.stringify(value)}`);
    });
    return lines.join("\n");
  }

  _reportModal() {
    const issueText = this._issueText();
    return `<div class="modal-backdrop">
      <div class="modal" role="dialog" aria-modal="true" aria-label="Report issue">
        <div class="modal-head">
          <div>
            <h2>Report issue</h2>
            <p>Diagnostics are generated locally. Review the text before opening GitHub.</p>
          </div>
          <button type="button" class="icon-button" data-close-report>Close</button>
        </div>
        <div class="modal-grid">
          ${this._textarea("description", "Description", this._issueFields.description, "Describe the issue.")}
          ${this._textarea("expected", "Expected behavior", this._issueFields.expected, "What did you expect to happen?")}
          ${this._textarea("actual", "Actual behavior", this._issueFields.actual, "What actually happened?")}
          ${this._textarea("console_errors", "Browser console errors", this._issueFields.console_errors, "Paste console errors here, if any.")}
        </div>
        <label class="issue-output-label">Generated issue text</label>
        <textarea class="issue-output" data-issue-output readonly>${this._e(issueText)}</textarea>
        <div class="modal-actions">
          <button type="button" data-copy-issue>Copy issue text</button>
          <button type="button" data-clear-issue>Clear form</button>
          <button type="button" data-open-issue>Send to GitHub</button>
        </div>
      </div>
    </div>`;
  }

  _textarea(key, label, value, placeholder) {
    return `<label class="field"><span>${this._e(label)}</span><textarea data-issue-field="${this._e(key)}" placeholder="${this._e(placeholder)}">${this._e(value)}</textarea></label>`;
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

  _openUrl(url) {
    const win = window.open(url, "_blank", "noopener,noreferrer");
    if (!win) location.href = url;
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
      input,select,textarea{box-sizing:border-box;width:100%;min-height:42px;border:1px solid rgba(255,255,255,.12);border-radius:10px;padding:9px 11px;background:rgba(0,0,0,.35);color:var(--primary-text-color,#fff);font:inherit;outline:none}
      textarea{min-height:84px;resize:vertical;line-height:1.4}
      input:focus,select:focus,textarea:focus{border-color:#f7d53b;box-shadow:0 0 0 1px rgba(247,213,59,.25)}
      .checks{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}
      .check{display:flex;align-items:center;gap:10px;min-height:42px;padding:10px;border-radius:12px;border:1px solid rgba(255,255,255,.10);background:rgba(0,0,0,.22);color:var(--primary-text-color)}
      .check input{width:auto;min-height:auto;accent-color:#f7d53b}
      summary{cursor:pointer;padding:12px 14px;font-weight:800;letter-spacing:.02em}
      .links,.modal-actions{display:flex;flex-wrap:wrap;gap:8px}
      .links button,.modal-actions button,.icon-button{color:#f7d53b;background:transparent;border:1px solid rgba(247,213,59,.35);border-radius:999px;padding:7px 10px;font-size:12px;cursor:pointer}
      .compact-hint{border:1px solid rgba(255,255,255,.10);border-radius:10px;padding:8px 10px;background:rgba(0,0,0,.14);font-size:12px;color:var(--secondary-text-color);line-height:1.35}
      .info{display:grid;gap:3px;border:1px solid rgba(255,255,255,.10);border-radius:12px;padding:10px;background:rgba(0,0,0,.18)}
      .info b{font-size:12px;color:var(--primary-text-color)}
      .info span{font-size:12px;color:var(--secondary-text-color);line-height:1.35}
      .diag-grid{display:grid;grid-template-columns:max-content 1fr;gap:5px 12px;border:1px solid rgba(255,255,255,.10);border-radius:12px;padding:10px;background:rgba(0,0,0,.18);font-size:12px}
      .diag-grid span{color:var(--secondary-text-color)}
      .diag-grid b{color:var(--primary-text-color)}
      .modal-backdrop{position:fixed;inset:0;z-index:9999;background:rgba(0,0,0,.68);padding:18px;overflow:auto}
      .modal{max-width:780px;margin:0 auto;background:var(--card-background-color,#111);border:1px solid rgba(255,255,255,.14);border-radius:22px;padding:18px;box-shadow:0 20px 60px rgba(0,0,0,.55)}
      .modal-head{display:flex;justify-content:space-between;gap:12px;align-items:flex-start}
      .modal-head h2{margin:0;color:var(--primary-text-color);font-size:20px}
      .modal-head p{margin:6px 0 0;color:var(--secondary-text-color);font-size:12px;line-height:1.4}
      .modal-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:14px}
      .field{display:grid;gap:6px}
      .field span,.issue-output-label{color:var(--secondary-text-color);font-size:12px;font-weight:700}
      .issue-output{min-height:220px;margin:12px 0;font-family:Roboto Mono,monospace;font-size:12px}
      @media(max-width:560px){.grid,.checks,.modal-grid{grid-template-columns:1fr}.hero,.section,details{border-radius:14px}.body{padding:12px}.modal-backdrop{padding:10px}.modal{border-radius:18px;padding:14px}.modal-head{display:grid}.links button,.modal-actions button,.icon-button{min-height:38px}}
    </style>`;
  }

  _e(value) {
    return String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
  }
}

if (!customElements.get("split-flap-card")) customElements.define("split-flap-card", HASplitFlapCard);
if (!customElements.get("split-flap-card-editor")) customElements.define("split-flap-card-editor", SplitFlapCardEditor);

window.customCards = window.customCards || [];
window.customCards.push({
  type: "split-flap-card",
  name: "Split-Flap Card",
  preview: true,
  description: `Beta release ${SPLIT_FLAP_CARD_VERSION}`,
  documentationURL: SFC_REPO_URL
});
