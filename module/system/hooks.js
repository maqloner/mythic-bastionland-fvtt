import { config } from "../config.js";

export const preCreateItem = (item) => item.updateSource(config.itemDefaults[item.type]);

export const preCreateActor = (actor) => actor.updateSource(config.actorDefaults[actor.type]);

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
