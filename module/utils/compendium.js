import { config } from "../config.js";

/**
 * @param {String} compendiumName
 * @param {String} itemName
 * @returns {Promise.<Item|RollTable|undefined>}
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
 * @returns {Promise.<Item[]>}
 */
export const drawTableItem = async (compendium, table) => {
  const draw = await drawTable(compendium, table);
  return findTableItems(draw.results);
};

/**
 * @param {String} compendium
 * @param {String} table
 * @param {Number} amount
 * @returns {Promise.<Array.<Item>>}
 */
export const drawTableItems = async (compendium, table, amount = 1) => {
  let results = [];
  for (let i = 0; i < amount; i++) {
    results = results.concat(await drawTableItem(compendium, table));
  }
  return results;
};

/**
 * @param {TableResult[]} results
 * @returns {Promise.<Item[]>}
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

