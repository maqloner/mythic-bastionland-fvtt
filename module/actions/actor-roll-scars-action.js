import { showChatMessage } from "../chat-message/show-chat-message.js";
import { showRollScarDialog } from "../applications/dialog/roll-scar-dialog.js";
import { drawScar, findTableItems } from "../utils/compendium.js";
import { evaluateFormula } from "../utils/formula.js";

/**
 * @param {Actor} actor
 * @returns {Promise.<void>}
 */
export const actorRollScarsAction = async (actor) => {
  const { die } = await showRollScarDialog(actor);
  const draw = await drawScar({ roll: await evaluateFormula(die) });
  const item = (await findTableItems(draw.results))[0];

  await actor.createEmbeddedDocuments("Item", [item]);

  await showChatMessage({
    actor,
    title: game.i18n.localize("MB.RollScar"),
    outcomes: [{
      type: 'roll-scar',
      title: item.name,
      formulaLabel: draw.roll.formula,
      roll: draw.roll,
      description: item.system.description,
    }]
  });
};
