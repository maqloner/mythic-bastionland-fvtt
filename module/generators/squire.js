import { config } from "../config.js";
import { generateGuard, findCoreItem, findCoreRollTableItems, generateName, generateVirtues, findCoreActor, generateBiography } from "./generator.js";
import { createOrUpdateActor } from "../utils/actor.js";

/**
 * @returns {Actor}
 */
export const createSquire = async (actor) => {
  const [actorData, linkedActors] = await generateSquire();
  return createOrUpdateActor(actorData, actor, linkedActors);
};

export const generateSquire = async () => {
  const actorData = {
    name: await generateName(),
    type: config.actorTypes.squire,
    system: {
      ...await generateVirtues("2d6"),
      ...await generateGuard("1"),
      biography: await generateBiography({ personality: true }),
      actors: []
    },
    items: [
      await findCoreItem("Dagger"),
      ...await findCoreRollTableItems("Squire equipment")
    ]
  };

  const linkedActors = [await findCoreActor("Pony")];

  return [actorData, linkedActors];
};

