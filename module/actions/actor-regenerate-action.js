import { config } from "../config.js";
import { createKnight } from "../generators/knight.js";
import { createNpc } from "../generators/npc.js";
import { createSquire } from "../generators/squire.js";
import { createWarband } from "../generators/warband.js";

/**
 * @param {Actor} actor 
 */
export const actorRegenerateAction = async (actor) => {
  const regenerate = await foundry.applications.api.DialogV2.confirm({
    window: { title: "MB.RegenerateConfirmTitle" },
    content: game.i18n.localize("MB.RegenerateConfirmContent")
  });

  if (regenerate) {
    switch (true) {
      case actor.type === config.actorTypes.knight && !("generator" in actor.flags):
        return createKnight(actor);
      case actor.type === config.actorTypes.knight && ("generator" in actor.flags):
      case actor.type === config.actorTypes.npc:
        return createNpc(actor);
      case actor.type === config.actorTypes.warband:
        return createWarband(actor);
      case actor.type === config.actorTypes.squire:
        return createSquire(actor);
    }
  }
};
