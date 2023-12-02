import { actorRollScarsAction } from "../actions/actor-roll-scars-action.js";

/**
 * @param {ChatMessage} message
 * @param {JQuery.<HTMLElement>} html
 */
export const handleChatMessageButton = async (message, html) => {
  html.on("click", "button.chat-message-button", async (event) => {
    event.preventDefault();
    const actor = ChatMessage.getSpeakerActor(message.speaker);
    console.log(actor);
    if (!actor) {
      return;
    }
    await handleButton(actor, event.currentTarget);
  });
};

const handleButton = async (actor, button) => {
  const action = $(button).data('action');
  switch (true) {
    case action === "roll-scar":
      return actorRollScarsAction(actor)
  }
}
