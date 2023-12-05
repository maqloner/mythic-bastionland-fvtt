import { config } from "../config.js";
import { generateKnight } from "../generators/generate-knight.js";
import { generateNpc } from "../generators/generate-npc.js";
import { generateSquire } from "../generators/generate-squire.js";
import { generateWarband } from "../generators/generate-warband.js";

/**
 * @param {Actor} actor 
 */
export const actorRegenerateAction = async (actor) => {
  Dialog.confirm({
    title: game.i18n.localize("MB.RegenerateConfirmTitle"),
    content: game.i18n.localize("MB.RegenerateConfirmContent"),
    yes: () => {
      switch (true) {
        case actor.type === config.actorTypes.knight:
          return generateKnight(actor);
        case actor.type === config.actorTypes.npc:
          return generateNpc(actor);
        case actor.type === config.actorTypes.warband:
          return generateWarband();
        case actor.type === config.actorTypes.squire:
          return generateSquire(actor);
      }
    },
    defaultYes: false
  });
};
