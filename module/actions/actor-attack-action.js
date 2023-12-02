import { showChatMessage } from "../chat-message/show-chat-message.js";
import { showAttackDialog } from "../dialog/attack-dialog.js";


/**
 * @param {Actor} actor
 * @returns {Promise.<void>}
 */
export const actorAttackAction = async (actor) => {
  const { damage, armor, virtue, exposed } = await showAttackDialog({ actor });

  const guard = actor.system.guard.value;
  const value = actor.system.virtues[virtue].value;

  const finalDamage = damage - armor;
  const leftover = exposed ? -finalDamage : guard - finalDamage;
  const isScar = leftover === 0;
  const isEvaded = leftover > 0;
  const isWounded = leftover < 0;
  const newValue = isWounded ? Math.max(value + leftover, 0) : value;
  const newGuard = exposed ? guard : (isWounded ? 0 : guard - finalDamage);
  const isMortalWound = isWounded ? newValue <= (value / 2) : false;
  const isSlain = newValue === 0;

  const outcome = {
    type: 'take-damage',
    title: getTitle({ isScar, isSlain, isEvaded, isWounded, isMortalWound }),
    description: getDescription({ exposed, armor, virtue, guard, newGuard, value, newValue }),
    formulaLabel: game.i18n.format("MB.MessageDamage", {
      damage, 
      armor
    }),
    formulaNumber: finalDamage,
    button: getButton({ isScar })
  }

  await actor.update({
    "system.guard.value": newGuard,
    [`system.virtues.${virtue}.value`]: newValue
  })

  await showChatMessage({
    actor,
    title: game.i18n.localize("MB.TakeDamage"),
    outcomes: [outcome]
  });
};

const getTitle = ({ isScar, isSlain, isEvaded, isWounded, isMortalWound }) => {
  switch (true) {
    case isSlain:
      return game.i18n.localize("MB.Slain");
    case isMortalWound:
      return game.i18n.localize("MB.MortalWounded");
    case isWounded:
      return game.i18n.localize("MB.Wounded");
    case isEvaded:
      return game.i18n.localize("MB.Evaded");
    case isScar:
      return game.i18n.localize("MB.Scar");
  }
}

const getDescription = ({ exposed, virtue, guard, newGuard, value, newValue }) => {
  const description = [];

  if (exposed) {
    description.push(game.i18n.localize("MB.Exposed"));
  }

  if (guard !== newGuard) {
    description.push(game.i18n.format("MB.MessageGuard", {
      guard,
      newGuard
    }));
  }

  if (value !== newValue) {
    description.push(game.i18n.format("MB.MessageVirtueDamage", {
      virtue: game.i18n.localize(`MB.Actor.Virtues.${virtue}`),
      value,
      newValue
    }));
  }

  return description;
}

const getButton = ({ isScar }) => {
  if (isScar) {
    return {
      title: game.i18n.localize("MB.RollScar"),
      data: {
        "action": "roll-scar"
      }
    }
  }
  return;
}
