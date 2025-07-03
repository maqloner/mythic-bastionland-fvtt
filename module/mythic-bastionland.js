import { configureHandlebar } from "./system/configure-handlebar.js";
import { configureSystem } from "./system/configure-system.js";
import { preCreateActor, preCreateItem, preDeleteActor, ready, updateActor } from "./system/hooks.js";
import { renderActorDirectory } from "./system/render-actor-directory.js";
import { renderNavigation } from "./system/render-navigation.js";
import { showChatMessage } from "./chat-message/show-chat-message.js";
import * as compendium from "./utils/compendium.js";
import * as generator from "./generators/generator.js";
import * as utils from "./utils/utils.js";
import * as importData from "./data/import-data.js";

Hooks.once("init", async () => {
  console.log("Initializing Mythic Bastionland System");
  
  game.MB = {
    configureHandlebar,
    generator,
    showChatMessage,
    compendium,
    utils,
    importData
  };

  configureHandlebar();
  configureSystem();
});

Hooks.on("preCreateActor", preCreateActor);
Hooks.on("preDeleteActor", preDeleteActor);
Hooks.on("updateActor", updateActor);
Hooks.on("preCreateItem", preCreateItem);
Hooks.on("ready", ready);

Hooks.on("renderSceneNavigation", renderNavigation);
Hooks.on("renderActorDirectory", renderActorDirectory);

