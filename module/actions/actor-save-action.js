import { showChatMessage } from "../chat-message/show-chat-message.js";
import { evaluateFormula } from "../utils/formula.js";

/**
 * @param {Actor} actor
 * @param {String} virtue
 * @returns {Promise.<void>}
 */
export const actorSaveAction = async (actor, virtue) => {
  const roll = await evaluateFormula('d20');
  const success = roll.total <= actor.system.virtues[virtue].value;

  await showChatMessage({
    actor,
    title: game.i18n.localize("MB.Save"),
    outcomes: [{
      type: 'save',
      title: success ? game.i18n.localize("MB.Success") : game.i18n.localize("MB.Failure"),
      formulaLabel: game.i18n.format("MB.SaveFormulaLabel", {
        formula: 'd20',
        virtue: game.i18n.localize(`MB.Actor.Virtues.${virtue}`),
        value: actor.system.virtues[virtue].value
      }),
      roll: roll
    }]
  });
};
