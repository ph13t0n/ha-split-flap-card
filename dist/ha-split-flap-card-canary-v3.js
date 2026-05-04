(() => {
  const SPLIT_FLAP_CANARY_VERSION = "0.1.0-alpha.2-canary.3";

  const defineV3 = () => {
    const BaseCard = customElements.get("split-flap-card-canary-v2");

    if (!BaseCard) {
      window.setTimeout(defineV3, 75);
      return;
    }

    if (customElements.get("split-flap-card-canary-v3")) {
      return;
    }

    class HASplitFlapCardCanaryV3 extends BaseCard {
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
        return document.createElement("split-flap-card-canary-v2-editor");
      }

      _animationPreset(value) {
        const presets = {
          calm: { flip_duration: 860, flip_stagger: 70, cycle_count: 2 },
          mechanical: { flip_duration: 680, flip_stagger: 42, cycle_count: 2 },
          fast: { flip_duration: 380, flip_stagger: 20, cycle_count: 1 },
          instant: { flip_duration: 0, flip_stagger: 0, cycle_count: 0 },
          custom: {
            flip_duration: this._config?.flip_duration || 680,
            flip_stagger: this._config?.flip_stagger || 42,
            cycle_count: this._config?.cycle_count || 2
          }
        };
        return presets[value] || presets.mechanical;
      }

      _fontPreset(value, theme) {
        const presets = {
          theme_default: theme === "mechanical_gold"
            ? { font_family: "Roboto Condensed, Arial Narrow, sans-serif", font_weight: 800 }
            : { font_family: "Roboto Mono, monospace", font_weight: 800 },
          mechanical: { font_family: "Roboto Condensed, Arial Narrow, sans-serif", font_weight: 800 },
          transit: { font_family: "Barlow Condensed, Arial Narrow, sans-serif", font_weight: 800 },
          clean: { font_family: "Inter, system-ui, sans-serif", font_weight: 800 },
          mono: { font_family: "Roboto Mono, monospace", font_weight: 800 },
          custom: {
            font_family: this._config?.font_family || "Roboto Condensed, Arial Narrow, sans-serif",
            font_weight: this._config?.font_weight || 800
          }
        };
        return presets[value] || presets.theme_default;
      }

      _applyThemeDefaults() {
        const themes = {
          mechanical_gold: {
            card_background: "#030303",
            segment_background: "#101010",
            segment_background_top: "#242424",
            segment_background_bottom: "#090909",
            segment_separator_color: "#020202",
            segment_border_color: "#303030",
            text_color: "#ffbf32",
            segment_width: 48,
            segment_height: 78,
            segment_gap: 6,
            segment_radius: 7,
            font_size: 54,
            font_weight: 800,
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
        const delay = this._num(this._config.flip_stagger, 42, 0, 1000) * index;
        return `<div class="split-flap-tile${space}${state}" style="--delay:${delay}ms"><div class="flap top final"><span>${safe}</span></div><div class="flap bottom final"><span>${safe}</span></div>${animate ? `<div class="flap top old"><span>${old}</span></div><div class="flap bottom incoming"><span>${safe}</span></div>` : ""}<div class="hinge"></div><div class="pin pin-left"></div><div class="pin pin-right"></div></div>`;
      }

      _styles(config) {
        const width = this._num(config.segment_width, 48, 8, 180);
        const height = this._num(config.segment_height, 78, 16, 240);
        const radius = this._num(config.segment_radius, 7, 0, 40);
        const gap = this._num(config.segment_gap, 6, 0, 40);
        const fontSize = this._num(config.font_size, 54, 8, 160);
        const letterSpacing = this._num(config.letter_spacing, -1, -8, 12);
        const duration = this._num(config.flip_duration, 680, 0, 3000);
        const weight = this._fontWeight(config.font_weight, 800);
        const fontStyle = config.font_style === "italic" ? "italic" : "normal";
        const textColor = this._color(config.text_color, "#ffbf32");
        const glow = config.text_glow === "off"
          ? "0 1px 0 rgba(0,0,0,.95)"
          : config.text_glow === "medium"
            ? `0 1px 0 rgba(0,0,0,.95), 0 0 10px ${this._rgba(textColor, .38)}, 0 0 2px ${this._rgba(textColor, .72)}`
            : `0 1px 0 rgba(0,0,0,.95), 0 0 6px ${this._rgba(textColor, .24)}`;
        const mobileWidth = Math.max(25, Math.floor(width * .76));
        const mobileHeight = Math.max(40, Math.floor(height * .76));
        const mobileFont = Math.max(24, Math.floor(fontSize * .76));
        const mobileGap = Math.max(2, gap - 2);

        return `<style>
          :host{display:block;--sfc-accent:#ffbf32;--sfc-muted:#86754d}
          ha-card{background:radial-gradient(circle at 50% 0%,rgba(255,255,255,.06),transparent 44%),linear-gradient(180deg,rgba(255,255,255,.04),rgba(0,0,0,.48)),${this._color(config.card_background,"#030303")};border-radius:18px;padding:18px;box-sizing:border-box;overflow:hidden;border:1px solid rgba(255,255,255,.075);box-shadow:inset 0 1px 0 rgba(255,255,255,.08),inset 0 -22px 34px rgba(0,0,0,.58),0 18px 38px rgba(0,0,0,.46)}
          .display-shell{border-radius:13px;padding:12px;background:linear-gradient(180deg,#1b1b1b 0%,#050505 56%,#000 100%);box-shadow:inset 0 1px 0 rgba(255,255,255,.07),inset 0 0 0 1px rgba(255,255,255,.05),inset 0 -18px 28px rgba(0,0,0,.62);overflow-x:auto;overflow-y:hidden;-webkit-overflow-scrolling:touch;scrollbar-width:thin}
          .display{display:flex;align-items:center;gap:${gap}px;width:max-content;min-width:100%;box-sizing:border-box;padding:2px;perspective:900px;transform-style:preserve-3d}
          .split-flap-tile{--h:${height}px;--half:${height / 2}px;position:relative;width:${width}px;height:${height}px;min-width:${width}px;border-radius:${radius}px;background:${this._color(config.segment_background,"#101010")};border:1px solid ${this._color(config.segment_border_color,"#303030")};color:${textColor};font-family:${this._fontFamily(config.font_family,"Roboto Condensed, Arial Narrow, sans-serif")};font-size:${fontSize}px;font-weight:${weight};font-style:${fontStyle};letter-spacing:${letterSpacing}px;text-align:center;overflow:hidden;box-sizing:border-box;box-shadow:inset 0 1px 0 rgba(255,255,255,.13),inset 0 -1px 0 rgba(0,0,0,.92),0 9px 16px rgba(0,0,0,.62);transform-style:preserve-3d;contain:layout paint}
          .flap{position:absolute;left:0;width:100%;height:50%;overflow:hidden;backface-visibility:hidden;-webkit-backface-visibility:hidden}.top{top:0;border-radius:${radius}px ${radius}px 0 0;transform-origin:bottom center}.bottom{bottom:0;border-radius:0 0 ${radius}px ${radius}px;transform-origin:top center}.top{background:linear-gradient(180deg,rgba(255,255,255,.095),transparent 56%),${this._color(config.segment_background_top,"#242424")}}.bottom{background:linear-gradient(180deg,rgba(255,255,255,.02),rgba(0,0,0,.38)),${this._color(config.segment_background_bottom,"#090909")}}
          .flap span{position:absolute;left:0;top:0;width:100%;height:var(--h);display:flex;align-items:center;justify-content:center;font-family:inherit;font-size:inherit;font-weight:inherit;font-style:inherit;letter-spacing:inherit;line-height:1;color:${textColor};text-shadow:${glow};transform:scaleX(.92) translateY(-1px);transform-origin:center center}.bottom span{top:calc(var(--half) * -1)}
          .old{z-index:5}.incoming{z-index:4;transform:rotateX(90deg);filter:brightness(.78)}.animate .old{animation:sfc-flip-top ${duration}ms cubic-bezier(.18,.72,.18,1) var(--delay) both}.animate .incoming{animation:sfc-flip-bottom ${duration}ms cubic-bezier(.18,.72,.18,1) var(--delay) both}
          .hinge{position:absolute;left:-1px;right:-1px;top:calc(50% - 1.5px);height:3px;background:linear-gradient(180deg,rgba(255,255,255,.12),transparent 38%),${this._color(config.segment_separator_color,"#020202")};z-index:7;box-shadow:0 1px 0 rgba(255,255,255,.075),0 -1px 0 rgba(0,0,0,.9),0 2px 4px rgba(0,0,0,.55)}
          .pin{position:absolute;top:calc(50% - 3px);width:6px;height:6px;border-radius:50%;background:radial-gradient(circle at 35% 25%,#383838,#050505 58%,#000 100%);border:1px solid #2c2c2c;z-index:8;opacity:.72}.pin-left{left:5px}.pin-right{right:5px}.space span{opacity:0}
          @keyframes sfc-flip-top{0%{transform:rotateX(0deg);filter:brightness(1)}48%{transform:rotateX(-88deg);filter:brightness(.42)}49%,100%{transform:rotateX(-90deg);filter:brightness(.2)}}
          @keyframes sfc-flip-bottom{0%,49%{transform:rotateX(90deg);filter:brightness(.35)}50%{transform:rotateX(88deg);filter:brightness(.55)}100%{transform:rotateX(0deg);filter:brightness(1)}}
          @media(max-width:560px){ha-card{padding:12px}.display-shell{padding:8px}.display{gap:${mobileGap}px}.split-flap-tile{--h:${mobileHeight}px;--half:${mobileHeight / 2}px;width:${mobileWidth}px;min-width:${mobileWidth}px;height:${mobileHeight}px;font-size:${mobileFont}px}.pin{width:5px;height:5px}.pin-left{left:4px}.pin-right{right:4px}}
        </style>`;
      }
    }

    customElements.define("split-flap-card-canary-v3", HASplitFlapCardCanaryV3);

    window.customCards = window.customCards || [];
    window.customCards.push({
      type: "split-flap-card-canary-v3",
      name: "Split-Flap Card Canary V3",
      description: `Mechanical render calibration canary (${SPLIT_FLAP_CANARY_VERSION})`
    });
  };

  defineV3();
})();
