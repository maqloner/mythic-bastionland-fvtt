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
  const roll = await evaluateFormula(getRollFormula(damageSources));

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
    description: getDescription(damageSources),
    outcomes: [outcome]
  });
};

const getDamageSources = async (actor, { weapons = [], steeds = [], impairedWeapons = [], impairedSteeds = [], bonusDice = "", overrideDamage = "", impaired = false, smite = false, smiteType = "damage" }) => {
  const linkedActors = (await findlinkedActors(actor)).filter(actor => steeds.includes(actor.id));
  const items = actor.items.filter(item => weapons.includes(item.id));

  const itemSources = items.map(item => source(item.name, item.system.damage, impairedWeapons.includes(item.id)));
  const steedSources = linkedActors.map(actor => source(actor.name, actor.system.trample, impairedSteeds.includes(actor.id)));

  const impairedSource = impaired ? [source(game.i18n.localize("MB.Impaired"), "d4")] : [];
  const overrideSource = overrideDamage ? [source(game.i18n.localize("MB.Override"), overrideDamage)] : [];
  const bonusSource = bonusDice ? [source(game.i18n.localize("MB.BonusDice"), bonusDice)] : [];
  const smiteSource = smite && smiteType === "damage" ? [source(game.i18n.localize("MB.Smite"), "d12")] : [];

  switch (true) {
    case impaired:
      return [...impairedSource, ...bonusSource, ...smiteSource];
    case !!overrideDamage:
      return [...overrideSource, ...bonusSource, ...smiteSource];
    default:
      return [...itemSources, ...steedSources, ...bonusSource, ...smiteSource];
  }
};

const getDescription = (sources) => sources.map(source => sourceDescription(source));

const getRollFormula = (sources) => sources.map(source => sourceFormula(source)).join(" + ");

const getButtons = (actor, { smite = false }) => {
  const focusButton = actor.type === config.actorTypes.knight ? [button(game.i18n.localize("MB.Focus"), "focus")] : [];
  const smiteButton = smite ? [button(game.i18n.localize("MB.Smite"), "smite")] : [];
  return [...smiteButton, ...focusButton];
};

const source = (name, damage, impaired = false) => ({ name, impaired, damage });

const button = (title, action) => ({ title, data: { "action": action } });

const sourceDescription = (source) => `${source.name} (${source.impaired ? `d4, ${game.i18n.localize("MB.Impaired")}` : source.damage})`;

const sourceFormula = (source) => (source.impaired ? "d4" : source.damage);
