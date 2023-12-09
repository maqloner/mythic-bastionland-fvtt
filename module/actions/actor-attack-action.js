import { showChatMessage } from "../chat-message/show-chat-message.js";
import { showAttackDialog } from "../applications/dialog/attack-dialog.js";
import { findlinkedActors } from "../utils/actor.js";
import { evaluateFormula } from "../utils/utils.js";
import { config } from "../config.js";


/**
 * @param {Actor} actor
 */
export const actorAttackAction = async (actor) => {
  const data = await showAttackDialog({ actor });
  const damageSources = await getDamageSources(actor, data);
  const roll = await evaluateFormula(getRollFormula(damageSources, data));

  const outcome = {
    type: "damage",
    title: game.i18n.localize("MB.Damage"),
    roll: roll,
    description: (data.smite && data.smiteType === "blast") ? game.i18n.localize("MB.Blast") : "",
    buttons: getButtons(actor, data)
  };

  await showChatMessage({
    actor,
    title: game.i18n.localize("MB.Attack"),
    description: getDescription(damageSources, data),
    outcomes: [outcome]
  });
};

const getDamageSources = async (actor, { weapons = [], steeds = [], impairedWeapons = [], impairedSteeds = [], bonusDice = "", overrideDamage = "", impaired = false, smite = false, smiteType = "damage" }) => {
  let damageSources = [];
  if (impaired) {
    damageSources.push({
      name: game.i18n.localize("MB.Impaired"),
      impaired: false,
      damage: "d4"
    });
  } else if (overrideDamage) {
    damageSources.push({
      name: game.i18n.localize("MB.Override"),
      impaired: false,
      damage: overrideDamage
    });
  } else {
    const linkedActors = (await findlinkedActors(actor)).filter(actor => steeds.includes(actor.id));

    damageSources = damageSources.concat(weapons.map(id => {
      const item = actor.items.get(id);
      return {
        name: item.name,
        impaired: impairedWeapons.includes(id),
        damage: item.system.damage
      };
    }));

    damageSources = damageSources.concat(linkedActors.map(actor => ({
      name: actor.name,
      impaired: impairedSteeds.includes(actor.id),
      damage: actor.system.trample
    })));
  }

  if (bonusDice) {
    damageSources.push({
      name: game.i18n.localize("MB.BonusDice"),
      impaired: false,
      damage: bonusDice
    });
  }

  if (smite && smiteType === "damage") {
    damageSources.push({
      name: game.i18n.localize("MB.Smite"),
      impaired: false,
      damage: "d12"
    });
  }

  return damageSources;
};

const getDescription = (damageSources) => {
  return damageSources
    .map(source => `${source.name} (${source.impaired ? `d4, ${game.i18n.localize("MB.Impaired")}` : source.damage})`);
};


const getRollFormula = (damageSources) => damageSources.map(source => source.impaired ? "d4" : source.damage).join(" + ");

const getButtons = (actor, { smite = false }) => {
  const buttons = [];

  if (actor.type === config.actorTypes.knight) {
    buttons.push({
      title: game.i18n.localize("MB.Focus"),
      data: { "action": "focus" }
    });
  }

  if (smite) {
    buttons.push({
      title: game.i18n.localize("MB.Smite"),
      data: { "action": "smite" }
    });
  }

  return buttons;
};
