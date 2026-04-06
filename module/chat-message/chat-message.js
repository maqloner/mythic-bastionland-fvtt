import { actorInlineRollAction } from "../actions/actor-inline-roll-action.js";
import { actorRollScarsAction } from "../actions/actor-roll-scars-action.js";
import { actorSaveAction } from "../actions/actor-save-action.js";

/**
 * @extends {ChatMessage}
 */
export class MBChatMessage extends ChatMessage {
  /** @override */
  async renderHTML() {
    const html = await super.renderHTML();
    if (this.flags.systemMessage) {
      if (this.flags.cssClasses.value) {
        html.classList.add(...this.flags.cssClasses.value);
      }

      const actor = ChatMessage.getSpeakerActor(this.speaker);

      if (actor?.sheet?.isEditable) {
        html.querySelectorAll("a.inline-roll").forEach(el => {
          el.addEventListener("click", event => this.#onInlineRollClick(event));
        });

        html.querySelectorAll("button.chat-message-button").forEach(el => {
          el.addEventListener("click", event => this.#onButtonClick(event));
        });

      } else {
        html.querySelectorAll("a.inline-roll").forEach(el => el.setAttribute("disabled", "true"));
        html.querySelectorAll("button.chat-message-button").forEach(el => el.setAttribute("disabled", "true"));
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
    return event.target.closest(`[data-${data}]`)?.dataset[data];
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
