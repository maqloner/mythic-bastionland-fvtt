import { config } from "../config.js";
import { generateName, generateVirtues, generateGuard, generateAge, generatePersonality, generateDesire, generateTask, findRandomCoreTools, findRandomCoreWeapons, generateBiography, createOrUpdateActor } from "./generator.js";

/**
 * @returns {Actor}
 */
export const generateNpc = async (actor) => {
  const actorData = {
    name: await generateName(),
    type: config.actorTypes.npc,
    system: {
      ...await generateVirtues("d12 + d6"),
      ...await generateGuard(),
      ...await generateAge(),
      biography: generateBiography(
        await generatePersonality(),
        await generateDesire(),
        await generateTask()
      ),
      actors: []
    },
    items: [
      ...await findRandomCoreTools("2d2 - 1"),
      ...await findRandomCoreWeapons("1d2 - 1")
    ]
  };

  return createOrUpdateActor(actorData, actor);
};

