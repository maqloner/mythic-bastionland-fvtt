import { MBActorSheet } from "../applications/sheet/actor-sheet.js";
import { MBitemSheet } from "../applications/sheet/item-sheet.js";
import { MBChatMessage } from "../chat-message/chat-message.js";

export const configureSystem = () => {

  CONFIG.ChatMessage.documentClass = MBChatMessage;

  foundry.documents.collections.Actors.unregisterSheet("core", ActorSheet);
  
  foundry.documents.collections.Actors.registerSheet(game.system.id, MBActorSheet, {
    types: ["knight", "npc", "creature", "steed", "warband", "squire"],
    makeDefault: true,
    label: "MB.SheetActor"
  });

  foundry.documents.collections.Items.unregisterSheet("core", ItemSheet);

  foundry.documents.collections.Items.registerSheet(game.system.id, MBitemSheet, {
    makeDefault: true,
    label: "MB.SheetItem"
  });
};
