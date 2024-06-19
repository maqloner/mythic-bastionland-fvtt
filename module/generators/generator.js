import { config } from "../config.js";
import { drawSystemTableText, drawPackTableDocuments, findPackDocument } from "../utils/compendium.js";
import { evaluateFormula, randomNumber } from "../utils/utils.js";

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
    age: ages[randomNumber(0, ages.length - 1)]
  };
};

export const generateRank = async () => {
  var ranks = Object.values(config.rank);
  return {
    rank: ranks[randomNumber(0, ranks.length - 1)]
  };
};

export const findRandomCoreItems = async (folderName, amountFormula) => findRandomFolderDocuments(config.coreItems, folderName, amountFormula);

export const findRandomCoreActors = async (folderName, amountFormula) => findRandomFolderDocuments(config.coreActors, folderName, amountFormula);

export const findCoreRollTableItems = async (rollTable) => prepareItems(await drawPackTableDocuments(config.coreRollTable, rollTable), { equipped: true });

export const findCoreItem = async (itemName) => prepareItem(await findPackDocument(config.coreItems, itemName), { equipped: true });

export const findCoreActor = async (actorName) => prepareItem(await findPackDocument(config.coreActors, actorName));

export const findRandomCoreTools = async (amountFormula) => prepareItems(await findRandomCoreItems("Tools", amountFormula));

export const findRandomCoreWeapons = async (amountFormula) => prepareItems(await findRandomCoreItems("Weapons", amountFormula), { equipped: true });

export const findRandomCoreArmours = async (amountFormula) => prepareItems(await findRandomCoreItems("Armours", amountFormula), { equipped: true });

export const findRandomCoreBeasts = async (amountFormula) => prepareItems(await findRandomCoreActors("Beasts", amountFormula));

export const findRandomCorePeople = async (amountFormula) => prepareItems(await findRandomCoreActors("People", amountFormula));

export const findRandomCoreSteeds = async (amountFormula) => prepareItems(await findRandomCoreActors("Steeds", amountFormula));

export const findKnightCommonItems = async () => prepareItems(await findKnightFolderDocuments("Item", "common"));

export const findKnightActors = async (knightType) => prepareItems(await findKnightFolderDocuments("Actor", knightType));

export const findKnightItems = async (knightType) => prepareItems(await findKnightFolderDocuments("Item", knightType), { equipped: true });

export const findRandomKnightType = async (playable = true) => {
  const compendiums = findKnightCompendiums("Item");
  const knights = compendiums
    .reduce((knights, pack) => {
      let folders = pack.folders.filter(folder => folder.name !== "common");
      if (playable) {
        folders = folders.filter(folder => folder.contents.length);
      }
      return knights.concat(folders.map(folder => folder.name));
    }, [])
    .flat();
  return knights[randomNumber(0, knights.length - 1)];
};

export const drawKnightRollTables = async (knightType) => {
  const rollTables = await findKnightFolderDocuments("RollTable", knightType);
  const result = {};
  for (const rollTable of rollTables) {
    result[rollTable.name] = (await rollTable.draw({ displayChat: false })).results[0].getChatText();
  }
  return result;
};

export const generateBiography = async ({ personality = false, desire = false, conflict = false, task = false, heraldry = false, battlefield = false, ailment = false, knight = false }, data = {}) => {
  const generators = [
    [knight, generateKnightBiography, data],
    [personality, generatePersonality],
    [desire, generateDesire],
    [conflict, generateConflict],
    [task, generateTask],
    [heraldry, generateHeraldry],
    [battlefield, generateBattlefield],
    [ailment, generateAilment]
  ];
  const biography = [];
  for (const [enable, generator, ...args] of generators) {
    if (enable) {
      biography.push(await generator(...args));
    }
  }
  return `
    <p>
      ${biography.join("</p><p>")}  
    </p>
  `;
};

