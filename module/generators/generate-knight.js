import { config } from "../config.js";
import { generateBiography, generateGuard, findAllActorByKnightType, findKnightCommonItems, findAllItemByKnightType, findKnightMacro, findRandomKnightType, generateName, generatePersonality, generateVirtues, createOrUpdateActor } from "./generator.js";

/**
 * @returns {Actor}
 */
export const generateKnight = async (actor) => {

  const knight = await findRandomKnightType();

  const actorData = {
    name: await generateName(),
    type: config.actorTypes.knight,
    system: {
      knight,
      ...await generateVirtues("d12 + d6"),
      ...await generateGuard("d6"),
      biography: generateBiography(
        await generatePersonality()
      ),
      actors: []
    },
    items: [
      ...await findKnightCommonItems(),
      ...await findAllItemByKnightType(knight)
    ]
  };

  const linkedActors = await findAllActorByKnightType(knight);
  const macros = await findKnightMacro(knight);

  return createOrUpdateActor(actorData, actor, linkedActors);
};
