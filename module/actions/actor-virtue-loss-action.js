import { showChatMessage } from "../chat-message/show-chat-message.js";
import { showVirtueLossDialog } from "../dialog/virtue-loss-dialog.js";

/**
 * @param {Actor} actor
 * @returns {Promise.<void>}
 */
export const attackVirtueLossAction = async (actor) => {
  const { amount, virtue } = await showVirtueLossDialog({ actor });

  const value = actor.system.virtues[virtue].value;
  const newValue = Math.max(value - amount, 0);

  const isExhausted = newValue === 0 && virtue === 'vigour';
  const isExposed = newValue === 0 && virtue === 'clarity';
  const isImpaired = newValue === 0 && virtue === 'spirit';

  const outcome = {
    type: 'take-damage',
    title: getTitle({ isExhausted, isExposed, isImpaired }),
    description: getDescription({ virtue, value, newValue, isExhausted, isExposed, isImpaired }),
    formulaLabel: game.i18n.localize("MB.VirtueLoss"),
    formulaNumber: amount
  }

  await actor.update({
    [`system.virtues.${virtue}.value`]: newValue
  });
  
  await showChatMessage({
    actor,
    title: game.i18n.localize("MB.VirtueLoss"),
    outcomes: [outcome]
  });
};

const getTitle = ({ isExhausted, isExposed, isImpaired }) => {
  switch (true) {
    case isExhausted:
      return game.i18n.localize("MB.Exhausted");
    case isExposed:
      return game.i18n.localize("MB.Exposed");
    case isImpaired:
      return game.i18n.localize("MB.Impaired");
  }
}

const getDescription = ({ virtue, value, newValue, isExhausted, isExposed, isImpaired }) => {
  const description = [];
  
  if (value !== newValue) {
    description.push(game.i18n.format("MB.MessageVirtueDamage", {
      virtue: game.i18n.localize(`MB.Actor.Virtues.${virtue}`),
      value,
      newValue
    }));
  }

  switch (true) {
    case isExhausted:
      description.push(game.i18n.localize("MB.ExhaustedMessage"));
      break;
    case isExposed:
      description.push(game.i18n.localize("MB.ExposedMessage"));
      break;
    case isImpaired:
      description.push(game.i18n.localize("MB.ImpairedMessage"));
      break;
  }

  return description;
}