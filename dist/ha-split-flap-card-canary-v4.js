import "./ha-split-flap-card-canary-v2.js?v=0.1.0-alpha.2-canary.2";

(() => {
  const SPLIT_FLAP_CANARY_VERSION = "0.1.0-alpha.2-canary.4";

  const defineV4 = () => {
    const BaseCard = customElements.get("split-flap-card-canary-v2");
    const BaseEditor = customElements.get("split-flap-card-canary-v2-editor");

    if (!BaseCard || !BaseEditor) {
      window.setTimeout(defineV4, 75);
      return;
    }

    if (customElements.get("split-flap-card-canary-v4")) {
      return;
    }

    class HASplitFlapCardCanaryV4 extends BaseCard {
      static getStubConfig() {
        return {
          source: "text",
          text: "SPLIT-FLAP TEST",
          segments: 16,
          theme: "mechanical_gold",
          font_preset: "mechanical",
          animation: true,
          initial_animation: true,
          animation_feel: "mechanical",
          letter_vertical_offset: -8
        };
      }

      static getConfigElement() {
        return document.createElement("split-flap-card-canary-v4-editor");
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

      _fontPreset(value, theme) {
        const presets = {
          theme_default: theme === "mechanical_gold"
            ? { font_family: "Roboto Condensed, Arial Narrow, sans-serif", font_weight: 900 }
            : { font_family: "Roboto Mono, monospace", font_weight: 800 },
          mechanical: { font_family: "Roboto Condensed, Arial Narrow, sans-serif", font_weight: 900 },
          transit: { font_family: "Barlow Condensed, Arial Narrow, sans-serif", font_weight: 900 },
          clean: { font_family: "Inter, system-ui, sans-serif", font_weight: 800 },
          mono: { font_family: "Roboto Mono, monospace", font_weight: 800 },
          custom: {
            font_family: this._config?.font_family || "Roboto Condensed, Arial Narrow, sans-serif",
            font_weight: this._config?.font_weight || 900
          }
        };
        return presets[value] || presets.theme_default;
      }

      _applyThemeDefaults() {
        const themes = {
          mechanical_gold: {
            card_background: "#030303",
            segment_background: "#101010",
            segment_background_top: "#252525",
            segment_background_bottom: "#080808",
            segment_separator_color: "#010101",
            segment_border_color: "#313131",
            text_color: "#ffc02e",
            segment_width: 48,
            segment_height: 78,
            segment_gap: 6,
            segment_radius: 7,
            font_size: 60,
            font_weight: 900,
            letter_spacing: -1,
            letter_vertical_offset: -8,
            text_glow: "medium"
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

        if (this._config.animation_feel && this._config.animation_feel !== "custom") {
          const animation = this._animationPreset(this._config.animation_feel);
          this._config.flip_duration = animation.flip_duration;
          this._config.flip_stagger = animation.flip_stagger;
          this._config.cycle_count = animation.cycle_count;
          this._config.animation = this._config.animation_feel !== "instant";
        }
      }

      _render(forceAnimation = true) {
        if (!this.shadowRoot) return;
        const config = this._config || {};
        const text = this._text();
        const chars = Array.from(text);
        const oldChars = Array.from(this._lastText || "".padEnd(chars.length, " "));
        const allowAnimation = config.animation !== false && forceAnimation !== false && this._num(config.flip_duration, 0, 0, 3000) > 0;
        const initialAnimation = !this._hasRendered && config.initial_animation !== false;
        const tiles = chars.map((char, index) => {
          const oldChar = initialAnimation ? " " : (oldChars[index] || " ");
          const shouldAnimate = allowAnimation && (initialAnimation || oldChar !== char);
          return this._tile(char, oldChar, index, shouldAnimate);
        }).join("");

        this._lastText = text;
        this._hasRendered = true;
        this.shadowRoot.innerHTML = `${this._styles(config)}<ha-card><div class="display-shell"><div class="display" style="justify-content:${this._align(config.align)}">${tiles}</div></div></ha-card>`;
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
        const letterOffset = this._num(config.letter_vertical_offset, -8, -40, 40);
        const duration = this._num(config.flip_duration, 760, 0, 3000);
        const weight = this._fontWeight(config.font_weight, 900);
        const fontStyle = config.font_style === "italic" ? "italic" : "normal";
        const textColor = this._color(config.text_color, "#ffc02e");
        const glow = config.text_glow === "off"
          ? "0 1px 0 rgba(0,0,0,.95)"
          : config.text_glow === "medium"
            ? `0 1px 0 rgba(0,0,0,.95), 0 0 9px ${this._rgba(textColor, .32)}, 0 0 2px ${this._rgba(textColor, .72)}`
            : `0 1px 0 rgba(0,0,0,.95), 0 0 5px ${this._rgba(textColor, .22)}`;
        const mobileWidth = Math.max(25, Math.floor(width * .76));
        const mobileHeight = Math.max(40, Math.floor(height * .76));
        const mobileFont = Math.max(25, Math.floor(fontSize * .76));
        const mobileGap = Math.max(2, gap - 2);
        const mobileOffset = Math.round(letterOffset * .76);

        return `<style>
          :host{display:block;--sfc-accent:#ffc02e;--sfc-muted:#86754d}
          ha-card{background:radial-gradient(circle at 50% 0%,rgba(255,255,255,.06),transparent 44%),linear-gradient(180deg,rgba(255,255,255,.04),rgba(0,0,0,.48)),${this._color(config.card_background,"#030303")};border-radius:18px;padding:18px;box-sizing:border-box;overflow:hidden;border:1px solid rgba(255,255,255,.075);box-shadow:inset 0 1px 0 rgba(255,255,255,.08),inset 0 -22px 34px rgba(0,0,0,.58),0 18px 38px rgba(0,0,0,.46)}
          .display-shell{border-radius:13px;padding:12px;background:linear-gradient(180deg,#1b1b1b 0%,#050505 56%,#000 100%);box-shadow:inset 0 1px 0 rgba(255,255,255,.07),inset 0 0 0 1px rgba(255,255,255,.05),inset 0 -18px 28px rgba(0,0,0,.62);overflow-x:auto;overflow-y:hidden;-webkit-overflow-scrolling:touch;scrollbar-width:thin}
          .display{display:flex;align-items:center;gap:${gap}px;width:max-content;min-width:100%;box-sizing:border-box;padding:2px;perspective:950px;transform-style:preserve-3d}
          .split-flap-tile{--h:${height}px;--half:${height / 2}px;--letter-offset:${letterOffset}px;position:relative;width:${width}px;height:${height}px;min-width:${width}px;border-radius:${radius}px;background:${this._color(config.segment_background,"#101010")};border:1px solid ${this._color(config.segment_border_color,"#313131")};color:${textColor};font-family:${this._fontFamily(config.font_family,"Roboto Condensed, Arial Narrow, sans-serif")};font-size:${fontSize}px;font-weight:${weight};font-style:${fontStyle};letter-spacing:${letterSpacing}px;text-align:center;overflow:hidden;box-sizing:border-box;box-shadow:inset 0 1px 0 rgba(255,255,255,.13),inset 0 -1px 0 rgba(0,0,0,.92),0 9px 16px rgba(0,0,0,.62);transform-style:preserve-3d;contain:layout paint}
          .flap{position:absolute;left:0;width:100%;height:50%;overflow:hidden;backface-visibility:hidden;-webkit-backface-visibility:hidden}.top{top:0;border-radius:${radius}px ${radius}px 0 0;transform-origin:bottom center;background:linear-gradient(180deg,rgba(255,255,255,.10),transparent 56%),${this._color(config.segment_background_top,"#252525")}}.bottom{bottom:0;border-radius:0 0 ${radius}px ${radius}px;transform-origin:top center;background:linear-gradient(180deg,rgba(255,255,255,.02),rgba(0,0,0,.38)),${this._color(config.segment_background_bottom,"#080808")}}
          .flap span{position:absolute;left:0;top:0;width:100%;height:var(--h);display:flex;align-items:center;justify-content:center;font-family:inherit;font-size:inherit;font-weight:inherit;font-style:inherit;letter-spacing:inherit;line-height:1;color:${textColor};text-shadow:${glow};transform:scaleX(.94) translateY(var(--letter-offset));transform-origin:center center}.bottom span{top:calc(var(--half) * -1)}
          .current{z-index:1}.flip-old{z-index:5}.flip-new{z-index:4;transform:rotateX(90deg);filter:brightness(.55)}.animate .flip-old{animation:sfc-v4-top ${duration}ms cubic-bezier(.2,.75,.16,1) var(--delay) both}.animate .flip-new{animation:sfc-v4-bottom ${duration}ms cubic-bezier(.2,.75,.16,1) var(--delay) both}
          .hinge{position:absolute;left:-1px;right:-1px;top:calc(50% - 1px);height:2px;background:${this._color(config.segment_separator_color,"#010101")};z-index:7;box-shadow:0 1px 0 rgba(255,255,255,.06),0 -1px 0 rgba(0,0,0,.92),0 2px 4px rgba(0,0,0,.42)}
          .pin{position:absolute;top:calc(50% - 3px);width:6px;height:6px;border-radius:50%;background:radial-gradient(circle at 35% 25%,#383838,#050505 58%,#000 100%);border:1px solid #2c2c2c;z-index:8;opacity:.52}.pin-left{left:5px}.pin-right{right:5px}.space span{opacity:0}
          @keyframes sfc-v4-top{0%{transform:rotateX(0deg);filter:brightness(1)}42%{transform:rotateX(-84deg);filter:brightness(.42)}43%,100%{transform:rotateX(-90deg);filter:brightness(.18)}}
          @keyframes sfc-v4-bottom{0%,42%{transform:rotateX(90deg);filter:brightness(.28)}55%{transform:rotateX(72deg);filter:brightness(.55)}100%{transform:rotateX(0deg);filter:brightness(1)}}
          @media(max-width:560px){ha-card{padding:12px}.display-shell{padding:8px}.display{gap:${mobileGap}px}.split-flap-tile{--h:${mobileHeight}px;--half:${mobileHeight / 2}px;--letter-offset:${mobileOffset}px;width:${mobileWidth}px;min-width:${mobileWidth}px;height:${mobileHeight}px;font-size:${mobileFont}px}.pin{width:5px;height:5px}.pin-left{left:4px}.pin-right{right:4px}}
        </style>`;
      }
    }

    class SplitFlapCardCanaryV4Editor extends BaseEditor {
      _t(key) {
        const svExtra = {
          letter_vertical_offset: "Bokstavsposition upp/ned",
          animation_custom_hint: "Custom använder värdena under Finjustering av animation i avancerat läge."
        };
        const enExtra = {
          letter_vertical_offset: "Letter position up/down",
          animation_custom_hint: "Custom uses the values under Animation fine-tuning in advanced mode."
        };
        const extra = this._lang && this._lang() === "sv" ? svExtra : enExtra;
        return extra[key] || super._t(key);
      }

      _set(key, value, type = "string") {
        if (key === "animation_feel" && value === "custom") {
          this._config = { ...this._config, editor_advanced: true };
        }
        super._set(key, value, type);
      }

      _render() {
        super._render();
        const hintHost = this.shadowRoot?.querySelector("select[data-key='animation_feel']")?.closest("label")?.parentElement;
        if (hintHost && this._value("animation_feel", "mechanical") === "custom" && !hintHost.querySelector(".custom-hint")) {
          const p = document.createElement("p");
          p.className = "custom-hint";
          p.textContent = this._t("animation_custom_hint");
          hintHost.appendChild(p);
        }
      }

      _advanced(customFont, customCharset, animationOn) {
        return `
          ${this._section("typography", this._t("advanced_typography"), `
            <div class="grid two">
              ${customFont ? this._input("font_family", this._t("custom_font"), "text", "Roboto Condensed, Arial Narrow, sans-serif") : ""}
              ${this._input("font_size", this._t("font_size"), "number", "60")}
              ${this._select("font_weight", this._t("font_weight"), [["400", "Normal"], ["500", "Medium"], ["600", "Semi-bold"], ["700", "Bold"], ["800", "Extra-bold"], ["900", "Black"]])}
              ${this._checkbox("font_style_italic", this._t("italic"), false)}
              ${this._input("letter_spacing", this._t("letter_spacing"), "number", "-1")}
              ${this._input("letter_vertical_offset", this._t("letter_vertical_offset"), "number", "-8")}
              ${this._select("text_transform", this._t("text_transform"), [["uppercase", "Uppercase"], ["lowercase", "Lowercase"], ["none", "None"]])}
              ${this._select("text_glow", this._t("text_glow"), [["off", "Off"], ["low", "Low"], ["medium", "Medium"]])}
            </div>
          `)}
          ${this._section("flap", this._t("flap_design"), `
            <div class="grid two">
              ${this._input("segment_width", this._t("segment_width"), "number", "48")}
              ${this._input("segment_height", this._t("segment_height"), "number", "78")}
              ${this._input("segment_gap", this._t("segment_gap"), "number", "6")}
              ${this._input("segment_radius", this._t("segment_radius"), "number", "7")}
            </div>
          `)}
          ${animationOn ? this._section("animation", this._t("animation_fine"), `
            <div class="grid two">
              ${this._input("flip_duration", this._t("flip_speed"), "number", "760")}
              ${this._input("flip_stagger", this._t("delay_between"), "number", "45")}
              ${this._input("cycle_count", this._t("shuffle_steps"), "number", "2")}
            </div>
          `) : ""}
          ${this._section("colors", this._t("colors"), `
            <div class="grid two">
              ${this._input("card_background", this._t("card_background"), "text", "#030303")}
              ${this._input("text_color", this._t("text_color"), "text", "#ffc02e")}
            </div>
          `)}
          ${this._section("data", this._t("advanced_data"), `
            <div class="grid two">
              ${this._select("charset", this._t("charset"), [["en", "English"], ["sv", "Swedish"], ["nordic", "Nordic"], ["western", "Western"], ["weather", "Weather"], ["weather_sv", "Weather Swedish"], ["extended", "Extended"], ["custom", "Custom"]])}
              ${customCharset ? this._input("custom_charset", this._t("custom_charset"), "text", "ABCDEFGHIJKLMNOPQRSTUVWXYZÅÄÖ0123456789 -:.,°/+") : ""}
              ${this._input("fallback_character", this._t("fallback_character"), "text", " ")}
              ${this._input("pad_character", this._t("pad_character"), "text", " ")}
            </div>
          `)}
        `;
      }
    }

    customElements.define("split-flap-card-canary-v4", HASplitFlapCardCanaryV4);
    customElements.define("split-flap-card-canary-v4-editor", SplitFlapCardCanaryV4Editor);

    window.customCards = window.customCards || [];
    window.customCards.push({
      type: "split-flap-card-canary-v4",
      name: "Split-Flap Card Canary V4",
      description: `Readable mechanical animation canary (${SPLIT_FLAP_CANARY_VERSION})`
    });
  };

  defineV4();
})();
