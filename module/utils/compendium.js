import { config } from "../config.js";

/**
 * @param {String} compendiumString
 * @returns {Array.<String>}
 */
export const compendiumInfoFromString = (compendiumString) => compendiumString.split(";");

/**
 * @param {String} compendiumName
 * @param {String} itemName
 * @returns {Promise.<PBItem|RollTable|undefined>}
 */
export const findCompendiumItem = async (compendiumName, itemName) => {
  const compendium = game.packs.get(compendiumName);
  if (compendium) {
    const documents = await compendium.getDocuments();
    const item = documents.find((i) => i.name === itemName);
    if (!item) {
      console.warn(`findCompendiumItem: Could not find item (${itemName}) in compendium (${compendiumName})`);
    }
    return item;
  }
  console.warn(`findCompendiumItem: Could not find compendium (${compendiumName})`);
};

/**
 * @param {String} compendiumName
 * @param {String} tableName
 * @param {Object} options
 * @returns {Promise.<RollTableDraw>}
 */
export const drawTable = async (compendiumName, tableName, options = {}) => {
  const table = await findCompendiumItem(compendiumName, tableName);
  return table.draw({ displayChat: false, ...options });
};

/**
 * @param {String} compendium
 * @param {String} table
 * @returns {Promise.<String>}
 */
export const drawTableText = async (compendium, table, options = {}) => (await drawTable(compendium, table, options)).results[0].getChatText();

/**
 * @param {String} compendium
 * @param {String} table
 * @returns {Promise.<PBItem[]>}
 */
export const drawTableItem = async (compendium, table) => {
  const draw = await drawTable(compendium, table);
  return findTableItems(draw.results);
};

/**
 * @param {String} compendium
 * @param {String} table
 * @param {Number} amount
 * @returns {Promise.<Array.<PBItem>>}
 */
export const drawTableItems = async (compendium, table, amount = 1) => {
  let results = [];
  for (let i = 0; i < amount; i++) {
    results = results.concat(await drawTableItem(compendium, table));
  }
  return results;
};

/**
 * @param {String} compendium
 * @param {String} table
 * @param {String} formula
 * @returns {Promise.<RollTableDraw>}
 */
export const rollTable = async (compendium, table, formula) => {
  const rollTable = await findCompendiumItem(compendium, table);
  return rollTable.roll({ roll: new Roll(formula) });
};

/**
 * @param {String} compendium
 * @param {String} table
 * @param {String} formula
 * @returns {Promise.<Array.<PBItem>>}
 */
export const rollTableItems = async (compendium, table, formula) => {
  const draw = await rollTable(compendium, table, formula);
  return findTableItems(draw.results);
};

/**
 @param {String} compendiumString
 * @returns {Promise.<PBItem[]>}
 */
export const findItemsFromCompendiumString = async (compendiumString) => {
  const compendiumsItems = compendiumString.split("\n").filter((item) => item);
  const results = [];
  for (const compendiumsItem of compendiumsItems) {
    const [compendium, table] = compendiumInfoFromString(compendiumsItem);
    results.push(await findCompendiumItem(compendium, table));
  }
  return results;
};

/**
 * @param {TableResult[]} results
 * @returns {Promise.<PBItem[]>}
 */
export const findTableItems = async (results) => {
  const items = [];
  let item = null;
  for (const result of results) {
    const type = result.type;
    if (type === CONST.TABLE_RESULT_TYPES.COMPENDIUM) {
      item = await findCompendiumItem(result.documentCollection, result.text);
      if (item) {
        items.push(item);
      }
    }
  }
  return items;
};

/**
 * @param {String} compendiumMacro
 * @param {Object} parameters
 */
/*
export const executeCompendiumMacro = async (compendiumMacro, parameters = {}) => {
  const [compendium, macroName] = compendiumInfoFromString(compendiumMacro ?? "");
  if (compendium && macroName) {
    const macro = await findCompendiumItem(compendium, macroName);
    wait executeMacro(macro, parameters);
  }
};
*/

/**
 * @param {Object} options
 * @returns {Promise.<RollTableDraw>}
 */
export const drawSystemTable = async (name, options = {}) => drawTable(config.coreRollTable, name, options);

/**
 * @param {Object} options
 * @returns {Promise.<RollTableDraw>}
 */
export const drawSystemTableText = async (name, options = {}) => drawTableText(config.coreRollTable, name, options);

/**
 * @param {Object} options
 * @returns {Promise.<RollTableDraw>}
 */
export const drawScar = async (name, options = {}) => drawSystemTable("Scars", options);

