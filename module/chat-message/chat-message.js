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
    }
    return html;
  }

  async #onInlineRollClick(event) {
    event.preventDefault();
    event.stopPropagation();

    const actor = ChatMessage.getSpeakerActor(this.speaker);
    await actorInlineRollAction(actor, this.#getOnlineRollData(event));
  }

  async #onButtonClick(event) {
    event.preventDefault();
    const actor = ChatMessage.getSpeakerActor(this.speaker);
    if (!actor) {
      return;
    }
    await this.#handleButtons(actor, event.currentTarget);
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
