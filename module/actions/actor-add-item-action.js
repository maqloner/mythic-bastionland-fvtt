import { showAddItemDialog } from "../applications/dialog/add-item-dialog.js";

/**
 * @param {Actor} actor 
 */
export const actorAddItemAction = async (actor) => {
  const { name, type } = await showAddItemDialog();
  const item = await actor.createEmbeddedDocuments("Item", [{ name, type }]);
  item[0].sheet.render(true);
};
