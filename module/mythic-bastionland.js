import { configureHandlebar } from "./system/configure-handlebar.js";
import { configureSystem } from "./system/configure-system.js";
import { handleChatMessageButton } from "./system/render-chat-message.js";
// import { renderActorDirectory } from "./module/system/render-actor-directory.js";

Hooks.once("init", async () => {
  console.log(`Initializing Nythic Bastionland System`);
  configureHandlebar();
  configureSystem();
});

Hooks.on("renderChatMessage", handleChatMessageButton);
// Hooks.on("renderActorDirectory", renderActorDirectory);