export const generateKnightBiography = async ({ item, tables }) => `
  <p>
    <strong>${item.name}</strong><br>
    ${item.system.description.split(". ").join("<br>")}
  </p>
  <p>
    <strong>${item.system.flavor}</strong><br>
    ${item.system.flavorLabel1}: ${tables[item.system.flavorLabel1]}<br>
    ${item.system.flavorLabel2}: ${tables[item.system.flavorLabel2]}  
  </p>
`;

export const generatePersonality = async () => {
  return game.i18n.format("MB.Generator.Personality", {
    characteristic: (await drawSystemTableText("Characteristic")).toLowerCase(),
    physique: (await drawSystemTableText("APPEARANCE - Physique")).toLowerCase(),
    dress: (await drawSystemTableText("APPEARANCE - Dress")).toLowerCase(),
    tone: (await drawSystemTableText("VOICE - Tone")).toLowerCase(),
    manner: (await drawSystemTableText("VOICE - Manner")).toLowerCase(),
    demeanour: (await drawSystemTableText("PERSONALITY - Demeanour")).toLowerCase(),
    interest: (await drawSystemTableText("PERSONALITY - Interest")).toLowerCase()
  });
};

export const generatePerson = async () => {
  return game.i18n.format("MB.Generator.Person", {
    name: await drawSystemTableText("Name"),
    person: await drawSystemTableText("Person"),
    characteristic: (await drawSystemTableText("Characteristic")).toLowerCase(),
    physique: (await drawSystemTableText("APPEARANCE - Physique")).toLowerCase(),
    dress: (await drawSystemTableText("APPEARANCE - Dress")).toLowerCase(),
    tone: (await drawSystemTableText("VOICE - Tone")).toLowerCase(),
    manner: (await drawSystemTableText("VOICE - Manner")).toLowerCase(),
    demeanour: (await drawSystemTableText("PERSONALITY - Demeanour")).toLowerCase(),
    interest: (await drawSystemTableText("PERSONALITY - Interest")).toLowerCase()
  });
};

