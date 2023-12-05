import { config } from "../config.js";
import { drawSystemTableText, drawTableItems, findCompendiumItem } from "../utils/compendium.js";
import { evaluateFormula } from "../utils/formula.js";

export const createOrUpdateActor = async (actorData, actor = null, linkedActorsData = []) => {
  const linkedActors = [];
  for (const linkedActorData of linkedActorsData) {
    linkedActors.push(await Actor.create(linkedActorData));
  }
  actorData.system.actors = linkedActors.map(linkedActor => linkedActor.uuid);

  if (!actor) {
    const newActor = await Actor.create(actorData);
    newActor.sheet.render(true);
  } else {
    await actor.deleteEmbeddedDocuments("Item", [], { deleteAll: true, render: false });
    if (game.user.isGM) {
      for (const existingChildActorUuid of actor.system.actors) {
        const existingChildActor = await fromUuid(existingChildActorUuid);
        await existingChildActor.delete();
      }
    } else {
      ui.notifications.info(game.i18n.localize("MB.RegenerateActorWarning"));
    }
    await actor.update(actorData);
  }
};

const findAllKnightPackByType = (type) => game.packs.filter(pack => pack.title.startsWith("Knight") && pack.documentName === type);

const setEquippedFlagForItems = (items) => items.map(item => ({ ...item, system: { ...item.system, equipped: true } }));

const findObjectsByUuid = async (compendiumCollection) => {
  const objects = [];
  for (const { uuid } of compendiumCollection) {
    objects.push((await fromUuid(uuid)).toObject());
  }
  return objects;
};

export const generateNumber = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

export const generateBiography = (...args) => "<p>" + args.join("</p><p>") + "</p>";

export const generateAttribute = async (formula) => {
  const roll = await evaluateFormula(formula);
  return {
    min: 0,
    max: roll.total,
    value: roll.total
  };
};

export const generateVirtues = async (formula = "d12 + d6") => ({
  virtues: {
    vigour: await generateAttribute(formula),
    clarity: await generateAttribute(formula),
    spirit: await generateAttribute(formula)
  }
});

export const generateGuard = async (formula = "d6") => ({
  guard: (await generateAttribute(formula))
});

export const generateName = async () => drawSystemTableText("Name");

export const generateAge = async () => {
  var ages = Object.values(config.age);
  return {
    age: ages[generateNumber(0, ages.length - 1)]
  };
};

export const generateRank = async () => {
  var ranks = Object.values(config.rank);
  return {
    rank: ranks[generateNumber(0, ranks.length - 1)]
  };
};

export const findItemsFromCoreRollTable = async (rollTable) => (await drawTableItems(config.coreRollTable, rollTable)).map(item => item.toObject(true));

export const findCoreItem = async (itemName) => (await findCompendiumItem(config.coreItems, itemName)).toObject(true);
export const findCoreActor = async (actorName) => (await findCompendiumItem(config.coreActors, actorName)).toObject(true);

export const findRandomCoreItemsFromFolder = async (folderName, amountFormula) => {
  const pack = game.packs.get(config.coreItems);
  const folder = pack.folders.find((folder) => folder.name === folderName && folder.type === "Item");
  const amount = (await evaluateFormula(amountFormula)).total;
  const compendiumItems = Array(amount).fill().map(() => folder.contents[generateNumber(0, folder.contents.length - 1)]);
  return findObjectsByUuid(compendiumItems);
};

export const findRandomCoreTools = async (amountFormula) => findRandomCoreItemsFromFolder("Tools", amountFormula);

export const findRandomCoreWeapons = async (amountFormula) => setEquippedFlagForItems(await findRandomCoreItemsFromFolder("Weapons", amountFormula));

export const findRandomCoreArmours = async (amountFormula) => setEquippedFlagForItems(await findRandomCoreItemsFromFolder("Armours", amountFormula));

export const findRandomKnightType = async (playable = true) => {
  const packs = findAllKnightPackByType("Item");
  const knights = packs.reduce((knights, pack) => {
    let folders = pack.folders.filter(folder => folder.name !== "common");
    if (playable) {
      folders = folders.filter(folder => folder.contents.length);
    }
    return knights.concat(folders.map(folder => folder.name));
  }, []).flat();
  return knights[generateNumber(0, knights.length - 1)];
};

