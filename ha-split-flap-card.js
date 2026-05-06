import "./dist/ha-split-flap-card-canary-v9.js";

const SPLIT_FLAP_CARD_VERSION = "0.1.0-beta.7";
const SFC_REPO_URL = "https://github.com/ph13t0n/ha-split-flap-card";

const BetaCard = customElements.get("split-flap-card-canary-v9");
const BetaEditor = customElements.get("split-flap-card-canary-v9-editor");

if (!BetaCard || !BetaEditor) {
  throw new Error("Split-Flap Card beta runtime failed to load.");
}

class HASplitFlapCard extends BetaCard {
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
    return document.createElement("split-flap-card-editor");
  }
}

class SplitFlapCardEditor extends BetaEditor {
  _diagnostics() {
    const diagnostics = super._diagnostics ? super._diagnostics() : {};
    diagnostics.card_version = SPLIT_FLAP_CARD_VERSION;
    diagnostics.card_type = "custom:split-flap-card";
    return diagnostics;
  }

  _issueText() {
    const text = super._issueText ? super._issueText() : "";
    return text
      .replaceAll("0.1.0-beta.1-canary.9", SPLIT_FLAP_CARD_VERSION)
      .replaceAll("custom:split-flap-card-canary-v9", "custom:split-flap-card")
      .replaceAll("split-flap-card-canary-v9", "split-flap-card");
  }
}

if (!customElements.get("split-flap-card")) {
  customElements.define("split-flap-card", HASplitFlapCard);
}

if (!customElements.get("split-flap-card-editor")) {
  customElements.define("split-flap-card-editor", SplitFlapCardEditor);
}

window.customCards = window.customCards || [];
window.customCards.push({
  type: "split-flap-card",
  name: "Split-Flap Card",
  preview: true,
  description: `Beta release ${SPLIT_FLAP_CARD_VERSION}`,
  documentationURL: SFC_REPO_URL
});
