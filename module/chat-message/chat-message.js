import { actorInlineRollAction } from "../actions/actor-inline-roll-action.js";
import { actorRollScarsAction } from "../actions/actor-roll-scars-action.js";
import { actorSaveAction } from "../actions/actor-save-action.js";

/**
 * @extends {ChatMessage}
 */
export class MBChatMessage extends ChatMessage {
  /** @override */
  async getHTML() {
    const html = await super.getHTML();
    if (this.flags.systemMessage) {

      if (this.flags.cssClasses.value) {
        html.addClass(this.flags.cssClasses.value);
      }

      html.on("click", ".inline-roll", (event) => this.#onInlineRollClick(event));
      html.on("click", "button.chat-message-button", (event) => this.#onButtonClick(event));

      const speakerActor = ChatMessage.getSpeakerActor(this.speaker);
      if (!speakerActor?.sheet?.isEditable) {
        html.find("button[data-action-target=\"speaker\"]").each((index, button) => $(button).prop("disabled", true));
      }
    }
    return html;
  }

  async #onInlineRollClick(event) {
    event.preventDefault();
    event.stopPropagation();

    const actor = ChatMessage.getSpeakerActor(this.speaker);
    return (actor?.sheet?.isEditable) ? actorInlineRollAction(actor, this.#getOnlineRollData(event)) : null;
  }

  async #onButtonClick(event) {
    event.preventDefault();

    const actor = ChatMessage.getSpeakerActor(this.speaker);
    return (actor?.sheet?.isEditable) ? this.#handleButtons(actor, event.currentTarget) : null;
  }

  #getEventData(event, data) {
    return $(event.target).closest(`[data-${data}]`).data(data);
  }

  /**
 * @private
 *
 * @param {MouseEvent} event
 */
  #getOnlineRollData(event) {
    return {
      formula: this.#getEventData(event, "formula"),
      flavor: this.#getEventData(event, "flavor"),
      source: this.#getEventData(event, "source"),
      applyFatigue: this.#getEventData(event, "fatigue")
    };
  }

  async #handleButtons(actor, button) {
    const action = $(button).data("action");
    switch (true) {
      case action === "roll-scar":
        return actorRollScarsAction(actor);
      case action === "focus":
        return actorSaveAction(actor, { virtue: "clarity", applyFatigue: true });
      case action === "smite":
        return actorSaveAction(actor, { virtue: "vigour", applyFatigue: true });
    }
  }
}
