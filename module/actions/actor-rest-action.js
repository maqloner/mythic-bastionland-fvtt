import { showChatMessage } from "../chat-message/show-chat-message.js";

/**
 * @param {Actor} actor
 * @returns {Promise.<void>}
 */
export const actorRestAction = async (actor) => {
  const originalValue = actor.system.guard.value;
  const maxValue = actor.system.guard.max;
  const outcomes = [];

  if (originalValue !== maxValue) {
    outcomes.push({
      type: "rest",
      title: game.i18n.localize("MB.Actor.Guard"),
      description: game.i18n.format("MB.VirtueRestored", {
        virtue: game.i18n.localize("MB.Actor.Guard"),
        value: originalValue,
        max: maxValue
      })
    });
  }

  if (actor.system.fatigue) {
    outcomes.push({
      type: "fatigue",
      title: game.i18n.localize("MB.Actor.Fatigue"),
      description: game.i18n.localize("MB.FatigueRemoved")
    });
  }

  if (outcomes.length) {
    await actor.update({
      "system.guard.value": maxValue,
      "system.fatigue": false
    });

    await showChatMessage({
      actor,
      title: game.i18n.localize("MB.Rest"),
      outcomes: outcomes
    });
  }
};
