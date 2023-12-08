import { config } from "../config.js";
import { generateGuard, findKnightActors, findKnightCommonItems, findKnightItems, findRandomKnightType, generateName, generateVirtues, drawKnightRollTables, generateBiography } from "./generator.js";
import { createOrUpdateActor } from "../utils/actor.js";

/**
 * @returns {Actor}
 */
export const createKnight = async (actor) => {
  const [actorData, linkedActors] = await generateKnight();
  return createOrUpdateActor(actorData, actor, linkedActors);
};

export const generateKnight = async () => {
  const knight = await findRandomKnightType();
  const items = await findKnightItems(knight);
  const tables = await drawKnightRollTables(knight);
  const knightItem = items.filter(item => item.type === config.itemTypes.knight).shift();

  const actorData = {
    name: await generateName(),
    type: config.actorTypes.knight,
    system: {
      knight,
      ...await generateVirtues("d12 + d6"),
      ...await generateGuard("d6"),
      biography: await generateBiography({ knight: true }, { item :knightItem, tables }),
      actors: []
    },
    items: [
      ...await findKnightCommonItems(),
      ...items.filter(item => item.type !== config.itemTypes.knight)
    ]
  };

  const linkedActors = await findKnightActors(knight);
  return [actorData, linkedActors];
};
