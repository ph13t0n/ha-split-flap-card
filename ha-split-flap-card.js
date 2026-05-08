const SPLIT_FLAP_CARD_VERSION = "0.1.0-beta.13-dev";
const SFC_REPO_URL = "https://github.com/ph13t0n/ha-split-flap-card";
const SFC_ISSUE_URL = `${SFC_REPO_URL}/issues/new`;

const SFC_THEMES = {
  mechanical_gold: { label: "Mechanical Gold", bg: "#101010", top: "#252525", bottom: "#080808", line: "#010101", border: "#313131", text: "#ffc02e", frame: "#050505", card: "#030303", font: "Roboto Condensed, Arial Narrow, sans-serif", weight: 900 },
  kiosk_gold: { label: "Kiosk Gold", bg: "#101010", top: "#252525", bottom: "#080808", line: "#010101", border: "#313131", text: "#ffc02e", frame: "#050505", card: "transparent", font: "Roboto Condensed, Arial Narrow, sans-serif", weight: 900 },
  classic_airport: { label: "Classic Airport", bg: "#1a2225", top: "#243136", bottom: "#0b1012", line: "#070909", border: "#334247", text: "#f7d53b", frame: "#071014", card: "#071014", font: "Barlow Condensed, Arial Narrow, sans-serif", weight: 900 },
  terminal_amber: { label: "Terminal Amber", bg: "#f7d53b", top: "#ffe56b", bottom: "#d6b724", line: "#856f10", border: "#a98d16", text: "#1a2225", frame: "#191305", card: "#050505", font: "Roboto Mono, monospace", weight: 900 },
  monochrome: { label: "Monochrome", bg: "#080808", top: "#151515", bottom: "#000000", line: "#000000", border: "#262626", text: "#ffffff", frame: "#050505", card: "transparent", font: "Roboto Mono, monospace", weight: 900 },
  home_assistant_blue: { label: "Home Assistant Blue", bg: "#0b1118", top: "#172430", bottom: "#05090d", line: "#020406", border: "#1d3444", text: "#03a9f4", frame: "#05090d", card: "#030303", font: "Roboto Condensed, Arial Narrow, sans-serif", weight: 900 },
  sweden_delight: { label: "Sweden Delight", bg: "#004d6b", top: "#08617f", bottom: "#00384f", line: "#002a3b", border: "#0d6f92", text: "#fecb00", frame: "#002a3b", card: "#030303", font: "Sweden Sans, Noto Sans, Arial, sans-serif", weight: 900 }
};

const SFC_FONT_PRESETS = {
  theme_default: { label: "Theme default", family: null, weight: null },
  mechanical: { label: "Mechanical", family: "Roboto Condensed, Arial Narrow, sans-serif", weight: 900 },
  transit: { label: "Transit", family: "Barlow Condensed, Arial Narrow, sans-serif", weight: 900 },
  clean: { label: "Clean", family: "Inter, system-ui, sans-serif", weight: 800 },
  mono: { label: "Mono", family: "Roboto Mono, monospace", weight: 800 },
  custom: { label: "Custom", family: "system-ui, sans-serif", weight: 800 }
};

const SFC_STYLE_PRESETS = {
  default: { label: "Standard", description: "Default split-flap look.", display_frame: false, segment_depth: "raised" },
  minimal: { label: "Minimal", description: "Only the segments, no visible outer frame.", card_background: "transparent", frame_background: "transparent", display_frame: false, segment_depth: "flat" },
  mechanical: { label: "Mechanical", description: "Mechanical frame with classic raised flaps.", display_frame: true, display_frame_screws: true, segment_depth: "raised" },
  mechanical_recessed: { label: "Mechanical inset", description: "Mechanical frame with inset flaps.", card_background: "transparent", display_frame: true, display_frame_screws: true, segment_depth: "recessed" },
  kiosk: { label: "Kiosk", description: "Clean high-contrast kiosk look.", card_background: "transparent", display_frame: false, segment_depth: "flat" }
};

const SFC_DEFAULTS = {
  source: "text", text: "", entity: "", attribute: "", segments_mode: "auto", segments: 16,
  theme: "mechanical_gold", style_preset: "default", font_preset: "theme_default", font_size: 60,
  font_style: "normal", font_weight: undefined, letter_spacing: -1, letter_vertical_offset: -9,
  text_transform: "uppercase", text_glow: "off", align: "center", language: "sv", charset: "sv",
  pad_character: " ", pad_mode: "end", clock_format: "HH:mm", clock_tick_interval: 1000,
  animation: true, initial_animation: true, cycle_chars: true, cycle_steps: 8, animation_speed: "normal",
  segment_width: 48, segment_height: 78, segment_gap: 6, segment_radius: 7,
  card_background: "#030303", frame_background: "#050505", display_frame: false,
  display_frame_screws: false, display_frame_padding: 8, display_frame_radius: 12, segment_depth: "raised"
};

