import { showChatMessage } from "../chat-message/show-chat-message.js";
import { config } from "../config.js";

export const preCreateItem = (item, data) => {
  if (!data.img) {
    return item.updateSource(config.itemDefaults[item.type]);
  }
};

export const preCreateActor = (actor, data) => {
  if (!data.img) {
    return actor.updateSource(config.actorDefaults[actor.type]);
  }
};

export const preDeleteActor = (actor) => {
  var parentActors = game.actors.filter(parent => parent.system.actors.includes(actor.uuid));
  for (const parentActor of parentActors) {
    parentActor.update({ "system.actors": parentActor.system.actors.filter(child => child !== actor.uuid) });
    if (parentActor.sheet.rendered) {
      parentActor.sheet.render(true);
    }
  }
};

export const updateActor = (actor) => {
  var parentActors = game.actors.filter(parent => parent.system.actors.includes(actor.uuid));
  for (const parentActor of parentActors) {
    if (parentActor && parentActor.sheet.rendered) {
      parentActor.sheet.render(true);
    }
  }
};

export const ready = async () => {
  if (game.user.isGM) {
    await showChatMessage({
      title: "Mythic Bastionland",
      description: "by Chris McDowall",
      outcomes: [
        {
          title: "Bastionland",
          description: "<a href='https://www.bastionland.com/'>Bastionland Blog</a>"
        },
        {
          title: "Buy the Book",
          description: "<a href='https://bastionlandpress.com/products/mythic-bastionland-hardback-book-plus-pdf'>Buy the Book</a>"
        },
        {
          title: "Quickstart Rules",
          description: "<a href='https://chrismcdee.itch.io/mythic-bastionland'>Quickstart Rules</a>"
        },
        {
          title: "Foundry VTT",
          description: "<a href='https://github.com/maqloner/mythic-bastionland/blob/main/how-to-use-this-system.md'>How to use this system</a>"
        }
      ]
    });
  }
};
