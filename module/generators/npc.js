import { config } from "../config.js";
import { generateName, generateVirtues, generateGuard, generateAge, findRandomCoreTools, findRandomCoreWeapons, findRandomCoreArmours, findRandomCoreBeasts, findRandomCorePeople, findRandomCoreSteeds, generateSoldierType, findRandomKnightType, findKnightItems, drawKnightRollTables, findKnightCommonItems, generateBiography, findKnightActors } from "./generator.js";
import { createOrUpdateActor } from "../utils/actor.js";
import { showGenerateNpcDialog } from "../applications/dialog/generate-npc-dialog.js";
import { generateSquire } from "./squire.js";

/**
 * @returns {Actor}
 */
export const createNpc = async (actor) => {
  const [actorData, linkedActors] = await generateNpc(actor?.flags?.generator ?? {});
  return createOrUpdateActor(actorData, actor, linkedActors);
};

export const generateNpc = async (originalConfig) => {
  const generatorConfig = await showGenerateNpcDialog(originalConfig);
  const [actorData, linkedActors] = await getActorData(generatorConfig);
  return [actorData, linkedActors];
};

const getActorData = async (generatorConfig) => {
  switch (generatorConfig.type) {
    case "person":
      return generatePerson(generatorConfig);
    case "knight":
      return generateNpcKnight(generatorConfig);
    case "soldier":
      return generateSoldier(generatorConfig);
  }
};

const generateBaseNPC = async (generatorConfig) => {
  return {
    name: await generateName(),
    type: config.actorTypes.npc,
    system: {
      ...await generateVirtues(generatorConfig.virtues),
      ...await generateGuard(generatorConfig.guard),
      ...await generateAge(),
      biography: await generateBiography(generatorConfig),
      actors: []
    },
    flags: getFlags(generatorConfig)
  };
};

const generatePerson = async (generatorConfig) => {
  const npcData = await generateBaseNPC(generatorConfig);
  npcData.items = [
    ...await findRandomCoreTools(generatorConfig.tools),
    ...await findRandomCoreWeapons(generatorConfig.weapons),
    ...await findRandomCoreArmours(generatorConfig.armors)
  ];
  return [npcData, await getActors(generatorConfig)];
};

const generateSoldier = async (generatorConfig) => {
  const npcData = await generateBaseNPC(generatorConfig);
  npcData.name = await generateSoldierType();
  npcData.items = [
    ...await findRandomCoreTools(generatorConfig.tools),
    ...await findRandomCoreWeapons(generatorConfig.weapons),
    ...await findRandomCoreArmours(generatorConfig.armors)
  ];

  return [npcData, await getActors(generatorConfig)];
};

const generateNpcKnight = async (generatorConfig) => {
  const npcData = await generateBaseNPC(generatorConfig);

  const knight = await findRandomKnightType(false);
  const items = await findKnightItems(knight);
  const tables = await drawKnightRollTables(knight);
  const knightItem = items.filter(item => item.type === config.itemTypes.knight).shift();
  const otherItems = items.filter(item => item.type !== config.itemTypes.knight);

  npcData.type = config.actorTypes.knight;
  npcData.system.knight = knight;

  if (knightItem && tables) {
    npcData.system.biography = (await generateBiography({ knight: true }, { item: knightItem, tables })) + npcData.system.biography;
  }

  npcData.items = [
    ...await findKnightCommonItems(),
    ...(
      otherItems.length
        ? [...otherItems]
        : [
          ...await findRandomCoreWeapons(generatorConfig.weapons),
          ...await findRandomCoreArmours(generatorConfig.armors)
        ]
    )
  ];

  const knightActors = await findKnightActors(knight);
  const hasSteed = knightActors.some((actor) => actor.type === config.actorTypes.steed);
  const linkedActors = await getActors({ ...generatorConfig, steed: hasSteed ? false : generatorConfig.steed });

  return [npcData, [...knightActors, ...linkedActors]];
};

const getActors = async ({ squire = false, beast = false, person = false, steed = false }) => {
  const generators = [
    [squire, generateSquire],
    [beast, findRandomCoreBeasts],
    [person, findRandomCorePeople],
    [steed, findRandomCoreSteeds]
  ];
  const actors = [];
  for (const [enable, generator] of generators) {
    if (enable) {
      const [actor] = await generator();
      actors.push(actor);
    }
  }
  return actors;
};

const getFlags = (generatorConfig) => {
  return {
    generator: {
      ...generatorConfig
    }
  };
};
