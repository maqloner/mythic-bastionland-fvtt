import { config } from "../config.js";

/**
 * @param {String} packName
 * @param {String} itemName
 * @returns {Promise.<Item|RollTable|undefined>}
 */
export const findPackDocument = async (packName, itemName) => {
  const compendium = game.packs.get(packName);
  if (compendium) {
    const documents = await compendium.getDocuments();
    const document = documents.find((i) => i.name === itemName);
    if (!document) {
      console.warn(`findCompendiumItem: Could not find item (${itemName}) in compendium (${packName})`);
    }
    return document;
  }
  console.warn(`findCompendiumItem: Could not find compendium (${packName})`);
};

/**
 * @param {String} packName
 * @param {String} tableName
 * @param {Object} options
 * @returns {Promise.<RollTableDraw>}
 */
export const drawPackTable = async (packName, tableName, options = {}) => {
  const table = await findPackDocument(packName, tableName);
  return table.draw({ displayChat: false, ...options });
};

/**
 * @param {String} packName
 * @param {String} table
 * @returns {Promise.<String>}
 */
export const drawPackTableText = async (packName, table, options = {}) => (await drawPackTable(packName, table, options)).results[0].getChatText();

/**
 * @param {String} packName
 * @param {String} table
 * @returns {Promise.<Item[]>}
 */
export const drawPackTableDocument = async (packName, table) => {
  const draw = await drawPackTable(packName, table);
  return findPackTableDocuments(draw.results);
};

/**
 * @param {String} packName
 * @param {String} table
 * @param {Number} amount
 * @returns {Promise.<Array.<Item>>}
 */
export const drawPackTableDocuments = async (packName, table, amount = 1) => {
  let results = [];
  for (let i = 0; i < amount; i++) {
    results = results.concat(await drawPackTableDocument(packName, table));
  }
  return results;
};

/**
 * @param {TableResult[]} results
 * @returns {Promise.<Item[]>}
 */
export const findPackTableDocuments = async (results) => {
  const documents = [];
  let document = null;
  for (const result of results) {
    const type = result.type;
    if (type === CONST.TABLE_RESULT_TYPES.COMPENDIUM) {
      document = await findPackDocument(result.documentCollection, result.text);
      if (document) {
        documents.push(document);
      }
    }
  }
  return documents;
};

/**
 * @param {Object} options
 * @returns {Promise.<RollTableDraw>}
 */
export const drawSystemTable = async (name, options = {}) => drawPackTable(config.coreRollTable, name, options);

/**
 * @param {Object} options
 * @returns {Promise.<RollTableDraw>}
 */
export const drawSystemTableText = async (name, options = {}) => drawPackTableText(config.coreRollTable, name, options);

/**
 * @param {Object} options
 * @returns {Promise.<RollTableDraw>}
 */
export const drawScar = async (options = {}) => drawSystemTable("Scars", options);

