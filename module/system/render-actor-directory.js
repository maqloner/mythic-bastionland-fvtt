import { generateKnight } from "../generators/generate-knight.js";
import { generateNpc } from "../generators/generate-npc.js";
import { generateSquire } from "../generators/generate-squire.js";
import { generateWarband } from "../generators/generate-warband.js";

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
      "<button class=\"generate-knight-button\"><i class=\"fas fa-dice-d20\"></i>Generate Knight</button>",
      "<button class=\"generate-squire-button\"><i class=\"fas fa-dice-d20\"></i>Generate Squire</button>"
    ];

    if (game.user.isGM) {
      buttons.push("<button class=\"generate-warband-button\"><i class=\"fas fa-dice-d20\"></i>Generate Warband</button>");
      buttons.push("<button class=\"generate-npc-button\"><i class=\"fas fa-dice-d20\"></i>Generate NPC</button>");
    }

    header.insertAdjacentHTML(
      "afterbegin",
      `
      <div class="action-buttons flexrow">
        ${buttons.join("")}
      </div>
      `
    );

    header.querySelector(".generate-knight-button").addEventListener("click", () => {
      generateKnight();
    });

    header.querySelector(".generate-squire-button").addEventListener("click", () => {
      generateSquire();
    });

    if (game.user.isGM) {
      header.querySelector(".generate-npc-button").addEventListener("click", () => {
        generateNpc();
      });
      header.querySelector(".generate-warband-button").addEventListener("click", () => {
        generateWarband();
      });
    }
  }
};
