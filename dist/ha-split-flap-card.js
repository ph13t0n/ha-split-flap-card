class HASplitFlapCard extends HTMLElement {
  static getStubConfig() {
    return {
      text: "NÄSSJÖ CENTRAL",
      language: "sv",
      theme: "kiosk_gold",
      max_chars: 14,
      animation: true,
      cycle_chars: true
    };
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
    this._runId = 0;
    this._hasRenderedOnce = false;
  }

  setConfig(config) {
    if (!config.text && !config.entity) {
      throw new Error("You need to define either text or entity.");
    }

    this._config = {
      language: "en",
      charset: undefined,
      locale: undefined,

      text_transform: "uppercase",
      fallback_character: " ",

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
      align: "center",

      animation: true,
      initial_animation: true,
      cycle_chars: true,
      cycle_count: 2,

      flip_duration: 520,
      flip_stagger: 45,

      ...config
    };

    this._syncText(true);
  }

  set hass(hass) {
    this._hass = hass;
    this._syncText(false);
  }

  disconnectedCallback() {
    this._clearTimers();
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

  _getCharsets() {
    return {
      en: "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 -:.",
      sv: "ABCDEFGHIJKLMNOPQRSTUVWXYZÅÄÖ0123456789 -:.",
      nordic: "ABCDEFGHIJKLMNOPQRSTUVWXYZÅÄÖÆØ0123456789 -:.",
      western: "ABCDEFGHIJKLMNOPQRSTUVWXYZÅÄÖÆØÜÉÈÀÁÂÃÇÑÓÒÔÕÚÙÛÍÌÎÏÊËŒ0123456789 -:."
    };
  }

  _getCharset() {
    const config = this._config || {};
    const key = config.charset || config.language || "en";

    if (key === "custom") {
      return config.custom_charset || this._getCharsets().en;
    }

    return this._getCharsets()[key] || this._getCharsets().en;
  }

  _getRawText() {
    const config = this._config || {};

    if (config.text !== undefined) {
      return String(config.text);
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

  _normalizeText(text) {
    const config = this._config || {};
    let output = text || "";

    if (config.text_transform === "uppercase") {
      output = output.toLocaleUpperCase(config.locale || "sv-SE");
    } else if (config.text_transform === "lowercase") {
      output = output.toLocaleLowerCase(config.locale || "sv-SE");
    }

    const charset = this._getCharset();
    const fallback = config.fallback_character ?? " ";

    output = Array.from(output)
      .map((char) => {
        if (charset.includes(char)) return char;

        const mapped = this._mapCharacter(char);
        if (mapped && charset.includes(mapped)) return mapped;

        return fallback;
      })
      .join("");

    if (config.max_chars && Number(config.max_chars) > 0) {
      const max = Number(config.max_chars);
      output = output.slice(0, max).padEnd(max, " ");
    }

    return output;
  }

  _mapCharacter(char) {
    const map = {
      "é": "e",
      "è": "e",
      "ê": "e",
      "ë": "e",
      "É": "E",
      "È": "E",
      "Ê": "E",
      "Ë": "E",

      "á": "a",
      "à": "a",
      "â": "a",
      "ã": "a",
      "Á": "A",
      "À": "A",
      "Â": "A",
      "Ã": "A",

      "ó": "o",
      "ò": "o",
      "ô": "o",
      "õ": "o",
      "Ó": "O",
      "Ò": "O",
      "Ô": "O",
      "Õ": "O",

      "ú": "u",
      "ù": "u",
      "û": "u",
      "Ú": "U",
      "Ù": "U",
      "Û": "U",

      "í": "i",
      "ì": "i",
      "î": "i",
      "ï": "i",
      "Í": "I",
      "Ì": "I",
      "Î": "I",
      "Ï": "I",

      "ç": "c",
      "Ç": "C",
      "ñ": "n",
      "Ñ": "N",

      "æ": "ä",
      "Æ": "Ä",
      "ø": "ö",
      "Ø": "Ö"
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
      const start = this._config.initial_animation ? " ".repeat(nextText.length) : nextText;
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
    const fromChars = Array.from(this._displayChars.join("").padEnd(toChars.length, " ")).slice(0, toChars.length);

    this._displayChars = fromChars;
    this._flipStates.clear();
    this._render();

    const flipDuration = Number(config.flip_duration) || 520;
    const flipStagger = Number(config.flip_stagger) || 45;
    const stepDelay = flipDuration + 70;
    const cycleCount = Math.max(0, Number(config.cycle_count) || 0);

    let lastDelay = 0;

    toChars.forEach((targetChar, index) => {
      const startChar = fromChars[index] || " ";

      if (startChar === targetChar) return;

      const sequence = this._buildSequence(startChar, targetChar, index, cycleCount);

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

    if (!config.cycle_chars || cycleCount <= 0) {
      return [targetChar];
    }

    const charset = Array.from(this._getCharset()).filter((char) => {
      return char !== " " && char !== "-" && char !== ":" && char !== ".";
    });

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

    const timer = window.setTimeout(() => {
      this._displayChars[index] = toChar;
      this._flipStates.delete(index);
      this._render();
    }, Number(this._config.flip_duration) + 40);

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
      tile.className = `split-flap-tile${char === " " ? " space" : ""}${flip ? " flipping" : ""}`;

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
    if (config.theme === "kiosk_gold") {
      return {
        ...config,
        card_background: config.card_background || "#050505",
        segment_background: config.segment_background || "#111111",
        segment_background_top: config.segment_background_top || "#1b1b1b",
        segment_background_bottom: config.segment_background_bottom || "#090909",
        text_color: config.text_color || "#dcb215"
      };
    }

    if (config.theme === "classic_airport") {
      return {
        ...config,
        card_background: config.card_background || "#0a0a0a",
        segment_background: config.segment_background || "#151515",
        segment_background_top: config.segment_background_top || "#202020",
        segment_background_bottom: config.segment_background_bottom || "#0c0c0c",
        text_color: config.text_color || "#f5f5f5"
      };
    }

    return config;
  }

  _getStyles(config) {
    const width = Number(config.segment_width) || 48;
    const height = Number(config.segment_height) || 72;
    const radius = Number(config.segment_radius) || 6;
    const fontSize = Number(config.font_size) || 44;
    const gap = Number(config.segment_gap) || 6;
    const flipDuration = Number(config.flip_duration) || 520;

    return `
      :host {
        display: block;
      }

      ha-card {
        background: ${config.card_background};
        border-radius: ${Number(config.card_border_radius) || 16}px;
        padding: ${Number(config.card_padding) || 16}px;
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
        background: ${config.segment_background};
        border: 1px solid ${config.segment_border_color};

        color: ${config.text_color};
        font-family: ${config.font_family};
        font-size: ${fontSize}px;
        font-weight: ${config.font_weight};
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
        background: ${config.segment_background_top};
        border-radius: ${radius}px ${radius}px 0 0;
      }

      .static-bottom,
      .leaf-back {
        bottom: 0;
        background: ${config.segment_background_bottom};
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
        color: ${config.text_color};
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
        background: ${config.segment_separator_color};
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

  _escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }
}

customElements.define("split-flap-card", HASplitFlapCard);

window.customCards = window.customCards || [];
window.customCards.push({
  type: "split-flap-card",
  name: "Split-Flap Card",
  preview: true,
  description: "Display text or entity states as a classic split-flap display."
});
