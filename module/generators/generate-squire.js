import { config } from "../config.js";
import { generateBiography, generateGuard, findCoreItem, findItemsFromCoreRollTable, generateName, generatePersonality, generateVirtues, findCoreActor, createOrUpdateActor } from "./generator.js";

/**
 * @returns {Actor}
 */
export const generateSquire = async (actor) => {
  const actorData = {
    name: await generateName(),
    type: config.actorTypes.squire,
    system: {
      ...await generateVirtues("2d6"),
      ...await generateGuard("1"),
      biography: generateBiography(
        await generatePersonality()
      ),
      actors: []
    },
    items: [
      await findCoreItem("Dagger"),
      ...await findItemsFromCoreRollTable("Squire equipment")
    ]
  };

  const pony = await findCoreActor("Pony");
  const linkedActors = [{
    ...pony,
    name: `${pony.name} (${actorData.name})`,
    folder: null
  }];

  return createOrUpdateActor(actorData, actor, [linkedActors]);
};