export const generateConflict = async () => {
  return game.i18n.format("MB.Generator.Conflict", {
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

export const generateHolding = async () => {
  return game.i18n.format("MB.Generator.Holding", {
    holding_style: (await drawSystemTableText("HOLDING - Style")).toLowerCase(),
    holding_feature: (await drawSystemTableText("HOLDING - Feature")).toLowerCase(),
    bailey_style: (await drawSystemTableText("BAILEY - Style")).toLowerCase(),
    bailey_feature: (await drawSystemTableText("BAILEY - Feature")).toLowerCase(),    
    land_character: (await drawSystemTableText("LAND - Character")).toLowerCase(),
    land_landscape: (await drawSystemTableText("LAND - Landscape")).toLowerCase(),
    food_quality: (await drawSystemTableText("FOOD - Quality")).toLowerCase(),
    food_type: (await drawSystemTableText("FOOD - Type")).toLowerCase(),
    good_theme: (await drawSystemTableText("GOODS - Theme")).toLowerCase(),
    good_type: (await drawSystemTableText("GOODS - Type")).toLowerCase(),
    news_subject: (await drawSystemTableText("NEWS - Subject")).toLowerCase(),
    news_mood: (await drawSystemTableText("NEWS - Mood")).toLowerCase()
  });
};

export const generateBeast = async () => {
  return game.i18n.format("MB.Generator.Beast", {
    beast: (await drawSystemTableText("Beast")).toLowerCase(),
    state: (await drawSystemTableText("State")).toLowerCase(),
    land_character: (await drawSystemTableText("LAND - Character")).toLowerCase(),
    land_landscape: (await drawSystemTableText("LAND - Landscape")).toLowerCase(),
    flora_nature: (await drawSystemTableText("FLORA - Nature")).toLowerCase(),
    flora_form: (await drawSystemTableText("FLORA - Form")).toLowerCase()
  });
};

export const generateDesire = async () => {
  return game.i18n.format("MB.Generator.Goal", {
    ambition: (await drawSystemTableText("DESIRE - Ambition")).toLowerCase(),
    motive: (await drawSystemTableText("DESIRE - Motive")).toLowerCase()
  });
};

export const generateTask = async () => {
  return game.i18n.format("MB.Generator.Action", {
    action: (await drawSystemTableText("TASK - Action")).toLowerCase(),
    subject: (await drawSystemTableText("TASK - Subject")).toLowerCase()
  });
};

export const generateSoldierType = async () => {
  return game.i18n.format("MB.Generator.Soldier", {
    quality: (await drawSystemTableText("SOLDIER - Quality")),
    type: (await drawSystemTableText("SOLDIER - Type"))
  });
};

export const generateHeraldry = async () => {
  return game.i18n.format("MB.Generator.Heraldry", {
    palette: (await drawSystemTableText("HERALDRY - Palette")),
    symbol: (await drawSystemTableText("HERALDRY - Symbol"))
  });
};

export const generateBattlefield = async () => {
  return game.i18n.format("MB.Generator.Battlefield", {
    feature: (await drawSystemTableText("BATTLEFIELD - Feature")),
    detail: (await drawSystemTableText("BATTLEFIELD - Detail"))
  });
};

export const generateAilment = async () => {
  return game.i18n.format("MB.Generator.Ailment", {
    descriptor: (await drawSystemTableText("AILMENT - Descriptor")),
    symptom: (await drawSystemTableText("AILMENT - Symptom"))
  });
};

export const generateSkyWeather = async () => {
  return game.i18n.format("MB.Generator.SkyWeather", {
    tone: (await drawSystemTableText("SKY - Tone")).toLowerCase(),
    texture: (await drawSystemTableText("SKY - Texture")).toLowerCase(),
    description: (await drawSystemTableText("WEATHER - Description")).toLowerCase(),
    element: (await drawSystemTableText("WEATHER - Element")).toLowerCase()
  });
};

export const generateLand = async () => {
  return game.i18n.format("MB.Generator.Land", {
    land_character: (await drawSystemTableText("LAND - Character")).toLowerCase(),
    land_landscape: (await drawSystemTableText("LAND - Landscape")).toLowerCase(),
    flora_nature: (await drawSystemTableText("FLORA - Nature")).toLowerCase(),
    flora_form: (await drawSystemTableText("FLORA - Form")).toLowerCase(),
    fauna_nature: (await drawSystemTableText("FAUNA - Nature")).toLowerCase(),
    fauna_form: (await drawSystemTableText("FAUNA - Form")).toLowerCase(),
    feature_nature: (await drawSystemTableText("FEATURE - Nature")).toLowerCase(),
    feature_form: (await drawSystemTableText("FEATURE - Form")).toLowerCase()
  });
};

const prepareItems = (items, system = {}) => {
  return items.map(item => prepareItem(item, system));
};

const prepareItem = (item, system = {}) => {
  return foundry.utils.mergeObject(item.toObject(true), { folder: null, system });
};

const findKnightCompendiums = (type) => game.packs.filter(pack => pack.title.startsWith("Knight") && pack.documentName === type);

const findFolderDocuments = async (packName, folderName) => {
  const packs = game.packs.get(packName);
  const items = packs
    .folders.find(folder => folder.name === folderName)
    .contents.map(item => item.uuid);
  return fromUuids(items);
};

const findRandomFolderDocuments = async (compendiumName, folderName, amountFormula = "1") => {
  const documents = await findFolderDocuments(compendiumName, folderName);
  const amount = (await evaluateFormula(amountFormula)).total;
  return Array(amount).fill().map(() => documents[randomNumber(0, documents.length - 1)]);
};

const findKnightFolderDocuments = (type, folderName) => {
  const packs = findKnightCompendiums(type);
  const documents = packs
    .reduce((documents, pack) => {
      const folders = pack.folders.filter(folder => folder.name === folderName);
      return documents.concat(folders.map(folder => folder.contents));
    }, [])
    .flat()
    .map(item => item.uuid);
  return fromUuids(documents);
};

const fromUuids = async (uuids) => {
  const documents = [];
  for (const uuid of uuids) {
    documents.push((await fromUuid(uuid)));
  }
  return documents;
};
