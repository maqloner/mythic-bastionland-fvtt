import { config } from "../config.js";
import { MBActorSheet } from "../sheet/actor-sheet.js";
import { MBitemSheet } from "../sheet/item-sheet.js";
import { showChatMessage } from "../chat-message/show-chat-message.js";
import * as compendium from "../utils/compendium.js";
import * as formula from "../utils/formula.js";
import { MBChatMessage } from "../chat-message/chat-message.js";
import { renderNavigation } from "./render-navigation.js";

export const configureSystem = () => {
  
  game.MythicBastionland = {
    config,
    api: {
      showChatMessage,
      compendium,
      formula,      
    }
  };

  CONFIG.ChatMessage.documentClass = MBChatMessage;

  Actors.unregisterSheet("core", ActorSheet);

  Actors.registerSheet("mythicbastionland", MBActorSheet, {
    types: ["knight", "npc", "creature", "steed", "warband"],
    makeDefault: true,
    label: "MB.SheetActor"
  });

  Items.unregisterSheet("core", ItemSheet);

  Items.registerSheet("mythic-bastionland", MBitemSheet, {
    makeDefault: true,
    label: "MB.SheetItem",
  });

  Hooks.on("preCreateActor", (actor) => {
    actor.updateSource(config.actorDefaults[actor.type]);
  });

  Hooks.on("preCreateItem", (item) => {
    item.updateSource(config.itemDefaults[item.type]);
  });

  Hooks.on("getSceneNavigationContext", renderNavigation);
};
