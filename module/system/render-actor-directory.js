import { createKnight } from "../generators/knight.js";
import { createNpc } from "../generators/npc.js";
import { createSquire } from "../generators/squire.js";
import { createWarband } from "../generators/warband.js";

/**
 * @param {AppDirectory} app_directory
 */
export const renderActorDirectory = () => {
  
  if(document.querySelector(".mtl-actor-buttons")) {
    // If the buttons already exist, do not add them again
    return;
  }
  
  if (game.user.can("ACTOR_CREATE")) {

    const sectionElement = document.querySelector("#actors");

    const header = document.createElement("header");
    header.classList.add("directory-header");
    header.classList.add("flexcol");
    header.classList.add("mtl-actor-buttons");

    
    const existingButtons = sectionElement.querySelector(".directory-header");
    sectionElement.insertBefore(header, existingButtons);

    const buttons = [
      `<button class="generate-knight-button"><i class="fas fa-dice-d20"></i>${game.i18n.localize("MB.GenerateKnight")}</button>`,
      `<button class="generate-squire-button"><i class="fas fa-dice-d20"></i>${game.i18n.localize("MB.GenerateSquire")}</button>`
    ];

    if (game.user.isGM) {
      buttons.push(`<button class="generate-warband-button"><i class="fas fa-dice-d20"></i>${game.i18n.localize("MB.GenerateWarband")}</button>`);
      buttons.push(`<button class="generate-npc-button"><i class="fas fa-dice-d20"></i>${game.i18n.localize("MB.GenerateNPC")}</button>`);
    }

    header.insertAdjacentHTML(
      "afterbegin",
      `
      <div class="header actions action-buttons flexrow">
        ${buttons.join("")}
      </div>
      `
    );

    header.querySelector(".generate-knight-button").addEventListener("click", () => createKnight());
    header.querySelector(".generate-squire-button").addEventListener("click", () => createSquire());
    if (game.user.isGM) {
      header.querySelector(".generate-npc-button").addEventListener("click", () => createNpc());
      header.querySelector(".generate-warband-button").addEventListener("click", () => createWarband());
    }
  }
};
