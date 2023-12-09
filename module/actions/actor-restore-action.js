import { showChatMessage } from "../chat-message/show-chat-message.js";
import { showRestoreDialog } from "../applications/dialog/restore-dialog.js";

/**
 * @param {Actor} actor
 */
export const actorRestoreAction = async (actor) => {
  const virtues = await showRestoreDialog(actor);

  const { outcomes, updates } = Object.entries(virtues)
    .filter(virtue => virtue[1])
    .map(virtue => virtue[0])
    .reduce((result, virtue) => {
      result.outcomes = [...(result.outcomes ?? []), ...[createRestoreOutcome(actor, virtue)]];
      result.updates = { ...(result.updates ?? {}), ...{ [`system.virtues.${virtue}.value`]: actor.system.virtues[virtue].max } };
      return result;
    }, {});

  await actor.update(updates);

  await showChatMessage({
    actor,
    title: game.i18n.localize("MB.Restore"),
    outcomes: outcomes
  });
};

const createRestoreOutcome = (actor, virtue) => ({
  type: "restore",
  title: game.i18n.localize(`MB.Actor.Virtues.${virtue}`),
  description: game.i18n.format("MB.VirtueRestored", {
    virtue: game.i18n.localize(`MB.Actor.Virtues.${virtue}`),
    value: actor.system.virtues[virtue].value,
    max: actor.system.virtues[virtue].max
  })
});