export const findKnightCommonItems = async () => {
  const packs = findAllKnightPackByType("Item");
  const items = packs.reduce((items, pack) => {
    const folders = pack.folders.filter(folder => folder.contents.length && folder.name === "common");
    return items.concat(folders.map(folder => folder.contents));
  }, []).flat();
  return findObjectsByUuid(items);
};

export const findAllActorByKnightType = async (knightType) => {
  const packs = findAllKnightPackByType("Actor");
  const items = packs.reduce((actors, pack) => {
    const folders = pack.folders.filter(folder => folder.name === knightType);
    return actors.concat(folders.map(folder => folder.contents));
  }, []).flat();
  return findObjectsByUuid(items);
};

export const findAllItemByKnightType = async (knightType) => {
  const packs = findAllKnightPackByType("Item");
  const items = packs.reduce((items, pack) => {
    const folders = pack.folders.filter(folder => folder.name === knightType);
    return items.concat(folders.map(folder => folder.contents));
  }, []).flat();
  return setEquippedFlagForItems(await findObjectsByUuid(items));
};

export const findKnightMacro = async (knightType) => {
  const packs = findAllKnightPackByType("Macro");
  const items = packs.reduce((macros, pack) => {
    const folders = pack.folders.filter(folder => folder.name === knightType);
    return macros.concat(folders.map(folder => folder.contents));
  }, []).flat();
  return findObjectsByUuid(items);
};

export const generatePersonality = async () => {
  return game.i18n.format("MB.Biography.Personality", {
    characteristic: (await drawSystemTableText("Characteristic")).toLowerCase(),
    physique: (await drawSystemTableText("APPEARANCE - Physique")).toLowerCase(),
    dress: (await drawSystemTableText("APPEARANCE - Dress")).toLowerCase(),
    tone: (await drawSystemTableText("VOICE - Tone")).toLowerCase(),
    manner: (await drawSystemTableText("VOICE - Manner")).toLowerCase(),
    demeanour: (await drawSystemTableText("PERSONALITY - Demeanour")).toLowerCase(),
    interest: (await drawSystemTableText("PERSONALITY - Interest")).toLowerCase()
  });
};

export const generateCombatDescription = async () => {
  return game.i18n.format("MB.Biography.Warband", {
    style: (await drawSystemTableText("DEPLOYMENT - Style")).toLowerCase(),
    formation: (await drawSystemTableText("DEPLOYMENT - Formation")).toLowerCase(),
    action: (await drawSystemTableText("MANOEUVRES - Action")).toLowerCase(),
    intent: (await drawSystemTableText("MANOEUVRES - Intent")).toLowerCase(),
    plan: (await drawSystemTableText("STRATEGY - Plan")).toLowerCase(),
    twist: (await drawSystemTableText("STRATEGY - Twist")).toLowerCase(),
    dispute: (await drawSystemTableText("CONFLICT - Dispute")).toLowerCase(),
    status: (await drawSystemTableText("CONFLICT - Status")).toLowerCase()
  });
};

export const generateDesire = async () => {
  return game.i18n.format("MB.Biography.Goal", {
    ambition: (await drawSystemTableText("DESIRE - Ambition")).toLowerCase(),
    motive: (await drawSystemTableText("DESIRE - Motive")).toLowerCase()
  });
};

export const generateTask = async () => {
  return game.i18n.format("MB.Biography.Action", {
    action: (await drawSystemTableText("TASK - Action")).toLowerCase(),
    subject: (await drawSystemTableText("TASK - Subject")).toLowerCase()
  });
};

export const generateSoldierType = async () => {
  return game.i18n.format("MB.Biography.Soldier", {
    quality: (await drawSystemTableText("SOLDIER - Quality")),
    type: (await drawSystemTableText("SOLDIER - Type"))
  });
};


export const generateHeraldry = async () => {
  return game.i18n.format("MB.Biography.Heraldry", {
    palette: (await drawSystemTableText("HERALDRY - Palette")),
    symbol: (await drawSystemTableText("HERALDRY - Symbol"))
  });
};

export const generateBattlefield = async () => {
  return game.i18n.format("MB.Biography.Battlefield", {
    feature: (await drawSystemTableText("BATTLEFIELD - Feature")),
    detail: (await drawSystemTableText("BATTLEFIELD - Detail"))
  });
};