const SFC_LOOK_KEYS = ["theme", "style_preset", "display_frame", "display_frame_screws", "display_frame_padding", "display_frame_radius", "segment_depth", "font_preset", "font_family", "font_size", "font_weight", "font_style", "letter_spacing", "letter_vertical_offset", "segment_width", "segment_height", "segment_gap", "segment_radius", "card_background", "frame_background", "segment_background", "segment_background_top", "segment_background_bottom", "segment_border_color", "segment_separator_color", "text_color", "animation", "initial_animation", "cycle_chars", "cycle_steps", "animation_speed", "text_glow", "align", "text_transform"];

function sfcEl(tag, className, text) {
  const el = document.createElement(tag);
  if (className) el.className = className;
  if (text !== undefined && text !== null) el.textContent = String(text);
  return el;
}

class HASplitFlapCard extends HTMLElement {
  static getStubConfig() { return { source: "text", text: "SPLIT-FLAP TEST", segments_mode: "auto", theme: "mechanical_gold", style_preset: "mechanical_recessed" }; }
  static getConfigElement() { return document.createElement("split-flap-card-editor"); }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._config = {};
    this._hass = null;
    this._timer = null;
    this._lastDisplayText = null;
  }

  setConfig(config) {
    if (!config || typeof config !== "object") throw new Error("Invalid configuration.");
    const source = this._inferSource(config);
    const theme = SFC_THEMES[config.theme] || SFC_THEMES.mechanical_gold;
    const fontPreset = SFC_FONT_PRESETS[config.font_preset || "theme_default"] || SFC_FONT_PRESETS.theme_default;
    const stylePreset = SFC_STYLE_PRESETS[config.style_preset || "default"] || SFC_STYLE_PRESETS.default;

    this._config = {
      ...SFC_DEFAULTS,
      card_background: theme.card || SFC_DEFAULTS.card_background,
      frame_background: theme.frame || SFC_DEFAULTS.frame_background,
      segment_background: theme.bg,
      segment_background_top: theme.top,
      segment_background_bottom: theme.bottom,
      segment_separator_color: theme.line,
      segment_border_color: theme.border,
      text_color: theme.text,
      font_family: fontPreset.family || theme.font,
      font_weight: fontPreset.weight || theme.weight,
      ...stylePreset,
      ...config,
      source,
      segments_mode: config.segments_mode || "auto"
    };

    if (this._config.font_preset === "theme_default" && !config.font_family) {
      this._config.font_family = theme.font;
      this._config.font_weight = theme.weight;
    }

    this._restartClock();
    this._render();
  }

  set hass(hass) { this._hass = hass; if (this._config.source === "entity") this._render(); }
  disconnectedCallback() { if (this._timer) clearInterval(this._timer); }
  getCardSize() { return 2; }

  _inferSource(config) { return config.source || (config.entity ? "entity" : (config.clock || config.clock_format ? "clock" : "text")); }
  _restartClock() { if (this._timer) clearInterval(this._timer); this._timer = null; if (this._config.source === "clock") this._timer = setInterval(() => this._render(), this._num(this._config.clock_tick_interval, 1000, 250, 60000)); }

  _raw() {
    const c = this._config;
    if (c.source === "clock") return this._clock(c.clock_format);
    if (c.source === "entity") {
      const state = c.entity ? this._hass?.states?.[c.entity] : null;
      if (!c.entity) return "";
      if (!state) return "ENTITY NOT FOUND";
      return c.attribute ? String(state.attributes?.[c.attribute] ?? "") : String(state.state);
    }
    return String(c.text ?? "");
  }

  _clock(format) {
    const now = new Date();
    const hours = now.getHours();
    const hours12 = hours % 12 || 12;
    const values = { HH: String(hours).padStart(2, "0"), H: String(hours), hh: String(hours12).padStart(2, "0"), h: String(hours12), mm: String(now.getMinutes()).padStart(2, "0"), ss: String(now.getSeconds()).padStart(2, "0"), A: hours >= 12 ? "PM" : "AM" };
    return String(format || "HH:mm").replaceAll("HH", values.HH).replaceAll("hh", values.hh).replaceAll("H", values.H).replaceAll("h", values.h).replaceAll("mm", values.mm).replaceAll("ss", values.ss).replaceAll("A", values.A);
  }

  _displayText() {
    let text = this._raw();
    if (this._config.text_transform === "uppercase") text = text.toLocaleUpperCase("sv-SE");
    if (this._config.text_transform === "lowercase") text = text.toLocaleLowerCase("sv-SE");
    const chars = Array.from(text);
    const count = this._config.segments_mode === "auto" ? Math.max(chars.length, 1) : this._num(this._config.segments, Math.max(chars.length, 1), 1, 160);
    const cut = chars.slice(0, count).join("");
    const pad = this._first(this._config.pad_character, " ");
    return this._config.pad_mode === "start" ? cut.padStart(count, pad) : cut.padEnd(count, pad);
  }

  _render() {
    const displayText = this._displayText();
    const previous = this._lastDisplayText;
    this._lastDisplayText = displayText;

    const style = sfcEl("style");
    style.textContent = this._styles();
    const card = sfcEl("ha-card");
    const shell = sfcEl("div", `display-shell ${this._config.display_frame ? "has-frame" : "no-frame"}`);
    shell.dataset.depth = this._depth(this._config.segment_depth);
    shell.dataset.screws = this._config.display_frame_screws ? "true" : "false";

    const display = sfcEl("div", "display");
    display.style.justifyContent = this._align(this._config.align);

    Array.from(displayText).forEach((ch, index) => {
      const previousChar = previous ? Array.from(previous)[index] : undefined;
      const changed = this._config.animation !== false && ((previous == null && this._config.initial_animation !== false && ch !== " ") || (previous != null && previousChar !== ch));
      display.append(this._tile(ch, changed));
    });

    shell.append(display);
    card.append(shell);
    this.shadowRoot.replaceChildren(style, card);
  }

  _tile(ch, changed = false) {
    const tile = sfcEl("div", ["tile", ch === " " ? "space" : "", changed ? "flip" : ""].filter(Boolean).join(" "));
    const top = sfcEl("div", "flap top");
    top.append(sfcEl("span", null, ch));
    const bottom = sfcEl("div", "flap bottom");
    bottom.append(sfcEl("span", null, ch));
    tile.append(top, bottom, sfcEl("div", "hinge"), sfcEl("div", "pin left"), sfcEl("div", "pin right"));
    return tile;
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
    const padding = this._num(c.display_frame_padding, Math.max(8, Math.round(gap * 2)), 0, 60);
    const frameRadius = this._num(c.display_frame_radius, Math.max(radius + 8, 12), 0, 60);
    const speed = this._animationSpeed(c.animation_speed);
    const glow = c.text_glow && c.text_glow !== "off" ? `text-shadow:0 0 8px ${this._css(c.text_color, "#ffc02e")};` : "";
    const cardPadding = this._css(c.card_background, "#030303") === "transparent" ? 0 : 16;

    return `:host{display:block}ha-card{overflow:visible;border-radius:16px;background:${this._css(c.card_background, "#030303")};padding:${cardPadding}px}.display-shell{box-sizing:border-box;width:100%;border-radius:${frameRadius}px;background:${this._css(c.frame_background, "#050505")};padding:${padding}px;position:relative}.display-shell.no-frame{background:transparent;border:none;box-shadow:none;padding:0}.display-shell.has-frame{border:1px solid rgba(255,255,255,.10);box-shadow:inset 0 1px 0 rgba(255,255,255,.12),inset 0 -2px 4px rgba(0,0,0,.92),0 10px 24px rgba(0,0,0,.38)}.display-shell.has-frame::after{content:"";position:absolute;inset:${Math.max(5, Math.round(padding*.55))}px;border-radius:${Math.max(0, frameRadius-4)}px;border:1px solid rgba(0,0,0,.86);box-shadow:inset 0 2px 5px rgba(0,0,0,.95),inset 0 -1px 0 rgba(255,255,255,.06);pointer-events:none}.display-shell.has-frame[data-screws="true"]::before{content:"";position:absolute;inset:7px;border-radius:${Math.max(0, frameRadius-2)}px;background:radial-gradient(circle at 8px 8px,#333 0 3px,#050505 4px,transparent 6px),radial-gradient(circle at calc(100% - 8px) 8px,#333 0 3px,#050505 4px,transparent 6px),radial-gradient(circle at 8px calc(100% - 8px),#333 0 3px,#050505 4px,transparent 6px),radial-gradient(circle at calc(100% - 8px) calc(100% - 8px),#333 0 3px,#050505 4px,transparent 6px);pointer-events:none;z-index:3}.display{display:flex;align-items:center;gap:${gap}px;min-width:0;overflow:hidden;perspective:900px;position:relative;z-index:2}.tile{position:relative;flex:0 0 ${width}px;width:${width}px;height:${height}px;border-radius:${radius}px;overflow:hidden;background:${this._css(c.segment_background,"#101010")};border:1px solid ${this._css(c.segment_border_color,"#313131")};transform-style:preserve-3d}.display-shell[data-depth="raised"] .tile{box-shadow:inset 0 1px 0 rgba(255,255,255,.07),inset 0 -12px 18px rgba(0,0,0,.38),0 4px 10px rgba(0,0,0,.6)}.display-shell[data-depth="flat"] .tile{box-shadow:inset 0 1px 0 rgba(255,255,255,.05),inset 0 -8px 12px rgba(0,0,0,.45)}.display-shell[data-depth="recessed"] .tile{box-shadow:inset 0 2px 4px rgba(255,255,255,.035),inset 0 -10px 16px rgba(0,0,0,.78),inset 0 0 0 1px rgba(255,255,255,.035)}.space{opacity:.82}.flap{position:absolute;left:0;right:0;height:50%;overflow:hidden;display:flex;justify-content:center;color:${this._css(c.text_color,"#ffc02e")};font-family:${this._font(c.font_family)};font-size:${fontSize}px;font-weight:${this._weight(c.font_weight)};font-style:${c.font_style === "italic" ? "italic" : "normal"};letter-spacing:${letterSpacing}px;line-height:1;backface-visibility:hidden;transform-style:preserve-3d;${glow}}.top{top:0;align-items:flex-end;transform-origin:bottom center;background:linear-gradient(180deg,${this._css(c.segment_background_top,"#252525")},${this._css(c.segment_background,"#101010")})}.bottom{bottom:0;align-items:flex-start;transform-origin:top center;background:linear-gradient(180deg,${this._css(c.segment_background,"#101010")},${this._css(c.segment_background_bottom,"#080808")})}.top span{transform:translateY(calc(50% + ${verticalOffset}px))}.bottom span{transform:translateY(calc(-50% + ${verticalOffset}px))}.hinge{position:absolute;left:0;right:0;top:calc(50% - 1px);height:2px;background:${this._css(c.segment_separator_color,"#010101")};z-index:8}.pin{position:absolute;z-index:9;top:calc(50% - 2px);width:4px;height:4px;border-radius:50%;background:rgba(255,255,255,.17)}.left{left:4px}.right{right:4px}.tile.flip .top{animation:sfcFlipTop ${speed.top}s cubic-bezier(.38,.02,.22,1)}.tile.flip .bottom{animation:sfcFlipBottom ${speed.bottom}s cubic-bezier(.38,.02,.22,1) ${speed.delay}s both}.tile.flip .hinge{animation:sfcHingePulse ${speed.hinge}s ease-out}@keyframes sfcFlipTop{0%{transform:rotateX(0deg);filter:brightness(1.08)}55%{transform:rotateX(-74deg);filter:brightness(.84)}100%{transform:rotateX(0deg);filter:brightness(1)}}@keyframes sfcFlipBottom{0%{transform:rotateX(54deg);filter:brightness(.82)}100%{transform:rotateX(0deg);filter:brightness(1)}}@keyframes sfcHingePulse{0%,100%{opacity:1}50%{opacity:.70}}`;
  }

  _animationSpeed(value) { if (value === "slow") return { top:.48,bottom:.48,delay:.12,hinge:.56 }; if (value === "fast") return { top:.20,bottom:.20,delay:.04,hinge:.24 }; return { top:.30,bottom:.30,delay:.07,hinge:.36 }; }
  _align(value) { return value === "left" ? "flex-start" : value === "right" ? "flex-end" : "center"; }
  _depth(value) { return ["raised","flat","recessed"].includes(value) ? value : "raised"; }
  _num(value, fallback, min, max) { const n = Number(value); return Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : fallback; }
  _first(value, fallback) { const chars = Array.from(String(value ?? "")); return chars.length ? chars[0] : fallback; }
  _css(value, fallback) { return String(value || fallback).replace(/[;{}<>]/g, ""); }
  _font(value) { return String(value || "Roboto Mono,monospace").replace(/[;{}<>]/g, ""); }
  _weight(value) { return /^[0-9a-zA-Z\s-]+$/.test(String(value || "800")) ? String(value || "800") : "800"; }
}

