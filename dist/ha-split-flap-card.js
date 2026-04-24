class HASplitFlapCard extends HTMLElement {
  static getStubConfig() {
    return {
      text: "NÄSSJÖ CENTRAL",
      language: "sv",
      theme: "kiosk_gold",
      max_chars: 14
    };
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._config = {};
    this._hass = null;
  }

  setConfig(config) {
    if (!config.text && !config.entity) {
      throw new Error("You need to define either text or entity.");
    }

    this._config = {
      language: "en",
      charset: undefined,
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
      flip_duration: 450,
      flip_stagger: 35,

      ...config
    };

    this._render();
  }

  set hass(hass) {
    this._hass = hass;
    this._render();
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
    const config = this._config;
    const charsetKey = config.charset || config.language || "en";

    if (charsetKey === "custom") {
      return config.custom_charset || this._getCharsets().en;
    }

    return this._getCharsets()[charsetKey] || this._getCharsets().en;
  }

  _getRawText() {
    const config = this._config;

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
    const config = this._config;
    let output = text || "";

    if (config.text_transform === "uppercase") {
      output = output.toLocaleUpperCase(config.locale || "en-US");
    } else if (config.text_transform === "lowercase") {
      output = output.toLocaleLowerCase(config.locale || "en-US");
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

  _applyTheme(config) {
    const theme = config.theme;

    if (theme === "kiosk_gold") {
      return {
        ...config,
        card_background: config.card_background || "#050505",
        segment_background: config.segment_background || "#111111",
        segment_background_top: config.segment_background_top || "#1b1b1b",
        segment_background_bottom: config.segment_background_bottom || "#090909",
        text_color: config.text_color || "#dcb215"
      };
    }

    if (theme === "classic_airport") {
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

  _render() {
    if (!this.shadowRoot || !this._config) return;

    const config = this._applyTheme(this._config);
    const rawText = this._getRawText();
    const text = this._normalizeText(rawText);

    this.shadowRoot.innerHTML = "";

    const style = document.createElement("style");
    style.textContent = `
      :host {
        display: block;
      }

      ha-card {
        background: ${config.card_background};
        border-radius: ${Number(config.card_border_radius)}px;
        padding: ${Number(config.card_padding)}px;
        box-sizing: border-box;
        overflow: hidden;
      }

      .display {
        display: flex;
        justify-content: ${this._alignToFlex(config.align)};
        align-items: center;
        gap: ${Number(config.segment_gap)}px;
        width: 100%;
        box-sizing: border-box;
      }

      .flap {
        position: relative;
        width: ${Number(config.segment_width)}px;
        height: ${Number(config.segment_height)}px;
        min-width: ${Number(config.segment_width)}px;
        border-radius: ${Number(config.segment_radius)}px;
        background: ${config.segment_background};
        color: ${config.text_color};
        font-family: ${config.font_family};
        font-size: ${Number(config.font_size)}px;
        font-weight: ${config.font_weight};
        line-height: ${Number(config.segment_height)}px;
        text-align: center;
        overflow: hidden;
        box-sizing: border-box;
        border: 1px solid ${config.segment_border_color};
        box-shadow:
          inset 0 1px 0 rgba(255,255,255,0.08),
          inset 0 -1px 0 rgba(0,0,0,0.7),
          0 6px 14px rgba(0,0,0,0.35);
      }

      .flap::before {
        content: "";
        position: absolute;
        inset: 0;
        height: 50%;
        background: ${config.segment_background_top};
        opacity: 0.75;
        border-bottom: 1px solid ${config.segment_separator_color};
        pointer-events: none;
      }

      .flap::after {
        content: "";
        position: absolute;
        left: 0;
        right: 0;
        top: 50%;
        height: 1px;
        background: ${config.segment_separator_color};
        box-shadow: 0 1px 0 rgba(255,255,255,0.08);
        pointer-events: none;
      }

      .flap span {
        position: relative;
        z-index: 2;
      }

      .space span {
        opacity: 0;
      }

      .animate {
        animation-name: splitFlapPulse;
        animation-duration: ${Number(config.flip_duration)}ms;
        animation-timing-function: ease-out;
        animation-fill-mode: both;
      }

      @keyframes splitFlapPulse {
        0% {
          transform: rotateX(-18deg);
          filter: brightness(1.35);
        }
        100% {
          transform: rotateX(0deg);
          filter: brightness(1);
        }
      }
    `;

    const card = document.createElement("ha-card");
    const display = document.createElement("div");
    display.className = "display";

    Array.from(text).forEach((char, index) => {
      const flap = document.createElement("div");
      flap.className = char === " " ? "flap space" : "flap";

      if (config.animation) {
        flap.classList.add("animate");
        flap.style.animationDelay = `${index * Number(config.flip_stagger)}ms`;
      }

      const span = document.createElement("span");
      span.textContent = char;
      flap.appendChild(span);
      display.appendChild(flap);
    });

    card.appendChild(display);
    this.shadowRoot.appendChild(style);
    this.shadowRoot.appendChild(card);
  }

  _alignToFlex(align) {
    if (align === "left") return "flex-start";
    if (align === "right") return "flex-end";
    return "center";
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
