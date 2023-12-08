import { showChatMessage } from "../chat-message/show-chat-message.js";
import { config } from "../config.js";
import { evaluateFormula } from "../utils/utils.js";
import { actorSaveAction } from "./actor-save-action.js";

/**
 * @param {Actor} actor
 * @returns {Promise.<void>}
 */
export const actorInlineRollAction = async (actor, formula, flavor, source, applyFatigue) => {

  if (["vigour", "clarity", "spirit"].includes(flavor)) {
    return actorSaveAction(actor, flavor, applyFatigue);
  }

  const roll = await evaluateFormula(formula);

  const outcome = {
    type: flavor ?? "inline-roll",
    title: source ?? "",
    formulaLabel: roll.formula,
    roll: roll,
    button: getButton(actor, flavor)
  };

  await showChatMessage({
    actor,
    title: getTitle(flavor),
    outcomes: [outcome]
  });
};

const getTitle = (flavor) => {
  switch (true) {
    case flavor === "damage":
      return game.i18n.localize("MB.Damage");
    default:
      return game.i18n.localize("MB.Roll");
  }
};

const getButton = (actor, flavor) => {
  switch (true) {
    case actor && actor.type === config.actorTypes.knight && flavor === "damage":
      return {
        title: game.i18n.localize("MB.Focus"),
        data: {
          "action": "focus"
        }
      };
  }
};
