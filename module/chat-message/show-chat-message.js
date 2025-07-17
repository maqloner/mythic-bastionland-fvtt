import { config } from '../config.js';
import { diceSound } from '../utils/dice.js';

const CHAT_MESSAGE_TEMPLATE = `${config.systemPath}/templates/chat-message/chat-message.hbs`;

/**
 * @param {Actor} [actor]
 * @param {Token} [target]
 * @param {String} [title]
 * @param {String} [description]
 * @param {Object[]} [outcomes]
 * @param {Object[]} [buttons]
 * @return {Promise<ChatMessage>}
 */
export const showChatMessage = async ({ actor, title, description, outcomes = [], buttons = [], items = [], rollMode = game.settings.get('core', 'rollMode') } = {}) => {
  const rolls = outcomes.map((outcome) => outcome.roll).filter((roll) => roll);

  return ChatMessage.create(ChatMessage.applyRollMode({
    content: await foundry.applications.handlebars.renderTemplate(CHAT_MESSAGE_TEMPLATE, {
      title,
      description,
      outcomes,
      buttons,
      items,
    }),
    flags: {
      systemMessage: { value: true },
      cssClasses: { value: ['mythic-bastionland'] },
    },
    rolls,
    rollMode,
    speaker: ChatMessage.getSpeaker({ actor }),
    ...(rolls.length ? { sound: diceSound() } : {}),
  }, rollMode));
};
