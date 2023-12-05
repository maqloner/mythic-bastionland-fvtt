import { config } from "../config.js";
import { generateName, generateVirtues, generateGuard, generateAge, generatePersonality, generateDesire, generateTask, generateRandomArmours, generateRandomTools, generateRandomWeapons, generateSoldierType, formatBiography, createOrUpdateActor } from "./generator.js";

/**
 * @returns {Actor}
 */
export const generateSoldier = async (actor) => {

  const actorData = {
    name: `${await generateName()} (${await generateSoldierType()})`,
    type: config.actorTypes.npc,
    system: {
      ...await generateVirtues("d12 + d6"),
      ...await generateGuard(),
      ...await generateAge(),
      biography: formatBiography(
        await generatePersonality(),
        await generateDesire(),
        await generateTask()
      ),
      actors: []
    },
    items: [
      ...await generateRandomTools("2d2 - 1"),
      ...await generateRandomWeapons("1d2"),
      ...await generateRandomArmours("1d2")
    ]    
  };

  return createOrUpdateActor(actorData, actor);
};