class SplitFlapCardEditor extends HTMLElement {
  constructor(){ super(); this.attachShadow({mode:"open"}); this._config={}; this._hass=null; }
  set hass(hass){ this._hass=hass; }
  setConfig(config){ this._config={...(config||{})}; this._render(); }
  _v(key,fallback=""){ return this._config[key] ?? fallback; }
  _source(){ return this._v("source", this._config.entity ? "entity" : (this._config.clock || this._config.clock_format ? "clock" : "text")); }
  _segmentsMode(){ return this._v("segments_mode","auto"); }
  _set(key,value){ const next={...this._config,[key]:value}; if(value==="" && !["text","entity","attribute","font_family","clock_format"].includes(key)) delete next[key]; if(key==="source"){ if(value==="text"){ delete next.entity; delete next.attribute; } if(value==="entity") delete next.text; if(value==="clock"){ delete next.text; delete next.entity; delete next.attribute; }} if(key==="segments_mode" && value==="auto") delete next.segments; this._config=next; this._fire(); this._render(); }
  _num(key,value){ const next={...this._config}; if(value==="") delete next[key]; else { const n=Number(value); if(Number.isFinite(n)) next[key]=n; } this._config=next; this._fire(); }
  _bool(key,value){ this._config={...this._config,[key]:Boolean(value)}; this._fire(); }
  _fire(){ this.dispatchEvent(new CustomEvent("config-changed",{bubbles:true,composed:true,detail:{config:this._config}})); }

