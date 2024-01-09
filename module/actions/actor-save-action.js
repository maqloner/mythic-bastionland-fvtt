import { showChatMessage } from "../chat-message/show-chat-message.js";
import { evaluateFormula } from "../utils/utils.js";

/**
 * @param {Actor} actor
 * @param {Object} data
 * @param {String} [data.virtue]
 * @param {Boolean} [data.applyFatigue=false]
 */
export const actorSaveAction = async (actor, { virtue, applyFatigue = false }) => {
  const roll = await evaluateFormula("d20");
  const success = roll.total <= actor.system.virtues[virtue].value;

  if (applyFatigue && !success) {
    await actor.update({ "system.fatigue": true });
  }

  const outcome = {
    type: "save",
    title: success ? game.i18n.localize("MB.Success") : game.i18n.localize("MB.Failure"),
    formulaLabel: game.i18n.format("MB.SaveFormulaLabel", {
      formula: "d20",
      virtue: game.i18n.localize(`MB.Actor.Virtues.${virtue}`),
      value: actor.system.virtues[virtue].value
    }),
    roll: roll,
    description: (applyFatigue && !success) ? game.i18n.localize("MB.Actor.ApplyFatigued") : ""
  };

  await showChatMessage({
    actor,
    title: game.i18n.format("MB.Save", {
      virtue: game.i18n.localize(`MB.Actor.Virtues.${virtue}`)
    }),
    outcomes: [outcome]
  });
};
