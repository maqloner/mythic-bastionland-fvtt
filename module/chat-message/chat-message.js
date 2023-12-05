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
      if (this.flags.cssClasses) {
        html.addClass(this.flags.cssClasses);
      }
      html.on("click", ".inline-roll", this.onInlineRollClick.bind(this));
      html.on("click", "button.chat-message-button", this.onButtonClick.bind(this));
    }
    return html;
  }

  async onInlineRollClick(event) {
    event.preventDefault();
    event.stopPropagation();
    const getClosestData = (event, data) => $(event.target).closest(`[data-${data}]`).data(data);
    const actor = ChatMessage.getSpeakerActor(this.speaker);
    actorInlineRollAction(actor, getClosestData(event, "formula"), getClosestData(event, "flavor"), getClosestData(event, "source"));
  }

  async onButtonClick(event) {
    event.preventDefault();
    const actor = ChatMessage.getSpeakerActor(this.speaker);
    if (!actor) {
      return;
    }
    await this.handleButtons(actor, event.currentTarget);
  }

  async handleButtons(actor, button) {
    const action = $(button).data("action");
    switch (true) {
      case action === "roll-scar":
        return actorRollScarsAction(actor);
      case action === "focus":
        return actorSaveAction(actor, "clarity", true);
    }
  }
}
