import { showChatMessage } from "../chat-message/show-chat-message.js";
import { showRollScarDialog } from "../applications/dialog/roll-scar-dialog.js";
import { drawScar, findPackTableDocuments } from "../utils/compendium.js";
import { evaluateFormula } from "../utils/utils.js";

/**
 * @param {Actor} actor
 */
export const actorRollScarsAction = async (actor) => {
  const { die } = await showRollScarDialog(actor);
  const draw = await drawScar({ roll: await evaluateFormula(die) });
  const item = (await findPackTableDocuments(draw.results))[0];

  await actor.createEmbeddedDocuments("Item", [item]);

  await showChatMessage({
    actor,
    title: game.i18n.localize("MB.RollScar"),
    outcomes: [{
      type: "roll-scar",
      title: item.name,
      formulaLabel: draw.roll.formula,
      roll: draw.roll,
      description: item.system.description
    }]
  });
};
