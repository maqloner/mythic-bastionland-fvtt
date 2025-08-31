const path = "/systems/mythicbastionland/module/data/compendium";

export const processAll = async () => {
  await processItems();
  await processRollTables();
  await processActors();
};

export const processItems = async () => {
  const coreItems = await foundry.utils.fetchJsonWithTimeout(`${path}/core-items.json`);
  const knightItems = await foundry.utils.fetchJsonWithTimeout(`${path}/knight-items.json`);

  await process([coreItems, knightItems], "Item", createItem);

};

export const processRollTables = async () => {
  const coreTables = await foundry.utils.fetchJsonWithTimeout(`${path}/core-tables.json`);
  const knightTables = await foundry.utils.fetchJsonWithTimeout(`${path}/knight-tables.json`);

  await process([coreTables, knightTables], "RollTable", createRollTable);
};

export const processActors = async () => {
  const coreActors = await foundry.utils.fetchJsonWithTimeout(`${path}/core-actors.json`);
  const knightActors = await foundry.utils.fetchJsonWithTimeout(`${path}/knight-actors.json`);

  await process([coreActors, knightActors], "Actor", createActor);
};

const process = async (data, type, creator, folderId = null) => {
  for (const { folders, items, name, sorting = "a" } of data) {
    const folder = await Folder.create({ name: name, type, folder: folderId, sorting: sorting });

    if (items) {
      for (const data of items) {
        await creator(data, folder.id);
      }
    }
    if (folders) {
      await process(folders, type, creator, folder.id);
    }
  }
};

const createItem = async ({ type, name, ...system }, folder = null) => Item.create({ type, name, system: createItemSystem(system), folder: folder });

const createItemSystem = ({ quantity, ...system }) => ({ ...system, ...quantity && { value: quantity } });

const createActor = async ({ type, name, items, ...system }, folder = null) => Actor.create({ type, name, items: createActorItems(items ?? []), system: createActorSystem(system), folder: folder });

const createActorItems = items => items.map(({ type, name, ...system }) => ({ type, name, system: createItemSystem({ ...system, equipped: true }) }));

const createActorSystem = ({ vigour, clarity, spirit, guard, ...system }) => ({
  ...system,
  ...(vigour || clarity || spirit) && {
    virtues: {
      ...vigour && { vigour: { value: vigour, max: vigour } },
      ...clarity && { clarity: { value: clarity, max: clarity } },
      ...spirit && { spirit: { value: spirit, max: spirit } }
    }
  },
  ...guard && { guard: { value: guard, max: guard } }
});

const createRollTable = async ({ name, formula, results }, folder = null) => RollTable.create({ name, formula, results: createRollTableResult(results), folder: folder });

const createRollTableResult = results => results.map(([min, max, text]) => ({ text, range: [min, max] }));

