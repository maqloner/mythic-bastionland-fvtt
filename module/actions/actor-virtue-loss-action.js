import { showChatMessage } from "../chat-message/show-chat-message.js";
import { showVirtueLossDialog } from "../applications/dialog/virtue-loss-dialog.js";
import { evaluateFormula } from "../utils/utils.js";

/**
 * @param {Actor} actor
 */
export const attackVirtueLossAction = async (actor) => {
  const { amountFormula, virtue } = await showVirtueLossDialog({ actor });

  const roll = (await evaluateFormula(amountFormula));

  const amount = roll.total;

  const value = actor.system.virtues[virtue].value;
  const newValue = Math.max(value - amount, 0);

  const isExhausted = newValue === 0 && virtue === "vigour";
  const isExposed = newValue === 0 && virtue === "clarity";
  const isImpaired = newValue === 0 && virtue === "spirit";

  const outcome = {
    type: "take-damage",
    title: getTitle({ isExhausted, isExposed, isImpaired }),
    description: getDescription({ virtue, value, newValue, isExhausted, isExposed, isImpaired }),
    formulaLabel: game.i18n.localize("MB.VirtueLoss"),
    roll: roll
  };

  await actor.update({
    [`system.virtues.${virtue}.value`]: newValue
  });

  await showChatMessage({
    actor,
    title: game.i18n.localize("MB.VirtueLoss"),
    outcomes: [outcome]
  });
};

const getTitle = ({ isExhausted = false, isExposed = false, isImpaired = false }) => {
  switch (true) {
    case isExhausted:
      return game.i18n.localize("MB.Exhausted");
    case isExposed:
      return game.i18n.localize("MB.Exposed");
    case isImpaired:
      return game.i18n.localize("MB.Impaired");
  }
};

const getDescription = ({ virtue, value, newValue, isExhausted = false, isExposed = false, isImpaired = false }) => {
  const damage = value !== newValue ? [
    game.i18n.format("MB.MessageVirtueDamage", {
      virtue: game.i18n.localize(`MB.Actor.Virtues.${virtue}`),
      value,
      newValue
    })] : [];

  const exhausted = isExhausted ? [game.i18n.localize("MB.ExhaustedMessage")] : [];
  const exposed = isExposed ? [game.i18n.localize("MB.ExposedMessage")] : [];
  const impaired = isImpaired ? [game.i18n.localize("MB.ImpairedMessage")] : [];

  return [...damage, ...exhausted, ...exposed, ...impaired];
};
