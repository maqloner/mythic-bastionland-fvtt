import { diceSound, showDiceWithSound } from "../utils/dice.js";

const CHAT_MESSAGE_TEMPLATE = "systems/mythicbastionland/templates/chat-message/chat-message.hbs";

/**
 * @param {Actor} [actor]
 * @param {Token} [target]
 * @param {String} [title]
 * @param {String} [description]
 * @param {Object[]} [outcomes]
 * @param {Object[]} [buttons]
 * @param {PBItem[]} [items]
 * @return {Promise<ChatMessage>}
 */
export const showChatMessage = async ({ actor, title, description, outcomes = [], buttons = [], items = [], rollMode } = {}) => {
  const rolls = outcomes.map((outcome) => outcome.roll).filter((roll) => roll);

  if (rolls.length) {
    await showDiceWithSound(rolls);
  }

  return ChatMessage.create(ChatMessage.applyRollMode({
    content: await renderTemplate(CHAT_MESSAGE_TEMPLATE, {
      title,
      description,
      outcomes,
      buttons,
      items,
    }),
    flags: {
      cssClasses: ["mythic-bastionland"],
    },
    rolls: rolls,
    speaker: ChatMessage.getSpeaker({ actor }),
    ...(rolls.length ? { sound: diceSound() } : {})
  }, rollMode ?? game.settings.get('core', 'rollMode')));
};
