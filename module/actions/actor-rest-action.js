import { showChatMessage } from "../chat-message/show-chat-message.js";

/**
 * @param {Actor} actor
 */
export const actorRestAction = async (actor) => {
  const originalValue = actor.system.guard.value;
  const maxValue = actor.system.guard.max;

  const virtueOutcome = originalValue !== maxValue ? [{
    type: "rest",
    title: game.i18n.localize("MB.Actor.Guard"),
    description: game.i18n.format("MB.VirtueRestored", {
      virtue: game.i18n.localize("MB.Actor.Guard"),
      value: originalValue,
      max: maxValue
    })
  }] : [];

  const fatigueOutcome = actor.system.fatigue ? [{
    type: "fatigue",
    title: game.i18n.localize("MB.Actor.Fatigued"),
    description: game.i18n.localize("MB.FatiguedRemoved")
  }] : [];

  const outcomes = [...virtueOutcome, ...fatigueOutcome];

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
