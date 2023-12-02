import { config } from "../config.js";

/**
 * @param {foundry.abstract.Document} document
 * @param {any} flag
 * @param {any} value
 * @return {Promise<any>}
 */
export const setSystemFlag = async (document, flag, value) => document.setFlag(config.flagScope, flag, value);

/**
 * @param {foundry.abstract.Document} document
 * @param {any} flag
 * @return {any}
 */
export const getSystemFlag = (document, flag) => document.getFlag(config.flagScope, flag);

/**
 * @param {Object} dropData
 * @return {Promise<{actor: Actor, item: Item}>}
 */
export const getInfoFromDropData = async (dropData) => {
  const itemFromUuid = dropData.uuid ? await fromUuid(dropData.uuid) : null;
  const actor = itemFromUuid
    ? itemFromUuid.actor
    : dropData.sceneId
      ? game.scenes.get(dropData.sceneId).tokens.get(dropData.tokenId).actor
      : game.actors.get(dropData.actorId);
  const item = actor ? (itemFromUuid ? itemFromUuid : actor.items.get(dropData.data._id)) : null;
  return { actor, item };
};

/**
 * @param {Object} options
 */
export const configureEditor = (options) => {
  options.relative_urls = true;
  options.toolbar_location = "top";
  options.plugins = "lists table link image save";
  options.toolbar = "formatselect | bold italic underline strikethrough numlist bullist image link save";
  options.menubar = false;
  options.statusbar = false;
  options.content_style =
    "@import url('https://fonts.googleapis.com/css2?family=Alegreya:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600;1,700&display=swap');";
};
