import { config } from "../config.js";

export const preCreateItem = (item) => item.updateSource(config.itemDefaults[item.type]);

export const preCreateActor = (actor) => actor.updateSource(config.actorDefaults[actor.type]);

export const preDeleteActor = (actor) => {
  var parentActor = game.actors.find(parent => parent.system.actors.includes(actor.uuid));
  if (parentActor) {
    parentActor.update({ "system.actors": parentActor.system.actors.filter(child => child !== actor.uuid) });
    if (parentActor.sheet.rendered) {
      parentActor.sheet.render(true);
    }
  }
};

export const updateActor = (actor) => {
  var parentActor = game.actors.find(parent => parent.system.actors.includes(actor.uuid));
  if (parentActor && parentActor.sheet.rendered) {
    parentActor.sheet.render(true);
  }
};