  _render(){ const style=sfcEl("style"); style.textContent=this._styles(); const root=sfcEl("div","editor"); root.append(this._hero(),this._section("Content",this._contentFields()),this._section("Appearance",this._appearanceFields()),this._section("Size & spacing",this._sizeFields()),this._section("Motion",this._motionFields()),this._details("Advanced colors",this._colorFields()),this._section("Support",this._supportFields())); this.shadowRoot.replaceChildren(style,root); }
  _hero(){ const box=sfcEl("div","hero"); const title=sfcEl("div","hero-title"); title.append(sfcEl("strong",null,"Split-Flap Card"),sfcEl("span",null,SPLIT_FLAP_CARD_VERSION)); box.append(title,sfcEl("div","hint","Beta 13 development branch. Dynamic text is rendered with textContent to avoid DOM text being interpreted as HTML.")); return box; }
  _section(title,children){ const section=sfcEl("section","section"); section.append(sfcEl("div","section-title",title)); const body=sfcEl("div","body"); children.forEach(child=>child&&body.append(child)); section.append(body); return section; }
  _details(title,children){ const details=sfcEl("details"); details.append(sfcEl("summary",null,title)); const body=sfcEl("div","body"); children.forEach(child=>child&&body.append(child)); details.append(body); return details; }

