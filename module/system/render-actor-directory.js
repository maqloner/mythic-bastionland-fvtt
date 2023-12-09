import { createKnight } from "../generators/knight.js";
import { createNpc } from "../generators/npc.js";
import { createSquire } from "../generators/squire.js";
import { createWarband } from "../generators/warband.js";

/**
 * @param {Application} app
 * @param {jQuery} html
 */
export const renderActorDirectory = (app, html) => {
  if (game.user.can("ACTOR_CREATE")) {
    const header = document.createElement("header");
    header.classList.add("directory-header");

    const dirHeader = html[0].querySelector(".directory-header");
    dirHeader.parentNode.insertBefore(header, dirHeader);

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
      <div class="action-buttons flexrow">
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
