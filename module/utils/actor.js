
export const createOrUpdateActor = async (actorData, actor = null, linkedActorsData = []) => {
  actorData.system.actors = await createLinkedActors(linkedActorsData);
  if (actor) {
    await clearActor(actor);
    await actor.update(actorData);
    return actor;
  } else {
    const newActor = await Actor.create(actorData);
    newActor.sheet.render(true);
    return newActor;
  }
};

const clearActor = async (actor) => {
  await actor.deleteEmbeddedDocuments("Item", [], { deleteAll: true, render: false });
  if (game.user.isGM) {
    for (const existingChildActorUuid of actor.system.actors) {
      const existingChildActor = await fromUuid(existingChildActorUuid);
      if (existingChildActor) {
        await existingChildActor.delete();
      }
    }
  } else {
    ui.notifications.info(game.i18n.localize("MB.RegenerateActorWarning"));
  }
};

const createLinkedActors = async (linkedActorsData) => {
  const linkedActors = [];
  for (const linkedActorData of linkedActorsData) {
    linkedActors.push(await Actor.create(linkedActorData));
  }
  return linkedActors.map(linkedActor => linkedActor.uuid);
};