  _contentFields(){ const source=this._source(); const mode=this._segmentsMode(); const fields=[this._grid([this._select("source","Source",source,{text:"Text",entity:"Entity / Sensor",clock:"Clock"}),this._select("segments_mode","Segments mode",mode,{auto:"Auto — follows output length",manual:"Manual — fixed segment count"})]),mode==="manual"?this._number("segments","Segments",this._v("segments",16),1,160,"Default: 16"):this._info("Auto segments",`Current output length: ${this._effectivePreviewLength()}`)]; if(source==="text") fields.push(this._input("text","Text",this._v("text",""),"Text to show")); if(source==="entity") fields.push(this._input("entity","Entity",this._v("entity",""),"sensor.example"),this._input("attribute","Attribute",this._v("attribute",""),"Optional attribute")); if(source==="clock") fields.push(this._grid([this._input("clock_format","Clock format",this._v("clock_format","HH:mm"),"HH:mm"),this._number("clock_tick_interval","Clock tick interval",this._v("clock_tick_interval",1000),250,60000,"Default: 1000")])); fields.push(this._grid([this._select("charset","Charset",this._v("charset","sv"),{en:"English",sv:"Swedish",nordic:"Nordic",western:"Western",weather:"Weather",weather_sv:"Weather Swedish",extended:"Extended",custom:"Custom"}),this._select("text_transform","Text transform",this._v("text_transform","uppercase"),{uppercase:"Uppercase",lowercase:"Lowercase",none:"None"})])); return fields; }
  _appearanceFields(){ return [this._grid([this._select("theme","Theme",this._v("theme","mechanical_gold"),Object.fromEntries(Object.entries(SFC_THEMES).map(([k,v])=>[k,v.label]))),this._select("style_preset","Display look",this._v("style_preset","default"),Object.fromEntries(Object.entries(SFC_STYLE_PRESETS).map(([k,v])=>[k,v.label])))]),this._info("Display look",this._presetDescription(this._v("style_preset","default"))),this._grid([this._check("display_frame","Frame around segments",this._v("display_frame",false)),this._check("display_frame_screws","Decorative screws",this._v("display_frame_screws",false))]),this._grid([this._select("segment_depth","Segment surface",this._v("segment_depth","raised"),{raised:"Raised",flat:"Flat",recessed:"Inset"}),this._select("font_preset","Font style",this._v("font_preset","theme_default"),Object.fromEntries(Object.entries(SFC_FONT_PRESETS).map(([k,v])=>[k,v.label])))]),this._select("align","Alignment",this._v("align","center"),{left:"Left",center:"Center",right:"Right"}),this._savedLooks()]; }
  _sizeFields(){ return [this._grid([this._number("segment_width","Segment width",this._v("segment_width",""),8,180,"Default: 48"),this._number("segment_height","Segment height",this._v("segment_height",""),16,240,"Default: 78")]),this._grid([this._number("segment_gap","Gap between segments",this._v("segment_gap",""),0,80,"Default: 6"),this._number("segment_radius","Corner radius",this._v("segment_radius",""),0,40,"Default: 7")]),this._grid([this._number("font_size","Font size",this._v("font_size",""),6,220,"Default: 60"),this._input("font_weight","Font weight",this._v("font_weight",""),"Theme default")]),this._grid([this._number("letter_spacing","Letter spacing",this._v("letter_spacing",""),-20,40,"Default: -1"),this._number("letter_vertical_offset","Vertical text position",this._v("letter_vertical_offset",""),-80,80,"Default: -9")])]; }
  _motionFields(){ return [this._grid([this._check("animation","Animation",this._v("animation",true)),this._check("initial_animation","Initial animation",this._v("initial_animation",true))]),this._grid([this._check("cycle_chars","Roll to correct character",this._v("cycle_chars",true)),this._number("cycle_steps","Roll length",this._v("cycle_steps",8),1,40,"Default: 8")]),this._select("animation_speed","Animation speed",this._v("animation_speed","normal"),{slow:"Slow",normal:"Normal",fast:"Fast"})]; }
  _colorFields(){ return [this._grid([this._input("card_background","Card background",this._v("card_background",""),"Theme/default"),this._input("frame_background","Inner display background",this._v("frame_background",""),"Theme/default")]),this._grid([this._input("segment_background","Segment background",this._v("segment_background",""),"Theme/default"),this._input("text_color","Text color",this._v("text_color",""),"Theme/default")]),this._grid([this._input("segment_background_top","Top segment surface",this._v("segment_background_top",""),"Theme/default"),this._input("segment_background_bottom","Bottom segment surface",this._v("segment_background_bottom",""),"Theme/default")]),this._grid([this._input("segment_border_color","Segment border",this._v("segment_border_color",""),"Theme/default"),this._input("segment_separator_color","Center line",this._v("segment_separator_color",""),"Theme/default")]),this._input("font_family","Font family",this._v("font_family",""),"Theme or font preset")]; }
  _supportFields(){ return [this._info("Preview status",this._previewSummary()),this._info("Diagnostics",`Card ${SPLIT_FLAP_CARD_VERSION} · Source ${this._source()} · Segments ${this._segmentsMode()}`),this._buttonRow([["Manual",()=>this._openUrl(`${SFC_REPO_URL}/blob/main/docs/UI_EDITOR_MANUAL.md`)], ["Support docs",()=>this._openUrl(`${SFC_REPO_URL}/blob/main/SUPPORT.md`)], ["Report issue",()=>this._openUrl(`${SFC_ISSUE_URL}?title=${encodeURIComponent("Split-Flap Card issue")}&body=${encodeURIComponent(this._issueText())}`)]])]; }

