import { MBActorSheet } from "../applications/sheet/actor-sheet.js";
import { MBitemSheet } from "../applications/sheet/item-sheet.js";
import { MBChatMessage } from "../chat-message/chat-message.js";
import { CreatureData } from "../models/actor/creature-data.js";
import { KnightData } from "../models/actor/knight-data.js";
import { NpcData } from "../models/actor/npc-data.js";
import { SquireData } from "../models/actor/squire-data.js";
import { SteedData } from "../models/actor/steed-data.js";
import { WarbandData } from "../models/actor/warband-data.js";
import { AbilityData } from "../models/item/ability-data.js";
import { CoatData } from "../models/item/coat-data.js";
import { HelmData } from "../models/item/helm-data.js";
import { KnightItemData } from "../models/item/knight-item-data.js";
import { MiscData } from "../models/item/misc-data.js";
import { PassionData } from "../models/item/passion-data.js";
import { PlateData } from "../models/item/plate-data.js";
import { ScarData } from "../models/item/scar-data.js";
import { ShieldData } from "../models/item/shield-data.js";
import { WeaponData } from "../models/item/weapon-data.js";

export const configureSystem = () => {

  CONFIG.ChatMessage.documentClass = MBChatMessage;

  CONFIG.Actor.dataModels.knight = KnightData;
  CONFIG.Actor.dataModels.npc = NpcData;
  CONFIG.Actor.dataModels.squire = SquireData;
  CONFIG.Actor.dataModels.steed = SteedData;
  CONFIG.Actor.dataModels.warband = WarbandData;
  CONFIG.Actor.dataModels.creature = CreatureData;

  CONFIG.Item.dataModels.ability = AbilityData;
  CONFIG.Item.dataModels.coat = CoatData;
  CONFIG.Item.dataModels.helm = HelmData;
  CONFIG.Item.dataModels.knight = KnightItemData;
  CONFIG.Item.dataModels.misc = MiscData;
  CONFIG.Item.dataModels.passion = PassionData;
  CONFIG.Item.dataModels.plate = PlateData;
  CONFIG.Item.dataModels.scar = ScarData;
  CONFIG.Item.dataModels.shield = ShieldData;
  CONFIG.Item.dataModels.weapon = WeaponData;


  foundry.documents.collections.Actors.unregisterSheet("core", foundry.appv1.sheets.ActorSheet);

  foundry.documents.collections.Actors.registerSheet(game.system.id, MBActorSheet, {
    types: ["knight", "npc", "creature", "steed", "warband", "squire"],
    makeDefault: true,
    label: "MB.SheetActor"
  });

  foundry.documents.collections.Items.unregisterSheet("core", foundry.appv1.sheets.ItemSheet);

  foundry.documents.collections.Items.registerSheet(game.system.id, MBitemSheet, {
    makeDefault: true,
    label: "MB.SheetItem"
  });

  game.settings.register("mythicbastionland", "MB.AllowPlayerRegenerateButton", {
    name: game.i18n.localize("MB.AllowPlayerRegenerateButtonSettingName"),
    hint: game.i18n.localize("MB.AllowPlayerRegenerateButtonSettingHint"),
    scope: "world",
    config: true,
    requiresReload: false,
    type: Boolean,
    default: true
  });

  game.settings.register("mythicbastionland", "MB.CombatEncounterMessages", {
    name: game.i18n.localize("MB.CombatEncounterSettingName"),
    hint: game.i18n.localize("MB.CombatEncounterSettingHint"),
    scope: "world",
    config: true,
    requiresReload: false,
    type: Boolean,
    default: true
  });
};
