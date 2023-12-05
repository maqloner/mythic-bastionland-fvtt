import { configureHandlebar } from "./system/configure-handlebar.js";
import { configureSystem } from "./system/configure-system.js";
import { preCreateActor, preCreateItem, preDeleteActor, updateActor } from "./system/hooks.js";
import { renderActorDirectory } from "./system/render-actor-directory.js";
import { renderNavigation } from "./system/render-navigation.js";

Hooks.once("init", async () => {
  console.log("Initializing Nythic Bastionland System");
  configureHandlebar();
  configureSystem();
});

Hooks.on("preCreateActor", preCreateActor);
Hooks.on("preDeleteActor", preDeleteActor);
Hooks.on("updateActor", updateActor);
Hooks.on("preCreateItem", preCreateItem);

Hooks.on("getSceneNavigationContext", renderNavigation);
Hooks.on("renderActorDirectory", renderActorDirectory);