  _savedLooks(){ const box=sfcEl("div","saved-looks"); box.append(sfcEl("div","sub-title","Saved looks")); const select=this._select("__saved_look","Apply saved look","",{"":"Choose saved look",...Object.fromEntries(this._loadLooks().map(look=>[look.name,look.name]))}); select.querySelector("select").addEventListener("change",event=>{const look=this._loadLooks().find(item=>item.name===event.target.value); if(look) this._applyLook(look.values);}); box.append(select,this._buttonRow([["Save current look",()=>this._saveCurrentLook()],["Copy look as YAML",()=>this._copyLookYaml()],["Import look",()=>this._importLookPrompt()]])); return box; }
  _loadLooks(){ try{const parsed=JSON.parse(localStorage.getItem("split-flap-card:saved-looks")||"[]"); return Array.isArray(parsed)?parsed.filter(item=>item&&item.name&&item.values):[];}catch(e){return [];} }
  _saveLooks(looks){ localStorage.setItem("split-flap-card:saved-looks",JSON.stringify(looks.slice(0,50))); }
  _currentLook(){ const values={}; SFC_LOOK_KEYS.forEach(key=>{if(this._config[key]!==undefined&&this._config[key]!==null&&this._config[key]!=="") values[key]=this._config[key];}); return values; }
  _saveCurrentLook(){ const name=prompt("Name this look","My split-flap look"); if(!name) return; const looks=this._loadLooks().filter(look=>look.name!==name); looks.unshift({name,values:this._currentLook(),created_at:new Date().toISOString()}); this._saveLooks(looks); this._render(); }
  async _copyLookYaml(){ const yaml=this._lookToYaml(this._currentLook()); try{await navigator.clipboard?.writeText(yaml);}catch(e){prompt("Copy look YAML",yaml);} }
  _importLookPrompt(){ const input=prompt("Paste look YAML or JSON"); if(!input) return; const parsed=this._parseLook(input); if(!Object.keys(parsed).length) return; const name=prompt("Name imported look","Imported split-flap look")||"Imported split-flap look"; const looks=this._loadLooks().filter(look=>look.name!==name); looks.unshift({name,values:parsed,created_at:new Date().toISOString()}); this._saveLooks(looks); this._render(); }
  _applyLook(values){ const safe=this._sanitizeLook(values); this._config={...this._config,...safe}; this._fire(); this._render(); }
  _sanitizeLook(values){ const safe={}; Object.entries(values||{}).forEach(([key,value])=>{ if(!SFC_LOOK_KEYS.includes(key)) return; if(typeof value==="object") return; safe[key]=value; }); return safe; }
  _lookToYaml(values){ return Object.entries(this._sanitizeLook(values)).map(([key,value])=>`${key}: ${JSON.stringify(value)}`).join("\n"); }
  _parseLook(input){ try{return this._sanitizeLook(JSON.parse(input));}catch(e){} const values={}; String(input).split(/\r?\n/).forEach(line=>{const match=line.match(/^([a-zA-Z0-9_]+):\s*(.*)$/); if(!match) return; const key=match[1]; if(!SFC_LOOK_KEYS.includes(key)) return; let value=match[2].trim(); try{value=JSON.parse(value);}catch(e){value=value.replace(/^["']|["']$/g,"");} values[key]=value;}); return this._sanitizeLook(values); }

  _grid(children){ const grid=sfcEl("div","grid"); children.forEach(child=>child&&grid.append(child)); return grid; }
  _select(key,label,value,options){ const row=sfcEl("label","row"); row.append(sfcEl("span",null,label)); const select=sfcEl("select"); Object.entries(options).forEach(([optionValue,optionLabel])=>{ const option=sfcEl("option",null,optionLabel); option.value=optionValue; option.selected=optionValue===value; select.append(option); }); if(!key.startsWith("__")) select.addEventListener("change",()=>this._set(key,select.value)); row.append(select); return row; }
  _input(key,label,value,placeholder=""){ const row=sfcEl("label","row"); row.append(sfcEl("span",null,label)); const input=sfcEl("input"); input.value=value??""; input.placeholder=placeholder; input.addEventListener("change",()=>this._set(key,input.value)); input.addEventListener("blur",()=>this._set(key,input.value)); row.append(input); return row; }
  _number(key,label,value,min,max,placeholder=""){ const row=sfcEl("label","row"); row.append(sfcEl("span",null,label)); const input=sfcEl("input"); input.type="number"; input.min=min; input.max=max; input.value=value??""; input.placeholder=placeholder; input.addEventListener("change",()=>this._num(key,input.value)); input.addEventListener("blur",()=>this._num(key,input.value)); row.append(input); return row; }
  _check(key,label,value){ const row=sfcEl("label","check"); const input=sfcEl("input"); input.type="checkbox"; input.checked=value===true; input.addEventListener("change",()=>this._bool(key,input.checked)); row.append(input,sfcEl("span",null,label)); return row; }
  _info(label,value){ const info=sfcEl("div","info"); info.append(sfcEl("b",null,label),sfcEl("span",null,value)); return info; }
  _buttonRow(buttons){ const row=sfcEl("div","button-row"); buttons.forEach(([label,handler])=>{ const button=sfcEl("button",null,label); button.type="button"; button.addEventListener("click",handler); row.append(button); }); return row; }
  _presetDescription(key){ return (SFC_STYLE_PRESETS[key]||SFC_STYLE_PRESETS.default).description; }
  _previewSummary(){ return `Source: ${this._source()} · Segments: ${this._segmentsMode()} · Dynamic text uses safe text rendering.`; }
  _effectivePreviewLength(){ return Math.max(1,Array.from(String(this._v("text",""))).length); }
  _openUrl(url){ const win=window.open(url,"_blank","noopener,noreferrer"); if(!win) location.href=url; }
  _issueText(){ return `Card version: ${SPLIT_FLAP_CARD_VERSION}\nSource: ${this._source()}\nYAML:\n${this._safeYaml()}`; }
  _safeYaml(){ const lines=["type: custom:split-flap-card"]; Object.entries(this._config||{}).forEach(([key,value])=>{ if(value===undefined||value===null||value==="") return; if(typeof value==="object") return; lines.push(`${key}: ${JSON.stringify(value)}`); }); return lines.join("\n"); }
  _styles(){ return `:host{display:block;color:var(--primary-text-color)}.editor{display:grid;gap:16px;padding:6px 2px 14px}.hero,.section,details{border:1px solid rgba(255,255,255,.10);border-radius:16px;background:rgba(255,255,255,.025);overflow:hidden}.hero{padding:14px;background:linear-gradient(145deg,rgba(4,18,22,.95),rgba(4,4,4,.98))}.hero-title,.section-title{display:flex;justify-content:space-between;gap:10px}.hero-title strong{font-size:15px;text-transform:uppercase;letter-spacing:.06em}.hero-title span,summary{color:#f7d53b}.hint{color:var(--secondary-text-color);font-size:12px;margin-top:6px;line-height:1.45}.section-title{padding:12px 14px;background:rgba(255,255,255,.035);font-weight:800;letter-spacing:.02em}.body{display:grid;gap:13px;padding:14px}.grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}.row{display:grid;gap:6px}.row span,label{color:var(--secondary-text-color);font-size:12px;font-weight:700}input,select{box-sizing:border-box;width:100%;min-height:42px;border:1px solid rgba(255,255,255,.12);border-radius:10px;padding:9px 11px;background:rgba(0,0,0,.35);color:var(--primary-text-color,#fff);font:inherit;outline:none}input:focus,select:focus{border-color:#f7d53b;box-shadow:0 0 0 1px rgba(247,213,59,.25)}.check{display:flex;align-items:center;gap:10px;min-height:42px;padding:10px;border-radius:12px;border:1px solid rgba(255,255,255,.10);background:rgba(0,0,0,.22);color:var(--primary-text-color)}.check input{width:auto;min-height:auto;accent-color:#f7d53b}.check span{color:var(--primary-text-color)}summary{cursor:pointer;padding:12px 14px;font-weight:800;letter-spacing:.02em}.button-row{display:flex;flex-wrap:wrap;gap:8px}.button-row button{color:#f7d53b;background:transparent;border:1px solid rgba(247,213,59,.35);border-radius:999px;padding:7px 10px;font-size:12px;cursor:pointer}.info{display:grid;gap:3px;border:1px solid rgba(255,255,255,.10);border-radius:12px;padding:10px;background:rgba(0,0,0,.18)}.info b{font-size:12px;color:var(--primary-text-color)}.info span{font-size:12px;color:var(--secondary-text-color);line-height:1.35}.saved-looks{display:grid;gap:10px;border:1px solid rgba(255,255,255,.10);border-radius:14px;padding:12px;background:rgba(0,0,0,.14)}.sub-title{font-size:12px;font-weight:900;color:var(--primary-text-color);text-transform:uppercase;letter-spacing:.06em}@media(max-width:560px){.grid{grid-template-columns:1fr}.hero,.section,details{border-radius:14px}.body{padding:12px}.button-row button{min-height:38px}}`; }
}

if (!customElements.get("split-flap-card")) customElements.define("split-flap-card", HASplitFlapCard);
if (!customElements.get("split-flap-card-editor")) customElements.define("split-flap-card-editor", SplitFlapCardEditor);

window.customCards = window.customCards || [];
window.customCards.push({ type: "split-flap-card", name: "Split-Flap Card", preview: true, description: `Beta release ${SPLIT_FLAP_CARD_VERSION}`, documentationURL: SFC_REPO_URL });
