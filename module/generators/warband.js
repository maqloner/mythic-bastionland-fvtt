import { config } from "../config.js";
import { generateVirtues, generateGuard, generateSoldierType, findRandomCoreWeapons, findRandomCoreArmours, generateBiography } from "./generator.js";
import { createOrUpdateActor } from "../utils/actor.js";

/**
 * @returns {Actor}
 */
export const createWarband = async (actor) => {
  const [actorData] = await generateWarband();
  return createOrUpdateActor(actorData, actor);
};

/**
 * @returns {Actor}
 */
export const generateWarband = async () => {
  const actorData = {
    name: await generateSoldierType(),
    type: config.actorTypes.warband,
    system: {
      ...await generateVirtues("d12 + d6"),
      ...await generateGuard(),
      biography: await generateBiography({ conflict: true, heraldry: true, battlefield: true }),
      actors: []
    },
    items: [
      ...await findRandomCoreWeapons("1"),
      ...await findRandomCoreArmours("1d2")
    ]
  };
  return [actorData];
};
