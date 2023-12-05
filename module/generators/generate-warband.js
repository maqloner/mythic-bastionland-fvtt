import { config } from "../config.js";
import { generateVirtues, generateGuard, generateSoldierType, generateBiography, findRandomCoreWeapons, findRandomCoreArmours, generateHeraldry, generateBattlefield, generateCombatDescription, createOrUpdateActor } from "./generator.js";

/**
 * @returns {Actor}
 */
export const generateWarband = async (actor) => {
  const actorData = {
    name: await generateSoldierType(),
    type: config.actorTypes.warband,
    system: {
      ...await generateVirtues("d12 + d6"),
      ...await generateGuard(),
      biography: generateBiography(
        await generateCombatDescription(),
        await generateHeraldry(),
        await generateBattlefield()
      ),
      actors: []
    },
    items: [
      ...await findRandomCoreWeapons("1"),
      ...await findRandomCoreArmours("1d2")
    ]
  };
  return createOrUpdateActor(actorData, actor);
};
