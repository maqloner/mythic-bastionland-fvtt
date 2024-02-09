import { showChatMessage } from "../chat-message/show-chat-message.js";
import { config } from "../config.js";
import { drawKnightRollTables } from "../generators/generator.js";

import { evaluateFormula } from "../utils/utils.js";
import { actorSaveAction } from "./actor-save-action.js";

/**
 * 
 * @param {Actor} actor 
 * @param {Object} data
 * @param {String} data.formula 
 * @param {String} [data.flavor]
 * @param {String} [data.source]
 * @param {Boolean} [data.applyFatigue=false]
 * @returns 
 */
export const actorInlineRollAction = async (actor, { formula, flavor, source, applyFatigue = false }) => {
  if (["vigour", "clarity", "spirit"].includes(flavor)) {
    return actorSaveAction(actor, { virtue: flavor, applyFatigue });
  }

  if (flavor.includes("table-knight")) {
    return knightTableRoll(actor, { flavor });
  }

  await standardRoll(actor, { formula, flavor, source });
};

const standardRoll = async (actor, { formula, flavor, source }) => {
  const roll = await evaluateFormula(formula);

  const outcome = {
    type: flavor ?? "inline-roll",
    title: source ?? "",
    formulaLabel: flavor === "damage" ? "" : roll.formula,
    roll: roll,
    buttons: getButtons(actor, { flavor })
  };

  await showChatMessage({
    actor,
    title: getTitle({ flavor }),
    outcomes: [outcome]
  });
};

const getTitle = ({ flavor }) => {
  switch (true) {
    case flavor === "damage":
      return game.i18n.localize("MB.Damage");
    default:
      return game.i18n.localize("MB.Roll");
  }
};

const getButtons = (actor, { flavor }) => {
  switch (true) {
    case actor && actor.type === config.actorTypes.knight && flavor === "damage":
      return [{
        title: game.i18n.localize("MB.Focus"),
        data: { "action": "focus" }
      }];
  }
};

const knightTableRoll = async (actor, { flavor }) => {
  const draw = await drawKnightRollTables(flavor
    .replace("table-knight-", "")
    .replace(/^[-]*(.)/, (_, c) => c.toUpperCase())
    .replace(/[-]+(.)/g, (_, c) => " " + c.toUpperCase())
  );

  return showChatMessage({
    actor,
    title: game.i18n.localize("MB.Draw"),
    outcomes: [{
      type: "table-knight",
      title: Object.keys(draw)[0],
      description: Object.values(draw)[0]
    },
    {
      type: "table-knight",
      title: Object.keys(draw)[1],
      description: Object.values(draw)[1]
    }]
  });
};
